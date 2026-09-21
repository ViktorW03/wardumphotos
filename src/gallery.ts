import { GALLERIES, PROFILE, TEXT } from './content.js';
import type { Photo } from './types.js';

const FULL = 'images/full';
const THUMB = 'images/thumb';

/** Flat list across all galleries — the lightbox steps through this. */
const sequence: Photo[] = [];

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * <picture> with a WebP source and a JPEG fallback. Width and height are always
 * set so the browser reserves the right space before the image arrives.
 */
function picture(photo: Photo, dir: string, eager: boolean): HTMLPictureElement {
  const pic = el('picture');

  const webp = el('source');
  webp.type = 'image/webp';
  webp.srcset = `${dir}/${photo.file}.webp`;
  pic.append(webp);

  const img = el('img');
  img.src = `${dir}/${photo.file}.jpg`;
  img.alt = photo.alt;
  img.width = photo.w;
  img.height = photo.h;
  // Set as attributes rather than properties — `fetchpriority` in particular is
  // not reflected consistently across engines.
  img.setAttribute('decoding', 'async');
  img.setAttribute('loading', eager ? 'eager' : 'lazy');
  if (eager) img.setAttribute('fetchpriority', 'high');
  pic.append(img);

  return pic;
}

function renderProfile(): void {
  const mount = document.querySelector<HTMLElement>('[data-avatar]');
  if (mount) mount.append(picture(PROFILE, THUMB, true));

  const name = document.querySelector<HTMLElement>('[data-name]');
  const tagline = document.querySelector<HTMLElement>('[data-tagline]');
  if (name) name.textContent = TEXT.name;
  if (tagline) tagline.textContent = TEXT.tagline;
}

function renderAbout(): void {
  const mount = document.querySelector<HTMLElement>('[data-about]');
  if (!mount) return;

  // No bio written? Drop the container so it contributes no spacing.
  if (!TEXT.about?.length) {
    mount.remove();
    return;
  }

  for (const line of TEXT.about) {
    const p = el('p');
    p.textContent = line;
    mount.append(p);
  }
}

/**
 * Inline monochrome icons. Drawn with currentColor so they take the surrounding
 * text colour, and marked aria-hidden because the link text already names the
 * destination for screen readers.
 */
const ICONS = {
  instagram:
    '<rect x="2.4" y="2.4" width="19.2" height="19.2" rx="5.4"/>' +
    '<circle cx="12" cy="12" r="4.4"/>' +
    '<circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none"/>',
  email:
    '<rect x="2.4" y="4.6" width="19.2" height="14.8" rx="2.6"/>' +
    '<path d="M3.2 6.6 12 13.2l8.8-6.6"/>',
} as const;

function withIcon(link: HTMLAnchorElement, name: keyof typeof ICONS, label: string): void {
  link.replaceChildren();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[name];

  const text = document.createElement('span');
  text.textContent = label;

  link.append(svg, text);
}

function renderContact(): void {
  const booking = document.querySelector<HTMLElement>('[data-booking]');
  if (booking) {
    if (TEXT.bookingLine) booking.textContent = TEXT.bookingLine;
    else booking.remove();
  }

  const ig = document.querySelector<HTMLAnchorElement>('[data-instagram]');
  if (ig) {
    ig.href = `https://instagram.com/${TEXT.instagram}`;
    withIcon(ig, 'instagram', `@${TEXT.instagram}`);
  }

  const mail = document.querySelector<HTMLAnchorElement>('[data-email]');
  if (mail) {
    mail.href = `mailto:${TEXT.email}`;
    withIcon(mail, 'email', TEXT.email);
  }
}

/** Blank slots shown in a series that has no photos yet. */
const EMPTY_SLOTS = 3;

/**
 * The row of links under the header: each series name above one hand-picked
 * photo from it. They jump to the section; they do not open the lightbox.
 */
function renderIndex(): void {
  const mount = document.querySelector<HTMLElement>('[data-index]');
  if (!mount) return;

  // A single series has nothing to navigate between.
  if (GALLERIES.length < 2) {
    mount.remove();
    return;
  }

  for (const gallery of GALLERIES) {
    const cover = gallery.photos.find((p) => p.file === gallery.cover) ?? gallery.photos[0];

    const link = el('a', 'series-index__link');
    link.href = `#${gallery.id}`;

    const label = el('span', 'series-index__label');
    label.textContent = gallery.title;

    // Decorative: the label already names where the link goes. No photos yet
    // means a blank block of the same size.
    const thumb = cover ? picture({ ...cover, alt: '' }, THUMB, false) : el('span', 'blank');
    link.append(label, thumb);
    mount.append(link);
  }
}

function renderGalleries(): void {
  const mount = document.querySelector<HTMLElement>('[data-galleries]');
  if (!mount) return;

  for (const gallery of GALLERIES) {
    const section = el('section', 'gallery');
    section.id = gallery.id;

    const head = el('div', 'gallery__head');
    const h = el('h2', 'gallery__title');
    h.textContent = gallery.title;
    head.append(h);
    if (gallery.year) {
      const year = el('span', 'gallery__year');
      year.textContent = gallery.year;
      head.append(year);
    }
    section.append(head);

    const grid = el('div', 'grid');
    for (const photo of gallery.photos) {
      const index = sequence.push(photo) - 1;

      const button = el('button', 'tile');
      button.type = 'button';
      button.setAttribute('aria-label', `Enlarge: ${photo.alt}`);
      button.dataset['index'] = String(index);
      button.append(picture(photo, THUMB, false));

      grid.append(button);
    }

    // Nothing to show yet: hold the space with blank slots, hidden from screen
    // readers, until photos are added.
    if (gallery.photos.length === 0) {
      for (let i = 0; i < EMPTY_SLOTS; i++) {
        const slot = el('div', 'blank');
        slot.setAttribute('aria-hidden', 'true');
        grid.append(slot);
      }
    }

    section.append(grid);
    mount.append(section);
  }
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

class Lightbox {
  private readonly root: HTMLElement;
  private readonly stage: HTMLElement;
  private readonly counter: HTMLElement;
  private current = -1;
  private lastFocused: HTMLElement | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.stage = root.querySelector<HTMLElement>('[data-stage]') ?? root;
    this.counter = root.querySelector<HTMLElement>('[data-counter]') ?? root;

    root.querySelector('[data-close]')?.addEventListener('click', () => this.close());
    root.querySelector('[data-prev]')?.addEventListener('click', () => this.step(-1));
    root.querySelector('[data-next]')?.addEventListener('click', () => this.step(1));

    // Clicking the backdrop (but not the image itself) dismisses.
    root.addEventListener('click', (event) => {
      if (event.target === root || event.target === this.stage) this.close();
    });

    document.addEventListener('keydown', (event) => {
      if (!this.isOpen) return;
      if (event.key === 'Escape') this.close();
      else if (event.key === 'ArrowLeft') this.step(-1);
      else if (event.key === 'ArrowRight') this.step(1);
    });

    this.bindSwipe();
  }

  private get isOpen(): boolean {
    return this.root.hasAttribute('open');
  }

  private bindSwipe(): void {
    let startX = 0;
    let startY = 0;

    this.root.addEventListener(
      'touchstart',
      (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        startX = touch.clientX;
        startY = touch.clientY;
      },
      { passive: true },
    );

    this.root.addEventListener(
      'touchend',
      (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        // Horizontal intent only, and far enough to be deliberate.
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          this.step(dx < 0 ? 1 : -1);
        }
      },
      { passive: true },
    );
  }

  open(index: number): void {
    this.lastFocused = document.activeElement as HTMLElement | null;
    this.root.setAttribute('open', '');
    document.body.classList.add('is-locked');
    this.show(index);
    this.root.querySelector<HTMLButtonElement>('[data-close]')?.focus();
  }

  close(): void {
    this.root.removeAttribute('open');
    document.body.classList.remove('is-locked');
    this.stage.replaceChildren();
    this.lastFocused?.focus();
  }

  private step(delta: number): void {
    if (sequence.length === 0) return;
    this.show((this.current + delta + sequence.length) % sequence.length);
  }

  private show(index: number): void {
    const photo = sequence[index];
    if (!photo) return;

    this.current = index;
    this.stage.replaceChildren(picture(photo, FULL, true));
    this.counter.textContent = `${index + 1} / ${sequence.length}`;
    this.preloadNeighbours(index);
  }

  /** Fetch the adjacent frames so arrowing through feels instant. */
  private preloadNeighbours(index: number): void {
    for (const offset of [-1, 1]) {
      const neighbour = sequence[(index + offset + sequence.length) % sequence.length];
      if (neighbour) new Image().src = `${FULL}/${neighbour.file}.webp`;
    }
  }
}

function init(): void {
  renderProfile();
  renderAbout();
  renderContact();
  renderIndex();
  renderGalleries();

  const root = document.querySelector<HTMLElement>('[data-lightbox]');
  if (!root) return;
  const lightbox = new Lightbox(root);

  document.querySelector('[data-galleries]')?.addEventListener('click', (event) => {
    const tile = (event.target as HTMLElement).closest<HTMLElement>('.tile');
    const index = tile?.dataset['index'];
    if (index !== undefined) lightbox.open(Number(index));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

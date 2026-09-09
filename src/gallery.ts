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

/** Grids that need re-justifying when the window changes width. */
const layouts: { grid: HTMLElement; tiles: { photo: Photo; el: HTMLElement }[] }[] = [];

/** Below this width the grid becomes a single full-width column. */
const SINGLE_COLUMN_BELOW = 640;

/**
 * Justified rows, the layout photo sites use: greedily fill a row until scaling
 * it to the container width would make it shorter than the target height, then
 * commit it. Every photo in a row ends up the same height, and the row fills the
 * width exactly — so nothing is cropped and no gaps are left over.
 */
function justify(grid: HTMLElement, tiles: { photo: Photo; el: HTMLElement }[]): void {
  const width = grid.clientWidth;
  if (width === 0 || tiles.length === 0) return; // not laid out yet (or jsdom)

  const gap = parseFloat(getComputedStyle(grid).getPropertyValue('gap')) || 16;
  const single = width < SINGLE_COLUMN_BELOW;
  grid.classList.toggle('grid--single', single);

  if (single) {
    for (const { el } of tiles) {
      el.style.width = '';
      el.style.height = '';
    }
    grid.replaceChildren(...tiles.map((t) => t.el));
    return;
  }

  const target = width < 900 ? 260 : 300;
  const rows: { photo: Photo; el: HTMLElement }[][] = [];
  let row: { photo: Photo; el: HTMLElement }[] = [];
  let aspectSum = 0;

  for (const tile of tiles) {
    row.push(tile);
    aspectSum += tile.photo.w / tile.photo.h;

    // Height this row would take if stretched to fill the container.
    const height = (width - gap * (row.length - 1)) / aspectSum;
    if (height <= target) {
      rows.push(row);
      row = [];
      aspectSum = 0;
    }
  }
  if (row.length) rows.push(row);

  const fragment = document.createDocumentFragment();
  for (const [index, items] of rows.entries()) {
    const sum = items.reduce((n, t) => n + t.photo.w / t.photo.h, 0);
    const available = width - gap * (items.length - 1);
    // A trailing partial row is left at the target height rather than blown up
    // to fill the width, which would make one or two photos enormous.
    const height = index === rows.length - 1 ? Math.min(target, available / sum) : available / sum;

    const rowEl = el('div', 'grid__row');
    for (const { photo, el: tile } of items) {
      tile.style.width = `${(height * photo.w) / photo.h}px`;
      tile.style.height = `${height}px`;
      rowEl.append(tile);
    }
    fragment.append(rowEl);
  }

  grid.replaceChildren(fragment);
}

function layoutAll(): void {
  for (const { grid, tiles } of layouts) justify(grid, tiles);
}

function renderGalleries(): void {
  const mount = document.querySelector<HTMLElement>('[data-galleries]');
  if (!mount) return;

  const populated = GALLERIES.filter((g) => g.photos.length > 0);
  // A single gallery needs no heading to distinguish it from anything else.
  const showTitles = populated.length > 1;

  for (const gallery of populated) {
    const section = el('section', 'gallery');
    section.id = gallery.id;

    if (showTitles) {
      const h = el('h2', 'gallery__title');
      h.textContent = gallery.title;
      section.append(h);
    }

    const grid = el('div', 'grid');
    const tiles: { photo: Photo; el: HTMLElement }[] = [];

    for (const photo of gallery.photos) {
      const index = sequence.push(photo) - 1;

      const button = el('button', 'tile');
      button.type = 'button';
      button.setAttribute('aria-label', `Enlarge: ${photo.alt}`);
      button.dataset['index'] = String(index);
      button.append(picture(photo, THUMB, false));

      grid.append(button);
      tiles.push({ photo, el: button });
    }

    layouts.push({ grid, tiles });
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
  renderGalleries();
  layoutAll();

  // Row composition depends on the container width, so it has to be redone when
  // that changes. rAF-throttled to stay smooth while dragging a window edge.
  let pending = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(layoutAll);
  });


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

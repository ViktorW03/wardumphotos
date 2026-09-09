// Headless smoke test: loads index.html, runs the compiled gallery script, and
// asserts the page actually built itself. Run with `npm test`.
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const root = new URL('..', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');

const dom = new JSDOM(html, { url: 'http://localhost:8080/', pretendToBeVisual: true });
const { window } = dom;
global.window = window;
global.document = window.document;
global.Image = window.Image;

// The compiled module is plain ES2020 with no imports of its own beyond siblings.
await import(new URL('js/gallery.js', root).href);
window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

// Assert against the real config rather than hardcoded copy, so editing
// content.ts never breaks the tests.
const { TEXT, GALLERIES } = await import(new URL('js/content.js', root).href);
const expectedPhotos = GALLERIES.reduce((n, g) => n + g.photos.length, 0);

const { document } = window;
const fail = [];
const check = (label, cond, detail = '') => {
  if (cond) console.log(`  ok    ${label}${detail ? ` — ${detail}` : ''}`);
  else {
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
    fail.push(label);
  }
};

console.log('\nrender');
const tiles = document.querySelectorAll('.tile');
check('gallery tiles rendered', tiles.length === expectedPhotos, `${tiles.length} tiles`);
check('profile picture injected', !!document.querySelector('.profile__avatar img'));
check('name filled in', document.querySelector('[data-name]')?.textContent === TEXT.name, TEXT.name);
check('tagline filled in', document.querySelector('[data-tagline]')?.textContent === TEXT.tagline);
check(
  'bio matches config',
  TEXT.about?.length
    ? document.querySelectorAll('[data-about] p').length === TEXT.about.length
    : !document.querySelector('[data-about]'),
  TEXT.about?.length ? `${TEXT.about.length} paragraphs` : 'omitted, block removed',
);
check(
  'booking line matches config',
  TEXT.bookingLine
    ? document.querySelector('[data-booking]')?.textContent === TEXT.bookingLine
    : !document.querySelector('[data-booking]'),
  TEXT.bookingLine ? 'set' : 'omitted, line removed',
);

console.log('\nempty portraits gallery');
check('no portraits section', !document.querySelector('#portraits'));
check('no heading while only one gallery has photos', document.querySelectorAll('.gallery__title').length === 0);

console.log('\nimage markup');
const imgs = [...document.querySelectorAll('.tile img')];
check('every tile has alt text', imgs.every((i) => i.getAttribute('alt')?.trim()));
check('every tile has width+height', imgs.every((i) => i.getAttribute('width') && i.getAttribute('height')));
check('gallery images lazy-load', imgs.every((i) => i.getAttribute('loading') === 'lazy'));
check('avatar loads eagerly', document.querySelector('.profile__avatar img')?.getAttribute('loading') === 'eager');
check('webp source before jpeg fallback', [...document.querySelectorAll('.tile picture')].every((p) => p.querySelector('source')?.type === 'image/webp'));

console.log('\nlinks');
const ig = document.querySelector('[data-instagram]');
const mail = document.querySelector('[data-email]');
check('instagram href', ig?.href?.startsWith('https://instagram.com/'), ig?.href);
check('mailto href', mail?.href?.startsWith('mailto:'), mail?.href);

console.log('\nlightbox');
const lb = document.querySelector('[data-lightbox]');
check('starts closed', !lb.hasAttribute('open'));
tiles[3].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
check('opens on tile click', lb.hasAttribute('open'));
check('shows full-size image', lb.querySelector('[data-stage] img')?.src.includes('/full/'));
check('counter reflects position', lb.querySelector('[data-counter]')?.textContent === `4 / ${expectedPhotos}`, lb.querySelector('[data-counter]')?.textContent);

document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
check('arrow key advances', lb.querySelector('[data-counter]')?.textContent === `5 / ${expectedPhotos}`);

// Wrap backwards from the first frame to confirm the modulo maths holds.
for (let i = 0; i < 5; i++) document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
check('wraps past the start', lb.querySelector('[data-counter]')?.textContent === `${expectedPhotos} / ${expectedPhotos}`, lb.querySelector('[data-counter]')?.textContent);

document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
check('escape closes', !lb.hasAttribute('open'));
check('body unlocked after close', !document.body.classList.contains('is-locked'));

console.log(fail.length ? `\n${fail.length} failing\n` : '\nall passing\n');
process.exit(fail.length ? 1 : 0);

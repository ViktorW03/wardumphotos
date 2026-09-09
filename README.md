# wardumphotos.is

Static photo site. No framework, no backend. TypeScript compiles to plain ES modules.

## Layout

```
originals/          full-res camera files (never served, never modified)
images/full         2000px derivatives — used in the lightbox
images/thumb        900px derivatives — used in the grid
src/content.ts      ← photos, order, and all site copy
src/gallery.ts      rendering + lightbox
js/                 compiled output — this is what the browser loads
```

## Commands

| | |
|---|---|
| `npm run build` | compile TypeScript |
| `npm run watch` | recompile on every save |
| `npm run serve` | preview at http://localhost:8080 |
| `npm test` | headless checks against the rendered page |
| `./build-images.sh` | regenerate `images/` from `originals/` |

## Reordering photos

Open `src/content.ts`. The gallery is a list, and **list order is display order** —
move a line up to move a photo earlier:

```ts
photos: [
  { file: 'DSC00118', w: 2000, h: 1337, alt: 'Four people walking a tree-lined path' },
  { file: 'DSC00582', w: 1337, h: 2000, alt: 'The glass dome of a conservatory' },
  ...
]
```

Then `npm run build` and refresh.

The grid fills left to right, so the order in the file is the order on screen:

```
 ┌─────┐ ┌─────┐ ┌─────┐
 │  1  │ │  2  │ │  3  │
 └─────┘ └─────┘ └─────┘
 ┌─────┐ ┌─────┐ ┌─────┐
 │  4  │ │  5  │ │  6  │
 └─────┘ └─────┘ └─────┘
```

Three columns on desktop, two on tablets, one on phones. The lightbox steps
through in the same order.

**Thumbnails are cropped.** Rows only line up if every tile is the same shape, so
grid thumbnails are cropped to `--tile-ratio` in `styles.css` — square by
default. Change it there to reshape every tile at once:

```css
--tile-ratio: 1;     /* square */
--tile-ratio: 3/2;   /* wide */
--tile-ratio: 4/5;   /* tall */
```

Cropping only affects the grid. The lightbox always shows the full uncropped
frame.

## Adding photos

1. Copy the full-res file into `originals/`. Any `.jpg` or `.jpeg` works — the
   filename becomes the identifier, so avoid spaces.

2. Regenerate the derivatives:

   ```
   ./build-images.sh
   ```

   This rebuilds everything from scratch and writes `entries.txt` with a
   paste-ready line per photo, dimensions already filled in.

3. Find your new photo's line in `entries.txt`:

   ```ts
   { file: 'DSC00614', w: 1337, h: 2000, alt: '' },
   ```

4. Paste it into the `photos` array in `src/content.ts`, at the position you want
   it to appear, and **write the alt text**. Describe what's in the frame, not
   that it's a photo:

   ```ts
   { file: 'DSC00614', w: 1337, h: 2000, alt: 'A woman leaning against a painted wall in late afternoon light' },
   ```

   Alt text never appears on screen. It's what screen readers announce and what
   Google indexes — an empty one is a dead spot in both.

5. Build and check:

   ```
   npm run build && npm test
   ```

## Removing a photo

Delete its line from `src/content.ts` and `npm run build`. The file stays in
`originals/` and `images/` — nothing is destroyed, it just stops being shown.

## Adding the portraits section

`src/content.ts` already has an empty `portraits` gallery. It renders **nothing**
while empty — no heading, no placeholder, no hint that it exists.

Add entries to it the same way as above. Both sections then get their headings
automatically:

```ts
{
  id: 'portraits',
  title: 'Portraits',
  photos: [
    { file: 'DSC00614', w: 1337, h: 2000, alt: '...' },
  ],
},
```

Get permission from anyone recognisable before publishing their photo.

## Changing the hero

Edit the `HERO` block in `src/content.ts`, then update the two hardcoded
references in `index.html` — the `<link rel="preload">` and the `og:image` meta
tag. Both need the filename spelled out in the HTML to work, so they can't read
from `content.ts`.

## Site copy

Name, tagline, about text, booking line, Instagram handle, and email all live in
the `TEXT` block at the top of `src/content.ts`.

`about` and `bookingLine` are optional. Leave either out and its block is removed
from the page entirely — no empty element, no leftover spacing. Add it back any
time and it reappears:

```ts
export const TEXT: SiteText = {
  name: 'Viktor Wardum',
  tagline: 'Photography — Reykjavik',
  instagram: 'wardumphotos',
  email: 'viktorwardum@gmail.com',
  // about: ['One or two sentences.', 'Based in Reykjavik.'],
  // bookingLine: 'Currently taking on a limited number of shoots.',
};
```

## Deploying

Only these need to reach the Pi:

```
index.html  styles.css  js/  images/
```

Not `originals/` (369 MB), not `node_modules/`, not `src/`.

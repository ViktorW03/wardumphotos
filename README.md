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

## Series

The page is split into series — San Francisco, Alcatraz, Stanford-Palo Alto,
Reykjavik — each its own section, with a row of links under your name that
jump to them. They all live in `GALLERIES` in `src/content.ts`:

```ts
{
  id: 'alcatraz',          // the #anchor the index links to
  title: 'Alcatraz',       // heading and index label
  year: '2026',            // right-hand side of the heading
  cover: 'DSC01423',       // photo shown in the index link (defaults to the first)
  photos: [
    { file: 'DSC01423', w: 1333, h: 2000, alt: 'A weathered concrete lighthouse…' },
    ...
  ],
},
```

**List order is display order**, for series and for photos within them. Move a
line up to move a photo earlier. The lightbox steps through every series top to
bottom in the same order.

A series with no photos yet (Reykjavik) shows blank grey slots until you add
some. To add a new series, copy a block and give it a new `id` and `title`.

Photos keep their own shape in the grid — nothing is cropped. The grid is one
column on phones and three to four on desktop; tiles in a row share a bottom
edge.

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

4. Paste it into the right series' `photos` array in `src/content.ts`, at the position you want
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

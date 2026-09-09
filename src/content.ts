import type { Gallery, Photo, SiteText } from './types.js';

// ---------------------------------------------------------------------------
// Everything you'll want to change day to day lives in this file.
// After editing, run:  npm run build
// ---------------------------------------------------------------------------

export const TEXT: SiteText = {
  name: 'Viktor Wardum',
  tagline: 'Photography — Reykjavik',
  instagram: 'wardumphotos',
  email: 'viktorwardum@gmail.com',
};

// The picture of you above the gallery. Shown small and uncropped, at whatever
// aspect ratio the photo already has — it is not squared off or masked.
// Any file in images/thumb works; swap the name and dimensions to change it.
//
// If you change this, also update the og:image meta tag in index.html — it has
// to be spelled out in the HTML to drive link previews.
export const PROFILE: Photo = {
  file: 'DSC00233',
  w: 601,
  h: 900,
  alt: 'Viktor Wardum holding a camera',
};

export const GALLERIES: readonly Gallery[] = [
  {
    id: 'work',
    title: 'General work',
    photos: [
      { file: 'DSC00211', w: 1337, h: 2000, alt: 'A corner storefront with wraparound windows and potted plants' },
      { file: 'DSC00236', w: 2000, h: 1337, alt: 'A row of painted Victorian houses in yellow and blue' },
      { file: 'DSC00238', w: 2000, h: 1337, alt: 'A large Aztec calendar relief mounted on the side of a college building' },
      { file: 'DSC00219', w: 2000, h: 1337, alt: 'A modern white apartment building against a deep blue sky' },
      { file: 'DSC00259', w: 1337, h: 2000, alt: 'A taqueria on a street corner below a white Victorian bay window' },
      { file: 'DSC00209', w: 1337, h: 2000, alt: 'A red fire engine crossing a downtown intersection' },
      { file: 'DSC00575', w: 1337, h: 2000, alt: 'A mural painted across the flank of an apartment block' },
      { file: 'DSC00600', w: 1337, h: 2000, alt: 'Dagur og Julia Golden Gate' },
      { file: 'DSC00118', w: 2000, h: 1337, alt: 'Four people walking a tree-lined path on a sunlit afternoon' },
      { file: 'DSC00582', w: 1337, h: 2000, alt: 'The glass dome of a Victorian conservatory against an open sky' },
      { file: 'DSC00179', w: 2000, h: 1337, alt: 'The facade of a train station beneath a clear sky' },
      { file: 'DSC01423', w: 1333, h: 2000, alt: 'A weathered concrete lighthouse with a seagull in flight' },
      { file: 'DSC01315', w: 1333, h: 2000, alt: 'Grated skylights above the dark interior of a prison cellblock' },
      { file: 'DSC01317', w: 2000, h: 1333, alt: 'Pencil portraits and drawings displayed on a workshop shelf' },
      { file: 'DSC01321', w: 2000, h: 1333, alt: 'A prison cell with a ceramic sink, peeling green paint, and a metal table' },
      { file: 'DSC01326', w: 1333, h: 2000, alt: 'Decaying prison walkways and railings beside rows of barred cells' },
      { file: 'DSC01345', w: 2000, h: 1333, alt: 'A seagull resting on a crumbling concrete wall' },
      { file: 'DSC01370', w: 1333, h: 2000, alt: 'A seagull standing beside an old white door and water tap' },
      { file: 'DSC01391', w: 1333, h: 2000, alt: 'A water tower with red graffiti and a seagull flying overhead' },
      { file: 'DSC01479', w: 2000, h: 1333, alt: 'Two young men in Stanford sweatshirts walking through a prison cellblock' },


    ],
  },
];

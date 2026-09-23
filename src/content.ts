import type { Gallery, Photo, SiteText } from './types.js';

// ---------------------------------------------------------------------------
// Everything you'll want to change day to day lives in this file.
// After editing, run:  npm run build
// ---------------------------------------------------------------------------

export const TEXT: SiteText = {
  name: 'Viktor Wardum',
  tagline: 'Photography - Reykjavik',
  instagram: 'wardumphotos',
  email: 'viktor@wardumphotos.is',
};

// The picture of you above the gallery. Shown small and uncropped, at whatever
// aspect ratio the photo already has - it is not squared off or masked.
// Any file in images/thumb works; swap the name and dimensions to change it.
//
// If you change this, also update the og:image meta tag in index.html - it has
// to be spelled out in the HTML to drive link previews.
export const PROFILE: Photo = {
  file: 'DSC00233',
  w: 601,
  h: 900,
  alt: 'Viktor Wardum holding a camera',
};

// Each series is one section on the page, in this order, with a matching link
// in the index under your name. Photos are listed in display order; the
// lightbox steps through every series top to bottom.
//
//   cover  - the photo shown in the index link. Leave it out to use the first.
//   year   - shown on the right of the section heading.
//
// A series with no photos yet shows blank grey slots in their place.
export const GALLERIES: readonly Gallery[] = [
  {
    id: 'san-francisco',
    title: 'San Francisco',
    year: '2026',
    cover: 'DSC00211-v2',
    photos: [
      { file: 'DSC00211-v2', w: 1333, h: 2000, alt: 'A corner storefront with wraparound windows and potted plants' },
      { file: 'DSC00236', w: 2000, h: 1337, alt: 'A row of painted Victorian houses in yellow and blue' },
      { file: 'DSC00259-v2', w: 1333, h: 2000, alt: 'A taqueria on a street corner below a white Victorian bay window' },
      { file: 'DSC00267', w: 1333, h: 2000, alt: 'A narrow alley lined with painted murals under a clear sky' },
      { file: 'DSC00582', w: 1337, h: 2000, alt: 'The glass dome of a Victorian conservatory against an open sky' },
      { file: 'DSC00575', w: 1337, h: 2000, alt: 'A mural painted across the flank of an apartment block' },
      { file: 'DSC00209', w: 1337, h: 2000, alt: 'A red fire engine crossing a downtown intersection' },
      { file: 'DSC00238', w: 2000, h: 1337, alt: 'A large Aztec calendar relief mounted on the side of a college building' },
      { file: 'DSC00600', w: 1337, h: 2000, alt: 'Dagur og Julia Golden Gate' },
      { file: 'DSC00219', w: 2000, h: 1337, alt: 'A modern white apartment building against a deep blue sky' },
    ],
  },
  {
    id: 'alcatraz',
    title: 'Alcatraz',
    year: '2026',
    cover: 'DSC01423',
    photos: [
      { file: 'DSC01423', w: 1333, h: 2000, alt: 'A weathered concrete lighthouse with a seagull in flight' },
      { file: 'DSC01326', w: 1333, h: 2000, alt: 'Decaying prison walkways and railings beside rows of barred cells' },
      { file: 'DSC01317', w: 2000, h: 1333, alt: 'Pencil portraits and drawings displayed on a workshop shelf' },
      { file: 'DSC01321', w: 2000, h: 1333, alt: 'A prison cell with a ceramic sink, peeling green paint, and a metal table' },
      { file: 'DSC01345', w: 2000, h: 1333, alt: 'A seagull resting on a crumbling concrete wall' },
      { file: 'DSC01391', w: 1333, h: 2000, alt: 'A water tower with red graffiti and a seagull flying overhead' },
      { file: 'DSC01315', w: 1333, h: 2000, alt: 'Grated skylights above the dark interior of a prison cellblock' },
      { file: 'DSC01370', w: 1333, h: 2000, alt: 'A seagull standing beside an old white door and water tap' },
      { file: 'DSC01479', w: 2000, h: 1333, alt: 'Two young men in Stanford sweatshirts walking through a prison cellblock' },
    ],
  },
  {
    id: 'stanford-palo-alto',
    title: 'Stanford-Palo Alto',
    year: '2026',
    cover: 'DSC00626',
    photos: [
      { file: 'DSC00118', w: 2000, h: 1337, alt: 'Four people walking a tree-lined path on a sunlit afternoon' },
      { file: 'DSC00179', w: 2000, h: 1337, alt: 'The facade of a train station beneath a clear sky' },
      { file: 'DSC00626', w: 1333, h: 2000, alt: 'A sunlit courtyard with flower pots and a stone path between Spanish-style houses' },
      { file: 'DSC00654', w: 1333, h: 2000, alt: 'A cream building with a red overhanging roof above a vine-covered pergola' },
      { file: 'DSC00784', w: 1333, h: 2000, alt: 'A woman photographing distant hills through tall iron bars' },
      { file: 'DSC00807', w: 1333, h: 2000, alt: 'A stepped stone tower seen through an iron gate with rings against a blue sky' },
      { file: 'DSC00993', w: 1333, h: 2000, alt: 'A woman standing in a sandstone courtyard beneath a gold mosaic church facade' },
      { file: 'DSC00995', w: 1333, h: 2000, alt: 'A couple crossing a sandstone courtyard with arcades and tall palm trees' },
      { file: 'DSC01020', w: 1333, h: 2000, alt: 'A girl in a white dress holding the hand of a bronze statue under stone arches' },
      { file: 'DSC01025', w: 2000, h: 1333, alt: 'A boy in sunglasses mimicking the outstretched arms of a bronze statue' },
      { file: 'DSC01032', w: 1333, h: 2000, alt: 'A bronze figure clutching his head beneath a sandstone arch' },
      { file: 'DSC01044', w: 1333, h: 2000, alt: 'An old clock mechanism seen through a tall window in a yellow wall' },
      { file: 'DSC01049', w: 2000, h: 1333, alt: 'Close-up of green iron and brass gears in an old clock mechanism' },
      { file: 'DSC01243', w: 2000, h: 1333, alt: 'Five friends in suits laughing at night while holding one of them sideways' },
    ],
  },
  {
    id: 'reykjavik',
    title: 'Reykjavik',
    year: '2026',
    photos: [
      { file: 'DSC01806', w: 1333, h: 2000, alt: 'Grey concrete houses on a wet street under an overcast sky' },
    ],
  },
];

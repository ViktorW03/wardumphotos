/** A single image, present as both WebP and JPEG in images/full and images/thumb. */
export interface Photo {
  /** Filename without extension, e.g. "DSC00159". */
  readonly file: string;
  /** Intrinsic size of the full-size derivative, used to reserve layout space. */
  readonly w: number;
  readonly h: number;
  /**
   * Screen-reader and search-engine description. Never rendered visually.
   * Describe what is in the frame, not that it is a photo.
   */
  readonly alt: string;
}

export interface Gallery {
  readonly id: string;
  /** Heading text. Only shown when more than one gallery has photos in it. */
  readonly title: string;
  readonly photos: readonly Photo[];
}

export interface SiteText {
  readonly name: string;
  readonly tagline: string;
  readonly instagram: string;
  readonly email: string;
  /** Optional. Omit or leave empty and the bio block is not rendered at all. */
  readonly about?: readonly string[];
  /** Optional. Omit and the booking line above the contact links disappears. */
  readonly bookingLine?: string;
}

/**
 * Photography from Unsplash, served from their CDN.
 * The Unsplash License allows free use, including commercially, without attribution.
 * Sizes are requested per use so the browser never downloads more than it needs.
 */
const base = (id: string, w: number, q = 70) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const IMAGES = {
  /** Library interior with a spiral staircase — landing hero. */
  hero: base("photo-1759732547241-8ec6f4077631", 1920, 75),
  /** Wooden ladder against tall antique shelves — closing call to action. */
  cta: base("photo-1535905557558-afc4877a26fc", 1600),
  /** Books on a brown wooden shelf — about page header. */
  about: base("photo-1524995997946-a1c2e315a42f", 1600),
  /** Open books on a table — library page header. */
  library: base("photo-1495446815901-a7297e633e8d", 1600),
};

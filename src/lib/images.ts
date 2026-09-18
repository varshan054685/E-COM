/**
 * Placeholder imagery.
 *
 * Until the boutique's own catalogue photography is ready, we use curated
 * Unsplash photographs to establish the visual language. Every id below is a
 * verified public image — swap these for real product shots by replacing the
 * `images` array on each product in `catalog.ts`.
 */

export function unsplash(id: string, w = 1200, q = 80): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export const IMG = {
  hero: unsplash('1524504388940-b1c1722653e1', 1920),
  heroAlt: unsplash('1496747611176-843222e1e57c', 1200),
  craft: unsplash('1509631179647-0177331693ae', 1200),
  craftDetail: unsplash('1441986300917-64674bd600d8', 1200),
  atelier: unsplash('1445205170230-053b83016050', 1600),
  about: unsplash('1441984904996-e0b6ba687e04', 1600),
  contact: unsplash('1556905055-8f358a7a47b2', 1600),
  banner: unsplash('1469334031218-e382a71b716b', 1920),
  customCouture: unsplash('1515886657613-9f3515b0c78f', 1400),
  kids: unsplash('1544005313-94ddf0286df2', 1400),
  fabric: unsplash('1508214751196-bcfd4ca60f91', 1400),
  detail: unsplash('1489980557514-251d61e3eeb6', 1200),
  studio: unsplash('1483985988355-763728e1935b', 1200),
  editorial: unsplash('1539109136881-3be0616acf4b', 1200),
  gallery: [
    unsplash('1529139574466-a303027c1d8b', 700),
    unsplash('1617127365659-c47fa864d8bc', 700),
    unsplash('1517841905240-472988babdf9', 700),
    unsplash('1556909114-f6e7ad7d3136', 700),
    unsplash('1490481651871-ab68de25d43d', 700),
    unsplash('1590959651373-a3db0f38a961', 700),
  ],
} as const;

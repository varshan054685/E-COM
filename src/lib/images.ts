export function unsplash(id: string, w: number = 1200, q: number = 80): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

// Replaceable image pool used as placeholders until the boutique's real
// catalogue photography is available. All URLs point to verified public images.
export const IMG = {
  hero: unsplash('1524504388940-b1c1722653e1', 1920),
  aariStory: unsplash('1445205170230-053b83016050', 1400),
  aariClose: unsplash('1441986300917-64674bd600d8', 1000),
  craft1: unsplash('1509631179647-0177331693ae', 1000),
  craft2: unsplash('1496747611176-843222e1e57c', 1000),
  craft3: unsplash('1489980557514-251d61e3eeb6', 1000),
  about: unsplash('1441984904996-e0b6ba687e04', 1600),
  contact: unsplash('1556905055-8f358a7a47b2', 1400),
  banner: unsplash('1469334031218-e382a71b716b', 1920),
  gallery: [
    unsplash('1529139574466-a303027c1d8b', 700),
    unsplash('1483985988355-763728e1935b', 700),
    unsplash('1544005313-94ddf0286df2', 700),
    unsplash('1517841905240-472988babdf9', 700),
    unsplash('1617127365659-c47fa864d8bc', 700),
    unsplash('1556909114-f6e7ad7d3136', 700),
  ],
} as const;

export const COLLECTION_IMAGES: Record<string, string> = {
  'aari-couture': unsplash('1490481651871-ab68de25d43d', 1200),
  'designer-blouses': unsplash('1469334031218-e382a71b716b', 1200),
  bridal: unsplash('1539109136881-3be0616acf4b', 1200),
  sarees: unsplash('1515886657613-9f3515b0c78f', 1200),
  'custom-couture': unsplash('1508214751196-bcfd4ca60f91', 1200),
};

export const PRODUCT_IMAGES: Record<string, string[]> = {
  'royal-peacock-aari-blouse': [
    unsplash('1496747611176-843222e1e57c', 1200),
    unsplash('1512436991641-6745cdb1723f', 1200),
    unsplash('1509631179647-0177331693ae', 1200),
  ],
  'lotus-zari-blouse': [
    unsplash('1529139574466-a303027c1d8b', 1200),
    unsplash('1469334031218-e382a71b716b', 1200),
  ],
  'temple-motif-bridal-blouse': [
    unsplash('1539109136881-3be0616acf4b', 1200),
    unsplash('1544005313-94ddf0286df2', 1200),
    unsplash('1517841905240-472988babdf9', 1200),
  ],
  'rose-gold-aari-couture': [
    unsplash('1507003211169-0a1dd7228f2d', 1200),
    unsplash('1620799140408-edc6dcb6d633', 1200),
    unsplash('1556905055-8f358a7a47b2', 1200),
  ],
  'heritage-bridal-blouse': [
    unsplash('1515886657613-9f3515b0c78f', 1200),
    unsplash('1583743814966-8936f5b7be1a', 1200),
  ],
  'mayil-aari-lehenga-blouse': [
    unsplash('1610296669228-602fa827fc1f', 1200),
    unsplash('1595777457583-95e059d581b8', 1200),
  ],
  'mogra-motif-half-saree-blouse': [
    unsplash('1617127365659-c47fa864d8bc', 1200),
    unsplash('1596461404969-9ae70f2830c1', 1200),
  ],
  'chettinad-zari-cotton-blouse': [
    unsplash('1556909114-f6e7ad7d3136', 1200),
    unsplash('1434389677669-e08b4cac3105', 1200),
  ],
  'temple-bordered-kanchipuram-saree': [
    unsplash('1517841905240-472988babdf9', 1200),
    unsplash('1483985988355-763728e1935b', 1200),
  ],
  'kalamkari-handloom-saree': [
    unsplash('1507003211169-0a1dd7228f2d', 1200),
    unsplash('1490481651871-ab68de25d43d', 1200),
  ],
  'soft-tassel-silk-saree': [
    unsplash('1489980557514-251d61e3eeb6', 1200),
    unsplash('1445205170230-053b83016050', 1200),
  ],
  'kantha-stitch-designer-saree': [
    unsplash('1508214751196-bcfd4ca60f91', 1200),
    unsplash('1441986300917-64674bd600d8', 1200),
  ],
  'aari-embroidered-catalogue-blouse': [
    unsplash('1524504388940-b1c1722653e1', 1200),
    unsplash('1544005313-94ddf0286df2', 1200),
  ],
  'antique-gold-celebration-saree': [
    unsplash('1610296669228-602fa827fc1f', 1200),
    unsplash('1595777457583-95e059d581b8', 1200),
  ],
  'royal-heritage-saree': [
    unsplash('1610030469983-98e550d6193c', 1200),
    unsplash('1566174053879-31528523f8ae', 1200),
  ],
  'zari-embroidered-party-blouse': [
    unsplash('1590959651373-a3db0f38a961', 1200),
    unsplash('1583743814966-8936f5b7be1a', 1200),
  ],
  'pearl-dot-aari-blouse': [
    unsplash('1509631179647-0177331693ae', 1200),
    unsplash('1496747611176-843222e1e57c', 1200),
  ],
  'banaras-silk-fusion-saree': [
    unsplash('1599661046289-e31897846e41', 1200),
    unsplash('1483985988355-763728e1935b', 1200),
  ],
};
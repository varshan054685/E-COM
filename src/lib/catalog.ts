/**
 * Catalogue data layer.
 *
 * This is intentionally a plain typed module so it can be swapped for a
 * database/CMS call later without touching any component: every page reads
 * through the helpers at the bottom of this file.
 */

import { unsplash } from './images';

export type CategorySlug =
  | 'bridal-aari'
  | 'designer-blouses'
  | 'designer-sarees'
  | 'hand-painted'
  | 'kids-party-wear';

export type Swatch = { name: string; hex: string };

export type Product = {
  id: string;
  slug: string;
  title: string;
  category: CategorySlug;
  /** Short editorial subtitle shown under the title. */
  subtitle: string;
  price: number;
  compareAtPrice?: number;
  fabric: string;
  embroidery: string;
  /** Paragraph shown on the product page. */
  description: string;
  /** Bulleted craft + care notes. */
  details: string[];
  images: string[];
  colors: Swatch[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  bestseller?: boolean;
  isNew?: boolean;
  /** Blouses are stitched to order, so the custom-measurement form matters. */
  madeToOrder?: boolean;
  tags: string[];
};

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: 'bridal-aari',
    name: 'Bridal Aari Blouses',
    tagline: 'Heirloom embroidery',
    description:
      'Hand-hooked Aari work in zardosi, kundan and antique gold — built around your wedding colours and draped silhouette.',
    image: unsplash('1539109136881-3be0616acf4b', 1200),
  },
  {
    slug: 'kids-party-wear',
    name: 'Kids Party Wear',
    tagline: 'Little celebrations',
    description:
      'Pattu frocks, lehenga sets and soft-lined silk for birthdays, weddings and every occasion worth dressing up for.',
    image: unsplash('1596461404969-9ae70f2830c1', 1200),
  },
  {
    slug: 'hand-painted',
    name: 'Hand-Painted Fabrics',
    tagline: 'One of a kind',
    description:
      'Freehand brushwork on tussar, crepe and organza — each panel painted once, and never repeated.',
    image: unsplash('1508214751196-bcfd4ca60f91', 1200),
  },
  {
    slug: 'designer-sarees',
    name: 'Signature Sarees',
    tagline: 'Woven heritage',
    description:
      'Kanchipuram, Banaras and Chettinad weaves selected for fall, drape and a border that photographs beautifully.',
    image: unsplash('1515886657613-9f3515b0c78f', 1200),
  },
  {
    slug: 'designer-blouses',
    name: 'Designer Blouses',
    tagline: 'Modern classics',
    description:
      'Sculpted necklines, structured sleeves and restrained detailing for the woman who likes her luxury quiet.',
    image: unsplash('1469334031218-e382a71b716b', 1200),
  },
];

export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;
export const KIDS_SIZES = ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'] as const;

export const COLOR_FILTERS: Swatch[] = [
  { name: 'Emerald', hex: '#064e3b' },
  { name: 'Magenta', hex: '#831843' },
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Ivory', hex: '#f7f1e7' },
  { name: 'Indigo', hex: '#1e3a8a' },
  { name: 'Rose', hex: '#b76e79' },
  { name: 'Black', hex: '#1c1917' },
];

/** Price buckets used by the shop sidebar. */
export const PRICE_BANDS = [
  { id: 'under-10k', label: 'Under ₹10,000', min: 0, max: 10000 },
  { id: '10k-20k', label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
  { id: '20k-40k', label: '₹20,000 – ₹40,000', min: 20000, max: 40000 },
  { id: 'above-40k', label: 'Above ₹40,000', min: 40000, max: Infinity },
] as const;

const img = (id: string, w = 1200) => unsplash(id, w);

export const PRODUCTS: Product[] = [
  {
    id: 'p-001',
    slug: 'royal-peacock-aari-blouse',
    title: 'Royal Peacock Aari Blouse',
    subtitle: 'Zardosi & kundan on raw silk',
    category: 'bridal-aari',
    price: 24900,
    compareAtPrice: 29500,
    fabric: 'Pure raw silk, 60g',
    embroidery: 'Hand Aari — zardosi, kundan, French knot',
    description:
      'Our signature bridal silhouette. A peacock motif is hooked by hand over 140 studio hours, with antique gold zardosi building into a kundan-set neckline. The back is left deliberately architectural so that the blouse reads as couture even before the saree is draped.',
    details: [
      'Hand-hooked Aari embroidery, 140+ studio hours',
      'Boned princess seams for a structured drape',
      'Padded cups and concealed side zip',
      'Dry clean only — store flat, away from direct light',
    ],
    images: [
      img('1496747611176-843222e1e57c'),
      img('1512436991641-6745cdb1723f'),
      img('1509631179647-0177331693ae'),
    ],
    colors: [
      { name: 'Emerald', hex: '#064e3b' },
      { name: 'Magenta', hex: '#831843' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.9,
    reviewCount: 68,
    bestseller: true,
    madeToOrder: true,
    tags: ['bridal', 'aari', 'wedding'],
  },
  {
    id: 'p-002',
    slug: 'temple-motif-bridal-blouse',
    title: 'Temple Motif Bridal Blouse',
    subtitle: 'Antique gold on kanjivaram red',
    category: 'bridal-aari',
    price: 31500,
    fabric: 'Kanjivaram silk blend',
    embroidery: 'Aari with antique gold + temple border',
    description:
      'Inspired by the gopuram carvings of Chettinad temples, this bridal blouse layers a hand-drawn temple border with dense antique gold Aari work. Built for a Kanjivaram drape with a heavy zari pallu.',
    details: [
      'Temple border traced and hooked entirely by hand',
      'Extra 2" seam allowance for post-wedding alterations',
      'Silk-lined interior for a smooth finish',
      'Made to order in 3–4 weeks',
    ],
    images: [
      img('1539109136881-3be0616acf4b'),
      img('1544005313-94ddf0286df2'),
      img('1517841905240-472988babdf9'),
    ],
    colors: [
      { name: 'Magenta', hex: '#831843' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 5.0,
    reviewCount: 41,
    bestseller: true,
    madeToOrder: true,
    tags: ['bridal', 'temple', 'aari'],
  },
  {
    id: 'p-003',
    slug: 'mogra-motif-half-saree-blouse',
    title: 'Mogra Motif Half-Saree Blouse',
    subtitle: 'Pearl work on blush silk',
    category: 'bridal-aari',
    price: 18500,
    fabric: 'Blush silk organza',
    embroidery: 'Pearl beads with gold thread outline',
    description:
      'A soft, romantic piece for engagements and half-saree ceremonies. Mogra buds are recreated in pearl and gold thread, scattered across a blush organza base that catches light without glittering.',
    details: [
      'Hand-stitched pearl clusters',
      'Sheer organza overlay on silk lining',
      'Hook-and-eye back with adjustable dori',
      'Dry clean only',
    ],
    images: [
      img('1617127365659-c47fa864d8bc'),
      img('1596461404969-9ae70f2830c1'),
    ],
    colors: [
      { name: 'Rose', hex: '#b76e79' },
      { name: 'Ivory', hex: '#f7f1e7' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.8,
    reviewCount: 33,
    isNew: true,
    madeToOrder: true,
    tags: ['engagement', 'half-saree', 'pearl'],
  },
  {
    id: 'p-004',
    slug: 'pearl-dot-aari-blouse',
    title: 'Pearl Dot Aari Blouse',
    subtitle: 'Minimal couture, maximum craft',
    category: 'designer-blouses',
    price: 12900,
    fabric: 'Matka silk',
    embroidery: 'Hand Aari — seed pearls on tonal thread',
    description:
      'For the minimalist bride. Tonal seed pearls are scattered by hand in an even grid, so the blouse reads as texture rather than ornament — perfect under a heavy zari pallu.',
    details: [
      'Tonal embroidery on matka silk',
      'Three-quarter sleeve, unlined for summer',
      'Reinforced shoulder seams',
      'Made to order in 2–3 weeks',
    ],
    images: [
      img('1509631179647-0177331693ae'),
      img('1496747611176-843222e1e57c'),
      img('1469334031218-e382a71b716b'),
    ],
    colors: [
      { name: 'Ivory', hex: '#f7f1e7' },
      { name: 'Emerald', hex: '#064e3b' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.7,
    reviewCount: 52,
    bestseller: true,
    madeToOrder: true,
    tags: ['minimal', 'aari', 'everyday-luxury'],
  },
  {
    id: 'p-005',
    slug: 'zari-embroidered-party-blouse',
    title: 'Zari Embroidered Party Blouse',
    subtitle: 'Statement sleeves',
    category: 'designer-blouses',
    price: 9800,
    compareAtPrice: 11500,
    fabric: 'Georgette with silk lining',
    embroidery: 'Machine-guided zari with hand finishing',
    description:
      'A versatile evening blouse with a sculpted shoulder and bell sleeve. Zari is laid in vertical lines to lengthen the silhouette — dress it up with a silk saree or down with tailored trousers.',
    details: [
      'Bell sleeve with structured shoulder',
      'Silk-lined body, breathable georgette sleeve',
      'Concealed back zip',
      'Hand wash cold, drip dry',
    ],
    images: [
      img('1590959651373-a3db0f38a961'),
      img('1583743814966-8936f5b7be1a'),
    ],
    colors: [
      { name: 'Black', hex: '#1c1917' },
      { name: 'Emerald', hex: '#064e3b' },
      { name: 'Magenta', hex: '#831843' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.6,
    reviewCount: 47,
    tags: ['party', 'zari', 'fusion'],
  },
  {
    id: 'p-006',
    slug: 'chettinad-zari-cotton-blouse',
    title: 'Chettinad Zari Cotton Blouse',
    subtitle: 'Everyday heritage',
    category: 'designer-blouses',
    price: 6400,
    fabric: 'Handloom cotton',
    embroidery: 'Fine zari border detail',
    description:
      'Breathable handloom cotton with a fine zari edge at the sleeve and neck. Designed for long festival days and repeated wear — the sort of blouse you reach for without thinking.',
    details: [
      'Handloom Chettinad cotton',
      'Unlined, naturally breathable',
      'Machine washable on gentle cycle',
      'Ships in 5–7 days',
    ],
    images: [
      img('1556909114-f6e7ad7d3136'),
      img('1434389677669-e08b4cac3105'),
    ],
    colors: [
      { name: 'Ivory', hex: '#f7f1e7' },
      { name: 'Indigo', hex: '#1e3a8a' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.5,
    reviewCount: 81,
    tags: ['cotton', 'everyday', 'handloom'],
  },
  {
    id: 'p-007',
    slug: 'aari-embroidered-catalogue-blouse',
    title: 'Aari Embroidered Catalogue Blouse',
    subtitle: 'Studio favourite',
    category: 'designer-blouses',
    price: 14200,
    fabric: 'Silk crepe',
    embroidery: 'Aari — thread shading with bead accents',
    description:
      'The blouse our stylists pull first. Thread shading is worked in three tones so the motif has depth in photographs, with bead accents catching flash light at the neckline.',
    details: [
      'Three-tone thread shading, hand hooked',
      'Bead accent neckline',
      'Fully lined in silk',
      'Made to order in 2–3 weeks',
    ],
    images: [
      img('1524504388940-b1c1722653e1'),
      img('1544005313-94ddf0286df2'),
    ],
    colors: [
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Magenta', hex: '#831843' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.8,
    reviewCount: 29,
    madeToOrder: true,
    tags: ['aari', 'photoshoot', 'beaded'],
  },
  {
    id: 'p-008',
    slug: 'temple-bordered-kanchipuram-saree',
    title: 'Temple Bordered Kanchipuram Saree',
    subtitle: 'Pure zari, 6 yards',
    category: 'designer-sarees',
    price: 46500,
    fabric: 'Pure Kanchipuram silk, 6 yards',
    embroidery: 'Woven pure zari temple border',
    description:
      'A weighty, lustrous Kanchipuram with a broad woven temple border and contrast pallu. Woven in Tamil Nadu on a traditional pit loom with pure zari that will hold its colour for decades.',
    details: [
      'Pure mulberry silk with pure silver zari',
      '6 yards with unstitched blouse piece',
      'Silk mark assured',
      'Dry clean only — air after each wear',
    ],
    images: [
      img('1517841905240-472988babdf9'),
      img('1483985988355-763728e1935b'),
    ],
    colors: [
      { name: 'Magenta', hex: '#831843' },
      { name: 'Emerald', hex: '#064e3b' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: ['6 yards'],
    rating: 4.9,
    reviewCount: 24,
    bestseller: true,
    tags: ['bridal', 'kanchipuram', 'zari'],
  },
  {
    id: 'p-009',
    slug: 'kalamkari-handloom-saree',
    title: 'Kalamkari Handloom Saree',
    subtitle: 'Pen-work storytelling',
    category: 'designer-sarees',
    price: 12400,
    fabric: 'Handloom cotton silk',
    embroidery: 'Hand-drawn kalamkari with natural dyes',
    description:
      'Every panel is drawn freehand with a bamboo pen using natural dyes. Motifs shift slightly between pieces — that irregularity is the point, and the reason no two sarees are alike.',
    details: [
      'Hand-drawn kalamkari, natural vegetable dyes',
      'Cotton silk — soft fall, light on the shoulder',
      'Colours deepen gracefully with age',
      'Gentle hand wash separately for the first wash',
    ],
    images: [
      img('1507003211169-0a1dd7228f2d'),
      img('1490481651871-ab68de25d43d'),
    ],
    colors: [
      { name: 'Ivory', hex: '#f7f1e7' },
      { name: 'Indigo', hex: '#1e3a8a' },
    ],
    sizes: ['5.5 yards'],
    rating: 4.7,
    reviewCount: 38,
    isNew: true,
    tags: ['handloom', 'kalamkari', 'artisanal'],
  },
  {
    id: 'p-010',
    slug: 'banaras-silk-fusion-saree',
    title: 'Banaras Silk Fusion Saree',
    subtitle: 'Pre-draped, ready to wear',
    category: 'designer-sarees',
    price: 21900,
    fabric: 'Banaras silk blend',
    embroidery: 'Woven brocade with hand-finished pleats',
    description:
      'A pre-draped Banaras saree for women who want the look without the thirty-minute ritual. Pleats are set in the studio, the pallu is weighted to fall correctly, and it packs flat into a carry-on.',
    details: [
      'Pre-draped with concealed side zip',
      'Weighted pallu for a clean fall',
      'Includes matching stitched blouse',
      'Dry clean only',
    ],
    images: [
      img('1599661046289-e31897846e41'),
      img('1483985988355-763728e1935b'),
    ],
    colors: [
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Rose', hex: '#b76e79' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.6,
    reviewCount: 31,
    madeToOrder: true,
    tags: ['fusion', 'pre-draped', 'banaras'],
  },
  {
    id: 'p-011',
    slug: 'royal-heritage-saree',
    title: 'Royal Heritage Saree',
    subtitle: 'Antique gold on wine',
    category: 'designer-sarees',
    price: 38900,
    fabric: 'Silk tissue',
    embroidery: 'Woven antique gold brocade',
    description:
      'Deep wine tissue silk with a woven antique gold brocade that turns matte in daylight and luminous under chandeliers. A reception saree that photographs as well as it drapes.',
    details: [
      'Silk tissue with woven brocade',
      'Broad contrast pallu',
      'Includes unstitched blouse piece',
      'Dry clean only',
    ],
    images: [
      img('1610030469983-98e550d6193c'),
      img('1566174053879-31528523f8ae'),
    ],
    colors: [
      { name: 'Magenta', hex: '#831843' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: ['6 yards'],
    rating: 4.9,
    reviewCount: 19,
    tags: ['reception', 'tissue', 'brocade'],
  },
  {
    id: 'p-012',
    slug: 'rose-gold-aari-couture',
    title: 'Rose Gold Aari Couture Blouse',
    subtitle: 'Metallic thread study',
    category: 'hand-painted',
    price: 27500,
    fabric: 'Hand-painted silk base',
    embroidery: 'Rose gold Aari over painted ground',
    description:
      'A collision of two crafts: the silk ground is hand-painted in soft washes and then Aari hooked in rose gold over the painted forms, so the embroidery follows the brushwork rather than dictating it.',
    details: [
      'Hand-painted silk ground, sealed for durability',
      'Rose gold Aari embroidery follows the artwork',
      'Each piece is unique — expect variation',
      'Dry clean only',
    ],
    images: [
      img('1507003211169-0a1dd7228f2d'),
      img('1620799140408-edc6dcb6d633'),
      img('1556905055-8f358a7a47b2'),
    ],
    colors: [
      { name: 'Rose', hex: '#b76e79' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.8,
    reviewCount: 22,
    isNew: true,
    madeToOrder: true,
    tags: ['hand-painted', 'aari', 'couture'],
  },
  {
    id: 'p-013',
    slug: 'hand-painted-tussar-dupatta',
    title: 'Hand-Painted Tussar Dupatta',
    subtitle: 'Botanical brushwork',
    category: 'hand-painted',
    price: 8900,
    compareAtPrice: 10500,
    fabric: 'Tussar silk',
    embroidery: 'Freehand fabric painting, heat sealed',
    description:
      'Botanical forms painted freehand across a tussar ground, then heat sealed so the colour survives wear. Light enough to fold into a bag, bold enough to lift a plain kurta set.',
    details: [
      'Freehand painting, never printed or stencilled',
      'Heat sealed for colourfastness',
      '2.5m x 1m',
      'Gentle hand wash separately',
    ],
    images: [
      img('1445205170230-053b83016050'),
      img('1489980557514-251d61e3eeb6'),
    ],
    colors: [
      { name: 'Emerald', hex: '#064e3b' },
      { name: 'Rose', hex: '#b76e79' },
      { name: 'Ivory', hex: '#f7f1e7' },
    ],
    sizes: ['Free size'],
    rating: 4.6,
    reviewCount: 44,
    bestseller: true,
    tags: ['dupatta', 'hand-painted', 'gifting'],
  },
  {
    id: 'p-014',
    slug: 'painted-organza-cape-blouse',
    title: 'Painted Organza Cape Blouse',
    subtitle: 'Modern drape',
    category: 'hand-painted',
    price: 19800,
    fabric: 'Silk organza',
    embroidery: 'Hand-painted washes with pearl edging',
    description:
      'A cape blouse that solves the sleeve question entirely. Painted in graded washes from the shoulder down, with a fine pearl edge along the hem so it moves cleanly.',
    details: [
      'Detachable cape with concealed snap',
      'Pearl-edged hem',
      'Hand-painted graded wash',
      'Dry clean only',
    ],
    images: [
      img('1508214751196-bcfd4ca60f91'),
      img('1441986300917-64674bd600d8'),
    ],
    colors: [
      { name: 'Ivory', hex: '#f7f1e7' },
      { name: 'Indigo', hex: '#1e3a8a' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.7,
    reviewCount: 16,
    isNew: true,
    madeToOrder: true,
    tags: ['cape', 'organza', 'contemporary'],
  },
  {
    id: 'p-015',
    slug: 'little-maharani-lehenga-set',
    title: 'Little Maharani Lehenga Set',
    subtitle: 'Pattu silk, 3-piece',
    category: 'kids-party-wear',
    price: 11400,
    fabric: 'Soft-lined pattu silk',
    embroidery: 'Zari border with gentle Aari accents',
    description:
      'A three-piece pattu lehenga for the smallest guest at the wedding. Fully lined in soft cotton so nothing scratches, with an elasticated waist that survives a full day of dancing.',
    details: [
      'Cotton-lined bodice — no scratchy seams',
      'Elasticated waist hidden under the pleats',
      'Includes lehenga, choli and dupatta',
      'Gentle hand wash',
    ],
    images: [
      img('1518831959646-742c3a14ebf7'),
      img('1544005313-94ddf0286df2'),
    ],
    colors: [
      { name: 'Magenta', hex: '#831843' },
      { name: 'Emerald', hex: '#064e3b' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: [...KIDS_SIZES],
    rating: 4.9,
    reviewCount: 57,
    bestseller: true,
    tags: ['kids', 'lehenga', 'wedding'],
  },
  {
    id: 'p-016',
    slug: 'festive-pattu-frock',
    title: 'Festive Pattu Frock',
    subtitle: 'Twirl-approved',
    category: 'kids-party-wear',
    price: 6900,
    fabric: 'Pattu silk with cotton lining',
    embroidery: 'Zari trim and hand-finished hem',
    description:
      'Cut with a full circle skirt so it actually twirls. Pattu silk outside, cotton next to the skin, and a hem finished by hand so it holds its shape through multiple wears.',
    details: [
      'Full circle skirt with volume',
      'Cotton lining against the skin',
      'Concealed back zip with hook',
      'Gentle hand wash',
    ],
    images: [
      img('1489980557514-251d61e3eeb6'),
      img('1490481651871-ab68de25d43d'),
    ],
    colors: [
      { name: 'Rose', hex: '#b76e79' },
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Emerald', hex: '#064e3b' },
    ],
    sizes: [...KIDS_SIZES],
    rating: 4.8,
    reviewCount: 63,
    tags: ['kids', 'frock', 'birthday'],
  },
  {
    id: 'p-017',
    slug: 'tiny-temple-pattu-set',
    title: 'Tiny Temple Pattu Set',
    subtitle: 'Pooja mornings',
    category: 'kids-party-wear',
    price: 5400,
    compareAtPrice: 6200,
    fabric: 'Art silk',
    embroidery: 'Woven temple border',
    description:
      'A two-piece pattu set for temple visits and family poojas. Lightweight art silk that stays crisp in the heat, with a temple border woven to match the adults.',
    details: [
      'Two-piece: kurta top and pattu bottom',
      'Lightweight art silk',
      'Machine washable on gentle cycle',
      'Ships in 5–7 days',
    ],
    images: [
      img('1434389677669-e08b4cac3105'),
      img('1556909114-f6e7ad7d3136'),
    ],
    colors: [
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Emerald', hex: '#064e3b' },
    ],
    sizes: [...KIDS_SIZES],
    rating: 4.7,
    reviewCount: 35,
    tags: ['kids', 'pattu', 'festive'],
  },
  {
    id: 'p-018',
    slug: 'maharani-gold-veil-set',
    title: 'Maharani Gold Veil Set',
    subtitle: 'Couture bridal layer',
    category: 'bridal-aari',
    price: 42000,
    fabric: 'Silk tulle with gold zari',
    embroidery: 'Full Aari veil with gold zari scatter',
    description:
      'The final layer of a bridal look. A silk tulle veil scattered with hand-hooked gold zari, weighted to fall without clinging and light enough to wear through the ceremony.',
    details: [
      'Hand-hooked zari scatter, 90 studio hours',
      'Weighted hem for a clean fall',
      'Attaches with concealed combs',
      'Made to order in 4–5 weeks',
    ],
    images: [
      img('1544005313-94ddf0286df2'),
      img('1441984904996-e0b6ba687e04'),
    ],
    colors: [
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Ivory', hex: '#f7f1e7' },
    ],
    sizes: ['One size'],
    rating: 5.0,
    reviewCount: 12,
    isNew: true,
    madeToOrder: true,
    tags: ['bridal', 'veil', 'couture'],
  },
];

/* ------------------------------------------------------------------ *
 *  Read helpers — the only surface pages should depend on.
 * ------------------------------------------------------------------ */

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getCategory(slug: CategorySlug): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getBestsellers(limit = 6): Product[] {
  const featured = PRODUCTS.filter((p) => p.bestseller);
  return (featured.length >= limit ? featured : [...featured, ...PRODUCTS]).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  const rest = PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getPriceBounds(): { min: number; max: number } {
  const prices = PRODUCTS.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getFeaturedCategories(): Category[] {
  const order: CategorySlug[] = ['bridal-aari', 'kids-party-wear', 'hand-painted'];
  return order
    .map((slug) => CATEGORIES.find((c) => c.slug === slug))
    .filter((c): c is Category => Boolean(c));
}

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

/** All distinct colour names present in the catalogue, for the shop filter. */
export function getAllColorNames(): string[] {
  const names = new Set<string>();
  PRODUCTS.forEach((p) => p.colors.forEach((c) => names.add(c.name)));
  return [...names].sort();
}

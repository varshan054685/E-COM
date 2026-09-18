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
      'Hand-hooked Aari work in pure zardosi, kundan and antique gold — custom tailored to your silhouette and saree.',
    image: '/products/temple-gopuram-bridal-blouse.jpeg',
  },
  {
    slug: 'kids-party-wear',
    name: 'Kids Party Wear',
    tagline: 'Little celebrations',
    description:
      'Pattu frocks, princess gowns and soft-lined silk for birthdays, weddings and celebratory occasions.',
    image: '/products/blush-rose-ruffle-frock.jpeg',
  },
  {
    slug: 'hand-painted',
    name: 'Hand-Painted Fabrics',
    tagline: 'One of a kind',
    description:
      'Freehand botanical brushwork and Pichwai art on pure silk — each piece painted individually by hand.',
    image: '/products/emerald-floral-pearl-blouse.jpeg',
  },
  {
    slug: 'designer-sarees',
    name: 'Signature Sarees',
    tagline: 'Woven heritage',
    description:
      'Kanchipuram, Banaras and Chettinad weaves curated for rich fall, drape and lustrous pure zari borders.',
    image: '/products/handpainted-pichwai-silk-art.jpeg',
  },
  {
    slug: 'designer-blouses',
    name: 'Designer Blouses',
    tagline: 'Modern classics',
    description:
      'Sculpted necklines, structural cutwork backs and artisanal detailing for contemporary luxury.',
    image: '/products/royal-olive-aari-blouse.jpeg',
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
  { name: 'Blue', hex: '#60a5fa' },
  { name: 'Lilac', hex: '#c084fc' },
  { name: 'Olive', hex: '#556b2f' },
];

/** Price buckets used by the shop sidebar. */
export const PRICE_BANDS = [
  { id: 'under-1500', label: 'Under ₹1,500', min: 0, max: 1500 },
  { id: '1500-3000', label: '₹1,500 – ₹3,000', min: 1500, max: 3000 },
  { id: '3000-6000', label: '₹3,000 – ₹6,000', min: 3000, max: 6000 },
  { id: 'above-6000', label: 'Above ₹6,000', min: 6000, max: Infinity },
] as const;

const img = (id: string, w = 1200) => unsplash(id, w);

export const PRODUCTS: Product[] = [
  {
    id: 'p-001',
    slug: 'royal-olive-aari-blouse',
    title: 'Royal Olive Aari Cutwork Blouse',
    subtitle: 'Zardosi & pearl beads on olive silk',
    category: 'bridal-aari',
    price: 3600,
    compareAtPrice: 4200,
    fabric: 'Pure raw silk, 60g',
    embroidery: 'Hand Aari — zardosi, black pearl beads, hanging silk tassels',
    description:
      'Our signature bridal silhouette. An ornate circular cutwork back encircled with hand-set black pearl beads and golden aari cordwork, finished with handcrafted silk tassels and heavily embroidered sleeve cuffs.',
    details: [
      'Hand-hooked Aari embroidery, 45+ studio hours',
      'Circular cutwork back with reinforced frame',
      'Padded cups and concealed side zip',
      'Dry clean only — store flat in breathable cotton wrap',
    ],
    images: ['/products/royal-olive-aari-blouse.jpeg'],
    colors: [
      { name: 'Olive', hex: '#556b2f' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.9,
    reviewCount: 74,
    bestseller: true,
    madeToOrder: true,
    tags: ['bridal', 'aari', 'cutwork', 'wedding'],
  },
  {
    id: 'p-002',
    slug: 'temple-gopuram-bridal-blouse',
    title: 'Temple Gopuram Bridal Blouse',
    subtitle: 'Antique gold zardosi on rani pink',
    category: 'bridal-aari',
    price: 4800,
    compareAtPrice: 5500,
    fabric: 'Pure Kanjivaram raw silk',
    embroidery: 'Dense architectural temple gopuram in pure antique gold zardosi',
    description:
      'Inspired by the grand gopuram stone carvings of South Indian temples. Dense rows of antique gold zardosi are hooked entirely by hand across the back and sleeves over 60 studio hours.',
    details: [
      'Architectural temple gopuram traced and hooked by hand',
      'Extra 2" internal seam allowance for alterations',
      'Lined in pure silk for utmost comfort',
      'Made to order in 2–3 weeks',
    ],
    images: ['/products/temple-gopuram-bridal-blouse.jpeg'],
    colors: [
      { name: 'Magenta', hex: '#831843' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 5.0,
    reviewCount: 52,
    bestseller: true,
    madeToOrder: true,
    tags: ['bridal', 'temple', 'gopuram', 'zardosi'],
  },
  {
    id: 'p-003',
    slug: 'royal-purple-gold-brocade-blouse',
    title: 'Royal Purple & Antique Gold Brocade Blouse',
    subtitle: 'Sweetheart neck with potli buttons',
    category: 'bridal-aari',
    price: 2800,
    compareAtPrice: 3200,
    fabric: 'Kanchipuram brocade silk',
    embroidery: 'Hand Aari sleeve motifs with antique gold zardosi and woven border',
    description:
      'A structured sweetheart front with a deep square back fastened with silk potli buttons. Woven rich gold brocade contrasts with royal purple borders and delicate handcrafted aari arm motifs.',
    details: [
      'Sculpted sweetheart neckline with boned seams',
      'Back potli button closure with keyhole',
      'Padded cups and reinforced shoulders',
      'Dry clean only',
    ],
    images: ['/products/royal-purple-gold-brocade-blouse.jpeg'],
    colors: [
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Indigo', hex: '#1e3a8a' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.9,
    reviewCount: 46,
    bestseller: true,
    madeToOrder: true,
    tags: ['brocade', 'sweetheart', 'potli-buttons', 'bridal'],
  },
  {
    id: 'p-004',
    slug: 'emerald-floral-pearl-blouse',
    title: 'Emerald Floral Hand-Painted Aari Blouse',
    subtitle: 'Pearl lace borders on botanical painted silk',
    category: 'hand-painted',
    price: 2450,
    compareAtPrice: 2800,
    fabric: 'Pure handloom silk',
    embroidery: 'Freehand botanical painting with seed pearl sleeve lace and aari neckline',
    description:
      'Lush emerald ground featuring freehand botanical brushwork framed by scalloped antique gold lace and clusters of fresh water seed pearls along the sleeves and scoop neckline.',
    details: [
      'Hand-painted botanical floral motif, heat sealed',
      'Seed pearl scalloped lace on sleeve cuffs',
      'Fully lined in breathable silk cotton',
      'Dry clean only',
    ],
    images: [
      '/products/emerald-floral-pearl-blouse.jpeg',
      '/products/emerald-floral-pearl-blouse-side.jpeg',
    ],
    colors: [
      { name: 'Emerald', hex: '#064e3b' },
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Ivory', hex: '#f7f1e7' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.9,
    reviewCount: 63,
    bestseller: true,
    madeToOrder: true,
    tags: ['hand-painted', 'pearl', 'botanical', 'aari'],
  },
  {
    id: 'p-005',
    slug: 'blush-rose-ruffle-frock',
    title: 'Blush Rose Ruffle Party Frock',
    subtitle: 'Petal pleats with crystal waistline',
    category: 'kids-party-wear',
    price: 1150,
    compareAtPrice: 1299,
    fabric: 'Soft crushed tissue silk with breathable cotton lining',
    embroidery: 'Hand-sculpted rose petal bodice with crystal rhinestone belt',
    description:
      'A show-stopping party dress for little celebrations. Sculpted petal texture across the bodice with a voluminous pleated skirt and gentle, scratch-free cotton lining.',
    details: [
      'Hand-layered petal bodice texture',
      'Cotton voile lining — gentle on sensitive skin',
      'Concealed back zip with soft flap',
      'Hand wash gentle or dry clean',
    ],
    images: [
      '/products/blush-rose-ruffle-frock.jpeg',
      '/products/blush-rose-ruffle-frock-detail.jpeg',
    ],
    colors: [
      { name: 'Rose', hex: '#b76e79' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: [...KIDS_SIZES],
    rating: 5.0,
    reviewCount: 58,
    bestseller: true,
    tags: ['kids', 'party', 'frock', 'ruffle'],
  },
  {
    id: 'p-006',
    slug: 'powder-blue-princess-gown',
    title: 'Powder Blue Off-Shoulder Princess Gown',
    subtitle: 'Ruffled cloud neckline with shimmer belt',
    category: 'kids-party-wear',
    price: 1450,
    compareAtPrice: 1699,
    fabric: 'Glimmer organza silk with soft lining',
    embroidery: 'Gathered off-shoulder cloud ruffles with diamond stone waistline',
    description:
      'A fairy tale princess dress crafted in shimmering powder blue organza with dramatic gathered neckline and a twirl-worthy layered skirt for birthdays and stage events.',
    details: [
      'Glimmer organza fabric with soft shimmer',
      'Off-shoulder ruffle overlay with shoulder straps',
      'Crinoline net layer for bouncy volume',
      'Dry clean recommended',
    ],
    images: [
      '/products/powder-blue-princess-gown.jpeg',
      '/products/powder-blue-princess-gown-back.jpeg',
    ],
    colors: [
      { name: 'Blue', hex: '#60a5fa' },
      { name: 'Ivory', hex: '#f7f1e7' },
    ],
    sizes: [...KIDS_SIZES],
    rating: 4.9,
    reviewCount: 42,
    bestseller: true,
    tags: ['kids', 'princess', 'gown', 'organza'],
  },
  {
    id: 'p-007',
    slug: 'rose-gold-shimmer-dress',
    title: 'Rose Gold Shimmer Floral Dress',
    subtitle: 'Metallic texture with 3D bloom corsage',
    category: 'kids-party-wear',
    price: 1150,
    compareAtPrice: 1299,
    fabric: 'Metallic woven silk tissue with cotton lining',
    embroidery: 'Handcrafted 3D floral corsage with rhinestone center',
    description:
      'Gleaming rose gold metallic tissue designed to catch evening light. Features an off-shoulder fold with a hand-stitched 3D rose bloom and pleated flounce.',
    details: [
      'Metallic micro-crushed tissue silk',
      'Handmade 3D rose flower accent',
      'Elasticated inner back for flexible fit',
      'Gentle hand wash cold',
    ],
    images: [
      '/products/rose-gold-shimmer-dress.jpeg',
      '/products/rose-gold-shimmer-dress-detail.jpeg',
    ],
    colors: [
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Rose', hex: '#b76e79' },
    ],
    sizes: [...KIDS_SIZES],
    rating: 4.8,
    reviewCount: 39,
    tags: ['kids', 'shimmer', 'rose-gold', 'corsage'],
  },
  {
    id: 'p-008',
    slug: 'lilac-party-embroidered-dress',
    title: 'Lilac Dream Embroidered Bow Dress',
    subtitle: 'Floral threadwork with statement bow',
    category: 'kids-party-wear',
    price: 1199,
    compareAtPrice: 1399,
    fabric: 'Pure handloom cotton-linen blend with voile lining',
    embroidery: 'All-over floral vine threadwork with scalloped ribbon bow',
    description:
      'Pastel elegance with detailed white floral embroidery across a soothing lilac base, topped with a dramatic oversized bow for summer festivities and ceremonies.',
    details: [
      'Fine eyelet & vine thread embroidery',
      'Detachable oversized front bow',
      'Full box pleat flared skirt',
      'Machine washable on gentle cycle',
    ],
    images: [
      '/products/lilac-party-embroidered-dress.jpeg',
      '/products/lilac-party-embroidered-dress-back.jpeg',
    ],
    colors: [
      { name: 'Lilac', hex: '#c084fc' },
      { name: 'Ivory', hex: '#f7f1e7' },
    ],
    sizes: [...KIDS_SIZES],
    rating: 4.7,
    reviewCount: 31,
    tags: ['kids', 'lilac', 'bow', 'embroidery'],
  },
  {
    id: 'p-009',
    slug: 'handpainted-pichwai-silk-art',
    title: 'Hand-Painted Pichwai Krishna Silk Fabric',
    subtitle: 'Devotional brushwork with gold ink',
    category: 'hand-painted',
    price: 4500,
    compareAtPrice: 5200,
    fabric: 'Pure raw tussar silk',
    embroidery: 'Freehand Pichwai painting depicting Govardhan Krishna and cows with metallic detailing',
    description:
      'Heirloom textile art painted entirely freehand by master artisans using traditional natural mineral pigments and liquid gold ink on handwoven raw tussar silk.',
    details: [
      '100% freehand Pichwai painting, never printed',
      'Heat sealed natural pigment colors',
      'Suitable for framing or couture tailoring',
      'Store rolled in acid-free paper',
    ],
    images: ['/products/handpainted-pichwai-silk-art.jpeg'],
    colors: [
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Indigo', hex: '#1e3a8a' },
      { name: 'Magenta', hex: '#831843' },
    ],
    sizes: ['Free size (3.5m)'],
    rating: 5.0,
    reviewCount: 18,
    isNew: true,
    tags: ['hand-painted', 'pichwai', 'krishna', 'silk'],
  },
  {
    id: 'p-010',
    slug: 'coral-peacock-handpainted-blouse',
    title: 'Coral Pink Hand-Painted Peacock Blouse',
    subtitle: 'Ruby stone work & gold aari feathers',
    category: 'hand-painted',
    price: 2100,
    compareAtPrice: 2500,
    fabric: 'Pure raw silk',
    embroidery: 'Hand-painted royal peacock motifs embellished with ruby crystals and gold zari outline',
    description:
      'Vibrant coral pink silk featuring majestic painted peacocks across the sleeves, accented with sparkling ruby red crystals and gold aari threadwork.',
    details: [
      'Twin sleeve royal peacock artwork',
      'Ruby crystal hand embellishments',
      'Silk lining with padded cups',
      'Dry clean only',
    ],
    images: [
      '/products/coral-peacock-handpainted-blouse.jpeg',
      '/products/coral-peacock-handpainted-blouse-detail.jpeg',
    ],
    colors: [
      { name: 'Rose', hex: '#b76e79' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.8,
    reviewCount: 27,
    madeToOrder: true,
    tags: ['peacock', 'hand-painted', 'ruby', 'aari'],
  },
  {
    id: 'p-011',
    slug: 'handpainted-lotus-maharani-portrait',
    title: 'Lotus Maharani Hand-Embroidered Portrait Fabric',
    subtitle: 'Thread shading & miniature jewelry',
    category: 'hand-painted',
    price: 5800,
    compareAtPrice: 6500,
    fabric: 'Handwoven raw silk canvas',
    embroidery: 'Micro-needle thread embroidery with pearl beads, gold jhumkas and lotus motif',
    description:
      'Museum-grade portraiture embroidery capturing a Maharani in traditional attire with miniature pearl jewelry, shaded pink lotus petals, and a shimmering gold veil.',
    details: [
      '180+ hours of single-strand micro needlework',
      'Real seed pearl and gold bead jhumkas',
      'Collectors piece for bridal framing or blouse back',
      'Store flat in dry conditions',
    ],
    images: ['/products/handpainted-lotus-maharani-portrait.jpeg'],
    colors: [
      { name: 'Rose', hex: '#b76e79' },
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Ivory', hex: '#f7f1e7' },
    ],
    sizes: ['Custom Piece'],
    rating: 5.0,
    reviewCount: 14,
    tags: ['portrait', 'maharani', 'lotus', 'couture'],
  },
  {
    id: 'p-012',
    slug: 'sage-cutwork-puff-sleeve-blouse',
    title: 'Sage Green Cutwork Puff-Sleeve Blouse',
    subtitle: 'Keyhole back with gold scalloped lace',
    category: 'designer-blouses',
    price: 1850,
    compareAtPrice: 2200,
    fabric: 'Linen silk blend with tie-dye puff sleeves',
    embroidery: 'Circular loop neck detail with gold lace and hanging dori latkans',
    description:
      'A blend of vintage puff sleeves with contemporary back cutwork. Contrasting gold scallop borders with matching back tie-ups and soft shibori textured sleeve caps.',
    details: [
      'Gathered puff sleeve with zari trim',
      'Deep circular keyhole back with tie dori',
      'Comfortable breathable linen-silk body',
      'Dry clean only',
    ],
    images: ['/products/sage-cutwork-puff-sleeve-blouse.jpeg'],
    colors: [
      { name: 'Olive', hex: '#556b2f' },
      { name: 'Gold', hex: '#d4af37' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.8,
    reviewCount: 36,
    madeToOrder: true,
    tags: ['puff-sleeve', 'cutwork', 'designer', 'sage'],
  },
  {
    id: 'p-013',
    slug: 'rani-pink-zari-scallop-blouse',
    title: 'Rani Pink Contrast Scallop Blouse',
    subtitle: 'Gold temple border with navy brocade',
    category: 'designer-blouses',
    price: 1650,
    compareAtPrice: 1950,
    fabric: 'Pure raw silk with woven zari border',
    embroidery: 'Diamond back keyhole with scallop sleeve hems and gold ball trim',
    description:
      'Striking rani pink base accented by diagonal navy floral brocade panels and scalloped hand-stitched sleeve borders with pure gold ball piping.',
    details: [
      'Scallop cutwork sleeve edge with zari border',
      'Contrast brocade diagonal inset',
      'Princess seam cut for clean fit',
      'Made to order in 2 weeks',
    ],
    images: [
      '/products/rani-pink-zari-scallop-blouse.jpeg',
      '/products/rani-pink-zari-scallop-blouse-back.jpeg',
    ],
    colors: [
      { name: 'Magenta', hex: '#831843' },
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Indigo', hex: '#1e3a8a' },
    ],
    sizes: [...STANDARD_SIZES],
    rating: 4.9,
    reviewCount: 41,
    madeToOrder: true,
    tags: ['rani-pink', 'scallop', 'brocade', 'festive'],
  },
  {
    id: 'p-014',
    slug: 'temple-bordered-kanchipuram-saree',
    title: 'Temple Bordered Kanchipuram Saree',
    subtitle: 'Pure zari, 6 yards',
    category: 'designer-sarees',
    price: 16500,
    compareAtPrice: 19000,
    fabric: 'Pure Kanchipuram silk, 6 yards',
    embroidery: 'Woven pure zari temple border',
    description:
      'A weighty, lustrous Kanchipuram with a broad woven temple border and contrast pallu. Woven in Tamil Nadu on a traditional pit loom with pure zari.',
    details: [
      'Pure mulberry silk with pure silver zari',
      '6 yards with unstitched blouse piece',
      'Silk mark assured',
      'Dry clean only',
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
    id: 'p-015',
    slug: 'royal-heritage-wine-tissue-saree',
    title: 'Royal Heritage Wine Tissue Saree',
    subtitle: 'Antique gold brocade on wine tissue',
    category: 'designer-sarees',
    price: 12800,
    compareAtPrice: 14500,
    fabric: 'Silk tissue with woven brocade',
    embroidery: 'Woven antique gold brocade with contrast pallu',
    description:
      'Deep wine tissue silk with a woven antique gold brocade that turns matte in daylight and luminous under evening lights. A reception drape of extraordinary grace.',
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

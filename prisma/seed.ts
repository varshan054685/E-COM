import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { IMG, COLLECTION_IMAGES, PRODUCT_IMAGES } from '../src/lib/images';
import { SITE } from '../src/lib/site';

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    slug: 'aari-couture',
    name: 'Aari Couture',
    description: 'Handcrafted Aari embroidery — beaded motifs, zardozi, and silk threads.',
    seoTitle: 'Aari Couture | Handcrafted Embroidery',
    seoDescription: 'Explore handcrafted Aari embroidery pieces by JGTHS.',
    image: COLLECTION_IMAGES['aari-couture'],
    displayOrder: 1,
    featured: true,
  },
  {
    slug: 'designer-blouses',
    name: 'Designer Blouses',
    description: 'Contemporary and traditional blouse designs, made to fit impeccably.',
    seoTitle: 'Designer Blouses | JGTHS',
    seoDescription: 'Contemporary and traditional designer blouses, handcrafted in Coimbatore.',
    image: COLLECTION_IMAGES['designer-blouses'],
    displayOrder: 2,
    featured: true,
  },
  {
    slug: 'bridal',
    name: 'Bridal',
    description: 'Wedding and bridal couture — from blouses to complete trousseau styling.',
    seoTitle: 'Bridal Couture | JGTHS',
    seoDescription: 'Bridal couture and wedding creations by JGTHS Designer Boutique.',
    image: COLLECTION_IMAGES['bridal'],
    displayOrder: 3,
    featured: true,
  },
  {
    slug: 'sarees',
    name: 'Sarees',
    description: 'Curated sarees and styling pieces — silks, handlooms, and evening drape.',
    seoTitle: 'Sarees | JGTHS',
    seoDescription: 'Curated sarees and styling pieces from JGTHS.',
    image: COLLECTION_IMAGES['sarees'],
    displayOrder: 4,
    featured: true,
  },
  {
    slug: 'custom-couture',
    name: 'Custom Creations',
    description: 'Personalized garments created to your requirements, occasions and measurements.',
    seoTitle: 'Custom Creations | JGTHS',
    seoDescription: 'Custom couture created to your exact specifications.',
    image: COLLECTION_IMAGES['custom-couture'],
    displayOrder: 5,
    featured: false,
  },
];

type ProductSeed = {
  slug: string;
  name: string;
  price: number;
  compare?: number;
  category: string;
  material: string;
  craftType: string;
  sizes: string;
  colors: string;
  tags: string;
  productionTime: string;
  stock: number;
  featured?: boolean; // maps to isFeatured
  isNew?: boolean;
  isBestseller?: boolean;
  isLimited?: boolean;
  isMadeToOrder?: boolean;
  careInstructions: string;
  shippingInfo: string;
  description: string;
};

const PRODUCTS: ProductSeed[] = [
  {
    slug: 'royal-peacock-aari-blouse',
    name: 'Royal Peacock Aari Blouse',
    price: 4999,
    compare: 6999,
    category: 'aari-couture',
    material: 'Raw silk with cotton lining',
    craftType: 'Aari embroidery',
    sizes: 'XS,S,M,L,XL,Custom',
    colors: 'Peacock Green, Ivory, Wine',
    tags: 'aari,best seller,festive',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 7,
    featured: true,
    isBestseller: true,
    careInstructions: 'Dry clean only. Store padded to protect embroidered motifs.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days. Free shipping above ₹10,000.',
    description:
      'A hand-embroidered peacock motif rises across the back in dimensional Aari work — beadwork, zardozi, and silk thread building feather by feather. Cut on a structured raw-silk base with a clean, tailored front, this blouse pairs as easily with a Kanchipuram drape as with a modern silk lehenga.',
  },
  {
    slug: 'lotus-zari-blouse',
    name: 'Lotus Zari Blouse',
    price: 3899,
    category: 'designer-blouses',
    material: 'Soft satin with zari accents',
    craftType: 'Zari handwork',
    sizes: 'XS,S,M,L,XL,Custom',
    colors: 'Ivory, Rose Gold, Blush',
    tags: 'zari,party',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 12,
    featured: true,
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'Lotus petals in fine gold zari trail across the shoulder of this soft satin blouse. Lightweight and quietly luminous, it is the kind of piece that carries you from an evening reception to a Sunday wedding with zero effort.',
  },
  {
    slug: 'temple-motif-bridal-blouse',
    name: 'Temple Motif Bridal Blouse',
    price: 7999,
    compare: 9999,
    category: 'bridal',
    material: 'Banarasi silk, fully lined',
    craftType: 'Aari + zardozi hand embroidery',
    sizes: 'Custom',
    colors: 'Antique Gold, Maroon, Deep Green',
    tags: 'bridal,wedding,made-to-order',
    productionTime: 'Made to order — 2 to 3 weeks',
    stock: 0,
    isMadeToOrder: true,
    featured: true,
    careInstructions: 'Hand wash or dry clean only. Store flat with acid-free tissue.',
    shippingInfo: 'Custom pieces are stitched to your measurements and shipped after quality checks.',
    description:
      'Temple gopuram motifs, drawn in fine zardozi and hand-cut mirror work, frame the back of this bridal blouse. Every layer is built on Banarasi silk and lined by hand. As with all our bridal pieces, it is crafted to your measurements — because a lehenga is only as beautiful as its blouse.',
  },
  {
    slug: 'rose-gold-aari-couture',
    name: 'Rose Gold Aari Couture',
    price: 12500,
    compare: 15800,
    category: 'aari-couture',
    material: 'Tissue silk',
    craftType: 'Aari embroidery, rose-gold beads',
    sizes: 'S,M,L,Custom',
    colors: 'Blush, Ivory',
    tags: 'aari,limited,festive',
    productionTime: 'Ready to ship in 3–4 days',
    stock: 3,
    isLimited: true,
    featured: true,
    careInstructions: 'Dry clean only. Avoid direct heat on embroidery.',
    shippingInfo: 'Limited edition — fewer than five pieces in this batch.',
    description:
      'Rose-gold beads catch the light across hand-drawn floral sprays, stitched in Aari over tissue silk. A limited piece — once the beads are gone, the palette moves on. Cut with a scalloped hem and soft cap sleeve for a modern bridal-without-the-ceremony feel.',
  },
  {
    slug: 'heritage-bridal-blouse',
    name: 'Heritage Bridal Blouse',
    price: 9500,
    category: 'bridal',
    material: 'Kanjivaram silk, lined',
    craftType: 'Aari + sequin handwork',
    sizes: 'Custom',
    colors: 'Red, Maroon, Wine',
    tags: 'bridal,wedding,made-to-order',
    productionTime: 'Made to order — 2 to 3 weeks',
    stock: 0,
    isMadeToOrder: true,
    careInstructions: 'Dry clean only. Store in cotton cloth.',
    shippingInfo: 'Stitched to your measurements with two fittings scheduled.',
    description:
      'An heirloom in the making. Deep Kanjivaram silk, heavily worked in Aari, with edges finished in gold piping. Designed for the bride who wants the grandeur of an ancestral blouse with the cut of a contemporary silhouette.',
  },
  {
    slug: 'mayil-aari-lehenga-blouse',
    name: 'Mayil Aari Lehenga Blouse',
    price: 13200,
    compare: 17000,
    category: 'bridal',
    material: 'Tissue silk with net panels',
    craftType: 'Aari embroidery, pearl & bead work',
    sizes: 'Custom',
    colors: 'Ivory Gold, Blush, Mint',
    tags: 'bridal,wedding,limited',
    productionTime: 'Made to order — 3 weeks',
    stock: 0,
    isLimited: true,
    isMadeToOrder: true,
    featured: true,
    careInstructions: 'Dry clean only. Store padded.',
    shippingInfo: 'Limited bridal capsule — stitched to your measurements.',
    description:
      'A dancing mayil — peacock — is rendered pearl by pearl across the net panels of this wedding blouse. The front stays clean and structured; the back is pure theatre. Built for lehengas, receptions, and photographs that will be kept for decades.',
  },
  {
    slug: 'mogra-motif-half-saree-blouse',
    name: 'Mogra Motif Half-Saree Blouse',
    price: 4450,
    category: 'designer-blouses',
    material: 'Georgette with silk handwork',
    craftType: 'Mogra flower hand embroidery',
    sizes: 'XS,S,M,L,XL,Custom',
    colors: 'Ivory, Mint, Peach',
    tags: 'festive,south-indian,powder',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 9,
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'Mogra buds — the flower of Tamil weddings — are hand-embroidered down the front yoke of this georgette blouse. Made for half-sarees and langa voni celebrations, with a dori detail at the back and a covered placket.',
  },
  {
    slug: 'chettinad-zari-cotton-blouse',
    name: 'Chettinad Zari Cotton Blouse',
    price: 2800,
    compare: 3600,
    category: 'designer-blouses',
    material: 'Chettinad cotton',
    craftType: 'Checked weave, zari border',
    sizes: 'XS,S,M,L,XL,Custom',
    colors: 'Deep Red, Mustard, Teal',
    tags: 'cotton,everyday,bestseller',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 18,
    isBestseller: true,
    featured: true,
    careInstructions: 'Gentle hand wash separately. Dry in shade.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'The beloved Chettinad check, bordered with a sliver of zari, cut into a crisp, no-fuss blouse. Everyday luxury in the truest sense — the piece our regulars reorder in colour after colour.',
  },
  {
    slug: 'temple-bordered-kanchipuram-saree',
    name: 'Temple-Bordered Kanchipuram Saree',
    price: 18900,
    category: 'sarees',
    material: 'Pure Kanjivaram silk',
    craftType: 'Handwoven with temple border',
    sizes: 'Free Size',
    colors: 'Burgundy with Gold',
    tags: 'bridal,silk,wedding',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 2,
    careInstructions: 'Dry clean only. Store in cotton.',
    shippingInfo: 'Ships in protective silk wrap.',
    description:
      'A pure Kanjivaram with a wide temple border woven in gold — the kind of saree that answers the question “what should I wear to my own wedding reception?” Heavy, regal, and entirely timeless.',
  },
  {
    slug: 'kalamkari-handloom-saree',
    name: 'Kalamkari Handloom Saree',
    price: 6250,
    category: 'sarees',
    material: 'Cotton handloom',
    craftType: 'Kalamkari block print',
    sizes: 'Free Size',
    colors: 'Indigo, Natural',
    tags: 'handloom,everyday',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 6,
    careInstructions: 'Hand wash separately, cold water. Dry in shade.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'Block-printed kalamkari panels drift across a breathable cotton handloom — the work of artisans who have printed this pattern for generations. Devotion to craft you can feel in the hand.',
  },
  {
    slug: 'soft-tassel-silk-saree',
    name: 'Soft-Tassel Silk Saree',
    price: 8400,
    compare: 10500,
    category: 'sarees',
    material: 'Soft mulberry silk',
    craftType: 'Tassel-trimmed pallu',
    sizes: 'Free Size',
    colors: 'Blush, Powder Blue, Sage',
    tags: 'silk,new,festive',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 5,
    isNew: true,
    featured: true,
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'Soft mulberry silk with a feather-light hand and a pallu trimmed in silk tassels. The palette is the point — gentle pastels that photograph beautifully at afternoon weddings and mehndi functions.',
  },
  {
    slug: 'kantha-stitch-designer-saree',
    name: 'Kantha Stitch Designer Saree',
    price: 7750,
    category: 'sarees',
    material: 'Silk-cotton blend',
    craftType: 'Kantha hand stitch',
    sizes: 'Free Size',
    colors: 'Ivory, Dusty Rose, Grey',
    tags: 'handwork,festive',
    productionTime: 'Ready to ship in 3–4 days',
    stock: 4,
    careInstructions: 'Dry clean or gentle hand wash.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'Kantha running stitch — worked by hand, row after row — gives this silk-cotton saree its quiet texture. Designers wear it for its restraint; bridesmaids, for its grace.',
  },
  {
    slug: 'aari-embroidered-catalogue-blouse',
    name: 'Aari Embroidered Catalogue Blouse',
    price: 5600,
    category: 'aari-couture',
    material: 'Raw silk',
    craftType: 'Aari beaded embroidery',
    sizes: 'XS,S,M,L,XL,Custom',
    colors: 'Ivory, Gold, Teal',
    tags: 'aari,daily,festive',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 8,
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'A catalogue-worthy Aari piece: dense beadwork on the yoke, clean lines everywhere else. Made for the woman who wants a handcrafted bite without a bridal budget, worn easily under a blazer or with a crisp saree.',
  },
  {
    slug: 'antique-gold-celebration-saree',
    name: 'Antique Gold Celebration Saree',
    price: 11300,
    compare: 13900,
    category: 'sarees',
    material: 'Antique tissue silk',
    craftType: 'Antique gold zari border',
    sizes: 'Free Size',
    colors: 'Antique Gold',
    tags: 'silk,festive,celebration,bestseller',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 3,
    isBestseller: true,
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'Antique gold tissue with a broad zari border — our most-requested saree for ceremonies from sangeet to Simha. It catches candlelight the way old tissue silk does, and never looks like anything else on the rack.',
  },
  {
    slug: 'royal-heritage-saree',
    name: 'Royal Heritage Saree',
    price: 15500,
    category: 'bridal',
    material: 'Heritage silk',
    craftType: 'Handwoven with zari',
    sizes: 'Free Size',
    colors: 'Deep Red, Royal Green',
    tags: 'bridal,wedding',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 2,
    careInstructions: 'Dry clean only. Store in cotton cloth.',
    shippingInfo: 'Ships in protective silk wrap.',
    description:
      'A heritage silk woven to the width of royal sarees, in colours chosen to frame jewellery. Paired with one of our bridal blouses, it becomes a complete trousseau statement.',
  },
  {
    slug: 'zari-embroidered-party-blouse',
    name: 'Zari Embroidered Party Blouse',
    price: 3450,
    category: 'designer-blouses',
    material: 'Viscose satin',
    craftType: 'Zari embroidery',
    sizes: 'XS,S,M,L,XL,Custom',
    colors: 'Black, Emerald, Royal Blue',
    tags: 'party,new,evening',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 14,
    isNew: true,
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'Bold zari geometrics on a liquid satin base. Cut slightly longer than a standard blouse with a keyhole back — designed for parties, New Year receptions, and evenings that outlast the playlist.',
  },
  {
    slug: 'pearl-dot-aari-blouse',
    name: 'Pearl Dot Aari Blouse',
    price: 4200,
    category: 'aari-couture',
    material: 'Silk-blend satin',
    craftType: 'Aari pearl dot embroidery',
    sizes: 'XS,S,M,L,XL,Custom',
    colors: 'Ivory, Powder Blue, Blush',
    tags: 'aari,everyday,the-edit',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 11,
    featured: true,
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'Tiny pearls, placed by hand in a scattered-dot Aari pattern across soft satin. Minimal in volume, intricate in execution — the piece that makes office-appropriate look deliberate.',
  },
  {
    slug: 'banaras-silk-fusion-saree',
    name: 'Banarasi Silk Fusion Saree',
    price: 9900,
    compare: 12500,
    category: 'sarees',
    material: 'Banarasi silk-weave',
    craftType: 'Jacquard with gold thread',
    sizes: 'Free Size',
    colors: 'Sage, Ivory Gold, Terracotta',
    tags: 'silk,fusion,the-edit',
    productionTime: 'Ready to ship in 2–3 days',
    stock: 5,
    featured: true,
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Ships from Coimbatore within 2–3 business days.',
    description:
      'A Banarasi weave reimagined for lighter drapes — all of the gold-thread richness, half the weight. The fusion saree our styling clients reach for when classic silks feel too formal.',
  },
];

const TESTIMONIALS = [
  {
    author: 'Haritha',
    role: 'Bridal client',
    location: 'Coimbatore',
    content:
      'The blouse for my reception felt like it was made exactly for me — because it was. Every measurement, every bead of Aari work, they listened to everything.',
    rating: 5,
    featured: true,
    sortOrder: 1,
  },
  {
    author: 'Sowmya',
    role: 'Custom couture client',
    location: 'Chennai',
    content:
      'I sent a photo of an old family blouse and they rebuilt it, better than the original. The finish is flawless.',
    rating: 5,
    featured: true,
    sortOrder: 2,
  },
  {
    author: 'Lakshmi',
    role: 'Regular client',
    location: 'Tiruppur',
    content:
      'Their Aari blouses are the most beautiful in the region, and the fitting is spot-on every single time.',
    rating: 5,
    featured: true,
    sortOrder: 3,
  },
];

const SITE_CONTENT: Record<string, string> = {
  'hero.headline': 'Crafted to be remembered',
  'hero.subtext':
    'Designer couture, intricate Aari artistry, and custom creations crafted for your most special moments.',
  'hero.image': IMG.hero,
  'aari.image': IMG.aariStory,
  'store.hours': 'Mon–Sat, 10:00 AM – 8:00 PM · Sunday by appointment',
  'whatsapp.message':
    "Hi JGTHS, I'd like to know more about your boutique and couture services.",
};

async function main() {
  console.log('Seeding JGTHS boutique…');

  // Categories
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: c,
    });
  }
  const categorySlugs = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id]),
  );

  // Products
  for (const p of PRODUCTS) {
    const images = PRODUCT_IMAGES[p.slug] || [];
    const { compare: _compare, category: _cat, featured, ...productFields } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        ...productFields,
        isFeatured: featured ?? false,
        compareAtPrice: p.compare ?? null,
        categoryId: categorySlugs[p.category],
        images: {
          create: images.map((url, i) => ({
            url,
            alt: `${p.name} — view ${i + 1}`,
            sortOrder: i,
          })),
        },
        variants: {
          create: (p.sizes === 'Free Size' ? ['Free Size'] : p.sizes.split(','))
            .map((size, i) => ({
              sku: `${p.slug.toUpperCase().replace(/-/g, '_')}_${i}`,
              size,
              stock: p.stock,
              isDefault: i === 0,
            })),
        },
      },
      update: {
        ...productFields,
        isFeatured: featured ?? false,
        compareAtPrice: p.compare ?? null,
        categoryId: categorySlugs[p.category],
      },
    });
  }

  // Users
  const adminPassword = bcrypt.hashSync('admin123', 12);
  const customerPassword = bcrypt.hashSync('customer123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@jgthscouture.in' },
    create: {
      name: 'Boutique Administrator',
      email: 'admin@jgthscouture.in',
      phone: SITE.phone.replace(/\D/g, ''),
      password: adminPassword,
      role: 'ADMIN',
    },
    update: {},
  });

  const customer = await prisma.user.upsert({
    where: { email: 'priya@example.com' },
    create: {
      name: 'Priya Raman',
      email: 'priya@example.com',
      phone: '9876501234',
      password: customerPassword,
      role: 'CUSTOMER',
    },
    update: {},
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'meera@example.com' },
    create: {
      name: 'Meera Krishnan',
      email: 'meera@example.com',
      phone: '9876505678',
      password: customerPassword,
      role: 'CUSTOMER',
    },
    update: {},
  });

  // Addresses
  await prisma.address.deleteMany({ where: { userId: customer.id } });
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Home',
      fullName: 'Priya Raman',
      phone: '9876501234',
      line1: '12, Sai Baba Colony',
      line2: 'RS Puram',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641002',
      isDefault: true,
    },
  });

  // Measurement profiles
  await prisma.measurementProfile.deleteMany({ where: { userId: customer.id } });
  await prisma.measurementProfile.createMany({
    data: [
      {
        userId: customer.id,
        name: 'Wedding Blouse',
        bust: '34',
        waist: '30',
        shoulder: '14',
        sleeveLength: '9',
        armhole: '16',
        blouseLength: '14',
        frontNeckDepth: '8',
        backNeckDepth: '10',
        isDefault: true,
      },
      {
        userId: customer.id,
        name: 'Daily Saree',
        bust: '34',
        waist: '30',
        shoulder: '14',
        sleeveLength: '6',
        armhole: '16',
        blouseLength: '12',
        frontNeckDepth: '6',
        backNeckDepth: '8',
      },
      {
        userId: customer.id,
        name: 'Mother',
        bust: '38',
        waist: '34',
        shoulder: '15',
        sleeveLength: '10',
        armhole: '18',
        blouseLength: '15',
        frontNeckDepth: '7',
        backNeckDepth: '9',
      },
    ],
  });

  // Coupons
  const coupons = [
    {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      value: 10,
      minOrderValue: 2000,
      maxDiscount: 1500,
      active: true,
      usageLimit: 100,
    },
    {
      code: 'DIWALI500',
      type: 'FIXED',
      value: 500,
      minOrderValue: 5000,
      active: true,
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    },
    {
      code: 'THEEDIT15',
      type: 'PERCENTAGE',
      value: 15,
      minOrderValue: 8000,
      maxDiscount: 2500,
      active: true,
    },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      create: c,
      update: c,
    });
  }

  // Demo order
  const orderProducts = await prisma.product.findMany({
    where: { slug: { in: ['royal-peacock-aari-blouse', 'chettinad-zari-cotton-blouse'] } },
  });
  const blouse = orderProducts.find((p) => p.slug === 'royal-peacock-aari-blouse');
  const daily = orderProducts.find((p) => p.slug === 'chettinad-zari-cotton-blouse');

  const existingOrders = await prisma.order.count();
  if (existingOrders === 0 && blouse && daily) {
    const subtotal = blouse.price.toNumber() + daily.price.toNumber();
    const shipping = subtotal >= 10000 ? 0 : 150;
    await prisma.order.create({
      data: {
        orderNumber: 'JGTHS-1042',
        userId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || '9876501234',
        shippingAddress:
          '12, Sai Baba Colony, RS Puram, Coimbatore, Tamil Nadu 641002',
        subtotal,
        discount: 0,
        shipping,
        total: subtotal + shipping,
        status: 'IN_PRODUCTION',
        paymentStatus: 'PAID',
        items: {
          create: [
            {
              productId: blouse.id,
              productName: blouse.name,
              productImage:
                PRODUCT_IMAGES['royal-peacock-aari-blouse']?.[0] ?? null,
              size: 'M',
              sku: blouse.sku,
              unitPrice: blouse.price,
              quantity: 1,
              totalPrice: blouse.price,
            },
            {
              productId: daily.id,
              productName: daily.name,
              productImage: PRODUCT_IMAGES['chettinad-zari-cotton-blouse']?.[0] ?? null,
              size: 'M',
              sku: daily.sku,
              unitPrice: daily.price,
              quantity: 2,
              totalPrice: daily.price.toNumber() * 2,
            },
          ],
        },
        payments: {
          create: [{ amount: subtotal + shipping, status: 'PAID', method: 'UPI' }],
        },
      },
    });
  }

  // Custom orders (demo)
  const customCount = await prisma.customOrder.count();
  if (customCount === 0) {
    await prisma.customOrder.create({
      data: {
        orderNumber: 'CO-1001',
        userId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || '9876501234',
        creationType: 'Bridal Blouse',
        occasion: 'Wedding',
        preferredColor: 'Antique Gold',
        fabric: 'Kanjivaram silk',
        embroideryStyle: 'Aari with zardozi',
        neckDesign: 'V-neck with pearl edging',
        sleeveDesign: 'Three-quarter',
        backDesign: 'Deep U with tassels',
        additionalNotes:
          'I have an old family blouse I will bring for reference. Needs to match a maroon Kanchipuram saree.',
        standardSize: 'Custom',
        useCustomMeasurements: true,
        measurementsSummary:
          'Bust: 34, Waist: 30, Shoulder: 14, Sleeve length: 9, Armhole: 16, Blouse length: 14, Front neck: 8, Back neck: 10',
        deadline: new Date(new Date().setDate(new Date().getDate() + 24)),
        status: 'QUOTE_SENT',
        quoteAmount: 11500,
        quoteNote: 'Including lining, dori, and quality check. Exclusive of shipping.',
        paymentStatus: 'UNPAID',
      },
    });
    await prisma.customOrder.create({
      data: {
        orderNumber: 'CO-1002',
        userId: customer2.id,
        customerName: customer2.name,
        customerEmail: customer2.email,
        customerPhone: customer2.phone || '9876505678',
        creationType: 'Designer Blouse',
        occasion: 'Engagement',
        preferredColor: 'Blush Pink',
        fabric: 'Tissue silk',
        embroideryStyle: 'Light Aari',
        neckDesign: 'Sweetheart',
        sleeveDesign: 'Cap sleeve',
        backDesign: 'Straight with hooks',
        standardSize: 'M',
        useCustomMeasurements: false,
        deadline: new Date(new Date().setDate(new Date().getDate() + 10)),
        status: 'NEW_REQUEST',
        paymentStatus: 'UNPAID',
      },
    });
  }

  // Reviews
  for (const product of orderProducts) {
    await prisma.review.deleteMany({ where: { userId: customer.id, productId: product.id } });
  }
  await prisma.review.upsert({
    where: { userId_productId: { userId: customer.id, productId: blouse!.id } },
    create: {
      userId: customer.id,
      productId: blouse!.id,
      rating: 5,
      title: 'Stitching is flawless',
      content:
        'Received my Royal Peacock blouse ahead of schedule. The Aari work up close is even better than the photos — every bead sits perfectly.',
      approved: true,
    },
    update: {},
  });

  // Site content
  for (const [key, value] of Object.entries(SITE_CONTENT)) {
    await prisma.siteContent.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  // Testimonials
  await prisma.testimonial.deleteMany({});
  for (const t of TESTIMONIALS) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('Seed complete.');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Admin:    admin@jgthscouture.in / admin123');
  console.log('  Customer: priya@example.com    / customer123');
  console.log(`  Boutique: ${SITE.fullAddress}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
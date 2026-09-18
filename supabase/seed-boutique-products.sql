-- ===========================================================================
--  JGTHS Aari Couture — Boutique Products Seed Dataset
--
--  Run this query in Supabase SQL Editor if you want to populate your database
--  with the official JGTHS boutique product catalog and photography.
-- ===========================================================================

-- 1. Insert Categories
insert into public.categories (slug, name, tagline, sort_order)
values
  ('bridal-aari', 'Bridal Aari Blouses', 'Heirloom embroidery & bespoke couture', 1),
  ('designer-blouses', 'Designer Blouses', 'Modern classics & festive statement wear', 2),
  ('designer-sarees', 'Signature Sarees', 'Woven heritage & pure zari drapes', 3),
  ('hand-painted', 'Hand-Painted Fabrics', 'One-of-a-kind brushwork on pure silk', 4),
  ('kids-party-wear', 'Kids Party Wear', 'Little celebrations & royal festive wear', 5)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  sort_order = excluded.sort_order;

-- 2. Insert Boutique Products
insert into public.products (
  slug, title, subtitle, category_slug, price, compare_at_price,
  stock_count, is_made_to_order, fabric, embroidery, description,
  image_urls, is_bestseller, is_active
)
values
  (
    'royal-olive-aari-blouse',
    'Royal Olive Aari Cutwork Blouse',
    'Zardosi, black beads & gold tassels on olive silk',
    'bridal-aari',
    3600, 4200, 5, true,
    'Pure raw silk & tissue lining',
    'Hand Aari — zardosi, gold cutwork, black pearl beads, hanging latkans',
    'Our signature boutique piece. An ornate circular cutwork back encircled with hand-set black pearl beads and golden aari cordwork, finished with handcrafted silk tassels.',
    array['/products/royal-olive-aari-blouse.jpeg'],
    true, true
  ),
  (
    'temple-gopuram-bridal-blouse',
    'Temple Gopuram Bridal Blouse',
    'Antique gold zardosi on rani pink raw silk',
    'bridal-aari',
    4800, 5500, 3, true,
    'Pure Kanjivaram raw silk',
    'Dense architectural temple gopuram in pure antique gold zardosi',
    'Inspired by historic temple carvings of South India. Traced and hooked entirely by hand with pure antique gold zardosi over 60 studio hours.',
    array['/products/temple-gopuram-bridal-blouse.jpeg'],
    true, true
  ),
  (
    'royal-purple-gold-brocade-blouse',
    'Royal Purple & Antique Gold Brocade Blouse',
    'Couture sweetheart neckline with potli button back',
    'bridal-aari',
    2800, 3200, 8, true,
    'Kanchipuram brocade silk',
    'Hand Aari sleeve motifs with antique gold zardosi and woven border',
    'Sculpted sweetheart front with a deep square back fastened with silk potli buttons. Paired with ornate hand-embroidered sleeve motifs.',
    array['/products/royal-purple-gold-brocade-blouse.jpeg'],
    true, true
  ),
  (
    'emerald-floral-pearl-blouse',
    'Emerald Floral Hand-Painted Aari Blouse',
    'Pearl lace borders on botanical painted silk',
    'hand-painted',
    2450, 2800, 6, true,
    'Pure handloom silk',
    'Freehand botanical painting with seed pearl sleeve lace and aari neckline',
    'Rich emerald tones featuring delicate floral brushwork framed by scalloped gold lace and clusters of fresh water seed pearls along the sleeves and neckline.',
    array['/products/emerald-floral-pearl-blouse.jpeg', '/products/emerald-floral-pearl-blouse-side.jpeg'],
    true, true
  ),
  (
    'blush-rose-ruffle-frock',
    'Blush Rose Ruffle Party Frock',
    'Cascading petal pleats with crystal waistline',
    'kids-party-wear',
    1150, 1299, 10, false,
    'Soft crushed tissue silk with breathable cotton lining',
    'Hand-sculpted rose petal bodice with crystal rhinestone belt',
    'A show-stopping party dress for birthdays and celebrations. Sculpted petal texture across the bodice with a voluminous pleated skirt and gentle cotton lining.',
    array['/products/blush-rose-ruffle-frock.jpeg', '/products/blush-rose-ruffle-frock-detail.jpeg'],
    true, true
  ),
  (
    'powder-blue-princess-gown',
    'Powder Blue Off-Shoulder Princess Gown',
    'Ruffled cloud neckline with shimmer belt',
    'kids-party-wear',
    1450, 1699, 7, false,
    'Glimmer organza silk with soft lining',
    'Gathered off-shoulder cloud ruffles with diamond stone waistline',
    'A fairy tale princess dress crafted in shimmering powder blue organza with dramatic gathered neckline and a twirl-worthy layered skirt.',
    array['/products/powder-blue-princess-gown.jpeg', '/products/powder-blue-princess-gown-back.jpeg'],
    true, true
  ),
  (
    'rose-gold-shimmer-dress',
    'Rose Gold Shimmer Floral Dress',
    'Metallic texture with handcrafted 3D corsage',
    'kids-party-wear',
    1150, 1299, 12, false,
    'Metallic woven silk tissue with soft cotton lining',
    'Hand-crafted 3D floral corsage with rhinestone center',
    'Gleaming rose gold metallic tissue designed to catch evening light. Features an off-shoulder fold with a hand-stitched 3D rose bloom.',
    array['/products/rose-gold-shimmer-dress.jpeg', '/products/rose-gold-shimmer-dress-detail.jpeg'],
    false, true
  ),
  (
    'lilac-party-embroidered-dress',
    'Lilac Dream Embroidered Bow Dress',
    'Floral thread embroidery with oversized statement bow',
    'kids-party-wear',
    1199, 1399, 9, false,
    'Pure handloom cotton-linen blend with soft cotton voile lining',
    'All-over floral vine threadwork with scalloped ribbon bow',
    'Pastel elegance with detailed white floral embroidery across a soothing lilac base, topped with a dramatic oversized bow.',
    array['/products/lilac-party-embroidered-dress.jpeg', '/products/lilac-party-embroidered-dress-back.jpeg'],
    false, true
  ),
  (
    'handpainted-pichwai-silk-art',
    'Hand-Painted Pichwai Krishna Silk Fabric',
    'Traditional devotional brushwork with gold outlines',
    'hand-painted',
    4500, 5200, 4, true,
    'Pure raw tussar silk',
    'Freehand Pichwai painting depicting Govardhan Krishna and Kamadhenu cows with metallic gold detailing',
    'Heirloom textile art painted entirely freehand by master artisans using traditional natural mineral pigments and liquid gold ink.',
    array['/products/handpainted-pichwai-silk-art.jpeg'],
    true, true
  ),
  (
    'coral-peacock-handpainted-blouse',
    'Coral Pink Hand-Painted Peacock Blouse',
    'Ruby stone work and gold aari feathers',
    'hand-painted',
    2100, 2500, 6, true,
    'Pure raw silk',
    'Hand-painted royal peacock motifs embellished with ruby crystals and gold zari outline',
    'Vibrant coral pink silk featuring majestic painted peacocks across the sleeves, accented with sparkling ruby red crystals and gold threadwork.',
    array['/products/coral-peacock-handpainted-blouse.jpeg', '/products/coral-peacock-handpainted-blouse-detail.jpeg'],
    false, true
  ),
  (
    'handpainted-lotus-maharani-portrait',
    'Lotus Maharani Hand-Embroidered Portrait Fabric',
    'Silk thread shading with pearl and gold jewellery work',
    'hand-painted',
    5800, 6500, 2, true,
    'Handwoven raw silk canvas',
    'Micro-needle thread embroidery with pearl beads, gold jhumkas and lotus motif',
    'Museum-grade portraiture embroidery capturing a Maharani in traditional attire with miniature jewelry and shaded lotus petals.',
    array['/products/handpainted-lotus-maharani-portrait.jpeg'],
    false, true
  ),
  (
    'sage-cutwork-puff-sleeve-blouse',
    'Sage Green Cutwork Puff-Sleeve Blouse',
    'Keyhole back with gold scalloped lace',
    'designer-blouses',
    1850, 2200, 8, true,
    'Linen silk blend with tie-dye puff sleeves',
    'Circular loop neck detail with gold lace and hanging dori latkans',
    'A blend of vintage puff sleeves with contemporary back cutwork. Contrasting gold scallop borders with matching back tie-ups.',
    array['/products/sage-cutwork-puff-sleeve-blouse.jpeg'],
    false, true
  ),
  (
    'rani-pink-zari-scallop-blouse',
    'Rani Pink Contrast Scallop Blouse',
    'Broad gold temple border with navy floral brocade',
    'designer-blouses',
    1650, 1950, 11, true,
    'Pure raw silk with woven zari border',
    'Diamond back keyhole with scallop sleeve hems and gold ball trim',
    'Striking rani pink base accented by diagonal navy floral brocade panels and scalloped hand-stitched sleeve borders.',
    array['/products/rani-pink-zari-scallop-blouse.jpeg', '/products/rani-pink-zari-scallop-blouse-back.jpeg'],
    false, true
  )
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  category_slug = excluded.category_slug,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  stock_count = excluded.stock_count,
  is_made_to_order = excluded.is_made_to_order,
  fabric = excluded.fabric,
  embroidery = excluded.embroidery,
  description = excluded.description,
  image_urls = excluded.image_urls,
  is_bestseller = excluded.is_bestseller,
  is_active = excluded.is_active;

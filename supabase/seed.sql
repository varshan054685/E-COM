-- ===========================================================================
--  Aari Couture — demo data
--
--  Run AFTER schema.sql. Safe to re-run (uses upserts and stable identifiers).
--  Delete this file's contents from your project once real data is live.
-- ===========================================================================

-- ---------------------------------------------------------------------------
--  Products across the three admin categories
-- ---------------------------------------------------------------------------

insert into public.products
  (slug, title, subtitle, category_slug, price, compare_at_price, stock_count,
   is_made_to_order, fabric, embroidery, description, image_urls)
values
  ('royal-peacock-aari-blouse', 'Royal Peacock Aari Blouse',
   'Zardosi & kundan on raw silk', 'aari-blouse', 24900, 29500, 6, true,
   'Pure raw silk, 60g', 'Hand Aari — zardosi, kundan, French knot',
   'Our signature bridal silhouette. A peacock motif is hooked by hand over 140 studio hours.',
   array['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80']),

  ('pearl-dot-aari-blouse', 'Pearl Dot Aari Blouse',
   'Minimal couture, maximum craft', 'aari-blouse', 12900, null, 14, true,
   'Matka silk', 'Hand Aari — seed pearls on tonal thread',
   'Tonal seed pearls scattered by hand in an even grid, so the blouse reads as texture.',
   array['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80']),

  ('temple-motif-bridal-blouse', 'Temple Motif Bridal Blouse',
   'Antique gold on kanjivaram red', 'aari-blouse', 31500, null, 3, true,
   'Kanjivaram silk blend', 'Aari with antique gold + temple border',
   'Inspired by Chettinad temple carvings, layering a hand-drawn temple border with dense Aari work.',
   array['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80']),

  ('zari-embroidered-party-blouse', 'Zari Embroidered Party Blouse',
   'Statement sleeves', 'aari-blouse', 9800, 11500, 18, false,
   'Georgette with silk lining', 'Machine-guided zari with hand finishing',
   'A versatile evening blouse with a sculpted shoulder and bell sleeve.',
   array['https://images.unsplash.com/photo-1590959651373-a3db0f38a961?auto=format&fit=crop&w=1200&q=80']),

  ('chettinad-zari-cotton-blouse', 'Chettinad Zari Cotton Blouse',
   'Everyday heritage', 'aari-blouse', 6400, null, 0, false,
   'Handloom cotton', 'Fine zari border detail',
   'Breathable handloom cotton with a fine zari edge at the sleeve and neck.',
   array['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80']),

  ('little-maharani-lehenga-set', 'Little Maharani Lehenga Set',
   'Pattu silk, 3-piece', 'kids-wear', 11400, null, 9, false,
   'Soft-lined pattu silk', 'Zari border with gentle Aari accents',
   'A three-piece pattu lehenga fully lined in soft cotton, with an elasticated waist.',
   array['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80']),

  ('festive-pattu-frock', 'Festive Pattu Frock',
   'Twirl-approved', 'kids-wear', 6900, null, 21, false,
   'Pattu silk with cotton lining', 'Zari trim and hand-finished hem',
   'Cut with a full circle skirt so it actually twirls.',
   array['https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?auto=format&fit=crop&w=1200&q=80']),

  ('tiny-temple-pattu-set', 'Tiny Temple Pattu Set',
   'Pooja mornings', 'kids-wear', 5400, 6200, 2, false,
   'Art silk', 'Woven temple border',
   'A two-piece pattu set for temple visits and family poojas.',
   array['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80']),

  ('rose-gold-aari-couture', 'Rose Gold Aari Couture Blouse',
   'Metallic thread study', 'hand-painted', 27500, null, 4, true,
   'Hand-painted silk base', 'Rose gold Aari over painted ground',
   'The silk ground is hand-painted in soft washes, then Aari hooked in rose gold over the forms.',
   array['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80']),

  ('hand-painted-tussar-dupatta', 'Hand-Painted Tussar Dupatta',
   'Botanical brushwork', 'hand-painted', 8900, 10500, 12, false,
   'Tussar silk', 'Freehand fabric painting, heat sealed',
   'Botanical forms painted freehand across a tussar ground, then heat sealed.',
   array['https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80']),

  ('painted-organza-cape-blouse', 'Painted Organza Cape Blouse',
   'Modern drape', 'hand-painted', 19800, null, 5, true,
   'Silk organza', 'Hand-painted washes with pearl edging',
   'A cape blouse painted in graded washes from the shoulder down, with a fine pearl edge.',
   array['https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80'])
on conflict (slug) do update set
  title            = excluded.title,
  subtitle         = excluded.subtitle,
  category_slug    = excluded.category_slug,
  price            = excluded.price,
  compare_at_price = excluded.compare_at_price,
  stock_count      = excluded.stock_count,
  is_made_to_order = excluded.is_made_to_order,
  fabric           = excluded.fabric,
  embroidery       = excluded.embroidery,
  description      = excluded.description,
  image_urls       = excluded.image_urls;

-- ---------------------------------------------------------------------------
--  Sample orders — one per pipeline stage, so the tailoring board is populated.
--  user_id is left null; real orders link to an account from the storefront.
-- ---------------------------------------------------------------------------

insert into public.orders
  (order_number, customer_name, customer_email, customer_phone, shipping_address,
   total, status, payment_status, is_made_to_measure, measurements, reference_images, notes, placed_at)
values
  ('ORD-2026-1001', 'Priya Raman', 'priya@example.com', '+91 98430 11223',
   '12 Kasturi Nagar, Coimbatore, Tamil Nadu 641045', 24900, 'in_embroidery', 'paid', true,
   '{"unit":"in","bust":"34","waist":"28","shoulder":"14.5","armhole":"16","length":"15"}'::jsonb,
   array[]::text[], 'Deep back with a hook closure. Wedding on the 14th.', now() - interval '9 days'),

  ('ORD-2026-1002', 'Ananya Krishnan', 'ananya@example.com', '+91 99620 44556',
   '8 Lake View Road, Chennai, Tamil Nadu 600028', 11400, 'received', 'pending', false,
   null, array[]::text[], 'Ships before the 20th please.', now() - interval '2 days'),

  ('ORD-2026-1003', 'Meera Subramanian', 'meera@example.com', '+91 94870 77889',
   '44 Anna Salai, Coimbatore, Tamil Nadu 641018', 31500, 'stitched', 'paid', true,
   '{"unit":"cm","bust":"88","waist":"72","shoulder":"37","armhole":"41","length":"38"}'::jsonb,
   array[]::text[], 'Match the temple border on the saree pallu.', now() - interval '21 days'),

  ('ORD-2026-1004', 'Divya Balaji', 'divya@example.com', '+91 90035 22114',
   '3 Green Park, Erode, Tamil Nadu 638001', 15800, 'dispatched', 'paid', false,
   null, array[]::text[], null, now() - interval '34 days')
on conflict (order_number) do nothing;

-- Line items -----------------------------------------------------------------

insert into public.order_items (order_id, product_id, title, size, color, quantity, unit_price)
select o.id, p.id, p.title, 'M', 'Emerald', 1, p.price
from public.orders o
join public.products p on p.slug = 'royal-peacock-aari-blouse'
where o.order_number = 'ORD-2026-1001'
  and not exists (select 1 from public.order_items i where i.order_id = o.id);

insert into public.order_items (order_id, product_id, title, size, color, quantity, unit_price)
select o.id, p.id, p.title, '6-7Y', 'Magenta', 1, p.price
from public.orders o
join public.products p on p.slug = 'little-maharani-lehenga-set'
where o.order_number = 'ORD-2026-1002'
  and not exists (select 1 from public.order_items i where i.order_id = o.id);

insert into public.order_items (order_id, product_id, title, size, color, quantity, unit_price)
select o.id, p.id, p.title, 'S', 'Gold', 1, p.price
from public.orders o
join public.products p on p.slug = 'temple-motif-bridal-blouse'
where o.order_number = 'ORD-2026-1003'
  and not exists (select 1 from public.order_items i where i.order_id = o.id);

insert into public.order_items (order_id, product_id, title, size, color, quantity, unit_price)
select o.id, p.id, p.title, 'Free size', 'Ivory', 1, p.price
from public.orders o
join public.products p on p.slug = 'hand-painted-tussar-dupatta'
where o.order_number = 'ORD-2026-1004'
  and not exists (select 1 from public.order_items i where i.order_id = o.id);

insert into public.order_items (order_id, product_id, title, size, color, quantity, unit_price)
select o.id, p.id, p.title, 'L', 'Magenta', 1, p.price
from public.orders o
join public.products p on p.slug = 'festive-pattu-frock'
where o.order_number = 'ORD-2026-1004'
  and not exists (
    select 1 from public.order_items i
    where i.order_id = o.id and i.title = p.title
  );

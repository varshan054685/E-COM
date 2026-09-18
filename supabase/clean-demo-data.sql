-- ===========================================================================
--  Aari Couture — Clean / Delete Seeded Datasets
--
--  Run this once in the Supabase SQL Editor if you previously ran seed.sql
--  and want to wipe all demo products, demo orders, and demo line items.
-- ===========================================================================

-- 1. Remove demo order line items
delete from public.order_items
where order_id in (
  select id from public.orders
  where order_number in ('ORD-2026-1001', 'ORD-2026-1002', 'ORD-2026-1003', 'ORD-2026-1004')
);

-- 2. Remove demo orders
delete from public.orders
where order_number in ('ORD-2026-1001', 'ORD-2026-1002', 'ORD-2026-1003', 'ORD-2026-1004');

-- 3. Remove demo products (seeded demo products from seed.sql)
delete from public.products
where slug in (
  'royal-peacock-aari-blouse',
  'pearl-dot-aari-blouse',
  'temple-motif-bridal-blouse',
  'zari-embroidered-party-blouse',
  'chettinad-zari-cotton-blouse',
  'little-maharani-lehenga-set',
  'festive-pattu-frock',
  'tiny-temple-pattu-set',
  'rose-gold-aari-couture',
  'hand-painted-tussar-dupatta',
  'painted-organza-cape-blouse'
);

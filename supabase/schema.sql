-- ===========================================================================
--  Aari Couture — Supabase schema
--
--  Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
--  It is idempotent: re-running it will not duplicate data or error out.
--
--  After running it, promote your own account to admin:
--    update public.profiles set role = 'admin' where email = 'you@example.com';
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
--  Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('received', 'in_embroidery', 'stitched', 'dispatched');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'paid', 'refunded', 'failed');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
--  Tables
-- ---------------------------------------------------------------------------

-- Mirrors auth.users so the admin can list and contact customers.
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  full_name      text,
  email          text,
  phone          text,
  role           public.user_role not null default 'customer',
  last_active_at timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

create table if not exists public.categories (
  slug       text primary key,
  name       text not null,
  tagline    text,
  sort_order int  not null default 0
);

create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  subtitle         text,
  category_slug    text not null references public.categories (slug) on update cascade,
  price            numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
  stock_count      int  not null default 0 check (stock_count >= 0),
  is_made_to_order boolean not null default false,
  fabric           text,
  embroidery       text,
  description      text,
  image_urls       text[] not null default '{}',
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_slug);
create index if not exists products_stock_idx    on public.products (stock_count);

create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text not null unique,
  user_id            uuid references auth.users (id) on delete set null,
  customer_name      text not null,
  customer_email     text,
  customer_phone     text,
  shipping_address   text,
  total              numeric(10, 2) not null default 0 check (total >= 0),
  status             public.order_status   not null default 'received',
  payment_status     public.payment_status not null default 'pending',
  is_made_to_measure boolean not null default false,
  -- { "unit": "in", "bust": "34", "waist": "28", "shoulder": "14.5", "armhole": "16" }
  measurements       jsonb,
  reference_images   text[] not null default '{}',
  notes              text,
  placed_at          timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists orders_status_idx  on public.orders (status);
create index if not exists orders_user_idx    on public.orders (user_id);
create index if not exists orders_placed_idx  on public.orders (placed_at desc);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  title      text not null,
  size       text,
  color      text,
  quantity   int not null default 1 check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  image_url  text
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------------------------------------------------------------------------
--  updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
--  Profile bootstrap on sign-up
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    case
      when lower(coalesce(new.email, '')) = 'jagathees.offic@gmail.com' then 'admin'::public.user_role
      else 'customer'::public.user_role
    end
  )
  on conflict (id) do update set
    role = case
      when lower(coalesce(excluded.email, '')) = 'jagathees.offic@gmail.com' then 'admin'::public.user_role
      else public.profiles.role
    end;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
--  Admin helper — SECURITY DEFINER so RLS on profiles cannot recurse.
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
--  Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles    enable row level security;
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- profiles ------------------------------------------------------------------
drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: update own or admin" on public.profiles;
create policy "profiles: update own or admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- categories ----------------------------------------------------------------
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories
  for select using (true);

drop policy if exists "categories: admin write" on public.categories;
create policy "categories: admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- products ------------------------------------------------------------------
-- The storefront reads active products anonymously; admins see everything.
drop policy if exists "products: public read active" on public.products;
create policy "products: public read active" on public.products
  for select using (is_active or public.is_admin());

drop policy if exists "products: admin write" on public.products;
create policy "products: admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- orders --------------------------------------------------------------------
drop policy if exists "orders: read own or admin" on public.orders;
create policy "orders: read own or admin" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders: insert own" on public.orders;
create policy "orders: insert own" on public.orders
  for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders: admin update" on public.orders;
create policy "orders: admin update" on public.orders
  for update using (public.is_admin());

drop policy if exists "orders: admin delete" on public.orders;
create policy "orders: admin delete" on public.orders
  for delete using (public.is_admin());

-- order items ---------------------------------------------------------------
drop policy if exists "order_items: read with order" on public.order_items;
create policy "order_items: read with order" on public.order_items
  for select using (
    public.is_admin()
    or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists "order_items: insert with order" on public.order_items;
create policy "order_items: insert with order" on public.order_items
  for insert with check (
    public.is_admin()
    or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists "order_items: admin write" on public.order_items;
create policy "order_items: admin write" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
--  Storage — product photography (public) and customer references (private)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('reference-images', 'reference-images', false)
on conflict (id) do nothing;

drop policy if exists "product images: public read" on storage.objects;
create policy "product images: public read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product images: admin write" on storage.objects;
create policy "product images: admin write" on storage.objects
  for all using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "reference images: owner or admin read" on storage.objects;
create policy "reference images: owner or admin read" on storage.objects
  for select using (
    bucket_id = 'reference-images'
    and (public.is_admin() or owner = auth.uid())
  );

drop policy if exists "reference images: owner write" on storage.objects;
create policy "reference images: owner write" on storage.objects
  for insert with check (bucket_id = 'reference-images' and owner = auth.uid());

-- ---------------------------------------------------------------------------
--  Categories (the three houses in the brief)
-- ---------------------------------------------------------------------------

insert into public.categories (slug, name, tagline, sort_order) values
  ('aari-blouse',  'Aari Blouse',          'Hand-hooked couture',  1),
  ('kids-wear',    'Kids Wear',            'Little celebrations',  2),
  ('hand-painted', 'Hand-Painted Fabric',  'One of a kind',        3)
on conflict (slug) do update
  set name = excluded.name, tagline = excluded.tagline, sort_order = excluded.sort_order;

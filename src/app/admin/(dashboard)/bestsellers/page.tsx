import type { Metadata } from 'next';

import { BestsellersManager } from '@/components/admin/bestsellers-manager';
import { SetupNotice } from '@/components/admin/setup-notice';
import { listProducts } from '@/lib/admin/queries';
import { CATEGORIES, getAllProducts } from '@/lib/catalog';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { AdminProduct } from '@/lib/admin/constants';

export const metadata: Metadata = {
  title: 'Bestsellers Management',
  description: 'Manage featured bestseller products in the storefront',
};

export default async function AdminBestsellersPage() {
  const dbProducts = await listProducts();

  // If Supabase is connected and has products, use them. Otherwise, fall back to the catalog products.
  const products: AdminProduct[] =
    isSupabaseConfigured && dbProducts.length > 0
      ? dbProducts
      : getAllProducts().map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle || null,
          category_slug: p.category,
          price: p.price,
          compare_at_price: p.compareAtPrice ?? null,
          stock_count: 10,
          is_made_to_order: Boolean(p.madeToOrder),
          fabric: p.fabric || null,
          embroidery: p.embroidery || null,
          description: p.description || null,
          image_urls: p.images,
          is_bestseller: Boolean(p.bestseller),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

  const categoryOptions = CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  return (
    <div className="flex flex-col gap-7">
      {!isSupabaseConfigured ? <SetupNotice /> : null}
      <BestsellersManager initialProducts={products} categories={categoryOptions} />
    </div>
  );
}

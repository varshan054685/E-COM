import type { Metadata } from 'next';
import { Package } from 'lucide-react';

import { ProductsTable } from '@/components/admin/products-table';
import { SetupNotice } from '@/components/admin/setup-notice';
import { listProducts } from '@/lib/admin/queries';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata: Metadata = { title: 'Products' };

/** The three houses from the brief; mirrors the categories table. */
const CATEGORIES = [
  { slug: 'aari-blouse', name: 'Aari Blouse' },
  { slug: 'kids-wear', name: 'Kids Wear' },
  { slug: 'hand-painted', name: 'Hand-Painted Fabric' },
];

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-600">Catalogue</p>
          <h1 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">Products</h1>
          <p className="mt-2.5 text-sm text-muted-foreground">
            {isSupabaseConfigured
              ? `${products.length} ${products.length === 1 ? 'piece' : 'pieces'} across ${CATEGORIES.length} categories.`
              : 'Product management needs a database connection.'}
          </p>
        </div>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Package className="size-3.5" aria-hidden="true" />
          Low stock flagged at 5 units or fewer
        </p>
      </header>

      {!isSupabaseConfigured ? <SetupNotice /> : null}

      <ProductsTable products={products} categories={CATEGORIES} />
    </div>
  );
}

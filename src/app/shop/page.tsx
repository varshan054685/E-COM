import type { Metadata } from 'next';
import Link from 'next/link';

import { ProductGrid } from '@/components/product/product-grid';
import { ShopFilters } from '@/components/product/shop-filters';
import { Button } from '@/components/ui/button';
import {
  CATEGORIES,
  COLOR_FILTERS,
  PRICE_BANDS,
  PRODUCTS,
  getAllColorNames,
} from '@/lib/catalog';
import {
  applyFilters,
  categoryCounts,
  hasActiveFacets,
  parseFilters,
  type RawSearchParams,
} from '@/lib/shop-filtering';

export const metadata: Metadata = {
  title: 'Shop All',
  description:
    'Browse bridal Aari blouses, signature sarees, hand-painted fabrics and kids party wear — handcrafted in Coimbatore.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const products = applyFilters(filters);

  const counts = categoryCounts();
  const categories = CATEGORIES.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: counts.find((entry) => entry.slug === category.slug)?.count ?? 0,
  }));

  const priceBands = PRICE_BANDS.map((band) => ({ id: band.id, label: band.label }));

  // Only offer colours that actually appear in the catalogue.
  const colors = getAllColorNames().map((name) => ({
    name,
    hex: COLOR_FILTERS.find((swatch) => swatch.name === name)?.hex ?? '#e7e5e4',
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-gold-600">The collection</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight font-medium text-balance sm:text-5xl">
          Shop All
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every piece is finished by hand in our studio. Looking for something that
          does not exist yet?{' '}
          <Link
            href="/custom-orders"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-gold-700"
          >
            Commission it
          </Link>
          .
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <ShopFilters
          active={filters}
          categories={categories}
          priceBands={priceBands}
          colors={colors}
          resultCount={products.length}
        />

        <div>
          <p className="mb-8 hidden text-sm text-muted-foreground lg:block">
            Showing <span className="font-medium text-foreground">{products.length}</span> of{' '}
            {PRODUCTS.length} pieces
          </p>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-ink-200 px-6 py-20 text-center">
              <h2 className="font-serif text-2xl">No pieces match those filters</h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {hasActiveFacets(filters)
                  ? 'Try widening your price range or removing a colour.'
                  : 'The collection is being restocked — please check back shortly.'}
              </p>
              <Button asChild variant="gold" className="mt-2">
                <Link href="/shop">Clear all filters</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

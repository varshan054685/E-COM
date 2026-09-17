import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts, getProductFacets } from '@/lib/catalog';
import { buildSeo } from '@/lib/seo';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ShopToolbar } from '@/components/product/ShopToolbar';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchX } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = buildSeo({
  title: 'Shop the Collection',
  description:
    'Shop handcrafted Aari couture, designer blouses, bridal couture and curated sarees from JGTHS Designer Boutique, Coimbatore.',
  path: '/shop',
});

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === 'string' ? (sp[k] as string) : Array.isArray(sp[k]) ? (sp[k] as string[])[0] : '');

  const [products, facets] = await Promise.all([
    getProducts(
      {
        q: get('q'),
        categorySlug: get('cat') || undefined,
        minPrice: get('min') ? Number(get('min')) : undefined,
        maxPrice: get('max') ? Number(get('max')) : undefined,
        sizes: get('size') ? get('size').split(',').filter(Boolean) : undefined,
        colors: get('color') ? get('color').split(',').filter(Boolean) : undefined,
        craftType: get('craft') || undefined,
        occasion: get('occasion') || undefined,
        availability: (get('avail') as 'in-stock' | 'made-to-order') || undefined,
        sort: get('sort') || 'featured',
      },
    ),
    getProductFacets(),
  ]);

  const q = get('q');

  return (
    <div className="pt-28 lg:pt-36 pb-20">
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <header className="max-w-2xl">
          <p className="editorial-eyebrow mb-3">The Collection</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-charcoal-900">
            {q ? <>Search: <span className="italic">“{q}”</span></> : 'Shop'}
          </h1>
          <p className="mt-4 text-[15px] text-ink-muted">
            {q
              ? `Pieces matching “${q}”.`
              : 'Handcrafted couture, embroidery and curated drapes — every piece made or styled at our Coimbatore boutique.'}
          </p>
        </header>

        <div className="mt-10 flex gap-8">
          <aside className="hidden lg:block w-60 shrink-0" aria-label="Filters">
            <Suspense fallback={<div className="space-y-6"><div className="h-64 bg-charcoal-100/60 animate-pulse" /></div>}>
              <ShopToolbar facets={facets} />
            </Suspense>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="lg:hidden">
              <Suspense fallback={null}>
                <ShopToolbar facets={facets} />
              </Suspense>
            </div>
            <div className="hidden lg:block mt-px" />

            <div className="mt-7 lg:mt-0">
              <Suspense fallback={<ProductGridSkeleton count={8} />}>
                {products.length === 0 ? (
                  <EmptyState
                    icon={<SearchX className="h-8 w-8" strokeWidth={1.3} />}
                    title="Nothing found, just yet"
                    description="Try a different word, or browse the full collection — a piece may be waiting."
                    action={<LinkButton href="/shop" variant="outline">View all pieces</LinkButton>}
                  />
                ) : (
                  <p className="mb-6 text-xs uppercase tracking-widest text-ink-faint">
                    {products.length} {products.length === 1 ? 'piece' : 'pieces'}
                  </p>
                )}
                <ProductGrid products={products} columns={3} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
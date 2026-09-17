import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCategoryBySlug, getProducts, getProductFacets } from '@/lib/catalog';
import { buildSeo } from '@/lib/seo';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ShopToolbar } from '@/components/product/ShopToolbar';
import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchX } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return buildSeo({
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description || `${category.name} by JGTHS.`,
    path: `/collections/${slug}`,
    images: [category.image].filter(Boolean) as string[],
  });
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === 'string' ? sp[k] : '');

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, facets] = await Promise.all([
    getProducts(
      {
        categorySlug: slug,
        q: get('q') || undefined,
        sizes: get('size') ? get('size').split(',').filter(Boolean) : undefined,
        colors: get('color') ? get('color').split(',').filter(Boolean) : undefined,
        availability: (get('avail') as 'in-stock' | 'made-to-order') || undefined,
        sort: get('sort') || 'featured',
      },
    ),
    getProductFacets(),
  ]);

  return (
    <div className="pt-20 pb-20">
      {/* Editorial header */}
      <header className="relative flex min-h-[52vh] items-end overflow-hidden bg-charcoal-900">
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/30 to-transparent" />
        <div className="relative mx-auto w-full max-w-shell px-4 sm:px-6 lg:px-10 pb-12 pt-32">
          <p className="editorial-eyebrow mb-4">The {category.name} Collection</p>
          <h1 className="font-serif text-4xl lg:text-6xl text-ivory-50">{category.name}</h1>
          {category.description && (
            <p className="mt-4 max-w-xl text-[15px] text-ivory-100/80 leading-relaxed">{category.description}</p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <div className="mt-10 flex gap-8">
          <aside className="hidden lg:block w-60 shrink-0">
            <Suspense fallback={null}>
              <ShopToolbar facets={facets} />
            </Suspense>
          </aside>
          <div className="flex-1 min-w-0">
            <div className="lg:hidden">
              <Suspense fallback={null}>
                <ShopToolbar facets={facets} />
              </Suspense>
            </div>
            <div className="mt-7 lg:mt-0">
              {products.length === 0 ? (
                <EmptyState
                  icon={<SearchX className="h-8 w-8" strokeWidth={1.3} />}
                  title="Nothing in this edit, yet"
                  description="New pieces are added often. Browse the full collection in the meantime."
                  action={<LinkButton href="/shop" variant="outline">Shop everything</LinkButton>}
                />
              ) : (
                <p className="mb-6 text-xs uppercase tracking-widest text-ink-faint">{products.length} {products.length === 1 ? 'piece' : 'pieces'}</p>
              )}
              <ProductGrid products={products} columns={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
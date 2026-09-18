import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Package, Sparkles } from 'lucide-react';

import { AddToBagPanel } from '@/components/product/add-to-bag-panel';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductGrid } from '@/components/product/product-grid';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { getAllProducts, getProductBySlug, getRelatedProducts } from '@/lib/catalog';
import { discountPercent } from '@/lib/format';
import { SITE } from '@/lib/site';

type PageProps = { params: Promise<{ slug: string }> };

/** Pre-render every product at build time. */
export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: 'Piece not found' };

  return {
    title: product.title,
    description: product.description.slice(0, 158),
    openGraph: {
      title: product.title,
      description: product.subtitle,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const discount = discountPercent(product.price, product.compareAtPrice);

  // Structured data helps the piece surface correctly in search results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images,
    brand: { '@type': 'Brand', name: SITE.name },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Product data is authored in this repo, so it is safe to inline.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-14 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 text-ink-200">/</span>
          <Link href="/shop" className="transition-colors hover:text-foreground">
            Shop
          </Link>
          <span className="mx-2 text-ink-200">/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="capitalize transition-colors hover:text-foreground"
          >
            {product.category.replace(/-/g, ' ')}
          </Link>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery
            images={product.images}
            title={product.title}
            badge={discount > 0 ? `−${discount}%` : undefined}
          />
          <AddToBagPanel product={product} />
        </div>

        {/* Craft notes */}
        <section className="mt-20 grid grid-cols-1 gap-10 border-t border-ink-100 pt-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow text-gold-600">The piece</p>
            <h2 className="mt-3 font-serif text-2xl leading-snug font-medium sm:text-3xl">
              Crafted by hand, in {SITE.city}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {product.description}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="flex flex-col gap-4 rounded-xl border border-ink-100 bg-card p-6 sm:p-7">
              {product.details.map((detail) => (
                <li key={detail} className="flex gap-3 text-sm leading-relaxed text-ink-500">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden="true" />
                  {detail}
                </li>
              ))}
              <li className="flex gap-3 border-t border-ink-100 pt-4 text-sm leading-relaxed text-ink-500">
                <Package className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden="true" />
                Ships in signature packaging from {SITE.city}. See our{' '}
                <Link
                  href="/policies/shipping-returns"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  shipping &amp; returns
                </Link>{' '}
                policy.
              </li>
            </ul>
          </Reveal>
        </section>

        {/* Related */}
        {related.length > 0 ? (
          <section className="mt-20 border-t border-ink-100 pt-14">
            <SectionHeading
              eyebrow="You may also love"
              title="Pairs beautifully with"
              className="mb-11"
            />
            <ProductGrid products={related} />
          </section>
        ) : null}
      </div>
    </>
  );
}

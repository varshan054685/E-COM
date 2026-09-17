import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/catalog';
import { buildSeo } from '@/lib/seo';
import { formatINR } from '@/lib/format';
import { ProductGallery } from '@/components/product/ProductGallery';
import { AddToBagPanel } from '@/components/product/AddToBagPanel';
import { RatingStars } from '@/components/ui/Rating';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ReviewList } from '@/components/product/ReviewList';
import { Accordion } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildSeo({
    title: product.seoTitle || product.name,
    description:
      product.seoDescription ||
      `${product.name} — ${product.description.slice(0, 150)}`,
    path: `/product/${slug}`,
    type: 'product',
    images: product.images.map((i) => i.url),
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getProducts(
    { categorySlug: product.category?.slug, sort: 'featured' },
    4,
  ).then((p) => p.filter((x) => x.id !== product.id).slice(0, 4));

  const outOfStock = product.stock <= 0 && !product.isMadeToOrder;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'JGTHS' },
    offers: {
      '@type': 'Offer',
      price: product.price.toNumber(),
      priceCurrency: 'INR',
      availability: product.stock > 0 || product.isMadeToOrder
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.reviewCount
      ? { '@type': 'AggregateRating', ratingValue: product.ratingAmount, reviewCount: product.reviewCount }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pt-24 lg:pt-32 pb-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-ink-faint">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-ink">Home</Link></li>
              <li aria-hidden>/</li>
              {product.category ? (
                <>
                  <li><Link href={`/collections/${product.category.slug}`} className="hover:text-ink">{product.category.name}</Link></li>
                  <li aria-hidden>/</li>
                </>
              ) : null}
              <li aria-current="page" className="text-charcoal-800">{product.name}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <ProductGallery images={product.images.map((i) => i.url)} name={product.name} />

            <div>
              {product.category && (
                <p className="text-[11px] uppercase tracking-widest text-gold-600">{product.category.name}</p>
              )}
              <h1 className="mt-2 font-serif text-4xl lg:text-5xl leading-tight text-charcoal-900">{product.name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {product.ratingAmount && (
                  <span className="flex items-center gap-2">
                    <RatingStars value={product.ratingAmount} size={15} />
                    <span className="text-xs text-ink-faint">{product.ratingAmount.toFixed(1)} ({product.reviewCount} reviews)</span>
                  </span>
                )}
                {product.badge && (
                  <Badge tone={product.badge.type === 'BESTSELLER' ? 'gold' : 'stone'}>{product.badge.label}</Badge>
                )}
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-serif text-3xl text-charcoal-900">{formatINR(product.priceNumber)}</span>
                {product.compareAtPriceNumber && product.compareAtPriceNumber > product.priceNumber && (
                  <>
                    <span className="text-base text-ink-faint line-through">{formatINR(product.compareAtPriceNumber)}</span>
                    <span className="text-[13px] text-gold-700">
                      Save {Math.round((1 - product.priceNumber / product.compareAtPriceNumber) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <span
                className={`mt-4 inline-block text-[12px] uppercase tracking-widest ${outOfStock ? 'text-red-700' : product.stock <= 3 ? 'text-amber-800' : 'text-emerald-700'}`}
              >
                {product.isMadeToOrder
                  ? 'Made to order'
                  : outOfStock
                    ? 'Sold out'
                    : product.stock <= 3
                      ? `Only a few left — ${product.stock} in stock`
                      : 'In stock'}
              </span>

              <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{product.description}</p>

              <div className="mt-8">
                <AddToBagPanel
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.priceNumber,
                    compareAtPrice: product.compareAtPriceNumber,
                    image: product.images[0]?.url ?? null,
                    stock: product.stock,
                    sizes: product.sizes,
                    colors: product.colors,
                    isMadeToOrder: product.isMadeToOrder,
                    categorySlug: product.category?.slug ?? null,
                    productionTime: product.productionTime,
                  }}
                />
              </div>

              <div className="mt-10">
                <Accordion
                  items={[
                    {
                      title: 'Description',
                      content: product.description,
                      defaultOpen: true,
                    },
                    product.craftType
                      ? {
                          title: 'Craftsmanship',
                          content: `Crafted by hand in our Coimbatore atelier. Craft: ${product.craftType}. Each piece passes a final inspection for embroidery tension, thread finishing, and stitching before it is ready.`,
                        }
                      : null,
                    product.material
                      ? {
                          title: 'Fabric & Materials',
                          content: `Made from ${product.material}. We choose fabrics that drape, breathe, and embroider beautifully, and line every couture piece by hand.`,
                        }
                      : null,
                    product.sizes.length
                      ? {
                          title: 'Fit & Measurements',
                          content: `Available in ${product.sizes.join(', ')}${product.sizes.includes('Custom') ? '. Custom pieces are stitched to your exact measurements — share them at checkout or bring them to the boutique.' : '.'} Please contact us for a size guide.`,
                        }
                      : null,
                    product.productionTime
                      ? {
                          title: 'Production Time',
                          content: `${product.productionTime}. Made-to-order pieces are scheduled around your deadline and confirmed via WhatsApp or email.`,
                        }
                      : null,
                    product.careInstructions
                      ? {
                          title: 'Care Instructions',
                          content: product.careInstructions,
                        }
                      : null,
                    {
                      title: 'Shipping & Returns',
                      content: `Ships from Coimbatore, Tamil Nadu. FREE shipping on orders of ₹10,000 and above; flat ₹150 otherwise. Each piece is packed with care. Ready-to-ship pieces can be returned within 7 days in original condition; made-to-order pieces are final sale.`,
                    },
                    {
                      title: 'Customization',
                      content: product.isMadeToOrder
                        ? 'This piece is made to order. Scheme changes to neckline, sleeve, length, or colour are discussed with our designers before production begins.'
                        : 'Every piece can be personalised — adjust the neckline, sleeves, length, or add extra Aari work. Choose “Custom” in size, or start a custom couture request.',
                    },
                  ].filter(Boolean) as { title: string; content: string }[]
                }
                />
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-24">
              <SectionHeading eyebrow="More from the boutique" title="You may also love" />
              <div className="mt-10">
                <ProductGrid products={related} columns={4} />
              </div>
            </section>
          )}

          <div className="mt-24 border-t border-ink/10 pt-14">
            <ReviewList
              productId={product.id}
              reviews={product.reviews.map((r) => ({
                id: r.id,
                rating: r.rating,
                title: r.title,
                content: r.content,
                image: r.image,
                createdAt: r.createdAt.toISOString(),
                user: { name: r.user.name },
              }))}
              ratingAmount={product.ratingAmount}
              reviewCount={product.reviewCount}
            />
          </div>
        </div>
      </div>
    </>
  );
}
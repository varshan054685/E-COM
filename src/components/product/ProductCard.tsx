'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Heart } from 'lucide-react';
import { useWishlist } from '@/components/commerce/WishlistProvider';
import { useCart } from '@/components/commerce/CartProvider';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/Rating';
import { QuickView } from '@/components/product/QuickView';
import { formatINR } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ProductCardData } from '@/types';

export function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const { isWishlisted, toggle } = useWishlist();
  const { addItem } = useCart();
  const router = useRouter();
  const [quickOpen, setQuickOpen] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0 && !product.isMadeToOrder;

  const onWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

  return (
    <>
      <Link
        href={`/product/${product.slug}`}
        className="group block"
        aria-label={product.name}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-ivory-200">
          {product.images[0] ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority={priority}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
              />
              {product.images[1] && product.images[1] !== product.images[0] && (
                <Image
                  src={product.images[1]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-ink-faint text-xs uppercase tracking-widest">
              Image coming soon
            </div>
          )}

          {product.badge && (
            <div className="absolute left-3 top-3">
              <Badge tone={product.badge.type === 'BESTSELLER' ? 'gold' : 'stone'}>{product.badge.label}</Badge>
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-x-0 top-0 h-full flex items-center justify-center bg-ivory-50/70">
              <span className="border border-ink/20 bg-ivory-50 px-4 py-1.5 text-[10px] uppercase tracking-widest text-ink">
                Sold out
              </span>
            </div>
          )}

          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 focus-within:opacity-100 focus-within:translate-x-0">
            <button
              onClick={onWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              className={cn(
                'flex h-9 w-9 items-center justify-center border shadow-sm transition-colors',
                wishlisted
                  ? 'border-gold-500 bg-gold-500 text-charcoal-900'
                  : 'border-ink/10 bg-ivory-50 text-charcoal-800 hover:border-ink/30',
              )}
            >
              <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickOpen(true); }}
              aria-label="Quick view"
              className="flex h-9 w-9 items-center justify-center border border-ink/10 bg-ivory-50 text-charcoal-800 hover:border-ink/30 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Quick add */}
          {!outOfStock && product.isMadeToOrder && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/custom-couture?piece=${product.slug}`);
              }}
              className="absolute inset-x-3 bottom-3 h-11 translate-y-2 bg-charcoal-900/90 text-[12px] font-medium uppercase tracking-[0.15em] text-ivory-100 opacity-0 transition-all duration-300 hover:bg-charcoal-900 group-hover:translate-y-0 group-hover:opacity-100"
            >
              Begin Made-to-Order
            </button>
          )}
          {!outOfStock && !product.isMadeToOrder && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({
                  productId: product.id,
                  productSlug: product.slug,
                  productName: product.name,
                  image: product.images[0] ?? null,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice ?? null,
                  size: null,
                  color: null,
                  quantity: 1,
                  stock: product.stock,
                  categorySlug: product.categorySlug ?? null,
                });
              }}
              className="absolute inset-x-3 bottom-3 h-11 translate-y-2 bg-charcoal-900/90 text-[12px] font-medium uppercase tracking-[0.15em] text-ivory-100 opacity-0 transition-all duration-300 hover:bg-charcoal-900 group-hover:translate-y-0 group-hover:opacity-100"
            >
              Add to Bag
            </button>
          )}
        </div>

        <div className="mt-4 space-y-1.5">
          {product.categoryName && (
            <p className="text-[10px] uppercase tracking-widest text-gold-600">{product.categoryName}</p>
          )}
          <h3 className="font-serif text-lg leading-snug text-charcoal-900 line-clamp-1 group-hover:underline underline-offset-4">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-medium text-charcoal-900">{formatINR(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-ink-faint line-through">{formatINR(product.compareAtPrice)}</span>
              )}
            </div>
          </div>
          {typeof product.ratingAmount === 'number' && (
            <div className="flex items-center gap-2">
              <RatingStars value={product.ratingAmount} size={13} />
              {product.reviewCount ? <span className="text-[11px] text-ink-faint">({product.reviewCount})</span> : null}
            </div>
          )}
        </div>
      </Link>

      <QuickView
        productId={product.id}
        product={product}
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}
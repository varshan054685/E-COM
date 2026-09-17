'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/components/commerce/AuthProvider';
import type { ProductCardData } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button, LinkButton } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/Rating';
import { useCart } from '@/components/commerce/CartProvider';
import { useWishlist } from '@/components/commerce/WishlistProvider';
import { formatINR } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function WishlistPage() {
  const { user } = useAuth();
  const { ids, toggle, loading } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading || ids.length === 0) {
      setProducts([]);
      setFetching(false);
      return;
    }
    setFetching(true);
    Promise.all(
      ids.map((id) =>
        fetch(`/api/products/${id}`, { cache: 'no-store' })
          .then((r) => r.json())
          .catch(() => null),
      ),
    ).then((rows) => {
      setProducts(
        rows
          .filter((r) => r && r.product)
          .map((r) => ({
            id: r.product.id,
            slug: r.product.slug,
            name: r.product.name,
            price: r.product.price,
            compareAtPrice: r.product.compareAtPrice,
            categorySlug: r.product.categorySlug ?? null,
            categoryName: r.product.categoryName ?? null,
            images: r.product.images,
            badge: null,
            stock: r.product.stock,
            isMadeToOrder: r.product.isMadeToOrder,
            ratingAmount: r.product.ratingAmount,
            reviewCount: r.product.reviewCount,
          })),
      );
      setFetching(false);
    });
  }, [ids, loading]);

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 pt-28 pb-20 min-h-[70vh]">
      <header className="max-w-xl">
        <p className="editorial-eyebrow mb-3">Saved pieces</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-charcoal-900">Your Wishlist</h1>
        {user ? null : (
          <p className="mt-3 text-sm text-ink-muted">
            Wishlist is saved on this device. <Link href="/login?next=/wishlist" className="text-gold-700 underline underline-offset-4">Sign in</Link> to keep it on your account.
          </p>
        )}
      </header>

      <div className="mt-10">
        {fetching ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {ids.map((id) => (
              <div key={id} className="space-y-3 animate-pulse">
                <div className="aspect-[3/4] bg-charcoal-100/70" />
                <div className="h-4 w-2/3 bg-charcoal-100/70" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-8 w-8" strokeWidth={1.3} />}
            title="Save pieces that speak to you"
            description="Tap the heart on any piece to keep it here — your favourites, all in one place."
            action={<LinkButton href="/shop" variant="dark">Discover the collection</LinkButton>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <div key={p.id} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-ivory-200">
                  {p.images[0] ? (
                    <Link href={`/product/${p.slug}`}>
                      <Image src={p.images[0]} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    </Link>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-ink-faint">Image coming soon</div>
                  )}
                  <button
                    onClick={() => toggle(p.id)}
                    aria-label="Remove from wishlist"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-ink/10 bg-ivory-50 text-charcoal-800 hover:border-ink/30"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  {p.categoryName && <p className="text-[10px] uppercase tracking-widest text-gold-600">{p.categoryName}</p>}
                  <Link href={`/product/${p.slug}`} className="block font-serif text-lg leading-snug text-charcoal-900 hover:underline underline-offset-4 line-clamp-1">{p.name}</Link>
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-medium">{formatINR(p.price)}</span>
                    <Button size="sm" variant="outline" onClick={() => addItem({ productId: p.id, productSlug: p.slug, productName: p.name, image: p.images[0] ?? null, price: p.price, compareAtPrice: p.compareAtPrice ?? null, size: null, color: null, quantity: 1, stock: p.stock, categorySlug: p.categorySlug ?? null })} disabled={p.stock <= 0 && !p.isMadeToOrder} className={cn('group-hover:opacity-100', 'opacity-0 transition')}>
                    <ShoppingBag className="h-3.5 w-3.5" /> Add
                    </Button>
                  </div>
                  {typeof p.ratingAmount === 'number' && (
                    <div className="flex items-center gap-2">
                      <RatingStars value={p.ratingAmount} size={12} />
                      {p.reviewCount ? <span className="text-[11px] text-ink-faint">({p.reviewCount})</span> : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
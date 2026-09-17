'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/Rating';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCart } from '@/components/commerce/CartProvider';
import { formatINR } from '@/lib/format';
import type { ProductCardData } from '@/types';

type QuickProduct = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    material: string | null;
    craftType: string | null;
    productionTime: string | null;
    stock: number;
    isMadeToOrder: boolean;
    sizes: string[];
    colors: string[];
    images: string[];
    categoryName: string | null;
    ratingAmount: number | null;
    reviewCount: number;
  };
};

export function QuickView({
  productId,
  product,
  open,
  onClose,
}: {
  productId: string;
  product: ProductCardData;
  open: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<QuickProduct['product'] | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!open) return;
    setData(null);
    setSize(null);
    setColor(null);
    fetch(`/api/products/${productId}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setData(j.product));
  }, [open, productId]);

  const outOfStock = data ? data.stock <= 0 && !data.isMadeToOrder : false;

  async function handleAdd() {
    if (!data) return;
    setLoading(true);
    await addItem({
      productId: data.id,
      productSlug: data.slug,
      productName: data.name,
      image: data.images[0] ?? null,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      size,
      color,
      quantity: 1,
      stock: data.stock,
      categorySlug: null,
    });
    setLoading(false);
  }

  return (
    <Dialog open={open} onClose={onClose} className="max-w-3xl">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[3/4] bg-ivory-200 max-h-[420px] md:max-h-[480px]">
          {data?.images[0] ? (
            <Image src={data.images[0]} alt={data.name} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
        <div className="p-6 md:p-8">
          {data ? (
            <>
              {data.categoryName && (
                <p className="text-[10px] uppercase tracking-widest text-gold-600">{data.categoryName}</p>
              )}
              <h3 className="mt-2 font-serif text-2xl text-charcoal-900">{data.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                <RatingStars value={data.ratingAmount || 0} size={14} />
                {data.reviewCount > 0 && <span className="text-xs text-ink-faint">({data.reviewCount})</span>}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-xl font-medium">{formatINR(data.price)}</span>
                {data.compareAtPrice && data.compareAtPrice > data.price && (
                  <span className="text-sm text-ink-faint line-through">{formatINR(data.compareAtPrice)}</span>
                )}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted line-clamp-3">{data.description}</p>

              {data.colors.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">Colour</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`border px-3 py-1.5 text-xs transition ${color === c ? 'border-ink bg-ink text-ivory-100' : 'border-ink/15 hover:border-ink/40'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {data.sizes.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">Size</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`h-9 w-11 border text-sm transition ${size === s ? 'border-ink bg-ink text-ivory-100' : 'border-ink/15 hover:border-ink/40'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {data?.isMadeToOrder && !(data.stock <= 0 && !data.isMadeToOrder) ? (
                <Link
                  href={`/custom-couture?piece=${data.slug}`}
                  onClick={onClose}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center bg-ink text-sm text-ivory-100 hover:bg-charcoal-800"
                >
                  Begin Made-to-Order
                </Link>
              ) : outOfStock ? (
                <p className="mt-6 text-sm text-red-700">This piece is currently sold out.</p>
              ) : (
                <Button fullWidth size="lg" isLoading={loading} className="mt-6" onClick={handleAdd}>
                  Add to Bag
                </Button>
              )}

              <Link href={`/product/${data.slug}`} onClick={onClose} className="mt-4 block text-center text-sm text-gold-700 underline-offset-4 hover:underline">
                View full details
              </Link>
            </>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import type { Product } from '@/lib/catalog';
import { discountPercent, formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';

type ProductCardProps = {
  product: Product;
  className?: string;
  /** Carousel slides must not stretch to fill the row. */
  fixedWidth?: boolean;
};

export function ProductCard({ product, className, fixedWidth = false }: ProductCardProps) {
  const addLine = useCartStore((state) => state.addLine);
  const discount = discountPercent(product.price, product.compareAtPrice);

  function handleAddToCart() {
    addLine({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      price: product.price,
      // Default to the first available option; the product page refines it.
      size: product.sizes[0] ?? null,
      color: product.colors[0]?.name ?? null,
      quantity: 1,
      madeToMeasure: false,
      measurements: null,
      referenceFiles: [],
      notes: '',
    });
  }

  return (
    <article
      className={cn(
        'group flex h-full flex-col',
        fixedWidth && 'w-[68vw] shrink-0 sm:w-[46vw] md:w-[31vw] lg:w-[23vw] xl:w-[19rem]',
        className,
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-3/4 shrink-0 overflow-hidden rounded-lg bg-ivory-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 68vw"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
        />

        <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.isNew ? <Badge variant="solid">New</Badge> : null}
          {discount > 0 ? <Badge variant="magenta">−{discount}%</Badge> : null}
          {product.madeToOrder ? <Badge variant="gold">Made to order</Badge> : null}
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          {/* `min-h` reserves two lines so price rows and buttons line up
              across every card in a grid row or carousel. */}
          <h3 className="line-clamp-2 min-h-[2.75em] font-serif text-lg leading-snug">
            <Link
              href={`/product/${product.slug}`}
              className="transition-colors hover:text-gold-700"
            >
              {product.title}
            </Link>
          </h3>
          <Rating value={product.rating} className="mt-1 shrink-0" />
        </div>

        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.subtitle}</p>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base font-medium tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-sm text-ink-300 line-through tabular-nums">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        {/* `mt-auto` pins the action to the bottom of the tallest card. */}
        <div className="mt-auto pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            className="w-full border-ink-200 text-xs tracking-[0.12em] uppercase hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingBag className="size-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}

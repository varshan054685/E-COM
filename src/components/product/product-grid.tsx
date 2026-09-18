import { ProductCard } from '@/components/product/product-card';
import { Reveal } from '@/components/ui/reveal';
import type { Product } from '@/lib/catalog';
import { cn } from '@/lib/utils';

type ProductGridProps = {
  products: Product[];
  className?: string;
};

/** 1 column on mobile, growing to 4 on wide screens. */
export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-x-5 gap-y-11 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((product, index) => (
        <Reveal key={product.id} delay={Math.min(index, 5) * 0.05} className="h-full">
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}

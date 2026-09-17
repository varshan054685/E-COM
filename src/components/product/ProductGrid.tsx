import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import type { ProductCardData } from '@/types';

export function ProductGrid({
  products,
  className,
  columns = 4,
  priorityFirst = false,
}: {
  products: ProductCardData[];
  className?: string;
  columns?: 2 | 3 | 4;
  priorityFirst?: boolean;
}) {
  const cols = {
    2: 'sm:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (products.length === 0) return null;

  return (
    <div className={cn('grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:gap-x-7', cols, className)}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={priorityFirst && i < 2} />
      ))}
    </div>
  );
}
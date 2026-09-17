import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RatingStars({ value, size = 15, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-gold-500', className)} role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={cn(i <= Math.round(value) ? 'fill-current' : 'stroke-current text-gold-300')}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
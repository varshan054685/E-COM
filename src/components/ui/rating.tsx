import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type RatingProps = {
  value: number;
  /** Number of reviews, rendered next to the stars when provided. */
  count?: number;
  className?: string;
};

export function Rating({ value, count, className }: RatingProps) {
  /** Stars fill at the nearest whole star; halves are shown in the label. */
  const rounded = Math.round(value);

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn('size-3.5', rounded >= star ? 'text-gold-400' : 'text-ink-200')}
            fill={rounded >= star ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {value.toFixed(1)}
        {typeof count === 'number' ? ` (${count})` : ''}
      </span>
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5
        {typeof count === 'number' ? ` from ${count} reviews` : ''}
      </span>
    </div>
  );
}

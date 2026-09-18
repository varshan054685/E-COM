import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] uppercase',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        gold: 'bg-accent text-accent-foreground',
        magenta: 'bg-secondary text-secondary-foreground',
        outline: 'border border-ink-200 text-ink-500',
        muted: 'bg-muted text-ink-500',
        /** For "New" ribbons sitting on top of imagery. */
        solid: 'bg-background text-foreground shadow-soft',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

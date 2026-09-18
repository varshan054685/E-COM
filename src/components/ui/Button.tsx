import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  {
    variants: {
      variant: {
        /** Emerald — the primary commerce action. */
        default:
          'bg-primary text-primary-foreground shadow-soft hover:bg-emerald-soft hover:shadow-lift active:scale-[0.99]',
        /** Muted gold — editorial / secondary emphasis. */
        gold: 'bg-accent text-accent-foreground shadow-soft hover:bg-gold-600 hover:shadow-lift active:scale-[0.99]',
        /** Deep magenta — festive emphasis. */
        magenta:
          'bg-secondary text-secondary-foreground shadow-soft hover:bg-magenta-soft hover:shadow-lift active:scale-[0.99]',
        outline:
          'border border-ink-200 bg-transparent text-foreground hover:border-ink-300 hover:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted',
        /** Destructive confirmations (delete actions). */
        destructive:
          'bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 active:scale-[0.99]',
        link: 'text-foreground underline-offset-4 hover:underline',
        /** Official WhatsApp green, for inquiry actions. */
        whatsapp: 'bg-[#25D366] text-white shadow-soft hover:bg-[#1DA851] active:scale-[0.99]',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        default: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. a `next/link`) instead of a `<button>`. */
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

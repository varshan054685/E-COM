'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'dark'
  | 'gold'
  | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-ivory-100 hover:bg-ink/90 active:bg-ink border border-ink',
  dark: 'bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800',
  outline:
    'border border-ink/20 text-ink hover:border-ink hover:bg-ivory-50 bg-transparent',
  ghost: 'text-ink hover:bg-ink/5 bg-transparent',
  gold: 'bg-gold-500 text-charcoal-900 hover:bg-gold-400',
  link: 'text-ink underline-offset-4 hover:underline p-0 h-auto bg-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px] gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-13 px-8 py-3.5 text-[15px] gap-2.5',
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
};

const baseClass =
  'inline-flex items-center justify-center font-medium tracking-[0.02em] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap';

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & CommonProps
>(function Button(
  { className, variant = 'primary', size = 'md', fullWidth, isLoading, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        baseClass,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
});

export function LinkButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  ...props
}: { href: string } & CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <Link
      href={href}
      className={cn(
        baseClass,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
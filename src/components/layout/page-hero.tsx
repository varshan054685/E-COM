import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

/** Consistent opening block for every inner page. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  align = 'left',
  className,
}: PageHeroProps) {
  return (
    <section className={cn('border-b border-ink-100 bg-ivory-200/50', className)}>
      <div
        className={cn(
          'mx-auto max-w-[1400px] px-4 py-14 sm:py-18 lg:px-8',
          align === 'center' && 'text-center',
        )}
      >
        {eyebrow ? <p className="eyebrow text-gold-600">{eyebrow}</p> : null}
        <h1
          className={cn(
            'mt-4 font-serif text-4xl leading-[1.1] font-medium text-balance sm:text-5xl',
            align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl',
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              'mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base',
              align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl',
            )}
          >
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

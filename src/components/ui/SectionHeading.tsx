import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <p className={cn('editorial-eyebrow mb-4', align === 'center' ? 'text-center' : '')}>
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-[44px] leading-[1.1] text-charcoal-900 font-medium">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{description}</p>
      )}
    </div>
  );
}

export function Hairline({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-ink/10', className)} />;
}
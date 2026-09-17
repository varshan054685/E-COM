import { cn } from '@/lib/utils';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-20 text-center border border-dashed border-ink/15 bg-ivory-50/50',
        className,
      )}
    >
      {icon && <div className="mb-5 text-ink-faint">{icon}</div>}
      <h3 className="font-serif text-2xl font-medium text-charcoal-800">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
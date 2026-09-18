import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  Icon: LucideIcon;
  tone?: 'default' | 'gold' | 'magenta' | 'danger';
  /** Highlights the card border, used when the metric needs attention. */
  attention?: boolean;
};

const TONE: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'bg-primary/8 text-primary',
  gold: 'bg-gold-100 text-gold-700',
  magenta: 'bg-secondary/8 text-secondary',
  danger: 'bg-destructive/8 text-destructive',
};

export function StatCard({
  label,
  value,
  hint,
  Icon,
  tone = 'default',
  attention = false,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5 shadow-soft sm:p-6',
        attention ? 'border-destructive/30' : 'border-ink-100',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow text-ink-400">{label}</p>
        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full', TONE[tone])}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 font-serif text-3xl leading-none tabular-nums">{value}</p>
      {hint ? <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

import { Check } from 'lucide-react';
import { ORDER_FLOW } from '@/lib/custom-order';
import { ORDER_STATUSES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const FLOW_LABELS: Record<string, string> = Object.fromEntries(
  ORDER_STATUSES.map((s) => [s.value, s.label]),
);

export function OrderTimeline({ status, createdAt }: { status: string; createdAt: string | Date }) {
  const terminal = ['CANCELLED', 'RETURNED'].includes(status);
  const currentIndex = ORDER_FLOW.indexOf(status as (typeof ORDER_FLOW)[number]);
  const effectiveIndex = terminal ? 0 : currentIndex;

  return (
    <ol className="relative ml-3 border-l border-ink/15">
      {ORDER_FLOW.map((step, i) => {
        const done = !terminal && i <= effectiveIndex && currentIndex !== -1;
        const current = !terminal && i === effectiveIndex;
        return (
          <li key={step} className="mb-6 ml-6 last:mb-0">
            <span
              className={cn(
                'absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border',
                done ? 'border-gold-500 bg-gold-500 text-charcoal-900' : 'border-ink/20 bg-ivory-100 text-ink-faint',
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            <p className={cn('text-sm', done ? 'font-medium text-charcoal-900' : 'text-ink-faint')}>
              {FLOW_LABELS[step] ?? step}
            </p>
            {current && (
              <p className="mt-0.5 text-xs text-ink-muted">
                Updated {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            )}
          </li>
        );
      })}
      {terminal && (
        <li className="ml-6">
          <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border border-red-300 bg-red-50 text-red-600">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          </span>
          <p className="text-sm font-medium text-red-700">{FLOW_LABELS[status] ?? status}</p>
        </li>
      )}
    </ol>
  );
}
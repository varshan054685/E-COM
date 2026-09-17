import { cn } from '@/lib/utils';

export type Tone = 'amber' | 'blue' | 'violet' | 'teal' | 'green' | 'red' | 'stone' | 'gold';

const tones: Record<Tone, string> = {
  amber: 'bg-amber-500/10 text-amber-800 border-amber-500/20',
  blue: 'bg-sky-500/10 text-sky-800 border-sky-500/20',
  violet: 'bg-violet-500/10 text-violet-800 border-violet-500/20',
  teal: 'bg-teal-500/10 text-teal-800 border-teal-500/20',
  green: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20',
  red: 'bg-red-500/10 text-red-700 border-red-500/20',
  stone: 'bg-stone-500/10 text-stone-700 border-stone-500/20',
  gold: 'bg-gold-500/10 text-gold-700 border-gold-500/25',
};

export function Badge({
  children,
  tone = 'gold',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
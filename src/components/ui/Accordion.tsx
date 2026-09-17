'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode; defaultOpen?: boolean }[];
}) {
  const [open, setOpen] = useState<number | null>(
    items.findIndex((i) => i.defaultOpen) >= 0 ? items.findIndex((i) => i.defaultOpen) : 0,
  );

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left text-sm font-medium tracking-wide text-charcoal-900 hover:text-charcoal-700"
            >
              {item.title}
              <ChevronDown className={cn('h-4 w-4 text-ink-faint transition-transform duration-300', isOpen && 'rotate-180')} />
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-out-expo',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-5 text-sm leading-relaxed text-ink-muted">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
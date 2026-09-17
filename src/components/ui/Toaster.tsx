'use client';

import { useEffect, useState } from 'react';
import { Check, Info, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'error';
};

type ToastFn = (
  title: string,
  options?: { description?: string; variant?: ToastItem['variant'] },
) => void;

let pushToast: ToastFn | null = null;

export function toast(
  title: string,
  options?: { description?: string; variant?: ToastItem['variant'] },
) {
  if (pushToast) pushToast(title, options);
}

export function setToastHandler(fn: ToastFn | null) {
  pushToast = fn;
}

const icons: Record<ToastItem['variant'], React.ReactNode> = {
  success: <Check className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  error: <XCircle className="h-4 w-4" />,
};

const iconClasses: Record<ToastItem['variant'], string> = {
  success: 'bg-emerald-500 text-white',
  info: 'bg-gold-500 text-charcoal-900',
  error: 'bg-red-600 text-white',
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    setToastHandler((title, options) => {
      const id = Date.now() + Math.random();
      const item: ToastItem = {
        id,
        title,
        variant: options?.variant ?? 'info',
        description: options?.description,
      };
      setItems((prev) => [...prev.slice(-3), item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    });
    return () => setToastHandler(null);
  }, []);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[120] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2.5"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 border border-ink/10 bg-charcoal-900 text-ivory-100 p-4 shadow-lift animate-fade-up"
        >
          <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full', iconClasses[item.variant])}>
            {icons[item.variant]}
          </span>
          <div>
            <p className="text-sm font-medium leading-snug">{item.title}</p>
            {item.description && (
              <p className="mt-1 text-[13px] leading-snug text-ivory-100/70">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
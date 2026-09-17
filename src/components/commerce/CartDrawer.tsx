'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button, LinkButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCart } from './CartProvider';
import { formatINR } from '@/lib/format';
import { cn } from '@/lib/utils';

type CartDrawerContextValue = { open: boolean; setOpen: (v: boolean) => void };
const CartDrawerContext = createContext<CartDrawerContextValue | null>(null);

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error('useCartDrawer must be used within provider');
  return ctx;
}

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>
  );
}

export function CartDrawer() {
  const { open, setOpen } = useCartDrawer();
  const { items, subtotal, count, updateQuantity, removeItem, loading } = useCart();

  return (
    <Drawer open={open} onClose={() => setOpen(false)} title="Your collection" side="right">
      <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
        <div>
          <h2 className="font-serif text-xl font-medium text-charcoal-900">Your Collection</h2>
          <p className="text-xs text-ink-muted mt-0.5">
            {count} {count === 1 ? 'piece' : 'pieces'}
          </p>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close cart" className="flex h-9 w-9 items-center justify-center text-ink-muted hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="p-6 space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-24 w-20 bg-charcoal-100" />
                <div className="flex-1 space-y-2"><div className="h-3 w-3/4 bg-charcoal-100" /><div className="h-3 w-1/2 bg-charcoal-100" /></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            className="border-0"
            icon={<ShoppingBag className="h-8 w-8" strokeWidth={1.3} />}
            title="Your collection awaits"
            description="Browse our curated pieces and add something special to your bag."
            action={<LinkButton href="/shop" onClick={() => setOpen(false)} variant="dark">Explore the collection</LinkButton>}
          />
        ) : (
          <ul className="divide-y divide-ink/8 px-6">
            {items.map((item) => (
              <li key={item.id} className="py-5 flex gap-4">
                <Link href={`/product/${item.productSlug}`} onClick={() => setOpen(false)} className="shrink-0">
                  <div className="relative h-28 w-[88px] overflow-hidden bg-ivory-200">
                    {item.image && (
                      <Image src={item.image} alt={item.productName} fill sizes="88px" className="object-cover" />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <Link href={`/product/${item.productSlug}`} onClick={() => setOpen(false)} className="text-sm font-medium text-charcoal-900 hover:underline line-clamp-2">
                      {item.productName}
                    </Link>
                    <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.productName}`} className="text-ink-faint hover:text-red-600 shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">
                    {[item.color, item.size].filter(Boolean).join(' · ') || 'Standard'}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-ink/15">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity" className="flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} aria-label="Increase quantity" className="flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className={cn('text-[13px] font-medium', item.compareAtPrice && item.compareAtPrice > item.price ? 'text-gold-700' : 'text-charcoal-900')}>
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-ink/10 px-6 py-5 space-y-4 bg-ivory-100">
          <div className="flex justify-between text-sm">
            <span className="text-ink-muted">Subtotal</span>
            <span className="font-medium text-charcoal-900">{formatINR(subtotal)}</span>
          </div>
          <p className="text-xs text-ink-faint">Shipping and discounts calculated at checkout.</p>
          <Button fullWidth size="lg" onClick={() => setOpen(false)}>
            <Link href="/checkout" className="flex w-full items-center justify-center">
              Proceed to Checkout
            </Link>
          </Button>
          <LinkButton href="/cart" variant="outline" fullWidth onClick={() => setOpen(false)}>
            View Bag
          </LinkButton>
        </div>
      )}
    </Drawer>
  );
}
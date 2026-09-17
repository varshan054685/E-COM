'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useCart } from '@/components/commerce/CartProvider';
import { Button, LinkButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatINR } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { items, subtotal, count, loading, updateQuantity, removeItem } = useCart();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT_RATE;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 pt-28 pb-20 min-h-[70vh]">
      <header className="mb-8">
        <p className="editorial-eyebrow mb-3">Your selection</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-charcoal-900">Shopping Bag</h1>
      </header>

      {loading ? (
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-5 animate-pulse">
              <div className="h-36 w-28 bg-charcoal-100" />
              <div className="flex-1 space-y-3"><div className="h-4 w-2/3 bg-charcoal-100" /><div className="h-4 w-1/3 bg-charcoal-100" /></div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" strokeWidth={1.3} />}
          title="Your collection awaits"
          description="Nothing here yet — explore our handcrafted pieces and Aari couture."
          action={<LinkButton href="/shop" variant="dark">Explore the collection</LinkButton>}
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            {/* Free shipping progress */}
            <div className="mb-8 border border-ink/10 bg-ivory-50 p-4">
              <p className="flex items-center gap-2 text-[13px] text-charcoal-800">
                <Truck className="h-4 w-4 text-gold-600" />
                {remainingForFree > 0 ? (
                  <>You&apos;re {formatINR(remainingForFree)} away from <strong>FREE shipping</strong>.</>
                ) : (
                  <>You&apos;ve unlocked <strong>FREE shipping</strong>.</>
                )}
              </p>
              <div className="mt-2.5 h-1 w-full bg-charcoal-100 overflow-hidden">
                <div className="h-full bg-gold-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="divide-y divide-ink/10 border-t border-ink/10">
              {items.map((item) => (
                <li key={item.id} className="flex gap-5 py-6">
                  <Link href={`/product/${item.productSlug}`} className="shrink-0">
                    <div className="relative h-36 w-28 overflow-hidden bg-ivory-200">
                      {item.image && <Image src={item.image} alt={item.productName} fill sizes="112px" className="object-cover" />}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gold-600">{item.categorySlug ?? 'JGTHS'}</p>
                        <Link href={`/product/${item.productSlug}`} className="mt-1 block font-serif text-xl text-charcoal-900 hover:underline underline-offset-4 line-clamp-2">
                          {item.productName}
                        </Link>
                        <p className="mt-1 text-xs text-ink-muted">
                          {[item.color, item.size].filter(Boolean).join(' · ') || 'Standard'}
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="h-9 w-9 shrink-0 text-ink-faint hover:text-red-600 transition" aria-label={`Remove ${item.productName}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="flex items-center border border-ink/15">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity" className="flex h-10 w-10 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm" aria-live="polite">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= Math.max(item.stock, 1)} aria-label="Increase quantity" className="flex h-10 w-10 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-medium text-charcoal-900">{formatINR(item.price * item.quantity)}</p>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <p className="text-xs text-ink-faint line-through">{formatINR(item.compareAtPrice * item.quantity)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 h-fit border border-ink/10 bg-ivory-50 p-6 space-y-4">
            <h2 className="font-serif text-xl text-charcoal-900">Order Summary</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-ink-muted">Subtotal ({count} items)</dt><dd className="font-medium">{formatINR(subtotal)}</dd></div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Shipping</dt>
                <dd className={cn('font-medium', shipping === 0 && 'text-emerald-700')}>{shipping === 0 ? 'Free' : formatINR(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-base">
                <dt className="font-medium text-charcoal-900">Total</dt>
                <dd className="font-medium text-charcoal-900">{formatINR(subtotal + shipping)}</dd>
              </div>
            </dl>
            <Button fullWidth size="lg"><Link href="/checkout" className="flex w-full items-center justify-center">Proceed to Checkout</Link></Button>
            <LinkButton href="/shop" variant="outline" fullWidth>Continue Shopping</LinkButton>
            <p className="text-xs leading-relaxed text-ink-faint">
              Coupons and discounts are applied at checkout. Made-to-order pieces are crafted to your measurements.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
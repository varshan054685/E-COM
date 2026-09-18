'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { formatPrice } from '@/lib/format';
import { useHydrated } from '@/lib/use-hydrated';
import { FREE_SHIPPING_THRESHOLD, useCartStore, useCartSubtotal } from '@/store/cart';

export function CartDrawer() {
  const hydrated = useHydrated();
  const isOpen = useCartStore((state) => state.isOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeLine = useCartStore((state) => state.removeLine);
  const subtotal = useCartSubtotal();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={hydrated && isOpen} onOpenChange={setCartOpen}>
      <SheetContent>
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5 pr-16">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-gold-600" aria-hidden="true" />
            Your Bag
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review the pieces you have selected before ordering.
          </SheetDescription>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-ink-300" aria-hidden="true" />
            </span>
            <div>
              <p className="font-serif text-xl">Your bag is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore the collections and add your first piece.
              </p>
            </div>
            <Button asChild variant="gold" onClick={() => setCartOpen(false)}>
              <Link href="/shop">Shop the collection</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-ink-100 px-6 py-4">
              <p className="text-xs text-muted-foreground">
                {remaining > 0 ? (
                  <>
                    Add <span className="font-medium text-foreground">{formatPrice(remaining)}</span>{' '}
                    more for complimentary shipping.
                  </>
                ) : (
                  <span className="text-primary">
                    Complimentary shipping unlocked on this order.
                  </span>
                )}
              </p>
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-ivory-300">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500 ease-out-expo"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-ink-100 overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${line.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-ivory-200"
                  >
                    <Image
                      src={line.image}
                      alt={line.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/product/${line.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="font-serif text-base leading-snug hover:text-gold-700"
                      >
                        {line.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeLine(line.key)}
                        aria-label={`Remove ${line.title}`}
                        className="shrink-0 rounded-full p-1.5 text-ink-300 transition-colors hover:bg-muted hover:text-destructive"
                      >
                        <Trash className="size-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {[line.size, line.color].filter(Boolean).join(' · ') || 'Standard'}
                      {line.madeToMeasure ? ' · Made to measure' : ''}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center rounded-md border border-ink-200">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-ink-500 transition-colors hover:text-foreground disabled:opacity-40"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-xs font-medium tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-ink-500 transition-colors hover:text-foreground"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        {formatPrice(line.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink-100 bg-ivory-50 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-serif text-xl tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Shipping and any customisation charges are confirmed on WhatsApp.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <Button asChild size="lg" onClick={() => setCartOpen(false)}>
                  <Link href="/cart">Review bag &amp; order</Link>
                </Button>
                <Button variant="ghost" onClick={() => setCartOpen(false)}>
                  Continue shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

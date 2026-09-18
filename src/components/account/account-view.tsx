'use client';

import Link from 'next/link';
import { MessageCircle, Ruler, ShoppingBag, Trash } from 'lucide-react';

import { PageHero } from '@/components/layout/page-hero';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { SITE, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from '@/lib/site';
import { useHydrated } from '@/lib/use-hydrated';
import { useCartCount, useCartSubtotal } from '@/store/cart';
import { MEASUREMENT_LABELS, useMeasurementStore } from '@/store/measurements';

export function AccountView() {
  const hydrated = useHydrated();
  const saved = useMeasurementStore((state) => state.saved);
  const clear = useMeasurementStore((state) => state.clear);
  const cartCount = useCartCount();
  const cartSubtotal = useCartSubtotal();

  return (
    <>
      <PageHero
        eyebrow="Your profile"
        title="Your atelier profile"
        description="Everything you share with us stays in your browser on this device. Saved measurements are reused automatically the next time you choose 'Stitch to my exact measurements'."
      />

      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
          {/* Measurements */}
          <section className="rounded-xl border border-ink-100 bg-card p-6 shadow-soft sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 font-serif text-2xl">
                  <Ruler className="size-5 text-gold-600" aria-hidden="true" />
                  Saved measurements
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Used to pre-fill your made-to-measure orders.
                </p>
              </div>

              {hydrated && saved ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="shrink-0 gap-2 text-xs tracking-[0.12em] uppercase hover:text-destructive"
                >
                  <Trash className="size-3.5" />
                  Remove
                </Button>
              ) : null}
            </div>

            {!hydrated ? (
              <div className="mt-7 h-32 animate-pulse rounded-lg bg-ivory-200" />
            ) : saved ? (
              <>
                <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                  {MEASUREMENT_LABELS.map(({ key, label }) => {
                    const value = saved[key];
                    if (!value) return null;
                    return (
                      <div key={key} className="border-t border-ink-100 pt-4">
                        <dt className="eyebrow text-ink-300">{label}</dt>
                        <dd className="mt-1.5 font-serif text-xl tabular-nums">
                          {value}
                          <span className="ml-1 text-sm text-muted-foreground">
                            {saved.unit}
                          </span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href="/custom-orders#measurements">Update measurements</Link>
                  </Button>
                  <Button asChild variant="gold">
                    <Link href="/shop">Shop with this fit</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-7 rounded-lg border border-dashed border-ink-200 px-6 py-12 text-center">
                <p className="font-serif text-xl">No measurements saved yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Add them on any product page when you choose “Stitch to my exact
                  measurements”, and tick the box to save them here.
                </p>
                <Button asChild variant="outline" className="mt-6">
                  <Link href="/custom-orders#measurements">See the measurement guide</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Quick links */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-xl border border-ink-100 bg-card p-6">
              <h2 className="font-serif text-xl">Your bag</h2>
              {hydrated && cartCount > 0 ? (
                <>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {cartCount} {cartCount === 1 ? 'piece' : 'pieces'} ·{' '}
                    <span className="font-medium text-foreground">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </p>
                  <Button asChild className="mt-5 w-full">
                    <Link href="/cart">
                      <ShoppingBag className="size-4" />
                      Review bag
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Your bag is empty right now.
                  </p>
                  <Button asChild variant="outline" className="mt-5 w-full">
                    <Link href="/shop">Browse the collection</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/6 p-6">
              <h2 className="font-serif text-xl text-primary">Need help with an order?</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Order history, tracking and alterations for existing orders are handled
                directly by the studio — message us and we will pull up your record.
              </p>
              <Button asChild variant="whatsapp" className="mt-5 w-full">
                <a
                  href={whatsappLink(
                    `Hello ${SITE.shortName}, I need help with my order.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  Ask the studio
                </a>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Or call {SITE.phoneDisplay} during studio hours.
              </p>
            </div>

            <nav aria-label="Helpful links" className="rounded-xl border border-ink-100 bg-card p-6">
              <h2 className="eyebrow text-ink-400">Helpful links</h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm">
                <li>
                  <Link href="/custom-orders" className="text-ink-500 transition-colors hover:text-foreground">
                    Start a custom order
                  </Link>
                </li>
                <li>
                  <Link href="/policies/shipping-returns" className="text-ink-500 transition-colors hover:text-foreground">
                    Shipping &amp; returns
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-ink-500 transition-colors hover:text-foreground">
                    Studio hours &amp; appointments
                  </Link>
                </li>
                <li>
                  <a
                    href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-500 transition-colors hover:text-foreground"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}

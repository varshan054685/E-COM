'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Minus, Plus, ShoppingBag, Trash } from 'lucide-react';

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/format';
import { SITE, whatsappLink } from '@/lib/site';
import { useHydrated } from '@/lib/use-hydrated';
import {
  FREE_SHIPPING_THRESHOLD,
  shippingFor,
  useCartStore,
  useCartSubtotal,
} from '@/store/cart';

type Details = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

const EMPTY_DETAILS: Details = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  notes: '',
};

type DetailsErrors = Partial<Record<'name' | 'phone' | 'address' | 'pincode', string>>;

export function CartView() {
  const hydrated = useHydrated();
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeLine = useCartStore((state) => state.removeLine);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartSubtotal();

  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<DetailsErrors>({});
  const [sent, setSent] = useState(false);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  function update<K extends keyof Details>(key: K, value: string) {
    setDetails((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  function buildOrderMessage(): string {
    const items = lines.map((line, index) => {
      const options = [line.size, line.color].filter(Boolean).join(' · ');
      const measurements = line.madeToMeasure && line.measurements
        ? `\n     Measurements (${line.measurements.unit}): bust ${line.measurements.bust}, waist ${line.measurements.waist}, shoulder ${line.measurements.shoulder}, armhole ${line.measurements.armhole}${line.measurements.length ? `, length ${line.measurements.length}` : ''}`
        : '';
      const references = line.referenceFiles.length
        ? `\n     Reference images: ${line.referenceFiles.join(', ')}`
        : '';
      const notes = line.notes.trim() ? `\n     Notes: ${line.notes.trim()}` : '';

      return [
        `${index + 1}. ${line.title} × ${line.quantity}`,
        options ? `\n     ${options}` : '',
        measurements,
        references,
        notes,
        `\n     ${formatPrice(line.price * line.quantity)}`,
      ].join('');
    });

    return [
      `New order — ${SITE.shortName}`,
      '',
      ...items,
      '',
      `Subtotal: ${formatPrice(subtotal)}`,
      `Shipping: ${shipping === 0 ? 'Complimentary' : formatPrice(shipping)}`,
      `Total: ${formatPrice(total)}`,
      '',
      'Delivery details',
      `Name: ${details.name.trim()}`,
      `Phone: ${details.phone.trim()}`,
      details.email.trim() ? `Email: ${details.email.trim()}` : null,
      `Address: ${details.address.trim()}, ${details.city.trim()}, ${details.state.trim()} ${details.pincode.trim()}`,
      details.notes.trim() ? `\nOrder notes: ${details.notes.trim()}` : null,
      '',
      'Please confirm payment and dispatch details.',
    ]
      .filter((line) => line !== null)
      .join('\n');
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: DetailsErrors = {};
    if (!details.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!/^[+\d][\d\s-]{7,}$/.test(details.phone.trim())) {
      nextErrors.phone = 'Please enter a reachable phone number.';
    }
    if (details.address.trim().length < 8) nextErrors.address = 'Please enter a full address.';
    if (!/^\d{6}$/.test(details.pincode.trim())) nextErrors.pincode = 'Enter a 6-digit PIN code.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    window.open(whatsappLink(buildOrderMessage()), '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  // Wait for the persisted store before rendering, so SSR and client agree.
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-20 lg:px-8">
        <div className="h-8 w-56 animate-pulse rounded bg-ivory-300" />
        <div className="mt-6 h-48 animate-pulse rounded-xl bg-ivory-200" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
        <span className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-7 text-ink-300" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-serif text-3xl font-medium">Your bag is empty</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Nothing selected yet. Explore the collections, or commission something made
          only for you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="gold" size="lg">
            <Link href="/shop">Shop the collection</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/custom-orders">Commission a piece</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:py-16 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-600">Your selection</p>
          <h1 className="mt-3 font-serif text-4xl font-medium sm:text-5xl">Review your bag</h1>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-destructive"
        >
          Clear bag
        </button>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        {/* Lines */}
        <ul className="flex flex-col divide-y divide-ink-100 border-y border-ink-100">
          {lines.map((line) => (
            <li key={line.key} className="flex flex-col gap-5 py-6 sm:flex-row">
              <Link
                href={`/product/${line.slug}`}
                className="relative aspect-3/4 w-28 shrink-0 overflow-hidden rounded-lg bg-ivory-200 sm:w-32"
              >
                <Image
                  src={line.image}
                  alt={line.title}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${line.slug}`}
                      className="font-serif text-xl leading-snug transition-colors hover:text-gold-700"
                    >
                      {line.title}
                    </Link>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {[line.size, line.color].filter(Boolean).join(' · ') || 'Standard'}
                    </p>
                    {line.madeToMeasure ? (
                      <p className="mt-1 text-xs text-primary">
                        Made to measure
                        {line.measurements
                          ? ` · ${line.measurements.unit} bust ${line.measurements.bust}, waist ${line.measurements.waist}`
                          : ''}
                      </p>
                    ) : null}
                    {line.referenceFiles.length > 0 ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {line.referenceFiles.length} reference{' '}
                        {line.referenceFiles.length === 1 ? 'image' : 'images'} attached
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLine(line.key)}
                    aria-label={`Remove ${line.title}`}
                    className="shrink-0 rounded-full p-2 text-ink-300 transition-colors hover:bg-muted hover:text-destructive"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                  <div className="flex items-center rounded-md border border-ink-200">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="p-2.5 text-ink-500 transition-colors hover:text-foreground"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity + 1)}
                      aria-label="Increase quantity"
                      className="p-2.5 text-ink-500 transition-colors hover:text-foreground"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  <span className="text-lg font-medium tabular-nums">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Delivery + summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-ink-100 bg-card p-6 shadow-soft">
            <h2 className="font-serif text-xl">Order summary</h2>

            <dl className="mt-5 flex flex-col gap-3 border-b border-ink-100 pb-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium tabular-nums">
                  {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-serif text-2xl tabular-nums">{formatPrice(total)}</span>
            </div>

            {subtotal < FREE_SHIPPING_THRESHOLD ? (
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                complimentary shipping.
              </p>
            ) : null}

            <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-4">
              <h3 className="eyebrow text-ink-400">Delivery details</h3>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cart-name">Full name</Label>
                <Input
                  id="cart-name"
                  value={details.name}
                  onChange={(event) => update('name', event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cart-phone">Phone / WhatsApp</Label>
                <Input
                  id="cart-phone"
                  type="tel"
                  value={details.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cart-email">Email (optional)</Label>
                <Input
                  id="cart-email"
                  type="email"
                  value={details.email}
                  onChange={(event) => update('email', event.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cart-address">Address</Label>
                <Textarea
                  id="cart-address"
                  value={details.address}
                  onChange={(event) => update('address', event.target.value)}
                  autoComplete="street-address"
                  placeholder="House / street / landmark"
                  className="min-h-18"
                  aria-invalid={Boolean(errors.address)}
                />
                {errors.address ? (
                  <p className="text-xs text-destructive">{errors.address}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cart-city">City</Label>
                  <Input
                    id="cart-city"
                    value={details.city}
                    onChange={(event) => update('city', event.target.value)}
                    autoComplete="address-level2"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cart-state">State</Label>
                  <Input
                    id="cart-state"
                    value={details.state}
                    onChange={(event) => update('state', event.target.value)}
                    autoComplete="address-level1"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cart-pincode">PIN code</Label>
                <Input
                  id="cart-pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={details.pincode}
                  onChange={(event) => update('pincode', event.target.value)}
                  autoComplete="postal-code"
                  aria-invalid={Boolean(errors.pincode)}
                />
                {errors.pincode ? (
                  <p className="text-xs text-destructive">{errors.pincode}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cart-notes">Order notes (optional)</Label>
                <Textarea
                  id="cart-notes"
                  value={details.notes}
                  onChange={(event) => update('notes', event.target.value)}
                  placeholder="Delivery date, gift note, fitting preferences…"
                  className="min-h-18"
                />
              </div>

              <Button type="submit" variant="whatsapp" size="lg" className="mt-2 w-full">
                <WhatsAppIcon className="size-4" />
                Complete order on WhatsApp
              </Button>

              {sent ? (
                <p className="flex items-start gap-2 rounded-md bg-primary/6 p-3 text-xs leading-relaxed text-primary">
                  <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  Your order summary has opened in WhatsApp. We confirm availability and
                  payment there, then send a payment link.
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  We do not take card details on this site. Your order is confirmed and
                  paid over WhatsApp or in the studio.
                </p>
              )}
            </form>
          </div>

          <Button asChild variant="ghost" className="mt-4 w-full">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

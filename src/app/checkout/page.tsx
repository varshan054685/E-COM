'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Loader2, Lock, ShieldCheck, Tag } from 'lucide-react';
import { useAuth } from '@/components/commerce/AuthProvider';
import { useCart } from '@/components/commerce/CartProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { formatINR } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from '@/lib/constants';
import { toast } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

type Address = {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type RazorpayWindow = Window & {
  Razorpay: new (options: Record<string, unknown>) => { open: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const emptyForm: Omit<Address, 'id' | 'isDefault' | 'label'> = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, count, loading: cartLoading, clear } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [placerLoading, setPlacerLoading] = useState(false);
  const [mockConfirmOpen, setMockConfirmOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?next=/checkout');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/addresses', { cache: 'no-store' })
      .then((r) => r.json())
      .then((rows) => {
        setAddresses(rows);
        const def = rows.find((a: Address) => a.isDefault) ?? rows[0];
        if (def) {
          setSelectedAddress(def.id);
          setForm({
            fullName: def.fullName,
            phone: def.phone,
            line1: def.line1,
            line2: def.line2 ?? '',
            city: def.city,
            state: def.state,
            pincode: def.pincode,
          });
        }
      })
      .catch(() => {});
  }, [user]);

  const shipping = useMemo(() => (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT_RATE), [subtotal]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.line1.trim()) e.line1 = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.state.trim()) e.state = 'Required';
    if (!/^[1-9]\d{5}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function loadRazorpay(): Promise<void> {
    if (typeof window !== 'undefined' && window.Razorpay) return;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Razorpay failed to load'));
      document.body.appendChild(script);
    });
  }

  async function placeOrder() {
    if (!validate()) {
      toast('Please complete your delivery details', { variant: 'error' });
      return;
    }
    setPlacerLoading(true);
    setCouponMsg('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: { ...form, label: selectedAddress === 'new' ? 'Shipping' : 'Shipping' },
          couponCode: coupon || undefined,
          paymentMethod: 'razorpay',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPlacerLoading(false);
        toast(data.error || 'Could not place your order', { variant: 'error' });
        return;
      }

      if (data.mock) {
        setPlacerLoading(false);
        setMockConfirmOpen(true);
        window.sessionStorage.setItem('jgths_pending_order', JSON.stringify(data));
        return;
      }

      // Real Razorpay flow
      await loadRazorpay();
      const rp = new (window as RazorpayWindow).Razorpay({
        key: data.razorpayKeyId,
        amount: Math.round(data.total * 100),
        currency: 'INR',
        name: 'JGTHS Boutique',
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: form.fullName,
          email: user?.email,
          contact: form.phone,
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await verify(data.orderNumber, {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            setPlacerLoading(false);
            toast('Payment window closed — no amount was charged.', { variant: 'info' });
          },
        },
        theme: { color: '#1F1B17' },
      });
      rp.open();
    } catch {
      setPlacerLoading(false);
      toast('We could not start the payment. Please try again.', { variant: 'error' });
    }
  }

  async function verify(orderNumber: string, payload: Record<string, string>) {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, ...payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        await clear();
        router.push(`/checkout/success?order=${orderNumber}`);
      } else {
        setPlacerLoading(false);
        toast(data.error || 'Payment could not be confirmed.', { variant: 'error' });
      }
    } catch {
      setPlacerLoading(false);
      toast('Payment could not be confirmed.', { variant: 'error' });
    }
  }

  async function confirmMock() {
    const pending = window.sessionStorage.getItem('jgths_pending_order');
    window.sessionStorage.removeItem('jgths_pending_order');
    const data = pending ? JSON.parse(pending) : null;
    if (data) await verify(data.orderNumber, { mock: 'true' });
  }

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setPlacerLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const data = await res.json();
      setPlacerLoading(false);
      if (res.ok) {
        setCouponMsg(`Coupon applied — you save ${formatINR(data.discount)}.`);
        toast(`Coupon applied · save ${formatINR(data.discount)}`, { variant: 'success' });
      } else {
        setCouponMsg('');
        toast(data.error || 'Coupon is not applicable', { variant: 'error' });
      }
    } catch {
      setPlacerLoading(false);
    }
  }

  if (authLoading || cartLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold-500" />
        <h1 className="mt-5 font-serif text-3xl text-charcoal-900">Almost there</h1>
        <p className="mt-3 text-sm text-ink-muted">Add a piece to your bag to continue to checkout.</p>
        <Link href="/shop" className="mt-8 inline-flex h-12 items-center bg-ink px-8 text-sm text-ivory-100">Explore the collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 pt-28 pb-20">
      <header className="mb-10">
        <p className="editorial-eyebrow mb-3">Secure checkout</p>
        <h1 className="font-serif text-4xl text-charcoal-900">Complete your order</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted"><Lock className="h-4 w-4" /> Your payment information is processed securely — we never store card details.</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          {/* Contact & address */}
          <section aria-label="Contact and delivery details">
            <h2 className="font-serif text-2xl text-charcoal-900">Delivery address</h2>
            {addresses.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => {
                      setSelectedAddress(a.id);
                      setForm({ fullName: a.fullName, phone: a.phone, line1: a.line1, line2: a.line2 ?? '', city: a.city, state: a.state, pincode: a.pincode });
                    }}
                    className={cn('border p-4 text-left transition', selectedAddress === a.id ? 'border-charcoal-900 bg-ivory-50' : 'border-ink/15 hover:border-ink/40')}
                  >
                    <p className="text-sm font-medium text-charcoal-900">{a.label ?? 'Address'}</p>
                    <p className="mt-1 text-[13px] text-ink-muted leading-relaxed">{a.fullName}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />{a.city}, {a.state} — {a.pincode}<br />{a.phone}</p>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setSelectedAddress('new'); setForm(emptyForm); }}
                  className={cn('border border-dashed p-4 text-sm text-ink-muted transition hover:border-ink/40', selectedAddress === 'new' && 'border-charcoal-900 text-charcoal-900')}
                >
                  + Use a new address
                </button>
              </div>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} error={errors.fullName} autoComplete="name" />
              <Input label="Phone" required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} autoComplete="tel" />
              <Input label="Address line 1" required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} error={errors.line1} autoComplete="address-line1" className="sm:col-span-2" />
              <Input label="Address line 2 (optional)" value={form.line2 ?? ''} onChange={(e) => setForm({ ...form, line2: e.target.value })} autoComplete="address-line2" className="sm:col-span-2" />
              <Input label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} error={errors.city} />
              <Input label="State" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} error={errors.state} />
              <Input label="Pincode" required inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })} error={errors.pincode} autoComplete="postal-code" />
            </div>
          </section>

          {/* Delivery */}
          <section aria-label="Delivery method" className="border-t border-ink/10 pt-8">
            <h2 className="font-serif text-2xl text-charcoal-900">Delivery</h2>
            <div className="mt-4 border border-ink/15 bg-ivory-50 p-5">
              <p className="text-sm font-medium text-charcoal-900">
                {shipping === 0 ? 'Standard delivery — Free' : `Standard delivery — ${formatINR(shipping)}`}
              </p>
              <p className="mt-1 text-[13px] text-ink-muted">
                {subtotal < FREE_SHIPPING_THRESHOLD
                  ? `Add ${formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.`
                  : 'Free shipping unlocked.'} Ready pieces dispatch in 2–3 days; made-to-order pieces follow their confirmed timeline.
              </p>
            </div>
          </section>

          {/* Payment note */}
          <section aria-label="Payment" className="border-t border-ink/10 pt-8">
            <h2 className="font-serif text-2xl text-charcoal-900">Payment</h2>
            <p className="mt-3 flex items-start gap-3 border border-ink/15 bg-ivory-50 p-5 text-sm text-ink-muted">
              <ShieldCheck className="h-5 w-5 shrink-0 text-gold-600" />
              Pay securely via Razorpay — UPI, cards, net banking and wallets. In demo mode (no Razorpay keys), a simulated payment completes the order without any charge.
            </p>
          </section>
        </div>

        {/* Summary side */}
        <aside className="lg:sticky lg:top-28 h-fit border border-ink/10 bg-ivory-50 p-6">
          <h2 className="font-serif text-xl text-charcoal-900">Order Summary</h2>

          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-ivory-200">
                  {item.image && <Image src={item.image} alt={item.productName} fill sizes="64px" className="object-cover" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-charcoal-900 line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-ink-muted">{[item.color, item.size].filter(Boolean).join(' · ') || 'Standard'} × {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">{formatINR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                aria-label="Coupon code"
                className="h-11 w-full border border-ink/15 bg-ivory-100 pl-10 pr-3 text-sm focus:border-ink/40 focus:outline-none"
              />
            </div>
            <button onClick={applyCoupon} disabled={placerLoading} className="h-11 border border-ink/20 px-4 text-sm hover:border-ink/50 disabled:opacity-50">Apply</button>
          </div>
          {couponMsg && <p className="mt-2 text-xs text-emerald-700">{couponMsg}</p>}

          <dl className="mt-6 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-ink-muted">Subtotal ({count} items)</dt><dd className="font-medium">{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Shipping</dt><dd className="font-medium">{shipping === 0 ? 'Free' : formatINR(shipping)}</dd></div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base">
              <dt className="font-medium text-charcoal-900">Total</dt>
              <dd className="font-medium text-charcoal-900">{formatINR(subtotal + shipping)}</dd>
            </div>
            {coupon && <p className="text-xs text-emerald-700">Coupon “{coupon}” — discount applied by the boutique at payment.</p>}
          </dl>

          <Button fullWidth size="lg" className="mt-6" isLoading={placerLoading} onClick={placeOrder} disabled={placerLoading}>
            {placerLoading ? 'Placing order…' : 'Place Order & Pay'}
          </Button>
          <p className="mt-3 text-center text-xs text-ink-faint">By placing this order you agree to our terms. Made-to-order pieces are non-refundable once production begins.</p>
        </aside>
      </div>

      {/* Mock payment confirm dialog */}
      {mockConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-charcoal-900/60" onClick={() => setMockConfirmOpen(false)} />
          <div className="relative w-full max-w-sm border border-ink/10 bg-ivory-50 p-7 shadow-lift">
            <h3 className="font-serif text-xl text-charcoal-900">Demo payment</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Razorpay keys are not configured, so this is a <strong>simulated payment</strong>. Your order will be marked paid for testing.
            </p>
            <div className="mt-6 flex gap-3">
              <Button fullWidth onClick={confirmMock}>Simulate successful payment</Button>
              <Button fullWidth variant="outline" onClick={() => setMockConfirmOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { formatDateTime, formatINR } from '@/lib/format';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toaster';

type OrderDetail = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string | null;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    productImage: string | null;
    size: string | null;
    color: string | null;
    sku: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
  payments: {
    id: string;
    amount: number;
    method: string | null;
    status: string;
    razorpayPaymentId: string | null;
    createdAt: string;
  }[];
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, { cache: 'no-store' });
      const j = await res.json();
      setOrder(j.order);
      setStatus(j.order.status);
      setPaymentStatus(j.order.paymentStatus);
      setTrackingNumber(j.order.trackingNumber ?? '');
      setNotes(j.order.notes ?? '');
    } catch {
      toast('Could not load the order', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus, trackingNumber, notes }),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) {
      toast('Order updated', { variant: 'success' });
      load();
    } else {
      toast(j.error || 'Could not update the order', { variant: 'error' });
    }
  }

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>;
  }
  if (!order) {
    return <p className="py-16 text-center text-sm text-ink-muted">Order not found.</p>;
  }

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-charcoal-900">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">{order.orderNumber}</h2>
        <p className="text-sm text-ink-muted">Placed {formatDateTime(order.createdAt)}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left: items & payment */}
        <div className="space-y-6">
          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Items</h3>
            <ul className="mt-4 divide-y divide-ink/10">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-3">
                  <span className="relative h-14 w-11 shrink-0 overflow-hidden bg-ivory-200">
                    {item.productImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.productImage} alt="" className="h-full w-full object-cover" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-charcoal-900">{item.productName}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {[item.size, item.color].filter(Boolean).join(' · ') || '—'}
                      {item.sku ? ` · ${item.sku}` : ''}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-charcoal-900">{formatINR(item.totalPrice)}</p>
                    <p className="text-xs text-ink-faint">{item.quantity} × {formatINR(item.unitPrice)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between text-ink-muted"><dt>Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt>
                  <dd>−{formatINR(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-ink-muted"><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : formatINR(order.shipping)}</dd></div>
              <div className="flex justify-between border-t border-ink/10 pt-2 font-medium text-charcoal-900">
                <dt>Total</dt><dd>{formatINR(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Payments</h3>
            {order.payments.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">No payment records.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                {order.payments.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-charcoal-900">{formatINR(p.amount)} · {p.method ?? '—'}</p>
                      <p className="text-xs text-ink-faint">
                        {formatDateTime(p.createdAt)}{p.razorpayPaymentId ? ` · ${p.razorpayPaymentId}` : ''}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold uppercase ${p.status === 'PAID' ? 'text-emerald-700' : p.status === 'FAILED' ? 'text-red-700' : 'text-amber-700'}`}>
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right: customer & controls */}
        <div className="space-y-6">
          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Customer</h3>
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium text-charcoal-900">{order.customerName}</p>
              <p className="text-ink-muted">{order.customerEmail}</p>
              <p className="text-ink-muted">{order.customerPhone}</p>
            </div>
            {order.shippingAddress && (
              <>
                <h3 className="mt-5 text-sm font-semibold uppercase tracking-widest text-ink-muted">Delivery address</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{order.shippingAddress}</p>
              </>
            )}
          </section>

          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Manage</h3>
            <div className="mt-4 space-y-4">
              <Field label="Order status">
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Payment status">
                <Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                  {Object.entries(PAYMENT_STATUSES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Tracking number">
                <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Courier / AWB" />
              </Field>
              <Field label="Internal notes">
                <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes visible to staff only" />
              </Field>
              <Button fullWidth isLoading={saving} onClick={save}>Save changes</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

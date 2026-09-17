'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { formatDate, formatDateTime, formatINR } from '@/lib/format';
import { ORDER_STATUSES } from '@/lib/constants';
import { CUSTOM_ORDER_STATUS_LABELS } from '@/lib/custom-order';

type CustomerDetail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number; customOrders: number; wishlist: number };
};

type OrderSummary = { orderNumber: string; status: string; total: number; createdAt: string; itemCount: number };
type CustomOrderSummary = { orderNumber: string; creationType: string; status: string; quoteAmount: number | null; createdAt: string };
type AddressSummary = { id: string; label: string | null; fullName: string; phone: string; line1: string; line2: string | null; city: string; state: string; pincode: string; isDefault: boolean };

export default function AdminCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<{
    customer: CustomerDetail;
    orders: OrderSummary[];
    customOrders: CustomOrderSummary[];
    addresses: AddressSummary[];
  } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/customers/${params.id}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData(null));
  }, [params.id]);

  if (!data) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>;
  }

  const { customer, orders, customOrders, addresses } = data;

  return (
    <div>
      <Link href="/admin/customers" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-charcoal-900">
        <ArrowLeft className="h-4 w-4" /> All customers
      </Link>
      <h2 className="mt-4 font-serif text-2xl text-charcoal-900">{customer.name}</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {customer.email}{customer.phone ? ` · ${customer.phone}` : ''} · Joined {formatDate(customer.createdAt)}
        {customer.role === 'ADMIN' && <span className="ml-2 bg-charcoal-900 px-2 py-0.5 text-[10px] uppercase tracking-widest text-ivory-100">Admin</span>}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="border border-ink/10 bg-ivory-50 p-5">
          <p className="font-serif text-2xl text-charcoal-900">{customer._count.orders}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-ink-muted">Orders</p>
        </div>
        <div className="border border-ink/10 bg-ivory-50 p-5">
          <p className="font-serif text-2xl text-charcoal-900">{customer._count.customOrders}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-ink-muted">Custom requests</p>
        </div>
        <div className="border border-ink/10 bg-ivory-50 p-5">
          <p className="font-serif text-2xl text-charcoal-900">{customer._count.wishlist}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-ink-muted">Saved pieces</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border border-ink/10 bg-ivory-50 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Orders</h3>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10 text-sm">
              {orders.map((o) => (
                <li key={o.orderNumber} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <Link href={`/admin/orders?q=${o.orderNumber}`} className="font-medium text-charcoal-900 hover:underline">{o.orderNumber}</Link>
                    <p className="text-xs text-ink-faint">{formatDateTime(o.createdAt)} · {o.itemCount} item(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-charcoal-900">{formatINR(o.total)}</p>
                    <p className="text-xs text-ink-faint">{ORDER_STATUSES.find((s) => s.value === o.status)?.label ?? o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-ink/10 bg-ivory-50 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Custom requests</h3>
          {customOrders.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">No custom requests.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10 text-sm">
              {customOrders.map((c) => (
                <li key={c.orderNumber} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <Link href={`/admin/custom-orders/${c.orderNumber}`} className="font-medium text-charcoal-900 hover:underline">{c.orderNumber}</Link>
                    <p className="text-xs text-ink-faint">{c.creationType} · {formatDate(c.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-charcoal-900">{c.quoteAmount != null ? formatINR(c.quoteAmount) : '—'}</p>
                    <p className="text-xs text-ink-faint">{CUSTOM_ORDER_STATUS_LABELS[c.status] ?? c.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 border border-ink/10 bg-ivory-50 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Addresses</h3>
        {addresses.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">No saved addresses.</p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {addresses.map((a) => (
              <li key={a.id} className="border border-ink/10 p-4 text-sm">
                <p className="font-medium text-charcoal-900">
                  {a.label ?? 'Address'}{a.isDefault && <span className="ml-2 text-[10px] uppercase tracking-widest text-gold-700">Default</span>}
                </p>
                <p className="mt-1 leading-relaxed text-ink-muted">
                  {a.fullName} · {a.phone}<br />
                  {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                  {a.city}, {a.state} {a.pincode}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

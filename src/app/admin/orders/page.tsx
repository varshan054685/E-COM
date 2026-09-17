'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Search } from 'lucide-react';
import { formatDateTime, formatINR } from '@/lib/format';
import { ORDER_STATUSES } from '@/lib/constants';

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  createdAt: string;
};

const statusTone: Record<string, string> = {
  PENDING_PAYMENT: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  IN_PRODUCTION: 'bg-violet-100 text-violet-800',
  READY_TO_SHIP: 'bg-teal-100 text-teal-800',
  SHIPPED: 'bg-teal-100 text-teal-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-700',
  RETURNED: 'bg-stone-200 text-stone-700',
};

const paymentTone: Record<string, string> = {
  PAID: 'text-emerald-700',
  UNPAID: 'text-amber-700',
  FAILED: 'text-red-700',
  REFUNDED: 'text-stone-500',
};

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<OrderRow[] | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(async (query: string, st: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (st) params.set('status', st);
    const res = await fetch(`/api/admin/orders?${params.toString()}`, { cache: 'no-store' });
    const j = await res.json();
    setRows(j.orders ?? []);
  }, []);

  useEffect(() => { load('', ''); }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">Orders</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load(q, status)}
              placeholder="Search orders…"
              className="h-10 w-56 border border-ink/15 bg-ivory-100 pl-9 pr-3 text-sm focus:border-ink/40 focus:outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); load(q, e.target.value); }}
            aria-label="Filter by status"
            className="h-10 border border-ink/15 bg-ivory-100 px-3 text-sm focus:border-ink/40 focus:outline-none"
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {!rows ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>
      ) : rows.length === 0 ? (
        <p className="border border-dashed border-ink/15 bg-ivory-50/50 px-6 py-16 text-center text-sm text-ink-muted">
          No orders match.
        </p>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-ivory-100 text-left text-xs uppercase tracking-widest text-ink-muted">
              <tr>
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Placed</th>
                <th className="p-3 font-medium">Items</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Payment</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-ivory-50">
              {rows.map((o) => (
                <tr key={o.id} className="hover:bg-ivory-100/60">
                  <td className="p-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-charcoal-900 hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="p-3">
                    <p className="text-charcoal-900">{o.customerName}</p>
                    <p className="text-xs text-ink-faint">{o.customerEmail}</p>
                  </td>
                  <td className="p-3 whitespace-nowrap text-ink-muted">{formatDateTime(o.createdAt)}</td>
                  <td className="p-3 text-ink-muted">{o.itemCount}</td>
                  <td className="p-3 font-medium text-charcoal-900">{formatINR(o.total)}</td>
                  <td className={`p-3 text-xs font-semibold uppercase tracking-wide ${paymentTone[o.paymentStatus] ?? ''}`}>
                    {o.paymentStatus}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-1 text-[11px] font-medium ${statusTone[o.status] ?? 'bg-ivory-200 text-charcoal-800'}`}>
                      {ORDER_STATUSES.find((s) => s.value === o.status)?.label ?? o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

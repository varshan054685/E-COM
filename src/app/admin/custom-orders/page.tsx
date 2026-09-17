'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { formatDate, formatINR } from '@/lib/format';
import { CUSTOM_ORDER_STATUS_LABELS } from '@/lib/custom-order';

type RequestRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  creationType: string;
  status: string;
  paymentStatus: string;
  quoteAmount: number | null;
  deadline: string | null;
  createdAt: string;
  image: string | null;
};

const statusTone: Record<string, string> = {
  NEW_REQUEST: 'bg-amber-100 text-amber-800',
  REQUIREMENTS_CONFIRMED: 'bg-blue-100 text-blue-800',
  QUOTE_SENT: 'bg-violet-100 text-violet-800',
  AWAITING_CUSTOMER: 'bg-stone-200 text-stone-700',
  PAYMENT_PENDING: 'bg-amber-100 text-amber-800',
  IN_PRODUCTION: 'bg-violet-100 text-violet-800',
  QUALITY_CHECK: 'bg-teal-100 text-teal-800',
  READY: 'bg-teal-100 text-teal-800',
  SHIPPED: 'bg-teal-100 text-teal-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminCustomOrdersPage() {
  const [rows, setRows] = useState<RequestRow[] | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(async (query: string, st: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (st) params.set('status', st);
    const res = await fetch(`/api/admin/custom-orders?${params.toString()}`, { cache: 'no-store' });
    const j = await res.json();
    setRows(j.requests ?? []);
  }, []);

  useEffect(() => { load('', ''); }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">Create &amp; Requests</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(q, status)}
            placeholder="Search requests…"
            className="h-10 w-56 border border-ink/15 bg-ivory-100 px-3 text-sm focus:border-ink/40 focus:outline-none"
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); load(q, e.target.value); }}
            aria-label="Filter by status"
            className="h-10 border border-ink/15 bg-ivory-100 px-3 text-sm focus:border-ink/40 focus:outline-none"
          >
            <option value="">All statuses</option>
            {Object.entries(CUSTOM_ORDER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {!rows ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>
      ) : rows.length === 0 ? (
        <p className="border border-dashed border-ink/15 bg-ivory-50/50 px-6 py-16 text-center text-sm text-ink-muted">
          No custom requests yet.
        </p>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-ivory-100 text-left text-xs uppercase tracking-widest text-ink-muted">
              <tr>
                <th className="p-3 font-medium">Request</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Creation</th>
                <th className="p-3 font-medium">Deadline</th>
                <th className="p-3 font-medium">Quote</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-ivory-50">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-ivory-100/60">
                  <td className="p-3">
                    <Link href={`/admin/custom-orders/${r.orderNumber}`} className="font-medium text-charcoal-900 hover:underline">
                      {r.orderNumber}
                    </Link>
                    <p className="text-xs text-ink-faint">{formatDate(r.createdAt)}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-charcoal-900">{r.customerName}</p>
                    <p className="text-xs text-ink-faint">{r.customerPhone}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      {r.image && (
                        <span className="relative h-10 w-8 shrink-0 overflow-hidden bg-ivory-200">
                          <Image src={r.image} alt="" fill sizes="32px" className="object-cover" />
                        </span>
                      )}
                      <span className="text-ink-muted">{r.creationType}</span>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap text-ink-muted">{r.deadline ? formatDate(r.deadline) : '—'}</td>
                  <td className="p-3 text-charcoal-900">{r.quoteAmount != null ? formatINR(r.quoteAmount) : '—'}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-1 text-[11px] font-medium ${statusTone[r.status] ?? 'bg-ivory-200 text-charcoal-800'}`}>
                      {CUSTOM_ORDER_STATUS_LABELS[r.status] ?? r.status}
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

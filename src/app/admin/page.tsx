'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Package, Scissors, Users, Wallet } from 'lucide-react';
import { formatINR } from '@/lib/format';
import { ORDER_STATUSES } from '@/lib/constants';
import { CUSTOM_ORDER_STATUS_LABELS } from '@/lib/custom-order';

type Stats = {
  revenue: number;
  discount: number;
  paidOrders: number;
  totalOrders: number;
  todayOrders: number;
  totalCustomers: number;
  newCustomers: number;
  productsCount: number;
  pendingCustom: number;
  pendingReviews: number;
  lowStock: { id: string; name: string; stock: number; lowStockThreshold: number }[];
  recentOrders: { orderNumber: string; customerName: string; total: number; status: string; createdAt: string }[];
  recentCustom: { orderNumber: string; customerName: string; creationType: string; status: string; createdAt: string }[];
  statusBreakdown: { status: string; count: number }[];
  salesSeries: { date: string; revenue: number; orders: number }[];
  topProducts: { productId: string; name: string; quantity: number; revenue: number }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>;
  }

  const maxRevenue = Math.max(...stats.salesSeries.map((s) => s.revenue), 1);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card icon={Wallet} label="Revenue (paid)" value={formatINR(stats.revenue)} sub={`${stats.paidOrders} paid orders`} />
        <Card icon={Package} label="Orders" value={String(stats.totalOrders)} sub={`${stats.todayOrders} today`} />
        <Card icon={Users} label="Customers" value={String(stats.totalCustomers)} sub={`${stats.newCustomers} new (30d)`} />
        <Card icon={Scissors} label="Pending requests" value={String(stats.pendingCustom)} sub={`${stats.pendingReviews} pending reviews`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="border border-ink/10 bg-ivory-50 p-6">
          <h2 className="font-serif text-xl text-charcoal-900">Sales · last 30 days</h2>
          <div className="mt-5 flex h-40 items-end gap-[3px]">
            {stats.salesSeries.map((s) => (
              <div key={s.date} className="group relative flex-1" title={`${s.date}: ${formatINR(s.revenue)}`}>
                <div
                  className="w-full bg-gold-500/70 hover:bg-gold-500 transition-colors"
                  style={{ height: `${Math.max((s.revenue / maxRevenue) * 100, s.revenue > 0 ? 4 : 1.5)}%` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-ink-faint">{formatINR(stats.salesSeries.reduce((a, s) => a + s.revenue, 0))} collected in the last 30 days · {stats.salesSeries.reduce((a, s) => a + s.orders, 0)} orders</p>

          {stats.topProducts.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Top pieces</p>
              <ul className="mt-3 space-y-2 text-sm">
                {stats.topProducts.map((p) => (
                  <li key={p.productId} className="flex justify-between">
                    <span className="text-charcoal-900">{p.name}</span>
                    <span className="text-ink-muted">{p.quantity} sold · {formatINR(p.revenue)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stats.statusBreakdown.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Orders by status</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {stats.statusBreakdown.map((s) => (
                  <span key={s.status} className="border border-ink/10 px-3 py-1 text-xs">{label(s.status, ORDER_STATUSES)} · {s.count}</span>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="border border-ink/10 bg-ivory-50 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-charcoal-900">Low stock</h2>
              <Link href="/admin/inventory" className="text-xs text-gold-700 hover:underline">View all</Link>
            </div>
            {stats.lowStock.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">All stocked up.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {stats.lowStock.map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <span className="line-clamp-1 text-charcoal-900">{p.name}</span>
                    <span className={p.stock === 0 ? 'font-medium text-red-700' : 'text-amber-700'}>{p.stock} left</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h2 className="font-serif text-lg text-charcoal-900">Newest creation requests</h2>
            {stats.recentCustom.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">No requests yet.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {stats.recentCustom.map((c) => (
                  <li key={c.orderNumber} className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-charcoal-900">{c.creationType}</p>
                      <p className="text-xs text-ink-faint">{c.customerName.split(' ')[0]} · {label(c.status, CUSTOM_ORDER_STATUS_LABELS)}</p>
                    </div>
                    <Link href={`/admin/custom-orders/${c.orderNumber}`} className="shrink-0 self-center text-gold-700"><ArrowRight className="h-4 w-4" /></Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <div className="border border-ink/10 bg-ivory-50 p-5">
      <Icon className="h-5 w-5 text-gold-600" />
      <p className="mt-4 font-serif text-2xl text-charcoal-900">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-ink-muted">{label}</p>
      {sub && <p className="mt-1 text-[11px] text-ink-faint">{sub}</p>}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function label(value: string, source: any): string {
  const found = Array.isArray(source) ? source.find((s) => s.value === value) : source[value];
  return found?.label ?? value;
}
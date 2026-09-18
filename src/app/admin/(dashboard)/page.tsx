import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Boxes, IndianRupee, Package, ShoppingCart, Users } from 'lucide-react';

import { SetupNotice } from '@/components/admin/setup-notice';
import { StatCard } from '@/components/admin/stat-card';
import {
  LOW_STOCK_THRESHOLD,
  ORDER_PIPELINE,
  getDashboardStats,
  type OrderStatus,
} from '@/lib/admin/queries';
import { formatPrice } from '@/lib/format';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata: Metadata = { title: 'Overview' };

const STATUS_LABEL = new Map(ORDER_PIPELINE.map((entry) => [entry.value, entry.label]));

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="eyebrow text-gold-600">Dashboard</p>
        <h1 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">Overview</h1>
        <p className="mt-2.5 text-sm text-muted-foreground">
          Revenue, tailoring workload and stock health at a glance.
        </p>
      </header>

      {!isSupabaseConfigured ? <SetupNotice /> : null}

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          hint="Paid orders, all time"
          Icon={IndianRupee}
          tone="gold"
        />
        <StatCard
          label="Active Orders"
          value={String(stats.activeOrders)}
          hint={
            stats.pendingPaymentCount > 0
              ? `${stats.pendingPaymentCount} awaiting payment`
              : 'Everything is paid up'
          }
          Icon={ShoppingCart}
        />
        <StatCard
          label="Registered Users"
          value={String(stats.totalUsers)}
          hint="Customer accounts"
          Icon={Users}
          tone="magenta"
        />
        <StatCard
          label="Low Stock Alerts"
          value={String(stats.lowStock.length)}
          hint={`At or below ${LOW_STOCK_THRESHOLD} units`}
          Icon={Boxes}
          tone={stats.lowStock.length > 0 ? 'danger' : 'default'}
          attention={stats.lowStock.length > 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Tailoring pipeline */}
        <section className="rounded-xl border border-ink-100 bg-card p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl">Tailoring pipeline</h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              All orders
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <ul className="mt-5 flex flex-col divide-y divide-ink-100">
            {stats.revenueByStatus.map((entry) => (
              <li key={entry.status} className="flex items-center justify-between gap-4 py-3.5">
                <span className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">
                    {entry.orders}
                  </span>
                  <span className="text-sm">
                    {STATUS_LABEL.get(entry.status as OrderStatus) ?? entry.status}
                  </span>
                </span>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {formatPrice(entry.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Low stock */}
        <section className="rounded-xl border border-ink-100 bg-card p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl">Low stock</h2>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Manage products
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {stats.lowStock.length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">
              {isSupabaseConfigured
                ? 'Nothing is running low. Every piece is above the threshold.'
                : 'Connect Supabase to see stock levels.'}
            </p>
          ) : (
            <ul className="mt-5 flex flex-col divide-y divide-ink-100">
              {stats.lowStock.slice(0, 6).map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="flex min-w-0 items-center gap-3">
                    <Package className="size-4 shrink-0 text-ink-300" aria-hidden="true" />
                    <span className="truncate text-sm">{product.title}</span>
                  </span>
                  <span
                    className={
                      product.stock_count === 0
                        ? 'shrink-0 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive tabular-nums'
                        : 'shrink-0 rounded-full bg-gold-100 px-2.5 py-1 text-xs font-medium text-gold-700 tabular-nums'
                    }
                  >
                    {product.stock_count === 0 ? 'Out of stock' : `${product.stock_count} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

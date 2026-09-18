import type { Metadata } from 'next';
import { ClipboardList } from 'lucide-react';

import { OrdersTable } from '@/components/admin/orders-table';
import { SetupNotice } from '@/components/admin/setup-notice';
import { listOrders } from '@/lib/admin/queries';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata: Metadata = { title: 'Orders & Tailoring' };

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  const inProduction = orders.filter(
    (order) => order.status === 'received' || order.status === 'in_embroidery',
  ).length;

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-600">Atelier floor</p>
          <h1 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">Orders &amp; Tailoring</h1>
          <p className="mt-2.5 text-sm text-muted-foreground">
            {isSupabaseConfigured
              ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} · ${inProduction} awaiting the studio.`
              : 'Order management needs a database connection.'}
          </p>
        </div>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ClipboardList className="size-3.5" aria-hidden="true" />
          Click an order number to see measurements and references
        </p>
      </header>

      {!isSupabaseConfigured ? <SetupNotice /> : null}

      <OrdersTable orders={orders} />
    </div>
  );
}

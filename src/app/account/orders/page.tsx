'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Package } from 'lucide-react';
import { formatINR } from '@/lib/format';
import { ORDER_STATUSES } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';

type OrderRow = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  previewImage: string | null;
  itemNames: string[];
  createdAt: string;
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    fetch('/api/orders', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setOrders(j.orders ?? []))
      .catch(() => setOrders([]));
  }, []);

  if (!orders) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>;
  }

  return (
    <div>
      <header className="mb-8">
        <p className="editorial-eyebrow mb-2">My account</p>
        <h1 className="font-serif text-4xl text-charcoal-900">Orders</h1>
      </header>

      {orders.length === 0 && (
        <div className="border border-dashed border-ink/15 p-10 text-center">
          <Package className="mx-auto h-8 w-8 text-ink-faint" />
          <p className="mt-4 text-sm text-ink-muted">You haven't placed an order yet.</p>
          <Link href="/shop" className="mt-4 inline-flex h-11 items-center bg-ink px-6 text-sm text-ivory-100">Explore the collection</Link>
        </div>
      )}

      <ul className="space-y-4">
        {orders.map((o) => {
          const statusMeta = ORDER_STATUSES.find((s) => s.value === o.status);
          return (
            <li key={o.orderNumber}>
              <Link href={`/account/orders/${o.orderNumber}`} className="flex flex-col gap-4 border border-ink/10 bg-ivory-50 p-5 transition hover:border-ink/30 sm:flex-row sm:items-center">
                <span className="relative h-24 w-20 shrink-0 overflow-hidden bg-ivory-200">
                  {o.previewImage ? <Image src={o.previewImage} alt="" fill sizes="80px" className="object-cover" /> : null}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-charcoal-900">{o.orderNumber}</p>
                    <Badge tone={statusMeta?.tone === 'green' ? 'gold' : statusMeta?.tone === 'red' ? 'stone' : 'stone'}>
                      {statusMeta?.label ?? o.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted line-clamp-1">{o.itemNames.join(', ')}{o.itemCount > o.itemNames.length ? ` +${o.itemCount - o.itemNames.length} more` : ''}</p>
                  <p className="mt-1 text-xs text-ink-faint">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-charcoal-900">{formatINR(o.total)}</p>
                  <p className="mt-1 text-xs text-ink-muted">{o.paymentStatus === 'PAID' ? 'Paid' : o.paymentStatus === 'UNPAID' ? 'Payment due' : o.paymentStatus}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
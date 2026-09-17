'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, MessageCircle } from 'lucide-react';
import { formatINR } from '@/lib/format';
import { ORDER_STATUSES } from '@/lib/constants';
import { whatsappLink } from '@/lib/site';
import { Badge } from '@/components/ui/Badge';
import { OrderTimeline } from '@/components/account/OrderTimeline';

type OrderItem = {
  id: string;
  productName: string;
  productImage: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type Order = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  createdAt: string;
  items: OrderItem[];
  payments: { amount: number; status: string; method: string; createdAt: string }[];
};

export default function OrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${params.orderNumber}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setOrder(j.order))
      .catch(() => setError(true));
  }, [params.orderNumber]);

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-ink-muted">We couldn't find that order.</p>
        <Link href="/account/orders" className="mt-4 inline-flex text-sm text-gold-700 hover:underline">Back to orders</Link>
      </div>
    );
  }

  if (!order) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>;
  }

  const statusMeta = ORDER_STATUSES.find((s) => s.value === order.status);

  return (
    <div>
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-charcoal-900">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="editorial-eyebrow mb-2">Order</p>
          <h1 className="font-serif text-3xl text-charcoal-900">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Badge tone={order.status === 'DELIVERED' ? 'gold' : 'stone'}>{statusMeta?.label ?? order.status}</Badge>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section>
            <h2 className="font-serif text-xl text-charcoal-900">Items</h2>
            <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <span className="relative h-24 w-20 shrink-0 overflow-hidden bg-ivory-200">
                    {item.productImage ? <Image src={item.productImage} alt={item.productName} fill sizes="80px" className="object-cover" /> : null}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal-900">{item.productName}</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {[item.color, item.size].filter(Boolean).join(' · ') || 'Standard'} · Qty {item.quantity}
                    </p>
                    <p className="mt-1 text-xs text-ink-faint">{formatINR(item.unitPrice)} each</p>
                  </div>
                  <span className="text-sm font-medium">{formatINR(item.totalPrice)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h2 className="font-serif text-xl text-charcoal-900">Delivery details</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {order.customerName}<br />
              {order.shippingAddress}<br />
              {order.customerPhone}
            </p>
          </section>

          <a
            href={whatsappLink(`Hi JGTHS, I have a question about order ${order.orderNumber}.`)}
            target="_blank" rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 border border-[#25D366]/40 px-6 text-sm text-[#128C7E] hover:bg-[#25D366]/5"
          >
            <MessageCircle className="h-4 w-4" /> Ask about this order
          </a>
        </div>

        <aside className="space-y-8">
          <div className="border border-ink/10 bg-ivory-50 p-6">
            <h2 className="font-serif text-lg text-charcoal-900">Order total</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-muted">Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700"><dt>Discount {order.couponCode ? `(${order.couponCode})` : ''}</dt><dd>− {formatINR(order.discount)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-ink-muted">Shipping</dt><dd>{order.shipping ? formatINR(order.shipping) : 'Free'}</dd></div>
              <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-medium text-charcoal-900"><dt>Total</dt><dd>{formatINR(order.total)}</dd></div>
            </dl>
            <p className="mt-4 text-xs text-ink-faint">
              {order.paymentStatus === 'PAID' ? 'Payment received.' : 'Payment is due. We will reach out with a secure link.'}
            </p>
          </div>

          <div className="border border-ink/10 p-6">
            <h2 className="font-serif text-lg text-charcoal-900">Track your order</h2>
            <div className="mt-5">
              <OrderTimeline status={order.status} createdAt={order.createdAt} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
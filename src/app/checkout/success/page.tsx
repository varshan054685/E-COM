import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { SITE } from '@/lib/site';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Order confirmed | JGTHS Boutique',
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order = '' } = await searchParams;
  const record = order
    ? await prisma.order.findUnique({ where: { orderNumber: order } })
    : null;

  if (!record) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-shell px-4 pt-40 pb-24 text-center">
        <h1 className="font-serif text-3xl text-charcoal-900">We couldn't find that order</h1>
        <p className="mt-3 text-sm text-ink-muted">Check your order number, your email, or visit your account orders.</p>
        <Link href="/account/orders" className="mt-8 inline-flex h-12 items-center bg-ink px-8 text-sm text-ivory-100 hover:bg-charcoal-800">
          View my orders
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10">
          <CheckCircle2 className="h-8 w-8 text-gold-600" />
        </div>
        <h1 className="mt-6 font-serif text-4xl text-charcoal-900">
          Thank you{record.customerName ? `, ${record.customerName.split(' ')[0]}` : ''}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          Your order <span className="font-medium text-charcoal-900">{record.orderNumber}</span> has been received.
          {record.paymentStatus === 'PAID'
            ? ' We have received your payment and will begin preparing your pieces.'
            : ' Complete your payment from your account to confirm the order.'}
        </p>

        <div className="mt-8 border border-ink/10 bg-ivory-50 p-6 text-left">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-ink-muted">Order number</dt><dd className="mt-0.5 font-medium text-charcoal-900">{record.orderNumber}</dd></div>
            <div><dt className="text-ink-muted">Status</dt><dd className="mt-0.5 font-medium text-charcoal-900">{record.status.toLowerCase().replace(/_/g, ' ')}</dd></div>
            <div><dt className="text-ink-muted">Estimated dispatch</dt><dd className="mt-0.5 font-medium text-charcoal-900">2–3 working days</dd></div>
            <div><dt className="text-ink-muted">Total</dt><dd className="mt-0.5 font-medium text-charcoal-900">₹{record.total.toNumber().toLocaleString('en-IN')}</dd></div>
          </dl>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account/orders" className="inline-flex h-12 items-center bg-ink px-8 text-sm text-ivory-100 hover:bg-charcoal-800">Track this order</Link>
          <Link href="/shop" className="inline-flex h-12 items-center border border-ink/20 px-8 text-sm text-charcoal-900 hover:border-ink/50">Continue shopping</Link>
        </div>

        <p className="mt-10 text-xs text-ink-faint">
          Questions? WhatsApp us at <a href={`https://wa.me/${SITE.whatsapp}`} className="underline decoration-ink/20 underline-offset-2 hover:text-gold-600">{SITE.phone}</a>
        </p>
      </div>
    </main>
  );
}
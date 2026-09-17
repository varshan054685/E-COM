import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Package, Ruler, ShoppingBag, Sparkles } from 'lucide-react';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatINR } from '@/lib/format';
import { ORDER_STATUSES } from '@/lib/constants';
import { CUSTOM_ORDER_STATUS_LABELS } from '@/lib/custom-order';

export default async function AccountOverviewPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/account');

  const [orders, customOrders, addresses, measurementCount] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.customOrder.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.address.count({ where: { userId: user.id } }),
    prisma.measurementProfile.count({ where: { userId: user.id } }),
  ]);

  const firstName = user.name.split(' ')[0];
  const statusLabel = (v: string) => ORDER_STATUSES.find((s) => s.value === v)?.label ?? v;

  return (
    <div>
      <header className="mb-8">
        <p className="editorial-eyebrow mb-2">My account</p>
        <h1 className="font-serif text-4xl text-charcoal-900">Namaste, {firstName}</h1>
        <p className="mt-2 text-sm text-ink-muted">Welcome to your JGTHS wardrobe and atelier requests.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Package} label="Orders placed" value={String(orders.length ? orders.length : 0)} href="/account/orders" />
        <Stat icon={ShoppingBag} label="Creation requests" value={String(customOrders.length)} href="/account/custom-orders" />
        <Stat icon={Ruler} label="Measurement profiles" value={String(measurementCount)} href="/account/measurements" />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-charcoal-900">Recent orders</h2>
          <Link href="/account/orders" className="text-sm text-gold-700 hover:underline underline-offset-4">View all</Link>
        </div>
        {orders.length === 0 ? (
          <EmptyLine text="No orders yet — your first piece awaits." href="/shop" cta="Explore the collection" />
        ) : (
          <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.orderNumber}`} className="flex items-center justify-between py-4 hover:bg-ivory-50 px-1">
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">{o.orderNumber}</p>
                    <p className="text-xs text-ink-muted">{o.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {statusLabel(o.status)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatINR(o.total.toNumber())}</span>
                    <ArrowRight className="h-4 w-4 text-ink-faint" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-charcoal-900">Creation requests</h2>
          <Link href="/account/custom-orders" className="text-sm text-gold-700 hover:underline underline-offset-4">View all</Link>
        </div>
        {customOrders.length === 0 ? (
          <EmptyLine text="Have a design in mind? Start a custom couture request." href="/custom-couture" cta="Begin a creation" />
        ) : (
          <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {customOrders.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-4 px-1">
                <div>
                  <p className="text-sm font-medium text-charcoal-900">{c.orderNumber} · {c.creationType}</p>
                  <p className="text-xs text-ink-muted">{CUSTOM_ORDER_STATUS_LABELS[c.status] ?? c.status}</p>
                </div>
                {c.quoteAmount && <span className="text-sm font-medium">{formatINR(c.quoteAmount.toNumber())}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 border border-gold-500/30 bg-gold-500/5 p-6">
        <p className="flex items-center gap-2 text-sm text-charcoal-900"><Sparkles className="h-4 w-4 text-gold-600" /> Did you know?</p>
        <p className="mt-2 text-sm text-ink-muted">
          Save a measurement profile once and every future blouse or creation can be stitched to your exact fit. {addresses > 0 ? `You have ${addresses} saved address${addresses > 1 ? 'es' : ''}.` : ''}
        </p>
        <Link href="/account/measurements" className="mt-4 inline-flex text-sm text-gold-700 hover:underline underline-offset-4">Add measurements →</Link>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href: string }) {
  return (
    <Link href={href} className="border border-ink/10 bg-ivory-50 p-5 transition hover:border-ink/30">
      <Icon className="h-5 w-5 text-gold-600" />
      <p className="mt-4 font-serif text-3xl text-charcoal-900">{value}</p>
      <p className="text-xs uppercase tracking-widest text-ink-muted mt-1">{label}</p>
    </Link>
  );
}

function EmptyLine({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="mt-4 border border-dashed border-ink/15 p-8 text-center">
      <p className="text-sm text-ink-muted">{text}</p>
      <Link href={href} className="mt-4 inline-flex h-11 items-center bg-ink px-6 text-sm text-ivory-100">{cta}</Link>
    </div>
  );
}
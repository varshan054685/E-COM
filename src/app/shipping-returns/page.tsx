import type { Metadata } from 'next';
import { buildSeo } from '@/lib/seo';
import { SITE, whatsappLink } from '@/lib/site';

export const metadata: Metadata = buildSeo({
  title: 'Shipping & Returns',
  description:
    'Shipping timelines, made-to-order production windows, and the JGTHS returns policy — explained plainly.',
  path: '/shipping-returns',
});

const shipping = [
  {
    title: 'Ready-to-ship pieces',
    body: 'Dispatched from Coimbatore within 2–3 business days. Delivery across India typically takes 3–7 days depending on your pincode.',
  },
  {
    title: 'Made-to-order & custom couture',
    body: 'Production windows are listed on each piece — usually 2 to 3 weeks for bridal work. Shipping time is additional, and we confirm every date with you before stitching begins.',
  },
  {
    title: 'Shipping fee',
    body: 'A flat ₹150 across India. Shipping is complimentary on orders above ₹10,000.',
  },
  {
    title: 'International delivery',
    body: 'We ship worldwide by arrangement. Write to us on WhatsApp with your city and we will quote the courier.',
  },
];

const returns = [
  {
    title: 'Ready-to-ship pieces',
    body: 'Returnable within 7 days of delivery, unworn, with tags and packaging intact. Refunds are issued to the original payment method within 5–7 working days of our quality check.',
  },
  {
    title: 'Made-to-order & custom pieces',
    body: 'Crafted to your measurements, these cannot be returned or exchanged — which is why we schedule fittings and share work-in-progress photos before dispatch.',
  },
  {
    title: 'Damaged or wrong items',
    body: 'If a piece arrives damaged or is not what you ordered, message us within 48 hours with photographs. We will repair, replace, or refund — the choice is yours.',
  },
  {
    title: 'Exchanges',
    body: 'Size exchanges for ready-to-ship blouses are free within 7 days, subject to stock availability.',
  },
];

export default function ShippingReturnsPage() {
  return (
    <div className="bg-ivory-100">
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 pt-32 pb-20">
        <p className="editorial-eyebrow mb-4">Policies</p>
        <h1 className="font-serif text-5xl text-charcoal-900 sm:text-6xl">Shipping &amp; Returns</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          Explained plainly, the way we would explain it across the counter.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <section>
            <h2 className="font-serif text-3xl text-charcoal-900">Shipping</h2>
            <dl className="mt-8 space-y-7">
              {shipping.map((s) => (
                <div key={s.title} className="border-t border-ink/10 pt-5">
                  <dt className="text-sm font-semibold text-charcoal-900">{s.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-charcoal-900">Returns</h2>
            <dl className="mt-8 space-y-7">
              {returns.map((s) => (
                <div key={s.title} className="border-t border-ink/10 pt-5">
                  <dt className="text-sm font-semibold text-charcoal-900">{s.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="mt-16 border border-ink/10 bg-ivory-50 p-8">
          <h2 className="font-serif text-2xl text-charcoal-900">Questions about an order?</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            WhatsApp is fastest — {SITE.phone}. Or write to {SITE.email} with your order number
            and we will take it from there.
          </p>
          <a
            href={whatsappLink('Hi JGTHS, I have a question about my order.')}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex h-11 items-center bg-ink px-6 text-sm text-ivory-100 hover:bg-charcoal-800 transition"
          >
            Message the boutique
          </a>
        </section>
      </div>
    </div>
  );
}

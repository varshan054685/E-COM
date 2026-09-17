import type { Metadata } from 'next';
import { buildSeo } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata: Metadata = buildSeo({
  title: 'Terms of Service',
  description:
    'The terms that govern purchases, custom orders, and use of the JGTHS Designer Boutique website.',
  path: '/terms',
});

const sections = [
  {
    title: 'The boutique',
    body: `This website is operated by JGTHS Designer Boutique & Aari Couture, ${SITE.fullAddress}. By using the site you agree to these terms.`,
  },
  {
    title: 'Orders & pricing',
    body: 'All prices are in Indian Rupees and include what is stated on the product page. An order becomes official once payment succeeds and you receive a confirmation. We may cancel and fully refund an order in the rare case of a pricing error or stock shortfall.',
  },
  {
    title: 'Custom couture requests',
    body: 'Submitting a custom request reserves production time but is not a confirmed order. Work begins only after the quote is approved and payment (or its first instalment) is received. Quotes are valid for 14 days.',
  },
  {
    title: 'Made-to-order timelines',
    body: 'Production windows are estimates, stated honestly and worked to with care — but embroidery is handwork, and festivals in Coimbatore can move a dispatch date by a few days. We will always tell you early if a timeline changes.',
  },
  {
    title: 'Intellectual property',
    body: 'Designs, motifs, photography, and text on this site belong to the boutique. Our pieces are handcrafted; slight variations between the photograph and your piece are the signature of the craft, not defects.',
  },
  {
    title: 'Acceptable use',
    body: 'Please do not misuse the site — no attempts to breach security, scrape content at scale, or place fraudulent orders. Accounts used for such purposes may be suspended.',
  },
  {
    title: 'Governing law',
    body: 'These terms are governed by the laws of India, with jurisdiction in Coimbatore, Tamil Nadu.',
  },
];

export default function TermsPage() {
  return (
    <div className="bg-ivory-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-32 pb-20">
        <p className="editorial-eyebrow mb-4">Legal</p>
        <h1 className="font-serif text-5xl text-charcoal-900">Terms of Service</h1>
        <p className="mt-4 text-sm text-ink-muted">Last updated: September 2026</p>

        <div className="mt-12 space-y-9">
          {sections.map((s) => (
            <section key={s.title} className="border-t border-ink/10 pt-6">
              <h2 className="font-serif text-2xl text-charcoal-900">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

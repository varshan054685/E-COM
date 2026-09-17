import type { Metadata } from 'next';
import { buildSeo } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata: Metadata = buildSeo({
  title: 'Privacy Policy',
  description:
    'How JGTHS Designer Boutique collects, uses, and protects your personal information.',
  path: '/privacy',
});

const sections = [
  {
    title: 'What we collect',
    body: 'When you shop with us we collect your name, contact details, delivery address, and the measurements you choose to share for custom work. Payment is processed by Razorpay; we never see or store your card details.',
  },
  {
    title: 'How we use it',
    body: 'Your information is used to fulfil orders, schedule fittings, provide quotes for custom couture, and — only if you opt in — send occasional notes from the boutique. We do not sell or rent your data to anyone.',
  },
  {
    title: 'Measurements & photos',
    body: 'Measurement profiles and inspiration images you upload for custom orders are visible only to you and the boutique staff who craft your piece. You can delete them at any time from your account.',
  },
  {
    title: 'Security',
    body: 'Passwords are stored hashed, sessions are signed, and all traffic to the site is encrypted. Access to order and customer data inside the boutique is limited to staff who need it.',
  },
  {
    title: 'Cookies',
    body: 'We use a small number of essential cookies to keep you signed in and remember your cart and wishlist. No third-party advertising trackers.',
  },
  {
    title: 'Your choices',
    body: `You may request a copy of your data, correct it, or ask us to delete your account entirely by writing to ${SITE.email}. We will action it within 30 days.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-ivory-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-32 pb-20">
        <p className="editorial-eyebrow mb-4">Legal</p>
        <h1 className="font-serif text-5xl text-charcoal-900">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink-muted">Last updated: September 2026</p>

        <div className="mt-12 space-y-9">
          {sections.map((s) => (
            <section key={s.title} className="border-t border-ink/10 pt-6">
              <h2 className="font-serif text-2xl text-charcoal-900">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-ink/10 pt-6 text-sm leading-relaxed text-ink-muted">
          This policy is written in plain language to describe our genuine practices. For
          anything not covered here, contact {SITE.email}.
        </p>
      </div>
    </div>
  );
}

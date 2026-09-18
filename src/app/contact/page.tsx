import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { PageHero } from '@/components/layout/page-hero';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { SITE, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact & Appointments',
  description: `Visit the ${SITE.name} studio in ${SITE.city}, or reach us on WhatsApp, phone and email for orders and appointments.`,
};

const MAP_QUERY = encodeURIComponent(
  `${SITE.address}, ${SITE.city}, ${SITE.state} ${SITE.pincode}`,
);

const DETAILS = [
  {
    Icon: MapPin,
    label: 'Studio',
    lines: [SITE.address, `${SITE.city}, ${SITE.state} ${SITE.pincode}`, SITE.country],
  },
  {
    Icon: Phone,
    label: 'Phone',
    lines: [SITE.phoneDisplay],
    href: `tel:${SITE.phoneHref}`,
  },
  {
    Icon: Mail,
    label: 'Email',
    lines: [SITE.email],
    href: `mailto:${SITE.email}`,
  },
  {
    Icon: Clock,
    label: 'Studio hours',
    lines: SITE.hours.map((entry) => `${entry.days} · ${entry.time}`),
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Come see us"
        title="Visit the studio"
        description="Appointments are recommended so we can give you the full table — fabric books, embroidery samples and undivided attention."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="whatsapp">
            <a
              href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-4" />
              Book on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${SITE.phoneHref}`}>
              <Phone className="size-4" />
              Call the studio
            </a>
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {DETAILS.map(({ Icon, label, lines, href }) => (
                <li key={label} className="rounded-xl border border-ink-100 bg-card p-6">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/8 text-primary">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <p className="eyebrow mt-4 text-ink-400">{label}</p>
                  <div className="mt-2 flex flex-col gap-0.5 text-sm leading-relaxed text-ink-500">
                    {href ? (
                      <a
                        href={href}
                        className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                      >
                        {lines[0]}
                      </a>
                    ) : (
                      lines.map((line) => <span key={line}>{line}</span>)
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-gold-200 bg-gold-100/50 p-6">
              <p className="font-serif text-lg">Planning a wedding trousseau?</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Bring your sarees and inspiration images. Trousseau consultations take
                about 90 minutes and we recommend booking two to three months ahead of
                your date.
              </p>
              <Button asChild variant="gold" size="sm" className="mt-5">
                <Link href="/custom-orders">Plan a consultation</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-xl border border-ink-100 bg-card shadow-soft">
              <iframe
                title={`Map showing ${SITE.name} in ${SITE.city}`}
                src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[22rem] w-full border-0 lg:h-[30rem]"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 p-5">
                <p className="text-sm text-muted-foreground">
                  {SITE.address}, {SITE.city}
                </p>
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="size-3.5" />
                    Get directions
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

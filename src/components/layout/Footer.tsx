import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from '@/components/icons/social-icons';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { NewsletterForm } from '@/components/layout/newsletter-form';
import { FOOTER_LINKS, SITE, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from '@/lib/site';

const socials = [
  { label: 'Instagram', href: SITE.instagram, Icon: InstagramIcon },
  { label: 'Facebook', href: SITE.facebook, Icon: FacebookIcon },
  { label: 'YouTube', href: SITE.youtube, Icon: YoutubeIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-ink-900 text-ivory-100 sm:mt-28">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-baseline gap-2">
              <span className="font-serif text-2xl font-semibold tracking-[0.16em]">
                {SITE.shortName}
              </span>
              <span className="eyebrow text-[9px] text-gold-400">Aari Couture</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {SITE.description}
            </p>

            <div className="mt-7 max-w-sm">
              <p className="eyebrow mb-3 text-white/50">Join the atelier list</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Link columns */}
          <nav aria-label="Shop" className="lg:col-span-2">
            <h2 className="eyebrow mb-5 text-white/50">Shop</h2>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer care" className="lg:col-span-2">
            <h2 className="eyebrow mb-5 text-white/50">Customer Care</h2>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {FOOTER_LINKS.policies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h2 className="eyebrow mb-5 text-white/50">Visit the Studio</h2>
            <ul className="flex flex-col gap-4 text-sm text-white/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>
                  {SITE.address}
                  <br />
                  {SITE.city}, {SITE.state} {SITE.pincode}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a href={`tel:${SITE.phoneHref}`} className="transition-colors hover:text-gold-300">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-gold-300"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>
                  {SITE.hours.map((entry) => (
                    <span key={entry.days} className="block">
                      {entry.days} · {entry.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>

            <div className="mt-7 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-white/15 p-2.5 text-white/70 transition-colors hover:border-gold-400 hover:text-gold-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
              <a
                href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full border border-white/15 p-2.5 text-white/70 transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <WhatsAppIcon className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-white/45">
            Handcrafted in {SITE.city}, {SITE.state} · {SITE.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}

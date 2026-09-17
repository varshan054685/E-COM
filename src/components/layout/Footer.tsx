import Link from 'next/link';
import { Camera, AtSign, MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SITE, whatsappLink } from '@/lib/site';
import { NewsletterForm } from '@/components/commerce/NewsletterForm';

const shopLinks = [
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Aari Couture', href: '/collections/aari-couture' },
  { label: 'Designer Blouses', href: '/collections/designer-blouses' },
  { label: 'Bridal', href: '/collections/bridal' },
  { label: 'Sarees', href: '/collections/sarees' },
];

const brandLinks = [
  { label: 'Custom Couture', href: '/custom-couture' },
  { label: 'Aari Atelier', href: '/aari-atelier' },
  { label: 'Our Story', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const policyLinks = [
  { label: 'Shipping & Returns', href: '/shipping-returns' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-ivory-100">
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        {/* Newsletter */}
        <div className="grid lg:grid-cols-2 gap-8 py-14 border-b border-ivory-100/10">
          <div>
            <p className="editorial-eyebrow mb-3">The Atelier Letter</p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium">Notes from the boutique</h2>
            <p className="mt-3 text-sm text-ivory-100/60 max-w-md leading-relaxed">
              New collections, private previews, and stories of craft — delivered occasionally, never crowded.
            </p>
          </div>
          <div className="flex items-center lg:justify-end">
            <NewsletterForm />
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14">
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-xl font-semibold tracking-[0.18em]">JGTHS</p>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-gold-500">Designer Boutique · Aari Couture</p>
            <p className="mt-5 text-[13px] leading-relaxed text-ivory-100/60 max-w-xs">
              From the heart of Coimbatore, we craft designer couture, intricate Aari artistry, and custom creations meant to be remembered.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center border border-ivory-100/15 text-ivory-100/70 hover:border-gold-500 hover:text-gold-400 transition">
                <Camera className="h-4 w-4" />
              </a>
              <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center border border-ivory-100/15 text-ivory-100/70 hover:border-gold-500 hover:text-gold-400 transition">
                <AtSign className="h-4 w-4" />
              </a>
              <a href={whatsappLink("Hi JGTHS, I'd like to know more about your boutique.")} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-9 w-9 items-center justify-center border border-ivory-100/15 text-ivory-100/70 hover:border-gold-500 hover:text-gold-400 transition">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gold-500 mb-5">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.href + l.label}><Link href={l.href} className="text-[13px] text-ivory-100/70 hover:text-ivory-100 transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gold-500 mb-5">The House</h3>
            <ul className="space-y-3">
              {brandLinks.map((l) => (
                <li key={l.href + l.label}><Link href={l.href} className="text-[13px] text-ivory-100/70 hover:text-ivory-100 transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gold-500 mb-5">Visit</h3>
            <ul className="space-y-4 text-[13px] text-ivory-100/70">
              <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold-600" />{SITE.fullAddress}</li>
              <li className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-gold-600" />{SITE.phone}</li>
              <li className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-gold-600" /><a href={`mailto:${SITE.email}`} className="hover:text-ivory-100">{SITE.email}</a></li>
              <li className="flex gap-3"><Clock className="h-4 w-4 mt-0.5 shrink-0 text-gold-600" />
                <span>Mon–Sat 10 AM – 8 PM<br />Sunday by appointment</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Policy bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-ivory-100/10 py-6 text-xs text-ivory-100/40">
          <p>© {new Date().getFullYear()} JGTHS Designer Boutique &amp; Aari Couture. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {policyLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-ivory-100/70">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
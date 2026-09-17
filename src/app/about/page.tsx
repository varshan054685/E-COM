import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buildSeo } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { IMG } from '@/lib/images';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = buildSeo({
  title: 'Our Story',
  description:
    'The story of JGTHS Designer Boutique & Aari Couture — a Coimbatore atelier where hand-drawn motifs, patient embroidery, and personal fitting become heirlooms.',
  path: '/about',
});

const values = [
  {
    title: 'Craft before everything',
    body: 'Every motif is drawn, traced, and embroidered by hand. If a piece cannot be made with patience, we would rather not make it at all.',
  },
  {
    title: 'Fit is personal',
    body: 'No two bodies are alike, so no two JGTHS garments share a pattern. We measure, we note, we remember.',
  },
  {
    title: 'Made to be kept',
    body: 'We build blouses and sarees to be re-draped, re-loved, and handed down — not worn once and forgotten.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-ivory-100">
      {/* Hero */}
      <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-charcoal-900">
        <div className="absolute inset-0">
          <Image src={IMG.about} alt="Inside the JGTHS atelier" fill priority sizes="100vw" className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/30 to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-shell px-4 sm:px-6 lg:px-10 pb-16 pt-40">
          <div className="max-w-2xl animate-fade-up">
            <p className="editorial-eyebrow mb-4">Our Story</p>
            <h1 className="font-serif text-5xl leading-[1.05] text-ivory-50 sm:text-6xl">
              A boutique built on<br />patience &amp; thread
            </h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="editorial-eyebrow mb-4">Where it began</p>
            <h2 className="font-serif text-3xl leading-snug text-charcoal-900 sm:text-4xl">
              One tailor&apos;s bench in Chinniyampalayam
            </h2>
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-muted">
              <p>
                JGTHS began the way most good things in a Tamil family do — at home, with an
                elder who refused to compromise. What started as a single tailoring bench in
                Chinniyampalayam grew, stitch by stitch, into a boutique trusted with the most
                photographed days of people&apos;s lives.
              </p>
              <p>
                We kept the old ways on purpose. Motifs are still drawn by hand before they are
                traced. Aari work is still done with a hooked needle, bead by bead, the way it
                has been done in these lanes for generations. And every blouse still leaves the
                boutique only after it has been fitted to the shoulders it was made for.
              </p>
              <p>
                Today the atelier dresses weddings, receptions, and quiet Sunday temples alike —
                from Coimbatore to clients who order from Chennai, Bengaluru, and beyond. The
                scale changed. The patience did not.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <div className="grid gap-4">
              <Image src={IMG.craft1} alt="Hand embroidery at the atelier" width={800} height={600} className="h-full w-full object-cover" />
              <Image src={IMG.craft2} alt="Finished couture piece" width={800} height={500} className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-ink/10 bg-ivory-50">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-20">
          <Reveal>
            <p className="editorial-eyebrow mb-4">What we believe</p>
            <h2 className="font-serif text-4xl text-charcoal-900">The house rules</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <p className="font-serif text-2xl text-gold-600">0{i + 1}</p>
                <h3 className="mt-3 font-serif text-2xl text-charcoal-900">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="editorial-eyebrow mb-4">Visit us</p>
            <h2 className="font-serif text-4xl text-charcoal-900">Come, see the work up close</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">
              {SITE.fullAddress}
            </p>
            <p className="mt-2 text-sm text-ink-muted">Mon–Sat, 10:00 AM – 8:00 PM · Sunday by appointment</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/contact" variant="outline">Plan a visit</LinkButton>
              <Link href="/custom-couture" className="group inline-flex items-center gap-2 px-2 text-[13px] font-medium uppercase tracking-widest text-gold-700">
                Or start a custom piece <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="border border-ink/10">
              <iframe
                title="JGTHS Designer Boutique location"
                src={SITE.mapsEmbed}
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

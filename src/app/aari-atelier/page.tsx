import type { Metadata } from 'next';
import Image from 'next/image';
import { buildSeo } from '@/lib/seo';
import { IMG } from '@/lib/images';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = buildSeo({
  title: 'The Aari Atelier',
  description:
    'Step inside the JGTHS Aari atelier — the craft, the process, the details, and the hands that build hand-embroidered heirlooms in Coimbatore.',
  path: '/aari-atelier',
});

const process = [
  {
    step: '01',
    title: 'The design',
    body: 'Every piece begins on paper. Motifs are drawn by hand — peacocks, temple borders, jasmine trails — or reimagined from an heirloom photo a client brings us.',
  },
  {
    step: '02',
    title: 'The trace',
    body: 'The final sketch is transferred onto fabric with quiet precision. This is where a blouse decides what it will become; nothing is improvised later.',
  },
  {
    step: '03',
    title: 'The embroidery',
    body: 'A fine hooked needle builds the motif stitch by stitch — zardozi, beads, sequins, and silk thread rising into dimensional work that machines cannot imitate.',
  },
  {
    step: '04',
    title: 'The embellishment',
    body: 'Where the light goes in. Pearls are placed one at a time, mirrors hand-cut and anchored, French knots clustered until the surface catches every lamp in the room.',
  },
  {
    step: '05',
    title: 'The finish',
    body: 'Lining, piping, covered hooks, and a final press. Each blouse is checked against its measurements before it is folded into cotton for its journey.',
  },
];

export default function AariAtelierPage() {
  return (
    <div className="bg-ivory-100">
      {/* Hero */}
      <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-charcoal-900">
        <div className="absolute inset-0">
          <Image src={IMG.aariStory} alt="The art of Aari embroidery" fill priority sizes="100vw" className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/25 to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-shell px-4 sm:px-6 lg:px-10 pb-16 pt-40">
          <div className="max-w-2xl animate-fade-up">
            <p className="editorial-eyebrow mb-4">The Aari Atelier</p>
            <h1 className="font-serif text-5xl leading-[1.05] text-ivory-50 sm:text-6xl">
              A needle, a thread,<br />an heirloom
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="editorial-eyebrow mb-4">The craft</p>
          <h2 className="font-serif text-4xl leading-tight text-charcoal-900">
            Embroidery as meditation
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-muted">
            Aari is work that cannot be rushed. The needle is hooked like a pen; the thread is
            fed from beneath the fabric stretched on a frame. Hours go into a single border.
            Our artisans learned it the old way — sitting beside someone slower and more
            patient than the internet.
          </p>
        </Reveal>
      </section>

      {/* Process — editorial alternating rows */}
      <section className="border-y border-ink/10 bg-ivory-50">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-20 lg:py-24">
          <Reveal>
            <p className="editorial-eyebrow mb-4">The process</p>
            <h2 className="font-serif text-4xl text-charcoal-900">Five quiet stages</h2>
          </Reveal>
          <ol className="mt-14 space-y-14">
            {process.map((p, i) => (
              <li key={p.step} className="grid gap-6 md:grid-cols-12 md:items-baseline">
                <Reveal className="md:col-span-2">
                  <span className="font-serif text-5xl text-gold-500">{p.step}</span>
                </Reveal>
                <Reveal delay={80} className="md:col-span-4">
                  <h3 className="font-serif text-2xl text-charcoal-900">{p.title}</h3>
                </Reveal>
                <Reveal delay={140} className="md:col-span-6">
                  <p className="text-[15px] leading-relaxed text-ink-muted">{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The details — close-up imagery */}
      <section className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <Reveal>
          <p className="editorial-eyebrow mb-4">The details</p>
          <h2 className="font-serif text-4xl text-charcoal-900">Closer, always closer</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {IMG.gallery.slice(0, 4).map((src, i) => (
            <Reveal key={src} delay={i * 80}>
              <div className={`overflow-hidden bg-ivory-200 ${i % 2 === 1 ? 'mt-8' : ''}`}>
                <Image src={src} alt="Aari embroidery detail" width={700} height={900} sizes="(max-width: 1024px) 50vw, 25vw" className="h-full w-full object-cover transition-transform duration-700 ease-out-expo hover:scale-[1.04]" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The finished creation */}
      <section className="bg-charcoal-900 text-ivory-50">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-24">
          <Reveal className="max-w-2xl">
            <p className="editorial-eyebrow mb-4 text-gold-300">The finished creation</p>
            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
              Worn once, remembered forever
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ivory-100/80">
              A finished JGTHS piece leaves the boutique folded in cotton, with its measurements
              noted inside. Brides have returned years later to have the same blouse re-fitted
              for a sister. That, to us, is the whole point.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton href="/collections/aari-couture" className="bg-gold-500 text-charcoal-900 border-gold-500 hover:bg-gold-400">
                Shop Aari Couture
              </LinkButton>
              <LinkButton href="/custom-couture" variant="outline" className="border-ivory-100/40 text-ivory-50 hover:bg-ivory-50/10">
                Commission your own
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

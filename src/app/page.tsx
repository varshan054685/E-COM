import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getProducts, getCategories } from '@/lib/catalog';
import { getSiteContentMap } from '@/lib/site-content';
import { IMG, COLLECTION_IMAGES } from '@/lib/images';
import { SITE } from '@/lib/site';
import { buildSeo } from '@/lib/seo';
import { LinkButton } from '@/components/ui/Button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = buildSeo({
  title: 'Designer Boutique & Aari Couture',
  description:
    'Designer couture, intricate Aari artistry, and custom creations crafted for your most special moments. Coimbatore, Tamil Nadu.',
  path: '/',
});

export default async function HomePage() {
  const [categories, featured, storyProducts, testimonials, content] = await Promise.all([
    getCategories(),
    getProducts({ featuredOnly: true, sort: 'featured' }, 8),
    getProducts({ tag: 'the-edit', sort: 'newest' }, 8),
    prisma.testimonial.findMany({ where: { featured: true }, orderBy: { sortOrder: 'asc' } }),
    getSiteContentMap(),
  ]);

  const heroImage = content['hero.image'] || IMG.hero;
  const heroHeadline = content['hero.headline'] || 'Crafted to be remembered';
  const heroSub = content['hero.subtext'];
  const aariImage = content['aari.image'] || IMG.aariStory;

  const displayProducts = storyProducts.length ? storyProducts : featured;

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-end lg:items-center overflow-hidden bg-charcoal-900">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="JGTHS designer couture"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/25 to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-shell px-4 sm:px-6 lg:px-10 pb-20 pt-40 lg:pt-0">
          <div className="max-w-2xl animate-fade-up">
            <p className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-widestX text-gold-300">
              <Sparkles className="h-3.5 w-3.5" /> JGTHS Designer Boutique · Coimbatore
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[84px] leading-[1.02] font-medium text-ivory-50">
              CRAFTED TO
              <br />
              BE REMEMBERED<span className="text-gold-400">.</span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] sm:text-base leading-relaxed text-ivory-100/85">
              {heroSub ||
                'Designer couture, intricate Aari artistry, and custom creations crafted for your most special moments.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton href="/shop" className="bg-ivory-50 text-charcoal-900 border-ivory-50 hover:bg-ivory-100">
                Explore the Collection
              </LinkButton>
              <LinkButton href="/custom-couture" variant="outline" className="border-ivory-100/40 text-ivory-50 hover:border-ivory-100 hover:bg-ivory-50/10">
                Create Your Couture
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND INTRODUCTION */}
      <section className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              <Image src={IMG.craft1} alt="Aari embroidery detail" width={600} height={750} className="h-full w-full object-cover" />
              <Image src={IMG.craft2} alt="Designer blouse on mannequin" width={600} height={750} className="mt-10 h-[calc(100%-2.5rem)] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="editorial-eyebrow mb-4">The House of JGTHS</p>
            <h2 className="font-serif text-4xl lg:text-5xl leading-[1.08] text-charcoal-900">
              Where craft meets couture
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-muted">
              Every JGTHS creation threads together traditional craftsmanship, contemporary
              design, and meticulous embroidery — tailored, quite literally, to the person who
              will wear it.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              From hand-traced Aari motifs to bespoke bridal silhouettes, our boutique is built
              on the belief that clothing should be personal, patient, and precise.
            </p>
            <Link href="/about" className="group mt-8 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-gold-700">
              Read our story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SHOP COLLECTIONS */}
      <section className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 pb-20 lg:pb-28">
        <Reveal>
          <SectionHeading
            eyebrow="The Collections"
            title="Browse by craft"
            description="Five signatures — from hand-drawn Aari to wedding-ready bridal couture."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {categories.slice(0, 4).map((category, i) => {
            const image = COLLECTION_IMAGES[category.slug] || IMG.gallery[i];
            return (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className={`group relative overflow-hidden bg-charcoal-800 ${i === 0 ? 'aspect-[3/4] md:row-span-2 md:aspect-auto' : 'aspect-[3/4]'}`}
              >
                <Image src={image} alt={category.name} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover opacity-90 transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="font-serif text-xl lg:text-2xl text-ivory-50">{category.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-ivory-100/70 lg:text-[13px]">{category.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold-300">
                    Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Custom couture tile */}
          <Link href="/custom-couture" className="group relative col-span-2 md:col-span-3 lg:col-span-1 aspect-[3/4] overflow-hidden bg-gold-500 flex flex-col justify-end p-6">
            <div className="absolute inset-0">
              <Image src={IMAGE_BY('custom-couture')} alt="Custom couture" fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover opacity-95 transition-transform duration-700 group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/75 to-transparent" />
            </div>
            <div className="relative">
              <p className="font-serif text-2xl text-white">Custom Couture</p>
              <p className="mt-1 text-xs text-white/75">Your vision, our craftsmanship</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold-300">
                Begin <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* THE EDIT */}
      <section className="bg-charcoal-900 py-20 lg:py-28 text-ivory-50">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="editorial-eyebrow mb-4">Curated for you</p>
                <h2 className="font-serif text-4xl lg:text-[52px] leading-tight">The Edit</h2>
              </div>
              <Link href="/shop" className="group inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-gold-300 hover:text-gold-200">
                View all pieces <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12">
            <ProductGrid products={displayProducts} columns={4} priorityFirst />
          </div>
        </div>
      </section>

      {/* AARI CRAFTSMANSHIP */}
      <section className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="relative overflow-hidden bg-ivory-50 border border-ink/10">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[420px] lg:min-h-[620px]">
              <Image src={aariImage} alt="The art of Aari embroidery" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="p-8 lg:p-16 flex flex-col justify-center">
              <p className="editorial-eyebrow mb-4">The Art of Aari</p>
              <h2 className="font-serif text-4xl lg:text-5xl leading-tight text-charcoal-900">
                A needle, a thread,<br />an heirloom in the making
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-ink-muted max-w-lg">
                Aari is embroidery as meditation. Each motif is traced, then built stitch by
                stitch with a fine hooked needle — beads, zardozi, and silk thread rising into
                delicate, dimensional work.
              </p>
              <ol className="mt-8 space-y-4">
                {[
                  ['01', 'Design', 'Motifs drawn by hand, or reimagined from an heirloom you bring us.'],
                  ['02', 'Trace', 'The design is transferred onto the fabric with quiet precision.'],
                  ['03', 'Embroider', 'Hours of handwork build texture, depth, and light into every piece.'],
                  ['04', 'Finish', 'Lining, trimming, and a final quality check before it reaches you.'],
                ].map(([no, title, body]) => (
                  <li key={no} className="flex gap-5">
                    <span className="font-serif text-gold-600 text-2xl leading-none pt-0.5">{no}</span>
                    <span>
                      <span className="block text-sm font-medium text-charcoal-900">{title}</span>
                      <span className="mt-0.5 block text-[13px] text-ink-muted leading-relaxed">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-9">
                <LinkButton href="/aari-atelier" variant="outline">
                  Discover Aari Couture
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM COUTURE */}
      <section className="relative overflow-hidden bg-charcoal-900 text-ivory-50">
        <div className="absolute inset-0 opacity-20">
          <Image src={IMG.banner} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="relative mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-24 lg:py-32">
          <div className="max-w-xl">
            <Reveal>
              <p className="editorial-eyebrow mb-4">Custom Couture</p>
              <h2 className="font-serif text-4xl lg:text-[56px] leading-[1.05]">
                Your vision.<br />Our craftsmanship.
              </h2>
              <p className="mt-6 text-[15px] lg:text-base leading-relaxed text-ivory-100/80">
                Have something specific in mind? Work with our boutique to create a piece built
                around your occasion, measurements, colours, and personal style — from first
                sketch to final stitch.
              </p>
              <div className="mt-9">
                <LinkButton href="/custom-couture" className="bg-gold-500 text-charcoal-900 border-gold-500 hover:bg-gold-400">
                  Start Your Custom Order
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="From our brides & clients" title="Words from our boutique" />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 90}>
              <figure className="flex h-full flex-col justify-between border border-ink/10 bg-ivory-50 p-7">
                <blockquote className="font-serif text-xl leading-relaxed text-charcoal-800">
                  “{t.content}”
                </blockquote>
                <figcaption className="mt-6">
                  <p className="text-sm font-medium text-charcoal-900">{t.author}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-faint">{t.role}{t.location ? ` · ${t.location}` : ''}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="editorial-eyebrow mb-4">Visit the boutique</p>
              <h2 className="font-serif text-3xl lg:text-4xl text-charcoal-900 leading-tight">
                In the heart of Coimbatore
              </h2>
              <p className="mt-4 text-[15px] text-ink-muted leading-relaxed">
                {SITE.fullAddress}
              </p>
              <p className="mt-2 text-[15px] text-ink-muted">Mon–Sat, 10:00 AM – 8:00 PM · Sunday by appointment</p>
              <LinkButton href="/contact" variant="outline" className="mt-7">
                <MapPin className="h-4 w-4" /> Get directions
              </LinkButton>
            </div>
            <div className="w-full lg:w-[42%] border border-ink/10 overflow-hidden">
              <iframe
                title="JGTHS Designer Boutique location"
                src={SITE.mapsEmbed}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function IMAGE_BY(slug: string) {
  return COLLECTION_IMAGES[slug];
}
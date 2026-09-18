import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Gem, Leaf, Palette, Scissors, Users } from 'lucide-react';

import { PageHero } from '@/components/layout/page-hero';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { IMG } from '@/lib/images';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About the Atelier',
  description:
    'Three decades of Aari craftsmanship in Coimbatore — meet the studio behind the bridal blouses, hand-painted fabrics and heritage weaves.',
};

const VALUES = [
  {
    Icon: Scissors,
    title: 'Hand work only',
    copy: 'No machine imitations. Every Aari motif is hooked by our in-house karigars, and every hem is finished by hand.',
  },
  {
    Icon: Gem,
    title: 'Materials worth keeping',
    copy: 'Silk-mark assured weaves, pure zari and natural dyes — chosen so the piece still looks right at the next generation’s wedding.',
  },
  {
    Icon: Palette,
    title: 'Painted once',
    copy: 'Hand-painted panels are never reproduced. If you own one, you own the only one.',
  },
  {
    Icon: Leaf,
    title: 'Slow by design',
    copy: 'We quote three to four weeks for bridal work because the craft takes that long. We would rather be late than careless.',
  },
  {
    Icon: Users,
    title: 'A studio, not a factory',
    copy: 'Fifteen artisans, one table each. You will speak to the same people at consultation and at final fitting.',
  },
  {
    Icon: Award,
    title: 'Fitted to you',
    copy: 'Measurements are recorded against your profile, so your next order starts from a fit we already know works.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="Three decades at one tailoring table"
        description={`${SITE.name} began as a single table in ${SITE.city}, stitching blouses for neighbourhood weddings. The table is longer now, but the work has not changed.`}
      />

      {/* Story */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-ivory-200 shadow-soft">
              <Image
                src={IMG.about}
                alt="Inside the boutique studio"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <SectionHeading
              eyebrow="Heritage meets minimalism"
              title="Traditional craft, held to a modern standard"
            />
            <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                We started with Aari — the hooked embroidery that gives a bridal blouse
                its weight and its shine. Over the years we added hand-painted fabrics,
                then heritage weaves, then a small line of kids party wear for the
                children who attend the weddings we dress.
              </p>
              <p>
                What ties it together is restraint. Rich colour, dense embroidery and
                heavy zari all ask to be balanced against a clean line and a considered
                silhouette. A blouse should flatter the drape of the saree, not compete
                with it.
              </p>
              <p>
                Every piece leaves this studio fitted to a real person. That is
                unhurried work, and we have never wanted it to be any other way.
              </p>
            </div>

            <Button asChild variant="outline" className="mt-9">
              <Link href="/contact">Visit the studio</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ivory-200/60 py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="What we hold to"
              title="Six things we do not compromise on"
              align="center"
            />
          </Reveal>

          <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map(({ Icon, title, copy }, index) => (
              <Reveal as="li" key={title} delay={index * 0.05}>
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/8 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-serif text-lg leading-snug">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Studio gallery */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="In the studio"
            title="Where it happens"
            description="Hooks, frames, fabric bolts and half-finished blouses — photographed between fittings."
          />
        </Reveal>

        <ul className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-5">
          {IMG.gallery.map((image, index) => (
            <Reveal as="li" key={image} delay={index * 0.05}>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-ivory-200">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-out-expo hover:scale-[1.06]"
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}

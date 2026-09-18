import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Scissors, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { IMG } from '@/lib/images';
import { SITE } from '@/lib/site';

const PILLARS = [
  {
    Icon: Scissors,
    title: 'Cut for your body',
    copy: 'Every blouse is patterned from your own measurements, then re-checked against the fabric before a single stitch.',
  },
  {
    Icon: Sparkles,
    title: 'Hooked, never printed',
    copy: 'Aari embroidery is worked with a hand hook, one bead and one zardosi strand at a time.',
  },
  {
    Icon: Leaf,
    title: 'Natural dyes, honest fabric',
    copy: 'Silk-mark assured weaves and vegetable dyes that deepen rather than fade.',
  },
];

export function AtelierStory() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-18 sm:py-24 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-ivory-200 shadow-lift">
              <Image
                src={IMG.atelier}
                alt="Aari embroidery being hooked by hand in the studio"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-3 -bottom-6 hidden max-w-[15rem] rounded-xl border border-ink-100 bg-card p-5 shadow-lift sm:block lg:-right-8">
              <p className="font-serif text-3xl text-gold-600">100%</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Hand-embroidered. No machine imitations, ever.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow text-gold-600">The atelier</p>
          <h2 className="mt-4 font-serif text-3xl leading-[1.15] font-medium text-balance sm:text-4xl">
            Where Indian heritage meets a modern hand
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {SITE.name} began as a single tailoring table in {SITE.city}. Three
            decades of wedding trousseaux later, the workshop still works the same
            way — a hook, a frame, and a tailor who knows your name.
          </p>

          <ul className="mt-9 flex flex-col gap-6">
            {PILLARS.map(({ Icon, title, copy }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {copy}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <Button asChild variant="outline" className="mt-9">
            <Link href="/about">
              Read our story
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

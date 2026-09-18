import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Ruler, Sparkles } from 'lucide-react';

import { PageHero } from '@/components/layout/page-hero';
import { ProductGrid } from '@/components/product/product-grid';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { getProductsByCategory } from '@/lib/catalog';
import { IMG } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Kids Party Wear',
  description:
    'Pattu lehengas, festive frocks and temple sets for little celebrations — soft-lined, comfortable and made to be danced in.',
};

const CARE_NOTES = [
  {
    Icon: Heart,
    title: 'Soft cotton lining',
    copy: 'Every bodice is lined in cotton, so no zari or seam ever touches the skin.',
  },
  {
    Icon: Ruler,
    title: 'Room to grow',
    copy: 'Elasticated waists and generous seam allowances that survive a growth spurt.',
  },
  {
    Icon: Sparkles,
    title: 'Made to be worn',
    copy: 'Lightweight silk blends that survive a full day of a wedding.',
  },
];

export default function KidsPage() {
  const products = getProductsByCategory('kids-party-wear');

  return (
    <>
      <PageHero
        eyebrow="Little celebrations"
        title="Kids Party Wear"
        description="Pattu lehengas, twirl-approved frocks and temple sets — cut for comfort first, because a child who is comfortable is a child who enjoys the day."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="gold">
            <Link href="/shop?category=kids-party-wear">Shop all kids pieces</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/custom-orders">Commission a size</Link>
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:py-16 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={`${products.length} pieces available`}
            title="The kids collection"
            description="Sizes run from 2–3 years to 10–11 years. Need an exact fit? Send us measurements and we will cut to them."
          />
        </Reveal>

        <div className="mt-11">
          <ProductGrid products={products} />
        </div>
      </section>

      <section className="bg-ivory-200/60 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Built for real children"
              title="Comfort is not an afterthought"
              description="We test every silhouette on the move — running, sitting through a ceremony, and twirling at least twice."
            />
            <ul className="mt-9 flex flex-col gap-6">
              {CARE_NOTES.map(({ Icon, title, copy }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary/8 text-secondary">
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
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-ivory-200 shadow-soft">
              <Image
                src={IMG.kids}
                alt="Festive pattu silk kids party wear"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

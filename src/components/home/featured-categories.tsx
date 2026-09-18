import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { getFeaturedCategories } from '@/lib/catalog';

export function FeaturedCategories() {
  const categories = getFeaturedCategories();

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-18 sm:py-24 sm:px-8 lg:px-10">
      <Reveal>
        <SectionHeading
          eyebrow="Explore the atelier"
          title="Three houses of craft"
          description="Each collection is built around a different discipline — the hook, the brush, and the loom."
        />
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {categories.map((category, index) => (
          <Reveal key={category.slug} delay={index * 0.08}>
            <Link
              href={`/shop?category=${category.slug}`}
              className="group relative block aspect-4/5 overflow-hidden rounded-xl bg-ivory-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.07]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/25 to-transparent"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory-50 sm:p-7">
                <p className="eyebrow text-gold-300">{category.tagline}</p>
                <h3 className="mt-2.5 font-serif text-2xl leading-tight font-medium">
                  {category.name}
                </h3>
                <p className="mt-2.5 max-h-0 overflow-hidden text-sm leading-relaxed text-ivory-100/0 opacity-0 transition-all duration-500 ease-out-expo group-hover:max-h-24 group-hover:text-ivory-100/75 group-hover:opacity-100">
                  {category.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase">
                  Shop now
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

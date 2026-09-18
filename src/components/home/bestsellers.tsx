'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { getBestsellers } from '@/lib/catalog';

export function Bestsellers() {
  const railRef = useRef<HTMLUListElement>(null);
  const products = getBestsellers(6);

  function scrollRail(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const firstCard = rail.querySelector('li');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 20 : 320;
    const cardsToScroll = rail.clientWidth > 900 ? 2 : 1;
    rail.scrollBy({
      left: direction * cardWidth * cardsToScroll,
      behavior: 'smooth',
    });
  }

  return (
    <section className="w-full max-w-full overflow-hidden bg-ivory-200/60 py-18 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Most loved"
            title="Bestsellers"
            description="The pieces our clients return for — and the ones they photograph the most."
          />

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => scrollRail(-1)}
                aria-label="Previous products"
                className="bg-card"
              >
                <ChevronRight className="size-4 rotate-180" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => scrollRail(1)}
                aria-label="Next products"
                className="bg-card"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <Button asChild variant="link" className="gap-2 px-0">
              <Link href="/shop">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Horizontal rail — aligned with container with generous left padding */}
        <ul
          ref={railRef}
          className="no-scrollbar mt-11 flex w-full max-w-full snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-1"
        >
          {products.map((product) => (
            <li key={product.id} className="flex shrink-0 snap-start">
              <ProductCard product={product} fixedWidth />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

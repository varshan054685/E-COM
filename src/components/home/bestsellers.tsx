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
    rail.scrollBy({
      left: direction * Math.min(rail.clientWidth * 0.85, 720),
      behavior: 'smooth',
    });
  }

  return (
    <section className="bg-ivory-200/60 py-18 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
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
      </div>

      {/* Horizontal rail — bleeds to the viewport edge on mobile. */}
      <ul
        ref={railRef}
        className="no-scrollbar mt-11 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 lg:px-8"
      >
        {products.map((product) => (
          <li key={product.id} className="snap-start">
            <ProductCard product={product} fixedWidth />
          </li>
        ))}
      </ul>
    </section>
  );
}

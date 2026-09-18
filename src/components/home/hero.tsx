'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { IMG } from '@/lib/images';
import { SITE } from '@/lib/site';

const STATS = [
  { value: '140+', label: 'Studio hours per bridal piece' },
  { value: '12 yrs', label: 'Of Aari craftsmanship' },
  { value: '100%', label: 'Hand-hooked embroidery' },
];

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[76vh] items-center overflow-hidden sm:min-h-[84vh]">
      <Image
        src={IMG.hero}
        alt="Hand-embroidered Aari work blouse in antique gold"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-900/88 via-ink-900/60 to-ink-900/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-20 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-ivory-50"
        >
          <p className="eyebrow flex items-center gap-2 text-gold-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Aari couture · Handcrafted in {SITE.city}
          </p>

          <h1 className="mt-6 font-serif text-4xl leading-[1.06] font-medium text-balance sm:text-5xl lg:text-6xl">
            Exquisite Aari Couture &amp; Designer Wear
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory-100/80 sm:text-lg">
            Bridal blouses hooked stitch by stitch, hand-painted fabrics that exist
            only once, and heritage weaves chosen for the way they fall. Made for the
            moments you will look back on.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="gold">
              <Link href="/shop">
                Shop the Collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-ivory-100/40 text-ivory-50 hover:border-ivory-50 hover:bg-ivory-50/10 hover:text-ivory-50"
            >
              <Link href="/custom-orders">Design a Custom Piece</Link>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-1 gap-6 border-t border-ivory-100/20 pt-8 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-serif text-2xl text-gold-300">{stat.value}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-ivory-100/60">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

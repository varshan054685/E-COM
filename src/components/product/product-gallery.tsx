'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type ProductGalleryProps = {
  images: string[];
  title: string;
  /** Rendered as a badge over the image, e.g. the discount. */
  badge?: string;
};

export function ProductGallery({ images, title, badge }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="group relative aspect-4/5 overflow-hidden rounded-xl bg-ivory-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={current}
              alt={`${title} — view ${active + 1} of ${images.length}`}
              fill
              priority={active === 0}
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.06]"
            />
          </motion.div>
        </AnimatePresence>

        {badge ? (
          <span className="absolute top-4 left-4 rounded-full bg-secondary px-3 py-1.5 text-[10px] font-medium tracking-[0.14em] text-secondary-foreground uppercase">
            {badge}
          </span>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  'relative block size-20 overflow-hidden rounded-lg bg-ivory-200 transition-all duration-300 sm:size-24',
                  index === active
                    ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-background'
                    : 'opacity-70 hover:opacity-100',
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

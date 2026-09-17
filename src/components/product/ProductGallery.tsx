'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [startTouch, setStartTouch] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center bg-ivory-200 text-xs uppercase tracking-widest text-ink-faint">
        Image coming soon
      </div>
    );
  }

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  return (
    <div>
      <div
        className="relative aspect-[3/4] overflow-hidden bg-ivory-200 select-none"
        onTouchStart={(e) => setStartTouch(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - startTouch;
          if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
        }}
      >
        {images.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={`${name} — view ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className={cn(
              'object-cover transition-opacity duration-500',
              i === active ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
        {images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-ivory-50/80 text-charcoal-900 backdrop-blur hover:bg-ivory-50 transition">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-ivory-50/80 text-charcoal-900 backdrop-blur hover:bg-ivory-50 transition">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`} className={cn('h-1.5 transition-all', i === active ? 'w-6 bg-charcoal-900' : 'w-1.5 bg-charcoal-900/30')} />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'relative aspect-[3/4] overflow-hidden bg-ivory-200 border transition',
                i === active ? 'border-charcoal-900' : 'border-transparent hover:border-ink/30',
              )}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { CATEGORIES, PRODUCTS } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SUGGESTIONS = ['Bridal Aari', 'Kanchipuram', 'Hand-painted', 'Kids lehenga', 'Organza'];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return PRODUCTS.filter((product) =>
      [
        product.title,
        product.subtitle,
        product.category,
        product.fabric,
        product.embroidery,
        ...product.tags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q),
    ).slice(0, 5);
  }, [query]);

  function close() {
    onOpenChange(false);
    setQuery('');
  }

  const hasQuery = query.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-xl gap-0 p-0" showClose={false}>
        <DialogTitle className="sr-only">Search the boutique</DialogTitle>
        <DialogDescription className="sr-only">
          Search for blouses, sarees and fabric by name, fabric or occasion.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
          <Search className="size-4 shrink-0 text-ink-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bridal blouses, sarees, hand-painted fabric…"
            aria-label="Search products"
            className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-ink-300"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {hasQuery ? (
            results.length > 0 ? (
              <ul className="flex flex-col">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={close}
                      className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted"
                    >
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-ivory-200">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-base">
                          {product.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {product.subtitle}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-medium">
                        {formatPrice(product.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                Nothing matched “{query}”. Try a fabric or an occasion.
              </p>
            )
          ) : (
            <div className="p-2">
              <p className="eyebrow px-1 pb-3 text-ink-300">Popular right now</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-ink-200 px-3.5 py-1.5 text-xs text-ink-500 transition-colors hover:border-ink-300 hover:bg-muted hover:text-foreground"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <p className="eyebrow px-1 pt-6 pb-3 text-ink-300">Browse collections</p>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {CATEGORIES.slice(0, 4).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/shop?category=${category.slug}`}
                    onClick={close}
                    className="rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

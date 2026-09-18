'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  SORT_OPTIONS,
  buildQuery,
  hasActiveFacets,
  toggleValue,
  type ShopFilterState,
  type SortKey,
} from '@/lib/shop-filtering';
import { cn } from '@/lib/utils';

type ShopFiltersProps = {
  active: ShopFilterState;
  categories: { slug: string; name: string; count: number }[];
  priceBands: { id: string; label: string }[];
  colors: { name: string; hex: string }[];
  resultCount: number;
};

export function ShopFilters({
  active,
  categories,
  priceBands,
  colors,
  resultCount,
}: ShopFiltersProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function apply(next: ShopFilterState) {
    const query = buildQuery(next);
    router.push(query ? `/shop?${query}` : '/shop', { scroll: false });
  }

  function toggle(facet: 'categories' | 'priceBands' | 'colors', value: string) {
    apply({ ...active, [facet]: toggleValue(active[facet], value) });
  }

  const facetsActive = hasActiveFacets(active);

  const panel = (
    <div className="flex flex-col gap-8">
      {/* Sort */}
      <div>
        <label htmlFor="sort" className="eyebrow mb-3 block text-ink-400">
          Sort by
        </label>
        <select
          id="sort"
          value={active.sort}
          onChange={(event) => apply({ ...active, sort: event.target.value as SortKey })}
          className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm transition-colors hover:border-ink-300 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <fieldset>
        <legend className="eyebrow mb-3.5 text-ink-400">Category</legend>
        <ul className="flex flex-col gap-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <label className="flex cursor-pointer items-center gap-3">
                <Checkbox
                  checked={active.categories.includes(category.slug)}
                  onCheckedChange={() => toggle('categories', category.slug)}
                />
                <span className="flex-1 text-sm text-ink-500">{category.name}</span>
                <span className="text-xs text-ink-300 tabular-nums">{category.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {/* Price */}
      <fieldset>
        <legend className="eyebrow mb-3.5 text-ink-400">Price range</legend>
        <ul className="flex flex-col gap-3">
          {priceBands.map((band) => (
            <li key={band.id}>
              <label className="flex cursor-pointer items-center gap-3">
                <Checkbox
                  checked={active.priceBands.includes(band.id)}
                  onCheckedChange={() => toggle('priceBands', band.id)}
                />
                <span className="flex-1 text-sm text-ink-500">{band.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {/* Colour */}
      <fieldset>
        <legend className="eyebrow mb-3.5 text-ink-400">Colour</legend>
        <ul className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const selected = active.colors.includes(color.name);
            return (
              <li key={color.name}>
                <button
                  type="button"
                  onClick={() => toggle('colors', color.name)}
                  aria-pressed={selected}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all duration-200',
                    selected
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-ink-200 text-ink-500 hover:border-ink-400 hover:text-foreground',
                  )}
                >
                  <span
                    className="size-3.5 rounded-full border border-ink-200"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  {color.name}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {facetsActive ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => apply({ ...active, categories: [], priceBands: [], colors: [] })}
          className="justify-start gap-2 self-start px-0 text-xs tracking-[0.12em] uppercase"
        >
          <X className="size-3.5" />
          Clear all filters
        </Button>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex w-full items-center justify-between"
          aria-expanded={mobileOpen}
        >
          <span className="flex items-center gap-2 text-xs tracking-[0.12em] uppercase">
            <SlidersHorizontal className="size-4" />
            Filters
          </span>
          <span className="text-xs text-muted-foreground">
            {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
          </span>
        </Button>
      </div>

      <aside
        aria-label="Product filters"
        className={cn(
          'lg:sticky lg:top-28 lg:block lg:self-start',
          mobileOpen
            ? 'mt-6 block rounded-xl border border-ink-100 bg-card p-5 shadow-soft'
            : 'hidden',
        )}
      >
        {panel}
      </aside>
    </>
  );
}

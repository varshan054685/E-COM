'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatINR } from '@/lib/format';
import { buildUrl, parseNumbers } from '@/lib/query';
import { Drawer } from '@/components/ui/Drawer';
import { useSearchDialog } from '@/components/layout/SearchDialog';

type Facets = {
  categories: { slug: string; name: string }[];
  sizes: string[];
  colors: string[];
  crafts: string[];
  occasions: string[];
};

function useFilterState() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const current = useMemo(() => {
    const get = (k: string) => searchParams.get(k);
    return {
      q: get('q') || '',
      cat: get('cat') || '',
      min: get('min') || '',
      max: get('max') || '',
      sizes: get('size')?.split(',') || [],
      colors: get('color')?.split(',') || [],
      craft: get('craft') || '',
      occasion: get('occasion') || '',
      avail: get('avail') || '',
      sort: get('sort') || 'featured',
    };
  }, [searchParams]);

  const update = (patch: Record<string, string | string[] | undefined | null>) => {
    const params: Record<string, string | string[] | undefined> = {};
    const merged = { ...current, ...patch };
    params.q = merged.q || undefined;
    params.cat = merged.cat || undefined;
    params.min = merged.min || undefined;
    params.max = merged.max || undefined;
    params.size = merged.sizes.length ? merged.sizes : undefined;
    params.color = merged.colors.length ? merged.colors : undefined;
    params.craft = merged.craft || undefined;
    params.occasion = merged.occasion || undefined;
    params.avail = merged.avail || undefined;
    params.sort = merged.sort;
    router.push(buildUrl(pathname, params), { scroll: false });
  };

  return { current, update };
}

function CheckboxToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} role="checkbox" aria-checked={checked} className="flex w-full items-center justify-between py-1.5 text-left text-sm text-charcoal-800 hover:text-charcoal-900 group">
      <span>{label}</span>
      <span className={cn('flex h-4 w-4 items-center justify-center border transition', checked ? 'border-ink bg-ink' : 'border-ink/25 group-hover:border-ink/50')}>
        {checked && <span className="h-1.5 w-1.5 bg-ivory-100" />}
      </span>
    </button>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-ink/10 py-6">
      <legend className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">{title}</legend>
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}

export function ShopToolbar({ facets }: { facets: Facets }) {
  const { current, update } = useFilterState();
  const { setOpen: setSearchOpen } = useSearchDialog();
  const [mobileFilters, setMobileFilters] = useState(false);

  const clearAll = () => update({ q: null, cat: null, min: null, max: null, sizes: [], colors: [], craft: null, occasion: null, avail: null, sort: 'featured' });

  const activeCount = [
    current.cat,
    current.min,
    current.max,
    current.sizes.length ? current.sizes.join(',') : '',
    current.colors.length ? current.colors.join(',') : '',
    current.craft,
    current.occasion,
    current.avail,
  ].filter(Boolean).length;

  const body = (
    <div className="space-y-0">
      <FilterGroup title="Collection">
        <div className="space-y-0.5">
          <CheckboxToggle label="All creations" checked={!current.cat} onChange={() => update({ cat: null })} />
          {facets.categories.map((c) => (
            <CheckboxToggle key={c.slug} label={c.name} checked={current.cat === c.slug} onChange={() => update({ cat: c.slug })} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="flex items-center gap-2">
          <input value={current.min} onChange={(e) => update({ min: e.target.value })} inputMode="numeric" placeholder="Min" aria-label="Minimum price" className="h-9 w-full border border-ink/15 bg-ivory-50 px-3 text-sm focus:border-ink/40 focus:outline-none" />
          <span className="text-ink-faint"><Minus className="h-3.5 w-3.5" /></span>
          <input value={current.max} onChange={(e) => update({ max: e.target.value })} inputMode="numeric" placeholder="Max" aria-label="Maximum price" className="h-9 w-full border border-ink/15 bg-ivory-50 px-3 text-sm focus:border-ink/40 focus:outline-none" />
        </div>
        <div className="mt-3">
          {[
            ['', 'Any price'],
            ['0', 'Under ₹3,000'],
            ['3000', '₹3,000 – ₹7,500'],
            ['7500', '₹7,500 – ₹15,000'],
            ['15000', '₹15,000+'],
          ].map(([min, label]) => (
            <CheckboxToggle key={label} label={label} checked={current.min === min && !current.max} onChange={() => update({ min: min || null, max: min ? (min === '15000' ? '' : String(Number(min) + 7500)) : null })} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <div className="space-y-0.5">
          <CheckboxToggle label="In stock" checked={current.avail === 'in-stock'} onChange={() => update({ avail: current.avail === 'in-stock' ? null : 'in-stock' })} />
          <CheckboxToggle label="Made to order" checked={current.avail === 'made-to-order'} onChange={() => update({ avail: current.avail === 'made-to-order' ? null : 'made-to-order' })} />
        </div>
      </FilterGroup>

      {facets.sizes.length > 0 && (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => (
              <button key={s} onClick={() => update({ sizes: current.sizes.includes(s) ? current.sizes.filter((x) => x !== s) : [...current.sizes, s] })} className={cn('h-9 min-w-11 px-2 border text-[13px] transition', current.sizes.includes(s) ? 'border-ink bg-ink text-ivory-100' : 'border-ink/15 hover:border-ink/40')}>
                {s}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.colors.length > 0 && (
        <FilterGroup title="Colour">
          <div className="space-y-0.5">
            {facets.colors.map((c) => (
              <CheckboxToggle key={c} label={c} checked={current.colors.includes(c)} onChange={() => update({ colors: current.colors.includes(c) ? current.colors.filter((x) => x !== c) : [...current.colors, c] })} />
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.crafts.length > 0 && (
        <FilterGroup title="Craft">
          <div className="space-y-0.5">
            {facets.crafts.map((c) => (
              <CheckboxToggle key={c} label={c} checked={current.craft === c} onChange={() => update({ craft: current.craft === c ? null : c })} />
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.occasions.length > 0 && (
        <FilterGroup title="Occasion">
          <div className="space-y-0.5">
            {facets.occasions.map((o) => (
              <CheckboxToggle key={o} label={o} checked={current.occasion === o} onChange={() => update({ occasion: current.occasion === o ? null : o })} />
            ))}
          </div>
        </FilterGroup>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filters + toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setMobileFilters(true)} className="inline-flex h-10 items-center gap-2 border border-ink/20 px-4 text-sm text-charcoal-800 hover:border-ink/50 transition lg:hidden">
          <Plus className="h-4 w-4" /> Filters {activeCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink text-[10px] text-ivory-100 px-1">{activeCount}</span>}
        </button>
        <button onClick={() => setSearchOpen(true)} className="inline-flex h-10 items-center gap-2 border border-ink/20 px-4 text-sm text-charcoal-800 hover:border-ink/50 transition lg:hidden">
          Search
        </button>
        {activeCount > 0 && (
          <button onClick={clearAll} className="inline-flex h-10 items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink">
            Clear all <X className="h-3.5 w-3.5" />
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort" className="text-xs uppercase tracking-widest text-ink-faint hidden sm:block">Sort</label>
          <select id="sort" value={current.sort} onChange={(e) => update({ sort: e.target.value })} className="h-10 border border-ink/15 bg-ivory-50 px-3 text-sm text-charcoal-800 focus:outline-none focus:border-ink/40 cursor-pointer">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A–Z</option>
          </select>
        </div>
      </div>

      <Drawer open={mobileFilters} onClose={() => setMobileFilters(false)} title="Filter & refine" side="left">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-serif text-xl text-charcoal-900">Refine</h2>
          <button onClick={() => setMobileFilters(false)} aria-label="Close filters" className="text-ink-muted hover:text-ink"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6">{body}</div>
        <div className="border-t border-ink/10 p-6">
          <button onClick={() => setMobileFilters(false)} className="w-full h-12 bg-ink text-ivory-100 text-sm">Show pieces</button>
        </div>
      </Drawer>
    </>
  );
}
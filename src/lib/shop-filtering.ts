import { PRICE_BANDS, PRODUCTS, type CategorySlug, type Product } from './catalog';

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]['value'];

export type ShopFilterState = {
  categories: string[];
  priceBands: string[];
  colors: string[];
  sort: SortKey;
};

export const EMPTY_FILTERS: ShopFilterState = {
  categories: [],
  priceBands: [],
  colors: [],
  sort: 'featured',
};

/** Raw `searchParams` as delivered by Next — values may be arrays. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function toList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const joined = Array.isArray(value) ? value.join(',') : value;
  return joined
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function parseFilters(params: RawSearchParams): ShopFilterState {
  const sortRaw = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const sort = SORT_OPTIONS.some((option) => option.value === sortRaw)
    ? (sortRaw as SortKey)
    : 'featured';

  return {
    categories: toList(params.category),
    priceBands: toList(params.price),
    colors: toList(params.color),
    sort,
  };
}

/** True when any facet (not the sort order) is narrowing the results. */
export function hasActiveFacets(filters: ShopFilterState): boolean {
  return (
    filters.categories.length > 0 ||
    filters.priceBands.length > 0 ||
    filters.colors.length > 0
  );
}

export function applyFilters(filters: ShopFilterState): Product[] {
  const bands = PRICE_BANDS.filter((band) =>
    filters.priceBands.includes(band.id),
  );

  const filtered = PRODUCTS.filter((product) => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    if (bands.length > 0) {
      const inBand = bands.some(
        (band) => product.price >= band.min && product.price < band.max,
      );
      if (!inBand) return false;
    }

    if (filters.colors.length > 0) {
      const matches = product.colors.some((color) => filters.colors.includes(color.name));
      if (!matches) return false;
    }

    return true;
  });

  switch (filters.sort) {
    case 'price-asc':
      return [...filtered].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...filtered].sort((a, b) => b.price - a.price);
    case 'rating':
      return [...filtered].sort((a, b) => b.rating - a.rating);
    case 'newest':
      return [...filtered].sort(
        (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)),
      );
    default:
      return [...filtered].sort(
        (a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)),
      );
  }
}

/** Serialise filter state back into a shareable query string (no leading `?`). */
export function buildQuery(filters: ShopFilterState): string {
  const params = new URLSearchParams();

  if (filters.categories.length) params.set('category', filters.categories.join(','));
  if (filters.priceBands.length) params.set('price', filters.priceBands.join(','));
  if (filters.colors.length) params.set('color', filters.colors.join(','));
  if (filters.sort !== 'featured') params.set('sort', filters.sort);

  return params.toString();
}

/** Toggle a value inside one facet list. */
export function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
}

/** How many products exist per category, for the sidebar counters. */
export function categoryCounts(): { slug: CategorySlug; count: number }[] {
  const counts = new Map<CategorySlug, number>();
  PRODUCTS.forEach((product) => {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  });
  return [...counts.entries()].map(([slug, count]) => ({ slug, count }));
}

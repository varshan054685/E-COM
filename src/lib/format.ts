/** Price + measurement formatting helpers (Indian market defaults). */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** `₹18,500` */
export function formatPrice(value: number): string {
  return inr.format(value);
}

/** `₹12,500 – ₹18,500`, collapsing to a single value when equal. */
export function formatPriceRange(min: number, max: number): string {
  return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
}

/** Percentage saved, clamped to 0 for non-discounted items. */
export function discountPercent(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

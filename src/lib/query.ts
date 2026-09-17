export function parseNumbers(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => Number(v))
    .filter((v) => !Number.isNaN(v) && v >= 0);
}

export function buildUrl(base: string, params: Record<string, string | string[] | undefined>): string {
  const url = new URL(base, 'http://localhost:3000');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.delete(key);
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      if (value.length) url.searchParams.set(key, value.join(','));
    } else {
      url.searchParams.set(key, value);
    }
  });
  return url.pathname + url.search;
}
'use client';

import { useEffect, useState } from 'react';

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Persisted stores (cart, measurements) read from localStorage during client
 * initialisation, so anything derived from them must wait for mount or React
 * will report a hydration mismatch.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

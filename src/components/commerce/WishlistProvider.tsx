'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from '@/components/ui/Toaster';
import { useAuth } from './AuthProvider';

const GUEST_KEY = 'jgths_wishlist';

type WishlistContextValue = {
  ids: string[];
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

function readLocalIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (user) {
        try {
          const res = await fetch('/api/wishlist', { cache: 'no-store' });
          if (res.ok) {
            const data = (await res.json()) as { ids: string[] };
            if (!cancelled) setIds(data.ids);
          }
        } catch {
          // ignore
        }
      } else if (!cancelled) {
        setIds(readLocalIds());
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Sync guest wishlist to server after login
  useEffect(() => {
    if (!user) return;
    const local = readLocalIds();
    if (local.length === 0) return;
    fetch('/api/wishlist/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: local }),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = (await res.json()) as { ids: string[] };
          setIds(data.ids);
        }
      })
      .catch(() => {});
    try {
      window.localStorage.removeItem(GUEST_KEY);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isWishlisted = useCallback(
    (productId: string) => ids.includes(productId),
    [ids],
  );

  const toggle = useCallback(
    async (productId: string) => {
      const exists = ids.includes(productId);
      if (user) {
        try {
          const res = await fetch(`/api/wishlist/${productId}`, {
            method: exists ? 'DELETE' : 'POST',
          });
          const data = (await res.json()) as { ids: string[] };
          if (res.ok) {
            setIds(data.ids);
            toast(exists ? 'Removed from wishlist' : 'Saved to your wishlist', {
              variant: 'success',
            });
          }
        } catch {
          toast('Could not update wishlist', { variant: 'error' });
        }
        return;
      }
      const next = exists ? ids.filter((i) => i !== productId) : [...ids, productId];
      setIds(next);
      try {
        window.localStorage.setItem(GUEST_KEY, JSON.stringify(next));
      } catch {}
      toast(exists ? 'Removed from wishlist' : 'Saved to your wishlist', {
        variant: 'success',
      });
    },
    [user, ids],
  );

  const value = useMemo(
    () => ({ ids, loading, isWishlisted, toggle }),
    [ids, loading, isWishlisted, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
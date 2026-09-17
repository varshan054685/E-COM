'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { CartLine } from '@/types';
import { useAuth } from './AuthProvider';
import { toast } from '@/components/ui/Toaster';

const GUEST_KEY = 'jgths_cart';

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  loading: boolean;
  addItem: (item: Omit<CartLine, 'id'>) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

function readLocal(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load + switch between guest and server cart
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (user) {
        try {
          const res = await fetch('/api/cart', { cache: 'no-store' });
          if (res.ok) {
            const { items: serverItems } = await res.json();
            if (!cancelled) setItems(serverItems satisfies CartLine[]);
          }
        } catch {
          // fall back to local
        }
      } else {
        if (!cancelled) setItems(readLocal());
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Merge guest cart into server cart after login
  const merge = useCallback(async () => {
    if (!user) return;
    const local = readLocal();
    if (local.length === 0) return;
    try {
      await fetch('/api/cart/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: local.map(({ productId, size, color, quantity }) => ({
            productId,
            size,
            color,
            quantity,
          })),
        }),
      });
      try {
        window.localStorage.removeItem(GUEST_KEY);
      } catch {}
      const res = await fetch('/api/cart', { cache: 'no-store' });
      if (res.ok) {
        const { items: serverItems } = await res.json();
        setItems(serverItems);
      }
    } catch {
      // non-fatal
    }
  }, [user]);

  useEffect(() => {
    if (user) merge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const persistLocal = useCallback((next: CartLine[]) => {
    setItems(next);
    try {
      window.localStorage.setItem(GUEST_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable
    }
  }, []);

  const addItem = useCallback(
    async (item: Omit<CartLine, 'id'>) => {
      if (user) {
        try {
          const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: item.productId,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            toast(data.error || 'Could not add to bag', { variant: 'error' });
            return false;
          }
          setItems(data.items satisfies CartLine[]);
          toast('Added to your collection', { variant: 'success' });
          return true;
        } catch {
          toast('Could not add to bag', { variant: 'error' });
          return false;
        }
      }
      const local = readLocal();
      const existing = local.find(
        (l) =>
          l.productId === item.productId &&
          l.size === item.size &&
          l.color === item.color,
      );
      if (existing && existing.stock < existing.quantity + (item.quantity || 1)) {
        toast('This piece is currently low in stock', { variant: 'error' });
        return false;
      }
      if (existing) {
        persistLocal(
          local.map((l) =>
            l.id === existing.id
              ? { ...l, quantity: l.quantity + (item.quantity || 1) }
              : l,
          ),
        );
      } else {
        persistLocal([...local, { ...item, id: `guest-${Date.now()}` }]);
      }
      toast('Added to your collection', { variant: 'success' });
      return true;
    },
    [user, persistLocal],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return;
      if (user) {
        try {
          const res = await fetch(`/api/cart/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          });
          if (res.ok) {
            const { items: serverItems } = await res.json();
            setItems(serverItems);
          }
        } catch {
          // ignore
        }
        return;
      }
      persistLocal(
        readLocal().map((l) => (l.id === itemId ? { ...l, quantity } : l)),
      );
    },
    [user, persistLocal],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (user) {
        try {
          const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
          if (res.ok) {
            const { items: serverItems } = await res.json();
            setItems(serverItems);
          }
        } catch {
          // ignore
        }
        return;
      }
      persistLocal(readLocal().filter((l) => l.id !== itemId));
    },
    [user, persistLocal],
  );

  const clear = useCallback(async () => {
    if (user) {
      try {
        await fetch('/api/cart', { method: 'DELETE' });
        setItems([]);
      } catch {
        // ignore
      }
      return;
    }
    persistLocal([]);
  }, [user, persistLocal]);

  const value = useMemo(() => {
    const count = items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    return { items, count, subtotal, loading, addItem, updateQuantity, removeItem, clear };
  }, [items, loading, addItem, updateQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
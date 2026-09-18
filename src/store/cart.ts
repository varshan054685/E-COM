'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Body measurements captured when a customer asks for a made-to-measure piece. */
export type Measurements = {
  unit: 'in' | 'cm';
  bust: string;
  waist: string;
  shoulder: string;
  armhole: string;
  length: string;
};

export type CartLine = {
  /** Stable identity for a product + size + colour + measurement combination. */
  key: string;
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
  madeToMeasure: boolean;
  measurements: Measurements | null;
  /** File names of any reference images attached to a custom request. */
  referenceFiles: string[];
  notes: string;
};

export type NewCartLine = Omit<CartLine, 'key' | 'quantity'> & { quantity?: number };

const MAX_QUANTITY = 20;

function buildKey(line: NewCartLine): string {
  const measure =
    line.madeToMeasure && line.measurements
      ? [
          line.measurements.unit,
          line.measurements.bust,
          line.measurements.waist,
          line.measurements.shoulder,
          line.measurements.armhole,
          line.measurements.length,
        ].join('-')
      : 'standard';

  return [line.productId, line.size ?? 'one-size', line.color ?? 'no-colour', measure].join('::');
}

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  /** Key of the most recently added line, so the drawer can highlight it. */
  lastAddedKey: string | null;
  addLine: (line: NewCartLine) => void;
  removeLine: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      lastAddedKey: null,

      addLine: (line) => {
        const key = buildKey(line);
        const quantity = Math.max(1, line.quantity ?? 1);

        set((state) => {
          const existing = state.lines.find((l) => l.key === key);

          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.key === key
                  ? { ...l, quantity: Math.min(l.quantity + quantity, MAX_QUANTITY) }
                  : l,
              ),
              lastAddedKey: key,
              isOpen: true,
            };
          }

          return {
            lines: [...state.lines, { ...line, key, quantity }],
            lastAddedKey: key,
            isOpen: true,
          };
        });
      },

      removeLine: (key) =>
        set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),

      setQuantity: (key, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.key !== key)
              : state.lines.map((l) =>
                  l.key === key ? { ...l, quantity: Math.min(quantity, MAX_QUANTITY) } : l,
                ),
        })),

      clear: () => set({ lines: [], lastAddedKey: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setCartOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: 'aari-couture:cart',
      version: 1,
      // Only the lines survive a reload — the drawer should always start closed.
      partialize: (state) => ({ lines: state.lines }) as Partial<CartState>,
    },
  ),
);

/** Total number of items (sum of quantities) in the cart. */
export function useCartCount(): number {
  return useCartStore((s) => s.lines.reduce((total, line) => total + line.quantity, 0));
}

/** Cart subtotal in rupees. */
export function useCartSubtotal(): number {
  return useCartStore((s) => s.lines.reduce((total, line) => total + line.price * line.quantity, 0));
}

export const FREE_SHIPPING_THRESHOLD = 15000;
export const SHIPPING_FLAT_RATE = 250;

/** Shipping is complimentary above the threshold, otherwise a flat rate. */
export function shippingFor(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}

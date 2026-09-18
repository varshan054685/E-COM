'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Measurements } from './cart';

export const EMPTY_MEASUREMENTS: Measurements = {
  unit: 'in',
  bust: '',
  waist: '',
  shoulder: '',
  armhole: '',
  length: '',
};

type MeasurementState = {
  /** The customer's own measurements, reused to pre-fill every new form. */
  saved: Measurements | null;
  save: (measurements: Measurements) => void;
  clear: () => void;
};

export const useMeasurementStore = create<MeasurementState>()(
  persist(
    (set) => ({
      saved: null,
      save: (measurements) => set({ saved: measurements }),
      clear: () => set({ saved: null }),
    }),
    { name: 'aari-couture:measurements', version: 1 },
  ),
);

/** Bust, waist, shoulder and armhole are required; length is optional. */
export const REQUIRED_MEASUREMENT_KEYS = ['bust', 'waist', 'shoulder', 'armhole'] as const;

/** True when every required measurement has a value. */
export function isComplete(m: Measurements): boolean {
  return REQUIRED_MEASUREMENT_KEYS.every((key) => m[key].trim().length > 0);
}

/** Retained for the account page summary. */
export const MEASUREMENT_LABELS: { key: keyof Omit<Measurements, 'unit'>; label: string }[] = [
  { key: 'bust', label: 'Bust' },
  { key: 'waist', label: 'Waist' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'armhole', label: 'Armhole' },
  { key: 'length', label: 'Blouse length' },
];

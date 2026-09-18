/**
 * Supabase environment access.
 *
 * Read once at module scope so the whole app agrees on whether Supabase is
 * configured. When it is not, the admin area renders a setup panel instead of
 * throwing, and the storefront keeps working exactly as before.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** True when both browser-safe values are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const SUPABASE_SETUP_MESSAGE =
  'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.';

/** Thrown when a Supabase call is attempted before configuration. */
export class SupabaseUnconfiguredError extends Error {
  constructor() {
    super(SUPABASE_SETUP_MESSAGE);
    this.name = 'SupabaseUnconfiguredError';
  }
}

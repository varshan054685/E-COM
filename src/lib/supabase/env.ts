/**
 * Supabase environment access.
 *
 * Read once at module scope so the whole app agrees on whether Supabase is
 * configured. When it is not, the admin area renders a setup panel instead of
 * throwing, and the storefront keeps working exactly as before.
 *
 * In production, error messages are user-friendly and never leak technical
 * details like .env.local or Supabase configuration steps.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** True when both browser-safe values are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** True in development, false on Vercel / any production build. */
export const isDev = process.env.NODE_ENV === 'development';

/**
 * Developer-only setup message shown locally.
 * In production the user sees a generic "service unavailable" instead.
 */
export const SUPABASE_SETUP_MESSAGE_DEV =
  'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.';

/** Production-safe message — no internal details. */
export const SUPABASE_SETUP_MESSAGE_PROD =
  'Authentication is temporarily unavailable. Please try again later.';

/** Environment-aware message. */
export const SUPABASE_SETUP_MESSAGE = isDev
  ? SUPABASE_SETUP_MESSAGE_DEV
  : SUPABASE_SETUP_MESSAGE_PROD;

/** Thrown when a Supabase call is attempted before configuration. */
export class SupabaseUnconfiguredError extends Error {
  constructor() {
    super(SUPABASE_SETUP_MESSAGE);
    this.name = 'SupabaseUnconfiguredError';
  }
}

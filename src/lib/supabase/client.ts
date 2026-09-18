'use client';

import { createBrowserClient } from '@supabase/ssr';

import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  SupabaseUnconfiguredError,
  isSupabaseConfigured,
} from './env';

/**
 * Browser-side Supabase client.
 *
 * `createBrowserClient` already memoises per URL + key, so this does not need
 * its own cache — calling it repeatedly returns the same auth-aware instance.
 */
export function createClient() {
  if (!isSupabaseConfigured) throw new SupabaseUnconfiguredError();
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

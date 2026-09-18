import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  SupabaseUnconfiguredError,
  isSupabaseConfigured,
} from './env';

/**
 * Server-side Supabase client for Server Components, Server Actions and
 * Route Handlers.
 *
 * Cookie writes throw inside a Server Component render (Next.js only allows
 * cookie mutation in actions and route handlers), so `setAll` swallows that
 * error — the middleware refresh keeps tokens current.
 */
export async function createClient() {
  if (!isSupabaseConfigured) throw new SupabaseUnconfiguredError();

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — safe to ignore.
        }
      },
    },
  });
}

/** Resolved session user, or `null` when signed out or unconfigured. */
export async function getCurrentUser() {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}

/**
 * Whether the signed-in user is an admin.
 *
 * Reads through `profiles`, whose RLS grants a signed-in user their own row.
 * This is a convenience for server components — the middleware is the actual
 * gate, and RLS is the real enforcement.
 */
export async function getCurrentProfile() {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, last_active_at, created_at')
    .eq('id', user.id)
    .maybeSingle();

  return data;
}

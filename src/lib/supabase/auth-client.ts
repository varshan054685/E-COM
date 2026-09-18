'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

import { createClient } from './client';
import { isSupabaseConfigured } from './env';

export type AuthResult =
  | { ok: true }
  /** `notice: true` means "not an error, but nothing progressed" (e.g. confirm your email). */
  | { ok: false; error: string; notice?: boolean };

/** Turn Supabase's raw messages into boutique-appropriate copy. */
function friendly(message: string): string {
  const normalised = message.toLowerCase();

  if (normalised.includes('invalid login credentials')) {
    return 'That email and password combination is not recognised.';
  }
  if (normalised.includes('email not confirmed')) {
    return 'Please confirm your email address first — check your inbox for the link.';
  }
  if (normalised.includes('already registered') || normalised.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (normalised.includes('at least 6 characters') || normalised.includes('password should be')) {
    return 'Use a password of at least 8 characters.';
  }
  if (normalised.includes('rate limit') || normalised.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (normalised.includes('unable to validate email')) {
    return 'That email address does not look valid.';
  }

  return message;
}

function toMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message.includes('not configured')
      ? 'Sign-in is unavailable: Supabase is not configured yet.'
      : error.message;
  }
  return 'Something went wrong. Please try again.';
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return error ? { ok: false, error: friendly(error.message) } : { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function signUpWithPassword(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });

    if (error) return { ok: false, error: friendly(error.message) };

    // With email confirmation enabled, sign-up returns a user but no session.
    if (!data.session) {
      return {
        ok: false,
        notice: true,
        error: 'Almost there — open the confirmation link we emailed you, then sign in.',
      };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

/** Sends the password-reset email. The link returns to /auth/callback. */
export async function sendPasswordReset(email: string): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    return error ? { ok: false, error: friendly(error.message) } : { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

/** Completes the recovery flow once the user has a session from the email link. */
export async function updatePassword(password: string): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    return error ? { ok: false, error: friendly(error.message) } : { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function signOutUser(): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await createClient().auth.signOut();
  } catch {
    // Already signed out or unconfigured — nothing to do.
  }
}

/** Preferred label for a user: their profile name, else their email. */
export function displayName(user: User | null): string {
  if (!user) return '';
  const meta = user.user_metadata as { full_name?: string } | undefined;
  return meta?.full_name?.trim() || user.email || 'Guest';
}

export const ADMIN_EMAIL = 'jagathees.offic@gmail.com';

/**
 * Checks whether a user ID or user email belongs to an administrator.
 */
export async function checkIsAdmin(userId: string, email?: string): Promise<boolean> {
  if (email && email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) return true;
  if (!isSupabaseConfigured || !userId) return false;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    return data?.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Client session hook. Subscribes to `onAuthStateChange` and fetches profile role
 * so the topbar and navigation react to admin sign-in and sign-out.
 */
export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let active = true;
    const supabase = createClient();

    async function syncProfile(currentUser: User | null) {
      if (!currentUser) {
        if (active) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      if (active) setUser(currentUser);

      const isOwnerEmail = currentUser.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
      if (isOwnerEmail) {
        if (active) {
          setIsAdmin(true);
          setLoading(false);
        }
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (active) {
          setIsAdmin(profile?.role === 'admin');
          setLoading(false);
        }
      } catch {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    }

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active) return;
        void syncProfile(data.user ?? null);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      void syncProfile(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, isAdmin };
}

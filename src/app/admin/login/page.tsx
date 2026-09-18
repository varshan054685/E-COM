import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert, TriangleAlert } from 'lucide-react';

import { AuthForm } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata: Metadata = {
  title: 'Admin Sign In',
  description: 'Restricted access for boutique staff.',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { next, error } = await searchParams;

  // Only allow same-site relative redirects.
  const redirectTo = next?.startsWith('/') && !next.startsWith('//') ? next : '/admin';

  const banner =
    error === 'not-admin'
      ? {
          tone: 'danger' as const,
          title: 'This account does not have admin access',
          body: 'You are signed in, but this account is not an administrator. Sign in with an admin account, or promote your own account from the Supabase SQL editor.',
        }
      : error === 'unconfigured'
        ? {
            tone: 'warning' as const,
            title: 'Supabase is not configured',
            body: 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, restart the dev server, then run supabase/schema.sql in the Supabase SQL editor.',
          }
        : null;

  return (
    <AuthShell
      eyebrow="Staff only"
      title="Admin sign in"
      description="This area manages products, orders and customers. Access is restricted to accounts with the admin role."
      footer={
        <p className="text-sm text-muted-foreground">
          Not a staff member?{' '}
          <Link
            href="/"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-gold-700"
          >
            Return to the boutique
          </Link>
        </p>
      }
    >
      {banner ? (
        <div
          role="alert"
          className={
            banner.tone === 'danger'
              ? 'mb-6 flex gap-3 rounded-lg border border-destructive/25 bg-destructive/6 p-4'
              : 'mb-6 flex gap-3 rounded-lg border border-gold-200 bg-gold-100/60 p-4'
          }
        >
          {banner.tone === 'danger' ? (
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          ) : (
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-gold-700" aria-hidden="true" />
          )}
          <div>
            <p
              className={
                banner.tone === 'danger'
                  ? 'text-sm font-medium text-destructive'
                  : 'text-sm font-medium text-ink-700'
              }
            >
              {banner.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">{banner.body}</p>
          </div>
        </div>
      ) : null}

      {!isSupabaseConfigured ? null : <AuthForm mode="login" redirectTo={redirectTo} />}
    </AuthShell>
  );
}

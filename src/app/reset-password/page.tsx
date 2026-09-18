import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';

export const metadata: Metadata = {
  title: 'Choose a New Password',
  description: 'Set a new password for your boutique account.',
  robots: { index: false, follow: true },
};

/**
 * Landing point after the recovery email link has been exchanged for a session
 * at `/auth/callback`. `updateUser({ password })` requires that session.
 */
export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Almost done"
      title="Choose a new password"
      description="Pick something you have not used here before. You will stay signed in once it is saved."
      footer={
        <p className="text-sm text-muted-foreground">
          Link expired?{' '}
          <Link
            href="/forgot-password"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-gold-700"
          >
            Request a new one
          </Link>
        </p>
      }
    >
      <AuthForm mode="reset" />
    </AuthShell>
  );
}

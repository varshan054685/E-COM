import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Request a password-reset link for your boutique account.',
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email you registered with and we will send you a secure link to choose a new password."
      footer={
        <p className="text-sm text-muted-foreground">
          Remembered it?{' '}
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-gold-700"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      <AuthForm mode="forgot" />
    </AuthShell>
  );
}

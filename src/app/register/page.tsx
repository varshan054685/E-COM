import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';

export const metadata: Metadata = {
  title: 'Create Account',
  description:
    'Create an account to save your measurements, track custom orders and shop faster.',
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join the atelier"
      title="Create your account"
      description="Save your measurements once and every future order starts from a fit we already know works."
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-gold-700"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}

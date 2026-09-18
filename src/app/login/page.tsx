import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to reuse your saved measurements, review your bag and follow your custom orders.',
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Pick up where you left off — your measurements, bag and requests stay together."
      footer={
        <p className="text-sm text-muted-foreground">
          New to the boutique?{' '}
          <Link
            href="/register"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-gold-700"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}

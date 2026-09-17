'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/components/commerce/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) router.push(next);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" fullWidth size="lg" isLoading={loading}>Sign in</Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-28">
      <p className="editorial-eyebrow mb-3">Welcome back</p>
      <h1 className="font-serif text-4xl text-charcoal-900">Sign in</h1>
      <p className="mt-3 text-sm text-ink-muted">Access your orders, wishlist, measurements, and custom couture requests.</p>
      <div className="mt-9">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-6 text-sm text-ink-muted">
        New to the boutique?{' '}
        <Link href="/register" className="text-gold-700 underline underline-offset-4">Create an account</Link>
      </p>
      <div className="mt-10 border border-gold-500/30 bg-gold-500/5 p-4 text-xs text-charcoal-700">
        <p className="font-medium uppercase tracking-widest text-gold-700">Demo access</p>
        <p className="mt-2">Customer — priya@example.com / customer123<br />Admin — admin@jgthscouture.in / admin123</p>
      </div>
    </div>
  );
}
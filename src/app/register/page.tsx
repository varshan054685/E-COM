'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/components/commerce/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const ok = await register({ name, email, phone, password });
    setLoading(false);
    if (ok) router.push('/account');
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Input label="Full name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
      <Input label="Password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" hint="At least 6 characters." />
      <Button type="submit" fullWidth size="lg" isLoading={loading}>Create account</Button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-28">
      <p className="editorial-eyebrow mb-3">Begin your atelier journey</p>
      <h1 className="font-serif text-4xl text-charcoal-900">Create an account</h1>
      <p className="mt-3 text-sm text-ink-muted">Save your wishlist, measurements, addresses and orders — all in one place.</p>
      <div className="mt-9">
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </div>
      <p className="mt-6 text-sm text-ink-muted">
        Already a client?{' '}
        <Link href="/login" className="text-gold-700 underline underline-offset-4">Sign in</Link>
      </p>
    </div>
  );
}
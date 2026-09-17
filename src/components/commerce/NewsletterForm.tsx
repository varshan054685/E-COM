'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from '@/components/ui/Toaster';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast('Please enter a valid email', { variant: 'error' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        toast('Welcome to the atelier letter', { variant: 'success' });
      } else {
        toast('Something went wrong. Please try again.', { variant: 'error' });
      }
    } catch {
      toast('Something went wrong. Please try again.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="flex items-center gap-2 text-sm text-ivory-100 border border-gold-500/40 px-5 py-3">
        <Check className="h-4 w-4 text-gold-400" /> You&apos;re on the list. We write rarely, and with intent.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col sm:flex-row gap-3">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="h-12 flex-1 bg-transparent border border-ivory-100/20 px-4 text-sm text-ivory-100 placeholder:text-ivory-100/40 focus:outline-none focus:border-gold-500/60"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 items-center justify-center gap-2 bg-gold-500 px-6 text-sm font-medium text-charcoal-900 hover:bg-gold-400 disabled:opacity-60 transition"
      >
        Subscribe <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
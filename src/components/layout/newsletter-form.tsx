'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * Newsletter capture.
 *
 * There is no backend in this build, so the form validates locally and
 * acknowledges the signup. Wire `subscribe()` to your ESP (Klaviyo, Mailchimp,
 * Resend…) when the integration is ready.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus('error');
      return;
    }
    setStatus('done');
    setEmail('');
  }

  if (status === 'done') {
    return (
      <p className="flex items-center gap-2 text-sm text-gold-200">
        <Check className="size-4 shrink-0" />
        Thank you — you are on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center gap-2">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="you@example.com"
          aria-invalid={status === 'error'}
          className="h-11 w-full min-w-0 rounded-md border border-white/20 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/40 focus-visible:border-gold-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold-400 aria-[invalid=true]:border-destructive"
        />
        <Button
          type="submit"
          variant="gold"
          size="icon"
          aria-label="Subscribe"
          className="shrink-0"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {status === 'error' ? (
        <p className="text-xs text-gold-200">Please enter a valid email address.</p>
      ) : (
        <p className="text-xs text-white/50">
          Early access to new collections and studio appointments.
        </p>
      )}
    </form>
  );
}

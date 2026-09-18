'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Eye, EyeOff, Info, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  sendPasswordReset,
  signInWithPassword,
  signUpWithPassword,
  updatePassword,
} from '@/lib/supabase/auth-client';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'confirm', string>>;

const SUBMIT_LABEL: Record<AuthMode, { idle: string; pending: string }> = {
  login: { idle: 'Sign in', pending: 'Signing in…' },
  register: { idle: 'Create account', pending: 'Creating account…' },
  forgot: { idle: 'Email me a reset link', pending: 'Sending…' },
  reset: { idle: 'Save new password', pending: 'Saving…' },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthFormProps = {
  mode: AuthMode;
  /** Where to land after a successful action. */
  redirectTo?: string;
};

export function AuthForm({ mode, redirectTo = '/account' }: AuthFormProps) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  const needsName = mode === 'register';
  const needsEmail = mode !== 'reset';
  const needsPassword = mode !== 'forgot';
  const needsConfirm = mode === 'reset' || mode === 'register';

  function clearError(key: keyof FieldErrors) {
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    if (formError) setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);

    const nextErrors: FieldErrors = {};

    if (needsName && !name.trim()) nextErrors.name = 'Please enter your name.';
    if (needsEmail && !EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (needsPassword) {
      if (mode === 'login') {
        if (!password) nextErrors.password = 'Enter your password.';
      } else if (password.length < 8) {
        nextErrors.password = 'Use at least 8 characters.';
      }
      if (needsConfirm && password !== confirm) {
        nextErrors.confirm = 'Passwords do not match.';
      }
    }

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setPending(true);
    try {
      if (mode === 'login') {
        const result = await signInWithPassword(email, password);
        if (!result.ok) {
          setFormError(result.error);
          return;
        }
        router.push(redirectTo);
        router.refresh();
        return;
      }

      if (mode === 'register') {
        const result = await signUpWithPassword(name, email, password);
        if (!result.ok) {
          if (result.notice) setNotice(result.error);
          else setFormError(result.error);
          return;
        }
        router.push(redirectTo);
        router.refresh();
        return;
      }

      if (mode === 'forgot') {
        const result = await sendPasswordReset(email);
        if (!result.ok) {
          setFormError(result.error);
          return;
        }
        setDone(true);
        return;
      }

      const result = await updatePassword(password);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-primary/15 bg-primary/6 p-5">
        <p className="flex items-center gap-2 font-medium text-primary">
          <Check className="size-4" aria-hidden="true" />
          Reset link sent
        </p>
        <p className="text-sm leading-relaxed text-ink-500">
          If an account exists for <span className="font-medium">{email}</span>, a
          password-reset link is on its way. Open it on this device to choose a new
          password.
        </p>
        <Button asChild variant="outline" className="self-start">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {needsName ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="auth-name">Your name</Label>
          <Input
            id="auth-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError('name');
            }}
            placeholder="Priya Raman"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
        </div>
      ) : null}

      {needsEmail ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError('email');
            }}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
        </div>
      ) : null}

      {needsPassword ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="auth-password">
              {mode === 'reset' ? 'New password' : 'Password'}
            </Label>
            {mode === 'login' ? (
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Forgot password?
              </Link>
            ) : null}
          </div>

          <div className="relative">
            <Input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearError('password');
              }}
              placeholder={mode === 'login' ? 'Your password' : 'At least 8 characters'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="pr-11"
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center px-3.5 text-ink-400 transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
        </div>
      ) : null}

      {needsConfirm ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="auth-confirm">Confirm password</Label>
          <Input
            id="auth-confirm"
            type={showPassword ? 'text' : 'password'}
            value={confirm}
            onChange={(event) => {
              setConfirm(event.target.value);
              clearError('confirm');
            }}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirm)}
          />
          {errors.confirm ? <p className="text-xs text-destructive">{errors.confirm}</p> : null}
        </div>
      ) : null}

      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      {notice ? (
        <p
          role="status"
          className="flex gap-2.5 rounded-lg border border-primary/15 bg-primary/6 p-3.5 text-xs leading-relaxed text-primary"
        >
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {notice}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="mt-1">
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {pending ? SUBMIT_LABEL[mode].pending : SUBMIT_LABEL[mode].idle}
      </Button>

      {!isSupabaseConfigured ? (
        <p className="flex gap-2.5 rounded-lg border border-gold-200 bg-gold-100/60 p-3.5 text-[11px] leading-relaxed text-ink-500">
          <Info className="mt-0.5 size-3.5 shrink-0 text-gold-700" aria-hidden="true" />
          <span>
            Supabase is not configured yet, so sign-in is disabled. Add
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and
            restart the dev server.
          </span>
        </p>
      ) : null}
    </form>
  );
}

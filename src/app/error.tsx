'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    console.error('[PageError]', error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-gold-100 text-gold-700">
          <AlertTriangle className="size-7" />
        </div>

        <h1 className="font-serif text-3xl font-semibold text-ink-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          {isDev
            ? error.message || 'An unexpected error occurred while loading this page.'
            : 'We ran into an unexpected issue. Please try refreshing or head back to the homepage.'}
        </p>

        {isDev && error.digest ? (
          <p className="mt-2 font-mono text-xs text-ink-400">
            Digest: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-gold-300 bg-gradient-to-b from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-gold-500 hover:to-gold-600"
          >
            <RotateCcw className="size-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-700 shadow-sm transition-all hover:bg-ink-50"
          >
            <ArrowLeft className="size-4" />
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}

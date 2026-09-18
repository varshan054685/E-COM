'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Log the error for observability (shows in Vercel logs or browser console)
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: 'linear-gradient(135deg, #faf8f4 0%, #f5f0e8 100%)',
          color: '#1a1a1a',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: '480px',
            padding: '3rem 1.5rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #c5a23e, #d4af37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            ✦
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.75rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: '#1a1a1a',
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: '#6b6b6b',
              marginBottom: '2rem',
            }}
          >
            {isDev
              ? error.message || 'An unexpected error occurred.'
              : 'We encountered an unexpected issue. Please try again or return to the homepage.'}
          </p>

          {isDev && error.digest ? (
            <p
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: '#999',
                marginBottom: '1.5rem',
              }}
            >
              Digest: {error.digest}
            </p>
          ) : null}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.625rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #d4af37',
                background: 'linear-gradient(135deg, #c5a23e, #d4af37)',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: '0.625rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #e0d5c0',
                background: 'transparent',
                color: '#1a1a1a',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

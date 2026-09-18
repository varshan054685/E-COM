import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/supabase/env';

const ADMIN_LOGIN = '/admin/login';

/**
 * Refreshes the Supabase auth cookies on every navigation and enforces the
 * admin-only gate on `/admin`.
 *
 * The gate is defence in depth, not the only defence: every admin table is also
 * protected by Row Level Security, so a forged client cannot read or write
 * admin data even if this check were bypassed.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLogin = pathname === ADMIN_LOGIN;

  // Without credentials there is nothing to authenticate against. Send admin
  // traffic to the setup-aware login screen rather than letting it render.
  if (!isSupabaseConfigured) {
    if (isAdminRoute && !isAdminLogin) {
      const url = new URL(ADMIN_LOGIN, request.url);
      url.searchParams.set('error', 'unconfigured');
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Must be called before the response is returned so refreshed tokens are set.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminRoute) return response;

  // Resolve the role once — needed by both the gate and the login redirect.
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    isAdmin = profile?.role === 'admin';
  }

  // Already signed in as an admin — no reason to see the login screen.
  if (isAdminLogin) {
    if (isAdmin) return NextResponse.redirect(new URL('/admin', request.url));
    return response;
  }

  if (!user) {
    const url = new URL(ADMIN_LOGIN, request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (!isAdmin) {
    const url = new URL(ADMIN_LOGIN, request.url);
    url.searchParams.set('error', 'not-admin');
    return NextResponse.redirect(url);
  }

  return response;
}

export const middleware = proxy;

export const config = {
  // Everything except Next internals and static assets.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)',
  ],
};

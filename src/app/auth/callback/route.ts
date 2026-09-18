import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

/**
 * Exchanges the `code` from an email link (confirmation or password recovery)
 * for a session, then forwards the visitor to `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/account';

  // Only allow same-site relative redirects.
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/account';

  if (!isSupabaseConfigured) {
    return NextResponse.redirect(`${origin}/login?error=unconfigured`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing-code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=link-expired`);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}

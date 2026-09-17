import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import type { User } from '@prisma/client';

export type AdminGuard = { user: User; error: null } | { user: null; error: NextResponse };

export async function requireAdminApi(): Promise<AdminGuard> {
  const user = await getSessionUser();
  if (!user) {
    return { user: null, error: NextResponse.json({ error: 'Please sign in.' }, { status: 401 }) };
  }
  if (user.role !== 'ADMIN') {
    return { user: null, error: NextResponse.json({ error: 'Admin access required.' }, { status: 403 }) };
  }
  return { user, error: null };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function num(v: unknown, fallback = 0): number {
  const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export function int(v: unknown, fallback = 0): number {
  const n = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

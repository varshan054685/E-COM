import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const SESSION_COOKIE = 'jgths_session';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'jgths-luxe-dev-secret');

export type SessionPayload = {
  sub: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
};

export async function createSessionToken(payload: { id: string | number; name: string; email: string; role: string }): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(payload.id))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      sub: payload.sub!,
      name: (payload.name as string) || '',
      email: (payload.email as string) || '',
      role: payload.role as SessionPayload['role'],
    };
  } catch {
    return null;
  }
}

export async function setSession(payload: { id: string; name: string; email: string; role: string }) {
  const token = await createSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return null;
  return user;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return user;
}
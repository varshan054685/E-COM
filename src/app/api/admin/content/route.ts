import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const rows = await prisma.siteContent.findMany({ orderBy: { key: 'asc' } });
  return NextResponse.json({ content: rows });
}

export async function PUT(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  try {
    const body = await request.json();
    const entries: Array<{ key: string; value: string }> = Array.isArray(body.entries) ? body.entries : [];
    const valid = entries.filter((e) => typeof e.key === 'string' && e.key && typeof e.value === 'string');
    await prisma.$transaction(
      valid.map((e) =>
        prisma.siteContent.upsert({
          where: { key: e.key },
          create: { key: e.key, value: e.value },
          update: { value: e.value },
        }),
      ),
    );
    return NextResponse.json({ ok: true, updated: valid.length });
  } catch {
    return NextResponse.json({ error: 'Could not save content.' }, { status: 500 });
  }
}
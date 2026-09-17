import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  try {
    const body = await request.json();
    if (body.approved !== undefined) {
      await prisma.review.update({ where: { id }, data: { approved: Boolean(body.approved) } });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Could not update review.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  try {
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not delete review.' }, { status: 500 });
  }
}
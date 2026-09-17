import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MEASUREMENT_FIELDS = [
  'name',
  'bust',
  'waist',
  'hip',
  'shoulder',
  'sleeveLength',
  'armhole',
  'blouseLength',
  'frontNeckDepth',
  'backNeckDepth',
  'notes',
] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const existing = await prisma.measurementProfile.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }
    const body = await request.json();
    const data: Record<string, unknown> = {};
    for (const field of MEASUREMENT_FIELDS) {
      if (typeof body[field] === 'string') data[field] = body[field].trim() || null;
    }
    if (body.isDefault) {
      await prisma.measurementProfile.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
      data.isDefault = true;
    }
    const profile = await prisma.measurementProfile.update({ where: { id }, data });
    return NextResponse.json({ profile });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to update profile.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const existing = await prisma.measurementProfile.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }
    await prisma.measurementProfile.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to delete profile.' }, { status: 500 });
  }
}
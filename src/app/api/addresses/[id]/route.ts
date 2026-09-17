import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Address not found.' }, { status: 404 });
    }
    const body = await request.json();
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }
    const address = await prisma.address.update({
      where: { id },
      data: {
        label: body.label ?? undefined,
        fullName: body.fullName ?? undefined,
        phone: body.phone ?? undefined,
        line1: body.line1 ?? undefined,
        line2: body.line2 ?? undefined,
        city: body.city ?? undefined,
        state: body.state ?? undefined,
        pincode: body.pincode ?? undefined,
        isDefault: body.isDefault ?? undefined,
      },
    });
    return NextResponse.json({ address });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to update address.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Address not found.' }, { status: 404 });
    }
    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to delete address.' }, { status: 500 });
  }
}
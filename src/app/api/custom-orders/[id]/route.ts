import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CANCELLABLE_CUSTOM_ORDER_STATUSES } from '@/lib/custom-order';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const record = await prisma.customOrder.findUnique({
      where: { id },
      include: {
        images: true,
        measurementProfile: true,
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!record || record.userId !== user.id) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }
    return NextResponse.json({
      request: {
        ...record,
        quoteAmount: record.quoteAmount?.toNumber() ?? null,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to load request.' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const record = await prisma.customOrder.findUnique({ where: { id } });
    if (!record || record.userId !== user.id) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }
    const body = await request.json();
    if (body.notes !== undefined) {
      const updated = await prisma.customOrder.update({
        where: { id },
        data: { additionalNotes: String(body.notes).trim().slice(0, 600) },
      });
      return NextResponse.json({ request: updated });
    }
    if (body.action === 'cancel') {
      if (!CANCELLABLE_CUSTOM_ORDER_STATUSES.includes(record.status)) {
        return NextResponse.json({ error: 'This request can no longer be cancelled.' }, { status: 400 });
      }
      const updated = await prisma.customOrder.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
      return NextResponse.json({ request: updated });
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to update request.' }, { status: 500 });
  }
}
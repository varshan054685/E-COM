import { NextResponse } from 'next/server';
import { requireAdminApi, num } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/crypto';
import { CUSTOM_ORDER_STATUSES } from '@/lib/custom-order';

const VALID_STATUS = new Set(CUSTOM_ORDER_STATUSES.map((s) => s.value));

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  const record = await prisma.customOrder.findUnique({
    where: { id },
    include: { images: true, measurementProfile: true, user: { select: { id: true, name: true, email: true } } },
  });
  if (!record) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  const user = record.user;
  return NextResponse.json({
    request: {
      ...record,
      quoteAmount: record.quoteAmount?.toNumber() ?? null,
      customerName: record.customerName || user?.name || '',
      customerEmail: record.customerEmail || user?.email || '',
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;

  try {
    const body = await request.json();
    const existing = await prisma.customOrder.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!existing) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    // Convert to order
    if (body.action === 'convert') {
      if (!existing.quoteAmount || existing.quoteAmount.toNumber() <= 0) {
        return NextResponse.json({ error: 'Set a quote amount before converting to an order.' }, { status: 400 });
      }
      if (existing.convertedOrderId) {
        return NextResponse.json({ error: 'Already converted.' }, { status: 409 });
      }
      const orderNumber = generateOrderNumber('JGTHS');
      const order = await prisma.$transaction(async (tx) => {
        const quote = existing.quoteAmount ?? num(0);
        const o = await tx.order.create({
          data: {
            orderNumber,
            userId: existing.userId,
            customerName: existing.customerName || existing.user?.name || '',
            customerEmail: existing.customerEmail || existing.user?.email || '',
            customerPhone: existing.customerPhone,
            subtotal: quote,
            discount: 0,
            shipping: 0,
            total: quote,
            status: 'CONFIRMED',
            paymentStatus: 'UNPAID',
            notes: `Converted from custom order ${existing.orderNumber}`,
            items: {
              create: {
                productName: `${existing.creationType} — ${existing.orderNumber}`,
                quantity: 1,
                unitPrice: quote,
                totalPrice: quote,
              },
            },
          },
        });
        await tx.customOrder.update({
          where: { id },
          data: { convertedOrderId: o.id, status: 'IN_PRODUCTION' },
        });
        return o;
      });
      return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
    }

    // Status / notes update
    const data: Record<string, unknown> = {};
    if (body.status && VALID_STATUS.has(body.status)) data.status = body.status;
    if (body.quoteAmount !== undefined) data.quoteAmount = body.quoteAmount === '' || body.quoteAmount === null ? null : num(body.quoteAmount);
    if (body.quoteNote !== undefined) data.quoteNote = body.quoteNote || null;
    if (body.adminNotes !== undefined) data.adminNotes = body.adminNotes || null;
    if (body.deadline) data.deadline = new Date(body.deadline);

    await prisma.customOrder.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('admin custom-order update', error);
    return NextResponse.json({ error: 'Could not update the request.' }, { status: 500 });
  }
}
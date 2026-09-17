import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';
import { ORDER_STATUS_VALUES } from '@/lib/constants';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: { orderBy: { createdAt: 'asc' } }, address: true, user: { select: { id: true, name: true, email: true } } },
  });
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  return NextResponse.json({
    order: {
      ...order,
      subtotal: order.subtotal.toNumber(),
      discount: order.discount.toNumber(),
      shipping: order.shipping.toNumber(),
      total: order.total.toNumber(),
      items: order.items.map((i) => ({ ...i, unitPrice: i.unitPrice.toNumber(), totalPrice: i.totalPrice.toNumber() })),
      payments: order.payments.map((p) => ({ ...p, amount: p.amount.toNumber() })),
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
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (body.status && ORDER_STATUS_VALUES.includes(body.status)) data.status = body.status;
    if (body.paymentStatus) data.paymentStatus = body.paymentStatus;
    if (body.trackingNumber !== undefined) data.trackingNumber = body.trackingNumber || null;
    if (body.notes !== undefined) data.notes = body.notes || null;

    // Restock when cancelling a previously non-cancelled order
    if (body.status === 'CANCELLED' && existing.status !== 'CANCELLED') {
      const items = await prisma.orderItem.findMany({ where: { orderId: id } });
      await prisma.$transaction(async (tx) => {
        for (const item of items) {
          if (item.productId) {
            const product = await tx.product.findUnique({ where: { id: item.productId } });
            if (product && !product.isMadeToOrder) {
              await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
            }
          }
        }
        await tx.order.update({ where: { id }, data });
      });
    } else {
      await prisma.order.update({ where: { id }, data });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('admin order update', error);
    return NextResponse.json({ error: 'Could not update the order.' }, { status: 500 });
  }
}
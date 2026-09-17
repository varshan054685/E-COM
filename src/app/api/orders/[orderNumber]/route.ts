import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  try {
    const user = await requireUser();
    const { orderNumber } = await params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: { orderBy: { createdAt: 'asc' } },
        address: true,
      },
    });
    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }
    return NextResponse.json({
      order: {
        ...order,
        subtotal: order.subtotal.toNumber(),
        discount: order.discount.toNumber(),
        shipping: order.shipping.toNumber(),
        total: order.total.toNumber(),
        items: order.items.map((i) => ({
          ...i,
          unitPrice: i.unitPrice.toNumber(),
          totalPrice: i.totalPrice.toNumber(),
        })),
        payments: order.payments.map((p) => ({
          amount: p.amount.toNumber(),
          status: p.status,
          method: p.method,
          createdAt: p.createdAt,
        })),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to load order.' }, { status: 500 });
  }
}
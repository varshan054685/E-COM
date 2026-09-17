import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await requireUser();
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { select: { productName: true, productImage: true, quantity: true, totalPrice: true } },
        _count: { select: { items: true } },
      },
    });
    return NextResponse.json({
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        total: o.total.toNumber(),
        itemCount: o._count.items,
        previewImage: o.items[0]?.productImage ?? null,
        itemNames: o.items.slice(0, 2).map((i) => i.productName),
        createdAt: o.createdAt,
      })),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to load orders.' }, { status: 500 });
  }
}
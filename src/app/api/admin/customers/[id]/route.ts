import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, role: true, createdAt: true,
      _count: { select: { orders: true, customOrders: true, wishlist: true } },
    },
  });
  if (!user) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });

  const [orders, customOrders, addresses] = await Promise.all([
    prisma.order.findMany({ where: { userId: id }, orderBy: { createdAt: 'desc' }, include: { items: true } }),
    prisma.customOrder.findMany({ where: { userId: id }, orderBy: { createdAt: 'desc' } }),
    prisma.address.findMany({ where: { userId: id } }),
  ]);

  return NextResponse.json({
    customer: user,
    orders: orders.map((o) => ({
      orderNumber: o.orderNumber, status: o.status, total: o.total.toNumber(), createdAt: o.createdAt, itemCount: o.items.length,
    })),
    customOrders: customOrders.map((c) => ({
      orderNumber: c.orderNumber, creationType: c.creationType, status: c.status, quoteAmount: c.quoteAmount?.toNumber() ?? null, createdAt: c.createdAt,
    })),
    addresses,
  });
}
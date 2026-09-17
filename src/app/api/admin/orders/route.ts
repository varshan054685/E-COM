import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const status = searchParams.get('status') || undefined;

  const orders = await prisma.order.findMany({
    where: {
      ...(q ? { OR: [{ orderNumber: { contains: q } }, { customerName: { contains: q } }, { customerEmail: { contains: q } }] } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { items: { select: { id: true } } },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id, orderNumber: o.orderNumber, customerName: o.customerName, customerEmail: o.customerEmail,
      status: o.status, paymentStatus: o.paymentStatus, total: o.total.toNumber(), itemCount: o.items.length, createdAt: o.createdAt,
    })),
  });
}
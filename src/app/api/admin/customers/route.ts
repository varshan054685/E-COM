import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  const where = q
    ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] }
    : {};

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true, name: true, email: true, phone: true, role: true, createdAt: true,
      _count: { select: { orders: true, customOrders: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const userIds = users.map((u) => u.id);
  const revenueAgg = await prisma.order.groupBy({
    by: ['userId'],
    where: { userId: { in: userIds }, paymentStatus: 'PAID' },
    _sum: { total: true },
  });
  const revenueMap = new Map(revenueAgg.map((r) => [r.userId, r._sum.total?.toNumber() ?? 0]));

  return NextResponse.json({
    customers: users.map((u) => ({
      id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role,
      createdAt: u.createdAt, orderCount: u._count.orders, customOrderCount: u._count.customOrders,
      totalSpent: revenueMap.get(u.id) ?? 0,
    })),
  });
}
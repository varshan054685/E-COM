import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 29 * 864e5);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [
    revenueAgg,
    paidOrders,
    totalOrders,
    totalCustomers,
    newCustomers,
    productsCount,
    lowStock,
    pendingCustom,
    pendingReviews,
    recentOrders,
    recentCustom,
    statusGroups,
    salesRows,
    topProducts,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true, discount: true }, where: { paymentStatus: 'PAID' } }),
    prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: thirtyDaysAgo } } }),
    prisma.product.count({ where: { status: 'ACTIVE' } }),
    prisma.product.findMany({
      where: { status: 'ACTIVE', isMadeToOrder: false, stock: { lte: 5 } },
      select: { id: true, name: true, stock: true, lowStockThreshold: true },
      orderBy: { stock: 'asc' },
      take: 8,
    }),
    prisma.customOrder.count({ where: { status: { in: ['NEW_REQUEST', 'REQUIREMENTS_CONFIRMED'] } } }),
    prisma.review.count({ where: { approved: false } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { orderNumber: true, customerName: true, total: true, status: true, paymentStatus: true, createdAt: true },
    }),
    prisma.customOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { orderNumber: true, customerName: true, creationType: true, status: true, createdAt: true },
    }),
    prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: 'PAID' },
      select: { total: true, createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ]);

  // Build a 30-day sales series
  const series: { date: string; revenue: number; orders: number }[] = [];
  const byDay = new Map<string, { revenue: number; orders: number }>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo.getTime() + i * 864e5);
    const key = d.toISOString().slice(0, 10);
    byDay.set(key, { revenue: 0, orders: 0 });
  }
  for (const row of salesRows) {
    const key = row.createdAt.toISOString().slice(0, 10);
    const entry = byDay.get(key);
    if (entry) {
      entry.revenue += row.total.toNumber();
      entry.orders += 1;
    }
  }
  for (const [date, v] of byDay) series.push({ date, ...v });

  const todayOrders = await prisma.order.count({ where: { createdAt: { gte: startOfToday } } });

  return NextResponse.json({
    revenue: revenueAgg._sum.total?.toNumber() ?? 0,
    discount: revenueAgg._sum.discount?.toNumber() ?? 0,
    paidOrders,
    totalOrders,
    todayOrders,
    totalCustomers,
    newCustomers,
    productsCount,
    pendingCustom,
    pendingReviews,
    lowStock,
    recentOrders: recentOrders.map((o) => ({ ...o, total: o.total.toNumber() })),
    recentCustom,
    statusBreakdown: statusGroups.map((s) => ({ status: s.status, count: s._count._all })),
    salesSeries: series,
    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      name: p.productName,
      quantity: p._sum.quantity ?? 0,
      revenue: p._sum.totalPrice?.toNumber() ?? 0,
    })),
  });
}
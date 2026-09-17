import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE', isMadeToOrder: false },
    select: {
      id: true, name: true, sku: true, stock: true, lowStockThreshold: true,
      _count: { select: { cartItems: true, wishlists: true } },
      orderItems: { select: { quantity: true, unitPrice: true, order: { select: { paymentStatus: true } } } },
    },
    orderBy: { stock: 'asc' },
  });

  const rows = products.map((p) => {
    const sold = p.orderItems
      .filter((oi) => oi.order.paymentStatus === 'PAID')
      .reduce((acc, oi) => acc + oi.quantity, 0);
    const low = p.stock <= p.lowStockThreshold;
    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      low,
      inCarts: p._count.cartItems,
      inWishlists: p._count.wishlists,
      sold,
    };
  });

  return NextResponse.json({
    inventory: rows,
    lowStock: rows.filter((r) => r.low),
  });
}
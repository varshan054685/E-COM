import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const q = searchParams.get('q')?.trim();

  const rows = await prisma.customOrder.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q ? { OR: [{ orderNumber: { contains: q } }, { customerName: { contains: q } }, { customerEmail: { contains: q } }] } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
  });

  return NextResponse.json({
    requests: rows.map((r) => ({
      id: r.id, orderNumber: r.orderNumber, customerName: r.customerName, customerEmail: r.customerEmail,
      customerPhone: r.customerPhone, creationType: r.creationType, status: r.status, paymentStatus: r.paymentStatus,
      quoteAmount: r.quoteAmount?.toNumber() ?? null, deadline: r.deadline, createdAt: r.createdAt,
      image: r.images[0]?.url ?? null,
    })),
  });
}
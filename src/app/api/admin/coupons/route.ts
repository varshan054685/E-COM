import { NextResponse } from 'next/server';
import { requireAdminApi, num, int } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({
    coupons: coupons.map((c) => ({
      id: c.id, code: c.code, type: c.type, value: c.value.toNumber(), minOrderValue: c.minOrderValue.toNumber(),
      maxDiscount: c.maxDiscount?.toNumber() ?? null, expiresAt: c.expiresAt, usageLimit: c.usageLimit,
      usageCount: c.usageCount, active: c.active, createdAt: c.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  try {
    const body = await request.json();
    const code = String(body.code || '').trim().toUpperCase();
    if (!code) return NextResponse.json({ error: 'Coupon code is required.' }, { status: 400 });
    if (await prisma.coupon.findUnique({ where: { code } })) {
      return NextResponse.json({ error: 'This code already exists.' }, { status: 409 });
    }
    const coupon = await prisma.coupon.create({
      data: {
        code,
        type: body.type === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
        value: num(body.value, 0),
        minOrderValue: num(body.minOrderValue, 0),
        maxDiscount: body.maxDiscount ? num(body.maxDiscount) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        usageLimit: body.usageLimit ? int(body.usageLimit) : null,
        active: body.active !== false,
      },
    });
    return NextResponse.json({ coupon: { ...coupon, value: coupon.value.toNumber(), minOrderValue: coupon.minOrderValue.toNumber(), maxDiscount: coupon.maxDiscount?.toNumber() ?? null } });
  } catch (error) {
    console.error('admin coupon create', error);
    return NextResponse.json({ error: 'Could not create coupon.' }, { status: 500 });
  }
}
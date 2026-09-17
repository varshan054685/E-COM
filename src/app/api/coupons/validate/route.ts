import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyCoupon } from '@/lib/commerce';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body as { code?: string; subtotal?: number };
    if (!code || typeof subtotal !== 'number' || subtotal <= 0) {
      return NextResponse.json({ error: 'Enter a coupon code.' }, { status: 400 });
    }
    const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: 'This coupon is not valid.' }, { status: 400 });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired.' }, { status: 400 });
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit.' }, { status: 400 });
    }
    const applied = applyCoupon(subtotal, {
      type: coupon.type,
      value: coupon.value.toNumber(),
      maxDiscount: coupon.maxDiscount?.toNumber() ?? null,
      minOrderValue: coupon.minOrderValue.toNumber(),
    });
    if (applied.discount <= 0) {
      return NextResponse.json(
        { error: `Minimum order of ${'₹' + coupon.minOrderValue.toNumber().toLocaleString('en-IN')} required for this coupon.` },
        { status: 400 },
      );
    }
    return NextResponse.json({ discount: applied.discount, code: coupon.code, valid: true });
  } catch {
    return NextResponse.json({ error: 'Could not validate coupon.' }, { status: 500 });
  }
}
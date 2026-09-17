import { NextResponse } from 'next/server';
import { requireAdminApi, num, int } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (typeof body.code === 'string') data.code = body.code.trim().toUpperCase();
    if (body.type !== undefined) data.type = body.type === 'FIXED' ? 'FIXED' : 'PERCENTAGE';
    if (body.value !== undefined) data.value = num(body.value);
    if (body.minOrderValue !== undefined) data.minOrderValue = num(body.minOrderValue);
    if (body.maxDiscount !== undefined) data.maxDiscount = body.maxDiscount === '' || body.maxDiscount === null ? null : num(body.maxDiscount);
    if (body.expiresAt !== undefined) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.usageLimit !== undefined) data.usageLimit = body.usageLimit === '' || body.usageLimit === null ? null : int(body.usageLimit);
    if (body.active !== undefined) data.active = Boolean(body.active);
    const coupon = await prisma.coupon.update({ where: { id }, data });
    return NextResponse.json({ coupon: { ...coupon, value: coupon.value.toNumber(), minOrderValue: coupon.minOrderValue.toNumber(), maxDiscount: coupon.maxDiscount?.toNumber() ?? null } });
  } catch {
    return NextResponse.json({ error: 'Could not update coupon.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDbCart, mapCartLine } from '@/lib/cart';

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const items: { productId?: string; size?: string | null; color?: string | null; quantity?: number }[] =
      Array.isArray(body.items) ? body.items : [];

    for (const raw of items) {
      const productId = String(raw.productId || '');
      if (!productId) continue;
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product || product.status !== 'ACTIVE' || product.stock < 1) continue;
      const size = raw.size ?? null;
      const color = raw.color ?? null;
      const quantity = Math.max(1, Math.min(10, Number(raw.quantity) || 1));

      const cart = await getDbCart(user.id);
      const existing = cart.items.find(
        (i) => i.productId === productId && (i.size ?? null) === size && (i.color ?? null) === color,
      );
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: Math.min(existing.quantity + quantity, product.stock) },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, productId, size, color, quantity: Math.min(quantity, product.stock) },
        });
      }
    }

    const updated = await getDbCart(user.id);
    return NextResponse.json({ items: updated.items.map(mapCartLine) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to merge your bag.' }, { status: 500 });
  }
}
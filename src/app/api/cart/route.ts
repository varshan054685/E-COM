import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDbCart, mapCartLine } from '@/lib/cart';

export async function GET() {
  try {
    const user = await requireUser();
    const cart = await getDbCart(user.id);
    return NextResponse.json({ items: cart.items.map(mapCartLine) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ items: [] });
    }
    return NextResponse.json({ error: 'Unable to load your bag.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const productId = String(body.productId || '');
    const size = body.size ? String(body.size) : null;
    const color = body.color ? String(body.color) : null;
    const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));

    if (!productId) {
      return NextResponse.json({ error: 'Missing product' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'This piece is no longer available.' }, { status: 404 });
    }
    const madeToOrder = product.isMadeToOrder; // made-to-order: reserved, not stock-limited

    const cart = await getDbCart(user.id);
    const existing = cart.items.find(
      (i) =>
        i.productId === productId &&
        (i.size ?? null) === size &&
        (i.color ?? null) === color,
    );

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (!madeToOrder && newQty > product.stock) {
        return NextResponse.json({ error: 'This piece is currently low in stock.' }, { status: 409 });
      }
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      if (!madeToOrder && quantity > product.stock) {
        return NextResponse.json({ error: 'This piece is currently low in stock.' }, { status: 409 });
      }
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, size, color, quantity },
      });
    }

    const updated = await getDbCart(user.id);
    return NextResponse.json({ items: updated.items.map(mapCartLine) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in to continue.' }, { status: 401 });
    }
    console.error('cart add error', error);
    return NextResponse.json({ error: 'Unable to update your bag.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await requireUser();
    await prisma.cartItem.deleteMany({ where: { cart: { userId: user.id } } });
    return NextResponse.json({ items: [] });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ items: [] });
    }
    return NextResponse.json({ error: 'Unable to clear your bag.' }, { status: 500 });
  }
}
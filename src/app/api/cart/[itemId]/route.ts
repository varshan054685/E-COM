import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDbCart, mapCartLine } from '@/lib/cart';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const user = await requireUser();
    const { itemId } = await params;
    const body = await request.json();
    const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true, cart: true },
    });
    if (!item || !item.cart || item.cart.userId !== user.id) {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }
    if (quantity > item.product.stock) {
      return NextResponse.json({ error: 'This piece is currently low in stock.' }, { status: 409 });
    }

    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    const updated = await getDbCart(user.id);
    return NextResponse.json({ items: updated.items.map(mapCartLine) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to update your bag.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const user = await requireUser();
    const { itemId } = await params;
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });
    if (!item || !item.cart || item.cart.userId !== user.id) {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }
    await prisma.cartItem.delete({ where: { id: itemId } });
    const updated = await getDbCart(user.id);
    return NextResponse.json({ items: updated.items.map(mapCartLine) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to update your bag.' }, { status: 500 });
  }
}
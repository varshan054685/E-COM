import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const user = await requireUser();
    const { productId } = await params;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    await prisma.wishlist.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      create: { userId: user.id, productId },
      update: {},
    });
    const rows = await prisma.wishlist.findMany({
      where: { userId: user.id },
      select: { productId: true },
    });
    return NextResponse.json({ ids: rows.map((r) => r.productId) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to update wishlist.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const user = await requireUser();
    const { productId } = await params;
    await prisma.wishlist.deleteMany({ where: { userId: user.id, productId } });
    const rows = await prisma.wishlist.findMany({
      where: { userId: user.id },
      select: { productId: true },
    });
    return NextResponse.json({ ids: rows.map((r) => r.productId) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to update wishlist.' }, { status: 500 });
  }
}
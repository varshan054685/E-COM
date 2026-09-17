import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const ids: string[] = Array.isArray(body.ids)
      ? body.ids.filter((id: unknown) => typeof id === 'string')
      : [];

    if (ids.length > 0) {
      const existing = await prisma.wishlist.findMany({
        where: { userId: user.id, productId: { in: ids } },
        select: { productId: true },
      });
      const existingSet = new Set(existing.map((r) => r.productId));
      const toAdd = ids.filter((id) => !existingSet.has(id));
      if (toAdd.length > 0) {
        // Validate product ids against the catalogue before writing.
        const valid = await prisma.product.findMany({
          where: { id: { in: toAdd } },
          select: { id: true },
        });
        await prisma.wishlist.createMany({
          data: valid.map((p) => ({ userId: user.id, productId: p.id })),
        });
      }
    }

    const rows = await prisma.wishlist.findMany({
      where: { userId: user.id },
      select: { productId: true },
    });
    return NextResponse.json({ ids: rows.map((r) => r.productId) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to sync wishlist.' }, { status: 500 });
  }
}
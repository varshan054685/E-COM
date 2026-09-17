import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await prisma.wishlist.findMany({
      where: { userId: user.id },
      select: { productId: true },
    });
    return NextResponse.json({ ids: rows.map((r) => r.productId) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ ids: [] });
    }
    return NextResponse.json({ error: 'Unable to load wishlist.' }, { status: 500 });
  }
}
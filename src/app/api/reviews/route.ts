import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Please sign in to review.' }, { status: 401 });

    const body = await request.json();
    const productId = String(body.productId || '');
    const rating = Number(body.rating);
    const title = String(body.title || '').slice(0, 120);
    const content = String(body.content || '').trim().slice(0, 2000);

    if (!productId || !content || content.length < 10) {
      return NextResponse.json({ error: 'Please write a slightly longer review.' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });
    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this piece.' }, { status: 409 });
    }

    await prisma.review.create({
      data: { userId: user.id, productId, rating, title: title || null, content },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unable to submit your review.' }, { status: 500 });
  }
}
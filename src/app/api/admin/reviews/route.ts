import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { searchParams } = new URL(request.url);
  const approved = searchParams.get('approved');
  const q = searchParams.get('q')?.trim();

  const reviews = await prisma.review.findMany({
    where: {
      ...(approved ? { approved: approved === 'true' } : {}),
      ...(q
        ? { OR: [{ content: { contains: q } }, { product: { name: { contains: q } } }, { user: { name: { contains: q } } }] }
        : {}),
    },
    include: {
      product: { select: { id: true, name: true, slug: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id, rating: r.rating, title: r.title, content: r.content, approved: r.approved, createdAt: r.createdAt,
      productName: r.product.name,
      productSlug: r.product.slug,
      productImage: r.product.images[0]?.url ?? null,
      userName: r.user.name,
    })),
  });
}
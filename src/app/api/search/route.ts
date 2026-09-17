import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const searchable = {
  select: {
    id: true,
    slug: true,
    name: true,
    price: true,
    compareAtPrice: true,
    stock: true,
    isMadeToOrder: true,
    images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
    category: { select: { slug: true, name: true } },
  },
  where: { status: 'ACTIVE' as const },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const limit = Math.min(10, Math.max(1, Number(searchParams.get('limit')) || 8));

  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    ...searchable,
    where: {
      status: 'ACTIVE',
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
        { craftType: { contains: q } },
        { material: { contains: q } },
        { category: { name: { contains: q } } },
        { category: { slug: { contains: q } } },
      ],
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price.toNumber(),
      compareAtPrice: p.compareAtPrice?.toNumber() ?? null,
      categorySlug: p.category?.slug ?? null,
      categoryName: p.category?.name ?? null,
      images: p.images.map((i) => i.url),
      stock: p.stock,
      isMadeToOrder: p.isMadeToOrder,
      badge: null,
      reviewCount: 0,
      ratingAmount: null,
    })),
  });
}
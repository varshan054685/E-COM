import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { splitList } from '@/lib/format';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: { select: { slug: true, name: true } },
    },
  });
  if (!product || product.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price.toNumber(),
      craftType: product.craftType,
      colors: splitList(product.colors),
      images: product.images.map((i) => i.url),
      categoryName: product.category?.name ?? null,
      isMadeToOrder: product.isMadeToOrder,
    },
  });
}
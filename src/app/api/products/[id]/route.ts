import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { splitList } from '@/lib/format';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: { select: { slug: true, name: true } },
      reviews: { where: { approved: true }, select: { rating: true } },
    },
  });
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const reviewCount = product.reviews.length;
  const productJson = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber() ?? null,
    material: product.material,
    craftType: product.craftType,
    productionTime: product.productionTime,
    stock: product.stock,
    isMadeToOrder: product.isMadeToOrder,
    sizes: splitList(product.sizes),
    colors: splitList(product.colors),
    categorySlug: product.category?.slug ?? null,
    categoryName: product.category?.name ?? null,
    images: product.images.map((i) => i.url),
    ratingAmount: reviewCount
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
      : null,
    reviewCount,
  };
  return NextResponse.json({ product: productJson });
}
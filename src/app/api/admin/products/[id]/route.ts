import { NextResponse } from 'next/server';
import { requireAdminApi, slugify, num, int } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

  return NextResponse.json({
    product: {
      ...product,
      price: product.price.toNumber(),
      compareAtPrice: product.compareAtPrice?.toNumber() ?? null,
      images: product.images.map((i) => i.url),
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;

  try {
    const body = await request.json();
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

    const data: Record<string, unknown> = {};
    const strings = ['name', 'description', 'sku', 'material', 'craftType', 'careInstructions', 'shippingInfo', 'productionTime', 'sizes', 'colors', 'tags', 'seoTitle', 'seoDescription'];
    for (const key of strings) {
      if (typeof body[key] === 'string') data[key] = body[key].trim();
    }
    if (body.sku !== undefined) data.sku = body.sku ? String(body.sku).trim() : null;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;
    if (body.price !== undefined) data.price = num(body.price);
    if (body.compareAtPrice !== undefined) data.compareAtPrice = body.compareAtPrice === '' || body.compareAtPrice === null ? null : num(body.compareAtPrice);
    if (body.stock !== undefined) data.stock = int(body.stock, existing.stock);
    if (body.lowStockThreshold !== undefined) data.lowStockThreshold = int(body.lowStockThreshold, existing.lowStockThreshold);
    if (body.status !== undefined) data.status = body.status === 'DRAFT' ? 'DRAFT' : 'ACTIVE';
    for (const flag of ['isFeatured', 'isNew', 'isBestseller', 'isLimited', 'isMadeToOrder']) {
      if (body[flag] !== undefined) data[flag] = Boolean(body[flag]);
    }
    if (body.slug !== undefined && body.slug) {
      const s = slugify(body.slug);
      if (s && s !== existing.slug && !(await prisma.product.findUnique({ where: { slug: s } }))) data.slug = s;
    }

    await prisma.product.update({ where: { id }, data });

    if (Array.isArray(body.images)) {
      const urls: string[] = body.images.filter((u: unknown) => typeof u === 'string' && u);
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: urls.map((url, i) => ({ productId: id, url, sortOrder: i })),
      });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: 'asc' } } },
    });
    return NextResponse.json({
      product: product
        ? { ...product, price: product.price.toNumber(), compareAtPrice: product.compareAtPrice?.toNumber() ?? null, images: product.images.map((i) => i.url) }
        : null,
    });
  } catch (error) {
    console.error('admin product update', error);
    return NextResponse.json({ error: 'Could not update the product.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not delete the product.' }, { status: 500 });
  }
}
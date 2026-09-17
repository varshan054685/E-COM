import { NextResponse } from 'next/server';
import { requireAdminApi, slugify, num, int } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

function serializeProduct(p: {
  id: string; name: string; slug: string; description: string; price: unknown; compareAtPrice: unknown; sku: string | null;
  material: string | null; craftType: string | null; productionTime: string | null; categoryId: string | null; sizes: string | null;
  colors: string | null; tags: string | null; stock: number; lowStockThreshold: number; status: string; isFeatured: boolean;
  isNew: boolean; isBestseller: boolean; isLimited: boolean; isMadeToOrder: boolean; createdAt: Date;
  category?: { name: string } | null;
  images?: { url: string; alt: string | null; sortOrder: number }[];
}) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice == null ? null : Number(p.compareAtPrice),
    sku: p.sku,
    material: p.material,
    craftType: p.craftType,
    productionTime: p.productionTime,
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? null,
    sizes: p.sizes,
    colors: p.colors,
    tags: p.tags,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
    status: p.status,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    isBestseller: p.isBestseller,
    isLimited: p.isLimited,
    isMadeToOrder: p.isMadeToOrder,
    createdAt: p.createdAt,
    images: (p.images ?? []).map((i) => i.url),
  };
}

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const categoryId = searchParams.get('categoryId') || undefined;
  const status = searchParams.get('status') || undefined;

  const products = await prisma.product.findMany({
    where: {
      ...(q ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }] } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(status ? { status } : {}),
    },
    include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products: products.map(serializeProduct) });
}

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    if (!name) return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });

    const baseSlug = slugify(body.slug || name);
    let slug = baseSlug || `product-${Date.now()}`;
    let suffix = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const images: string[] = Array.isArray(body.images) ? body.images.filter((u: unknown) => typeof u === 'string' && u) : [];

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: String(body.description || '').trim() || 'Handcrafted by JGTHS.',
        price: num(body.price),
        compareAtPrice: body.compareAtPrice ? num(body.compareAtPrice) : null,
        sku: body.sku ? String(body.sku).trim() : null,
        material: body.material || null,
        craftType: body.craftType || null,
        careInstructions: body.careInstructions || null,
        shippingInfo: body.shippingInfo || null,
        productionTime: body.productionTime || null,
        categoryId: body.categoryId || null,
        sizes: body.sizes || null,
        colors: body.colors || null,
        tags: body.tags || null,
        stock: int(body.stock, 0),
        lowStockThreshold: int(body.lowStockThreshold, 5),
        status: body.status === 'DRAFT' ? 'DRAFT' : 'ACTIVE',
        isFeatured: Boolean(body.isFeatured),
        isNew: Boolean(body.isNew),
        isBestseller: Boolean(body.isBestseller),
        isLimited: Boolean(body.isLimited),
        isMadeToOrder: Boolean(body.isMadeToOrder),
        images: { create: images.map((url: string, i: number) => ({ url, sortOrder: i })) },
      },
      include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: 'asc' } } },
    });

    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    console.error('admin product create', error);
    return NextResponse.json({ error: 'Could not create the product.' }, { status: 500 });
  }
}
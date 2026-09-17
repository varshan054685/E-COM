import { NextResponse } from 'next/server';
import { requireAdminApi, slugify, int } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id, slug: c.slug, name: c.name, description: c.description, image: c.image,
      displayOrder: c.displayOrder, featured: c.featured, productCount: c._count.products,
    })),
  });
}

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    if (!name) return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    let slug = slugify(body.slug || name);
    let n = 1;
    while (await prisma.category.findUnique({ where: { slug } })) slug = `${slugify(body.slug || name)}-${n++}`;
    const category = await prisma.category.create({
      data: {
        name, slug,
        description: body.description || null,
        image: body.image || null,
        displayOrder: int(body.displayOrder, 0),
        featured: Boolean(body.featured),
      },
    });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: 'Could not create category.' }, { status: 500 });
  }
}
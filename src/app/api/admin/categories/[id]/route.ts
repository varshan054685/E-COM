import { NextResponse } from 'next/server';
import { requireAdminApi, int } from '@/lib/api-admin';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  try {
    const body = await request.json();
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(typeof body.name === 'string' ? { name: body.name.trim() } : {}),
        ...(body.description !== undefined ? { description: body.description || null } : {}),
        ...(body.image !== undefined ? { image: body.image || null } : {}),
        ...(body.displayOrder !== undefined ? { displayOrder: int(body.displayOrder, 0) } : {}),
        ...(body.featured !== undefined ? { featured: Boolean(body.featured) } : {}),
      },
    });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: 'Could not update category.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { id } = await params;
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json({ error: `This category still has ${count} product(s). Move them first.` }, { status: 409 });
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
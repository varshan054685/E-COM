import { prisma } from '@/lib/prisma';
import type { CartLine } from '@/types';

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
          category: true,
        },
      },
      variant: true,
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

export async function getDbCart(userId: string) {
  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: cartInclude,
  });
  return cart;
}

export function mapCartLine(item: {
  id: string;
  productId: string;
  size: string | null;
  color: string | null;
  quantity: number;
  product: {
    slug: string;
    name: string;
    price: { toNumber: () => number };
    compareAtPrice: { toNumber: () => number } | null;
    stock: number;
    images: { url: string }[];
    category: { slug: string } | null;
  };
}): CartLine {
  return {
    id: item.id,
    productId: item.productId,
    productSlug: item.product.slug,
    productName: item.product.name,
    image: item.product.images[0]?.url ?? null,
    price: item.product.price.toNumber(),
    compareAtPrice: item.product.compareAtPrice
      ? item.product.compareAtPrice.toNumber()
      : null,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    stock: item.product.stock,
    categorySlug: item.product.category?.slug ?? null,
  };
}
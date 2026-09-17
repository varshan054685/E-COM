import { prisma } from '@/lib/prisma';
import { splitList } from '@/lib/format';
import type { ProductCardData, ProductBadge } from '@/types';

const activeWhere = { status: 'ACTIVE' as const };

export function badgeFor(p: {
  isNew: boolean;
  isBestseller: boolean;
  isLimited: boolean;
  isMadeToOrder: boolean;
}): ProductBadge | null {
  if (p.isLimited) return { type: 'LIMITED', label: 'Limited' };
  if (p.isNew) return { type: 'NEW', label: 'New' };
  if (p.isBestseller) return { type: 'BESTSELLER', label: 'Bestseller' };
  if (p.isMadeToOrder) return { type: 'MADE_TO_ORDER', label: 'Made to Order' };
  return null;
}

export type ProductFilter = {
  q?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  craftType?: string;
  occasion?: string;
  availability?: 'in-stock' | 'made-to-order';
  featuredOnly?: boolean;
  sort?: string;
  tag?: string;
};

export async function getProducts(filter: ProductFilter = {}, limit?: number) {
  const where: Record<string, unknown> = { ...activeWhere };

  if (filter.q) {
    where.OR = [
      { name: { contains: filter.q } },
      { description: { contains: filter.q } },
      { tags: { contains: filter.q } },
      { craftType: { contains: filter.q } },
      { material: { contains: filter.q } },
      { category: { name: { contains: filter.q } } },
    ];
  }
  if (filter.categorySlug) {
    where.category = { slug: filter.categorySlug };
  }
  if (filter.tag) {
    where.tags = { contains: filter.tag };
  }
  if (filter.craftType) {
    where.tags = { contains: filter.craftType };
  }
  if (filter.occasion) {
    where.tags = { contains: filter.occasion };
  }
  if (typeof filter.minPrice === 'number' || typeof filter.maxPrice === 'number') {
    const price: Record<string, number> = {};
    if (typeof filter.minPrice === 'number') price.gte = filter.minPrice;
    if (typeof filter.maxPrice === 'number') price.lte = filter.maxPrice;
    where.price = price;
  }
  if (filter.sizes?.length) {
    where.OR = [
      ...(filter.q
        ? (where.OR as Record<string, unknown>[])
        : []),
      ...filter.sizes.map((s) => ({ sizes: { contains: s } })),
    ];
  }
  if (filter.colors?.length) {
    const colorWhere: Record<string, unknown>[] = filter.colors.map((c) => ({
      colors: { contains: c },
    }));
    where.AND = [...(where.AND ? (where.AND as Record<string, unknown>[]) : []), ...colorWhere];
  }
  if (filter.availability === 'in-stock') {
    where.stock = { gt: 0 };
  }
  if (filter.availability === 'made-to-order') {
    where.isMadeToOrder = true;
  }
  if (filter.featuredOnly) {
    where.isFeatured = true;
  }

  let orderBy: Record<string, string> | Record<string, string>[] = { createdAt: 'desc' };
  switch (filter.sort) {
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'name-asc':
      orderBy = { name: 'asc' };
      break;
    case 'popular':
      orderBy = { isBestseller: 'desc' };
      break;
    case 'featured':
    default:
      orderBy = [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ];
  }

  const rows = await prisma.product.findMany({
    where: where as never,
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 2 },
      category: { select: { slug: true, name: true } },
      _count: { select: { reviews: { where: { approved: true } } } },
      reviews: { where: { approved: true }, select: { rating: true } },
    },
    orderBy: orderBy as never,
    take: limit,
  });

  const products: ProductCardData[] = rows.map((p) => {
    const reviewCount = p._count.reviews;
    const ratingAmount = reviewCount
      ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
      : null;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price.toNumber(),
      compareAtPrice: p.compareAtPrice?.toNumber() ?? null,
      categorySlug: p.category?.slug ?? null,
      categoryName: p.category?.name ?? null,
      images: p.images.map((i) => i.url),
      badge: badgeFor(p),
      stock: p.stock,
      isMadeToOrder: p.isMadeToOrder,
      ratingAmount,
      reviewCount,
    };
  });

  return products;
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
      reviews: {
        where: { approved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!product) return null;
  const reviewCount = product.reviews.length;
  const ratingAmount = reviewCount
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
    : null;
  return {
    ...product,
    priceNumber: product.price.toNumber(),
    compareAtPriceNumber: product.compareAtPrice?.toNumber() ?? null,
    sizes: splitList(product.sizes),
    colors: splitList(product.colors),
    tags: splitList(product.tags),
    ratingAmount,
    reviewCount,
    badge: badgeFor(product),
  };
}

export async function getRelatedProducts(slug: string, categoryId: string | null, excludeId: string, limit = 4) {
  return getProducts(
    { categorySlug: categoryId ?? undefined, sort: 'featured' },
    limit,
  );
}

export async function getProductFacets() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: activeWhere,
      select: { craftType: true, tags: true, sizes: true, colors: true },
    }),
    prisma.category.findMany({ select: { slug: true, name: true }, orderBy: { displayOrder: 'asc' } }),
  ]);
  const sizes = new Set<string>();
  const colors = new Set<string>();
  const crafts = new Set<string>();
  const occasions = new Set<string>(['Wedding', 'Engagement', 'Festive', 'Casual Wear']);
  products.forEach((p) => {
    splitList(p.sizes).forEach((s) => sizes.add(s));
    splitList(p.colors).forEach((c) => colors.add(c));
    if (p.craftType) crafts.add(p.craftType);
    (p.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => ['aari', 'bridal', 'zari', 'embroidered', 'handloom', 'festive', 'wedding'].includes(t.toLowerCase()))
      .forEach(() => {});
  });
  products.forEach((p) => {
    (p.tags || '')
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .forEach((t) => {
        if (['wedding', 'engagement', 'reception', 'festive', 'casual', 'pooja'].includes(t))
          occasions.add(t.charAt(0).toUpperCase() + t.slice(1));
      });
  });
  return {
    categories,
    sizes: [...sizes],
    colors: [...colors],
    crafts: [...crafts],
    occasions: [...occasions],
  };
}
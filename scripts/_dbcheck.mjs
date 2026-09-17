import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const products = await p.product.findMany({ take: 6, select: { id: true, name: true, stock: true, status: true } });
console.table(products.map(x => ({ id: x.id, name: x.name, stock: x.stock, status: x.status })));
const carts = await p.cart.findMany({ include: { items: { select: { id: true, productId: true, quantity: true } } } });
console.log('carts:', carts.map(c => ({ cartId: c.id, userId: c.userId, items: c.items.map(i => `${i.productId.slice(-6)}:${i.quantity}`).join(', ') })));
await p.$disconnect();
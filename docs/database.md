# Database

Prisma schema: [`prisma/schema.prisma`](../prisma/schema.prisma). SQLite for development; the schema is Postgres-compatible (switch `datasource db.provider` and `DATABASE_URL` for production).

## Entity map

```
User ─┬─ Address[]            (cascade)
      ├─ Order[]              (set null)
      ├─ Wishlist[]           (unique userId+productId)
      ├─ Cart (1:1) ── CartItem[]
      ├─ MeasurementProfile[] ── CustomOrder[]
      ├─ Review[]             (unique userId+productId)
      ├─ CustomOrder[]
      └─ Notification[]

Category ── Product[]
Product  ─┬─ ProductImage[]   (ordered by sortOrder)
          ├─ ProductVariant[] (sku, size, color, stock)
          ├─ Review[]
          ├─ Wishlist[]
          ├─ CartItem[]
          └─ OrderItem[]

Order ─┬─ OrderItem[]   (denormalized name/image/price for history)
       └─ Payment[]     (razorpay ids, signature, method, status)

CustomOrder ─┬─ CustomOrderImage[]
             ├─ Payment[]
             ├─ MeasurementProfile? (optional link)
             └─ convertedOrderId → Order
```

## Key design decisions

- **`OrderItem` denormalizes** product name/image/price so order history survives product edits/deletion.
- **`Decimal` money fields** (`price`, `total`, `quoteAmount`, …) — never floats.
- **Stock** lives on `Product` (simple shelf stock) and `ProductVariant` (per-variant, with `reserved`). Made-to-order products hold no stock.
- **`SiteContent`** is a flexible key/value store (hero text, story images, newsletter + contact-form intake entries).
- **Indexes**: `Order(userId, status)`, `Review(productId)`, `CustomOrder(status)`; unique constraints on slugs, emails, order numbers, wishlist/cart pairs.
- **Statuses are strings** validated against `src/lib/constants.ts` / `src/lib/custom-order.ts` (single source of truth for the state machines).

## Seed data (`npm run db:seed`)

Idempotent upserts creating:

- 5 categories (Aari Couture, Designer Blouses, Bridal, Sarees, Custom Creations)
- 17 products with real-style copy, images, variants, badges, and made-to-order flags
- Admin + 2 demo customers, an address, 3 measurement profiles
- 3 coupons (percentage/fixed, limits, expiry)
- 1 demo order with paid payment, 2 demo custom orders (quote sent / new request)
- 1 approved review, 3 testimonials, default site content

Demo credentials are printed at the end of the seed run.

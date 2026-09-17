# JGTHS Designer Boutique & Aari Couture — E-Commerce Platform

A production-quality premium fashion e-commerce platform for **JGTHS Designer Boutique & Aari Couture**, Coimbatore — combining Indian craftsmanship, Aari embroidery, bridal couture, and a full custom-couture workflow.

> Indian craftsmanship × modern luxury × personalized couture

---

## Technology Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3 (ivory / charcoal / gold design system), Cormorant Garamond + Inter |
| Motion | Framer Motion (subtle, editorial) |
| Icons | Lucide React |
| Database | SQLite (dev) via Prisma ORM 6 — Postgres-ready schema |
| Auth | JWT sessions (`jose`) + bcrypt password hashing, httpOnly cookies |
| Payments | Razorpay (order creation + server-side signature verification), mock mode for development |
| Validation | Server-side on every API route; totals always recalculated from the database |

---

## Quick Start

```bash
npm install          # also runs prisma generate
cp .env.example .env # fill in values (see below)
npm run db:push      # create/sync the database
npm run db:seed      # seed categories, 17 products, users, orders, coupons
npm run dev          # http://localhost:3000
```

### Environment variables (`.env`)

See `.env.example`. Keys:

- `DATABASE_URL` — SQLite file URL for dev (`file:./dev.db`)
- `AUTH_SECRET` — random string used to sign session JWTs
- `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` — site origin (used for SEO metadata, sitemap)
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — when absent, checkout runs in **mock payment mode** (dev-friendly, clearly marked)
- `WHATSAPP_NUMBER` — boutique WhatsApp in international format, no `+`
- `UPLOAD_DIR` — local upload folder for custom-order reference images

### Demo credentials (seeded)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@jgthscouture.in` | `admin123` |
| Customer | `priya@example.com` | `customer123` |

> Demo passwords only — change them before any real deployment.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server (port 3000) |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync Prisma schema to the database |
| `npm run db:seed` | Seed demo data (idempotent) |

---

## Architecture

```
src/
  app/                    # App Router pages + API routes
    (storefront)          # /, /shop, /collections/[slug], /product/[slug], /cart,
                          # /checkout, /wishlist, /custom-couture, /about, /aari-atelier,
                          # /contact, /shipping-returns, /privacy, /terms
    account/              # customer account: orders, addresses, measurements, requests
    admin/                # dashboard, products, orders, custom-orders, categories,
                          # inventory, reviews, coupons, customers, content
    api/                  # REST endpoints (see below)
  components/
    ui/                   # Button, Field/Input/Select/Textarea, Dialog, Drawer, Toast…
    layout/               # Navbar, Footer, SearchDialog
    commerce/             # CartProvider, WishlistProvider, AuthProvider, CartDrawer
    product/              # ProductCard/Grid/Gallery, AddToBagPanel, ReviewList…
    account/ admin/       # AccountNav, OrderTimeline, AdminNav
  lib/                    # server-side services: catalog, commerce, cart, auth,
                          # razorpay, seo, site-content, prisma
  types/                  # shared TypeScript types
prisma/                   # schema.prisma + seed.ts
docs/                     # architecture, database, flows, deployment
```

Key principles:

- **Server Components** for data-heavy pages; client components only where interactive.
- **All pricing computed server-side** — client prices are never trusted.
- **Inventory reserved at checkout**, restored on payment failure/cancel; made-to-order items don't hold stock.
- **Server-side validation on every API route**; friendly errors, no raw internals leaked.

---

## API Overview

**Storefront:** `auth` (register/login/logout/me), `products`, `search`, `cart` (+merge), `wishlist` (+sync), `checkout`, `payments/verify`, `orders`, `coupons/validate`, `reviews`, `addresses`, `measurements`, `custom-orders`, `newsletter` (also contact-form intake), `upload`.

**Admin (role-guarded):** `stats`, `products`, `categories`, `inventory`, `orders`, `custom-orders` (incl. quote + convert-to-order), `customers`, `reviews`, `coupons`, `content`.

---

## Database

19 models covering users, addresses, categories, products (+images/variants), wishlist, cart, orders (+items/payments), coupons, reviews, measurement profiles, custom orders (+images), notifications, site content, and testimonials. Full details: [`docs/database.md`](docs/database.md).

---

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — system design and patterns
- [`docs/database.md`](docs/database.md) — schema and relationships
- [`docs/ecommerce-flow.md`](docs/ecommerce-flow.md) — browse → cart → checkout → payment → order
- [`docs/custom-order-flow.md`](docs/custom-order-flow.md) — custom couture lifecycle
- [`docs/deployment.md`](docs/deployment.md) — going live checklist

---

## Deployment

High-level: provision Postgres (`DATABASE_URL`), set real `AUTH_SECRET` + Razorpay keys + `NEXT_PUBLIC_SITE_URL`, run `prisma db push && npm run db:seed`, build and host (Vercel or Node). Full checklist: [`docs/deployment.md`](docs/deployment.md).

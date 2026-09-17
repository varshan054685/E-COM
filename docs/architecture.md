# Architecture

## Overview

The platform is a single Next.js 15 application (App Router) with a clear separation between:

- **Storefront** (`/`) — luxury editorial experience for shoppers
- **Account** (`/account/*`) — customer self-service
- **Admin console** (`/admin/*`) — business operations, deliberately styled as a plain, efficient business tool rather than a fashion page
- **API routes** (`/api/*`) — REST endpoints, all server-validated

## Rendering strategy

| Page type | Strategy | Why |
|---|---|---|
| Home, category, product pages | Server Components, dynamic | Fresh stock/pricing, SEO metadata per entity |
| Cart, checkout, wishlist, custom wizard | Client Components | Interactivity; state in React context + localStorage, synced on login |
| Admin pages | Client Components fetching role-guarded JSON APIs | Table filtering/editing without full page reloads |
| sitemap.xml | Dynamic | Generated from live products/categories |

## Data access

- All database access lives server-side (`src/lib/*` + API routes). Client code never imports Prisma.
- `src/lib/prisma.ts` provides a single PrismaClient instance (dev-safe global singleton).
- Catalog queries (`src/lib/catalog.ts`) encapsulate product filtering/sorting; both pages and APIs reuse them.
- Money is stored as Prisma `Decimal`; serialization to `number` happens at the API boundary.

## Commerce flow (summary)

1. Client adds items to cart (guest cart in localStorage).
2. `POST /api/checkout` recomputes subtotal/discount/shipping/total from DB prices, validates coupon + stock, creates Order (`PENDING_PAYMENT`) + Payment record, creates Razorpay order when keys are configured.
3. Client completes payment; `POST /api/payments/verify` verifies the Razorpay HMAC signature **server-side** (mock signature accepted only in mock mode), then marks order `CONFIRMED`/`PAID` and decrements stock — never on failure.
4. Cancelling a paid order from admin restocks items.

## Custom couture flow (summary)

8-step wizard → `POST /api/custom-orders` (validation of garment type, measurements or standard size, ≤3 reference images) → status machine:
`NEW_REQUEST → REVIEWING → REQUIREMENTS_CONFIRMED → QUOTE_SENT → AWAITING_CUSTOMER → PAYMENT_PENDING → CONFIRMED → IN_PRODUCTION → QUALITY_CHECK → READY → SHIPPED → COMPLETED` (+ `CANCELLED`).

Admin quotes the request, and **convert** creates a real Order linked back via `convertedOrderId`.

## Authentication & authorization

- Sessions are JWTs signed with `AUTH_SECRET` (`jose`), stored in httpOnly cookies.
- Passwords hashed with bcrypt (cost 12).
- `requireUser()` guards customer APIs; `requireAdminApi()` guards every `/api/admin/*` route; `/admin` layout redirects non-admins.

## Content management

Homepage hero text/images, Aari story image, and boutique details come from the `SiteContent` table (`src/lib/site-content.ts`), editable in **Admin → Content**, with safe defaults in code. Testimonials are seeded and rendered from the DB.

## Error handling

- Every API route wraps its body in try/catch and returns friendly JSON errors with correct status codes.
- Raw errors are logged server-side only; customers never see internals.
- UI surfaces errors via toasts, inline field errors, and elegant empty states.

## Performance & accessibility

- `next/image` everywhere with `sizes`; hero priority; hover-transition second images preloaded only on cards.
- Server Components keep client JS small (First Load JS ≈ 103 kB shared).
- Semantic landmarks, labelled controls, visible focus states, keyboard-closable dialogs, `aria-live` toasts.

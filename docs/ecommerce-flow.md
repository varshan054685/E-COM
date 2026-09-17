# E-Commerce Flow (ready-to-buy path)

`Browse → Product → Cart → Checkout → Payment → Order → Tracking`

## 1. Browse & discover

- **Home** (`/`) — hero (content-managed), collections, The Edit, Aari story, custom CTA, testimonials, map.
- **Shop** (`/shop`) — search + filters (category, price, size, colour, occasion, availability, craft) + sorting. All filter state lives in the **URL query string** (`?q=&category=&min=&max=&sizes=&colors=&sort=…`) so filtered views are shareable.
- **Collections** (`/collections/[slug]`) — editorial headers per category, SEO metadata.
- **Search overlay** — products + categories, recent searches.
- **Product page** (`/product/[slug]`) — gallery, price/compare-price, stock state, size/colour selectors, saved-measurement support, expandable info sections, JSON-LD `Product` structured data, related pieces, reviews.

## 2. Cart

- Guest cart persists in localStorage; on login `POST /api/cart/merge` merges it into the DB cart.
- Drawer + full page; quantity changes validated against stock server-side.
- Shows subtotal, discount, shipping estimate, total.

## 3. Checkout (`/checkout`)

Steps: contact → delivery address (or saved address) → shipping method → payment.

- Coupon field validates via `POST /api/coupons/validate` (min order, expiry, usage limit, max discount enforced server-side).
- `POST /api/checkout` **never trusts client prices**: it reloads products from the DB, recomputes subtotal/discount/shipping/total, verifies stock, then creates:
  - `Order` with status `PENDING_PAYMENT`, `paymentStatus: UNPAID`
  - `Payment` record
  - Razorpay order (when keys configured) and returns `razorpayOrderId`

Shipping: flat ₹150, free above ₹10,000 (`SHIPPING_FLAT_RATE`, `FREE_SHIPPING_THRESHOLD`).

## 4. Payment

- Razorpay Checkout opens with the server-created order id; on success the handler posts the ids + signature to `POST /api/payments/verify`.
- The API verifies the **HMAC-SHA256 signature server-side** using `RAZORPAY_KEY_SECRET`, reads the amount from the DB order, then in one transaction sets the order `CONFIRMED`/`PAID` and the payment `PAID`.
- On verification failure the payment is marked `FAILED`; **stock is not decremented**.
- Without keys the platform runs in clearly-labelled mock mode for development.

## 5. Order lifecycle

`PENDING_PAYMENT → CONFIRMED → PROCESSING → IN_PRODUCTION → READY_TO_SHIP → SHIPPED → DELIVERED` (+ `CANCELLED`, `RETURNED`).

- Customer tracks progress on the order page (`/account/orders/[orderNumber]`) with an elegant timeline.
- Admin updates status/payment/tracking/notes in **Admin → Orders**; cancelling a non-cancelled order **restocks** items.

## 6. Post-purchase

- Reviews: verified purchasers review from the product page; admin moderation (approve/unpublish/delete) in **Admin → Reviews**.
- Addresses and measurement profiles are managed in the account area and reused at checkout/custom order.

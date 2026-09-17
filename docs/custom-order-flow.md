# Custom Order Flow (couture path)

`Discover → Custom Couture → Request → Quote → Payment → Production → Delivery`

## 1. Entry points

- Home "Custom Couture" section and collection tile
- Navbar **Custom Couture** link; footer; product pages ("Begin Made-to-Order" pre-fills the piece)

## 2. The wizard (`/custom-couture`)

Eight guided steps:

1. **Choose your creation** — blouse, bridal blouse, saree styling, Aari work, custom dress, other
2. **Upload inspiration** — up to 3 reference images (`POST /api/upload`, validated)
3. **Requirements** — occasion, colour, fabric, embroidery style, neck/sleeve/back design, notes
4. **Measurements** — standard size, or custom measurements via guided fields, or a **saved measurement profile**
5. **Preferred deadline**
6. **Contact information** (pre-filled when signed in)
7. **Review summary**
8. **Submit**

`POST /api/custom-orders` validates garment type, measurement completeness (profile / manual / standard size), and sanitizes all text; the customer receives a confirmation with their `CO-…` request number.

## 3. Status lifecycle

```
NEW_REQUEST
  → REVIEWING → REQUIREMENTS_CONFIRMED → QUOTE_SENT
  → AWAITING_CUSTOMER → PAYMENT_PENDING → CONFIRMED
  → IN_PRODUCTION → QUALITY_CHECK → READY → SHIPPED → COMPLETED
  (CANCELLED possible while pre-production)
```

- Customer sees live status in **Account → Custom Orders**.
- Admin sees every request in **Admin → Create & Requests** with a dedicated detail page (`/admin/custom-orders/CO-1001`) showing requirements, measurements, reference images, deadline.

## 4. Quote & conversion

- Admin sets **quote amount + note**, moves status to `QUOTE_SENT`.
- On customer go-ahead, admin marks `CONFIRMED` and either records payment or clicks **Convert to order**:
  - creates a real `Order` (subtotal/total = quote, item denormalized, note links the request)
  - stamps `CustomOrder.convertedOrderId` and flips status to `IN_PRODUCTION`
- The converted order then flows through the normal order-management pipeline (production → shipped → delivered).

## 5. Payment

Payments for custom work create `Payment` rows linked via `customOrderId`, supporting deposit/partial semantics (`UNPAID → PARTIAL → PAID`) tracked on the request itself.

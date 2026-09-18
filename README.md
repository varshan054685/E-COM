# Aari Couture — Designer Boutique Storefront

A premium, mobile-first e-commerce storefront for a high-end designer boutique specialising in
**custom Aari work blouses, traditional sarees, hand-painted fabrics and luxury kids' party wear**.

The design language is *Traditional Indian Heritage meets Modern Minimalist Luxury*: an off-white
canvas, rich emerald/magenta accents, muted gold detailing, editorial serif headings and spacious
image-led grids.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| UI primitives | shadcn/ui-style components on Radix UI (`Button`, `Card`, `Input`, `Checkbox`, `Dialog`, `Sheet`) |
| Icons | Lucide React (+ inline brand SVGs, since Lucide v1 dropped them) |
| Motion | Framer Motion (page transitions, scroll reveals, expanding panels) |
| State | Zustand with `persist` → cart, measurement profile and session survive reloads |
| Auth | Device-local accounts (Zustand + salted SHA-256 digest) — **UI demo, not real security** |
| Fonts | Playfair Display (headings) + Inter (body), self-hosted via `next/font` |

No database, auth or payment backend — see [What is intentionally not here](#what-is-intentionally-not-here).

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Optional — copy `.env.example` to `.env.local` to change the WhatsApp number or site origin.
Every variable has a working default, so the site runs without one.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |

---

## Design system

All tokens live in `src/app/globals.css` under `:root` and `@theme`. There is no `tailwind.config.ts` —
Tailwind v4 reads the theme from CSS, so a colour is added in exactly one place.

### Palette

| Token | Value | Used for |
| --- | --- | --- |
| `background` | `#FAFAF9` | Off-white/ivory page canvas |
| `foreground` | `#1C1917` | Body text |
| `primary` | `#064E3B` | Emerald — primary commerce actions |
| `secondary` | `#831843` | Deep magenta — festive emphasis |
| `accent` | `#D4AF37` | Muted gold — highlights, editorial accents |
| `ivory-*`, `ink-*`, `gold-*` | ramps | Surfaces, borders, tints |

### Type & shape

- `font-serif` → Playfair Display, applied to `h1`–`h4` automatically.
- `font-sans` → Inter, the body default.
- Radii: `rounded-md` (controls) → `rounded-2xl` (feature panels).
- Shadows: `shadow-soft` (cards) and `shadow-lift` (overlays, hero imagery).
- Custom utilities: `eyebrow` (small uppercase section label) and `no-scrollbar` (scroll rails).

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # fonts, metadata, Navbar / Footer / drawer / FAB
│   ├── template.tsx            # Framer Motion page transition
│   ├── page.tsx                # homepage
│   ├── shop/page.tsx           # listing + server-side filtering from the URL
│   ├── product/[slug]/page.tsx # detail + generateStaticParams + JSON-LD
│   ├── custom-orders/ kids/ about/ contact/
│   ├── login/ register/ forgot-password/   # auth screens
│   ├── cart/ account/          # client views behind server metadata wrappers
│   └── policies/[slug]/        # shipping & returns, privacy, terms
├── components/
│   ├── ui/                     # shadcn-style primitives (incl. dropdown-menu)
│   ├── auth/                   # AuthShell + AuthForm (login / register / reset)
│   ├── layout/                 # Navbar, Footer, SearchDialog, PageHero, WhatsAppFab
│   ├── home/                   # Hero, FeaturedCategories, Bestsellers, AtelierStory, CTA
│   ├── product/                # ProductCard/Grid, Gallery, AddToBagPanel, MeasurementForm, ShopFilters
│   ├── commerce/cart-view.tsx  # bag review + WhatsApp order hand-off
│   └── icons/                  # WhatsApp / Instagram / Facebook / YouTube SVGs
├── lib/
│   ├── catalog.ts              # 18 products, 5 categories, read helpers
│   ├── images.ts               # Unsplash URL builder + curated image pool
│   ├── site.ts                 # brand, navigation, WhatsApp deep links
│   ├── shop-filtering.ts       # pure parse / apply / serialise filter logic
│   ├── policies.ts             # policy copy
│   └── use-hydrated.ts         # guards persisted state against SSR mismatch
└── store/
    ├── auth.ts                 # device-local accounts (demo only)
    ├── cart.ts                 # Zustand cart (+ shipping thresholds)
    └── measurements.ts         # saved body-measurement profile
```

---

## Features

**Global layout** — announcement strip, sticky blurred header (logo · centred links · search,
account, cart), multi-column footer with newsletter capture, and a fixed WhatsApp action button
that expands on hover.

**Homepage** — full-bleed hero with the "Exquisite Aari Couture & Designer Wear" headline and
*Shop the Collection* CTA, three-card featured category grid (Bridal Aari Blouses, Kids Party Wear,
Hand-Painted Fabrics), a swipeable bestsellers carousel, an editorial atelier story and a bespoke
commission band.

**Shop** — sidebar filters for **Category, Price Range and Colour** plus sorting. Filter state is
parsed and applied **on the server** from the URL, so results are server-rendered, shareable and
survive a refresh. The grid runs 1 → 2 → 3 → 4 columns and has a designed empty state.

**Product detail** — large image with an animated thumbnail strip; price with discount; fabric and
embroidery facts; colour swatches; standard size buttons (**XS–XL**, or kids sizes); a
**"Stitch to my exact measurements"** toggle that expands a form for **bust, waist, shoulder and
armhole** (plus optional length and sleeve notes) with an inches/cm switch, a **reference image
upload** with previews, and a "save to my profile" option. Primary **Add to Cart** plus secondary
**Inquire on WhatsApp** that pre-fills a product-specific message.

**Cart** — persists to `localStorage`, opens automatically on add, merges identical
product/size/colour/measurement combinations, and offers quantity controls and a free-shipping
progress bar. The `/cart` page collects delivery details and composes a fully formatted order
message, including measurements and reference file names, into WhatsApp.

**Account & sign-in** — sign in, create account and reset-password screens, with a "Forgot password?"
link and cross-links between all three. Once signed in the header shows an avatar menu with **Sign
out**, the mobile drawer shows the session with its own sign-out button, and the account page greets
you by name with a member-since date. Saved measurements (reused to pre-fill every later order) and
the bag summary sit alongside it.

---

## Swapping in real data

The storefront is designed to be re-pointed at real content without touching components:

| Want to change | Edit |
| --- | --- |
| Products, prices, categories | `src/lib/catalog.ts` — pages read only through its helpers |
| Placeholder photography | `src/lib/images.ts` (or the `images` array per product) |
| Brand name, address, phone, socials | `src/lib/site.ts` |
| WhatsApp number | `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` |
| Policy copy | `src/lib/policies.ts` |
| Colours, fonts, radii, shadows | `@theme` block in `src/app/globals.css` |

Because `catalog.ts` exposes `getAllProducts`, `getProductBySlug`, `getProductsByCategory`,
`getBestsellers` and friends, replacing the arrays with database or CMS calls requires no component
changes.

> Images currently point at curated Unsplash photographs so the visual language reads correctly
> before the boutique's own catalogue shoot. All 31 URLs used were verified to return HTTP 200.

---

## What is intentionally not here

This build is the **customer-facing storefront only** — no database, no server, no admin panel and
no payment gateway. Orders and custom commissions hand off to WhatsApp, which is how the boutique
already takes them.

> **The sign-in flow is a UI demo, not authentication.** Accounts live in this browser's
> `localStorage` (`src/store/auth.ts`) behind a salted SHA-256 digest — enough to make the flow
> complete and clickable, but it protects nothing and anyone with the device can read or clear it.
> Never put a real customer password into it.

To make any of it real:

1. **Auth** — point `src/store/auth.ts` at a provider (Auth.js, Clerk, Supabase Auth…). The three
   calls to replace are isolated as `signIn`, `register` and `resetPassword`; the forms in
   `src/components/auth/auth-form.tsx` need no changes.
2. **Persistence** — replace the arrays in `lib/catalog.ts` with your data source and keep the helper
   signatures.
3. **Orders** — post the composed message from `components/commerce/cart-view.tsx` to an API route
   instead of `wa.me`.
4. **Payments** — insert a gateway between the order summary and the WhatsApp hand-off; totals are
   computed in one place (`store/cart.ts`).
5. **Newsletter & uploads** — `components/layout/newsletter-form.tsx` and the upload input in
   `components/product/measurement-form.tsx` stay client-side; both have comments marking the
   integration point.

---

## Verified

- `npm run typecheck` — clean.
- `npm run build` — 34 routes generated (18 product pages + 3 policy pages statically pre-rendered).
- Smoke-tested against a production server: every route returns 200, unknown routes 404, category
  and colour filtering narrow results correctly, the empty-filter state renders, the auth pages
  render their headings and cross-links, and the WhatsApp deep links are present in the HTML.
- Product cards verified to emit one `min-h-[2.75em]` title reserve and one `mt-auto` action wrapper
  each, so price rows and **Add to Cart** buttons align across a grid row and across carousel slides.

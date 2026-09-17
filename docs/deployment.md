# Deployment

## 1. Environment

Set in your host (never commit):

```
DATABASE_URL="postgresql://user:pass@host:5432/jgths"   # or managed Postgres
AUTH_SECRET="<64-char random string>"
NEXT_PUBLIC_SITE_URL="https://jgthscouture.in"
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."          # optional, for webhooks
WHATSAPP_NUMBER="91XXXXXXXXXX"
UPLOAD_DIR="/data/uploads"             # persistent volume for custom-order images
```

## 2. Database

The schema ships SQLite-first for development. For production Postgres:

1. In `prisma/schema.prisma`, set `provider = "postgresql"`.
2. `npx prisma db push` (or generate + run migrations if you prefer the migration workflow).
3. `npm run db:seed` — updates the catalogue but **change the demo passwords first** (edit `prisma/seed.ts`), or skip seeding users in production.

## 3. Build & run

```bash
npm ci          # installs + prisma generate
npm run build
npm start       # node server; put a reverse proxy / CDN in front
```

Works out of the box on Vercel (set the env vars, add a Postgres add-on) or any Node host / Docker image.

## 4. Image delivery

- Dev placeholders point at Unsplash; replace with the boutique's photography via **Admin → Products** (image URLs) and **Admin → Content** (hero/story).
- For heavy media, move to Cloudinary (env vars already reserved in `.env.example`) and keep `res.cloudinary.com` in `next.config.mjs` remote patterns (already allowed).
- `UPLOAD_DIR` must be a persistent volume if you keep local uploads.

## 5. Go-live checklist

- [ ] Real `AUTH_SECRET`, real Razorpay **live** keys
- [ ] Demo admin/customer passwords changed or removed
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain (drives sitemap/OG URLs)
- [ ] WhatsApp number set to the boutique's
- [ ] Test a full Razorpay ₹1 live payment; confirm verify + stock decrement
- [ ] Confirm `/sitemap.xml` and `/robots.txt` resolve with the production domain
- [ ] Custom-order uploads land in persistent storage
- [ ] Backups scheduled for the database

## 6. Operations

- Monitor the dev-style console errors in your host's logs.
- Admin console (`/admin`) is excluded from robots and role-guarded.
- Reviews are moderated; enable stricter approval by defaulting `approved: false` in `POST /api/reviews` if desired.

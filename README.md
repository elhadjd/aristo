# ARISTO

Premium automotive dealership website for ARISTO — Columbus, Ohio.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma (SQLite)**, **Framer Motion**, **Zustand**, **React Hook Form**, **Zod**, and **Axios**.

## What’s included

- Public luxury dealership website (inventory, vehicle details, financing, trade-in, services, articles, etc.)
- **Full Admin panel** at `/admin` to manage **everything** shown on the site:
  - Vehicles (gallery images, attributes, features, pricing, publish/feature flags)
  - Services, categories, brands
  - Testimonials, FAQ, articles
  - Site settings (hero, contact, social)
  - Contact leads inbox
- **Contact forms** still sync to **SISGESC** (external API)
- Catalog/products/galleries are **not** fetched from SISGESC — they are managed in Admin

## Quick start

```bash
npm install
cp .env.example .env
cp .env.example .env.local
npm run db:setup
npm run dev
```

> **Windows note:** The app uses **LibSQL** (no native compile). You do **not** need Python or Visual Studio Build Tools for `npm install`.
>
> Prisma reads **`.env`** (not only `.env.local`). Create both files from `.env.example`, or at least ensure `.env` contains `DATABASE_URL="file:./prisma/dev.db"`.

- Website: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default admin (from seed):

- Email: `admin@aristo.com`
- Password: `AristoAdmin123!`

## Environment

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | SQLite path, e.g. `file:./prisma/dev.db` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin credentials |
| `JWT_SECRET` | Admin session signing secret |
| `SISGESC_API_URL` | SISGESC host (uses `POST /api/site/contacts/submit`) — **required** for external lead sync |
| `SISGESC_SITE_API_KEY` | Site API `key` for contact sync — **required** for external lead sync |
| `SISGESC_CONTACT_URL` | Optional full endpoint override |
| `SISGESC_CONTACT_REQUIRED` | If `true`, forms also fail when SISGESC env vars are missing (configured sync failures always fail) |

Admin image fields accept a **URL** or a **file upload** (stored under `/public/uploads`).

## Scripts

```bash
npm run dev          # development
npm run seo:sitemap  # regenerate public/sitemap.xml
npm run build        # prisma generate + sitemap + production build
npm run start        # production server
npm run db:setup     # create DB schema + seed demo content/admin
npm run db:seed      # re-seed
npm run lint
```

## SEO

- Per-page titles, meta descriptions, and high-intent keywords (`src/config/seo.ts`)
- Canonical URLs, Open Graph, Twitter cards, geo meta tags
- Structured data: AutoDealer, WebSite/SearchAction, Car, FAQPage, Article, BreadcrumbList
- `robots.txt` allows search engines and blocks `/admin` + `/api`
- `npm run build` always regenerates `public/sitemap.xml` (and Next.js `/sitemap.xml`)

Set `NEXT_PUBLIC_SITE_URL` to your production domain before deploying so canonicals and the sitemap use the correct host.

### Images on custom hosts

By default the app serves images **without** `/_next/image` optimization (`NEXT_IMAGE_UNOPTIMIZED` defaults on). This avoids broken vehicle photos when the host/proxy returns 404 for the optimizer. On Vercel you can set `NEXT_IMAGE_UNOPTIMIZED=false`.

## Architecture

```
src/
  app/admin/     # Admin UI (login + CRUD)
  app/api/admin/ # Protected admin APIs (JWT cookie)
  app/api/contact# Public contact → local lead + SISGESC sync
  features/admin # Admin forms/shell
  lib/db.ts      # Prisma client
  lib/auth.ts    # JWT admin auth
  lib/data.ts    # Public site reads from local DB
```

## SISGESC scope

Used only for **contact / trade-in / financing form leads** via:

```http
POST {SISGESC_API_URL}/api/site/contacts/submit?key={SISGESC_SITE_API_KEY}
```

Required: `name`, `email`, `phone` · Success: **HTTP 201**

Inventory, galleries, services, articles, FAQ, testimonials, and settings are fully configurable in Admin.

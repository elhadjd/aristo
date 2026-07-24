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
cp .env.example .env.local
npm run db:setup
npm run dev
```

> **Windows note:** The app uses **LibSQL** (no native compile). You do **not** need Python or Visual Studio Build Tools for `npm install`.

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
| `SISGESC_API_URL` | SISGESC host (uses `POST /api/site/contacts/submit`) |
| `SISGESC_SITE_API_KEY` | Site API `key` for contact sync |
| `SISGESC_CONTACT_URL` | Optional full endpoint override |
| `SISGESC_CONTACT_REQUIRED` | If `true`, forms fail when SISGESC is down |

## Scripts

```bash
npm run dev        # development
npm run build      # prisma generate + production build
npm run start      # production server
npm run db:setup   # create DB schema + seed demo content/admin
npm run db:seed    # re-seed
npm run lint
```

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

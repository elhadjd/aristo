# ARISTO

Premium automotive dealership website for ARISTO — Columbus, Ohio.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Zustand**, **React Hook Form**, **Zod**, and **Axios**.

## Features

- Luxury, conversion-focused UI with dark mode
- SSR inventory with advanced filters, sorting, grid/list, pagination
- Vehicle details with gallery zoom, financing estimate, share/print/favorites/compare
- SISGESC-ready REST API layer with local fallback catalog
- Financing calculator, trade-in form, services from API
- SEO: metadata, Open Graph, JSON-LD, sitemap, robots
- WhatsApp float, sticky nav, back-to-top, toasts, skeletons

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO |
| `NEXT_PUBLIC_API_URL` | Optional public API base (defaults to same-origin `/api`) |
| `SISGESC_API_URL` | Upstream SISGESC REST API (optional) |
| `SISGESC_API_KEY` | Bearer token for SISGESC (optional) |
| `JWT_SECRET` | Reserved for future JWT auth |

When `SISGESC_API_URL` is unset, Next.js API routes serve a curated demo catalog so the site remains fully functional.

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # start production server
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run format     # Prettier
```

## Architecture

```
src/
  app/           # App Router pages + REST API routes
  components/    # Shared UI, layout, SEO, motion
  features/      # Feature modules (home, inventory, vehicles, …)
  services/      # Axios API clients + interceptors
  lib/           # Data access, SEO, SISGESC proxy helpers
  store/         # Zustand (wishlist, compare, recently viewed, UI)
  hooks/         # Reusable client hooks
  types/         # Domain models
  interfaces/    # Expansion contracts (repositories, auth)
  config/        # Site + API configuration
  constants/     # Navigation, FAQ, stats
  data/          # Demo catalog fallback
```

## API endpoints

- `GET /api/vehicles`
- `GET /api/vehicles/{id}`
- `GET /api/categories`
- `GET /api/services`
- `GET /api/settings`
- `GET /api/featured`
- `GET /api/latest`
- `GET /api/testimonials`
- `GET /api/brands`
- `POST /api/contact`

## Deploy

Optimized for **Vercel**. Set environment variables in the project settings, then deploy.

## Dealership contact

- **Phone / WhatsApp:** +1 (614) 592-0280
- **Email:** keitaarbaba9@gmail.com
- **Address:** 3431 Westerville Rd, Columbus, OH 43224

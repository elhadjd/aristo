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
| `SISGESC_API_URL` | SISGESC host, e.g. `https://erp.example.com` |
| `SISGESC_SITE_API_KEY` | Site API key (`key`) — **server-side only** |
| `SISGESC_COMPANY_ID` | Optional company id for product detail route |
| `SISGESC_SERVICE_TYPE_IDS` | `product_type_id` values treated as services (default `2`) |
| `SISGESC_MEDIA_URL` | Optional media host when `image` paths are relative |
| `JWT_SECRET` | Reserved for future JWT auth |

When SISGESC is unset, the app serves a curated demo catalog. With host + key set, inventory and services load from:

```http
GET {SISGESC_API_URL}/api/site/products?key={SISGESC_SITE_API_KEY}
```

The key is used only in Next.js server code / Route Handlers (never shipped to the browser). Health check: `GET /api/health/sisgesc`.

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

## Public BFF endpoints (this site)

- `GET /api/vehicles`
- `GET /api/vehicles/{id}`
- `GET /api/categories`
- `GET /api/services`
- `GET /api/settings`
- `GET /api/featured`
- `GET /api/latest`
- `GET /api/testimonials`
- `GET /api/brands`
- `GET /api/health/sisgesc`
- `POST /api/contact`

## Upstream SISGESC Site API (used server-side)

| Route | Usage |
| --- | --- |
| `GET /api/site/products` | Full catalog (products + services) |
| `GET /api/site/products/{pageSize}` | Paginated shop list |
| `GET /api/site/searchProducts/{name}` | Name search |
| `GET /api/site/product/{company}/{product}` | Product detail |
| `GET /api/site` | Site settings |
| `GET /api/site/company` | Company settings |

## Deploy

Optimized for **Vercel**. Set environment variables in the project settings, then deploy.

## Dealership contact

- **Phone / WhatsApp:** +1 (614) 592-0280
- **Email:** keitaarbaba9@gmail.com
- **Address:** 3431 Westerville Rd, Columbus, OH 43224

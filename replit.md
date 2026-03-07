# US Postal Tracking

## Project Overview
A React + Vite SPA for USPS package tracking with a fully-functional admin dashboard. The admin API is embedded directly inside the Vite dev server as a plugin (no separate server process needed).

## Architecture
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM v6
- **API**: Inline Vite plugin in `vite.config.ts` that handles all `/api/*` routes (~2170 lines total)
- **Admin Dashboard**: `/admin` — password protected (default: `uspostal2024`), RTL layout
- **Server (optional)**: `server/index.js` — standalone Express server (port 8080) for VPS/production

## Running the App
- **Dev**: `npm run dev` (starts Vite on port 5000 with embedded API)
- **Build**: `npm run build`
- **Package manager**: npm

## Key Directories
- `src/pages/` — React page components (70+ pages)
- `src/components/admin/` — Admin dashboard tabs and components
- `src/components/seo/` — SEO helper components
- `src/data/` — Static data files
- `src/hooks/` — React hooks (including `useVisitorTracking`)
- `src/lib/` — Utility libs (adsense-config, tracking, etc.)
- `scripts/` — SEO generation & utility scripts
- `public/` — Static assets including 19 XML sitemaps
- `seo-data/` — Runtime data: visitors.json, config.json, logs.json, api-providers.json

## Replit Configuration
- Dev server runs on port **5000** bound to `0.0.0.0`
- Workflow: `npm run dev`
- Package manager: npm (package-lock.json present)

## Admin Dashboard — Completed Features
All admin tabs are fully functional with real data:
- **VisitorAnalyticsTab**: Real visitor data from `seo-data/visitors.json` — charts for OS, countries, hourly trend
- **DatabaseTab**: Browses seo-data/ JSON files as tables with search/export
- **PerformanceTab**: Lighthouse scores, build size info, CWV estimates
- **SeoAuditTab**: SEO health check (robots.txt, sitemaps, schema, OG tags) — score 89/100
- **RobotsTab**: Edit & save public/robots.txt in real-time
- **GitTab**: Shows branch, commit count, modified files + run git commands
- **ActivityLogsTab**: Reads/writes seo-data/logs.json (seeded on first startup)
- **AdSenseManagerTab**: Config save to localStorage + `/api/adsense-config`, publisher ID, ad units
- **ApiProvidersTab**: CRUD for API providers/accounts via `/api/providers`

## API Endpoints (vite.config.ts — adminApiPlugin)
32 endpoints total including:
- `/api/analytics`, `/api/analytics/active`, `/api/track`
- `/api/git`, `/api/performance`, `/api/logs` (GET/POST)
- `/api/robots` (GET/POST), `/api/seo-audit`
- `/api/database/tables`, `/api/database/table/:name`
- `/api/adsense/*` (4 endpoints), `/api/adsense-config`
- `/api/providers` (GET/PUT), `/api/accounts` (CRUD+test+validate)
- `/api/system-stats`, `/api/tracking-logs`, `/api/cache-stats`
- `/api/admin/login`, `/api/admin/change-password`

## Features
- USPS package tracking pages (programmatic SEO — 4120 pages across 206 cities)
- Admin dashboard at `/admin` (fully complete)
- Real visitor analytics tracking via `useVisitorTracking` hook in App.tsx
- Sitemap management & SEO tools (19 XML sitemaps, 16,000+ total URLs)
- Inline API routes via Vite plugin
- AdSense configuration manager with localStorage persistence

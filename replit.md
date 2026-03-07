# US Postal Tracking

## Project Overview
A React + Vite SPA for USPS package tracking with a fully-functional admin dashboard. The admin API is embedded directly inside the Vite dev server as a plugin (no separate server process needed). Zero mock data — all data comes from real API providers or persisted JSON files.

## Architecture
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM v6
- **API**: Inline Vite plugin in `vite.config.ts` that handles all `/api/*` routes (~3000+ lines total)
- **Advanced Scraper Engine**: 5-layer USPS scraper (L1: tools.usps.com HTML/JSON, L2: USPS AJAX endpoint, L3: USPS Mobile, L4: PackageRadar API, L5: Parcelsapp), 20 UA pool, per-layer runtime stats, auto failover to USPS XML API
- **Admin Dashboard**: `/admin` — password protected (default: `uspostal2024`), RTL layout, URL hash tab persistence
- **Server (production)**: `server/index.js` — standalone Express server (port 8080) for VPS/production — 81 API routes (100% coverage vs vite.config.ts)
- **Deployment**: `deploy.sh` (1093 lines, full Hostinger VPS deploy), `nginx.conf` (optimized config with SSL, gzip, prerender shell serving), `ecosystem.config.cjs` (PM2 cluster mode)

## Running the App
- **Dev**: `npm run dev` (starts Vite on port 5000 with embedded API)
- **Build**: `npm run build`
- **Package manager**: npm

## Key Directories
- `src/pages/` — React page components (70+ pages)
- `src/components/admin/` — Admin dashboard tabs and components
- `src/components/seo/` — SEO helper components
- `src/data/` — Static data files (`seoStaticData.ts` replaces deleted `mockTracking.ts`)
- `src/hooks/` — React hooks (including `useVisitorTracking`)
- `src/lib/` — Utility libs (adsense-config, tracking, etc.)
- `scripts/` — SEO generation & utility scripts
- `public/` — Static assets including 19 XML sitemaps
- `seo-data/` — Runtime data: visitors.json, config.json, logs.json, failover-providers.json, tracking-cache.json, tracking-logs.json

## Replit Configuration
- Dev server runs on port **5000** bound to `0.0.0.0`
- Workflow: `npm run dev`
- Package manager: npm (package-lock.json present)

## Admin Dashboard — Completed Features
All admin tabs are fully functional with real data (zero mock data):
- **ApiOverviewTab**: Real stats from `/api/system-stats`, `/api/system-stats/hourly`, `/api/system-stats/provider-usage`
- **ApiProvidersTab**: CRUD for Ship24/TrackingMore/17Track/Custom Scraper via `/api/providers`
- **VisitorAnalyticsTab**: Real visitor data from `seo-data/visitors.json` — charts for OS, countries, hourly trend
- **DatabaseTab**: Browses seo-data/ JSON files as tables with search/export
- **PerformanceTab**: Lighthouse scores, build size info, CWV estimates
- **SeoAuditTab**: SEO health check (robots.txt, sitemaps, schema, OG tags)
- **RobotsTab**: Edit & save public/robots.txt in real-time
- **GitTab**: Shows branch, commit count, modified files + run git commands
- **ActivityLogsTab**: Reads/writes seo-data/logs.json
- **AdSenseManagerTab**: Config save to localStorage + `/api/adsense-config`
- **ApiSystemSettingsTab**: Rate limiting, VPN blocking, CAPTCHA thresholds saved to `seo-data/config.json`

## Real API Provider Failover (Tracking)
- `/api/usps-track/:number` tries providers in order: Ship24 → TrackingMore → 17Track → USPS XML
- Config persisted in `seo-data/failover-providers.json`
- Results cached in `seo-data/tracking-cache.json` (TTL varies by status; not-found entries: 5 min)
- Every request logged to `seo-data/tracking-logs.json` (statuses: `success`, `error`, `not_found`)
- Ship24: POST `https://api.ship24.com/public/v1/trackers` (Bearer auth)
- TrackingMore: POST `https://api.trackingmore.com/v4/trackings/realtime` (Tracking-Api-Key header)
- 17Track: POST to `https://api.17track.net/track/v2.2/...` (17token header)
- **Monthly quota tracking**: `monthlyQuota`, `usedThisMonth`, `monthReset` (YYYY-M) per account
- **IP rate limiting**: `ipRateCache` Map at configureServer scope (30 req/hr default, rolling window)
- **Auto-exhaustion**: HTTP 402/429/403 → `status: 'exhausted'` (resets next calendar month)
- **Account stats**: `successCount`, `errorCount`, `usedToday`, `usedThisMonth` updated after every call
- **`isAccountActive()`**: checks enabled, non-empty key, monthly quota not exceeded, not exhausted this month

## API Endpoints (vite.config.ts — adminApiPlugin)
Key endpoints:
- `/api/analytics`, `/api/analytics/active`, `/api/track`
- `/api/git`, `/api/performance`, `/api/logs` (GET/POST)
- `/api/robots` (GET/POST), `/api/seo-audit`
- `/api/database/tables`, `/api/database/table/:name`
- `/api/adsense/*` (4 endpoints), `/api/adsense-config`
- `/api/providers` (GET/PUT), `/api/accounts` (CRUD+test+validate)
- `/api/system-stats`, `/api/system-stats/hourly`, `/api/system-stats/provider-usage`
- `/api/tracking-logs`, `/api/cache/stats`, `/api/cache/entries`, `/api/cache/flush`, `/api/cache/:id` (DELETE)
- `/api/usps-track/:number` — real failover tracking
- `/api/admin/login`, `/api/admin/change-password`
- `/api/config` (GET/PUT) — rate limiting, VPN, CAPTCHA settings

## Features
- USPS package tracking pages (programmatic SEO — 4120 pages across 206 cities)
- Admin dashboard at `/admin` (fully complete, URL hash tab persistence)
- Real visitor analytics tracking via `useVisitorTracking` hook in App.tsx
- Sitemap management & SEO tools (19 XML sitemaps, 16,000+ total URLs)
- Inline API routes via Vite plugin
- AdSense configuration manager with localStorage persistence

## Static SEO Data
- `src/data/seoStaticData.ts` — exports `trackingStatuses`, `majorLocations`, `faqData`, `TrackingEvent` interface, `TrackingData` interface
- Replaced deleted `mockTracking.ts` (was generating fake tracking events — now removed entirely)

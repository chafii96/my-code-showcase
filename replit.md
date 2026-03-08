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
- **Deployment**: `deploy.sh` (~1300 lines, full Hostinger VPS deploy — SSL stapling, HSTS, bot blocking, CORS preflight, legacy redirects, parallelized build), `nginx.conf` (reference config with SSL, gzip, prerender shell serving), `ecosystem.config.cjs` (PM2 cluster mode)

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

## Admin Dashboard — All 25 Tabs Fully Functional (100%)
All admin tabs use real backend data persisted to JSON files. Zero mock/demo/localStorage data:

### Main Section (الرئيسية) — Premium Design
- **OverviewTab**: Glassmorphism hero stats (6 cards with sparklines), real-time activity feed, area/donut charts, API health badges, cache gauge, top pages ranked table, hourly traffic with peak highlighting, quick actions, SEO health gauge
- **PerformanceTab**: Animated score circle (0-100), detailed build analysis with pie chart, response time area chart (P50/P95/P99), Core Web Vitals gauges (LCP/TBT/CLS), page speed insights, asset optimization status
- **VisitorAnalyticsTab**: Real Leaflet interactive map (dark CartoDB tiles, CircleMarkers, popups), animated counters, chart type toggle (Area/Line/Bar), pagination with bulk selection, engagement scoring, city breakdown, search engine breakdown, screen resolution heatmap, loading skeletons

### API Manager Section (مدير API) — Premium Design
- **ApiOverviewTab**: 8 hero metric cards, dual-axis request trend chart, provider health grid (4 cards), cache donut chart, recent activity log, error summary, provider usage pie
- **ApiProvidersTab**: Brand-colored provider cards, priority up/down buttons, masked API keys, daily/monthly quota bars, account test with detailed results, add modal with key validation, auto-rotation controls
- **CacheManagementTab**: Glassmorphism stat cards, SVG donut chart, circular memory gauge, TTL sliders, alternating table rows, prominent flush modal
- **ScraperManagementTab**: Color-coded layer borders, animated status dots, response time badges, expandable error logs, UA pool grid, prominent test interface
- **CarrierDetectionTab**: Large test input, carrier icon mapping, highlighted pattern results, detection bar chart, pattern modal, carriers grid
- **RateLimitingTab**: Glassmorphism stats, block/unblock confirmation modals, rate limit window visualization, styled blacklist/whitelist
- **ApiLogsTab**: Glassmorphism filter bar, status icons (CheckCircle/XCircle/AlertTriangle), color-coded response times, gradient pagination
- **ApiSystemSettingsTab**: Gradient section headers, large toggle switches with glow, danger red borders, fixed save button, redesigned confirmation

### Tools Section (الأدوات)
- **ToolsTab**: 30+ tools in 6 categories (SEO/Build/Server/Data/Content/Analytics), dangerous tool confirmation, search
- **PrerenderTab**: Start/stop with SSE progress, prerendered pages list, selective prerender, delete pages
- **TerminalTab**: Command history (up/down arrows), quick commands, line count, SSE streaming

### Content Section (المحتوى)
- **ContentManagementTab**: Full CRUD persisted to seo-data/content.json, SEO fields, no localStorage
- **AdsManagerTab**: Publisher ID + slot management persisted to config.json, no localStorage
- **AdSenseManagerTab**: Config/units/placements/revenue/compliance/ads.txt persisted to seo-data/adsense-data.json

### SEO Section
- **SeoAuditTab**: 20 comprehensive checks, weighted score gauge, recommendations, re-run audit
- **KeywordsTab**: Rankings + tracked + meta tag keywords, add/delete tracked, CSV export, sort/filter
- **RobotsTab**: Syntax highlighting, validation warnings, template presets, preview panel

### System Section (النظام)
- **ApiKeysTab**: Masked key display, add/edit/delete keys, test functionality, usage stats
- **DatabaseTab**: Pagination (50/page), column sorting, search, CSV/JSON export, zebra striping
- **GitTab**: Commit history table, modified files with status badges, pull/push with confirmation
- **ActivityLogsTab**: Level/action/date filters, search, pagination, auto-refresh, export, clear old logs
- **SiteSettingsTab**: 5 sections (General/SEO/Security/Appearance/Maintenance), all persisted to config.json

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
- `/api/git`, `/api/performance`, `/api/logs` (GET/POST/DELETE)
- `/api/robots` (GET/POST), `/api/seo-audit`
- `/api/database/tables`, `/api/database/table/:name`
- `/api/adsense/data` (GET/POST), `/api/adsense/stats`, `/api/adsense/ads-txt`, `/api/adsense/oauth-status`
- `/api/ads` (GET/POST), `/api/content` (CRUD), `/api/keywords` (CRUD)
- `/api/apikeys` (CRUD+test), `/api/api-settings` (GET/POST)
- `/api/providers` (GET/PUT), `/api/accounts` (CRUD+test+validate)
- `/api/scrapers` (CRUD+test), `/api/carrier-patterns` (CRUD+test)
- `/api/rate-limits/settings`, `/api/rate-limits/top-ips`, `/api/rate-limits/block/:ipHash`
- `/api/system-stats`, `/api/system-stats/hourly`, `/api/system-stats/provider-usage`
- `/api/tracking-logs`, `/api/cache/*` (stats/entries/flush/settings/delete)
- `/api/prerender/*` (status/start/stop/pages/delete)
- `/api/usps-track/:number` — real failover tracking
- `/api/admin/login`, `/api/admin/change-password`
- `/api/config` (GET/POST) — full site config, rate limiting, VPN, CAPTCHA settings

## AI-Generated Visual Assets (47 Images in `public/images/`)
- `public/images/carriers/` — 5 carrier trucks: fedex-van, ups-truck, dhl-truck, amazon-van, usps-truck
- `public/images/statuses/` — 9 status scenes: delivered, out-for-delivery, in-transit, sorting-facility, weather-delay, customs, scanning, delivery-success, delivered-icon
- `public/images/articles/` — 13 article images: priority-mail-box, certified-mail, first-class-mail, express-mail, media-mail, ground-advantage, customs-forms, tracking-label, post-office, package-late, package-return, fragile-package, holiday-packages
- `public/images/features/` — 7 features: tracking-map, logistics-hub, ecommerce, international-shipping, package-network, postal-worker, hero-bg-v2
- `public/images/cities/` — 8 US city photos: new-york, los-angeles, chicago, houston, phoenix, dallas, seattle, miami
- Used by: Article page headers (contextual background by slug), Carrier tracking pages (truck bg), FeaturesWithImages, CitiesGallery, CarrierTrucksSection, StatsSection

## New Visual Components
- `src/components/CarrierLogos.tsx` — 18 SVG inline brand logos (USPS, FedEx, UPS, DHL, Amazon, OnTrac, etc.)
- `src/components/FeaturesWithImages.tsx` — FeaturesWithImages, StatusImagesGrid, CitiesGallery, CarrierTrucksSection
- `src/components/CarriersStrip.tsx` — Marquee strip of carrier logos with scroll animation
- `src/components/StatsSection.tsx` — Animated count-up statistics section
- `src/components/ScrollReveal.tsx` — IntersectionObserver scroll-triggered reveal animations
- `src/components/ArticleImageHeader.tsx` — Article-specific contextual image mapping (by slug keywords)

## Carrier Landing Pages
- `src/pages/FedExTrackingPage.tsx` — `/fedex-tracking` (FedEx brand colors, full tracking guide, number formats, delivery times)
- `src/pages/UPSTrackingPage.tsx` — `/ups-tracking` (UPS brand colors, full tracking guide, 1Z number format, delivery times)
- `src/pages/DHLTrackingPage.tsx` — `/dhl-tracking`
- `src/pages/AmazonTrackingPage.tsx` — `/amazon-tracking`
- `src/pages/LaserShipTrackingPage.tsx` — `/lasership-tracking`
- `src/pages/carrier-landing/` — 12 additional carrier pages (Speedex, OnTrac, Doordash, etc.)

## Features
- USPS package tracking pages (programmatic SEO — 4120 pages across 206 cities)
- Admin dashboard at `/admin` (fully complete, URL hash tab persistence)
- Real visitor analytics tracking via `useVisitorTracking` hook in App.tsx
- Sitemap management & SEO tools (19 XML sitemaps, 16,000+ total URLs)
- Inline API routes via Vite plugin
- AdSense configuration manager with backend persistence (seo-data/adsense-data.json)

## Static SEO Data
- `src/data/seoStaticData.ts` — exports `trackingStatuses`, `majorLocations`, `faqData`, `TrackingEvent` interface, `TrackingData` interface
- Replaced deleted `mockTracking.ts` (was generating fake tracking events — now removed entirely)

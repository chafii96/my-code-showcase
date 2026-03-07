# US Postal Tracking

## Project Overview
A React + Vite SPA for USPS package tracking with an integrated admin dashboard. The admin API is embedded directly inside the Vite dev server as a plugin (no separate server process needed).

## Architecture
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM v6
- **API**: Inline Vite plugin in `vite.config.ts` that handles all `/api/*` routes
- **Server (optional)**: `server/index.js` — standalone Express server (port 8080) for VPS/production deployments
- **Admin API (optional)**: `server/api-server.cjs` — standalone Express API (port 3001)

## Running the App
- **Dev**: `npm run dev` (starts Vite on port 5000 with embedded API)
- **Build**: `npm run build`

## Key Directories
- `src/pages/` — React page components
- `src/components/` — Reusable UI components
- `src/data/` — Static data files
- `server/` — Standalone Express servers (for VPS/production use only)
- `scripts/` — SEO generation & utility scripts
- `public/` — Static assets including sitemaps
- `seo-data/` — Config and visitor tracking data (runtime generated)

## Replit Configuration
- Dev server runs on port **5000** bound to `0.0.0.0`
- Workflow: `npm run dev`
- Package manager: npm (package-lock.json present)

## Features
- USPS package tracking pages (programmatic SEO — 4000+ pages)
- Admin dashboard at `/admin`
- Visitor analytics at `/admin/visitors`
- Sitemap management & SEO tools
- Inline API routes via Vite plugin

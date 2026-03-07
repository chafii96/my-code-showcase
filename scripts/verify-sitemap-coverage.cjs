#!/usr/bin/env node
/**
 * Verify static route coverage in sitemap files.
 * Usage:
 *   node scripts/verify-sitemap-coverage.cjs
 *   node scripts/verify-sitemap-coverage.cjs --fix
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const APP_FILE = path.join(ROOT_DIR, 'src', 'App.tsx');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const LANDING_SITEMAP = path.join(PUBLIC_DIR, 'sitemap-landing.xml');

const EXCLUDED_STATIC_ROUTES = new Set(['/admin', '/admin/visitors']);

function normalizePath(routePath) {
  if (!routePath) return '';
  let p = routePath.trim();
  if (/^https?:\/\//i.test(p)) {
    try {
      p = new URL(p).pathname;
    } catch {
      return '';
    }
  }
  if (!p.startsWith('/')) return '';
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function getStaticRoutesFromApp() {
  const content = fs.readFileSync(APP_FILE, 'utf8');
  const routeRegex = /<Route\s+path="([^"]+)"/g;
  const routes = new Set();

  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const raw = match[1];
    if (!raw || raw === '*' || raw === '/*') continue;
    if (raw.includes(':')) continue;

    const normalized = normalizePath(raw);
    if (!normalized) continue;
    if (EXCLUDED_STATIC_ROUTES.has(normalized)) continue;

    routes.add(normalized);
  }

  return routes;
}

function getSitemapPaths() {
  const files = fs
    .readdirSync(PUBLIC_DIR)
    .filter((f) => /^sitemap-.*\.xml$/i.test(f));

  const paths = new Set();
  const locRegex = /<loc>([^<]+)<\/loc>/g;

  for (const file of files) {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
    let match;
    while ((match = locRegex.exec(content)) !== null) {
      const loc = match[1].trim();
      const normalized = normalizePath(loc);
      if (!normalized) continue;
      if (normalized.endsWith('.xml')) continue;
      paths.add(normalized);
    }
  }

  return paths;
}

function buildUrlXmlEntries(paths) {
  const today = new Date().toISOString().split('T')[0];
  return paths
    .map(
      (p) => `  <url>\n    <loc>https://uspostaltracking.com${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    )
    .join('\n');
}

function fixMissingInLanding(missingPaths) {
  if (!fs.existsSync(LANDING_SITEMAP)) {
    throw new Error('sitemap-landing.xml not found for --fix');
  }

  const current = fs.readFileSync(LANDING_SITEMAP, 'utf8');
  const insertion = buildUrlXmlEntries(missingPaths);
  const next = current.replace('</urlset>', `${insertion}\n</urlset>`);

  fs.writeFileSync(LANDING_SITEMAP, next);
  console.log(`✅ Added ${missingPaths.length} missing routes to sitemap-landing.xml`);
}

function main() {
  const shouldFix = process.argv.includes('--fix');

  const staticRoutes = getStaticRoutesFromApp();
  const sitemapPaths = getSitemapPaths();

  const missing = [...staticRoutes]
    .filter((route) => !sitemapPaths.has(route))
    .sort((a, b) => a.localeCompare(b));

  if (missing.length === 0) {
    console.log(`✅ Sitemap coverage OK (${staticRoutes.size} static routes covered)`);
    return;
  }

  console.log(`❌ Missing ${missing.length} static routes in sitemap files:`);
  missing.forEach((route) => console.log(`   - ${route}`));

  if (shouldFix) {
    fixMissingInLanding(missing);
    return;
  }

  process.exit(1);
}

main();

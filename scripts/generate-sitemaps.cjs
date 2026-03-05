/**
 * 🗺️ Comprehensive Sitemap Generator
 * Run: node scripts/generate-sitemaps.js
 * Generates ALL sitemaps from project data — core, landing, cities, articles, states, status pages
 */
const fs = require('fs');
const path = require('path');
const { writeUnifiedSitemapIndex } = require('./utils/sitemap-index.cjs');

const DOMAIN = 'https://uspostaltracking.com';
const today = new Date().toISOString().split('T')[0];
const publicDir = path.join(__dirname, '../public');

// ── Helper: write sitemap XML ──
function writeSitemap(filename, urls) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const u of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}${u.path}</loc>\n`;
    xml += `    <lastmod>${u.lastmod || today}</lastmod>\n`;
    xml += `    <changefreq>${u.freq || 'weekly'}</changefreq>\n`;
    xml += `    <priority>${u.priority || '0.7'}</priority>\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>`;
  fs.writeFileSync(path.join(publicDir, filename), xml);
  console.log(`✅ ${filename}: ${urls.length} URLs`);
  return urls.length;
}

// ══════════════════════════════════════
// 1. CORE PAGES (static routes)
// ══════════════════════════════════════
const corePages = [
  { path: '/', freq: 'hourly', priority: '1.0' },
  { path: '/article', freq: 'daily', priority: '0.9' },
  { path: '/locations', freq: 'daily', priority: '0.9' },
  { path: '/guides', freq: 'weekly', priority: '0.9' },
  { path: '/guides/tracking-number-format', freq: 'weekly', priority: '0.8' },
  { path: '/guides/informed-delivery', freq: 'weekly', priority: '0.8' },
  { path: '/guides/international-shipping-rates', freq: 'weekly', priority: '0.8' },
  { path: '/guides/tracking-not-updating', freq: 'weekly', priority: '0.8' },
  { path: '/guides/track-without-tracking-number', freq: 'weekly', priority: '0.8' },
  { path: '/guides/usps-mobile-tracking', freq: 'weekly', priority: '0.8' },
  { path: '/about', freq: 'monthly', priority: '0.6' },
  { path: '/contact', freq: 'monthly', priority: '0.5' },
  { path: '/informed-delivery', freq: 'weekly', priority: '0.7' },
  { path: '/international-shipping', freq: 'weekly', priority: '0.7' },
  { path: '/mobile-tracking', freq: 'weekly', priority: '0.7' },
  { path: '/tracking-not-updating', freq: 'weekly', priority: '0.7' },
  { path: '/tracking-number-format', freq: 'weekly', priority: '0.7' },
  { path: '/track-without-number', freq: 'weekly', priority: '0.7' },
  { path: '/privacy-policy', freq: 'monthly', priority: '0.3' },
  { path: '/terms-of-service', freq: 'monthly', priority: '0.3' },
  { path: '/disclaimer', freq: 'monthly', priority: '0.3' },
  { path: '/dmca', freq: 'monthly', priority: '0.3' },
];
const coreCount = writeSitemap('sitemap-core.xml', corePages);

// ══════════════════════════════════════
// 2. LANDING PAGES (keyword targeting)
// ══════════════════════════════════════
const landingPages = [
  '/post-office-tracking', '/mail-tracking', '/postal-tracking',
  '/usps-tracker', '/track-usps', '/usa-tracking', '/package-tracker-usps',
].map(p => ({ path: p, freq: 'weekly', priority: '0.8' }));
const landingCount = writeSitemap('sitemap-landing.xml', landingPages);

// ══════════════════════════════════════
// 3. STATUS PAGES
// ══════════════════════════════════════
const statusSlugs = [
  'in-transit-to-next-facility', 'departed-shipping-partner-facility',
  'out-for-delivery', 'delivered', 'shipping-label-created',
  'arrived-at-hub', 'alert-notice-left', 'held-at-post-office',
];
const statusPages = statusSlugs.map(s => ({ path: `/status/${s}`, freq: 'weekly', priority: '0.7' }));
const statusCount = writeSitemap('sitemap-status.xml', statusPages);

// ══════════════════════════════════════
// 4. CITY PAGES (from usCities.ts)
// ══════════════════════════════════════
const usCitiesContent = fs.readFileSync(path.join(__dirname, '../src/data/usCities.ts'), 'utf8');
const citySlugs = [];
const stateSet = new Set();

const slugMatches = usCitiesContent.matchAll(/slug:"([^"]+)"/g);
for (const m of slugMatches) citySlugs.push(m[1]);

const stateMatches = usCitiesContent.matchAll(/state:"([^"]+)"/g);
for (const m of stateMatches) stateSet.add(m[1].toLowerCase().replace(/\s+/g, '-'));

const cityPages = [];
for (const slug of citySlugs) {
  cityPages.push({ path: `/locations/${slug}`, freq: 'weekly', priority: '0.7' });
  cityPages.push({ path: `/city/${slug}`, freq: 'weekly', priority: '0.6' });
}
const cityCount = writeSitemap('sitemap-cities.xml', cityPages);

// ══════════════════════════════════════
// 5. STATE PAGES
// ══════════════════════════════════════
const statePages = [...stateSet].map(s => ({ path: `/state/${s}`, freq: 'weekly', priority: '0.7' }));
const stateCount = writeSitemap('sitemap-states.xml', statePages);

// ══════════════════════════════════════
// 6. ARTICLE PAGES (from articleKeywords)
// ══════════════════════════════════════
const articleSection = usCitiesContent.match(/articleKeywords[^[]*\[([\s\S]*?)\]/);
const articleSlugs = [];
if (articleSection) {
  const am = articleSection[1].matchAll(/"([^"]+)"/g);
  for (const m of am) articleSlugs.push(m[1]);
}
const articlePages = articleSlugs.map(s => ({ path: `/article/${s}`, freq: 'monthly', priority: '0.7' }));
const articleCount = writeSitemap('sitemap-articles.xml', articlePages);

// ══════════════════════════════════════
// 7. SITEMAP INDEX
// ══════════════════════════════════════
const unifiedIndex = writeUnifiedSitemapIndex({
  publicDir,
  siteUrl: DOMAIN,
  preferredOrder: [
    'sitemap-core.xml',
    'sitemap-carriers.xml',
    'sitemap-landing.xml',
    'sitemap-cities.xml',
    'sitemap-locations.xml',
    'sitemap-states.xml',
    'sitemap-articles.xml',
    'sitemap-status.xml',
    'sitemap-routes.xml',
    'sitemap-routes-2.xml',
    'sitemap-tracking.xml',
    'sitemap-programmatic.xml',
  ],
});

const total = coreCount + landingCount + statusCount + cityCount + stateCount + articleCount;
console.log(`\n✅ sitemap-index.xml & sitemap.xml updated (${unifiedIndex.sitemapFiles.length} sitemaps)`);
console.log(`📊 Generated in this run: ${total} URLs`);
console.log(`📊 Total URLs across indexed sitemaps: ${unifiedIndex.totalUrlsFromSitemaps}`);
console.log(`   Core: ${coreCount} | Landing: ${landingCount} | Status: ${statusCount}`);
console.log(`   Cities: ${cityCount} | States: ${stateCount} | Articles: ${articleCount}`);

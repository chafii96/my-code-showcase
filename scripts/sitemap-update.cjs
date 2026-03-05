#!/usr/bin/env node
/**
 * Sitemap Auto-Update + Search Engine Ping Script
 * Regenerates sitemaps dynamically and pings search engines
 * Run: node scripts/sitemap-update.js
 * Cron: 0 * * * * node /path/to/scripts/sitemap-update.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = process.env.SITE_URL || 'https://uspostaltracking.com';
const PUBLIC_DIR = path.join(__dirname, '../public');

// ============================================================
// DATA SOURCES
// ============================================================

const US_STATES = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california',
  'colorado', 'connecticut', 'delaware', 'florida', 'georgia',
  'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
  'kansas', 'kentucky', 'louisiana', 'maine', 'maryland',
  'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri',
  'montana', 'nebraska', 'nevada', 'new-hampshire', 'new-jersey',
  'new-mexico', 'new-york', 'north-carolina', 'north-dakota', 'ohio',
  'oklahoma', 'oregon', 'pennsylvania', 'rhode-island', 'south-carolina',
  'south-dakota', 'tennessee', 'texas', 'utah', 'vermont',
  'virginia', 'washington', 'west-virginia', 'wisconsin', 'wyoming'
];

const USPS_STATUSES = [
  'in-transit', 'out-for-delivery', 'delivered', 'attempted-delivery',
  'available-for-pickup', 'return-to-sender', 'forwarded', 'alert',
  'pre-shipment', 'accepted', 'departed-usps-facility', 'arrived-at-usps-facility',
  'in-transit-to-destination', 'delivery-attempted', 'notice-left',
  'picked-up', 'held-at-post-office', 'customs-clearance', 'processing',
  'sorting', 'label-created', 'shipment-received', 'package-accepted',
  'origin-post-preparing', 'item-dispatched', 'arrived-at-hub',
  'departed-hub', 'arrived-at-destination', 'out-for-delivery-today',
  'delivered-to-mailbox', 'delivered-to-front-door', 'delivered-to-parcel-locker',
  'delivered-to-neighbor', 'delivered-to-safe-location', 'package-damaged',
  'package-lost', 'return-initiated', 'return-in-transit', 'return-delivered',
  'address-corrected', 'held-for-customs', 'international-dispatch',
  'arrived-at-customs', 'customs-cleared', 'departed-customs',
  'arrived-at-destination-country', 'delivery-scheduled', 'delivery-exception',
  'weather-delay', 'operational-delay', 'holiday-delay'
];

const TOP_CITIES = [
  'new-york-ny', 'los-angeles-ca', 'chicago-il', 'houston-tx', 'phoenix-az',
  'philadelphia-pa', 'san-antonio-tx', 'san-diego-ca', 'dallas-tx', 'san-jose-ca',
  'austin-tx', 'jacksonville-fl', 'fort-worth-tx', 'columbus-oh', 'charlotte-nc',
  'san-francisco-ca', 'indianapolis-in', 'seattle-wa', 'denver-co', 'washington-dc',
  'nashville-tn', 'oklahoma-city-ok', 'el-paso-tx', 'boston-ma', 'portland-or',
  'las-vegas-nv', 'memphis-tn', 'louisville-ky', 'baltimore-md', 'milwaukee-wi',
  'albuquerque-nm', 'tucson-az', 'fresno-ca', 'sacramento-ca', 'mesa-az',
  'kansas-city-mo', 'atlanta-ga', 'omaha-ne', 'colorado-springs-co', 'raleigh-nc',
  'long-beach-ca', 'virginia-beach-va', 'minneapolis-mn', 'tampa-fl', 'new-orleans-la',
  'honolulu-hi', 'anaheim-ca', 'aurora-co', 'santa-ana-ca', 'corpus-christi-tx',
  'riverside-ca', 'lexington-ky', 'st-louis-mo', 'pittsburgh-pa', 'anchorage-ak',
  'stockton-ca', 'cincinnati-oh', 'st-paul-mn', 'toledo-oh', 'greensboro-nc',
  'newark-nj', 'plano-tx', 'henderson-nv', 'lincoln-ne', 'buffalo-ny',
  'fort-wayne-in', 'jersey-city-nj', 'chula-vista-ca', 'orlando-fl', 'st-petersburg-fl',
  'norfolk-va', 'chandler-az', 'laredo-tx', 'madison-wi', 'durham-nc',
  'lubbock-tx', 'winston-salem-nc', 'garland-tx', 'glendale-az', 'hialeah-fl',
  'reno-nv', 'baton-rouge-la', 'irvine-ca', 'chesapeake-va', 'scottsdale-az',
  'north-las-vegas-nv', 'fremont-ca', 'gilbert-az', 'san-bernardino-ca', 'boise-id',
  'birmingham-al', 'rochester-ny', 'richmond-va', 'spokane-wa', 'des-moines-ia',
  'montgomery-al', 'modesto-ca', 'fayetteville-nc', 'tacoma-wa', 'shreveport-la',
  'akron-oh', 'aurora-il', 'yonkers-ny', 'huntington-beach-ca', 'little-rock-ar'
];

const ARTICLE_SLUGS = [
  'usps-tracking-not-updating', 'usps-package-in-transit', 'usps-delivered-but-not-received',
  'usps-tracking-number-format', 'how-to-track-usps-package', 'usps-tracking-number-not-working',
  'usps-package-delayed', 'usps-delivery-time', 'usps-first-class-tracking',
  'usps-priority-mail-tracking', 'usps-priority-mail-express-tracking', 'usps-media-mail-tracking',
  'usps-flat-rate-box-tracking', 'usps-certified-mail-tracking', 'usps-registered-mail-tracking',
  'usps-international-tracking', 'usps-package-stuck-in-customs', 'usps-informed-delivery',
  'usps-package-lost', 'usps-missing-package', 'usps-package-stolen', 'usps-delivery-attempt',
  'usps-notice-left', 'usps-held-at-post-office', 'usps-package-returned-to-sender',
  'usps-forwarding-mail', 'usps-change-of-address', 'usps-po-box-tracking',
  'usps-business-days', 'usps-holiday-schedule', 'usps-weather-delay',
  'usps-tracking-history', 'usps-delivery-confirmation', 'usps-signature-required',
  'usps-package-insurance', 'usps-file-claim', 'usps-customer-service',
  'usps-phone-number', 'usps-email-notifications', 'usps-text-tracking',
  'usps-tracking-app', 'usps-api-tracking', 'usps-bulk-tracking',
  'usps-business-tracking', 'usps-ecommerce-shipping', 'usps-amazon-tracking',
  'usps-ebay-tracking', 'usps-etsy-tracking', 'usps-shopify-shipping',
  'usps-vs-fedex', 'usps-vs-ups', 'usps-vs-dhl', 'usps-shipping-rates',
  'usps-package-dimensions', 'usps-weight-limits', 'usps-prohibited-items',
  'usps-hazardous-materials', 'usps-perishable-items', 'usps-fragile-items',
  'usps-packaging-tips', 'usps-label-printing', 'usps-click-n-ship',
  'usps-schedule-pickup', 'usps-drop-off-locations', 'usps-post-office-hours',
  'usps-mail-classes', 'usps-ground-advantage', 'usps-connect-local',
  'usps-every-door-direct-mail', 'usps-marketing-mail', 'usps-periodicals',
  'usps-bound-printed-matter', 'usps-library-mail', 'usps-special-services',
  'usps-delivery-instructions', 'usps-parcel-select', 'usps-parcel-return-service',
  'usps-merchandise-return', 'usps-package-intercept', 'usps-redelivery',
  'usps-hold-mail', 'usps-vacation-mail-hold', 'usps-mail-forwarding-service',
  'usps-premium-forwarding', 'usps-mail-recovery-center', 'usps-dead-letter-office',
  'usps-postmaster-general', 'usps-history', 'usps-zip-code-lookup',
  'usps-address-verification', 'usps-delivery-standards', 'usps-service-commitments',
  'usps-performance-metrics', 'usps-on-time-delivery', 'usps-tracking-accuracy',
  'usps-customer-satisfaction', 'usps-complaint-process', 'usps-ombudsman',
  'usps-office-of-inspector-general', 'usps-postal-inspection-service',
  'usps-mail-theft', 'usps-identity-theft', 'usps-phishing-scams',
  'usps-fake-tracking-numbers', 'usps-smishing-text-scams', 'usps-package-scams',
  'usps-informed-delivery-setup', 'usps-digital-mail', 'usps-electronic-return-receipt',
  'usps-certified-mail-green-card', 'usps-restricted-delivery', 'usps-adult-signature',
  'usps-po-box-sizes', 'usps-po-box-rental', 'usps-caller-service',
  'usps-premium-po-box', 'usps-mail-acceptance', 'usps-mail-preparation',
  'usps-mailing-standards', 'usps-domestic-mail-manual', 'usps-international-mail-manual',
  'usps-country-restrictions', 'usps-customs-forms', 'usps-cn22-form',
  'usps-ps-form-2976', 'usps-import-duties', 'usps-export-regulations'
];

// ============================================================
// SITEMAP GENERATION
// ============================================================

function generateSitemapXML(urls, lastmod = null) {
  const today = lastmod || new Date().toISOString().split('T')[0];
  const urlEntries = urls.map(({ loc, priority, changefreq, lastmod: lm }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lm || today}</lastmod>
    <changefreq>${changefreq || 'weekly'}</changefreq>
    <priority>${priority || '0.5'}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

function generateSitemapIndex(sitemaps) {
  const today = new Date().toISOString().split('T')[0];
  const sitemapEntries = sitemaps.map(({ loc, lastmod }) => `
  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod || today}</lastmod>
  </sitemap>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

function buildAllSitemaps() {
  const today = new Date().toISOString().split('T')[0];
  const sitemapFiles = [];

  // 1. Core pages sitemap
  const coreUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'hourly' },
    { loc: `${BASE_URL}/article`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/locations`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/sitemap.xml`, priority: '0.3', changefreq: 'daily' },
  ];
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-core.xml'), generateSitemapXML(coreUrls));
  sitemapFiles.push({ loc: `${BASE_URL}/sitemap-core.xml`, lastmod: today });
  console.log(`✅ sitemap-core.xml: ${coreUrls.length} URLs`);

  // 2. Articles sitemap
  const articleUrls = ARTICLE_SLUGS.map(slug => ({
    loc: `${BASE_URL}/article/${slug}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-articles.xml'), generateSitemapXML(articleUrls));
  sitemapFiles.push({ loc: `${BASE_URL}/sitemap-articles.xml`, lastmod: today });
  console.log(`✅ sitemap-articles.xml: ${articleUrls.length} URLs`);

  // 3. Cities sitemap
  const cityUrls = TOP_CITIES.map(city => ({
    loc: `${BASE_URL}/city/${city}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-cities.xml'), generateSitemapXML(cityUrls));
  sitemapFiles.push({ loc: `${BASE_URL}/sitemap-cities.xml`, lastmod: today });
  console.log(`✅ sitemap-cities.xml: ${cityUrls.length} URLs`);

  // 4. States sitemap
  const stateUrls = US_STATES.map(state => ({
    loc: `${BASE_URL}/state/${state}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-states.xml'), generateSitemapXML(stateUrls));
  sitemapFiles.push({ loc: `${BASE_URL}/sitemap-states.xml`, lastmod: today });
  console.log(`✅ sitemap-states.xml: ${stateUrls.length} URLs`);

  // 5. Status pages sitemap
  const statusUrls = USPS_STATUSES.map(status => ({
    loc: `${BASE_URL}/status/${status}`,
    priority: '0.7',
    changefreq: 'weekly'
  }));
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-status.xml'), generateSitemapXML(statusUrls));
  sitemapFiles.push({ loc: `${BASE_URL}/sitemap-status.xml`, lastmod: today });
  console.log(`✅ sitemap-status.xml: ${statusUrls.length} URLs`);

  // 6. City-pair routes sitemap (top 500 routes)
  const routeUrls = [];
  const topCitiesForRoutes = TOP_CITIES.slice(0, 30);
  for (let i = 0; i < topCitiesForRoutes.length; i++) {
    for (let j = 0; j < topCitiesForRoutes.length; j++) {
      if (i !== j && routeUrls.length < 500) {
        routeUrls.push({
          loc: `${BASE_URL}/route/${topCitiesForRoutes[i]}-to-${topCitiesForRoutes[j]}`,
          priority: '0.6',
          changefreq: 'monthly'
        });
      }
    }
  }
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-routes.xml'), generateSitemapXML(routeUrls));
  sitemapFiles.push({ loc: `${BASE_URL}/sitemap-routes.xml`, lastmod: today });
  console.log(`✅ sitemap-routes.xml: ${routeUrls.length} URLs`);

  // 7. Tracking number examples sitemap (for SEO bait)
  const trackingExamples = [
    '9400111899223397622988', '9400111899223397622989', '9400111899223397622990',
    '9205590100130869012683', '9205590100130869012684', '9205590100130869012685',
    '9261290100130869012683', '9261290100130869012684', '9261290100130869012685',
    '9300120111405223149812', '9300120111405223149813', '9300120111405223149814',
    '9400109699938860246013', '9400109699938860246014', '9400109699938860246015',
    '9274899992136003047048', '9274899992136003047049', '9274899992136003047050',
  ];
  const trackingUrls = trackingExamples.map(num => ({
    loc: `${BASE_URL}/t/${num}`,
    priority: '0.5',
    changefreq: 'daily'
  }));
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-tracking.xml'), generateSitemapXML(trackingUrls));
  sitemapFiles.push({ loc: `${BASE_URL}/sitemap-tracking.xml`, lastmod: today });
  console.log(`✅ sitemap-tracking.xml: ${trackingUrls.length} URLs`);

  // 8. Sitemap index
  const sitemapIndex = generateSitemapIndex(sitemapFiles);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndex);
  
  const totalUrls = coreUrls.length + articleUrls.length + cityUrls.length + 
                    stateUrls.length + statusUrls.length + routeUrls.length + trackingUrls.length;
  
  console.log(`\n✅ sitemap.xml index: ${sitemapFiles.length} sitemaps, ${totalUrls} total URLs`);
  return { sitemapFiles, totalUrls };
}

// ============================================================
// SEARCH ENGINE PING
// ============================================================

function pingSearchEngine(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', (err) => {
      resolve({ url, error: err.message });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, error: 'Timeout' });
    });
  });
}

async function pingAllSearchEngines() {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
  
  const pingUrls = [
    // Google
    `https://www.google.com/ping?sitemap=${sitemapUrl}`,
    // Bing
    `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
    // IndexNow (Bing/Yandex)
    `https://api.indexnow.org/indexnow?url=${encodeURIComponent(BASE_URL)}&key=uspostaltracking`,
    // Yandex
    `https://webmaster.yandex.com/ping?sitemap=${sitemapUrl}`,
  ];
  
  console.log('\n📡 Pinging search engines...');
  
  for (const pingUrl of pingUrls) {
    const result = await pingSearchEngine(pingUrl);
    if (result.error) {
      console.log(`⚠️  ${pingUrl.split('?')[0]}: ${result.error}`);
    } else {
      console.log(`✅ ${pingUrl.split('?')[0]}: HTTP ${result.status}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('\n🗺️  Sitemap Auto-Update Script');
  console.log('='.repeat(50));
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log('='.repeat(50) + '\n');
  
  console.log('📝 Generating sitemaps...');
  const { totalUrls } = buildAllSitemaps();
  
  console.log(`\n🎯 Total URLs indexed: ${totalUrls}`);
  
  if (process.argv.includes('--ping')) {
    await pingAllSearchEngines();
  } else {
    console.log('\n💡 Tip: Run with --ping flag to notify search engines');
    console.log('   node scripts/sitemap-update.js --ping');
  }
  
  console.log('\n✅ Sitemap update complete!');
  console.log('📋 Next: Deploy to production and submit to Google Search Console');
}

main().catch(console.error);

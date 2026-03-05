/**
 * Hyper-Programmatic Sitemap Generator
 * Generates multiple XML sitemaps covering all pages:
 * - Static pages
 * - Status pages (8)
 * - Location pages (80+ cities)
 * - Article pages (50+ keywords)
 * - Tracking number pages (sample patterns)
 * - Sitemap index
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "../public");
const BASE_URL = "https://uspostaltracking.com";
const TODAY = new Date().toISOString().split("T")[0];

// All US cities (same as usCities.ts)
const allUSCities = [
  "new-york-ny", "buffalo-ny", "rochester-ny", "yonkers-ny",
  "los-angeles-ca", "san-diego-ca", "san-jose-ca", "san-francisco-ca",
  "fresno-ca", "sacramento-ca", "long-beach-ca", "oakland-ca",
  "houston-tx", "dallas-tx", "san-antonio-tx", "austin-tx",
  "fort-worth-tx", "el-paso-tx", "arlington-tx", "corpus-christi-tx",
  "miami-fl", "jacksonville-fl", "tampa-fl", "orlando-fl",
  "st-petersburg-fl", "hialeah-fl",
  "chicago-il", "aurora-il", "joliet-il",
  "philadelphia-pa", "pittsburgh-pa", "allentown-pa",
  "phoenix-az", "tucson-az", "mesa-az", "chandler-az",
  "atlanta-ga", "columbus-ga", "savannah-ga",
  "seattle-wa", "spokane-wa", "tacoma-wa",
  "denver-co", "colorado-springs-co", "aurora-co",
  "boston-ma", "worcester-ma", "springfield-ma",
  "detroit-mi", "grand-rapids-mi", "warren-mi",
  "nashville-tn", "memphis-tn", "knoxville-tn",
  "columbus-oh", "cleveland-oh", "cincinnati-oh",
  "charlotte-nc", "raleigh-nc", "greensboro-nc",
  "virginia-beach-va", "norfolk-va", "richmond-va",
  "newark-nj", "jersey-city-nj", "paterson-nj",
  "indianapolis-in", "fort-wayne-in",
  "kansas-city-mo", "st-louis-mo",
  "milwaukee-wi", "madison-wi",
  "minneapolis-mn", "st-paul-mn",
  "las-vegas-nv", "henderson-nv", "reno-nv",
  "baltimore-md", "frederick-md",
  "portland-or", "eugene-or",
  "oklahoma-city-ok", "tulsa-ok",
  "louisville-ky", "lexington-ky",
  "new-orleans-la", "baton-rouge-la",
  "columbia-sc", "charleston-sc",
  "birmingham-al", "montgomery-al",
  "bridgeport-ct", "new-haven-ct",
  "des-moines-ia", "wichita-ks", "omaha-ne",
  "salt-lake-city-ut", "albuquerque-nm",
  "honolulu-hi", "anchorage-ak",
  "little-rock-ar", "jackson-ms",
  "boise-id", "billings-mt", "cheyenne-wy",
  "fargo-nd", "sioux-falls-sd",
  "providence-ri", "burlington-vt",
  "manchester-nh", "portland-me",
  "wilmington-de", "charleston-wv",
];

// Tracking statuses
const trackingStatuses = [
  "in-transit-to-next-facility",
  "departed-shipping-partner-facility",
  "out-for-delivery",
  "delivered",
  "shipping-label-created",
  "arrived-at-hub",
  "alert-notice-left",
  "held-at-post-office",
];

// Article keywords
const articleKeywords = [
  "usps-tracking-not-updating-for-3-days",
  "usps-tracking-not-updating-for-24-hours",
  "usps-tracking-not-updating-for-a-week",
  "usps-package-stuck-in-transit",
  "usps-package-stuck-in-transit-for-2-weeks",
  "usps-tracking-shows-delivered-but-no-package",
  "usps-tracking-number-not-found",
  "usps-tracking-number-not-working",
  "usps-package-lost-in-transit",
  "usps-package-delayed",
  "usps-priority-mail-tracking",
  "usps-first-class-mail-tracking",
  "usps-media-mail-tracking",
  "usps-certified-mail-tracking",
  "usps-registered-mail-tracking",
  "usps-express-mail-tracking",
  "usps-flat-rate-box-tracking",
  "usps-international-tracking",
  "usps-tracking-number-format",
  "how-to-track-usps-package-without-number",
  "usps-informed-delivery-tracking",
  "usps-package-out-for-delivery-but-not-delivered",
  "usps-tracking-in-transit-arriving-late",
  "usps-package-arrived-at-facility",
  "usps-package-departed-facility",
  "usps-package-accepted-at-facility",
  "usps-package-awaiting-delivery-scan",
  "usps-package-held-at-post-office",
  "usps-redelivery-tracking",
  "usps-package-return-to-sender",
  "usps-package-forwarded",
  "usps-tracking-update-frequency",
  "usps-tracking-not-showing-location",
  "usps-tracking-last-location",
  "usps-package-in-customs",
  "usps-international-package-stuck-in-customs",
  "usps-package-seized-by-customs",
  "usps-package-delivered-to-wrong-address",
  "usps-package-stolen",
  "usps-insurance-claim-tracking",
  "usps-priority-mail-express-tracking",
  "usps-ground-advantage-tracking",
  "usps-parcel-select-tracking",
  "usps-bulk-mail-tracking",
  "usps-business-mail-tracking",
  "usps-po-box-tracking",
  "usps-package-scan-history",
  "usps-tracking-api",
  "usps-tracking-number-barcode",
  "usps-package-weight-tracking",
];

// Static pages
const staticPages = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/guides", priority: "0.9", changefreq: "weekly" },
  { url: "/guides/tracking-number-format", priority: "0.8", changefreq: "monthly" },
  { url: "/guides/informed-delivery", priority: "0.8", changefreq: "monthly" },
  { url: "/guides/international-shipping-rates", priority: "0.8", changefreq: "monthly" },
  { url: "/guides/tracking-not-updating", priority: "0.8", changefreq: "monthly" },
  { url: "/guides/track-without-tracking-number", priority: "0.8", changefreq: "monthly" },
  { url: "/guides/usps-mobile-tracking", priority: "0.8", changefreq: "monthly" },
  { url: "/about", priority: "0.5", changefreq: "monthly" },
  { url: "/contact", priority: "0.5", changefreq: "monthly" },
  { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { url: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
  { url: "/disclaimer", priority: "0.3", changefreq: "yearly" },
  { url: "/dmca", priority: "0.3", changefreq: "yearly" },
];

function generateSitemapXML(urls) {
  const urlEntries = urls
    .map(
      ({ url, priority, changefreq, lastmod }) => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod || TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

// Sitemap 1: Static + Status + Guide pages
const sitemap1 = generateSitemapXML([
  ...staticPages,
  ...trackingStatuses.map((slug) => ({
    url: `/status/${slug}`,
    priority: "0.7",
    changefreq: "monthly",
  })),
]);

// Sitemap 2: Location pages
const sitemap2 = generateSitemapXML(
  allUSCities.map((slug) => ({
    url: `/locations/${slug}`,
    priority: "0.6",
    changefreq: "weekly",
  }))
);

// Sitemap 3: Article pages
const sitemap3 = generateSitemapXML(
  articleKeywords.map((slug) => ({
    url: `/article/${slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }))
);

// Sitemap 4: Sample tracking number pages (for indexing patterns)
const trackingNumberSamples = [];
const prefixes = ["9400111899223033", "9205590100130471", "9270190100830049", "9300120111405209", "9407111899223397"];
for (const prefix of prefixes) {
  for (let i = 0; i < 20; i++) {
    const suffix = String(i).padStart(6, "0");
    trackingNumberSamples.push({
      url: `/track/${prefix}${suffix}`,
      priority: "0.5",
      changefreq: "daily",
    });
  }
}
const sitemap4 = generateSitemapXML(trackingNumberSamples);

// Sitemap Index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-locations.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-articles.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-tracking.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`;

// Write all sitemaps
writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), sitemap1);
writeFileSync(join(PUBLIC_DIR, "sitemap-locations.xml"), sitemap2);
writeFileSync(join(PUBLIC_DIR, "sitemap-articles.xml"), sitemap3);
writeFileSync(join(PUBLIC_DIR, "sitemap-tracking.xml"), sitemap4);
writeFileSync(join(PUBLIC_DIR, "sitemap-index.xml"), sitemapIndex);

console.log("✅ Sitemaps generated:");
console.log(`   sitemap.xml — ${staticPages.length + trackingStatuses.length} URLs`);
console.log(`   sitemap-locations.xml — ${allUSCities.length} URLs`);
console.log(`   sitemap-articles.xml — ${articleKeywords.length} URLs`);
console.log(`   sitemap-tracking.xml — ${trackingNumberSamples.length} URLs`);
console.log(`   sitemap-index.xml — index`);
console.log(`\nTotal URLs: ${staticPages.length + trackingStatuses.length + allUSCities.length + articleKeywords.length + trackingNumberSamples.length}`);

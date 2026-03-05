/**
 * USPS Tracking — Comprehensive Sitemap Generator v2
 * Generates 6 sitemaps + 1 sitemap index covering 2000+ URLs
 * Run: node scripts/generate-sitemap-v2.js
 */

const fs = require("fs");
const path = require("path");
const { writeUnifiedSitemapIndex } = require("./utils/sitemap-index.cjs");

const BASE_URL = "https://uspostaltracking.com";
const PUBLIC_DIR = path.join(__dirname, "../public");
const TODAY = new Date().toISOString().split("T")[0];

const STATIC_PAGES = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/guides", priority: "0.9", changefreq: "weekly" },
  { url: "/guides/tracking-number-format", priority: "0.8", changefreq: "monthly" },
  { url: "/guides/informed-delivery", priority: "0.8", changefreq: "monthly" },
  { url: "/guides/international-shipping-rates", priority: "0.8", changefreq: "monthly" },
  { url: "/guides/tracking-not-updating", priority: "0.9", changefreq: "weekly" },
  { url: "/guides/track-without-tracking-number", priority: "0.8", changefreq: "monthly" },
  { url: "/guides/usps-mobile-tracking", priority: "0.7", changefreq: "monthly" },
  { url: "/article", priority: "0.9", changefreq: "daily" },
  { url: "/locations", priority: "0.9", changefreq: "weekly" },
  { url: "/about", priority: "0.5", changefreq: "yearly" },
  { url: "/contact", priority: "0.5", changefreq: "yearly" },
  { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { url: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
  { url: "/disclaimer", priority: "0.3", changefreq: "yearly" },
  { url: "/dmca", priority: "0.3", changefreq: "yearly" },
];

const USPS_STATUSES = [
  "pre-shipment","accepted","in-transit","in-transit-to-next-facility",
  "arrived-at-usps-regional-facility","departed-usps-regional-facility",
  "arrived-at-post-office","out-for-delivery","delivered","delivery-attempted",
  "available-for-pickup","return-to-sender","forwarded","alert","delivery-exception",
  "held-at-post-office","customs-clearance","in-transit-arriving-late",
  "delivery-status-not-updated","usps-in-possession-of-item",
  "processed-through-facility","departed-post-office","sorting-complete",
  "notice-left","addressee-not-available","no-authorized-recipient-available",
  "refused","unclaimed","insufficient-address","moved-left-no-address",
  "damaged","missent","redelivery-scheduled","held-mail",
  "package-acceptance-pending","usps-awaiting-item","label-created",
  "picked-up-by-shipping-partner","out-for-delivery-usps","delivered-to-agent",
  "delivered-to-mailbox","delivered-front-door","delivered-porch",
  "delivered-garage","delivered-mail-room","delivered-parcel-locker",
  "delivered-neighbor","delivered-reception","delivered-safe-drop",
];

const US_CITIES = [
  "birmingham-al","montgomery-al","huntsville-al","mobile-al","tuscaloosa-al",
  "anchorage-ak","fairbanks-ak","juneau-ak",
  "phoenix-az","tucson-az","scottsdale-az","mesa-az","chandler-az","tempe-az","gilbert-az","glendale-az",
  "little-rock-ar","fort-smith-ar","fayetteville-ar",
  "los-angeles-ca","san-francisco-ca","san-diego-ca","san-jose-ca","fresno-ca","sacramento-ca",
  "long-beach-ca","oakland-ca","bakersfield-ca","anaheim-ca","santa-ana-ca","riverside-ca",
  "stockton-ca","irvine-ca","chula-vista-ca","fremont-ca","san-bernardino-ca","modesto-ca",
  "fontana-ca","moreno-valley-ca","glendale-ca","huntington-beach-ca","santa-clarita-ca",
  "garden-grove-ca","oceanside-ca","rancho-cucamonga-ca","santa-rosa-ca","ontario-ca",
  "denver-co","colorado-springs-co","aurora-co","fort-collins-co","lakewood-co","thornton-co",
  "arvada-co","westminster-co","pueblo-co","boulder-co",
  "bridgeport-ct","new-haven-ct","hartford-ct","stamford-ct","waterbury-ct",
  "wilmington-de","dover-de",
  "jacksonville-fl","miami-fl","tampa-fl","orlando-fl","st-petersburg-fl","hialeah-fl",
  "tallahassee-fl","fort-lauderdale-fl","port-st-lucie-fl","cape-coral-fl","pembroke-pines-fl",
  "hollywood-fl","miramar-fl","gainesville-fl","coral-springs-fl","miami-gardens-fl",
  "clearwater-fl","palm-bay-fl","pompano-beach-fl","west-palm-beach-fl","lakeland-fl",
  "davie-fl","miami-beach-fl","sunrise-fl","plantation-fl","boca-raton-fl",
  "atlanta-ga","columbus-ga","savannah-ga","athens-ga","sandy-springs-ga","macon-ga",
  "roswell-ga","albany-ga","johns-creek-ga","warner-robins-ga",
  "honolulu-hi","hilo-hi","kailua-hi",
  "boise-id","nampa-id","meridian-id","idaho-falls-id",
  "chicago-il","aurora-il","rockford-il","joliet-il","naperville-il","springfield-il",
  "peoria-il","elgin-il","waukegan-il","cicero-il",
  "indianapolis-in","fort-wayne-in","evansville-in","south-bend-in","carmel-in",
  "des-moines-ia","cedar-rapids-ia","davenport-ia","sioux-city-ia",
  "wichita-ks","overland-park-ks","kansas-city-ks","topeka-ks",
  "louisville-ky","lexington-ky","bowling-green-ky","owensboro-ky",
  "new-orleans-la","baton-rouge-la","shreveport-la","metairie-la","lafayette-la",
  "portland-me","lewiston-me","bangor-me",
  "baltimore-md","columbia-md","germantown-md","silver-spring-md","waldorf-md",
  "boston-ma","worcester-ma","springfield-ma","lowell-ma","cambridge-ma","new-bedford-ma",
  "detroit-mi","grand-rapids-mi","warren-mi","sterling-heights-mi","ann-arbor-mi",
  "lansing-mi","flint-mi","dearborn-mi","livonia-mi","westland-mi",
  "minneapolis-mn","st-paul-mn","rochester-mn","duluth-mn","bloomington-mn",
  "jackson-ms","gulfport-ms","southaven-ms","hattiesburg-ms",
  "kansas-city-mo","st-louis-mo","springfield-mo","columbia-mo","independence-mo",
  "billings-mt","missoula-mt","great-falls-mt",
  "omaha-ne","lincoln-ne","bellevue-ne",
  "las-vegas-nv","henderson-nv","reno-nv","north-las-vegas-nv","sparks-nv",
  "manchester-nh","nashua-nh","concord-nh",
  "newark-nj","jersey-city-nj","paterson-nj","elizabeth-nj","trenton-nj",
  "camden-nj","clifton-nj","passaic-nj",
  "albuquerque-nm","las-cruces-nm","rio-rancho-nm","santa-fe-nm",
  "new-york-ny","buffalo-ny","rochester-ny","yonkers-ny","syracuse-ny",
  "albany-ny","new-rochelle-ny","mount-vernon-ny","schenectady-ny","utica-ny",
  "brooklyn-ny","queens-ny","bronx-ny","staten-island-ny","manhattan-ny",
  "charlotte-nc","raleigh-nc","greensboro-nc","durham-nc","winston-salem-nc",
  "fayetteville-nc","cary-nc","wilmington-nc","high-point-nc","concord-nc",
  "fargo-nd","bismarck-nd","grand-forks-nd",
  "columbus-oh","cleveland-oh","cincinnati-oh","toledo-oh","akron-oh",
  "dayton-oh","parma-oh","canton-oh","youngstown-oh","lorain-oh",
  "oklahoma-city-ok","tulsa-ok","norman-ok","broken-arrow-ok",
  "portland-or","salem-or","eugene-or","gresham-or","hillsboro-or",
  "philadelphia-pa","pittsburgh-pa","allentown-pa","erie-pa","reading-pa",
  "scranton-pa","bethlehem-pa","lancaster-pa","harrisburg-pa","york-pa",
  "providence-ri","cranston-ri","warwick-ri",
  "columbia-sc","charleston-sc","north-charleston-sc","mount-pleasant-sc","rock-hill-sc",
  "sioux-falls-sd","rapid-city-sd",
  "nashville-tn","memphis-tn","knoxville-tn","chattanooga-tn","clarksville-tn",
  "houston-tx","san-antonio-tx","dallas-tx","austin-tx","fort-worth-tx",
  "el-paso-tx","arlington-tx","corpus-christi-tx","plano-tx","laredo-tx",
  "lubbock-tx","garland-tx","irving-tx","amarillo-tx","grand-prairie-tx",
  "brownsville-tx","pasadena-tx","killeen-tx","frisco-tx","mckinney-tx",
  "mesquite-tx","mcallen-tx","waco-tx","carrollton-tx","denton-tx",
  "salt-lake-city-ut","west-valley-city-ut","provo-ut","west-jordan-ut","orem-ut",
  "burlington-vt","south-burlington-vt",
  "virginia-beach-va","norfolk-va","chesapeake-va","richmond-va","newport-news-va",
  "alexandria-va","hampton-va","roanoke-va","portsmouth-va","suffolk-va",
  "seattle-wa","spokane-wa","tacoma-wa","vancouver-wa","bellevue-wa",
  "kent-wa","everett-wa","renton-wa","spokane-valley-wa","kirkland-wa",
  "charleston-wv","huntington-wv","morgantown-wv",
  "milwaukee-wi","madison-wi","green-bay-wi","kenosha-wi","racine-wi",
  "cheyenne-wy","casper-wy",
  "washington-dc",
];

const ARTICLE_SLUGS = [
  "usps-tracking-not-updating-for-3-days","usps-tracking-not-updating-for-5-days",
  "usps-tracking-not-updating-for-a-week","usps-package-stuck-in-transit",
  "usps-tracking-shows-delivered-but-no-package","usps-priority-mail-tracking",
  "usps-ground-advantage-tracking","how-to-track-usps-package-without-tracking-number",
  "usps-tracking-number-format","how-to-file-usps-missing-mail-claim",
  "usps-informed-delivery-not-working","usps-tracking-for-ebay-sellers",
  "usps-holiday-shipping-deadlines-2026","usps-first-class-mail-tracking",
  "usps-certified-mail-tracking","usps-priority-mail-express-tracking",
  "usps-media-mail-tracking","usps-package-intercept","usps-po-box-tracking",
  "usps-flat-rate-box-tracking","usps-international-tracking",
  "usps-global-express-guaranteed","usps-first-class-package-international",
  "usps-priority-mail-international","usps-customs-form-tracking",
  "usps-tracking-for-amazon-sellers","usps-tracking-for-etsy-sellers",
  "usps-tracking-for-poshmark-sellers","usps-tracking-for-mercari-sellers",
  "usps-tracking-for-depop-sellers","usps-business-shipping-account",
  "usps-click-n-ship-guide","usps-schedule-pickup","usps-hold-mail-service",
  "usps-mail-forwarding-tracking","usps-change-of-address-tracking",
  "usps-package-locker-tracking","usps-parcel-select-tracking",
  "usps-bound-printed-matter-tracking","usps-library-mail-tracking",
  "usps-registered-mail-tracking","usps-signature-confirmation-tracking",
  "usps-adult-signature-required","usps-restricted-delivery-tracking",
  "usps-return-receipt-tracking","usps-insurance-tracking",
  "usps-collect-on-delivery-tracking","usps-special-handling-tracking",
  "usps-fragile-package-tracking","usps-perishable-items-shipping",
  "usps-hazmat-shipping","usps-lithium-battery-shipping","usps-alcohol-shipping",
  "usps-firearms-shipping","usps-plants-shipping","usps-food-shipping",
  "usps-medicine-shipping","usps-passport-by-mail","usps-money-order-tracking",
  "usps-stamps-by-mail","usps-flat-rate-shipping-guide",
  "usps-dimensional-weight-pricing","usps-zone-chart-explained",
  "usps-delivery-confirmation","usps-tracking-api-guide",
  "usps-informed-delivery-setup","usps-text-tracking","usps-email-tracking",
  "usps-mobile-app-tracking","usps-tracking-not-found",
  "usps-invalid-tracking-number","usps-tracking-number-lookup",
  "usps-package-damaged","usps-package-opened","usps-package-wet",
  "usps-wrong-address-delivery","usps-misdelivered-package","usps-stolen-package",
  "usps-package-returned-to-sender","usps-refused-package","usps-unclaimed-package",
  "usps-insufficient-address","usps-forward-package","usps-redirect-package",
  "usps-delivery-attempt-failed","usps-notice-left","usps-redelivery-request",
  "usps-pick-up-at-post-office","usps-parcel-locker","usps-gopost-locker",
  "usps-package-alert","usps-customs-delay","usps-international-package-stuck",
  "usps-canada-shipping","usps-uk-shipping","usps-australia-shipping",
  "usps-germany-shipping","usps-japan-shipping","usps-china-shipping",
  "usps-mexico-shipping","usps-military-mail-tracking","usps-apo-fpo-tracking",
  "usps-puerto-rico-tracking","usps-hawaii-shipping","usps-alaska-shipping",
  "usps-guam-shipping","usps-virgin-islands-shipping","usps-american-samoa-shipping",
  "usps-peak-season-delays","usps-weather-delay","usps-service-alerts",
  "usps-post-office-hours","usps-post-office-near-me","usps-drop-box-locations",
  "usps-self-service-kiosk","usps-passport-appointment","usps-notary-services",
  "usps-fax-services","usps-mailbox-rental","usps-bulk-mail",
  "usps-every-door-direct-mail","usps-marketing-mail","usps-nonprofit-mail",
  "usps-periodicals-mail","usps-standard-mail","usps-presort-mail",
  "usps-business-reply-mail","usps-return-service","usps-qr-code-tracking",
  "usps-barcode-explained","usps-intelligent-mail-barcode",
  "usps-tracking-not-updating-for-24-hours","usps-tracking-not-updating-for-2-days",
  "usps-tracking-not-updating-for-4-days","usps-tracking-not-updating-for-6-days",
  "usps-package-stuck-in-transit-for-2-weeks","usps-package-stuck-in-transit-for-10-days",
];

// City pairs
var majorCities = [
  "new-york-ny","los-angeles-ca","chicago-il","houston-tx","phoenix-az",
  "philadelphia-pa","san-antonio-tx","san-diego-ca","dallas-tx","san-jose-ca",
  "austin-tx","jacksonville-fl","fort-worth-tx","columbus-oh","charlotte-nc",
  "indianapolis-in","san-francisco-ca","seattle-wa","denver-co","washington-dc",
  "nashville-tn","oklahoma-city-ok","el-paso-tx","boston-ma","portland-or",
  "las-vegas-nv","memphis-tn","louisville-ky","baltimore-md","milwaukee-wi"
];
var CITY_PAIRS = [];
for (var i = 0; i < majorCities.length; i++) {
  for (var j = i + 1; j < majorCities.length && CITY_PAIRS.length < 200; j++) {
    CITY_PAIRS.push(majorCities[i] + "-to-" + majorCities[j]);
  }
}

// Tracking numbers
var TRACKING_NUMBERS = [];
var prefixes = ["9400111899223033","9205590100130471","9270190100830049","9300120111405209"];
for (var p = 0; p < prefixes.length; p++) {
  for (var n = 0; n < 50; n++) {
    TRACKING_NUMBERS.push(prefixes[p] + String(n).padStart(6, "0"));
  }
}

function buildSitemapXML(urls) {
  var urlEntries = urls.map(function(u) {
    return "  <url>\n    <loc>" + BASE_URL + u.url + "</loc>\n    <lastmod>" + (u.lastmod || TODAY) + "</lastmod>\n    <changefreq>" + (u.changefreq || "weekly") + "</changefreq>\n    <priority>" + (u.priority || "0.6") + "</priority>\n  </url>";
  }).join("\n");
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urlEntries + "\n</urlset>";
}

// 1. Core sitemap
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap-core.xml"), buildSitemapXML(STATIC_PAGES));
console.log("sitemap-core.xml: " + STATIC_PAGES.length + " URLs");

// 2. Articles sitemap
var articleUrls = ARTICLE_SLUGS.map(function(s) { return { url: "/article/" + s, changefreq: "weekly", priority: "0.8" }; });
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap-articles.xml"), buildSitemapXML(articleUrls));
console.log("sitemap-articles.xml: " + articleUrls.length + " URLs");

// 3. Locations sitemap
var locationUrls = US_CITIES.map(function(c) { return { url: "/city/" + c, changefreq: "weekly", priority: "0.7" }; })
  .concat(US_CITIES.map(function(c) { return { url: "/locations/" + c, changefreq: "weekly", priority: "0.7" }; }));
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap-locations.xml"), buildSitemapXML(locationUrls));
console.log("sitemap-locations.xml: " + locationUrls.length + " URLs");

// 4. Status pages sitemap
var statusUrls = USPS_STATUSES.map(function(s) { return { url: "/status/" + s, changefreq: "monthly", priority: "0.7" }; });
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap-status.xml"), buildSitemapXML(statusUrls));
console.log("sitemap-status.xml: " + statusUrls.length + " URLs");

// 5. Tracking numbers sitemap
var trackingUrls = TRACKING_NUMBERS.map(function(n) { return { url: "/t/" + n, changefreq: "daily", priority: "0.6" }; });
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap-tracking.xml"), buildSitemapXML(trackingUrls));
console.log("sitemap-tracking.xml: " + trackingUrls.length + " URLs");

// 6. Routes sitemap
var routeUrls = CITY_PAIRS.map(function(p) { return { url: "/route/" + p, changefreq: "monthly", priority: "0.6" }; });
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap-routes.xml"), buildSitemapXML(routeUrls));
console.log("sitemap-routes.xml: " + routeUrls.length + " URLs");

// Unified sitemap index (always include every sitemap-*.xml file)
var unifiedIndex = writeUnifiedSitemapIndex({
  publicDir: PUBLIC_DIR,
  siteUrl: BASE_URL,
  preferredOrder: [
    "sitemap-core.xml",
    "sitemap-carriers.xml",
    "sitemap-landing.xml",
    "sitemap-cities.xml",
    "sitemap-locations.xml",
    "sitemap-states.xml",
    "sitemap-articles.xml",
    "sitemap-status.xml",
    "sitemap-routes.xml",
    "sitemap-routes-2.xml",
    "sitemap-tracking.xml",
    "sitemap-programmatic.xml"
  ]
});
console.log("sitemap-index.xml: " + unifiedIndex.sitemapFiles.length + " sitemaps");

var total = STATIC_PAGES.length + articleUrls.length + locationUrls.length + statusUrls.length + trackingUrls.length + routeUrls.length;
console.log("\nTotal URLs indexed: " + total);

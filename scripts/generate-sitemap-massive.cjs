/**
 * Massive Sitemap Generator — US Postal Tracking
 * Generates 10,000+ URLs across 8 sitemap files
 */

const fs = require('fs');
const path = require('path');
const { writeUnifiedSitemapIndex } = require('./utils/sitemap-index.cjs');

const BASE_URL = 'https://uspostaltracking.com';
const PUBLIC_DIR = path.join(__dirname, '../public');

// ─── DATA ────────────────────────────────────────────────────────────────────

const US_STATES = [
  { name: 'Alabama', abbr: 'AL', slug: 'alabama' },
  { name: 'Alaska', abbr: 'AK', slug: 'alaska' },
  { name: 'Arizona', abbr: 'AZ', slug: 'arizona' },
  { name: 'Arkansas', abbr: 'AR', slug: 'arkansas' },
  { name: 'California', abbr: 'CA', slug: 'california' },
  { name: 'Colorado', abbr: 'CO', slug: 'colorado' },
  { name: 'Connecticut', abbr: 'CT', slug: 'connecticut' },
  { name: 'Delaware', abbr: 'DE', slug: 'delaware' },
  { name: 'Florida', abbr: 'FL', slug: 'florida' },
  { name: 'Georgia', abbr: 'GA', slug: 'georgia' },
  { name: 'Hawaii', abbr: 'HI', slug: 'hawaii' },
  { name: 'Idaho', abbr: 'ID', slug: 'idaho' },
  { name: 'Illinois', abbr: 'IL', slug: 'illinois' },
  { name: 'Indiana', abbr: 'IN', slug: 'indiana' },
  { name: 'Iowa', abbr: 'IA', slug: 'iowa' },
  { name: 'Kansas', abbr: 'KS', slug: 'kansas' },
  { name: 'Kentucky', abbr: 'KY', slug: 'kentucky' },
  { name: 'Louisiana', abbr: 'LA', slug: 'louisiana' },
  { name: 'Maine', abbr: 'ME', slug: 'maine' },
  { name: 'Maryland', abbr: 'MD', slug: 'maryland' },
  { name: 'Massachusetts', abbr: 'MA', slug: 'massachusetts' },
  { name: 'Michigan', abbr: 'MI', slug: 'michigan' },
  { name: 'Minnesota', abbr: 'MN', slug: 'minnesota' },
  { name: 'Mississippi', abbr: 'MS', slug: 'mississippi' },
  { name: 'Missouri', abbr: 'MO', slug: 'missouri' },
  { name: 'Montana', abbr: 'MT', slug: 'montana' },
  { name: 'Nebraska', abbr: 'NE', slug: 'nebraska' },
  { name: 'Nevada', abbr: 'NV', slug: 'nevada' },
  { name: 'New Hampshire', abbr: 'NH', slug: 'new-hampshire' },
  { name: 'New Jersey', abbr: 'NJ', slug: 'new-jersey' },
  { name: 'New Mexico', abbr: 'NM', slug: 'new-mexico' },
  { name: 'New York', abbr: 'NY', slug: 'new-york' },
  { name: 'North Carolina', abbr: 'NC', slug: 'north-carolina' },
  { name: 'North Dakota', abbr: 'ND', slug: 'north-dakota' },
  { name: 'Ohio', abbr: 'OH', slug: 'ohio' },
  { name: 'Oklahoma', abbr: 'OK', slug: 'oklahoma' },
  { name: 'Oregon', abbr: 'OR', slug: 'oregon' },
  { name: 'Pennsylvania', abbr: 'PA', slug: 'pennsylvania' },
  { name: 'Rhode Island', abbr: 'RI', slug: 'rhode-island' },
  { name: 'South Carolina', abbr: 'SC', slug: 'south-carolina' },
  { name: 'South Dakota', abbr: 'SD', slug: 'south-dakota' },
  { name: 'Tennessee', abbr: 'TN', slug: 'tennessee' },
  { name: 'Texas', abbr: 'TX', slug: 'texas' },
  { name: 'Utah', abbr: 'UT', slug: 'utah' },
  { name: 'Vermont', abbr: 'VT', slug: 'vermont' },
  { name: 'Virginia', abbr: 'VA', slug: 'virginia' },
  { name: 'Washington', abbr: 'WA', slug: 'washington' },
  { name: 'West Virginia', abbr: 'WV', slug: 'west-virginia' },
  { name: 'Wisconsin', abbr: 'WI', slug: 'wisconsin' },
  { name: 'Wyoming', abbr: 'WY', slug: 'wyoming' },
  { name: 'District of Columbia', abbr: 'DC', slug: 'district-of-columbia' },
];

const CITIES_BY_STATE = {
  'alabama': ['birmingham', 'montgomery', 'huntsville', 'mobile', 'tuscaloosa', 'hoover', 'dothan', 'auburn', 'decatur', 'madison'],
  'alaska': ['anchorage', 'fairbanks', 'juneau', 'sitka', 'ketchikan', 'wasilla', 'kenai', 'kodiak', 'bethel', 'palmer'],
  'arizona': ['phoenix', 'tucson', 'mesa', 'chandler', 'scottsdale', 'glendale', 'gilbert', 'tempe', 'peoria', 'surprise', 'yuma', 'avondale', 'flagstaff', 'goodyear', 'lake-havasu-city'],
  'arkansas': ['little-rock', 'fort-smith', 'fayetteville', 'springdale', 'jonesboro', 'north-little-rock', 'conway', 'rogers', 'bentonville', 'pine-bluff'],
  'california': ['los-angeles', 'san-diego', 'san-jose', 'san-francisco', 'fresno', 'sacramento', 'long-beach', 'oakland', 'bakersfield', 'anaheim', 'santa-ana', 'riverside', 'stockton', 'irvine', 'chula-vista', 'fremont', 'san-bernardino', 'modesto', 'fontana', 'moreno-valley', 'glendale', 'huntington-beach', 'santa-clarita', 'garden-grove', 'oceanside', 'rancho-cucamonga', 'santa-rosa', 'ontario', 'elk-grove', 'corona'],
  'colorado': ['denver', 'colorado-springs', 'aurora', 'fort-collins', 'lakewood', 'thornton', 'arvada', 'westminster', 'pueblo', 'centennial', 'boulder', 'highlands-ranch', 'greeley', 'longmont', 'loveland'],
  'connecticut': ['bridgeport', 'new-haven', 'stamford', 'hartford', 'waterbury', 'norwalk', 'danbury', 'new-britain', 'west-hartford', 'greenwich'],
  'delaware': ['wilmington', 'dover', 'newark', 'middletown', 'smyrna', 'milford', 'seaford', 'georgetown', 'elsmere', 'new-castle'],
  'florida': ['jacksonville', 'miami', 'tampa', 'orlando', 'st-petersburg', 'hialeah', 'tallahassee', 'fort-lauderdale', 'port-st-lucie', 'cape-coral', 'pembroke-pines', 'hollywood', 'miramar', 'gainesville', 'coral-springs', 'miami-gardens', 'clearwater', 'palm-bay', 'pompano-beach', 'west-palm-beach', 'lakeland', 'davie', 'miami-beach', 'sunrise', 'plantation', 'boca-raton', 'deltona', 'largo', 'palm-coast', 'deerfield-beach'],
  'georgia': ['atlanta', 'columbus', 'savannah', 'athens', 'sandy-springs', 'macon', 'roswell', 'johns-creek', 'albany', 'warner-robins', 'alpharetta', 'marietta', 'valdosta', 'smyrna', 'brookhaven'],
  'hawaii': ['honolulu', 'pearl-city', 'hilo', 'kailua', 'waipahu', 'kaneohe', 'mililani', 'kahului', 'ewa-beach', 'kihei'],
  'idaho': ['boise', 'nampa', 'meridian', 'idaho-falls', 'pocatello', 'caldwell', 'coeur-dalene', 'twin-falls', 'lewiston', 'post-falls'],
  'illinois': ['chicago', 'aurora', 'joliet', 'naperville', 'rockford', 'springfield', 'elgin', 'peoria', 'champaign', 'waukegan', 'cicero', 'bloomington', 'arlington-heights', 'evanston', 'decatur'],
  'indiana': ['indianapolis', 'fort-wayne', 'evansville', 'south-bend', 'carmel', 'fishers', 'bloomington', 'hammond', 'gary', 'muncie', 'lafayette', 'terre-haute', 'kokomo', 'anderson', 'noblesville'],
  'iowa': ['des-moines', 'cedar-rapids', 'davenport', 'sioux-city', 'iowa-city', 'waterloo', 'council-bluffs', 'ames', 'west-des-moines', 'dubuque'],
  'kansas': ['wichita', 'overland-park', 'kansas-city', 'olathe', 'topeka', 'lawrence', 'shawnee', 'manhattan', 'lenexa', 'salina'],
  'kentucky': ['louisville', 'lexington', 'bowling-green', 'owensboro', 'covington', 'richmond', 'georgetown', 'florence', 'hopkinsville', 'nicholasville'],
  'louisiana': ['new-orleans', 'baton-rouge', 'shreveport', 'metairie', 'lafayette', 'lake-charles', 'kenner', 'bossier-city', 'monroe', 'alexandria'],
  'maine': ['portland', 'lewiston', 'bangor', 'south-portland', 'auburn', 'biddeford', 'sanford', 'saco', 'westbrook', 'augusta'],
  'maryland': ['baltimore', 'columbia', 'germantown', 'silver-spring', 'waldorf', 'glen-burnie', 'ellicott-city', 'dundalk', 'rockville', 'gaithersburg', 'annapolis', 'bowie', 'towson', 'aspen-hill', 'wheaton'],
  'massachusetts': ['boston', 'worcester', 'springfield', 'lowell', 'cambridge', 'new-bedford', 'brockton', 'quincy', 'lynn', 'fall-river', 'newton', 'somerville', 'lawrence', 'framingham', 'haverhill'],
  'michigan': ['detroit', 'grand-rapids', 'warren', 'sterling-heights', 'ann-arbor', 'lansing', 'flint', 'dearborn', 'livonia', 'troy', 'westland', 'farmington-hills', 'kalamazoo', 'wyoming', 'southfield'],
  'minnesota': ['minneapolis', 'saint-paul', 'rochester', 'duluth', 'bloomington', 'brooklyn-park', 'plymouth', 'saint-cloud', 'eagan', 'woodbury', 'maple-grove', 'coon-rapids', 'burnsville', 'blaine', 'lakeville'],
  'mississippi': ['jackson', 'gulfport', 'southaven', 'hattiesburg', 'biloxi', 'meridian', 'tupelo', 'olive-branch', 'horn-lake', 'clinton'],
  'missouri': ['kansas-city', 'saint-louis', 'springfield', 'columbia', 'independence', 'lees-summit', 'ofallon', 'saint-joseph', 'saint-charles', 'blue-springs', 'joplin', 'chesterfield', 'jefferson-city', 'cape-girardeau', 'florissant'],
  'montana': ['billings', 'missoula', 'great-falls', 'bozeman', 'butte', 'helena', 'kalispell', 'havre', 'anaconda', 'miles-city'],
  'nebraska': ['omaha', 'lincoln', 'bellevue', 'grand-island', 'kearney', 'fremont', 'hastings', 'north-platte', 'norfolk', 'columbus'],
  'nevada': ['las-vegas', 'henderson', 'reno', 'north-las-vegas', 'sparks', 'carson-city', 'fernley', 'elko', 'mesquite', 'boulder-city'],
  'new-hampshire': ['manchester', 'nashua', 'concord', 'derry', 'dover', 'rochester', 'salem', 'merrimack', 'hudson', 'londonderry'],
  'new-jersey': ['newark', 'jersey-city', 'paterson', 'elizabeth', 'trenton', 'camden', 'clifton', 'passaic', 'union-city', 'east-orange', 'bayonne', 'vineland', 'new-brunswick', 'perth-amboy', 'hoboken'],
  'new-mexico': ['albuquerque', 'las-cruces', 'rio-rancho', 'santa-fe', 'roswell', 'farmington', 'clovis', 'hobbs', 'alamogordo', 'carlsbad'],
  'new-york': ['new-york-city', 'buffalo', 'rochester', 'yonkers', 'syracuse', 'albany', 'new-rochelle', 'mount-vernon', 'schenectady', 'utica', 'white-plains', 'hempstead', 'troy', 'niagara-falls', 'binghamton'],
  'north-carolina': ['charlotte', 'raleigh', 'greensboro', 'durham', 'winston-salem', 'fayetteville', 'cary', 'wilmington', 'high-point', 'concord', 'greenville', 'asheville', 'gastonia', 'jacksonville', 'chapel-hill'],
  'north-dakota': ['fargo', 'bismarck', 'grand-forks', 'minot', 'west-fargo', 'williston', 'dickinson', 'mandan', 'jamestown', 'wahpeton'],
  'ohio': ['columbus', 'cleveland', 'cincinnati', 'toledo', 'akron', 'dayton', 'parma', 'canton', 'youngstown', 'lorain', 'hamilton', 'springfield', 'kettering', 'elyria', 'lakewood'],
  'oklahoma': ['oklahoma-city', 'tulsa', 'norman', 'broken-arrow', 'lawton', 'edmond', 'moore', 'midwest-city', 'enid', 'stillwater'],
  'oregon': ['portland', 'salem', 'eugene', 'gresham', 'hillsboro', 'beaverton', 'bend', 'medford', 'springfield', 'corvallis', 'albany', 'tigard', 'lake-oswego', 'keizer', 'grants-pass'],
  'pennsylvania': ['philadelphia', 'pittsburgh', 'allentown', 'erie', 'reading', 'scranton', 'bethlehem', 'lancaster', 'harrisburg', 'altoona', 'york', 'wilkes-barre', 'chester', 'williamsport', 'easton'],
  'rhode-island': ['providence', 'cranston', 'warwick', 'pawtucket', 'east-providence', 'woonsocket', 'coventry', 'north-providence', 'cumberland', 'west-warwick'],
  'south-carolina': ['columbia', 'charleston', 'north-charleston', 'mount-pleasant', 'rock-hill', 'greenville', 'summerville', 'goose-creek', 'hilton-head-island', 'florence'],
  'south-dakota': ['sioux-falls', 'rapid-city', 'aberdeen', 'brookings', 'watertown', 'mitchell', 'yankton', 'pierre', 'huron', 'spearfish'],
  'tennessee': ['memphis', 'nashville', 'knoxville', 'chattanooga', 'clarksville', 'murfreesboro', 'franklin', 'jackson', 'johnson-city', 'bartlett', 'hendersonville', 'kingsport', 'collierville', 'smyrna', 'cleveland'],
  'texas': ['houston', 'san-antonio', 'dallas', 'austin', 'fort-worth', 'el-paso', 'arlington', 'corpus-christi', 'plano', 'laredo', 'lubbock', 'garland', 'irving', 'amarillo', 'grand-prairie', 'brownsville', 'mckinney', 'frisco', 'pasadena', 'mesquite', 'killeen', 'mcallen', 'carrollton', 'midland', 'waco', 'denton', 'abilene', 'beaumont', 'odessa', 'round-rock'],
  'utah': ['salt-lake-city', 'west-valley-city', 'provo', 'west-jordan', 'orem', 'sandy', 'ogden', 'st-george', 'layton', 'south-jordan', 'taylorsville', 'logan', 'lehi', 'murray', 'draper'],
  'vermont': ['burlington', 'south-burlington', 'rutland', 'barre', 'montpelier', 'winooski', 'st-albans', 'newport', 'vergennes', 'middlebury'],
  'virginia': ['virginia-beach', 'norfolk', 'chesapeake', 'richmond', 'newport-news', 'alexandria', 'hampton', 'roanoke', 'portsmouth', 'suffolk', 'lynchburg', 'harrisonburg', 'leesburg', 'charlottesville', 'danville'],
  'washington': ['seattle', 'spokane', 'tacoma', 'vancouver', 'bellevue', 'kent', 'everett', 'renton', 'spokane-valley', 'kirkland', 'bellingham', 'kennewick', 'yakima', 'redmond', 'marysville'],
  'west-virginia': ['charleston', 'huntington', 'parkersburg', 'morgantown', 'wheeling', 'weirton', 'fairmont', 'martinsburg', 'beckley', 'clarksburg'],
  'wisconsin': ['milwaukee', 'madison', 'green-bay', 'kenosha', 'racine', 'appleton', 'waukesha', 'oshkosh', 'eau-claire', 'janesville', 'west-allis', 'la-crosse', 'sheboygan', 'wauwatosa', 'fond-du-lac'],
  'wyoming': ['cheyenne', 'casper', 'laramie', 'gillette', 'rock-springs', 'sheridan', 'green-river', 'evanston', 'riverton', 'jackson'],
  'district-of-columbia': ['washington'],
};

const ARTICLE_KEYWORDS = [
  'usps-tracking-not-updating', 'usps-package-stuck-in-transit', 'usps-tracking-number-format',
  'usps-delivery-times', 'usps-priority-mail-tracking', 'usps-first-class-tracking',
  'usps-ground-advantage-tracking', 'usps-express-mail-tracking', 'usps-certified-mail-tracking',
  'usps-registered-mail-tracking', 'usps-media-mail-tracking', 'usps-flat-rate-box-tracking',
  'usps-informed-delivery', 'usps-missing-package', 'usps-lost-package',
  'usps-damaged-package', 'usps-insurance-claim', 'usps-package-delayed',
  'usps-out-for-delivery', 'usps-delivered-not-received', 'usps-wrong-address',
  'usps-return-to-sender', 'usps-held-at-post-office', 'usps-redelivery',
  'usps-package-intercept', 'usps-change-of-address', 'usps-po-box-tracking',
  'usps-international-tracking', 'usps-customs-delay', 'usps-import-duty',
  'usps-global-express-guaranteed', 'usps-priority-mail-international',
  'usps-first-class-mail-international', 'usps-tracking-history',
  'usps-estimated-delivery-date', 'usps-sunday-delivery', 'usps-holiday-schedule',
  'usps-peak-season-delays', 'usps-weather-delay', 'usps-natural-disaster-delay',
  'usps-tracking-app', 'usps-text-tracking', 'usps-email-tracking',
  'usps-api-tracking', 'usps-bulk-tracking', 'usps-business-tracking',
  'usps-ecommerce-shipping', 'usps-amazon-tracking', 'usps-ebay-tracking',
  'usps-etsy-tracking', 'usps-shopify-tracking', 'usps-woocommerce-tracking',
  'usps-shipping-calculator', 'usps-postage-rates', 'usps-shipping-zones',
  'usps-dimensional-weight', 'usps-package-size-limits', 'usps-prohibited-items',
  'usps-hazmat-shipping', 'usps-alcohol-shipping', 'usps-firearms-shipping',
  'usps-medication-shipping', 'usps-perishable-shipping', 'usps-fragile-items',
  'usps-signature-required', 'usps-adult-signature', 'usps-restricted-delivery',
  'usps-certified-mail-vs-priority', 'usps-priority-vs-first-class',
  'usps-ground-advantage-vs-priority', 'usps-flat-rate-vs-weight-based',
  'usps-vs-ups-tracking', 'usps-vs-fedex-tracking', 'usps-vs-dhl-tracking',
  'usps-surepost-tracking', 'usps-fedex-smartpost-tracking',
  'usps-parcel-select-tracking', 'usps-library-mail-tracking',
  'usps-bound-printed-matter', 'usps-presorted-mail', 'usps-bulk-mail',
  'usps-marketing-mail', 'usps-periodicals-tracking', 'usps-nonprofit-mail',
  'usps-click-n-ship', 'usps-online-label', 'usps-print-postage',
  'usps-schedule-pickup', 'usps-drop-off-locations', 'usps-post-office-hours',
  'usps-passport-services', 'usps-money-order', 'usps-po-box-rental',
  'usps-mail-hold', 'usps-vacation-hold', 'usps-forward-mail',
  'usps-premium-forwarding', 'usps-mail-recovery', 'usps-dead-letter-office',
  'usps-tracking-number-lookup', 'usps-package-weight', 'usps-package-dimensions',
  'usps-shipping-label-format', 'usps-barcode-format', 'usps-impb-barcode',
  'usps-intelligent-mail-barcode', 'usps-delivery-confirmation',
  'usps-signature-confirmation', 'usps-return-receipt', 'usps-electronic-return-receipt',
  'usps-special-handling', 'usps-fragile-sticker', 'usps-do-not-bend',
  'usps-live-animals', 'usps-plants-shipping', 'usps-food-shipping',
  'usps-wine-shipping', 'usps-tobacco-shipping', 'usps-lithium-battery',
  'usps-aerosol-shipping', 'usps-dry-ice-shipping', 'usps-perfume-shipping',
  'usps-nail-polish-shipping', 'usps-paint-shipping', 'usps-ammunition-shipping',
];

const TRACKING_STATUSES = [
  'in-transit-to-next-facility', 'out-for-delivery', 'delivered', 'shipping-label-created',
  'arrived-at-hub', 'departed-facility', 'alert-notice-left', 'held-at-post-office',
  'in-transit-arriving-late', 'departed-shipping-partner-facility', 'arrived-at-post-office',
  'accepted-at-usps-origin-facility', 'usps-in-possession-of-item', 'forwarded',
  'return-to-sender', 'delivered-to-agent', 'available-for-pickup', 'business-closed',
  'no-such-number', 'insufficient-address', 'unclaimed', 'refused',
  'attempted-delivery', 'delivery-exception', 'customs-clearance',
  'international-dispatch', 'international-arrival', 'customs-delay',
  'processing-at-usps-facility', 'sorting-complete', 'en-route',
  'in-transit-to-destination', 'package-acceptance-pending', 'pre-shipment',
  'electronic-shipping-info-received', 'origin-post-preparing-shipment',
  'inbound-into-customs', 'customs-examination', 'released-by-customs',
  'outbound-customs', 'arrived-at-destination-country', 'delivered-abroad',
  'return-to-sender-processed', 'missent', 'redelivery-scheduled',
  'delivery-attempted-no-access', 'package-damaged', 'contents-missing',
  'package-received-after-cutoff', 'held-for-postage', 'addressee-unknown',
];

const TRACKING_NUMBERS_SAMPLE = [];
for (let i = 0; i < 500; i++) {
  const num = '9400111899' + String(Math.floor(Math.random() * 9999999999999)).padStart(13, '0');
  TRACKING_NUMBERS_SAMPLE.push(num);
}

// ─── SITEMAP BUILDER ─────────────────────────────────────────────────────────

function buildSitemapXML(urls, priority = '0.8', changefreq = 'weekly') {
  const urlEntries = urls.map(url => {
    const p = url.priority || priority;
    const cf = url.changefreq || changefreq;
    const loc = typeof url === 'string' ? url : url.loc;
    return `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${cf}</changefreq>
    <priority>${p}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

function buildSitemapIndex(sitemaps) {
  const entries = sitemaps.map(s => `  <sitemap>
    <loc>${BASE_URL}/${s}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

// ─── GENERATE ALL SITEMAPS ───────────────────────────────────────────────────

console.log('🗺️  Generating massive sitemap...\n');

// 1. MAIN SITEMAP (core pages)
const mainUrls = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/locations', priority: '0.9', changefreq: 'weekly' },
  { loc: '/article', priority: '0.9', changefreq: 'weekly' },
  { loc: '/guides', priority: '0.8', changefreq: 'weekly' },
  { loc: '/faq', priority: '0.8', changefreq: 'monthly' },
  { loc: '/about', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.4', changefreq: 'yearly' },
  { loc: '/sitemap', priority: '0.5', changefreq: 'weekly' },
];
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-core.xml'), buildSitemapXML(mainUrls, '0.8', 'daily'));
console.log(`✅ sitemap-core.xml — ${mainUrls.length} URLs`);

// 2. ARTICLES SITEMAP
const articleUrls = ARTICLE_KEYWORDS.map(kw => ({
  loc: `/article/${kw}`,
  priority: '0.8',
  changefreq: 'monthly',
}));
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-articles.xml'), buildSitemapXML(articleUrls, '0.8', 'monthly'));
console.log(`✅ sitemap-articles.xml — ${articleUrls.length} URLs`);

// 3. STATUS PAGES SITEMAP
const statusUrls = TRACKING_STATUSES.map(s => ({
  loc: `/status/${s}`,
  priority: '0.8',
  changefreq: 'monthly',
}));
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-status.xml'), buildSitemapXML(statusUrls, '0.8', 'monthly'));
console.log(`✅ sitemap-status.xml — ${statusUrls.length} URLs`);

// 4. STATE PAGES SITEMAP (NEW)
const stateUrls = US_STATES.map(s => ({
  loc: `/state/${s.slug}`,
  priority: '0.9',
  changefreq: 'weekly',
}));
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-states.xml'), buildSitemapXML(stateUrls, '0.9', 'weekly'));
console.log(`✅ sitemap-states.xml — ${stateUrls.length} URLs`);

// 5. CITY PAGES SITEMAP (ALL cities from all states)
const allCityUrls = [];
for (const [stateSlug, cities] of Object.entries(CITIES_BY_STATE)) {
  for (const city of cities) {
    allCityUrls.push({
      loc: `/city/${city}-${stateSlug}`,
      priority: '0.8',
      changefreq: 'weekly',
    });
    // Also add the old format
    allCityUrls.push({
      loc: `/city/${city}`,
      priority: '0.7',
      changefreq: 'weekly',
    });
  }
}
// Split into multiple files if too large
const CHUNK_SIZE = 2000;
const cityChunks = [];
for (let i = 0; i < allCityUrls.length; i += CHUNK_SIZE) {
  cityChunks.push(allCityUrls.slice(i, i + CHUNK_SIZE));
}
cityChunks.forEach((chunk, idx) => {
  const filename = idx === 0 ? 'sitemap-locations.xml' : `sitemap-locations-${idx + 1}.xml`;
  fs.writeFileSync(path.join(PUBLIC_DIR, filename), buildSitemapXML(chunk, '0.8', 'weekly'));
  console.log(`✅ ${filename} — ${chunk.length} URLs`);
});

// 6. ROUTE PAGES SITEMAP (city-to-city pairs)
const majorCities = [
  'new-york', 'los-angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
  'san-antonio', 'san-diego', 'dallas', 'san-jose', 'austin', 'jacksonville',
  'fort-worth', 'columbus', 'charlotte', 'indianapolis', 'san-francisco',
  'seattle', 'denver', 'nashville', 'oklahoma-city', 'el-paso', 'washington',
  'boston', 'las-vegas', 'memphis', 'louisville', 'portland', 'baltimore',
  'milwaukee', 'albuquerque', 'tucson', 'fresno', 'sacramento', 'mesa',
  'kansas-city', 'atlanta', 'omaha', 'colorado-springs', 'raleigh',
  'long-beach', 'virginia-beach', 'minneapolis', 'tampa', 'new-orleans',
  'honolulu', 'anaheim', 'aurora', 'santa-ana', 'corpus-christi',
];
const routeUrls = [];
for (let i = 0; i < majorCities.length; i++) {
  for (let j = 0; j < majorCities.length; j++) {
    if (i !== j) {
      routeUrls.push({
        loc: `/route/${majorCities[i]}-to-${majorCities[j]}`,
        priority: '0.7',
        changefreq: 'monthly',
      });
    }
  }
}
const routeChunks = [];
for (let i = 0; i < routeUrls.length; i += CHUNK_SIZE) {
  routeChunks.push(routeUrls.slice(i, i + CHUNK_SIZE));
}
routeChunks.forEach((chunk, idx) => {
  const filename = idx === 0 ? 'sitemap-routes.xml' : `sitemap-routes-${idx + 1}.xml`;
  fs.writeFileSync(path.join(PUBLIC_DIR, filename), buildSitemapXML(chunk, '0.7', 'monthly'));
  console.log(`✅ ${filename} — ${chunk.length} URLs`);
});

// 7. TRACKING NUMBERS SITEMAP
const trackingUrls = TRACKING_NUMBERS_SAMPLE.map(num => ({
  loc: `/t/${num}`,
  priority: '0.6',
  changefreq: 'daily',
}));
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-tracking.xml'), buildSitemapXML(trackingUrls, '0.6', 'daily'));
console.log(`✅ sitemap-tracking.xml — ${trackingUrls.length} URLs`);

// 8. SITEMAP INDEX
const unifiedIndex = writeUnifiedSitemapIndex({
  publicDir: PUBLIC_DIR,
  siteUrl: BASE_URL,
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
console.log(`✅ sitemap-index.xml — ${unifiedIndex.sitemapFiles.length} sitemaps indexed`);

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
const totalUrls = mainUrls.length + articleUrls.length + statusUrls.length +
  stateUrls.length + allCityUrls.length + routeUrls.length + trackingUrls.length;

console.log('\n' + '='.repeat(50));
console.log(`🎯 TOTAL URLs GENERATED: ${totalUrls.toLocaleString()}`);
console.log(`📁 Sitemap files: ${unifiedIndex.sitemapFiles.length + 1}`);
console.log('='.repeat(50));
console.log('\nNext step: Run `node scripts/ping-indexnow.cjs` to notify search engines');

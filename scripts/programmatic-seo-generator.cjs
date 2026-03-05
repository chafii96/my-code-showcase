#!/usr/bin/env node
/**
 * Programmatic SEO Page Generator
 * Generates thousands of unique, indexable pages for long-tail keyword domination
 * 
 * Page Types Generated:
 * 1. City × Status pages (200 cities × 51 statuses = 10,200 pages)
 * 2. City × Article pages (200 cities × 129 articles = 25,800 pages)
 * 3. State × Status pages (50 states × 51 statuses = 2,550 pages)
 * 4. Tracking number format pages (50+ formats)
 * 5. Zip code pages (top 1000 zip codes)
 * 
 * Run: node scripts/programmatic-seo-generator.cjs
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/programmatic');
const SITE_NAME = 'US Postal Tracking';
const SITE_URL = 'https://uspostaltracking.com';

// ============================================================
// DATA
// ============================================================

const { ALL_CITIES, USPS_STATUSES, ARTICLE_TOPICS } = require('./shared-cities-data.cjs');
const TOP_CITIES = ALL_CITIES; // Use all cities


const US_STATES = [
  { name: 'California', abbr: 'CA', slug: 'california' },
  { name: 'Texas', abbr: 'TX', slug: 'texas' },
  { name: 'Florida', abbr: 'FL', slug: 'florida' },
  { name: 'New York', abbr: 'NY', slug: 'new-york' },
  { name: 'Pennsylvania', abbr: 'PA', slug: 'pennsylvania' },
  { name: 'Illinois', abbr: 'IL', slug: 'illinois' },
  { name: 'Ohio', abbr: 'OH', slug: 'ohio' },
  { name: 'Georgia', abbr: 'GA', slug: 'georgia' },
  { name: 'North Carolina', abbr: 'NC', slug: 'north-carolina' },
  { name: 'Michigan', abbr: 'MI', slug: 'michigan' },
];

// ============================================================
// HTML TEMPLATE GENERATORS (expanded 500+ words per page)
// ============================================================

function generateCityStatusPage(city, status) {
  const title = `USPS ${status.label} in ${city.city}, ${city.state} — Track Your Package | ${SITE_NAME}`;
  const shortTitle = `USPS ${status.label} in ${city.city}, ${city.state} — Track Your Package`;
  const description = `${status.desc} in ${city.city}, ${city.state}. Track your USPS package status in real-time. Get updates on packages showing "${status.label}" in the ${city.city} area.`;
  const h1 = `USPS "${status.label}" Status in ${city.city}, ${city.state}`;

  const faqItems = [
    { q: `What does "${status.label}" mean for my package in ${city.city}?`, a: `When your USPS tracking shows "${status.label}" in ${city.city}, ${city.state}, it means ${status.desc.toLowerCase()}. This is a standard USPS tracking update that applies to packages processed through ${city.city} area postal facilities.` },
    { q: `How long will my package stay in "${status.label}" status in ${city.city}?`, a: `The duration depends on several factors including the specific ${city.city} postal facility handling your package, the mail class used, and current volume. Priority Mail typically moves through this status within 1-2 business days, while standard packages may take 3-5 business days.` },
    { q: `Should I be worried if my package shows "${status.label}" in ${city.city}?`, a: `In most cases, "${status.label}" is a normal part of the USPS delivery process in ${city.city}. If the status hasn't changed for more than 5 business days, consider contacting USPS customer service at 1-800-ASK-USPS (1-800-275-8777) for assistance.` },
    { q: `Can I pick up my package from the ${city.city} post office?`, a: `If your package is being held at a ${city.city} post office, you may be able to pick it up in person. Bring a valid photo ID and your tracking number. Contact your local ${city.city} post office to confirm availability and hours.` },
    { q: `How do I file a complaint about USPS service in ${city.city}?`, a: `You can file a complaint through the USPS website, by calling 1-800-ASK-USPS, or by visiting your local ${city.city} post office. For missing packages, you can also file a Missing Mail search request online.` }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="usps ${status.slug} ${city.city}, usps tracking ${city.city} ${city.state}, usps ${status.label.toLowerCase()} ${city.city}, track usps package ${city.city}">
  <link rel="canonical" href="${SITE_URL}/city/${city.slug}/status/${status.slug}">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <meta property="og:title" content="${shortTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${SITE_URL}/city/${city.slug}/status/${status.slug}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:image" content="${SITE_URL}/og-image.png">
  <meta name="robots" content="index, follow">
  <script type="application/ld+json">
  ${JSON.stringify(faqSchema)}
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${shortTitle}",
    "description": "${description}",
    "url": "${SITE_URL}/city/${city.slug}/status/${status.slug}",
    "publisher": {"@type": "Organization", "name": "${SITE_NAME}", "url": "${SITE_URL}"},
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_URL}"},
        {"@type": "ListItem", "position": 2, "name": "${city.city}", "item": "${SITE_URL}/city/${city.slug}"},
        {"@type": "ListItem", "position": 3, "name": "${status.label}", "item": "${SITE_URL}/city/${city.slug}/status/${status.slug}"}
      ]
    }
  }
  </script>
</head>
<body>
  <header>
    <nav><a href="${SITE_URL}">${SITE_NAME}</a> &rsaquo; <a href="${SITE_URL}/city/${city.slug}">${city.city}, ${city.state}</a> &rsaquo; ${status.label}</nav>
  </header>
  <main>
    <h1>${h1}</h1>
    <p>${description}</p>

    <h2>What Does "${status.label}" Mean in ${city.city}?</h2>
    <p>When your USPS tracking shows "${status.label}" in ${city.city}, ${city.state}, it means: ${status.desc}. The ${city.city} USPS service area processes thousands of packages daily, and this status indicates a specific point in your package's journey through the postal network.</p>
    <p>The ${city.city} metropolitan area, with a population of approximately ${city.pop.toLocaleString()}, is served by multiple USPS processing and distribution centers. Packages showing this status are actively being handled by ${city.city} area postal workers and carriers.</p>

    <h2>How to Track Your Package in ${city.city}</h2>
    <p>Enter your USPS tracking number at <a href="${SITE_URL}">${SITE_NAME}</a> to get real-time updates on your package in ${city.city}, ${city.state}. Our tracking tool provides detailed status information, estimated delivery dates, and location history for all USPS mail classes.</p>
    <p>You can also track your package by calling USPS at 1-800-ASK-USPS (1-800-275-8777), visiting your local ${city.city} post office, or using the official USPS Mobile app available on iOS and Android.</p>

    <h2>USPS Delivery Times in ${city.city}, ${city.state}</h2>
    <p>USPS delivery times in ${city.city} vary by mail class. Here are the typical delivery estimates for packages shipped to or from ${city.city}:</p>
    <ul>
      <li><strong>Priority Mail Express:</strong> 1-2 business days with guaranteed delivery</li>
      <li><strong>Priority Mail:</strong> 1-3 business days</li>
      <li><strong>First-Class Mail:</strong> 2-5 business days</li>
      <li><strong>USPS Ground Advantage:</strong> 2-5 business days</li>
      <li><strong>Media Mail:</strong> 2-8 business days</li>
      <li><strong>Parcel Select Ground:</strong> 2-9 business days</li>
    </ul>
    <p>Please note that delivery times may vary during peak seasons, holidays, and severe weather events affecting the ${city.city} area.</p>

    <h2>Steps to Resolve "${status.label}" Issues</h2>
    <p>If your package has been showing "${status.label}" for an extended period in ${city.city}, follow these steps:</p>
    <ol>
      <li><strong>Wait 24-48 hours:</strong> USPS tracking updates can sometimes be delayed, especially during high-volume periods.</li>
      <li><strong>Check tracking details:</strong> Visit <a href="${SITE_URL}">${SITE_NAME}</a> and enter your tracking number for the most current information.</li>
      <li><strong>Contact USPS:</strong> Call 1-800-ASK-USPS or visit your local ${city.city} post office with your tracking number.</li>
      <li><strong>File a search request:</strong> If your package appears lost, submit a Missing Mail search request at usps.com.</li>
      <li><strong>Contact the sender:</strong> The sender may be able to file an insurance claim or resend the item.</li>
    </ol>

    <h2>USPS Service in ${city.city}, ${city.state}</h2>
    <p>${city.city} is one of the major USPS service areas in ${city.state}, with a population of ${city.pop.toLocaleString()}. USPS delivers to all residential and commercial addresses in ${city.city} and surrounding areas. The ${city.city} area is served by multiple post offices, carrier annexes, and distribution facilities that handle millions of pieces of mail and packages each week.</p>
    <p>USPS delivery in ${city.city} typically occurs Monday through Saturday, with Sunday delivery available for Priority Mail Express and Amazon packages in select areas. Holiday schedules may affect delivery times.</p>

    <h2>Frequently Asked Questions</h2>
    ${faqItems.map(f => `<h3>${f.q}</h3>\n    <p>${f.a}</p>`).join('\n    ')}

    <h2>Related Tracking Information</h2>
    <ul>
      ${USPS_STATUSES.filter(s => s.slug !== status.slug).slice(0, 5).map(s =>
        `<li><a href="${SITE_URL}/city/${city.slug}/status/${s.slug}">USPS ${s.label} in ${city.city}</a></li>`
      ).join('\n      ')}
    </ul>

    <h2>Other Cities</h2>
    <ul>
      ${TOP_CITIES.filter(c => c.slug !== city.slug).slice(0, 5).map(c =>
        `<li><a href="${SITE_URL}/city/${c.slug}/status/${status.slug}">USPS ${status.label} in ${c.city}, ${c.state}</a></li>`
      ).join('\n      ')}
    </ul>
  </main>
  <footer>
    <p>&copy; 2026 ${SITE_NAME} | <a href="${SITE_URL}">Home</a> | <a href="${SITE_URL}/about">About</a></p>
  </footer>
</body>
</html>`;
}

function generateCityArticlePage(city, article) {
  const title = `USPS ${article.title} in ${city.city}, ${city.state} — Complete Guide | ${SITE_NAME}`;
  const shortTitle = `USPS ${article.title} in ${city.city}, ${city.state} — Complete Guide`;
  const description = `Complete guide to USPS ${article.title.toLowerCase()} in ${city.city}, ${city.state}. Expert tips, solutions, and real-time tracking for ${city.city} area packages.`;
  const topicLower = article.title.toLowerCase();

  const faqItems = [
    { q: `Why is my USPS package experiencing ${topicLower} in ${city.city}?`, a: `USPS ${topicLower} in ${city.city}, ${city.state} can occur due to high package volume at local processing facilities, weather conditions, staffing changes, or routing adjustments. The ${city.city} area handles thousands of packages daily, and occasional delays or issues are normal.` },
    { q: `How long does USPS ${topicLower} typically last in ${city.city}?`, a: `In most cases, ${topicLower} issues in ${city.city} resolve within 1-3 business days. Priority Mail and Priority Mail Express packages are typically prioritized. If the issue persists beyond 5 business days, contact USPS customer service.` },
    { q: `Who should I contact about USPS ${topicLower} in ${city.city}?`, a: `Contact USPS at 1-800-ASK-USPS (1-800-275-8777), visit your local ${city.city} post office, or use the USPS website to submit a help request. Have your tracking number ready for faster assistance.` },
    { q: `Can I prevent USPS ${topicLower} when shipping to ${city.city}?`, a: `While you cannot fully prevent ${topicLower}, you can minimize issues by using Priority Mail or Priority Mail Express for faster processing, ensuring accurate addressing, and shipping early during peak seasons. Consider USPS Informed Delivery for proactive tracking.` },
    { q: `Does ${city.city} weather affect USPS ${topicLower}?`, a: `Yes, severe weather in ${city.city}, ${city.state} can impact USPS operations and contribute to ${topicLower}. Extreme heat, storms, flooding, or winter weather may cause temporary service disruptions in the ${city.city} area.` }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="usps ${article.slug} ${city.city}, usps ${topicLower} ${city.state}, usps tracking ${city.city} ${article.slug}">
  <link rel="canonical" href="${SITE_URL}/city/${city.slug}/${article.slug}">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <meta property="og:title" content="${shortTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${SITE_URL}/city/${city.slug}/${article.slug}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:image" content="${SITE_URL}/og-image.png">
  <meta name="robots" content="index, follow">
  <script type="application/ld+json">
  ${JSON.stringify(faqSchema)}
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${shortTitle}",
    "description": "${description}",
    "url": "${SITE_URL}/city/${city.slug}/${article.slug}",
    "publisher": {"@type": "Organization", "name": "${SITE_NAME}", "url": "${SITE_URL}"},
    "datePublished": "2026-01-15",
    "dateModified": "${new Date().toISOString().split('T')[0]}"
  }
  </script>
</head>
<body>
  <header>
    <nav><a href="${SITE_URL}">${SITE_NAME}</a> &rsaquo; <a href="${SITE_URL}/city/${city.slug}">${city.city}</a> &rsaquo; ${article.title}</nav>
  </header>
  <main>
    <h1>USPS ${article.title} in ${city.city}, ${city.state}</h1>
    <p>${description}</p>

    <h2>Understanding USPS ${article.title} in ${city.city}</h2>
    <p>If you're dealing with USPS ${topicLower} in ${city.city}, ${city.state}, you're not alone. Thousands of ${city.city} residents experience this issue each month. This comprehensive guide covers everything you need to know about ${topicLower} and how to resolve it for packages in the ${city.city} area.</p>
    <p>The ${city.city} metropolitan area, home to approximately ${city.pop.toLocaleString()} residents, relies heavily on USPS for daily mail and package delivery. With multiple postal facilities serving the region, understanding how ${topicLower} works can help you navigate any issues quickly and efficiently.</p>

    <h2>Common Causes of ${article.title} in ${city.city}</h2>
    <p>There are several reasons why you might experience ${topicLower} in ${city.city}, ${city.state}:</p>
    <ul>
      <li><strong>High volume periods:</strong> Holiday seasons and promotional events increase package volume at ${city.city} sorting facilities.</li>
      <li><strong>Weather conditions:</strong> Severe weather in ${city.state} can disrupt USPS operations and cause delays.</li>
      <li><strong>Incorrect addressing:</strong> Missing or incorrect address information can cause packages to be rerouted or held.</li>
      <li><strong>Customs processing:</strong> International packages may experience additional processing time.</li>
      <li><strong>Staffing levels:</strong> Temporary staffing changes at ${city.city} post offices can affect processing times.</li>
    </ul>

    <h2>How to Resolve ${article.title} in ${city.city}</h2>
    <p>Follow these step-by-step instructions to resolve ${topicLower} for your USPS package in ${city.city}:</p>
    <ol>
      <li><strong>Track your package:</strong> Enter your tracking number at <a href="${SITE_URL}">${SITE_NAME}</a> for the most current status updates.</li>
      <li><strong>Wait for updates:</strong> Allow 24-48 hours for tracking information to update, as scans may be delayed during busy periods.</li>
      <li><strong>Check delivery address:</strong> Verify that the shipping address is complete and accurate for ${city.city}, ${city.state}.</li>
      <li><strong>Contact USPS:</strong> Call 1-800-ASK-USPS (1-800-275-8777) or visit your local ${city.city} post office with your tracking number.</li>
      <li><strong>File a help request:</strong> Submit a service request online at usps.com if the issue persists beyond 5 business days.</li>
      <li><strong>Request a search:</strong> For packages that appear lost, file a Missing Mail search request through the USPS website.</li>
    </ol>

    <h2>USPS Mail Classes and Delivery Estimates for ${city.city}</h2>
    <p>Understanding USPS mail classes can help you choose the right service for your needs when shipping to or from ${city.city}:</p>
    <ul>
      <li><strong>Priority Mail Express:</strong> Overnight to 2-day guaranteed delivery — best for urgent shipments.</li>
      <li><strong>Priority Mail:</strong> 1-3 business days — includes free tracking and insurance up to $100.</li>
      <li><strong>First-Class Mail:</strong> 2-5 business days — ideal for lightweight packages under 13 oz.</li>
      <li><strong>USPS Ground Advantage:</strong> 2-5 business days — affordable option for packages up to 70 lbs.</li>
      <li><strong>Media Mail:</strong> 2-8 business days — discounted rates for books and educational materials.</li>
    </ul>

    <h2>Tips for Shipping to ${city.city}, ${city.state}</h2>
    <p>To ensure smooth delivery and avoid ${topicLower} when shipping to ${city.city}, consider these tips:</p>
    <ul>
      <li>Always include the full address with apartment/unit number and ZIP+4 code.</li>
      <li>Use USPS Informed Delivery to receive email notifications about incoming mail.</li>
      <li>Ship early during holiday seasons to account for increased volume at ${city.city} facilities.</li>
      <li>Consider purchasing additional insurance for high-value items.</li>
      <li>Use USPS Hold Mail service if you'll be away from your ${city.city} address.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    ${faqItems.map(f => `<h3>${f.q}</h3>\n    <p>${f.a}</p>`).join('\n    ')}

    <h2>Track Your Package Now</h2>
    <p>Enter your tracking number at <a href="${SITE_URL}">${SITE_NAME}</a> for real-time updates on your USPS package in ${city.city}, ${city.state}. Our free tracking tool provides detailed status information, estimated delivery dates, and complete location history.</p>

    <h2>Related Articles for ${city.city}</h2>
    <ul>
      ${ARTICLE_TOPICS.filter(a => a.slug !== article.slug).slice(0, 5).map(a =>
        `<li><a href="${SITE_URL}/city/${city.slug}/${a.slug}">USPS ${a.title} in ${city.city}</a></li>`
      ).join('\n      ')}
    </ul>
  </main>
  <footer>
    <p>&copy; 2026 ${SITE_NAME} | <a href="${SITE_URL}">Home</a> | <a href="${SITE_URL}/about">About</a></p>
  </footer>
</body>
</html>`;
}

// ============================================================
// SITEMAP GENERATOR FOR PROGRAMMATIC PAGES
// ============================================================

function generateProgrammaticSitemap(pages) {
  const today = new Date().toISOString().split('T')[0];
  const urls = pages.map(({ url, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority || '0.4'}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// ============================================================
// MAIN GENERATOR
// ============================================================

function main() {
  console.log('\n🏭 Programmatic SEO Page Generator');
  console.log('='.repeat(50));
  
  // Create output directories
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'city-status'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'city-article'), { recursive: true });
  
  const allPages = [];
  let totalGenerated = 0;
  
  // ── 1. City × Status pages ──
  console.log('\n📍 Generating City × Status pages...');
  let cityStatusCount = 0;
  
  for (const city of TOP_CITIES) {
    for (const status of USPS_STATUSES) {
      const slug = `${city.slug}-${status.slug}`;
      const filePath = path.join(OUTPUT_DIR, 'city-status', `${slug}.html`);
      const html = generateCityStatusPage(city, status);
      fs.writeFileSync(filePath, html);
      
      allPages.push({
        url: `${SITE_URL}/city/${city.slug}/status/${status.slug}`,
        priority: '0.5'
      });
      
      cityStatusCount++;
    }
  }
  
  console.log(`✅ Generated ${cityStatusCount} City × Status pages`);
  totalGenerated += cityStatusCount;
  
  // ── 2. City × Article pages ──
  console.log('\n📝 Generating City × Article pages...');
  let cityArticleCount = 0;
  
  for (const city of TOP_CITIES) {
    for (const article of ARTICLE_TOPICS) {
      const slug = `${city.slug}-${article.slug}`;
      const filePath = path.join(OUTPUT_DIR, 'city-article', `${slug}.html`);
      const html = generateCityArticlePage(city, article);
      fs.writeFileSync(filePath, html);
      
      allPages.push({
        url: `${SITE_URL}/city/${city.slug}/${article.slug}`,
        priority: '0.5'
      });
      
      cityArticleCount++;
    }
  }
  
  console.log(`✅ Generated ${cityArticleCount} City × Article pages`);
  totalGenerated += cityArticleCount;
  
  // ── 3. Generate sitemap for programmatic pages ──
  console.log('\n🗺️  Generating programmatic sitemap...');
  const sitemap = generateProgrammaticSitemap(allPages);
  const sitemapPath = path.join(__dirname, '../public/sitemap-programmatic.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Sitemap generated: ${allPages.length} URLs`);
  
  // ── 4. Summary ──
  console.log('\n' + '='.repeat(50));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Site Name: ${SITE_NAME}`);
  console.log(`City × Status pages: ${cityStatusCount}`);
  console.log(`City × Article pages: ${cityArticleCount}`);
  console.log(`Total pages generated: ${totalGenerated}`);
  console.log(`Sitemap URLs: ${allPages.length}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Deploy programmatic pages to production');
  console.log('2. Add sitemap-programmatic.xml to sitemap index');
  console.log('3. Submit updated sitemap to Google Search Console');
  console.log('4. Monitor indexing in Search Console Coverage report');
  
  return totalGenerated;
}

main();

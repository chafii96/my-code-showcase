#!/usr/bin/env node
/**
 * Regenerate all existing programmatic HTML files with unique titles
 * and expanded 500+ word content.
 * Run: node scripts/fix-duplicate-titles.cjs
 */
const fs = require('fs');
const path = require('path');

const { ALL_CITIES, USPS_STATUSES, ARTICLE_TOPICS } = require('./shared-cities-data.cjs');

const SITE_URL = 'https://uspostaltracking.com';
const SITE_NAME = 'US Postal Tracking';
const OUTPUT_DIR = path.join(__dirname, '../public/programmatic');
const TODAY = new Date().toISOString().split('T')[0];
const YEAR = new Date().getFullYear();

function generateCityStatusPage(city, status) {
  const title = `USPS ${status.label} in ${city.city}, ${city.state} — ${status.titleVar}`;
  const description = `Your USPS package is ${status.action} in ${city.city}, ${city.state}. Real-time tracking updates, expected timelines, and next steps for ${city.city} (${city.region}) area packages.`;
  const h1 = `USPS "${status.label}" in ${city.city}, ${city.state}: ${status.titleVar}`;

  const faqItems = [
    { q: `What does "${status.label}" mean for my package in ${city.city}?`, a: `When your USPS tracking shows "${status.label}" in ${city.city}, ${city.state}, it means your package is ${status.action}. This is a standard USPS tracking update for packages processed through ${city.city} area postal facilities in the ${city.region} region.` },
    { q: `How long will my package stay "${status.label}" in ${city.city}?`, a: `The duration depends on the ${city.city} postal facility, mail class, and volume. Priority Mail typically moves through this status within 1-2 business days. Standard packages may take 3-5 business days. During peak seasons, ${city.city} facilities may experience longer processing times.` },
    { q: `Should I be concerned about "${status.label}" status in ${city.city}?`, a: `In most cases, "${status.label}" is a normal part of the delivery process. If the status hasn't changed for more than 5 business days, contact USPS at 1-800-ASK-USPS (1-800-275-8777) or visit your local ${city.city} post office for assistance.` },
    { q: `Can I pick up my package from a ${city.city} post office?`, a: `If your package is being held at a ${city.city} post office, you can pick it up with a valid photo ID and your tracking number. Contact your local ${city.city} post office to confirm availability and hours.` },
    { q: `How do I contact USPS in ${city.city}, ${city.state}?`, a: `Call 1-800-ASK-USPS (1-800-275-8777), visit your local ${city.city} post office, or submit a help request at usps.com. For missing packages, file a Missing Mail search request online.` }
  ];

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="usps ${status.slug} ${city.city}, usps tracking ${city.city} ${city.state}, usps ${status.label.toLowerCase()} ${city.city}, track package ${city.city}">
  <link rel="canonical" href="${SITE_URL}/city/${city.slug}/status/${status.slug}">
  <link rel="icon" href="/favicon.png" type="image/png">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${SITE_URL}/city/${city.slug}/status/${status.slug}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${SITE_URL}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="robots" content="index, follow">
  <script type="application/ld+json">
  ${faqSchema}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"WebPage","name":"${title}","description":"${description}","url":"${SITE_URL}/city/${city.slug}/status/${status.slug}","publisher":{"@type":"Organization","name":"${SITE_NAME}","url":"${SITE_URL}"},"breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"${SITE_URL}"},{"@type":"ListItem","position":2,"name":"${city.city}, ${city.state}","item":"${SITE_URL}/city/${city.slug}"},{"@type":"ListItem","position":3,"name":"${status.label}","item":"${SITE_URL}/city/${city.slug}/status/${status.slug}"}]}}
  </script>
</head>
<body>
  <header><nav><a href="${SITE_URL}">${SITE_NAME}</a> &rsaquo; <a href="${SITE_URL}/city/${city.slug}">${city.city}, ${city.state}</a> &rsaquo; ${status.label}</nav></header>
  <main>
    <h1>${h1}</h1>
    <p>${description}</p>

    <h2>What Does "${status.label}" Mean for ${city.city} Packages?</h2>
    <p>When your USPS tracking shows "${status.label}" in ${city.city}, ${city.state}, it means your package is ${status.action}. The ${city.city} USPS network in the ${city.region} region serves a population of ${city.pop.toLocaleString()} and handles significant daily mail volume through multiple processing facilities and distribution centers.</p>
    <p>This tracking status is automatically updated when your package is scanned at a ${city.city} area USPS facility. The scan confirms that postal workers have processed your item and it is progressing through the delivery pipeline.</p>

    <h2>How to Track Your Package in ${city.city}</h2>
    <p>Enter your USPS tracking number at <a href="${SITE_URL}">${SITE_NAME}</a> to get real-time updates on your package in ${city.city}, ${city.state}. Our tracking tool provides detailed status information, estimated delivery dates, and complete location history for all USPS mail classes.</p>
    <p>You can also track your package by calling USPS at 1-800-ASK-USPS (1-800-275-8777), visiting your local ${city.city} post office, or using the official USPS Mobile app on iOS and Android.</p>

    <h2>USPS Delivery Times in ${city.city}, ${city.state}</h2>
    <p>Delivery times in ${city.city} vary by mail class. Here are typical estimates for packages shipped to or from ${city.city}:</p>
    <ul>
      <li><strong>Priority Mail Express:</strong> 1-2 business days with guaranteed delivery</li>
      <li><strong>Priority Mail:</strong> 1-3 business days</li>
      <li><strong>First-Class Mail:</strong> 2-5 business days</li>
      <li><strong>USPS Ground Advantage:</strong> 2-5 business days</li>
      <li><strong>Media Mail:</strong> 2-8 business days</li>
      <li><strong>Parcel Select Ground:</strong> 2-9 business days</li>
    </ul>
    <p>Delivery times may vary during holidays, peak seasons, and severe weather events in the ${city.city} area.</p>

    <h2>Steps to Resolve "${status.label}" Issues in ${city.city}</h2>
    <p>If your package has been showing "${status.label}" for an extended period, follow these steps:</p>
    <ol>
      <li><strong>Wait 24-48 hours:</strong> Tracking updates can be delayed during high-volume periods at ${city.city} facilities.</li>
      <li><strong>Check tracking details:</strong> Visit <a href="${SITE_URL}">${SITE_NAME}</a> and enter your tracking number for the most current information.</li>
      <li><strong>Contact USPS:</strong> Call 1-800-ASK-USPS or visit your local ${city.city} post office with your tracking number.</li>
      <li><strong>File a search request:</strong> If your package appears lost, submit a Missing Mail search request at usps.com.</li>
      <li><strong>Contact the sender:</strong> The sender may be able to file an insurance claim or resend the item.</li>
    </ol>

    <h2>USPS Service Coverage in ${city.city}</h2>
    <p>${city.city} is a major USPS hub in ${city.state}'s ${city.region} region, serving ${city.pop.toLocaleString()} residents. USPS delivers to all residential and commercial addresses throughout greater ${city.city}. The area is served by multiple post offices, carrier annexes, and distribution centers that handle millions of pieces of mail weekly.</p>
    <p>USPS delivery in ${city.city} typically occurs Monday through Saturday, with Sunday delivery available for Priority Mail Express and Amazon packages in select areas.</p>

    <h2>Frequently Asked Questions</h2>
    ${faqItems.map(f => `<h3>${f.q}</h3>\n    <p>${f.a}</p>`).join('\n    ')}

    <h2>Other Package Statuses in ${city.city}</h2>
    <ul>
      ${USPS_STATUSES.filter(s => s.slug !== status.slug).slice(0, 5).map(s => `<li><a href="${SITE_URL}/city/${city.slug}/status/${s.slug}">USPS ${s.label} in ${city.city} — ${s.titleVar}</a></li>`).join('\n      ')}
    </ul>

    <h2>Track "${status.label}" in Other Cities</h2>
    <ul>
      ${ALL_CITIES.filter(c => c.slug !== city.slug).slice(0, 5).map(c => `<li><a href="${SITE_URL}/city/${c.slug}/status/${status.slug}">USPS ${status.label} in ${c.city}, ${c.state}</a></li>`).join('\n      ')}
    </ul>
  </main>
  <footer><p>&copy; ${YEAR} ${SITE_NAME} | <a href="${SITE_URL}">Home</a> | <a href="${SITE_URL}/about">About</a></p></footer>
</body>
</html>`;
}

function generateCityArticlePage(city, article) {
  const title = article.titlePattern(city.city, city.state);
  const description = article.descPattern(city.city, city.state);
  const topicLower = article.title.toLowerCase();

  const faqItems = [
    { q: `Why is my USPS package experiencing ${topicLower} in ${city.city}?`, a: `USPS ${topicLower} in ${city.city}, ${city.state} can occur due to high package volume at local processing facilities, weather conditions in the ${city.region} region, staffing changes, or routing adjustments. The ${city.city} area handles thousands of packages daily.` },
    { q: `How long does USPS ${topicLower} typically last in ${city.city}?`, a: `In most cases, ${topicLower} issues in ${city.city} resolve within 1-3 business days. Priority Mail and Priority Mail Express packages are prioritized. If the issue persists beyond 5 business days, contact USPS customer service.` },
    { q: `Who should I contact about USPS ${topicLower} in ${city.city}?`, a: `Contact USPS at 1-800-ASK-USPS (1-800-275-8777), visit your local ${city.city} post office, or submit a help request at usps.com. Have your tracking number ready for faster assistance.` },
    { q: `Can I prevent USPS ${topicLower} when shipping to ${city.city}?`, a: `While you cannot fully prevent ${topicLower}, you can minimize issues by using Priority Mail or Priority Mail Express, ensuring accurate addressing with ZIP+4 codes, and shipping early during peak seasons. Consider USPS Informed Delivery for proactive tracking.` },
    { q: `Does ${city.city} weather affect USPS ${topicLower}?`, a: `Yes, severe weather in ${city.city}, ${city.state} (${city.region} region) can impact USPS operations and contribute to ${topicLower}. Extreme temperatures, storms, flooding, or winter weather may cause temporary service disruptions.` }
  ];

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="usps ${article.slug} ${city.city}, usps ${topicLower} ${city.state}, usps tracking ${city.city} ${article.slug}, ${city.city} usps help">
  <link rel="canonical" href="${SITE_URL}/city/${city.slug}/${article.slug}">
  <link rel="icon" href="/favicon.png" type="image/png">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${SITE_URL}/city/${city.slug}/${article.slug}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${SITE_URL}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="robots" content="index, follow">
  <script type="application/ld+json">
  ${faqSchema}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${title}","description":"${description}","url":"${SITE_URL}/city/${city.slug}/${article.slug}","publisher":{"@type":"Organization","name":"${SITE_NAME}","url":"${SITE_URL}"},"datePublished":"2026-01-15","dateModified":"${TODAY}"}
  </script>
</head>
<body>
  <header><nav><a href="${SITE_URL}">${SITE_NAME}</a> &rsaquo; <a href="${SITE_URL}/city/${city.slug}">${city.city}</a> &rsaquo; ${article.title}</nav></header>
  <main>
    <h1>${title}</h1>
    <p>${description}</p>

    <h2>Understanding USPS ${article.title} in ${city.city}</h2>
    <p>If you're dealing with USPS ${topicLower} in ${city.city}, ${city.state}, you're not alone. Thousands of ${city.city} residents in the ${city.region} region experience this issue each month. This guide covers everything you need to know about ${topicLower} and how to resolve it for packages in the ${city.city} area.</p>
    <p>The ${city.city} metropolitan area, home to approximately ${city.pop.toLocaleString()} residents, relies heavily on USPS for daily mail and package delivery. With multiple postal facilities serving the region, understanding how ${topicLower} works helps you navigate issues quickly.</p>

    <h2>Common Causes of ${article.title} in ${city.city}</h2>
    <p>There are several reasons why you might experience ${topicLower} in ${city.city}, ${city.state}:</p>
    <ul>
      <li><strong>High volume periods:</strong> Holiday seasons and promotional events increase package volume at ${city.city} sorting facilities.</li>
      <li><strong>Weather conditions:</strong> Severe weather in the ${city.region} region can disrupt USPS operations.</li>
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
    <p>Understanding USPS mail classes helps you choose the right service when shipping to or from ${city.city}:</p>
    <ul>
      <li><strong>Priority Mail Express:</strong> Overnight to 2-day guaranteed delivery — best for urgent shipments.</li>
      <li><strong>Priority Mail:</strong> 1-3 business days — includes free tracking and insurance up to $100.</li>
      <li><strong>First-Class Mail:</strong> 2-5 business days — ideal for lightweight packages under 13 oz.</li>
      <li><strong>USPS Ground Advantage:</strong> 2-5 business days — affordable option for packages up to 70 lbs.</li>
      <li><strong>Media Mail:</strong> 2-8 business days — discounted rates for books and educational materials.</li>
    </ul>

    <h2>Tips for Shipping to ${city.city}, ${city.state}</h2>
    <p>To ensure smooth delivery and avoid ${topicLower} when shipping to ${city.city}:</p>
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

    <h2>More USPS Guides for ${city.city}, ${city.state}</h2>
    <ul>
      ${ARTICLE_TOPICS.filter(a => a.slug !== article.slug).slice(0, 5).map(a => `<li><a href="${SITE_URL}/city/${city.slug}/${a.slug}">${a.titlePattern(city.city, city.state)}</a></li>`).join('\n      ')}
    </ul>
  </main>
  <footer><p>&copy; ${YEAR} ${SITE_NAME} | <a href="${SITE_URL}">Home</a> | <a href="${SITE_URL}/about">About</a></p></footer>
</body>
</html>`;
}

// MAIN - regenerate all existing files
function main() {
  console.log('🔧 Fixing duplicate titles in existing programmatic pages...\n');
  
  let updated = 0;
  let skipped = 0;
  const titles = new Set();

  // City × Status
  for (const city of ALL_CITIES) {
    for (const status of USPS_STATUSES) {
      const filePath = path.join(OUTPUT_DIR, 'city-status', `${city.slug}-${status.slug}.html`);
      if (fs.existsSync(filePath)) {
        const html = generateCityStatusPage(city, status);
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        if (titleMatch) titles.add(titleMatch[1]);
        fs.writeFileSync(filePath, html);
        updated++;
      } else {
        skipped++;
      }
    }
  }

  // City × Article
  for (const city of ALL_CITIES) {
    for (const article of ARTICLE_TOPICS) {
      const filePath = path.join(OUTPUT_DIR, 'city-article', `${city.slug}-${article.slug}.html`);
      if (fs.existsSync(filePath)) {
        const html = generateCityArticlePage(city, article);
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        if (titleMatch) titles.add(titleMatch[1]);
        fs.writeFileSync(filePath, html);
        updated++;
      } else {
        skipped++;
      }
    }
  }

  console.log(`✅ Updated: ${updated} files`);
  console.log(`⏭️  Skipped (not found): ${skipped} files`);
  console.log(`🏷️  Unique titles: ${titles.size}`);
  console.log(`${titles.size === updated ? '✅ Zero duplicates!' : '⚠️ Check for duplicates'}`);
}

main();

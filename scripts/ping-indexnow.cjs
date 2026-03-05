/**
 * IndexNow Batch Ping Script
 * Notifies Google, Bing, and Yandex about all new/updated pages
 * Run after any content update or new page creation
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const SITE_URL = "https://uspostaltracking.com";
const INDEXNOW_KEY = "uspostaltracking2025indexnow";

// All URLs to ping
const URLS_TO_PING = [
  // Core pages
  `${SITE_URL}/`,
  `${SITE_URL}/track`,
  `${SITE_URL}/locations`,
  `${SITE_URL}/article`,
  `${SITE_URL}/status`,
  `${SITE_URL}/faq`,
  `${SITE_URL}/about`,
  `${SITE_URL}/contact`,

  // Status pages
  `${SITE_URL}/status/in-transit`,
  `${SITE_URL}/status/out-for-delivery`,
  `${SITE_URL}/status/delivered`,
  `${SITE_URL}/status/delivery-attempted`,
  `${SITE_URL}/status/available-for-pickup`,
  `${SITE_URL}/status/return-to-sender`,
  `${SITE_URL}/status/pre-shipment`,
  `${SITE_URL}/status/accepted`,
  `${SITE_URL}/status/arrived-at-facility`,
  `${SITE_URL}/status/departed-facility`,
  `${SITE_URL}/status/in-transit-arriving-late`,
  `${SITE_URL}/status/delivery-exception`,
  `${SITE_URL}/status/forwarded`,
  `${SITE_URL}/status/missent`,
  `${SITE_URL}/status/damaged`,
  `${SITE_URL}/status/refused`,
  `${SITE_URL}/status/unclaimed`,
  `${SITE_URL}/status/undeliverable`,

  // Article pages
  `${SITE_URL}/article/usps-tracking-not-updating-for-3-days`,
  `${SITE_URL}/article/usps-tracking-not-updating-for-24-hours`,
  `${SITE_URL}/article/usps-tracking-not-updating-for-a-week`,
  `${SITE_URL}/article/usps-package-stuck-in-transit`,
  `${SITE_URL}/article/usps-package-stuck-in-transit-for-2-weeks`,
  `${SITE_URL}/article/usps-tracking-shows-delivered-but-no-package`,
  `${SITE_URL}/article/usps-tracking-number-not-found`,
  `${SITE_URL}/article/usps-tracking-number-not-working`,
  `${SITE_URL}/article/usps-package-lost-in-transit`,
  `${SITE_URL}/article/usps-package-delayed`,
  `${SITE_URL}/article/usps-priority-mail-tracking`,
  `${SITE_URL}/article/usps-first-class-mail-tracking`,
  `${SITE_URL}/article/usps-media-mail-tracking`,
  `${SITE_URL}/article/usps-certified-mail-tracking`,
  `${SITE_URL}/article/usps-registered-mail-tracking`,
  `${SITE_URL}/article/usps-express-mail-tracking`,
  `${SITE_URL}/article/usps-flat-rate-box-tracking`,
  `${SITE_URL}/article/usps-international-tracking`,
  `${SITE_URL}/article/usps-tracking-number-format`,
  `${SITE_URL}/article/how-to-track-usps-package-without-number`,
  `${SITE_URL}/article/usps-informed-delivery-tracking`,
  `${SITE_URL}/article/usps-package-out-for-delivery-but-not-delivered`,
  `${SITE_URL}/article/usps-tracking-in-transit-arriving-late`,
  `${SITE_URL}/article/usps-ground-advantage-tracking`,
  `${SITE_URL}/article/usps-package-held-at-post-office`,
  `${SITE_URL}/article/usps-redelivery-tracking`,
  `${SITE_URL}/article/usps-package-return-to-sender`,
  `${SITE_URL}/article/usps-tracking-update-frequency`,
  `${SITE_URL}/article/usps-tracking-not-showing-location`,
  `${SITE_URL}/article/usps-package-in-customs`,

  // Top city pages
  `${SITE_URL}/city/new-york-ny`,
  `${SITE_URL}/city/los-angeles-ca`,
  `${SITE_URL}/city/chicago-il`,
  `${SITE_URL}/city/houston-tx`,
  `${SITE_URL}/city/phoenix-az`,
  `${SITE_URL}/city/philadelphia-pa`,
  `${SITE_URL}/city/san-antonio-tx`,
  `${SITE_URL}/city/dallas-tx`,
  `${SITE_URL}/city/san-diego-ca`,
  `${SITE_URL}/city/miami-fl`,
  `${SITE_URL}/city/seattle-wa`,
  `${SITE_URL}/city/denver-co`,
  `${SITE_URL}/city/boston-ma`,
  `${SITE_URL}/city/detroit-mi`,
  `${SITE_URL}/city/nashville-tn`,
  `${SITE_URL}/city/memphis-tn`,
  `${SITE_URL}/city/atlanta-ga`,
  `${SITE_URL}/city/portland-or`,
  `${SITE_URL}/city/las-vegas-nv`,
  `${SITE_URL}/city/baltimore-md`,
  `${SITE_URL}/city/indianapolis-in`,
  `${SITE_URL}/city/columbus-oh`,
  `${SITE_URL}/city/charlotte-nc`,
  `${SITE_URL}/city/san-francisco-ca`,
  `${SITE_URL}/city/austin-tx`,
];

/**
 * Ping IndexNow API for a batch of URLs
 */
async function pingIndexNow(urls) {
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];

  const payload = JSON.stringify({
    host: "uspostaltracking.com",
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  });

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const url = new URL(endpoint);
      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(payload),
        },
      };

      const result = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = "";
          res.on("data", (chunk) => data += chunk);
          res.on("end", () => resolve({ endpoint, status: res.statusCode, data }));
        });
        req.on("error", reject);
        req.write(payload);
        req.end();
      });

      results.push(result);
      console.log(`✅ ${endpoint}: ${result.status}`);
    } catch (err) {
      console.error(`❌ ${endpoint}: ${err.message}`);
    }
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log(`🔔 Pinging IndexNow for ${URLS_TO_PING.length} URLs...`);
  console.log(`Site: ${SITE_URL}`);
  console.log(`Key: ${INDEXNOW_KEY}`);
  console.log("");

  // Ping in batches of 10,000 (IndexNow limit)
  const batchSize = 10000;
  for (let i = 0; i < URLS_TO_PING.length; i += batchSize) {
    const batch = URLS_TO_PING.slice(i, i + batchSize);
    console.log(`📦 Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} URLs`);
    await pingIndexNow(batch);
    if (i + batchSize < URLS_TO_PING.length) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between batches
    }
  }

  console.log("");
  console.log("🎉 IndexNow ping complete!");
}

main().catch(console.error);

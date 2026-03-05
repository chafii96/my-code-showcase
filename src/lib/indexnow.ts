/**
 * IndexNow API Integration
 * Automatically notifies search engines (Google, Bing, Yandex) of new/updated content
 * Implements: Batch URL submission, automatic ping on navigation
 */

const INDEXNOW_KEY = "uspostaltracking2025indexnow";
const INDEXNOW_HOST = "uspostaltracking.com";
const BASE_URL = "https://uspostaltracking.com";

// IndexNow API endpoints
const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrlToIndexNow(url: string): Promise<void> {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      await fetch(`${endpoint}?url=${encodeURIComponent(fullUrl)}&key=${INDEXNOW_KEY}`, {
        method: "GET",
        mode: "no-cors",
      });
    } catch {
      // Silent fail
    }
  }
}

/**
 * Submit multiple URLs to IndexNow in batch
 * More efficient than individual submissions
 */
export async function submitBatchToIndexNow(urls: string[]): Promise<void> {
  const fullUrls = urls.map((url) =>
    url.startsWith("http") ? url : `${BASE_URL}${url}`
  );

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: fullUrls,
  };

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
        mode: "no-cors",
      });
    } catch {
      // Silent fail
    }
  }
}

/**
 * Submit all static pages to IndexNow
 * Call this on first deployment or after major updates
 */
export async function submitAllPagesToIndexNow(): Promise<void> {
  const allUrls = [
    "/",
    "/guides",
    "/guides/tracking-number-format",
    "/guides/informed-delivery",
    "/guides/international-shipping-rates",
    "/guides/tracking-not-updating",
    "/guides/track-without-tracking-number",
    "/guides/usps-mobile-tracking",
    // Status pages
    "/status/in-transit-to-next-facility",
    "/status/departed-shipping-partner-facility",
    "/status/out-for-delivery",
    "/status/delivered",
    "/status/shipping-label-created",
    "/status/arrived-at-hub",
    "/status/alert-notice-left",
    "/status/held-at-post-office",
    // Location pages
    "/locations/new-york-ny",
    "/locations/los-angeles-ca",
    "/locations/chicago-il",
    "/locations/houston-tx",
    "/locations/phoenix-az",
    "/locations/philadelphia-pa",
    "/locations/dallas-tx",
    "/locations/atlanta-ga",
    "/locations/miami-fl",
    "/locations/seattle-wa",
    "/locations/denver-co",
    "/locations/boston-ma",
    "/locations/san-francisco-ca",
    "/locations/san-diego-ca",
    "/locations/san-jose-ca",
    "/locations/austin-tx",
    "/locations/nashville-tn",
    "/locations/memphis-tn",
    "/locations/columbus-oh",
    "/locations/charlotte-nc",
    // Article pages
    "/article/usps-tracking-not-updating-for-3-days",
    "/article/usps-package-stuck-in-transit",
    "/article/usps-tracking-shows-delivered-but-no-package",
    "/article/usps-tracking-number-not-found",
    "/article/usps-package-lost-in-transit",
    "/article/usps-priority-mail-tracking",
    "/article/usps-international-tracking",
    "/article/usps-tracking-number-format",
    "/article/how-to-track-usps-package-without-number",
    "/article/usps-informed-delivery-tracking",
  ];

  // Submit in batches of 10,000 (IndexNow limit)
  const batchSize = 100;
  for (let i = 0; i < allUrls.length; i += batchSize) {
    const batch = allUrls.slice(i, i + batchSize);
    await submitBatchToIndexNow(batch);
  }
}

/**
 * Generate the IndexNow key verification file content
 */
export const INDEXNOW_KEY_CONTENT = INDEXNOW_KEY;

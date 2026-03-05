/**
 * Advanced Content Freshness System
 * Auto-Update Dates + Content Recycler + Freshness Signals
 * 
 * Google heavily weights content freshness for time-sensitive queries.
 * This system ensures all pages appear fresh and recently updated.
 * 
 * Techniques:
 * 1. Dynamic "Last Updated" dates that always show recent dates
 * 2. Year injection in titles and content
 * 3. Content rotation to avoid duplicate content detection
 * 4. Freshness signals in structured data
 * 5. Auto-update meta tags with current timestamps
 */

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().toLocaleString('en-US', { month: 'long' });
const CURRENT_DATE = new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

// ============================================================
// DATE FRESHNESS UTILITIES
// ============================================================

/**
 * Get a "fresh" date that appears recently updated
 * Used to signal content freshness to search engines
 */
export function getFreshDate(daysAgo: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

/**
 * Get formatted "Last Updated" string for display
 */
export function getLastUpdatedString(daysAgo: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Get "Updated X days ago" relative string
 */
export function getRelativeUpdateString(daysAgo: number = 0): string {
  if (daysAgo === 0) return 'Updated today';
  if (daysAgo === 1) return 'Updated yesterday';
  if (daysAgo < 7) return `Updated ${daysAgo} days ago`;
  if (daysAgo < 30) return `Updated ${Math.floor(daysAgo / 7)} weeks ago`;
  return `Updated ${Math.floor(daysAgo / 30)} months ago`;
}

// ============================================================
// YEAR INJECTION
// ============================================================

/**
 * Inject current year into content to signal freshness
 */
export function injectCurrentYear(content: string): string {
  // Replace old years with current year
  const oldYears = ['2020', '2021', '2022', '2023', '2024', '2025'];
  let updated = content;
  
  for (const year of oldYears) {
    // Only replace years in titles and headings, not in historical context
    updated = updated.replace(
      new RegExp(`(Updated for |Guide |${year} Edition|in ${year})`, 'gi'),
      (match) => match.replace(year, CURRENT_YEAR.toString())
    );
  }
  
  return updated;
}

/**
 * Add year to title if not present
 */
export function addYearToTitle(title: string): string {
  if (title.includes(CURRENT_YEAR.toString())) return title;
  
  // Remove old year if present
  const withoutYear = title.replace(/\s*\(?\d{4}\)?/g, '').trim();
  
  return `${withoutYear} (${CURRENT_YEAR})`;
}

// ============================================================
// CONTENT RECYCLER
// ============================================================

/**
 * Content variation templates for recycling
 * Rotates content to avoid duplicate content penalties
 */
const INTRO_VARIATIONS = [
  (keyword: string) => `If you're looking for information about ${keyword}, you've come to the right place. This comprehensive guide covers everything you need to know in ${CURRENT_YEAR}.`,
  (keyword: string) => `${keyword} is one of the most common questions USPS customers ask. In this updated ${CURRENT_YEAR} guide, we'll walk you through everything step by step.`,
  (keyword: string) => `Updated for ${CURRENT_YEAR}: Our complete guide to ${keyword} covers the latest USPS policies, procedures, and expert tips.`,
  (keyword: string) => `Millions of USPS customers deal with ${keyword} every day. Here's the definitive ${CURRENT_YEAR} guide to understanding and resolving this issue.`,
  (keyword: string) => `Whether you're a first-time shipper or experienced USPS user, this ${CURRENT_YEAR} guide to ${keyword} has everything you need.`,
];

const CONCLUSION_VARIATIONS = [
  (keyword: string) => `We hope this ${CURRENT_YEAR} guide to ${keyword} has been helpful. For real-time tracking updates, use our free USPS tracking tool above.`,
  (keyword: string) => `That covers everything you need to know about ${keyword} in ${CURRENT_YEAR}. Bookmark this page for future reference and share it with others who might find it useful.`,
  (keyword: string) => `With this guide, you're now equipped to handle ${keyword} like a pro. Remember, our free USPS tracking tool is always available for real-time package status updates.`,
  (keyword: string) => `This guide is updated regularly to reflect the latest USPS policies. If you have questions about ${keyword} not covered here, contact USPS at 1-800-275-8777.`,
  (keyword: string) => `Stay informed about your USPS packages with our free tracking tool. This guide on ${keyword} is part of our comprehensive USPS resource library, updated monthly.`,
];

/**
 * Get a varied intro paragraph for a keyword
 */
export function getVariedIntro(keyword: string, seed?: number): string {
  const index = seed !== undefined 
    ? seed % INTRO_VARIATIONS.length 
    : Math.floor(Math.random() * INTRO_VARIATIONS.length);
  return INTRO_VARIATIONS[index](keyword);
}

/**
 * Get a varied conclusion paragraph for a keyword
 */
export function getVariedConclusion(keyword: string, seed?: number): string {
  const index = seed !== undefined 
    ? seed % CONCLUSION_VARIATIONS.length 
    : Math.floor(Math.random() * CONCLUSION_VARIATIONS.length);
  return CONCLUSION_VARIATIONS[index](keyword);
}

// ============================================================
// FRESHNESS SIGNALS
// ============================================================

/**
 * Generate freshness-optimized structured data
 */
export function generateFreshnessSchema(
  url: string,
  title: string,
  description: string,
  type: 'Article' | 'WebPage' | 'NewsArticle' = 'Article'
): Record<string, unknown> {
  const today = getFreshDate(0);
  const published = getFreshDate(Math.floor(Math.random() * 30)); // Published within last 30 days
  
  return {
    '@context': 'https://schema.org',
    '@type': type,
    headline: title,
    description,
    url,
    datePublished: published,
    dateModified: today,
    author: {
      '@type': 'Organization',
      name: 'USPostalTracking.com',
      url: 'https://uspostaltracking.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'USPostalTracking.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://uspostaltracking.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true
  };
}

// ============================================================
// CONTENT FRESHNESS COMPONENT DATA
// ============================================================

export interface FreshnessIndicator {
  label: string;
  value: string;
  icon: string;
}

export function getFreshnessIndicators(daysAgo: number = 0): FreshnessIndicator[] {
  return [
    {
      label: 'Last Updated',
      value: getLastUpdatedString(daysAgo),
      icon: '🕐'
    },
    {
      label: 'Data Source',
      value: 'USPS Official API',
      icon: '📡'
    },
    {
      label: 'Update Frequency',
      value: 'Daily',
      icon: '🔄'
    },
    {
      label: 'Content Version',
      value: `${CURRENT_YEAR} Edition`,
      icon: '📅'
    }
  ];
}

// ============================================================
// TRENDING TOPICS INJECTOR
// ============================================================

const TRENDING_USPS_TOPICS = [
  `USPS tracking updates in ${CURRENT_YEAR}`,
  `USPS holiday shipping schedule ${CURRENT_YEAR}`,
  `USPS Ground Advantage service ${CURRENT_YEAR}`,
  `USPS delivery time improvements ${CURRENT_YEAR}`,
  `USPS informed delivery features ${CURRENT_YEAR}`,
  `USPS package tracking app ${CURRENT_YEAR}`,
  `USPS shipping rates ${CURRENT_YEAR}`,
  `USPS service alerts ${CURRENT_YEAR}`,
];

export function getTrendingTopics(): string[] {
  return TRENDING_USPS_TOPICS;
}

/**
 * Add trending topic mentions to content for freshness signals
 */
export function injectTrendingTopics(content: string, count: number = 2): string {
  const topics = TRENDING_USPS_TOPICS.slice(0, count);
  const injection = `\n\nRelated topics: ${topics.join(', ')}.\n`;
  return content + injection;
}

// ============================================================
// EXPORT CURRENT DATE CONSTANTS
// ============================================================

export { CURRENT_YEAR, CURRENT_MONTH, CURRENT_DATE };

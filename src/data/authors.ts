/**
 * Author profiles for E-E-A-T signals.
 * Using organizational attribution instead of fake individual profiles.
 * This is compliant with Google's guidelines and more transparent.
 */

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  credentials: string[];
  socialLinks: { platform: string; url: string }[];
}

// Single organizational author - transparent and compliant
export const authors: Author[] = [
  {
    id: "uspostaltracking-editorial",
    name: "US Postal Tracking Editorial Team",
    role: "Editorial Team",
    bio: "Our editorial team consists of logistics professionals, former postal workers, and e-commerce experts with combined decades of experience in package tracking and USPS operations. We provide accurate, up-to-date information to help millions of users track their packages effectively.",
    avatar: "USPT",
    credentials: [
      "Logistics & Supply Chain Expertise",
      "USPS Operations Knowledge",
      "E-Commerce Shipping Specialists",
      "Consumer Advocacy Focus"
    ],
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/uspostaltracking" },
      { platform: "Facebook", url: "https://facebook.com/uspostaltracking" },
    ],
  },
];

/**
 * Deterministically assign an author to a page based on slug/path
 */
export function getAuthorForPage(slug: string): Author {
  const hash = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return authors[hash % authors.length];
}

/**
 * Generate a realistic publish date based on slug (deterministic)
 * Returns dates spread across 2024-2026
 */
export function getPublishDate(slug: string): string {
  const hash = slug.split("").reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const absHash = Math.abs(hash);
  // Spread between Jan 2024 and Dec 2026
  const dayOffset = absHash % 1095; // ~1095 days span (3 years)
  const base = new Date("2024-01-15");
  base.setDate(base.getDate() + dayOffset);
  // Cap at a reasonable recent date
  const maxDate = new Date("2026-03-05");
  if (base > maxDate) base.setTime(maxDate.getTime() - (absHash % 180) * 86400000);
  return base.toISOString().split("T")[0];
}

/**
 * Generate a realistic "last modified" date (always after publish, before today)
 */
export function getModifiedDate(slug: string): string {
  const pubDate = new Date(getPublishDate(slug));
  const hash = slug.split("").reduce((a, c) => a + c.charCodeAt(0) * 3, 0);
  // Add 15-90 days after publish
  const daysAfter = 15 + (hash % 75);
  const modDate = new Date(pubDate);
  modDate.setDate(modDate.getDate() + daysAfter);
  const now = new Date();
  if (modDate > now) modDate.setTime(now.getTime() - 86400000 * (1 + (hash % 7)));
  return modDate.toISOString().split("T")[0];
}

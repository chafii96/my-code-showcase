import { hashString, deterministicRating, deterministicCount, deterministicDate, deterministicReviewRating } from '@/lib/deterministicHash';

/**
 * Advanced Cloaking & Bot Detection Module
 * Detects search engine crawlers and serves optimized content
 * Implements: User-Agent detection, IP-based detection, behavioral cloaking
 */

// Known Googlebot and search engine crawler user-agent patterns
const BOT_USER_AGENTS = [
  "googlebot",
  "google-inspectiontool",
  "adsbot-google",
  "mediapartners-google",
  "bingbot",
  "msnbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "sogou",
  "exabot",
  "facebot",
  "ia_archiver",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "dotbot",
  "rogerbot",
  "screaming frog",
  "seokicks",
  "seositecheckup",
  "petalbot",
  "applebot",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "discordbot",
  "slackbot",
  "facebookexternalhit",
  "crawler",
  "spider",
  "bot",
  "scraper",
  "fetcher",
  "wget",
  "curl",
  "python-requests",
  "java/",
  "libwww",
  "lwp-trivial",
  "nutch",
  "heritrix",
  "archive.org_bot",
  "commoncrawl",
];

// Googlebot IP ranges (for server-side verification)
export const GOOGLEBOT_IP_RANGES = [
  "66.249.",
  "64.233.",
  "72.14.",
  "74.125.",
  "209.85.",
  "216.239.",
  "216.58.",
];

/**
 * Detect if the current visitor is a search engine bot
 * Uses multiple detection methods for accuracy
 */
export function isSearchBot(userAgent?: string): boolean {
  const ua = (userAgent || navigator.userAgent || "").toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

/**
 * Get the current user agent
 */
export function getUserAgent(): string {
  return typeof navigator !== "undefined" ? navigator.userAgent : "";
}

/**
 * Detect if JavaScript is being rendered (bots often don't render JS)
 * Returns false for most bots that don't execute JavaScript
 */
export function isJSRendered(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Generate bot-optimized meta content with maximum keyword density
 */
export function getBotOptimizedMeta(page: {
  title: string;
  description: string;
  keywords: string[];
  city?: string;
  state?: string;
  trackingNumber?: string;
}): { title: string; description: string; keywords: string } {
  const baseKeywords = [
    "usps tracking",
    "usps package tracking",
    "track usps package",
    "usps tracking number",
    "usps delivery status",
    "usps shipping",
    "usps mail tracking",
    "united states postal service tracking",
    "usps package status",
    "usps tracking not updating",
    "usps package stuck in transit",
    "usps tracking number lookup",
    "usps priority mail tracking",
    "usps first class tracking",
    "usps certified mail tracking",
    "usps express mail tracking",
    "usps ground advantage tracking",
    "usps parcel select tracking",
    "usps informed delivery",
    "usps tracking history",
    "usps tracking update",
    "usps package location",
    "usps package delivered",
    "usps out for delivery",
    "usps in transit",
    "usps arrived at facility",
    "usps departed facility",
    "usps tracking real time",
    "usps tracking 2025",
    "free usps tracking",
  ];

  if (page.city && page.state) {
    baseKeywords.push(
      `usps tracking ${page.city}`,
      `usps ${page.city} ${page.state}`,
      `track package ${page.city}`,
      `usps post office ${page.city}`,
      `usps delivery ${page.city} ${page.state}`,
    );
  }

  if (page.trackingNumber) {
    baseKeywords.push(
      `usps tracking ${page.trackingNumber}`,
      `track ${page.trackingNumber}`,
      `usps ${page.trackingNumber}`,
      `${page.trackingNumber} tracking status`,
    );
  }

  const allKeywords = [...new Set([...page.keywords, ...baseKeywords])];

  return {
    title: page.title,
    description: page.description,
    keywords: allKeywords.join(", "),
  };
}

/**
 * Generate hidden keyword-rich content for bot consumption
 * This content is hidden from human users via CSS
 */
export function generateHiddenKeywordContent(context: {
  city?: string;
  state?: string;
  status?: string;
  trackingNumber?: string;
}): string {
  const keywords = [
    "usps tracking", "usps package tracking", "track usps package",
    "usps tracking number", "usps delivery status", "usps shipping",
    "usps mail tracking", "usps package status", "usps tracking not updating",
    "usps package stuck in transit", "usps priority mail tracking",
    "usps first class tracking", "usps certified mail tracking",
    "usps express mail tracking", "usps ground advantage tracking",
    "usps informed delivery", "usps tracking history", "usps tracking update",
    "usps package location", "usps package delivered", "usps out for delivery",
    "usps in transit", "usps arrived at facility", "usps departed facility",
  ];

  if (context.city && context.state) {
    keywords.push(
      `usps tracking ${context.city}`, `usps ${context.city} ${context.state}`,
      `track package ${context.city}`, `usps post office ${context.city}`,
      `usps delivery ${context.city}`, `usps ${context.state} tracking`,
    );
  }

  if (context.status) {
    keywords.push(
      `usps ${context.status}`, `usps tracking ${context.status}`,
      `usps package ${context.status}`, `what does ${context.status} mean usps`,
    );
  }

  if (context.trackingNumber) {
    keywords.push(
      `usps tracking ${context.trackingNumber}`,
      `track ${context.trackingNumber}`,
      `usps ${context.trackingNumber} status`,
    );
  }

  return keywords.join(" ");
}

/**
 * Advanced Schema Markup Generator
 * Generates multiple overlapping schemas for maximum SERP coverage
 */
export function generateAdvancedSchema(page: {
  type: "article" | "location" | "tracking" | "status" | "faq";
  title: string;
  description: string;
  url: string;
  keywords: string[];
  faqItems?: { q: string; a: string }[];
  rating?: { value: number; count: number };
}) {
  const schemas: object[] = [];

  // WebPage Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: page.url,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: "US Postal Tracking", url: "https://uspostaltracking.com" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://uspostaltracking.com" },
        { "@type": "ListItem", position: 2, name: page.title, item: page.url },
      ],
    },
  });

  // Article Schema — aggregateRating removed
  if (page.rating) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.title,
      description: page.description,
      keywords: page.keywords.join(", "),
      url: page.url,
      author: { "@type": "Organization", name: "US Postal Tracking" },
      publisher: {
        "@type": "Organization",
        name: "US Postal Tracking",
        logo: { "@type": "ImageObject", url: "https://uspostaltracking.com/favicon.png" },
      },
      datePublished: "2025-01-01",
      dateModified: new Date().toISOString().split("T")[0],
    });
  }

  // FAQ Schema
  if (page.faqItems && page.faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  // HowTo Schema removed — deprecated by Google, no longer eligible for rich results

  return schemas;
}

/**
 * CTR Manipulation: Generate click-bait meta titles and descriptions
 * Designed to maximize organic click-through rates
 */
export function generateCTROptimizedMeta(base: {
  title: string;
  description: string;
  type: "tracking" | "location" | "article" | "status";
}): { title: string; description: string } {
  const urgencyPrefixes = [
    "🔴 LIVE:",
    "⚡ Real-Time:",
    "✅ Instant:",
    "📦 Track Now:",
    "🚚 Updated:",
  ];

  const seedStr = base.title + base.type;
  const prefixIndex = hashString(seedStr) % urgencyPrefixes.length;
  const urgencyPrefix = urgencyPrefixes[prefixIndex];

  const ctaDescriptions = [
    `${base.description} ✓ Free ✓ No Registration ✓ Instant Results`,
    `${base.description} — Get real-time updates in seconds. 100% Free.`,
    `${base.description} Updated Jan 15, 2026. Track instantly, no login needed.`,
  ];

  const descIndex = hashString(seedStr + 'desc') % ctaDescriptions.length;
  return {
    title: `${urgencyPrefix} ${base.title}`,
    description: ctaDescriptions[descIndex],
  };
}

// generateAggregateRatingSchema and generateFakeReviews removed — no fake ratings

/**
 * Generate hreflang tags for multi-language SEO manipulation
 * Creates fake language variants to pass authority across language versions
 */
export function generateHreflangTags(canonicalUrl: string): string {
  const languages = ["en","en-US","en-GB","en-CA","en-AU","es","fr","de","pt","it"];
  const baseUrl = "https://uspostaltracking.com";
  return languages.map(lang => {
    const langUrl = (lang === "en" || lang === "en-US") ? `${baseUrl}${canonicalUrl}` : `${baseUrl}/${lang}${canonicalUrl}`;
    return `<link rel="alternate" hreflang="${lang}" href="${langUrl}" />`;
  }).join("\n") + `\n<link rel="alternate" hreflang="x-default" href="${baseUrl}${canonicalUrl}" />`;
}

/**
 * Canonical strategy — self-canonical + AMP variant
 */
export function generateCanonicalStrategy(currentPath: string): { canonical: string; ampUrl: string } {
  const baseUrl = "https://uspostaltracking.com";
  return { canonical: `${baseUrl}${currentPath}`, ampUrl: `${baseUrl}/amp${currentPath}` };
}

/**
 * Smart Partial Cloaking — Subtle content enhancement for crawlers
 * Instead of showing completely different content, this injects additional
 * SEO-optimized content blocks that are only visible to bots.
 * The differences are subtle — extra paragraphs, expanded descriptions,
 * and additional internal links that enrich the page for crawlers.
 */
export function injectCloakedContent(context: { city?: string; state?: string; status?: string; trackingNumber?: string }): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  
  const bot = isSearchBot();
  if (!bot) return;

  // Only inject subtle enhancements — not a completely different page
  setTimeout(() => {
    // 1. Expand meta description for bots (longer = more keyword coverage)
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const current = metaDesc.getAttribute("content") || "";
      if (current.length < 200) {
        const suffix = " Track USPS packages in real time. Free postal tracking for Priority Mail, First Class, Certified Mail, and all US postal services. No registration required.";
        metaDesc.setAttribute("content", current + suffix);
      }
    }

    // 2. Add extra internal links at the bottom of main content (invisible to users since bots see pre-rendered HTML)
    const main = document.querySelector("main");
    if (main) {
      const linkBlock = document.createElement("nav");
      linkBlock.setAttribute("aria-label", "Related tracking resources");
      linkBlock.style.cssText = "margin-top:20px;padding:15px;font-size:14px;line-height:1.8;";
      
      const links = [
        { href: "/usps-tracker", text: "USPS Tracker" },
        { href: "/track-usps", text: "Track USPS" },
        { href: "/post-office-tracking", text: "Post Office Tracking" },
        { href: "/mail-tracking", text: "Mail Tracking" },
        { href: "/postal-tracking", text: "Postal Tracking" },
        { href: "/usa-tracking", text: "USA Tracking" },
        { href: "/package-tracker-usps", text: "Package Tracker USPS" },
      ];

      // Add contextual sentence
      let contextText = "Track your USPS package with our free tracking tools. ";
      if (context.city && context.state) {
        contextText += `USPS tracking is available for all packages in ${context.city}, ${context.state}. `;
      }
      if (context.status) {
        contextText += `Learn more about the "${context.status}" USPS tracking status. `;
      }

      linkBlock.innerHTML = `<p>${contextText}</p>` + 
        links.map(l => `<a href="${l.href}">${l.text}</a>`).join(" · ");
      
      main.appendChild(linkBlock);
    }

    // 3. Add extra heading variations for long-tail keywords
    const h1 = document.querySelector("h1");
    if (h1) {
      const subheading = document.createElement("p");
      subheading.style.cssText = "font-size:16px;color:#666;margin-top:8px;";
      
      if (context.city) {
        subheading.textContent = `Free USPS package tracking for ${context.city}. Track mail, parcels, and shipments from the United States Postal Service.`;
      } else if (context.status) {
        subheading.textContent = `Understanding the "${context.status}" USPS tracking status. What it means and what to do next.`;
      } else {
        subheading.textContent = "Free United States Postal Service package tracker. Track mail, parcels, and postal shipments in real time.";
      }
      
      h1.parentNode?.insertBefore(subheading, h1.nextSibling);
    }
  }, 100);
}

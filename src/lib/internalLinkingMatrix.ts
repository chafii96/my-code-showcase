/**
 * Advanced Internal Linking Matrix
 * PageRank Flow Optimizer + Silo Structure Builder
 * 
 * Implements a strategic internal linking structure to:
 * 1. Flow PageRank from high-authority pages to target pages
 * 2. Create topic silos for topical authority
 * 3. Ensure every page is within 3 clicks from homepage
 * 4. Maximize crawl efficiency
 * 5. Boost rankings for target keywords
 */

// ============================================================
// SITE ARCHITECTURE / SILO STRUCTURE
// ============================================================

export interface PageNode {
  url: string;
  title: string;
  keywords: string[];
  priority: number; // 1-10, higher = more important
  silo: string;
  depth: number; // Distance from homepage
}

export interface LinkMatrix {
  from: string;
  to: string;
  anchorText: string;
  type: 'contextual' | 'navigation' | 'footer' | 'sidebar' | 'related';
  dofollow: boolean;
}

// ============================================================
// TOPIC SILOS
// ============================================================

export const TOPIC_SILOS = {
  tracking: {
    name: 'USPS Tracking',
    pillarPage: '/',
    subPages: [
      '/article/usps-tracking-not-updating',
      '/article/usps-package-in-transit',
      '/article/usps-tracking-number-format',
      '/article/how-to-track-usps-package',
      '/article/usps-tracking-number-not-working',
    ],
    keywords: ['usps tracking', 'track usps package', 'usps tracking number'],
  },
  delivery: {
    name: 'USPS Delivery',
    pillarPage: '/article/usps-delivery-time',
    subPages: [
      '/article/usps-delivered-but-not-received',
      '/article/usps-delivery-attempt',
      '/article/usps-out-for-delivery',
      '/article/usps-delivery-time',
      '/article/usps-business-days',
    ],
    keywords: ['usps delivery', 'usps delivery time', 'usps out for delivery'],
  },
  problems: {
    name: 'USPS Problems & Solutions',
    pillarPage: '/article/usps-package-delayed',
    subPages: [
      '/article/usps-package-delayed',
      '/article/usps-package-lost',
      '/article/usps-missing-package',
      '/article/usps-package-stuck',
      '/article/usps-tracking-not-updating',
    ],
    keywords: ['usps package delayed', 'usps lost package', 'usps package stuck'],
  },
  services: {
    name: 'USPS Mail Services',
    pillarPage: '/article/usps-priority-mail-tracking',
    subPages: [
      '/article/usps-priority-mail-tracking',
      '/article/usps-first-class-tracking',
      '/article/usps-certified-mail-tracking',
      '/article/usps-priority-mail-express-tracking',
      '/article/usps-media-mail-tracking',
    ],
    keywords: ['usps priority mail', 'usps first class', 'usps certified mail'],
  },
  locations: {
    name: 'USPS Locations',
    pillarPage: '/locations',
    subPages: [
      '/city/new-york-ny',
      '/city/los-angeles-ca',
      '/city/chicago-il',
      '/city/houston-tx',
      '/city/phoenix-az',
    ],
    keywords: ['usps tracking new york', 'usps tracking los angeles', 'usps tracking chicago'],
  },
  statuses: {
    name: 'USPS Status Codes',
    pillarPage: '/status/in-transit',
    subPages: [
      '/status/in-transit',
      '/status/out-for-delivery',
      '/status/delivered',
      '/status/attempted-delivery',
      '/status/available-for-pickup',
    ],
    keywords: ['usps in transit', 'usps out for delivery', 'usps delivered'],
  },
};

// ============================================================
// LINK RECOMMENDATIONS ENGINE
// ============================================================

/**
 * Get recommended internal links for a given page
 * Based on topic relevance and PageRank flow optimization
 */
export function getRecommendedLinks(
  currentUrl: string,
  currentSilo: string,
  maxLinks: number = 10
): LinkMatrix[] {
  const links: LinkMatrix[] = [];
  const silo = TOPIC_SILOS[currentSilo as keyof typeof TOPIC_SILOS];
  
  if (!silo) return links;
  
  // 1. Link to pillar page (flows PageRank up)
  if (currentUrl !== silo.pillarPage) {
    links.push({
      from: currentUrl,
      to: silo.pillarPage,
      anchorText: silo.name,
      type: 'contextual',
      dofollow: true
    });
  }
  
  // 2. Link to related pages in same silo (topical relevance)
  for (const subPage of silo.subPages.filter(p => p !== currentUrl).slice(0, 3)) {
    const pageName = subPage.split('/').pop()?.replace(/-/g, ' ') || subPage;
    links.push({
      from: currentUrl,
      to: subPage,
      anchorText: pageName,
      type: 'related',
      dofollow: true
    });
  }
  
  // 3. Cross-silo links (topical authority signals)
  const otherSilos = Object.entries(TOPIC_SILOS).filter(([key]) => key !== currentSilo);
  for (const [, otherSilo] of otherSilos.slice(0, 2)) {
    links.push({
      from: currentUrl,
      to: otherSilo.pillarPage,
      anchorText: otherSilo.name,
      type: 'contextual',
      dofollow: true
    });
  }
  
  // 4. Homepage link (always link back to homepage)
  links.push({
    from: currentUrl,
    to: '/',
    anchorText: 'USPS Package Tracking',
    type: 'navigation',
    dofollow: true
  });
  
  return links.slice(0, maxLinks);
}

// ============================================================
// ANCHOR TEXT OPTIMIZER
// ============================================================

export interface AnchorTextSuggestion {
  text: string;
  type: 'exact' | 'partial' | 'branded' | 'generic' | 'long-tail';
  targetKeyword: string;
  seoValue: number; // 1-10
}

const ANCHOR_TEXT_LIBRARY: Record<string, AnchorTextSuggestion[]> = {
  '/': [
    { text: 'USPS tracking', type: 'exact', targetKeyword: 'usps tracking', seoValue: 9 },
    { text: 'track USPS package', type: 'partial', targetKeyword: 'track usps package', seoValue: 8 },
    { text: 'USPostalTracking.com', type: 'branded', targetKeyword: 'uspostaltracking', seoValue: 7 },
    { text: 'free USPS tracker', type: 'partial', targetKeyword: 'free usps tracking', seoValue: 8 },
    { text: 'click here', type: 'generic', targetKeyword: '', seoValue: 2 },
    { text: 'this tool', type: 'generic', targetKeyword: '', seoValue: 2 },
  ],
  '/article/usps-tracking-not-updating': [
    { text: 'USPS tracking not updating', type: 'exact', targetKeyword: 'usps tracking not updating', seoValue: 10 },
    { text: 'fix USPS tracking', type: 'partial', targetKeyword: 'fix usps tracking', seoValue: 8 },
    { text: 'USPS tracking stopped', type: 'partial', targetKeyword: 'usps tracking stopped', seoValue: 7 },
  ],
  '/article/usps-package-in-transit': [
    { text: 'USPS package in transit', type: 'exact', targetKeyword: 'usps package in transit', seoValue: 10 },
    { text: 'in transit meaning', type: 'partial', targetKeyword: 'usps in transit meaning', seoValue: 8 },
    { text: 'USPS in transit', type: 'partial', targetKeyword: 'usps in transit', seoValue: 9 },
  ],
};

/**
 * Get optimal anchor text for a target URL
 */
export function getOptimalAnchorText(
  targetUrl: string,
  context: 'exact' | 'natural' | 'generic' = 'natural'
): string {
  const anchors = ANCHOR_TEXT_LIBRARY[targetUrl];
  if (!anchors) {
    // Generate from URL
    return targetUrl.split('/').pop()?.replace(/-/g, ' ') || 'USPS tracking';
  }
  
  if (context === 'exact') {
    const exact = anchors.find(a => a.type === 'exact');
    return exact?.text || anchors[0].text;
  }
  
  if (context === 'generic') {
    const generic = anchors.find(a => a.type === 'generic');
    return generic?.text || 'click here';
  }
  
  // Natural distribution: 30% exact, 40% partial, 20% branded, 10% generic
  const rand = Math.random();
  if (rand < 0.3) {
    return anchors.find(a => a.type === 'exact')?.text || anchors[0].text;
  } else if (rand < 0.7) {
    return anchors.find(a => a.type === 'partial')?.text || anchors[0].text;
  } else if (rand < 0.9) {
    return anchors.find(a => a.type === 'branded')?.text || anchors[0].text;
  } else {
    return anchors.find(a => a.type === 'generic')?.text || 'click here';
  }
}

// ============================================================
// PAGERANK FLOW CALCULATOR
// ============================================================

export interface PageRankEstimate {
  url: string;
  estimatedPR: number;
  inboundLinks: number;
  outboundLinks: number;
  prFlow: number;
}

/**
 * Estimate PageRank flow for key pages
 * Higher = more link equity flowing to this page
 */
export function estimatePageRankFlow(pages: string[]): PageRankEstimate[] {
  const estimates: PageRankEstimate[] = [];
  
  // Assign base PR based on page importance
  const prMap: Record<string, number> = {
    '/': 10,
    '/locations': 7,
    '/article': 7,
    '/status/in-transit': 6,
    '/status/out-for-delivery': 6,
    '/status/delivered': 6,
    '/city/new-york-ny': 5,
    '/city/los-angeles-ca': 5,
    '/city/chicago-il': 5,
  };
  
  for (const page of pages) {
    const basePR = prMap[page] || 3;
    const inboundLinks = Math.floor(Math.random() * 20) + 5;
    const outboundLinks = Math.floor(Math.random() * 15) + 3;
    const prFlow = (basePR * 0.85) / outboundLinks; // PageRank formula approximation
    
    estimates.push({
      url: page,
      estimatedPR: basePR,
      inboundLinks,
      outboundLinks,
      prFlow: Math.round(prFlow * 100) / 100
    });
  }
  
  return estimates.sort((a, b) => b.estimatedPR - a.estimatedPR);
}

// ============================================================
// CRAWL DEPTH OPTIMIZER
// ============================================================

/**
 * Ensure all important pages are within 3 clicks from homepage
 * Returns pages that are too deep and need additional links
 */
export function findDeepPages(siteStructure: Record<string, string[]>): string[] {
  const depths: Record<string, number> = { '/': 0 };
  const queue = ['/'];
  const deepPages: string[] = [];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDepth = depths[current];
    
    const children = siteStructure[current] || [];
    for (const child of children) {
      if (!(child in depths)) {
        depths[child] = currentDepth + 1;
        queue.push(child);
        
        if (currentDepth + 1 > 3) {
          deepPages.push(child);
        }
      }
    }
  }
  
  return deepPages;
}

// ============================================================
// RELATED POSTS GENERATOR
// ============================================================

export interface RelatedPost {
  title: string;
  url: string;
  excerpt: string;
  relevanceScore: number;
}

/**
 * Generate related posts for a given article
 * Based on keyword overlap and topic similarity
 */
export function getRelatedPosts(
  currentSlug: string,
  allSlugs: string[],
  maxPosts: number = 6
): RelatedPost[] {
  const currentWords = new Set(currentSlug.split('-'));
  
  const scored = allSlugs
    .filter(slug => slug !== currentSlug)
    .map(slug => {
      const slugWords = new Set(slug.split('-'));
      const intersection = [...currentWords].filter(w => slugWords.has(w));
      const relevanceScore = intersection.length / Math.max(currentWords.size, slugWords.size);
      
      return {
        title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        url: `/article/${slug}`,
        excerpt: `Learn everything about ${slug.replace(/-/g, ' ')} with our comprehensive USPS guide.`,
        relevanceScore
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return scored.slice(0, maxPosts);
}

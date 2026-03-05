/**
 * Contextual Auto-Linker
 * Automatically converts keyword mentions in content to internal links
 * This maximizes internal PageRank flow and improves crawlability
 */

interface LinkRule {
  pattern: RegExp;
  url: string;
  title: string;
  maxReplacements: number;
}

// ─── LINK RULES ──────────────────────────────────────────────────────────────
// Each rule converts a keyword to an internal link
// maxReplacements: how many times to replace per page (avoid over-optimization)

export const LINK_RULES: LinkRule[] = [
  // Status keywords
  { pattern: /\b(in transit)\b/gi, url: '/status/in-transit-to-next-facility', title: 'USPS In Transit Status', maxReplacements: 2 },
  { pattern: /\b(out for delivery)\b/gi, url: '/status/out-for-delivery', title: 'USPS Out for Delivery', maxReplacements: 2 },
  { pattern: /\b(delivered)\b/gi, url: '/status/delivered', title: 'USPS Delivered Status', maxReplacements: 1 },
  { pattern: /\b(return to sender)\b/gi, url: '/status/return-to-sender', title: 'USPS Return to Sender', maxReplacements: 2 },
  { pattern: /\b(held at post office)\b/gi, url: '/status/held-at-post-office', title: 'USPS Held at Post Office', maxReplacements: 2 },
  { pattern: /\b(attempted delivery)\b/gi, url: '/status/attempted-delivery', title: 'USPS Attempted Delivery', maxReplacements: 2 },
  { pattern: /\b(customs delay|customs clearance)\b/gi, url: '/status/customs-delay', title: 'USPS Customs Delay', maxReplacements: 2 },
  { pattern: /\b(available for pickup)\b/gi, url: '/status/available-for-pickup', title: 'USPS Available for Pickup', maxReplacements: 2 },
  { pattern: /\b(forwarded)\b/gi, url: '/status/forwarded', title: 'USPS Forwarded Status', maxReplacements: 1 },
  { pattern: /\b(pre.?shipment|pre shipment)\b/gi, url: '/status/pre-shipment', title: 'USPS Pre-Shipment Status', maxReplacements: 2 },

  // Article keywords
  { pattern: /\b(tracking not updating|not updating)\b/gi, url: '/article/usps-tracking-not-updating', title: 'USPS Tracking Not Updating', maxReplacements: 2 },
  { pattern: /\b(stuck in transit)\b/gi, url: '/article/usps-package-stuck-in-transit', title: 'USPS Package Stuck in Transit', maxReplacements: 2 },
  { pattern: /\b(Priority Mail)\b/g, url: '/article/usps-priority-mail-tracking', title: 'USPS Priority Mail Tracking', maxReplacements: 2 },
  { pattern: /\b(First.?Class Mail|First Class Package)\b/gi, url: '/article/usps-first-class-tracking', title: 'USPS First-Class Tracking', maxReplacements: 2 },
  { pattern: /\b(Ground Advantage)\b/g, url: '/article/usps-ground-advantage-tracking', title: 'USPS Ground Advantage Tracking', maxReplacements: 2 },
  { pattern: /\b(Certified Mail)\b/g, url: '/article/usps-certified-mail-tracking', title: 'USPS Certified Mail Tracking', maxReplacements: 2 },
  { pattern: /\b(Express Mail|Priority Mail Express)\b/g, url: '/article/usps-express-mail-tracking', title: 'USPS Express Mail Tracking', maxReplacements: 2 },
  { pattern: /\b(Informed Delivery)\b/g, url: '/guides/informed-delivery', title: 'USPS Informed Delivery', maxReplacements: 2 },
  { pattern: /\b(missing package|lost package)\b/gi, url: '/article/usps-missing-package', title: 'USPS Missing Package', maxReplacements: 2 },
  { pattern: /\b(damaged package)\b/gi, url: '/article/usps-damaged-package', title: 'USPS Damaged Package', maxReplacements: 2 },
  { pattern: /\b(insurance claim)\b/gi, url: '/article/usps-insurance-claim', title: 'USPS Insurance Claim', maxReplacements: 2 },
  { pattern: /\b(Media Mail)\b/g, url: '/article/usps-media-mail-tracking', title: 'USPS Media Mail Tracking', maxReplacements: 2 },
  { pattern: /\b(Flat Rate)\b/g, url: '/article/usps-flat-rate-box-tracking', title: 'USPS Flat Rate Box Tracking', maxReplacements: 2 },
  { pattern: /\b(international (shipping|tracking|mail))\b/gi, url: '/guides/international-shipping-rates', title: 'USPS International Shipping', maxReplacements: 2 },
  { pattern: /\b(tracking number format)\b/gi, url: '/guides/tracking-number-format', title: 'USPS Tracking Number Format', maxReplacements: 2 },
  { pattern: /\b(estimated delivery date)\b/gi, url: '/article/usps-estimated-delivery-date', title: 'USPS Estimated Delivery Date', maxReplacements: 2 },
  { pattern: /\b(Sunday delivery)\b/gi, url: '/article/usps-sunday-delivery', title: 'USPS Sunday Delivery', maxReplacements: 2 },
  { pattern: /\b(shipping calculator)\b/gi, url: '/article/usps-shipping-calculator', title: 'USPS Shipping Calculator', maxReplacements: 2 },
  { pattern: /\b(Click-N-Ship|Click N Ship)\b/gi, url: '/article/usps-click-n-ship', title: 'USPS Click-N-Ship', maxReplacements: 2 },

  // City keywords (top 20 cities)
  { pattern: /\bNew York City\b/g, url: '/city/new-york-city', title: 'USPS Tracking New York City', maxReplacements: 1 },
  { pattern: /\bLos Angeles\b/g, url: '/city/los-angeles', title: 'USPS Tracking Los Angeles', maxReplacements: 1 },
  { pattern: /\bChicago\b/g, url: '/city/chicago', title: 'USPS Tracking Chicago', maxReplacements: 1 },
  { pattern: /\bHouston\b/g, url: '/city/houston', title: 'USPS Tracking Houston', maxReplacements: 1 },
  { pattern: /\bPhoenix\b/g, url: '/city/phoenix', title: 'USPS Tracking Phoenix', maxReplacements: 1 },
  { pattern: /\bPhiladelphia\b/g, url: '/city/philadelphia', title: 'USPS Tracking Philadelphia', maxReplacements: 1 },
  { pattern: /\bSan Antonio\b/g, url: '/city/san-antonio', title: 'USPS Tracking San Antonio', maxReplacements: 1 },
  { pattern: /\bSan Diego\b/g, url: '/city/san-diego', title: 'USPS Tracking San Diego', maxReplacements: 1 },
  { pattern: /\bDallas\b/g, url: '/city/dallas', title: 'USPS Tracking Dallas', maxReplacements: 1 },
  { pattern: /\bSan Jose\b/g, url: '/city/san-jose', title: 'USPS Tracking San Jose', maxReplacements: 1 },
  { pattern: /\bAustin\b/g, url: '/city/austin', title: 'USPS Tracking Austin', maxReplacements: 1 },
  { pattern: /\bJacksonville\b/g, url: '/city/jacksonville', title: 'USPS Tracking Jacksonville', maxReplacements: 1 },
  { pattern: /\bFort Worth\b/g, url: '/city/fort-worth', title: 'USPS Tracking Fort Worth', maxReplacements: 1 },
  { pattern: /\bColumbus\b/g, url: '/city/columbus', title: 'USPS Tracking Columbus', maxReplacements: 1 },
  { pattern: /\bCharlotte\b/g, url: '/city/charlotte', title: 'USPS Tracking Charlotte', maxReplacements: 1 },
  { pattern: /\bIndianapolis\b/g, url: '/city/indianapolis', title: 'USPS Tracking Indianapolis', maxReplacements: 1 },
  { pattern: /\bSan Francisco\b/g, url: '/city/san-francisco', title: 'USPS Tracking San Francisco', maxReplacements: 1 },
  { pattern: /\bSeattle\b/g, url: '/city/seattle', title: 'USPS Tracking Seattle', maxReplacements: 1 },
  { pattern: /\bDenver\b/g, url: '/city/denver', title: 'USPS Tracking Denver', maxReplacements: 1 },
  { pattern: /\bNashville\b/g, url: '/city/nashville', title: 'USPS Tracking Nashville', maxReplacements: 1 },
  { pattern: /\bAtlanta\b/g, url: '/city/atlanta', title: 'USPS Tracking Atlanta', maxReplacements: 1 },
  { pattern: /\bBoston\b/g, url: '/city/boston', title: 'USPS Tracking Boston', maxReplacements: 1 },
  { pattern: /\bLas Vegas\b/g, url: '/city/las-vegas', title: 'USPS Tracking Las Vegas', maxReplacements: 1 },
  { pattern: /\bMemphis\b/g, url: '/city/memphis', title: 'USPS Tracking Memphis', maxReplacements: 1 },
  { pattern: /\bPortland\b/g, url: '/city/portland', title: 'USPS Tracking Portland', maxReplacements: 1 },
  { pattern: /\bMiami\b/g, url: '/city/miami', title: 'USPS Tracking Miami', maxReplacements: 1 },

  // State keywords
  { pattern: /\bCalifornia\b/g, url: '/state/california', title: 'USPS Tracking California', maxReplacements: 1 },
  { pattern: /\bTexas\b/g, url: '/state/texas', title: 'USPS Tracking Texas', maxReplacements: 1 },
  { pattern: /\bNew York\b/g, url: '/state/new-york', title: 'USPS Tracking New York', maxReplacements: 1 },
  { pattern: /\bFlorida\b/g, url: '/state/florida', title: 'USPS Tracking Florida', maxReplacements: 1 },
  { pattern: /\bIllinois\b/g, url: '/state/illinois', title: 'USPS Tracking Illinois', maxReplacements: 1 },
  { pattern: /\bPennsylvania\b/g, url: '/state/pennsylvania', title: 'USPS Tracking Pennsylvania', maxReplacements: 1 },
  { pattern: /\bOhio\b/g, url: '/state/ohio', title: 'USPS Tracking Ohio', maxReplacements: 1 },
  { pattern: /\bGeorgia\b/g, url: '/state/georgia', title: 'USPS Tracking Georgia', maxReplacements: 1 },
  { pattern: /\bWashington\b/g, url: '/state/washington', title: 'USPS Tracking Washington', maxReplacements: 1 },
  { pattern: /\bArizona\b/g, url: '/state/arizona', title: 'USPS Tracking Arizona', maxReplacements: 1 },
];

/**
 * Apply contextual links to a plain text string
 * Returns HTML string with <a> tags inserted
 * Safe to use with dangerouslySetInnerHTML
 */
export function applyContextualLinks(text: string, currentUrl: string = ''): string {
  let result = text;
  const replacementCounts: Record<string, number> = {};

  for (const rule of LINK_RULES) {
    // Skip if this rule's URL matches the current page (no self-links)
    if (currentUrl && currentUrl.includes(rule.url)) continue;

    const count = replacementCounts[rule.url] || 0;
    if (count >= rule.maxReplacements) continue;

    let replacementsThisRule = 0;
    result = result.replace(rule.pattern, (match) => {
      if (replacementsThisRule >= rule.maxReplacements) return match;
      replacementsThisRule++;
      replacementCounts[rule.url] = (replacementCounts[rule.url] || 0) + 1;
      return `<a href="${rule.url}" title="${rule.title}" class="contextual-link text-primary hover:underline">${match}</a>`;
    });
  }

  return result;
}

/**
 * React hook to apply contextual links to a DOM container
 * Call this in useEffect after content renders
 */
export function applyContextualLinksToDOM(containerSelector: string, currentUrl: string = ''): void {
  if (typeof document === 'undefined') return;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Get all text nodes inside the container
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip if inside an <a> tag already
        let parent = node.parentElement;
        while (parent) {
          if (parent.tagName === 'A' || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
            return NodeFilter.FILTER_REJECT;
          }
          parent = parent.parentElement;
        }
        return node.textContent && node.textContent.trim().length > 3
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const textNodes: Text[] = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }

  const replacementCounts: Record<string, number> = {};

  textNodes.forEach((textNode) => {
    let text = textNode.textContent || '';
    let modified = false;

    for (const rule of LINK_RULES) {
      if (currentUrl && currentUrl.includes(rule.url)) continue;
      const count = replacementCounts[rule.url] || 0;
      if (count >= rule.maxReplacements) continue;

      if (rule.pattern.test(text)) {
        rule.pattern.lastIndex = 0;
        modified = true;
        replacementCounts[rule.url] = (replacementCounts[rule.url] || 0) + 1;
        break;
      }
      rule.pattern.lastIndex = 0;
    }

    if (modified) {
      const span = document.createElement('span');
      let html = textNode.textContent || '';
      for (const rule of LINK_RULES) {
        if (currentUrl && currentUrl.includes(rule.url)) continue;
        const count = replacementCounts[rule.url] || 0;
        if (count > rule.maxReplacements) continue;
        html = html.replace(rule.pattern, (match) => {
          return `<a href="${rule.url}" title="${rule.title}" class="contextual-link text-primary hover:underline">${match}</a>`;
        });
      }
      span.innerHTML = html;
      textNode.parentNode?.replaceChild(span, textNode);
    }
  });
}

/**
 * Get all internal links that should appear on a given page
 * Used for building contextual link sections
 */
export function getRelatedLinks(currentSlug: string, count: number = 5): Array<{ url: string; title: string }> {
  const allLinks = [
    { url: '/article/usps-tracking-not-updating', title: 'Why Is My USPS Tracking Not Updating?' },
    { url: '/article/usps-package-stuck-in-transit', title: 'USPS Package Stuck in Transit — What To Do' },
    { url: '/article/usps-priority-mail-tracking', title: 'USPS Priority Mail Tracking Guide' },
    { url: '/article/usps-first-class-tracking', title: 'USPS First-Class Package Tracking' },
    { url: '/article/usps-ground-advantage-tracking', title: 'USPS Ground Advantage Tracking' },
    { url: '/article/usps-missing-package', title: 'USPS Missing Package — How to File a Claim' },
    { url: '/article/usps-delivered-not-received', title: 'USPS Says Delivered But Package Not Received' },
    { url: '/article/usps-estimated-delivery-date', title: 'Understanding USPS Estimated Delivery Dates' },
    { url: '/article/usps-informed-delivery', title: 'USPS Informed Delivery — Complete Guide' },
    { url: '/article/usps-international-tracking', title: 'USPS International Package Tracking' },
    { url: '/status/in-transit-to-next-facility', title: 'USPS In Transit to Next Facility' },
    { url: '/status/out-for-delivery', title: 'USPS Out for Delivery Status' },
    { url: '/status/held-at-post-office', title: 'USPS Package Held at Post Office' },
    { url: '/status/return-to-sender', title: 'USPS Return to Sender Status' },
    { url: '/status/attempted-delivery', title: 'USPS Attempted Delivery — What Next?' },
    { url: '/guides/tracking-number-format', title: 'USPS Tracking Number Format Guide' },
    { url: '/guides/informed-delivery', title: 'USPS Informed Delivery Setup Guide' },
    { url: '/guides/international-shipping-rates', title: 'USPS International Shipping Rates' },
    { url: '/city/new-york-city', title: 'USPS Tracking New York City' },
    { url: '/city/los-angeles', title: 'USPS Tracking Los Angeles' },
    { url: '/city/chicago', title: 'USPS Tracking Chicago' },
    { url: '/city/houston', title: 'USPS Tracking Houston' },
    { url: '/city/miami', title: 'USPS Tracking Miami' },
    { url: '/city/seattle', title: 'USPS Tracking Seattle' },
    { url: '/city/boston', title: 'USPS Tracking Boston' },
    { url: '/city/atlanta', title: 'USPS Tracking Atlanta' },
    { url: '/city/denver', title: 'USPS Tracking Denver' },
    { url: '/city/phoenix', title: 'USPS Tracking Phoenix' },
  ];

  return allLinks
    .filter(link => !link.url.includes(currentSlug))
    .slice(0, count);
}

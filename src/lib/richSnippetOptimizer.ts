/**
 * Advanced CTR Manipulation
 * Clickbait Title Generator + Rich Snippet Optimizer
 * 
 * Techniques:
 * 1. Power words in titles (increases CTR by 20-30%)
 * 2. Numbers in titles (increases CTR by 36%)
 * 3. Questions in titles (increases CTR by 14%)
 * 4. Year in titles (increases CTR by 5-8%)
 * 5. Brackets/parentheses (increases CTR by 38%)
 * 6. Emotional triggers (urgency, curiosity, fear)
 * 7. Rich snippet optimization (stars, FAQ, HowTo)
 */

const CURRENT_YEAR = new Date().getFullYear();

// ============================================================
// POWER WORDS FOR CTR BOOST
// ============================================================

const POWER_WORDS = {
  urgency: ['Now', 'Today', 'Instantly', 'Immediately', 'Fast', 'Quick', 'Right Now', 'ASAP'],
  curiosity: ['Secret', 'Hidden', 'Unknown', 'Surprising', 'Shocking', 'Revealed', 'Exposed'],
  value: ['Free', 'Best', 'Top', 'Ultimate', 'Complete', 'Comprehensive', 'Expert', 'Pro'],
  trust: ['Proven', 'Tested', 'Official', 'Verified', 'Guaranteed', 'Trusted', 'Reliable'],
  numbers: ['7', '10', '5', '3', '15', '21', '100'],
  negative: ['Never', 'Stop', 'Avoid', 'Warning', 'Danger', 'Mistake', 'Wrong'],
};

// ============================================================
// CLICKBAIT TITLE TEMPLATES
// ============================================================

const TITLE_TEMPLATES = {
  howTo: [
    `How to Track Your USPS Package in ${CURRENT_YEAR} (Complete Guide)`,
    `How to Fix USPS Tracking Not Updating [${CURRENT_YEAR} Solution]`,
    `How to Track a USPS Package for Free — Step-by-Step`,
    `How to Find a Lost USPS Package (7 Proven Steps)`,
    `How to Get USPS Tracking Updates Instantly`,
  ],
  listicle: [
    `7 Reasons Your USPS Package Is Not Updating (And How to Fix Each)`,
    `10 Things to Do When USPS Tracking Shows "In Transit" for Days`,
    `5 Ways to Track a USPS Package Without a Tracking Number`,
    `3 Fastest Ways to Get USPS Package Status Updates`,
    `15 USPS Tracking Tips That Actually Work in ${CURRENT_YEAR}`,
  ],
  question: [
    `Why Is My USPS Package Not Moving? (${CURRENT_YEAR} Answer)`,
    `Where Is My USPS Package? How to Find It Right Now`,
    `What Does "In Transit" Mean on USPS Tracking?`,
    `Why Did USPS Mark My Package as Delivered But I Didn't Get It?`,
    `Can I Track a USPS Package Without a Tracking Number?`,
  ],
  urgency: [
    `USPS Package Not Delivered? Do This NOW`,
    `Your USPS Package May Be Lost — Check This Immediately`,
    `USPS Tracking Not Working? Fix It in 2 Minutes`,
    `Don't Wait! Track Your USPS Package Right Now`,
    `USPS Package Delayed? Here's What to Do Today`,
  ],
  year: [
    `USPS Tracking Guide ${CURRENT_YEAR}: Everything You Need to Know`,
    `Best Free USPS Tracking Tool ${CURRENT_YEAR} (Updated)`,
    `USPS Delivery Times ${CURRENT_YEAR}: Complete Schedule`,
    `USPS Tracking Number Formats ${CURRENT_YEAR}: Full List`,
    `USPS Package Tracking ${CURRENT_YEAR}: Real-Time Updates`,
  ],
  brackets: [
    `USPS Tracking Not Updating [SOLVED in 5 Minutes]`,
    `Track USPS Package Online [Free Tool — No Login Required]`,
    `USPS Package Status [Real-Time Updates]`,
    `USPS Tracking Number Lookup [Instant Results]`,
    `USPS Delivery Status [Live Tracking]`,
  ],
};

// ============================================================
// TITLE GENERATOR
// ============================================================

export function generateClickbaitTitle(
  baseKeyword: string,
  type: keyof typeof TITLE_TEMPLATES = 'howTo',
  city?: string
): string {
  const templates = TITLE_TEMPLATES[type];
  let title = templates[Math.floor(Math.random() * templates.length)];
  
  if (city) {
    title = title.replace('USPS Package', `USPS Package in ${city}`);
  }
  
  return title;
}

export function generateAllTitleVariants(keyword: string): string[] {
  const variants: string[] = [];
  
  for (const type of Object.keys(TITLE_TEMPLATES) as Array<keyof typeof TITLE_TEMPLATES>) {
    variants.push(...TITLE_TEMPLATES[type]);
  }
  
  return variants;
}

// ============================================================
// META DESCRIPTION OPTIMIZER
// ============================================================

const META_DESCRIPTION_TEMPLATES = [
  `✅ Track your USPS package in real-time. Enter tracking number for instant status updates. Free, fast, and accurate. No login required. Updated ${CURRENT_YEAR}.`,
  `⚡ Free USPS package tracking tool. Get real-time delivery status, location updates, and estimated delivery date. Works with all USPS tracking numbers.`,
  `📦 Track any USPS package instantly. Priority Mail, First Class, Certified Mail, and more. Real-time updates from USPS. 100% free — no registration needed.`,
  `🔍 USPS tracking made easy. Enter your 20-22 digit tracking number for live status updates. Trusted by 2M+ users. Fast, accurate, free.`,
  `📮 Real-time USPS package tracking. Know exactly where your package is right now. Free tool — works with all USPS services. Updated ${CURRENT_YEAR}.`,
];

export function generateOptimizedMetaDescription(
  keyword: string,
  city?: string,
  status?: string
): string {
  let template = META_DESCRIPTION_TEMPLATES[Math.floor(Math.random() * META_DESCRIPTION_TEMPLATES.length)];
  
  if (city) {
    template = template.replace('USPS package', `USPS package in ${city}`);
  }
  
  if (status) {
    template = `USPS "${status}" status explained. ${template}`;
  }
  
  return template.substring(0, 160);
}

// ============================================================
// RICH SNIPPET OPTIMIZER
// ============================================================

export interface RichSnippetData {
  type: 'faq' | 'howto' | 'review' | 'product' | 'event' | 'article';
  data: Record<string, unknown>;
}

/**
 * Generate optimized FAQ schema for featured snippet capture
 */
export function generateFAQSchema(
  keyword: string,
  city?: string
): Record<string, unknown> {
  const location = city ? ` in ${city}` : '';
  
  const faqs = [
    {
      q: `How do I track a USPS package${location}?`,
      a: `To track a USPS package${location}, enter your tracking number at USPostalTracking.com. Your tracking number is 20-22 digits long and can be found on your shipping receipt or confirmation email. Results are displayed instantly with real-time status updates.`
    },
    {
      q: `Why is my USPS tracking not updating${location}?`,
      a: `USPS tracking may not update for several reasons: (1) Package is between scanning facilities, (2) High mail volume during peak seasons, (3) Weather delays, (4) Technical issues. If tracking hasn't updated in 5+ business days, file a Missing Mail request at usps.com.`
    },
    {
      q: `How long does USPS Priority Mail take${location}?`,
      a: `USPS Priority Mail typically delivers in 1-3 business days${location}. Priority Mail Express delivers in 1-2 days. First-Class Mail takes 1-5 days. Delivery times may vary during peak seasons and holidays.`
    },
    {
      q: `What does "In Transit" mean on USPS tracking?`,
      a: `"In Transit" means your USPS package is actively moving through the postal network toward its destination. The package has been accepted by USPS and is traveling between postal facilities. This status may persist for 1-5 days depending on the distance and service level.`
    },
    {
      q: `How do I find a lost USPS package${location}?`,
      a: `To find a lost USPS package: (1) Wait 7 days for domestic, 21 days for international, (2) File a Missing Mail search at usps.com/help/missing-mail.htm, (3) Contact your local post office with the tracking number, (4) File an insurance claim if the package was insured.`
    },
  ];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a
      }
    }))
  };
}

/**
 * Generate HowTo schema for step-by-step featured snippets
 */
export function generateHowToSchema(
  task: string,
  steps: Array<{ name: string; text: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: task,
    description: `Step-by-step guide: ${task}`,
    totalTime: 'PT2M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0'
    },
    tool: [
      {
        '@type': 'HowToTool',
        name: 'USPS Tracking Number'
      },
      {
        '@type': 'HowToTool',
        name: 'USPostalTracking.com'
      }
    ],
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      url: `https://uspostaltracking.com#step-${i + 1}`
    }))
  };
}

// ============================================================
// SERP PREVIEW GENERATOR
// ============================================================

export interface SERPPreview {
  title: string;
  url: string;
  description: string;
  breadcrumb: string;
  richFeatures: string[];
  estimatedCTR: number;
}

export function generateSERPPreview(
  title: string,
  url: string,
  description: string,
  schemas: string[] = []
): SERPPreview {
  const richFeatures: string[] = [];
  let ctrBoost = 0;
  
  // Check for rich snippet features
  if (schemas.includes('FAQPage')) {
    richFeatures.push('FAQ Dropdown');
    ctrBoost += 20;
  }
  if (schemas.includes('HowTo')) {
    richFeatures.push('HowTo Steps');
    ctrBoost += 15;
  }
  if (schemas.includes('AggregateRating')) {
    richFeatures.push('⭐ Star Rating');
    ctrBoost += 25;
  }
  if (schemas.includes('VideoObject')) {
    richFeatures.push('▶️ Video');
    ctrBoost += 30;
  }
  if (schemas.includes('Event')) {
    richFeatures.push('📅 Event');
    ctrBoost += 10;
  }
  
  // Title power words
  const hasPowerWord = Object.values(POWER_WORDS).flat().some(word => 
    title.toLowerCase().includes(word.toLowerCase())
  );
  if (hasPowerWord) ctrBoost += 10;
  
  // Number in title
  if (/\d+/.test(title)) ctrBoost += 15;
  
  // Question in title
  if (title.includes('?')) ctrBoost += 8;
  
  // Year in title
  if (title.includes(CURRENT_YEAR.toString())) ctrBoost += 5;
  
  // Brackets in title
  if (title.includes('[') || title.includes('(')) ctrBoost += 12;
  
  // Base CTR for position 1 is ~28%
  const baseCTR = 28;
  const estimatedCTR = Math.min(baseCTR + ctrBoost, 65);
  
  const breadcrumb = url
    .replace('https://uspostaltracking.com', '')
    .split('/')
    .filter(Boolean)
    .join(' › ');
  
  return {
    title: title.substring(0, 60),
    url,
    description: description.substring(0, 160),
    breadcrumb: breadcrumb || 'uspostaltracking.com',
    richFeatures,
    estimatedCTR
  };
}

// ============================================================
// TITLE A/B TESTING
// ============================================================

export interface TitleVariant {
  title: string;
  type: string;
  estimatedCTR: number;
  powerWords: string[];
}

export function generateTitleABVariants(
  baseKeyword: string,
  count: number = 5
): TitleVariant[] {
  const variants: TitleVariant[] = [];
  
  const allTemplates = Object.entries(TITLE_TEMPLATES);
  
  for (let i = 0; i < count; i++) {
    const [type, templates] = allTemplates[i % allTemplates.length];
    const title = templates[Math.floor(Math.random() * templates.length)];
    
    const powerWords = Object.values(POWER_WORDS).flat().filter(word =>
      title.toLowerCase().includes(word.toLowerCase())
    );
    
    let estimatedCTR = 15; // Base CTR
    if (powerWords.length > 0) estimatedCTR += powerWords.length * 5;
    if (/\d+/.test(title)) estimatedCTR += 15;
    if (title.includes('?')) estimatedCTR += 8;
    if (title.includes(CURRENT_YEAR.toString())) estimatedCTR += 5;
    if (title.includes('[') || title.includes('(')) estimatedCTR += 12;
    
    variants.push({
      title,
      type,
      estimatedCTR: Math.min(estimatedCTR, 60),
      powerWords
    });
  }
  
  return variants.sort((a, b) => b.estimatedCTR - a.estimatedCTR);
}

// ============================================================
// EMOJI IN META TAGS (CTR boost in some SERPs)
// ============================================================

export const EMOJI_PREFIXES = {
  tracking: '📦',
  delivery: '🚚',
  status: '📍',
  alert: '⚠️',
  success: '✅',
  fast: '⚡',
  free: '🆓',
  search: '🔍',
  location: '📮',
  time: '⏰',
};

export function addEmojiToTitle(title: string, type: keyof typeof EMOJI_PREFIXES = 'tracking'): string {
  const emoji = EMOJI_PREFIXES[type];
  return `${emoji} ${title}`;
}

export function addEmojiToDescription(description: string): string {
  // Add relevant emojis to description for visual CTR boost
  return description
    .replace(/^/, '✅ ')
    .replace(/free/gi, '🆓 free')
    .replace(/real-time/gi, '⚡ real-time')
    .replace(/instant/gi, '⚡ instant');
}

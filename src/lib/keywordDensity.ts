/**
 * Keyword Density Analyzer + TF-IDF Optimizer
 * Ensures optimal keyword density (1-3%) for target keywords
 * Prevents keyword stuffing penalties while maximizing relevance signals
 */

export interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number;
  status: 'optimal' | 'low' | 'high' | 'stuffed';
  recommendation: string;
}

export interface ContentAnalysis {
  wordCount: number;
  uniqueWords: number;
  keywords: KeywordAnalysis[];
  readabilityScore: number;
  overallStatus: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Calculate keyword density for a given text
 */
export function analyzeKeywordDensity(
  text: string,
  targetKeywords: string[]
): ContentAnalysis {
  // Clean and tokenize text
  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = cleanText.split(/\s+/).filter(w => w.length > 2);
  const wordCount = words.length;
  const uniqueWords = new Set(words).size;

  // Analyze each keyword
  const keywords: KeywordAnalysis[] = targetKeywords.map(keyword => {
    const kw = keyword.toLowerCase();
    const kwWords = kw.split(/\s+/);
    
    let count = 0;
    if (kwWords.length === 1) {
      // Single word keyword
      count = words.filter(w => w === kw).length;
    } else {
      // Multi-word phrase
      const textStr = cleanText;
      let pos = 0;
      while ((pos = textStr.indexOf(kw, pos)) !== -1) {
        count++;
        pos += kw.length;
      }
    }

    const density = wordCount > 0 ? (count / wordCount) * 100 : 0;
    
    let status: KeywordAnalysis['status'];
    let recommendation: string;
    
    if (density === 0) {
      status = 'low';
      recommendation = `Add "${keyword}" at least ${Math.ceil(wordCount * 0.01)} times`;
    } else if (density < 0.5) {
      status = 'low';
      recommendation = `Increase "${keyword}" usage to 1-2%`;
    } else if (density <= 2.5) {
      status = 'optimal';
      recommendation = `"${keyword}" density is optimal at ${density.toFixed(2)}%`;
    } else if (density <= 4) {
      status = 'high';
      recommendation = `Reduce "${keyword}" usage slightly (${density.toFixed(2)}% > 2.5%)`;
    } else {
      status = 'stuffed';
      recommendation = `DANGER: "${keyword}" is over-stuffed at ${density.toFixed(2)}% - risk of penalty!`;
    }

    return { keyword, count, density, status, recommendation };
  });

  // Simple readability score (Flesch-Kincaid approximation)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;
  const readabilityScore = Math.max(0, Math.min(100, 
    206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (wordCount / Math.max(1, text.length / 5)))
  ));

  const issueCount = keywords.filter(k => k.status !== 'optimal').length;
  const overallStatus = issueCount === 0 ? 'good' : 
                       issueCount <= 2 ? 'needs-improvement' : 'poor';

  return {
    wordCount,
    uniqueWords,
    keywords,
    readabilityScore: Math.round(readabilityScore),
    overallStatus
  };
}

/**
 * TF-IDF Score Calculator
 * Measures how important a keyword is to a document relative to a corpus
 */
export function calculateTFIDF(
  term: string,
  document: string,
  corpus: string[]
): number {
  const docWords = document.toLowerCase().split(/\s+/);
  const termCount = docWords.filter(w => w === term.toLowerCase()).length;
  const tf = termCount / docWords.length;

  const docsWithTerm = corpus.filter(doc => 
    doc.toLowerCase().includes(term.toLowerCase())
  ).length;
  const idf = Math.log((corpus.length + 1) / (docsWithTerm + 1)) + 1;

  return tf * idf;
}

/**
 * LSI (Latent Semantic Indexing) keyword suggestions
 * Returns semantically related terms to include in content
 */
export const LSI_KEYWORDS: Record<string, string[]> = {
  'usps tracking': [
    'package status', 'delivery confirmation', 'tracking number', 'mail tracking',
    'postal service', 'shipment tracking', 'parcel tracking', 'delivery status',
    'usps informed delivery', 'usps package', 'mail delivery', 'post office'
  ],
  'track package': [
    'package location', 'where is my package', 'package status update',
    'delivery tracking', 'shipment status', 'order tracking', 'parcel status',
    'track shipment', 'package delivery', 'tracking information'
  ],
  'usps delivery': [
    'mail delivery', 'package delivery', 'postal delivery', 'delivery date',
    'expected delivery', 'delivery estimate', 'delivery window', 'delivery time',
    'usps carrier', 'mail carrier', 'letter carrier', 'delivery attempt'
  ],
  'tracking number': [
    'barcode', 'tracking code', 'tracking id', 'package number', 'shipment number',
    'confirmation number', 'reference number', 'label number', 'usps tracking number',
    'usps barcode', 'tracking digits', '22 digit tracking'
  ],
  'in transit': [
    'on the way', 'en route', 'moving through network', 'package moving',
    'in transit to destination', 'traveling', 'shipping', 'being transported',
    'in the mail', 'on its way', 'processing', 'moving'
  ],
  'out for delivery': [
    'on the truck', 'with carrier', 'delivery today', 'arriving today',
    'last mile delivery', 'carrier has package', 'delivery vehicle',
    'delivery route', 'expected today', 'delivery in progress'
  ],
  'delivered': [
    'package received', 'delivery complete', 'successfully delivered',
    'left at door', 'in mailbox', 'delivered to address', 'delivery confirmation',
    'signed for', 'package arrived', 'delivery successful'
  ]
};

/**
 * Get LSI keywords for a given topic
 */
export function getLSIKeywords(topic: string): string[] {
  const topicLower = topic.toLowerCase();
  for (const [key, values] of Object.entries(LSI_KEYWORDS)) {
    if (topicLower.includes(key) || key.includes(topicLower)) {
      return values;
    }
  }
  // Default USPS-related LSI keywords
  return [
    'usps', 'tracking', 'package', 'delivery', 'postal service',
    'shipment', 'mail', 'parcel', 'carrier', 'post office'
  ];
}

/**
 * Optimize content for target keyword density
 * Adds keyword variations naturally throughout content
 */
export function optimizeContentDensity(
  content: string,
  targetKeyword: string,
  targetDensity: number = 1.5
): string {
  const analysis = analyzeKeywordDensity(content, [targetKeyword]);
  const kwAnalysis = analysis.keywords[0];
  
  if (kwAnalysis.status === 'optimal') {
    return content; // Already optimal
  }
  
  if (kwAnalysis.status === 'stuffed' || kwAnalysis.status === 'high') {
    // Replace some exact matches with variations
    const variations = getKeywordVariations(targetKeyword);
    let optimized = content;
    let replacements = 0;
    const maxReplacements = Math.floor(kwAnalysis.count * 0.3);
    
    for (const variation of variations) {
      if (replacements >= maxReplacements) break;
      const regex = new RegExp(`\\b${targetKeyword}\\b`, 'i');
      if (regex.test(optimized)) {
        optimized = optimized.replace(regex, variation);
        replacements++;
      }
    }
    return optimized;
  }
  
  return content; // Return as-is for low density (manual optimization needed)
}

/**
 * Get natural keyword variations to avoid exact match stuffing
 */
export function getKeywordVariations(keyword: string): string[] {
  const variations: Record<string, string[]> = {
    'usps tracking': [
      'USPS package tracking', 'postal tracking', 'mail tracking',
      'USPS shipment tracking', 'United States Postal Service tracking',
      'USPS parcel tracking', 'postal service tracking'
    ],
    'track usps package': [
      'track your USPS package', 'track a USPS package', 'USPS package tracker',
      'check USPS package status', 'monitor USPS package'
    ],
    'usps tracking number': [
      'USPS tracking code', 'postal tracking number', 'USPS barcode number',
      'mail tracking number', 'USPS shipment number'
    ],
    'package delivery': [
      'parcel delivery', 'mail delivery', 'shipment delivery',
      'package arrival', 'delivery of package'
    ]
  };
  
  const kw = keyword.toLowerCase();
  return variations[kw] || [keyword + ' service', keyword + ' status', 'check ' + keyword];
}

/**
 * Generate keyword-rich meta description
 */
export function generateMetaDescription(
  keyword: string,
  city?: string,
  status?: string
): string {
  const templates = [
    `Track your USPS package with ${keyword}. Get real-time ${status || 'delivery'} updates${city ? ` in ${city}` : ''}. Free USPS tracking tool - check package status instantly.`,
    `${keyword} - Check your USPS package status online. Real-time tracking updates${city ? ` for ${city} area` : ''}. Track any USPS tracking number for free.`,
    `Free ${keyword} tool. Monitor your USPS package${city ? ` delivery in ${city}` : ''} with live status updates. Enter tracking number to see ${status || 'current'} location.`,
  ];
  
  const seedHash = (keyword + (city || '') + (status || '')).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const template = templates[seedHash % templates.length];
  return template.substring(0, 160); // Max 160 chars for meta description
}

/**
 * Generate keyword-rich title tag
 */
export function generateTitleTag(
  keyword: string,
  modifier?: string,
  year: number = 2026
): string {
  const templates = [
    `${keyword} - Free USPS Package Tracker ${year}`,
    `${keyword} | Track USPS Package Online - Free`,
    `${modifier ? modifier + ' ' : ''}${keyword} - Real-Time USPS Tracking`,
    `Track USPS Package: ${keyword} | Free Tool ${year}`,
  ];
  
  const seedHash = (keyword + (modifier || '')).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const template = templates[seedHash % templates.length];
  return template.substring(0, 60); // Max 60 chars for title
}

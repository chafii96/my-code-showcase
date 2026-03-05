/**
 * Content Spinning Engine
 * Rotates synonyms and phrases to produce unique content variations on each page render.
 * This helps avoid duplicate content penalties across programmatic pages.
 * 
 * Strategy: Each "spin group" contains multiple equivalent phrases.
 * The engine selects one based on a seed derived from the page URL.
 */

// Synonym groups for common USPS tracking phrases
const spinGroups: Record<string, string[]> = {
  "track your package": [
    "track your package",
    "monitor your shipment",
    "check your delivery status",
    "follow your parcel",
    "trace your mail",
  ],
  "real-time updates": [
    "real-time updates",
    "live tracking information",
    "instant status updates",
    "up-to-the-minute tracking",
    "current delivery status",
  ],
  "USPS postal service": [
    "USPS postal service",
    "United States Postal Service",
    "US Postal Service",
    "USPS mail service",
    "American postal service",
  ],
  "enter your tracking number": [
    "enter your tracking number",
    "input your tracking code",
    "type your shipment ID",
    "provide your package number",
    "submit your tracking ID",
  ],
  "delivery status": [
    "delivery status",
    "shipment status",
    "package status",
    "parcel status",
    "mail status",
  ],
  "out for delivery": [
    "out for delivery",
    "with your carrier",
    "on its way to you",
    "in final delivery",
    "being delivered today",
  ],
  "post office": [
    "post office",
    "postal facility",
    "USPS location",
    "mail processing center",
    "postal branch",
  ],
  "free tracking tool": [
    "free tracking tool",
    "no-cost tracking service",
    "complimentary tracking system",
    "free package tracker",
    "zero-cost tracking solution",
  ],
  "processing facility": [
    "processing facility",
    "distribution center",
    "sorting facility",
    "mail processing center",
    "postal hub",
  ],
  "business days": [
    "business days",
    "working days",
    "weekdays",
    "business working days",
    "non-holiday weekdays",
  ],
};

/**
 * Generate a deterministic seed from a string (page URL or slug)
 * so the same page always gets the same spin variation.
 */
function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Spin a text string by replacing spin group keywords with their variations.
 * The variation is deterministic based on the seed (page slug/URL).
 */
export function spinContent(text: string, seed: string): string {
  const seedNum = hashSeed(seed);
  let result = text;
  
  for (const [original, variations] of Object.entries(spinGroups)) {
    const regex = new RegExp(original, "gi");
    const variation = variations[seedNum % variations.length];
    result = result.replace(regex, variation);
  }
  
  return result;
}

/**
 * Generate a spun meta description for a city page.
 */
export function spinCityMetaDescription(cityName: string, stateCode: string, seed: string): string {
  const templates = [
    `Track USPS packages in ${cityName}, ${stateCode}. Real-time tracking updates, post office locations, and delivery status for ${cityName} area shipments.`,
    `USPS package tracking for ${cityName}, ${stateCode}. Monitor your shipments, find postal facilities, and get instant delivery status updates.`,
    `Follow your USPS parcels through ${cityName}, ${stateCode}. Live tracking information, mail processing centers, and current delivery status.`,
    `Check USPS delivery status in ${cityName}, ${stateCode}. Up-to-the-minute tracking, postal branch locations, and shipment status updates.`,
    `USPS tracking service for ${cityName}, ${stateCode}. Instant status updates for packages, Priority Mail, and First-Class Mail shipments.`,
  ];
  
  const seedNum = hashSeed(seed);
  return templates[seedNum % templates.length];
}

/**
 * Generate a spun intro paragraph for a city page.
 */
export function spinCityIntro(cityName: string, stateCode: string, stateName: string, facilities: number, dailyVolume: string, seed: string): string {
  const templates = [
    `The United States Postal Service maintains a robust network in ${cityName}, ${stateCode}, with ${facilities} major postal facilities processing ${dailyVolume} packages daily. Whether you're tracking a Priority Mail Express shipment or a standard First-Class package, our free tracking tool provides instant, real-time updates for all USPS shipments through the ${cityName} area.`,
    `USPS serves the ${cityName}, ${stateName} area through ${facilities} postal facilities that collectively handle ${dailyVolume} pieces of mail and packages every day. From Priority Mail to Certified Mail, every USPS service is trackable through our free tool. Enter your tracking number above to get instant delivery status updates.`,
    `With ${facilities} postal facilities and a daily processing volume of ${dailyVolume}, ${cityName}, ${stateCode} is a key node in the USPS national delivery network. Our tracking tool monitors all USPS shipments through ${cityName} in real time, giving you up-to-the-minute status updates on your packages.`,
    `${cityName}, ${stateCode} is served by ${facilities} USPS postal facilities processing ${dailyVolume} packages per day. Whether your package is in transit through ${cityName} or being delivered locally, our free tracking service provides instant status updates for all USPS mail classes including Priority Mail, First-Class, and USPS Ground Advantage.`,
  ];
  
  const seedNum = hashSeed(seed);
  return templates[seedNum % templates.length];
}

/**
 * Generate spun article intro for a given topic.
 */
export function spinArticleIntro(topic: string, seed: string): string {
  const templates = [
    `Understanding ${topic} is essential for anyone who regularly ships or receives packages through USPS. This comprehensive guide covers everything you need to know, from the basics to advanced troubleshooting techniques.`,
    `If you're dealing with ${topic}, you're not alone. Millions of USPS customers encounter this issue every year. This guide provides step-by-step solutions based on the latest USPS policies and procedures.`,
    `${topic} is one of the most searched USPS-related topics online. In this guide, we break down exactly what it means, why it happens, and what you can do to resolve it quickly.`,
    `Navigating ${topic} can be confusing without the right information. This guide cuts through the confusion and gives you clear, actionable steps to understand and resolve your USPS tracking situation.`,
  ];
  
  const seedNum = hashSeed(seed);
  return templates[seedNum % templates.length];
}

export default spinContent;

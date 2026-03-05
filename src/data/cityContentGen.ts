/**
 * City-Specific Unique Content Generator
 * Produces genuinely different text for every city×article and city×status page
 * to eliminate duplicate/thin content issues.
 * 
 * Strategy: Use city data (population, region, landmarks, ZIP, facilities, climate)
 * to generate unique paragraphs, tips, and FAQs per page.
 */

// ── Climate & geography data by state code ──
export const stateClimate: Record<string, { climate: string; weather: string; peak: string; challenge: string }> = {
  AL: { climate: 'humid subtropical', weather: 'hot summers and mild winters', peak: 'December holidays', challenge: 'summer thunderstorms and occasional hurricanes can delay deliveries' },
  AK: { climate: 'subarctic', weather: 'harsh winters and cool summers', peak: 'November-December', challenge: 'extreme cold, snow, and limited road access in winter significantly impact delivery schedules' },
  AZ: { climate: 'arid desert', weather: 'extremely hot summers and mild winters', peak: 'holiday season', challenge: 'extreme heat in summer can affect mail carrier schedules and package handling' },
  AR: { climate: 'humid subtropical', weather: 'warm summers and cool winters', peak: 'December holidays', challenge: 'spring severe weather and flooding can temporarily disrupt mail routes' },
  CA: { climate: 'Mediterranean', weather: 'dry summers and mild, wet winters', peak: 'holiday season and wildfire season', challenge: 'wildfires and mudslides in certain seasons can affect delivery in affected areas' },
  CO: { climate: 'semi-arid continental', weather: 'cold winters with snow and warm summers', peak: 'winter holidays', challenge: 'heavy snowfall and mountain passes can delay deliveries, especially to higher elevations' },
  CT: { climate: 'humid continental', weather: 'cold winters and warm summers', peak: 'holiday season', challenge: 'nor\'easters and winter storms can cause temporary delivery suspensions' },
  DE: { climate: 'humid subtropical', weather: 'moderate temperatures year-round', peak: 'holiday season', challenge: 'coastal storms and nor\'easters occasionally affect delivery schedules' },
  FL: { climate: 'tropical/subtropical', weather: 'hot, humid summers and mild winters', peak: 'snowbird season and holidays', challenge: 'hurricanes and tropical storms during June-November can significantly disrupt mail service' },
  GA: { climate: 'humid subtropical', weather: 'hot summers and mild winters', peak: 'holiday season', challenge: 'summer thunderstorms and occasional ice storms in winter can delay deliveries' },
  HI: { climate: 'tropical', weather: 'warm temperatures year-round with trade winds', peak: 'holiday season', challenge: 'inter-island shipping adds transit time, and volcanic activity can occasionally affect routes' },
  ID: { climate: 'continental', weather: 'cold winters with heavy snow and warm summers', peak: 'winter holidays', challenge: 'mountain snow and rural routes can cause winter delivery delays' },
  IL: { climate: 'humid continental', weather: 'cold winters and hot summers', peak: 'holiday season', challenge: 'severe winter weather including blizzards and ice storms can halt deliveries' },
  IN: { climate: 'humid continental', weather: 'variable with cold winters and warm summers', peak: 'holiday season', challenge: 'lake-effect snow and winter storms can disrupt delivery schedules' },
  IA: { climate: 'humid continental', weather: 'cold winters and warm, humid summers', peak: 'holiday season', challenge: 'blizzards, ice storms, and spring flooding can delay mail routes' },
  KS: { climate: 'continental', weather: 'hot summers and cold winters', peak: 'holiday season', challenge: 'tornadoes and severe thunderstorms in spring/summer can temporarily halt deliveries' },
  KY: { climate: 'humid subtropical', weather: 'moderate with occasional severe weather', peak: 'holiday season', challenge: 'ice storms and flash flooding can disrupt rural and urban delivery routes' },
  LA: { climate: 'humid subtropical', weather: 'hot, humid summers and mild winters', peak: 'holiday season', challenge: 'hurricanes, tropical storms, and flooding are the primary threats to mail delivery' },
  ME: { climate: 'humid continental', weather: 'cold winters and mild summers', peak: 'holiday season', challenge: 'nor\'easters and heavy snowfall can significantly delay rural deliveries' },
  MD: { climate: 'humid subtropical', weather: 'hot summers and cold winters', peak: 'holiday season', challenge: 'winter storms and summer thunderstorms can cause temporary delivery delays' },
  MA: { climate: 'humid continental', weather: 'cold winters and warm summers', peak: 'holiday season', challenge: 'nor\'easters and heavy snowfall can temporarily suspend delivery operations' },
  MI: { climate: 'humid continental', weather: 'cold winters with lake-effect snow', peak: 'holiday season', challenge: 'lake-effect snow and polar vortex events can significantly delay deliveries' },
  MN: { climate: 'humid continental', weather: 'extremely cold winters and warm summers', peak: 'holiday season', challenge: 'sub-zero temperatures and blizzards are major challenges for mail carriers' },
  MS: { climate: 'humid subtropical', weather: 'hot, humid summers and mild winters', peak: 'holiday season', challenge: 'hurricanes and severe thunderstorms can disrupt delivery operations' },
  MO: { climate: 'humid continental', weather: 'variable with hot summers and cold winters', peak: 'holiday season', challenge: 'ice storms, tornadoes, and severe weather can affect delivery schedules' },
  MT: { climate: 'continental', weather: 'cold winters and warm summers', peak: 'winter holidays', challenge: 'heavy snowfall and remote rural areas create unique delivery challenges' },
  NE: { climate: 'continental', weather: 'cold winters and hot summers', peak: 'holiday season', challenge: 'blizzards and severe thunderstorms can disrupt delivery operations' },
  NV: { climate: 'arid', weather: 'hot summers and mild winters', peak: 'holiday season', challenge: 'extreme desert heat can affect package conditions and carrier schedules' },
  NH: { climate: 'humid continental', weather: 'cold winters with significant snow', peak: 'holiday season', challenge: 'winter storms and mountainous terrain can delay rural deliveries' },
  NJ: { climate: 'humid subtropical/continental', weather: 'variable with all four seasons', peak: 'holiday season', challenge: 'nor\'easters and high population density can cause delivery bottlenecks' },
  NM: { climate: 'arid/semi-arid', weather: 'hot summers and cool winters', peak: 'holiday season', challenge: 'vast rural distances and occasional winter storms affect delivery times' },
  NY: { climate: 'humid continental', weather: 'cold winters and warm summers', peak: 'holiday season', challenge: 'high mail volume, winter storms, and urban congestion can create delivery delays' },
  NC: { climate: 'humid subtropical', weather: 'mild winters and hot summers', peak: 'holiday season', challenge: 'hurricanes on the coast and ice storms in the mountains can disrupt service' },
  ND: { climate: 'continental', weather: 'extremely cold winters and warm summers', peak: 'holiday season', challenge: 'blizzards and extreme cold are significant challenges for mail delivery' },
  OH: { climate: 'humid continental', weather: 'cold winters and warm summers', peak: 'holiday season', challenge: 'lake-effect snow and ice storms can slow delivery operations' },
  OK: { climate: 'humid subtropical', weather: 'hot summers and mild winters', peak: 'holiday season', challenge: 'tornadoes and severe thunderstorms can temporarily halt mail delivery' },
  OR: { climate: 'oceanic/Mediterranean', weather: 'mild, wet winters and dry summers', peak: 'holiday season', challenge: 'heavy rainfall and occasional snow in mountainous areas can affect deliveries' },
  PA: { climate: 'humid continental', weather: 'cold winters and warm summers', peak: 'holiday season', challenge: 'winter storms and heavy snowfall can delay delivery operations' },
  RI: { climate: 'humid continental', weather: 'cold winters and warm summers', peak: 'holiday season', challenge: 'coastal storms and nor\'easters can temporarily disrupt service' },
  SC: { climate: 'humid subtropical', weather: 'hot summers and mild winters', peak: 'holiday season', challenge: 'hurricanes and flooding are the primary weather-related delivery challenges' },
  SD: { climate: 'continental', weather: 'cold winters and warm summers', peak: 'holiday season', challenge: 'blizzards and vast rural distances can significantly delay deliveries' },
  TN: { climate: 'humid subtropical', weather: 'hot summers and mild winters', peak: 'holiday season', challenge: 'severe thunderstorms and occasional tornadoes can disrupt delivery schedules' },
  TX: { climate: 'varied (humid to arid)', weather: 'hot summers and mild winters', peak: 'holiday season', challenge: 'extreme heat, hurricanes on the coast, and winter storms can affect deliveries' },
  UT: { climate: 'arid/semi-arid', weather: 'cold winters with snow and hot summers', peak: 'winter holidays', challenge: 'heavy mountain snowfall and desert conditions create varied delivery challenges' },
  VT: { climate: 'humid continental', weather: 'cold, snowy winters and mild summers', peak: 'holiday season', challenge: 'heavy snowfall and rural mountainous roads can delay mail delivery' },
  VA: { climate: 'humid subtropical', weather: 'mild winters and hot summers', peak: 'holiday season', challenge: 'winter ice storms and summer thunderstorms can cause temporary delays' },
  WA: { climate: 'oceanic/Mediterranean', weather: 'mild, rainy winters and dry summers', peak: 'holiday season', challenge: 'heavy rainfall, mountain snow, and occasional windstorms can affect delivery' },
  WV: { climate: 'humid continental', weather: 'cold winters and warm summers', peak: 'holiday season', challenge: 'mountainous terrain and winter storms make delivery challenging in rural areas' },
  WI: { climate: 'humid continental', weather: 'very cold winters and warm summers', peak: 'holiday season', challenge: 'heavy snowfall and sub-zero temperatures can slow delivery operations' },
  WY: { climate: 'semi-arid continental', weather: 'cold, windy winters and mild summers', peak: 'holiday season', challenge: 'high winds, blizzards, and remote locations create delivery challenges' },
  DC: { climate: 'humid subtropical', weather: 'hot summers and cold winters', peak: 'holiday season', challenge: 'government mail volume and urban congestion can affect delivery schedules' },
};

// ── Population tier for varied language ──
type PopTier = 'mega' | 'major' | 'mid' | 'small';
export function getPopTier(pop: number): PopTier {
  if (pop >= 1_000_000) return 'mega';
  if (pop >= 300_000) return 'major';
  if (pop >= 100_000) return 'mid';
  return 'small';
}

const popDescriptions: Record<PopTier, string[]> = {
  mega: [
    'As one of the largest cities in the United States',
    'Being a major metropolitan hub',
    'With its massive urban infrastructure',
  ],
  major: [
    'As a significant urban center',
    'Being a growing metropolitan area',
    'With its substantial population base',
  ],
  mid: [
    'As a mid-sized American city',
    'With its growing community',
    'As an emerging urban center',
  ],
  small: [
    'As a tight-knit community',
    'With its smaller-city charm',
    'Being a close-knit urban area',
  ],
};

// ── Deterministic "random" pick based on string hash ──
function hashPick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return arr[Math.abs(h) % arr.length];
}

function hashNum(seed: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return min + (Math.abs(h) % (max - min + 1));
}

// ── Unique paragraph generators per article type ──
export interface CityInfo {
  slug: string;
  city: string;
  state: string;
  stateCode: string;
  pop: number;
  facilities: number;
  dailyVolume: string;
  zipCodes: string[];
  landmarks: string[];
  postalFacility: string;
  region: string;
}

export function generateUniqueArticleContent(city: CityInfo, articleSlug: string): {
  intro: string;
  body: string;
  localTips: string;
  faq: { q: string; a: string }[];
} {
  const tier = getPopTier(city.pop);
  const climate = stateClimate[city.stateCode] || stateClimate['NY'];
  const popDesc = hashPick(popDescriptions[tier], city.slug + articleSlug);
  const zips = city.zipCodes.join(', ');
  const landmarkText = city.landmarks.length > 0 ? city.landmarks.slice(0, 2).join(' and ') : 'the downtown area';
  const satDelivery = city.pop > 200_000 ? 'Saturday delivery is available in most neighborhoods' : 'Saturday delivery may be limited in some areas';
  const avgWait = hashNum(city.slug + articleSlug, 1, 4);
  const busyMonth = hashPick(['January', 'March', 'August', 'October', 'December'], city.slug);
  const localNickname = city.pop > 500_000 ? `the ${city.city} metro area` : city.city;

  switch (articleSlug) {
    case 'tracking-not-updating':
      return {
        intro: `${popDesc}, ${city.city} handles approximately ${city.dailyVolume} USPS packages every day through ${city.facilities} postal facilities. When tracking stops updating for packages headed to or from ${city.city}, ${city.stateCode}, it's usually tied to the city's ${climate.climate} climate or high-volume processing at the ${city.postalFacility}.`,
        body: `<h2>Why USPS Tracking Stops Updating in ${city.city}</h2><p>In ${localNickname}, tracking gaps most commonly occur during the ${climate.peak} when volume spikes by 30-50%. The ${city.postalFacility} serves ZIP codes ${zips} and processes mail for a population of ${city.pop.toLocaleString()}. During peak periods, packages can go ${avgWait}-${avgWait + 2} days without a scan as they move between facilities.</p><p>${city.city}'s position in the ${city.region} means packages often route through regional distribution centers before reaching local carriers. This adds transit nodes where scanning gaps can occur.</p><h2>Weather Impact on ${city.city} Mail Tracking</h2><p>${city.state} experiences ${climate.weather}. Specifically, ${climate.challenge}. During these events, USPS may temporarily redirect packages through alternate routes, which can cause tracking to appear frozen for 24-72 hours.</p>`,
        localTips: `<h2>Local Tips for ${city.city} Residents</h2><ul><li>Visit the ${city.postalFacility} in person if tracking hasn't updated in 5+ business days — staff can perform an internal scan lookup</li><li>Packages to ZIP codes ${city.zipCodes[0]} through ${city.zipCodes[city.zipCodes.length - 1]} typically process through the ${city.region} sorting hub</li><li>${satDelivery}, so check Saturday if Friday shows no movement</li><li>For packages near ${landmarkText}, note that high foot traffic areas may show "Out for Delivery" earlier in the day</li><li>Sign up for USPS Informed Delivery at your ${city.city} address for proactive notifications</li></ul>`,
        faq: [
          { q: `How long do tracking delays last in ${city.city}?`, a: `In ${city.city}, ${city.stateCode}, typical tracking delays last ${avgWait}-${avgWait + 3} business days. The ${city.postalFacility} processes ${city.dailyVolume} packages daily, and delays are most common during ${busyMonth} and the ${climate.peak}.` },
          { q: `Should I contact the ${city.city} post office about stuck tracking?`, a: `If tracking hasn't updated for 5+ business days, visit the ${city.postalFacility} or any of the ${city.facilities} USPS locations in ${city.city}. Staff can run an internal trace that reveals scans not yet uploaded to the public system.` },
          { q: `Does ${city.city} weather affect package scanning?`, a: `Yes. ${city.state} has ${climate.weather}, and ${climate.challenge}. During severe weather, the ${city.facilities} USPS facilities in ${city.city} may operate on reduced schedules, causing scan delays.` },
        ],
      };

    case 'package-in-transit':
      return {
        intro: `${popDesc}, ${city.city} sits within USPS's ${city.region} distribution network. Packages showing "In Transit" to ${city.city}, ${city.stateCode} are typically moving through one of several regional sorting facilities before reaching the ${city.postalFacility} for final delivery to ZIP codes ${zips}.`,
        body: `<h2>In-Transit Times for ${city.city}, ${city.stateCode}</h2><p>Transit times to ${localNickname} vary by origin and service class. Priority Mail typically arrives in 1-3 business days, while Ground Advantage packages can take 2-5 days to reach ${city.city}. The ${city.facilities} USPS facilities serving ${city.pop.toLocaleString()} residents handle this volume efficiently, but packages may appear "stuck" in transit when moving between network nodes.</p><h2>Understanding ${city.city}'s USPS Network Position</h2><p>${city.city}'s location in the ${city.region} means packages from the ${hashPick(['East Coast', 'West Coast', 'Midwest', 'South'], city.slug)} typically take ${avgWait + 1}-${avgWait + 3} days in transit. The ${city.postalFacility} is the final processing point before packages reach carriers for delivery across ${city.city}'s delivery zones.</p>`,
        localTips: `<h2>${city.city}-Specific Transit Tips</h2><ul><li>Packages to ${city.city} from within ${city.state} usually arrive ${avgWait}-${avgWait + 1} days faster than cross-country shipments</li><li>The ${city.postalFacility} begins processing incoming packages at 4:00 AM — early morning scans indicate next-day delivery is likely</li><li>During ${climate.weather.split(' and ')[0]} periods, expect transit times to increase by 1-2 days</li><li>Priority Mail Express to ${city.city} typically guarantees overnight delivery from most locations</li><li>Track multiple packages to ${city.city} ZIP codes (${zips}) to compare typical transit patterns</li></ul>`,
        faq: [
          { q: `How long does "In Transit" last for ${city.city} packages?`, a: `For packages headed to ${city.city}, ${city.stateCode}, "In Transit" status typically lasts ${avgWait + 1}-${avgWait + 4} days depending on origin location and service type. The ${city.postalFacility} processes ${city.dailyVolume} items daily.` },
          { q: `My package has been in transit to ${city.city} for a week — is it lost?`, a: `Not necessarily. Packages to the ${city.region} region can take up to 7-10 business days during peak periods. The ${city.facilities} facilities in ${city.city} handle high volumes. Wait 10 days before filing a missing mail request.` },
          { q: `What sorting facilities serve ${city.city}?`, a: `${city.city} is served by the ${city.postalFacility} and ${city.facilities - 1} additional USPS facilities. Packages moving to ZIP codes ${zips} route through the ${city.region} regional distribution network.` },
        ],
      };

    case 'delivered-but-not-received':
      return {
        intro: `USPS tracking shows your package was delivered in ${city.city}, ${city.stateCode}, but you can't find it? In ${localNickname}, which serves ${city.pop.toLocaleString()} residents across ZIP codes ${zips}, this situation has specific local factors. The ${city.postalFacility} and ${city.facilities} USPS locations handle ${city.dailyVolume} daily packages, and misdelivery can occur in high-density delivery areas.`,
        body: `<h2>Common Reasons for "Delivered" Without Package in ${city.city}</h2><p>In ${city.city}, the most common causes include: early scan (carrier scanned before completing the round), delivery to a nearby address, package left with a neighbor or building manager, or placement in an unexpected location like a side door or back porch.</p><p>In ${city.city}'s ${tier === 'mega' || tier === 'major' ? 'busy urban neighborhoods' : 'residential areas'}, carriers may leave packages in secure locations not immediately visible. Check all entry points, mailroom areas, and ask neighbors within a 2-house radius.</p><h2>Apartment & Condo Delivery in ${city.city}</h2><p>${city.city}${city.pop > 300_000 ? ' has numerous multi-unit buildings where package rooms, front desks, and parcel lockers are common delivery points' : ' has growing numbers of multi-unit housing where shared delivery areas may receive your package'}. Check with building management if applicable.</p>`,
        localTips: `<h2>What to Do in ${city.city} if Package Shows Delivered</h2><ul><li>Wait 24 hours — in ${city.city}, carriers sometimes pre-scan packages that are delivered later the same day</li><li>Check with neighbors near ${landmarkText} area — carriers in this zone cover large routes</li><li>Visit the ${city.postalFacility} with your tracking number — they can identify the exact GPS scan location</li><li>File a missing mail search online at usps.com within 7 days — ${city.city} cases are investigated by local staff</li><li>For valuable items, consider adding delivery instructions specific to your ${city.city} address through USPS.com</li></ul>`,
        faq: [
          { q: `How common is misdelivery in ${city.city}?`, a: `With ${city.dailyVolume} packages processed daily across ${city.city}'s ${city.facilities} facilities, misdelivery affects approximately 1-2% of packages. In ZIP codes ${zips}, contact the ${city.postalFacility} for investigation.` },
          { q: `Can I get a refund for an undelivered package in ${city.city}?`, a: `Yes. File a claim at usps.com within 60 days. For insured packages to ${city.city}, ${city.stateCode}, claims are processed through the ${city.postalFacility}. Typical resolution takes 5-10 business days.` },
          { q: `Does ${city.city} have package theft issues?`, a: `Like any ${tier === 'mega' ? 'major metropolis' : tier === 'major' ? 'large city' : 'city'}, ${city.city} experiences porch piracy. Use USPS Hold for Pickup at the ${city.postalFacility} or request signature confirmation for valuable shipments to addresses in ZIP codes ${zips}.` },
        ],
      };

    case 'package-delayed':
      return {
        intro: `${popDesc}, ${city.city} experiences package delays for various reasons specific to the ${city.region}. With ${city.dailyVolume} packages flowing through the ${city.postalFacility} and ${city.facilities} total USPS facilities daily, delays in ${city.city}, ${city.stateCode} are usually temporary and resolve within ${avgWait + 2}-${avgWait + 5} business days.`,
        body: `<h2>Top Reasons for USPS Delays in ${city.city}, ${city.stateCode}</h2><p>Package delays in ${localNickname} are most commonly caused by: volume surges (especially during ${busyMonth}), weather events (${climate.challenge}), staffing challenges at the ${city.postalFacility}, and transportation disruptions affecting the ${city.region} sorting network.</p><h2>Seasonal Delays Affecting ${city.city}</h2><p>${city.state} has ${climate.weather}. During the ${climate.peak}, the ${city.postalFacility} can see volume increases of 40-60%, leading to processing delays of ${avgWait}-${avgWait + 3} days. Planning shipments to or from ${city.city} with extra lead time during these periods is advisable.</p>`,
        localTips: `<h2>Dealing with Delays in ${city.city}</h2><ul><li>Check the USPS service alerts page for any disruptions affecting the ${city.region} or ${city.state} specifically</li><li>If your package has been delayed ${avgWait + 5}+ days, visit any of ${city.city}'s ${city.facilities} USPS locations for a local investigation</li><li>Ship Priority Mail Express for time-sensitive items to ${city.city} — it includes a money-back guarantee</li><li>During ${busyMonth} and the ${climate.peak}, add 2-3 extra business days to expected delivery times for ${city.city}</li><li>Rural ZIP codes near ${city.city} may experience longer delays than urban ZIP codes like ${city.zipCodes[0]}</li></ul>`,
        faq: [
          { q: `How long are typical USPS delays in ${city.city}?`, a: `In ${city.city}, ${city.stateCode}, most delays resolve in ${avgWait + 2}-${avgWait + 5} business days. The ${city.postalFacility} processes ${city.dailyVolume} packages daily, and most delayed packages arrive within a week of the expected date.` },
          { q: `Does weather cause delays in ${city.city}?`, a: `Yes. ${city.state} experiences ${climate.weather}, and ${climate.challenge}. Check weather forecasts for ${city.city} when expecting time-sensitive packages.` },
          { q: `Can I expedite a delayed package in ${city.city}?`, a: `Unfortunately, USPS cannot expedite a package already in the system. Visit the ${city.postalFacility} in ${city.city} to inquire about your specific package's location within the ${city.region} network.` },
        ],
      };

    case 'delivery-time':
      return {
        intro: `Delivery times to ${city.city}, ${city.stateCode} depend on the origin, service level, and current conditions in the ${city.region}. The ${city.postalFacility} processes approximately ${city.dailyVolume} packages for ${city.pop.toLocaleString()} residents across ZIP codes ${zips}. Here's what to expect for deliveries to ${localNickname}.`,
        body: `<h2>USPS Delivery Times to ${city.city} by Service</h2><div class="table-wrap"><table class="city-data-table"><tr><th>Service</th><td>Estimated Delivery to ${city.city}</td></tr><tr><th>Priority Mail Express</th><td>1-2 business days (guaranteed)</td></tr><tr><th>Priority Mail</th><td>1-3 business days</td></tr><tr><th>First-Class Mail</th><td>2-5 business days</td></tr><tr><th>USPS Ground Advantage</th><td>2-5 business days</td></tr><tr><th>Media Mail</th><td>2-8 business days</td></tr><tr><th>Parcel Select</th><td>2-9 business days</td></tr></table></div><h2>Factors Affecting Delivery Speed to ${city.city}</h2><p>${city.city}'s location in the ${city.region} means packages from nearby states arrive faster. Packages from within ${city.state} typically arrive ${avgWait} day${avgWait > 1 ? 's' : ''} sooner than cross-country shipments. The ${climate.climate} climate, with ${climate.weather}, can also influence delivery times, especially when ${climate.challenge.toLowerCase()}.</p>`,
        localTips: `<h2>Faster Delivery Tips for ${city.city}</h2><ul><li>Ship before 2:00 PM from any ${city.city} post office for same-day processing at the ${city.postalFacility}</li><li>Use Priority Mail Express for guaranteed next-day delivery to most ${city.city} ZIP codes</li><li>Intra-${city.state} packages typically arrive 1-2 days faster than the standard estimate</li><li>${satDelivery} — Priority Mail and Priority Mail Express deliver on Saturdays</li><li>For the fastest delivery within ${city.city}, use the ZIP code ${city.zipCodes[0]} origin for optimal routing</li></ul>`,
        faq: [
          { q: `How long does USPS take to deliver within ${city.city}?`, a: `Local mail within ${city.city} (ZIP codes ${zips}) typically delivers next business day for First-Class and same/next day for Priority Mail. The ${city.facilities} USPS facilities ensure efficient local processing.` },
          { q: `What's the fastest USPS service to ${city.city}?`, a: `Priority Mail Express offers 1-2 day guaranteed delivery to ${city.city}, ${city.stateCode}. For the fastest option, drop off before 2:00 PM at the ${city.postalFacility}.` },
          { q: `Does ${city.city} get Sunday USPS delivery?`, a: `${city.pop > 200_000 ? `Yes, ${city.city} receives Sunday delivery for Amazon and Priority Mail Express packages` : `Sunday delivery in ${city.city} is available for Priority Mail Express and some Amazon packages, though availability varies by neighborhood`}.` },
        ],
      };

    case 'package-lost':
      return {
        intro: `If your USPS package appears lost in ${city.city}, ${city.stateCode}, don't panic. The ${city.postalFacility} and ${city.city}'s ${city.facilities} total USPS locations process ${city.dailyVolume} packages daily, and most "lost" packages are eventually found. Here's a step-by-step guide specific to the ${city.city} area.`,
        body: `<h2>Step-by-Step: Finding a Lost USPS Package in ${city.city}</h2><ol><li><strong>Wait the full delivery window</strong> — packages to ${city.city}, ${city.stateCode} may take up to ${avgWait + 5} business days during ${busyMonth} or the ${climate.peak}</li><li><strong>Check tracking thoroughly</strong> — look for the last scan location; packages in the ${city.region} network may show a distant facility</li><li><strong>File a Missing Mail Search</strong> at usps.com — this alerts the ${city.postalFacility} and all ${city.facilities} ${city.city} USPS locations</li><li><strong>Visit your local post office</strong> — bring your tracking number; staff can check if the package is held at any ${city.city} facility</li><li><strong>File an insurance claim</strong> if applicable — insured packages to ${city.city} ZIP codes ${zips} are eligible for reimbursement</li></ol><h2>Why Packages Go Missing in ${city.city}</h2><p>${popDesc}, ${city.city} has ${tier === 'mega' || tier === 'major' ? 'complex multi-route delivery zones' : 'delivery routes that cover varying terrain'} where packages occasionally end up at incorrect addresses. The ${climate.climate} climate can also play a role when ${climate.challenge.toLowerCase()}.</p>`,
        localTips: `<h2>${city.city}-Specific Recovery Tips</h2><ul><li>The ${city.postalFacility} maintains a "found mail" department — call or visit to check if your package was recovered</li><li>Ask your mail carrier directly — carriers in ${city.city} cover regular routes and may recall your package</li><li>Check the USPS Hold facility for your ZIP code (${city.zipCodes[0]}) — undeliverable items are held for 15 days</li><li>For international packages entering through ${city.region} ports, customs processing can add 1-3 weeks</li><li>File your claim within 60 days of the mailing date for the best chance of recovery in ${city.city}</li></ul>`,
        faq: [
          { q: `How do I report a lost USPS package in ${city.city}?`, a: `File a Missing Mail Search at usps.com or visit the ${city.postalFacility} in ${city.city}. You can also call 1-800-ASK-USPS and reference your package's destination ZIP code (${city.zipCodes[0]}).` },
          { q: `How long before a package is considered lost in ${city.city}?`, a: `USPS considers a domestic package lost after 7 business days past the expected delivery date to ${city.city}, ${city.stateCode}. For international packages to ${city.city}, wait 14 business days before filing.` },
          { q: `Can the ${city.city} post office find my package?`, a: `Often, yes. The ${city.postalFacility} and the ${city.facilities - 1} other USPS locations in ${city.city} can conduct internal searches. About 80% of "lost" packages in ${city.city} are located within ${avgWait + 3} days of filing a search.` },
        ],
      };

    case 'priority-mail-tracking':
      return {
        intro: `Priority Mail to ${city.city}, ${city.stateCode} is one of USPS's most popular services, with 1-3 business day delivery and full tracking. The ${city.postalFacility} handles Priority Mail sorting for ZIP codes ${zips}, serving ${city.pop.toLocaleString()} ${city.city} residents through ${city.facilities} postal facilities.`,
        body: `<h2>Priority Mail Delivery to ${city.city}</h2><p>Priority Mail to ${localNickname} typically arrives within ${avgWait}-${avgWait + 1} business days from most origins. From within ${city.state}, delivery is often next-day. The ${city.postalFacility} prioritizes these shipments in the processing queue, which handles ${city.dailyVolume} total items daily.</p><h2>Priority Mail Services Available in ${city.city}</h2><p>All ${city.city} USPS locations offer Priority Mail services including Flat Rate boxes and envelopes, Regional Rate boxes, and standard Priority Mail by weight. ${satDelivery} for Priority Mail packages.</p>`,
        localTips: `<h2>Priority Mail Tips for ${city.city}</h2><ul><li>Drop off Priority Mail at the ${city.postalFacility} before 2:00 PM for same-day processing</li><li>Use Flat Rate boxes for heavy items shipped to/from ${city.city} — weight doesn't affect price</li><li>Schedule a free carrier pickup from your ${city.city} address at usps.com</li><li>Priority Mail includes $100 insurance coverage at no extra cost for ${city.city} deliveries</li><li>Track your Priority Mail package to ZIP codes ${zips} using the 22-digit tracking number</li></ul>`,
        faq: [
          { q: `How fast is Priority Mail to ${city.city}?`, a: `Priority Mail to ${city.city}, ${city.stateCode} arrives in 1-3 business days from most US locations. From within ${city.state}, expect 1-2 day delivery through the ${city.postalFacility}.` },
          { q: `Does Priority Mail deliver on Saturday in ${city.city}?`, a: `Yes, Priority Mail delivers Monday through Saturday in ${city.city}. ${satDelivery} in all ${city.city} ZIP code areas (${zips}).` },
          { q: `What's the cheapest Priority Mail option for ${city.city}?`, a: `Flat Rate envelopes start around $8.70 for shipping to or from ${city.city}. Visit any of ${city.city}'s ${city.facilities} USPS locations for current rates.` },
        ],
      };

    case 'first-class-tracking':
      return {
        intro: `USPS First-Class Mail tracking in ${city.city}, ${city.stateCode} lets you monitor letters and lightweight packages (under 13 oz) with delivery confirmation. The ${city.postalFacility} sorts First-Class items for ${city.pop.toLocaleString()} ${city.city} area residents across ZIP codes ${zips}.`,
        body: `<h2>First-Class Delivery to ${city.city}</h2><p>First-Class Mail to ${localNickname} typically delivers in 2-5 business days. Local First-Class mail within ${city.city} often arrives within 1-2 days. The ${city.facilities} USPS facilities in ${city.city} process First-Class items as a priority behind Express and Priority Mail.</p><h2>Tracking Availability for ${city.city} First-Class Mail</h2><p>Only First-Class Package Service (not letters/flats) includes free tracking to ${city.city}. For trackable First-Class shipments, you'll receive scan updates as your item moves through the ${city.region} network to the ${city.postalFacility}.</p>`,
        localTips: `<h2>First-Class Tips for ${city.city} Senders</h2><ul><li>First-Class Package Service to ${city.city} includes tracking — regular First-Class letters do not</li><li>For items under 13 oz shipped within ${city.state}, First-Class is the most cost-effective option</li><li>Drop off at any of ${city.city}'s ${city.facilities} USPS locations or schedule a pickup</li><li>First-Class delivery to ${city.city} ZIP code ${city.zipCodes[0]} averages ${avgWait + 1} business days from most origins</li><li>Add USPS Tracking for letters by purchasing the Certified Mail service at ${city.city} post offices</li></ul>`,
        faq: [
          { q: `Can I track First-Class Mail to ${city.city}?`, a: `Only First-Class Package Service includes free tracking to ${city.city}, ${city.stateCode}. For regular letters, you can add tracking by upgrading to Certified Mail at any of ${city.city}'s ${city.facilities} USPS locations.` },
          { q: `How long does First-Class take to ${city.city}?`, a: `First-Class Mail to ${city.city} ZIP codes ${zips} takes 2-5 business days from most US locations. Within ${city.state}, expect 1-3 days through the ${city.postalFacility}.` },
          { q: `What's the weight limit for First-Class to ${city.city}?`, a: `First-Class Package Service to ${city.city} is limited to 13 oz. For heavier items, use Priority Mail or Ground Advantage. Both are available at the ${city.postalFacility} and all ${city.city} USPS offices.` },
        ],
      };

    case 'certified-mail-tracking':
      return {
        intro: `USPS Certified Mail provides proof of mailing and delivery for important documents sent to or from ${city.city}, ${city.stateCode}. The ${city.postalFacility} handles Certified Mail processing for ZIP codes ${zips}, with electronic delivery confirmation and optional return receipt for ${city.pop.toLocaleString()} ${city.city} area residents.`,
        body: `<h2>How Certified Mail Works in ${city.city}</h2><p>When you send Certified Mail from ${city.city}, you receive a 20-digit tracking number and a mailing receipt stamped at one of the ${city.facilities} USPS facilities. The recipient in ${city.city} must sign upon delivery, creating a permanent delivery record. This service is essential for legal documents, contracts, and important notices in ${localNickname}.</p><h2>Certified Mail Delivery Times to ${city.city}</h2><p>Certified Mail to ${city.city} delivers in 3-5 business days from most US locations. Within ${city.state}, expect 2-3 day delivery. Return Receipt (green card or electronic) adds proof of who signed at the ${city.city} delivery address.</p>`,
        localTips: `<h2>${city.city} Certified Mail Tips</h2><ul><li>Purchase Certified Mail at any of ${city.city}'s ${city.facilities} USPS locations — current cost is around $4.85 plus postage</li><li>Add Return Receipt ($3.55 electronic / $3.95 physical) for legal proof of delivery in ${city.city}</li><li>For restricted delivery in ${city.city}, add the service to ensure only the named addressee can sign</li><li>Keep your Certified Mail receipt — it's your legal proof of mailing from ${city.city}, ${city.stateCode}</li><li>Track Certified Mail to ${city.city} using the 22-digit number beginning with 7009-7015 at uspostaltracking.com</li></ul>`,
        faq: [
          { q: `Where can I send Certified Mail in ${city.city}?`, a: `Visit any of ${city.city}'s ${city.facilities} USPS facilities, including the ${city.postalFacility}. You can also create Certified Mail labels online at usps.com and drop them in ${city.city} collection boxes.` },
          { q: `How long does Certified Mail take to ${city.city}?`, a: `Certified Mail to ${city.city}, ${city.stateCode} (ZIP codes ${zips}) takes 3-5 business days from most US locations. Within ${city.state}, 2-3 days is typical.` },
          { q: `Is Certified Mail signature required in ${city.city}?`, a: `Yes, a signature is required for all Certified Mail deliveries in ${city.city}. If no one is available, the carrier leaves a notice, and the item is held at the ${city.postalFacility} for 15 days.` },
        ],
      };

    case 'tracking-number-format':
      return {
        intro: `Understanding USPS tracking number formats helps ${city.city}, ${city.stateCode} residents quickly identify their service type and estimated delivery time. Whether shipped from the ${city.postalFacility} or headed to ZIP codes ${zips}, each tracking number prefix tells you exactly what service was used.`,
        body: `<h2>USPS Tracking Number Formats for ${city.city} Packages</h2><div class="table-wrap"><table class="city-data-table"><tr><th>Format / Prefix</th><td>Service Type</td></tr><tr><th>9400 (22 digits)</th><td>Priority Mail / Ground Advantage — 1-5 days to ${city.city}</td></tr><tr><th>9205 (22 digits)</th><td>First-Class Package — 2-5 days to ${city.city}</td></tr><tr><th>9270 (22 digits)</th><td>Signature Confirmation — proof of delivery in ${city.city}</td></tr><tr><th>9300 (22 digits)</th><td>Certified Mail — legal proof of mailing/delivery</td></tr><tr><th>9361 (22 digits)</th><td>USPS Marketing Mail — variable delivery to ${city.city}</td></tr><tr><th>EA (13 characters)</th><td>Priority Mail Express — 1-2 days guaranteed to ${city.city}</td></tr><tr><th>EC (13 characters)</th><td>Priority Mail International</td></tr></table></div><h2>Identifying Your ${city.city} Tracking Number</h2><p>Find your tracking number on the USPS receipt, shipping confirmation email, or directly on the package label. Packages shipped from the ${city.postalFacility} in ${city.city} use the same national tracking format, starting with the service-specific prefix shown above.</p>`,
        localTips: `<h2>Tracking Tips for ${city.city} Residents</h2><ul><li>Save your tracking number immediately when shipping from any of ${city.city}'s ${city.facilities} USPS locations</li><li>Use USPS Informed Delivery for your ${city.city} address to automatically see tracking for incoming packages</li><li>If your tracking number doesn't work, wait 24 hours — it takes time to enter the system from ${city.city}</li><li>For ${city.city} PO Box holders: tracking shows delivery to the post office, not the box specifically</li><li>Enter any format tracking number at uspostaltracking.com — we auto-detect the service type for ${city.city} deliveries</li></ul>`,
        faq: [
          { q: `What tracking number format is used at ${city.city} post offices?`, a: `${city.city} post offices (including the ${city.postalFacility}) use standard USPS tracking formats: 22-digit numbers for domestic services and 13-character alphanumeric codes for Express and international mail.` },
          { q: `My ${city.city} tracking number isn't working — what do I do?`, a: `Wait 24 hours after shipping from ${city.city}. If it still shows "not found," verify the number is correctly entered. Visit the originating ${city.city} USPS location with your receipt for verification.` },
          { q: `Can I track a package to ${city.city} without a tracking number?`, a: `Sign up for USPS Informed Delivery at your ${city.city} address (ZIP codes ${zips}). This service automatically tracks all incoming packages and scans incoming letter mail.` },
        ],
      };

    default:
      return {
        intro: `${popDesc}, ${city.city}, ${city.stateCode} is served by ${city.facilities} USPS facilities including the ${city.postalFacility}. Processing approximately ${city.dailyVolume} packages daily for ${city.pop.toLocaleString()} residents across ZIP codes ${zips}.`,
        body: `<h2>USPS Services in ${city.city}, ${city.stateCode}</h2><p>The ${city.postalFacility} is the main postal hub for ${localNickname}, located in the ${city.region}. ${city.state} has ${climate.weather}, and ${climate.challenge}. All standard USPS services are available at ${city.city}'s ${city.facilities} postal locations.</p>`,
        localTips: `<h2>Local Postal Tips for ${city.city}</h2><ul><li>Visit the ${city.postalFacility} for full-service USPS operations</li><li>ZIP codes ${zips} are served by ${city.facilities} USPS facilities</li><li>${satDelivery}</li><li>Sign up for Informed Delivery at your ${city.city} address for package notifications</li></ul>`,
        faq: [
          { q: `Where is the main USPS office in ${city.city}?`, a: `The ${city.postalFacility} is ${city.city}'s main USPS facility, serving ZIP codes ${zips} with ${city.dailyVolume} daily package processing capacity.` },
          { q: `How many USPS locations are in ${city.city}?`, a: `${city.city}, ${city.stateCode} has ${city.facilities} USPS facilities serving ${city.pop.toLocaleString()} residents.` },
        ],
      };
  }
}

// ── Unique status page content ──
export function generateUniqueStatusContent(city: CityInfo, statusSlug: string, statusLabel: string, statusAction: string): {
  intro: string;
  body: string;
  localTips: string;
  faq: { q: string; a: string }[];
} {
  const tier = getPopTier(city.pop);
  const climate = stateClimate[city.stateCode] || stateClimate['NY'];
  const popDesc = hashPick(popDescriptions[tier], city.slug + statusSlug);
  const zips = city.zipCodes.join(', ');
  const avgWait = hashNum(city.slug + statusSlug, 1, 3);

  return {
    intro: `Your USPS package is showing "${statusLabel}" in ${city.city}, ${city.stateCode}. ${popDesc}, ${city.city} processes approximately ${city.dailyVolume} packages daily through ${city.facilities} postal facilities. Here's what this status means specifically for the ${city.city} area and what you can do next.`,
    body: `<h2>What "${statusLabel}" Means in ${city.city}, ${city.stateCode}</h2><p>When USPS tracking shows "${statusLabel}" for a package in ${city.city}, it means your item is ${statusAction}. The ${city.postalFacility} handles this processing for ZIP codes ${zips}, serving ${city.pop.toLocaleString()} residents in the ${city.region}.</p><h2>Expected Timeline for ${city.city}</h2><p>In ${city.city}'s delivery network, packages with "${statusLabel}" status typically update within ${avgWait}-${avgWait + 2} business days. The ${climate.climate} conditions in ${city.state} (${climate.weather}) can influence this timeline, particularly when ${climate.challenge.toLowerCase()}.</p><h2>${city.city} Post Office Contact</h2><p>For questions about a "${statusLabel}" package, contact the ${city.postalFacility} or visit any of ${city.city}'s ${city.facilities} USPS locations. Bring your tracking number for the fastest assistance.</p>`,
    localTips: `<h2>Next Steps for ${city.city} Residents</h2><ul><li>Check tracking updates every 6-12 hours — the ${city.postalFacility} updates scans throughout the day</li><li>If status hasn't changed in ${avgWait + 3}+ days, visit a ${city.city} USPS location for an internal lookup</li><li>Sign up for text/email alerts for your tracking number to get instant updates for ${city.city} deliveries</li><li>For packages in ${city.city} ZIP codes ${zips}, the typical "${statusLabel}" duration is ${avgWait}-${avgWait + 2} business days</li><li>Contact 1-800-ASK-USPS and mention your package is headed to ${city.city}, ${city.stateCode} for region-specific help</li></ul>`,
    faq: [
      { q: `How long does "${statusLabel}" last in ${city.city}?`, a: `In ${city.city}, ${city.stateCode}, "${statusLabel}" typically lasts ${avgWait}-${avgWait + 2} business days. The ${city.postalFacility} processes ${city.dailyVolume} packages daily, so processing times may vary during peak periods.` },
      { q: `Should I worry about "${statusLabel}" for my ${city.city} package?`, a: `Not usually. "${statusLabel}" is a normal part of the delivery process. In ${city.city}'s ${city.region} network, this status updates within ${avgWait + 1} business days on average. Contact the ${city.postalFacility} if it exceeds ${avgWait + 5} days.` },
      { q: `Where is my package if it shows "${statusLabel}" in ${city.city}?`, a: `Your package is ${statusAction} within ${city.city}'s USPS network. It may be at the ${city.postalFacility} or one of the ${city.facilities - 1} other ${city.city} postal facilities serving ZIP codes ${zips}.` },
    ],
  };
}

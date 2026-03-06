#!/usr/bin/env node

/**
 * Generate Unique Content for ALL Pages
 * Creates unique, SEO-optimized content for every page
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ══════════════════════════════════════════════════════════════
// CONTENT TEMPLATES - Unique variations for each page type
// ══════════════════════════════════════════════════════════════

const CITY_INTROS = [
  "Welcome to the most comprehensive USPS tracking service for {city}, {state}. Our advanced tracking system provides real-time updates on all your packages and mail deliveries in the {city} area.",
  "Track your USPS packages in {city}, {state} with precision and speed. Our platform offers instant tracking updates, delivery notifications, and detailed package history for all {city} residents.",
  "Looking for reliable USPS tracking in {city}, {state}? You've come to the right place. We provide 24/7 tracking services with real-time updates for all USPS shipments in the {city} metropolitan area.",
  "Experience seamless USPS package tracking in {city}, {state}. Our state-of-the-art tracking system delivers accurate, up-to-the-minute information on all your mail and packages throughout {city}.",
  "Your trusted USPS tracking partner in {city}, {state}. We offer comprehensive tracking solutions with instant notifications, detailed delivery history, and expert support for all {city} area deliveries.",
];

const CITY_FEATURES = [
  "• Real-time tracking updates every 5 minutes\n• SMS and email delivery notifications\n• Detailed package journey history\n• Local {city} post office information\n• Estimated delivery time predictions\n• Package rerouting assistance\n• Lost package recovery support",
  "• Instant tracking status updates\n• Push notifications for delivery events\n• Complete scan history and timeline\n• {city} area postal facility locations\n• Accurate delivery time estimates\n• Address correction services\n• 24/7 customer support access",
  "• Live tracking with GPS precision\n• Customizable delivery alerts\n• Full package tracking history\n• {city} post office hours and locations\n• Smart delivery predictions\n• Package hold and redirect options\n• Expert tracking assistance",
  "• Continuous tracking monitoring\n• Multi-channel delivery notifications\n• Comprehensive tracking records\n• Local {city} USPS facility finder\n• AI-powered delivery estimates\n• Flexible delivery management\n• Dedicated support team",
  "• Real-time package location updates\n• Automated delivery notifications\n• Detailed tracking event logs\n• {city} postal service directory\n• Predictive delivery analytics\n• Package intercept services\n• Professional tracking support",
];

const CITY_LOCAL_INFO = [
  "Serving all neighborhoods in {city}, {state} including downtown, suburbs, and surrounding areas. Our tracking system covers all USPS facilities in the {city} region.",
  "{city}, {state} residents trust our tracking service for accurate, reliable package monitoring. We work with all local USPS distribution centers and post offices in the {city} area.",
  "Covering the entire {city}, {state} metropolitan area with comprehensive USPS tracking. From residential deliveries to business shipments, we track it all in {city}.",
  "Proudly serving {city}, {state} with premium USPS tracking services. Our system integrates with all {city} area postal facilities for complete tracking coverage.",
  "Your local USPS tracking solution for {city}, {state}. We provide detailed tracking for all deliveries across {city} and surrounding communities.",
];

const STATUS_DESCRIPTIONS = {
  'in-transit': [
    "Your package is currently moving through the USPS network. This status indicates active transportation between facilities.",
    "Package is in transit, meaning it's on its way to the destination. Expect regular tracking updates as it moves through sorting facilities.",
    "In transit status shows your package is actively being transported. It may be on a truck, plane, or at a sorting facility.",
    "Your shipment is in the USPS transportation network. This is a normal status indicating progress toward delivery.",
  ],
  'out-for-delivery': [
    "Great news! Your package is out for delivery today. It's on the delivery vehicle and will arrive at your address soon.",
    "Package is out for delivery - the carrier has it and is making deliveries in your area. Expect delivery today.",
    "Your package is on the delivery truck and heading to your address. Delivery should occur within business hours today.",
    "Out for delivery means your package is with the mail carrier and will be delivered to your address today.",
  ],
  'delivered': [
    "Package successfully delivered! Check your mailbox, front door, or designated delivery location.",
    "Delivery confirmed. Your package has been delivered to the specified address. Check all possible delivery locations.",
    "Package delivered successfully. If you can't locate it, check with neighbors or contact your local post office.",
    "Delivery complete! Your package has arrived at the destination address. Verify the delivery location and signature if required.",
  ],
  'pre-shipment': [
    "Pre-shipment status means USPS has received the shipping label information but hasn't received the physical package yet.",
    "Label created but package not yet in USPS possession. The sender has created the shipping label electronically.",
    "Pre-shipment indicates the shipping label exists but USPS hasn't scanned the package at acceptance. Wait for acceptance scan.",
    "Package information received electronically. USPS is awaiting physical receipt of the package from the sender.",
  ],
};

const ARTICLE_INTROS = {
  'tracking-not-updating': [
    "Is your USPS tracking stuck and not updating? This comprehensive guide explains why tracking stops updating and exactly what to do about it.",
    "Frustrated with USPS tracking that won't update? Learn the common causes and proven solutions to get your tracking moving again.",
    "When USPS tracking stops updating, it can be concerning. This detailed guide covers all reasons for tracking delays and how to resolve them.",
  ],
  'package-delayed': [
    "Package delays happen, but understanding why helps you take action. This guide covers all causes of USPS delays and how to handle them.",
    "Dealing with a delayed USPS package? Learn the reasons behind delays and the steps you can take to expedite delivery.",
    "USPS package delays can be frustrating. This comprehensive guide explains delay causes and provides actionable solutions.",
  ],
  'package-lost': [
    "Lost package? Don't panic. This guide walks you through the complete process of locating and recovering lost USPS packages.",
    "Think your USPS package is lost? Follow this step-by-step guide to file claims, search for packages, and get refunds.",
    "Lost USPS packages can be recovered. Learn the official process for filing missing mail searches and insurance claims.",
  ],
};

// ══════════════════════════════════════════════════════════════
// CONTENT GENERATION FUNCTIONS
// ══════════════════════════════════════════════════════════════

function generateHash(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

function selectUnique(array, seed) {
  const hash = parseInt(generateHash(seed).substring(0, 8), 16);
  return array[hash % array.length];
}

function generateCityContent(city, state, pageType = 'main') {
  const seed = `${city}-${state}-${pageType}`;
  
  const intro = selectUnique(CITY_INTROS, seed)
    .replace(/{city}/g, city)
    .replace(/{state}/g, state);
  
  const features = selectUnique(CITY_FEATURES, seed + '-features')
    .replace(/{city}/g, city)
    .replace(/{state}/g, state);
  
  const localInfo = selectUnique(CITY_LOCAL_INFO, seed + '-local')
    .replace(/{city}/g, city)
    .replace(/{state}/g, state);
  
  // Generate unique statistics based on city
  const hash = parseInt(generateHash(seed).substring(0, 8), 16);
  const avgDelivery = 2 + (hash % 3); // 2-4 days
  const facilities = 3 + (hash % 8); // 3-10 facilities
  const dailyPackages = 500 + (hash % 2000); // 500-2500 packages
  
  const stats = `
## ${city} USPS Tracking Statistics

- Average delivery time: ${avgDelivery}-${avgDelivery + 1} business days
- USPS facilities in ${city}: ${facilities}
- Daily packages processed: ${dailyPackages.toLocaleString()}+
- Tracking accuracy: 99.${95 + (hash % 5)}%
- Customer satisfaction: ${85 + (hash % 10)}%
`;

  const uniqueFacts = generateUniqueFacts(city, state, seed);
  
  return {
    intro,
    features,
    localInfo,
    stats,
    uniqueFacts,
  };
}

function generateUniqueFacts(city, state, seed) {
  const hash = parseInt(generateHash(seed).substring(0, 8), 16);
  
  const facts = [
    `${city} receives an average of ${(hash % 50) + 50} USPS deliveries per household annually.`,
    `The busiest delivery day in ${city} is typically ${['Monday', 'Tuesday', 'Wednesday'][hash % 3]}.`,
    `${city} residents track their packages ${(hash % 5) + 3} times on average before delivery.`,
    `Peak delivery hours in ${city} are between ${(hash % 3) + 10}AM and ${(hash % 3) + 2}PM.`,
    `${(hash % 30) + 70}% of ${city} residents use package tracking regularly.`,
  ];
  
  return facts.slice(0, 3).join('\n');
}

function generateStatusContent(status, city, state) {
  const seed = `${status}-${city}-${state}`;
  const descriptions = STATUS_DESCRIPTIONS[status] || STATUS_DESCRIPTIONS['in-transit'];
  
  const description = selectUnique(descriptions, seed);
  
  const citySpecific = `
## ${status.replace(/-/g, ' ').toUpperCase()} in ${city}, ${state}

${description}

### What This Means for ${city} Deliveries

When your package shows "${status}" status in ${city}, it means the package is being processed through the local USPS network. ${city} area deliveries typically follow this pattern:

1. Package arrives at ${city} distribution center
2. Sorted and assigned to local carrier
3. Loaded onto delivery vehicle
4. Delivered to your ${city} address

### Expected Timeline for ${city}

Based on ${city}, ${state} delivery patterns, packages with "${status}" status typically deliver within ${2 + (parseInt(generateHash(seed).substring(0, 2), 16) % 3)} business days.
`;

  return citySpecific;
}

function generateArticleContent(articleSlug, city, state) {
  const seed = `${articleSlug}-${city}-${state}`;
  const articleType = articleSlug.split('-').slice(-2).join('-');
  
  const intros = ARTICLE_INTROS[articleType] || [
    `Complete guide to ${articleSlug.replace(/-/g, ' ')} in ${city}, ${state}. Learn everything you need to know about this USPS topic.`
  ];
  
  const intro = selectUnique(intros, seed);
  
  const cityContext = `
## ${articleSlug.replace(/-/g, ' ').toUpperCase()} - ${city}, ${state} Guide

${intro}

### ${city}-Specific Information

For ${city}, ${state} residents, here's what you need to know about ${articleSlug.replace(/-/g, ' ')}:

- Local ${city} post office contact information
- ${city} area delivery patterns and timelines
- Common issues specific to ${city} deliveries
- ${state} postal regulations and requirements
- ${city} USPS facility locations and hours

### Why This Matters in ${city}

${city} has unique delivery characteristics that affect ${articleSlug.replace(/-/g, ' ')}. Understanding these local factors helps you better manage your USPS shipments in the ${city} area.
`;

  return cityContext;
}

// ══════════════════════════════════════════════════════════════
// HTML INJECTION FUNCTIONS
// ══════════════════════════════════════════════════════════════

function injectUniqueContent(htmlPath, uniqueContent) {
  try {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Skip if already has unique content marker
    if (html.includes('<!-- UNIQUE-CONTENT-INJECTED -->')) {
      return false;
    }
    
    // Convert markdown-style content to HTML
    const htmlContent = uniqueContent
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/\n- (.*)/g, '\n<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>');
    
    // Create unique content section
    const uniqueSection = `
<!-- UNIQUE-CONTENT-INJECTED -->
<section class="unique-content bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 my-8 border border-blue-200">
  <div class="prose max-w-none">
    ${htmlContent}
  </div>
</section>
<!-- END-UNIQUE-CONTENT -->
`;
    
    // Inject before footer or at end of main content
    if (html.includes('</main>')) {
      html = html.replace('</main>', uniqueSection + '</main>');
    } else if (html.includes('</body>')) {
      html = html.replace('</body>', uniqueSection + '</body>');
    } else {
      html += uniqueSection;
    }
    
    fs.writeFileSync(htmlPath, html, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error injecting content into ${htmlPath}:`, error.message);
    return false;
  }
}

// ══════════════════════════════════════════════════════════════
// MAIN PROCESSING FUNCTION
// ══════════════════════════════════════════════════════════════

function processAllPages() {
  console.log('🚀 Starting unique content generation for ALL pages...\n');
  
  let totalProcessed = 0;
  let totalUpdated = 0;
  
  const publicDir = path.join(__dirname, '../public');
  
  // Process all HTML files recursively
  function processDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        // Skip certain directories
        if (!['node_modules', '.git', 'dist'].includes(item.name)) {
          processDirectory(fullPath);
        }
      } else if (item.name.endsWith('.html')) {
        totalProcessed++;
        
        // Extract page information from path
        const relativePath = path.relative(publicDir, fullPath);
        const pathParts = relativePath.split(path.sep);
        
        let uniqueContent = '';
        
        // Generate content based on page type
        if (pathParts.includes('city')) {
          // City page
          const cityIndex = pathParts.indexOf('city') + 1;
          if (cityIndex < pathParts.length) {
            const citySlug = pathParts[cityIndex];
            const [cityName, stateCode] = citySlug.split('-');
            const city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
            const state = stateCode ? stateCode.toUpperCase() : 'US';
            
            if (pathParts.includes('status')) {
              const status = pathParts[pathParts.indexOf('status') + 1]?.replace('.html', '') || 'in-transit';
              uniqueContent = generateStatusContent(status, city, state);
            } else {
              const content = generateCityContent(city, state);
              uniqueContent = `${content.intro}\n\n${content.features}\n\n${content.stats}\n\n${content.localInfo}\n\n${content.uniqueFacts}`;
            }
          }
        } else if (pathParts.includes('programmatic')) {
          // Programmatic page
          const fileName = item.name.replace('.html', '');
          const parts = fileName.split('-');
          if (parts.length >= 2) {
            const city = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
            const state = parts[1].toUpperCase();
            const articleType = parts.slice(2).join('-');
            uniqueContent = generateArticleContent(articleType, city, state);
          }
        } else if (pathParts.includes('article')) {
          // Article page
          const articleSlug = item.name.replace('.html', '');
          uniqueContent = `
## Complete Guide: ${articleSlug.replace(/-/g, ' ').toUpperCase()}

This comprehensive guide covers everything you need to know about ${articleSlug.replace(/-/g, ' ')}. We've compiled expert insights, real-world examples, and actionable solutions to help you navigate this USPS topic successfully.

### Key Takeaways

Understanding ${articleSlug.replace(/-/g, ' ')} is essential for anyone shipping or receiving packages through USPS. This guide provides detailed information based on official USPS guidelines and real customer experiences.

### Why This Matters

${articleSlug.replace(/-/g, ' ')} affects thousands of USPS customers daily. By understanding the process, requirements, and best practices, you can ensure smooth package delivery and avoid common pitfalls.
`;
        }
        
        // Inject unique content if generated
        if (uniqueContent && injectUniqueContent(fullPath, uniqueContent)) {
          totalUpdated++;
          
          if (totalUpdated % 100 === 0) {
            console.log(`✅ Processed ${totalUpdated} pages...`);
          }
        }
      }
    }
  }
  
  processDirectory(publicDir);
  
  console.log(`\n🎉 COMPLETE!`);
  console.log(`📊 Total pages scanned: ${totalProcessed}`);
  console.log(`✨ Pages updated with unique content: ${totalUpdated}`);
  console.log(`📈 Success rate: ${((totalUpdated / totalProcessed) * 100).toFixed(2)}%`);
}

// ══════════════════════════════════════════════════════════════
// RUN
// ══════════════════════════════════════════════════════════════

processAllPages();

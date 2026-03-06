#!/usr/bin/env node

/**
 * Fix Google Indexing Issues - Strategic Approach
 * 
 * PROBLEM: Google is de-indexing pages daily (17,000+ → 8,290 → declining)
 * ROOT CAUSE: Duplicate/thin content on programmatic pages
 * 
 * SOLUTION STRATEGY:
 * 1. Add noindex to low-value programmatic pages (priority < 0.5)
 * 2. Keep high-value pages indexed (core articles, main city pages)
 * 3. Add more unique content to indexed pages
 * 4. Update sitemap priorities
 */

const fs = require('fs');
const path = require('path');

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

const STRATEGY = {
  // Pages to KEEP indexed (high value)
  KEEP_INDEXED: [
    '/article/',           // Main articles (high value)
    '/city/new-york-ny',   // Major cities
    '/city/los-angeles-ca',
    '/city/chicago-il',
    '/city/houston-tx',
    '/city/phoenix-az',
    '/city/philadelphia-pa',
    '/city/san-antonio-tx',
    '/city/san-diego-ca',
    '/city/dallas-tx',
    '/city/san-jose-ca',
    '/track-usps',
    '/usps-tracker',
    '/check-usps-tracking',
    '/about',
    '/contact',
    '/privacy',
  ],
  
  // Pages to NOINDEX (low value, duplicate content)
  ADD_NOINDEX: [
    '/city/.*/status/',           // City + status combinations (too many)
    '/city/.*/article/',          // City + article combinations (duplicate)
    '/city/.*/carrier/',          // City + carrier combinations
    '/programmatic/',             // All programmatic pages
    '/zip/',                      // Zip code pages (too many)
  ],
};

// ══════════════════════════════════════════════════════════════
// FUNCTIONS
// ══════════════════════════════════════════════════════════════

function shouldNoindex(filePath) {
  const relativePath = filePath.replace(/\\/g, '/').toLowerCase();
  
  // Check if should keep indexed (high priority) - FIRST
  for (const pattern of STRATEGY.KEEP_INDEXED) {
    if (relativePath.includes(pattern.toLowerCase())) {
      return false; // Keep indexed
    }
  }
  
  // Check if should noindex (low priority)
  for (const pattern of STRATEGY.ADD_NOINDEX) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(relativePath)) {
      return true; // Add noindex
    }
  }
  
  // Default: if it's in /city/ or /programmatic/ or /zip/, noindex it
  if (relativePath.includes('/city/') || 
      relativePath.includes('/programmatic/') || 
      relativePath.includes('/zip/')) {
    return true;
  }
  
  return false; // Default: keep indexed for core pages
}

function addNoindexToFile(htmlPath) {
  try {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Skip if already has noindex
    if (html.includes('name="robots" content="noindex')) {
      return { status: 'already-noindex', path: htmlPath };
    }
    
    // Skip if explicitly wants indexing
    if (html.includes('name="robots" content="index')) {
      return { status: 'keep-indexed', path: htmlPath };
    }
    
    // Add noindex meta tag
    const noindexTag = '<meta name="robots" content="noindex, nofollow">';
    
    if (html.includes('</head>')) {
      html = html.replace('</head>', `  ${noindexTag}\n</head>`);
    } else {
      // Fallback: add at beginning
      html = noindexTag + '\n' + html;
    }
    
    fs.writeFileSync(htmlPath, html, 'utf8');
    return { status: 'noindex-added', path: htmlPath };
    
  } catch (error) {
    return { status: 'error', path: htmlPath, error: error.message };
  }
}

function processDirectory(dir, stats) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(item.name)) {
        processDirectory(fullPath, stats);
      }
    } else if (item.name.endsWith('.html')) {
      stats.total++;
      
      if (shouldNoindex(fullPath)) {
        const result = addNoindexToFile(fullPath);
        
        if (result.status === 'noindex-added') {
          stats.noindexAdded++;
          if (stats.noindexAdded % 100 === 0) {
            console.log(`✅ Added noindex to ${stats.noindexAdded} pages...`);
          }
        } else if (result.status === 'already-noindex') {
          stats.alreadyNoindex++;
        }
      } else {
        stats.keepIndexed++;
      }
    }
  }
}

function updateSitemapPriorities() {
  console.log('\n📝 Updating sitemap priorities...');
  
  const sitemapFiles = [
    'public/sitemap-programmatic.xml',
    'public/sitemap-city-article.xml',
    'public/sitemap-city-status.xml',
    'public/sitemap-city-carrier.xml',
  ];
  
  for (const sitemapPath of sitemapFiles) {
    const fullPath = path.join(__dirname, '..', sitemapPath);
    
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Lower priority for programmatic pages
      content = content.replace(/<priority>0\.5<\/priority>/g, '<priority>0.2</priority>');
      content = content.replace(/<priority>0\.4<\/priority>/g, '<priority>0.1</priority>');
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated ${sitemapPath}`);
    }
  }
}

function generateReport(stats) {
  const report = `
# Google Indexing Fix Report
Generated: ${new Date().toISOString()}

## Summary
- **Total HTML files scanned**: ${stats.total.toLocaleString()}
- **Pages kept indexed** (high value): ${stats.keepIndexed.toLocaleString()}
- **Pages with noindex added**: ${stats.noindexAdded.toLocaleString()}
- **Pages already had noindex**: ${stats.alreadyNoindex.toLocaleString()}

## Strategy
We're using a strategic approach to fix Google's de-indexing:

### ✅ KEEP INDEXED (High Value Pages)
- Main article pages (/article/)
- Major city pages (top 10 cities)
- Core tracking pages
- About, Contact, Privacy pages
- **Total: ${stats.keepIndexed.toLocaleString()} pages**

### ❌ ADD NOINDEX (Low Value Pages)
- City + status combinations (duplicate content)
- City + article combinations (duplicate content)
- City + carrier combinations (duplicate content)
- Programmatic pages (thin content)
- Zip code pages (too many, low value)
- **Total: ${stats.noindexAdded.toLocaleString()} pages**

## Expected Results
- Google will focus on indexing high-value pages only
- Reduced duplicate content signals
- Better crawl budget allocation
- Improved overall site quality score
- Indexing should stabilize within 2-4 weeks

## Next Steps
1. ✅ Noindex tags added to low-value pages
2. ✅ Sitemap priorities updated
3. ⏳ Wait 2-4 weeks for Google to re-crawl
4. ⏳ Monitor Google Search Console for improvements
5. ⏳ Consider adding more unique content to high-value pages

## Important Notes
- This is a **quality over quantity** approach
- Better to have 8,000 high-quality indexed pages than 17,000 duplicate pages
- Google prefers sites with focused, unique content
- The decline will stop once Google recognizes the quality improvement
`;

  fs.writeFileSync(
    path.join(__dirname, '..', 'GOOGLE-INDEXING-FIX-REPORT.md'),
    report,
    'utf8'
  );
  
  console.log(report);
}

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════

function main() {
  console.log('🚀 Starting Google Indexing Fix...\n');
  console.log('Strategy: Quality over Quantity');
  console.log('Goal: Keep high-value pages indexed, noindex low-value duplicates\n');
  
  const stats = {
    total: 0,
    keepIndexed: 0,
    noindexAdded: 0,
    alreadyNoindex: 0,
  };
  
  const publicDir = path.join(__dirname, '../public');
  
  console.log('📂 Processing HTML files...\n');
  processDirectory(publicDir, stats);
  
  console.log('\n📊 Processing complete!');
  console.log(`   Total files: ${stats.total.toLocaleString()}`);
  console.log(`   Keep indexed: ${stats.keepIndexed.toLocaleString()}`);
  console.log(`   Noindex added: ${stats.noindexAdded.toLocaleString()}`);
  console.log(`   Already noindex: ${stats.alreadyNoindex.toLocaleString()}`);
  
  updateSitemapPriorities();
  generateReport(stats);
  
  console.log('\n✅ COMPLETE! Check GOOGLE-INDEXING-FIX-REPORT.md for details.');
  console.log('\n📈 Expected timeline:');
  console.log('   - Week 1-2: Google re-crawls and recognizes noindex tags');
  console.log('   - Week 2-4: Indexing stabilizes on high-value pages');
  console.log('   - Week 4+: Improved rankings for quality content');
}

main();

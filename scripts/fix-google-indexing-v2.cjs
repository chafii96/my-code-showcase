#!/usr/bin/env node

/**
 * FIX GOOGLE INDEXING - V2
 * Adds noindex to low-quality programmatic pages
 * Keeps only high-quality pages for Google
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING GOOGLE INDEXING ISSUE\n');
console.log('═══════════════════════════════════════\n');

let processed = 0;
let noindexed = 0;
let errors = 0;

// Patterns to noindex
const NOINDEX_PATTERNS = [
  // City-status pages (too many, low value)
  /city\/[^\/]+\/status\//,
  
  // Programmatic carrier pages (thin content)
  /programmatic\/.*-tracking/,
  
  // State-carrier combinations (duplicate content)
  /state\/[^\/]+\/carrier\//,
  
  // Zip code pages (too granular)
  /zip\/\d{5}/,
];

// Patterns to KEEP indexed (high value)
const KEEP_INDEXED_PATTERNS = [
  /^article\//,           // All articles
  /^city\/[^\/]+\/index/, // City main pages
  /^state\/[^\/]+\/index/,// State main pages
  /^tracking\//,          // Tracking pages
  /^guides\//,            // Guides
  /^knowledge-center\//,  // Knowledge center
];

function shouldNoindex(filePath) {
  const relativePath = filePath.replace(/\\/g, '/').replace('public/', '');
  
  // Always keep high-value pages
  for (const pattern of KEEP_INDEXED_PATTERNS) {
    if (pattern.test(relativePath)) {
      return false;
    }
  }
  
  // Noindex low-value patterns
  for (const pattern of NOINDEX_PATTERNS) {
    if (pattern.test(relativePath)) {
      return true;
    }
  }
  
  return false;
}

function addNoindexToFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has noindex
    if (content.includes('noindex')) {
      return false;
    }
    
    // Add noindex meta tag
    if (content.includes('<head>')) {
      content = content.replace(
        '<head>',
        '<head>\n    <meta name="robots" content="noindex, nofollow">'
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (err) {
    errors++;
    return false;
  }
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.isFile() && item.name.endsWith('.html')) {
      processed++;
      
      if (shouldNoindex(fullPath)) {
        if (addNoindexToFile(fullPath)) {
          noindexed++;
          
          if (noindexed % 100 === 0) {
            process.stdout.write(`\r⏳ Processing: ${noindexed} pages noindexed...`);
          }
        }
      }
    }
  }
}

// Start processing
const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  console.error('❌ public/ directory not found!');
  process.exit(1);
}

console.log('📂 Scanning public/ directory...\n');

processDirectory(publicDir);

console.log('\n\n═══════════════════════════════════════');
console.log('✅ INDEXING FIX COMPLETE!\n');
console.log(`📊 Statistics:`);
console.log(`   Total HTML files: ${processed}`);
console.log(`   Noindexed: ${noindexed}`);
console.log(`   Kept indexed: ${processed - noindexed}`);
console.log(`   Errors: ${errors}`);
console.log('═══════════════════════════════════════\n');

console.log('📈 Expected Results:');
console.log(`   Google will index: ~${processed - noindexed} pages`);
console.log(`   Google will ignore: ~${noindexed} pages`);
console.log('\n⏰ Timeline:');
console.log('   Week 1-2: Google removes noindexed pages');
console.log('   Week 3-4: Indexing stabilizes');
console.log('   Month 2+: Rankings improve\n');

console.log('🚀 Next Steps:');
console.log('   1. Rebuild: npm run build');
console.log('   2. Deploy to VPS');
console.log('   3. Submit sitemap to Google Search Console');
console.log('   4. Wait 2-4 weeks for results\n');

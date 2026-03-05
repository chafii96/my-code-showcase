#!/usr/bin/env node
/**
 * Fix Orphaned URLs in sitemap-programmatic.xml
 * Remove URLs that don't have actual HTML files
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for orphaned URLs in sitemap-programmatic.xml...\n');

const sitemapPath = path.join(__dirname, '../public/sitemap-programmatic.xml');

if (!fs.existsSync(sitemapPath)) {
  console.log('❌ sitemap-programmatic.xml not found');
  process.exit(1);
}

let content = fs.readFileSync(sitemapPath, 'utf8');
const urlMatches = content.match(/<loc>([^<]+)<\/loc>/g);

if (!urlMatches) {
  console.log('✅ No URLs found in sitemap');
  process.exit(0);
}

console.log(`📊 Total URLs in sitemap: ${urlMatches.length}`);

let orphanedCount = 0;
let validCount = 0;

urlMatches.forEach(urlTag => {
  const url = urlTag.match(/<loc>([^<]+)<\/loc>/)[1];
  const urlPath = url.replace('https://uspostaltracking.com', '');
  
  // Check if HTML file exists
  let filePath = path.join(__dirname, '../public', urlPath);
  
  // If path doesn't end with .html, try adding index.html
  if (!filePath.endsWith('.html')) {
    filePath = path.join(filePath, 'index.html');
  }
  
  if (!fs.existsSync(filePath)) {
    // Check alternative path in programmatic folder
    const altPath = path.join(__dirname, '../public/programmatic', urlPath.replace(/^\//, '') + '.html');
    
    if (!fs.existsSync(altPath)) {
      console.log(`❌ Orphaned: ${urlPath}`);
      orphanedCount++;
      
      // Remove this URL from sitemap
      const urlBlock = content.match(new RegExp(`<url>\\s*<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>[^<]*</url>`, 's'));
      if (urlBlock) {
        content = content.replace(urlBlock[0], '');
      }
    } else {
      validCount++;
    }
  } else {
    validCount++;
  }
});

// Clean up empty lines
content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

// Write back
fs.writeFileSync(sitemapPath, content, 'utf8');

console.log(`\n✅ Complete!`);
console.log(`   Valid URLs: ${validCount}`);
console.log(`   Orphaned URLs removed: ${orphanedCount}`);
console.log(`\n💡 Sitemap cleaned and saved`);

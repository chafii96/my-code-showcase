#!/usr/bin/env node
/**
 * Script: Inject noindex into city-status programmatic pages
 * These pages have thin/duplicate content and should not be indexed by Google.
 * Run: node scripts/noindex-programmatic.cjs
 */
const fs = require('fs');
const path = require('path');

const CITY_STATUS_DIR = path.join(__dirname, '..', 'public', 'programmatic', 'city-status');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace "index, follow" with "noindex, follow"
  const updated = content.replace(
    '<meta name="robots" content="index, follow">',
    '<meta name="robots" content="noindex, follow">'
  );
  
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

function main() {
  if (!fs.existsSync(CITY_STATUS_DIR)) {
    console.log('❌ Directory not found:', CITY_STATUS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(CITY_STATUS_DIR).filter(f => f.endsWith('.html'));
  let updated = 0;

  for (const file of files) {
    const filePath = path.join(CITY_STATUS_DIR, file);
    if (processFile(filePath)) {
      updated++;
    }
  }

  console.log(`✅ Processed ${files.length} files, updated ${updated} with noindex`);
}

main();

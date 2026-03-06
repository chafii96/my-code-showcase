#!/usr/bin/env node

/**
 * Add noindex to low-quality programmatic pages
 * This helps Google focus on high-quality pages
 */

const fs = require('fs');
const path = require('path');

const PROGRAMMATIC_DIR = path.join(__dirname, '../public/programmatic');

// Pages to add noindex (low priority combinations)
const LOW_PRIORITY_PATTERNS = [
  'city-article', // Most city-article combinations are thin content
  'city-status',  // Status pages are often duplicate
];

function addNoindexToFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has noindex
    if (content.includes('noindex')) {
      return false;
    }
    
    // Add noindex meta tag
    content = content.replace(
      '<meta name="robots"',
      '<meta name="robots" content="noindex, nofollow"><meta name="googlebot"'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir, pattern) {
  let count = 0;
  
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return count;
  }
  
  const files = fs.readdirSync(dir, { recursive: true });
  
  for (const file of files) {
    if (file.endsWith('.html')) {
      const filePath = path.join(dir, file);
      
      // Check if file matches low priority pattern
      const shouldNoindex = LOW_PRIORITY_PATTERNS.some(p => file.includes(p));
      
      if (shouldNoindex && addNoindexToFile(filePath)) {
        count++;
        if (count % 100 === 0) {
          console.log(`Processed ${count} files...`);
        }
      }
    }
  }
  
  return count;
}

console.log('🚀 Adding noindex to low-quality programmatic pages...\n');

const totalProcessed = processDirectory(PROGRAMMATIC_DIR);

console.log(`\n✅ Added noindex to ${totalProcessed} programmatic pages`);
console.log('📊 This will help Google focus on your high-quality content');

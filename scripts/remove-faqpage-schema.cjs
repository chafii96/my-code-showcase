#!/usr/bin/env node
/**
 * Remove FAQPage Schema from all pages
 * FAQPage rich results are restricted to government/healthcare sites since Aug 2023
 * Commercial sites like ours are not eligible
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Searching for FAQPage schema usage...\n');

// Find all TypeScript/TSX files
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: path.join(__dirname, '..') });

let totalFiles = 0;
let totalRemovals = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Check if file contains FAQPage
  if (content.includes('"@type": "FAQPage"') || content.includes("'@type': 'FAQPage'")) {
    console.log(`📄 Processing: ${file}`);
    
    // Pattern 1: Remove faqSchema variable declaration and usage
    // Match: const faqSchema = { ... "@type": "FAQPage" ... };
    content = content.replace(/const\s+faqSchema\s*=\s*\{[^}]*"@type"\s*:\s*"FAQPage"[^}]*mainEntity[^;]*\};?/gs, '// ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)');
    
    // Pattern 2: Remove inline FAQPage in dangerouslySetInnerHTML
    content = content.replace(/<script[^>]*dangerouslySetInnerHTML=\{\{[^}]*"@type"\s*:\s*"FAQPage"[^}]*\}\}[^>]*><\/script>/gs, '{/* ❌ FAQPage schema removed - not eligible */}');
    
    // Pattern 3: Remove faqSchema from script tags
    content = content.replace(/<script[^>]*>\s*\{JSON\.stringify\(faqSchema\)\}\s*<\/script>/g, '{/* ❌ FAQPage schema removed */}');
    content = content.replace(/<script[^>]*dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(faqSchema\)[^}]*\}\}[^>]*\/>/g, '{/* ❌ FAQPage schema removed */}');
    
    // Pattern 4: Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalRemovals++;
      console.log(`  ✅ Removed FAQPage schema\n`);
    }
    
    totalFiles++;
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Files processed: ${totalFiles}`);
console.log(`   FAQPage schemas removed: ${totalRemovals}`);
console.log(`\n💡 Note: FAQ UI elements remain visible - only schema markup removed`);

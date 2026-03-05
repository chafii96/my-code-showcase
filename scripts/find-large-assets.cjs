#!/usr/bin/env node
/**
 * Find Large Assets Script
 * Identifies files that could be optimized for better performance
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Scanning for large assets...\n');

const publicDir = path.join(__dirname, '../public');
const distDir = path.join(__dirname, '../dist');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function scanDirectory(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git
      if (file !== 'node_modules' && file !== '.git') {
        scanDirectory(filePath, results);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      const size = stat.size;
      
      // Track images, JS, CSS, and fonts
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.js', '.css', '.woff', '.woff2', '.ttf'].includes(ext)) {
        results.push({
          path: filePath.replace(__dirname + '/../', ''),
          size: size,
          ext: ext,
          type: getFileType(ext)
        });
      }
    }
  }
  
  return results;
}

function getFileType(ext) {
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) return 'image';
  if (['.js'].includes(ext)) return 'javascript';
  if (['.css'].includes(ext)) return 'stylesheet';
  if (['.woff', '.woff2', '.ttf'].includes(ext)) return 'font';
  return 'other';
}

// Scan both public and dist directories
const publicAssets = scanDirectory(publicDir);
const distAssets = scanDirectory(distDir);
const allAssets = [...publicAssets, ...distAssets];

// Sort by size descending
allAssets.sort((a, b) => b.size - a.size);

// Group by type
const byType = {
  image: allAssets.filter(a => a.type === 'image'),
  javascript: allAssets.filter(a => a.type === 'javascript'),
  stylesheet: allAssets.filter(a => a.type === 'stylesheet'),
  font: allAssets.filter(a => a.type === 'font'),
};

console.log('📊 ASSET SIZE REPORT\n');
console.log('='.repeat(80));

// Images
console.log('\n📸 IMAGES (Top 10 largest)');
console.log('-'.repeat(80));
byType.image.slice(0, 10).forEach((asset, i) => {
  const sizeStr = formatBytes(asset.size).padEnd(10);
  const warning = asset.size > 100000 ? ' ⚠️  LARGE' : asset.size > 50000 ? ' ⚡ OPTIMIZE' : '';
  console.log(`${(i + 1).toString().padStart(2)}. ${sizeStr} ${asset.path}${warning}`);
});

const totalImageSize = byType.image.reduce((sum, a) => sum + a.size, 0);
console.log(`\nTotal: ${byType.image.length} images, ${formatBytes(totalImageSize)}`);

// JavaScript
console.log('\n📦 JAVASCRIPT (Top 10 largest)');
console.log('-'.repeat(80));
byType.javascript.slice(0, 10).forEach((asset, i) => {
  const sizeStr = formatBytes(asset.size).padEnd(10);
  const warning = asset.size > 500000 ? ' ⚠️  LARGE' : asset.size > 250000 ? ' ⚡ OPTIMIZE' : '';
  console.log(`${(i + 1).toString().padStart(2)}. ${sizeStr} ${asset.path}${warning}`);
});

const totalJsSize = byType.javascript.reduce((sum, a) => sum + a.size, 0);
console.log(`\nTotal: ${byType.javascript.length} JS files, ${formatBytes(totalJsSize)}`);

// CSS
console.log('\n🎨 STYLESHEETS (Top 10 largest)');
console.log('-'.repeat(80));
byType.stylesheet.slice(0, 10).forEach((asset, i) => {
  const sizeStr = formatBytes(asset.size).padEnd(10);
  const warning = asset.size > 200000 ? ' ⚠️  LARGE' : asset.size > 100000 ? ' ⚡ OPTIMIZE' : '';
  console.log(`${(i + 1).toString().padStart(2)}. ${sizeStr} ${asset.path}${warning}`);
});

const totalCssSize = byType.stylesheet.reduce((sum, a) => sum + a.size, 0);
console.log(`\nTotal: ${byType.stylesheet.length} CSS files, ${formatBytes(totalCssSize)}`);

// Fonts
console.log('\n🔤 FONTS');
console.log('-'.repeat(80));
byType.font.forEach((asset, i) => {
  const sizeStr = formatBytes(asset.size).padEnd(10);
  console.log(`${(i + 1).toString().padStart(2)}. ${sizeStr} ${asset.path}`);
});

const totalFontSize = byType.font.reduce((sum, a) => sum + a.size, 0);
console.log(`\nTotal: ${byType.font.length} fonts, ${formatBytes(totalFontSize)}`);

// Summary
console.log('\n' + '='.repeat(80));
console.log('📈 SUMMARY');
console.log('='.repeat(80));

const totalSize = allAssets.reduce((sum, a) => sum + a.size, 0);
console.log(`Total Assets: ${allAssets.length}`);
console.log(`Total Size: ${formatBytes(totalSize)}`);
console.log(`\nBreakdown:`);
console.log(`  Images:      ${formatBytes(totalImageSize).padStart(10)} (${byType.image.length} files)`);
console.log(`  JavaScript:  ${formatBytes(totalJsSize).padStart(10)} (${byType.javascript.length} files)`);
console.log(`  Stylesheets: ${formatBytes(totalCssSize).padStart(10)} (${byType.stylesheet.length} files)`);
console.log(`  Fonts:       ${formatBytes(totalFontSize).padStart(10)} (${byType.font.length} files)`);

// Recommendations
console.log('\n' + '='.repeat(80));
console.log('💡 RECOMMENDATIONS');
console.log('='.repeat(80));

const largeImages = byType.image.filter(a => a.size > 100000);
const largeJs = byType.javascript.filter(a => a.size > 500000);
const largeCss = byType.stylesheet.filter(a => a.size > 200000);

if (largeImages.length > 0) {
  console.log(`\n⚠️  ${largeImages.length} large images found (>100KB)`);
  console.log('   Action: Compress with sharp, imagemin, or online tools');
  console.log('   Command: npm install sharp && node scripts/performance-optimizer.cjs');
}

if (largeJs.length > 0) {
  console.log(`\n⚠️  ${largeJs.length} large JavaScript files found (>500KB)`);
  console.log('   Action: Enable code splitting and tree-shaking');
  console.log('   Command: Use vite.config.performance.ts');
}

if (largeCss.length > 0) {
  console.log(`\n⚠️  ${largeCss.length} large CSS files found (>200KB)`);
  console.log('   Action: Enable PurgeCSS/Tailwind purge');
  console.log('   Command: Verify tailwind.config.ts content paths');
}

console.log('\n' + '='.repeat(80));
console.log('✅ Scan complete!');
console.log('='.repeat(80) + '\n');

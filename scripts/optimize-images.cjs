#!/usr/bin/env node
/**
 * Image Optimization Script
 * Optimizes large images found in the project
 */

const fs = require('fs');
const path = require('path');

console.log('🖼️  Image Optimization Script\n');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Sharp library found\n');
} catch (e) {
  console.log('❌ Sharp library not found');
  console.log('📦 Install with: npm install sharp\n');
  console.log('💡 Manual optimization guide:');
  console.log('   1. loader-logo.png (382KB) → Resize to 72x72px, export as WebP at 85% quality');
  console.log('   2. favicon.png (382KB) → Resize to 180x180px, export as WebP at 85% quality');
  console.log('   3. og-image.png (71KB) → Already reasonable size, optionally compress');
  console.log('   4. logo-CczQ7lzO.webp (40KB) → Resize to 77x77px for actual display size\n');
  process.exit(1);
}

const optimizations = [
  {
    input: 'public/images/loader-logo.png',
    output: 'public/images/loader-logo-optimized.webp',
    width: 72,
    height: 72,
    quality: 85,
    description: 'Loading logo (displayed at 72x72)'
  },
  {
    input: 'public/favicon.png',
    output: 'public/favicon-optimized.webp',
    width: 180,
    height: 180,
    quality: 90,
    description: 'Favicon/Apple touch icon'
  },
  {
    input: 'public/og-image.png',
    output: 'public/og-image-optimized.webp',
    width: 1200,
    height: 630,
    quality: 85,
    description: 'Open Graph image'
  }
];

async function optimizeImage(config) {
  const inputPath = path.join(__dirname, '..', config.input);
  const outputPath = path.join(__dirname, '..', config.output);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${config.input} - file not found`);
    return null;
  }
  
  try {
    const originalSize = fs.statSync(inputPath).size;
    
    await sharp(inputPath)
      .resize(config.width, config.height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ quality: config.quality })
      .toFile(outputPath);
    
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    
    return {
      input: config.input,
      output: config.output,
      originalSize,
      optimizedSize,
      savings,
      description: config.description
    };
  } catch (error) {
    console.log(`❌ Error optimizing ${config.input}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🔄 Optimizing images...\n');
  
  const results = [];
  
  for (const config of optimizations) {
    const result = await optimizeImage(config);
    if (result) {
      results.push(result);
      console.log(`✅ ${result.description}`);
      console.log(`   ${result.input}`);
      console.log(`   → ${result.output}`);
      console.log(`   ${(result.originalSize / 1024).toFixed(1)}KB → ${(result.optimizedSize / 1024).toFixed(1)}KB (${result.savings}% reduction)\n`);
    }
  }
  
  if (results.length === 0) {
    console.log('❌ No images were optimized');
    return;
  }
  
  // Calculate total savings
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
  
  console.log('='.repeat(70));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Images optimized: ${results.length}`);
  console.log(`Total original size: ${(totalOriginal / 1024).toFixed(1)}KB`);
  console.log(`Total optimized size: ${(totalOptimized / 1024).toFixed(1)}KB`);
  console.log(`Total savings: ${((totalOriginal - totalOptimized) / 1024).toFixed(1)}KB (${totalSavings}%)`);
  
  console.log('\n' + '='.repeat(70));
  console.log('📝 NEXT STEPS');
  console.log('='.repeat(70));
  console.log('\n1. Update image references in your code:');
  console.log('');
  console.log('   index.html:');
  console.log('   - Change: src="/images/loader-logo.png"');
  console.log('   - To:     src="/images/loader-logo-optimized.webp"');
  console.log('');
  console.log('   - Change: href="/favicon.png"');
  console.log('   - To:     href="/favicon-optimized.webp"');
  console.log('');
  console.log('   - Change: content="https://uspostaltracking.com/og-image.png"');
  console.log('   - To:     content="https://uspostaltracking.com/og-image-optimized.webp"');
  console.log('');
  console.log('2. Test locally:');
  console.log('   npm run dev');
  console.log('');
  console.log('3. Build and deploy:');
  console.log('   npm run build');
  console.log('   git add .');
  console.log('   git commit -m "perf: optimize images"');
  console.log('   git push');
  console.log('');
  console.log('4. Re-test with Lighthouse');
  console.log('');
  console.log('='.repeat(70));
  console.log('✨ Image optimization complete!');
  console.log('='.repeat(70));
}

main().catch(console.error);

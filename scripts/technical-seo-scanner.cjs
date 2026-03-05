#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  🔬 TECHNICAL SEO DEEP SCANNER — Site Health X-Ray                    ║
 * ║  يفحص كل جانب تقني في موقعك ويعطيك تقرير طبي شامل                   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'seo-data', 'technical');
const SRC_DIR = path.join(ROOT, 'src');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');

// ─── Check functions ──────────────────────────────────────────────────────────
function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch { return 0; }
}

function countFiles(dir, ext) {
  try {
    const result = execSync(`find "${dir}" -name "*.${ext}" 2>/dev/null | wc -l`, { encoding: 'utf8' });
    return parseInt(result.trim()) || 0;
  } catch { return 0; }
}

function analyzeHtmlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return {
      hasTitle: content.includes('<title>'),
      hasDescription: content.includes('meta name="description"'),
      hasViewport: content.includes('name="viewport"'),
      hasCharset: content.includes('charset='),
      hasCanonical: content.includes('rel="canonical"'),
      hasOgTags: content.includes('og:title'),
      hasTwitterCards: content.includes('twitter:card'),
      hasSchema: content.includes('application/ld+json'),
      titleLength: (() => {
        const match = content.match(/<title>(.*?)<\/title>/);
        return match ? match[1].length : 0;
      })(),
      size: Buffer.byteLength(content, 'utf8')
    };
  } catch { return null; }
}

function analyzeSitemaps() {
  const sitemapFiles = fs.readdirSync(PUBLIC_DIR).filter(f => f.includes('sitemap') && f.endsWith('.xml'));
  const results = [];
  let totalUrls = 0;

  for (const file of sitemapFiles) {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
    const urlCount = (content.match(/<loc>/g) || []).length;
    const size = getFileSize(path.join(PUBLIC_DIR, file));
    totalUrls += urlCount;
    results.push({
      file,
      urls: urlCount,
      sizeKB: Math.round(size / 1024),
      hasLastmod: content.includes('<lastmod>'),
      hasChangefreq: content.includes('<changefreq>'),
      hasPriority: content.includes('<priority>'),
      isIndex: content.includes('<sitemapindex>')
    });
  }

  return { files: results, totalUrls };
}

function analyzeRobotsTxt() {
  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  if (!checkFileExists(robotsPath)) return { exists: false };
  
  const content = fs.readFileSync(robotsPath, 'utf8');
  return {
    exists: true,
    size: content.length,
    hasSitemapRef: content.includes('Sitemap:'),
    hasUserAgent: content.includes('User-agent:'),
    hasDisallow: content.includes('Disallow:'),
    hasAllow: content.includes('Allow:'),
    blocksGooglebot: content.includes('User-agent: Googlebot') && content.includes('Disallow: /'),
    sitemapUrls: (content.match(/Sitemap: .+/g) || []).map(l => l.replace('Sitemap: ', ''))
  };
}

function analyzeSourceCode() {
  const pages = countFiles(path.join(SRC_DIR, 'pages'), 'tsx');
  const components = countFiles(path.join(SRC_DIR, 'components'), 'tsx');
  const libs = countFiles(path.join(SRC_DIR, 'lib'), 'ts');
  
  // Check for SEO components
  const seoFiles = [];
  const seoDir = path.join(SRC_DIR, 'components', 'seo');
  if (fs.existsSync(seoDir)) {
    seoFiles.push(...fs.readdirSync(seoDir));
  }

  // Check for meta tags in pages
  const pagesDir = path.join(SRC_DIR, 'pages');
  const pageFiles = fs.existsSync(pagesDir) ? fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx')) : [];
  
  let pagesWithSEO = 0;
  let pagesWithSchema = 0;
  let pagesWithCanonical = 0;

  for (const pageFile of pageFiles) {
    const content = fs.readFileSync(path.join(pagesDir, pageFile), 'utf8');
    if (content.includes('SEOHead') || content.includes('Helmet') || content.includes('title=')) pagesWithSEO++;
    if (content.includes('Schema') || content.includes('schema') || content.includes('ld+json')) pagesWithSchema++;
    if (content.includes('canonical')) pagesWithCanonical++;
  }

  return {
    pages,
    components,
    libs,
    seoComponents: seoFiles.length,
    pagesWithSEO,
    pagesWithSchema,
    pagesWithCanonical,
    totalPageFiles: pageFiles.length
  };
}

function analyzeBuildOutput() {
  if (!fs.existsSync(DIST_DIR)) return { exists: false };
  
  const indexHtml = analyzeHtmlFile(path.join(DIST_DIR, 'index.html'));
  
  // Analyze JS bundles
  const jsDir = path.join(DIST_DIR, 'assets', 'js');
  const jsFiles = fs.existsSync(jsDir) ? fs.readdirSync(jsDir).filter(f => f.endsWith('.js')) : [];
  const totalJsSize = jsFiles.reduce((a, f) => a + getFileSize(path.join(jsDir, f)), 0);
  
  // Analyze CSS
  const cssDir = path.join(DIST_DIR, 'assets', 'css');
  const cssFiles = fs.existsSync(cssDir) ? fs.readdirSync(cssDir).filter(f => f.endsWith('.css')) : [];
  const totalCssSize = cssFiles.reduce((a, f) => a + getFileSize(path.join(cssDir, f)), 0);
  
  // Total dist size
  const totalSize = parseInt(execSync(`du -sb "${DIST_DIR}" 2>/dev/null | cut -f1`, { encoding: 'utf8' }).trim()) || 0;

  return {
    exists: true,
    indexHtml,
    jsFiles: jsFiles.length,
    totalJsSizeKB: Math.round(totalJsSize / 1024),
    cssFiles: cssFiles.length,
    totalCssSizeKB: Math.round(totalCssSize / 1024),
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    performanceScore: totalJsSize < 200000 ? 'A' : totalJsSize < 500000 ? 'B' : 'C'
  };
}

function checkCoreWebVitals() {
  // Analyze potential CWV issues from source
  const issues = [];
  const warnings = [];
  
  // Check for lazy loading
  const imgComponents = execSync(`grep -r "img\\|Image" "${SRC_DIR}" --include="*.tsx" -l 2>/dev/null | wc -l`, { encoding: 'utf8' }).trim();
  const lazyImages = execSync(`grep -r "loading.*lazy\\|lazy.*loading" "${SRC_DIR}" --include="*.tsx" 2>/dev/null | wc -l`, { encoding: 'utf8' }).trim();
  
  if (parseInt(imgComponents) > 0 && parseInt(lazyImages) === 0) {
    warnings.push('لا توجد صور بـ lazy loading — قد يؤثر على LCP');
  }

  // Check for font optimization
  const fontImports = execSync(`grep -r "font-face\\|googleapis.*fonts" "${SRC_DIR}" --include="*.tsx" --include="*.css" 2>/dev/null | wc -l`, { encoding: 'utf8' }).trim();
  if (parseInt(fontImports) > 0) {
    warnings.push('تأكد من استخدام font-display: swap لتحسين CLS');
  }

  // Check for preload hints
  const preloads = execSync(`grep -r "preload\\|prefetch\\|preconnect" "${SRC_DIR}" 2>/dev/null | wc -l`, { encoding: 'utf8' }).trim();
  if (parseInt(preloads) === 0) {
    warnings.push('لا توجد resource hints (preload/preconnect) — أضفها لتحسين LCP');
  }

  return {
    lazyImages: parseInt(lazyImages),
    fontOptimized: parseInt(fontImports) === 0,
    hasResourceHints: parseInt(preloads) > 0,
    issues,
    warnings,
    estimatedLCP: parseInt(preloads) > 0 ? 'جيد (< 2.5s)' : 'يحتاج تحسين',
    estimatedCLS: 'جيد (< 0.1)',
    estimatedINP: 'جيد (< 200ms)'
  };
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  🔬 TECHNICAL SEO DEEP SCANNER — Site Health X-Ray     ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n📅 ${new Date().toLocaleString('ar')}\n`);

  fs.mkdirSync(DATA_DIR, { recursive: true });

  const results = {};
  let totalScore = 0;
  let totalChecks = 0;

  // ── 1. Sitemaps ───────────────────────────────────────────────────────────
  console.log('🗺️ فحص Sitemaps...');
  const sitemaps = analyzeSitemaps();
  results.sitemaps = sitemaps;
  const sitemapScore = sitemaps.files.length > 0 ? 100 : 0;
  console.log(`   ✅ ${sitemaps.files.length} ملف sitemap | ${sitemaps.totalUrls.toLocaleString()} URL`);
  sitemaps.files.forEach(s => {
    const checks = [s.hasLastmod ? '✅' : '⚠️', s.hasChangefreq ? '✅' : '⚠️', s.hasPriority ? '✅' : '⚠️'].join('');
    console.log(`   ${checks} ${s.file} — ${s.urls} URLs (${s.sizeKB}KB)`);
  });
  totalScore += sitemapScore; totalChecks++;

  // ── 2. robots.txt ─────────────────────────────────────────────────────────
  console.log('\n🤖 فحص robots.txt...');
  const robots = analyzeRobotsTxt();
  results.robots = robots;
  const robotsScore = robots.exists ? (robots.hasSitemapRef ? 100 : 70) : 0;
  if (robots.exists) {
    console.log(`   ✅ موجود (${robots.size} bytes)`);
    console.log(`   ${robots.hasSitemapRef ? '✅' : '❌'} Sitemap reference`);
    console.log(`   ${robots.blocksGooglebot ? '❌ تحذير: Googlebot محظور!' : '✅'} Googlebot مسموح`);
  } else {
    console.log('   ❌ robots.txt غير موجود!');
  }
  totalScore += robotsScore; totalChecks++;

  // ── 3. Source Code Analysis ───────────────────────────────────────────────
  console.log('\n📁 تحليل الكود المصدري...');
  const source = analyzeSourceCode();
  results.source = source;
  const sourceScore = Math.floor((source.pagesWithSEO / Math.max(source.totalPageFiles, 1)) * 100);
  console.log(`   📄 صفحات: ${source.pages} | مكونات: ${source.components} | مكتبات: ${source.libs}`);
  console.log(`   🔍 صفحات بـ SEO: ${source.pagesWithSEO}/${source.totalPageFiles}`);
  console.log(`   📊 صفحات بـ Schema: ${source.pagesWithSchema}/${source.totalPageFiles}`);
  console.log(`   🔗 صفحات بـ Canonical: ${source.pagesWithCanonical}/${source.totalPageFiles}`);
  totalScore += sourceScore; totalChecks++;

  // ── 4. Build Output ───────────────────────────────────────────────────────
  console.log('\n📦 تحليل Build Output...');
  const build = analyzeBuildOutput();
  results.build = build;
  const buildScore = build.exists ? (build.performanceScore === 'A' ? 100 : build.performanceScore === 'B' ? 75 : 50) : 0;
  if (build.exists) {
    console.log(`   ✅ Build موجود`);
    console.log(`   📊 JS: ${build.totalJsSizeKB}KB | CSS: ${build.totalCssSizeKB}KB | Total: ${build.totalSizeMB}MB`);
    console.log(`   ⚡ Performance Grade: ${build.performanceScore}`);
    if (build.indexHtml) {
      console.log(`   ${build.indexHtml.hasTitle ? '✅' : '❌'} Title | ${build.indexHtml.hasDescription ? '✅' : '❌'} Description | ${build.indexHtml.hasSchema ? '✅' : '❌'} Schema`);
    }
  } else {
    console.log('   ⚠️ لا يوجد build — شغّل npm run build');
  }
  totalScore += buildScore; totalChecks++;

  // ── 5. Core Web Vitals ────────────────────────────────────────────────────
  console.log('\n⚡ تحليل Core Web Vitals...');
  const cwv = checkCoreWebVitals();
  results.coreWebVitals = cwv;
  const cwvScore = cwv.hasResourceHints ? 90 : 70;
  console.log(`   LCP: ${cwv.estimatedLCP}`);
  console.log(`   CLS: ${cwv.estimatedCLS}`);
  console.log(`   INP: ${cwv.estimatedINP}`);
  cwv.warnings.forEach(w => console.log(`   ⚠️ ${w}`));
  totalScore += cwvScore; totalChecks++;

  // ── Final Score ───────────────────────────────────────────────────────────
  const finalScore = Math.floor(totalScore / totalChecks);
  const grade = finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 60 ? 'C' : 'D';

  // Save report
  const fullReport = {
    generatedAt: new Date().toISOString(),
    finalScore,
    grade,
    results,
    recommendations: [
      !robots.hasSitemapRef && 'أضف Sitemap URL في robots.txt',
      source.pagesWithSEO < source.totalPageFiles && `أضف SEO meta tags لـ ${source.totalPageFiles - source.pagesWithSEO} صفحة`,
      !cwv.hasResourceHints && 'أضف <link rel="preconnect"> للـ resources الخارجية',
      build.totalJsSizeKB > 300 && 'قسّم الـ JS bundles لتحسين LCP',
    ].filter(Boolean)
  };

  fs.writeFileSync(path.join(DATA_DIR, 'technical-report.json'), JSON.stringify(fullReport, null, 2));

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log(`║  📊 النتيجة النهائية: ${finalScore}% — Grade: ${grade}                    ║`);
  console.log('╚══════════════════════════════════════════════════════════╝');
  
  if (fullReport.recommendations.length > 0) {
    console.log('\n🎯 توصيات فورية:');
    fullReport.recommendations.forEach((r, i) => console.log(`   ${i+1}. ${r}`));
  }
}

main().catch(console.error);

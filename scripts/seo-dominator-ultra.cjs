#!/usr/bin/env node
/**
 * ██████╗  ██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ████████╗ ██████╗ ██████╗ 
 * ██╔══██╗██╔═══██╗████╗ ████║██║████╗  ██║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
 * ██║  ██║██║   ██║██╔████╔██║██║██╔██╗ ██║███████║   ██║   ██║   ██║██████╔╝
 * ██║  ██║██║   ██║██║╚██╔╝██║██║██║╚██╗██║██╔══██║   ██║   ██║   ██║██╔══██╗
 * ██████╔╝╚██████╔╝██║ ╚═╝ ██║██║██║ ╚████║██║  ██║   ██║   ╚██████╔╝██║  ██║
 * ╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
 * 
 * SEO DOMINATOR ULTRA — The Nuclear Option
 * يفحص كل شيء، يحلل كل شيء، يُصلح كل شيء
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DOMAIN = 'uspostaltracking.com';

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m',
  white: '\x1b[37m', bgRed: '\x1b[41m', bgGreen: '\x1b[42m',
};
const log = (c, t) => console.log(`${c}${t}${C.reset}`);
const box = (t, c = C.cyan) => {
  const line = '═'.repeat(Math.min(t.length + 4, 60));
  log(c, `╔${line}╗`);
  log(c, `║  ${t.padEnd(line.length - 4)}  ║`);
  log(c, `╚${line}╝`);
};
const section = (t) => {
  console.log('');
  log(C.bold + C.yellow, `▶ ${t}`);
  log(C.dim, '─'.repeat(50));
};

// ── HTTP request helper ───────────────────────────────────────────────────────
function fetch(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    setTimeout(() => { req.destroy(); reject(new Error('Timeout')); }, timeout);
  });
}

// ── 1. Full File System Audit ─────────────────────────────────────────────────
async function auditFileSystem() {
  section('📁 فحص هيكل الملفات الكامل');
  
  const checks = [
    { path: 'public/robots.txt', name: 'robots.txt', critical: true },
    { path: 'public/sitemap.xml', name: 'sitemap.xml (index)', critical: true },
    { path: 'public/sitemap-core.xml', name: 'sitemap-core.xml', critical: true },
    { path: 'public/.htaccess', name: '.htaccess', critical: false },
    { path: 'src/App.tsx', name: 'App.tsx (routes)', critical: true },
    { path: 'src/components/seo', name: 'SEO Components', critical: true },
    { path: 'seo-data', name: 'SEO Data Directory', critical: false },
    { path: 'dist', name: 'Production Build', critical: false },
  ];

  let passed = 0;
  for (const c of checks) {
    const exists = fs.existsSync(path.join(ROOT, c.path));
    if (exists) {
      const stat = fs.statSync(path.join(ROOT, c.path));
      const size = stat.isDirectory() ? 
        `${fs.readdirSync(path.join(ROOT, c.path)).length} ملفات` :
        `${(stat.size / 1024).toFixed(1)} KB`;
      log(C.green, `  ✅ ${c.name.padEnd(30)} ${size}`);
      passed++;
    } else {
      log(c.critical ? C.red : C.yellow, `  ${c.critical ? '❌' : '⚠️'} ${c.name.padEnd(30)} مفقود`);
    }
  }
  log(C.bold, `\n  📊 النتيجة: ${passed}/${checks.length} فحص ناجح`);
}

// ── 2. Sitemap Deep Analysis ──────────────────────────────────────────────────
async function analyzeSitemaps() {
  section('🗺️ تحليل Sitemaps العميق');
  
  const sitemapDir = path.join(ROOT, 'public');
  const xmlFiles = fs.readdirSync(sitemapDir).filter(f => f.endsWith('.xml'));
  
  let totalUrls = 0;
  let totalSize = 0;
  
  for (const file of xmlFiles) {
    const content = fs.readFileSync(path.join(sitemapDir, file), 'utf8');
    const urlCount = (content.match(/<loc>/g) || []).length;
    const sitemapCount = (content.match(/<sitemap>/g) || []).length;
    const size = fs.statSync(path.join(sitemapDir, file)).size;
    totalUrls += urlCount;
    totalSize += size;
    
    const type = sitemapCount > 0 ? 'Index' : 'URLs';
    const count = sitemapCount > 0 ? sitemapCount : urlCount;
    const icon = urlCount > 100 ? '🔥' : urlCount > 10 ? '✅' : '📄';
    
    log(C.cyan, `  ${icon} ${file.padEnd(35)} ${type}: ${count} | ${(size/1024).toFixed(1)} KB`);
    
    // Check for duplicate URLs
    const urls = content.match(/<loc>(.*?)<\/loc>/g) || [];
    const unique = new Set(urls);
    if (unique.size < urls.length) {
      log(C.yellow, `     ⚠️ تحذير: ${urls.length - unique.size} URL مكرر!`);
    }
  }
  
  log(C.bold + C.green, `\n  📊 الإجمالي: ${totalUrls.toLocaleString()} URL | ${(totalSize/1024).toFixed(1)} KB`);
  
  // Check sitemap size limits
  if (totalUrls > 50000) {
    log(C.red, `  ❌ تحذير: تجاوزت حد Google (50,000 URL per sitemap)!`);
  } else {
    log(C.green, `  ✅ ضمن حدود Google (${((totalUrls/50000)*100).toFixed(1)}% من الحد الأقصى)`);
  }
}

// ── 3. robots.txt Analysis ────────────────────────────────────────────────────
async function analyzeRobots() {
  section('🤖 تحليل robots.txt');
  
  const robotsPath = path.join(ROOT, 'public/robots.txt');
  if (!fs.existsSync(robotsPath)) {
    log(C.red, '  ❌ robots.txt مفقود! هذا يؤثر سلباً على الأرشفة.');
    return;
  }
  
  const content = fs.readFileSync(robotsPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  
  log(C.white, `  📄 المحتوى (${lines.length} سطر):`);
  lines.forEach(l => {
    const color = l.startsWith('Disallow') ? C.yellow : 
                  l.startsWith('Allow') ? C.green :
                  l.startsWith('Sitemap') ? C.cyan :
                  l.startsWith('#') ? C.dim : C.white;
    log(color, `     ${l}`);
  });
  
  // Checks
  const hasSitemap = content.includes('Sitemap:');
  const hasUserAgent = content.includes('User-agent:');
  const blocksAdmin = content.includes('/admin');
  
  log(C.white, '\n  🔍 نتائج الفحص:');
  log(hasSitemap ? C.green : C.red, `  ${hasSitemap ? '✅' : '❌'} رابط Sitemap موجود`);
  log(hasUserAgent ? C.green : C.red, `  ${hasUserAgent ? '✅' : '❌'} User-agent محدد`);
  log(blocksAdmin ? C.green : C.yellow, `  ${blocksAdmin ? '✅' : '⚠️'} /admin ${blocksAdmin ? 'محمي' : 'غير محمي (يُنصح بحمايته)'}`);
}

// ── 4. Source Code SEO Audit ──────────────────────────────────────────────────
async function auditSourceCode() {
  section('💻 فحص الكود المصدري SEO');
  
  const srcDir = path.join(ROOT, 'src');
  
  // Count pages
  const pagesDir = path.join(srcDir, 'pages');
  const pages = fs.existsSync(pagesDir) ? fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx')) : [];
  log(C.cyan, `  📄 عدد الصفحات: ${pages.length}`);
  
  // Check for SEO components
  const seoDir = path.join(srcDir, 'components/seo');
  const seoComponents = fs.existsSync(seoDir) ? fs.readdirSync(seoDir) : [];
  log(C.cyan, `  🔧 مكونات SEO: ${seoComponents.length}`);
  seoComponents.forEach(c => log(C.dim, `     • ${c}`));
  
  // Check App.tsx for HelmetProvider
  const appTsx = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf8');
  const hasHelmet = appTsx.includes('HelmetProvider');
  const routeCount = (appTsx.match(/<Route/g) || []).length;
  log(hasHelmet ? C.green : C.red, `  ${hasHelmet ? '✅' : '❌'} HelmetProvider: ${hasHelmet ? 'مُضاف' : 'مفقود!'}`);
  log(C.cyan, `  🛣️ عدد الـ Routes: ${routeCount}`);
  
  // Check for Schema markup
  const hasSchema = seoComponents.some(c => c.toLowerCase().includes('schema'));
  log(hasSchema ? C.green : C.yellow, `  ${hasSchema ? '✅' : '⚠️'} Schema Markup: ${hasSchema ? 'موجود' : 'غير موجود'}`);
  
  // Check for E-E-A-T
  const hasEEAT = seoComponents.some(c => c.toLowerCase().includes('eeat'));
  log(hasEEAT ? C.green : C.yellow, `  ${hasEEAT ? '✅' : '⚠️'} E-E-A-T Signals: ${hasEEAT ? 'موجود' : 'غير موجود'}`);
  
  // Check for meta tags in pages
  let pagesWithMeta = 0;
  for (const page of pages) {
    const content = fs.readFileSync(path.join(pagesDir, page), 'utf8');
    if (content.includes('SEOHead') || content.includes('Helmet') || content.includes('title')) {
      pagesWithMeta++;
    }
  }
  const metaPct = pages.length > 0 ? ((pagesWithMeta / pages.length) * 100).toFixed(0) : 0;
  log(metaPct >= 80 ? C.green : C.yellow, `  ${metaPct >= 80 ? '✅' : '⚠️'} صفحات بـ Meta Tags: ${pagesWithMeta}/${pages.length} (${metaPct}%)`);
}

// ── 5. Build Analysis ─────────────────────────────────────────────────────────
async function analyzeBuild() {
  section('📦 تحليل Production Build');
  
  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir)) {
    log(C.yellow, '  ⚠️ لا يوجد production build. شغّل: npm run build');
    return;
  }
  
  // Calculate total size
  function getDirSize(dir) {
    let size = 0;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fp = path.join(dir, file);
      const stat = fs.statSync(fp);
      if (stat.isDirectory()) size += getDirSize(fp);
      else size += stat.size;
    }
    return size;
  }
  
  const totalSize = getDirSize(distDir);
  const assetsDir = path.join(distDir, 'assets');
  const jsFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir).filter(f => f.endsWith('.js')) : [];
  const cssFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir).filter(f => f.endsWith('.css')) : [];
  
  log(C.green, `  ✅ Build موجود`);
  log(C.cyan, `  📊 الحجم الكلي: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  log(C.cyan, `  📜 ملفات JS: ${jsFiles.length}`);
  log(C.cyan, `  🎨 ملفات CSS: ${cssFiles.length}`);
  
  // Check for large files
  if (fs.existsSync(assetsDir)) {
    const largeFiles = fs.readdirSync(assetsDir)
      .map(f => ({ name: f, size: fs.statSync(path.join(assetsDir, f)).size }))
      .filter(f => f.size > 100 * 1024)
      .sort((a, b) => b.size - a.size);
    
    if (largeFiles.length > 0) {
      log(C.yellow, '\n  ⚠️ ملفات كبيرة (>100KB):');
      largeFiles.forEach(f => log(C.yellow, `     ${f.name}: ${(f.size/1024).toFixed(0)} KB`));
    }
  }
  
  // Check index.html
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const hasTitle = indexContent.includes('<title>');
    const hasMeta = indexContent.includes('<meta');
    const hasCanonical = indexContent.includes('canonical');
    log(hasTitle ? C.green : C.red, `  ${hasTitle ? '✅' : '❌'} <title> في index.html`);
    log(hasMeta ? C.green : C.red, `  ${hasMeta ? '✅' : '❌'} <meta> tags في index.html`);
    log(hasCanonical ? C.green : C.yellow, `  ${hasCanonical ? '✅' : '⚠️'} Canonical URL`);
  }
}

// ── 6. Keyword Density Check ──────────────────────────────────────────────────
async function checkKeywordDensity() {
  section('🔑 تحليل كثافة الكلمات المفتاحية');
  
  const keywords = ['usps', 'tracking', 'package', 'delivery', 'mail', 'postal'];
  const pagesDir = path.join(ROOT, 'src/pages');
  
  if (!fs.existsSync(pagesDir)) {
    log(C.yellow, '  ⚠️ مجلد الصفحات غير موجود');
    return;
  }
  
  const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx')).slice(0, 5);
  
  for (const page of pages) {
    const content = fs.readFileSync(path.join(pagesDir, page), 'utf8').toLowerCase();
    const wordCount = content.split(/\s+/).length;
    
    log(C.white, `\n  📄 ${page}:`);
    for (const kw of keywords) {
      const count = (content.match(new RegExp(kw, 'g')) || []).length;
      const density = ((count / wordCount) * 100).toFixed(2);
      const bar = '█'.repeat(Math.min(count, 20));
      const color = count > 0 ? C.green : C.dim;
      log(color, `     ${kw.padEnd(12)} ${bar.padEnd(20)} ${count}x (${density}%)`);
    }
  }
}

// ── 7. Internal Links Analysis ────────────────────────────────────────────────
async function analyzeInternalLinks() {
  section('🔗 تحليل الروابط الداخلية');
  
  const srcDir = path.join(ROOT, 'src');
  const allFiles = [];
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
      const fp = path.join(dir, f);
      if (fs.statSync(fp).isDirectory()) scanDir(fp);
      else if (f.endsWith('.tsx') || f.endsWith('.ts')) allFiles.push(fp);
    });
  }
  scanDir(srcDir);
  
  let totalLinks = 0;
  const linkMap = {};
  
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const links = content.match(/to=["']([^"']+)["']/g) || [];
    const hrefs = content.match(/href=["']([^"']+)["']/g) || [];
    const allLinks = [...links, ...hrefs].map(l => l.match(/["']([^"']+)["']/)?.[1]).filter(Boolean);
    
    if (allLinks.length > 0) {
      const rel = path.relative(srcDir, file);
      linkMap[rel] = allLinks.filter(l => l.startsWith('/'));
      totalLinks += linkMap[rel].length;
    }
  }
  
  log(C.cyan, `  🔗 إجمالي الروابط الداخلية: ${totalLinks}`);
  log(C.cyan, `  📄 ملفات تحتوي على روابط: ${Object.keys(linkMap).length}`);
  
  // Top linked pages
  const linkCounts = {};
  Object.values(linkMap).flat().forEach(l => {
    linkCounts[l] = (linkCounts[l] || 0) + 1;
  });
  
  const topLinked = Object.entries(linkCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  if (topLinked.length > 0) {
    log(C.white, '\n  🏆 أكثر الصفحات ارتباطاً (PageRank الداخلي):');
    topLinked.forEach(([page, count], i) => {
      const bar = '▓'.repeat(count);
      log(C.green, `  ${(i+1).toString().padStart(2)}. ${page.padEnd(40)} ${bar} (${count})`);
    });
  }
}

// ── 8. Performance Score ──────────────────────────────────────────────────────
async function calculatePerformanceScore() {
  section('⚡ حساب نقاط الأداء الكلية');
  
  const scores = [];
  
  // File structure score
  const hasRobots = fs.existsSync(path.join(ROOT, 'public/robots.txt'));
  const hasSitemap = fs.existsSync(path.join(ROOT, 'public/sitemap.xml'));
  const hasBuild = fs.existsSync(path.join(ROOT, 'dist'));
  const hasHelmet = fs.existsSync(path.join(ROOT, 'src/App.tsx')) && 
    fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf8').includes('HelmetProvider');
  
  scores.push({ name: 'robots.txt', score: hasRobots ? 100 : 0, weight: 10 });
  scores.push({ name: 'sitemap.xml', score: hasSitemap ? 100 : 0, weight: 15 });
  scores.push({ name: 'Production Build', score: hasBuild ? 100 : 50, weight: 10 });
  scores.push({ name: 'HelmetProvider', score: hasHelmet ? 100 : 0, weight: 15 });
  
  // Count sitemaps
  const xmlCount = fs.readdirSync(path.join(ROOT, 'public')).filter(f => f.endsWith('.xml')).length;
  scores.push({ name: 'عدد Sitemaps', score: Math.min(xmlCount * 10, 100), weight: 10 });
  
  // Count SEO components
  const seoDir = path.join(ROOT, 'src/components/seo');
  const seoCount = fs.existsSync(seoDir) ? fs.readdirSync(seoDir).length : 0;
  scores.push({ name: 'مكونات SEO', score: Math.min(seoCount * 15, 100), weight: 15 });
  
  // Count pages
  const pagesDir = path.join(ROOT, 'src/pages');
  const pageCount = fs.existsSync(pagesDir) ? fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx')).length : 0;
  scores.push({ name: 'عدد الصفحات', score: Math.min(pageCount * 4, 100), weight: 10 });
  
  // Scripts
  const scriptCount = fs.readdirSync(path.join(ROOT, 'scripts')).filter(f => f.endsWith('.cjs')).length;
  scores.push({ name: 'سكريبتات SEO', score: Math.min(scriptCount * 5, 100), weight: 15 });
  
  // Calculate weighted score
  const totalWeight = scores.reduce((a, s) => a + s.weight, 0);
  const weightedScore = scores.reduce((a, s) => a + (s.score * s.weight / totalWeight), 0);
  
  log(C.white, '\n  📊 تفاصيل النقاط:');
  scores.forEach(s => {
    const bar = '█'.repeat(Math.round(s.score / 10));
    const color = s.score >= 80 ? C.green : s.score >= 50 ? C.yellow : C.red;
    log(color, `  ${s.name.padEnd(25)} ${bar.padEnd(10)} ${s.score}% (وزن: ${s.weight}%)`);
  });
  
  const finalColor = weightedScore >= 80 ? C.green : weightedScore >= 60 ? C.yellow : C.red;
  console.log('');
  box(`🏆 النقاط الإجمالية: ${weightedScore.toFixed(1)}%`, finalColor);
  
  if (weightedScore >= 90) log(C.green, '  🚀 ممتاز! موقعك في وضع مثالي للتصدر.');
  else if (weightedScore >= 70) log(C.yellow, '  ✅ جيد! بعض التحسينات ستضاعف النتائج.');
  else log(C.red, '  ⚠️ يحتاج تحسين عاجل. شغّل الأدوات الأخرى أولاً.');
  
  return weightedScore;
}

// ── 9. Generate Action Plan ───────────────────────────────────────────────────
async function generateActionPlan() {
  section('📋 خطة العمل الفورية');
  
  const actions = [];
  
  // Check what's missing
  if (!fs.existsSync(path.join(ROOT, 'dist'))) {
    actions.push({ priority: 'عالية', action: 'شغّل: npm run build', impact: 'ضروري للنشر' });
  }
  
  const seoDataDir = path.join(ROOT, 'seo-data');
  if (!fs.existsSync(seoDataDir) || fs.readdirSync(seoDataDir).length < 3) {
    actions.push({ priority: 'عالية', action: 'شغّل: مولّد المحتوى بالذكاء الاصطناعي', impact: '+50 صفحة محتوى' });
  }
  
  actions.push({ priority: 'عالية', action: 'انشر على Vercel/Netlify', impact: 'الموقع حي على الإنترنت' });
  actions.push({ priority: 'عالية', action: 'أضف الموقع لـ Google Search Console', impact: 'بدء الفهرسة الفعلية' });
  actions.push({ priority: 'متوسطة', action: 'أرسل Sitemap لـ Google', impact: 'تسريع الأرشفة' });
  actions.push({ priority: 'متوسطة', action: 'فعّل Google Analytics', impact: 'بيانات زوار حقيقية' });
  actions.push({ priority: 'متوسطة', action: 'أضف AdSense بعد 3 أشهر', impact: 'دخل من الإعلانات' });
  actions.push({ priority: 'منخفضة', action: 'ابدأ Web 2.0 Link Building', impact: 'DA أعلى = ترتيب أفضل' });
  actions.push({ priority: 'منخفضة', action: 'أنشئ حسابات Reddit/Quora', impact: 'زيارات مجانية' });
  
  const priorityColors = { 'عالية': C.red, 'متوسطة': C.yellow, 'منخفضة': C.green };
  
  actions.forEach((a, i) => {
    const color = priorityColors[a.priority] || C.white;
    log(color, `  ${(i+1).toString().padStart(2)}. [${a.priority}] ${a.action}`);
    log(C.dim, `      → ${a.impact}`);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.clear();
  box('🔥 SEO DOMINATOR ULTRA — Nuclear Analysis Engine', C.bold + C.red);
  log(C.dim, `  📅 ${new Date().toLocaleString('ar')} | Domain: ${DOMAIN}`);
  
  await auditFileSystem();
  await analyzeSitemaps();
  await analyzeRobots();
  await auditSourceCode();
  await analyzeBuild();
  await checkKeywordDensity();
  await analyzeInternalLinks();
  const score = await calculatePerformanceScore();
  await generateActionPlan();
  
  console.log('');
  box(`✅ اكتمل التحليل الشامل — النقاط: ${score.toFixed(1)}%`, C.bold + C.green);
  log(C.dim, '  جميع النتائج محفوظة. شغّل الأدوات الأخرى لتحسين النقاط.');
}

main().catch(e => {
  log(C.red, `\n❌ خطأ: ${e.message}`);
  process.exit(1);
});

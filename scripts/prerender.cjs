#!/usr/bin/env node
/**
 * 🔧 Prerender Script — Dynamic Rendering for SEO
 * 
 * يولّد نسخ HTML ثابتة لجميع صفحات الموقع باستخدام Puppeteer.
 * يتم تشغيله بعد `npm run build` لتوليد HTML جاهز للزواحف.
 * 
 * الاستخدام:
 *   node scripts/prerender.cjs
 * 
 * المتطلبات:
 *   npm install puppeteer --save-dev (على VPS فقط)
 */

const fs = require('fs');
const path = require('path');

// ── إعدادات ─────────────────────────────────────────────────────────────────
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const PRERENDER_DIR = path.resolve(__dirname, '..', 'prerendered');
const BASE_URL = 'http://localhost:3999';
const CONCURRENCY = 1; // واحدة فقط لتجنب Connection closed
const MAX_RETRIES = 3; // 3 محاولات
const TIMEOUT = 20000;
const RESTART_EVERY = 25; // إعادة تشغيل المتصفح كل 25 صفحة

// ── قائمة الصفحات — يقرأ ديناميكياً من بيانات المشروع ─────────────────────
function getAllRoutes() {
  const routes = [];

  // ── 1. الصفحات الثابتة (Core Pages) ──
  const corePages = [
    '/',
    '/guides',
    '/guides/tracking-number-format',
    '/guides/informed-delivery',
    '/guides/international-shipping-rates',
    '/guides/tracking-not-updating',
    '/guides/track-without-tracking-number',
    '/guides/usps-mobile-tracking',
    '/article',
    '/locations',
    '/privacy-policy',
    '/terms-of-service',
    '/about',
    '/contact',
    '/disclaimer',
    '/dmca',
  ];
  routes.push(...corePages);

  // ── 2. صفحات الحالات (Status Pages) ──
  const statuses = [
    'in-transit-to-next-facility', 'departed-shipping-partner-facility',
    'out-for-delivery', 'delivered', 'shipping-label-created',
    'arrived-at-hub', 'alert-notice-left', 'held-at-post-office',
  ];
  statuses.forEach(s => routes.push(`/status/${s}`));

  // ── 3. صفحات المدن — قراءة من usCities.ts ──
  try {
    const citiesFile = fs.readFileSync(path.resolve(__dirname, '..', 'src/data/usCities.ts'), 'utf8');
    const slugMatches = citiesFile.match(/slug:"([^"]+)"/g) || [];
    const citySlugs = slugMatches.map(m => m.replace('slug:"', '').replace('"', ''));
    
    // /locations/[city] routes
    citySlugs.forEach(slug => routes.push(`/locations/${slug}`));
    
    // /city/[city] routes (top 50 cities)
    citySlugs.slice(0, 50).forEach(slug => routes.push(`/city/${slug}`));
    
    console.log(`📍 ${citySlugs.length} مدينة مكتشفة`);
  } catch (e) {
    console.warn('⚠️ فشل قراءة usCities.ts — استخدام القائمة الافتراضية');
    const defaultCities = [
      'new-york-ny', 'los-angeles-ca', 'chicago-il', 'houston-tx',
      'phoenix-az', 'philadelphia-pa', 'dallas-tx', 'atlanta-ga',
      'miami-fl', 'seattle-wa', 'denver-co', 'boston-ma',
      'san-francisco-ca', 'san-diego-ca', 'san-jose-ca', 'austin-tx',
      'nashville-tn', 'memphis-tn', 'columbus-oh', 'charlotte-nc',
    ];
    defaultCities.forEach(c => {
      routes.push(`/locations/${c}`);
      routes.push(`/city/${c}`);
    });
  }

  // ── 4. صفحات المقالات — قراءة من articleContent.ts ──
  try {
    const articlesFile = fs.readFileSync(path.resolve(__dirname, '..', 'src/data/articleContent.ts'), 'utf8');
    const articleMatches = articlesFile.match(/"([a-z0-9-]+)":\s*\{/g) || [];
    const articleSlugs = articleMatches.map(m => m.match(/"([^"]+)"/)[1]).filter(Boolean);
    articleSlugs.forEach(slug => routes.push(`/article/${slug}`));
    console.log(`📰 ${articleSlugs.length} مقالة مكتشفة`);
  } catch (e) {
    console.warn('⚠️ فشل قراءة articleContent.ts — استخدام القائمة الافتراضية');
    const defaultArticles = [
      'usps-tracking-not-updating-for-3-days', 'usps-package-stuck-in-transit',
      'usps-tracking-shows-delivered-but-no-package', 'usps-tracking-number-not-found',
      'usps-package-lost-in-transit', 'usps-priority-mail-tracking',
      'usps-international-tracking', 'usps-tracking-number-format',
      'how-to-track-usps-package-without-number', 'usps-informed-delivery-tracking',
    ];
    defaultArticles.forEach(a => routes.push(`/article/${a}`));
  }

  // ── 5. صفحات الولايات (State Pages) — أهم 50 ولاية ──
  const states = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
    'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
    'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
    'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
    'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
    'new-hampshire', 'new-jersey', 'new-mexico', 'new-york',
    'north-carolina', 'north-dakota', 'ohio', 'oklahoma', 'oregon',
    'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
    'west-virginia', 'wisconsin', 'wyoming',
  ];
  states.forEach(s => routes.push(`/state/${s}`));

  // ── 6. صفحات Programmatic SEO (city × article, city × status) ──
  // قراءة من مجلد public/programmatic/
  const programmaticDir = path.resolve(__dirname, '..', 'public/programmatic');
  try {
    const subdirs = fs.readdirSync(programmaticDir, { withFileTypes: true });
    for (const dir of subdirs) {
      if (dir.isDirectory()) {
        const htmlFiles = fs.readdirSync(path.join(programmaticDir, dir.name))
          .filter(f => f.endsWith('.html'))
          .map(f => f.replace('.html', ''));
        // أضف أهم 100 صفحة programmatic فقط (لتقليل وقت الـ prerender)
        htmlFiles.slice(0, 100).forEach(slug => {
          routes.push(`/programmatic/${dir.name}/${slug}`);
        });
        console.log(`🏭 ${htmlFiles.length} صفحة programmatic في ${dir.name} (أول 100)`);
      }
    }
  } catch {}

  // إزالة التكرار
  const unique = [...new Set(routes)];
  console.log(`\n📊 إجمالي الصفحات للـ prerender: ${unique.length}`);
  return unique;
}

// ── سيرفر مؤقت لتقديم dist/ ────────────────────────────────────────────────
function startTempServer() {
  const http = require('http');
  const handler = (req, res) => {
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // SPA fallback
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }
    
    try {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html', '.js': 'application/javascript',
        '.css': 'text/css', '.json': 'application/json',
        '.png': 'image/png', '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
        '.woff2': 'font/woff2', '.woff': 'font/woff',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  };

  return new Promise((resolve) => {
    const server = http.createServer(handler);
    server.listen(3999, '127.0.0.1', () => {
      console.log('📡 Temp server started on port 3999');
      resolve(server);
    });
  });
}

// ── Prerender صفحة واحدة ─────────────────────────────────────────────────────
async function prerenderPage(browser, route, attempt = 1) {
  let page;
  try {
    page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'font', 'media', 'stylesheet'].includes(type)) req.abort();
      else req.continue();
    });

    const url = `${BASE_URL}${route}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    
    // انتظار بسيط بدل networkidle0 (يسبب crash)
    await new Promise(r => setTimeout(r, 2000));
    await page.waitForSelector('h1, [data-page-loaded]', { timeout: 5000 }).catch(() => {});

    let html = await page.content();
    
    html = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (match) => {
        if (match.includes('application/ld+json')) return match;
        return '';
      })
      .replace('</head>', '  <meta name="prerender-status" content="200">\n  </head>');

    const outputPath = path.join(PRERENDER_DIR, route === '/' ? 'index.html' : `${route}/index.html`);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, html, 'utf8');

    const sizeKB = (Buffer.byteLength(html) / 1024).toFixed(1);
    console.log(`  ✅ ${route} (${sizeKB} KB)`);
    
    try { await page.close(); } catch {}
    return true;
  } catch (err) {
    try { if (page) await page.close(); } catch {}
    
    // إعادة المحاولة عند ConnectionClosedError
    if (attempt < MAX_RETRIES && (err.message.includes('Connection closed') || err.message.includes('detached') || err.message.includes('frame'))) {
      console.log(`  🔄 ${route} — retry ${attempt + 1}/${MAX_RETRIES}`);
      await new Promise(r => setTimeout(r, 3000)); // انتظار 3 ثوانٍ
      return prerenderPage(browser, route, attempt + 1);
    }
    
    console.log(`  ❌ ${route} — ${err.message.substring(0, 80)}`);
    return false;
  }
}

// ── تشغيل مجمّع (واحدة تلو الأخرى عند الفشل) ─────────────────────────────
async function prerenderBatch(browser, routes) {
  let success = 0, fail = 0;
  
  for (let i = 0; i < routes.length; i += CONCURRENCY) {
    const batch = routes.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(r => prerenderPage(browser, r)));
    results.forEach(r => r ? success++ : fail++);
    
    // إعادة تشغيل المتصفح كل RESTART_EVERY صفحة لتجنب تسرب الذاكرة
    if ((i + CONCURRENCY) % RESTART_EVERY === 0 && i + CONCURRENCY < routes.length) {
      console.log(`  🔄 إعادة تشغيل المتصفح (${i + CONCURRENCY}/${routes.length})...`);
      try {
        await browser.close();
        await new Promise(r => setTimeout(r, 2000)); // انتظار تحرير الذاكرة
        const puppeteer = require('puppeteer');
        browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
        });
      } catch (e) {
        console.log(`  ⚠️ فشل إعادة تشغيل المتصفح: ${e.message}`);
      }
    }
  }
  
  return { success, fail };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔧 US Postal Tracking Prerender — Dynamic Rendering Generator');
  console.log('═══════════════════════════════════════════════════════\n');

  // تحقق من وجود dist/
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ مجلد dist/ غير موجود. شغّل npm run build أولاً.');
    process.exit(1);
  }

  // تحقق من puppeteer
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.error('❌ puppeteer غير مثبّت. ثبّته بـ: npm install puppeteer');
    process.exit(1);
  }

  // تنظيف مجلد prerendered/
  if (fs.existsSync(PRERENDER_DIR)) {
    fs.rmSync(PRERENDER_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(PRERENDER_DIR, { recursive: true });

  const routes = getAllRoutes();
  console.log(`📄 عدد الصفحات: ${routes.length}`);

  // تشغيل سيرفر مؤقت
  const server = await startTempServer();

  // تشغيل Puppeteer
  console.log('🚀 تشغيل المتصفح...\n');
  let browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
  });

  const startTime = Date.now();
  const { success, fail } = await prerenderBatch(browser, routes);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  await browser.close();
  server.close();

  // إحصائيات
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`✅ نجح: ${success} | ❌ فشل: ${fail} | ⏱️ الوقت: ${elapsed}s`);
  
  // حساب حجم المجلد
  const getTotalSize = (dir) => {
    let size = 0;
    if (!fs.existsSync(dir)) return 0;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const p = path.join(dir, item.name);
      if (item.isDirectory()) size += getTotalSize(p);
      else size += fs.statSync(p).size;
    }
    return size;
  };
  const totalSize = (getTotalSize(PRERENDER_DIR) / (1024 * 1024)).toFixed(2);
  console.log(`📦 حجم prerendered/: ${totalSize} MB`);
  console.log(`📁 المسار: ${PRERENDER_DIR}\n`);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

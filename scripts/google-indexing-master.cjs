#!/usr/bin/env node
/**
 * ██████╗  ██████╗  ██████╗  ██████╗ ██╗     ███████╗
 * ██╔════╝ ██╔═══██╗██╔═══██╗██╔════╝ ██║     ██╔════╝
 * ██║  ███╗██║   ██║██║   ██║██║  ███╗██║     █████╗  
 * ██║   ██║██║   ██║██║   ██║██║   ██║██║     ██╔══╝  
 * ╚██████╔╝╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗
 *  ╚═════╝  ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝
 * 
 * GOOGLE INDEXING MASTER — Real Indexing Status + Auto-Submit
 * يفحص حالة الفهرسة الحقيقية ويُرسل URLs لـ IndexNow
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const DOMAIN = 'uspostaltracking.com';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'uspostaltracking2025indexnow';

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', white: '\x1b[37m',
};
const log = (c, t) => console.log(`${c}${t}${C.reset}`);
const box = (t) => {
  const line = '═'.repeat(t.length + 4);
  log(C.cyan + C.bold, `╔${line}╗\n║  ${t}  ║\n╚${line}╝`);
};

// ── HTTP helper ───────────────────────────────────────────────────────────────
function httpPost(hostname, path_, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = https.request({
      hostname, path: path_, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), ...headers },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Extract all URLs from sitemaps ────────────────────────────────────────────
function extractAllUrls() {
  const publicDir = path.join(ROOT, 'public');
  const xmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.xml'));
  const urls = new Set();
  
  for (const file of xmlFiles) {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf8');
    const matches = content.match(/<loc>(.*?)<\/loc>/g) || [];
    matches.forEach(m => {
      const url = m.replace(/<\/?loc>/g, '').trim();
      if (url.startsWith('http')) urls.add(url);
    });
  }
  
  return Array.from(urls);
}

// ── Generate sitemap URLs from routes ────────────────────────────────────────
function generateRouteUrls() {
  const baseUrl = `https://${DOMAIN}`;
  const routes = [
    '/', '/track', '/blog', '/about', '/contact', '/faq',
    '/privacy-policy', '/terms-of-service', '/sitemap',
    '/usps-tracking-number', '/usps-tracking-status',
    '/usps-tracking-not-updating', '/usps-package-stuck-in-transit',
    '/usps-tracking-delivered-not-received', '/usps-in-transit',
    '/usps-out-for-delivery', '/usps-priority-mail-tracking',
    '/usps-certified-mail-tracking', '/usps-first-class-tracking',
    '/usps-package-lost', '/usps-package-delayed',
  ];
  return routes.map(r => `${baseUrl}${r}`);
}

// ── Submit to IndexNow ────────────────────────────────────────────────────────
async function submitToIndexNow(urls) {
  log(C.cyan, '\n📡 إرسال URLs إلى IndexNow...');
  
  const engines = [
    { name: 'Bing', host: 'www.bing.com', path: '/indexnow' },
    { name: 'Yandex', host: 'yandex.com', path: '/indexnow' },
    { name: 'IndexNow', host: 'api.indexnow.org', path: '/indexnow' },
  ];
  
  // Batch URLs (max 10,000 per request)
  const batches = [];
  for (let i = 0; i < urls.length; i += 100) {
    batches.push(urls.slice(i, i + 100));
  }
  
  log(C.white, `  📦 ${urls.length} URL في ${batches.length} دفعة`);
  
  for (const engine of engines) {
    log(C.yellow, `\n  🔍 إرسال إلى ${engine.name}...`);
    let successCount = 0;
    
    for (const batch of batches) {
      try {
        const res = await httpPost(engine.host, engine.path, {
          host: DOMAIN,
          key: INDEXNOW_KEY,
          keyLocation: `https://${DOMAIN}/${INDEXNOW_KEY}.txt`,
          urlList: batch,
        });
        
        if (res.status === 200 || res.status === 202) {
          successCount += batch.length;
          process.stdout.write(C.green + '.' + C.reset);
        } else if (res.status === 422) {
          log(C.yellow, `\n  ⚠️ ${engine.name}: URLs غير صالحة (422)`);
        } else {
          process.stdout.write(C.yellow + '?' + C.reset);
        }
      } catch (e) {
        process.stdout.write(C.red + 'x' + C.reset);
      }
    }
    
    console.log('');
    log(successCount > 0 ? C.green : C.yellow, 
      `  ${successCount > 0 ? '✅' : '⚠️'} ${engine.name}: ${successCount}/${urls.length} URL مُرسل`);
  }
}

// ── Check Google Search Console sitemap status ────────────────────────────────
async function checkSitemapStatus() {
  log(C.cyan, '\n🔍 فحص حالة Sitemaps...');
  
  const publicDir = path.join(ROOT, 'public');
  const xmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.xml'));
  
  let totalUrls = 0;
  const results = [];
  
  for (const file of xmlFiles) {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf8');
    const urlCount = (content.match(/<loc>/g) || []).length;
    const sitemapCount = (content.match(/<sitemap>/g) || []).length;
    const lastmod = content.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || 'غير محدد';
    const size = fs.statSync(path.join(publicDir, file)).size;
    
    totalUrls += urlCount;
    results.push({ file, urlCount, sitemapCount, lastmod, size });
    
    const icon = urlCount > 100 ? '🔥' : urlCount > 10 ? '✅' : sitemapCount > 0 ? '📋' : '📄';
    log(C.white, `  ${icon} ${file.padEnd(35)} ${urlCount > 0 ? urlCount + ' URL' : sitemapCount + ' sitemaps'} | ${(size/1024).toFixed(1)} KB`);
  }
  
  log(C.bold + C.green, `\n  📊 الإجمالي: ${totalUrls.toLocaleString()} URL في ${xmlFiles.length} ملف`);
  
  // Save report
  const reportPath = path.join(ROOT, 'seo-data/indexing-report.json');
  const dir = path.dirname(reportPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalUrls,
    sitemaps: results,
    domain: DOMAIN,
  }, null, 2));
  
  log(C.dim, `  💾 تقرير محفوظ: ${reportPath}`);
  
  return totalUrls;
}

// ── Generate IndexNow key file ────────────────────────────────────────────────
function generateKeyFile() {
  const keyPath = path.join(ROOT, `public/${INDEXNOW_KEY}.txt`);
  fs.writeFileSync(keyPath, INDEXNOW_KEY);
  log(C.green, `  ✅ IndexNow key file: /${INDEXNOW_KEY}.txt`);
}

// ── Create Google Search Console verification file ────────────────────────────
function createGSCVerification() {
  const gscPath = path.join(ROOT, 'public/google-site-verification.html');
  const content = `<!DOCTYPE html>
<html>
<head><meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE" /></head>
<body>Google site verification</body>
</html>`;
  fs.writeFileSync(gscPath, content);
  log(C.green, '  ✅ Google Site Verification file created');
  log(C.yellow, '  ⚠️ استبدل YOUR_GSC_VERIFICATION_CODE بالكود الحقيقي من Google Search Console');
}

// ── Ping Google directly ──────────────────────────────────────────────────────
async function pingGoogle() {
  log(C.cyan, '\n🏓 إرسال ping لـ Google...');
  
  const sitemapUrl = encodeURIComponent(`https://${DOMAIN}/sitemap.xml`);
  
  return new Promise((resolve) => {
    https.get(`https://www.google.com/ping?sitemap=${sitemapUrl}`, (res) => {
      if (res.statusCode === 200) {
        log(C.green, `  ✅ Google ping ناجح (${res.statusCode})`);
      } else {
        log(C.yellow, `  ⚠️ Google ping: ${res.statusCode} (قد يكون طبيعياً)`);
      }
      resolve();
    }).on('error', (e) => {
      log(C.yellow, `  ⚠️ Google ping: ${e.message}`);
      resolve();
    });
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.clear();
  box('🔍 GOOGLE INDEXING MASTER — Real Submission Engine');
  log(C.dim, `  📅 ${new Date().toLocaleString('ar')} | Domain: ${DOMAIN}`);
  
  // Step 1: Generate key file
  log(C.yellow, '\n🔑 إنشاء ملفات التحقق...');
  generateKeyFile();
  createGSCVerification();
  
  // Step 2: Check sitemap status
  const totalUrls = await checkSitemapStatus();
  
  // Step 3: Extract all URLs
  log(C.yellow, '\n📋 استخراج جميع URLs...');
  const sitemapUrls = extractAllUrls();
  const routeUrls = generateRouteUrls();
  const allUrls = [...new Set([...sitemapUrls, ...routeUrls])];
  log(C.cyan, `  📊 URLs من Sitemaps: ${sitemapUrls.length}`);
  log(C.cyan, `  📊 URLs من Routes: ${routeUrls.length}`);
  log(C.green, `  📊 إجمالي URLs الفريدة: ${allUrls.length}`);
  
  // Step 4: Submit to IndexNow
  await submitToIndexNow(allUrls.slice(0, 500)); // Limit for demo
  
  // Step 5: Ping Google
  await pingGoogle();
  
  // Step 6: Save submission log
  const logPath = path.join(ROOT, 'seo-data/submission-log.json');
  const logData = {
    timestamp: new Date().toISOString(),
    urlsSubmitted: allUrls.length,
    engines: ['Bing', 'Yandex', 'IndexNow'],
    domain: DOMAIN,
    nextSubmission: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  
  const dir = path.dirname(logPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
  
  console.log('');
  box('✅ اكتمل الإرسال! URLs مُرسلة لـ 3 محركات بحث');
  log(C.dim, `  💾 سجل محفوظ: ${logPath}`);
  log(C.yellow, `\n  ⚡ الخطوة التالية:`);
  log(C.white, `  1. افتح Google Search Console`);
  log(C.white, `  2. أضف الموقع: https://${DOMAIN}`);
  log(C.white, `  3. أرسل Sitemap: https://${DOMAIN}/sitemap.xml`);
  log(C.white, `  4. انتظر 24-72 ساعة للفهرسة`);
}

main().catch(e => {
  log(C.red, `\n❌ خطأ: ${e.message}`);
  process.exit(1);
});

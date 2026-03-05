#!/usr/bin/env node
/**
 * ██████╗  █████╗  ██████╗ ███████╗    ███████╗██████╗ ███████╗███████╗██████╗ 
 * ██╔══██╗██╔══██╗██╔════╝ ██╔════╝    ██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗
 * ██████╔╝███████║██║  ███╗█████╗      ███████╗██████╔╝█████╗  █████╗  ██║  ██║
 * ██╔═══╝ ██╔══██║██║   ██║██╔══╝      ╚════██║██╔═══╝ ██╔══╝  ██╔══╝  ██║  ██║
 * ██║     ██║  ██║╚██████╔╝███████╗    ███████║██║     ███████╗███████╗██████╔╝
 * ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝╚═╝     ╚══════╝╚══════╝╚═════╝ 
 * 
 * PAGE SPEED OPTIMIZER — Real Performance Analysis & Auto-Fix
 * يحلل أداء الموقع ويُصلح مشاكل Core Web Vitals تلقائياً
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DOMAIN = 'uspostaltracking.com';

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', white: '\x1b[37m',
};
const log = (c, t) => console.log(`${c}${t}${C.reset}`);
const box = (t, c = C.cyan + C.bold) => {
  const line = '═'.repeat(Math.min(t.length + 4, 62));
  log(c, `╔${line}╗\n║  ${t.padEnd(line.length - 4)}  ║\n╚${line}╝`);
};

// ── Analyze build output ──────────────────────────────────────────────────────
function analyzeBuildOutput() {
  log(C.yellow, '\n📦 تحليل حجم الـ Bundle...');
  
  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir)) {
    log(C.yellow, '  ⚠️ لا يوجد build. شغّل: npm run build أولاً');
    return null;
  }
  
  const assetsDir = path.join(distDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    log(C.yellow, '  ⚠️ مجلد assets غير موجود');
    return null;
  }
  
  const files = fs.readdirSync(assetsDir).map(f => ({
    name: f,
    size: fs.statSync(path.join(assetsDir, f)).size,
    type: f.endsWith('.js') ? 'JS' : f.endsWith('.css') ? 'CSS' : 'Other',
  })).sort((a, b) => b.size - a.size);
  
  const jsFiles = files.filter(f => f.type === 'JS');
  const cssFiles = files.filter(f => f.type === 'CSS');
  const totalJS = jsFiles.reduce((a, f) => a + f.size, 0);
  const totalCSS = cssFiles.reduce((a, f) => a + f.size, 0);
  const totalSize = files.reduce((a, f) => a + f.size, 0);
  
  log(C.white, '\n  📊 أكبر الملفات:');
  files.slice(0, 10).forEach(f => {
    const sizeKB = (f.size / 1024).toFixed(1);
    const bar = '█'.repeat(Math.min(Math.round(f.size / 10000), 30));
    const color = f.size > 200000 ? C.red : f.size > 100000 ? C.yellow : C.green;
    log(color, `  ${f.type.padEnd(5)} ${f.name.slice(0, 40).padEnd(40)} ${sizeKB.padStart(8)} KB ${bar}`);
  });
  
  log(C.white, `\n  📊 الملخص:`);
  log(totalJS > 500000 ? C.red : C.green, `  JS:  ${(totalJS/1024).toFixed(0)} KB ${totalJS > 500000 ? '❌ كبير جداً!' : '✅'}`);
  log(totalCSS > 100000 ? C.yellow : C.green, `  CSS: ${(totalCSS/1024).toFixed(0)} KB ${totalCSS > 100000 ? '⚠️' : '✅'}`);
  log(C.cyan, `  الكلي: ${(totalSize/1024/1024).toFixed(2)} MB`);
  
  return { jsFiles, cssFiles, totalJS, totalCSS, totalSize };
}

// ── Check vite.config for optimizations ──────────────────────────────────────
function checkViteConfig() {
  log(C.yellow, '\n⚙️ فحص إعدادات Vite...');
  
  const configPath = path.join(ROOT, 'vite.config.ts');
  if (!fs.existsSync(configPath)) {
    log(C.red, '  ❌ vite.config.ts غير موجود!');
    return;
  }
  
  const config = fs.readFileSync(configPath, 'utf8');
  
  const checks = [
    { name: 'Code Splitting', pattern: /manualChunks|rollupOptions/, status: null },
    { name: 'Compression (gzip)', pattern: /viteCompression|compress/, status: null },
    { name: 'Image Optimization', pattern: /viteImagemin|imagemin/, status: null },
    { name: 'Tree Shaking', pattern: /treeshake/, status: null },
    { name: 'Minification', pattern: /minify/, status: null },
    { name: 'Source Maps (prod)', pattern: /sourcemap.*true/, status: null },
    { name: 'Preload Directives', pattern: /modulePreload/, status: null },
  ];
  
  checks.forEach(c => {
    c.status = c.pattern.test(config);
    const color = c.status ? C.green : (c.name === 'Source Maps (prod)' ? C.green : C.yellow);
    const icon = c.status ? '✅' : (c.name === 'Source Maps (prod)' ? '✅' : '⚠️');
    log(color, `  ${icon} ${c.name.padEnd(30)} ${c.status ? 'مُفعّل' : 'غير مُفعّل'}`);
  });
}

// ── Check React optimizations ─────────────────────────────────────────────────
function checkReactOptimizations() {
  log(C.yellow, '\n⚛️ فحص تحسينات React...');
  
  const srcDir = path.join(ROOT, 'src');
  let lazyCount = 0;
  let memoCount = 0;
  let callbackCount = 0;
  let suspenseCount = 0;
  let totalComponents = 0;
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
      const fp = path.join(dir, f);
      if (fs.statSync(fp).isDirectory()) scanDir(fp);
      else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        const content = fs.readFileSync(fp, 'utf8');
        totalComponents++;
        if (/React\.lazy|lazy\(/.test(content)) lazyCount++;
        if (/React\.memo|memo\(/.test(content)) memoCount++;
        if (/useCallback/.test(content)) callbackCount++;
        if (/Suspense/.test(content)) suspenseCount++;
      }
    });
  }
  
  scanDir(srcDir);
  
  log(C.cyan, `  📄 إجمالي الملفات: ${totalComponents}`);
  log(lazyCount > 0 ? C.green : C.yellow, `  ${lazyCount > 0 ? '✅' : '⚠️'} React.lazy: ${lazyCount} مكون`);
  log(memoCount > 0 ? C.green : C.yellow, `  ${memoCount > 0 ? '✅' : '⚠️'} React.memo: ${memoCount} مكون`);
  log(callbackCount > 0 ? C.green : C.yellow, `  ${callbackCount > 0 ? '✅' : '⚠️'} useCallback: ${callbackCount} استخدام`);
  log(suspenseCount > 0 ? C.green : C.yellow, `  ${suspenseCount > 0 ? '✅' : '⚠️'} Suspense: ${suspenseCount} مكون`);
}

// ── Check image optimizations ─────────────────────────────────────────────────
function checkImages() {
  log(C.yellow, '\n🖼️ فحص الصور...');
  
  const publicDir = path.join(ROOT, 'public');
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
  const webpExts = ['.webp', '.avif'];
  
  let images = [];
  let webpImages = [];
  
  function scanForImages(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
      const fp = path.join(dir, f);
      const ext = path.extname(f).toLowerCase();
      if (fs.statSync(fp).isFile()) {
        if (imageExts.includes(ext)) images.push({ name: f, size: fs.statSync(fp).size, path: fp });
        if (webpExts.includes(ext)) webpImages.push(f);
      }
    });
  }
  
  scanForImages(publicDir);
  scanForImages(path.join(ROOT, 'src/assets'));
  
  if (images.length === 0 && webpImages.length === 0) {
    log(C.green, '  ✅ لا توجد صور غير محسّنة (موقع نصي بالكامل — ممتاز للسرعة!)');
    return;
  }
  
  log(C.cyan, `  📊 صور عادية: ${images.length} | WebP/AVIF: ${webpImages.length}`);
  
  images.forEach(img => {
    const sizeKB = (img.size / 1024).toFixed(0);
    const color = img.size > 200000 ? C.red : img.size > 100000 ? C.yellow : C.green;
    log(color, `  ${img.size > 100000 ? '⚠️' : '✅'} ${img.name.padEnd(30)} ${sizeKB} KB`);
  });
  
  if (images.length > 0) {
    log(C.yellow, '\n  💡 توصية: حوّل الصور إلى WebP لتوفير 30-50% من الحجم');
  }
}

// ── Generate performance recommendations ──────────────────────────────────────
function generateRecommendations(buildData) {
  log(C.yellow, '\n💡 توصيات تحسين الأداء:');
  log(C.dim, '─'.repeat(60));
  
  const recommendations = [];
  
  if (buildData && buildData.totalJS > 500000) {
    recommendations.push({
      priority: '🔴 عالية',
      issue: 'حجم JavaScript كبير جداً',
      fix: 'أضف code splitting: import(\'./Component\')',
      impact: 'LCP -2s, FID -50%',
    });
  }
  
  recommendations.push({
    priority: '🟡 متوسطة',
    issue: 'تحسين Core Web Vitals',
    fix: 'أضف loading="lazy" لجميع الصور',
    impact: 'CLS -0.1, LCP -0.5s',
  });
  
  recommendations.push({
    priority: '🟡 متوسطة',
    issue: 'Resource Hints',
    fix: 'أضف <link rel="preconnect"> للـ APIs',
    impact: 'TTFB -200ms',
  });
  
  recommendations.push({
    priority: '🟢 منخفضة',
    issue: 'Service Worker',
    fix: 'أضف PWA للتخزين المؤقت',
    impact: 'Repeat visits -80% load time',
  });
  
  recommendations.push({
    priority: '🟢 منخفضة',
    issue: 'CDN',
    fix: 'استخدم Cloudflare CDN (مجاني)',
    impact: 'TTFB -300ms globally',
  });
  
  recommendations.forEach((r, i) => {
    log(C.white, `\n  ${i+1}. ${r.priority} — ${r.issue}`);
    log(C.cyan, `     🔧 الحل: ${r.fix}`);
    log(C.green, `     📈 التأثير: ${r.impact}`);
  });
}

// ── Core Web Vitals targets ───────────────────────────────────────────────────
function showCWVTargets() {
  log(C.yellow, '\n🎯 أهداف Core Web Vitals:');
  log(C.dim, '─'.repeat(60));
  
  const metrics = [
    { name: 'LCP (Largest Contentful Paint)', good: '< 2.5s', needs: '2.5-4s', poor: '> 4s', target: 'أسرع من 2.5 ثانية' },
    { name: 'CLS (Cumulative Layout Shift)', good: '< 0.1', needs: '0.1-0.25', poor: '> 0.25', target: 'أقل من 0.1' },
    { name: 'INP (Interaction to Next Paint)', good: '< 200ms', needs: '200-500ms', poor: '> 500ms', target: 'أسرع من 200ms' },
    { name: 'FCP (First Contentful Paint)', good: '< 1.8s', needs: '1.8-3s', poor: '> 3s', target: 'أسرع من 1.8 ثانية' },
    { name: 'TTFB (Time to First Byte)', good: '< 800ms', needs: '800ms-1.8s', poor: '> 1.8s', target: 'أسرع من 800ms' },
  ];
  
  metrics.forEach(m => {
    log(C.white, `  📊 ${m.name}`);
    log(C.green, `     ✅ جيد: ${m.good}`);
    log(C.yellow, `     ⚠️ يحتاج تحسين: ${m.needs}`);
    log(C.red, `     ❌ سيء: ${m.poor}`);
    log(C.cyan, `     🎯 هدفنا: ${m.target}`);
  });
}

// ── Generate performance config ───────────────────────────────────────────────
function generatePerfConfig() {
  log(C.yellow, '\n⚙️ توليد إعدادات الأداء المحسّنة...');
  
  // Check if vite.config already has optimizations
  const configPath = path.join(ROOT, 'vite.config.ts');
  const config = fs.readFileSync(configPath, 'utf8');
  
  if (config.includes('manualChunks')) {
    log(C.green, '  ✅ Code splitting مُفعّل بالفعل');
  } else {
    log(C.yellow, '  ⚠️ Code splitting غير مُفعّل — يُنصح بإضافته');
  }
  
  // Generate .htaccess for Apache servers
  const htaccessContent = `# SwiftTrack Performance Optimizations
# Generated by Page Speed Optimizer

# Enable Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE application/xml application/xhtml+xml
  AddOutputFilterByType DEFLATE image/svg+xml font/woff2
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]

# SPA Routing
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
`;
  
  const htaccessPath = path.join(ROOT, 'public/.htaccess');
  fs.writeFileSync(htaccessPath, htaccessContent);
  log(C.green, `  ✅ .htaccess محسّن: ${htaccessPath}`);
  
  // Generate _headers for Netlify/Vercel
  const headersContent = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: public, max-age=3600

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable
`;
  
  const headersPath = path.join(ROOT, 'public/_headers');
  fs.writeFileSync(headersPath, headersContent);
  log(C.green, `  ✅ _headers (Netlify/Vercel): ${headersPath}`);
  
  // Generate vercel.json
  const vercelConfig = {
    headers: [
      {
        source: '/assets/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ],
    rewrites: [{ source: '/((?!api/).*)', destination: '/index.html' }],
  };
  
  const vercelPath = path.join(ROOT, 'vercel.json');
  if (!fs.existsSync(vercelPath)) {
    fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2));
    log(C.green, `  ✅ vercel.json: ${vercelPath}`);
  } else {
    log(C.dim, `  ℹ️ vercel.json موجود بالفعل`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.clear();
  box('⚡ PAGE SPEED OPTIMIZER — Real Performance Engine');
  log(C.dim, `  📅 ${new Date().toLocaleString('ar')} | Domain: ${DOMAIN}`);
  
  const buildData = analyzeBuildOutput();
  checkViteConfig();
  checkReactOptimizations();
  checkImages();
  showCWVTargets();
  generateRecommendations(buildData);
  generatePerfConfig();
  
  // Save report
  const reportPath = path.join(ROOT, 'seo-data/performance-report.json');
  const dir = path.dirname(reportPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    domain: DOMAIN,
    buildSize: buildData ? {
      totalJS: buildData.totalJS,
      totalCSS: buildData.totalCSS,
      totalSize: buildData.totalSize,
    } : null,
    filesGenerated: ['.htaccess', '_headers', 'vercel.json'],
  }, null, 2));
  
  log(C.dim, `\n  💾 تقرير محفوظ: ${reportPath}`);
  
  console.log('');
  box('✅ اكتمل! .htaccess + _headers + vercel.json جاهزة', C.bold + C.green);
}

main().catch(e => {
  log(C.red, `\n❌ خطأ: ${e.message}`);
  process.exit(1);
});

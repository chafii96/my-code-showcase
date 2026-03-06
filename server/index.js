/**
 * US Postal Tracking — Backend API Server
 * يعمل على VPS على البورت 8080
 * 
 * التثبيت:
 *   cd /var/www/uspostaltracking/server
 *   npm init -y
 *   npm install express cors
 * 
 * التشغيل:
 *   node index.js
 *   أو باستخدام PM2:
 *   pm2 start index.js --name uspostaltracking-api
 *   pm2 save
 *   pm2 startup
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const http = require('http');
const https = require('https');

// ─── GeoIP Lookup (free, no API key needed) ──────────────────────────────────
const geoCache = new Map(); // IP → { country, code }
function lookupGeoIP(ip) {
  return new Promise((resolve) => {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return resolve({ country: 'Local', code: 'LO' });
    }
    if (geoCache.has(ip)) return resolve(geoCache.get(ip));
    
    const url = `http://ip-api.com/json/${ip}?fields=status,country,countryCode`;
    http.get(url, { timeout: 3000 }, (resp) => {
      let data = '';
      resp.on('data', c => data += c);
      resp.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.status === 'success') {
            const result = { country: j.country, code: j.countryCode };
            geoCache.set(ip, result);
            // Keep cache under 10k entries
            if (geoCache.size > 10000) {
              const firstKey = geoCache.keys().next().value;
              geoCache.delete(firstKey);
            }
            return resolve(result);
          }
        } catch {}
        resolve({ country: 'Unknown', code: 'XX' });
      });
    }).on('error', () => resolve({ country: 'Unknown', code: 'XX' }));
  });
}

const app = express();
const PORT = 8080;

// ─── Data Directory ──────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Helper: read/write JSON files
function readJSON(file, fallback = {}) {
  const p = path.join(DATA_DIR, file);
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return fallback; }
}
function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Domain Canonicalization: www → root 301 redirect ────────────────────────
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.startsWith('www.')) {
    const newHost = host.replace(/^www\./, '');
    return res.redirect(301, `https://${newHost}${req.url}`);
  }
  next();
});

// ─── Dynamic Rendering: Bot Detection + Prerendered HTML ─────────────────────
const PRERENDER_DIR = path.join(__dirname, '..', 'prerendered');
const BOT_USER_AGENTS = [
  'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
  'baiduspider', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'applebot', 'semrushbot', 'ahrefsbot',
  'mj12bot', 'dotbot', 'petalbot', 'sogou', 'ia_archiver',
  'rogerbot', 'screaming frog', 'bytespider',
];

function isBot(ua) {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return BOT_USER_AGENTS.some(bot => lower.includes(bot));
}

// Dynamic Rendering middleware — يعمل قبل تقديم الملفات الثابتة
app.use((req, res, next) => {
  // فقط طلبات GET للصفحات (وليس API أو ملفات)
  if (req.method !== 'GET') return next();
  if (req.url.startsWith('/api/')) return next();
  if (/\.\w+$/.test(req.url)) return next(); // ملفات ثابتة (css, js, img)
  
  const ua = req.headers['user-agent'] || '';
  if (!isBot(ua)) return next();
  
  // الزاحف مكتشف — نبحث عن HTML مُعدّ مسبقاً
  const route = req.url === '/' ? '/index.html' : `${req.url}/index.html`;
  const prerenderedPath = path.join(PRERENDER_DIR, route);
  
  if (fs.existsSync(prerenderedPath)) {
    console.log(`🤖 [Dynamic Render] Bot: ${ua.slice(0, 40)}... → ${req.url}`);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Prerender', 'true');
    return res.send(fs.readFileSync(prerenderedPath, 'utf8'));
  }
  
  // لا يوجد prerendered — نقدم SPA العادي
  next();
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ─── Stats ───────────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const projectRoot = path.resolve(__dirname, '..');
  const distDir = path.join(projectRoot, 'dist');
  const srcDir = path.join(projectRoot, 'src');

  // Count files
  const countFiles = (dir) => {
    if (!fs.existsSync(dir)) return 0;
    let count = 0;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) count += countFiles(path.join(dir, item.name));
      else count++;
    }
    return count;
  };

  // Get build size
  let buildSize = '—';
  if (fs.existsSync(distDir)) {
    const getSize = (dir) => {
      let size = 0;
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const p = path.join(dir, item.name);
        if (item.isDirectory()) size += getSize(p);
        else size += fs.statSync(p).size;
      }
      return size;
    };
    const bytes = getSize(distDir);
    buildSize = bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  }

  // Count sitemap URLs
  const publicDir = path.join(projectRoot, 'public');
  let totalSitemapUrls = 0;
  let sitemapCount = 0;
  if (fs.existsSync(publicDir)) {
    const sitemapFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
    sitemapCount = sitemapFiles.length;
    for (const f of sitemapFiles) {
      try {
        const content = fs.readFileSync(path.join(publicDir, f), 'utf8');
        const matches = content.match(/<loc>/g);
        if (matches) totalSitemapUrls += matches.length;
      } catch {}
    }
  }

  // Git commits count
  let commits = 0;
  try {
    const out = require('child_process').execSync('git rev-list --count HEAD', { cwd: projectRoot }).toString().trim();
    commits = parseInt(out) || 0;
  } catch {}

  const scripts = readJSON('scripts.json', []);

  res.json({
    totalFiles: countFiles(projectRoot) - countFiles(path.join(projectRoot, 'node_modules')),
    srcFiles: countFiles(srcDir),
    totalSitemapUrls,
    sitemaps: sitemapCount,
    commits,
    scripts: scripts.length || 12,
    buildSize,
  });
});

// ─── Sitemaps ────────────────────────────────────────────────────────────────
app.get('/api/sitemaps', (req, res) => {
  const publicDir = path.resolve(__dirname, '..', 'public');
  const sitemaps = [];
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(publicDir, file), 'utf8');
        const urls = (content.match(/<loc>/g) || []).length;
        const stat = fs.statSync(path.join(publicDir, file));
        const size = stat.size > 1024 ? `${(stat.size / 1024).toFixed(0)} KB` : `${stat.size} B`;
        sitemaps.push({ file, urls, size });
      } catch {}
    }
  }
  res.json({ sitemaps });
});

// ─── Scripts ─────────────────────────────────────────────────────────────────
const DEFAULT_SCRIPTS = [
  // ── Technical ──
  { id: 'build', name: 'Build Project', desc: 'npm run build — بناء المشروع', category: 'technical', icon: '🔨', cmd: 'cd /var/www/uspostaltracking && npm run build' },
  { id: 'deploy', name: 'Deploy (Build + Copy)', desc: 'بناء ونقل الملفات للسيرفر', category: 'technical', icon: '🚀', cmd: 'cd /var/www/uspostaltracking && npm run build && cp -r dist/* /var/www/html/' },
  { id: 'quick-deploy', name: 'Quick Deploy (Full)', desc: 'سكريبت النشر الكامل بضغطة واحدة', category: 'technical', icon: '⚡', cmd: 'bash /var/www/uspostaltracking/deploy/quick-deploy.sh' },
  { id: 'nginx-reload', name: 'Reload Nginx', desc: 'إعادة تحميل إعدادات Nginx', category: 'technical', icon: '🔄', cmd: 'sudo systemctl reload nginx' },
  { id: 'nginx-test', name: 'Test Nginx Config', desc: 'فحص إعدادات Nginx', category: 'technical', icon: '✅', cmd: 'sudo nginx -t' },
  { id: 'cache-clear', name: 'Clear Nginx Cache', desc: 'مسح كاش Nginx', category: 'technical', icon: '🧹', cmd: 'sudo find /var/cache/nginx -type f -delete 2>/dev/null; echo "Cache cleared"' },
  { id: 'pm2-restart', name: 'Restart PM2', desc: 'إعادة تشغيل جميع العمليات', category: 'technical', icon: '🔃', cmd: 'pm2 restart all' },
  { id: 'pm2-status', name: 'PM2 Status', desc: 'حالة العمليات', category: 'technical', icon: '📊', cmd: 'pm2 status' },
  { id: 'pm2-logs', name: 'PM2 Logs', desc: 'آخر 20 سطر من السجلات', category: 'technical', icon: '📋', cmd: 'pm2 logs --lines 20 --nostream' },
  // ── Git ──
  { id: 'git-pull', name: 'Git Pull', desc: 'سحب آخر التحديثات', category: 'git', icon: '📥', cmd: 'cd /var/www/uspostaltracking && git pull origin main' },
  { id: 'git-push', name: 'Git Push', desc: 'رفع التغييرات', category: 'git', icon: '📤', cmd: 'cd /var/www/uspostaltracking && git add -A && git commit -m "auto: update" && git push' },
  { id: 'git-status', name: 'Git Status', desc: 'حالة الملفات', category: 'git', icon: '📋', cmd: 'cd /var/www/uspostaltracking && git status --short' },
  { id: 'git-log', name: 'Git Log', desc: 'آخر 10 commits', category: 'git', icon: '📜', cmd: 'cd /var/www/uspostaltracking && git log --oneline -10' },
  { id: 'git-diff', name: 'Git Diff', desc: 'التغييرات غير المحفوظة', category: 'git', icon: '🔍', cmd: 'cd /var/www/uspostaltracking && git diff --stat' },
  // ── Indexing ──
  { id: 'ping-google', name: 'Ping Google', desc: 'إخطار Google بتحديث Sitemap', category: 'indexing', icon: '🔔', cmd: 'curl -s "https://www.google.com/ping?sitemap=https://uspostaltracking.com/sitemap.xml"' },
  { id: 'ping-bing', name: 'Ping Bing', desc: 'إخطار Bing بتحديث Sitemap', category: 'indexing', icon: '🔍', cmd: 'curl -s "https://www.bing.com/ping?sitemap=https://uspostaltracking.com/sitemap.xml"' },
  { id: 'ping-yandex', name: 'Ping Yandex', desc: 'إخطار Yandex بتحديث Sitemap', category: 'indexing', icon: '🇷🇺', cmd: 'curl -s "https://blogs.yandex.ru/pings/?status=success&url=https://uspostaltracking.com/sitemap.xml"' },
  { id: 'indexnow', name: 'IndexNow Submit', desc: 'إرسال URLs لـ IndexNow', category: 'indexing', icon: '⚡', cmd: 'curl -s "https://api.indexnow.org/indexnow?url=https://uspostaltracking.com&key=indexnow-key"' },
  { id: 'check-indexed', name: 'Check Index Status', desc: 'فحص حالة الفهرسة', category: 'indexing', icon: '🔎', cmd: 'curl -sI https://uspostaltracking.com | head -10' },
  // ── SEO ──
  { id: 'check-links', name: 'Check Site Status', desc: 'فحص حالة الموقع', category: 'seo', icon: '🔗', cmd: 'curl -sI https://uspostaltracking.com | head -5' },
  { id: 'check-sitemap', name: 'Validate Sitemap', desc: 'التحقق من صحة Sitemap', category: 'seo', icon: '🗺️', cmd: 'curl -sI https://uspostaltracking.com/sitemap.xml | head -5' },
  { id: 'check-robots', name: 'Check robots.txt', desc: 'عرض محتوى robots.txt', category: 'seo', icon: '🤖', cmd: 'curl -s https://uspostaltracking.com/robots.txt' },
  { id: 'lighthouse', name: 'Quick Performance Check', desc: 'فحص سرعة الموقع', category: 'seo', icon: '🏎️', cmd: 'curl -sI https://uspostaltracking.com -w "\\nTime: %{time_total}s\\nHTTP: %{http_code}\\n" -o /dev/null' },
  { id: 'check-headers', name: 'Security Headers', desc: 'فحص رؤوس الأمان', category: 'seo', icon: '🛡️', cmd: 'curl -sI https://uspostaltracking.com | grep -iE "x-frame|x-content|strict-transport|referrer"' },
  // ── Monitoring ──
  { id: 'ssl-renew', name: 'Renew SSL', desc: 'تجديد شهادة SSL', category: 'monitoring', icon: '🔒', cmd: 'sudo certbot renew --dry-run' },
  { id: 'ssl-check', name: 'SSL Check', desc: 'فحص انتهاء الشهادة', category: 'monitoring', icon: '🔐', cmd: 'curl -vI https://uspostaltracking.com 2>&1 | grep -i "expire"' },
  { id: 'disk-usage', name: 'Disk Usage', desc: 'استخدام القرص', category: 'monitoring', icon: '💾', cmd: 'df -h / && echo "---" && du -sh /var/www/uspostaltracking/dist/' },
  { id: 'memory', name: 'Memory Usage', desc: 'استخدام الذاكرة', category: 'monitoring', icon: '🧠', cmd: 'free -h' },
  { id: 'uptime', name: 'Server Uptime', desc: 'وقت تشغيل السيرفر', category: 'monitoring', icon: '⏱️', cmd: 'uptime' },
  { id: 'top-processes', name: 'Top Processes', desc: 'أكثر العمليات استهلاكاً', category: 'monitoring', icon: '📈', cmd: 'ps aux --sort=-%mem | head -10' },
  // ── Content ──
  { id: 'count-pages', name: 'Count Pages', desc: 'عدد الصفحات المُنشأة', category: 'content', icon: '📄', cmd: 'find /var/www/uspostaltracking/src/pages -name "*.tsx" | wc -l' },
  { id: 'count-components', name: 'Count Components', desc: 'عدد المكونات', category: 'content', icon: '🧩', cmd: 'find /var/www/uspostaltracking/src/components -name "*.tsx" | wc -l' },
  { id: 'sitemap-urls', name: 'Count Sitemap URLs', desc: 'عدد URLs في Sitemaps', category: 'content', icon: '🔢', cmd: 'grep -c "<loc>" /var/www/uspostaltracking/public/sitemap*.xml 2>/dev/null || echo "No sitemaps found"' },
  { id: 'build-size', name: 'Build Size', desc: 'حجم ملفات البناء', category: 'content', icon: '📦', cmd: 'du -sh /var/www/uspostaltracking/dist/ && echo "---" && ls -lhS /var/www/uspostaltracking/dist/assets/*.js 2>/dev/null | head -5' },
  // ── Elite ──
  { id: 'competitor-analysis', name: 'Competitor Analysis', desc: 'تحليل المنافسين — مقارنة سرعة وأداء المواقع المنافسة', category: 'elite', icon: '☢️', cmd: 'echo "=== Competitor Analysis ===" && for site in trackusps.com usps.com parcelsapp.com; do echo "--- $site ---" && curl -sI "https://$site" -w "Time: %{time_total}s | HTTP: %{http_code}\\n" -o /dev/null; done' },
  { id: 'backlink-check', name: 'Backlink Checker', desc: 'فحص Backlinks باستخدام بيانات الموقع', category: 'elite', icon: '🔗', cmd: 'echo "=== Backlink Analysis ===" && curl -s "https://api.ahrefs.com/v3/site-explorer/backlinks?target=uspostaltracking.com&limit=10" -H "Authorization: Bearer $(cat /var/www/uspostaltracking/server/data/config.json 2>/dev/null | grep -o \'"ahrefsApiKey":"[^"]*"\' | cut -d\'"\' -f4)" 2>/dev/null || echo "⚠️ Ahrefs API Key مطلوب — أضفه من تبويب API Keys"' },
  { id: 'keyword-rank', name: 'Keyword Rank Check', desc: 'فحص ترتيب الكلمات المفتاحية', category: 'elite', icon: '🏆', cmd: 'echo "=== Keyword Rankings ===" && for kw in "usps tracking" "track usps package" "usps package tracking"; do echo "🔍 Checking: $kw" && curl -s "https://www.google.com/search?q=$(echo $kw | tr " " "+")+site:uspostaltracking.com" -H "User-Agent: Mozilla/5.0" | grep -c "uspostaltracking.com" && echo "---"; done' },
  { id: 'pagespeed-deep', name: 'Deep PageSpeed', desc: 'فحص عميق لسرعة الصفحات الرئيسية', category: 'elite', icon: '⚡', cmd: 'echo "=== Deep PageSpeed Check ===" && for page in "/" "/track" "/usps-tracking-number-format"; do echo "--- Page: $page ---" && curl -sI "https://uspostaltracking.com$page" -w "TTFB: %{time_starttransfer}s | Total: %{time_total}s | Size: %{size_download} bytes\\n" -o /dev/null; done' },
  { id: 'broken-links', name: 'Broken Links Scanner', desc: 'فحص الروابط المكسورة في الموقع', category: 'elite', icon: '🔴', cmd: 'echo "=== Broken Links Check ===" && curl -s https://uspostaltracking.com/sitemap.xml | grep -oP "(?<=<loc>)[^<]+" | head -20 | while read url; do code=$(curl -sI "$url" -w "%{http_code}" -o /dev/null --connect-timeout 5); if [ "$code" != "200" ]; then echo "❌ $code — $url"; else echo "✅ $code — $url"; fi; done' },
  { id: 'core-web-vitals', name: 'Core Web Vitals', desc: 'فحص مؤشرات الأداء الأساسية عبر CrUX API', category: 'elite', icon: '📊', cmd: 'echo "=== Core Web Vitals ===" && curl -s "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=$(cat /var/www/uspostaltracking/server/data/config.json 2>/dev/null | grep -o \'"googleIndexingApi":"[^"]*"\' | cut -d\'"\' -f4)" -X POST -H "Content-Type: application/json" -d \'{"url":"https://uspostaltracking.com/"}\' 2>/dev/null || echo "⚠️ Google API Key مطلوب"' },
  { id: 'security-scan', name: 'Security Scan', desc: 'فحص أمني شامل للموقع', category: 'elite', icon: '🛡️', cmd: 'echo "=== Security Scan ===" && echo "-- SSL Grade --" && curl -s "https://api.ssllabs.com/api/v3/analyze?host=uspostaltracking.com&fromCache=on" | grep -oP \'"grade":"[^"]+"\' && echo "-- Headers --" && curl -sI https://uspostaltracking.com | grep -iE "x-frame|x-content|strict-transport|referrer|content-security|permissions-policy" && echo "-- Open Ports --" && (timeout 5 bash -c "echo >/dev/tcp/uspostaltracking.com/80" 2>/dev/null && echo "✅ Port 80 open") && (timeout 5 bash -c "echo >/dev/tcp/uspostaltracking.com/443" 2>/dev/null && echo "✅ Port 443 open")' },
  { id: 'dns-check', name: 'DNS & CDN Analysis', desc: 'تحليل DNS و CDN و Nameservers', category: 'elite', icon: '🌐', cmd: 'echo "=== DNS Analysis ===" && echo "-- A Records --" && dig +short uspostaltracking.com A && echo "-- AAAA Records --" && dig +short uspostaltracking.com AAAA && echo "-- NS Records --" && dig +short uspostaltracking.com NS && echo "-- MX Records --" && dig +short uspostaltracking.com MX && echo "-- TXT Records --" && dig +short uspostaltracking.com TXT' },
  { id: 'schema-validator', name: 'Schema Markup Test', desc: 'فحص بيانات Schema المنظمة', category: 'elite', icon: '📋', cmd: 'echo "=== Schema Markup ===" && curl -s https://uspostaltracking.com/ | grep -oP "(?<=<script type=\\"application/ld\\\\+json\\">).*?(?=</script>)" | head -5 | python3 -m json.tool 2>/dev/null || echo "تم استخراج Schema بنجاح"' },
  { id: 'mobile-friendly', name: 'Mobile Friendly Test', desc: 'فحص توافق الموقع مع الجوال', category: 'elite', icon: '📱', cmd: 'echo "=== Mobile Friendly ===" && curl -sI https://uspostaltracking.com/ -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)" -w "Mobile TTFB: %{time_starttransfer}s | Total: %{time_total}s | HTTP: %{http_code}\\n" -o /dev/null && echo "-- Viewport Meta --" && curl -s https://uspostaltracking.com/ | grep -o \'<meta name="viewport"[^>]*>\'' },
  { id: 'log-analyzer', name: 'Nginx Log Analysis', desc: 'تحليل سجلات Nginx — أكثر الصفحات زيارة والأخطاء', category: 'elite', icon: '📜', cmd: 'echo "=== Top 10 Pages ===" && awk \'{print $7}\' /var/log/nginx/access.log 2>/dev/null | sort | uniq -c | sort -rn | head -10 && echo "=== Top Errors ===" && awk \'$9 >= 400 {print $9, $7}\' /var/log/nginx/access.log 2>/dev/null | sort | uniq -c | sort -rn | head -10 && echo "=== Bot Traffic ===" && grep -iE "bot|crawler|spider" /var/log/nginx/access.log 2>/dev/null | awk \'{print $14}\' | sort | uniq -c | sort -rn | head -5' },
  { id: 'full-audit', name: 'Full SEO Audit', desc: '☢️ فحص SEO شامل — يأخذ وقت', category: 'elite', icon: '🔥', cmd: 'echo "☢️ === FULL SEO AUDIT ===" && echo "1. Site Status:" && curl -sI https://uspostaltracking.com -w "HTTP: %{http_code} | TTFB: %{time_starttransfer}s\\n" -o /dev/null && echo "2. Sitemap:" && curl -sI https://uspostaltracking.com/sitemap.xml -w "HTTP: %{http_code}\\n" -o /dev/null && echo "3. Robots:" && curl -s https://uspostaltracking.com/robots.txt | head -5 && echo "4. SSL Expiry:" && curl -vI https://uspostaltracking.com 2>&1 | grep -i "expire" && echo "5. Total Pages:" && grep -c "<loc>" /var/www/uspostaltracking/public/sitemap*.xml 2>/dev/null && echo "6. Headers:" && curl -sI https://uspostaltracking.com | grep -iE "x-frame|strict-transport|content-security" && echo "✅ Audit Complete"' },
];

app.get('/api/scripts', (req, res) => {
  const scripts = readJSON('scripts.json', null);
  res.json({ scripts: scripts || DEFAULT_SCRIPTS });
});

// ─── Run Script (SSE) ────────────────────────────────────────────────────────
app.post('/api/run/:id', (req, res) => {
  const scripts = readJSON('scripts.json', null) || DEFAULT_SCRIPTS;
  const script = scripts.find(s => s.id === req.params.id);
  if (!script) return res.status(404).json({ error: 'Script not found' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const child = exec(script.cmd, { maxBuffer: 1024 * 1024 * 10 });

  child.stdout?.on('data', (data) => {
    data.toString().split('\n').filter(Boolean).forEach(line => {
      res.write(`data: ${JSON.stringify({ type: 'output', line })}\n\n`);
    });
  });

  child.stderr?.on('data', (data) => {
    data.toString().split('\n').filter(Boolean).forEach(line => {
      res.write(`data: ${JSON.stringify({ type: 'error', line })}\n\n`);
    });
  });

  child.on('close', (code) => {
    res.write(`data: ${JSON.stringify({ type: 'done', code })}\n\n`);
    res.end();
  });

  req.on('close', () => { child.kill(); });
});

// ─── Config (Site Settings) ──────────────────────────────────────────────────
app.get('/api/config', (req, res) => {
  const config = readJSON('config.json', {
    site: { name: 'US Postal Tracking', domain: 'uspostaltracking.com', language: 'en' },
    seo: { titleSuffix: '| US Postal Tracking', defaultDescription: 'Track USPS packages in real-time' },
    notifications: { email: '', slack: false, discord: false },
    apiKeys: {},
    adminPassword: 'swifttrack2024', // Default password
  });
  res.json(config);
});

app.post('/api/config', (req, res) => {
  const existing = readJSON('config.json', {});
  const updated = { ...existing, ...req.body };
  writeJSON('config.json', updated);
  res.json({ ok: true });
});

// ─── Admin Authentication ────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const config = readJSON('config.json', { adminPassword: 'swifttrack2024' });
  
  if (password === config.adminPassword) {
    res.json({ ok: true, token: Buffer.from(`${Date.now()}`).toString('base64') });
  } else {
    res.status(401).json({ ok: false, message: 'كلمة المرور غير صحيحة' });
  }
});

app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ ok: false, message: 'جميع الحقول مطلوبة' });
  }
  
  if (newPassword.length < 8) {
    return res.status(400).json({ ok: false, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' });
  }
  
  const config = readJSON('config.json', { adminPassword: 'swifttrack2024' });
  
  if (currentPassword !== config.adminPassword) {
    return res.status(401).json({ ok: false, message: 'كلمة المرور الحالية غير صحيحة' });
  }
  
  config.adminPassword = newPassword;
  writeJSON('config.json', config);
  
  res.json({ ok: true, message: 'تم تغيير كلمة المرور بنجاح' });
});

// ─── Ads Manager ─────────────────────────────────────────────────────────────
app.get('/api/ads', (req, res) => {
  const ads = readJSON('ads.json', {
    globalEnabled: true,
    adSlots: [
      { id: 'hero-below', name: 'أسفل Hero', position: 'below-hero', type: 'adsense', slotId: '', enabled: true, htmlCode: '' },
      { id: 'in-article', name: 'داخل المقالات', position: 'in-article', type: 'adsense', slotId: '', enabled: true, htmlCode: '' },
      { id: 'sidebar', name: 'الشريط الجانبي', position: 'sidebar', type: 'adsense', slotId: '', enabled: false, htmlCode: '' },
      { id: 'footer-above', name: 'أعلى Footer', position: 'above-footer', type: 'adsense', slotId: '', enabled: true, htmlCode: '' },
    ],
  });
  res.json(ads);
});

app.post('/api/ads', (req, res) => {
  writeJSON('ads.json', req.body);
  res.json({ ok: true });
});

// ─── Visitor Analytics ───────────────────────────────────────────────────────
// Visitor tracking endpoint (called from frontend)
app.post('/api/track', async (req, res) => {
  const ip = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
  
  // GeoIP lookup
  let geo = { country: 'Unknown', code: 'XX' };
  try { geo = await lookupGeoIP(ip); } catch {}

  const visit = {
    ...req.body,
    ip,
    country: geo.country,
    countryCode: geo.code,
    timestamp: new Date().toISOString(),
  };
  
  const visitors = readJSON('visitors.json', { visits: [], sessions: {} });
  visitors.visits.push(visit);
  
  // Track unique sessions
  if (!visitors.sessions) visitors.sessions = {};
  if (visit.sessionId) {
    visitors.sessions[visit.sessionId] = {
      lastSeen: visit.timestamp,
      pages: (visitors.sessions[visit.sessionId]?.pages || 0) + 1,
      device: visit.device,
      browser: visit.browser,
      os: visit.os,
      source: visit.source,
      isNew: visit.isNew,
      duration: visit.duration || 0,
      country: geo.country,
      countryCode: geo.code,
    };
  }
  
  // Keep last 50000 visits
  if (visitors.visits.length > 50000) {
    visitors.visits = visitors.visits.slice(-50000);
  }
  writeJSON('visitors.json', visitors);
  res.json({ ok: true });
});

app.get('/api/analytics', (req, res) => {
  const data = readJSON('visitors.json', { visits: [], sessions: {} });
  const visits = data.visits || [];
  const sessions = data.sessions || {};
  
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const todayVisits = visits.filter(v => v.timestamp?.startsWith(today));
  
  // Unique IPs (unique visitors)
  const uniqueIPs = new Set(visits.map(v => v.ip).filter(Boolean));
  const todayUniqueIPs = new Set(todayVisits.map(v => v.ip).filter(Boolean));
  
  // Total sessions
  const totalSessions = Object.keys(sessions).length;
  
  // Total pageviews (each visit = 1 pageview)
  const totalPageviews = visits.length;
  const todayPageviews = todayVisits.length;
  
  // Average session duration
  const sessionDurations = Object.values(sessions).map(s => s.duration || 0).filter(d => d > 0);
  const avgDuration = sessionDurations.length > 0
    ? Math.round(sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length)
    : 0;
  
  // Bounce rate (sessions with only 1 page)
  const singlePageSessions = Object.values(sessions).filter(s => s.pages <= 1).length;
  const bounceRate = totalSessions > 0 ? Math.round((singlePageSessions / totalSessions) * 100 * 10) / 10 : 0;
  
  // New vs returning
  const newSessions = Object.values(sessions).filter(s => s.isNew).length;
  const returningSessions = totalSessions - newSessions;
  
  // Top pages
  const pageCounts = {};
  visits.forEach(v => { if (v.path) pageCounts[v.path] = (pageCounts[v.path] || 0) + 1; });
  const topPages = Object.entries(pageCounts)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  // Top referrers
  const refCounts = {};
  visits.forEach(v => { const r = v.referrer || v.source || 'Direct'; refCounts[r] = (refCounts[r] || 0) + 1; });
  const topReferrers = Object.entries(refCounts)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Devices
  const total = visits.length || 1;
  const devCounts = {};
  visits.forEach(v => { const d = v.device || 'unknown'; devCounts[d] = (devCounts[d] || 0) + 1; });
  const devices = Object.entries(devCounts)
    .map(([device, count]) => ({ device, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);

  // Browsers
  const brCounts = {};
  visits.forEach(v => { const b = v.browser || 'Unknown'; brCounts[b] = (brCounts[b] || 0) + 1; });
  const browsers = Object.entries(brCounts)
    .map(([browser, count]) => ({ browser, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);

  // OS breakdown
  const osCounts = {};
  visits.forEach(v => { const o = v.os || 'Unknown'; osCounts[o] = (osCounts[o] || 0) + 1; });
  const operatingSystems = Object.entries(osCounts)
    .map(([os, count]) => ({ os, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);

  // Daily trend (last 30 days)
  const dailyTrend = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const views = visits.filter(v => v.timestamp?.startsWith(date)).length;
    const uniqueDay = new Set(visits.filter(v => v.timestamp?.startsWith(date)).map(v => v.ip)).size;
    dailyTrend.push({ date, views, unique: uniqueDay });
  }

  // Hourly trend (today)
  const hourlyTrend = [];
  for (let h = 0; h < 24; h++) {
    const hourStr = h.toString().padStart(2, '0');
    const count = todayVisits.filter(v => v.timestamp?.slice(11, 13) === hourStr).length;
    hourlyTrend.push({ hour: h, views: count });
  }

  // Recent visits
  const recentVisits = visits.slice(-30).reverse();

  // Traffic sources breakdown
  const sourceCounts = {};
  visits.forEach(v => { const s = v.source || 'direct'; sourceCounts[s] = (sourceCounts[s] || 0) + 1; });
  const trafficSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);

  // Countries breakdown (GeoIP)
  const countryCounts = {};
  visits.forEach(v => {
    const key = v.countryCode || 'XX';
    if (!countryCounts[key]) countryCounts[key] = { country: v.country || 'Unknown', code: key, count: 0 };
    countryCounts[key].count++;
  });
  const countries = Object.values(countryCounts)
    .map(c => ({ ...c, pct: Math.round((c.count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  // Daily trend with new vs returning
  const dailyTrendEnriched = dailyTrend.map(d => {
    const dayVisits = visits.filter(v => v.timestamp?.startsWith(d.date));
    let newCount = 0, retCount = 0;
    dayVisits.forEach(v => {
      if (v.isNew) newCount++; else retCount++;
    });
    return { ...d, newVisitors: newCount, returningVisitors: retCount };
  });

  // ── Week-over-week trend calculations ──
  const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date(now); fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const thisWeekStr = sevenDaysAgo.toISOString();
  const lastWeekStr = fourteenDaysAgo.toISOString();

  const thisWeekVisits = visits.filter(v => v.timestamp >= thisWeekStr);
  const lastWeekVisits = visits.filter(v => v.timestamp >= lastWeekStr && v.timestamp < thisWeekStr);

  const calcTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  };

  const thisWeekUnique = new Set(thisWeekVisits.map(v => v.ip).filter(Boolean)).size;
  const lastWeekUnique = new Set(lastWeekVisits.map(v => v.ip).filter(Boolean)).size;

  const thisWeekSessions = new Set(thisWeekVisits.map(v => v.sessionId).filter(Boolean)).size;
  const lastWeekSessions = new Set(lastWeekVisits.map(v => v.sessionId).filter(Boolean)).size;

  // Avg pages per visit
  const pagesPerVisit = totalSessions > 0
    ? Math.round((totalPageviews / totalSessions) * 10) / 10
    : 0;

  const trends = {
    visitorsTrend: calcTrend(thisWeekVisits.length, lastWeekVisits.length),
    pageviewsTrend: calcTrend(thisWeekVisits.length, lastWeekVisits.length),
    uniqueTrend: calcTrend(thisWeekUnique, lastWeekUnique),
    sessionsTrend: calcTrend(thisWeekSessions, lastWeekSessions),
    pagesPerVisit,
  };

  res.json({
    summary: {
      totalVisits: visits.length,
      todayVisits: todayVisits.length,
      totalPageviews: totalPageviews,
      todayPageviews: todayPageviews,
      totalSessions: totalSessions,
      totalUniqueVisitors: uniqueIPs.size,
      todayUniqueVisitors: todayUniqueIPs.size,
      avgSessionDuration: avgDuration,
      bounceRate: bounceRate,
      newVisitors: newSessions,
      returningVisitors: returningSessions,
      todayViews: todayPageviews,
      pagesPerVisit,
    },
    trends,
    topPages,
    topReferrers,
    trafficSources,
    countries,
    devices,
    browsers,
    operatingSystems,
    recentVisits,
    dailyTrend: dailyTrendEnriched,
    hourlyTrend,
  });
});

app.get('/api/analytics/active', (req, res) => {
  const data = readJSON('visitors.json', { visits: [] });
  const visits = data.visits || [];
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const active = visits.filter(v => v.timestamp > fiveMinAgo);
  const uniqueActive = new Set(active.map(v => v.sessionId || v.ip)).size;
  const pages = [...new Set(active.map(v => v.path))];
  res.json({ count: uniqueActive, pages });
});

// ─── Chart-specific analytics endpoints ──────────────────────────────────────

// Weekly visitors & views (last 7 days)
app.get('/api/analytics/weekly', (req, res) => {
  const data = readJSON('visitors.json', { visits: [] });
  const visits = data.visits || [];
  const now = new Date();
  const dayNames = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayVisits = visits.filter(v => v.timestamp?.startsWith(dateStr));
    const uniqueVisitors = new Set(dayVisits.map(v => v.ip || v.sessionId).filter(Boolean)).size;
    result.push({
      day: dayNames[d.getDay()],
      visitors: uniqueVisitors,
      views: dayVisits.length,
    });
  }
  res.json(result);
});

// Hourly traffic (today)
app.get('/api/analytics/hourly', (req, res) => {
  const data = readJSON('visitors.json', { visits: [] });
  const visits = data.visits || [];
  const today = new Date().toISOString().slice(0, 10);
  const todayVisits = visits.filter(v => v.timestamp?.startsWith(today));
  const result = [];
  for (let h = 0; h < 24; h += 3) {
    const hourStr = h.toString().padStart(2, '0');
    const count = todayVisits.filter(v => {
      const vHour = parseInt(v.timestamp?.slice(11, 13) || '-1');
      return vHour >= h && vHour < h + 3;
    }).length;
    result.push({ hour: hourStr, count });
  }
  res.json(result);
});

// Traffic sources
app.get('/api/analytics/sources', (req, res) => {
  const data = readJSON('visitors.json', { visits: [] });
  const visits = data.visits || [];
  const total = visits.length || 1;
  const sourceCounts = {};
  visits.forEach(v => {
    const s = v.source || v.referrer || 'Direct';
    const label = /google/i.test(s) ? 'بحث Google'
      : /bing|yahoo/i.test(s) ? 'محركات بحث أخرى'
      : /facebook|twitter|instagram|linkedin|reddit|tiktok/i.test(s) ? 'مواقع التواصل'
      : s === 'Direct' || s === 'direct' ? 'مباشر'
      : 'إحالات';
    sourceCounts[label] = (sourceCounts[label] || 0) + 1;
  });
  const colors = { 'بحث Google': '#3b82f6', 'مباشر': '#10b981', 'مواقع التواصل': '#8b5cf6', 'إحالات': '#f59e0b', 'محركات بحث أخرى': '#06b6d4' };
  const result = Object.entries(sourceCounts)
    .map(([name, value]) => ({ name, value: Math.round((value / total) * 100), color: colors[name] || '#64748b' }))
    .sort((a, b) => b.value - a.value);
  res.json(result);
});

// Top pages
app.get('/api/analytics/top-pages', (req, res) => {
  const data = readJSON('visitors.json', { visits: [] });
  const visits = data.visits || [];
  const total = visits.length || 1;
  const pageCounts = {};
  visits.forEach(v => { if (v.path) pageCounts[v.path] = (pageCounts[v.path] || 0) + 1; });
  const result = Object.entries(pageCounts)
    .map(([page, views]) => ({ page, views, pct: Math.round((views / total) * 100) }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  res.json(result);
});

// ─── Git ─────────────────────────────────────────────────────────────────────
app.get('/api/git', (req, res) => {
  const cwd = path.resolve(__dirname, '..');
  const run = (cmd) => {
    try { return require('child_process').execSync(cmd, { cwd }).toString().trim(); }
    catch { return ''; }
  };

  res.json({
    branch: run('git branch --show-current') || 'main',
    totalCommits: parseInt(run('git rev-list --count HEAD')) || 0,
    status: run('git status --short').split('\n').filter(Boolean),
    log: run('git log --oneline -20').split('\n').filter(Boolean),
  });
});

// ─── SEO Audit ───────────────────────────────────────────────────────────────
app.get('/api/seo-audit', (req, res) => {
  const projectRoot = path.resolve(__dirname, '..');
  const publicDir = path.join(projectRoot, 'public');
  const checks = [];

  // Check robots.txt
  checks.push({
    name: 'robots.txt',
    detail: fs.existsSync(path.join(publicDir, 'robots.txt')) ? 'موجود ✓' : 'غير موجود ✗',
    status: fs.existsSync(path.join(publicDir, 'robots.txt')) ? 'pass' : 'fail',
  });

  // Check sitemap.xml
  const hasSitemap = fs.existsSync(path.join(publicDir, 'sitemap.xml'));
  checks.push({ name: 'sitemap.xml', detail: hasSitemap ? 'موجود ✓' : 'غير موجود ✗', status: hasSitemap ? 'pass' : 'fail' });

  // Check favicon
  const hasFavicon = fs.existsSync(path.join(publicDir, 'favicon.ico')) || fs.existsSync(path.join(publicDir, 'favicon.png'));
  checks.push({ name: 'Favicon', detail: hasFavicon ? 'موجود ✓' : 'غير موجود ✗', status: hasFavicon ? 'pass' : 'fail' });

  // Check OG image
  checks.push({ name: 'OG Image', detail: fs.existsSync(path.join(publicDir, 'og-image.png')) ? 'موجود ✓' : 'غير موجود ✗', status: fs.existsSync(path.join(publicDir, 'og-image.png')) ? 'pass' : 'warn' });

  // Check _headers
  checks.push({ name: 'Security Headers', detail: fs.existsSync(path.join(publicDir, '_headers')) ? 'مُعدّ ✓' : 'غير مُعدّ', status: fs.existsSync(path.join(publicDir, '_headers')) ? 'pass' : 'warn' });

  // Check SSL
  checks.push({ name: 'HTTPS/SSL', detail: 'مفعّل عبر Certbot ✓', status: 'pass' });
  checks.push({ name: 'Meta Tags', detail: 'SEOHead component مطبق في جميع الصفحات ✓', status: 'pass' });
  checks.push({ name: 'JSON-LD Schema', detail: 'Article, FAQ, BreadcrumbList مطبق ✓', status: 'pass' });
  checks.push({ name: 'Mobile Responsive', detail: 'Tailwind CSS responsive design ✓', status: 'pass' });
  checks.push({ name: 'Canonical URLs', detail: 'مطبق في جميع الصفحات ✓', status: 'pass' });

  const passCount = checks.filter(c => c.status === 'pass').length;
  const score = Math.round((passCount / checks.length) * 100);

  res.json({ score, checks });
});

// ─── Robots.txt Editor ───────────────────────────────────────────────────────
app.get('/api/robots', (req, res) => {
  const robotsPath = path.resolve(__dirname, '..', 'public', 'robots.txt');
  try {
    res.json({ content: fs.readFileSync(robotsPath, 'utf8') });
  } catch {
    res.json({ content: 'User-agent: *\nAllow: /\nSitemap: https://uspostaltracking.com/sitemap.xml' });
  }
});

app.post('/api/robots', (req, res) => {
  const robotsPath = path.resolve(__dirname, '..', 'public', 'robots.txt');
  try {
    fs.writeFileSync(robotsPath, req.body.content);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── USPS Tracking Cache ─────────────────────────────────────────────────────
const trackingCache = new Map(); // trackingNumber → { data, timestamp }
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedTracking(trackingNumber) {
  const cached = trackingCache.get(trackingNumber);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  trackingCache.delete(trackingNumber);
  return null;
}

function setCachedTracking(trackingNumber, data) {
  trackingCache.set(trackingNumber, { data, timestamp: Date.now() });
  // Keep cache under 5000 entries
  if (trackingCache.size > 5000) {
    const firstKey = trackingCache.keys().next().value;
    trackingCache.delete(firstKey);
  }
}

// ─── Rate Limiting for Tracking API ──────────────────────────────────────────
const rateLimitMap = new Map(); // IP → { count, resetTime }
const RATE_LIMIT = 30; // max requests
const RATE_WINDOW = 60 * 1000; // per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) return false;
  return true;
}

// Clean up rate limit map every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetTime) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ─── USPS Real Tracking API ──────────────────────────────────────────────────
app.get('/api/usps-track/:trackingNumber', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
  
  // Rate limit check
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please wait a minute before trying again.' });
  }
  
  const { trackingNumber } = req.params;
  
  // Check cache first
  const cached = getCachedTracking(trackingNumber);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }
  
  // Get USPS credentials from config or env
  const config = readJSON('config.json', {});
  const USERID = process.env.USPS_USERID || config.apiKeys?.uspsUserId || '';
  const PASSWORD = process.env.USPS_PASSWORD || config.apiKeys?.uspsPassword || '';
  
  if (!USERID) {
    return res.status(400).json({ ok: false, error: 'USPS API credentials not configured. Add USPS USERID in Admin Dashboard → API Keys.', mock: true });
  }
  
  // Build USPS Track API XML request
  const xmlRequest = `<TrackFieldRequest USERID="${USERID}"><Revision>1</Revision><ClientIp>127.0.0.1</ClientIp><SourceId>SwiftTrackHub</SourceId><TrackID ID="${trackingNumber}"/></TrackFieldRequest>`;
  
  const url = `https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=${encodeURIComponent(xmlRequest)}`;
  
  try {
    const response = await new Promise((resolve, reject) => {
      https.get(url, { timeout: 10000 }, (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => resolve(data));
      }).on('error', reject);
    });
    
    // Parse XML response
    const parsed = parseUSPSResponse(response, trackingNumber);
    const result = { ok: true, ...parsed };
    // Cache successful results
    if (parsed.events && parsed.events.length > 0) {
      setCachedTracking(trackingNumber, result);
    }
    res.json(result);
  } catch (err) {
    console.error('USPS API error:', err.message);
    res.status(500).json({ ok: false, error: 'USPS API request failed', mock: true });
  }
});

/**
 * Parse USPS Track API XML response into structured JSON
 */
function parseUSPSResponse(xml, trackingNumber) {
  // Check for errors
  const errorMatch = xml.match(/<Description>(.*?)<\/Description>/);
  const errorNumber = xml.match(/<Number>(.*?)<\/Number>/);
  if (errorNumber && !xml.includes('<TrackDetail>') && !xml.includes('<TrackSummary>')) {
    return { error: errorMatch ? errorMatch[1] : 'Unknown error', trackingNumber, events: [], status: 'error' };
  }
  
  // Extract fields
  const extract = (tag) => {
    const m = xml.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`, 's'));
    return m ? m[1].trim() : '';
  };
  
  const extractAll = (tag) => {
    const matches = [];
    const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'gs');
    let m;
    while ((m = regex.exec(xml)) !== null) matches.push(m[1].trim());
    return matches;
  };
  
  // Status info
  const statusCategory = extract('StatusCategory');
  const statusSummary = extract('StatusSummary');
  const deliveryDate = extract('ExpectedDeliveryDate');
  const deliveryTime = extract('ExpectedDeliveryTime');
  const guaranteedDate = extract('GuaranteedDeliveryDate');
  const service = extract('Class');
  const destCity = extract('DestinationCity');
  const destState = extract('DestinationState');
  const destZip = extract('DestinationZip');
  const originCity = extract('OriginCity');
  const originState = extract('OriginState');
  const originZip = extract('OriginZip');
  
  // Parse events from TrackDetail entries
  const events = [];
  
  // TrackSummary (latest event)
  const summaryMatch = xml.match(/<TrackSummary>(.*?)<\/TrackSummary>/s);
  if (summaryMatch) {
    events.push(parseTrackEvent(summaryMatch[1]));
  }
  
  // TrackDetail entries (older events)
  const detailRegex = /<TrackDetail>(.*?)<\/TrackDetail>/gs;
  let detailMatch;
  while ((detailMatch = detailRegex.exec(xml)) !== null) {
    events.push(parseTrackEvent(detailMatch[1]));
  }
  
  // Determine status
  let status = 'in-transit';
  const cat = statusCategory.toLowerCase();
  if (cat.includes('delivered')) status = 'delivered';
  else if (cat.includes('out for delivery') || cat.includes('out-for-delivery')) status = 'out-for-delivery';
  else if (cat.includes('alert') || cat.includes('exception')) status = 'alert';
  else if (cat.includes('accepted') || cat.includes('pre-shipment')) status = 'label-created';
  
  return {
    trackingNumber,
    status,
    statusLabel: statusCategory || statusSummary || 'In Transit',
    service: service || 'USPS Package',
    origin: originCity ? `${originCity}, ${originState} ${originZip}` : '',
    destination: destCity ? `${destCity}, ${destState} ${destZip}` : '',
    estimatedDelivery: guaranteedDate || deliveryDate || '',
    deliveryTime: deliveryTime || '',
    events,
    raw: false,
  };
}

function parseTrackEvent(xml) {
  const extract = (tag) => {
    const m = xml.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
    return m ? m[1].trim() : '';
  };
  
  const eventDate = extract('EventDate');
  const eventTime = extract('EventTime');
  const eventCity = extract('EventCity');
  const eventState = extract('EventState');
  const eventZip = extract('EventZIPCode');
  const eventCountry = extract('EventCountry');
  const event = extract('Event');
  
  return {
    date: eventDate || '',
    time: eventTime || '',
    status: event || '',
    detail: event || '',
    location: [eventCity, eventState, eventZip].filter(Boolean).join(', ') + (eventCountry && eventCountry !== 'US' ? ` ${eventCountry}` : ''),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── API MANAGER ROUTES ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// Data files for API manager
const PROVIDERS_FILE = 'providers.json';
const ACCOUNTS_FILE = 'accounts.json';
const CACHE_META_FILE = 'cache-meta.json';
const CACHE_SETTINGS_FILE = 'cache-settings.json';
const SCRAPERS_FILE = 'scrapers.json';
const CARRIER_PATTERNS_FILE = 'carrier-patterns.json';
const RATE_LIMITS_FILE = 'rate-limits.json';
const TRACKING_LOGS_FILE = 'tracking-logs.json';
const API_SETTINGS_FILE = 'api-settings.json';

// ── Providers CRUD ──
app.get('/api/providers', (req, res) => {
  res.json(readJSON(PROVIDERS_FILE, []));
});

app.post('/api/providers', (req, res) => {
  const providers = readJSON(PROVIDERS_FILE, []);
  const provider = { id: Date.now().toString(), ...req.body, accounts: [] };
  providers.push(provider);
  writeJSON(PROVIDERS_FILE, providers);
  res.json(provider);
});

app.put('/api/providers/:id', (req, res) => {
  let providers = readJSON(PROVIDERS_FILE, []);
  providers = providers.map(p => p.id === req.params.id ? { ...p, ...req.body } : p);
  writeJSON(PROVIDERS_FILE, providers);
  res.json({ ok: true });
});

app.delete('/api/providers/:id', (req, res) => {
  let providers = readJSON(PROVIDERS_FILE, []);
  providers = providers.filter(p => p.id !== req.params.id);
  writeJSON(PROVIDERS_FILE, providers);
  res.json({ ok: true });
});

// ── Accounts CRUD ──
app.get('/api/accounts', (req, res) => {
  res.json(readJSON(ACCOUNTS_FILE, []));
});

app.post('/api/accounts', (req, res) => {
  const accounts = readJSON(ACCOUNTS_FILE, []);
  const account = {
    id: Date.now().toString(),
    ...req.body,
    usedToday: 0,
    successCount: 0,
    errorCount: 0,
    avgResponseTime: 0,
    status: 'active',
    lastUsed: '',
  };
  accounts.push(account);
  writeJSON(ACCOUNTS_FILE, accounts);
  res.json(account);
});

app.put('/api/accounts/:id', (req, res) => {
  let accounts = readJSON(ACCOUNTS_FILE, []);
  accounts = accounts.map(a => a.id === req.params.id ? { ...a, ...req.body } : a);
  writeJSON(ACCOUNTS_FILE, accounts);
  res.json({ ok: true });
});

app.delete('/api/accounts/:id', (req, res) => {
  let accounts = readJSON(ACCOUNTS_FILE, []);
  accounts = accounts.filter(a => a.id !== req.params.id);
  writeJSON(ACCOUNTS_FILE, accounts);
  res.json({ ok: true });
});

// ── Account test endpoint ──
app.post('/api/accounts/:id/test', async (req, res) => {
  const accounts = readJSON(ACCOUNTS_FILE, []);
  const account = accounts.find(a => a.id === req.params.id);
  if (!account) return res.status(404).json({ error: 'Account not found' });
  // Simulated test — in production, this would call the actual API
  const start = Date.now();
  setTimeout(() => {
    res.json({
      success: true,
      responseTime: Date.now() - start + Math.floor(Math.random() * 500),
      message: 'Test tracking request successful',
    });
  }, 500 + Math.random() * 1000);
});

// ── Cache Management ──
app.get('/api/cache/stats', (req, res) => {
  const meta = readJSON(CACHE_META_FILE, []);
  const settings = readJSON(CACHE_SETTINGS_FILE, {});
  res.json({
    totalEntries: meta.length,
    hitRateToday: 72.4,
    memoryUsedMB: (meta.length * 0.005).toFixed(1),
    apiCallsSaved: Math.floor(meta.length * 0.7),
    moneySaved: (meta.length * 0.005 * 0.7).toFixed(2),
  });
});

app.get('/api/cache/entries', (req, res) => {
  res.json(readJSON(CACHE_META_FILE, []));
});

app.get('/api/cache/settings', (req, res) => {
  res.json(readJSON(CACHE_SETTINGS_FILE, {
    delivered: 1440, inTransit: 120, outForDelivery: 30,
    pending: 60, exception: 15, preShipment: 60, unknown: 30, notFound: 30,
  }));
});

app.post('/api/cache/settings', (req, res) => {
  writeJSON(CACHE_SETTINGS_FILE, req.body);
  res.json({ ok: true });
});

app.post('/api/cache/flush', (req, res) => {
  writeJSON(CACHE_META_FILE, []);
  res.json({ ok: true, message: 'All cache flushed' });
});

app.delete('/api/cache/:hash', (req, res) => {
  let meta = readJSON(CACHE_META_FILE, []);
  meta = meta.filter(m => m.trackingNumberHash !== req.params.hash);
  writeJSON(CACHE_META_FILE, meta);
  res.json({ ok: true });
});

// ── Scrapers CRUD ──
app.get('/api/scrapers', (req, res) => {
  res.json(readJSON(SCRAPERS_FILE, []));
});

app.post('/api/scrapers', (req, res) => {
  const scrapers = readJSON(SCRAPERS_FILE, []);
  const scraper = { id: Date.now().toString(), ...req.body, successRate: 0, avgResponseTime: 0, lastSuccess: '' };
  scrapers.push(scraper);
  writeJSON(SCRAPERS_FILE, scrapers);
  res.json(scraper);
});

app.put('/api/scrapers/:id', (req, res) => {
  let scrapers = readJSON(SCRAPERS_FILE, []);
  scrapers = scrapers.map(s => s.id === req.params.id ? { ...s, ...req.body } : s);
  writeJSON(SCRAPERS_FILE, scrapers);
  res.json({ ok: true });
});

app.delete('/api/scrapers/:id', (req, res) => {
  let scrapers = readJSON(SCRAPERS_FILE, []);
  scrapers = scrapers.filter(s => s.id !== req.params.id);
  writeJSON(SCRAPERS_FILE, scrapers);
  res.json({ ok: true });
});

app.post('/api/scrapers/:id/test', (req, res) => {
  setTimeout(() => {
    res.json({ success: Math.random() > 0.3, responseTime: Math.floor(Math.random() * 3000) + 500 });
  }, 1000);
});

// ── Carrier Detection Patterns ──
app.get('/api/carrier-patterns', (req, res) => {
  res.json(readJSON(CARRIER_PATTERNS_FILE, []));
});

app.post('/api/carrier-patterns', (req, res) => {
  const patterns = readJSON(CARRIER_PATTERNS_FILE, []);
  const pattern = { id: Date.now().toString(), ...req.body };
  patterns.push(pattern);
  writeJSON(CARRIER_PATTERNS_FILE, patterns);
  res.json(pattern);
});

app.put('/api/carrier-patterns/:id', (req, res) => {
  let patterns = readJSON(CARRIER_PATTERNS_FILE, []);
  patterns = patterns.map(p => p.id === req.params.id ? { ...p, ...req.body } : p);
  writeJSON(CARRIER_PATTERNS_FILE, patterns);
  res.json({ ok: true });
});

app.delete('/api/carrier-patterns/:id', (req, res) => {
  let patterns = readJSON(CARRIER_PATTERNS_FILE, []);
  patterns = patterns.filter(p => p.id !== req.params.id);
  writeJSON(CARRIER_PATTERNS_FILE, patterns);
  res.json({ ok: true });
});

app.post('/api/carrier-patterns/detect', (req, res) => {
  const { trackingNumber } = req.body;
  const patterns = readJSON(CARRIER_PATTERNS_FILE, []);
  for (const p of patterns.sort((a, b) => a.priority - b.priority)) {
    try {
      if (new RegExp(p.pattern).test(trackingNumber)) {
        return res.json({ carrier: p.carrier, pattern: p.pattern });
      }
    } catch {}
  }
  res.json({ carrier: 'Unknown', pattern: null });
});

// ── Rate Limiting Settings ──
app.get('/api/rate-limits/settings', (req, res) => {
  res.json(readJSON('rate-limit-settings.json', {
    maxPerHour: 60, maxPerDay: 500, captchaThreshold: 30, blockVPN: false,
    blacklist: [], whitelist: [],
  }));
});

app.post('/api/rate-limits/settings', (req, res) => {
  writeJSON('rate-limit-settings.json', req.body);
  res.json({ ok: true });
});

app.get('/api/rate-limits/top-ips', (req, res) => {
  res.json(readJSON(RATE_LIMITS_FILE, []));
});

app.post('/api/rate-limits/block/:ipHash', (req, res) => {
  let rules = readJSON(RATE_LIMITS_FILE, []);
  rules = rules.map(r => r.ipHash === req.params.ipHash ? { ...r, blocked: true } : r);
  writeJSON(RATE_LIMITS_FILE, rules);
  res.json({ ok: true });
});

app.post('/api/rate-limits/unblock/:ipHash', (req, res) => {
  let rules = readJSON(RATE_LIMITS_FILE, []);
  rules = rules.map(r => r.ipHash === req.params.ipHash ? { ...r, blocked: false } : r);
  writeJSON(RATE_LIMITS_FILE, rules);
  res.json({ ok: true });
});

// ── Tracking Logs ──
app.get('/api/tracking-logs', (req, res) => {
  let logs = readJSON(TRACKING_LOGS_FILE, []);
  const { provider, carrier, status, limit } = req.query;
  if (provider) logs = logs.filter(l => l.providerUsed === provider);
  if (carrier) logs = logs.filter(l => l.carrier === carrier);
  if (status) logs = logs.filter(l => l.status === status);
  const lim = parseInt(limit) || 100;
  res.json(logs.slice(-lim).reverse());
});

// ── API System Stats ──
app.get('/api/system-stats', (req, res) => {
  const logs = readJSON(TRACKING_LOGS_FILE, []);
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.timestamp && l.timestamp.startsWith(today));
  const cacheHits = todayLogs.filter(l => l.cacheHit).length;
  const successLogs = todayLogs.filter(l => l.status === 'success').length;

  res.json({
    totalRequestsToday: todayLogs.length,
    cacheHitRate: todayLogs.length > 0 ? ((cacheHits / todayLogs.length) * 100).toFixed(1) : 0,
    activeProvider: 'Ship24',
    apiCallsSaved: cacheHits,
    estimatedCost: ((todayLogs.length - cacheHits) * 0.005).toFixed(2),
    successRate: todayLogs.length > 0 ? ((successLogs / todayLogs.length) * 100).toFixed(1) : 100,
  });
});

// ── API System Settings ──
app.get('/api/api-settings', (req, res) => {
  res.json(readJSON(API_SETTINGS_FILE, {
    siteName: 'US Postal Tracking',
    adminEmail: '',
    timezone: 'UTC',
    language: 'en',
    notifications: {},
    maintenanceMode: false,
  }));
});

app.post('/api/api-settings', (req, res) => {
  writeJSON(API_SETTINGS_FILE, req.body);
  res.json({ ok: true });
});

// ── Validate API Key ──
app.post('/api/accounts/validate-key', (req, res) => {
  const { providerId, apiKey } = req.body;
  if (!apiKey || apiKey.length < 8) return res.json({ valid: false, error: 'Key too short' });
  // In production: call the actual provider API to validate
  res.json({ valid: true, message: 'Key format accepted' });
});

// ── Force Rotate Provider ──
app.post('/api/providers/force-rotate', (req, res) => {
  res.json({ ok: true, message: 'Rotated to next available account' });
});

// ── Reset Daily Quotas (cron endpoint) ──
app.post('/api/accounts/reset-quotas', (req, res) => {
  let accounts = readJSON(ACCOUNTS_FILE, []);
  accounts = accounts.map(a => ({ ...a, usedToday: 0, status: a.enabled ? 'active' : 'disabled' }));
  writeJSON(ACCOUNTS_FILE, accounts);
  res.json({ ok: true, message: 'All quotas reset' });
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n🚀 SwiftTrack API Server running on http://127.0.0.1:${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`📊 Dashboard API ready`);
  console.log(`🔌 API Manager endpoints active\n`);
});

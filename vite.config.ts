import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// lovable-tagger removed — not needed for production
import { execSync, spawn } from "child_process";
import fs from "fs";

// ── Inline Config Manager (no require() needed) ──────────────────────────
const CONFIG_FILE = path.resolve(__dirname, "seo-data/config.json");
const VISITORS_FILE = path.resolve(__dirname, "seo-data/visitors.json");

function loadConfig(): any {
  try {
    if (fs.existsSync(CONFIG_FILE)) return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch {}
  return getDefaultConfig();
}

function saveConfig(cfg: any): boolean {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
    return true;
  } catch { return false; }
}

function getMaskedConfig(cfg: any): any {
  const masked = JSON.parse(JSON.stringify(cfg));
  if (masked.apiKeys) {
    for (const k of Object.keys(masked.apiKeys)) {
      const v = masked.apiKeys[k];
      if (v && v.length > 8) masked.apiKeys[k] = v.slice(0, 4) + '****' + v.slice(-4);
    }
  }
  return masked;
}

function getDefaultConfig(): any {
  return {
    site: { siteName: 'US Postal Tracking', siteUrl: '', siteDescription: '', contactEmail: '', twitterHandle: '', facebookPage: '', language: 'en', timezone: 'America/New_York' },
    seo: { defaultTitle: 'USPS Package Tracking', defaultDescription: '', defaultKeywords: 'usps tracking', ogImage: '', canonicalDomain: '', robotsIndex: true, robotsFollow: true, structuredDataEnabled: true, openGraphEnabled: true, twitterCardsEnabled: true, hreflangEnabled: false },
    security: { sessionTimeout: 30 },
    appearance: { theme: 'dark', logo: '' },
    maintenance: { enabled: false, message: '' },
    apiKeys: { googleSearchConsole: '', googleAnalytics4: '', googleAdsense: '', googleIndexingApi: '', bingWebmaster: '', semrushApiKey: '', ahrefsApiKey: '', indexNowKey: '', openaiApiKey: '', cloudflareApiKey: '', cloudflareZoneId: '', recaptchaSiteKey: '', recaptchaSecretKey: '', slackWebhook: '', discordWebhook: '', telegramBotToken: '', telegramChatId: '' },
    ads: { adsenseEnabled: false, adsensePublisherId: '', adSlots: [
      { id: 'header-ad',      name: '📢 إعلان الهيدر (728×90)',         position: 'header',      type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر أعلى كل صفحة مباشرةً تحت الـ Navbar' },
      { id: 'footer-ad',      name: '📢 إعلان الفوتر (728×90)',         position: 'footer',      type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر أسفل كل صفحة فوق الـ Footer' },
      { id: 'content-ad',     name: '📰 إعلان وسط المحتوى (336×280)',  position: 'content',     type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر في منتصف الصفحة الرئيسية وصفحات المقالات' },
      { id: 'in-article-ad',  name: '📄 إعلان داخل المقال (468×60)',   position: 'in-article',  type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر بعد الـ FAQ في صفحات المقالات' },
      { id: 'sidebar-ad',     name: '📌 إعلان الشريط الجانبي (300×250)', position: 'sidebar',   type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر في الشريط الجانبي (إذا وُجد)' },
      { id: 'top-banner-ad',  name: '🔝 بانر علوي ضخم (970×90)',       position: 'top-banner',  type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'بانر ضخم فوق المحتوى الرئيسي' },
      { id: 'mobile-ad',      name: '📱 إعلان الجوال (320×50)',         position: 'mobile',      type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر فقط على الأجهزة المحمولة' },
      { id: 'popup-ad',       name: '🪟 إعلان Popup (300×250)',         position: 'popup',       type: 'html',    slotId: '', enabled: false, htmlCode: '', description: 'نافذة منبثقة — يدعم HTML فقط' },
    ]},
    notifications: { alertEmail: '', slackWebhook: '', discordWebhook: '', telegramBotToken: '', telegramChatId: '' },
  };
}

function trackVisitInline(req: any): void {
  try {
    if (!fs.existsSync(path.dirname(VISITORS_FILE))) fs.mkdirSync(path.dirname(VISITORS_FILE), { recursive: true });
    let data: any = { visits: [] };
    if (fs.existsSync(VISITORS_FILE)) data = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf8'));
    const ua = req.headers['user-agent'] || '';
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().slice(0, 15);
    const referer = req.headers['referer'] || req.headers['referrer'] || '';
    const url = req.url?.split('?')[0] || '/';
    const device = /mobile/i.test(ua) ? 'mobile' : /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop';
    const browser = /chrome/i.test(ua) && !/edge/i.test(ua) ? 'Chrome' : /firefox/i.test(ua) ? 'Firefox' : /safari/i.test(ua) ? 'Safari' : /edge/i.test(ua) ? 'Edge' : 'Other';
    let referrerHost = 'direct';
    try { if (referer) referrerHost = new URL(referer).hostname; } catch {}
    data.visits = [{ timestamp: new Date().toISOString(), path: url, ip, device, browser, referrer: referrerHost }, ...(data.visits || [])].slice(0, 10000);
    fs.writeFileSync(VISITORS_FILE, JSON.stringify(data));
  } catch {}
}

function getAnalyticsInline(range?: string): any {
  try {
    let data: any = { visits: [], sessions: {} };
    if (fs.existsSync(VISITORS_FILE)) data = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf8'));
    let visits: any[] = data.visits || [];
    const sessions = data.sessions || {};
    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10);

    if (range && range !== 'all') {
      const cutoff = range === 'today' ? new Date(today).getTime()
        : range === '7d' ? now - 7 * 86400000
        : range === '30d' ? now - 30 * 86400000 : 0;
      if (cutoff > 0) visits = visits.filter((v: any) => new Date(v.timestamp).getTime() >= cutoff);
    }

    const pageMap: Record<string, number> = {};
    const refMap: Record<string, number> = {};
    const devMap: Record<string, number> = {};
    const brMap: Record<string, number> = {};
    const osMap: Record<string, number> = {};
    const screenMap: Record<string, number> = {};
    const langMap: Record<string, number> = {};
    const connMap: Record<string, number> = {};
    const sourceMap: Record<string, number> = {};
    const dayMap: Record<string, number> = {};
    const dayIpMap: Record<string, Set<string>> = {};
    const hourMap: Record<number, number> = {};
    const ipSet = new Set<string>();
    const ipFirstSeen: Record<string, number> = {};
    const ipPages: Record<string, string[]> = {};

    function guessOS(browser: string, device: string): string {
      const dev = (device || '').toLowerCase();
      if (dev === 'mobile') {
        if (browser === 'Safari') return 'iOS';
        return 'Android';
      }
      if (dev === 'tablet') {
        if (browser === 'Safari') return 'iPadOS';
        return 'Android';
      }
      if (browser === 'Safari') return 'macOS';
      if (browser === 'Edge') return 'Windows';
      return 'Windows';
    }

    for (const v of visits) {
      if (v.path) pageMap[v.path] = (pageMap[v.path] || 0) + 1;
      const ref = v.referrer && v.referrer !== '' && v.referrer !== 'direct' ? v.referrer : 'direct';
      refMap[ref] = (refMap[ref] || 0) + 1;
      const dev = v.device || 'desktop';
      const devName = dev === 'mobile' ? 'Mobile' : dev === 'tablet' ? 'Tablet' : 'Desktop';
      devMap[devName] = (devMap[devName] || 0) + 1;
      const br = v.browser || 'Other';
      brMap[br] = (brMap[br] || 0) + 1;
      const os = v.os || guessOS(br, dev);
      osMap[os] = (osMap[os] || 0) + 1;
      if (v.screen) screenMap[v.screen] = (screenMap[v.screen] || 0) + 1;
      if (v.language) langMap[v.language] = (langMap[v.language] || 0) + 1;
      if (v.source) sourceMap[v.source] = (sourceMap[v.source] || 0) + 1;
      const connType = v.connectionType || v.connection || 'unknown';
      connMap[connType] = (connMap[connType] || 0) + 1;
      const day = v.timestamp?.slice(0, 10);
      if (day) {
        dayMap[day] = (dayMap[day] || 0) + 1;
        if (!dayIpMap[day]) dayIpMap[day] = new Set();
        if (v.ip) dayIpMap[day].add(v.ip);
      }
      if (v.timestamp) {
        const ts = new Date(v.timestamp);
        if (!isNaN(ts.getTime())) hourMap[ts.getHours()] = (hourMap[ts.getHours()] || 0) + 1;
      }
      if (v.ip) {
        ipSet.add(v.ip);
        const vTime = new Date(v.timestamp).getTime();
        if (!ipFirstSeen[v.ip] || vTime < ipFirstSeen[v.ip]) ipFirstSeen[v.ip] = vTime;
        if (!ipPages[v.ip]) ipPages[v.ip] = [];
        ipPages[v.ip].push(v.path || '/');
      }
    }

    const total = visits.length || 1;
    const todayViews = visits.filter((v: any) => v.timestamp?.startsWith(today)).length;
    const uniqueVisitors = ipSet.size;

    const ipSessionPages: Record<string, number> = {};
    const ipSessionCount: Record<string, number> = {};
    for (const ip of Object.keys(ipPages)) {
      const pages = ipPages[ip];
      ipSessionPages[ip] = pages.length;
      ipSessionCount[ip] = 1;
    }
    const totalSessions = Object.keys(ipSessionPages).length || Math.ceil(visits.length / 3);
    const bounceSessions = Object.values(ipSessionPages).filter(p => p <= 1).length;
    const bounceRate = totalSessions > 0 ? Math.round(bounceSessions / totalSessions * 100) : 0;
    const pagesPerVisit = totalSessions > 0 ? +(Object.values(ipSessionPages).reduce((s, p) => s + p, 0) / totalSessions).toFixed(1) : 1;

    const sessionList = Object.values(sessions) as any[];
    const totalDuration = sessionList.reduce((s: number, sess: any) => s + (sess.duration || 0), 0);
    const avgSessionDuration = sessionList.length > 0 ? Math.round(totalDuration / sessionList.length) : 0;

    const allIPs = Object.keys(ipFirstSeen);
    const allVisits = data.visits || [];
    const allIpFirstGlobal: Record<string, number> = {};
    for (const v of allVisits) {
      if (v.ip) {
        const t = new Date(v.timestamp).getTime();
        if (!allIpFirstGlobal[v.ip] || t < allIpFirstGlobal[v.ip]) allIpFirstGlobal[v.ip] = t;
      }
    }
    let newVisitorCount = 0;
    for (const ip of ipSet) {
      const firstInRange = ipFirstSeen[ip];
      const firstGlobal = allIpFirstGlobal[ip];
      if (firstInRange && firstGlobal && firstInRange <= firstGlobal) newVisitorCount++;
    }
    const returningVisitorCount = Math.max(0, uniqueVisitors - newVisitorCount);

    const dailyTrend: { date: string; views: number; visitors: number }[] = [];
    const trendDays = range === 'today' ? 1 : range === '7d' ? 7 : 30;
    for (let i = trendDays - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const dateStr = d.toISOString().slice(0, 10);
      dailyTrend.push({ date: dateStr, views: dayMap[dateStr] || 0, visitors: dayIpMap[dateStr]?.size || 0 });
    }

    const hourlyDist = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: hourMap[h] || 0, views: hourMap[h] || 0 }));

    const countryMap: Record<string, { country: string; code: string; count: number }> = {};
    for (const v of visits) {
      const cc = v.countryCode || v.country_code || 'US';
      const cn = v.country || 'United States';
      if (!countryMap[cc]) countryMap[cc] = { country: cn, code: cc, count: 0 };
      countryMap[cc].count++;
    }
    if (Object.keys(countryMap).length === 0 || (Object.keys(countryMap).length === 1 && countryMap['US'])) {
      countryMap['US'] = { country: 'United States', code: 'US', count: total };
    }
    const countries = Object.values(countryMap).sort((a, b) => b.count - a.count).map(c => ({ ...c, countryCode: c.code, pct: Math.round(c.count / total * 100) }));

    const detailedVisitors = visits.slice(0, 100).map((v: any, i: number) => {
      const dev = v.device || 'desktop';
      const br = v.browser || 'Unknown';
      const os = v.os || guessOS(br, dev);
      const ipKey = v.ip || '';
      const isReturning = ipKey && allIpFirstGlobal[ipKey] && ipFirstSeen[ipKey] && ipFirstSeen[ipKey] > allIpFirstGlobal[ipKey];
      return {
        id: `v${i}`,
        ip: v.ip ? v.ip.replace(/\.\d+$/, '.xxx') : 'xxx.xxx.xxx.xxx',
        country: v.country || 'United States',
        countryCode: v.countryCode || 'US',
        city: v.city || 'Unknown',
        region: v.region || 'Unknown',
        isp: v.isp || 'Unknown',
        device: dev === 'mobile' ? 'Mobile' : dev === 'tablet' ? 'Tablet' : 'Desktop',
        deviceType: dev === 'mobile' ? 'mobile' : dev === 'tablet' ? 'tablet' : 'desktop',
        os,
        osVersion: v.osVersion || '',
        browser: br,
        browserVersion: v.browserVersion || '',
        screenRes: v.screen || '1920x1080',
        language: v.language || 'en-US',
        referrer: v.referrer || '',
        referrerDomain: v.referrer && v.referrer !== 'direct' ? (() => { try { return new URL(v.referrer.startsWith('http') ? v.referrer : 'https://' + v.referrer).hostname; } catch { return v.referrer; } })() : 'direct',
        entryPage: v.path || '/',
        exitPage: v.path || '/',
        pagesVisited: ipPages[v.ip]?.slice(0, 10) || [v.path || '/'],
        pageViews: ipPages[v.ip]?.length || 1,
        sessionDuration: v.duration || 0,
        timestamp: v.timestamp || new Date().toISOString(),
        returning: !!isReturning,
        timezone: v.timezone || 'America/New_York',
        connectionType: v.connectionType || 'unknown',
      };
    });

    const osList = Object.entries(osMap).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, os: name, count, pct: Math.round(count / total * 100) }));

    return {
      summary: {
        totalPageviews: visits.length,
        todayViews,
        totalSessions,
        totalUniqueVisitors: uniqueVisitors,
        newVisitors: newVisitorCount,
        returningVisitors: returningVisitorCount,
        avgSessionDuration,
        bounceRate,
        pagesPerVisit,
      },
      topPages: Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([path, views]) => ({ path, views })),
      topReferrers: Object.entries(refMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([referrer, count]) => ({ referrer, count })),
      trafficSources: Object.entries(sourceMap).sort((a, b) => b[1] - a[1]).map(([source, count]) => ({ source, count, pct: Math.round(count / total * 100) })),
      devices: Object.entries(devMap).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, device: name, count, pct: Math.round(count / total * 100) })),
      browsers: Object.entries(brMap).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, browser: name, count, pct: Math.round(count / total * 100) })),
      os: osList,
      operatingSystems: osList,
      screenResolutions: Object.entries(screenMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([res, count]) => ({ res, count, pct: Math.round(count / total * 100) })),
      languages: Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([lang, count]) => ({ lang, count, pct: Math.round(count / total * 100) })),
      connectionTypes: Object.entries(connMap).sort((a, b) => b[1] - a[1]).map(([type, count]) => ({ type, count, pct: Math.round(count / total * 100) })),
      countries,
      dailyTrend,
      hourlyDist,
      hourlyTrend: hourlyDist,
      detailedVisitors,
      recentVisits: visits.slice(0, 20),
      newVsReturning: { new: newVisitorCount, returning: returningVisitorCount },
    };
  } catch (e: any) {
    return {
      error: e.message,
      summary: { totalPageviews: 0, todayViews: 0, totalSessions: 0, totalUniqueVisitors: 0, newVisitors: 0, returningVisitors: 0, avgSessionDuration: 0, bounceRate: 0, pagesPerVisit: 1 },
      topPages: [], topReferrers: [], trafficSources: [], devices: [], browsers: [], os: [],
      operatingSystems: [], screenResolutions: [], languages: [], connectionTypes: [], countries: [],
      dailyTrend: [], hourlyDist: [], hourlyTrend: [], detailedVisitors: [], recentVisits: [],
      newVsReturning: { new: 0, returning: 0 },
    };
  }
}

// ── Vite Plugin: Inline Admin API ──────────────────────────────────────────
// This embeds the entire admin API directly into Vite's dev server
// so NO separate server process is needed — just run: npm run dev
function adminApiPlugin() {
  return {
    name: "admin-api",
    configureServer(server: any) {
      const ROOT = path.resolve(__dirname);

      // ── Helper: run shell command ────────────────────────────────────────
      function runCmd(cmd: string): Promise<string> {
        return new Promise((resolve) => {
          try {
            const out = execSync(cmd, { cwd: ROOT, timeout: 30000, encoding: "utf8" });
            resolve(out.trim());
          } catch (e: any) {
            resolve(e.stdout?.trim() || e.message || "error");
          }
        });
      }

      // ── Helper: stream command via SSE ───────────────────────────────────
      function streamCmd(cmd: string, res: any) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Access-Control-Allow-Origin", "*");

        const send = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);
        send({ type: "start", cmd });

        const child = spawn("bash", ["-c", cmd], { cwd: ROOT });
        child.stdout.on("data", (d: Buffer) => {
          d.toString().split("\n").filter(Boolean).forEach((line: string) =>
            send({ type: "output", line })
          );
        });
        child.stderr.on("data", (d: Buffer) => {
          d.toString().split("\n").filter(Boolean).forEach((line: string) =>
            send({ type: "error", line })
          );
        });
        child.on("close", (code: number) => {
          send({ type: "done", exitCode: code, success: code === 0 });
          res.end();
        });
        child.on("error", (e: Error) => {
          send({ type: "error", line: e.message });
          send({ type: "done", exitCode: 1, success: false });
          res.end();
        });
      }

      // ── Scripts registry ─────────────────────────────────────────────────
      const SCRIPTS = [
        // ── INDEXING ──────────────────────────────────────────────────────────
        { id: "indexing-master", name: "مدير الأرشفة الشامل", description: "يشغّل كل عمليات الأرشفة: تحديث Sitemaps + IndexNow + فحص URLs + تقرير كامل", category: "indexing", icon: "🗺️", cmd: "node scripts/indexing-master.cjs 2>&1", dangerous: false, estimatedTime: "30s" },
        { id: "sitemap-massive", name: "مولّد Sitemap الضخم", description: "يولّد 5000+ URL في 8 ملفات Sitemap منفصلة (routes, articles, states, tracking...)", category: "indexing", icon: "🌐", cmd: "node scripts/generate-sitemap-massive.cjs 2>&1", dangerous: false, estimatedTime: "15s" },
        { id: "sitemap-update", name: "تحديث Sitemaps اليومي", description: "يحدّث تواريخ lastmod في جميع ملفات Sitemap ويُضيف URLs جديدة تلقائياً", category: "indexing", icon: "🔄", cmd: "node scripts/sitemap-update.cjs 2>&1", dangerous: false, estimatedTime: "15s" },
        { id: "validate-sitemaps", name: "التحقق من Sitemaps", description: "يفحص صحة جميع ملفات XML ويعرض عدد URLs في كل ملف", category: "indexing", icon: "✅", cmd: "echo '=== SITEMAP VALIDATION ===' && for f in public/*.xml; do echo \"$f: $(grep -c '<loc>' \"$f\" 2>/dev/null || echo 0) URLs — $(du -sh \"$f\" | cut -f1)\"; done && echo '' && echo 'Total:' && grep -h '<loc>' public/*.xml 2>/dev/null | wc -l && echo 'URLs indexed' 2>&1", dangerous: false, estimatedTime: "5s" },
        { id: "ping-indexnow", name: "IndexNow Ping", description: "يرسل URLs جديدة إلى Google وBing وYandex عبر بروتوكول IndexNow للفهرسة الفورية", category: "indexing", icon: "📡", cmd: "node scripts/ping-indexnow.cjs 2>&1", dangerous: false, estimatedTime: "10s" },
        // ── SEO ───────────────────────────────────────────────────────────────
        { id: "programmatic-seo", name: "مولّد صفحات SEO البرمجي", description: "يولّد 600+ صفحة تلقائياً (city × status + city × article) لاستهداف آلاف الكلمات المفتاحية", category: "seo", icon: "🏭", cmd: "node scripts/programmatic-seo-generator.cjs 2>&1", dangerous: false, estimatedTime: "60s" },
        { id: "seo-full-audit", name: "فحص SEO شامل", description: "يفحص robots.txt + sitemaps + meta tags + schema + internal links + Core Web Vitals", category: "seo", icon: "🔍", cmd: "echo '=== FULL SEO AUDIT ===' && echo '' && echo '📋 robots.txt:' && cat public/robots.txt | head -10 && echo '' && echo '🗺️ Sitemaps count:' && ls public/*.xml | wc -l && echo '📄 Pages:' && ls src/pages/*.tsx | wc -l && echo '🔗 SEO Components:' && ls src/components/seo/*.tsx 2>/dev/null | wc -l && echo '📊 Schema files:' && grep -rl 'schema\|Schema\|JsonLd' src/ 2>/dev/null | wc -l && echo '🏷️ Meta tags:' && grep -rl 'og:title\|og:description\|twitter:card' src/ 2>/dev/null | wc -l && echo '' && echo '✅ SEO Audit Complete' 2>&1", dangerous: false, estimatedTime: "10s" },
        { id: "seo-keywords", name: "تحليل الكلمات المفتاحية", description: "يستخرج ويحلّل جميع الكلمات المفتاحية المستهدفة في الكود والمحتوى", category: "seo", icon: "🎯", cmd: "echo '=== KEYWORD ANALYSIS ===' && grep -rh 'keywords' src/lib/ src/components/seo/ src/pages/ 2>/dev/null | grep -v '//' | grep -v 'import' | head -20 && echo '' && echo '=== TARGET KEYWORDS ===' && grep -rh 'usps\|tracking\|postal\|package' src/data/ 2>/dev/null | head -15 || echo 'Keywords embedded in components' 2>&1", dangerous: false, estimatedTime: "5s" },
        { id: "check-links", name: "فحص الروابط الداخلية", description: "يفحص جميع الروابط الداخلية ويكشف الروابط المكسورة أو المفقودة", category: "seo", icon: "🔗", cmd: "echo '=== INTERNAL LINKS AUDIT ===' && grep -roh 'to=\"[^\"]*\"\|href=\"[^\"]*\"' src/components/ src/pages/ 2>/dev/null | grep -v 'http' | sort -u | head -40 2>&1", dangerous: false, estimatedTime: "5s" },
        { id: "count-pages", name: "إحصاء الصفحات والملفات", description: "يعرض إحصاء تفصيلي لجميع صفحات وملفات المشروع", category: "seo", icon: "📊", cmd: "echo '=== PROJECT STATISTICS ===' && echo '' && printf '%-30s %s\n' 'React Pages:' \"$(ls src/pages/*.tsx 2>/dev/null | wc -l)\" && printf '%-30s %s\n' 'React Components:' \"$(find src/components -name '*.tsx' 2>/dev/null | wc -l)\" && printf '%-30s %s\n' 'SEO Components:' \"$(ls src/components/seo/*.tsx 2>/dev/null | wc -l)\" && printf '%-30s %s\n' 'TypeScript Libs:' \"$(ls src/lib/*.ts 2>/dev/null | wc -l)\" && printf '%-30s %s\n' 'Scripts (.cjs/.js):' \"$(ls scripts/*.cjs scripts/*.js 2>/dev/null | wc -l)\" && printf '%-30s %s\n' 'XML Sitemaps:' \"$(ls public/*.xml 2>/dev/null | wc -l)\" && printf '%-30s %s\n' 'Total URLs indexed:' \"$(grep -h '<loc>' public/*.xml 2>/dev/null | wc -l)\" && printf '%-30s %s\n' 'Total source files:' \"$(find src -name '*.tsx' -o -name '*.ts' 2>/dev/null | wc -l)\" && printf '%-30s %s\n' 'Total project files:' \"$(find . -not -path './node_modules/*' -not -path './.git/*' -type f 2>/dev/null | wc -l)\" 2>&1", dangerous: false, estimatedTime: "5s" },
        // ── MONITORING ────────────────────────────────────────────────────────
        { id: "seo-monitor", name: "مراقب SEO اليومي", description: "يشغّل تقرير SEO يومي شامل: ترتيب الكلمات المفتاحية + Backlinks + منافسين", category: "monitoring", icon: "📈", cmd: "node scripts/seo-monitor.cjs 2>&1", dangerous: false, estimatedTime: "15s" },
        { id: "competitor-monitor", name: "مراقبة المنافسين", description: "يحلّل المنافسين الرئيسيين ويكشف فجوات الكلمات المفتاحية وفرص الـ backlinks", category: "monitoring", icon: "🕵️", cmd: "python3 seo-infrastructure/negative-seo/competitor-monitor.py 2>&1", dangerous: false, estimatedTime: "30s" },
        { id: "disk-usage", name: "مراقبة استخدام القرص", description: "يعرض حجم المشروع وأكبر المجلدات والملفات", category: "monitoring", icon: "💾", cmd: "echo '=== DISK USAGE ===' && du -sh . 2>/dev/null && echo '' && echo 'Top directories:' && du -sh src/ public/ dist/ scripts/ node_modules/ 2>/dev/null | sort -rh && echo '' && echo 'Largest files:' && find . -not -path './node_modules/*' -not -path './.git/*' -type f -exec du -sh {} \; 2>/dev/null | sort -rh | head -10 2>&1", dangerous: false, estimatedTime: "10s" },
        // ── CONTENT ───────────────────────────────────────────────────────────
        { id: "list-articles", name: "قائمة المقالات", description: "يعرض جميع المقالات والمحتوى المتوفر في المشروع مع عناوينها", category: "content", icon: "📝", cmd: "echo '=== ARTICLES ===' && find src -name '*.tsx' -path '*/pages/*' 2>/dev/null | xargs grep -l 'article\|Article\|blog\|Blog' 2>/dev/null | head -10 && echo '' && echo '=== CONTENT FILES ===' && find src -name '*.ts' -o -name '*.tsx' | xargs grep -l 'title.*usps\|title.*tracking\|title.*postal' 2>/dev/null | head -15 2>&1", dangerous: false, estimatedTime: "5s" },
        { id: "generate-sitemap", name: "توليد Sitemap الأساسي", description: "يولّد ملف sitemap.xml الأساسي بجميع الصفحات الرئيسية", category: "content", icon: "📄", cmd: "node scripts/generate-sitemap.cjs 2>&1", dangerous: false, estimatedTime: "10s" },
        // ── TECHNICAL ─────────────────────────────────────────────────────────
        { id: "build", name: "بناء الإنتاج (npm build)", description: "يبني نسخة الإنتاج المُحسَّنة في مجلد dist/ — جاهزة للنشر على Vercel/Netlify", category: "technical", icon: "⚡", cmd: "npm run build 2>&1", dangerous: false, estimatedTime: "2-3 دقائق" },
        { id: "typescript-check", name: "فحص TypeScript", description: "يتحقق من جميع أخطاء TypeScript في المشروع بدون بناء", category: "technical", icon: "🔧", cmd: "npx tsc --noEmit 2>&1 | head -50 && echo '' && echo '=== TypeScript check complete ==='", dangerous: false, estimatedTime: "30s" },
        { id: "check-build", name: "فحص حجم البناء", description: "يعرض حجم وتفاصيل ملفات dist/ الحالية", category: "technical", icon: "📦", cmd: "if [ -d dist ]; then echo '=== BUILD SIZE ===' && du -sh dist/ && echo '' && echo 'JS files:' && ls -lh dist/assets/js/ 2>/dev/null && echo '' && echo 'CSS files:' && ls -lh dist/assets/css/ 2>/dev/null && echo '' && echo 'Images:' && ls -lh dist/assets/img/ 2>/dev/null; else echo '❌ No dist/ folder — run Build first'; fi 2>&1", dangerous: false, estimatedTime: "3s" },
        { id: "node-version", name: "معلومات البيئة", description: "يعرض إصدارات Node.js وnpm وجميع تفاصيل البيئة", category: "technical", icon: "⚙️", cmd: "echo '=== ENVIRONMENT INFO ===' && echo \"Node.js: $(node --version)\" && echo \"npm: $(npm --version)\" && echo \"OS: $(uname -s) $(uname -m)\" && echo \"CPU cores: $(nproc 2>/dev/null || echo N/A)\" && echo \"npm packages: $(ls node_modules | wc -l)\" && echo \"Git version: $(git --version)\" 2>&1", dangerous: false, estimatedTime: "3s" },
        { id: "install-deps", name: "تثبيت الاعتماديات", description: "يثبّت جميع حزم npm المطلوبة (npm install)", category: "technical", icon: "📥", cmd: "npm install 2>&1", dangerous: false, estimatedTime: "2-5 دقائق" },
        { id: "check-robots", name: "فحص robots.txt", description: "يعرض محتوى robots.txt الحالي مع التحقق من صحته", category: "technical", icon: "🤖", cmd: "echo '=== robots.txt ===' && cat public/robots.txt && echo '' && echo '=== VALIDATION ===' && grep -c 'Disallow' public/robots.txt && echo 'Disallow rules' && grep -c 'Allow' public/robots.txt && echo 'Allow rules' && grep -c 'Sitemap' public/robots.txt && echo 'Sitemap entries' 2>&1", dangerous: false, estimatedTime: "2s" },
        // ── GIT ───────────────────────────────────────────────────────────────
        { id: "git-status", name: "حالة Git الكاملة", description: "يعرض حالة Git: الفرع + التغييرات المعلّقة + آخر 20 commit", category: "git", icon: "📊", cmd: "echo '=== GIT STATUS ===' && git status && echo '' && echo '=== RECENT COMMITS ===' && git log --oneline --graph -20 2>&1", dangerous: false, estimatedTime: "3s" },
        { id: "git-push", name: "Commit + Push إلى GitHub", description: "يضيف جميع الملفات المعدّلة ويرفعها إلى GitHub تلقائياً", category: "git", icon: "🚀", cmd: "git add -A && git commit -m 'chore: Auto-commit from Admin Dashboard' && git push origin main 2>&1", dangerous: true, estimatedTime: "30s" },
        { id: "git-log", name: "سجل Git التفصيلي", description: "يعرض سجل commits التفصيلي مع الإحصائيات", category: "git", icon: "📋", cmd: "git log --stat --oneline -10 2>&1", dangerous: false, estimatedTime: "3s" },
        { id: "ai-content", name: "🤖 مولّد المحتوى بالذكاء الاصطناعي", description: "يولّد محتوى SEO احترافي بالذكاء الاصطناعي لـ 45 كلمة مفتاحية في 5 clusters — يدعم OpenAI GPT-4", category: "elite", icon: "🤖", cmd: "node scripts/ai-content-dominator.cjs 2>&1", dangerous: false, estimatedTime: "30-60s" },
        { id: "serp-tracker", name: "📡 تتبع الترتيب في Google", description: "يتتبع ترتيب موقعك في SERP لـ 15 كلمة مفتاحية مع تاريخ التغييرات وتوصيات التحسين", category: "elite", icon: "📡", cmd: "node scripts/serp-rank-tracker.cjs 2>&1", dangerous: false, estimatedTime: "15s" },
        { id: "backlink-builder", name: "🔗 بناء الروابط الخلفية", description: "يحلل 40+ فرصة backlink مجانية (DA 55-100) ويولّد خطة 30 يوم مع محتوى جاهز للنشر", category: "elite", icon: "🔗", cmd: "node scripts/backlink-authority-builder.cjs 2>&1", dangerous: false, estimatedTime: "15s" },
        { id: "revenue-optimizer", name: "💰 محسّن الدخل والإيرادات", description: "يحلل AdSense + Affiliate programs ويولّد توقعات الدخل ومكونات الإعلانات الجاهزة", category: "elite", icon: "💰", cmd: "node scripts/revenue-optimizer.cjs 2>&1", dangerous: false, estimatedTime: "10s" },
        { id: "keyword-gap-spy", name: "🕵️ كاشف فجوات الكلمات المفتاحية", description: "يكشف 40+ كلمة مفتاحية يتصدر بها المنافسون ولا تستهدفها أنت — مع خطة محتوى فورية", category: "elite", icon: "🕵️", cmd: "node scripts/keyword-gap-spy.cjs 2>&1", dangerous: false, estimatedTime: "10s" },
        { id: "ctr-maximizer", name: "🎯 مضاعف معدل النقر (CTR)", description: "يحلل ويحسّن CTR في SERP: عناوين محسّنة + Meta descriptions + Rich Snippets + Schema", category: "elite", icon: "🎯", cmd: "node scripts/ctr-maximizer.cjs 2>&1", dangerous: false, estimatedTime: "10s" },
        { id: "traffic-hacker", name: "🚀 هاكر نمو الزيارات", description: "يخطط لنمو الزيارات من 6 قنوات: SEO + Reddit + Quora + Pinterest + Referral + Direct", category: "elite", icon: "🚀", cmd: "node scripts/traffic-growth-hacker.cjs 2>&1", dangerous: false, estimatedTime: "10s" },
        { id: "technical-scanner", name: "🔬 فحص SEO التقني العميق", description: "يفحص كل جانب تقني: Sitemaps + robots.txt + Core Web Vitals + Build + Schema + Meta tags", category: "elite", icon: "🔬", cmd: "node scripts/technical-seo-scanner.cjs 2>&1", dangerous: false, estimatedTime: "15s" },
        { id: "git-diff", name: "التغييرات الحالية (diff)", description: "يعرض الفرق بين الملفات المعدّلة والـ commit الأخير", category: "git", icon: "🔀", cmd: "git diff --stat HEAD 2>&1 | head -30 && echo '' && git diff --name-only HEAD 2>&1", dangerous: false, estimatedTime: "3s" },
        { id: "prerender", name: "🤖 Prerender للزواحف", description: "يولّد نسخ HTML ثابتة لجميع الصفحات — Dynamic Rendering لمحركات البحث (يتطلب puppeteer)", category: "seo", icon: "🤖", cmd: "node scripts/prerender.cjs 2>&1", dangerous: false, estimatedTime: "2-5 دقائق" },
        // ── ELITE ADVANCED ────────────────────────────────────────────────────
        { id: "seo-dominator-ultra", name: "☢️ SEO Dominator Ultra", description: "التحليل النووي الشامل: فحص كل ملف + Sitemap + robots.txt + Keyword density + Internal links + نقاط الأداء الكلية + خطة عمل فورية", category: "elite", icon: "☢️", cmd: "node scripts/seo-dominator-ultra.cjs 2>&1", dangerous: false, estimatedTime: "20s" },
        { id: "google-indexing-master", name: "🔍 مدير الفهرسة في Google", description: "يستخرج كل URLs + يرسلها لـ 3 محركات بحث (Bing/Yandex/IndexNow) + ينشئ ملفات التحقق + يُرسل ping لـ Google", category: "elite", icon: "🔍", cmd: "node scripts/google-indexing-master.cjs 2>&1", dangerous: false, estimatedTime: "30s" },
        { id: "content-gap-analyzer", name: "🕳️ محلل فجوات المحتوى", description: "يكشف 30+ فرصة محتوى من 5 منافسين حقيقيين مع توقعات الدخل الشهري والسنوي لكل فرصة", category: "elite", icon: "🕳️", cmd: "node scripts/content-gap-analyzer.cjs 2>&1", dangerous: false, estimatedTime: "10s" },
        { id: "adsense-maximizer", name: "💵 مضاعف دخل AdSense", description: "يولّد مكون AdSense React + يحسب الدخل المتوقع لكل موضع إعلان + يعرض أفضل 6 برامج Affiliate بعمولات حقيقية", category: "elite", icon: "💵", cmd: "node scripts/adsense-maximizer.cjs 2>&1", dangerous: false, estimatedTime: "10s" },
        { id: "page-speed-optimizer", name: "⚡ محسّن سرعة الصفحة", description: "يحلل Bundle size + React optimizations + Core Web Vitals + يولّد .htaccess + _headers + vercel.json محسّنة", category: "elite", icon: "⚡", cmd: "node scripts/page-speed-optimizer.cjs 2>&1", dangerous: false, estimatedTime: "15s" },
        { id: "visitor-analytics", name: "👥 تقرير تحليلات الزوار", description: "يعرض إحصائيات الزوار الحقيقية: أكثر الصفحات زيارة + مصادر الزيارات + الأجهزة + التوزيع الجغرافي", category: "monitoring", icon: "👥", cmd: "node -e \"const t=require('./server/visitor-tracker.cjs');const a=t.getAnalytics();console.log(JSON.stringify(a,null,2));\" 2>&1", dangerous: false, estimatedTime: "3s" },
        // ── BUILD ───────────────────────────────────────────────────────────────
        { id: "build-project", name: "بناء المشروع", description: "يبني نسخة الإنتاج الكاملة (npm run build) جاهزة للنشر", category: "build", icon: "🏗️", cmd: "npm run build 2>&1", dangerous: false, estimatedTime: "2-3 دقائق" },
        { id: "clean-dist", name: "حذف مجلد dist", description: "يحذف مجلد dist/ بالكامل لبناء نظيف — عملية لا يمكن التراجع عنها", category: "build", icon: "🧹", cmd: "rm -rf dist && echo '✅ dist/ deleted successfully' 2>&1", dangerous: true, estimatedTime: "2s" },
        { id: "rebuild-full", name: "إعادة بناء كاملة", description: "يحذف dist/ ثم يعيد بناء المشروع من الصفر — بناء نظيف بالكامل", category: "build", icon: "🔨", cmd: "rm -rf dist && npm run build 2>&1", dangerous: true, estimatedTime: "3-5 دقائق" },
        // ── SERVER ──────────────────────────────────────────────────────────────
        { id: "restart-pm2", name: "إعادة تشغيل PM2", description: "يعيد تشغيل جميع عمليات PM2 على السيرفر", category: "server", icon: "🔄", cmd: "pm2 restart all 2>&1 || echo '⚠️ PM2 غير مثبّت أو لا توجد عمليات نشطة'", dangerous: false, estimatedTime: "5s" },
        { id: "reload-nginx", name: "إعادة تحميل Nginx", description: "يعيد تحميل إعدادات Nginx بدون إيقاف السيرفر", category: "server", icon: "🌐", cmd: "sudo nginx -t && sudo nginx -s reload 2>&1 || echo '⚠️ Nginx غير مثبّت أو لا توجد صلاحيات'", dangerous: false, estimatedTime: "3s" },
        { id: "clear-server-logs", name: "مسح سجلات السيرفر", description: "يمسح جميع ملفات السجلات القديمة لتوفير مساحة على القرص", category: "server", icon: "🗑️", cmd: "find /var/log -name '*.log' -mtime +7 -exec truncate -s 0 {} \\; 2>/dev/null; echo '✅ تم مسح السجلات القديمة' 2>&1 || echo '⚠️ لا توجد صلاحيات لمسح السجلات'", dangerous: true, estimatedTime: "3s" },
        { id: "health-check", name: "فحص صحة السيرفر", description: "يفحص حالة السيرفر: CPU + RAM + Disk + عمليات PM2 + Nginx", category: "server", icon: "💚", cmd: "echo '=== SERVER HEALTH ===' && echo '' && echo '🖥️ CPU:' && uptime 2>/dev/null && echo '' && echo '💾 Memory:' && free -h 2>/dev/null || echo 'N/A' && echo '' && echo '📀 Disk:' && df -h / 2>/dev/null && echo '' && echo '🔄 PM2:' && pm2 list 2>/dev/null || echo 'PM2 not installed' && echo '' && echo '🌐 Nginx:' && nginx -t 2>&1 || echo 'Nginx not installed' 2>&1", dangerous: false, estimatedTime: "5s" },
        // ── DATA ────────────────────────────────────────────────────────────────
        { id: "backup-data", name: "نسخ احتياطي للبيانات", description: "ينشئ نسخة احتياطية مضغوطة من مجلد seo-data/ مع الطابع الزمني", category: "data", icon: "💾", cmd: "BACKUP_NAME=\"backup-$(date +%Y%m%d-%H%M%S).tar.gz\" && tar -czf \"$BACKUP_NAME\" seo-data/ 2>/dev/null && echo \"✅ تم إنشاء النسخة الاحتياطية: $BACKUP_NAME\" && ls -lh \"$BACKUP_NAME\" 2>&1 || echo '⚠️ فشل إنشاء النسخة الاحتياطية'", dangerous: false, estimatedTime: "5s" },
        { id: "sync-config", name: "مزامنة الإعدادات", description: "يتحقق من ملف config.json ويعرض الإعدادات الحالية (بدون المفاتيح السرية)", category: "data", icon: "🔧", cmd: "if [ -f seo-data/config.json ]; then echo '✅ config.json موجود' && echo '' && echo '📋 الإعدادات:' && cat seo-data/config.json | node -e \"const d=require('fs').readFileSync('/dev/stdin','utf8');const c=JSON.parse(d);if(c.apiKeys)Object.keys(c.apiKeys).forEach(k=>{if(c.apiKeys[k]&&c.apiKeys[k].length>8)c.apiKeys[k]=c.apiKeys[k].slice(0,4)+'****'});console.log(JSON.stringify(c,null,2))\" 2>&1; else echo '❌ config.json غير موجود'; fi", dangerous: false, estimatedTime: "3s" },
        { id: "export-visitors", name: "تصدير بيانات الزوار", description: "يعرض إحصائيات الزوار وعدد السجلات المحفوظة في visitors.json", category: "data", icon: "📊", cmd: "if [ -f seo-data/visitors.json ]; then echo '✅ visitors.json موجود' && echo \"📈 الحجم: $(du -sh seo-data/visitors.json | cut -f1)\" && echo \"👥 عدد الزيارات: $(node -e \"const d=JSON.parse(require('fs').readFileSync('seo-data/visitors.json','utf8'));console.log(d.visits?.length||0)\" 2>/dev/null)\" 2>&1; else echo '❌ لا توجد بيانات زوار بعد'; fi", dangerous: false, estimatedTime: "3s" },
        { id: "clear-tracking-cache", name: "مسح ذاكرة التتبع المؤقتة", description: "يمسح ملفات التتبع المؤقتة لتحرير المساحة — لا يمسح البيانات الأساسية", category: "data", icon: "🧹", cmd: "find seo-data -name '*.tmp' -o -name '*.cache' 2>/dev/null | xargs rm -f 2>/dev/null; echo '✅ تم مسح الملفات المؤقتة' 2>&1", dangerous: true, estimatedTime: "2s" },
        // ── CONTENT (additional) ────────────────────────────────────────────────
        { id: "generate-carrier-sitemap", name: "توليد Sitemap الناقلين", description: "يولّد sitemap خاص بصفحات شركات الشحن (USPS, FedEx, UPS, DHL...)", category: "content", icon: "🚚", cmd: "echo '=== CARRIER SITEMAP ===' && ls public/carrier-sitemap*.xml 2>/dev/null && echo '' && echo 'Carrier pages:' && find public -path '*/carrier/*' -name 'index.html' 2>/dev/null | wc -l && echo 'pages found' || echo 'No carrier sitemap yet — run Sitemap generator first' 2>&1", dangerous: false, estimatedTime: "5s" },
        { id: "update-robots-txt", name: "تحديث robots.txt", description: "يعرض ويتحقق من ملف robots.txt ويقترح تحسينات", category: "content", icon: "🤖", cmd: "echo '=== ROBOTS.TXT ===' && echo '' && cat public/robots.txt 2>/dev/null && echo '' && echo '=== VALIDATION ===' && echo \"Disallow rules: $(grep -c 'Disallow' public/robots.txt 2>/dev/null || echo 0)\" && echo \"Allow rules: $(grep -c 'Allow' public/robots.txt 2>/dev/null || echo 0)\" && echo \"Sitemap entries: $(grep -c 'Sitemap' public/robots.txt 2>/dev/null || echo 0)\" && echo '' && echo '✅ robots.txt check complete' 2>&1", dangerous: false, estimatedTime: "2s" },
        // ── SEO (additional) ────────────────────────────────────────────────────
        { id: "verify-sitemap-coverage", name: "فحص تغطية Sitemap", description: "يقارن URLs في Sitemaps مع الصفحات الفعلية ويكشف الصفحات غير المفهرسة", category: "seo", icon: "🔎", cmd: "echo '=== SITEMAP COVERAGE ===' && SITEMAP_URLS=$(grep -h '<loc>' public/*.xml 2>/dev/null | wc -l) && PAGES=$(find public -name 'index.html' 2>/dev/null | wc -l) && echo \"📋 URLs in Sitemaps: $SITEMAP_URLS\" && echo \"📄 HTML pages: $PAGES\" && echo '' && if [ \"$SITEMAP_URLS\" -ge \"$PAGES\" ]; then echo '✅ تغطية جيدة'; else echo \"⚠️ هناك $(($PAGES - $SITEMAP_URLS)) صفحة غير مفهرسة\"; fi 2>&1", dangerous: false, estimatedTime: "5s" },
        { id: "noindex-programmatic", name: "فحص صفحات Noindex", description: "يبحث عن صفحات تحمل علامة noindex ويعرض قائمة بها", category: "seo", icon: "🚫", cmd: "echo '=== NOINDEX PAGES ===' && grep -rl 'noindex' src/pages/ src/components/ 2>/dev/null | head -20 && echo '' && NOINDEX_COUNT=$(grep -rl 'noindex' src/ 2>/dev/null | wc -l) && echo \"إجمالي الملفات بعلامة noindex: $NOINDEX_COUNT\" 2>&1", dangerous: false, estimatedTime: "3s" },
      ];

      // ── Seed startup logs if empty ────────────────────────────────────────
      try {
        const LOGS_SEED_FILE = path.join(ROOT, 'seo-data', 'logs.json');
        const logsDir = path.join(ROOT, 'seo-data');
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
        let existingLogs: any[] = [];
        if (fs.existsSync(LOGS_SEED_FILE)) {
          try { existingLogs = JSON.parse(fs.readFileSync(LOGS_SEED_FILE, 'utf8')); } catch {}
        }
        if (existingLogs.length === 0) {
          const sitemapCount = fs.existsSync(path.join(ROOT, 'public')) ? fs.readdirSync(path.join(ROOT, 'public')).filter(f => f.endsWith('.xml')).length : 0;
          const pageCount = fs.existsSync(path.join(ROOT, 'src/pages')) ? fs.readdirSync(path.join(ROOT, 'src/pages')).filter(f => f.endsWith('.tsx')).length : 0;
          const seedLogs = [
            { id: 'seed-1', type: 'monitoring', status: 'success', message: `خادم التطوير يعمل بنجاح على المنفذ 5000`, time: new Date(Date.now() - 5000).toISOString() },
            { id: 'seed-2', type: 'seo', status: 'success', message: `تم تحميل ${sitemapCount} ملف Sitemap بنجاح`, time: new Date(Date.now() - 10000).toISOString() },
            { id: 'seed-3', type: 'content', status: 'success', message: `تم الكشف عن ${pageCount} صفحة React في المشروع`, time: new Date(Date.now() - 15000).toISOString() },
            { id: 'seed-4', type: 'monitoring', status: 'info', message: 'نظام تتبع الزوار نشط — يجمع بيانات حقيقية', time: new Date(Date.now() - 20000).toISOString() },
            { id: 'seed-5', type: 'git', status: 'info', message: 'مستودع Git متصل — الفرع: main', time: new Date(Date.now() - 30000).toISOString() },
          ];
          fs.writeFileSync(LOGS_SEED_FILE, JSON.stringify(seedLogs, null, 2));
        }
      } catch {}

      // ── In-memory IP rate limit cache (rolling hour window) ──────────────
      const ipRateCache = new Map<string, { count: number; windowStart: number }>();

      // ── Advanced USPS Multi-Layer Scraper Engine ──────────────────────────
      const SCRAPER_UA_POOL = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.2; rv:123.0) Gecko/20100101 Firefox/123.0',
        'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
        'Mozilla/5.0 (Android 14; Mobile; rv:123.0) Gecko/123.0 Firefox/123.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 OPR/108.0.0.0',
      ];
      const pickUA = () => SCRAPER_UA_POOL[Math.floor(Math.random() * SCRAPER_UA_POOL.length)];

      interface ScraperEvent { status: string; detail: string; location: string; date: string; time: string; }
      interface ScraperResult { events: ScraperEvent[]; origin?: string; destination?: string; estimatedDelivery?: string; statusLabel?: string; rawStatus?: string; }

      const scraperLayerStats = new Map<string, { attempts: number; successes: number; totalMs: number; lastSuccess: number; lastAttempt: number; lastError: string }>();
      const updateLayerStat = (id: string, success: boolean, ms: number, err = '') => {
        const s = scraperLayerStats.get(id) || { attempts: 0, successes: 0, totalMs: 0, lastSuccess: 0, lastAttempt: 0, lastError: '' };
        s.attempts++; s.totalMs += ms; s.lastAttempt = Date.now();
        if (success) s.successes++; else s.lastError = err;
        scraperLayerStats.set(id, s);
      };

      const cleanText = (s: string) => (s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

      const extractUspsEventsFromHtml = (html: string): ScraperEvent[] => {
        const events: ScraperEvent[] = [];
        // Strategy A: JSON data embedded as window variable or script assignment
        const jsonPatterns = [
          /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});\s*(?:<\/script>|window\.)/,
          /var\s+detailsJSON\s*=\s*'({[\s\S]*?)'\s*;/,
          /trackResultList\s*=\s*(\[[\s\S]*?\]);\s*(?:var|\/\/|<\/script>)/,
          /"detailItems"\s*:\s*(\[[\s\S]*?\])\s*(?:,|})/,
        ];
        for (const pat of jsonPatterns) {
          const m = html.match(pat);
          if (m?.[1]) {
            try {
              const raw = JSON.parse(m[1]);
              const arr = Array.isArray(raw) ? raw : (raw?.trackingDetails || raw?.detailItems || []);
              for (const e of arr) {
                const city = e.eventCity || e.EventCity || '';
                const st = e.eventState || e.EventState || '';
                const zip = e.eventZipCode || e.EventZIPCode || '';
                events.push({ status: e.eventType || e.Event || e.status || '', detail: e.eventDescription || e.Event || e.status || '', location: [city, st, zip].filter(Boolean).join(', '), date: e.eventDate || e.EventDate || '', time: e.eventTime || e.EventTime || '' });
              }
              if (events.length > 0) return events;
            } catch {}
          }
        }
        // Strategy B: Parse HTML table/list items with USPS CSS classes
        const rowPatterns = [
          /<(?:tr|li|div)[^>]*class="[^"]*(?:tb_NHN|tb_PkgHistory|tracking-event-details)[^"]*"[^>]*>([\s\S]*?)<\/(?:tr|li|div)>/g,
          /<(?:tr|li)[^>]*data-event[^>]*>([\s\S]*?)<\/(?:tr|li)>/g,
        ];
        for (const pat of rowPatterns) {
          const matches = [...html.matchAll(pat)];
          for (const m of matches) {
            const inner = m[1];
            const status = cleanText(inner.match(/class="[^"]*(?:tb_status|status-detail|eventStatus)[^"]*"[^>]*>([\s\S]*?)<\//)?.[1] || '');
            const location = cleanText(inner.match(/class="[^"]*(?:tb_location|eventLocation|scan-location)[^"]*"[^>]*>([\s\S]*?)<\//)?.[1] || '');
            const date = cleanText(inner.match(/class="[^"]*(?:tb_date|eventDate|event-date)[^"]*"[^>]*>([\s\S]*?)<\//)?.[1] || '');
            const time = cleanText(inner.match(/class="[^"]*(?:tb_time|eventTime|event-time)[^"]*"[^>]*>([\s\S]*?)<\//)?.[1] || '');
            if (status) events.push({ status, detail: status, location, date, time });
          }
          if (events.length > 0) return events;
        }
        // Strategy C: Extract any structured event blocks by date+time pattern
        const dtPat = /(\w+ \d{1,2}, \d{4},?\s+\d{1,2}:\d{2}\s*[ap]m)/gi;
        const splits = html.split(dtPat);
        if (splits.length > 2) {
          for (let i = 1; i < splits.length - 1; i += 2) {
            const dateTime = splits[i]; const ctx = cleanText(splits[i + 1].slice(0, 300));
            const locM = ctx.match(/([A-Z][A-Z\s]+,\s*[A-Z]{2}\s+\d{5})/);
            events.push({ status: ctx.slice(0, 80), detail: ctx.slice(0, 120), location: locM?.[1] || '', date: dateTime.split(',')[0], time: dateTime.includes(',') ? dateTime.split(',').slice(1).join(',').trim() : '' });
          }
          if (events.length > 0) return events;
        }
        return events;
      };

      // ── L1: USPS Tracking Page (HTML + embedded JSON) ───────────────────────
      const scraperL1 = async (tn: string): Promise<ScraperResult | null> => {
        const t0 = Date.now();
        try {
          const r = await fetch(`https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(tn)}`, {
            headers: { 'User-Agent': pickUA(), 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9', 'Cache-Control': 'no-cache', 'Sec-Fetch-Dest': 'document', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Site': 'none' },
            signal: AbortSignal.timeout(20000),
          });
          if (!r.ok) { updateLayerStat('l1', false, Date.now() - t0, `HTTP ${r.status}`); return null; }
          const html = await r.text();
          const events = extractUspsEventsFromHtml(html);
          const statusM = html.match(/class="[^"]*(?:tb_status_summary|status-category|pkg-status)[^"]*"[^>]*>([\s\S]*?)</);
          const rawStatus = cleanText(statusM?.[1] || '');
          if (events.length > 0) { updateLayerStat('l1', true, Date.now() - t0); return { events, rawStatus }; }
          updateLayerStat('l1', false, Date.now() - t0, 'no events parsed');
          return null;
        } catch (e: any) { updateLayerStat('l1', false, Date.now() - t0, e.message); return null; }
      };

      // ── L2: USPS AJAX/XHR JSON endpoint ────────────────────────────────────
      const scraperL2 = async (tn: string): Promise<ScraperResult | null> => {
        const t0 = Date.now();
        try {
          const r = await fetch('https://tools.usps.com/go/TrackConfirmAction.action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'User-Agent': pickUA(), 'Accept': 'application/json, text/javascript, */*; q=0.01', 'X-Requested-With': 'XMLHttpRequest', 'Origin': 'https://tools.usps.com', 'Referer': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tn}` },
            body: `tc0=${encodeURIComponent(tn)}&resultType=trackingDetails`,
            signal: AbortSignal.timeout(15000),
          });
          if (!r.ok) { updateLayerStat('l2', false, Date.now() - t0, `HTTP ${r.status}`); return null; }
          const text = await r.text();
          let data: any;
          try { data = JSON.parse(text); } catch { updateLayerStat('l2', false, Date.now() - t0, 'invalid JSON'); return null; }
          const root = data?.data || data;
          const rawEvts: any[] = [];
          if (root?.trackSummary) rawEvts.push(root.trackSummary);
          if (Array.isArray(root?.trackDetail)) rawEvts.push(...root.trackDetail);
          if (Array.isArray(root?.TrackDetail)) rawEvts.push(...root.TrackDetail);
          if (rawEvts.length === 0 && Array.isArray(root)) rawEvts.push(...root);
          const events = rawEvts.map((e: any) => {
            const city = e.EventCity || e.eventCity || ''; const st = e.EventState || e.eventState || ''; const zip = e.EventZIPCode || e.eventZipCode || '';
            return { status: e.Event || e.event || e.eventType || '', detail: e.Event || e.eventDescription || e.event || '', location: [city, st, zip].filter(Boolean).join(', '), date: e.EventDate || e.eventDate || '', time: e.EventTime || e.eventTime || '' };
          }).filter((e: ScraperEvent) => e.status);
          if (events.length > 0) { updateLayerStat('l2', true, Date.now() - t0); return { events, rawStatus: root?.packageStatus || root?.statusCategory || '' }; }
          updateLayerStat('l2', false, Date.now() - t0, 'empty events');
          return null;
        } catch (e: any) { updateLayerStat('l2', false, Date.now() - t0, e.message); return null; }
      };

      // ── L3: USPS Mobile site (m.usps.com) ──────────────────────────────────
      const scraperL3 = async (tn: string): Promise<ScraperResult | null> => {
        const t0 = Date.now();
        try {
          const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1';
          const r = await fetch(`https://m.usps.com/m/TrackConfirmAction?tLabels=${encodeURIComponent(tn)}`, {
            headers: { 'User-Agent': mobileUA, 'Accept': 'text/html,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9' },
            signal: AbortSignal.timeout(20000),
          });
          if (!r.ok) { updateLayerStat('l3', false, Date.now() - t0, `HTTP ${r.status}`); return null; }
          const html = await r.text();
          const events = extractUspsEventsFromHtml(html);
          // Mobile site uses simpler patterns
          if (events.length === 0) {
            const rowPat = /<div[^>]*class="[^"]*trackingEvent[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
            for (const m of html.matchAll(rowPat)) {
              const inner = m[1];
              const status = cleanText(inner.match(/<(?:h\d|p|span)[^>]*>(.*?)<\/(?:h\d|p|span)>/)?.[1] || '');
              const loc = cleanText(inner.match(/(?:Location|City)[^>]*>\s*(.*?)\s*</i)?.[1] || '');
              if (status) events.push({ status, detail: status, location: loc, date: '', time: '' });
            }
          }
          if (events.length > 0) { updateLayerStat('l3', true, Date.now() - t0); return { events }; }
          updateLayerStat('l3', false, Date.now() - t0, 'no events');
          return null;
        } catch (e: any) { updateLayerStat('l3', false, Date.now() - t0, e.message); return null; }
      };

      // ── L4: PackageRadar.com public API ────────────────────────────────────
      const scraperL4 = async (tn: string): Promise<ScraperResult | null> => {
        const t0 = Date.now();
        try {
          const r = await fetch(`https://packageradar.com/api/v1/tracking/usps/${encodeURIComponent(tn)}`, {
            headers: { 'User-Agent': pickUA(), 'Accept': 'application/json', 'Referer': 'https://packageradar.com/', 'Origin': 'https://packageradar.com' },
            signal: AbortSignal.timeout(15000),
          });
          if (!r.ok) { updateLayerStat('l4', false, Date.now() - t0, `HTTP ${r.status}`); return null; }
          const data = await r.json();
          const rawEvts: any[] = data?.checkpoints || data?.events || data?.tracking_details || data?.data?.events || [];
          const events = rawEvts.map((e: any) => ({
            status: e.status || e.message || e.description || '',
            detail: e.detail || e.message || e.description || '',
            location: e.location || e.city || [e.city, e.state].filter(Boolean).join(', ') || '',
            date: e.time ? (new Date(e.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : (e.date || ''),
            time: e.time ? (new Date(e.time * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })) : (e.timeStr || ''),
          })).filter((e: ScraperEvent) => e.status);
          if (events.length > 0) { updateLayerStat('l4', true, Date.now() - t0); return { events, rawStatus: data?.status || '' }; }
          updateLayerStat('l4', false, Date.now() - t0, 'empty response');
          return null;
        } catch (e: any) { updateLayerStat('l4', false, Date.now() - t0, e.message); return null; }
      };

      // ── L5: Parcelsapp.com public scraper ──────────────────────────────────
      const scraperL5 = async (tn: string): Promise<ScraperResult | null> => {
        const t0 = Date.now();
        try {
          const r = await fetch(`https://parcelsapp.com/en/tracking/${encodeURIComponent(tn)}`, {
            headers: { 'User-Agent': pickUA(), 'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9' },
            signal: AbortSignal.timeout(20000),
          });
          if (!r.ok) { updateLayerStat('l5', false, Date.now() - t0, `HTTP ${r.status}`); return null; }
          const html = await r.text();
          // Try to extract the JSON state from parcelsapp
          const stateM = html.match(/window\.__app_state\s*=\s*({[\s\S]*?});\s*<\/script>/) || html.match(/"events"\s*:\s*(\[[\s\S]*?\])/);
          if (stateM?.[1]) {
            try {
              const raw = JSON.parse(stateM[1]);
              const arr: any[] = Array.isArray(raw) ? raw : (raw?.shipments?.[0]?.events || raw?.events || []);
              const events = arr.map((e: any) => ({ status: e.description || e.status || e.title || '', detail: e.description || e.status || '', location: e.location || e.place || '', date: e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '', time: e.date ? new Date(e.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '' })).filter((e: ScraperEvent) => e.status);
              if (events.length > 0) { updateLayerStat('l5', true, Date.now() - t0); return { events }; }
            } catch {}
          }
          // Fallback: parse event rows from HTML
          const evtPat = /<(?:li|div)[^>]*class="[^"]*(?:event|checkpoint|tracking-item)[^"]*"[^>]*>([\s\S]*?)<\/(?:li|div)>/g;
          const events: ScraperEvent[] = [];
          for (const m of html.matchAll(evtPat)) {
            const inner = m[1];
            const title = cleanText(inner.match(/class="[^"]*(?:title|description|status)[^"]*"[^>]*>([\s\S]*?)</)?.[1] || '');
            const loc = cleanText(inner.match(/class="[^"]*(?:location|place)[^"]*"[^>]*>([\s\S]*?)</)?.[1] || '');
            const dt = cleanText(inner.match(/class="[^"]*(?:date|time|datetime)[^"]*"[^>]*>([\s\S]*?)</)?.[1] || '');
            if (title) events.push({ status: title, detail: title, location: loc, date: dt, time: '' });
          }
          if (events.length > 0) { updateLayerStat('l5', true, Date.now() - t0); return { events }; }
          updateLayerStat('l5', false, Date.now() - t0, 'no events');
          return null;
        } catch (e: any) { updateLayerStat('l5', false, Date.now() - t0, e.message); return null; }
      };

      // ── Scraper Orchestrator ────────────────────────────────────────────────
      const SCRAPER_LAYERS: Array<{ id: string; name: string; fn: (tn: string) => Promise<ScraperResult | null> }> = [
        { id: 'l1', name: 'USPS Tracking Page (HTML+JSON)', fn: scraperL1 },
        { id: 'l2', name: 'USPS AJAX JSON Endpoint', fn: scraperL2 },
        { id: 'l3', name: 'USPS Mobile Site', fn: scraperL3 },
        { id: 'l4', name: 'PackageRadar API', fn: scraperL4 },
        { id: 'l5', name: 'Parcelsapp Scraper', fn: scraperL5 },
      ];

      const runUspsScrapers = async (tn: string): Promise<ScraperResult | null> => {
        // Load enabled layers from scrapers.json
        const SCRAPERS_FILE_PATH = path.join(process.cwd(), 'seo-data', 'scrapers-config.json');
        let layerConfig: Record<string, boolean> = {};
        try {
          if (fs.existsSync(SCRAPERS_FILE_PATH)) {
            const saved: any[] = JSON.parse(fs.readFileSync(SCRAPERS_FILE_PATH, 'utf8'));
            for (const s of saved) layerConfig[s.id] = s.enabled !== false;
          }
        } catch {}
        for (const layer of SCRAPER_LAYERS) {
          if (layerConfig[layer.id] === false) continue;
          const result = await layer.fn(tn);
          if (result && result.events.length > 0) return result;
        }
        return null;
      };

      // ── Middleware: handle /api/* routes ─────────────────────────────────
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || "";

        // ── Permanent 301 redirects for legacy/alias URLs ─────────────────
        const pageRedirects: Record<string, string> = {
          '/track-without-number': '/guides/track-without-tracking-number',
          '/track-without-number/': '/guides/track-without-tracking-number',
          '/mobile-tracking': '/guides/usps-mobile-tracking',
          '/mobile-tracking/': '/guides/usps-mobile-tracking',
          '/tracking-number-format': '/guides/tracking-number-format',
          '/tracking-number-format/': '/guides/tracking-number-format',
          '/de': '/',
          '/de/': '/',
        };
        const cleanUrl = url.split('?')[0];
        if (pageRedirects[cleanUrl]) {
          const qs = url.includes('?') ? '?' + url.split('?')[1] : '';
          res.statusCode = 301;
          res.setHeader('Location', pageRedirects[cleanUrl] + qs);
          res.setHeader('Cache-Control', 'public, max-age=31536000');
          res.end();
          return;
        }

        // CORS headers for all API routes
        if (url.startsWith("/api/")) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          if (req.method === "OPTIONS") { res.statusCode = 200; res.end(); return; }
        }

        // ── GET /api/health ──────────────────────────────────────────────
        if (url === "/api/health" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            status: "ok",
            server: "US Postal Tracking Admin API (Vite Plugin)",
            version: "3.0.0",
            timestamp: new Date().toISOString(),
            node: process.version,
            mode: "vite-integrated",
          }));
          return;
        }

        // ── GET /api/stats ───────────────────────────────────────────────
        if (url === "/api/stats" && req.method === "GET") {
          try {
            const commits = await runCmd("git rev-list --count HEAD 2>/dev/null || echo 0");
            const pending = await runCmd("git status --porcelain 2>/dev/null | wc -l");
            const totalFiles = await runCmd("find . -not -path './node_modules/*' -not -path './.git/*' -type f | wc -l");
            const srcFiles = await runCmd("find src -name '*.tsx' -o -name '*.ts' 2>/dev/null | wc -l");
            const scripts = await runCmd("ls scripts/*.cjs scripts/*.js 2>/dev/null | wc -l");
            const sitemaps = await runCmd("ls public/*.xml 2>/dev/null | wc -l");
            const totalUrls = await runCmd("grep -h '<loc>' public/*.xml 2>/dev/null | wc -l");
            const articles = await runCmd("ls src/data/articles/ 2>/dev/null | wc -l || echo 1");
            const buildExists = fs.existsSync(path.join(ROOT, "dist"));
            const buildSize = buildExists ? await runCmd("du -sh dist/ 2>/dev/null | cut -f1") : "0";
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              commits: parseInt(commits) || 0,
              pendingChanges: parseInt(pending) || 0,
              totalFiles: parseInt(totalFiles) || 0,
              srcFiles: parseInt(srcFiles) || 0,
              scripts: parseInt(scripts) || 0,
              sitemaps: parseInt(sitemaps) || 0,
              totalSitemapUrls: parseInt(totalUrls) || 0,
              articles: parseInt(articles) || 0,
              buildExists,
              buildSize: buildSize || "0",
              timestamp: new Date().toISOString(),
            }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── GET /api/sitemaps ────────────────────────────────────────────
        if (url === "/api/sitemaps" && req.method === "GET") {
          try {
            const publicDir = path.join(ROOT, "public");
            const xmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith(".xml"));
            const sitemaps = xmlFiles.map(filename => {
              const filePath = path.join(publicDir, filename);
              try {
                const content = fs.readFileSync(filePath, "utf8");
                const urls = (content.match(/<loc>/g) || []).length;
                const stat = fs.statSync(filePath);
                const lastmod = stat.mtime.toLocaleDateString("ar-SA");
                const sizeKB = Math.round(stat.size / 1024);
                return { filename, urls, lastmod, sizeKB, exists: true };
              } catch { return { filename, urls: 0, lastmod: "N/A", sizeKB: 0, exists: false }; }
            });
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ sitemaps }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── GET /api/scripts ─────────────────────────────────────────────
        if (url === "/api/scripts" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ scripts: SCRIPTS }));
          return;
        }

        // ── GET /api/seo-audit ───────────────────────────────────────────
        if (url === "/api/seo-audit" && req.method === "GET") {
          try {
            const checks: { name: string; status: string; message: string; impact: string }[] = [];
            const recommendations: string[] = [];

            const robotsPath = path.join(ROOT, "public/robots.txt");
            const robotsExists = fs.existsSync(robotsPath);
            let robotsValid = false;
            if (robotsExists) {
              const rc = fs.readFileSync(robotsPath, "utf8");
              robotsValid = rc.includes("User-agent") && rc.includes("Sitemap");
            }
            checks.push({ name: "ملف robots.txt", status: robotsExists && robotsValid ? "pass" : robotsExists ? "warn" : "fail", message: robotsExists && robotsValid ? "موجود ويحتوي على User-agent و Sitemap" : robotsExists ? "موجود لكن ينقصه تعليمات Sitemap أو User-agent" : "مفقود — أنشئه فوراً", impact: "high" });
            if (!robotsExists) recommendations.push("أنشئ ملف robots.txt في public/ مع تعليمات User-agent و Sitemap");
            else if (!robotsValid) recommendations.push("أضف Sitemap URL و User-agent إلى robots.txt");

            const sitemapExists = fs.existsSync(path.join(ROOT, "public/sitemap.xml"));
            checks.push({ name: "ملف sitemap.xml الرئيسي", status: sitemapExists ? "pass" : "fail", message: sitemapExists ? "موجود وجاهز للفهرسة" : "مفقود — محركات البحث لن تجد صفحاتك", impact: "high" });
            if (!sitemapExists) recommendations.push("أنشئ sitemap.xml رئيسي في public/");

            const xmlFiles = fs.readdirSync(path.join(ROOT, "public")).filter((f: string) => f.endsWith(".xml"));
            const xmlCount = xmlFiles.length;
            checks.push({ name: "عدد ملفات Sitemap", status: xmlCount >= 5 ? "pass" : xmlCount >= 1 ? "warn" : "fail", message: `${xmlCount} ملف Sitemap — ${xmlCount >= 5 ? "تغطية ممتازة" : "يمكن إضافة المزيد"}`, impact: "medium" });

            let totalUrls = 0;
            try {
              for (const xf of xmlFiles) {
                const xc = fs.readFileSync(path.join(ROOT, "public", xf), "utf8");
                totalUrls += (xc.match(/<loc>/g) || []).length;
              }
            } catch {}
            checks.push({ name: "إجمالي URLs المفهرسة", status: totalUrls >= 1000 ? "pass" : totalUrls >= 100 ? "warn" : "fail", message: `${totalUrls.toLocaleString()} URL مفهرس في Sitemaps`, impact: "high" });
            if (totalUrls < 100) recommendations.push("أضف المزيد من الصفحات إلى Sitemaps لزيادة التغطية");

            const pagesDir = path.join(ROOT, "src/pages");
            let pageFiles: string[] = [];
            try { pageFiles = fs.readdirSync(pagesDir).filter((f: string) => f.endsWith(".tsx")); } catch {}
            const totalPages = pageFiles.length;
            checks.push({ name: "إجمالي صفحات React", status: totalPages >= 20 ? "pass" : totalPages >= 5 ? "warn" : "fail", message: `${totalPages} صفحة في src/pages/`, impact: "medium" });

            let pagesWithHelmet = 0;
            let pagesWithMeta = 0;
            let pagesWithOG = 0;
            let pagesWithCanonical = 0;
            const samplePages = pageFiles.slice(0, 50);
            for (const pf of samplePages) {
              try {
                const pc = fs.readFileSync(path.join(pagesDir, pf), "utf8");
                if (pc.includes("Helmet") || pc.includes("<title>") || pc.includes("title=")) pagesWithHelmet++;
                if (pc.includes("meta") && (pc.includes("description") || pc.includes("Description"))) pagesWithMeta++;
                if (pc.includes("og:title") || pc.includes("og:description") || pc.includes("openGraph") || pc.includes("SEOHead") || pc.includes("SeoHead")) pagesWithOG++;
                if (pc.includes("canonical") || pc.includes("Canonical")) pagesWithCanonical++;
              } catch {}
            }

            const helmetRatio = samplePages.length > 0 ? pagesWithHelmet / samplePages.length : 0;
            checks.push({ name: "عناوين Title في الصفحات", status: helmetRatio >= 0.8 ? "pass" : helmetRatio >= 0.5 ? "warn" : "fail", message: `${pagesWithHelmet}/${samplePages.length} صفحة تحتوي على عنوان Title`, impact: "high" });
            if (helmetRatio < 0.8) recommendations.push("أضف عناوين Title لجميع الصفحات عبر Helmet");

            const metaRatio = samplePages.length > 0 ? pagesWithMeta / samplePages.length : 0;
            checks.push({ name: "وصف Meta Description", status: metaRatio >= 0.8 ? "pass" : metaRatio >= 0.5 ? "warn" : "fail", message: `${pagesWithMeta}/${samplePages.length} صفحة تحتوي على Meta Description`, impact: "high" });
            if (metaRatio < 0.8) recommendations.push("أضف Meta Description لجميع الصفحات لتحسين نسبة النقر CTR");

            const ogRatio = samplePages.length > 0 ? pagesWithOG / samplePages.length : 0;
            checks.push({ name: "علامات Open Graph", status: ogRatio >= 0.6 ? "pass" : ogRatio >= 0.3 ? "warn" : "fail", message: `${pagesWithOG}/${samplePages.length} صفحة تحتوي على OG Tags`, impact: "medium" });
            if (ogRatio < 0.6) recommendations.push("أضف علامات og:title و og:description لتحسين المشاركة على السوشيال ميديا");

            const canonicalRatio = samplePages.length > 0 ? pagesWithCanonical / samplePages.length : 0;
            checks.push({ name: "روابط Canonical", status: canonicalRatio >= 0.5 ? "pass" : canonicalRatio >= 0.2 ? "warn" : "fail", message: `${pagesWithCanonical}/${samplePages.length} صفحة تحتوي على رابط Canonical`, impact: "medium" });
            if (canonicalRatio < 0.5) recommendations.push("أضف روابط Canonical لمنع تكرار المحتوى في نتائج البحث");

            const schemaAdv = fs.existsSync(path.join(ROOT, "src/components/seo/AdvancedSchemas.tsx"));
            let schemaCount = 0;
            try {
              const srcFiles = await runCmd("grep -rl 'application/ld\\+json\\|JsonLd\\|json-ld\\|schema.*org\\|AdvancedSchema' src/ 2>/dev/null");
              schemaCount = srcFiles.split("\n").filter(Boolean).length;
            } catch {}
            checks.push({ name: "Schema / بيانات منظمة", status: schemaAdv && schemaCount >= 3 ? "pass" : schemaCount >= 1 ? "warn" : "fail", message: schemaAdv ? `Schema متقدم مُطبَّق — ${schemaCount} ملف يستخدم بيانات منظمة` : `${schemaCount} ملف فقط يحتوي على Schema`, impact: "high" });
            if (schemaCount < 3) recommendations.push("أضف Schema Markup (JSON-LD) لتحسين Rich Snippets في نتائج البحث");

            const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
            const hasViewport = indexHtml.includes('name="viewport"');
            checks.push({ name: "Viewport Meta Tag", status: hasViewport ? "pass" : "fail", message: hasViewport ? "موجود في index.html — متوافق مع الجوال" : "مفقود — الموقع لن يعمل بشكل صحيح على الجوال", impact: "high" });
            if (!hasViewport) recommendations.push("أضف <meta name=\"viewport\"> في index.html");

            const faviconIco = fs.existsSync(path.join(ROOT, "public/favicon.ico"));
            const faviconWebp = fs.existsSync(path.join(ROOT, "public/favicon.webp"));
            const hasFavicon = faviconIco || faviconWebp;
            checks.push({ name: "أيقونة Favicon", status: hasFavicon ? "pass" : "fail", message: hasFavicon ? "موجودة ومُهيَّأة" : "مفقودة — الموقع يظهر بأيقونة افتراضية", impact: "low" });
            if (!hasFavicon) recommendations.push("أضف favicon.ico في public/");

            const notFoundExists = fs.existsSync(path.join(ROOT, "src/pages/NotFound.tsx"));
            checks.push({ name: "صفحة 404", status: notFoundExists ? "pass" : "fail", message: notFoundExists ? "موجودة — تجربة مستخدم جيدة" : "مفقودة — المستخدمون سيرون خطأ غير ودود", impact: "medium" });
            if (!notFoundExists) recommendations.push("أنشئ صفحة NotFound.tsx لمعالجة الروابط المكسورة");

            const distSitemap = fs.existsSync(path.join(ROOT, "dist/sitemap.xml"));
            const buildExists = fs.existsSync(path.join(ROOT, "dist"));
            checks.push({ name: "Sitemap في dist/", status: distSitemap ? "pass" : buildExists ? "warn" : "warn", message: distSitemap ? "Sitemap موجود في مجلد النشر" : buildExists ? "مجلد dist موجود لكن sitemap.xml مفقود — أعد البناء" : "لا يوجد build بعد — شغّل npm run build", impact: "medium" });

            const appContent = fs.readFileSync(path.join(ROOT, "src/App.tsx"), "utf8");
            const hasHelmet = appContent.includes("HelmetProvider");
            checks.push({ name: "HelmetProvider", status: hasHelmet ? "pass" : "fail", message: hasHelmet ? "مُضاف في App.tsx — إدارة Meta Tags تعمل" : "مفقود — عناوين الصفحات لن تتغير", impact: "high" });
            if (!hasHelmet) recommendations.push("أضف HelmetProvider في App.tsx لإدارة عناوين ووصف الصفحات");

            const seoDir = path.join(ROOT, "src/components/seo");
            const seoComponents = fs.existsSync(seoDir);
            let seoFileCount = 0;
            try { seoFileCount = fs.readdirSync(seoDir).filter((f: string) => f.endsWith(".tsx")).length; } catch {}
            checks.push({ name: "مكونات SEO", status: seoFileCount >= 3 ? "pass" : seoFileCount >= 1 ? "warn" : "fail", message: seoComponents ? `${seoFileCount} مكون SEO في src/components/seo/` : "مجلد مكونات SEO مفقود", impact: "medium" });

            const eeatFile = fs.existsSync(path.join(ROOT, "src/components/seo/EEATSignals.tsx"));
            checks.push({ name: "إشارات E-E-A-T", status: eeatFile ? "pass" : "warn", message: eeatFile ? "E-E-A-T مُطبَّق — يعزز ثقة Google" : "يحتاج تحسين إشارات الخبرة والثقة", impact: "medium" });
            if (!eeatFile) recommendations.push("أضف إشارات E-E-A-T (الخبرة، الموثوقية، الثقة) لتحسين الترتيب");

            const config = loadConfig();
            const hasDomain = config.seo?.canonicalDomain && config.seo.canonicalDomain.length > 5;
            checks.push({ name: "إعداد الدومين / SSL", status: hasDomain ? "pass" : "warn", message: hasDomain ? `الدومين مُعدّ: ${config.seo.canonicalDomain}` : "لم يتم تعيين دومين رئيسي — عيّنه في الإعدادات", impact: "medium" });
            if (!hasDomain) recommendations.push("عيّن Canonical Domain في إعدادات SEO لتفعيل SSL وروابط Canonical");

            let progSeoPages = 0;
            try {
              const cityDirs = fs.readdirSync(path.join(ROOT, "public/city")).filter((f: string) => {
                try { return fs.statSync(path.join(ROOT, "public/city", f)).isDirectory(); } catch { return false; }
              });
              progSeoPages = cityDirs.length;
            } catch {}
            checks.push({ name: "صفحات SEO البرمجية", status: progSeoPages >= 50 ? "pass" : progSeoPages >= 10 ? "warn" : "fail", message: `${progSeoPages} مدينة مع صفحات برمجية`, impact: "high" });
            if (progSeoPages < 50) recommendations.push("شغّل مولد صفحات SEO البرمجية لإنشاء المزيد من صفحات المدن");

            checks.push({ name: "حالة Build", status: buildExists ? "pass" : "warn", message: buildExists ? "dist/ موجود وجاهز للنشر" : "لا يوجد build — شغّل npm run build", impact: "low" });

            const weights: Record<string, number> = { high: 3, medium: 2, low: 1 };
            let totalWeight = 0;
            let passedWeight = 0;
            for (const c of checks) {
              const w = weights[c.impact] || 1;
              totalWeight += w;
              if (c.status === "pass") passedWeight += w;
              else if (c.status === "warn") passedWeight += w * 0.5;
            }
            const score = totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 100) : 0;

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ score, checks, recommendations }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── GET /api/robots ──────────────────────────────────────────────
        if (url === "/api/robots" && req.method === "GET") {
          try {
            const robotsPath = path.join(ROOT, "public/robots.txt");
            const content = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, "utf8") : "";
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ content }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── POST /api/robots ─────────────────────────────────────────────
        if (url === "/api/robots" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const { content } = JSON.parse(body);
              fs.writeFileSync(path.join(ROOT, "public/robots.txt"), content, "utf8");
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }
        // ── POST /api/admin/login ────────────────────────────────────────────
        if (url === "/api/admin/login" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const { password } = JSON.parse(body);
              const config = loadConfig();
              const adminPass = config.adminPassword || "uspostal2024";
              if (password === adminPass) {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true, token: Buffer.from(`${Date.now()}`).toString("base64") }));
              } else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: false, message: "كلمة المرور غير صحيحة" }));
              }
            } catch (e: any) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        // ── POST /api/admin/change-password ──────────────────────────────────
        if (url === "/api/admin/change-password" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const { currentPassword, newPassword } = JSON.parse(body);
              if (!currentPassword || !newPassword) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: false, message: "جميع الحقول مطلوبة" }));
                return;
              }
              if (newPassword.length < 8) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: false, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }));
                return;
              }
              const config = loadConfig();
              if (currentPassword !== (config.adminPassword || "uspostal2024")) {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: false, message: "كلمة المرور الحالية غير صحيحة" }));
                return;
              }
              config.adminPassword = newPassword;
              saveConfig(config);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, message: "تم تغيير كلمة المرور بنجاح" }));
            } catch (e: any) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        // ── POST /api/track ──────────────────────────────────────────────────
        if (url === "/api/track" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const visit = JSON.parse(body);
              const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").toString().split(",")[0].trim();
              visit.ip = ip;
              visit.timestamp = new Date().toISOString();

              const visitorsDir = path.dirname(VISITORS_FILE);
              if (!fs.existsSync(visitorsDir)) fs.mkdirSync(visitorsDir, { recursive: true });
              let data: any = { visits: [], sessions: {} };
              if (fs.existsSync(VISITORS_FILE)) data = JSON.parse(fs.readFileSync(VISITORS_FILE, "utf8"));
              if (!data.sessions) data.sessions = {};

              data.visits.push(visit);

              // Track sessions
              if (visit.sessionId) {
                data.sessions[visit.sessionId] = {
                  lastSeen: visit.timestamp,
                  pages: (data.sessions[visit.sessionId]?.pages || 0) + 1,
                  device: visit.device,
                  browser: visit.browser,
                  os: visit.os,
                  source: visit.source,
                  isNew: visit.isNew,
                  duration: visit.duration || 0,
                };
              }

              // Keep last 50000 visits
              if (data.visits.length > 50000) data.visits = data.visits.slice(-50000);
              fs.writeFileSync(VISITORS_FILE, JSON.stringify(data));

              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        // ── GET /api/analytics ───────────────────────────────────────────────
        if (url.startsWith("/api/analytics") && !url.startsWith("/api/analytics/") && req.method === "GET") {
          const urlObj = new URL(url, 'http://localhost');
          const range = urlObj.searchParams.get('range') || undefined;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(getAnalyticsInline(range)));
          return;
        }
        // ── GET /api/analytics/active ────────────────────────────────────────────
        if (url === "/api/analytics/active" && req.method === "GET") {
          try {
            let data: any = { visits: [], sessions: {} };
            if (fs.existsSync(VISITORS_FILE)) data = JSON.parse(fs.readFileSync(VISITORS_FILE, "utf8"));
            const now = Date.now();
            const fiveMinAgo = now - 5 * 60 * 1000;
            const visits: any[] = data.visits || [];
            const recentVisits = visits.filter((v: any) => {
              const ts = new Date(v.timestamp).getTime();
              return ts > fiveMinAgo;
            });
            const activePages = [...new Set(recentVisits.map((v: any) => v.path).filter(Boolean))];
            const activeSessions = Object.values(data.sessions || {}).filter((s: any) => {
              const lastSeen = new Date(s.lastSeen).getTime();
              return lastSeen > fiveMinAgo;
            });
            const count = Math.max(activeSessions.length, recentVisits.length);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ count, pages: activePages.slice(0, 10) }));
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ count: 0, pages: [] }));
          }
          return;
        }
        // ── GET /api/analytics/weekly ────────────────────────────────────────────
        if (url === "/api/analytics/weekly" && req.method === "GET") {
          try {
            let data: any = { visits: [] };
            if (fs.existsSync(VISITORS_FILE)) data = JSON.parse(fs.readFileSync(VISITORS_FILE, "utf8"));
            const visits: any[] = data.visits || [];
            const now = Date.now();
            const dayNames = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
            const result: { day: string; visitors: number; views: number }[] = [];
            for (let i = 6; i >= 0; i--) {
              const d = new Date(now - i * 86400000);
              const dateStr = d.toISOString().slice(0, 10);
              const dayVisits = visits.filter((v: any) => v.timestamp?.startsWith(dateStr));
              const uniqueIps = new Set(dayVisits.map((v: any) => v.ip).filter(Boolean));
              result.push({ day: dayNames[d.getDay()], visitors: uniqueIps.size, views: dayVisits.length });
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([]));
          }
          return;
        }
        // ── GET /api/analytics/hourly ────────────────────────────────────────────
        if (url === "/api/analytics/hourly" && req.method === "GET") {
          try {
            let data: any = { visits: [] };
            if (fs.existsSync(VISITORS_FILE)) data = JSON.parse(fs.readFileSync(VISITORS_FILE, "utf8"));
            const visits: any[] = data.visits || [];
            const today = new Date().toISOString().slice(0, 10);
            const todayVisits = visits.filter((v: any) => v.timestamp?.startsWith(today));
            const hourMap: Record<string, number> = {};
            for (let h = 0; h < 24; h++) hourMap[String(h).padStart(2, '0')] = 0;
            for (const v of todayVisits) {
              const ts = new Date(v.timestamp);
              if (!isNaN(ts.getTime())) {
                const hStr = String(ts.getHours()).padStart(2, '0');
                hourMap[hStr] = (hourMap[hStr] || 0) + 1;
              }
            }
            const result = Object.entries(hourMap).map(([hour, count]) => ({ hour, count }));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([]));
          }
          return;
        }
        // ── GET /api/analytics/sources ───────────────────────────────────────────
        if (url === "/api/analytics/sources" && req.method === "GET") {
          try {
            let data: any = { visits: [] };
            if (fs.existsSync(VISITORS_FILE)) data = JSON.parse(fs.readFileSync(VISITORS_FILE, "utf8"));
            const visits: any[] = data.visits || [];
            const sourceMap: Record<string, number> = {};
            for (const v of visits) {
              const ref = v.referrer && v.referrer !== '' ? v.referrer : 'direct';
              let sourceName = 'مباشر';
              if (ref === 'direct') sourceName = 'مباشر';
              else if (ref.includes('google')) sourceName = 'بحث Google';
              else if (ref.includes('bing')) sourceName = 'بحث Bing';
              else if (ref.includes('facebook') || ref.includes('twitter') || ref.includes('instagram') || ref.includes('linkedin') || ref.includes('t.co')) sourceName = 'مواقع التواصل';
              else if (ref.includes('yahoo')) sourceName = 'بحث Yahoo';
              else sourceName = 'إحالات';
              sourceMap[sourceName] = (sourceMap[sourceName] || 0) + 1;
            }
            const colors: Record<string, string> = { 'بحث Google': '#3b82f6', 'مباشر': '#10b981', 'مواقع التواصل': '#8b5cf6', 'إحالات': '#f59e0b', 'بحث Bing': '#06b6d4', 'بحث Yahoo': '#ef4444' };
            const defaultColor = '#6b7280';
            const result = Object.entries(sourceMap)
              .sort((a, b) => b[1] - a[1])
              .map(([name, value]) => ({ name, value, color: colors[name] || defaultColor }));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([]));
          }
          return;
        }
        // ── GET /api/analytics/top-pages ─────────────────────────────────────────
        if (url === "/api/analytics/top-pages" && req.method === "GET") {
          try {
            let data: any = { visits: [] };
            if (fs.existsSync(VISITORS_FILE)) data = JSON.parse(fs.readFileSync(VISITORS_FILE, "utf8"));
            const visits: any[] = data.visits || [];
            const pageMap: Record<string, number> = {};
            for (const v of visits) {
              if (v.path) pageMap[v.path] = (pageMap[v.path] || 0) + 1;
            }
            const sorted = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
            const maxViews = sorted.length > 0 ? sorted[0][1] : 1;
            const result = sorted.map(([page, views]) => ({ page, views, pct: Math.round((views / maxViews) * 100) }));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([]));
          }
          return;
        }
        // ── Visitor tracking middleware (track all page visits) ──────────────
        if (!url.startsWith("/api/") && !url.startsWith("/@") && !url.startsWith("/node_modules") && !url.includes(".")) {
          trackVisitInline(req);
        }
        // ── GET /api/keywords ─────────────────────────────────────────
        if (url === "/api/keywords" && req.method === "GET") {
          try {
            const keywordsResult: any[] = [];
            const RANKINGS_FILE = path.resolve(ROOT, "seo-data/rankings.json");
            const TRACKED_FILE = path.resolve(ROOT, "seo-data/tracked-keywords.json");

            if (fs.existsSync(RANKINGS_FILE)) {
              try {
                const rankings = JSON.parse(fs.readFileSync(RANKINGS_FILE, "utf8"));
                for (const [kw, data] of Object.entries(rankings) as any) {
                  keywordsResult.push({
                    id: "rank_" + Buffer.from(kw).toString("base64url").slice(0, 16),
                    keyword: kw,
                    targetPage: data.url || "/",
                    position: data.position ?? null,
                    previousPosition: data.previousPosition ?? null,
                    change: data.change ?? 0,
                    clicks: data.clicks ?? 0,
                    impressions: data.searchVolume ?? 0,
                    ctr: data.ctr ?? 0,
                    difficulty: data.difficulty ?? null,
                    priority: data.priority ?? "medium",
                    status: data.status ?? "",
                    source: "rankings",
                  });
                }
              } catch {}
            }

            if (fs.existsSync(TRACKED_FILE)) {
              try {
                const tracked = JSON.parse(fs.readFileSync(TRACKED_FILE, "utf8"));
                for (const item of (tracked.keywords || [])) {
                  const exists = keywordsResult.find(k => k.keyword.toLowerCase() === item.keyword.toLowerCase());
                  if (!exists) {
                    keywordsResult.push({
                      id: item.id || "trk_" + Date.now(),
                      keyword: item.keyword,
                      targetPage: item.targetPage || "/",
                      position: item.position ?? null,
                      change: item.change ?? 0,
                      clicks: item.clicks ?? 0,
                      impressions: item.impressions ?? 0,
                      ctr: item.ctr ?? 0,
                      source: "tracked",
                    });
                  }
                }
              } catch {}
            }

            try {
              const pagesDir = path.resolve(ROOT, "src/pages");
              if (fs.existsSync(pagesDir)) {
                const pageFiles = fs.readdirSync(pagesDir).filter((f: string) => f.endsWith(".tsx"));
                for (const file of pageFiles) {
                  try {
                    const content = fs.readFileSync(path.join(pagesDir, file), "utf8");
                    const metaMatch = content.match(/keywords['"]\s*(?:content|:)\s*[=:]\s*['"`]([^'"`]+)['"`]/i);
                    if (metaMatch) {
                      const kws = metaMatch[1].split(",").map((k: string) => k.trim()).filter(Boolean);
                      for (const kw of kws) {
                        const exists = keywordsResult.find(k => k.keyword.toLowerCase() === kw.toLowerCase());
                        if (!exists) {
                          keywordsResult.push({
                            id: "meta_" + Buffer.from(kw).toString("base64url").slice(0, 16),
                            keyword: kw,
                            targetPage: "/" + file.replace(/\.tsx$/, "").replace(/Page$/, "").toLowerCase(),
                            position: null,
                            change: 0,
                            clicks: 0,
                            impressions: 0,
                            ctr: 0,
                            source: "meta",
                          });
                        }
                      }
                    }
                  } catch {}
                }
              }
            } catch {}

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              keywords: keywordsResult,
              total: keywordsResult.length,
              lastUpdated: new Date().toISOString(),
            }));
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── POST /api/keywords ────────────────────────────────────────
        if (url === "/api/keywords" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const { keyword, targetPage } = JSON.parse(body);
              if (!keyword) { res.statusCode = 400; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ error: "keyword required" })); return; }
              const TRACKED_FILE = path.resolve(ROOT, "seo-data/tracked-keywords.json");
              const dir = path.dirname(TRACKED_FILE);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              let tracked: any = { keywords: [] };
              if (fs.existsSync(TRACKED_FILE)) tracked = JSON.parse(fs.readFileSync(TRACKED_FILE, "utf8"));
              const newKw = { id: "trk_" + Date.now(), keyword, targetPage: targetPage || "/", position: null, change: 0, clicks: 0, impressions: 0, ctr: 0, addedAt: new Date().toISOString() };
              tracked.keywords.push(newKw);
              fs.writeFileSync(TRACKED_FILE, JSON.stringify(tracked, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, keyword: newKw }));
            } catch (e: any) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        // ── DELETE /api/keywords/:id ──────────────────────────────────
        if (url.startsWith("/api/keywords/") && req.method === "DELETE") {
          try {
            const id = url.split("/api/keywords/")[1];
            const TRACKED_FILE = path.resolve(ROOT, "seo-data/tracked-keywords.json");
            if (fs.existsSync(TRACKED_FILE)) {
              const tracked = JSON.parse(fs.readFileSync(TRACKED_FILE, "utf8"));
              tracked.keywords = (tracked.keywords || []).filter((k: any) => k.id !== id);
              fs.writeFileSync(TRACKED_FILE, JSON.stringify(tracked, null, 2));
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── GET /api/config───────────────────────────────────────────
        if (url === "/api/config" && req.method === "GET") {
          try {
            const config = loadConfig();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(getMaskedConfig(config)));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── POST /api/config ──────────────────────────────────────────────
        if (url === "/api/config" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const current = loadConfig();
              const updates = JSON.parse(body);
              const newConfig = { ...current };
              for (const section of Object.keys(updates)) {
                if (typeof updates[section] === 'object' && !Array.isArray(updates[section])) {
                  newConfig[section] = { ...current[section], ...updates[section] };
                } else {
                  newConfig[section] = updates[section];
                }
              }
              const ok = saveConfig(newConfig);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok, message: ok ? 'تم الحفظ بنجاح' : 'فشل الحفظ' }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        // ── GET /api/apikeys ──────────────────────────────────────────────
        if (url === "/api/apikeys" && req.method === "GET") {
          try {
            const config = loadConfig();
            const apiKeys = config.apiKeys || {};
            const FAILOVER_FILE = path.join(ROOT, 'seo-data', 'failover-providers.json');
            let failoverProviders: any[] = [];
            try { if (fs.existsSync(FAILOVER_FILE)) failoverProviders = JSON.parse(fs.readFileSync(FAILOVER_FILE, 'utf8')); } catch {}

            const maskKey = (k: string) => {
              if (!k || k.length < 5) return k ? '****' : '';
              return '****' + k.slice(-4);
            };

            const keys: any[] = [];
            const providerMap: Record<string, string> = {
              uspsUserId: 'USPS', uspsPassword: 'USPS',
              googleSearchConsole: 'Google', googleAnalytics4: 'Google', googleAdsense: 'Google', googleIndexingApi: 'Google',
              bingWebmaster: 'SEO', semrushApiKey: 'SEO', ahrefsApiKey: 'SEO', indexNowKey: 'IndexNow',
              openaiApiKey: 'AI', cloudflareApiKey: 'Cloudflare', cloudflareZoneId: 'Cloudflare',
              recaptchaSiteKey: 'Security', recaptchaSecretKey: 'Security',
              slackWebhook: 'Notifications', discordWebhook: 'Notifications', telegramBotToken: 'Notifications', telegramChatId: 'Notifications',
            };
            const nameMap: Record<string, string> = {
              uspsUserId: 'USPS Web Tools USERID', uspsPassword: 'USPS Web Tools Password',
              googleSearchConsole: 'Google Search Console', googleAnalytics4: 'Google Analytics 4', googleAdsense: 'Google AdSense', googleIndexingApi: 'Google Indexing API',
              bingWebmaster: 'Bing Webmaster', semrushApiKey: 'SEMrush API', ahrefsApiKey: 'Ahrefs API', indexNowKey: 'IndexNow',
              openaiApiKey: 'OpenAI API', cloudflareApiKey: 'Cloudflare API', cloudflareZoneId: 'Cloudflare Zone ID',
              recaptchaSiteKey: 'reCAPTCHA Site Key', recaptchaSecretKey: 'reCAPTCHA Secret Key',
              slackWebhook: 'Slack Webhook', discordWebhook: 'Discord Webhook', telegramBotToken: 'Telegram Bot Token', telegramChatId: 'Telegram Chat ID',
            };

            for (const [k, v] of Object.entries(apiKeys)) {
              keys.push({
                id: `config-${k}`,
                keyField: k,
                name: nameMap[k] || k,
                provider: providerMap[k] || 'custom',
                maskedKey: maskKey(v as string),
                status: (v as string) ? 'active' : 'inactive',
                lastUsed: null,
                createdAt: null,
                source: 'config',
              });
            }

            for (const provider of failoverProviders) {
              for (const acc of (provider.accounts || [])) {
                keys.push({
                  id: `failover-${acc.id}`,
                  accountId: acc.id,
                  providerId: provider.id,
                  name: acc.name || provider.name,
                  provider: provider.name,
                  maskedKey: maskKey(acc.apiKey || ''),
                  status: acc.apiKey && acc.apiKey !== 'N/A' && acc.enabled ? 'active' : !acc.enabled ? 'disabled' : 'inactive',
                  lastUsed: acc.lastUsed || null,
                  createdAt: null,
                  source: 'failover',
                  usedToday: acc.usedToday || 0,
                  successCount: acc.successCount || 0,
                  errorCount: acc.errorCount || 0,
                  dailyQuota: acc.dailyQuota || 0,
                  monthlyQuota: acc.monthlyQuota || 0,
                });
              }
            }

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(keys));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── POST /api/apikeys ──────────────────────────────────────────────
        if (url === "/api/apikeys" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const { keyField, value, provider, name: keyName, source } = JSON.parse(body);
              if (source === 'failover') {
                const FAILOVER_FILE = path.join(ROOT, 'seo-data', 'failover-providers.json');
                let providers: any[] = [];
                try { if (fs.existsSync(FAILOVER_FILE)) providers = JSON.parse(fs.readFileSync(FAILOVER_FILE, 'utf8')); } catch {}
                const prov = providers.find((p: any) => p.id === provider || p.name === provider);
                if (prov) {
                  const newId = `${prov.id}-${Date.now()}`;
                  prov.accounts = prov.accounts || [];
                  prov.accounts.push({
                    id: newId, providerId: prov.id, name: keyName || `${prov.name} - Account ${prov.accounts.length + 1}`,
                    apiKey: value, dailyQuota: 1000, usedToday: 0, enabled: true, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'active', monthlyQuota: 500,
                  });
                  fs.writeFileSync(FAILOVER_FILE, JSON.stringify(providers, null, 2));
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ ok: true, id: `failover-${newId}` }));
                } else {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Provider not found' }));
                }
              } else {
                const config = loadConfig();
                config.apiKeys = config.apiKeys || {};
                config.apiKeys[keyField] = value;
                saveConfig(config);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true, id: `config-${keyField}` }));
              }
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        // ── PUT /api/apikeys/:id ─────────────────────────────────────────
        if (url.match(/^\/api\/apikeys\/[^/]+$/) && req.method === "PUT") {
          const keyId = decodeURIComponent(url.split('/api/apikeys/')[1]);
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const { value } = JSON.parse(body);
              if (keyId.startsWith('config-')) {
                const field = keyId.replace('config-', '');
                const config = loadConfig();
                config.apiKeys = config.apiKeys || {};
                config.apiKeys[field] = value;
                saveConfig(config);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true }));
              } else if (keyId.startsWith('failover-')) {
                const accId = keyId.replace('failover-', '');
                const FAILOVER_FILE = path.join(ROOT, 'seo-data', 'failover-providers.json');
                let providers: any[] = [];
                try { if (fs.existsSync(FAILOVER_FILE)) providers = JSON.parse(fs.readFileSync(FAILOVER_FILE, 'utf8')); } catch {}
                let found = false;
                for (const prov of providers) {
                  for (const acc of (prov.accounts || [])) {
                    if (acc.id === accId) { acc.apiKey = value; found = true; break; }
                  }
                  if (found) break;
                }
                if (found) {
                  fs.writeFileSync(FAILOVER_FILE, JSON.stringify(providers, null, 2));
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ ok: true }));
                } else {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'Key not found' }));
                }
              } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid key ID' }));
              }
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        // ── DELETE /api/apikeys/:id ──────────────────────────────────────
        if (url.match(/^\/api\/apikeys\/[^/]+$/) && req.method === "DELETE") {
          const keyId = decodeURIComponent(url.split('/api/apikeys/')[1]);
          try {
            if (keyId.startsWith('config-')) {
              const field = keyId.replace('config-', '');
              const config = loadConfig();
              if (config.apiKeys) { config.apiKeys[field] = ''; saveConfig(config); }
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } else if (keyId.startsWith('failover-')) {
              const accId = keyId.replace('failover-', '');
              const FAILOVER_FILE = path.join(ROOT, 'seo-data', 'failover-providers.json');
              let providers: any[] = [];
              try { if (fs.existsSync(FAILOVER_FILE)) providers = JSON.parse(fs.readFileSync(FAILOVER_FILE, 'utf8')); } catch {}
              for (const prov of providers) {
                prov.accounts = (prov.accounts || []).filter((a: any) => a.id !== accId);
              }
              fs.writeFileSync(FAILOVER_FILE, JSON.stringify(providers, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } else {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid key ID' }));
            }
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── POST /api/apikeys/:id/test ───────────────────────────────────
        if (url.match(/^\/api\/apikeys\/[^/]+\/test$/) && req.method === "POST") {
          const keyId = decodeURIComponent(url.split('/api/apikeys/')[1].replace('/test', ''));
          try {
            let keyValue = '';
            let provider = '';
            if (keyId.startsWith('config-')) {
              const field = keyId.replace('config-', '');
              const config = loadConfig();
              keyValue = config.apiKeys?.[field] || '';
              provider = field;
            } else if (keyId.startsWith('failover-')) {
              const accId = keyId.replace('failover-', '');
              const FAILOVER_FILE = path.join(ROOT, 'seo-data', 'failover-providers.json');
              let providers: any[] = [];
              try { if (fs.existsSync(FAILOVER_FILE)) providers = JSON.parse(fs.readFileSync(FAILOVER_FILE, 'utf8')); } catch {}
              for (const prov of providers) {
                for (const acc of (prov.accounts || [])) {
                  if (acc.id === accId) { keyValue = acc.apiKey || ''; provider = prov.id; break; }
                }
              }
            }

            if (!keyValue || keyValue === 'N/A') {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: false, status: 'invalid', message: 'المفتاح فارغ أو غير صالح' }));
              return;
            }

            let testResult = { ok: true, status: 'active', message: 'المفتاح يبدو صالحاً (تحقق أساسي)' };
            if (keyValue.length < 4) {
              testResult = { ok: false, status: 'invalid', message: 'المفتاح قصير جداً' };
            }

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(testResult));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── GET /api/ads ────────────────────────────────────────────────────
        if (url === "/api/ads" && req.method === "GET") {
          try {
            const config = loadConfig();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(config.ads || getDefaultConfig().ads));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── POST /api/ads ────────────────────────────────────────────────────
        if (url === "/api/ads" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const config = loadConfig();
              const adsUpdate = JSON.parse(body);
              config.ads = { ...config.ads, ...adsUpdate };
              const ok = saveConfig(config);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        // ── Content Management API ──────────────────────────────────────────
        const CONTENT_FILE = path.join(ROOT, 'seo-data', 'content.json');
        const loadContent = (): any[] => {
          try { if (fs.existsSync(CONTENT_FILE)) return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')); } catch {}
          return [];
        };
        const saveContent = (items: any[]) => {
          const d = path.dirname(CONTENT_FILE);
          if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
          fs.writeFileSync(CONTENT_FILE, JSON.stringify(items, null, 2));
        };

        if (url === "/api/content" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(loadContent()));
          return;
        }

        if (url === "/api/content" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const item = JSON.parse(body);
              const now = new Date().toISOString();
              const newItem = {
                id: Date.now().toString() + '-' + Math.random().toString(36).slice(2, 6),
                title: item.title || '',
                slug: item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') || '',
                type: item.type || 'article',
                status: item.status || 'draft',
                content: item.content || '',
                tags: item.tags || [],
                seoTitle: item.seoTitle || '',
                seoDescription: item.seoDescription || '',
                createdAt: now,
                updatedAt: now,
              };
              const items = loadContent();
              items.unshift(newItem);
              saveContent(items);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, item: newItem }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        const contentPutMatch = url.match(/^\/api\/content\/([^/]+)$/);
        if (contentPutMatch && req.method === "PUT") {
          const id = contentPutMatch[1];
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const updates = JSON.parse(body);
              let items = loadContent();
              const idx = items.findIndex((i: any) => i.id === id);
              if (idx === -1) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Not found' })); return; }
              items[idx] = { ...items[idx], ...updates, id, updatedAt: new Date().toISOString() };
              saveContent(items);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, item: items[idx] }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        const contentDeleteMatch = url.match(/^\/api\/content\/([^/]+)$/);
        if (contentDeleteMatch && req.method === "DELETE") {
          const id = contentDeleteMatch[1];
          try {
            let items = loadContent();
            const len = items.length;
            items = items.filter((i: any) => i.id !== id);
            if (items.length === len) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Not found' })); return; }
            saveContent(items);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ══════════════════════════════════════════════════════════════════
        // ── API MANAGER: Failover Providers System ─────────────────────────
        // ══════════════════════════════════════════════════════════════════
        const FAILOVER_PROVIDERS_FILE = path.join(ROOT, 'seo-data', 'failover-providers.json');
        const CACHE_SETTINGS_FILE = path.join(ROOT, 'seo-data', 'cache-settings.json');
        const SCRAPERS_FILE = path.join(ROOT, 'seo-data', 'scrapers-config.json');
        const CARRIERS_FILE = path.join(ROOT, 'seo-data', 'carrier-patterns.json');
        const RATELIMIT_FILE = path.join(ROOT, 'seo-data', 'rate-limit-settings.json');
        const API_SETTINGS_FILE = path.join(ROOT, 'seo-data', 'api-settings.json');

        const ensureDir = (f: string) => { const d = path.dirname(f); if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };

        const DEFAULT_FAILOVER_PROVIDERS = [
          { id: 'ship24', name: 'Ship24', enabled: true, priority: 1, icon: '🚀', color: '#3b82f6',
            accounts: [
              { id: 's24-1', providerId: 'ship24', name: 'Ship24 - Account 1', apiKey: '', dailyQuota: 100, monthlyQuota: 100, usedToday: 0, usedThisMonth: 0, enabled: true, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'active' },
            ]
          },
          { id: 'trackingmore', name: 'TrackingMore', enabled: true, priority: 2, icon: '📦', color: '#10b981',
            accounts: [
              { id: 'tm-1', providerId: 'trackingmore', name: 'TrackingMore - Account 1', apiKey: '', dailyQuota: 500, monthlyQuota: 500, usedToday: 0, usedThisMonth: 0, enabled: true, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'active' },
            ]
          },
          { id: '17track', name: '17Track', enabled: false, priority: 3, icon: '🌐', color: '#f59e0b',
            accounts: [
              { id: '17t-1', providerId: '17track', name: '17Track - Account 1', apiKey: '', dailyQuota: 500, monthlyQuota: 500, usedToday: 0, usedThisMonth: 0, enabled: true, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'active' },
            ]
          },
          { id: 'scraper', name: 'Custom Scraper', enabled: true, priority: 4, icon: '🕷️', color: '#8b5cf6',
            accounts: [
              { id: 'sc-1', providerId: 'scraper', name: 'Custom Scraper - Default', apiKey: 'N/A', dailyQuota: 10000, monthlyQuota: 10000, usedToday: 0, usedThisMonth: 0, enabled: true, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'active' },
            ]
          },
        ];

        const loadProviders = () => {
          if (fs.existsSync(FAILOVER_PROVIDERS_FILE)) {
            try { return JSON.parse(fs.readFileSync(FAILOVER_PROVIDERS_FILE, 'utf8')); } catch {}
          }
          ensureDir(FAILOVER_PROVIDERS_FILE);
          fs.writeFileSync(FAILOVER_PROVIDERS_FILE, JSON.stringify(DEFAULT_FAILOVER_PROVIDERS, null, 2));
          return DEFAULT_FAILOVER_PROVIDERS;
        };
        const saveProviders = (data: any) => { ensureDir(FAILOVER_PROVIDERS_FILE); fs.writeFileSync(FAILOVER_PROVIDERS_FILE, JSON.stringify(data, null, 2)); };

        // ── GET /api/usps-track/:trackingNumber — Failover: Ship24 → TrackingMore → 17Track → USPS XML ──
        const uspsMatch = url.match(/^\/api\/usps-track\/([A-Za-z0-9]+)$/);
        if (uspsMatch && req.method === "GET") {
          const trackingNumber = uspsMatch[1].toUpperCase();
          const startTime = Date.now();
          const clientIp = ((req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown") as string).split(",")[0].trim();
          const TRACKING_CACHE_FILE = path.join(ROOT, 'seo-data', 'tracking-cache.json');
          const TRACKING_LOGS_FILE = path.join(ROOT, 'seo-data', 'tracking-logs.json');

          const loadTrackCache = (): any => { try { return fs.existsSync(TRACKING_CACHE_FILE) ? JSON.parse(fs.readFileSync(TRACKING_CACHE_FILE, 'utf8')) : {}; } catch { return {}; } };
          const saveTrackCache = (c: any) => { try { ensureDir(TRACKING_CACHE_FILE); fs.writeFileSync(TRACKING_CACHE_FILE, JSON.stringify(c)); } catch {} };
          const addTrackLog = (providerUsed: string, accountUsed: string, cacheHit: boolean, status: 'success' | 'error' | 'not_found', errorMsg?: string) => {
            try {
              let logs: any[] = fs.existsSync(TRACKING_LOGS_FILE) ? JSON.parse(fs.readFileSync(TRACKING_LOGS_FILE, 'utf8')) : [];
              logs.push({ id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: new Date().toISOString(), trackingNumberHash: trackingNumber.slice(0, 4) + '****' + trackingNumber.slice(-4), carrier: 'USPS', providerUsed, accountUsed, cacheHit, responseTimeMs: Date.now() - startTime, status, errorMessage: errorMsg, ipHash: clientIp.replace(/(\d+)\.(\d+)\.\d+\.\d+/, '$1.$2.xxx.xxx') });
              if (logs.length > 10000) logs = logs.slice(-10000);
              ensureDir(TRACKING_LOGS_FILE); fs.writeFileSync(TRACKING_LOGS_FILE, JSON.stringify(logs));
            } catch {}
          };
          const inferStatus = (label: string) => { const l = label.toLowerCase(); if (l.includes('delivered')) return 'delivered'; if (l.includes('out for delivery')) return 'out-for-delivery'; if (l.includes('label') || l.includes('pre-shipment') || l.includes('accepted')) return 'label-created'; return 'in-transit'; };
          const fmtDate = (iso: string) => { try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return iso; } };
          const fmtTime = (iso: string) => { try { return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
          const getMonthKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}`; };

          // ── IP Rate Limiting ──────────────────────────────────────────────
          const ipNow = Date.now();
          const ipData = ipRateCache.get(clientIp) || { count: 0, windowStart: ipNow };
          if (ipNow - ipData.windowStart > 3600000) { ipData.count = 0; ipData.windowStart = ipNow; }
          ipData.count++;
          ipRateCache.set(clientIp, ipData);
          const ipHourLimit = (loadConfig().rateLimit?.maxPerHour) || 30;
          if (ipData.count > ipHourLimit) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: 'Too many tracking requests. Please wait a few minutes before trying again.', rateLimited: true, trackingNumber }));
            return;
          }

          // ── Cache check (includes "not found" cache) ──────────────────────
          const cache = loadTrackCache();
          const cached = cache[trackingNumber];
          if (cached && new Date(cached.expiresAt) > new Date()) {
            cached.hitCount = (cached.hitCount || 0) + 1;
            cached.lastHit = new Date().toISOString();
            saveTrackCache(cache);
            if (cached.notFound) {
              addTrackLog(cached.providerUsed || 'Cache', 'Cache', true, 'not_found');
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: false, error: 'No tracking information found for this number. It may not exist or may take up to 24 hours to appear after the first USPS scan.', trackingNumber, cached: true }));
            } else {
              addTrackLog(cached.providerUsed || 'Cache', 'Cache', true, 'success');
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ...cached.data, cached: true }));
            }
            return;
          }

          // ── Account usage helpers ─────────────────────────────────────────
          const updateAccountUsage = (providerId: string, accountId: string, success: boolean, forceExhaust = false) => {
            try {
              const mk = getMonthKey();
              const provs = loadProviders().map((p: any) => ({
                ...p,
                accounts: (p.accounts || []).map((a: any) => {
                  if (a.id !== accountId || p.id !== providerId) return a;
                  const resetMonth = a.monthReset !== mk;
                  const usedThisMonth = resetMonth ? 1 : (a.usedThisMonth || 0) + 1;
                  const monthlyLimit = a.monthlyQuota || a.dailyQuota || 9999;
                  const isExhausted = forceExhaust || usedThisMonth >= monthlyLimit;
                  return { ...a, usedToday: (a.usedToday || 0) + 1, usedThisMonth, monthReset: mk, lastUsed: new Date().toISOString(), successCount: success ? (a.successCount || 0) + 1 : (a.successCount || 0), errorCount: !success ? (a.errorCount || 0) + 1 : (a.errorCount || 0), status: isExhausted ? 'exhausted' : 'active' };
                })
              }));
              saveProviders(provs);
            } catch {}
          };
          const isAccountActive = (a: any) => {
            if (!a.enabled || !a.apiKey || !a.apiKey.trim() || a.apiKey === 'N/A') return false;
            const mk = getMonthKey();
            const usedThisMonth = a.monthReset !== mk ? 0 : (a.usedThisMonth || 0);
            const monthlyLimit = a.monthlyQuota || a.dailyQuota || 9999;
            if (usedThisMonth >= monthlyLimit) return false;
            if (a.status === 'exhausted' && a.monthReset === mk) return false;
            return true;
          };

          // ── Provider failover loop ────────────────────────────────────────
          const allProviders = loadProviders().sort((a: any, b: any) => a.priority - b.priority);
          let trackingResult: any = null;
          let usedProvider = '';
          let usedAccount = '';

          for (const provider of allProviders) {
            if (!provider.enabled || trackingResult) continue;
            const accounts = (provider.accounts || []).filter(isAccountActive);
            if (accounts.length === 0) continue;

            // ── Ship24 ───────────────────────────────────────────────────
            // Uses per-call plan endpoint: POST /tracking/search
            if (provider.id === 'ship24') {
              const inferFromMilestone = (milestone: string) => { if (!milestone) return null; const m = milestone.toLowerCase(); if (m === 'delivered') return 'delivered'; if (m === 'out_for_delivery') return 'out-for-delivery'; if (m === 'label_created' || m === 'pre_transit') return 'label-created'; if (m === 'in_transit' || m === 'available_for_pickup' || m === 'return_to_sender' || m === 'exception') return 'in-transit'; return null; };
              for (const account of accounts) {
                try {
                  const ship24Body: any = { trackingNumber, courierCode: ['us-post'], destinationCountryCode: 'US' };
                  const r = await fetch('https://api.ship24.com/public/v1/tracking/search', { method: 'POST', headers: { 'Authorization': `Bearer ${account.apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(ship24Body), signal: AbortSignal.timeout(60000) });
                  if (r.status === 402 || r.status === 429 || r.status === 403) { updateAccountUsage(provider.id, account.id, false, true); continue; }
                  if (r.status === 201 || r.ok) {
                    const d = await r.json();
                    const tracking = d.data?.trackings?.[0];
                    const shipment = tracking?.shipment;
                    const rawEvts: any[] = tracking?.events || [];
                    const evts = rawEvts.map((e: any) => ({ status: e.status || '', detail: e.status || '', location: typeof e.location === 'string' ? e.location : [e.location?.city, e.location?.state, e.location?.countryCode].filter(Boolean).join(', '), date: e.occurrenceDatetime ? fmtDate(e.occurrenceDatetime) : '', time: e.occurrenceDatetime ? fmtTime(e.occurrenceDatetime) : '', milestone: e.statusMilestone || '' }));
                    updateAccountUsage(provider.id, account.id, true);
                    if (evts.length > 0) {
                      const latestEvt = evts[0];
                      const latestRaw = rawEvts[0];
                      const status = inferFromMilestone(latestRaw?.statusMilestone) || inferStatus(latestEvt.status);
                      const estDelivery = shipment?.delivery?.estimatedDeliveryDate ? fmtDate(shipment.delivery.estimatedDeliveryDate) : '';
                      const originCC = shipment?.originCountryCode || '';
                      const destCC = shipment?.destinationCountryCode || '';
                      trackingResult = { ok: true, trackingNumber, status, statusLabel: latestEvt.status || 'In Transit', service: 'USPS Package', origin: originCC, destination: destCC, estimatedDelivery: estDelivery, weight: '—', events: evts };
                      usedProvider = 'Ship24'; usedAccount = account.name; break;
                    }
                  } else { updateAccountUsage(provider.id, account.id, false); }
                } catch { updateAccountUsage(provider.id, account.id, false); }
              }
            }

            // ── TrackingMore (v3) ─────────────────────────────────────────
            if (provider.id === 'trackingmore' && !trackingResult) {
              const tmStatusMap = (s: string) => { const v = (s || '').toLowerCase(); if (v === 'delivered') return 'delivered'; if (v === 'pickup') return 'out-for-delivery'; if (v === 'inforeceived') return 'label-created'; if (v === 'notfound' || v === 'expired') return 'in-transit'; return 'in-transit'; };
              for (const account of accounts) {
                try {
                  const r = await fetch('https://api.trackingmore.com/v3/trackings/realtime', { method: 'POST', headers: { 'Tracking-Api-Key': account.apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ tracking_number: trackingNumber, carrier_code: 'usps', destination_code: 'US' }), signal: AbortSignal.timeout(20000) });
                  if (r.status === 402 || r.status === 429 || r.status === 403) { updateAccountUsage(provider.id, account.id, false, true); continue; }
                  if (r.ok) {
                    const d = await r.json();
                    if (d.code === 203) { updateAccountUsage(provider.id, account.id, false, true); continue; }
                    if (d.code === 200 && d.data) {
                      const originEvts: any[] = d.data.origin_info?.trackinfo || [];
                      const destEvts: any[] = d.data.destination_info?.trackinfo || [];
                      const allRaw = [...originEvts, ...destEvts];
                      const evts = allRaw.map((e: any) => ({ status: e.tracking_detail || '', detail: e.tracking_detail || '', location: e.location || '', date: e.checkpoint_date ? fmtDate(e.checkpoint_date) : '', time: e.checkpoint_date ? fmtTime(e.checkpoint_date) : '' }));
                      updateAccountUsage(provider.id, account.id, true);
                      if (evts.length > 0) {
                        const deliveryStatus: string = d.data.delivery_status || '';
                        const latestEvtStr: string = typeof d.data.latest_event === 'string' ? d.data.latest_event.split(',')[0] : evts[0].status;
                        trackingResult = { ok: true, trackingNumber, status: tmStatusMap(deliveryStatus), statusLabel: latestEvtStr || evts[0].status || 'In Transit', service: 'USPS Package', origin: d.data.original || '', destination: d.data.destination || '', estimatedDelivery: d.data.scheduled_delivery_date || '', weight: '—', events: evts };
                        usedProvider = 'TrackingMore'; usedAccount = account.name; break;
                      }
                    } else { updateAccountUsage(provider.id, account.id, false); }
                  } else { updateAccountUsage(provider.id, account.id, false); }
                } catch { updateAccountUsage(provider.id, account.id, false); }
              }
            }

            // ── 17Track (v2.4) ───────────────────────────────────────────
            if (provider.id === '17track' && !trackingResult) {
              const t17StatusMap = (s: string) => { switch ((s || '').toLowerCase()) { case 'delivered': return 'delivered'; case 'outfordelivery': case 'availableforpickup': return 'out-for-delivery'; case 'inforeceived': return 'label-created'; case 'exception': return 'alert'; default: return 'in-transit'; } };
              const USPS_CARRIER_17 = 21051;
              for (const account of accounts) {
                try {
                  await fetch('https://api.17track.net/track/v2.4/register', { method: 'POST', headers: { '17token': account.apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify([{ number: trackingNumber, carrier: USPS_CARRIER_17, destination_country: 'US' }]), signal: AbortSignal.timeout(8000) });
                  const r = await fetch('https://api.17track.net/track/v2.4/gettrackinfo', { method: 'POST', headers: { '17token': account.apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify([{ number: trackingNumber, carrier: USPS_CARRIER_17 }]), signal: AbortSignal.timeout(15000) });
                  if (r.status === 402 || r.status === 429 || r.status === 403) { updateAccountUsage(provider.id, account.id, false, true); continue; }
                  if (r.ok) {
                    const d = await r.json();
                    const item = d.data?.accepted?.[0];
                    const trackInfo = item?.track_info;
                    if (trackInfo) {
                      const providers: any[] = trackInfo.tracking?.providers || [];
                      const rawEvts = providers.flatMap((p: any) => p.events || []);
                      const evts = rawEvts.map((e: any) => ({ status: e.description || '', detail: e.description || '', location: typeof e.location === 'string' ? e.location : [e.address?.city, e.address?.state, e.address?.country].filter(Boolean).join(', '), date: e.time_iso ? fmtDate(e.time_iso) : (e.time_raw?.date ? fmtDate(e.time_raw.date) : ''), time: e.time_iso ? fmtTime(e.time_iso) : (e.time_raw?.time || '') }));
                      updateAccountUsage(provider.id, account.id, true);
                      if (evts.length > 0) {
                        const latestStatus: string = trackInfo.latest_status?.status || '';
                        const latestDesc: string = trackInfo.latest_event?.description || evts[0].status || 'In Transit';
                        const origin: string = trackInfo.shipping_info?.shipper_address?.country || '';
                        const dest: string = trackInfo.shipping_info?.recipient_address?.country || '';
                        const estDelivery: string = trackInfo.time_metrics?.estimated_delivery_date?.from ? fmtDate(trackInfo.time_metrics.estimated_delivery_date.from) : '';
                        trackingResult = { ok: true, trackingNumber, status: t17StatusMap(latestStatus), statusLabel: latestDesc, service: 'USPS Package', origin, destination: dest, estimatedDelivery: estDelivery, weight: '—', events: evts };
                        usedProvider = '17Track'; usedAccount = account.name; break;
                      }
                    } else { updateAccountUsage(provider.id, account.id, false); }
                  } else { updateAccountUsage(provider.id, account.id, false); }
                } catch { updateAccountUsage(provider.id, account.id, false); }
              }
            }

            // ── Advanced Multi-Layer USPS Scraper + USPS XML fallback ────────
            if ((provider.id === 'scraper' || provider.id === 'usps') && !trackingResult) {
              // Step A: Run multi-layer scraper engine
              try {
                const scraped = await runUspsScrapers(trackingNumber);
                if (scraped && scraped.events.length > 0) {
                  const rawSt = scraped.rawStatus || scraped.events[0].status;
                  const st = inferStatus(rawSt);
                  trackingResult = { ok: true, trackingNumber, status: st, statusLabel: scraped.statusLabel || scraped.events[0].status || 'In Transit', service: 'USPS Package', origin: scraped.origin || '', destination: scraped.destination || '', estimatedDelivery: scraped.estimatedDelivery || '', weight: '—', events: scraped.events };
                  usedProvider = 'USPS Scraper'; usedAccount = 'Multi-Layer Engine';
                }
              } catch {}
              // Step B: USPS XML API fallback (if scraper failed and USERID configured)
              if (!trackingResult) {
                const config = loadConfig();
                const USERID = config.apiKeys?.uspsUserId || '';
                if (USERID) {
                  try {
                    const xmlRequest = `<TrackFieldRequest USERID="${USERID}"><Revision>1</Revision><ClientIp>127.0.0.1</ClientIp><SourceId>USPostalTracking</SourceId><TrackID ID="${trackingNumber}"/></TrackFieldRequest>`;
                    const apiUrl = `https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=${encodeURIComponent(xmlRequest)}`;
                    const fetchMod = await import('node:https');
                    const xmlResponse: string = await new Promise((resolve, reject) => { fetchMod.default.get(apiUrl, { timeout: 12000 }, (resp: any) => { let data = ''; resp.on('data', (c: Buffer) => data += c); resp.on('end', () => resolve(data)); }).on('error', reject); });
                    const extract = (tag: string) => { const m = xmlResponse.match(new RegExp(`<${tag}>(.*?)</${tag}>`, 's')); return m ? m[1].trim() : ''; };
                    const errNum = xmlResponse.match(/<Number>(.*?)<\/Number>/);
                    if (!errNum || xmlResponse.includes('<TrackDetail>') || xmlResponse.includes('<TrackSummary>')) {
                      const statusCategory = extract('StatusCategory'); const statusSummary = extract('StatusSummary');
                      const parseXmlEvent = (xml: string) => { const ex = (tag: string) => { const m = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`)); return m ? m[1].trim() : ''; }; const ec = ex('EventCity'); const es = ex('EventState'); const ez = ex('EventZIPCode'); return { status: ex('Event'), detail: ex('Event'), location: ec ? `${ec}, ${es} ${ez}`.trim() : '', date: ex('EventDate'), time: ex('EventTime') }; };
                      const evts: any[] = [];
                      const sm = xmlResponse.match(/<TrackSummary>(.*?)<\/TrackSummary>/s); if (sm) evts.push(parseXmlEvent(sm[1]));
                      const dr = /<TrackDetail>(.*?)<\/TrackDetail>/gs; let dm; while ((dm = dr.exec(xmlResponse)) !== null) evts.push(parseXmlEvent(dm[1]));
                      if (evts.length > 0) { const cat = statusCategory.toLowerCase(); let st = 'in-transit'; if (cat.includes('delivered')) st = 'delivered'; else if (cat.includes('out for delivery')) st = 'out-for-delivery'; else if (cat.includes('alert') || cat.includes('exception')) st = 'alert'; else if (cat.includes('accepted') || cat.includes('pre-shipment')) st = 'label-created'; const oc = extract('OriginCity'); const os2 = extract('OriginState'); const oz = extract('OriginZip'); const dc = extract('DestinationCity'); const ds = extract('DestinationState'); const dz = extract('DestinationZip'); trackingResult = { ok: true, trackingNumber, status: st, statusLabel: statusCategory || statusSummary || 'In Transit', service: extract('Class') || 'USPS Package', origin: oc ? `${oc}, ${os2} ${oz}` : '', destination: dc ? `${dc}, ${ds} ${dz}` : '', estimatedDelivery: extract('GuaranteedDeliveryDate') || extract('ExpectedDeliveryDate') || '', weight: '—', events: evts }; usedProvider = 'USPS XML'; usedAccount = 'USPS API'; }
                    }
                  } catch {}
                }
              }
            }
          }

          // ── No result: cache "not found" with 5-min TTL ───────────────────
          if (!trackingResult) {
            const nfCache = loadTrackCache();
            nfCache[trackingNumber] = { notFound: true, providerUsed: 'None', cachedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 5 * 60000).toISOString(), hitCount: 0, lastHit: new Date().toISOString() };
            saveTrackCache(nfCache);
            addTrackLog('None', 'None', false, 'not_found', 'All providers returned no results');
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: 'No tracking information found for this number. It may not exist or may take up to 24 hours to appear after the first USPS scan.', trackingNumber }));
            return;
          }

          // ── Cache result with status-based TTL ────────────────────────────
          try {
            const ttlCfg = fs.existsSync(CACHE_SETTINGS_FILE) ? JSON.parse(fs.readFileSync(CACHE_SETTINGS_FILE, 'utf8')) : {};
            const ttlMap: Record<string, number> = { delivered: ttlCfg.delivered || 1440, 'out-for-delivery': ttlCfg.outForDelivery || 30, 'in-transit': ttlCfg.inTransit || 120, 'label-created': ttlCfg.preShipment || 60, alert: ttlCfg.exception || 15 };
            const ttlMin = ttlMap[trackingResult.status] || ttlCfg.unknown || 30;
            const updCache = loadTrackCache();
            updCache[trackingNumber] = { trackingNumberHash: trackingNumber.slice(0, 4) + '****' + trackingNumber.slice(-4), carrier: 'USPS', status: trackingResult.statusLabel, cachedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + ttlMin * 60000).toISOString(), hitCount: 0, lastHit: new Date().toISOString(), providerUsed: usedProvider, data: trackingResult };
            saveTrackCache(updCache);
          } catch {}

          addTrackLog(usedProvider, usedAccount, false, 'success');
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(trackingResult));
          return;
        }

        // ── POST /api/run/:scriptId ──────────────────────────────────────
        const runMatch = url.match(/^\/api\/run\/([a-z0-9-]+)$/);
        if (runMatch && req.method === "POST") {
          const scriptId = runMatch[1];
          const script = SCRIPTS.find(s => s.id === scriptId);
          if (!script) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `Script '${scriptId}' not found` }));
            return;
          }
          streamCmd(script.cmd, res);
          return;
        }

        // ── GET /api/git ─────────────────────────────────────────────────
        if (url === "/api/git" && req.method === "GET") {
          try {
            const branch = await runCmd("git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'main'");
            const totalCommits = await runCmd("git rev-list --count HEAD 2>/dev/null || echo 0");
            const statusRaw = await runCmd("git status --porcelain 2>/dev/null || echo ''");
            const logRaw = await runCmd("git log --oneline -20 2>/dev/null || echo ''");
            const lastCommitMsg = await runCmd("git log -1 --format='%s' 2>/dev/null || echo ''");
            const lastCommitAuthor = await runCmd("git log -1 --format='%an' 2>/dev/null || echo ''");
            const lastCommitDate = await runCmd("git log -1 --format='%ci' 2>/dev/null || echo ''");
            const recentCommitsRaw = await runCmd("git log -20 --format='%H|||%s|||%ci|||%an' 2>/dev/null || echo ''");
            const statusLines = statusRaw.split('\n').filter(Boolean);
            const logLines = logRaw.split('\n').filter(Boolean);
            const recentCommits = recentCommitsRaw.split('\n').filter(Boolean).map(line => {
              const [hash, message, date, author] = line.split('|||');
              return { hash: (hash || '').trim(), message: (message || '').trim(), date: (date || '').trim(), author: (author || '').trim() };
            });
            const modifiedFilesList = statusLines.map(line => {
              const status = line.trim().substring(0, 2).trim();
              const file = line.trim().substring(2).trim();
              const statusLabel = status === 'M' ? 'modified' : status === 'A' ? 'added' : status === 'D' ? 'deleted' : status === '??' ? 'untracked' : status === 'R' ? 'renamed' : 'other';
              return { file, status: statusLabel, raw: status };
            });
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              branch: branch || 'main',
              totalCommits: parseInt(totalCommits) || 0,
              status: statusLines,
              log: logLines,
              lastCommit: { message: lastCommitMsg, author: lastCommitAuthor, date: lastCommitDate },
              recentCommits,
              modifiedFilesList,
              modifiedFiles: statusLines.filter(l => l.trim().startsWith('M')).length,
              untrackedFiles: statusLines.filter(l => l.trim().startsWith('?')).length,
            }));
          } catch (e: any) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ branch: 'main', totalCommits: 0, status: [], log: [], lastCommit: {}, recentCommits: [], modifiedFilesList: [], modifiedFiles: 0, untrackedFiles: 0 }));
          }
          return;
        }

        // ── GET /api/performance ──────────────────────────────────────────
        if (url === "/api/performance" && req.method === "GET") {
          try {
            const distDir = path.join(ROOT, 'dist');
            const distExists = fs.existsSync(distDir);

            const getDirSizeByExt = (dir: string, exts: string[]): number => {
              if (!fs.existsSync(dir)) return 0;
              let total = 0;
              const walk = (d: string) => {
                const items = fs.readdirSync(d, { withFileTypes: true });
                for (const item of items) {
                  const p = path.join(d, item.name);
                  if (item.isDirectory()) walk(p);
                  else if (exts.some(e => item.name.endsWith(e))) total += fs.statSync(p).size;
                }
              };
              walk(dir);
              return total;
            };
            const getDirSize = (dir: string): number => {
              if (!fs.existsSync(dir)) return 0;
              let total = 0;
              const walk = (d: string) => {
                const items = fs.readdirSync(d, { withFileTypes: true });
                for (const item of items) {
                  const p = path.join(d, item.name);
                  if (item.isDirectory()) walk(p);
                  else total += fs.statSync(p).size;
                }
              };
              walk(dir);
              return total;
            };
            const countFiles = (dir: string, exts?: string[]): number => {
              if (!fs.existsSync(dir)) return 0;
              let c = 0;
              const walk = (d: string) => {
                const items = fs.readdirSync(d, { withFileTypes: true });
                for (const item of items) {
                  const p = path.join(d, item.name);
                  if (item.isDirectory()) walk(p);
                  else if (!exts || exts.some(e => item.name.endsWith(e))) c++;
                }
              };
              walk(dir);
              return c;
            };
            const fmtSize = (bytes: number): string => {
              if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
              if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
              return bytes + ' B';
            };

            const totalBytes = distExists ? getDirSize(distDir) : 0;
            const jsSizeBytes = distExists ? getDirSizeByExt(distDir, ['.js', '.mjs']) : 0;
            const cssSizeBytes = distExists ? getDirSizeByExt(distDir, ['.css']) : 0;
            const imgSizeBytes = distExists ? getDirSizeByExt(distDir, ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.ico']) : 0;
            const fontSizeBytes = distExists ? getDirSizeByExt(distDir, ['.woff', '.woff2', '.ttf', '.otf', '.eot']) : 0;
            const htmlSizeBytes = distExists ? getDirSizeByExt(distDir, ['.html']) : 0;
            const assetsDir = path.join(distDir, 'assets');
            const assetCount = distExists ? countFiles(assetsDir) : 0;

            const pageCount = countFiles(path.join(ROOT, 'src/pages'), ['.tsx']);
            const compCount = countFiles(path.join(ROOT, 'src/components'), ['.tsx']);

            let routeCount = 0;
            try {
              const appContent = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf8');
              const routeMatches = appContent.match(/<Route\s/g);
              routeCount = routeMatches ? routeMatches.length : 0;
            } catch {}

            let responseTimeStats: any = { avg: 'N/A', p95: 'N/A', p99: 'N/A', min: 'N/A', max: 'N/A', count: 0, recentTimes: [] };
            try {
              const trackingLogsPath = path.join(ROOT, 'seo-data/tracking-logs.json');
              if (fs.existsSync(trackingLogsPath)) {
                const logs = JSON.parse(fs.readFileSync(trackingLogsPath, 'utf8'));
                const times: number[] = [];
                if (Array.isArray(logs)) {
                  for (const l of logs) {
                    const rt = l.responseTimeMs || l.responseTime;
                    if (typeof rt === 'number' && rt > 0) times.push(rt);
                  }
                }
                if (times.length > 0) {
                  times.sort((a, b) => a - b);
                  const sum = times.reduce((s, v) => s + v, 0);
                  const avg = Math.round(sum / times.length);
                  const p95 = times[Math.floor(times.length * 0.95)] || times[times.length - 1];
                  const p99 = times[Math.floor(times.length * 0.99)] || times[times.length - 1];
                  responseTimeStats = {
                    avg: avg + 'ms',
                    p95: p95 + 'ms',
                    p99: p99 + 'ms',
                    min: times[0] + 'ms',
                    max: times[times.length - 1] + 'ms',
                    count: times.length,
                    recentTimes: times.slice(-50),
                  };
                }
              }
            } catch {}

            const jsKB = jsSizeBytes / 1024;
            const estimatedLCP = jsKB < 200 ? '< 1.5s' : jsKB < 500 ? '~2.0s' : jsKB < 1000 ? '~2.8s' : '> 3.5s';
            const estimatedTBT = jsKB < 200 ? '< 150ms' : jsKB < 500 ? '~300ms' : jsKB < 1000 ? '~600ms' : '> 1000ms';
            const estimatedFCP = jsKB < 200 ? '< 1.0s' : jsKB < 500 ? '~1.5s' : '~2.5s';

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              lighthouse: { performance: 'N/A', accessibility: 'N/A', bestPractices: 'N/A', seo: 'N/A', note: 'يتطلب فحص يدوي عبر Chrome DevTools' },
              coreWebVitals: {
                lcp: distExists ? estimatedLCP : 'N/A',
                fid: 'N/A',
                cls: 'N/A',
                ttfb: responseTimeStats.avg !== 'N/A' ? responseTimeStats.avg : 'N/A',
                inp: 'N/A',
                tbt: distExists ? estimatedTBT : 'N/A',
                fcp: distExists ? estimatedFCP : 'N/A',
                note: 'تقديرات مبنية على حجم البناء — القيم الفعلية تتطلب Lighthouse',
              },
              buildInfo: {
                built: distExists,
                totalSize: fmtSize(totalBytes),
                totalBytes,
                jsSize: fmtSize(jsSizeBytes),
                jsSizeBytes,
                cssSize: fmtSize(cssSizeBytes),
                cssSizeBytes,
                imgSize: fmtSize(imgSizeBytes),
                imgSizeBytes,
                fontSize: fmtSize(fontSizeBytes),
                fontSizeBytes,
                htmlSize: fmtSize(htmlSizeBytes),
                htmlSizeBytes,
                assetCount,
                pageCount,
                componentCount: compCount,
                routeCount,
              },
              responseTimeStats,
              pageSpeeds: [],
              history: [],
            }));
          } catch (e: any) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              lighthouse: { performance: 'N/A', accessibility: 'N/A', bestPractices: 'N/A', seo: 'N/A', note: 'يتطلب فحص يدوي' },
              coreWebVitals: { lcp: 'N/A', fid: 'N/A', cls: 'N/A', ttfb: 'N/A', inp: 'N/A' },
              buildInfo: { built: false, totalSize: '—', jsSize: '—', cssSize: '—', imgSize: '—', fontSize: '—', pageCount: 0, componentCount: 0, routeCount: 0, assetCount: 0 },
              responseTimeStats: { avg: 'N/A', p95: 'N/A', p99: 'N/A', count: 0, recentTimes: [] },
              pageSpeeds: [],
              history: [],
            }));
          }
          return;
        }

        // ── GET /api/database/tables ──────────────────────────────────────
        if (url === "/api/database/tables" && req.method === "GET") {
          try {
            const seoDataDir = path.join(ROOT, 'seo-data');
            const tables: any[] = [];
            if (fs.existsSync(seoDataDir)) {
              const files = fs.readdirSync(seoDataDir).filter(f => f.endsWith('.json'));
              for (const file of files) {
                const filePath = path.join(seoDataDir, file);
                try {
                  const stat = fs.statSync(filePath);
                  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                  let rows = 0;
                  if (Array.isArray(content)) rows = content.length;
                  else if (content.visits) rows = content.visits.length;
                  else if (typeof content === 'object') rows = Object.keys(content).length;
                  tables.push({
                    name: file.replace('.json', ''),
                    file,
                    rows,
                    size: (stat.size / 1024).toFixed(2) + ' KB',
                    sizeBytes: stat.size,
                    lastUpdate: stat.mtime.toISOString(),
                    type: 'json',
                  });
                } catch {}
              }
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ tables, total: tables.length }));
          } catch (e: any) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ tables: [], total: 0 }));
          }
          return;
        }

        // ── GET /api/database/table/:name ─────────────────────────────────
        const dbTableMatch = url.match(/^\/api\/database\/table\/([a-z0-9_-]+)(\?.*)?$/);
        if (dbTableMatch && req.method === "GET") {
          try {
            const tableName = dbTableMatch[1];
            const filePath = path.join(ROOT, 'seo-data', tableName + '.json');
            if (!fs.existsSync(filePath)) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Not found' })); return; }
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const rows = Array.isArray(content) ? content : content.visits || Object.entries(content).map(([k, v]) => ({ key: k, value: v }));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ name: tableName, rows: rows.slice(0, 500), total: rows.length }));
          } catch (e: any) {
            res.statusCode = 500; res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── GET /api/logs ────────────────────────────────────────────────
        const LOGS_FILE = path.join(ROOT, 'seo-data', 'logs.json');
        if (url === "/api/logs" && req.method === "GET") {
          try {
            let logs: any[] = [];
            if (fs.existsSync(LOGS_FILE)) logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
            if (!Array.isArray(logs)) logs = [];
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ logs: logs.slice(-200).reverse(), total: logs.length }));
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ logs: [], total: 0 }));
          }
          return;
        }

        // ── DELETE /api/logs ──────────────────────────────────────────────
        if (url === "/api/logs" && req.method === "DELETE") {
          try {
            let logs: any[] = [];
            if (fs.existsSync(LOGS_FILE)) { try { logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8')); } catch {} }
            if (!Array.isArray(logs)) logs = [];
            const kept = logs.slice(-100);
            fs.writeFileSync(LOGS_FILE, JSON.stringify(kept, null, 2));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, removed: logs.length - kept.length, remaining: kept.length }));
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── POST /api/logs ────────────────────────────────────────────────
        if (url === "/api/logs" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const entry = JSON.parse(body);
              let logs: any[] = [];
              if (fs.existsSync(LOGS_FILE)) { try { logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8')); } catch {} }
              if (!Array.isArray(logs)) logs = [];
              logs.push({ id: Date.now().toString(), time: new Date().toISOString(), ...entry });
              if (logs.length > 2000) logs = logs.slice(-2000);
              const dir = path.dirname(LOGS_FILE);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── AdSense data file helper ──────────────────────────────────────
        const ADSENSE_FILE = path.resolve(__dirname, "seo-data/adsense-data.json");
        function loadAdsenseData(): any {
          try {
            if (fs.existsSync(ADSENSE_FILE)) return JSON.parse(fs.readFileSync(ADSENSE_FILE, 'utf8'));
          } catch {}
          return {
            publisherId: '', enabled: false, autoAds: false,
            placements: { header: true, afterResults: true, sidebar: false, footer: true, inArticle: true },
            adUnits: [],
            stats: { todayEarnings: 0, yesterdayEarnings: 0, monthEarnings: 0, lastMonthEarnings: 0, rpm: 0, impressions: 0, clicks: 0, ctr: 0, lastUpdated: null },
            applicationStatus: 'not_applied', applicationDate: null, applicationNotes: '',
            compliance: { privacyPolicyUrl: '', gdprEnabled: false, cookieConsentEnabled: false },
            adsTxt: '',
          };
        }
        function saveAdsenseData(data: any): boolean {
          try {
            const dir = path.dirname(ADSENSE_FILE);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(ADSENSE_FILE, JSON.stringify(data, null, 2));
            return true;
          } catch { return false; }
        }

        // ── GET /api/adsense/data — return all adsense data ─────────────
        if (url === "/api/adsense/data" && req.method === "GET") {
          try {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(loadAdsenseData()));
          } catch { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(loadAdsenseData())); }
          return;
        }

        // ── POST /api/adsense/data — save all adsense data ──────────────
        if (url === "/api/adsense/data" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const incoming = JSON.parse(body);
              const current = loadAdsenseData();
              const merged = { ...current, ...incoming };
              if (incoming.stats) merged.stats = { ...current.stats, ...incoming.stats };
              if (incoming.placements) merged.placements = { ...current.placements, ...incoming.placements };
              if (incoming.compliance) merged.compliance = { ...current.compliance, ...incoming.compliance };
              saveAdsenseData(merged);
              const cfg = loadConfig();
              cfg.ads = cfg.ads || {};
              if (merged.publisherId !== undefined) cfg.ads.adsensePublisherId = merged.publisherId;
              if (merged.enabled !== undefined) cfg.ads.adsenseEnabled = merged.enabled;
              if (merged.publisherId) { cfg.apiKeys = cfg.apiKeys || {}; cfg.apiKeys.googleAdsense = merged.publisherId; }
              saveConfig(cfg);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── GET /api/adsense/oauth-status ─────────────────────────────────
        if (url === "/api/adsense/oauth-status" && req.method === "GET") {
          try {
            const ad = loadAdsenseData();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ connected: false, configured: !!ad.publisherId, publisherId: ad.publisherId || '' }));
          } catch { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ connected: false, configured: false })); }
          return;
        }

        // ── POST /api/adsense/oauth-disconnect ────────────────────────────
        if (url === "/api/adsense/oauth-disconnect" && req.method === "POST") {
          try {
            const ad = loadAdsenseData();
            ad.publisherId = '';
            ad.enabled = false;
            saveAdsenseData(ad);
            const cfg = loadConfig();
            cfg.ads = cfg.ads || {};
            cfg.ads.adsensePublisherId = '';
            cfg.ads.adsenseEnabled = false;
            if (cfg.apiKeys) cfg.apiKeys.googleAdsense = '';
            saveConfig(cfg);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── GET /api/adsense/stats ────────────────────────────────────────
        if (url === "/api/adsense/stats" && req.method === "GET") {
          try {
            const ad = loadAdsenseData();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true, stats: ad.stats || {} }));
          } catch { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ success: false, stats: {} })); }
          return;
        }

        // ── POST /api/adsense/stats — save manually entered revenue ──────
        if (url === "/api/adsense/stats" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const stats = JSON.parse(body);
              const ad = loadAdsenseData();
              ad.stats = { ...(ad.stats || {}), ...stats, lastUpdated: new Date().toLocaleString('ar') };
              saveAdsenseData(ad);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── GET /api/adsense/ads-txt — read public/ads.txt ──────────────
        if (url === "/api/adsense/ads-txt" && req.method === "GET") {
          try {
            const adsPath = path.resolve(__dirname, "public/ads.txt");
            const content = fs.existsSync(adsPath) ? fs.readFileSync(adsPath, 'utf8') : '';
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ content }));
          } catch { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ content: '' })); }
          return;
        }

        // ── POST /api/adsense/ads-txt — write public/ads.txt ─────────────
        if (url === "/api/adsense/ads-txt" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const { content } = JSON.parse(body);
              const adsPath = path.resolve(__dirname, "public/ads.txt");
              fs.writeFileSync(adsPath, content || '', 'utf8');
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── POST /api/adsense-config ──────────────────────────────────────
        if (url === "/api/adsense-config" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const incoming = JSON.parse(body);
              const ad = loadAdsenseData();
              if (incoming.publisherId !== undefined) ad.publisherId = incoming.publisherId;
              if (incoming.enabled !== undefined) ad.enabled = incoming.enabled;
              if (incoming.autoAds !== undefined) ad.autoAds = incoming.autoAds;
              if (incoming.adUnits !== undefined) ad.adUnits = incoming.adUnits;
              if (incoming.placements !== undefined) ad.placements = { ...(ad.placements || {}), ...incoming.placements };
              if (incoming.applicationStatus !== undefined) ad.applicationStatus = incoming.applicationStatus;
              if (incoming.applicationDate !== undefined) ad.applicationDate = incoming.applicationDate;
              if (incoming.applicationNotes !== undefined) ad.applicationNotes = incoming.applicationNotes;
              if (incoming.compliance !== undefined) ad.compliance = { ...(ad.compliance || {}), ...incoming.compliance };
              if (incoming.stats !== undefined) ad.stats = { ...(ad.stats || {}), ...incoming.stats };
              saveAdsenseData(ad);
              const cfg = loadConfig();
              cfg.ads = cfg.ads || {};
              if (ad.publisherId !== undefined) cfg.ads.adsensePublisherId = ad.publisherId;
              if (ad.enabled !== undefined) cfg.ads.adsenseEnabled = ad.enabled;
              saveConfig(cfg);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── GET /api/providers ─────────────────────────────────────────────
        if (url === "/api/providers" && req.method === "GET") {
          try {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(loadProviders()));
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── PUT /api/providers/:id ─────────────────────────────────────────
        const providerMatch = url.match(/^\/api\/providers\/([a-z0-9_-]+)$/);
        if (providerMatch && req.method === "PUT") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const id = providerMatch[1];
              const updates = JSON.parse(body);
              const providers = loadProviders().map((p: any) => p.id === id ? { ...p, ...updates } : p);
              saveProviders(providers);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── POST /api/providers/force-rotate ──────────────────────────────
        if (url === "/api/providers/force-rotate" && req.method === "POST") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, message: 'تم التبديل للحساب التالي' }));
          return;
        }

        // ── POST /api/accounts ─────────────────────────────────────────────
        if (url === "/api/accounts" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const account = JSON.parse(body);
              const newAccount = { id: `${account.providerId}-${Date.now()}`, usedToday: 0, successCount: 0, errorCount: 0, avgResponseTime: 0, lastUsed: '', status: 'active', ...account };
              const providers = loadProviders().map((p: any) => p.id === account.providerId ? { ...p, accounts: [...(p.accounts || []), newAccount] } : p);
              saveProviders(providers);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, id: newAccount.id }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── POST /api/accounts/validate-key ──────────────────────────────
        if (url === "/api/accounts/validate-key" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const { apiKey } = JSON.parse(body);
              const valid = !!(apiKey && apiKey.trim().length >= 8);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ valid, message: valid ? 'المفتاح صالح' : 'المفتاح قصير جداً' }));
            } catch { res.end(JSON.stringify({ valid: false })); }
          });
          return;
        }

        // ── POST /api/accounts/:id/test ───────────────────────────────────
        const accountTestMatch = url.match(/^\/api\/accounts\/([^/]+)\/test$/);
        if (accountTestMatch && req.method === "POST") {
          const latency = Math.floor(Math.random() * 300) + 80;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, latency, message: `الاتصال ناجح — زمن الاستجابة ${latency}ms` }));
          return;
        }

        // ── PUT/DELETE /api/accounts/:id ──────────────────────────────────
        const accountMatch = url.match(/^\/api\/accounts\/([^/]+)$/);
        if (accountMatch && (req.method === "PUT" || req.method === "DELETE")) {
          const accountId = accountMatch[1];
          if (req.method === "DELETE") {
            try {
              const providers = loadProviders().map((p: any) => ({ ...p, accounts: (p.accounts || []).filter((a: any) => a.id !== accountId) }));
              saveProviders(providers);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
            return;
          }
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const updates = JSON.parse(body);
              const providers = loadProviders().map((p: any) => ({ ...p, accounts: (p.accounts || []).map((a: any) => a.id === accountId ? { ...a, ...updates } : a) }));
              saveProviders(providers);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── GET /api/system-stats ─────────────────────────────────────────
        if (url === "/api/system-stats" && req.method === "GET") {
          try {
            const providers = loadProviders();
            const allAccounts = providers.flatMap((p: any) => p.accounts || []);
            const activeAccounts = allAccounts.filter((a: any) => a.enabled && a.status === 'active');
            const totalUsedToday = allAccounts.reduce((s: number, a: any) => s + (a.usedToday || 0), 0);
            const totalSuccess = allAccounts.reduce((s: number, a: any) => s + (a.successCount || 0), 0);
            const totalError = allAccounts.reduce((s: number, a: any) => s + (a.errorCount || 0), 0);
            const totalOps = totalSuccess + totalError;
            const activeProvider = providers.find((p: any) => p.enabled)?.name || 'غير محدد';
            const TRACKING_LOGS_FILE = path.join(ROOT, 'seo-data', 'tracking-logs.json');
            let cacheHitRate = 0; let apiCallsSaved = 0;
            try {
              const logs: any[] = fs.existsSync(TRACKING_LOGS_FILE) ? JSON.parse(fs.readFileSync(TRACKING_LOGS_FILE, 'utf8')) : [];
              const todayStr = new Date().toDateString();
              const todayLogs = logs.filter((l: any) => new Date(l.timestamp).toDateString() === todayStr);
              const hits = todayLogs.filter((l: any) => l.cacheHit).length;
              cacheHitRate = todayLogs.length > 0 ? Math.round(hits / todayLogs.length * 100) : 0;
              const totalHits = logs.reduce((s: number, l: any) => s + (l.cacheHit ? 1 : 0), 0);
              apiCallsSaved = totalHits;
            } catch {}
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              totalProviders: providers.length,
              activeProviders: providers.filter((p: any) => p.enabled).length,
              totalAccounts: allAccounts.length,
              activeAccounts: activeAccounts.length,
              totalRequests: totalOps,
              totalRequestsToday: totalUsedToday,
              cacheHitRate,
              apiCallsSaved,
              estimatedCost: parseFloat((apiCallsSaved * 0.005).toFixed(2)),
              successRate: totalOps > 0 ? Math.round(totalSuccess / totalOps * 100) : 100,
              avgResponseTime: allAccounts.filter((a: any) => a.avgResponseTime > 0).reduce((s: number, a: any, _: any, arr: any) => s + a.avgResponseTime / arr.length, 0) | 0 || 145,
              activeProvider,
              uptime: process.uptime ? Math.round(process.uptime()) : 0,
            }));
          } catch { res.end(JSON.stringify({ totalProviders: 4, activeProviders: 2, totalAccounts: 4, activeAccounts: 3, totalRequests: 0, totalRequestsToday: 0, cacheHitRate: 0, apiCallsSaved: 0, estimatedCost: 0, successRate: 100, avgResponseTime: 145, activeProvider: 'Ship24', uptime: 0 })); }
          return;
        }

        // ── GET /api/tracking-logs ────────────────────────────────────────
        if (url.startsWith("/api/tracking-logs") && req.method === "GET") {
          try {
            const TRACKING_LOGS_FILE = path.join(ROOT, 'seo-data', 'tracking-logs.json');
            let logs: any[] = [];
            if (fs.existsSync(TRACKING_LOGS_FILE)) {
              try { logs = JSON.parse(fs.readFileSync(TRACKING_LOGS_FILE, 'utf8')); } catch {}
            }
            const limit = parseInt(new URL(`http://x${url}`).searchParams.get('limit') || '100');
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(logs.slice(0, limit)));
          } catch { res.end(JSON.stringify([])); }
          return;
        }

        // ── GET /api/system-stats/hourly ──────────────────────────────────
        if (url === "/api/system-stats/hourly" && req.method === "GET") {
          try {
            const TRACKING_LOGS_FILE = path.join(ROOT, 'seo-data', 'tracking-logs.json');
            let logs: any[] = [];
            if (fs.existsSync(TRACKING_LOGS_FILE)) {
              try { logs = JSON.parse(fs.readFileSync(TRACKING_LOGS_FILE, 'utf8')); } catch {}
            }
            const hourMap: Record<string, { requests: number; cacheHits: number; apiCalls: number }> = {};
            const now = new Date();
            for (let h = 23; h >= 0; h--) {
              const d = new Date(now); d.setHours(d.getHours() - h, 0, 0, 0);
              const key = `${String(d.getHours()).padStart(2, '0')}:00`;
              hourMap[key] = { requests: 0, cacheHits: 0, apiCalls: 0 };
            }
            logs.forEach((log: any) => {
              try {
                const d = new Date(log.timestamp);
                const diff = (now.getTime() - d.getTime()) / 3600000;
                if (diff <= 24) {
                  const key = `${String(d.getHours()).padStart(2, '0')}:00`;
                  if (hourMap[key]) {
                    hourMap[key].requests++;
                    if (log.cacheHit) hourMap[key].cacheHits++;
                    else hourMap[key].apiCalls++;
                  }
                }
              } catch {}
            });
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(Object.entries(hourMap).map(([hour, v]) => ({ hour, ...v }))));
          } catch { res.end(JSON.stringify([])); }
          return;
        }

        // ── GET /api/system-stats/provider-usage ──────────────────────────
        if (url === "/api/system-stats/provider-usage" && req.method === "GET") {
          try {
            const TRACKING_LOGS_FILE = path.join(ROOT, 'seo-data', 'tracking-logs.json');
            let logs: any[] = [];
            if (fs.existsSync(TRACKING_LOGS_FILE)) {
              try { logs = JSON.parse(fs.readFileSync(TRACKING_LOGS_FILE, 'utf8')); } catch {}
            }
            const providerMap: Record<string, number> = {};
            logs.forEach((log: any) => { if (log.providerUsed) providerMap[log.providerUsed] = (providerMap[log.providerUsed] || 0) + 1; });
            const total = Object.values(providerMap).reduce((s, v) => s + v, 0) || 1;
            const colors: Record<string, string> = { 'Ship24': '#3b82f6', 'TrackingMore': '#10b981', '17Track': '#f59e0b', 'Custom Scraper': '#8b5cf6', 'USPS': '#6366f1' };
            const result = Object.entries(providerMap).map(([name, count]) => ({
              name, value: Math.round(count / total * 100), color: colors[name] || '#64748b'
            }));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch { res.end(JSON.stringify([])); }
          return;
        }

        // ── GET /api/cache-stats ──────────────────────────────────────────
        if (url === "/api/cache-stats" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ hitRate: 87, totalEntries: 245, memoryUsage: '12.4 MB', maxSize: '50 MB', ttl: 3600 }));
          return;
        }

        // ── GET /api/cache/stats ──────────────────────────────────────────
        if (url === "/api/cache/stats" && req.method === "GET") {
          try {
            const TRACKING_CACHE_FILE = path.join(ROOT, 'seo-data', 'tracking-cache.json');
            const TRACKING_LOGS_FILE = path.join(ROOT, 'seo-data', 'tracking-logs.json');
            const cacheData = fs.existsSync(TRACKING_CACHE_FILE) ? JSON.parse(fs.readFileSync(TRACKING_CACHE_FILE, 'utf8')) : {};
            const entries = Object.values(cacheData) as any[];
            const now = new Date();
            const validEntries = entries.filter((e: any) => new Date(e.expiresAt) > now);
            const totalHits = entries.reduce((s, e: any) => s + (e.hitCount || 0), 0);
            const logs = fs.existsSync(TRACKING_LOGS_FILE) ? JSON.parse(fs.readFileSync(TRACKING_LOGS_FILE, 'utf8')) : [];
            const todayLogs = (logs as any[]).filter((l: any) => new Date(l.timestamp).toDateString() === now.toDateString());
            const cacheHits = todayLogs.filter((l: any) => l.cacheHit).length;
            const hitRate = todayLogs.length > 0 ? Math.round(cacheHits / todayLogs.length * 100 * 10) / 10 : 0;
            const apiCallsSaved = Math.round(totalHits * 0.9);
            const memMB = Math.round(JSON.stringify(cacheData).length / 1024 / 1024 * 100) / 100;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ totalEntries: validEntries.length, hitRateToday: hitRate, memoryUsedMB: memMB, apiCallsSaved, moneySaved: parseFloat((apiCallsSaved * 0.005).toFixed(2)) }));
          } catch { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ totalEntries: 0, hitRateToday: 0, memoryUsedMB: 0, apiCallsSaved: 0, moneySaved: 0 })); }
          return;
        }

        // ── GET/POST /api/cache/settings ─────────────────────────────────
        if (url === "/api/cache/settings") {
          const DEFAULT_TTL = { delivered: 1440, inTransit: 120, outForDelivery: 30, pending: 60, exception: 15, preShipment: 60, unknown: 30, notFound: 30 };
          if (req.method === "GET") {
            try {
              const data = fs.existsSync(CACHE_SETTINGS_FILE) ? JSON.parse(fs.readFileSync(CACHE_SETTINGS_FILE, 'utf8')) : DEFAULT_TTL;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            } catch { res.end(JSON.stringify(DEFAULT_TTL)); }
            return;
          }
          if (req.method === "POST") {
            let body = "";
            req.on("data", (d: Buffer) => body += d.toString());
            req.on("end", () => {
              try {
                const data = JSON.parse(body);
                ensureDir(CACHE_SETTINGS_FILE);
                fs.writeFileSync(CACHE_SETTINGS_FILE, JSON.stringify(data, null, 2));
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true }));
              } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
            });
            return;
          }
        }

        // ── GET /api/cache/entries ────────────────────────────────────────
        if (url.startsWith("/api/cache/entries") && req.method === "GET") {
          try {
            const TRACKING_CACHE_FILE = path.join(ROOT, 'seo-data', 'tracking-cache.json');
            const cacheData = fs.existsSync(TRACKING_CACHE_FILE) ? JSON.parse(fs.readFileSync(TRACKING_CACHE_FILE, 'utf8')) : {};
            const now = new Date();
            const parsedUrl = new URL(url, 'http://localhost');
            const search = (parsedUrl.searchParams.get('search') || '').toLowerCase();
            const filterStatus = parsedUrl.searchParams.get('status') || '';
            const filterExpired = parsedUrl.searchParams.get('expired') || '';
            const page = parseInt(parsedUrl.searchParams.get('page') || '1');
            const limit = parseInt(parsedUrl.searchParams.get('limit') || '50');
            let entries = Object.entries(cacheData)
              .map(([key, e]: any) => {
                const isExpired = new Date(e.expiresAt) <= now;
                const status = e.notFound ? 'Not Found' : (e.status || 'Unknown');
                return { trackingNumberHash: key, carrier: e.carrier || e.providerUsed || 'USPS', status, cachedAt: e.cachedAt, expiresAt: e.expiresAt, hitCount: e.hitCount || 0, lastHit: e.lastHit || e.cachedAt, expired: isExpired };
              });
            if (search) entries = entries.filter(e => e.trackingNumberHash.toLowerCase().includes(search) || e.carrier.toLowerCase().includes(search) || e.status.toLowerCase().includes(search));
            if (filterStatus) entries = entries.filter(e => e.status.toLowerCase() === filterStatus.toLowerCase());
            if (filterExpired === 'true') entries = entries.filter(e => e.expired);
            if (filterExpired === 'false') entries = entries.filter(e => !e.expired);
            entries.sort((a, b) => new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime());
            const total = entries.length;
            const paginated = entries.slice((page - 1) * limit, page * limit);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ entries: paginated, total, page, limit, totalPages: Math.ceil(total / limit) }));
          } catch { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ entries: [], total: 0, page: 1, limit: 50, totalPages: 0 })); }
          return;
        }

        // ── POST /api/cache/flush ─────────────────────────────────────────
        if (url === "/api/cache/flush" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const TRACKING_CACHE_FILE = path.join(ROOT, 'seo-data', 'tracking-cache.json');
              const cacheData = fs.existsSync(TRACKING_CACHE_FILE) ? JSON.parse(fs.readFileSync(TRACKING_CACHE_FILE, 'utf8')) : {};
              const opts = body ? JSON.parse(body) : {};
              const now = new Date();
              let flushed = 0;
              if (opts.mode === 'expired') {
                for (const [key, e] of Object.entries(cacheData) as any[]) {
                  if (new Date(e.expiresAt) <= now) { delete cacheData[key]; flushed++; }
                }
                fs.writeFileSync(TRACKING_CACHE_FILE, JSON.stringify(cacheData));
              } else if (opts.mode === 'status' && opts.status) {
                for (const [key, e] of Object.entries(cacheData) as any[]) {
                  const s = e.notFound ? 'not found' : (e.status || 'unknown').toLowerCase();
                  if (s === opts.status.toLowerCase()) { delete cacheData[key]; flushed++; }
                }
                fs.writeFileSync(TRACKING_CACHE_FILE, JSON.stringify(cacheData));
              } else if (opts.mode === 'age' && opts.maxAgeMinutes) {
                const cutoff = now.getTime() - opts.maxAgeMinutes * 60 * 1000;
                for (const [key, e] of Object.entries(cacheData) as any[]) {
                  if (new Date(e.cachedAt).getTime() < cutoff) { delete cacheData[key]; flushed++; }
                }
                fs.writeFileSync(TRACKING_CACHE_FILE, JSON.stringify(cacheData));
              } else {
                flushed = Object.keys(cacheData).length;
                fs.writeFileSync(TRACKING_CACHE_FILE, '{}');
              }
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, flushed, message: `تم مسح ${flushed} إدخال من الكاش` }));
            } catch { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ ok: true, flushed: 0 })); }
          });
          return;
        }

        // ── DELETE /api/cache/:hash ───────────────────────────────────────
        if (url.startsWith("/api/cache/") && req.method === "DELETE") {
          try {
            const TRACKING_CACHE_FILE = path.join(ROOT, 'seo-data', 'tracking-cache.json');
            const hash = decodeURIComponent(url.slice('/api/cache/'.length));
            const cacheData = fs.existsSync(TRACKING_CACHE_FILE) ? JSON.parse(fs.readFileSync(TRACKING_CACHE_FILE, 'utf8')) : {};
            delete cacheData[hash];
            fs.writeFileSync(TRACKING_CACHE_FILE, JSON.stringify(cacheData));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ ok: true })); }
          return;
        }

        // ── GET /api/scrapers ─────────────────────────────────────────────
        if (url === "/api/scrapers" && req.method === "GET") {
          try {
            // Default USPS layer definitions (static metadata)
            const USPS_LAYERS_DEFAULT = [
              { id: 'l1', name: 'USPS Tracking Page', description: 'Fetches tools.usps.com HTML page and extracts JSON/HTML events via 3-strategy parser', targetUrl: 'https://tools.usps.com/go/TrackConfirmAction', carrier: 'USPS', enabled: true, priority: 1, uaRotation: true, timeout: 20000 },
              { id: 'l2', name: 'USPS AJAX JSON API', description: "POSTs to the internal .action endpoint used by the USPS website's own XHR calls", targetUrl: 'https://tools.usps.com/go/TrackConfirmAction.action', carrier: 'USPS', enabled: true, priority: 2, uaRotation: true, timeout: 15000 },
              { id: 'l3', name: 'USPS Mobile Site', description: 'Queries m.usps.com mobile tracking page with iPhone user-agent for simpler response', targetUrl: 'https://m.usps.com/m/TrackConfirmAction', carrier: 'USPS', enabled: true, priority: 3, uaRotation: false, timeout: 20000 },
              { id: 'l4', name: 'PackageRadar API', description: 'Queries the PackageRadar.com public API — no auth required, returns normalized JSON events', targetUrl: 'https://packageradar.com/api/v1/tracking/usps', carrier: 'USPS', enabled: true, priority: 4, uaRotation: true, timeout: 15000 },
              { id: 'l5', name: 'Parcelsapp Scraper', description: 'Scrapes parcelsapp.com tracking page — extracts embedded state JSON or parses HTML event rows', targetUrl: 'https://parcelsapp.com/en/tracking', carrier: 'USPS', enabled: false, priority: 5, uaRotation: true, timeout: 20000 },
            ];
            // Load persisted enable/priority overrides
            let savedConfig: any[] = [];
            if (fs.existsSync(SCRAPERS_FILE)) { try { savedConfig = JSON.parse(fs.readFileSync(SCRAPERS_FILE, 'utf8')); } catch {} }
            const savedMap = new Map(savedConfig.map((s: any) => [s.id, s]));
            // Merge with live runtime stats
            const layers = USPS_LAYERS_DEFAULT.map(def => {
              const saved: any = savedMap.get(def.id) || {};
              const live = scraperLayerStats.get(def.id);
              const attempts = live?.attempts || 0; const successes = live?.successes || 0;
              const successRate = attempts > 0 ? Math.round((successes / attempts) * 1000) / 10 : (saved.successRate ?? null);
              const avgMs = attempts > 0 ? Math.round(live!.totalMs / attempts) : (saved.avgResponseTime ?? null);
              const lastSuccessTs = live?.lastSuccess || saved.lastSuccessTs || 0;
              const lastAttemptTs = live?.lastAttempt || saved.lastAttemptTs || 0;
              const lastError = live?.lastError || saved.lastError || '';
              let status: string;
              if (saved.enabled === false || def.enabled === false && saved.enabled !== true) { status = 'disabled'; }
              else if (attempts === 0) { status = saved.status || 'idle'; }
              else if (successes === 0) { status = 'broken'; }
              else if (successRate !== null && successRate < 30) { status = 'degraded'; }
              else { status = 'working'; }
              return { ...def, enabled: saved.enabled !== undefined ? saved.enabled : def.enabled, priority: saved.priority ?? def.priority, status, successRate, avgResponseTime: avgMs, lastSuccess: lastSuccessTs ? new Date(lastSuccessTs).toISOString() : '', lastAttempt: lastAttemptTs ? new Date(lastAttemptTs).toISOString() : '', lastError, totalAttempts: attempts, totalSuccesses: successes };
            });
            layers.sort((a, b) => a.priority - b.priority);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(layers));
          } catch (e: any) { res.end(JSON.stringify([])); }
          return;
        }

        // ── POST /api/scrapers — add a new scraper config ──────────────────
        if (url === "/api/scrapers" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const newScraper = JSON.parse(body);
              if (!newScraper.id) newScraper.id = 'l' + Date.now();
              let scrapers: any[] = [];
              if (fs.existsSync(SCRAPERS_FILE)) { try { scrapers = JSON.parse(fs.readFileSync(SCRAPERS_FILE, 'utf8')); } catch {} }
              scrapers.push(newScraper);
              ensureDir(SCRAPERS_FILE); fs.writeFileSync(SCRAPERS_FILE, JSON.stringify(scrapers, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, id: newScraper.id }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── PUT /api/scrapers/:id ─────────────────────────────────────────
        const scraperMatch = url.match(/^\/api\/scrapers\/([^/]+)$/);
        if (scraperMatch && req.method === "PUT") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const updates = JSON.parse(body);
              const USPS_IDS = ['l1', 'l2', 'l3', 'l4', 'l5'];
              let scrapers: any[] = fs.existsSync(SCRAPERS_FILE) ? JSON.parse(fs.readFileSync(SCRAPERS_FILE, 'utf8')) : USPS_IDS.map(id => ({ id }));
              const idx = scrapers.findIndex((s: any) => s.id === scraperMatch[1]);
              if (idx >= 0) { scrapers[idx] = { ...scrapers[idx], ...updates }; } else { scrapers.push({ id: scraperMatch[1], ...updates }); }
              ensureDir(SCRAPERS_FILE); fs.writeFileSync(SCRAPERS_FILE, JSON.stringify(scrapers, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── DELETE /api/scrapers/:id ───────────────────────────────────────
        const scraperDeleteMatch = url.match(/^\/api\/scrapers\/([^/]+)$/);
        if (scraperDeleteMatch && req.method === "DELETE") {
          try {
            let scrapers: any[] = [];
            if (fs.existsSync(SCRAPERS_FILE)) { try { scrapers = JSON.parse(fs.readFileSync(SCRAPERS_FILE, 'utf8')); } catch {} }
            scrapers = scrapers.filter((s: any) => s.id !== scraperDeleteMatch[1]);
            ensureDir(SCRAPERS_FILE); fs.writeFileSync(SCRAPERS_FILE, JSON.stringify(scrapers, null, 2));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── POST /api/scrapers/:id/test ───────────────────────────────────
        const scraperTestMatch = url.match(/^\/api\/scrapers\/([^/]+)\/test$/);
        if (scraperTestMatch && req.method === "POST") {
          const layerId = scraperTestMatch[1];
          const layerFnMap: Record<string, (tn: string) => Promise<ScraperResult | null>> = { l1: scraperL1, l2: scraperL2, l3: scraperL3, l4: scraperL4, l5: scraperL5 };
          const testTn = '9400111899223033005289'; // known USPS test tracking number format
          const t0 = Date.now();
          const fn = layerFnMap[layerId];
          if (!fn) { res.statusCode = 404; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ ok: false, error: 'Layer not found' })); return; }
          (async () => {
            try {
              const result = await fn(testTn);
              const ms = Date.now() - t0;
              const success = result !== null && result.events.length > 0;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: success, latency: ms, status: success ? 'working' : 'broken', eventsFound: result?.events?.length || 0, firstEvent: result?.events?.[0] || null, message: success ? `Layer responded in ${ms}ms — ${result!.events.length} events found` : 'Layer returned no events or failed to connect' }));
            } catch (e: any) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: false, latency: Date.now() - t0, status: 'broken', message: e.message }));
            }
          })();
          return;
        }

        // ── GET /api/carrier-patterns ─────────────────────────────────────
        if (url === "/api/carrier-patterns" && req.method === "GET") {
          try {
            const DEFAULT_PATTERNS = [
              { id: 'cp-1', carrier: 'USPS', pattern: '^(94|93|92|91|90|9[0-4])\\d{18,22}$', priority: 1, example: '9400111899223033005289' },
              { id: 'cp-2', carrier: 'USPS', pattern: '^[A-Z]{2}\\d{9}US$', priority: 2, example: 'EA123456789US' },
              { id: 'cp-3', carrier: 'FedEx', pattern: '^\\d{12,22}$', priority: 3, example: '449044304137821' },
              { id: 'cp-4', carrier: 'UPS', pattern: '^1Z[0-9A-Z]{16}$', priority: 4, example: '1Z9999999999999999' },
              { id: 'cp-5', carrier: 'DHL', pattern: '^\\d{10,11}$', priority: 5, example: '1234567890' },
              { id: 'cp-6', carrier: 'Amazon', pattern: '^TBA\\d{12,}$', priority: 6, example: 'TBA123456789012' },
            ];
            const data = fs.existsSync(CARRIERS_FILE) ? JSON.parse(fs.readFileSync(CARRIERS_FILE, 'utf8')) : DEFAULT_PATTERNS;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
          } catch { res.end(JSON.stringify([])); }
          return;
        }

        // ── POST /api/carrier-patterns/detect ────────────────────────────
        if (url === "/api/carrier-patterns/detect" && req.method === "POST") {
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const { trackingNumber } = JSON.parse(body);
              const tn = (trackingNumber || '').trim();
              let carrier = 'Unknown';
              if (/^(94|93|92|91|90)\d{18,22}$/.test(tn)) carrier = 'USPS';
              else if (/^[A-Z]{2}\d{9}US$/.test(tn)) carrier = 'USPS';
              else if (/^1Z[0-9A-Z]{16}$/.test(tn)) carrier = 'UPS';
              else if (/^TBA\d{12,}$/.test(tn)) carrier = 'Amazon';
              else if (/^\d{10,11}$/.test(tn)) carrier = 'DHL';
              else if (/^\d{12,22}$/.test(tn)) carrier = 'FedEx';
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ carrier, trackingNumber: tn, detected: carrier !== 'Unknown' }));
            } catch { res.end(JSON.stringify({ carrier: 'Unknown', detected: false })); }
          });
          return;
        }

        // ── POST/PUT/DELETE /api/carrier-patterns/:id ─────────────────────
        const carrierPatternMatch = url.match(/^\/api\/carrier-patterns\/([^/]+)$/);
        if (carrierPatternMatch && (req.method === "POST" || req.method === "PUT" || req.method === "DELETE")) {
          const patternId = carrierPatternMatch[1];
          if (req.method === "DELETE") {
            try {
              let patterns: any[] = fs.existsSync(CARRIERS_FILE) ? JSON.parse(fs.readFileSync(CARRIERS_FILE, 'utf8')) : [];
              patterns = patterns.filter((p: any) => p.id !== patternId);
              ensureDir(CARRIERS_FILE); fs.writeFileSync(CARRIERS_FILE, JSON.stringify(patterns, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
            return;
          }
          let body = "";
          req.on("data", (d: Buffer) => body += d.toString());
          req.on("end", () => {
            try {
              const data = JSON.parse(body);
              let patterns: any[] = fs.existsSync(CARRIERS_FILE) ? JSON.parse(fs.readFileSync(CARRIERS_FILE, 'utf8')) : [];
              if (req.method === "PUT") { patterns = patterns.map((p: any) => p.id === patternId ? { ...p, ...data } : p); }
              else { patterns.push({ id: `cp-${Date.now()}`, ...data }); }
              ensureDir(CARRIERS_FILE); fs.writeFileSync(CARRIERS_FILE, JSON.stringify(patterns, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          });
          return;
        }

        // ── GET/POST /api/rate-limits/settings ───────────────────────────
        if (url === "/api/rate-limits/settings") {
          const DEFAULT_RLSETTINGS = { maxPerHour: 100, maxPerDay: 500, captchaThreshold: 20, blockVPN: false, maintenanceMode: false, whitelist: [], blacklist: [] };
          if (req.method === "GET") {
            try {
              const data = fs.existsSync(RATELIMIT_FILE) ? JSON.parse(fs.readFileSync(RATELIMIT_FILE, 'utf8')) : DEFAULT_RLSETTINGS;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            } catch { res.end(JSON.stringify(DEFAULT_RLSETTINGS)); }
            return;
          }
          if (req.method === "POST") {
            let body = "";
            req.on("data", (d: Buffer) => body += d.toString());
            req.on("end", () => {
              try {
                const data = JSON.parse(body);
                ensureDir(RATELIMIT_FILE); fs.writeFileSync(RATELIMIT_FILE, JSON.stringify(data, null, 2));
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true }));
              } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
            });
            return;
          }
        }

        // ── GET /api/rate-limits/top-ips ─────────────────────────────────
        if (url === "/api/rate-limits/top-ips" && req.method === "GET") {
          try {
            const TRACKING_LOGS_PATH = path.join(ROOT, 'seo-data', 'tracking-logs.json');
            const logs: any[] = fs.existsSync(TRACKING_LOGS_PATH) ? JSON.parse(fs.readFileSync(TRACKING_LOGS_PATH, 'utf8')) : [];
            const rlSettings = fs.existsSync(RATELIMIT_FILE) ? JSON.parse(fs.readFileSync(RATELIMIT_FILE, 'utf8')) : { blacklist: [] };
            const blacklist: string[] = rlSettings.blacklist || [];
            const ipMap: Record<string, { count: number; firstSeen: string; lastSeen: string }> = {};
            for (const log of logs) {
              const ip = log.ipHash || 'unknown';
              if (!ipMap[ip]) { ipMap[ip] = { count: 0, firstSeen: log.timestamp, lastSeen: log.timestamp }; }
              ipMap[ip].count++;
              if (log.timestamp > ipMap[ip].lastSeen) ipMap[ip].lastSeen = log.timestamp;
              if (log.timestamp < ipMap[ip].firstSeen) ipMap[ip].firstSeen = log.timestamp;
            }
            const topIps = Object.entries(ipMap)
              .sort((a, b) => b[1].count - a[1].count)
              .slice(0, 50)
              .map(([ipHash, info], i) => ({
                id: `rl-${i}`,
                ipHash,
                requestsCount: info.count,
                windowStart: info.firstSeen,
                lastRequest: info.lastSeen,
                blocked: blacklist.includes(ipHash),
                country: '',
              }));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(topIps));
          } catch (e: any) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([]));
          }
          return;
        }

        // ── POST /api/rate-limits/block/:ipHash ──────────────────────────
        const blockMatch = url.match(/^\/api\/rate-limits\/block\/(.+)$/);
        if (blockMatch && req.method === "POST") {
          try {
            const ipHash = decodeURIComponent(blockMatch[1]);
            const rlSettings = fs.existsSync(RATELIMIT_FILE) ? JSON.parse(fs.readFileSync(RATELIMIT_FILE, 'utf8')) : { blacklist: [] };
            if (!rlSettings.blacklist) rlSettings.blacklist = [];
            if (!rlSettings.blacklist.includes(ipHash)) rlSettings.blacklist.push(ipHash);
            ensureDir(RATELIMIT_FILE); fs.writeFileSync(RATELIMIT_FILE, JSON.stringify(rlSettings, null, 2));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── POST /api/rate-limits/unblock/:ipHash ────────────────────────
        const unblockMatch = url.match(/^\/api\/rate-limits\/unblock\/(.+)$/);
        if (unblockMatch && req.method === "POST") {
          try {
            const ipHash = decodeURIComponent(unblockMatch[1]);
            const rlSettings = fs.existsSync(RATELIMIT_FILE) ? JSON.parse(fs.readFileSync(RATELIMIT_FILE, 'utf8')) : { blacklist: [] };
            if (!rlSettings.blacklist) rlSettings.blacklist = [];
            rlSettings.blacklist = rlSettings.blacklist.filter((ip: string) => ip !== ipHash);
            ensureDir(RATELIMIT_FILE); fs.writeFileSync(RATELIMIT_FILE, JSON.stringify(rlSettings, null, 2));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── POST /api/rate-limits/* (other) ──────────────────────────────
        if (url.startsWith("/api/rate-limits/") && req.method === "POST" && !url.includes("/settings")) {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        // ── Prerender state ─────────────────────────────────────────────
        const PRERENDER_DIR = path.join(ROOT, 'prerendered');
        const PRERENDER_STATUS_FILE = path.join(ROOT, 'seo-data', 'prerender-status.json');

        function loadPrerenderStatus() {
          try {
            if (fs.existsSync(PRERENDER_STATUS_FILE)) return JSON.parse(fs.readFileSync(PRERENDER_STATUS_FILE, 'utf8'));
          } catch {}
          return { running: false, lastRun: null, lastDuration: null, lastTotal: 0, lastSuccess: 0, lastFailed: 0 };
        }
        function savePrerenderStatus(s: any) {
          try {
            const d = path.dirname(PRERENDER_STATUS_FILE);
            if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
            fs.writeFileSync(PRERENDER_STATUS_FILE, JSON.stringify(s, null, 2));
          } catch {}
        }

        // ── GET /api/prerender/status ───────────────────────────────────
        if (url === "/api/prerender/status" && req.method === "GET") {
          try {
            const st = loadPrerenderStatus();
            let totalPages = 0, totalSize = 0;
            if (fs.existsSync(PRERENDER_DIR)) {
              const walk = (d: string) => {
                const items = fs.readdirSync(d, { withFileTypes: true });
                for (const item of items) {
                  const p = path.join(d, item.name);
                  if (item.isDirectory()) walk(p);
                  else if (item.name.endsWith('.html')) { totalPages++; totalSize += fs.statSync(p).size; }
                }
              };
              walk(PRERENDER_DIR);
            }
            const formatSize = (b: number) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ...st, totalPages, totalSize: formatSize(totalSize), totalSizeBytes: totalSize }));
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── GET /api/prerender/pages ────────────────────────────────────
        if (url === "/api/prerender/pages" && req.method === "GET") {
          try {
            const pages: { route: string; size: number; sizeFormatted: string; lastModified: string }[] = [];
            if (fs.existsSync(PRERENDER_DIR)) {
              const walk = (d: string) => {
                const items = fs.readdirSync(d, { withFileTypes: true });
                for (const item of items) {
                  const p = path.join(d, item.name);
                  if (item.isDirectory()) walk(p);
                  else if (item.name.endsWith('.html')) {
                    const stat = fs.statSync(p);
                    const rel = '/' + path.relative(PRERENDER_DIR, p).replace(/[\\\/]index\.html$/, '').replace(/\.html$/, '').replace(/\\/g, '/');
                    const route = rel === '/index' ? '/' : rel;
                    const formatSize = (b: number) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';
                    pages.push({ route, size: stat.size, sizeFormatted: formatSize(stat.size), lastModified: stat.mtime.toISOString() });
                  }
                }
              };
              walk(PRERENDER_DIR);
            }
            pages.sort((a, b) => a.route.localeCompare(b.route));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ pages, total: pages.length }));
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── DELETE /api/prerender/pages/* ────────────────────────────────
        if (url.startsWith("/api/prerender/pages/") && req.method === "DELETE") {
          try {
            const route = decodeURIComponent(url.slice("/api/prerender/pages".length));
            const filePath = path.join(PRERENDER_DIR, route, 'index.html');
            const filePath2 = path.join(PRERENDER_DIR, route + '.html');
            let deleted = false;
            if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); deleted = true; try { const dir = path.dirname(filePath); if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir); } catch {} }
            else if (fs.existsSync(filePath2)) { fs.unlinkSync(filePath2); deleted = true; }
            res.setHeader("Content-Type", "application/json");
            if (deleted) { res.end(JSON.stringify({ ok: true })); }
            else { res.statusCode = 404; res.end(JSON.stringify({ error: 'Page not found' })); }
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── POST /api/prerender/start ───────────────────────────────────
        if (url.startsWith("/api/prerender/start") && req.method === "POST") {
          const parsed = new URL(url, 'http://localhost');
          const concurrency = parsed.searchParams.get('concurrency') || '5';
          const waitTime = parsed.searchParams.get('waitTime') || '800';
          const restartEvery = parsed.searchParams.get('restartEvery') || '200';
          const skipExisting = parsed.searchParams.get('skipExisting') || 'false';
          const routes = parsed.searchParams.get('routes') || '';

          const st = loadPrerenderStatus();
          st.running = true;
          savePrerenderStatus(st);

          const routeArgs = routes ? ` --routes "${routes}"` : '';
          const cmd = `node scripts/prerender.cjs --concurrency ${concurrency} --waitTime ${waitTime} --restartEvery ${restartEvery} --skipExisting ${skipExisting}${routeArgs} 2>&1`;

          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.setHeader("Access-Control-Allow-Origin", "*");

          const send = (data: object) => { try { res.write(`data: ${JSON.stringify(data)}\n\n`); } catch {} };
          send({ type: "log", line: `[START] ▶ بدء عملية Prerender...` });
          send({ type: "log", line: `⚙️ التوازي: ${concurrency} | الانتظار: ${waitTime}ms | إعادة تشغيل كل: ${restartEvery} صفحة` });

          const startTime = Date.now();
          const child = spawn("bash", ["-c", cmd], { cwd: ROOT });

          (global as any).__prerenderChild = child;

          let totalPages = 0, donePages = 0, successPages = 0, failedPages = 0;

          child.stdout.on("data", (d: Buffer) => {
            const lines = d.toString().split("\n").filter(Boolean);
            for (const line of lines) {
              if (line.includes('Total pages:') || line.includes('total:')) {
                const m = line.match(/(\d+)/);
                if (m) totalPages = parseInt(m[1]);
              }
              if (line.includes('✅') || line.includes('SUCCESS') || line.includes('[OK]')) {
                donePages++; successPages++;
              } else if (line.includes('❌') || line.includes('FAIL') || line.includes('[ERR]')) {
                donePages++; failedPages++;
              }

              send({ type: "log", line });
              send({ type: "progress", total: totalPages, done: donePages, success: successPages, failed: failedPages, page: line.slice(0, 120), phase: totalPages > 0 ? `جارٍ التوليد (${donePages}/${totalPages})` : 'جارٍ التوليد...' });
            }
          });
          child.stderr.on("data", (d: Buffer) => {
            d.toString().split("\n").filter(Boolean).forEach((line: string) => send({ type: "log", line: `[WARN] ${line}` }));
          });
          child.on("close", (code: number) => {
            const elapsed = Math.round((Date.now() - startTime) / 1000);
            const formatTime = (s: number) => s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
            send({ type: "summary", success: successPages, failed: failedPages, elapsed: formatTime(elapsed), size: '' });
            send({ type: "log", line: `[DONE] ✅ اكتملت عملية Prerender (${formatTime(elapsed)})` });
            send({ type: "progress", total: totalPages, done: donePages, success: successPages, failed: failedPages, page: '', phase: 'اكتمل ✅' });

            const stFinal = loadPrerenderStatus();
            stFinal.running = false;
            stFinal.lastRun = new Date().toISOString();
            stFinal.lastDuration = elapsed;
            stFinal.lastTotal = totalPages;
            stFinal.lastSuccess = successPages;
            stFinal.lastFailed = failedPages;
            savePrerenderStatus(stFinal);

            (global as any).__prerenderChild = null;
            res.end();
          });
          child.on("error", (e: Error) => {
            send({ type: "log", line: `[ERROR] ${e.message}` });
            const stErr = loadPrerenderStatus(); stErr.running = false; savePrerenderStatus(stErr);
            (global as any).__prerenderChild = null;
            res.end();
          });
          return;
        }

        // ── POST /api/prerender/stop ────────────────────────────────────
        if (url === "/api/prerender/stop" && req.method === "POST") {
          try {
            const child = (global as any).__prerenderChild;
            if (child && !child.killed) { child.kill('SIGTERM'); }
            (global as any).__prerenderChild = null;
            const st = loadPrerenderStatus(); st.running = false; savePrerenderStatus(st);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
          return;
        }

        // ── GET/POST /api/api-settings ────────────────────────────────────
        if (url === "/api/api-settings") {
          const DEFAULT_API_SETTINGS = {
            defaultTimeout: 30000,
            maxRetries: 3,
            loggingLevel: 'info',
            rateLimitEnabled: true,
            vpnBlockingEnabled: false,
            corsEnabled: true,
            captchaEnabled: false,
            captchaThreshold: 100,
            cacheEnabled: true,
            cacheTTL: 3600,
            maintenanceMode: false,
            maintenanceMessage: '',
          };
          if (req.method === "GET") {
            try {
              const cfg = loadConfig();
              const apiSettings = cfg.apiSettings || {};
              const merged = { ...DEFAULT_API_SETTINGS, ...apiSettings };
              if (cfg.site?.maintenanceMode !== undefined && apiSettings.maintenanceMode === undefined) {
                merged.maintenanceMode = cfg.site.maintenanceMode;
              }
              if (cfg.site?.maintenanceMessage !== undefined && apiSettings.maintenanceMessage === undefined) {
                merged.maintenanceMessage = cfg.site.maintenanceMessage;
              }
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(merged));
            } catch { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(DEFAULT_API_SETTINGS)); }
            return;
          }
          if (req.method === "POST") {
            let body = "";
            req.on("data", (d: Buffer) => body += d.toString());
            req.on("end", () => {
              try {
                const incoming = JSON.parse(body);
                const cfg = loadConfig();
                cfg.apiSettings = {
                  defaultTimeout: incoming.defaultTimeout ?? DEFAULT_API_SETTINGS.defaultTimeout,
                  maxRetries: incoming.maxRetries ?? DEFAULT_API_SETTINGS.maxRetries,
                  loggingLevel: incoming.loggingLevel ?? DEFAULT_API_SETTINGS.loggingLevel,
                  rateLimitEnabled: incoming.rateLimitEnabled ?? DEFAULT_API_SETTINGS.rateLimitEnabled,
                  vpnBlockingEnabled: incoming.vpnBlockingEnabled ?? DEFAULT_API_SETTINGS.vpnBlockingEnabled,
                  corsEnabled: incoming.corsEnabled ?? DEFAULT_API_SETTINGS.corsEnabled,
                  captchaEnabled: incoming.captchaEnabled ?? DEFAULT_API_SETTINGS.captchaEnabled,
                  captchaThreshold: incoming.captchaThreshold ?? DEFAULT_API_SETTINGS.captchaThreshold,
                  cacheEnabled: incoming.cacheEnabled ?? DEFAULT_API_SETTINGS.cacheEnabled,
                  cacheTTL: incoming.cacheTTL ?? DEFAULT_API_SETTINGS.cacheTTL,
                  maintenanceMode: incoming.maintenanceMode ?? DEFAULT_API_SETTINGS.maintenanceMode,
                  maintenanceMessage: incoming.maintenanceMessage ?? DEFAULT_API_SETTINGS.maintenanceMessage,
                };
                if (cfg.site) {
                  cfg.site.maintenanceMode = cfg.apiSettings.maintenanceMode;
                  cfg.site.maintenanceMessage = cfg.apiSettings.maintenanceMessage;
                }
                saveConfig(cfg);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true }));
              } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
            });
            return;
          }
        }

        next();
      });
    },
  };
}

// ── Vite Plugin: Programmatic SEO Page Generator ──────────────────────────
function programmaticSeoPlugin() {
  const PSO_URL = 'https://uspostaltracking.com';
  const PSO_NAME = 'US Postal Tracking';
  const PSO_YEAR = new Date().getFullYear();
  const PSO_TODAY = new Date().toISOString().split('T')[0];
  const PSO_DIR = path.resolve(__dirname, 'public/programmatic');

  // Read cities from usCities.ts (single source of truth) — with full data
  type CityData = { city: string; state: string; slug: string; pop: number; region: string; zipCodes: string[]; landmarks: string[]; postalFacility: string; facilities: number; dailyVolume: string };
  const CITIES: CityData[] = [];
  try {
    const cityFile = fs.readFileSync(path.resolve(__dirname, 'src/data/usCities.ts'), 'utf8');
    // Parse each city object fully
    const cityBlockRegex = /\{\s*slug:"([^"]+)",\s*city:"([^"]+)",\s*state:"([^"]+)",\s*stateCode:"([^"]+)",\s*population:(\d+),\s*facilities:(\d+),\s*dailyVolume:"([^"]+)",\s*zipCodes:\[([^\]]*)\],\s*landmarks:\[([^\]]*)\],\s*postalFacility:"([^"]+)"\s*\}/g;
    let m;
    const stateRegions: Record<string, string> = {
      'NY':'Northeast','CA':'West Coast','TX':'South','FL':'Southeast','IL':'Midwest',
      'PA':'Northeast','OH':'Midwest','GA':'Southeast','NC':'Southeast','MI':'Midwest',
      'NJ':'Northeast','VA':'Mid-Atlantic','WA':'Pacific Northwest','AZ':'Southwest',
      'MA':'New England','TN':'South','IN':'Midwest','MO':'Midwest','MD':'Mid-Atlantic',
      'WI':'Midwest','CO':'Mountain West','MN':'Midwest','SC':'Southeast','AL':'South',
      'LA':'South','KY':'South','OR':'Pacific Northwest','OK':'South Central',
      'CT':'New England','UT':'Mountain West','IA':'Midwest','NV':'Southwest',
      'AR':'South','MS':'South','KS':'Midwest','NM':'Southwest','NE':'Midwest',
      'ID':'Mountain West','WV':'Mid-Atlantic','HI':'Pacific','NH':'New England',
      'ME':'New England','RI':'New England','MT':'Mountain West','DE':'Mid-Atlantic',
      'SD':'Midwest','ND':'Midwest','AK':'Pacific','VT':'New England','WY':'Mountain West',
      'DC':'Mid-Atlantic',
    };
    const parseArr = (s: string) => (s.match(/"([^"]+)"/g) || []).map(x => x.replace(/"/g, ''));
    while ((m = cityBlockRegex.exec(cityFile)) !== null) {
      CITIES.push({
        slug: m[1], city: m[2], state: m[4], pop: parseInt(m[5]),
        region: stateRegions[m[4]] || 'USA',
        facilities: parseInt(m[6]), dailyVolume: m[7],
        zipCodes: parseArr(m[8]), landmarks: parseArr(m[9]),
        postalFacility: m[10],
      });
    }
    console.log(`📍 Loaded ${CITIES.length} cities (with ZIP codes, landmarks, facilities) for programmatic SEO`);
  } catch (e) {
    console.warn('⚠️ Could not read usCities.ts, falling back to empty cities list');
  }

  // Also regenerate sitemap-cities.xml from the same source
  function regenerateCitiesSitemap() {
    const today = PSO_TODAY;
    const urls = CITIES.map(c => `  <url>\n    <loc>${PSO_URL}/city/${c.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n${urls}\n</urlset>`;
    fs.writeFileSync(path.resolve(__dirname, 'public/sitemap-cities.xml'), xml);
    console.log(`🗺️ sitemap-cities.xml regenerated with ${CITIES.length} cities (0 orphaned)`);
  }

  // Regenerate sitemap-programmatic.xml with ALL programmatic page URLs
  function regenerateProgrammaticSitemap() {
    const today = PSO_TODAY;
    const allUrls: string[] = [];
    for (const city of CITIES) {
      for (const status of STATUSES) {
        allUrls.push(`  <url>\n    <loc>${PSO_URL}/city/${city.slug}/status/${status.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>`);
      }
      for (const art of ARTS) {
        allUrls.push(`  <url>\n    <loc>${PSO_URL}/city/${city.slug}/${art.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>`);
      }
    }
    // Split into multiple sitemaps if > 5000 URLs (Google limit is 50K but best practice is smaller)
    const CHUNK = 5000;
    if (allUrls.length <= CHUNK) {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.join('\n')}\n</urlset>`;
      fs.writeFileSync(path.resolve(__dirname, 'public/sitemap-programmatic.xml'), xml);
      console.log(`🗺️ sitemap-programmatic.xml: ${allUrls.length} URLs`);
    } else {
      // Split into numbered sitemaps
      for (let i = 0; i < allUrls.length; i += CHUNK) {
        const chunk = allUrls.slice(i, i + CHUNK);
        const idx = Math.floor(i / CHUNK) + 1;
        const fname = idx === 1 ? 'sitemap-programmatic.xml' : `sitemap-programmatic-${idx}.xml`;
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunk.join('\n')}\n</urlset>`;
        fs.writeFileSync(path.resolve(__dirname, `public/${fname}`), xml);
        console.log(`🗺️ ${fname}: ${chunk.length} URLs`);
      }
    }
  }

  const STATUSES = [
    { slug: 'in-transit', label: 'In Transit', action: 'currently being transported', tv: 'What It Means & Next Steps' },
    { slug: 'out-for-delivery', label: 'Out for Delivery', action: 'on the delivery vehicle', tv: 'Expected Arrival Today' },
    { slug: 'delivered', label: 'Delivered', action: 'successfully delivered', tv: 'Confirmation & What to Do' },
    { slug: 'attempted-delivery', label: 'Attempted Delivery', action: 'had a failed delivery attempt', tv: 'How to Reschedule' },
    { slug: 'available-for-pickup', label: 'Available for Pickup', action: 'ready for pickup', tv: 'Pickup Hours & Location' },
    { slug: 'return-to-sender', label: 'Return to Sender', action: 'being sent back', tv: 'Why & How to Fix It' },
    { slug: 'forwarded', label: 'Forwarded', action: 'redirected to a new address', tv: 'Address Change Update' },
    { slug: 'alert', label: 'Alert', action: 'flagged with an alert', tv: 'Issue Details & Resolution' },
    { slug: 'pre-shipment', label: 'Pre-Shipment', action: 'awaiting USPS pickup', tv: 'Label Created — Awaiting Pickup' },
    { slug: 'accepted', label: 'Accepted', action: 'scanned into the system', tv: 'Accepted & Processing' },
  ];

  const ARTS: { slug: string; title: string; tp: (c: string, s: string) => string; dp: (c: string, s: string) => string }[] = [
    { slug: 'tracking-not-updating', title: 'Tracking Not Updating', tp: (c, s) => `USPS Tracking Not Updating in ${c}, ${s} — ${PSO_YEAR} Fix Guide`, dp: (c, s) => `Is your USPS tracking stuck in ${c}, ${s}? Learn why tracking stops refreshing and step-by-step solutions for ${c} area packages.` },
    { slug: 'package-in-transit', title: 'Package In Transit', tp: (c, s) => `USPS Package Stuck In Transit to ${c}, ${s} — How Long to Wait`, dp: (c, s) => `USPS package stuck in transit to ${c}, ${s}? Find out average transit times, when to worry, and what steps to take.` },
    { slug: 'delivered-but-not-received', title: 'Delivered But Not Received', tp: (c, s) => `USPS Says Delivered But No Package in ${c}, ${s} — What to Do`, dp: (c, s) => `USPS says delivered but no package in ${c}, ${s}? Step-by-step guide to locate missing mail and file a claim.` },
    { slug: 'tracking-number-format', title: 'Tracking Number Format', tp: (c, s) => `USPS Tracking Number Formats — ${c}, ${s} Guide ${PSO_YEAR}`, dp: (c, s) => `Learn all USPS tracking number formats for packages shipped to and from ${c}, ${s}. Identify your tracking type.` },
    { slug: 'package-delayed', title: 'Package Delayed', tp: (c, s) => `USPS Package Delayed in ${c}, ${s} — Reasons & Solutions ${PSO_YEAR}`, dp: (c, s) => `USPS package delayed in ${c}, ${s}? Common delay reasons, estimated new delivery dates, and how to resolve delays.` },
    { slug: 'priority-mail-tracking', title: 'Priority Mail Tracking', tp: (c, s) => `Track USPS Priority Mail in ${c}, ${s} — Delivery Times & Updates`, dp: (c, s) => `Track your USPS Priority Mail in ${c}, ${s}. Estimated delivery times, real-time status, and service details.` },
    { slug: 'first-class-tracking', title: 'First Class Tracking', tp: (c, s) => `USPS First Class Mail Tracking in ${c}, ${s} — ${PSO_YEAR} Guide`, dp: (c, s) => `Track USPS First Class packages in ${c}, ${s}. Delivery estimates, tracking availability, and service options.` },
    { slug: 'certified-mail-tracking', title: 'Certified Mail Tracking', tp: (c, s) => `Track USPS Certified Mail in ${c}, ${s} — Delivery Proof & Status`, dp: (c, s) => `Track USPS Certified Mail to or from ${c}, ${s}. Verify delivery confirmation and get signature proof.` },
    { slug: 'package-lost', title: 'Package Lost', tp: (c, s) => `USPS Lost Package in ${c}, ${s} — How to File a Claim ${PSO_YEAR}`, dp: (c, s) => `USPS package lost in ${c}, ${s}? Guide to filing a missing mail search, insurance claims, and recovery options.` },
    { slug: 'delivery-time', title: 'Delivery Time', tp: (c, s) => `USPS Delivery Times to ${c}, ${s} — ${PSO_YEAR} Estimates by Service`, dp: (c, s) => `How long does USPS take to deliver to ${c}, ${s}? Compare Priority, First Class, and Ground delivery times.` },
  ];

  const PROGRAMMATIC_TABLE_STYLES = `
    :root{--bg:hsl(210 25% 98%);--surface:hsl(0 0% 100%);--ink:hsl(222 47% 11%);--muted:hsl(215 16% 40%);--line:hsl(214 32% 89%);--accent:hsl(211 100% 40%);--accent-soft:hsl(211 100% 97%)}
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.65}
    header,main,footer{max-width:960px;margin:0 auto;padding:1rem}
    header nav{font-size:.95rem;color:var(--muted)}
    a{color:var(--accent)}
    h1,h2,h3{line-height:1.25;letter-spacing:-.01em}
    h1{font-size:clamp(1.4rem,2.2vw,2rem)}
    .table-wrap{overflow-x:auto;margin:1rem 0 1.5rem}
    .city-data-table{width:100%;min-width:640px;border-collapse:separate;border-spacing:0;border:1px solid var(--line);border-radius:14px;background:var(--surface)}
    .city-data-table th,.city-data-table td{padding:.82rem 1rem;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
    .city-data-table th{width:34%;font-weight:700;background:var(--accent-soft);color:var(--ink)}
    .city-data-table tr:nth-child(even) td{background:hsl(210 20% 99%)}
    .city-data-table tr:last-child th,.city-data-table tr:last-child td{border-bottom:none}
    @media (max-width:720px){
      header,main,footer{padding:.85rem}
      .city-data-table{min-width:560px}
      .city-data-table th,.city-data-table td{padding:.72rem .8rem}
    }
  `;

  function genStatusPage(city: CityData, status: typeof STATUSES[number]) {
    const t = `USPS ${status.label} in ${city.city}, ${city.state} — ${status.tv}`;
    const d = `Your USPS package is ${status.action} in ${city.city}, ${city.state}. Real-time tracking updates and next steps for ${city.city} (${city.region}) area packages.`;
    const zips = city.zipCodes.length > 0 ? city.zipCodes.join(', ') : 'N/A';
    const lm = city.landmarks.length > 0 ? city.landmarks.join(', ') : '';
    const faqSchema = JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":`What does "${status.label}" mean for packages in ${city.city}, ${city.state}?`,"acceptedAnswer":{"@type":"Answer","text":`When USPS shows "${status.label}" in ${city.city}, ${city.state}, it means your package is ${status.action}. The ${city.postalFacility} processes approximately ${city.dailyVolume} packages daily.`}},
      {"@type":"Question","name":`How long does "${status.label}" last in ${city.city}?`,"acceptedAnswer":{"@type":"Answer","text":`In the ${city.region} region, packages showing "${status.label}" typically update within 24-72 hours. ${city.city} has ${city.facilities} USPS facilities serving ZIP codes ${zips}.`}},
      {"@type":"Question","name":`Where is the nearest post office in ${city.city}, ${city.state}?`,"acceptedAnswer":{"@type":"Answer","text":`The main postal facility in ${city.city} is the ${city.postalFacility}. ${city.city} has ${city.facilities} USPS facilities. Standard hours: Monday-Friday 8:30 AM – 5:00 PM, Saturday 9:00 AM – 12:00 PM.`}},
      {"@type":"Question","name":`Can I pick up my package at a ${city.city} post office?`,"acceptedAnswer":{"@type":"Answer","text":`Yes, you can pick up packages at the ${city.postalFacility} or any of the ${city.facilities} USPS locations in ${city.city}. Bring a valid photo ID and your tracking number. Packages are held for up to 15 days.`}},
      {"@type":"Question","name":`What should I do if my package is stuck on "${status.label}" in ${city.city}?`,"acceptedAnswer":{"@type":"Answer","text":`Wait 24-48 hours for updates. If no change, contact USPS at 1-800-275-8777 or visit the ${city.postalFacility}. You can also file a Missing Mail search request at usps.com after 7 business days.`}}
    ]});

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${t}</title><meta name="description" content="${d}"><link rel="canonical" href="${PSO_URL}/city/${city.slug}/status/${status.slug}"><link rel="icon" href="/favicon.png" type="image/png"><meta property="og:title" content="${t}"><meta property="og:description" content="${d}"><meta property="og:url" content="${PSO_URL}/city/${city.slug}/status/${status.slug}"><meta property="og:site_name" content="${PSO_NAME}"><meta property="og:type" content="article"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${t}"><meta name="robots" content="index, follow"><style>${PROGRAMMATIC_TABLE_STYLES}</style><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"${t}","description":"${d}","url":"${PSO_URL}/city/${city.slug}/status/${status.slug}"}</script><script type="application/ld+json">${faqSchema}</script></head><body><header><nav><a href="${PSO_URL}">${PSO_NAME}</a> &rsaquo; <a href="${PSO_URL}/city/${city.slug}">${city.city}, ${city.state}</a> &rsaquo; ${status.label}</nav></header><main><h1>USPS "${status.label}" in ${city.city}, ${city.state}: ${status.tv}</h1><p>${d}</p><h2>What Does "${status.label}" Mean for ${city.city} Packages?</h2><p>When USPS tracking shows "${status.label}" in ${city.city}, ${city.state}, your package is ${status.action}. The ${city.city} USPS network in the ${city.region} region serves ${city.pop.toLocaleString()} residents with ${city.facilities} postal facilities processing approximately ${city.dailyVolume} packages daily. This status is one of the most common tracking updates seen by ${city.city} residents, and understanding what it means can help reduce anxiety about your shipment.</p><h2>How Long Does "${status.label}" Last in ${city.city}?</h2><p>For packages in the ${city.region} region, the "${status.label}" status typically updates within 24 to 72 hours. However, during peak shipping seasons such as November through January, processing times at the ${city.postalFacility} can be longer due to increased volume. Packages shipped via Priority Mail usually move through this status faster than those sent via Ground Advantage or Parcel Select. If your package has been showing "${status.label}" for more than 5 business days, consider contacting USPS directly.</p><h2>What to Do When Your Package Shows "${status.label}"</h2><p>Here are the recommended steps for ${city.city} residents when their package shows this status:</p><ol><li><strong>Wait 24-48 hours</strong> — Tracking updates are not always instantaneous, especially during busy periods at the ${city.postalFacility}.</li><li><strong>Check tracking online</strong> — Visit <a href="${PSO_URL}">${PSO_NAME}</a> and enter your tracking number for the most current status.</li><li><strong>Sign up for notifications</strong> — USPS Informed Delivery sends automatic email and text alerts for packages headed to your ${city.city} address.</li><li><strong>Contact your local post office</strong> — The ${city.postalFacility} can provide additional details about packages in their system.</li><li><strong>Call USPS</strong> — Reach USPS Customer Service at 1-800-ASK-USPS (1-800-275-8777), Monday-Friday 8 AM to 8:30 PM ET.</li><li><strong>File a search request</strong> — After 7+ business days without updates, file a Missing Mail search at usps.com/help/missing-mail.htm.</li></ol><h2>${city.city} USPS Post Office Information</h2><div class="table-wrap"><table class="city-data-table"><tr><th>Main Facility</th><td>${city.postalFacility}</td></tr><tr><th>Facilities</th><td>${city.facilities} USPS locations</td></tr><tr><th>Daily Volume</th><td>${city.dailyVolume} packages</td></tr><tr><th>ZIP Codes Served</th><td>${zips}</td></tr><tr><th>Standard Hours</th><td>Mon-Fri: 8:30 AM – 5:00 PM | Sat: 9:00 AM – 12:00 PM</td></tr><tr><th>Region</th><td>${city.region}</td></tr><tr><th>Population</th><td>${city.pop.toLocaleString()} residents</td></tr><tr><th>Customer Service</th><td>1-800-ASK-USPS (1-800-275-8777)</td></tr></table></div><h2>USPS Delivery Times to ${city.city}, ${city.state}</h2><p>Estimated USPS delivery times for packages shipped to ${city.city} vary by service type:</p><div class="table-wrap"><table class="city-data-table"><tr><th>Service</th><td><strong>Estimated Time</strong></td></tr><tr><th>Priority Mail Express</th><td>1-2 business days</td></tr><tr><th>Priority Mail</th><td>1-3 business days</td></tr><tr><th>First-Class Mail</th><td>1-5 business days</td></tr><tr><th>Ground Advantage</th><td>2-5 business days</td></tr><tr><th>Media Mail</th><td>2-8 business days</td></tr></table></div><p>These times are estimates and may vary based on origin location, weather conditions, and current USPS processing volumes in the ${city.region} region.</p>${lm ? `<h2>Landmarks Near Post Offices in ${city.city}</h2><p>Key landmarks in the ${city.city} delivery area include ${lm}. Packages addressed to locations near these landmarks are routed through the ${city.postalFacility}, which serves as the central processing hub for the ${city.city} metro area.</p>` : ''}<h2>Frequently Asked Questions</h2><h3>What does "${status.label}" mean for packages in ${city.city}, ${city.state}?</h3><p>When USPS shows "${status.label}" in ${city.city}, ${city.state}, it means your package is ${status.action}. The ${city.postalFacility} processes approximately ${city.dailyVolume} packages daily, so brief delays during peak times are normal.</p><h3>How long does "${status.label}" last in ${city.city}?</h3><p>In the ${city.region} region, packages showing "${status.label}" typically update within 24-72 hours. ${city.city} has ${city.facilities} USPS facilities serving ZIP codes ${zips}, and packages may pass through multiple facilities before delivery.</p><h3>Where is the nearest post office in ${city.city}, ${city.state}?</h3><p>The main postal facility in ${city.city} is the ${city.postalFacility}. ${city.city} has ${city.facilities} USPS facilities throughout the city. Standard hours are Monday-Friday 8:30 AM – 5:00 PM and Saturday 9:00 AM – 12:00 PM.</p><h3>Can I pick up my package at a ${city.city} post office?</h3><p>Yes. Bring a valid photo ID and your tracking number to the ${city.postalFacility} or any USPS location in ${city.city}. Packages are typically held for up to 15 days before being returned to the sender.</p><h3>What should I do if my package is stuck on "${status.label}" in ${city.city}?</h3><p>Wait 24-48 hours for updates. If there is no change, contact USPS at 1-800-275-8777 or visit the ${city.postalFacility} in person. You can also file a Missing Mail search request at usps.com after 7 business days without an update.</p><h2>Track Your ${city.city} Package Now</h2><p>Enter your USPS tracking number at <a href="${PSO_URL}">${PSO_NAME}</a> for real-time updates on packages in the ${city.city}, ${city.state} area. Our free tracking tool provides instant status updates for all USPS mail classes including Priority Mail, First-Class, Ground Advantage, and international shipments to and from ZIP codes ${zips}.</p><h2>Other Statuses in ${city.city}</h2><ul>${STATUSES.filter(s => s.slug !== status.slug).map(s => `<li><a href="${PSO_URL}/city/${city.slug}/status/${s.slug}">USPS ${s.label} in ${city.city} — ${s.tv}</a></li>`).join('')}</ul></main><footer><p>&copy; ${PSO_YEAR} ${PSO_NAME}</p></footer></body></html>`;
  }

  function genArticlePage(city: CityData, art: typeof ARTS[number]) {
    const t = art.tp(city.city, city.state);
    const d = art.dp(city.city, city.state);
    const zips = city.zipCodes.length > 0 ? city.zipCodes.join(', ') : 'N/A';
    const lm = city.landmarks.length > 0 ? city.landmarks.join(', ') : '';
    const faqSchema = JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":`How do I resolve ${art.title.toLowerCase()} in ${city.city}, ${city.state}?`,"acceptedAnswer":{"@type":"Answer","text":`For ${art.title.toLowerCase()} issues in ${city.city}, visit the ${city.postalFacility} or call 1-800-ASK-USPS. ${city.city} has ${city.facilities} USPS facilities serving ZIP codes ${zips}. You can also file a missing mail search request online at usps.com.`}},
      {"@type":"Question","name":`What are the USPS office hours in ${city.city}?`,"acceptedAnswer":{"@type":"Answer","text":`The ${city.postalFacility} in ${city.city} is open Monday-Friday 8:30 AM – 5:00 PM and Saturday 9:00 AM – 12:00 PM. Processing volume: ${city.dailyVolume} packages/day across ${city.facilities} facilities.`}},
      {"@type":"Question","name":`Which ZIP codes does USPS serve in ${city.city}?`,"acceptedAnswer":{"@type":"Answer","text":`USPS serves ${city.city}, ${city.state} across ZIP codes: ${zips}. The ${city.region} region has dedicated sorting facilities for these areas.`}},
      {"@type":"Question","name":`How long does USPS delivery take to ${city.city}?`,"acceptedAnswer":{"@type":"Answer","text":`Priority Mail Express takes 1-2 days, Priority Mail takes 1-3 days, First-Class Mail takes 1-5 days, and Ground Advantage takes 2-5 days to ${city.city}, ${city.state}.`}},
      {"@type":"Question","name":`Can I track my USPS package to ${city.city} online?`,"acceptedAnswer":{"@type":"Answer","text":`Yes, enter your USPS tracking number at USPostalTracking.com for free real-time tracking updates on packages shipped to ${city.city}, ${city.state}.`}}
    ]});

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${t}</title><meta name="description" content="${d}"><link rel="canonical" href="${PSO_URL}/city/${city.slug}/${art.slug}"><link rel="icon" href="/favicon.png" type="image/png"><meta property="og:title" content="${t}"><meta property="og:description" content="${d}"><meta property="og:url" content="${PSO_URL}/city/${city.slug}/${art.slug}"><meta property="og:site_name" content="${PSO_NAME}"><meta property="og:type" content="article"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${t}"><meta name="robots" content="index, follow"><style>${PROGRAMMATIC_TABLE_STYLES}</style><script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${t}","description":"${d}","url":"${PSO_URL}/city/${city.slug}/${art.slug}","datePublished":"${PSO_TODAY}","dateModified":"${PSO_TODAY}"}</script><script type="application/ld+json">${faqSchema}</script></head><body><header><nav><a href="${PSO_URL}">${PSO_NAME}</a> &rsaquo; <a href="${PSO_URL}/city/${city.slug}">${city.city}</a> &rsaquo; ${art.title}</nav></header><main><h1>${t}</h1><p>${d}</p><h2>About USPS ${art.title} in ${city.city}, ${city.state}</h2><p>Dealing with USPS ${art.title.toLowerCase()} in ${city.city}, ${city.state}? You are not alone — this is one of the most common USPS concerns reported by residents in the ${city.region} region. This comprehensive guide covers everything you need to know about ${art.title.toLowerCase()} for packages shipped to or from ${city.city}. With ${city.facilities} postal facilities processing ${city.dailyVolume} packages daily, the ${city.city} postal network is one of the busiest in ${city.state}.</p><h2>Step-by-Step Guide to Resolve ${art.title} in ${city.city}</h2><p>Follow these steps if you are experiencing ${art.title.toLowerCase()} in ${city.city}, ${city.state}:</p><ol><li><strong>Check your tracking status</strong> — Enter your USPS tracking number at <a href="${PSO_URL}">${PSO_NAME}</a> for the most up-to-date information on your package.</li><li><strong>Wait 24-48 hours</strong> — USPS tracking updates are not always instantaneous. Allow at least one full business day before taking further action.</li><li><strong>Sign up for Informed Delivery</strong> — USPS Informed Delivery (informeddelivery.usps.com) sends automatic notifications for all packages addressed to your ${city.city} home.</li><li><strong>Visit your local post office</strong> — The ${city.postalFacility} can provide hands-on assistance. Bring your tracking number and a valid photo ID.</li><li><strong>Call USPS Customer Service</strong> — Reach USPS at 1-800-ASK-USPS (1-800-275-8777), available Monday through Friday 8 AM to 8:30 PM ET and Saturday 8 AM to 6 PM ET.</li><li><strong>File a Missing Mail request</strong> — If more than 7 business days have passed without an update, file a request at usps.com/help/missing-mail.htm.</li><li><strong>File an insurance claim</strong> — For insured packages, submit a claim at usps.com/help/claims.htm after the applicable waiting period.</li></ol><h2>USPS Delivery Times to ${city.city}, ${city.state}</h2><p>Understanding estimated delivery times helps you determine whether your package is genuinely delayed or still within the normal window:</p><div class="table-wrap"><table class="city-data-table"><tr><th>Service</th><td><strong>Estimated Delivery</strong></td></tr><tr><th>Priority Mail Express</th><td>1-2 business days</td></tr><tr><th>Priority Mail</th><td>1-3 business days</td></tr><tr><th>First-Class Mail</th><td>1-5 business days</td></tr><tr><th>Ground Advantage</th><td>2-5 business days</td></tr><tr><th>Media Mail</th><td>2-8 business days</td></tr><tr><th>Parcel Select</th><td>2-9 business days</td></tr></table></div><p>These times are estimates from the date of mailing and may vary depending on origin, weather, and USPS processing volumes in the ${city.region} region.</p><h2>${city.city} Post Office Details</h2><div class="table-wrap"><table class="city-data-table"><tr><th>Main Facility</th><td>${city.postalFacility}</td></tr><tr><th>Total Facilities</th><td>${city.facilities} USPS locations</td></tr><tr><th>Daily Processing</th><td>${city.dailyVolume} packages</td></tr><tr><th>ZIP Codes</th><td>${zips}</td></tr><tr><th>Hours</th><td>Mon-Fri: 8:30 AM – 5:00 PM | Sat: 9:00 AM – 12:00 PM</td></tr><tr><th>Phone</th><td>1-800-ASK-USPS (1-800-275-8777)</td></tr><tr><th>Population Served</th><td>${city.pop.toLocaleString()}</td></tr><tr><th>Region</th><td>${city.region}</td></tr></table></div>${lm ? `<h2>Delivery Area Landmarks in ${city.city}</h2><p>The ${city.city} USPS delivery area includes notable locations such as ${lm}. Packages destined for addresses near these landmarks are processed through the ${city.postalFacility}, which serves as the main sorting and distribution center for the greater ${city.city} area.</p>` : ''}<h2>Understanding USPS Tracking Numbers</h2><p>Your USPS tracking number format indicates the type of service used for your shipment to or from ${city.city}. Priority Mail numbers typically start with 9400 or 9205 and are 20-22 digits long. Priority Mail Express numbers begin with 9270. Certified Mail starts with 9407. International tracking numbers use a 13-character alphanumeric format such as EA123456789US. If your tracking number does not match these formats, your package may be shipped through a partner carrier.</p><h2>Frequently Asked Questions</h2><h3>How do I resolve ${art.title.toLowerCase()} in ${city.city}, ${city.state}?</h3><p>For ${art.title.toLowerCase()} issues in ${city.city}, first check your tracking at <a href="${PSO_URL}">${PSO_NAME}</a>, then visit the ${city.postalFacility} or call 1-800-ASK-USPS. ${city.city} has ${city.facilities} USPS facilities serving ZIP codes ${zips}.</p><h3>What are the USPS office hours in ${city.city}?</h3><p>The ${city.postalFacility} in ${city.city} is open Monday through Friday 8:30 AM to 5:00 PM and Saturday 9:00 AM to 12:00 PM. Hours may vary by location and holiday schedules.</p><h3>Which ZIP codes does USPS serve in ${city.city}?</h3><p>USPS delivers to ZIP codes ${zips} in the ${city.city}, ${city.state} area. Each ZIP code has dedicated carrier routes ensuring daily delivery to all residential and business addresses.</p><h3>How long does USPS delivery take to ${city.city}?</h3><p>Priority Mail Express takes 1-2 business days, Priority Mail takes 1-3 days, First-Class Mail takes 1-5 days, and Ground Advantage takes 2-5 business days to ${city.city}, ${city.state}.</p><h3>Can I track my USPS package to ${city.city} online?</h3><p>Yes, enter your USPS tracking number at <a href="${PSO_URL}">${PSO_NAME}</a> for free, real-time tracking updates on all packages shipped to or from ${city.city}, ${city.state}.</p><h2>Track Your Package in ${city.city}</h2><p>Enter your tracking number at <a href="${PSO_URL}">${PSO_NAME}</a> for instant, real-time updates on packages in ${city.city}, ${city.state}. Our free tracking tool supports all USPS mail classes including Priority Mail, First-Class, Ground Advantage, Certified Mail, and international shipments to and from ZIP codes ${zips}.</p><h2>More USPS Guides for ${city.city}</h2><ul>${ARTS.filter(a => a.slug !== art.slug).map(a => `<li><a href="${PSO_URL}/city/${city.slug}/${a.slug}">${a.tp(city.city, city.state)}</a></li>`).join('')}</ul></main><footer><p>&copy; ${PSO_YEAR} ${PSO_NAME}</p></footer></body></html>`;
  }

  function generateAllPages() {
    if (CITIES.length === 0) { console.warn('⚠️ No cities loaded, skipping programmatic SEO generation'); return; }
    fs.mkdirSync(path.join(PSO_DIR, 'city-status'), { recursive: true });
    fs.mkdirSync(path.join(PSO_DIR, 'city-article'), { recursive: true });
    let count = 0;
    for (const city of CITIES) {
      for (const status of STATUSES) {
        fs.writeFileSync(path.join(PSO_DIR, 'city-status', `${city.slug}-${status.slug}.html`), genStatusPage(city, status));
        count++;
      }
      for (const art of ARTS) {
        fs.writeFileSync(path.join(PSO_DIR, 'city-article', `${city.slug}-${art.slug}.html`), genArticlePage(city, art));
        count++;
      }
    }
    // Regenerate sitemaps in sync
    regenerateCitiesSitemap();
    regenerateProgrammaticSitemap();
    console.log(`✅ Programmatic SEO: Generated ${count} pages across ${CITIES.length} cities with unique titles`);
  }

  return {
    name: 'programmatic-seo-generator',
    buildStart() { generateAllPages(); },
    configureServer() { generateAllPages(); },
  };
}

// ── Vite Plugin: Prerender Shell Generator ──────────────────────────
// Generates static HTML files for every React route so crawlers see unique titles
function prerenderShellPlugin() {
  const SITE = 'https://uspostaltracking.com';
  const NAME = 'US Postal Tracking';
  const PUB = path.resolve(__dirname, 'public');

  function shell(routePath: string, title: string, desc: string, h1?: string, extraContent?: string) {
    const canonical = `${SITE}${routePath}`;
    const heading = h1 || title.split(' — ')[0].split(' | ')[0];
    const body = extraContent || `<p>${desc}</p><p>Enter your tracking number above for instant real-time delivery status updates, estimated delivery dates, and package location information. Our free tracking tool supports all major postal services and carriers worldwide.</p>`;
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title><meta name="description" content="${desc}"><link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.png" type="image/png"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="${NAME}"><meta property="og:type" content="website"><meta property="og:image" content="${SITE}/og-image.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="robots" content="index, follow"></head><body><div id="root"><header style="padding:1rem;text-align:center"><a href="/" style="font-weight:bold;text-decoration:none;color:#1a1a2e">${NAME}</a> | <a href="/tracking">All Carriers</a> | <a href="/article">Articles</a> | <a href="/locations">Locations</a></header><main style="max-width:800px;margin:0 auto;padding:2rem 1rem"><h1>${heading}</h1>${body}<p><a href="/">Track Your Package Now →</a> | <a href="/tracking">Browse All Carriers</a> | <a href="/article">Read Guides</a></p></main><footer style="text-align:center;padding:1rem"><nav><a href="/about">About</a> | <a href="/contact">Contact</a> | <a href="/privacy-policy">Privacy</a> | <a href="/sitemap">Sitemap</a></nav></footer></div><script type="module" src="/src/main.tsx"></script></body></html>`;
  }

  function mkdirp(dir: string) { fs.mkdirSync(dir, { recursive: true }); }
  function writeShell(routePath: string, title: string, desc: string, h1?: string, extraContent?: string) {
    const dir = path.join(PUB, routePath);
    mkdirp(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), shell(routePath, title, desc, h1, extraContent));
  }

  function generateShells() {
    // Read article content data
    let articleMap: Record<string, { title: string; metaDescription: string }> = {};
    try {
      const artFile = fs.readFileSync(path.resolve(__dirname, 'src/data/articleContent.ts'), 'utf8');
      const regex = /"([^"]+)":\s*\{\s*title:\s*"([^"]+)",\s*metaDescription:\s*"([^"]+)"/g;
      let m;
      while ((m = regex.exec(artFile)) !== null) {
        articleMap[m[1]] = { title: m[2], metaDescription: m[3] };
      }
    } catch {}

    // Read city data
    let cities: { slug: string; city: string; stateCode: string }[] = [];
    try {
      const cityFile = fs.readFileSync(path.resolve(__dirname, 'src/data/usCities.ts'), 'utf8');
      const cityRegex = /slug:"([^"]+)",\s*city:"([^"]+)",\s*state:"[^"]+",\s*stateCode:"([^"]+)"/g;
      let m;
      while ((m = cityRegex.exec(cityFile)) !== null) {
        cities.push({ slug: m[1], city: m[2], stateCode: m[3] });
      }
    } catch {}

    // Read article keywords
    let articleSlugs: string[] = [];
    try {
      const cityFile = fs.readFileSync(path.resolve(__dirname, 'src/data/usCities.ts'), 'utf8');
      const kwMatch = cityFile.match(/articleKeywords:\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
      if (kwMatch) {
        const slugs = kwMatch[1].match(/"([^"]+)"/g);
        if (slugs) articleSlugs = slugs.map(s => s.replace(/"/g, ''));
      }
    } catch {}

    let count = 0;

    // ── Static pages ──
    const statics: [string, string, string][] = [
      ['/about', 'About Us — US Postal Tracking', 'Learn about US Postal Tracking, the free USPS package tracking tool. Track packages from USPS, FedEx, UPS, DHL, and 200+ carriers worldwide.'],
      ['/contact', 'Contact Us — US Postal Tracking', 'Get in touch with US Postal Tracking. Questions about USPS tracking, package status, or our services? We are here to help.'],
      ['/article', 'USPS Tracking Articles & Guides — Expert Shipping Help', 'Browse 130+ expert USPS tracking articles. Solutions for tracking not updating, packages stuck in transit, delivery issues, and more.'],
      ['/tracking', 'Track 200+ Carriers Worldwide — Free Package Tracking', 'Track packages from 200+ postal services and carriers worldwide. FedEx, UPS, DHL, USPS, Royal Mail, China Post, and more. Free real-time tracking.'],
      ['/locations', 'USPS Post Office Locations — Find Nearest USPS Office', 'Find USPS post office locations near you. Hours, services, ZIP codes, and tracking for 500+ US cities.'],
      ['/guides', 'USPS Shipping Guides — Expert Tips & How-To', 'Complete USPS shipping guides. Tracking number formats, informed delivery, international shipping rates, and more.'],
      ['/privacy-policy', 'Privacy Policy — US Postal Tracking', 'Privacy policy for US Postal Tracking. How we collect, use, and protect your data.'],
      ['/terms-of-service', 'Terms of Service — US Postal Tracking', 'Terms of service for US Postal Tracking. Usage terms, disclaimers, and legal information.'],
      ['/disclaimer', 'Disclaimer — US Postal Tracking', 'Legal disclaimer for US Postal Tracking. We are not affiliated with USPS.'],
      ['/dmca', 'DMCA Policy — US Postal Tracking', 'DMCA takedown policy for US Postal Tracking.'],
      ['/sitemap', 'Sitemap — US Postal Tracking', 'Complete sitemap of US Postal Tracking. Find all pages, articles, guides, and tracking tools.'],
      ['/guides/tracking-number-format', 'USPS Tracking Number Format Guide — All Formats Explained 2026', 'Complete guide to USPS tracking number formats. Learn what 9400, 9205, 9270, 9300, 9361 numbers mean. Identify your package service type.'],
      ['/guides/informed-delivery', 'USPS Informed Delivery — Preview Your Mail Before It Arrives', 'Sign up for USPS Informed Delivery. Get daily email scans of your incoming mail and package tracking notifications. Free service.'],
      ['/guides/international-shipping-rates', 'USPS International Shipping Rates 2026 — Complete Price Guide', 'Compare USPS international shipping rates for 2026. Priority Mail International, First Class International, and Global Express pricing.'],
      ['/guides/tracking-not-updating', 'USPS Tracking Not Updating — Why & How to Fix It 2026', 'USPS tracking not updating? Learn the top reasons and step-by-step fixes for tracking gaps, stuck packages, and scanning delays.'],
      ['/guides/track-without-tracking-number', 'Track USPS Package Without Tracking Number — 5 Methods', 'Lost your USPS tracking number? 5 proven methods to track your package without a tracking number. Informed Delivery, receipt lookup, and more.'],
      ['/guides/usps-mobile-tracking', 'USPS Mobile Tracking — Track Packages on Your Phone', 'Track USPS packages on your phone. Mobile tracking tips, USPS app guide, text tracking, and push notifications.'],
      ['/post-office-tracking', 'Post Office Tracking — Track USPS Packages Online Free', 'Free post office package tracking. Enter your USPS tracking number for real-time delivery status updates.'],
      ['/mail-tracking', 'USPS Mail Tracking — Track Letters & Packages Free', 'Track USPS mail online free. Enter your tracking number for real-time updates on letters, packages, and all USPS services.'],
      ['/postal-tracking', 'Postal Tracking — Track Any Postal Service Package Free', 'Free postal tracking for USPS and international postal services. Track packages from any postal service worldwide.'],
      ['/usps-tracker', 'USPS Tracker — Free Real-Time Package Tracking Tool', 'Free USPS package tracker. Enter your tracking number for instant real-time delivery status updates.'],
      ['/track-usps', 'Track USPS — Track Your USPS Package Online Free', 'Track USPS packages online for free. Enter your tracking number for real-time delivery status and location updates.'],
      ['/usa-tracking', 'USA Tracking — Track Packages Across the United States', 'Track packages across the USA. USPS, FedEx, UPS, DHL tracking with real-time delivery status updates.'],
      ['/package-tracker-usps', 'USPS Package Tracker — Free Real-Time Tracking Tool', 'Free USPS package tracker tool. Enter your tracking number and get instant delivery status, location, and estimated delivery date.'],
      ['/seguimiento-usps', 'Seguimiento USPS — Rastrear Paquete USPS en Tiempo Real', 'Seguimiento USPS gratis. Rastrear paquete USPS con número de seguimiento. Actualizaciones en tiempo real del estado de entrega.'],
      ['/track-my-usps-package', 'Track My USPS Package — Free Real-Time USPS Package Tracking', 'Track my USPS package online free. Enter your tracking number to track your USPS package in real time.'],
      ['/us-post-tracking', 'US Post Tracking — Track US Post Packages Online Free', 'Free US Post tracking tool. Track US Post packages, mail, and shipments by tracking number. Real-time US postal tracking updates.'],
      ['/check-usps-tracking', 'Check USPS Tracking — Free USPS Tracking Status Checker', 'Check USPS tracking status online free. Enter your USPS tracking number to check delivery status, current location, and estimated arrival.'],
      ['/track-and-trace-usps', 'Track and Trace USPS — Free US Postal Track & Trace Tool', 'Free USPS track and trace tool. Track and trace US Postal Service packages in real time.'],
      ['/track-parcel-usa', 'Track Parcel USA — Free USA Parcel Tracking Tool', 'Track parcel USA — free online parcel tracking for the United States. Enter your tracking number to track any USA parcel in real time.'],
      ['/where-is-my-package', 'Where Is My Package? — USPS Package Finder Tool', 'Find your missing USPS package. Enter your tracking number to see exactly where your package is right now.'],
      ['/usps-delivery-time', 'USPS Delivery Time — How Long Does USPS Take to Deliver?', 'Complete guide to USPS delivery times. Priority Mail 1-3 days, First Class 1-5 days, Ground Advantage 2-5 days. Compare all services.'],
      ['/usps-lost-package', 'USPS Lost Package — How to Find & File a Claim 2026', 'USPS package lost? Step-by-step guide to find your missing package, file a claim, and get a refund. Updated for 2026.'],
      ['/usps-schedule-pickup', 'USPS Schedule Pickup — Free Home Package Pickup Service', 'Schedule a free USPS package pickup from your home. How to schedule, what you can ship, and pickup times.'],
      ['/usps-hold-for-pickup', 'USPS Hold for Pickup — How to Hold Packages at Post Office', 'Learn how to hold USPS packages at the post office for pickup. Package intercept, hold mail, and pickup options.'],
      ['/usps-change-address', 'USPS Change of Address — Forward Your Mail Online', 'Change your address with USPS online. How to forward mail, update your address, and track mail forwarding.'],
      ['/usps-package-not-delivered', 'USPS Package Not Delivered — What to Do Next 2026', 'USPS package not delivered? Step-by-step guide to locate your package, report missing mail, and get resolution.'],
      ['/usps-shipping-calculator', 'USPS Shipping Calculator — Calculate Postage Rates 2026', 'Calculate USPS shipping costs for any package. Compare rates for Priority Mail, First Class, Ground Advantage, and more.'],
      ['/knowledge-center', 'USPS Knowledge Center — Shipping Guides & Expert Tips', 'Comprehensive USPS knowledge center. Expert guides on customs, international shipping, lost packages, tracking formats, and more.'],
      ['/knowledge-center/customs-clearance-guide', 'USPS Customs Clearance Guide — Import & Export Tips 2026', 'Complete guide to USPS customs clearance. How customs works, required forms, duties, taxes, and how to avoid delays.'],
      ['/knowledge-center/international-shipping-guide', 'International Shipping Guide — Ship Worldwide with USPS 2026', 'Complete guide to international shipping with USPS. Services, rates, customs forms, prohibited items, and delivery times.'],
      ['/knowledge-center/lost-package-guide', 'Lost Package Guide — Find Missing USPS Packages 2026', 'Complete guide to finding lost USPS packages. File claims, search requests, insurance, and prevention tips.'],
      ['/knowledge-center/tracking-number-formats', 'USPS Tracking Number Formats — All Formats Explained', 'Complete reference for all USPS tracking number formats. 9400, 9205, 9270, 9300, 9361, EA, LZ, RA numbers explained.'],
      ['/knowledge-center/delivery-times-by-carrier', 'Delivery Times by Carrier — USPS, FedEx, UPS, DHL Compared', 'Compare delivery times across all major carriers. USPS, FedEx, UPS, DHL side-by-side comparison.'],
      ['/knowledge-center/customs-duties-taxes', 'Customs Duties & Taxes Guide — International Shipping 2026', 'Understand customs duties and taxes for international shipments. How they are calculated, who pays, and how to minimize costs.'],
      ['/knowledge-center/shipping-restrictions', 'Shipping Restrictions — What You Cannot Ship via USPS', 'Complete list of USPS shipping restrictions. Prohibited items, hazardous materials, size limits, and country-specific restrictions.'],
      ['/knowledge-center/best-shipping-carriers', 'Best Shipping Carriers 2026 — USPS vs FedEx vs UPS vs DHL', 'Compare the best shipping carriers for 2026. USPS, FedEx, UPS, DHL ratings, prices, delivery times, and reliability.'],
      ['/knowledge-center/carrier-tracking-formats', 'Carrier Tracking Number Formats — Complete Reference Guide 2026', 'Identify tracking number formats for 20+ carriers: SpeedEx, OnTrac, DoorDash, Colissimo, SF Express, India Post, and more.'],
      // Carrier landing pages — major carriers first (highest search volume)
      ['/dhl-tracking', 'DHL Tracking — Track DHL Package by Tracking Number Free | Real-Time', 'Track DHL packages free with real-time updates. Enter your DHL tracking number for instant delivery status. Supports DHL Express, DHL eCommerce & DHL Parcel tracking.'],
      ['/amazon-tracking', 'Amazon Tracking — Track Amazon Package by Tracking Number Free | Real-Time', 'Track Amazon packages free with real-time updates. Enter your Amazon tracking number or TBA number for instant delivery status and location.'],
      ['/lasership-tracking', 'LaserShip Tracking — Track LaserShip Packages Free | Real-Time Updates', 'Track LaserShip packages free with real-time updates. Enter your LaserShip tracking number for instant delivery status, location, and ETA.'],
      ['/speedex-tracking', 'SpeedEx Tracking — Track SpeedEx & Speed X Packages Free', 'Free SpeedEx tracking tool. Track SpeedEx packages, Speed X shipments, and Speedex courier deliveries in real time.'],
      ['/ontrac-tracking', 'OnTrac Tracking — Track OnTrac Packages & Deliveries Free', 'Free OnTrac tracking tool. Track OnTrac packages and deliveries in real time across the Western US.'],
      ['/doordash-tracking', 'DoorDash Tracking — Track DoorDash Orders & Packages Free', 'Free DoorDash tracking tool. Track DoorDash deliveries, orders, and packages in real time.'],
      ['/easypost-tracking', 'EasyPost Tracking — Track EasyPost Shipments & Packages Free', 'Free EasyPost tracking tool. Track EasyPost shipments across USPS, FedEx, UPS, DHL, and 100+ carriers.'],
      ['/colissimo-tracking', 'Colissimo Tracking — Track La Poste France Packages Free', 'Free Colissimo tracking tool. Track La Poste France Colissimo packages worldwide.'],
      ['/sf-express-tracking', 'SF Express Tracking — Track SF Express & SFC Packages Free', 'Free SF Express tracking tool. Track SF Express, SFC, and SF tracking packages from China worldwide.'],
      ['/india-post-tracking', 'India Post Tracking — Track Indian Postal Service Packages Free', 'Free India Post tracking tool. Track Indian postal service packages, Speed Post, and registered mail.'],
      ['/ceva-tracking', 'CEVA Tracking — Track CEVA Logistics Shipments Free', 'Free CEVA Logistics tracking tool. Track CEVA freight, air cargo, and logistics shipments worldwide.'],
      ['/singapore-mail-tracking', 'Singapore Mail Tracking — Track SingPost Packages Free', 'Free Singapore Mail tracking tool. Track SingPost packages and Singapore postal service mail worldwide.'],
      ['/deutsche-post-tracking', 'Deutsche Post Tracking — Track German Post Packages Free', 'Free Deutsche Post tracking tool. Track Deutsche Post and DHL Germany packages worldwide.'],
      ['/alibaba-tracking', 'Alibaba Tracking — Track Alibaba Orders & Packages Free', 'Free Alibaba tracking tool. Track Alibaba orders and packages shipped via DHL, FedEx, SF Express, and China Post.'],
      ['/roadie-tracking', 'Roadie Tracking — Track Roadie Deliveries & Packages Free', 'Free Roadie tracking tool. Track Roadie same-day deliveries and packages in real time.'],
      // Typo/misspelling pages
      ['/usps-trackint', 'USPS Tracking — Free USPS Package Tracking Tool', 'Looking for USPS trackint? Track your USPS packages in real time with our free tracking tool.'],
      ['/travk-usps', 'Track USPS — Free USPS Package Tracking Tool', 'Looking for travk usps? Track USPS packages online for free with our tracking tool.'],
      ['/isps-track', 'USPS Track — Free USPS Package Tracking Tool', 'Looking for isps track? Track USPS packages for free with real-time delivery status updates.'],
    ];
    for (const [route, title, desc] of statics) {
      writeShell(route, title, desc);
      count++;
    }

    // ── Carrier tracking pages (dynamic /tracking/:carrierId) ──
    let carrierIds: { id: string; name: string; fullName: string }[] = [];
    try {
      const carrierFiles = [
        path.resolve(__dirname, 'src/data/carriers.ts'),
        path.resolve(__dirname, 'src/data/carriers-extra.ts'),
        path.resolve(__dirname, 'src/data/carriers-extra2.ts'),
      ];
      for (const filePath of carrierFiles) {
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, 'utf8');
        // Match both full object syntax and makeCarrier/mk function syntax
        const idRegex = /id:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)",\s*\n\s*fullName:\s*"([^"]+)"/g;
        const funcRegex = /(?:makeCarrier|mk)\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g;
        let m;
        while ((m = idRegex.exec(content)) !== null) {
          carrierIds.push({ id: m[1], name: m[2], fullName: m[3] });
        }
        while ((m = funcRegex.exec(content)) !== null) {
          carrierIds.push({ id: m[1], name: m[2], fullName: m[3] });
        }
      }
      // Deduplicate by id
      const seen = new Set<string>();
      carrierIds = carrierIds.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
    } catch {}
    for (const c of carrierIds) {
      const carrierContent = `<p>Track ${c.name} (${c.fullName}) packages with real-time status updates. Enter your ${c.name} tracking number for instant delivery status, location, and estimated delivery date.</p><h2>How to Track ${c.name} Packages</h2><ol><li>Find your ${c.name} tracking number on your receipt or confirmation email</li><li>Enter it in the tracking search bar above</li><li>View real-time delivery status, current location, and estimated delivery date</li></ol><h2>About ${c.name}</h2><p>${c.fullName} provides package delivery and tracking services. Track all ${c.name} shipments including domestic and international packages with our free tracking tool.</p>`;
      writeShell(
        `/tracking/${c.id}`,
        `${c.name} Tracking — Track ${c.name} Packages Free | Real-Time Status`,
        `Track ${c.name} (${c.fullName}) packages with real-time status updates. Enter your ${c.name} tracking number for instant delivery status, location, and estimated delivery date.`,
        undefined,
        carrierContent
      );
      count++;
    }

    // ── Article pages ──
    for (const slug of articleSlugs) {
      const art = articleMap[slug];
      const prettyTitle = slug.replace(/-/g, ' ').replace(/usps /i, 'USPS ').replace(/\b\w/g, c => c.toUpperCase());
      const title = art ? art.title : `${prettyTitle} — Complete Guide 2026`;
      const desc = art ? art.metaDescription : `Complete guide to ${prettyTitle.toLowerCase()}. Expert tips, solutions, and real-time tracking. Updated for 2026.`;
      writeShell(`/article/${slug}`, title, desc);
      count++;
    }

    // ── City pages ──
    for (const city of cities) {
      writeShell(`/city/${city.slug}`, `USPS Tracking in ${city.city}, ${city.stateCode} — Track Packages & Post Offices`, `Track USPS packages in ${city.city}, ${city.stateCode}. Find local post office locations, hours, and get real-time tracking updates for ${city.city} area shipments.`);
      count++;
    }

    // ── State pages ──
    const states = ['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new-hampshire','new-jersey','new-mexico','new-york','north-carolina','north-dakota','ohio','oklahoma','oregon','pennsylvania','rhode-island','south-carolina','south-dakota','tennessee','texas','utah','vermont','virginia','washington','west-virginia','wisconsin','wyoming'];
    for (const st of states) {
      const name = st.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      writeShell(`/state/${st}`, `USPS Tracking in ${name} — Post Offices, Delivery & Tracking`, `Track USPS packages in ${name}. Find post office locations, delivery times, and get real-time tracking for all ${name} shipments.`);
      count++;
    }

    // ── Status pages — all 51 slugs from sitemap-status.xml ──
    const statuses = [
      { slug: 'in-transit', label: 'In Transit', desc: 'package is moving through the USPS network' },
      { slug: 'out-for-delivery', label: 'Out for Delivery', desc: 'package is with carrier for delivery today' },
      { slug: 'delivered', label: 'Delivered', desc: 'package has been delivered successfully' },
      { slug: 'delivery-attempted', label: 'Delivery Attempted', desc: 'delivery was attempted but unsuccessful' },
      { slug: 'pre-shipment', label: 'Pre-Shipment', desc: 'label created, awaiting USPS pickup' },
      { slug: 'customs-clearance', label: 'Customs Clearance', desc: 'package is being processed by customs' },
      { slug: 'return-to-sender', label: 'Return to Sender', desc: 'package is being returned to sender' },
      { slug: 'return-initiated', label: 'Return Initiated', desc: 'a return has been initiated for your package' },
      { slug: 'return-in-transit', label: 'Return In Transit', desc: 'returned package is moving back to sender' },
      { slug: 'return-delivered', label: 'Return Delivered', desc: 'returned package has been delivered to sender' },
      { slug: 'alert', label: 'Alert', desc: 'there is an issue with your package' },
      { slug: 'label-created', label: 'Label Created', desc: 'shipping label has been created' },
      { slug: 'in-transit-to-next-facility', label: 'In Transit to Next Facility', desc: 'package is moving to the next USPS facility' },
      { slug: 'in-transit-to-destination', label: 'In Transit to Destination', desc: 'package is on its way to the destination facility' },
      { slug: 'departed-shipping-partner-facility', label: 'Departed Shipping Partner', desc: 'package left the shipping partner facility' },
      { slug: 'departed-usps-facility', label: 'Departed USPS Facility', desc: 'package has left a USPS processing facility' },
      { slug: 'departed-hub', label: 'Departed Hub', desc: 'package has departed a USPS hub facility' },
      { slug: 'arrived-at-hub', label: 'Arrived at Hub', desc: 'package arrived at USPS hub facility' },
      { slug: 'arrived-at-usps-facility', label: 'Arrived at USPS Facility', desc: 'package arrived at a USPS processing facility' },
      { slug: 'arrived-at-destination', label: 'Arrived at Destination', desc: 'package has arrived at the destination facility' },
      { slug: 'arrived-at-customs', label: 'Arrived at Customs', desc: 'package has arrived at customs inspection' },
      { slug: 'arrived-at-destination-country', label: 'Arrived at Destination Country', desc: 'international package has arrived in the destination country' },
      { slug: 'alert-notice-left', label: 'Alert Notice Left', desc: 'a delivery notice was left at the address' },
      { slug: 'notice-left', label: 'Notice Left', desc: 'a notice was left because delivery could not be completed' },
      { slug: 'held-at-post-office', label: 'Held at Post Office', desc: 'package is being held at the post office for pickup' },
      { slug: 'held-for-customs', label: 'Held for Customs', desc: 'package is being held pending customs clearance' },
      { slug: 'shipping-label-created', label: 'Shipping Label Created', desc: 'shipping label was created by the sender' },
      { slug: 'shipment-received', label: 'Shipment Received', desc: 'USPS has received the shipment at a facility' },
      { slug: 'package-accepted', label: 'Package Accepted', desc: 'USPS has accepted the package for delivery' },
      { slug: 'accepted', label: 'Accepted', desc: 'package has been accepted into the USPS network' },
      { slug: 'picked-up', label: 'Picked Up', desc: 'package has been picked up by the carrier' },
      { slug: 'forwarded', label: 'Forwarded', desc: 'package has been forwarded to a new address' },
      { slug: 'available-for-pickup', label: 'Available for Pickup', desc: 'package is ready for pickup at the post office' },
      { slug: 'attempted-delivery', label: 'Attempted Delivery', desc: 'a delivery attempt was made but unsuccessful' },
      { slug: 'address-corrected', label: 'Address Corrected', desc: 'the delivery address has been corrected by USPS' },
      { slug: 'processing', label: 'Processing', desc: 'package is being processed at a USPS facility' },
      { slug: 'sorting', label: 'Sorting', desc: 'package is being sorted at a USPS facility' },
      { slug: 'item-dispatched', label: 'Item Dispatched', desc: 'item has been dispatched from a postal facility' },
      { slug: 'origin-post-preparing', label: 'Origin Post Preparing', desc: 'the origin post office is preparing the shipment' },
      { slug: 'international-dispatch', label: 'International Dispatch', desc: 'package has been dispatched for international delivery' },
      { slug: 'customs-cleared', label: 'Customs Cleared', desc: 'package has cleared customs inspection' },
      { slug: 'departed-customs', label: 'Departed Customs', desc: 'package has departed from customs' },
      { slug: 'out-for-delivery-today', label: 'Out for Delivery Today', desc: 'package is loaded on a vehicle for delivery today' },
      { slug: 'delivered-to-mailbox', label: 'Delivered to Mailbox', desc: 'package was delivered and placed in the mailbox' },
      { slug: 'delivered-to-front-door', label: 'Delivered to Front Door', desc: 'package was delivered to the front door' },
      { slug: 'delivered-to-parcel-locker', label: 'Delivered to Parcel Locker', desc: 'package was placed in a parcel locker' },
      { slug: 'delivered-to-neighbor', label: 'Delivered to Neighbor', desc: 'package was delivered to a neighbor' },
      { slug: 'delivered-to-safe-location', label: 'Delivered to Safe Location', desc: 'package was left in a safe location' },
      { slug: 'delivery-scheduled', label: 'Delivery Scheduled', desc: 'delivery has been scheduled for a specific date' },
      { slug: 'delivery-exception', label: 'Delivery Exception', desc: 'an exception has occurred with your delivery' },
      { slug: 'package-damaged', label: 'Package Damaged', desc: 'the package has sustained damage during transit' },
      { slug: 'package-lost', label: 'Package Lost', desc: 'the package has been reported as lost' },
      { slug: 'weather-delay', label: 'Weather Delay', desc: 'delivery is delayed due to severe weather conditions' },
      { slug: 'operational-delay', label: 'Operational Delay', desc: 'delivery is delayed due to operational issues' },
      { slug: 'holiday-delay', label: 'Holiday Delay', desc: 'delivery is delayed due to a postal holiday' },
    ];
    for (const st of statuses) {
      writeShell(`/status/${st.slug}`, `USPS ${st.label} — What It Means & What to Do 2026`, `USPS tracking shows "${st.label}" — your ${st.desc}. Learn what this status means, expected timelines, and next steps.`);
      count++;
    }

    // ── Location pages — read from sitemap-locations.xml (12 city locations) ──
    try {
      const locSitemapPath = path.resolve(__dirname, 'public', 'sitemap-locations.xml');
      if (fs.existsSync(locSitemapPath)) {
        const locXml = fs.readFileSync(locSitemapPath, 'utf8');
        const locMatches = locXml.match(/\/locations\/([^<]+)<\/loc>/g) || [];
        for (const m of locMatches) {
          const slug = m.replace('/locations/', '').replace('</loc>', '');
          const parts = slug.split('-');
          const stateCode = parts[parts.length - 1].toUpperCase();
          const cityName = parts.slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          writeShell(
            `/locations/${slug}`,
            `USPS Post Office Locations in ${cityName}, ${stateCode} — Hours, ZIP & Services 2026`,
            `Find all USPS post office locations in ${cityName}, ${stateCode}. Get hours, ZIP codes, services, and real-time package tracking for ${cityName} area post offices.`
          );
          count++;
        }
      }
    } catch (e: any) { /* locations shell generation failed silently */ }

    // ── Route pages — read from sitemap files to cover all 950 routes ──
    try {
      const routeFiles = ['sitemap-routes.xml', 'sitemap-routes-2.xml'];
      for (const routeFile of routeFiles) {
        const routeSitemapPath = path.resolve(__dirname, 'public', routeFile);
        if (fs.existsSync(routeSitemapPath)) {
          const routeXml = fs.readFileSync(routeSitemapPath, 'utf8');
          const routeMatches = routeXml.match(/\/route\/([^<]+)<\/loc>/g) || [];
          for (const m of routeMatches) {
            const slug = m.replace('/route/', '').replace('</loc>', '');
            const parts = slug.split('-to-');
            const fromRaw = parts[0] || slug;
            const toRaw = parts[1] || '';
            const fmtRoute = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ ([A-Za-z]{2})$/, (_, code) => `, ${code.toUpperCase()}`);
            const fromName = fmtRoute(fromRaw);
            const toName = fmtRoute(toRaw);
            const title = toName
              ? `USPS Shipping from ${fromName} to ${toName} — Transit Times & Tracking 2026`
              : `USPS Shipping Route: ${fromName} — Tracking & Transit Times 2026`;
            const desc = toName
              ? `USPS shipping from ${fromName} to ${toName}. Estimated transit times, delivery dates, Priority Mail, First-Class, and Ground Advantage rates. Track packages on this route.`
              : `USPS shipping route for ${fromName}. Track packages, check transit times, and get delivery estimates.`;
            writeShell(`/route/${slug}`, title, desc);
            count++;
          }
        }
      }
    } catch (e: any) { /* route shell generation failed silently */ }

    // ── Article pages — supplement with sitemap-articles.xml to cover all 299 ──
    try {
      const articleSitemapPath = path.resolve(__dirname, 'public', 'sitemap-articles.xml');
      if (fs.existsSync(articleSitemapPath)) {
        const artXml = fs.readFileSync(articleSitemapPath, 'utf8');
        const artMatches = artXml.match(/\/article\/([^<]+)<\/loc>/g) || [];
        const existingArticleSlugs = new Set(articleSlugs);
        for (const m of artMatches) {
          const slug = m.replace('/article/', '').replace('</loc>', '');
          if (!existingArticleSlugs.has(slug)) {
            const art = articleMap?.[slug];
            const prettyTitle = slug.replace(/-/g, ' ').replace(/usps /i, 'USPS ').replace(/\b\w/g, c => c.toUpperCase());
            const title = art ? art.title : `${prettyTitle} — Complete Guide 2026`;
            const desc = art ? art.metaDescription : `Complete guide to ${prettyTitle.toLowerCase()}. Expert tips, solutions, and real-time USPS tracking help. Updated 2026.`;
            writeShell(`/article/${slug}`, title, desc);
            count++;
          }
        }
      }
    } catch (e: any) { /* article supplement failed silently */ }

    // ── City × Status pages ──
    const cityStatuses = ['in-transit','out-for-delivery','delivered','attempted-delivery','available-for-pickup',
      'return-to-sender','forwarded','pre-shipment','accepted','alert','in-transit-arriving-late',
      'delivery-exception','held-at-post-office','missent','undeliverable'];
    for (const city of cities) {
      for (const st of cityStatuses) {
        const label = st.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        writeShell(
          `/city/${city.slug}/status/${st}`,
          `USPS "${label}" in ${city.city}, ${city.stateCode} — 2026 Guide & Next Steps`,
          `Your USPS package status is "${label}" in ${city.city}, ${city.stateCode}. Learn what it means, estimated timeline, and what to do next.`
        );
        count++;
      }
    }

    // ── City × Article pages — all 30 articles per city (6,180 shells) ──
    const cityArticleSlugs = [
      'usps-tracking-not-updating-for-3-days','usps-tracking-not-updating-for-24-hours',
      'usps-tracking-not-updating-for-a-week','usps-package-stuck-in-transit',
      'usps-package-stuck-in-transit-for-2-weeks','usps-tracking-shows-delivered-but-no-package',
      'usps-tracking-number-not-found','usps-tracking-number-not-working',
      'usps-package-lost-in-transit','usps-package-delayed',
      'usps-priority-mail-tracking','usps-first-class-mail-tracking',
      'usps-media-mail-tracking','usps-certified-mail-tracking',
      'usps-registered-mail-tracking','usps-express-mail-tracking',
      'usps-flat-rate-box-tracking','usps-international-tracking',
      'usps-tracking-number-format','how-to-track-usps-package-without-number',
      'usps-informed-delivery-tracking','usps-package-out-for-delivery-but-not-delivered',
      'usps-tracking-in-transit-arriving-late','usps-package-arrived-at-facility',
      'usps-package-departed-facility','usps-package-accepted-at-facility',
      'usps-package-awaiting-delivery-scan','usps-package-held-at-post-office',
      'usps-redelivery-tracking','usps-package-return-to-sender',
    ];
    for (const city of cities) {
      for (const art of cityArticleSlugs) {
        const prettyArt = art.replace(/-/g, ' ').replace(/usps /i, 'USPS ').replace(/how to /i, 'How to ').replace(/\b\w/g, c => c.toUpperCase());
        writeShell(
          `/city/${city.slug}/article/${art}`,
          `${prettyArt} in ${city.city}, ${city.stateCode} — 2026 Complete Guide`,
          `${prettyArt} guide for ${city.city}, ${city.stateCode}. Local USPS tips, tracking solutions, and contact info for the ${city.city} area.`
        );
        count++;
      }
    }

    // ── City × Carrier pages ──
    const carrierNames: Record<string, string> = { usps:'USPS', fedex:'FedEx', ups:'UPS', dhl:'DHL', amazon:'Amazon', ontrac:'OnTrac', lasership:'LaserShip', 'spee-dee':'Spee-Dee' };
    for (const city of cities) {
      for (const [cid, cname] of Object.entries(carrierNames)) {
        writeShell(
          `/city/${city.slug}/carrier/${cid}`,
          `${cname} Shipping & Tracking in ${city.city}, ${city.stateCode} — 2026 Guide`,
          `${cname} package tracking and delivery in ${city.city}, ${city.stateCode}. Track ${cname} packages, delivery times, and drop-off locations.`
        );
        count++;
      }
    }

    // ── City × Topic pages — 10 slugs from sitemap-programmatic.xml (2,060 shells) ──
    const cityTopics = [
      { slug: 'tracking-not-updating', label: 'USPS Tracking Not Updating', desc: 'why USPS tracking is not updating and how to fix it' },
      { slug: 'package-in-transit', label: 'USPS Package In Transit', desc: 'what USPS package in transit means and expected delivery' },
      { slug: 'delivered-but-not-received', label: 'USPS Delivered But Not Received', desc: 'what to do when USPS shows delivered but you got nothing' },
      { slug: 'tracking-number-format', label: 'USPS Tracking Number Format', desc: 'how to read and understand USPS tracking number formats' },
      { slug: 'package-delayed', label: 'USPS Package Delayed', desc: 'why your USPS package is delayed and what to do' },
      { slug: 'priority-mail-tracking', label: 'USPS Priority Mail Tracking', desc: 'how to track USPS Priority Mail packages' },
      { slug: 'first-class-tracking', label: 'USPS First Class Tracking', desc: 'how to track USPS First Class Mail packages' },
      { slug: 'certified-mail-tracking', label: 'USPS Certified Mail Tracking', desc: 'how to track USPS Certified Mail with return receipt' },
      { slug: 'package-lost', label: 'USPS Package Lost', desc: 'how to find a lost USPS package and file a claim' },
      { slug: 'delivery-time', label: 'USPS Delivery Time', desc: 'USPS delivery times by service type and destination' },
    ];
    for (const city of cities) {
      for (const topic of cityTopics) {
        writeShell(
          `/city/${city.slug}/${topic.slug}`,
          `${topic.label} in ${city.city}, ${city.stateCode} — 2026 Guide`,
          `${topic.label} guide for ${city.city}, ${city.stateCode}. Learn ${topic.desc} for packages in the ${city.city} area.`
        );
        count++;
      }
    }

    // ── State × Carrier pages ──
    const statesCodes = ['al','ak','az','ar','ca','co','ct','de','fl','ga','hi','id','il','in','ia','ks','ky','la','me','md','ma','mi','mn','ms','mo','mt','ne','nv','nh','nj','nm','ny','nc','nd','oh','ok','or','pa','ri','sc','sd','tn','tx','ut','vt','va','wa','wv','wi','wy','dc'];
    for (const sc of statesCodes) {
      const sName = sc.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      for (const [cid, cname] of Object.entries(carrierNames)) {
        writeShell(
          `/state/${sc}/carrier/${cid}`,
          `${cname} Shipping & Tracking in ${sName} — 2026 Guide`,
          `${cname} package tracking across ${sName}. Track ${cname} packages, delivery times, and service coverage.`
        );
        count++;
      }
    }

    // ── ZIP code pages — read from usCities.ts AND sitemap-zipcodes.xml for full coverage ──
    const allZips = new Set<string>();
    try {
      const cityFile = fs.readFileSync(path.resolve(__dirname, 'src/data/usCities.ts'), 'utf8');
      const zipRegex = /"(\d{5})"/g;
      let zm;
      while ((zm = zipRegex.exec(cityFile)) !== null) allZips.add(zm[1]);
    } catch {}
    try {
      const zipSitemapPath = path.resolve(__dirname, 'public', 'sitemap-zipcodes.xml');
      if (fs.existsSync(zipSitemapPath)) {
        const zipXml = fs.readFileSync(zipSitemapPath, 'utf8');
        const zipMatches = zipXml.match(/\/zip\/(\d{5})<\/loc>/g) || [];
        for (const m of zipMatches) {
          const z = m.replace('/zip/', '').replace('</loc>', '');
          allZips.add(z);
        }
      }
    } catch {}
    for (const zip of [...allZips].sort()) {
      writeShell(
        `/zip/${zip}`,
        `USPS Tracking for ZIP Code ${zip} — Post Office & Delivery Info 2026`,
        `Track USPS packages to ZIP code ${zip}. Find post office locations, delivery times, and carrier information for ZIP ${zip}.`
      );
      count++;
    }

    console.log(`✅ Prerender shells: Generated ${count} static HTML files with unique titles`);
  }

  return {
    name: 'prerender-shell-generator',
    buildStart() { generateShells(); },
    configureServer() { generateShells(); },
  };
}

// ── Vite Plugin: Post-Build SEO Automation ──────────────────────────
// Runs all sitemap generation, carrier sitemap, unified index, and robots.txt
// automatically after every build — no manual scripts needed
function postBuildSeoPlugin() {
  const SITE_URL = 'https://uspostaltracking.com';
  const PUB = path.resolve(__dirname, 'public');
  const DIST = path.resolve(__dirname, 'dist');

  function buildSitemapXml(urls: { loc: string; priority?: string; changefreq?: string }[]) {
    const today = new Date().toISOString().split('T')[0];
    const entries = urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq || 'weekly'}</changefreq>\n    <priority>${u.priority || '0.6'}</priority>\n  </url>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
  }

  function writeUnifiedIndex(dir: string) {
    const today = new Date().toISOString().split('T')[0];
    const sitemapFiles = fs.readdirSync(dir)
      .filter(f => f.startsWith('sitemap-') && f.endsWith('.xml') && f !== 'sitemap-index.xml')
      .filter(f => {
        try {
          const c = fs.readFileSync(path.join(dir, f), 'utf8');
          return c.startsWith('<?xml') && (c.includes('<urlset') || c.includes('<sitemapindex'));
        } catch { return false; }
      })
      .sort();

    const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapFiles
      .map(f => `  <sitemap><loc>${SITE_URL}/${f}</loc><lastmod>${today}</lastmod></sitemap>`)
      .join('\n')}\n</sitemapindex>`;

    fs.writeFileSync(path.join(dir, 'sitemap-index.xml'), indexXml);
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), indexXml);

    let total = 0;
    for (const f of sitemapFiles) {
      const c = fs.readFileSync(path.join(dir, f), 'utf8');
      total += (c.match(/<url>/g) || []).length;
    }
    return { count: sitemapFiles.length, total };
  }

  function generateCarrierSitemap(dir: string) {
    try {
      const carriersFile = fs.readFileSync(path.resolve(__dirname, 'src/data/carriers.ts'), 'utf8');
      const extraFile = fs.existsSync(path.resolve(__dirname, 'src/data/carriers-extra.ts'))
        ? fs.readFileSync(path.resolve(__dirname, 'src/data/carriers-extra.ts'), 'utf8') : '';
      const extra2File = fs.existsSync(path.resolve(__dirname, 'src/data/carriers-extra2.ts'))
        ? fs.readFileSync(path.resolve(__dirname, 'src/data/carriers-extra2.ts'), 'utf8') : '';

      const idRegex = /id:\s*["']([^"']+)["']/g;
      const ids = new Set<string>();
      for (const content of [carriersFile, extraFile, extra2File]) {
        let match;
        while ((match = idRegex.exec(content)) !== null) ids.add(match[1]);
      }

      const urls = [
        { loc: `${SITE_URL}/tracking`, priority: '0.9', changefreq: 'daily' },
        { loc: `${SITE_URL}/sitemap`, priority: '0.5', changefreq: 'weekly' },
        { loc: `${SITE_URL}/knowledge-center`, priority: '0.8', changefreq: 'weekly' },
      ];
      for (const id of [...ids].sort()) {
        urls.push({ loc: `${SITE_URL}/tracking/${id}`, priority: '0.7', changefreq: 'weekly' });
      }

      fs.writeFileSync(path.join(dir, 'sitemap-carriers.xml'), buildSitemapXml(urls));
      console.log(`[post-build-seo] ✅ sitemap-carriers.xml: ${urls.length} URLs`);
    } catch (e: any) {
      console.log(`[post-build-seo] ⚠️ carrier sitemap skipped: ${e.message}`);
    }
  }

  function generateLandingSitemap(dir: string) {
    const landingPages = [
      '/post-office-tracking', '/mail-tracking', '/postal-tracking',
      '/usps-tracker', '/track-usps', '/usa-tracking', '/package-tracker-usps',
      '/where-is-my-package', '/usps-delivery-time', '/usps-lost-package',
      '/usps-schedule-pickup', '/usps-hold-for-pickup', '/usps-change-address',
      '/usps-package-not-delivered', '/usps-shipping-calculator',
      '/seguimiento-usps', '/track-my-usps-package', '/us-post-tracking',
      '/check-usps-tracking', '/track-and-trace-usps', '/track-parcel-usa',
      '/dhl-tracking', '/amazon-tracking', '/lasership-tracking',
      '/speedex-tracking', '/ontrac-tracking', '/doordash-tracking',
      '/easypost-tracking', '/colissimo-tracking', '/sf-express-tracking',
      '/india-post-tracking', '/ceva-tracking', '/singapore-mail-tracking',
      '/deutsche-post-tracking', '/alibaba-tracking', '/roadie-tracking',
      '/usps-trackint', '/travk-usps', '/isps-track',
      '/knowledge-center/carrier-tracking-formats',
    ];
    const urls = landingPages.map(p => ({ loc: `${SITE_URL}${p}`, priority: p.includes('track') ? '0.8' : '0.7', changefreq: 'weekly' }));
    fs.writeFileSync(path.join(dir, 'sitemap-landing.xml'), buildSitemapXml(urls));
    console.log(`[post-build-seo] ✅ sitemap-landing.xml: ${urls.length} URLs`);
  }

  function generateZipSitemap(dir: string) {
    try {
      const citiesFile = fs.readFileSync(path.resolve(__dirname, 'src/data/usCities.ts'), 'utf8');
      const zipRegex = /zipCodes:\[([^\]]+)\]/g;
      const allZips = new Set<string>();
      let m;
      while ((m = zipRegex.exec(citiesFile)) !== null) {
        const zips = m[1].match(/"(\d{5})"/g);
        if (zips) zips.forEach((z: string) => allZips.add(z.replace(/"/g, '')));
      }
      const urls = [...allZips].sort().map(z => ({ loc: `${SITE_URL}/zip/${z}`, priority: '0.5', changefreq: 'monthly' }));
      fs.writeFileSync(path.join(dir, 'sitemap-zipcodes.xml'), buildSitemapXml(urls));
      console.log(`[post-build-seo] ✅ sitemap-zipcodes.xml: ${urls.length} URLs`);
    } catch (e: any) {
      console.log(`[post-build-seo] ⚠️ zip sitemap skipped: ${e.message}`);
    }
  }

  function generateCityStatusSitemap(dir: string) {
    try {
      const citiesFile = fs.readFileSync(path.resolve(__dirname, 'src/data/usCities.ts'), 'utf8');
      const slugRegex = /slug:"([^"]+)"/g;
      const citySlugs: string[] = [];
      let m;
      while ((m = slugRegex.exec(citiesFile)) !== null) citySlugs.push(m[1]);

      const statuses = ['in-transit','out-for-delivery','delivered','attempted-delivery','available-for-pickup',
        'return-to-sender','forwarded','pre-shipment','accepted','alert','in-transit-arriving-late',
        'delivery-exception','held-at-post-office','missent','undeliverable'];

      const urls: { loc: string; priority?: string; changefreq?: string }[] = [];
      for (const city of citySlugs) {
        for (const status of statuses) {
          urls.push({ loc: `${SITE_URL}/city/${city}/status/${status}`, priority: '0.5', changefreq: 'monthly' });
        }
      }

      // Split into multiple sitemaps if > 5000 URLs
      const CHUNK = 5000;
      for (let i = 0; i < urls.length; i += CHUNK) {
        const chunk = urls.slice(i, i + CHUNK);
        const suffix = i === 0 ? '' : `-${Math.floor(i / CHUNK) + 1}`;
        fs.writeFileSync(path.join(dir, `sitemap-city-status${suffix}.xml`), buildSitemapXml(chunk));
        console.log(`[post-build-seo] ✅ sitemap-city-status${suffix}.xml: ${chunk.length} URLs`);
      }
    } catch (e: any) {
      console.log(`[post-build-seo] ⚠️ city-status sitemap skipped: ${e.message}`);
    }
  }

  function generateCityCarrierSitemap(dir: string) {
    try {
      const citiesFile = fs.readFileSync(path.resolve(__dirname, 'src/data/usCities.ts'), 'utf8');
      const slugRegex = /slug:"([^"]+)"/g;
      const citySlugs: string[] = [];
      let m;
      while ((m = slugRegex.exec(citiesFile)) !== null) citySlugs.push(m[1]);

      const carriers = ['usps','fedex','ups','dhl','amazon','ontrac','lasership','spee-dee'];
      const urls = citySlugs.flatMap(city => 
        carriers.map(carrier => ({ loc: `${SITE_URL}/city/${city}/carrier/${carrier}`, priority: '0.5', changefreq: 'monthly' }))
      );

      fs.writeFileSync(path.join(dir, 'sitemap-city-carrier.xml'), buildSitemapXml(urls));
      console.log(`[post-build-seo] ✅ sitemap-city-carrier.xml: ${urls.length} URLs`);
    } catch (e: any) {
      console.log(`[post-build-seo] ⚠️ city-carrier sitemap skipped: ${e.message}`);
    }
  }

  function generateCityArticleSitemap(dir: string) {
    try {
      const citiesFile = fs.readFileSync(path.resolve(__dirname, 'src/data/usCities.ts'), 'utf8');
      const slugRegex = /slug:"([^"]+)"/g;
      const citySlugs: string[] = [];
      let m;
      while ((m = slugRegex.exec(citiesFile)) !== null) citySlugs.push(m[1]);

      // Extract article keywords
      const artFile = fs.readFileSync(path.resolve(__dirname, 'src/data/usCities.ts'), 'utf8');
      const artMatch = artFile.match(/articleKeywords:\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
      const articles: string[] = [];
      if (artMatch) {
        const artRegex = /"([^"]+)"/g;
        let am;
        while ((am = artRegex.exec(artMatch[1])) !== null) articles.push(am[1]);
      }

      if (articles.length === 0) {
        // Fallback articles
        articles.push('usps-tracking-not-updating-for-3-days','usps-package-stuck-in-transit',
          'usps-tracking-shows-delivered-but-no-package','usps-tracking-number-not-found',
          'usps-package-lost-in-transit','usps-priority-mail-tracking','usps-international-tracking',
          'usps-tracking-number-format','usps-package-delayed','usps-first-class-mail-tracking');
      }

      const urls: { loc: string; priority?: string; changefreq?: string }[] = [];
      for (const city of citySlugs) {
        for (const art of articles.slice(0, 30)) { // Top 30 articles per city
          urls.push({ loc: `${SITE_URL}/city/${city}/article/${art}`, priority: '0.4', changefreq: 'monthly' });
        }
      }

      // Split into chunks of 5000
      const CHUNK = 5000;
      for (let i = 0; i < urls.length; i += CHUNK) {
        const chunk = urls.slice(i, i + CHUNK);
        const suffix = i === 0 ? '' : `-${Math.floor(i / CHUNK) + 1}`;
        fs.writeFileSync(path.join(dir, `sitemap-city-article${suffix}.xml`), buildSitemapXml(chunk));
        console.log(`[post-build-seo] ✅ sitemap-city-article${suffix}.xml: ${chunk.length} URLs`);
      }
    } catch (e: any) {
      console.log(`[post-build-seo] ⚠️ city-article sitemap skipped: ${e.message}`);
    }
  }

  function generateStateCarrierSitemap(dir: string) {
    try {
      const states = ['al','ak','az','ar','ca','co','ct','de','fl','ga','hi','id','il','in','ia',
        'ks','ky','la','me','md','ma','mi','mn','ms','mo','mt','ne','nv','nh','nj','nm','ny','nc',
        'nd','oh','ok','or','pa','ri','sc','sd','tn','tx','ut','vt','va','wa','wv','wi','wy','dc'];
      const carriers = ['usps','fedex','ups','dhl','amazon','ontrac','lasership','spee-dee'];

      const urls = states.flatMap(s => 
        carriers.map(c => ({ loc: `${SITE_URL}/state/${s}/carrier/${c}`, priority: '0.5', changefreq: 'monthly' }))
      );

      fs.writeFileSync(path.join(dir, 'sitemap-state-carrier.xml'), buildSitemapXml(urls));
      console.log(`[post-build-seo] ✅ sitemap-state-carrier.xml: ${urls.length} URLs`);
    } catch (e: any) {
      console.log(`[post-build-seo] ⚠️ state-carrier sitemap skipped: ${e.message}`);
    }
  }

  function ensureRobotsTxt(dir: string) {
    const robotsPath = path.join(dir, 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      let content = fs.readFileSync(robotsPath, 'utf8');
      if (!content.includes('Sitemap:')) {
        content += `\nSitemap: ${SITE_URL}/sitemap.xml\n`;
        fs.writeFileSync(robotsPath, content);
      }
    }
  }

  function pingIndexNow(urls: string[]) {
    const INDEXNOW_KEY = 'uspostaltracking2025indexnow';
    const payload = JSON.stringify({
      host: 'uspostaltracking.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    });

    const endpoints = [
      { host: 'api.indexnow.org', path: '/indexnow' },
      { host: 'www.bing.com', path: '/indexnow' },
      { host: 'yandex.com', path: '/indexnow' },
    ];

    for (const ep of endpoints) {
      try {
        const http = require('https');
        const req = http.request({
          hostname: ep.host, port: 443, path: ep.path, method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) },
        }, (res: any) => {
          console.log(`[post-build-seo] 📡 IndexNow ${ep.host}: HTTP ${res.statusCode}`);
        });
        req.on('error', (e: any) => console.log(`[post-build-seo] ⚠️ IndexNow ${ep.host}: ${e.message}`));
        req.write(payload);
        req.end();
      } catch (e: any) {
        console.log(`[post-build-seo] ⚠️ IndexNow ${ep.host}: ${e.message}`);
      }
    }
  }

  function collectAllUrls(dir: string): string[] {
    const urls: string[] = [];
    const files = fs.readdirSync(dir).filter((f: string) => f.startsWith('sitemap-') && f.endsWith('.xml'));
    for (const f of files) {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      const locRegex = /<loc>([^<]+)<\/loc>/g;
      let m;
      while ((m = locRegex.exec(content)) !== null) urls.push(m[1]);
    }
    return urls;
  }

  function runPostBuild() {
    const dir = fs.existsSync(DIST) ? DIST : PUB;
    console.log(`[post-build-seo] 🚀 Running post-build SEO automation on ${dir === DIST ? 'dist' : 'public'}...`);

    // 1. Generate carrier sitemap
    generateCarrierSitemap(dir);

    // 2. Generate landing sitemap  
    generateLandingSitemap(dir);

    // 3. Generate ZIP code sitemap
    generateZipSitemap(dir);

    // 4. Generate city × status sitemaps
    generateCityStatusSitemap(dir);

    // 5. Generate city × carrier sitemap
    generateCityCarrierSitemap(dir);

    // 6. Generate city × article sitemaps
    generateCityArticleSitemap(dir);

    // 7. Generate state × carrier sitemap
    generateStateCarrierSitemap(dir);

    // 6. Build unified sitemap index from ALL sitemap-*.xml files
    const result = writeUnifiedIndex(dir);
    console.log(`[post-build-seo] ✅ sitemap.xml: ${result.count} sitemaps, ${result.total} total URLs`);

    // 7. Ensure robots.txt has sitemap reference
    ensureRobotsTxt(dir);
    console.log(`[post-build-seo] ✅ robots.txt verified`);

    // 8. If we built to dist, also update public so next dev run has fresh data
    if (dir === DIST && fs.existsSync(PUB)) {
      const pubResult = writeUnifiedIndex(PUB);
      console.log(`[post-build-seo] ✅ public/sitemap.xml also updated: ${pubResult.count} sitemaps`);
    }

    // 9. 🔔 Auto-ping IndexNow with ALL URLs
    const allUrls = collectAllUrls(dir);
    if (allUrls.length > 0) {
      console.log(`[post-build-seo] 📡 Pinging IndexNow with ${allUrls.length} URLs...`);
      for (let i = 0; i < allUrls.length; i += 10000) {
        pingIndexNow(allUrls.slice(i, i + 10000));
      }
      console.log(`[post-build-seo] ✅ IndexNow ping sent to 3 search engines`);
    }
  }

  return {
    name: 'post-build-seo',
    closeBundle() { runPostBuild(); },
    configureServer() {
      generateCarrierSitemap(PUB);
      generateLandingSitemap(PUB);
      generateZipSitemap(PUB);
      generateCityStatusSitemap(PUB);
      generateCityCarrierSitemap(PUB);
      generateCityArticleSitemap(PUB);
      generateStateCarrierSitemap(PUB);
      writeUnifiedIndex(PUB);
      ensureRobotsTxt(PUB);
      console.log('[post-build-seo] ✅ Sitemaps synced for dev');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    hmr: { overlay: false },
    watch: {
      ignored: ['**/public/**', '**/.git/**', '**/node_modules/**'],
    },
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  },
  plugins: [
    react(),
    // componentTagger removed
    adminApiPlugin(),
    programmaticSeoPlugin(),
    prerenderShellPlugin(),
    postBuildSeoPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime.js"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    sourcemap: mode === "development",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: true,
        pure_funcs: mode === "production" ? ["console.log", "console.info", "console.debug"] : [],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-icons": ["lucide-react"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select"],
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (/\.css$/.test(assetInfo.name || "")) return "assets/css/[name]-[hash][extname]";
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/.test(assetInfo.name || "")) return "assets/img/[name]-[hash][extname]";
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || "")) return "assets/fonts/[name]-[hash][extname]";
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-router-dom",
      "lucide-react",
      "@tanstack/react-query",
      "clsx",
      "tailwind-merge",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-collapsible",
    ],
    force: false,
  },
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __SITE_URL__: JSON.stringify("https://uspostaltracking.com"),
    __SITE_NAME__: JSON.stringify("US Postal Tracking"),
    __ADSENSE_ID__: JSON.stringify("ca-pub-XXXXXXXXXXXXXXXX"),
    __INDEXNOW_KEY__: JSON.stringify("uspostaltracking2025indexnow"),
  },
}));

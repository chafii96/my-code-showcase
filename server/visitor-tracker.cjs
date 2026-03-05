/**
 * ██╗   ██╗██╗███████╗██╗████████╗ ██████╗ ██████╗     ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║   ██║██║██╔════╝██║╚══██╔══╝██╔═══██╗██╔══██╗    ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║   ██║██║███████╗██║   ██║   ██║   ██║██████╔╝       ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
 * ╚██╗ ██╔╝██║╚════██║██║   ██║   ██║   ██║██╔══██╗       ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
 *  ╚████╔╝ ██║███████║██║   ██║   ╚██████╔╝██║  ██║       ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
 *   ╚═══╝  ╚═╝╚══════╝╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
 * 
 * Real Visitor Tracking System — logs every visit to a local JSON database
 * No external services needed — 100% self-hosted analytics
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '../seo-data/visitors.json');
const SESSIONS_PATH = path.join(__dirname, '../seo-data/sessions.json');

// ── Ensure data directory exists ────────────────────────────────────────────
function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      totalPageviews: 0,
      totalSessions: 0,
      totalUniqueVisitors: 0,
      pages: {},
      referrers: {},
      userAgents: {},
      countries: {},
      devices: {},
      hours: Array(24).fill(0),
      days: {},
      recentVisits: [],
      keywords: {},
    }, null, 2));
  }
  if (!fs.existsSync(SESSIONS_PATH)) {
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify({}, null, 2));
  }
}

// ── Parse device from User-Agent ─────────────────────────────────────────────
function parseDevice(ua) {
  if (!ua) return 'Unknown';
  if (/mobile|android|iphone|ipad/i.test(ua)) return 'Mobile';
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

// ── Parse browser from User-Agent ────────────────────────────────────────────
function parseBrowser(ua) {
  if (!ua) return 'Unknown';
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) return 'Chrome';
  if (/firefox/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/edge/i.test(ua)) return 'Edge';
  if (/opera|opr/i.test(ua)) return 'Opera';
  return 'Other';
}

// ── Parse OS from User-Agent ──────────────────────────────────────────────────
function parseOS(ua) {
  if (!ua) return 'Unknown';
  if (/windows/i.test(ua)) return 'Windows';
  if (/mac os/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  if (/android/i.test(ua)) return 'Android';
  if (/ios|iphone|ipad/i.test(ua)) return 'iOS';
  return 'Other';
}

// ── Parse referrer source ─────────────────────────────────────────────────────
function parseReferrerSource(ref) {
  if (!ref) return 'Direct';
  if (/google/i.test(ref)) return 'Google';
  if (/bing/i.test(ref)) return 'Bing';
  if (/yahoo/i.test(ref)) return 'Yahoo';
  if (/facebook|fb\.com/i.test(ref)) return 'Facebook';
  if (/twitter|t\.co/i.test(ref)) return 'Twitter';
  if (/reddit/i.test(ref)) return 'Reddit';
  if (/youtube/i.test(ref)) return 'YouTube';
  if (/pinterest/i.test(ref)) return 'Pinterest';
  if (/instagram/i.test(ref)) return 'Instagram';
  if (/linkedin/i.test(ref)) return 'LinkedIn';
  return 'Other';
}

// ── Get session ID from cookie or create new ──────────────────────────────────
function getOrCreateSession(req) {
  const cookieHeader = req.headers['cookie'] || '';
  const sessionMatch = cookieHeader.match(/swt_session=([a-f0-9]+)/);
  if (sessionMatch) return { id: sessionMatch[1], isNew: false };
  const id = crypto.randomBytes(16).toString('hex');
  return { id, isNew: true };
}

// ── Main tracking middleware ──────────────────────────────────────────────────
function trackVisit(req, res, next) {
  // Skip API calls, static assets, admin pages
  const url = req.url || '/';
  if (
    url.startsWith('/api/') ||
    url.startsWith('/admin') ||
    url.startsWith('/@') ||
    url.startsWith('/node_modules') ||
    url.includes('.') && !url.endsWith('.html')
  ) {
    return next();
  }

  try {
    ensureDB();
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const sessions = JSON.parse(fs.readFileSync(SESSIONS_PATH, 'utf8'));

    const ua = req.headers['user-agent'] || '';
    const ref = req.headers['referer'] || '';
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
    const ipHash = crypto.createHash('md5').update(ip).digest('hex').slice(0, 8);
    const { id: sessionId, isNew } = getOrCreateSession(req);
    const now = new Date();
    const hour = now.getHours();
    const day = now.toISOString().slice(0, 10);
    const path_ = url.split('?')[0] || '/';

    // Update counters
    db.totalPageviews = (db.totalPageviews || 0) + 1;
    if (isNew) {
      db.totalSessions = (db.totalSessions || 0) + 1;
      db.totalUniqueVisitors = (db.totalUniqueVisitors || 0) + 1;
    }

    // Page tracking
    if (!db.pages[path_]) db.pages[path_] = { views: 0, sessions: new Set(), bounces: 0 };
    db.pages[path_].views = (db.pages[path_].views || 0) + 1;

    // Referrer tracking
    const refSource = parseReferrerSource(ref);
    db.referrers[refSource] = (db.referrers[refSource] || 0) + 1;

    // Device tracking
    const device = parseDevice(ua);
    db.devices[device] = (db.devices[device] || 0) + 1;

    // Browser tracking
    const browser = parseBrowser(ua);
    if (!db.browsers) db.browsers = {};
    db.browsers[browser] = (db.browsers[browser] || 0) + 1;

    // OS tracking
    const os = parseOS(ua);
    if (!db.os) db.os = {};
    db.os[os] = (db.os[os] || 0) + 1;

    // Hourly distribution
    if (!db.hours) db.hours = Array(24).fill(0);
    db.hours[hour] = (db.hours[hour] || 0) + 1;

    // Daily distribution
    if (!db.days) db.days = {};
    db.days[day] = (db.days[day] || 0) + 1;

    // Recent visits (keep last 500)
    if (!db.recentVisits) db.recentVisits = [];
    db.recentVisits.unshift({
      ts: now.toISOString(),
      path: path_,
      ref: refSource,
      device,
      browser,
      os,
      session: sessionId.slice(0, 8),
      ip: ipHash,
    });
    if (db.recentVisits.length > 500) db.recentVisits = db.recentVisits.slice(0, 500);

    // Session tracking
    sessions[sessionId] = {
      lastSeen: now.toISOString(),
      pages: [...(sessions[sessionId]?.pages || []), path_].slice(-20),
      device,
      browser,
      ref: refSource,
    };

    // Save
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2));

    // Set session cookie
    if (isNew) {
      res.setHeader('Set-Cookie', `swt_session=${sessionId}; Path=/; Max-Age=1800; SameSite=Lax`);
    }
  } catch (e) {
    // Never break the request
    console.error('[Tracker]', e.message);
  }

  next();
}

// ── Analytics API endpoints ───────────────────────────────────────────────────
function getAnalytics() {
  try {
    ensureDB();
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const sessions = JSON.parse(fs.readFileSync(SESSIONS_PATH, 'utf8'));

    // Active sessions (last 30 min)
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const activeSessions = Object.values(sessions).filter(s => s.lastSeen > thirtyMinAgo).length;

    // Top pages
    const topPages = Object.entries(db.pages || {})
      .map(([path, data]) => ({ path, views: data.views || 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20);

    // Top referrers
    const topReferrers = Object.entries(db.referrers || {})
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // Devices
    const devices = Object.entries(db.devices || {})
      .map(([device, count]) => ({ device, count }));

    // Browsers
    const browsers = Object.entries(db.browsers || {})
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count);

    // OS
    const os = Object.entries(db.os || {})
      .map(([os, count]) => ({ os, count }))
      .sort((a, b) => b.count - a.count);

    // Daily trend (last 30 days)
    const today = new Date();
    const dailyTrend = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyTrend.push({ date: key, views: db.days?.[key] || 0 });
    }

    // Hourly distribution
    const hourlyDist = (db.hours || Array(24).fill(0)).map((count, hour) => ({ hour, count }));

    return {
      summary: {
        totalPageviews: db.totalPageviews || 0,
        totalSessions: db.totalSessions || 0,
        totalUniqueVisitors: db.totalUniqueVisitors || 0,
        activeSessions,
        todayViews: db.days?.[new Date().toISOString().slice(0, 10)] || 0,
      },
      topPages,
      topReferrers,
      devices,
      browsers,
      os,
      dailyTrend,
      hourlyDist,
      recentVisits: (db.recentVisits || []).slice(0, 50),
    };
  } catch (e) {
    return { error: e.message };
  }
}

// ── Real-time active visitors ─────────────────────────────────────────────────
function getActiveVisitors() {
  try {
    ensureDB();
    const sessions = JSON.parse(fs.readFileSync(SESSIONS_PATH, 'utf8'));
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const active = Object.values(sessions).filter(s => s.lastSeen > fiveMinAgo);
    return {
      count: active.length,
      pages: active.map(s => s.pages?.[s.pages.length - 1] || '/'),
    };
  } catch (e) {
    return { count: 0, pages: [] };
  }
}

module.exports = { trackVisit, getAnalytics, getActiveVisitors };

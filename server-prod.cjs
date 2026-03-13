'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const SEO_DATA = path.join(ROOT, 'seo-data');

if (!fs.existsSync(SEO_DATA)) fs.mkdirSync(SEO_DATA, { recursive: true });

const app = express();
app.use(express.json({ limit: '10mb' }));

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') { res.statusCode = 200; res.end(); return; }
  }
  next();
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const ensureDir = (f) => { const d = path.dirname(f); if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
const readJSON = (f, def = {}) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } };
const writeJSON = (f, data) => { ensureDir(f); fs.writeFileSync(f, JSON.stringify(data, null, 2)); };

// ── Config ────────────────────────────────────────────────────────────────────
const CONFIG_FILE = path.join(SEO_DATA, 'config.json');
const PROVIDERS_FILE = path.join(SEO_DATA, 'failover-providers.json');
const TRACKING_CACHE_FILE = path.join(SEO_DATA, 'tracking-cache.json');
const TRACKING_LOGS_FILE = path.join(SEO_DATA, 'tracking-logs.json');
const VISITORS_FILE = path.join(SEO_DATA, 'visitors.json');
const SCRAPERS_FILE = path.join(SEO_DATA, 'scrapers-config.json');
const CACHE_SETTINGS_FILE = path.join(SEO_DATA, 'cache-settings.json');

const loadConfig = () => readJSON(CONFIG_FILE, {});
const saveConfig = (c) => writeJSON(CONFIG_FILE, c);

const DEFAULT_PROVIDERS = [
  { id: 'ship24', name: 'Ship24', enabled: true, priority: 1, icon: '🚀', color: '#3b82f6',
    accounts: [{ id: 's24-1', providerId: 'ship24', name: 'Ship24 - Account 1', apiKey: '', dailyQuota: 100, monthlyQuota: 100, usedToday: 0, usedThisMonth: 0, enabled: true, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'active' }] },
  { id: 'trackingmore', name: 'TrackingMore', enabled: true, priority: 2, icon: '📦', color: '#10b981',
    accounts: [{ id: 'tm-1', providerId: 'trackingmore', name: 'TrackingMore - Account 1', apiKey: '', dailyQuota: 500, monthlyQuota: 500, usedToday: 0, usedThisMonth: 0, enabled: true, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'active' }] },
  { id: '17track', name: '17Track', enabled: false, priority: 3, icon: '🌐', color: '#f59e0b',
    accounts: [{ id: '17t-1', providerId: '17track', name: '17Track - Account 1', apiKey: '', dailyQuota: 500, monthlyQuota: 500, usedToday: 0, usedThisMonth: 0, enabled: false, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'disabled' }] },
  { id: 'scraper', name: 'Custom Scraper', enabled: true, priority: 4, icon: '🕷️', color: '#8b5cf6',
    accounts: [{ id: 'sc-1', providerId: 'scraper', name: 'Custom Scraper - Default', apiKey: 'N/A', dailyQuota: 10000, monthlyQuota: 10000, usedToday: 0, usedThisMonth: 0, enabled: true, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'active' }] },
];

const loadProviders = () => {
  if (fs.existsSync(PROVIDERS_FILE)) { try { return readJSON(PROVIDERS_FILE, DEFAULT_PROVIDERS); } catch {} }
  writeJSON(PROVIDERS_FILE, DEFAULT_PROVIDERS);
  return DEFAULT_PROVIDERS;
};
const saveProviders = (data) => writeJSON(PROVIDERS_FILE, data);

// ── Scraper Engine ────────────────────────────────────────────────────────────
const UA_POOL = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.2; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
];
const pickUA = () => UA_POOL[Math.floor(Math.random() * UA_POOL.length)];

const cleanText = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const extractUspsEventsFromHtml = (html) => {
  const events = [];
  const jsonPatterns = [
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});\s*(?:<\/script>|window\.)/,
    /var\s+detailsJSON\s*=\s*'({[\s\S]*?)'\s*;/,
    /trackResultList\s*=\s*(\[[\s\S]*?\]);\s*(?:var|\/\/|<\/script>)/,
    /"detailItems"\s*:\s*(\[[\s\S]*?\])\s*(?:,|})/,
  ];
  for (const pat of jsonPatterns) {
    const m = html.match(pat);
    if (m && m[1]) {
      try {
        const raw = JSON.parse(m[1]);
        const arr = Array.isArray(raw) ? raw : (raw.trackingDetails || raw.detailItems || []);
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
  const rowPatterns = [
    /<(?:tr|li|div)[^>]*class="[^"]*(?:tb_NHN|tb_PkgHistory|tracking-event-details)[^"]*"[^>]*>([\s\S]*?)<\/(?:tr|li|div)>/g,
    /<(?:tr|li)[^>]*data-event[^>]*>([\s\S]*?)<\/(?:tr|li)>/g,
  ];
  for (const pat of rowPatterns) {
    const matches = [...html.matchAll(pat)];
    for (const m of matches) {
      const inner = m[1];
      const status = cleanText((inner.match(/class="[^"]*(?:tb_status|status-detail|eventStatus)[^"]*"[^>]*>([\s\S]*?)<\//) || [])[1] || '');
      const location = cleanText((inner.match(/class="[^"]*(?:tb_location|eventLocation|scan-location)[^"]*"[^>]*>([\s\S]*?)<\//) || [])[1] || '');
      const date = cleanText((inner.match(/class="[^"]*(?:tb_date|eventDate|event-date)[^"]*"[^>]*>([\s\S]*?)<\//) || [])[1] || '');
      const time = cleanText((inner.match(/class="[^"]*(?:tb_time|eventTime|event-time)[^"]*"[^>]*>([\s\S]*?)<\//) || [])[1] || '');
      if (status) events.push({ status, detail: status, location, date, time });
    }
    if (events.length > 0) return events;
  }
  return events;
};

// L1: USPS HTML Scraper
const scraperL1 = async (tn) => {
  try {
    const r = await fetch(`https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(tn)}`, {
      headers: { 'User-Agent': pickUA(), 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9', 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return null;
    const html = await r.text();
    const events = extractUspsEventsFromHtml(html);
    const statusM = html.match(/class="[^"]*(?:tb_status_summary|status-category|pkg-status)[^"]*"[^>]*>([\s\S]*?)</);
    const rawStatus = cleanText((statusM || [])[1] || '');
    return events.length > 0 ? { events, rawStatus } : null;
  } catch { return null; }
};

// L2: USPS AJAX JSON
const scraperL2 = async (tn) => {
  try {
    const r = await fetch('https://tools.usps.com/go/TrackConfirmAction.action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'User-Agent': pickUA(), 'Accept': 'application/json, text/javascript, */*; q=0.01', 'X-Requested-With': 'XMLHttpRequest', 'Origin': 'https://tools.usps.com', 'Referer': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tn}` },
      body: `tc0=${encodeURIComponent(tn)}&resultType=trackingDetails`,
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return null;
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { return null; }
    const root = data.data || data;
    const rawEvts = [];
    if (root.trackSummary) rawEvts.push(root.trackSummary);
    if (Array.isArray(root.trackDetail)) rawEvts.push(...root.trackDetail);
    const events = rawEvts.map((e) => {
      const city = e.EventCity || e.eventCity || '';
      const st = e.EventState || e.eventState || '';
      const zip = e.EventZIPCode || e.eventZipCode || '';
      return { status: e.Event || e.event || e.eventType || '', detail: e.Event || e.eventDescription || e.event || '', location: [city, st, zip].filter(Boolean).join(', '), date: e.EventDate || e.eventDate || '', time: e.EventTime || e.eventTime || '' };
    }).filter(e => e.status);
    return events.length > 0 ? { events, rawStatus: root.packageStatus || root.statusCategory || '' } : null;
  } catch { return null; }
};

// L3: USPS Mobile
const scraperL3 = async (tn) => {
  try {
    const r = await fetch(`https://m.usps.com/m/TrackConfirmAction?tLabels=${encodeURIComponent(tn)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1', 'Accept': 'text/html,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return null;
    const html = await r.text();
    const events = extractUspsEventsFromHtml(html);
    return events.length > 0 ? { events } : null;
  } catch { return null; }
};

// L4: PackageRadar
const scraperL4 = async (tn) => {
  try {
    const r = await fetch(`https://packageradar.com/api/v1/tracking/usps/${encodeURIComponent(tn)}`, {
      headers: { 'User-Agent': pickUA(), 'Accept': 'application/json', 'Referer': 'https://packageradar.com/', 'Origin': 'https://packageradar.com' },
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return null;
    const data = await r.json();
    const rawEvts = data.checkpoints || data.events || data.tracking_details || (data.data && data.data.events) || [];
    const events = rawEvts.map((e) => ({
      status: e.status || e.message || e.description || '',
      detail: e.detail || e.message || e.description || '',
      location: e.location || e.city || '',
      date: e.time ? new Date(e.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (e.date || ''),
      time: e.time ? new Date(e.time * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : (e.timeStr || ''),
    })).filter(e => e.status);
    return events.length > 0 ? { events, rawStatus: data.status || '' } : null;
  } catch { return null; }
};

// L5: Parcelsapp
const scraperL5 = async (tn) => {
  try {
    const r = await fetch(`https://parcelsapp.com/en/tracking/${encodeURIComponent(tn)}`, {
      headers: { 'User-Agent': pickUA(), 'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return null;
    const html = await r.text();
    const stateM = html.match(/window\.__app_state\s*=\s*({[\s\S]*?});\s*<\/script>/) || html.match(/"events"\s*:\s*(\[[\s\S]*?\])/);
    if (stateM && stateM[1]) {
      try {
        const raw = JSON.parse(stateM[1]);
        const arr = Array.isArray(raw) ? raw : ((raw.shipments && raw.shipments[0] && raw.shipments[0].events) || raw.events || []);
        const events = arr.map((e) => ({ status: e.description || e.status || e.title || '', detail: e.description || e.status || '', location: e.location || e.place || '', date: e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '', time: e.date ? new Date(e.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '' })).filter(e => e.status);
        if (events.length > 0) return { events };
      } catch {}
    }
    return null;
  } catch { return null; }
};

const SCRAPER_LAYERS = [
  { id: 'l1', fn: scraperL1 },
  { id: 'l2', fn: scraperL2 },
  { id: 'l3', fn: scraperL3 },
  { id: 'l4', fn: scraperL4 },
  { id: 'l5', fn: scraperL5 },
];

const runUspsScrapers = async (tn) => {
  let layerConfig = {};
  try {
    if (fs.existsSync(SCRAPERS_FILE)) {
      const saved = readJSON(SCRAPERS_FILE, []);
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

// ── Tracking Helpers ──────────────────────────────────────────────────────────
const ipRateCache = new Map();

const inferStatus = (label) => {
  const l = (label || '').toLowerCase();
  if (l.includes('delivered')) return 'delivered';
  if (l.includes('out for delivery')) return 'out-for-delivery';
  if (l.includes('label') || l.includes('pre-shipment') || l.includes('accepted')) return 'label-created';
  return 'in-transit';
};

const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return iso; } };
const fmtTime = (iso) => { try { return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
const getMonthKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}`; };

const isAccountActive = (a) => {
  if (!a.enabled) return false;
  const isBuiltin = a.providerId === 'scraper' || a.providerId === 'usps';
  if (!isBuiltin && (!a.apiKey || !a.apiKey.trim() || a.apiKey === 'N/A')) return false;
  const mk = getMonthKey();
  const usedThisMonth = a.monthReset !== mk ? 0 : (a.usedThisMonth || 0);
  const monthlyLimit = a.monthlyQuota || a.dailyQuota || 9999;
  if (usedThisMonth >= monthlyLimit) return false;
  if (a.status === 'exhausted' && a.monthReset === mk) return false;
  return true;
};

const updateAccountUsage = (providerId, accountId, success, forceExhaust = false) => {
  try {
    const mk = getMonthKey();
    const provs = loadProviders().map(p => ({
      ...p,
      accounts: (p.accounts || []).map(a => {
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

const addTrackLog = (startTime, trackingNumber, clientIp, providerUsed, accountUsed, cacheHit, status, errorMsg) => {
  try {
    let logs = fs.existsSync(TRACKING_LOGS_FILE) ? readJSON(TRACKING_LOGS_FILE, []) : [];
    logs.push({ id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: new Date().toISOString(), trackingNumberHash: trackingNumber.slice(0, 4) + '****' + trackingNumber.slice(-4), carrier: 'USPS', providerUsed, accountUsed, cacheHit, responseTimeMs: Date.now() - startTime, status, errorMessage: errorMsg, ipHash: (clientIp || '').replace(/(\d+)\.(\d+)\.\d+\.\d+/, '$1.$2.xxx.xxx') });
    if (logs.length > 10000) logs = logs.slice(-10000);
    writeJSON(TRACKING_LOGS_FILE, logs);
  } catch {}
};

// ── GET /api/health ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'US Postal Tracking Production Server', version: '1.0.0', timestamp: new Date().toISOString(), node: process.version, port: PORT });
});

// ── GET /api/usps-track/:trackingNumber ───────────────────────────────────────
app.get('/api/usps-track/:trackingNumber', async (req, res) => {
  const trackingNumber = (req.params.trackingNumber || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!trackingNumber) { res.json({ ok: false, error: 'Invalid tracking number' }); return; }

  const startTime = Date.now();
  const clientIp = ((req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown') + '').split(',')[0].trim();

  // Rate limiting
  const ipNow = Date.now();
  const ipData = ipRateCache.get(clientIp) || { count: 0, windowStart: ipNow };
  if (ipNow - ipData.windowStart > 3600000) { ipData.count = 0; ipData.windowStart = ipNow; }
  ipData.count++;
  ipRateCache.set(clientIp, ipData);
  const ipHourLimit = (loadConfig().rateLimit && loadConfig().rateLimit.maxPerHour) || 30;
  if (ipData.count > ipHourLimit) {
    res.json({ ok: false, error: 'Too many tracking requests. Please wait a few minutes before trying again.', rateLimited: true, trackingNumber });
    return;
  }

  // Cache check
  const cache = readJSON(TRACKING_CACHE_FILE, {});
  const cached = cache[trackingNumber];
  if (cached && new Date(cached.expiresAt) > new Date()) {
    cached.hitCount = (cached.hitCount || 0) + 1;
    cached.lastHit = new Date().toISOString();
    writeJSON(TRACKING_CACHE_FILE, cache);
    if (cached.notFound) {
      addTrackLog(startTime, trackingNumber, clientIp, 'Cache', 'Cache', true, 'not_found');
      res.json({ ok: false, error: 'No tracking information found for this number. It may not exist or may take up to 24 hours to appear after the first USPS scan.', trackingNumber, cached: true });
    } else {
      addTrackLog(startTime, trackingNumber, clientIp, cached.providerUsed || 'Cache', 'Cache', true, 'success');
      res.json({ ...cached.data, cached: true });
    }
    return;
  }

  let trackingResult = null;
  let usedProvider = '';
  let usedAccount = '';

  const allProviders = loadProviders().sort((a, b) => a.priority - b.priority);

  for (const provider of allProviders) {
    if (!provider.enabled || trackingResult) continue;
    const accounts = (provider.accounts || []).filter(isAccountActive);
    if (accounts.length === 0) continue;

    // ── Ship24 ────────────────────────────────────────────────────────────────
    if (provider.id === 'ship24') {
      const inferFromMilestone = (m) => {
        if (!m) return null; const ms = m.toLowerCase();
        if (ms === 'delivered') return 'delivered';
        if (ms === 'out_for_delivery') return 'out-for-delivery';
        if (ms === 'label_created' || ms === 'pre_transit') return 'label-created';
        if (ms === 'in_transit' || ms === 'available_for_pickup' || ms === 'return_to_sender' || ms === 'exception') return 'in-transit';
        return null;
      };
      for (const account of accounts) {
        try {
          const r = await fetch('https://api.ship24.com/public/v1/tracking/search', { method: 'POST', headers: { 'Authorization': `Bearer ${account.apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ trackingNumber }), signal: AbortSignal.timeout(60000) });
          if (r.status === 402 || r.status === 429 || r.status === 403) { updateAccountUsage(provider.id, account.id, false, true); continue; }
          if (r.status === 201 || r.ok) {
            const d = await r.json();
            const tracking = d.data && d.data.trackings && d.data.trackings[0];
            const shipment = tracking && tracking.shipment;
            const rawEvts = (tracking && tracking.events) || [];
            const evts = rawEvts.map(e => ({ status: e.status || '', detail: e.status || '', location: typeof e.location === 'string' ? e.location : [e.location && e.location.city, e.location && e.location.state, e.location && e.location.countryCode].filter(Boolean).join(', '), date: e.occurrenceDatetime ? fmtDate(e.occurrenceDatetime) : '', time: e.occurrenceDatetime ? fmtTime(e.occurrenceDatetime) : '', milestone: e.statusMilestone || '' }));
            if (evts.length > 0) {
              updateAccountUsage(provider.id, account.id, true);
              const latestEvt = evts[0]; const latestRaw = rawEvts[0];
              const status = inferFromMilestone(latestRaw && latestRaw.statusMilestone) || inferStatus(latestEvt.status);
              const estDelivery = shipment && shipment.delivery && shipment.delivery.estimatedDeliveryDate ? fmtDate(shipment.delivery.estimatedDeliveryDate) : '';
              trackingResult = { ok: true, trackingNumber, status, statusLabel: latestEvt.status || 'In Transit', service: 'USPS Package', origin: (shipment && shipment.originCountryCode) || '', destination: (shipment && shipment.destinationCountryCode) || '', estimatedDelivery: estDelivery, weight: '—', events: evts };
              usedProvider = 'Ship24'; usedAccount = account.name; break;
            } else { updateAccountUsage(provider.id, account.id, false); }
          } else { updateAccountUsage(provider.id, account.id, false); }
        } catch { updateAccountUsage(provider.id, account.id, false); }
      }
    }

    // ── TrackingMore ──────────────────────────────────────────────────────────
    if (provider.id === 'trackingmore' && !trackingResult) {
      const tmStatusMap = (s) => { const v = (s || '').toLowerCase(); if (v === 'delivered') return 'delivered'; if (v === 'pickup') return 'out-for-delivery'; if (v === 'inforeceived') return 'label-created'; return 'in-transit'; };
      for (const account of accounts) {
        try {
          const r = await fetch('https://api.trackingmore.com/v3/trackings/realtime', { method: 'POST', headers: { 'Tracking-Api-Key': account.apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ tracking_number: trackingNumber, carrier_code: 'usps', destination_code: 'US' }), signal: AbortSignal.timeout(20000) });
          if (r.status === 402 || r.status === 429 || r.status === 403) { updateAccountUsage(provider.id, account.id, false, true); continue; }
          if (r.ok) {
            const d = await r.json();
            if (d.code === 203) { updateAccountUsage(provider.id, account.id, false, true); continue; }
            if (d.code === 200 && d.data) {
              const originEvts = (d.data.origin_info && d.data.origin_info.trackinfo) || [];
              const destEvts = (d.data.destination_info && d.data.destination_info.trackinfo) || [];
              const evts = [...originEvts, ...destEvts].map(e => ({ status: e.tracking_detail || '', detail: e.tracking_detail || '', location: e.location || '', date: e.checkpoint_date ? fmtDate(e.checkpoint_date) : '', time: e.checkpoint_date ? fmtTime(e.checkpoint_date) : '' }));
              updateAccountUsage(provider.id, account.id, true);
              if (evts.length > 0) {
                const deliveryStatus = d.data.delivery_status || '';
                const latestEvtStr = typeof d.data.latest_event === 'string' ? d.data.latest_event.split(',')[0] : evts[0].status;
                trackingResult = { ok: true, trackingNumber, status: tmStatusMap(deliveryStatus), statusLabel: latestEvtStr || evts[0].status || 'In Transit', service: 'USPS Package', origin: d.data.original || '', destination: d.data.destination || '', estimatedDelivery: d.data.scheduled_delivery_date || '', weight: '—', events: evts };
                usedProvider = 'TrackingMore'; usedAccount = account.name; break;
              }
            } else { updateAccountUsage(provider.id, account.id, false); }
          } else { updateAccountUsage(provider.id, account.id, false); }
        } catch { updateAccountUsage(provider.id, account.id, false); }
      }
    }

    // ── 17Track ───────────────────────────────────────────────────────────────
    if (provider.id === '17track' && !trackingResult) {
      const t17StatusMap = (s) => { switch ((s || '').toLowerCase()) { case 'delivered': return 'delivered'; case 'outfordelivery': case 'availableforpickup': return 'out-for-delivery'; case 'inforeceived': return 'label-created'; default: return 'in-transit'; } };
      for (const account of accounts) {
        try {
          await fetch('https://api.17track.net/track/v2.4/register', { method: 'POST', headers: { '17token': account.apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify([{ number: trackingNumber, carrier: 21051, destination_country: 'US' }]), signal: AbortSignal.timeout(8000) });
          const r = await fetch('https://api.17track.net/track/v2.4/gettrackinfo', { method: 'POST', headers: { '17token': account.apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify([{ number: trackingNumber, carrier: 21051 }]), signal: AbortSignal.timeout(15000) });
          if (r.status === 402 || r.status === 429 || r.status === 403) { updateAccountUsage(provider.id, account.id, false, true); continue; }
          if (r.ok) {
            const d = await r.json();
            const item = d.data && d.data.accepted && d.data.accepted[0];
            const trackInfo = item && item.track_info;
            if (trackInfo) {
              const providers17 = (trackInfo.tracking && trackInfo.tracking.providers) || [];
              const rawEvts = providers17.flatMap(p => p.events || []);
              const evts = rawEvts.map(e => ({ status: e.description || '', detail: e.description || '', location: typeof e.location === 'string' ? e.location : [e.address && e.address.city, e.address && e.address.state, e.address && e.address.country].filter(Boolean).join(', '), date: e.time_iso ? fmtDate(e.time_iso) : ((e.time_raw && e.time_raw.date) ? fmtDate(e.time_raw.date) : ''), time: e.time_iso ? fmtTime(e.time_iso) : ((e.time_raw && e.time_raw.time) || '') }));
              updateAccountUsage(provider.id, account.id, true);
              if (evts.length > 0) {
                const latestStatus = (trackInfo.latest_status && trackInfo.latest_status.status) || '';
                const latestDesc = (trackInfo.latest_event && trackInfo.latest_event.description) || evts[0].status || 'In Transit';
                trackingResult = { ok: true, trackingNumber, status: t17StatusMap(latestStatus), statusLabel: latestDesc, service: 'USPS Package', origin: (trackInfo.shipping_info && trackInfo.shipping_info.shipper_address && trackInfo.shipping_info.shipper_address.country) || '', destination: (trackInfo.shipping_info && trackInfo.shipping_info.recipient_address && trackInfo.shipping_info.recipient_address.country) || '', estimatedDelivery: '', weight: '—', events: evts };
                usedProvider = '17Track'; usedAccount = account.name; break;
              }
            } else { updateAccountUsage(provider.id, account.id, false); }
          } else { updateAccountUsage(provider.id, account.id, false); }
        } catch { updateAccountUsage(provider.id, account.id, false); }
      }
    }

    // ── USPS Scraper ──────────────────────────────────────────────────────────
    if ((provider.id === 'scraper' || provider.id === 'usps') && !trackingResult) {
      try {
        const scraped = await runUspsScrapers(trackingNumber);
        if (scraped && scraped.events.length > 0) {
          const rawSt = scraped.rawStatus || scraped.events[0].status;
          const st = inferStatus(rawSt);
          trackingResult = { ok: true, trackingNumber, status: st, statusLabel: scraped.statusLabel || scraped.events[0].status || 'In Transit', service: 'USPS Package', origin: scraped.origin || '', destination: scraped.destination || '', estimatedDelivery: scraped.estimatedDelivery || '', weight: '—', events: scraped.events };
          usedProvider = 'USPS Scraper'; usedAccount = 'Multi-Layer Engine';
        }
      } catch {}
      // USPS XML API fallback
      if (!trackingResult) {
        const cfg = loadConfig();
        const USERID = (cfg.apiKeys && cfg.apiKeys.uspsUserId) || '';
        if (USERID) {
          try {
            const xmlReq = `<TrackFieldRequest USERID="${USERID}"><Revision>1</Revision><ClientIp>127.0.0.1</ClientIp><SourceId>USPostalTracking</SourceId><TrackID ID="${trackingNumber}"/></TrackFieldRequest>`;
            const apiUrl = `https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=${encodeURIComponent(xmlReq)}`;
            const xmlResponse = await new Promise((resolve, reject) => { https.get(apiUrl, { timeout: 12000 }, (resp) => { let data = ''; resp.on('data', c => data += c); resp.on('end', () => resolve(data)); }).on('error', reject); });
            const extract = (tag) => { const m = xmlResponse.match(new RegExp(`<${tag}>(.*?)</${tag}>`, 's')); return m ? m[1].trim() : ''; };
            if (!xmlResponse.match(/<Number>(.*?)<\/Number>/) || xmlResponse.includes('<TrackDetail>') || xmlResponse.includes('<TrackSummary>')) {
              const statusCategory = extract('StatusCategory');
              const parseXmlEvent = (xml) => {
                const ex = (tag) => { const m = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`)); return m ? m[1].trim() : ''; };
                return { status: ex('Event'), detail: ex('Event'), location: ex('EventCity') ? `${ex('EventCity')}, ${ex('EventState')} ${ex('EventZIPCode')}`.trim() : '', date: ex('EventDate'), time: ex('EventTime') };
              };
              const evts = [];
              const sm = xmlResponse.match(/<TrackSummary>(.*?)<\/TrackSummary>/s); if (sm) evts.push(parseXmlEvent(sm[1]));
              const dr = /<TrackDetail>(.*?)<\/TrackDetail>/gs; let dm; while ((dm = dr.exec(xmlResponse)) !== null) evts.push(parseXmlEvent(dm[1]));
              if (evts.length > 0) {
                const cat = statusCategory.toLowerCase(); let st = 'in-transit';
                if (cat.includes('delivered')) st = 'delivered'; else if (cat.includes('out for delivery')) st = 'out-for-delivery'; else if (cat.includes('accepted') || cat.includes('pre-shipment')) st = 'label-created';
                const oc = extract('OriginCity'); const os = extract('OriginState'); const oz = extract('OriginZip');
                const dc = extract('DestinationCity'); const ds = extract('DestinationState'); const dz = extract('DestinationZip');
                trackingResult = { ok: true, trackingNumber, status: st, statusLabel: statusCategory || 'In Transit', service: extract('Class') || 'USPS Package', origin: oc ? `${oc}, ${os} ${oz}` : '', destination: dc ? `${dc}, ${ds} ${dz}` : '', estimatedDelivery: extract('GuaranteedDeliveryDate') || extract('ExpectedDeliveryDate') || '', weight: '—', events: evts };
                usedProvider = 'USPS XML'; usedAccount = 'USPS API';
              }
            }
          } catch {}
        }
      }
    }
  }

  if (!trackingResult) {
    const nfCache = readJSON(TRACKING_CACHE_FILE, {});
    nfCache[trackingNumber] = { notFound: true, providerUsed: 'None', cachedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 5 * 60000).toISOString(), hitCount: 0, lastHit: new Date().toISOString() };
    writeJSON(TRACKING_CACHE_FILE, nfCache);
    addTrackLog(startTime, trackingNumber, clientIp, 'None', 'None', false, 'not_found', 'All providers returned no results');
    res.json({ ok: false, error: 'No tracking information found for this number. It may not exist or may take up to 24 hours to appear after the first USPS scan.', trackingNumber });
    return;
  }

  try {
    const ttlCfg = fs.existsSync(CACHE_SETTINGS_FILE) ? readJSON(CACHE_SETTINGS_FILE, {}) : {};
    const ttlMap = { delivered: ttlCfg.delivered || 1440, 'out-for-delivery': ttlCfg.outForDelivery || 30, 'in-transit': ttlCfg.inTransit || 120, 'label-created': ttlCfg.preShipment || 60, alert: ttlCfg.exception || 15 };
    const ttlMin = ttlMap[trackingResult.status] || ttlCfg.unknown || 30;
    const updCache = readJSON(TRACKING_CACHE_FILE, {});
    updCache[trackingNumber] = { trackingNumberHash: trackingNumber.slice(0, 4) + '****' + trackingNumber.slice(-4), carrier: 'USPS', status: trackingResult.statusLabel, cachedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + ttlMin * 60000).toISOString(), hitCount: 0, lastHit: new Date().toISOString(), providerUsed: usedProvider, data: trackingResult };
    writeJSON(TRACKING_CACHE_FILE, updCache);
  } catch {}

  addTrackLog(startTime, trackingNumber, clientIp, usedProvider, usedAccount, false, 'success');
  res.json(trackingResult);
});

// ── GET /api/providers ────────────────────────────────────────────────────────
app.get('/api/providers', (req, res) => res.json(loadProviders()));

// ── PUT /api/provider/:id ─────────────────────────────────────────────────────
app.put('/api/provider/:id', (req, res) => {
  try {
    const { id } = req.params; const updates = req.body;
    const providers = loadProviders().map(p => p.id === id ? { ...p, ...updates } : p);
    saveProviders(providers); res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/account (add account) ──────────────────────────────────────────
app.post('/api/account', (req, res) => {
  try {
    const account = req.body;
    const newAccount = { ...account, id: `acc-${Date.now()}`, usedToday: 0, usedThisMonth: 0, successCount: 0, errorCount: 0, avgResponseTime: 0, lastUsed: '', status: 'active' };
    const providers = loadProviders().map(p => p.id === account.providerId ? { ...p, accounts: [...(p.accounts || []), newAccount] } : p);
    saveProviders(providers); res.json({ ok: true, account: newAccount });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── DELETE /api/account/:id ───────────────────────────────────────────────────
app.delete('/api/account/:id', (req, res) => {
  try {
    const { id } = req.params;
    const providers = loadProviders().map(p => ({ ...p, accounts: (p.accounts || []).filter(a => a.id !== id) }));
    saveProviders(providers); res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── PUT /api/account/:id ──────────────────────────────────────────────────────
app.put('/api/account/:id', (req, res) => {
  try {
    const { id } = req.params; const updates = req.body;
    const providers = loadProviders().map(p => ({ ...p, accounts: (p.accounts || []).map(a => a.id === id ? { ...a, ...updates } : a) }));
    saveProviders(providers); res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/config ───────────────────────────────────────────────────────────
app.get('/api/config', (req, res) => res.json(loadConfig()));

// ── POST /api/config ──────────────────────────────────────────────────────────
app.post('/api/config', (req, res) => {
  try {
    const config = { ...loadConfig(), ...req.body };
    saveConfig(config); res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/tracking-logs ────────────────────────────────────────────────────
app.get('/api/tracking-logs', (req, res) => {
  try {
    const logs = readJSON(TRACKING_LOGS_FILE, []);
    const limit = parseInt(req.query.limit) || 100;
    res.json(logs.slice(-limit).reverse());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/cache/clear ─────────────────────────────────────────────────────
app.post('/api/cache/clear', (req, res) => {
  try { writeJSON(TRACKING_CACHE_FILE, {}); res.json({ ok: true, message: 'Cache cleared' }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/cache/stats ──────────────────────────────────────────────────────
app.get('/api/cache/stats', (req, res) => {
  try {
    const cache = readJSON(TRACKING_CACHE_FILE, {});
    const entries = Object.values(cache);
    const now = new Date();
    const active = entries.filter(e => new Date(e.expiresAt) > now);
    const expired = entries.length - active.length;
    const totalHits = entries.reduce((s, e) => s + (e.hitCount || 0), 0);
    res.json({ totalEntries: entries.length, activeEntries: active.length, expiredEntries: expired, totalHits });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/cache-settings ───────────────────────────────────────────────────
app.get('/api/cache-settings', (req, res) => {
  const defaults = { delivered: 1440, outForDelivery: 30, inTransit: 120, preShipment: 60, exception: 15, unknown: 30 };
  res.json({ ...defaults, ...readJSON(CACHE_SETTINGS_FILE, {}) });
});

// ── POST /api/cache-settings ──────────────────────────────────────────────────
app.post('/api/cache-settings', (req, res) => {
  try { writeJSON(CACHE_SETTINGS_FILE, req.body); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/stats ────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  try {
    const publicDir = path.join(ROOT, 'public');
    const xmlFiles = fs.existsSync(publicDir) ? fs.readdirSync(publicDir).filter(f => f.endsWith('.xml')) : [];
    let totalUrls = 0;
    for (const xf of xmlFiles) { try { const xc = fs.readFileSync(path.join(publicDir, xf), 'utf8'); totalUrls += (xc.match(/<loc>/g) || []).length; } catch {} }
    const srcPages = path.join(ROOT, 'src/pages');
    const pageFiles = fs.existsSync(srcPages) ? fs.readdirSync(srcPages).filter(f => f.endsWith('.tsx')).length : 0;
    const distExists = fs.existsSync(path.join(ROOT, 'dist'));
    res.json({ sitemaps: xmlFiles.length, totalSitemapUrls: totalUrls, srcFiles: pageFiles, buildExists: distExists, timestamp: new Date().toISOString() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/analytics ────────────────────────────────────────────────────────
app.get('/api/analytics', (req, res) => {
  try {
    const data = readJSON(VISITORS_FILE, { visits: [] });
    const visits = data.visits || [];
    const total = visits.length || 1;
    const today = new Date().toISOString().slice(0, 10);
    const todayViews = visits.filter(v => v.timestamp && v.timestamp.startsWith(today)).length;
    const ipSet = new Set(visits.map(v => v.ip).filter(Boolean));
    const pageMap = {};
    visits.forEach(v => { if (v.path) pageMap[v.path] = (pageMap[v.path] || 0) + 1; });
    const devMap = {};
    visits.forEach(v => { const d = v.device === 'mobile' ? 'Mobile' : v.device === 'tablet' ? 'Tablet' : 'Desktop'; devMap[d] = (devMap[d] || 0) + 1; });
    res.json({
      summary: { totalPageviews: visits.length, todayViews, totalSessions: Math.ceil(visits.length / 3), totalUniqueVisitors: ipSet.size, avgSessionDuration: 0, bounceRate: 50, pagesPerVisit: 2 },
      topPages: Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([path, views]) => ({ path, views })),
      devices: Object.entries(devMap).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, device: name, count, pct: Math.round(count / total * 100) })),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/track-visit ─────────────────────────────────────────────────────
app.post('/api/track-visit', (req, res) => {
  try {
    const data = readJSON(VISITORS_FILE, { visits: [] });
    if (!data.visits) data.visits = [];
    const ip = ((req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown') + '').split(',')[0].trim().slice(0, 15);
    const body = req.body || {};
    data.visits = [{ timestamp: new Date().toISOString(), path: body.path || '/', ip, device: body.device || 'desktop', browser: body.browser || 'Other', referrer: body.referrer || 'direct', country: body.country || 'Unknown', language: body.language || 'en-US', screen: body.screen || '', source: body.source || 'direct', ...body }, ...data.visits].slice(0, 10000);
    writeJSON(VISITORS_FILE, data);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/ads ──────────────────────────────────────────────────────────────
app.get('/api/ads', (req, res) => { const cfg = loadConfig(); res.json(cfg.ads || []); });

// ── POST /api/ads ─────────────────────────────────────────────────────────────
app.post('/api/ads', (req, res) => {
  try { const config = loadConfig(); config.ads = { ...config.ads, ...req.body }; saveConfig(config); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/sitemaps ─────────────────────────────────────────────────────────
app.get('/api/sitemaps', (req, res) => {
  try {
    const publicDir = path.join(ROOT, 'public');
    if (!fs.existsSync(publicDir)) { res.json({ sitemaps: [] }); return; }
    const xmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.xml'));
    const sitemaps = xmlFiles.map(filename => {
      const filePath = path.join(publicDir, filename);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const urls = (content.match(/<loc>/g) || []).length;
        const stat = fs.statSync(filePath);
        return { filename, urls, lastmod: stat.mtime.toLocaleDateString('en-US'), sizeKB: Math.round(stat.size / 1024), exists: true };
      } catch { return { filename, urls: 0, lastmod: 'N/A', sizeKB: 0, exists: false }; }
    });
    res.json({ sitemaps });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/visitors ─────────────────────────────────────────────────────────
app.get('/api/visitors', (req, res) => {
  try {
    const data = readJSON(VISITORS_FILE, { visits: [] });
    const limit = parseInt(req.query.limit) || 100;
    const visits = (data.visits || []).slice(0, limit).map((v, i) => ({
      id: `v${i}`, ip: (v.ip || 'xxx').replace(/\.\d+$/, '.xxx'), country: v.country || 'Unknown', city: v.city || 'Unknown',
      device: v.device || 'desktop', browser: v.browser || 'Other', referrer: v.referrer || 'direct',
      entryPage: v.path || '/', timestamp: v.timestamp || new Date().toISOString(),
    }));
    res.json({ visits, total: (data.visits || []).length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Serve static files from dist/ ─────────────────────────────────────────────
const DIST_DIR = path.join(ROOT, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: '1h', etag: true }));
  // SPA catch-all: serve index.html for all non-API routes
  app.use((req, res) => {
    const file = path.join(DIST_DIR, req.path, 'index.html');
    if (fs.existsSync(file)) { res.sendFile(file); return; }
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('<h1>US Postal Tracking</h1><p>Run <code>npm run build:client-only</code> first to build the frontend.</p>'));
}

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ US Postal Tracking Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${DIST_DIR}`);
  console.log(`🗄️  Data directory: ${SEO_DATA}`);
});

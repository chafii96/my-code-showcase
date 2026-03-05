/**
 * Visitor Tracking Library — مكتبة تتبع الزوار
 * 
 * تتبع شامل يشمل:
 * - معلومات الجهاز والمتصفح
 * - الموقع الجغرافي
 * - مسار التصفح
 * - وقت الجلسة
 * - مصدر الزيارة
 * - الكلمات المفتاحية
 * - Core Web Vitals
 * - أحداث المستخدم
 */

export interface VisitorSession {
  id: string;
  timestamp: number;
  duration: number; // seconds
  pageViews: number;
  entryPage: string;
  exitPage: string;
  referrer: string;
  source: TrafficSource;
  device: DeviceInfo;
  geo: GeoInfo;
  pages: PageView[];
  events: UserEvent[];
  vitals: WebVitalsData;
  isBot: boolean;
  isNew: boolean;
}

export interface PageView {
  url: string;
  title: string;
  timestamp: number;
  timeOnPage: number; // seconds
  scrollDepth: number; // 0-100%
}

export interface UserEvent {
  type: 'click' | 'scroll' | 'search' | 'track' | 'copy' | 'share' | 'exit';
  target?: string;
  value?: string;
  timestamp: number;
}

export interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile';
  os: string;
  browser: string;
  browserVersion: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
  timezone: string;
  connectionType: string;
}

export interface GeoInfo {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  isp: string;
  ip: string; // hashed
}

export type TrafficSource =
  | 'organic'
  | 'direct'
  | 'referral'
  | 'social'
  | 'email'
  | 'paid'
  | 'unknown';

export interface WebVitalsData {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  inp?: number;
}

// ============================================================
// DEVICE DETECTION
// ============================================================

export function detectDevice(): DeviceInfo {
  const ua = navigator.userAgent;

  const type: DeviceInfo['type'] =
    /Mobi|Android|iPhone|iPad|iPod/i.test(ua)
      ? /iPad/i.test(ua) ? 'tablet' : 'mobile'
      : 'desktop';

  let os = 'Unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = 'Unknown';
  let browserVersion = '';
  if (/Chrome\/(\d+)/i.test(ua) && !/Chromium|Edge|OPR/i.test(ua)) {
    browser = 'Chrome';
    browserVersion = ua.match(/Chrome\/(\d+)/i)?.[1] || '';
  } else if (/Firefox\/(\d+)/i.test(ua)) {
    browser = 'Firefox';
    browserVersion = ua.match(/Firefox\/(\d+)/i)?.[1] || '';
  } else if (/Safari\/(\d+)/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
    browserVersion = ua.match(/Version\/(\d+)/i)?.[1] || '';
  } else if (/Edg\/(\d+)/i.test(ua)) {
    browser = 'Edge';
    browserVersion = ua.match(/Edg\/(\d+)/i)?.[1] || '';
  } else if (/OPR\/(\d+)/i.test(ua)) {
    browser = 'Opera';
    browserVersion = ua.match(/OPR\/(\d+)/i)?.[1] || '';
  }

  const connection = (navigator as any).connection;
  const connectionType = connection?.effectiveType || connection?.type || 'unknown';

  return {
    type,
    os,
    browser,
    browserVersion,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language || 'en-US',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connectionType,
  };
}

// ============================================================
// TRAFFIC SOURCE DETECTION
// ============================================================

export function detectTrafficSource(): TrafficSource {
  const referrer = document.referrer;
  const urlParams = new URLSearchParams(window.location.search);

  // UTM parameters
  if (urlParams.get('utm_source') || urlParams.get('utm_medium')) {
    const medium = urlParams.get('utm_medium') || '';
    if (medium.includes('cpc') || medium.includes('paid')) return 'paid';
    if (medium.includes('email')) return 'email';
    if (medium.includes('social')) return 'social';
    return 'referral';
  }

  // Google/Bing/Yahoo organic
  if (/google\.|bing\.|yahoo\.|duckduckgo\.|yandex\./i.test(referrer)) {
    return 'organic';
  }

  // Social media
  if (/facebook\.|twitter\.|instagram\.|linkedin\.|pinterest\.|reddit\.|tiktok\./i.test(referrer)) {
    return 'social';
  }

  // Direct
  if (!referrer || referrer === '') return 'direct';

  return 'referral';
}

// ============================================================
// SESSION MANAGER
// ============================================================

const SESSION_KEY = 'vt_session';
const VISITOR_KEY = 'vt_visitor';

export function getOrCreateSession(): VisitorSession {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {}
  }

  const isNewVisitor = !localStorage.getItem(VISITOR_KEY);
  if (isNewVisitor) {
    localStorage.setItem(VISITOR_KEY, Date.now().toString());
  }

  const session: VisitorSession = {
    id: generateSessionId(),
    timestamp: Date.now(),
    duration: 0,
    pageViews: 0,
    entryPage: window.location.pathname,
    exitPage: window.location.pathname,
    referrer: document.referrer,
    source: detectTrafficSource(),
    device: detectDevice(),
    geo: {
      country: 'United States',
      countryCode: 'US',
      region: 'Unknown',
      city: 'Unknown',
      isp: 'Unknown',
      ip: 'xxx.xxx.xxx.xxx',
    },
    pages: [],
    events: [],
    vitals: {},
    isBot: isBot(),
    isNew: isNewVisitor,
  };

  saveSession(session);
  return session;
}

export function saveSession(session: VisitorSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function recordPageView(session: VisitorSession, url: string, title: string): void {
  const pageView: PageView = {
    url,
    title,
    timestamp: Date.now(),
    timeOnPage: 0,
    scrollDepth: 0,
  };

  session.pages.push(pageView);
  session.pageViews++;
  session.exitPage = url;
  saveSession(session);
}

export function recordEvent(session: VisitorSession, event: Omit<UserEvent, 'timestamp'>): void {
  session.events.push({ ...event, timestamp: Date.now() });
  saveSession(session);
}

// ============================================================
// BOT DETECTION
// ============================================================

export function isBot(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  const botPatterns = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'sogou', 'exabot', 'facebot', 'ia_archiver',
    'bot', 'crawler', 'spider', 'scraper', 'headless'
  ];
  return botPatterns.some(pattern => ua.includes(pattern));
}

// ============================================================
// HELPERS
// ============================================================

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Analytics data types (for use with real API data)
export interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  newVsReturning: { new: number; returning: number };
  topPages: { page: string; views: number; avgTime: number }[];
  trafficSources: { source: string; visitors: number; percentage: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  topCountries: { country: string; flag: string; visitors: number; percentage: number }[];
  hourlyTraffic: { hour: number; visitors: number }[];
  dailyTraffic: { date: string; visitors: number; pageViews: number }[];
  topKeywords: { keyword: string; clicks: number; position: number; ctr: number }[];
  realTimeVisitors: number;
  conversionRate: number;
  topReferrers: { domain: string; visitors: number }[];
}

/**
 * CONFIG MANAGER — Stores API keys, ads config, site settings
 * All data saved to seo-data/config.json (gitignored for security)
 */
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../seo-data/config.json');

const DEFAULT_CONFIG = {
  apiKeys: {
    googleSearchConsole: '',
    googleAnalytics4: '',
    googleAdsense: '',
    googleIndexingApi: '',
    bingWebmaster: '',
    openaiApiKey: '',
    indexNowKey: '',
    semrushApiKey: '',
    ahrefsApiKey: '',
    cloudflareApiKey: '',
    cloudflareZoneId: '',
    recaptchaSiteKey: '',
    recaptchaSecretKey: '',
  },
  ads: {
    adsensePublisherId: '',
    adsenseEnabled: false,
    adSlots: [
      { id: 'header-banner', name: 'بانر الهيدر', position: 'header', type: 'adsense', slotId: '', enabled: false, htmlCode: '' },
      { id: 'sidebar-top', name: 'الشريط الجانبي (أعلى)', position: 'sidebar', type: 'adsense', slotId: '', enabled: false, htmlCode: '' },
      { id: 'content-mid', name: 'وسط المحتوى', position: 'content', type: 'adsense', slotId: '', enabled: false, htmlCode: '' },
      { id: 'footer-banner', name: 'بانر الفوتر', position: 'footer', type: 'adsense', slotId: '', enabled: false, htmlCode: '' },
      { id: 'popup-ad', name: 'إعلان منبثق', position: 'popup', type: 'html', slotId: '', enabled: false, htmlCode: '' },
      { id: 'custom-1', name: 'إعلان مخصص 1', position: 'custom', type: 'html', slotId: '', enabled: false, htmlCode: '' },
    ],
  },
  site: {
    siteName: 'USPS Tracking Hub',
    siteUrl: 'https://uspostaltracking.com',
    siteDescription: 'Track your USPS packages in real-time with our advanced tracking system.',
    contactEmail: '',
    twitterHandle: '',
    facebookPage: '',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#1e40af',
    language: 'en',
    timezone: 'America/New_York',
    maintenanceMode: false,
    maintenanceMessage: 'الموقع في وضع الصيانة. سنعود قريباً.',
  },
  seo: {
    defaultTitle: 'USPS Package Tracking — Track Your Mail & Packages',
    defaultDescription: 'Track USPS packages, Priority Mail, First Class, and more. Get real-time delivery updates.',
    defaultKeywords: 'usps tracking, usps package tracking, track usps mail, usps delivery status',
    robotsIndex: true,
    robotsFollow: true,
    canonicalDomain: 'https://uspostaltracking.com',
    hreflangEnabled: false,
    structuredDataEnabled: true,
    openGraphEnabled: true,
    twitterCardsEnabled: true,
  },
  notifications: {
    emailAlerts: false,
    alertEmail: '',
    slackWebhook: '',
    discordWebhook: '',
    telegramBotToken: '',
    telegramChatId: '',
  },
  updatedAt: null,
};

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
      const saved = JSON.parse(raw);
      // Deep merge with defaults
      return deepMerge(DEFAULT_CONFIG, saved);
    }
  } catch (e) {
    console.error('Config load error:', e.message);
  }
  return { ...DEFAULT_CONFIG };
}

function saveConfig(config) {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    config.updatedAt = new Date().toISOString();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Config save error:', e.message);
    return false;
  }
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function maskSecret(val) {
  if (!val || val.length < 8) return val;
  return val.slice(0, 4) + '•'.repeat(Math.min(val.length - 8, 20)) + val.slice(-4);
}

function getMaskedConfig(config) {
  const masked = JSON.parse(JSON.stringify(config));
  // Mask sensitive API keys
  const sensitiveKeys = ['openaiApiKey', 'semrushApiKey', 'ahrefsApiKey', 'cloudflareApiKey', 'recaptchaSecretKey', 'googleIndexingApi'];
  for (const key of sensitiveKeys) {
    if (masked.apiKeys[key]) masked.apiKeys[key] = maskSecret(masked.apiKeys[key]);
  }
  return masked;
}

module.exports = { loadConfig, saveConfig, getMaskedConfig, DEFAULT_CONFIG };

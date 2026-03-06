import { ApiProvider, CacheEntry, CacheTTLSettings, ScraperConfig, CarrierPattern, RateLimitRule, TrackingLog, CacheStats, SystemStats } from './types';

export const mockProviders: ApiProvider[] = [
  {
    id: 'ship24', name: 'Ship24', enabled: true, priority: 1, icon: '🚀', color: '#3b82f6',
    accounts: [
      { id: 's24-1', providerId: 'ship24', name: 'Ship24 - Account 1', apiKey: 'sk_live_xxxx...xxxx1234', dailyQuota: 1000, usedToday: 743, enabled: true, lastUsed: new Date(Date.now() - 30000).toISOString(), successCount: 14520, errorCount: 180, avgResponseTime: 420, status: 'active' },
      { id: 's24-2', providerId: 'ship24', name: 'Ship24 - Account 2', apiKey: 'sk_live_xxxx...xxxx5678', dailyQuota: 1000, usedToday: 1000, enabled: true, lastUsed: new Date(Date.now() - 3600000).toISOString(), successCount: 9800, errorCount: 120, avgResponseTime: 390, status: 'exhausted' },
      { id: 's24-3', providerId: 'ship24', name: 'Ship24 - Account 3', apiKey: 'sk_live_xxxx...xxxx9012', dailyQuota: 500, usedToday: 0, enabled: false, lastUsed: '', successCount: 0, errorCount: 0, avgResponseTime: 0, status: 'disabled' },
    ]
  },
  {
    id: 'trackingmore', name: 'TrackingMore', enabled: true, priority: 2, icon: '📦', color: '#10b981',
    accounts: [
      { id: 'tm-1', providerId: 'trackingmore', name: 'TrackingMore - Account 1', apiKey: 'tm_xxxx...xxxx3456', dailyQuota: 2000, usedToday: 312, enabled: true, lastUsed: new Date(Date.now() - 120000).toISOString(), successCount: 22100, errorCount: 340, avgResponseTime: 580, status: 'active' },
      { id: 'tm-2', providerId: 'trackingmore', name: 'TrackingMore - Account 2', apiKey: 'tm_xxxx...xxxx7890', dailyQuota: 2000, usedToday: 0, enabled: true, lastUsed: '', successCount: 5200, errorCount: 80, avgResponseTime: 620, status: 'active' },
    ]
  },
  {
    id: '17track', name: '17Track', enabled: true, priority: 3, icon: '🌍', color: '#f59e0b',
    accounts: [
      { id: '17t-1', providerId: '17track', name: '17Track - Account 1', apiKey: '17t_xxxx...xxxx1111', dailyQuota: 500, usedToday: 45, enabled: true, lastUsed: new Date(Date.now() - 600000).toISOString(), successCount: 3400, errorCount: 210, avgResponseTime: 890, status: 'active' },
    ]
  },
  {
    id: 'scraper', name: 'Custom Scraper', enabled: true, priority: 4, icon: '🕷️', color: '#ef4444',
    accounts: [
      { id: 'sc-1', providerId: 'scraper', name: 'Scraper - USPS', apiKey: 'N/A', dailyQuota: 9999, usedToday: 22, enabled: true, lastUsed: new Date(Date.now() - 900000).toISOString(), successCount: 1200, errorCount: 450, avgResponseTime: 2100, status: 'active' },
    ]
  }
];

export const mockCacheStats: CacheStats = {
  totalEntries: 48293,
  hitRateToday: 72.4,
  memoryUsedMB: 234.7,
  apiCallsSaved: 34821,
  moneySaved: 174.10
};

export const mockCacheTTL: CacheTTLSettings = {
  delivered: 1440, inTransit: 120, outForDelivery: 30,
  pending: 60, exception: 15, preShipment: 60, unknown: 30, notFound: 30
};

export const mockCacheEntries: CacheEntry[] = Array.from({ length: 20 }, (_, i) => ({
  trackingNumberHash: `${['9400', '9205', '9261', '9341'][i % 4]}****${String(1000 + i).slice(-4)}`,
  carrier: ['USPS', 'FedEx', 'UPS', 'DHL'][i % 4],
  status: ['Delivered', 'In Transit', 'Out for Delivery', 'Pending', 'Exception'][i % 5],
  cachedAt: new Date(Date.now() - i * 3600000).toISOString(),
  expiresAt: new Date(Date.now() + (i + 1) * 1800000).toISOString(),
  hitCount: Math.floor(Math.random() * 50) + 1,
  lastHit: new Date(Date.now() - i * 600000).toISOString(),
}));

export const mockScrapers: ScraperConfig[] = [
  { id: 'sc-usps', carrier: 'USPS', targetUrl: 'https://tools.usps.com/go/TrackConfirmAction', status: 'working', enabled: true, lastSuccess: new Date(Date.now() - 300000).toISOString(), successRate: 89.2, avgResponseTime: 2100, userAgentRotation: true, proxyEnabled: true, selectors: { status: '.tracking-status', location: '.tracking-location', timestamp: '.tracking-timestamp' } },
  { id: 'sc-fedex', carrier: 'FedEx', targetUrl: 'https://www.fedex.com/fedextrack/', status: 'broken', enabled: false, lastSuccess: new Date(Date.now() - 86400000 * 3).toISOString(), successRate: 42.1, avgResponseTime: 3400, userAgentRotation: true, proxyEnabled: true, selectors: { status: '.shipment-status', location: '.scan-event-location' } },
  { id: 'sc-ups', carrier: 'UPS', targetUrl: 'https://www.ups.com/track', status: 'working', enabled: true, lastSuccess: new Date(Date.now() - 120000).toISOString(), successRate: 91.5, avgResponseTime: 1800, userAgentRotation: false, proxyEnabled: false, selectors: { status: '.ups-status', location: '.ups-location' } },
  { id: 'sc-dhl', carrier: 'DHL', targetUrl: 'https://www.dhl.com/track', status: 'disabled', enabled: false, lastSuccess: '', successRate: 0, avgResponseTime: 0, userAgentRotation: false, proxyEnabled: false, selectors: {} },
];

export const mockCarrierPatterns: CarrierPattern[] = [
  { id: 'cp-1', carrier: 'USPS', pattern: '^(94|93|92|91|90|9[0-4])\\d{18,22}$', priority: 1, example: '9400111899223033005289' },
  { id: 'cp-2', carrier: 'USPS', pattern: '^[A-Z]{2}\\d{9}US$', priority: 2, example: 'EA123456789US' },
  { id: 'cp-3', carrier: 'FedEx', pattern: '^\\d{12,22}$', priority: 3, example: '449044304137821' },
  { id: 'cp-4', carrier: 'UPS', pattern: '^1Z[0-9A-Z]{16}$', priority: 4, example: '1Z9999999999999999' },
  { id: 'cp-5', carrier: 'DHL', pattern: '^\\d{10,11}$', priority: 5, example: '1234567890' },
  { id: 'cp-6', carrier: 'Amazon', pattern: '^TBA\\d{12,}$', priority: 6, example: 'TBA123456789012' },
];

export const mockRateLimitRules: RateLimitRule[] = Array.from({ length: 10 }, (_, i) => ({
  id: `rl-${i}`, ipHash: `${['192', '10', '172', '203'][i % 4]}.***.***.*${i}`,
  requestsCount: Math.floor(Math.random() * 500) + 10,
  windowStart: new Date(Date.now() - i * 3600000).toISOString(),
  blocked: i < 2,
  country: ['US', 'CN', 'RU', 'IN', 'BR', 'DE', 'FR', 'JP', 'KR', 'UK'][i],
}));

export const mockTrackingLogs: TrackingLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: `log-${i}`,
  timestamp: new Date(Date.now() - i * 60000).toISOString(),
  trackingNumberHash: `${['9400', '9205', '1Z99', 'TBA1'][i % 4]}****${String(1000 + i).slice(-4)}`,
  carrier: ['USPS', 'FedEx', 'UPS', 'DHL'][i % 4],
  providerUsed: ['Ship24', 'TrackingMore', '17Track', 'Scraper'][i % 4],
  accountUsed: `Account ${(i % 3) + 1}`,
  cacheHit: Math.random() > 0.3,
  responseTimeMs: Math.floor(Math.random() * 2000) + 100,
  status: Math.random() > 0.1 ? 'success' : 'error',
  errorMessage: Math.random() > 0.9 ? 'Timeout after 5000ms' : undefined,
  ipHash: `${Math.floor(Math.random() * 255)}.***.***.*${i % 10}`,
}));

export const mockSystemStats: SystemStats = {
  totalRequestsToday: 12847,
  cacheHitRate: 72.4,
  activeProvider: 'Ship24',
  apiCallsSaved: 9291,
  estimatedCost: 48.23,
  successRate: 97.8,
};

export const mockHourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  requests: Math.floor(Math.random() * 800) + 100,
  cacheHits: Math.floor(Math.random() * 600) + 50,
  apiCalls: Math.floor(Math.random() * 300) + 20,
}));

export const mockProviderUsage = [
  { name: 'Ship24', value: 52, color: '#3b82f6' },
  { name: 'TrackingMore', value: 28, color: '#10b981' },
  { name: '17Track', value: 12, color: '#f59e0b' },
  { name: 'Scraper', value: 5, color: '#ef4444' },
  { name: 'Cache', value: 3, color: '#8b5cf6' },
];

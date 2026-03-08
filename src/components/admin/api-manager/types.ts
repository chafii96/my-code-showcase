export interface ApiProvider {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  icon: string;
  color: string;
  accounts: ApiAccount[];
}

export interface ApiAccount {
  id: string;
  providerId: string;
  name: string;
  apiKey: string;
  dailyQuota: number;
  monthlyQuota?: number;
  usedToday: number;
  usedThisMonth?: number;
  monthReset?: string;
  enabled: boolean;
  lastUsed: string;
  successCount: number;
  errorCount: number;
  avgResponseTime: number;
  status: 'active' | 'exhausted' | 'error' | 'disabled';
}

export interface CacheEntry {
  trackingNumberHash: string;
  carrier: string;
  status: string;
  cachedAt: string;
  expiresAt: string;
  hitCount: number;
  lastHit: string;
}

export interface CacheTTLSettings {
  delivered: number;
  inTransit: number;
  outForDelivery: number;
  pending: number;
  exception: number;
  preShipment: number;
  unknown: number;
  notFound: number;
}

export interface ScraperConfig {
  id: string;
  carrier: string;
  targetUrl: string;
  status: 'working' | 'broken' | 'disabled';
  enabled: boolean;
  lastSuccess: string;
  successRate: number;
  avgResponseTime: number;
  userAgentRotation: boolean;
  proxyEnabled: boolean;
  selectors: Record<string, string>;
}

export interface CarrierPattern {
  id: string;
  carrier: string;
  pattern: string;
  priority: number;
  example: string;
}

export interface RateLimitRule {
  id: string;
  ipHash: string;
  requestsCount: number;
  windowStart: string;
  blocked: boolean;
  country?: string;
}

export interface TrackingLog {
  id: string;
  timestamp: string;
  trackingNumberHash: string;
  carrier: string;
  providerUsed: string;
  accountUsed: string;
  cacheHit: boolean;
  responseTimeMs: number;
  status: 'success' | 'error' | 'not_found';
  errorMessage?: string;
  ipHash: string;
}

export interface CacheStats {
  totalEntries: number;
  hitRateToday: number;
  memoryUsedMB: number;
  apiCallsSaved: number;
  moneySaved: number;
}

export interface SystemStats {
  totalProviders: number;
  activeProviders: number;
  totalAccounts: number;
  activeAccounts: number;
  totalRequests: number;
  totalRequestsToday: number;
  cacheHitRate: number;
  apiCallsSaved: number;
  estimatedCost: number;
  successRate: number;
  avgResponseTime: number;
  activeProvider: string;
  uptime: number;
}

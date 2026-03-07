/**
 * AdSense Configuration Manager
 * Centralized config with localStorage persistence + API sync
 */

export interface AdUnitConfig {
  id: string;
  name: string;
  slotId: string;
  format: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  placement: string;
  enabled: boolean;
}

export interface AdSenseConfig {
  publisherId: string;
  enabled: boolean;
  autoAds: boolean;
  adUnits: AdUnitConfig[];
  placements: {
    header: boolean;
    afterResults: boolean;
    sidebar: boolean;
    footer: boolean;
    inArticle: boolean;
  };
  applicationStatus: 'not_applied' | 'pending' | 'approved' | 'rejected';
  applicationDate: string | null;
  applicationNotes: string;
  stats: {
    todayEarnings: number;
    monthEarnings: number;
    rpm: number;
    impressions: number;
    clicks: number;
    ctr: number;
    lastUpdated: string | null;
  };
}

const STORAGE_KEY = 'adsense_config';

const DEFAULT_CONFIG: AdSenseConfig = {
  publisherId: '',
  enabled: false,
  autoAds: false,
  adUnits: [
    { id: 'header-leaderboard', name: 'Header Leaderboard', slotId: '', format: 'horizontal', placement: 'header', enabled: true },
    { id: 'results-rectangle', name: 'After Results', slotId: '', format: 'rectangle', placement: 'afterResults', enabled: true },
    { id: 'sidebar-skyscraper', name: 'Sidebar', slotId: '', format: 'vertical', placement: 'sidebar', enabled: false },
    { id: 'footer-banner', name: 'Footer Banner', slotId: '', format: 'horizontal', placement: 'footer', enabled: true },
    { id: 'in-article', name: 'In-Article', slotId: '', format: 'auto', placement: 'inArticle', enabled: true },
  ],
  placements: {
    header: true,
    afterResults: true,
    sidebar: false,
    footer: true,
    inArticle: true,
  },
  applicationStatus: 'not_applied',
  applicationDate: null,
  applicationNotes: '',
  stats: {
    todayEarnings: 0,
    monthEarnings: 0,
    rpm: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    lastUpdated: null,
  },
};

let configCache: AdSenseConfig | null = null;

export function getAdSenseConfig(): AdSenseConfig {
  if (configCache) return configCache;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      configCache = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      return configCache!;
    }
  } catch {}
  configCache = { ...DEFAULT_CONFIG };
  return configCache;
}

export function saveAdSenseConfig(config: AdSenseConfig): void {
  configCache = config;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  // Also try to sync to backend
  fetch('/api/adsense-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  }).catch(() => {});
}

export function isAdSenseReady(): boolean {
  const config = getAdSenseConfig();
  return config.enabled && !!config.publisherId && config.publisherId.startsWith('ca-pub-');
}

export function isPlacementEnabled(placement: keyof AdSenseConfig['placements']): boolean {
  const config = getAdSenseConfig();
  if (!config.enabled || !config.publisherId) return false;
  return config.placements[placement] ?? false;
}

export function getAdUnit(placement: string): AdUnitConfig | undefined {
  const config = getAdSenseConfig();
  return config.adUnits.find(u => u.placement === placement && u.enabled);
}

export function invalidateConfigCache(): void {
  configCache = null;
}

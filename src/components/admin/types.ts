export interface Script {
  id: string;
  name: string;
  desc: string;
  category: string;
  icon: string;
  cmd: string;
}

export interface AdSlot {
  id: string;
  name: string;
  position: string;
  type: 'adsense' | 'html';
  slotId: string;
  enabled: boolean;
  htmlCode: string;
  description?: string;
}

export interface DetailedVisitor {
  id: string;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  isp: string;
  device: string;
  deviceType: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  screenRes: string;
  language: string;
  referrer: string;
  referrerDomain: string;
  entryPage: string;
  exitPage: string;
  pagesVisited: string[];
  pageViews: number;
  sessionDuration: number;
  timestamp: string;
  returning: boolean;
  timezone: string;
  connectionType: string;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: 'article' | 'page';
  status: 'published' | 'draft';
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

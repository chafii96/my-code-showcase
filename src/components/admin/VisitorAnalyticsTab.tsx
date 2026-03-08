import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Eye, TrendingUp, Activity, FileText, Globe, Search,
  Monitor, Smartphone, Tablet, Link2, Download, RefreshCw,
  BarChart2, Info, Map, Clock, MousePointer,
  ArrowRight, ChevronDown, ChevronUp, X, User, Wifi,
  Navigation, ExternalLink, Hash, Layers, Timer, Target,
  Filter, MapPin, Zap, Shield, ChevronLeft, ChevronRight,
  ArrowUpRight, ArrowDownRight, Radio, CheckSquare, Square,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from "recharts";
import { DetailedVisitor } from "./types";
import { StatCard, EmptyState, COUNTRY_FLAGS } from "./shared";
import { useApiData } from "./api-manager/useApiData";
import "leaflet/dist/leaflet.css";

const COUNTRY_COORDS: Record<string, [number, number]> = {
  US: [39.8, -98.5], CA: [56.1, -106.3], MX: [23.6, -102.5], BR: [-14.2, -51.9], AR: [-38.4, -63.6],
  GB: [55.3, -3.4], FR: [46.2, 2.2], DE: [51.1, 10.4], ES: [40.4, -3.7], IT: [41.8, 12.5],
  RU: [61.5, 105.3], TR: [38.9, 35.2], SA: [23.8, 45.0], AE: [23.4, 53.8], EG: [26.8, 30.8],
  NG: [9.0, 8.6], ZA: [-30.5, 22.9], IN: [20.5, 78.9], CN: [35.8, 104.1], JP: [36.2, 138.2],
  KR: [35.9, 127.7], AU: [-25.2, 133.7], PK: [30.3, 69.3], NL: [52.1, 5.2], SE: [60.1, 18.6],
  KW: [29.3, 47.4], QA: [25.3, 51.1],
};

const BROWSER_COLORS = ['#4285f4', '#ff6d01', '#e8452c', '#0078d7', '#64748b', '#8b5cf6', '#ec4899', '#14b8a6'];
const OS_COLORS = ['#0078d4', '#a3aaae', '#3ddc84', '#555555', '#f1c40f', '#ff6b6b', '#8b5cf6', '#06b6d4'];
const DEVICE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const NVR_COLORS = ['#22c55e', '#f59e0b'];
const SOURCE_COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ef4444'];

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid #475569', borderRadius: 10, color: '#e2e8f0', fontSize: 11, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' };

const GlassCard = ({ children, className = '', gradient }: { children: React.ReactNode; className?: string; gradient?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-slate-700/60 backdrop-blur-sm ${className}`}
    style={{ background: gradient || 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)' }}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className="relative">{children}</div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/40">
          <div className="h-3 bg-slate-700/50 rounded w-16 mb-3" />
          <div className="h-7 bg-slate-700/50 rounded w-20 mb-2" />
          <div className="h-2 bg-slate-700/30 rounded w-12" />
        </div>
      ))}
    </div>
    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/40">
      <div className="h-4 bg-slate-700/50 rounded w-32 mb-4" />
      <div className="h-48 bg-slate-700/30 rounded" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/40">
          <div className="h-4 bg-slate-700/50 rounded w-24 mb-4" />
          <div className="h-36 bg-slate-700/30 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const MiniSparkline = ({ data, color = '#3b82f6' }: { data: number[]; color?: string }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="mt-1 opacity-60">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const AnimatedNumber = ({ value, className = '' }: { value: number; className?: string }) => {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 600;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
      else prev.current = value;
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span className={className}>{display}</span>;
};

function LeafletMap({ countries }: { countries: any[] }) {
  const [mapReady, setMapReady] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-leaflet').then(mod => {
        setMapComponents({
          MapContainer: mod.MapContainer,
          TileLayer: mod.TileLayer,
          CircleMarker: mod.CircleMarker,
          Popup: mod.Popup,
        });
        setMapReady(true);
      });
    }
  }, []);

  if (!mapReady || !MapComponents) {
    return (
      <div className="rounded-xl overflow-hidden border border-slate-700/60" style={{ height: 380 }}>
        <div className="w-full h-full bg-slate-800/80 flex items-center justify-center">
          <div className="text-center">
            <Map size={32} className="text-slate-600 mx-auto mb-2 animate-pulse" />
            <p className="text-xs text-slate-500">جاري تحميل الخريطة...</p>
          </div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Popup } = MapComponents;
  const maxCount = Math.max(...countries.map((c: any) => c.count), 1);

  const getMarkerColor = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.6) return '#ef4444';
    if (ratio > 0.35) return '#f97316';
    if (ratio > 0.15) return '#eab308';
    if (ratio > 0.05) return '#22c55e';
    return '#3b82f6';
  };

  const getRadius = (count: number) => Math.max(6, Math.min(25, (count / maxCount) * 25 + 4));

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60" style={{ height: 380 }}>
      <MapContainer
        center={[25, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={8}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        zoomControl={true}
        scrollWheelZoom={true}
        dragging={true}
      >
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
        />
        {countries.map((c: any) => {
          const coords = COUNTRY_COORDS[c.code];
          if (!coords) return null;
          return (
            <CircleMarker
              key={c.code}
              center={coords}
              radius={getRadius(c.count)}
              pathOptions={{
                fillColor: getMarkerColor(c.count),
                fillOpacity: 0.7,
                color: getMarkerColor(c.count),
                weight: 2,
                opacity: 0.9,
              }}
            >
              <Popup>
                <div style={{ minWidth: 140, padding: 4, direction: 'rtl', fontFamily: 'inherit' }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{COUNTRY_FLAGS[c.code] || '🌐'} <strong>{c.country}</strong></div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>الزيارات: <strong style={{ color: '#fff' }}>{c.count?.toLocaleString()}</strong></div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>النسبة: <strong style={{ color: '#fff' }}>{c.pct}%</strong></div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function VisitorDetailPanel({ visitor, onClose }: { visitor: DetailedVisitor; onClose: () => void }) {
  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}ث`;
    const m = Math.floor(sec / 60);
    const sv = sec % 60;
    return `${m}د ${sv}ث`;
  };

  const engagementScore = Math.min(100, Math.round((visitor.pageViews * 15) + (visitor.sessionDuration / 10)));
  const engColor = engagementScore >= 70 ? 'text-emerald-400' : engagementScore >= 40 ? 'text-amber-400' : 'text-red-400';
  const engBg = engagementScore >= 70 ? 'bg-emerald-500/20' : engagementScore >= 40 ? 'bg-amber-500/20' : 'bg-red-500/20';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <User size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{visitor.ip}</p>
              <p className="text-[10px] text-slate-400">{COUNTRY_FLAGS[visitor.countryCode] || '🏳️'} {visitor.city}, {visitor.region}, {visitor.country}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-slate-800/80 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white">{visitor.pageViews}</p>
              <p className="text-[10px] text-slate-400">صفحات</p>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white">{formatDuration(visitor.sessionDuration)}</p>
              <p className="text-[10px] text-slate-400">مدة الجلسة</p>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white">{visitor.returning ? '🔄' : '🆕'}</p>
              <p className="text-[10px] text-slate-400">{visitor.returning ? 'عائد' : 'جديد'}</p>
            </div>
            <div className={`${engBg} rounded-xl p-3 text-center`}>
              <p className={`text-lg font-bold ${engColor}`}>{engagementScore}</p>
              <p className="text-[10px] text-slate-400">تفاعل</p>
            </div>
          </div>

          <GlassCard className="p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Monitor size={14} className="text-blue-400" /> معلومات الجهاز والتقنية
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: 'الجهاز', value: visitor.device },
                { label: 'النوع', value: visitor.deviceType },
                { label: 'نظام التشغيل', value: `${visitor.os} ${visitor.osVersion}` },
                { label: 'المتصفح', value: `${visitor.browser} ${visitor.browserVersion}` },
                { label: 'الشاشة', value: visitor.screenRes },
                { label: 'اللغة', value: visitor.language },
                { label: 'المنطقة الزمنية', value: visitor.timezone },
                { label: 'نوع الاتصال', value: visitor.connectionType },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2 py-1">
                  <span className="text-[10px] text-slate-500 w-20 flex-shrink-0">{label}:</span>
                  <span className="text-[11px] text-slate-300 truncate">{value || '—'}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Globe size={14} className="text-green-400" /> الموقع والشبكة
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: 'IP', value: visitor.ip },
                { label: 'البلد', value: `${COUNTRY_FLAGS[visitor.countryCode] || ''} ${visitor.country}` },
                { label: 'المنطقة', value: visitor.region },
                { label: 'المدينة', value: visitor.city },
                { label: 'مزود الخدمة', value: visitor.isp },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2 py-1">
                  <span className="text-[10px] text-slate-500 w-24 flex-shrink-0">{label}:</span>
                  <span className="text-[11px] text-slate-300 truncate">{value || '—'}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Navigation size={14} className="text-purple-400" /> مصدر الزيارة
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 py-1">
                <span className="text-[10px] text-slate-500 w-24 flex-shrink-0">المصدر:</span>
                <span className="text-[11px] text-slate-300">{visitor.referrer || 'Direct (مباشر)'}</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <span className="text-[10px] text-slate-500 w-24 flex-shrink-0">صفحة الدخول:</span>
                <span className="text-[11px] text-blue-400 font-mono">{visitor.entryPage}</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <span className="text-[10px] text-slate-500 w-24 flex-shrink-0">صفحة الخروج:</span>
                <span className="text-[11px] text-red-400 font-mono">{visitor.exitPage}</span>
              </div>
            </div>
          </GlassCard>

          {visitor.pagesVisited && visitor.pagesVisited.length > 0 && (
            <GlassCard className="p-4">
              <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Layers size={14} className="text-amber-400" /> مسار التصفح ({visitor.pagesVisited.length} صفحة)
              </h4>
              <div className="space-y-1">
                {visitor.pagesVisited.map((page, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-green-400' : i === visitor.pagesVisited.length - 1 ? 'bg-red-400' : 'bg-blue-400'}`} />
                      {i < visitor.pagesVisited.length - 1 && <div className="w-px h-4 bg-slate-700" />}
                    </div>
                    <span className="text-[11px] text-slate-300 font-mono truncate">{page}</span>
                    {i === 0 && <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">دخول</span>}
                    {i === visitor.pagesVisited.length - 1 && i !== 0 && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">خروج</span>}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>{new Date(visitor.timestamp).toLocaleString('ar', { dateStyle: 'full', timeStyle: 'medium' })}</span>
            <span className={visitor.returning ? 'text-amber-400' : 'text-green-400'}>
              {visitor.returning ? '🔄 زائر عائد' : '🆕 زائر جديد'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const EMPTY_ANALYTICS = {
  summary: { totalPageviews: 0, todayViews: 0, totalSessions: 0, totalUniqueVisitors: 0, newVisitors: 0, returningVisitors: 0, avgSessionDuration: 0, bounceRate: 0, pagesPerVisit: 1 },
  topPages: [], topReferrers: [], devices: [], browsers: [], operatingSystems: [], countries: [],
  recentVisits: [], dailyTrend: [], hourlyTrend: [], screenResolutions: [], languages: [],
  connectionTypes: [], detailedVisitors: [], newVsReturning: { new: 0, returning: 0 },
};

export default function VisitorAnalyticsTab() {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('30d');
  const [selectedVisitor, setSelectedVisitor] = useState<DetailedVisitor | null>(null);
  const [visitorFilter, setVisitorFilter] = useState<'all' | 'desktop' | 'mobile' | 'tablet'>('all');
  const [visitorSearch, setVisitorSearch] = useState('');
  const [visitorSort, setVisitorSort] = useState<'time' | 'duration' | 'pages'>('time');
  const [subTab, setSubTab] = useState<'overview' | 'visitors' | 'geo' | 'tech' | 'live' | 'sources'>('overview');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [visitorPage, setVisitorPage] = useState(1);
  const [selectedVisitorIds, setSelectedVisitorIds] = useState<Set<string>>(new Set());

  const { data: analytics, loading, refetch, isLive } = useApiData<any>(
    `/analytics?range=${dateRange}`,
    EMPTY_ANALYTICS,
    { pollingInterval: 10000 }
  );

  const [activeVisitors, setActiveVisitors] = useState({ count: 0, pages: [] as string[] });
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activityFeed, setActivityFeed] = useState<any[]>([]);

  const fetchActive = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/active', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        setActiveVisitors(data);
        if (data.count > 0) {
          setActivityFeed(prev => {
            const newEntry = {
              id: Date.now(),
              time: new Date().toLocaleTimeString('ar'),
              count: data.count,
              pages: data.pages?.slice(0, 3) || [],
            };
            return [newEntry, ...prev].slice(0, 50);
          });
        }
      }
    } catch {}
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchActive(); const id = setInterval(fetchActive, 5000); return () => clearInterval(id); }, [fetchActive]);
  useEffect(() => { refetch(); }, [dateRange]);

  const s = analytics?.summary || {};
  const topPages = analytics?.topPages || [];
  const topReferrers = analytics?.topReferrers || [];
  const devices = analytics?.devices || [];
  const browsers = analytics?.browsers || [];
  const operatingSystems = analytics?.operatingSystems || [];
  const countries = analytics?.countries || [];
  const recentVisits = analytics?.recentVisits || [];
  const dailyTrend = analytics?.dailyTrend || [];
  const hourlyTrend = analytics?.hourlyTrend || [];
  const screenResolutions = analytics?.screenResolutions || [];
  const languages = analytics?.languages || [];
  const connectionTypes = analytics?.connectionTypes || [];
  const detailedVisitors: DetailedVisitor[] = analytics?.detailedVisitors || [];
  const newVsReturning = analytics?.newVsReturning || { new: 0, returning: 0 };

  const filteredVisitors = useMemo(() => detailedVisitors
    .filter(v => visitorFilter === 'all' || (v.deviceType || '').toLowerCase() === visitorFilter)
    .filter(v => !visitorSearch ||
      (v.ip || '').includes(visitorSearch) ||
      (v.country || '').toLowerCase().includes(visitorSearch.toLowerCase()) ||
      (v.city || '').toLowerCase().includes(visitorSearch.toLowerCase()) ||
      (v.browser || '').toLowerCase().includes(visitorSearch.toLowerCase()) ||
      (v.os || '').toLowerCase().includes(visitorSearch.toLowerCase()) ||
      (v.isp || '').toLowerCase().includes(visitorSearch.toLowerCase()) ||
      (v.referrer || '').toLowerCase().includes(visitorSearch.toLowerCase()) ||
      (v.entryPage || '').toLowerCase().includes(visitorSearch.toLowerCase())
    )
    .sort((a, b) => visitorSort === 'duration' ? b.sessionDuration - a.sessionDuration : visitorSort === 'pages' ? b.pageViews - a.pageViews : new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()),
    [detailedVisitors, visitorFilter, visitorSearch, visitorSort]
  );

  const VISITORS_PER_PAGE = 30;
  const totalPages = Math.ceil(filteredVisitors.length / VISITORS_PER_PAGE);
  const paginatedVisitors = filteredVisitors.slice((visitorPage - 1) * VISITORS_PER_PAGE, visitorPage * VISITORS_PER_PAGE);

  useEffect(() => { setVisitorPage(1); }, [visitorSearch, visitorFilter, visitorSort]);

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}ث`;
    const m = Math.floor(sec / 60);
    const sv = sec % 60;
    return `${m}د ${sv}ث`;
  };

  const totalVisitors = s.totalPageviews || 0;
  const uniqueVisitors = s.totalUniqueVisitors || 0;
  const avgPagesPerVisit = s.pagesPerVisit || 0;
  const newVisitorsPct = s.totalSessions > 0 ? Math.round(((s.newVisitors || 0) / (s.totalUniqueVisitors || 1)) * 100) : 0;

  const sparklineData = useMemo(() => {
    if (dailyTrend.length < 2) return { views: [], visitors: [], sessions: [] };
    const last7 = dailyTrend.slice(-7);
    return {
      views: last7.map((d: any) => d.views || 0),
      visitors: last7.map((d: any) => d.visitors || 0),
      sessions: last7.map((d: any) => d.sessions || d.visitors || 0),
    };
  }, [dailyTrend]);

  const nvrData = [
    { name: 'جدد', value: newVsReturning.new || s.newVisitors || 0 },
    { name: 'عائدون', value: newVsReturning.returning || s.returningVisitors || 0 },
  ].filter(d => d.value > 0);

  const browsersPieData = browsers.map((b: any) => ({ name: b.name || b.browser, value: b.count })).slice(0, 8);
  const devicesPieData = devices.map((d: any) => ({ name: d.name || d.device, value: d.count }));
  const osPieData = operatingSystems.map((o: any) => ({ name: o.name || o.os, value: o.count })).slice(0, 8);

  const sourceCategories = useMemo(() => {
    const cats: Record<string, number> = { 'بحث': 0, 'مباشر': 0, 'اجتماعي': 0, 'إحالة': 0 };
    topReferrers.forEach((r: any) => {
      const ref = (r.referrer || '').toLowerCase();
      if (!ref || ref === 'direct') cats['مباشر'] += r.count;
      else if (/google|bing|yahoo|duckduckgo|yandex|baidu/.test(ref)) cats['بحث'] += r.count;
      else if (/facebook|twitter|instagram|linkedin|reddit|tiktok|youtube|pinterest/.test(ref)) cats['اجتماعي'] += r.count;
      else cats['إحالة'] += r.count;
    });
    return Object.entries(cats).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [topReferrers]);

  const searchEngineBreakdown = useMemo(() => {
    const engines: Record<string, number> = {};
    topReferrers.forEach((r: any) => {
      const ref = (r.referrer || '').toLowerCase();
      if (/google/.test(ref)) engines['Google'] = (engines['Google'] || 0) + r.count;
      else if (/bing/.test(ref)) engines['Bing'] = (engines['Bing'] || 0) + r.count;
      else if (/yahoo/.test(ref)) engines['Yahoo'] = (engines['Yahoo'] || 0) + r.count;
      else if (/duckduckgo/.test(ref)) engines['DuckDuckGo'] = (engines['DuckDuckGo'] || 0) + r.count;
      else if (/yandex/.test(ref)) engines['Yandex'] = (engines['Yandex'] || 0) + r.count;
      else if (/baidu/.test(ref)) engines['Baidu'] = (engines['Baidu'] || 0) + r.count;
    });
    return Object.entries(engines).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  }, [topReferrers]);

  const peakHour = useMemo(() => {
    if (hourlyTrend.length === 0) return -1;
    let max = 0, idx = 0;
    hourlyTrend.forEach((h: any, i: number) => { if ((h.views || 0) > max) { max = h.views; idx = i; } });
    return idx;
  }, [hourlyTrend]);

  const getEngagementScore = (v: DetailedVisitor) => Math.min(100, Math.round((v.pageViews * 15) + (v.sessionDuration / 10)));
  const getEngagementColor = (score: number) => score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';
  const getEngagementBg = (score: number) => score >= 70 ? 'bg-emerald-500/20' : score >= 40 ? 'bg-amber-500/20' : 'bg-red-500/20';

  const toggleVisitorSelection = (id: string) => {
    setSelectedVisitorIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    const allIds = paginatedVisitors.map(v => v.id);
    const allSelected = allIds.every(id => selectedVisitorIds.has(id));
    setSelectedVisitorIds(prev => {
      const next = new Set(prev);
      allIds.forEach(id => { if (allSelected) next.delete(id); else next.add(id); });
      return next;
    });
  };

  const exportCSV = (onlySelected = false) => {
    const visitors = onlySelected ? detailedVisitors.filter(v => selectedVisitorIds.has(v.id)) : detailedVisitors;
    const rows: string[][] = [];
    rows.push(['=== ملخص الزوار ===']);
    rows.push(['إجمالي المشاهدات', String(s.totalPageviews || 0)]);
    rows.push(['جلسات', String(s.totalSessions || 0)]);
    rows.push(['زوار فريدون', String(s.totalUniqueVisitors || 0)]);
    rows.push(['متوسط مدة الجلسة', String(s.avgSessionDuration || 0)]);
    rows.push(['معدل الارتداد', String(s.bounceRate || 0)]);
    rows.push([]);
    rows.push(['=== أكثر الصفحات ===']); rows.push(['الصفحة', 'المشاهدات']);
    topPages.forEach((p: any) => rows.push([p.path, String(p.views)]));
    rows.push([]);
    rows.push(['=== الدول ===']); rows.push(['الدولة', 'الكود', 'الزيارات', 'النسبة']);
    countries.forEach((c: any) => rows.push([c.country, c.code, String(c.count), `${c.pct}%`]));
    rows.push([]);
    rows.push(['=== مصادر الزيارات ===']); rows.push(['المصدر', 'الزيارات']);
    topReferrers.forEach((r: any) => rows.push([r.referrer || 'Direct', String(r.count)]));
    if (visitors.length > 0) {
      rows.push([]); rows.push(['=== الزوار بالتفصيل ===']);
      rows.push(['IP', 'الدولة', 'المدينة', 'الجهاز', 'النظام', 'المتصفح', 'المصدر', 'صفحة الدخول', 'صفحات', 'جديد/عائد', 'الوقت']);
      visitors.forEach(v => rows.push([v.ip, v.country, v.city, v.device, v.os, v.browser, v.referrer || 'Direct', v.entryPage, String(v.pageViews), v.returning ? 'عائد' : 'جديد', v.timestamp]));
    }
    const csv = '\uFEFF' + rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `visitor-report-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  if (loading) return <LoadingSkeleton />;

  const noData = totalVisitors === 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {selectedVisitor && <VisitorDetailPanel visitor={selectedVisitor} onClose={() => setSelectedVisitor(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Activity size={20} className="text-blue-400" />
            تحليلات الزوار المتقدمة
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
            آخر تحديث: {lastRefresh.toLocaleTimeString('ar')}
            {isLive && <span className="text-green-400 mr-2">● متصل</span>}
            {detailedVisitors.length > 0 && <span className="text-slate-500"> · {detailedVisitors.length} زائر مسجل</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start flex-wrap">
          <div className="flex items-center gap-1 bg-slate-800/80 rounded-xl p-0.5 border border-slate-700/50">
            {(['today', '7d', '30d', 'all'] as const).map(r => (
              <button key={r} onClick={() => setDateRange(r)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${dateRange === r ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-white'}`}>
                {r === 'today' ? 'اليوم' : r === '7d' ? '7 أيام' : r === '30d' ? '30 يوم' : 'الكل'}
              </button>
            ))}
          </div>
          <button onClick={() => exportCSV()} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 rounded-xl text-[10px] text-white transition-all border border-emerald-500/30"><Download size={11} />تصدير CSV</button>
          <button onClick={() => refetch()} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/80 hover:bg-slate-600 rounded-xl text-[10px] text-slate-300 transition-all border border-slate-600/30"><RefreshCw size={11} />تحديث</button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {([
          { id: 'overview', label: 'نظرة عامة', icon: <BarChart2 size={12} />, count: null },
          { id: 'live', label: 'مباشر', icon: <Radio size={12} />, count: activeVisitors.count },
          { id: 'visitors', label: 'الزوار', icon: <User size={12} />, count: detailedVisitors.length },
          { id: 'geo', label: 'الجغرافيا', icon: <Globe size={12} />, count: countries.length },
          { id: 'sources', label: 'المصادر', icon: <Link2 size={12} />, count: topReferrers.length },
          { id: 'tech', label: 'التقنية', icon: <Monitor size={12} />, count: null },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5 ${
              subTab === t.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/40'
            }`}>
            {t.icon}
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${subTab === t.id ? 'bg-white/20' : 'bg-slate-600/80'}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <div className="admin-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-[0.07] bg-green-400" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">نشطون الآن</span>
              <span className="text-green-400 opacity-50 group-hover:opacity-90 transition-opacity relative">
                <Eye size={14} /><span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white tracking-tight"><AnimatedNumber value={activeVisitors.count} /></p>
            <MiniSparkline data={activityFeed.slice(0, 7).map(f => f.count).reverse()} color="#22c55e" />
          </div>
        </div>
        <div className="admin-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-[0.07] bg-blue-400" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">إجمالي المشاهدات</span>
              <BarChart2 size={14} className="text-blue-400 opacity-50 group-hover:opacity-90 transition-opacity" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{(s.totalPageviews || 0).toLocaleString()}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-slate-500">{s.todayViews || 0} اليوم</p>
            </div>
            <MiniSparkline data={sparklineData.views} color="#3b82f6" />
          </div>
        </div>
        <StatCard label="زوار فريدون" value={(uniqueVisitors).toLocaleString()} icon={<User size={14} />} color="text-cyan-400" sub={`${newVisitorsPct}% جدد`} />
        <StatCard label="الجلسات" value={(s.totalSessions || 0).toLocaleString()} icon={<Activity size={14} />} color="text-purple-400" sub={`${avgPagesPerVisit} صفحة/جلسة`} />
        <StatCard label="متوسط الجلسة" value={s.avgSessionDuration ? formatDuration(s.avgSessionDuration) : '—'} icon={<Timer size={14} />} color="text-yellow-400" />
        <StatCard label="معدل الارتداد" value={s.bounceRate !== undefined ? `${s.bounceRate}%` : '—'} icon={<Target size={14} />} color="text-red-400" sub="أقل = أفضل" />
      </div>

      {subTab === 'overview' && (
        <>
          {dailyTrend.length > 0 ? (
            <GlassCard className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2"><TrendingUp size={14} className="text-blue-400" /> اتجاه الزيارات اليومي</h3>
                <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg p-0.5 border border-slate-700/40">
                  {(['area', 'line', 'bar'] as const).map(ct => (
                    <button key={ct} onClick={() => setChartType(ct)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${chartType === ct ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                      {ct === 'area' ? 'منطقة' : ct === 'line' ? 'خط' : 'أعمدة'}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                {chartType === 'area' ? (
                  <AreaChart data={dailyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v: string) => v?.slice(5)} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} width={35} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: '#3b82f6', strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fill="url(#viewsGrad)" name="مشاهدات" />
                    <Area type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={2} fill="url(#visitorsGrad)" name="زوار فريدون" />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  </AreaChart>
                ) : chartType === 'line' ? (
                  <LineChart data={dailyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v: string) => v?.slice(5)} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} width={35} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: '#3b82f6', strokeDasharray: '4 4' }} />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} name="مشاهدات" />
                    <Line type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3, fill: '#8b5cf6' }} name="زوار فريدون" />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  </LineChart>
                ) : (
                  <BarChart data={dailyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v: string) => v?.slice(5)} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} width={35} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} name="مشاهدات" />
                    <Bar dataKey="visitors" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="زوار فريدون" />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </GlassCard>
          ) : <EmptyState icon={<TrendingUp size={32} />} title="لا توجد بيانات كافية" subtitle="سيظهر الرسم بعد تسجيل زيارات" />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {browsersPieData.length > 0 ? (
              <GlassCard className="p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">المتصفحات</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={browsersPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                      {browsersPieData.map((_: any, i: number) => <Cell key={i} fill={BROWSER_COLORS[i % BROWSER_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-1">
                  {browsersPieData.map((b: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: BROWSER_COLORS[i % BROWSER_COLORS.length] }} />
                      <span className="text-slate-400 flex-1">{b.name}</span>
                      <span className="text-white font-mono">{b.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ) : <EmptyState icon={<Globe size={24} />} title="لا توجد بيانات" />}

            {devicesPieData.length > 0 ? (
              <GlassCard className="p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">الأجهزة</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={devicesPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                      {devicesPieData.map((_: any, i: number) => <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-1">
                  {devicesPieData.map((d: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                      <span className="text-slate-400 flex-1">{d.name}</span>
                      <span className="text-white font-mono">{d.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ) : <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات" />}

            {osPieData.length > 0 ? (
              <GlassCard className="p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">أنظمة التشغيل</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={osPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                      {osPieData.map((_: any, i: number) => <Cell key={i} fill={OS_COLORS[i % OS_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-1">
                  {osPieData.map((o: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: OS_COLORS[i % OS_COLORS.length] }} />
                      <span className="text-slate-400 flex-1">{o.name}</span>
                      <span className="text-white font-mono">{o.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ) : <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات" />}

            {nvrData.length > 0 ? (
              <GlassCard className="p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">جدد vs عائدون</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={nvrData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                      {nvrData.map((_: any, i: number) => <Cell key={i} fill={NVR_COLORS[i % NVR_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-green-500/10 rounded-lg p-2 text-center border border-green-500/20">
                    <p className="text-lg font-bold text-green-400">{nvrData[0]?.value || 0}</p>
                    <p className="text-[10px] text-slate-400">جديد</p>
                  </div>
                  <div className="bg-amber-500/10 rounded-lg p-2 text-center border border-amber-500/20">
                    <p className="text-lg font-bold text-amber-400">{nvrData[1]?.value || 0}</p>
                    <p className="text-[10px] text-slate-400">عائد</p>
                  </div>
                </div>
              </GlassCard>
            ) : <EmptyState icon={<User size={24} />} title="لا توجد بيانات" />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><FileText size={14} className="text-blue-400" /> أكثر الصفحات زيارةً</h3>
              {topPages.length === 0 ? <EmptyState icon={<Eye size={24} />} title="لا توجد بيانات" /> : (
                <div className="space-y-2">
                  {topPages.slice(0, 10).map((p: any, i: number) => {
                    const maxViews = topPages[0]?.views || 1;
                    return (
                      <div key={i} className="group hover:bg-slate-700/20 rounded-lg p-1.5 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 w-5 text-center font-mono">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-slate-300 font-mono truncate">{p.path}</p>
                            <div className="bg-slate-700/50 rounded-full h-1.5 mt-1">
                              <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${(p.views / maxViews) * 100}%` }} />
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold text-white tabular-nums">{p.views?.toLocaleString()}</span>
                            {p.uniqueVisitors && <p className="text-[9px] text-slate-500">{p.uniqueVisitors} فريد</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Link2 size={14} className="text-emerald-400" /> مصادر الزيارات</h3>
              {topReferrers.length === 0 ? <EmptyState icon={<Globe size={24} />} title="لا توجد بيانات" /> :
                <div className="space-y-2">
                  {topReferrers.slice(0, 10).map((r: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 hover:bg-slate-700/20 rounded-lg p-1.5 transition-colors">
                      <span className="text-[10px] text-slate-500 w-5 text-center font-mono">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[11px] sm:text-xs gap-2">
                          <span className="text-slate-300 truncate">{r.referrer || 'Direct'}</span>
                          <span className="text-white font-bold tabular-nums flex-shrink-0">{r.count?.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-700/50 rounded-full h-1.5 mt-1">
                          <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${(r.count / (topReferrers[0]?.count || 1)) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>}
            </GlassCard>
          </div>

          {hourlyTrend.length > 0 && (
            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Clock size={14} className="text-amber-400" />
                توزيع الزيارات بالساعة
                {peakHour >= 0 && <span className="text-[10px] text-amber-400/70 mr-2">ذروة: {hourlyTrend[peakHour]?.hour || peakHour}:00</span>}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hourlyTrend}>
                  <defs>
                    <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 9 }} interval={2} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} width={30} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="views" radius={[4, 4, 0, 0]} name="مشاهدات">
                    {hourlyTrend.map((_: any, i: number) => (
                      <Cell key={i} fill={i === peakHour ? 'url(#peakGrad)' : 'url(#hourlyGrad)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          )}
        </>
      )}

      {subTab === 'live' && (
        <>
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 p-6" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.06) 100%)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
                  زوار نشطون الآن
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">تحديث تلقائي كل 5 ثوانٍ</p>
              </div>
              <div className="text-right">
                <span className="text-6xl font-bold text-white tabular-nums">
                  <AnimatedNumber value={activeVisitors.count} />
                </span>
                <p className="text-xs text-slate-500 mt-1">زائر نشط</p>
              </div>
            </div>
          </div>

          {activeVisitors.pages.length > 0 && (
            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-emerald-400" />
                الصفحات النشطة حالياً
              </h3>
              <div className="space-y-2">
                {activeVisitors.pages.slice(0, 10).map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-900/40 rounded-xl px-4 py-2.5 border border-slate-700/30">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0 shadow-sm shadow-emerald-400/50" />
                    <span className="text-xs text-slate-300 truncate font-mono flex-1">{p}</span>
                    <span className="text-[10px] text-emerald-400/60">مباشر</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {activityFeed.length > 0 && (
            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Activity size={14} className="text-blue-400" />
                سجل النشاط المباشر
              </h3>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {activityFeed.slice(0, 20).map((entry, i) => (
                  <div key={entry.id} className={`flex items-center gap-3 text-xs py-2 px-3 rounded-lg transition-all ${i === 0 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-slate-900/30'}`}>
                    <span className="text-[10px] text-slate-500 font-mono w-16 flex-shrink-0">{entry.time}</span>
                    <span className="text-slate-300">{entry.count} زائر نشط</span>
                    {entry.pages.length > 0 && (
                      <span className="text-[10px] text-slate-500 truncate">· {entry.pages[0]}</span>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard className="p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              آخر الزيارات الحية
            </h3>
            {recentVisits.length === 0 ? <EmptyState icon={<Activity size={32} />} title="لا توجد زيارات حية" subtitle="ستظهر الزيارات بعد تسجيل بيانات" /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-slate-400 border-b border-slate-700/50">
                    <th className="text-right pb-2.5 pr-2">الصفحة</th>
                    <th className="text-right pb-2.5">الجهاز</th>
                    <th className="text-right pb-2.5">المتصفح</th>
                    <th className="text-right pb-2.5 hidden sm:table-cell">المصدر</th>
                    <th className="text-right pb-2.5 hidden lg:table-cell">IP</th>
                    <th className="text-right pb-2.5">الوقت</th>
                  </tr></thead>
                  <tbody>{recentVisits.slice(0, 25).map((v: any, i: number) => (
                    <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="py-2.5 pr-2 text-blue-400 truncate max-w-[120px] sm:max-w-[200px] font-mono text-[11px]">{v.path}</td>
                      <td className="py-2.5 text-slate-400 capitalize">{v.device === 'mobile' ? '📱' : v.device === 'tablet' ? '📟' : '🖥️'} {v.device}</td>
                      <td className="py-2.5 text-slate-400">{v.browser}</td>
                      <td className="py-2.5 text-slate-400 hidden sm:table-cell truncate max-w-[100px]">{v.referrer || 'Direct'}</td>
                      <td className="py-2.5 text-slate-500 hidden lg:table-cell font-mono text-[10px]">{v.ip || '—'}</td>
                      <td className="py-2.5 text-slate-500 whitespace-nowrap">{new Date(v.timestamp).toLocaleTimeString('ar')}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </>
      )}

      {subTab === 'visitors' && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={visitorSearch} onChange={e => setVisitorSearch(e.target.value)} placeholder="ابحث بـ IP، البلد، المدينة، المتصفح، المصدر..."
                className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'desktop', 'mobile', 'tablet'] as const).map(f => (
                <button key={f} onClick={() => setVisitorFilter(f)} className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all border ${visitorFilter === f ? 'bg-blue-600 text-white border-blue-500/50' : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700/40'}`}>
                  {f === 'all' ? 'الكل' : f === 'desktop' ? '🖥️ حاسوب' : f === 'mobile' ? '📱 موبايل' : '📟 تابلت'}
                </button>
              ))}
              <div className="h-6 w-px bg-slate-700/50 self-center mx-1" />
              {(['time', 'duration', 'pages'] as const).map(so => (
                <button key={so} onClick={() => setVisitorSort(so)} className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all border ${visitorSort === so ? 'bg-purple-600 text-white border-purple-500/50' : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700/40'}`}>
                  {so === 'time' ? 'الأحدث' : so === 'duration' ? 'المدة' : 'الصفحات'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button onClick={toggleAllOnPage} className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors">
                {paginatedVisitors.length > 0 && paginatedVisitors.every(v => selectedVisitorIds.has(v.id))
                  ? <CheckSquare size={14} className="text-blue-400" />
                  : <Square size={14} />}
                تحديد الكل
              </button>
              <p className="text-[11px] text-slate-500">
                {filteredVisitors.length} زائر {visitorSearch && `(بحث: "${visitorSearch}")`}
              </p>
              {selectedVisitorIds.size > 0 && (
                <button onClick={() => exportCSV(true)} className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Download size={11} /> تصدير المحدد ({selectedVisitorIds.size})
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-600">صفحة {visitorPage} من {totalPages || 1}</p>
          </div>

          {filteredVisitors.length === 0 ? <EmptyState icon={<Eye size={32} />} title="لا توجد بيانات كافية" subtitle="ستظهر التفاصيل بعد وصول زيارات حقيقية" /> :
            <div className="space-y-2">
              {paginatedVisitors.map((v, i) => {
                const engScore = getEngagementScore(v);
                const isSelected = selectedVisitorIds.has(v.id);
                return (
                  <div key={v.id || i}
                    className={`rounded-2xl p-3.5 cursor-pointer transition-all group border ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500/40'
                        : 'bg-slate-800/60 border-slate-700/40 hover:border-blue-500/30 hover:bg-slate-800/80'
                    }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button onClick={(e) => { e.stopPropagation(); toggleVisitorSelection(v.id); }} className="flex-shrink-0">
                          {isSelected ? <CheckSquare size={16} className="text-blue-400" /> : <Square size={16} className="text-slate-600" />}
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-slate-700/50 flex items-center justify-center flex-shrink-0 text-lg" onClick={() => setSelectedVisitor(v)}>
                          {COUNTRY_FLAGS[v.countryCode] || '🏳️'}
                        </div>
                        <div className="min-w-0 flex-1" onClick={() => setSelectedVisitor(v)}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs text-white font-mono">{v.ip}</p>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${v.returning ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                              {v.returning ? '🔄 عائد' : '🆕 جديد'}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${getEngagementBg(engScore)} ${getEngagementColor(engScore)}`}>
                              تفاعل: {engScore}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {v.city}, {v.country}
                            <span className="text-slate-600 mx-1">·</span>
                            {v.deviceType === 'mobile' ? '📱' : v.deviceType === 'tablet' ? '📟' : '🖥️'} {v.browser} · {v.os}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 space-y-0.5" onClick={() => setSelectedVisitor(v)}>
                        <p className="text-xs font-bold text-blue-400">{v.pageViews} صفحات</p>
                        <p className="text-[10px] text-slate-400">{formatDuration(v.sessionDuration)}</p>
                        <p className="text-[10px] text-slate-500">{new Date(v.timestamp).toLocaleTimeString('ar')}</p>
                      </div>
                    </div>
                    {v.pagesVisited && v.pagesVisited.length > 0 && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-700/30 flex items-center gap-1 overflow-hidden">
                        <span className="text-[9px] text-slate-600 flex-shrink-0">المسار:</span>
                        {v.pagesVisited.slice(0, 5).map((page, pi) => (
                          <React.Fragment key={pi}>
                            {pi > 0 && <ArrowRight size={8} className="text-slate-600 flex-shrink-0" />}
                            <span className="text-[9px] text-slate-400 font-mono truncate max-w-[80px]">{page}</span>
                          </React.Fragment>
                        ))}
                        {v.pagesVisited.length > 5 && <span className="text-[9px] text-slate-600">+{v.pagesVisited.length - 5}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setVisitorPage(p => Math.max(1, p - 1))} disabled={visitorPage === 1}
                className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/40 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={14} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) page = i + 1;
                  else if (visitorPage <= 4) page = i + 1;
                  else if (visitorPage >= totalPages - 3) page = totalPages - 6 + i;
                  else page = visitorPage - 3 + i;
                  return (
                    <button key={page} onClick={() => setVisitorPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${visitorPage === page ? 'bg-blue-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/40'}`}>
                      {page}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setVisitorPage(p => Math.min(totalPages, p + 1))} disabled={visitorPage === totalPages}
                className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/40 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {subTab === 'geo' && (
        <>
          {countries.length > 0 && (
            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Map size={14} className="text-blue-400" /> خريطة تفاعلية
              </h3>
              <LeafletMap countries={countries} />
            </GlassCard>
          )}

          <GlassCard className="p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Globe size={14} className="text-blue-400" /> الدول ({countries.length})
            </h3>
            {countries.length === 0 ? <EmptyState icon={<Globe size={32} />} title="لا توجد بيانات جغرافية" /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700/50">
                      <th className="text-right pb-2.5 w-8">#</th>
                      <th className="text-right pb-2.5">الدولة</th>
                      <th className="text-right pb-2.5">الزيارات</th>
                      <th className="text-right pb-2.5">النسبة</th>
                      <th className="text-right pb-2.5 hidden sm:table-cell">التوزيع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.map((c: any, i: number) => (
                      <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                        <td className="py-2.5 text-slate-500 text-center font-mono">{i + 1}</td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm flex-shrink-0">{COUNTRY_FLAGS[c.code] || '🏳️'}</span>
                            <span className="text-slate-300 truncate">{c.country}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-white font-bold tabular-nums">{c.count?.toLocaleString()}</td>
                        <td className="py-2.5 text-slate-400">{c.pct}%</td>
                        <td className="py-2.5 hidden sm:table-cell">
                          <div className="bg-slate-700/50 rounded-full h-2 w-full max-w-[120px]">
                            <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${c.pct}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>

          {(() => {
            const cityMap: Record<string, number> = {};
            detailedVisitors.forEach(v => {
              if (v.city && v.city !== '—') {
                const key = `${v.city}, ${v.country}`;
                cityMap[key] = (cityMap[key] || 0) + 1;
              }
            });
            const cities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 15);
            if (cities.length === 0) return null;
            return (
              <GlassCard className="p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-purple-400" /> توزيع المدن
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {cities.map(([city, count], i) => (
                    <div key={i} className="bg-slate-900/50 rounded-xl p-3 text-center border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                      <p className="text-sm font-bold text-white">{count}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{city}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })()}

          {languages.length > 0 && (
            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Hash size={14} className="text-cyan-400" /> لغات الزوار ({languages.length})
              </h3>
              <div className="space-y-2">
                {languages.map((l: any, i: number) => {
                  const maxLang = languages[0]?.count || 1;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-slate-300 w-16 font-mono flex-shrink-0">{l.lang}</span>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-3">
                        <div className="h-3 rounded-full bg-cyan-500/70 transition-all flex items-center justify-end pr-2"
                          style={{ width: `${Math.max((l.count / maxLang) * 100, 8)}%` }}>
                          <span className="text-[8px] text-white font-bold">{l.count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          )}
        </>
      )}

      {subTab === 'sources' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sourceCategories.length > 0 && (
              <GlassCard className="p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Layers size={14} className="text-blue-400" /> تصنيف المصادر
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={sourceCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" nameKey="name" paddingAngle={3}>
                      {sourceCategories.map((_: any, i: number) => <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {sourceCategories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-900/40 rounded-lg p-2 border border-slate-700/30">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                      <span className="text-[11px] text-slate-300 flex-1">{cat.name}</span>
                      <span className="text-xs font-bold text-white">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {searchEngineBreakdown.length > 0 && (
              <GlassCard className="p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Search size={14} className="text-amber-400" /> محركات البحث
                </h3>
                <div className="space-y-3">
                  {searchEngineBreakdown.map((se, i) => {
                    const maxSE = searchEngineBreakdown[0]?.count || 1;
                    const icons: Record<string, string> = { Google: '🔍', Bing: '🅱️', Yahoo: '🟣', DuckDuckGo: '🦆', Yandex: '🔴', Baidu: '🔵' };
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg flex-shrink-0">{icons[se.name] || '🔍'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-slate-300">{se.name}</span>
                            <span className="text-xs font-bold text-white tabular-nums">{se.count}</span>
                          </div>
                          <div className="bg-slate-700/50 rounded-full h-2">
                            <div className="h-2 rounded-full bg-amber-500/70 transition-all" style={{ width: `${(se.count / maxSE) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}
          </div>

          <GlassCard className="p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Link2 size={14} className="text-emerald-400" /> أهم مصادر الزيارات بالتفصيل
            </h3>
            {topReferrers.length === 0 ? <EmptyState icon={<Link2 size={24} />} title="لا توجد بيانات كافية" /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700/50">
                      <th className="text-right pb-2.5 w-8">#</th>
                      <th className="text-right pb-2.5">النوع</th>
                      <th className="text-right pb-2.5">المصدر</th>
                      <th className="text-right pb-2.5">الزيارات</th>
                      <th className="text-right pb-2.5 hidden sm:table-cell">النسبة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topReferrers.slice(0, 15).map((r: any, i: number) => {
                      const domain = (r.referrer || 'Direct').replace(/^https?:\/\//, '').split('/')[0];
                      const isSearch = /google|bing|yahoo|duckduckgo|yandex/i.test(domain);
                      const isSocial = /facebook|twitter|instagram|linkedin|reddit|tiktok/i.test(domain);
                      const totalRef = topReferrers.reduce((acc: number, rr: any) => acc + (rr.count || 0), 0);
                      return (
                        <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                          <td className="py-2.5 text-slate-500 text-center font-mono">{i + 1}</td>
                          <td className="py-2.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              isSearch ? 'bg-blue-500/20 text-blue-400' :
                              isSocial ? 'bg-purple-500/20 text-purple-400' :
                              r.referrer ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                            }`}>
                              {isSearch ? 'بحث' : isSocial ? 'اجتماعي' : r.referrer ? 'إحالة' : 'مباشر'}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-300 truncate max-w-[200px]">{r.referrer || 'Direct (مباشر)'}</td>
                          <td className="py-2.5 text-white font-bold tabular-nums">{r.count?.toLocaleString()}</td>
                          <td className="py-2.5 text-slate-400 hidden sm:table-cell">{totalRef > 0 ? Math.round((r.count / totalRef) * 100) : 0}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Navigation size={14} className="text-purple-400" /> صفحات الدخول الأكثر شيوعاً
            </h3>
            {detailedVisitors.length === 0 ? <EmptyState icon={<Navigation size={24} />} title="لا توجد بيانات" /> : (() => {
              const entryPages: Record<string, number> = {};
              detailedVisitors.forEach(v => { entryPages[v.entryPage] = (entryPages[v.entryPage] || 0) + 1; });
              const sorted = Object.entries(entryPages).sort((a, b) => b[1] - a[1]).slice(0, 10);
              return (
                <div className="space-y-2">
                  {sorted.map(([page, count], i) => (
                    <div key={i} className="flex items-center gap-2 hover:bg-slate-700/20 rounded-lg p-1.5 transition-colors">
                      <span className="text-[10px] text-slate-500 w-5 text-center font-mono">{i + 1}</span>
                      <span className="text-[11px] text-slate-300 font-mono flex-1 truncate">{page}</span>
                      <span className="text-xs font-bold text-white tabular-nums">{count}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </GlassCard>
        </>
      )}

      {subTab === 'tech' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Monitor size={14} className="text-blue-400" /> الأجهزة
              </h3>
              {devices.length === 0 ? <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات" /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={devicesPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" paddingAngle={2}>
                        {devicesPieData.map((_: any, i: number) => <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2.5 mt-3">{devices.map((d: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="flex-shrink-0 text-slate-400">
                        {d.name === 'Desktop' || d.name === 'desktop' ? <Monitor size={14} /> : d.name === 'Mobile' || d.name === 'mobile' ? <Smartphone size={14} /> : <Tablet size={14} />}
                      </span>
                      <span className="text-xs text-slate-300 w-16">{d.name}</span>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-3">
                        <div className="h-3 rounded-full transition-all flex items-center justify-end pr-1" style={{ width: `${Math.max(d.pct, 5)}%`, backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }}>
                          <span className="text-[8px] text-white font-bold">{d.pct}%</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-white w-14 text-left tabular-nums">{d.count?.toLocaleString()}</span>
                    </div>
                  ))}</div>
                </>
              )}
            </GlassCard>

            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Globe size={14} className="text-amber-400" /> المتصفحات
              </h3>
              {browsers.length === 0 ? <EmptyState icon={<Globe size={24} />} title="لا توجد بيانات" /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={browsersPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" paddingAngle={2}>
                        {browsersPieData.map((_: any, i: number) => <Cell key={i} fill={BROWSER_COLORS[i % BROWSER_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">{browsers.map((b: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: BROWSER_COLORS[i % BROWSER_COLORS.length] }} />
                      <span className="text-xs text-slate-300 w-24 truncate">{b.name || b.browser} {b.version || ''}</span>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-2.5">
                        <div className="h-2.5 rounded-full transition-all" style={{ width: `${b.pct}%`, backgroundColor: BROWSER_COLORS[i % BROWSER_COLORS.length] }} />
                      </div>
                      <span className="text-xs font-mono text-white w-14 text-left tabular-nums">{b.count?.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 w-10">{b.pct}%</span>
                    </div>
                  ))}</div>
                </>
              )}
            </GlassCard>

            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Shield size={14} className="text-emerald-400" /> أنظمة التشغيل
              </h3>
              {operatingSystems.length === 0 ? <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات" /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={osPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" paddingAngle={2}>
                        {osPieData.map((_: any, i: number) => <Cell key={i} fill={OS_COLORS[i % OS_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2.5 mt-3">{operatingSystems.map((o: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: OS_COLORS[i % OS_COLORS.length] }} />
                      <span className="text-xs text-slate-300 w-16">{o.name || o.os}</span>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${o.pct}%`, backgroundColor: OS_COLORS[i % OS_COLORS.length] }} />
                      </div>
                      <span className="text-xs font-mono text-white w-14 text-left tabular-nums">{o.count?.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 w-10">{o.pct}%</span>
                    </div>
                  ))}</div>
                </>
              )}
            </GlassCard>

            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Monitor size={14} className="text-cyan-400" /> دقة الشاشة
              </h3>
              {screenResolutions.length === 0 ? <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات" /> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {screenResolutions.slice(0, 9).map((sr: any, i: number) => {
                    const maxRes = screenResolutions[0]?.count || 1;
                    const intensity = Math.round((sr.count / maxRes) * 100);
                    return (
                      <div key={i} className="rounded-xl p-3 text-center border border-slate-700/30 transition-colors hover:border-slate-600/50"
                        style={{ background: `rgba(6, 182, 212, ${intensity / 500 + 0.05})` }}>
                        <p className="text-xs font-mono text-white font-bold">{sr.res}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{sr.count?.toLocaleString()} زيارة</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </div>

          {connectionTypes.length > 0 && (
            <GlassCard className="p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Wifi size={14} className="text-blue-400" /> نوع الاتصال
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {connectionTypes.map((ct: any, i: number) => (
                  <div key={i} className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                    <Wifi size={18} className="mx-auto mb-2 text-blue-400/60" />
                    <p className="text-sm font-bold text-white">{ct.count?.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ct.type}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {(() => {
            const touchCount = detailedVisitors.filter(v => v.deviceType === 'mobile' || v.deviceType === 'tablet').length;
            const nonTouchCount = detailedVisitors.filter(v => v.deviceType === 'desktop').length;
            if (touchCount === 0 && nonTouchCount === 0) return null;
            const total = touchCount + nonTouchCount;
            return (
              <GlassCard className="p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <MousePointer size={14} className="text-purple-400" /> اللمس مقابل غير اللمس
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-500/10 rounded-xl p-4 text-center border border-purple-500/20">
                    <Smartphone size={24} className="mx-auto mb-2 text-purple-400" />
                    <p className="text-2xl font-bold text-white">{touchCount}</p>
                    <p className="text-[10px] text-slate-400 mt-1">أجهزة لمس</p>
                    <p className="text-xs text-purple-400 mt-0.5">{total > 0 ? Math.round((touchCount / total) * 100) : 0}%</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                    <Monitor size={24} className="mx-auto mb-2 text-blue-400" />
                    <p className="text-2xl font-bold text-white">{nonTouchCount}</p>
                    <p className="text-[10px] text-slate-400 mt-1">بدون لمس</p>
                    <p className="text-xs text-blue-400 mt-0.5">{total > 0 ? Math.round((nonTouchCount / total) * 100) : 0}%</p>
                  </div>
                </div>
              </GlassCard>
            );
          })()}
        </>
      )}

      <div className="bg-blue-900/15 border border-blue-700/30 rounded-2xl p-3.5 flex items-start gap-2.5">
        <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] sm:text-xs text-blue-300">البيانات تُجلب من الخلفية البرمجية — تأكد من تشغيل السيرفر لعرض بيانات حقيقية</p>
          {noData && <p className="text-[10px] text-amber-400/80 mt-0.5">لا توجد بيانات كافية — ستظهر البيانات بعد تسجيل زيارات حقيقية</p>}
        </div>
      </div>
    </div>
  );
}

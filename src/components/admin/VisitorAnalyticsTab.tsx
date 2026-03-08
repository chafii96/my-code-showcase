import React, { useState, useEffect, useCallback } from "react";
import {
  Eye, TrendingUp, Activity, FileText, Globe, Search,
  Monitor, Smartphone, Tablet, Link2, Download, RefreshCw,
  BarChart2, Info, Loader2, Map, Clock, MousePointer,
  ArrowRight, ChevronDown, ChevronUp, X, User, Wifi,
  Navigation, ExternalLink, Hash, Layers, Timer, Target,
  Filter, MapPin, Zap, Shield,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from "recharts";
import { DetailedVisitor } from "./types";
import { StatCard, EmptyState, COUNTRY_FLAGS } from "./shared";
import { useApiData } from "./api-manager/useApiData";

const COUNTRY_POSITIONS: Record<string, { x: number; y: number; name: string }> = {
  US: { x: 100, y: 155, name: 'United States' }, CA: { x: 105, y: 115, name: 'Canada' }, MX: { x: 85, y: 195, name: 'Mexico' },
  BR: { x: 170, y: 260, name: 'Brazil' }, AR: { x: 145, y: 310, name: 'Argentina' }, GB: { x: 268, y: 118, name: 'United Kingdom' },
  FR: { x: 273, y: 140, name: 'France' }, DE: { x: 288, y: 125, name: 'Germany' }, ES: { x: 260, y: 152, name: 'Spain' },
  IT: { x: 292, y: 148, name: 'Italy' }, RU: { x: 390, y: 85, name: 'Russia' }, TR: { x: 335, y: 150, name: 'Turkey' },
  SA: { x: 350, y: 190, name: 'Saudi Arabia' }, AE: { x: 365, y: 195, name: 'UAE' }, EG: { x: 320, y: 180, name: 'Egypt' },
  NG: { x: 285, y: 225, name: 'Nigeria' }, ZA: { x: 320, y: 305, name: 'South Africa' }, IN: { x: 400, y: 195, name: 'India' },
  CN: { x: 430, y: 145, name: 'China' }, JP: { x: 472, y: 145, name: 'Japan' }, KR: { x: 458, y: 148, name: 'South Korea' },
  AU: { x: 460, y: 295, name: 'Australia' }, PK: { x: 380, y: 170, name: 'Pakistan' },
};

const BROWSER_COLORS = ['#4285f4', '#ff6d01', '#e8452c', '#0078d7', '#64748b', '#8b5cf6', '#ec4899', '#14b8a6'];
const OS_COLORS = ['#0078d4', '#a3aaae', '#3ddc84', '#555555', '#f1c40f', '#ff6b6b', '#8b5cf6', '#06b6d4'];
const DEVICE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const NVR_COLORS = ['#22c55e', '#f59e0b'];

function WorldHeatmap({ countries }: { countries: any[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const maxCount = Math.max(...countries.map((c: any) => c.count), 1);
  const getColor = (count: number) => {
    const r = count / maxCount;
    if (r > 0.5) return '#ef4444'; if (r > 0.3) return '#f97316'; if (r > 0.15) return '#eab308'; if (r > 0.05) return '#22c55e'; return '#3b82f6';
  };
  const dataMap: Record<string, any> = {};
  countries.forEach((c: any) => { dataMap[c.code] = c; });

  const continentPaths = [
    'M40,100 Q60,80 105,85 Q140,90 155,100 Q160,115 155,135 Q145,150 135,155 L125,170 Q110,180 95,178 L80,180 Q60,175 50,165 L42,150 Q35,130 40,100Z',
    'M110,210 Q125,200 140,205 Q165,210 180,215 Q195,225 200,245 Q200,270 190,285 Q175,300 160,310 Q145,320 135,315 L125,300 Q118,280 115,260 Q108,240 110,210Z',
    'M255,95 Q275,88 300,90 Q315,95 320,108 L318,125 Q315,140 305,150 Q290,158 270,155 Q258,150 252,140 Q248,125 250,110 Q252,100 255,95Z',
    'M260,170 Q280,162 305,165 Q330,170 340,180 Q345,200 340,225 Q335,250 325,270 Q315,290 305,305 Q290,315 275,310 Q260,295 255,275 Q250,250 252,225 Q255,200 260,170Z',
    'M325,70 Q370,60 420,65 Q460,70 480,85 Q490,100 485,120 Q480,140 470,155 Q455,165 435,170 Q415,175 395,172 Q370,168 350,158 Q335,150 325,135 Q318,115 320,95 Q322,80 325,70Z',
    'M415,265 Q440,258 465,265 Q485,275 490,290 Q488,310 475,320 Q458,325 440,322 Q425,315 418,300 Q412,285 415,265Z',
  ];

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4 overflow-hidden">
      <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Map size={14} /> خريطة حرارية</h3>
      <div className="relative">
        <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ minHeight: 180 }}>
          <rect width="520" height="360" fill="#0f172a" rx="8" />
          {[0, 1, 2, 3, 4].map(i => <line key={`h${i}`} x1="0" y1={72 * i} x2="520" y2={72 * i} stroke="#1e293b" strokeWidth="0.5" />)}
          {[0, 1, 2, 3, 4, 5].map(i => <line key={`v${i}`} x1={104 * i} y1="0" x2={104 * i} y2="360" stroke="#1e293b" strokeWidth="0.5" />)}
          {continentPaths.map((d, i) => <path key={i} d={d} fill="#1e293b" stroke="#334155" strokeWidth="0.5" opacity="0.7" />)}
          {Object.entries(COUNTRY_POSITIONS).map(([code, pos]) => {
            const data = dataMap[code];
            if (!data) return <circle key={code} cx={pos.x} cy={pos.y} r={3} fill="#334155" opacity="0.4" />;
            const r = Math.max(4, Math.min(18, (data.count / maxCount) * 18));
            return (
              <g key={code} onMouseEnter={() => setHovered(code)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                <circle cx={pos.x} cy={pos.y} r={r + 4} fill={getColor(data.count)} opacity="0.15" />
                <circle cx={pos.x} cy={pos.y} r={r} fill={getColor(data.count)} opacity={hovered === code ? 0.9 : 0.7} stroke={hovered === code ? '#fff' : 'none'} strokeWidth="1.5" />
                <text x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">{data.count > 999 ? `${Math.round(data.count / 1000)}k` : data.count}</text>
              </g>
            );
          })}
          {hovered && dataMap[hovered] && COUNTRY_POSITIONS[hovered] && (() => {
            const pos = COUNTRY_POSITIONS[hovered]; const d = dataMap[hovered];
            const tx = Math.min(Math.max(pos.x + 15, 10), 390); const ty = Math.min(Math.max(pos.y - 45, 10), 300);
            return (
              <g>
                <rect x={tx} y={ty} width="130" height="50" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))" />
                <text x={tx + 8} y={ty + 18} fill="#e2e8f0" fontSize="10" fontWeight="bold">{COUNTRY_FLAGS[hovered] || '🌐'} {d.country}</text>
                <text x={tx + 8} y={ty + 33} fill="#94a3b8" fontSize="9">زيارات: {d.count?.toLocaleString()}</text>
                <text x={tx + 8} y={ty + 45} fill="#94a3b8" fontSize="9">النسبة: {d.pct}%</text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

function VisitorDetailPanel({ visitor, onClose }: { visitor: DetailedVisitor; onClose: () => void }) {
  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}ث`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}د ${s}ث`;
  };

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
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
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
          </div>

          <div className="bg-slate-800/60 rounded-xl p-4">
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
          </div>

          <div className="bg-slate-800/60 rounded-xl p-4">
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
          </div>

          <div className="bg-slate-800/60 rounded-xl p-4">
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
          </div>

          {visitor.pagesVisited && visitor.pagesVisited.length > 0 && (
            <div className="bg-slate-800/60 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Layers size={14} className="text-amber-400" /> مسار التصفح ({visitor.pagesVisited.length} صفحة)
              </h4>
              <div className="space-y-1">
                {visitor.pagesVisited.map((page, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        i === 0 ? 'bg-green-400' : i === visitor.pagesVisited.length - 1 ? 'bg-red-400' : 'bg-blue-400'
                      }`} />
                      {i < visitor.pagesVisited.length - 1 && <div className="w-px h-4 bg-slate-700" />}
                    </div>
                    <span className="text-[11px] text-slate-300 font-mono truncate">{page}</span>
                    {i === 0 && <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">دخول</span>}
                    {i === visitor.pagesVisited.length - 1 && i !== 0 && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">خروج</span>}
                  </div>
                ))}
              </div>
            </div>
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

  const { data: analytics, loading, refetch, isLive } = useApiData<any>(
    `/analytics?range=${dateRange}`,
    EMPTY_ANALYTICS,
    { pollingInterval: 10000 }
  );

  const [activeVisitors, setActiveVisitors] = useState({ count: 0, pages: [] as string[] });
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchActive = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/active', { signal: AbortSignal.timeout(3000) });
      if (res.ok) setActiveVisitors(await res.json());
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

  const filteredVisitors = detailedVisitors
    .filter(v => visitorFilter === 'all' || v.deviceType.toLowerCase() === visitorFilter)
    .filter(v => !visitorSearch ||
      v.ip.includes(visitorSearch) ||
      v.country.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      v.city.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      v.browser.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      v.os.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      v.isp.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      v.referrer.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      (v.entryPage || '').toLowerCase().includes(visitorSearch.toLowerCase())
    )
    .sort((a, b) => visitorSort === 'duration' ? b.sessionDuration - a.sessionDuration : visitorSort === 'pages' ? b.pageViews - a.pageViews : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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

  const nvrData = [
    { name: 'جدد', value: newVsReturning.new || s.newVisitors || 0 },
    { name: 'عائدون', value: newVsReturning.returning || s.returningVisitors || 0 },
  ].filter(d => d.value > 0);

  const browsersPieData = browsers.map((b: any) => ({ name: b.name || b.browser, value: b.count })).slice(0, 6);
  const devicesPieData = devices.map((d: any) => ({ name: d.name || d.device, value: d.count }));
  const osPieData = operatingSystems.map((o: any) => ({ name: o.name || o.os, value: o.count })).slice(0, 6);

  const exportCSV = () => {
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
    if (detailedVisitors.length > 0) {
      rows.push([]); rows.push(['=== الزوار بالتفصيل ===']);
      rows.push(['IP', 'الدولة', 'المدينة', 'الجهاز', 'النظام', 'المتصفح', 'المصدر', 'صفحة الدخول', 'صفحات', 'جديد/عائد', 'الوقت']);
      detailedVisitors.forEach(v => rows.push([v.ip, v.country, v.city, v.device, v.os, v.browser, v.referrer || 'Direct', v.entryPage, String(v.pageViews), v.returning ? 'عائد' : 'جديد', v.timestamp]));
    }
    const csv = '\uFEFF' + rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `visitor-report-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

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
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5">
            {(['today', '7d', '30d', 'all'] as const).map(r => (
              <button key={r} onClick={() => setDateRange(r)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${dateRange === r ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                {r === 'today' ? 'اليوم' : r === '7d' ? '7 أيام' : r === '30d' ? '30 يوم' : 'الكل'}
              </button>
            ))}
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-700 hover:bg-green-600 rounded-lg text-[10px] text-white transition-colors"><Download size={11} />تصدير CSV</button>
          <button onClick={() => refetch()} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] text-slate-300 transition-colors"><RefreshCw size={11} />تحديث</button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {([
          { id: 'overview', label: 'نظرة عامة', count: null },
          { id: 'live', label: 'مباشر', count: activeVisitors.count },
          { id: 'visitors', label: 'الزوار', count: detailedVisitors.length },
          { id: 'geo', label: 'الجغرافيا', count: countries.length },
          { id: 'sources', label: 'المصادر', count: topReferrers.length },
          { id: 'tech', label: 'التقنية', count: null },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5 ${
              subTab === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}>
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${subTab === t.id ? 'bg-white/20' : 'bg-slate-600'}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <StatCard label="نشطون الآن" value={activeVisitors.count} icon={<span className="relative"><Eye size={14} /><span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" /></span>} color="text-green-400" />
        <StatCard label="إجمالي المشاهدات" value={(s.totalPageviews || 0).toLocaleString()} icon={<BarChart2 size={14} />} color="text-blue-400" sub={`${s.todayViews || 0} اليوم`} />
        <StatCard label="زوار فريدون" value={(uniqueVisitors).toLocaleString()} icon={<User size={14} />} color="text-cyan-400" sub={`${newVisitorsPct}% جدد`} />
        <StatCard label="الجلسات" value={(s.totalSessions || 0).toLocaleString()} icon={<Activity size={14} />} color="text-purple-400" sub={`${avgPagesPerVisit} صفحة/جلسة`} />
        <StatCard label="متوسط الجلسة" value={s.avgSessionDuration ? formatDuration(s.avgSessionDuration) : '—'} icon={<Timer size={14} />} color="text-yellow-400" />
        <StatCard label="معدل الارتداد" value={s.bounceRate !== undefined ? `${s.bounceRate}%` : '—'} icon={<Target size={14} />} color="text-red-400" sub="أقل = أفضل" />
      </div>

      {subTab === 'overview' && (
        <>
          {dailyTrend.length > 0 ? (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><TrendingUp size={14} /> اتجاه الزيارات اليومي</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v: string) => v?.slice(5)} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} width={35} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={false} name="مشاهدات" />
                  <Line type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={2} dot={false} name="زوار فريدون" />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState icon={<TrendingUp size={32} />} title="لا توجد بيانات كافية" subtitle="سيظهر الرسم بعد تسجيل زيارات" />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {browsersPieData.length > 0 ? (
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">المتصفحات</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={browsersPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                      {browsersPieData.map((_: any, i: number) => <Cell key={i} fill={BROWSER_COLORS[i % BROWSER_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
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
              </div>
            ) : <EmptyState icon={<Globe size={24} />} title="لا توجد بيانات كافية" />}

            {devicesPieData.length > 0 ? (
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">الأجهزة</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={devicesPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                      {devicesPieData.map((_: any, i: number) => <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
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
              </div>
            ) : <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات كافية" />}

            {osPieData.length > 0 ? (
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">أنظمة التشغيل</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={osPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                      {osPieData.map((_: any, i: number) => <Cell key={i} fill={OS_COLORS[i % OS_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
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
              </div>
            ) : <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات كافية" />}

            {nvrData.length > 0 ? (
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">جدد vs عائدون</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={nvrData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                      {nvrData.map((_: any, i: number) => <Cell key={i} fill={NVR_COLORS[i % NVR_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-green-500/10 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-green-400">{nvrData[0]?.value || 0}</p>
                    <p className="text-[10px] text-slate-400">جديد</p>
                  </div>
                  <div className="bg-amber-500/10 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-amber-400">{nvrData[1]?.value || 0}</p>
                    <p className="text-[10px] text-slate-400">عائد</p>
                  </div>
                </div>
              </div>
            ) : <EmptyState icon={<User size={24} />} title="لا توجد بيانات كافية" />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><FileText size={14} /> أكثر الصفحات زيارةً</h3>
              {topPages.length === 0 ? <EmptyState icon={<Eye size={24} />} title="لا توجد بيانات كافية" /> : (
                <>
                  <ResponsiveContainer width="100%" height={Math.min(topPages.length * 28 + 40, 300)}>
                    <BarChart data={topPages.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} />
                      <YAxis type="category" dataKey="path" tick={{ fill: '#94a3b8', fontSize: 9 }} width={120} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                      <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} name="مشاهدات" />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Link2 size={14} /> مصادر الزيارات</h3>
              {topReferrers.length === 0 ? <EmptyState icon={<Globe size={24} />} title="لا توجد بيانات كافية" /> :
                <div className="space-y-2">
                  {topReferrers.slice(0, 10).map((r: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                      <span className="text-[10px] text-slate-500 w-5 text-center font-mono">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[11px] sm:text-xs gap-2"><span className="text-slate-300 truncate">{r.referrer || 'Direct'}</span><span className="text-white font-bold tabular-nums flex-shrink-0">{r.count?.toLocaleString()}</span></div>
                        <div className="bg-slate-700 rounded-full h-1.5 mt-1"><div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${(r.count / (topReferrers[0]?.count || 1)) * 100}%` }} /></div>
                      </div>
                    </div>
                  ))}
                </div>}
            </div>
          </div>

          {hourlyTrend.length > 0 && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">توزيع الزيارات بالساعة</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={hourlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 9 }} interval={2} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} width={30} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[3, 3, 0, 0]} name="مشاهدات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {subTab === 'live' && (
        <>
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 p-5" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="relative flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
                  زوار نشطون الآن
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">تحديث تلقائي كل 5 ثوانٍ</p>
              </div>
              <span className="text-5xl font-bold text-white tabular-nums">{activeVisitors.count}</span>
            </div>
            {activeVisitors.pages.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <p className="text-[10px] text-emerald-400/70 font-medium">الصفحات النشطة:</p>
                {activeVisitors.pages.slice(0, 8).map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-white/[0.04] rounded-lg px-3 py-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                    <span className="text-slate-300 truncate font-mono">{p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              آخر الزيارات الحية
            </h3>
            {recentVisits.length === 0 ? <EmptyState icon={<Activity size={32} />} title="لا توجد زيارات حية" subtitle="ستظهر الزيارات بعد تسجيل بيانات" /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-right pb-2 pr-2">الصفحة</th>
                    <th className="text-right pb-2">الجهاز</th>
                    <th className="text-right pb-2">المتصفح</th>
                    <th className="text-right pb-2 hidden sm:table-cell">المصدر</th>
                    <th className="text-right pb-2 hidden lg:table-cell">IP</th>
                    <th className="text-right pb-2">الوقت</th>
                  </tr></thead>
                  <tbody>{recentVisits.slice(0, 25).map((v: any, i: number) => (
                    <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-2 pr-2 text-blue-400 truncate max-w-[120px] sm:max-w-[180px] font-mono text-[11px]">{v.path}</td>
                      <td className="py-2 text-slate-400 capitalize">{v.device === 'mobile' ? '📱' : v.device === 'tablet' ? '📟' : '🖥️'} {v.device}</td>
                      <td className="py-2 text-slate-400">{v.browser}</td>
                      <td className="py-2 text-slate-400 hidden sm:table-cell truncate max-w-[100px]">{v.referrer || 'Direct'}</td>
                      <td className="py-2 text-slate-500 hidden lg:table-cell font-mono text-[10px]">{v.ip || '—'}</td>
                      <td className="py-2 text-slate-500 whitespace-nowrap">{new Date(v.timestamp).toLocaleTimeString('ar')}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {subTab === 'visitors' && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={visitorSearch} onChange={e => setVisitorSearch(e.target.value)} placeholder="ابحث بـ IP، البلد، المدينة، المتصفح، المصدر..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'desktop', 'mobile', 'tablet'] as const).map(f => (
                <button key={f} onClick={() => setVisitorFilter(f)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${visitorFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                  {f === 'all' ? 'الكل' : f === 'desktop' ? '🖥️ حاسوب' : f === 'mobile' ? '📱 موبايل' : '📟 تابلت'}
                </button>
              ))}
              <div className="h-6 w-px bg-slate-700 self-center mx-1" />
              {(['time', 'duration', 'pages'] as const).map(so => (
                <button key={so} onClick={() => setVisitorSort(so)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${visitorSort === so ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                  {so === 'time' ? 'الأحدث' : so === 'duration' ? 'المدة' : 'الصفحات'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              {filteredVisitors.length} زائر {visitorSearch && `(بحث: "${visitorSearch}")`}
            </p>
            <p className="text-[10px] text-slate-600">انقر على الزائر لعرض التفاصيل الكاملة</p>
          </div>

          {filteredVisitors.length === 0 ? <EmptyState icon={<Eye size={32} />} title="لا توجد بيانات كافية" subtitle="ستظهر التفاصيل بعد وصول زيارات حقيقية" /> :
            <div className="space-y-2">
              {filteredVisitors.slice(0, 100).map((v, i) => (
                <div key={v.id || i} onClick={() => setSelectedVisitor(v)}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 cursor-pointer transition-all hover:border-blue-500/40 hover:bg-slate-800 group">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0 text-lg">
                        {COUNTRY_FLAGS[v.countryCode] || '🏳️'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs text-white font-mono">{v.ip}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${v.returning ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                            {v.returning ? '🔄 عائد' : '🆕 جديد'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {v.city}, {v.country}
                          <span className="text-slate-600 mx-1">·</span>
                          {v.deviceType === 'mobile' ? '📱' : v.deviceType === 'tablet' ? '📟' : '🖥️'} {v.browser} · {v.os}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-0.5">
                      <p className="text-xs font-bold text-blue-400">{v.pageViews} صفحات</p>
                      <p className="text-[10px] text-slate-400">{formatDuration(v.sessionDuration)}</p>
                      <p className="text-[10px] text-slate-500">{new Date(v.timestamp).toLocaleTimeString('ar')}</p>
                    </div>
                  </div>
                  {v.pagesVisited && v.pagesVisited.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1 overflow-hidden">
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
              ))}
            </div>}
        </>
      )}

      {subTab === 'geo' && (
        <>
          {countries.length > 0 && <WorldHeatmap countries={countries} />}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">الدول ({countries.length})</h3>
            {countries.length === 0 ? <EmptyState icon={<Globe size={32} />} title="لا توجد بيانات جغرافية" /> :
              <div className="space-y-2">
                {countries.map((c: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 w-4 text-center">{i + 1}</span>
                    <span className="text-sm flex-shrink-0">{COUNTRY_FLAGS[c.code] || '🏳️'}</span>
                    <span className="text-xs text-slate-300 w-24 truncate">{c.country}</span>
                    <div className="flex-1 bg-slate-700/50 rounded-full h-2.5"><div className="h-2.5 rounded-full bg-blue-500 transition-all" style={{ width: `${c.pct}%` }} /></div>
                    <span className="text-xs font-mono text-white w-14 text-left tabular-nums">{c.count?.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 w-10 text-left">{c.pct}%</span>
                  </div>
                ))}
              </div>}
          </div>
          {languages.length > 0 && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">لغات الزوار ({languages.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {languages.map((l: any, i: number) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-2.5 text-center hover:bg-slate-900/70 transition-colors">
                    <p className="text-sm font-bold text-white">{l.count?.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{l.lang}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {subTab === 'sources' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">أهم مصادر الزيارات</h3>
              {topReferrers.length === 0 ? <EmptyState icon={<Link2 size={24} />} title="لا توجد بيانات كافية" /> :
                <div className="space-y-2">
                  {topReferrers.slice(0, 15).map((r: any, i: number) => {
                    const domain = (r.referrer || 'Direct').replace(/^https?:\/\//, '').split('/')[0];
                    const isSearch = /google|bing|yahoo|duckduckgo|yandex/i.test(domain);
                    const isSocial = /facebook|twitter|instagram|linkedin|reddit|tiktok/i.test(domain);
                    return (
                      <div key={i} className="flex items-center gap-2 sm:gap-3 bg-slate-900/30 rounded-lg p-2 hover:bg-slate-900/50 transition-colors">
                        <span className="text-[10px] text-slate-500 w-5 text-center font-mono">{i + 1}</span>
                        <span className="text-xs flex-shrink-0">{isSearch ? '🔍' : isSocial ? '📱' : r.referrer ? '🔗' : '➡️'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 truncate">{r.referrer || 'Direct (مباشر)'}</p>
                          <p className="text-[10px] text-slate-500">{isSearch ? 'بحث' : isSocial ? 'تواصل اجتماعي' : r.referrer && r.referrer !== 'direct' ? 'إحالة' : 'مباشر'}</p>
                        </div>
                        <span className="text-xs font-bold text-white tabular-nums">{r.count?.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>}
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">صفحات الدخول الأكثر شيوعاً</h3>
              {detailedVisitors.length === 0 ? <EmptyState icon={<Navigation size={24} />} title="لا توجد بيانات كافية" /> : (() => {
                const entryPages: Record<string, number> = {};
                detailedVisitors.forEach(v => { entryPages[v.entryPage] = (entryPages[v.entryPage] || 0) + 1; });
                const sorted = Object.entries(entryPages).sort((a, b) => b[1] - a[1]).slice(0, 10);
                return (
                  <div className="space-y-2">
                    {sorted.map(([page, count], i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 w-5 text-center font-mono">{i + 1}</span>
                        <span className="text-[11px] text-slate-300 font-mono flex-1 truncate">{page}</span>
                        <span className="text-xs font-bold text-white tabular-nums">{count}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}

      {subTab === 'tech' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">الأجهزة</h3>
              {devices.length === 0 ? <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات كافية" /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={devicesPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" paddingAngle={2}>
                        {devicesPieData.map((_: any, i: number) => <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">{devices.map((d: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="flex-shrink-0">{d.name === 'Desktop' ? <Monitor size={14} /> : d.name === 'Mobile' ? <Smartphone size={14} /> : <Tablet size={14} />}</span>
                      <span className="text-xs text-slate-300 w-16">{d.name}</span>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-3"><div className="h-3 rounded-full transition-all flex items-center justify-end pr-1" style={{ width: `${Math.max(d.pct, 5)}%`, backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }}><span className="text-[8px] text-white font-bold">{d.pct}%</span></div></div>
                      <span className="text-xs font-mono text-white w-14 text-left tabular-nums">{d.count?.toLocaleString()}</span>
                    </div>
                  ))}</div>
                </>
              )}
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">المتصفحات</h3>
              {browsers.length === 0 ? <EmptyState icon={<Globe size={24} />} title="لا توجد بيانات كافية" /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={browsersPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" paddingAngle={2}>
                        {browsersPieData.map((_: any, i: number) => <Cell key={i} fill={BROWSER_COLORS[i % BROWSER_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">{browsers.map((b: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: BROWSER_COLORS[i % BROWSER_COLORS.length] }} />
                      <span className="text-xs text-slate-300 w-20 truncate">{b.name || b.browser}</span>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-2.5"><div className="h-2.5 rounded-full transition-all" style={{ width: `${b.pct}%`, backgroundColor: BROWSER_COLORS[i % BROWSER_COLORS.length] }} /></div>
                      <span className="text-xs font-mono text-white w-14 text-left tabular-nums">{b.count?.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 w-10">{b.pct}%</span>
                    </div>
                  ))}</div>
                </>
              )}
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">أنظمة التشغيل</h3>
              {operatingSystems.length === 0 ? <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات كافية" /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={osPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" paddingAngle={2}>
                        {osPieData.map((_: any, i: number) => <Cell key={i} fill={OS_COLORS[i % OS_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2.5 mt-3">{operatingSystems.map((o: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: OS_COLORS[i % OS_COLORS.length] }} />
                      <span className="text-xs text-slate-300 w-16">{o.name || o.os}</span>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-2"><div className="h-2 rounded-full transition-all" style={{ width: `${o.pct}%`, backgroundColor: OS_COLORS[i % OS_COLORS.length] }} /></div>
                      <span className="text-xs font-mono text-white w-14 text-left tabular-nums">{o.count?.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 w-10">{o.pct}%</span>
                    </div>
                  ))}</div>
                </>
              )}
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">دقة الشاشة</h3>
              {screenResolutions.length === 0 ? <EmptyState icon={<Monitor size={24} />} title="لا توجد بيانات كافية" /> :
                <div className="space-y-2">{screenResolutions.map((sr: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-300 w-24">{sr.res}</span>
                    <div className="flex-1 bg-slate-700/50 rounded-full h-2"><div className="h-2 rounded-full bg-cyan-500 transition-all" style={{ width: `${(sr.count / (screenResolutions[0]?.count || 1)) * 100}%` }} /></div>
                    <span className="text-xs font-mono text-white w-12 text-left tabular-nums">{sr.count?.toLocaleString()}</span>
                  </div>
                ))}</div>}
            </div>
          </div>

          {connectionTypes.length > 0 && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">نوع الاتصال</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {connectionTypes.map((ct: any, i: number) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900/70 transition-colors">
                    <p className="text-sm font-bold text-white">{ct.count?.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ct.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-blue-900/15 border border-blue-700/40 rounded-xl p-3 flex items-start gap-2">
        <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] sm:text-xs text-blue-300">البيانات تُجلب من الخلفية البرمجية — تأكد من تشغيل السيرفر لعرض بيانات حقيقية</p>
          {noData && <p className="text-[10px] text-amber-400/80 mt-0.5">لا توجد بيانات كافية — ستظهر البيانات بعد تسجيل زيارات حقيقية</p>}
        </div>
      </div>
    </div>
  );
}

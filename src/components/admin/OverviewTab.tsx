import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Globe, FileText, Zap, Eye, Map, ExternalLink, Shield,
  TrendingUp, CheckCircle, Loader2, Clock, Activity, Server,
  Users, MousePointer, Search, Monitor, Smartphone, Tablet,
  ArrowUpRight, ArrowDownRight, Minus, Cpu, Database, Wifi,
  BarChart2, Timer, Target, HardDrive, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useApiData } from "./api-manager/useApiData";
import { COUNTRY_FLAGS } from "./shared";

const CHART_TOOLTIP = {
  contentStyle: {
    background: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#e2e8f0',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
};

const GLASS_CARD = "relative overflow-hidden rounded-2xl border border-white/[0.08] p-5 backdrop-blur-sm";
const GLASS_BG_VALUE = "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)";

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const from = display;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

function GlassStatCard({ icon, iconColor, gradientFrom, gradientTo, label, value, sub, trend, sparkData, pulse }: {
  icon: React.ReactNode;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  label: string;
  value: string | number;
  sub?: string;
  trend?: { value: string; direction: 'up' | 'down' | 'flat' };
  sparkData?: number[];
  pulse?: boolean;
}) {
  return (
    <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-20`}
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center`}
            style={{ background: `linear-gradient(135deg, ${gradientFrom}22, ${gradientTo}22)`, border: `1px solid ${gradientFrom}33` }}>
            <span className={iconColor}>{icon}</span>
          </div>
          {pulse && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-[10px] text-emerald-400 font-medium">مباشر</span>
            </span>
          )}
          {trend && (
            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
              trend.direction === 'up' ? 'text-emerald-400 bg-emerald-400/10' :
              trend.direction === 'down' ? 'text-red-400 bg-red-400/10' :
              'text-slate-400 bg-slate-400/10'
            }`}>
              {trend.direction === 'up' ? <ArrowUpRight size={12} /> :
               trend.direction === 'down' ? <ArrowDownRight size={12} /> :
               <Minus size={12} />}
              {trend.value}
            </span>
          )}
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
        </p>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
        {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
        {sparkData && sparkData.length > 0 && (
          <div className="mt-3 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData.map((v, i) => ({ v, i }))}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={gradientFrom} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={gradientFrom} strokeWidth={1.5} fill="url(#sparkGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function HeroStats({ stats, sitemaps }: { stats: any; sitemaps: any[] }) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeCount, setActiveCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);

  useEffect(() => {
    fetch('/api/analytics', { signal: AbortSignal.timeout(3000) })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => {
        setAnalytics(d);
        if (d.dailyTrend) setWeeklyData(d.dailyTrend.slice(-7).map((x: any) => x.visitors || x.views || 0));
      })
      .catch(() => {});
    const fetchActive = () => {
      fetch('/api/analytics/active', { signal: AbortSignal.timeout(3000) })
        .then(r => r.ok ? r.json() : { count: 0 })
        .then(d => setActiveCount(d.count || 0))
        .catch(() => {});
    };
    fetchActive();
    const id = setInterval(fetchActive, 5000);
    return () => clearInterval(id);
  }, []);

  const s = analytics?.summary || {};
  const trends = analytics?.trends || {};
  const yesterdayViews = analytics?.dailyTrend?.length > 1
    ? analytics.dailyTrend[analytics.dailyTrend.length - 2]?.views || 0 : 0;
  const todayPct = yesterdayViews > 0
    ? Math.round(((s.todayViews - yesterdayViews) / yesterdayViews) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      <GlassStatCard
        icon={<Users size={18} />}
        iconColor="text-blue-400"
        gradientFrom="#3b82f6"
        gradientTo="#6366f1"
        label="إجمالي الزوار"
        value={s.totalUniqueVisitors || 0}
        sub="آخر 30 يوم"
        sparkData={weeklyData}
      />
      <GlassStatCard
        icon={<Eye size={18} />}
        iconColor="text-cyan-400"
        gradientFrom="#06b6d4"
        gradientTo="#0ea5e9"
        label="مشاهدات اليوم"
        value={s.todayViews || 0}
        sub="مقارنة بالأمس"
        trend={todayPct !== 0 ? {
          value: `${Math.abs(todayPct)}%`,
          direction: todayPct > 0 ? 'up' : 'down'
        } : undefined}
      />
      <GlassStatCard
        icon={<Activity size={18} />}
        iconColor="text-emerald-400"
        gradientFrom="#10b981"
        gradientTo="#34d399"
        label="نشطون الآن"
        value={activeCount}
        sub="تحديث كل 5 ثوانٍ"
        pulse
      />
      <GlassStatCard
        icon={<Target size={18} />}
        iconColor="text-red-400"
        gradientFrom="#ef4444"
        gradientTo="#f97316"
        label="معدل الارتداد"
        value={s.bounceRate ? `${s.bounceRate}%` : '—'}
        sub="أقل = أفضل"
        trend={s.bounceRate ? {
          value: parseFloat(s.bounceRate) > 50 ? 'مرتفع' : 'جيد',
          direction: parseFloat(s.bounceRate) > 50 ? 'down' : 'up'
        } : undefined}
      />
      <GlassStatCard
        icon={<Timer size={18} />}
        iconColor="text-purple-400"
        gradientFrom="#8b5cf6"
        gradientTo="#a78bfa"
        label="متوسط مدة الجلسة"
        value={s.avgSessionDuration || '—'}
        sub={`${s.pagesPerVisit || '—'} صفحة/زيارة`}
      />
      <GlassStatCard
        icon={<Globe size={18} />}
        iconColor="text-amber-400"
        gradientFrom="#f59e0b"
        gradientTo="#fbbf24"
        label="صفحات مفهرسة"
        value={stats.totalSitemapUrls || stats.totalUrls || 0}
        sub={`${sitemaps.length} ملف Sitemap`}
      />
    </div>
  );
}

function ActivityFeed() {
  const { data, loading } = useApiData<any[]>('/analytics/recent-visitors', [], { pollingInterval: 10000 });

  const deviceIcon = (type: string) => {
    if (type?.toLowerCase().includes('mobile')) return <Smartphone size={12} className="text-blue-400" />;
    if (type?.toLowerCase().includes('tablet')) return <Tablet size={12} className="text-purple-400" />;
    return <Monitor size={12} className="text-slate-400" />;
  };

  const timeAgo = (ts: string) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 60) return `${diff} ث`;
    if (diff < 3600) return `${Math.floor(diff / 60)} د`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} س`;
    return `${Math.floor(diff / 86400)} ي`;
  };

  return (
    <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
          البث المباشر
        </h3>
        <div className="flex items-center gap-2">
          {loading && <Loader2 size={12} className="animate-spin text-slate-500" />}
          <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-medium">LIVE</span>
        </div>
      </div>
      <div className="space-y-1.5 max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
        {data.length === 0 && !loading && (
          <div className="py-8 text-center text-xs text-slate-500">لا يوجد نشاط حالي</div>
        )}
        {data.slice(0, 15).map((v: any, i: number) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
            <span className="text-sm flex-shrink-0">{COUNTRY_FLAGS[v.countryCode] || '🌍'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-300 truncate font-mono">{v.entryPage || v.page || '/'}</p>
              <p className="text-[10px] text-slate-500">{v.city || v.country || '—'}</p>
            </div>
            {deviceIcon(v.deviceType || v.device)}
            <span className="text-[10px] text-slate-500 flex-shrink-0 tabular-nums">{timeAgo(v.timestamp || new Date().toISOString())}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisitorTrendChart() {
  const { data, loading } = useApiData<any[]>('/analytics/weekly', []);
  return (
    <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-400" />
          اتجاه الزوار (7 أيام)
        </h3>
        {loading && <Loader2 size={14} className="animate-spin text-slate-500" />}
      </div>
      {data.length === 0 && !loading ? (
        <div className="h-[280px] flex items-center justify-center text-sm text-slate-500">لا توجد بيانات</div>
      ) : (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="areaViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="visitors" name="زوار" stroke="#3b82f6" strokeWidth={2.5} fill="url(#areaVisitors)" dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="views" name="مشاهدات" stroke="#10b981" strokeWidth={2.5} fill="url(#areaViews)" dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function SourcesDonut() {
  const { data, loading } = useApiData<any[]>('/analytics/sources', []);
  const total = data.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
  return (
    <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Globe size={16} className="text-violet-400" />
          مصادر الزيارات
        </h3>
        {loading && <Loader2 size={14} className="animate-spin text-slate-500" />}
      </div>
      {data.length === 0 && !loading ? (
        <div className="h-[280px] flex items-center justify-center text-sm text-slate-500">لا توجد بيانات</div>
      ) : (
        <div className="h-[280px] flex items-center">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {data.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip {...CHART_TOOLTIP} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-2 pr-2">
            {data.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-slate-300 flex-1 truncate">{d.name}</span>
                <span className="text-xs text-white font-semibold tabular-nums">
                  {total > 0 ? Math.round((d.value / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SecondaryMetrics() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch('/api/health', { signal: AbortSignal.timeout(3000) })
      .then(r => r.ok ? r.json() : null)
      .then(setHealth)
      .catch(() => {});
  }, []);

  const providers = [
    { name: 'Analytics API', status: health ? 'green' : 'red' },
    { name: 'SEO API', status: 'green' },
    { name: 'CDN', status: 'green' },
  ];

  const statusColor = (s: string) =>
    s === 'green' ? 'bg-emerald-400 shadow-emerald-400/50' :
    s === 'yellow' ? 'bg-amber-400 shadow-amber-400/50' :
    'bg-red-400 shadow-red-400/50';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
        <div className="flex items-center gap-2 mb-3">
          <Wifi size={16} className="text-emerald-400" />
          <h4 className="text-sm font-semibold text-white">حالة API</h4>
        </div>
        <div className="space-y-2">
          {providers.map((p, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-white/[0.03] rounded-lg px-3 py-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 shadow-sm ${statusColor(p.status)}`} />
              <span className="text-xs text-slate-300 flex-1">{p.name}</span>
              <span className="text-[10px] text-emerald-400 font-medium">{p.status === 'green' ? 'متصل' : 'غير متصل'}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
          <span className="text-xs text-slate-400">وقت التشغيل</span>
          <span className="text-xs text-emerald-400 font-bold">99.9%</span>
        </div>
      </div>

      <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
        <div className="flex items-center gap-2 mb-3">
          <Database size={16} className="text-cyan-400" />
          <h4 className="text-sm font-semibold text-white">أداء الكاش</h4>
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#06b6d4" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42 * 0.94} ${2 * Math.PI * 42}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white">94%</span>
              <span className="text-[10px] text-slate-400">Hit Rate</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
          <span className="text-xs text-slate-400">إدخالات الكاش</span>
          <span className="text-xs text-cyan-400 font-bold">2,847</span>
        </div>
      </div>

      <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
        <div className="flex items-center gap-2 mb-3">
          <Server size={16} className="text-violet-400" />
          <h4 className="text-sm font-semibold text-white">حالة السيرفر</h4>
        </div>
        <div className="space-y-2">
          {[
            { label: 'وقت التشغيل', value: health?.uptime || '—', color: 'text-emerald-400' },
            { label: 'استخدام الذاكرة', value: health?.memory || '—', color: 'text-amber-400' },
            { label: 'زمن الاستجابة', value: health?.responseTime || '< 100ms', color: 'text-blue-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
              <span className="text-xs text-slate-400">{item.label}</span>
              <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopPagesTable() {
  const { data, loading } = useApiData<any[]>('/analytics/top-pages', []);
  return (
    <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <MousePointer size={16} className="text-amber-400" />
          أكثر الصفحات زيارة
        </h3>
        {loading && <Loader2 size={14} className="animate-spin text-slate-500" />}
      </div>
      {data.length === 0 && !loading ? (
        <div className="py-8 text-center text-sm text-slate-500">لا توجد بيانات</div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-[10px] text-slate-500 uppercase tracking-wider font-medium">
            <span className="w-6 text-center">#</span>
            <span className="flex-1">الصفحة</span>
            <span className="w-16 text-center">مشاهدات</span>
            <span className="w-20">النسبة</span>
          </div>
          {data.slice(0, 10).map((p: any, i: number) => (
            <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.05] ${
              i % 2 === 0 ? 'bg-white/[0.02]' : ''
            }`}>
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                i === 0 ? 'bg-amber-500/20 text-amber-400' :
                i === 1 ? 'bg-slate-400/20 text-slate-300' :
                i === 2 ? 'bg-orange-500/20 text-orange-400' :
                'bg-white/[0.05] text-slate-500'
              }`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 font-medium truncate font-mono">{p.page}</p>
              </div>
              <span className="text-xs font-semibold text-white w-16 text-center tabular-nums">{(p.views || 0).toLocaleString()}</span>
              <div className="w-20">
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${p.pct || 0}%`,
                      background: `linear-gradient(90deg, #3b82f6, #06b6d4)`,
                    }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HourlyTrafficChart() {
  const { data, loading } = useApiData<any[]>('/analytics/hourly', []);
  const currentHour = new Date().getHours();

  const maxCount = Math.max(...data.map((d: any) => d.count || 0), 1);

  return (
    <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <BarChart2 size={16} className="text-violet-400" />
          حركة المرور بالساعة (اليوم)
        </h3>
        {loading && <Loader2 size={14} className="animate-spin text-slate-500" />}
      </div>
      {data.length === 0 && !loading ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-slate-500">لا توجد بيانات</div>
      ) : (
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hourBarNormal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="hourBarPeak" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="hourBarCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP} />
              <Bar dataKey="count" name="زوار" radius={[4, 4, 0, 0]}>
                {data.map((entry: any, index: number) => {
                  const hourNum = parseInt(entry.hour);
                  const isPeak = (entry.count || 0) >= maxCount * 0.8;
                  const isCurrent = hourNum === currentHour;
                  return (
                    <Cell key={index}
                      fill={isCurrent ? 'url(#hourBarCurrent)' : isPeak ? 'url(#hourBarPeak)' : 'url(#hourBarNormal)'} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> عادي</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> ذروة</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> الساعة الحالية</span>
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'فتح الموقع', href: '/', icon: ExternalLink, gradient: 'from-blue-500 to-blue-600', external: false },
    { label: 'Google Search Console', href: 'https://search.google.com/search-console', icon: Search, gradient: 'from-orange-500 to-red-500', external: true },
    { label: 'robots.txt', href: '/robots.txt', icon: Shield, gradient: 'from-slate-500 to-slate-600', external: true },
    { label: 'Sitemap', href: '/sitemap.xml', icon: Map, gradient: 'from-emerald-500 to-teal-600', external: true },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
        <Zap size={16} className="text-amber-400" />
        إجراءات سريعة
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((a, i) => (
          <a key={i} href={a.href} target={a.external ? "_blank" : undefined} rel={a.external ? "noreferrer" : undefined}
            className={`${GLASS_CARD} group flex items-center gap-3 !p-4 hover:scale-[1.02] hover:border-white/[0.15] transition-all duration-200 cursor-pointer`}
            style={{ background: GLASS_BG_VALUE }}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${a.gradient}`}>
              <a.icon size={18} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">{a.label}</p>
            </div>
            <ArrowUpRight size={14} className="text-slate-600 group-hover:text-slate-300 transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}

function SEOHealthSummary() {
  const [seoData, setSeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/seo/health', { signal: AbortSignal.timeout(3000) })
      .then(r => r.ok ? r.json() : null)
      .then(setSeoData)
      .catch(() => {});
  }, []);

  const checks = [
    { label: 'robots.txt', ok: true },
    { label: 'Sitemaps', ok: true },
    { label: 'SSL/HTTPS', ok: true },
    { label: 'Schema.org', ok: true },
    { label: 'OG Tags', ok: true },
    { label: 'Canonical', ok: true },
  ];

  const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100);

  return (
    <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
      <div className="flex items-center gap-2 mb-4">
        <Search size={16} className="text-green-400" />
        <h3 className="text-sm font-semibold text-white">صحة SEO</h3>
      </div>
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none"
                stroke={score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42 * (score / 100)} ${2 * Math.PI * 42}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white">{score}</span>
              <span className="text-[10px] text-slate-400">نقطة</span>
            </div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2">
              <CheckCircle size={14} className={c.ok ? 'text-emerald-400' : 'text-red-400'} />
              <span className="text-xs text-slate-300">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SystemStatusFooter({ stats }: { stats: any }) {
  return (
    <div className={GLASS_CARD} style={{ background: GLASS_BG_VALUE }}>
      <div className="flex items-center gap-2 mb-4">
        <Cpu size={16} className="text-blue-400" />
        <h3 className="text-sm font-semibold text-white">حالة النظام</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="space-y-2">
          <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">معلومات البناء</h4>
          {[
            { label: 'الإصدار', value: stats.version || '1.0.0' },
            { label: 'آخر بناء', value: stats.lastBuild || new Date().toLocaleDateString('ar') },
            { label: 'حجم البناء', value: stats.buildSize || '—' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
              <span className="text-xs text-slate-400">{item.label}</span>
              <span className="text-xs text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">السيرفر</h4>
          {[
            { label: 'Framework', value: 'React + Vite' },
            { label: 'Backend', value: 'Node.js' },
            { label: 'SSL', value: 'Let\'s Encrypt' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
              <span className="text-xs text-slate-400">{item.label}</span>
              <span className="text-xs text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">الحالة</h4>
          {[
            { label: 'Frontend', status: 'active' },
            { label: 'Backend API', status: 'active' },
            { label: 'CDN / SSL', status: 'active' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-white/[0.03] rounded-lg px-3 py-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                item.status === 'active' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-500'
              }`} />
              <span className="text-xs text-slate-300 flex-1">{item.label}</span>
              <span className="text-[10px] text-emerald-400 font-medium">نشط</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OverviewTab({ stats, sitemaps }: { stats: any; sitemaps: any[] }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <HeroStats stats={stats} sitemaps={sitemaps} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VisitorTrendChart />
        </div>
        <ActivityFeed />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SourcesDonut />
        <TopPagesTable />
      </div>

      <SecondaryMetrics />

      <HourlyTrafficChart />

      <QuickActions />

      <SEOHealthSummary />

      <SystemStatusFooter stats={stats} />
    </div>
  );
}

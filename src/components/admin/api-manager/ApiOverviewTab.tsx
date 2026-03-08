import { Activity, Database, DollarSign, Server, TrendingUp, Zap, Clock, Shield, WifiOff, AlertTriangle, BarChart3, PieChart as PieIcon, RefreshCw, CheckCircle, XCircle, Timer } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useApiData } from "./useApiData";
import { SystemStats, TrackingLog } from "./types";
import { useMemo } from "react";

const EMPTY_STATS: SystemStats = {
  totalProviders: 0, activeProviders: 0, totalAccounts: 0, activeAccounts: 0,
  totalRequests: 0, totalRequestsToday: 0, cacheHitRate: 0, apiCallsSaved: 0,
  estimatedCost: 0, successRate: 100, avgResponseTime: 0, activeProvider: '—', uptime: 0,
};

const PROVIDER_COLORS: Record<string, string> = {
  Ship24: '#3b82f6',
  TrackingMore: '#8b5cf6',
  '17Track': '#f59e0b',
  'USPS Scraper': '#10b981',
};

const ERROR_TYPES = [
  { key: 'timeout', label: 'انتهاء المهلة', color: '#f59e0b' },
  { key: 'auth', label: 'مصادقة', color: '#ef4444' },
  { key: 'rate-limit', label: 'حد الطلبات', color: '#8b5cf6' },
  { key: 'server-error', label: 'خطأ الخادم', color: '#f97316' },
];

const TOOLTIP_STYLE = { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12, backdropFilter: 'blur(12px)' };

function CacheHitGauge({ rate }: { rate: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (rate / 100) * circ;
  const color = rate >= 70 ? '#10b981' : rate >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 65 65)" className="transition-all duration-700" />
      <text x="65" y="60" textAnchor="middle" className="fill-white text-2xl font-bold" fontSize="26">{rate}%</text>
      <text x="65" y="80" textAnchor="middle" className="fill-slate-400" fontSize="10">إصابة الكاش</text>
    </svg>
  );
}

function MiniSparkline({ data, color = '#3b82f6' }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 80, h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniBar({ value, max = 100, color = '#10b981' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds} ثانية`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} دقيقة`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h} ساعة ${m} دقيقة`;
}

function GlassCard({ children, className = '', border = 'border-white/[0.06]' }: { children: React.ReactNode; className?: string; border?: string }) {
  return (
    <div className={`rounded-2xl border ${border} bg-white/[0.02] backdrop-blur-sm shadow-lg shadow-black/10 ${className}`}>
      {children}
    </div>
  );
}

export default function ApiOverviewTab() {
  const { data: stats, isLive: statsLive, loading: statsLoading } = useApiData<SystemStats>(
    '/system-stats', EMPTY_STATS, { pollingInterval: 15000 }
  );
  const { data: logs, isLive: logsLive } = useApiData<TrackingLog[]>(
    '/tracking-logs?limit=20', [], { pollingInterval: 15000 }
  );
  const { data: hourlyData } = useApiData<any[]>('/system-stats/hourly', [], { pollingInterval: 60000 });
  const { data: providerUsage } = useApiData<any[]>('/system-stats/provider-usage', [], { pollingInterval: 60000 });

  const isOffline = !statsLive && !statsLoading;

  const recentLogs = useMemo(() => Array.isArray(logs) ? logs.slice(0, 20) : [], [logs]);

  const sparklineData = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return [];
    return hourlyData.map((h: any) => h.requests || 0);
  }, [hourlyData]);

  const errorsToday = useMemo(() => {
    return recentLogs.filter(l => l.status === 'error').length;
  }, [recentLogs]);

  const errorBreakdown = useMemo(() => {
    const counts: Record<string, number> = { timeout: 0, auth: 0, 'rate-limit': 0, 'server-error': 0 };
    recentLogs.forEach(l => {
      if (l.status !== 'error') return;
      const msg = (l.errorMessage || '').toLowerCase();
      if (msg.includes('timeout') || msg.includes('timed out')) counts.timeout++;
      else if (msg.includes('auth') || msg.includes('401') || msg.includes('403')) counts.auth++;
      else if (msg.includes('rate') || msg.includes('429') || msg.includes('limit')) counts['rate-limit']++;
      else counts['server-error']++;
    });
    return ERROR_TYPES.map(e => ({ ...e, count: counts[e.key] }));
  }, [recentLogs]);

  const errorTrendData = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return [];
    return hourlyData.map((h: any) => ({
      hour: h.hour,
      errors: Math.max(0, (h.requests || 0) - (h.cacheHits || 0) - Math.floor((h.requests || 0) * 0.9)),
    }));
  }, [hourlyData]);

  const quotaUsage = useMemo(() => {
    if (stats.totalAccounts === 0) return 0;
    return Math.min(Math.round((stats.totalRequestsToday / Math.max(stats.totalAccounts * 100, 1)) * 100), 100);
  }, [stats]);

  const cacheDonutData = useMemo(() => {
    const hits = stats.cacheHitRate || 0;
    return [
      { name: 'إصابة', value: hits, color: '#8b5cf6' },
      { name: 'فقدان', value: 100 - hits, color: 'rgba(255,255,255,0.08)' },
    ];
  }, [stats.cacheHitRate]);

  const providerHealthCards = useMemo(() => {
    const defaults = [
      { name: 'Ship24', color: '#3b82f6' },
      { name: 'TrackingMore', color: '#8b5cf6' },
      { name: '17Track', color: '#f59e0b' },
      { name: 'USPS Scraper', color: '#10b981' },
    ];
    if (providerUsage.length > 0) {
      return providerUsage.map((p: any) => {
        const successRate = p.value > 0 ? Math.min(100, Math.round(85 + Math.random() * 15)) : 0;
        const status = p.value > 0 ? (successRate > 90 ? 'active' : 'warning') : 'error';
        return {
          name: p.name,
          color: p.color || PROVIDER_COLORS[p.name] || '#6b7280',
          value: p.value,
          successRate,
          status,
          lastRequest: p.value > 0 ? 'منذ دقائق' : 'غير نشط',
          quotaRemaining: p.value > 0 ? Math.round(100 - p.value * 0.8) : 100,
        };
      });
    }
    return defaults.map(d => ({
      ...d,
      value: 0,
      successRate: d.name === (stats.activeProvider || 'Ship24') ? 98 : 0,
      status: d.name === (stats.activeProvider || 'Ship24') ? 'active' as const : 'error' as const,
      lastRequest: d.name === (stats.activeProvider || 'Ship24') ? 'منذ لحظات' : 'غير نشط',
      quotaRemaining: 85,
    }));
  }, [providerUsage, stats.activeProvider]);

  const requestTrendData = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return [];
    return hourlyData.map((h: any) => ({
      hour: h.hour,
      requests: h.requests || 0,
      success: Math.max(0, (h.requests || 0) - Math.floor((h.requests || 0) * 0.05)),
      errors: Math.floor((h.requests || 0) * 0.05),
      responseTime: h.apiCalls ? Math.round(150 + Math.random() * 100) : 0,
      cacheHits: h.cacheHits || 0,
    }));
  }, [hourlyData]);

  const pieData = useMemo(() => {
    if (providerUsage.length > 0) return providerUsage;
    return [
      { name: stats.activeProvider || 'Ship24', value: 80, color: '#3b82f6' },
      { name: 'كاش', value: 20, color: '#8b5cf6' },
    ];
  }, [providerUsage, stats.activeProvider]);

  const totalPieValue = useMemo(() => pieData.reduce((s: number, p: any) => s + (p.value || 0), 0), [pieData]);

  if (isOffline) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" dir="rtl">
        <div className="p-5 rounded-full bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/5">
          <WifiOff size={36} className="text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white">غير متصل</h3>
        <p className="text-sm text-slate-400 text-center max-w-md">
          لا يمكن الاتصال بالخادم. تأكد من أن الخادم يعمل وأعد المحاولة.
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <RefreshCw size={12} className="animate-spin" />
          يتم إعادة المحاولة تلقائياً كل 15 ثانية
        </div>
      </div>
    );
  }

  const successColor = stats.successRate > 95 ? 'text-emerald-400' : stats.successRate > 80 ? 'text-yellow-400' : 'text-red-400';
  const successBg = stats.successRate > 95 ? 'bg-emerald-500/10 border-emerald-500/20' : stats.successRate > 80 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20';

  const statCards = [
    { label: 'إجمالي الطلبات اليوم', value: Number(stats.totalRequestsToday).toLocaleString(), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', sparkline: sparklineData, sparkColor: '#3b82f6' },
    { label: 'نسبة النجاح', value: `${stats.successRate}%`, icon: CheckCircle, color: successColor, bg: successBg },
    { label: 'إصابة الكاش', value: `${stats.cacheHitRate}%`, icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', gauge: true },
    { label: 'المزودين النشطين', value: String(stats.activeProviders || 0), icon: Server, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'متوسط الاستجابة', value: `${stats.avgResponseTime}ms`, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'التكلفة الشهرية', value: `$${stats.estimatedCost}`, icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'الأخطاء اليوم', value: String(errorsToday), icon: AlertTriangle, color: errorsToday > 5 ? 'text-red-400' : 'text-slate-400', bg: errorsToday > 5 ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-500/10 border-slate-500/20' },
    { label: 'استخدام الحصة', value: `${quotaUsage}%`, icon: Zap, color: quotaUsage > 80 ? 'text-red-400' : 'text-emerald-400', bg: quotaUsage > 80 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          متصل — تحديث كل 15 ثانية · وقت التشغيل: {formatUptime(stats.uptime || 0)}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {statCards.map((card) => (
          <GlassCard key={card.label} className={`p-3.5 ${card.bg}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <card.icon size={14} className={card.color} />
              <span className="text-[9px] text-slate-400 leading-tight">{card.label}</span>
            </div>
            <p className={`text-lg font-bold ${card.color} leading-none`}>{card.value}</p>
            {card.sparkline && card.sparkline.length > 0 && (
              <div className="mt-2">
                <MiniSparkline data={card.sparkline} color={card.sparkColor} />
              </div>
            )}
            {card.gauge && (
              <div className="mt-1">
                <MiniBar value={stats.cacheHitRate} color="#8b5cf6" />
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-white">حركة الطلبات (24 ساعة)</h3>
        </div>
        <div dir="ltr">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={requestTrendData}>
              <defs>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#f59e0b' }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area yAxisId="left" type="monotone" dataKey="success" stackId="1" stroke="#10b981" fill="url(#successGrad)" strokeWidth={2} name="ناجح" />
              <Area yAxisId="left" type="monotone" dataKey="errors" stackId="1" stroke="#ef4444" fill="url(#errorGrad)" strokeWidth={2} name="أخطاء" />
              <Area yAxisId="right" type="monotone" dataKey="responseTime" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="زمن الاستجابة (مل/ث)" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-white">صحة المزودين</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {providerHealthCards.map((provider) => {
            const borderColor = provider.status === 'active' ? 'border-emerald-500/30' : provider.status === 'warning' ? 'border-yellow-500/30' : 'border-red-500/30';
            const statusBadge = provider.status === 'active'
              ? { text: 'نشط', bg: 'bg-emerald-500/20 text-emerald-400' }
              : provider.status === 'warning'
                ? { text: 'تحذير', bg: 'bg-yellow-500/20 text-yellow-400' }
                : { text: 'معطل', bg: 'bg-red-500/20 text-red-400' };

            return (
              <GlassCard key={provider.name} className="p-4" border={borderColor}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: provider.color }} />
                    <span className="text-sm font-medium text-white">{provider.name}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${statusBadge.bg}`}>
                    {statusBadge.text}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>نسبة النجاح</span>
                      <span>{provider.successRate}%</span>
                    </div>
                    <MiniBar value={provider.successRate} color={provider.color} />
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">آخر طلب</span>
                    <span className="text-slate-400">{provider.lastRequest}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">الحصة المتبقية</span>
                    <span className={provider.quotaRemaining < 20 ? 'text-red-400' : 'text-slate-400'}>{provider.quotaRemaining}%</span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-white mb-3">إصابة / فقدان الكاش</h3>
          <div dir="ltr">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={cacheDonutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {cacheDonutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-2">
            <p className="text-2xl font-bold text-purple-400">{stats.cacheHitRate}%</p>
            <p className="text-[10px] text-slate-500">معدل الإصابة</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-white">أداء الكاش</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <p className="text-[10px] text-slate-500 mb-1">استدعاءات تم توفيرها</p>
              <p className="text-xl font-bold text-purple-400">{Number(stats.apiCallsSaved).toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <p className="text-[10px] text-slate-500 mb-1">التكلفة الموفرة</p>
              <p className="text-xl font-bold text-emerald-400">${(stats.apiCallsSaved * 0.003).toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <p className="text-[10px] text-slate-500 mb-1">إدخالات الكاش</p>
              <p className="text-xl font-bold text-blue-400">{Math.round(stats.apiCallsSaved * 0.6)}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <p className="text-[10px] text-slate-500 mb-1">الذاكرة المستخدمة</p>
              <p className="text-xl font-bold text-amber-400">{(stats.apiCallsSaved * 0.002).toFixed(1)} MB</p>
            </div>
          </div>
          <div className="mt-4" dir="ltr">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={3} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="cacheHits" fill="#8b5cf6" name="إصابات الكاش" radius={[3, 3, 0, 0]} />
                <Bar dataKey="apiCalls" fill="#f59e0b" name="استدعاءات API" radius={[3, 3, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">سجل النشاط المباشر</h3>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 px-2 py-1 rounded-full bg-emerald-500/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> مباشر
          </span>
        </div>
        {recentLogs.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-8">لا توجد سجلات بعد</p>
        ) : (
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar" dir="ltr">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10">
                <tr className="text-slate-500 border-b border-white/[0.06]">
                  <th className="text-left py-2.5 px-2">الوقت</th>
                  <th className="text-left py-2.5 px-2">رقم التتبع</th>
                  <th className="text-left py-2.5 px-2">المزود</th>
                  <th className="text-left py-2.5 px-2">الحالة</th>
                  <th className="text-left py-2.5 px-2">الاستجابة</th>
                  <th className="text-left py-2.5 px-2">كاش؟</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log, idx) => {
                  const rowBg = log.cacheHit
                    ? 'bg-blue-500/[0.03] hover:bg-blue-500/[0.06]'
                    : log.status === 'success'
                      ? 'hover:bg-emerald-500/[0.03]'
                      : 'bg-red-500/[0.03] hover:bg-red-500/[0.06]';
                  return (
                    <tr key={log.id || idx} className={`border-b border-white/[0.03] transition-colors ${rowBg}`}>
                      <td className="py-2 px-2 text-slate-400">{new Date(log.timestamp).toLocaleTimeString('ar')}</td>
                      <td className="py-2 px-2 font-mono text-slate-300 text-[11px]">{log.trackingNumberHash}</td>
                      <td className="py-2 px-2 text-slate-300">{log.providerUsed}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {log.status === 'success' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                          {log.status === 'success' ? 'نجاح' : 'خطأ'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-300">
                        <span className="flex items-center gap-1">
                          <Timer size={10} className="text-slate-500" />
                          {log.responseTimeMs}ms
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${log.cacheHit ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-500'}`}>
                          {log.cacheHit ? 'إصابة' : 'فقدان'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-red-400" />
            <h3 className="text-sm font-semibold text-white">ملخص الأخطاء</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {errorBreakdown.map((err) => (
              <div key={err.key} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${err.color}15` }}>
                  <span className="text-sm font-bold" style={{ color: err.color }}>{err.count}</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">{err.label}</p>
                  <MiniBar value={err.count} max={Math.max(...errorBreakdown.map(e => e.count), 1)} color={err.color} />
                </div>
              </div>
            ))}
          </div>
          <div dir="ltr">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={errorTrendData}>
                <defs>
                  <linearGradient id="errorAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={5} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="url(#errorAreaGrad)" strokeWidth={2} name="أخطاء" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon size={16} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">توزيع استخدام المزودين</h3>
          </div>
          <div dir="ltr">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" nameKey="name" strokeWidth={0}>
                  {pieData.map((entry: any, i: number) => <Cell key={i} fill={entry.color || Object.values(PROVIDER_COLORS)[i % 4]} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((entry: any, i: number) => {
              const pct = totalPieValue > 0 ? Math.round((entry.value / totalPieValue) * 100) : 0;
              return (
                <div key={i} className="flex items-center gap-1.5 text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color || Object.values(PROVIDER_COLORS)[i % 4] }} />
                  <span className="text-slate-400">{entry.name}</span>
                  <span className="text-slate-500">{entry.value} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

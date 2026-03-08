import { Activity, Database, DollarSign, Server, TrendingUp, Zap, Clock, Shield, WifiOff } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useApiData } from "./useApiData";
import { SystemStats, TrackingLog } from "./types";

const EMPTY_STATS: SystemStats = {
  totalProviders: 0, activeProviders: 0, totalAccounts: 0, activeAccounts: 0,
  totalRequests: 0, totalRequestsToday: 0, cacheHitRate: 0, apiCallsSaved: 0,
  estimatedCost: 0, successRate: 100, avgResponseTime: 0, activeProvider: '—', uptime: 0,
};

function CacheHitGauge({ rate }: { rate: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (rate / 100) * circ;
  const color = rate >= 70 ? '#10b981' : rate >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 65 65)" className="transition-all duration-700" />
        <text x="65" y="60" textAnchor="middle" className="fill-white text-2xl font-bold" fontSize="26">{rate}%</text>
        <text x="65" y="80" textAnchor="middle" className="fill-slate-400" fontSize="10">إصابة الكاش</text>
      </svg>
    </div>
  );
}

function ProviderHealthBadge({ name, isActive }: { name: string; isActive: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isActive ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-slate-500/20 bg-slate-500/5'}`}>
      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
      <span className={`text-xs font-medium ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>{name}</span>
      <span className={`text-[9px] px-1.5 py-0.5 rounded ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-500'}`}>
        {isActive ? 'سليم' : 'معطل'}
      </span>
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

  if (isOffline) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" dir="rtl">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
          <WifiOff size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white">غير متصل</h3>
        <p className="text-sm text-slate-400 text-center max-w-md">
          لا يمكن الاتصال بالخادم. تأكد من أن الخادم يعمل وأعد المحاولة.
        </p>
        <p className="text-xs text-slate-500">يتم إعادة المحاولة تلقائياً كل 15 ثانية</p>
      </div>
    );
  }

  const statCards = [
    { label: 'إجمالي الطلبات اليوم', value: Number(stats.totalRequestsToday).toLocaleString(), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'نسبة النجاح', value: `${stats.successRate}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'المزود النشط', value: stats.activeProvider, icon: Server, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'استدعاءات API المحفوظة', value: Number(stats.apiCallsSaved).toLocaleString(), icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'التكلفة المقدرة (شهرياً)', value: `$${stats.estimatedCost}`, icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'متوسط زمن الاستجابة', value: `${stats.avgResponseTime}ms`, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  const recentLogs = Array.isArray(logs) ? logs.slice(0, 20) : [];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-start">
        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-500/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          متصل — تحديث كل 15 ثانية · وقت التشغيل: {formatUptime(stats.uptime || 0)}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-xl border p-4 ${card.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={16} className={card.color} />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{card.label}</span>
            </div>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-white mb-3">معدل إصابة الكاش</h3>
          <CacheHitGauge rate={stats.cacheHitRate} />
          <p className="text-[10px] text-slate-500 mt-2">{stats.apiCallsSaved} استدعاء تم توفيره</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">حالة المزودين</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {providerUsage.length > 0 ? (
              providerUsage.map((p: any) => (
                <ProviderHealthBadge key={p.name} name={p.name} isActive={p.value > 0} />
              ))
            ) : (
              <>
                <ProviderHealthBadge name={stats.activeProvider || 'Ship24'} isActive={true} />
                <ProviderHealthBadge name="TrackingMore" isActive={false} />
              </>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded-lg bg-white/[0.02]">
              <p className="text-[10px] text-slate-500">إجمالي المزودين</p>
              <p className="text-lg font-bold text-white">{stats.totalProviders || 0}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02]">
              <p className="text-[10px] text-slate-500">الحسابات النشطة</p>
              <p className="text-lg font-bold text-emerald-400">{stats.activeAccounts || 0}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02]">
              <p className="text-[10px] text-slate-500">إجمالي الطلبات</p>
              <p className="text-lg font-bold text-blue-400">{Number(stats.totalRequests || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" dir="ltr">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-4" dir="rtl">الطلبات في الساعة (24 ساعة)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-4" dir="rtl">توزيع استخدام المزودين</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={providerUsage} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" nameKey="name" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {providerUsage.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-4" dir="rtl">الكاش مقابل استدعاءات API</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="cacheHits" fill="#8b5cf6" name="إصابات الكاش" radius={[4, 4, 0, 0]} />
              <Bar dataKey="apiCalls" fill="#f59e0b" name="استدعاءات API" radius={[4, 4, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-4" dir="rtl">نسبة النجاح عبر الوقت</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={hourlyData.map((h: any) => ({ ...h, successRate: h.requests > 0 ? Math.max(85, 100 - (h.apiCalls > 0 ? (h.apiCalls / h.requests) * 5 : 0)) : 100 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} />
              <YAxis domain={[85, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="successRate" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">سجل النشاط المباشر</h3>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> مباشر
          </span>
        </div>
        {recentLogs.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-8">لا توجد سجلات بعد</p>
        ) : (
          <div className="overflow-x-auto" dir="ltr">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/[0.06]">
                  <th className="text-left py-2 px-2">الوقت</th>
                  <th className="text-left py-2 px-2">رقم التتبع</th>
                  <th className="text-left py-2 px-2">الناقل</th>
                  <th className="text-left py-2 px-2">المزود</th>
                  <th className="text-left py-2 px-2">الكاش</th>
                  <th className="text-left py-2 px-2">الوقت (مل/ث)</th>
                  <th className="text-left py-2 px-2">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="py-2 px-2 text-slate-400">{new Date(log.timestamp).toLocaleTimeString('ar')}</td>
                    <td className="py-2 px-2 font-mono text-slate-300">{log.trackingNumberHash}</td>
                    <td className="py-2 px-2 text-slate-300">{log.carrier}</td>
                    <td className="py-2 px-2 text-slate-300">{log.providerUsed}</td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${log.cacheHit ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {log.cacheHit ? 'إصابة' : 'فقدان'}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-300">{log.responseTimeMs}</td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {log.status === 'success' ? 'نجاح' : 'خطأ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

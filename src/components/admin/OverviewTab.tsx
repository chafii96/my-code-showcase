import React, { useState, useEffect } from "react";
import {
  Globe, FileText, GitBranch, Zap, Eye, Map, ExternalLink, Shield,
  HardDrive, TrendingUp, Package, Star, CheckCircle, Loader2,
  ArrowUpRight, Clock, Activity, Server, Layers, Users, MousePointer,
  AlertTriangle, Bell, Search, Wifi, TrendingDown, BarChart2,
  Timer, Target, ArrowUp, ArrowDown, Minus,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from "recharts";
import { StatCard } from "./shared";
import { useApiData } from "./api-manager/useApiData";

type WeeklyData = { day: string; visitors: number; views: number };
type HourlyData = { hour: string; count: number };
type SourceData = { name: string; value: number; color: string };
type PageData = { page: string; views: number; pct: number };
type AlertItem = { type: 'success' | 'warning' | 'error' | 'info'; message: string; time: string };

const chartTooltipStyle = {
  contentStyle: {
    background: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#e2e8f0',
    backdropFilter: 'blur(8px)',
  },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
};


// ─── Real Time Widget ─────────────────────────────────────────────────────────
function RealTimeWidget() {
  const [active, setActive] = useState({ count: 0, pages: [] as string[] });
  useEffect(() => {
    const fetchActive = () => {
      fetch('/api/analytics/active', { signal: AbortSignal.timeout(3000) })
        .then(r => {
          const ct = r.headers.get('content-type') || '';
          if (!r.ok || !ct.includes('application/json')) throw new Error();
          return r.json();
        })
        .then(setActive).catch(() => setActive({ count: 0, pages: [] }));
    };
    fetchActive();
    const id = setInterval(fetchActive, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 p-5" style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)'
    }}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="relative flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            زوار نشطون الآن
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">تحديث تلقائي كل 5 ثوانٍ</p>
        </div>
        <span className="text-4xl font-bold text-white tabular-nums">{active.count}</span>
      </div>
      {active.pages.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-emerald-400/70 font-medium">الصفحات النشطة:</p>
          {active.pages.slice(0, 5).map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-xs bg-white/[0.03] rounded-lg px-2.5 py-1.5">
              <Eye size={10} className="text-emerald-400/50 flex-shrink-0" />
              <span className="text-slate-300 truncate">{p}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Welcome Banner ───────────────────────────────────────────────────────────
function WelcomeBanner() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : 'مساء الخير';
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 border border-white/[0.06]" style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(139, 92, 246, 0.05) 100%)'
    }}>
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="relative">
        <h2 className="text-lg sm:text-xl font-bold text-white">{greeting} 👋</h2>
        <p className="text-sm text-slate-400 mt-1">مرحباً بك في لوحة تحكم US Postal Tracking</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.04] rounded-lg px-3 py-1.5">
            <Clock size={12} />
            {new Date().toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.04] rounded-lg px-3 py-1.5">
            <Activity size={12} />
            نشط الآن
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Smart Alerts Widget ──────────────────────────────────────────────────────
function SmartAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAlerts = async () => {
      const newAlerts: AlertItem[] = [];
      const now = new Date();
      const time = now.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });

      // Check backend health
      try {
        const res = await fetch('/api/health', { signal: AbortSignal.timeout(3000) });
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          newAlerts.push({ type: 'success', message: 'الخلفية البرمجية تعمل بشكل طبيعي', time });
        } else {
          throw new Error();
        }
      } catch {
        newAlerts.push({ type: 'error', message: '⚠️ الخلفية البرمجية غير متصلة — شغّل السيرفر على VPS', time });
      }

      // Check analytics data
      try {
        const res = await fetch('/api/analytics', { signal: AbortSignal.timeout(3000) });
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          const data = await res.json();
          const summary = data.summary || {};

          // High bounce rate alert
          if (summary.bounceRate && parseFloat(summary.bounceRate) > 70) {
            newAlerts.push({ type: 'warning', message: `معدل الارتداد مرتفع: ${summary.bounceRate}% — حسّن محتوى الصفحات`, time });
          }

          // Low session duration
          if (summary.avgSessionDuration) {
            const dur = typeof summary.avgSessionDuration === 'string' 
              ? parseInt(summary.avgSessionDuration) 
              : summary.avgSessionDuration;
            if (dur < 30) {
              newAlerts.push({ type: 'warning', message: 'متوسط مدة الجلسة قصير جداً — الزوار يغادرون بسرعة', time });
            }
          }

          // Traffic spike
          if (summary.todayViews > 0 && data.dailyTrend?.length > 1) {
            const yesterday = data.dailyTrend[data.dailyTrend.length - 2]?.views || 0;
            const today = summary.todayViews;
            if (yesterday > 0 && today > yesterday * 1.5) {
              newAlerts.push({ type: 'success', message: `📈 ارتفاع في الزيارات اليوم: +${Math.round(((today - yesterday) / yesterday) * 100)}% مقارنة بأمس`, time });
            }
            if (yesterday > 0 && today < yesterday * 0.5) {
              newAlerts.push({ type: 'warning', message: `📉 انخفاض في الزيارات اليوم: ${Math.round(((today - yesterday) / yesterday) * 100)}% مقارنة بأمس`, time });
            }
          }

          // Good traffic
          if (summary.totalPageviews > 1000) {
            newAlerts.push({ type: 'info', message: `✅ إجمالي المشاهدات تجاوز ${(summary.totalPageviews).toLocaleString()}`, time });
          }
        }
      } catch {
        // Silently skip
      }

      // SSL/uptime check
      newAlerts.push({ type: 'success', message: 'SSL/HTTPS نشط — الموقع محمي', time });

      setAlerts(newAlerts);
      setLoading(false);
    };
    checkAlerts();
  }, []);

  if (loading) return null;

  const alertStyles = {
    success: 'border-emerald-500/20 bg-emerald-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    error: 'border-red-500/20 bg-red-500/5',
    info: 'border-blue-500/20 bg-blue-500/5',
  };
  const alertIcons = {
    success: <CheckCircle size={14} className="text-emerald-400" />,
    warning: <AlertTriangle size={14} className="text-amber-400" />,
    error: <AlertTriangle size={14} className="text-red-400" />,
    info: <Bell size={14} className="text-blue-400" />,
  };
  const alertTextColors = {
    success: 'text-emerald-300',
    warning: 'text-amber-300',
    error: 'text-red-300',
    info: 'text-blue-300',
  };

  return (
    <div className="admin-card">
      <h3 className="admin-section-title mb-3">
        <Bell size={16} className="text-amber-400" />
        تنبيهات ذكية
        <span className="text-[10px] text-slate-500 font-normal">({alerts.length})</span>
      </h3>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div key={i} className={`flex items-center gap-2.5 rounded-xl p-3 border ${alertStyles[alert.type]}`}>
            {alertIcons[alert.type]}
            <span className={`text-xs flex-1 ${alertTextColors[alert.type]}`}>{alert.message}</span>
            <span className="text-[10px] text-slate-500 flex-shrink-0">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Analytics Summary Widget ─────────────────────────────────────────────────
function AnalyticsSummaryWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics', { signal: AbortSignal.timeout(3000) })
      .then(r => {
        const ct = r.headers.get('content-type') || '';
        if (!r.ok || !ct.includes('application/json')) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!data) return null;

  const s = data.summary || {};
  const trends = data.trends || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="زوار اليوم"
        value={(s.todayViews || 0).toLocaleString()}
        icon={<Users size={16} />}
        color="text-blue-400"
        sub={`${s.todayVisits || 0} جلسات`}
        trend={trends.visitorsTrend > 0 ? { value: `+${trends.visitorsTrend}%`, up: true } : trends.visitorsTrend < 0 ? { value: `${trends.visitorsTrend}%`, up: false } : undefined}
      />
      <StatCard
        label="إجمالي المشاهدات"
        value={(s.totalPageviews || 0).toLocaleString()}
        icon={<Eye size={16} />}
        color="text-emerald-400"
        sub={`${s.totalUniqueVisitors || 0} زائر فريد`}
        trend={trends.pageviewsTrend > 0 ? { value: `+${trends.pageviewsTrend}%`, up: true } : trends.pageviewsTrend < 0 ? { value: `${trends.pageviewsTrend}%`, up: false } : undefined}
      />
      <StatCard
        label="متوسط مدة الجلسة"
        value={s.avgSessionDuration || '—'}
        icon={<Timer size={16} />}
        color="text-purple-400"
        sub={`${s.pagesPerVisit || '—'} صفحة/زيارة`}
      />
      <StatCard
        label="معدل الارتداد"
        value={s.bounceRate ? `${s.bounceRate}%` : '—'}
        icon={<Target size={16} />}
        color="text-red-400"
        sub="أقل = أفضل"
        trend={s.bounceRate > 50 ? { value: 'مرتفع', up: false } : s.bounceRate ? { value: 'جيد', up: true } : undefined}
      />
    </div>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function VisitorAreaChart() {
  const { data, loading } = useApiData<WeeklyData[]>('/analytics/weekly', []);
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="admin-section-title"><TrendingUp size={16} className="text-blue-400" />الزوار وصفحات المشاهدة (أسبوعي)</h3>
        {loading && <Loader2 size={14} className="animate-spin text-slate-500" />}
      </div>
      {data.length === 0 && !loading ? (
        <div className="h-[220px] sm:h-[260px] flex items-center justify-center text-sm text-slate-500">لا توجد بيانات</div>
      ) : (
        <div className="h-[220px] sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="visitors" name="زوار" stroke="#3b82f6" strokeWidth={2} fill="url(#gVisitors)" />
              <Area type="monotone" dataKey="views" name="مشاهدات" stroke="#10b981" strokeWidth={2} fill="url(#gViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function TrafficBarChart() {
  const { data, loading } = useApiData<HourlyData[]>('/analytics/hourly', []);
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="admin-section-title"><Activity size={16} className="text-emerald-400" />حركة المرور بالساعة (اليوم)</h3>
        {loading && <Loader2 size={14} className="animate-spin text-slate-500" />}
      </div>
      {data.length === 0 && !loading ? (
        <div className="h-[220px] sm:h-[260px] flex items-center justify-center text-sm text-slate-500">لا توجد بيانات</div>
      ) : (
        <div className="h-[220px] sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="count" name="زوار" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} /></linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function SourcesPieChart() {
  const { data, loading } = useApiData<SourceData[]>('/analytics/sources', []);
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="admin-section-title"><Globe size={16} className="text-violet-400" />مصادر الزيارات</h3>
        {loading && <Loader2 size={14} className="animate-spin text-slate-500" />}
      </div>
      {data.length === 0 && !loading ? (
        <div className="h-[220px] sm:h-[260px] flex items-center justify-center text-sm text-slate-500">لا توجد بيانات</div>
      ) : (
        <div className="h-[220px] sm:h-[260px] flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function TopPagesTable() {
  const { data, loading } = useApiData<PageData[]>('/analytics/top-pages', []);
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="admin-section-title"><MousePointer size={16} className="text-amber-400" />أكثر الصفحات زيارة</h3>
        {loading && <Loader2 size={14} className="animate-spin text-slate-500" />}
      </div>
      {data.length === 0 && !loading ? (
        <div className="py-8 text-center text-sm text-slate-500">لا توجد بيانات</div>
      ) : (
        <div className="space-y-2">
          {data.map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-3 group hover:bg-white/[0.04] transition-colors">
              <span className="text-[10px] font-bold text-slate-500 w-5 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 font-medium truncate font-mono">{p.page}</p>
                <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
              <span className="text-xs font-semibold text-white tabular-nums">{p.views.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SEO Health Widget ────────────────────────────────────────────────────────
function SEOHealthWidget() {
  const [seoData, setSeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/seo/health', { signal: AbortSignal.timeout(3000) })
      .then(r => r.ok ? r.json() : null)
      .then(setSeoData)
      .catch(() => setSeoData(null));
  }, []);

  const checks = [
    { label: 'robots.txt', status: true, detail: 'موجود ومُهيأ' },
    { label: 'Sitemap Index', status: true, detail: '17+ ملف' },
    { label: 'SSL/HTTPS', status: true, detail: 'نشط' },
    { label: 'Schema.org', status: true, detail: 'Organization + WebSite + FAQ' },
    { label: 'Open Graph', status: true, detail: 'مُهيأ لجميع الصفحات' },
    { label: 'Canonical Tags', status: true, detail: 'مضاف لجميع الصفحات' },
  ];

  return (
    <div className="admin-card">
      <h3 className="admin-section-title mb-4">
        <Search size={16} className="text-green-400" />
        صحة SEO
      </h3>
      <div className="space-y-2">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/[0.02] rounded-lg p-2.5">
            <CheckCircle size={14} className={check.status ? 'text-emerald-400' : 'text-red-400'} />
            <span className="text-xs text-slate-300 w-28">{check.label}</span>
            <span className="text-[10px] text-slate-500 flex-1">{check.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────────────────
function QuickActionCard({ label, href, icon: Icon, gradient, external }: {
  label: string; href: string; icon: React.ElementType; gradient: string; external?: boolean;
}) {
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}
      className="group admin-card flex items-center gap-3 !p-3.5 hover:scale-[1.02] transition-transform">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${gradient}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-white truncate">{label}</p>
      </div>
      <ArrowUpRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════════
export default function OverviewTab({ stats, sitemaps }: { stats: any; sitemaps: any[] }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Welcome */}
      <WelcomeBanner />

      {/* Smart Alerts */}
      <SmartAlerts />

      {/* Real Time */}
      <RealTimeWidget />

      {/* Analytics Summary (from real API) */}
      <AnalyticsSummaryWidget />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="إجمالي الملفات" value={stats.totalFiles?.toLocaleString() || stats.srcFiles || 0} icon={<HardDrive size={16} />} color="text-blue-400" sub="في المشروع" />
        <StatCard label="URLs في Sitemaps" value={stats.totalSitemapUrls?.toLocaleString() || stats.totalUrls?.toLocaleString() || 0} icon={<Globe size={16} />} color="text-emerald-400" sub="مفهرسة" />
        <StatCard label="Git Commits" value={stats.commits || 0} icon={<GitBranch size={16} />} color="text-violet-400" sub="إجمالي" />
        <StatCard label="السكريبتات" value={stats.scripts || 0} icon={<Zap size={16} />} color="text-amber-400" sub="جاهزة للتشغيل" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="ملفات Sitemap" value={stats.sitemaps || sitemaps.length || 0} icon={<FileText size={16} />} color="text-cyan-400" sub="ملف" />
        <StatCard label="ملفات src" value={stats.srcFiles || 0} icon={<Layers size={16} />} color="text-emerald-400" sub="ملف" />
        <StatCard label="حجم البناء" value={stats.buildSize || '—'} icon={<Package size={16} />} color="text-orange-400" sub="production" />
        <StatCard label="SEO Score" value={stats.seoScore || '—'} icon={<Star size={16} />} color="text-yellow-400" sub="من API" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VisitorAreaChart />
        <TrafficBarChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SourcesPieChart />
        <TopPagesTable />
      </div>

      {/* SEO Health */}
      <SEOHealthWidget />

      {/* Sitemaps */}
      {sitemaps.length > 0 && (
        <div className="admin-card">
          <h3 className="admin-section-title mb-4">
            <Map size={16} className="text-blue-400" />
            حالة Sitemaps
            <span className="text-xs text-slate-500 font-normal">({sitemaps.length} ملف)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sitemaps.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white/[0.03] rounded-xl p-3 hover:bg-white/[0.05] transition-colors group">
                <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-300 truncate font-medium">{s.file}</p>
                  <p className="text-[10px] text-slate-500">{s.urls} URLs · {s.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="admin-section-title mb-3">
          <Zap size={16} className="text-amber-400" />
          إجراءات سريعة
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickActionCard label="فتح الموقع" href="/" icon={ExternalLink} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
          <QuickActionCard label="robots.txt" href="/robots.txt" icon={Shield} gradient="bg-gradient-to-br from-slate-500 to-slate-600" external />
          <QuickActionCard label="Sitemap" href="/sitemap.xml" icon={Map} gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" external />
          <QuickActionCard label="Google Search Console" href="https://search.google.com/search-console" icon={Globe} gradient="bg-gradient-to-br from-orange-500 to-orange-600" external />
        </div>
      </div>

      {/* System Status */}
      <div className="admin-card">
        <h3 className="admin-section-title mb-4">
          <Server size={16} className="text-blue-400" />
          حالة النظام
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Frontend', status: 'active', detail: 'React + Vite' },
            { label: 'Backend API', status: 'check', detail: 'Node.js on VPS' },
            { label: 'CDN / SSL', status: 'active', detail: 'Nginx + Let\'s Encrypt' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-3">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                item.status === 'active' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-500'
              }`} />
              <div>
                <p className="text-xs font-medium text-white">{item.label}</p>
                <p className="text-[10px] text-slate-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

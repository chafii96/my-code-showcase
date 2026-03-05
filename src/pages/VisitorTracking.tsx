import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Eye, Clock, TrendingUp, TrendingDown, Globe, Smartphone,
  Monitor, Tablet, Search, ExternalLink, RefreshCw, Activity,
  MapPin, BarChart2, ArrowLeft, Wifi, MousePointer, Share2,
  ChevronUp, ChevronDown, Minus, AlertCircle, CheckCircle,
  ArrowRight, Target, Zap, Filter, Download
} from 'lucide-react';
import { AnalyticsData } from '@/lib/visitorTracking';

// ============================================================
// MINI CHART COMPONENT
// ============================================================

function SparkLine({ data, color = '#3b82f6' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 40;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================================
// BAR CHART COMPONENT
// ============================================================

function HourlyBar({ data }: { data: { hour: number; visitors: number }[] }) {
  const max = Math.max(...data.map(d => d.visitors));
  return (
    <div className="flex items-end gap-0.5 h-16 w-full">
      {data.map(({ hour, visitors }) => (
        <div
          key={hour}
          className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors cursor-default group relative"
          style={{ height: `${(visitors / max) * 100}%` }}
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
            {hour}:00 — {visitors}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  title, value, subtitle, icon: Icon, trend, trendValue, color = 'text-primary'
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}) {
  return (
    <div className="bg-card border rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-muted ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && trendValue && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${
          trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
        }`}>
          {trend === 'up' ? <ChevronUp className="h-3 w-3" /> :
           trend === 'down' ? <ChevronDown className="h-3 w-3" /> :
           <Minus className="h-3 w-3" />}
          {trendValue} مقارنة بالأسبوع الماضي
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN VISITOR TRACKING PAGE
// ============================================================

export default function VisitorTracking() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [rawApi, setRawApi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'keywords' | 'geo' | 'realtime'>('overview');
  const [realTimeCount, setRealTimeCount] = useState(0);
  const [backendOnline, setBackendOnline] = useState(false);

  const fetchRealData = async () => {
    try {
      const [analyticsRes, activeRes] = await Promise.all([
        fetch('/api/analytics', { signal: AbortSignal.timeout(3000) }),
        fetch('/api/analytics/active', { signal: AbortSignal.timeout(3000) }),
      ]);
      const contentType = analyticsRes.headers.get('content-type') || '';
      if (!analyticsRes.ok || !contentType.includes('application/json')) throw new Error('offline');
      const raw = await analyticsRes.json();
      const active = await activeRes.json().catch(() => ({ count: 0 }));
      setBackendOnline(true);
      setRealTimeCount(active.count || 0);
      setRawApi(raw);

      const s = raw.summary || {};
      const totalVisits = s.totalVisits || 0;
      const totalSessions = s.totalSessions || 1;
      const newPct = totalSessions > 0 ? Math.round((s.newVisitors / totalSessions) * 100) : 50;

      const COUNTRY_FLAGS: Record<string, string> = {
        'US':'🇺🇸','SA':'🇸🇦','AE':'🇦🇪','EG':'🇪🇬','GB':'🇬🇧','DE':'🇩🇪','FR':'🇫🇷',
        'IN':'🇮🇳','CA':'🇨🇦','AU':'🇦🇺','BR':'🇧🇷','JP':'🇯🇵','MX':'🇲🇽','TR':'🇹🇷',
        'KW':'🇰🇼','QA':'🇶🇦','PK':'🇵🇰','NG':'🇳🇬','CN':'🇨🇳','RU':'🇷🇺',
      };

      const mapped: AnalyticsData = {
        totalVisitors: totalVisits,
        uniqueVisitors: s.totalUniqueVisitors || 0,
        pageViews: s.totalPageviews || totalVisits,
        avgSessionDuration: s.avgSessionDuration || 0,
        bounceRate: s.bounceRate || 0,
        newVsReturning: { new: newPct, returning: 100 - newPct },
        realTimeVisitors: active.count || 0,
        conversionRate: 0,
        topPages: (raw.topPages || []).map((p: any) => ({ page: p.path, views: p.views, avgTime: 0 })),
        trafficSources: (raw.topReferrers || []).slice(0, 6).map((r: any) => ({
          source: r.referrer || 'Direct',
          visitors: r.count,
          percentage: totalVisits > 0 ? Math.round((r.count / totalVisits) * 100) : 0,
        })),
        deviceBreakdown: (raw.devices || []).map((d: any) => ({
          device: d.device === 'mobile' ? 'Mobile' : d.device === 'tablet' ? 'Tablet' : 'Desktop',
          count: d.count,
          percentage: d.pct,
        })),
        topCountries: (raw.countries || []).slice(0, 7).map((c: any) => ({
          country: c.country,
          flag: COUNTRY_FLAGS[c.code] || '🏳️',
          visitors: c.count,
          percentage: c.pct,
        })),
        hourlyTraffic: (raw.hourlyTrend || []).map((h: any) => ({
          hour: h.hour,
          visitors: h.views,
        })),
        dailyTraffic: (raw.dailyTrend || []).map((d: any) => ({
          date: d.date,
          visitors: d.views,
          pageViews: d.views,
        })),
        topKeywords: [],
        topReferrers: (raw.topReferrers || []).slice(0, 6).map((r: any) => ({
          domain: (r.referrer || 'direct').replace(/^https?:\/\//, '').split('/')[0],
          visitors: r.count,
        })),
      };
      setData(mapped);
      setLastUpdated(new Date());
    } catch {
      setBackendOnline(false);
      // Show empty state - no mock data
      setRealTimeCount(0);
      setRawApi(null);
      setData({
        totalVisitors: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        newVsReturning: { new: 0, returning: 0 },
        realTimeVisitors: 0,
        conversionRate: 0,
        topPages: [],
        trafficSources: [],
        deviceBreakdown: [],
        topCountries: [],
        hourlyTraffic: [],
        dailyTraffic: [],
        topKeywords: [],
        topReferrers: [],
      });
      setLastUpdated(new Date());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 10000);
    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    setLoading(true);
    fetchRealData();
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">جاري تحميل بيانات الزوار...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:h-14 px-4 py-2 sm:py-0">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-foreground text-sm truncate">تتبع الزوار والإحصائيات</h1>
              <p className="text-xs text-muted-foreground">آخر تحديث: {lastUpdated.toLocaleTimeString('ar-SA')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
              backendOnline ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-green-400' : 'bg-yellow-400'}`} />
              {backendOnline ? 'بيانات حقيقية' : 'غير متصل'}
            </span>
            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {realTimeCount} زائر الآن
            </div>
            <button onClick={refresh} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">تحديث</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 max-w-7xl">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted/50 rounded-xl p-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: BarChart2 },
            { id: 'realtime', label: 'مباشر', icon: Activity },
            { id: 'pages', label: 'الصفحات', icon: Eye },
            { id: 'keywords', label: 'الكلمات المفتاحية', icon: Search },
            { id: 'geo', label: 'الجغرافيا', icon: Globe },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="إجمالي الزوار (30 يوم)"
                value={data.totalVisitors.toLocaleString()}
                subtitle={`${data.uniqueVisitors.toLocaleString()} زائر فريد`}
                icon={Users}
                trend={rawApi?.trends?.visitorsTrend > 0 ? "up" : rawApi?.trends?.visitorsTrend < 0 ? "down" : "neutral"}
                trendValue={rawApi?.trends?.visitorsTrend != null ? `${rawApi.trends.visitorsTrend > 0 ? '+' : ''}${rawApi.trends.visitorsTrend}%` : undefined}
                color="text-blue-500"
              />
              <StatCard
                title="مشاهدات الصفحات"
                value={data.pageViews.toLocaleString()}
                subtitle={`${rawApi?.summary?.pagesPerVisit || (data.totalVisitors > 0 ? (data.pageViews / data.totalVisitors).toFixed(1) : '0')} صفحة/زيارة`}
                icon={Eye}
                trend={rawApi?.trends?.pageviewsTrend > 0 ? "up" : rawApi?.trends?.pageviewsTrend < 0 ? "down" : "neutral"}
                trendValue={rawApi?.trends?.pageviewsTrend != null ? `${rawApi.trends.pageviewsTrend > 0 ? '+' : ''}${rawApi.trends.pageviewsTrend}%` : undefined}
                color="text-green-500"
              />
              <StatCard
                title="متوسط مدة الجلسة"
                value={formatDuration(data.avgSessionDuration)}
                subtitle="دقيقة:ثانية"
                icon={Clock}
                color="text-purple-500"
              />
              <StatCard
                title="معدل الارتداد"
                value={`${data.bounceRate}%`}
                subtitle="أقل = أفضل"
                icon={TrendingDown}
                trend={data.bounceRate > 50 ? "down" : "up"}
                color="text-orange-500"
              />
            </div>

            {/* Daily Traffic Chart */}
            <div className="bg-card border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                حركة المرور اليومية (30 يوم)
              </h3>
              {data.dailyTraffic.length > 0 ? (
                <>
                  <div className="flex items-end gap-1 h-32">
                    {data.dailyTraffic.map(({ date, visitors, pageViews: pv }) => {
                      const maxV = Math.max(...data.dailyTraffic.map(d => d.visitors), 1);
                      return (
                        <div key={date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                          <div
                            className="w-full bg-primary/30 hover:bg-primary/60 rounded-t transition-colors cursor-default"
                            style={{ height: `${(visitors / maxV) * 100}%` }}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                            {date}: {visitors} زائر / {pv} مشاهدة
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{data.dailyTraffic[0]?.date}</span>
                    <span>{data.dailyTraffic[data.dailyTraffic.length - 1]?.date}</span>
                  </div>
                </>
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">لا توجد بيانات — يتطلب اتصال بالخلفية البرمجية</p>
                </div>
              )}
            </div>

            {/* Traffic Sources + Device Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Traffic Sources */}
              <div className="bg-card border rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-blue-500" />
                  مصادر الزيارات
                </h3>
                <div className="space-y-3">
                  {data.trafficSources.map(({ source, visitors, percentage }) => (
                    <div key={source}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{source}</span>
                        <span className="text-muted-foreground">{visitors.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-card border rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-purple-500" />
                  توزيع الأجهزة
                </h3>
                <div className="space-y-4">
                  {data.deviceBreakdown.map(({ device, count, percentage }) => {
                    const Icon = device === 'Mobile' ? Smartphone : device === 'Desktop' ? Monitor : Tablet;
                    const color = device === 'Mobile' ? 'text-blue-500' : device === 'Desktop' ? 'text-green-500' : 'text-orange-500';
                    return (
                      <div key={device} className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${color} flex-shrink-0`} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground">{device}</span>
                            <span className="text-muted-foreground">{percentage}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${device === 'Mobile' ? 'bg-blue-500' : device === 'Desktop' ? 'bg-green-500' : 'bg-orange-500'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground w-16 text-right">{count.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>

                {/* New vs Returning */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-xs font-medium text-muted-foreground mb-3">جديد مقابل عائد</h4>
                  <div className="flex gap-2 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 rounded-l-full" style={{ width: `${data.newVsReturning.new}%` }} />
                    <div className="bg-green-500 rounded-r-full flex-1" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" /> جديد {data.newVsReturning.new}%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /> عائد {data.newVsReturning.returning}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Traffic */}
            <div className="bg-card border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                حركة المرور بالساعة (اليوم)
              </h3>
              <HourlyBar data={data.hourlyTraffic} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>12 ص</span>
                <span>6 ص</span>
                <span>12 م</span>
                <span>6 م</span>
                <span>11 م</span>
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-card border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-cyan-500" />
                أهم المواقع المُحيلة
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.topReferrers.map(({ domain, visitors }) => (
                  <div key={domain} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                    <span className="text-sm text-foreground">{domain}</span>
                    <span className="text-xs font-medium text-primary">{visitors.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── REAL-TIME TAB ── */}
        {activeTab === 'realtime' && (
          <div className="space-y-6">
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">مباشر الآن</span>
              </div>
              <p className="text-7xl font-bold text-foreground">{realTimeCount}</p>
              <p className="text-muted-foreground mt-2">زائر نشط على الموقع</p>
            </div>

            {realTimeCount === 0 ? (
              <div className="bg-card border rounded-xl p-12 text-center">
                <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-sm text-muted-foreground mb-1">لا يوجد زوار نشطون حالياً</p>
                <p className="text-xs text-muted-foreground">يتطلب اتصال بـ Backend لعرض البيانات الحية</p>
              </div>
            ) : (
              <div className="bg-card border rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  البيانات الحية متاحة عند اتصال الخلفية البرمجية
                </h3>
              </div>
            )}
          </div>
        )}

        {/* ── PAGES TAB ── */}
        {activeTab === 'pages' && (
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                أكثر الصفحات زيارةً
              </h3>
              <span className="text-xs text-muted-foreground">آخر 30 يوم</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right p-3 text-xs text-muted-foreground font-medium">#</th>
                    <th className="text-right p-3 text-xs text-muted-foreground font-medium">الصفحة</th>
                    <th className="text-right p-3 text-xs text-muted-foreground font-medium">المشاهدات</th>
                    <th className="text-right p-3 text-xs text-muted-foreground font-medium">متوسط الوقت</th>
                    <th className="text-right p-3 text-xs text-muted-foreground font-medium">الأداء</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.map(({ page, views, avgTime }, i) => {
                    const maxViews = data.topPages[0].views;
                    return (
                      <tr key={page} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-muted-foreground">{i + 1}</td>
                        <td className="p-3">
                          <span className="text-primary font-mono text-xs">{page}</span>
                        </td>
                        <td className="p-3 font-medium text-foreground">{views.toLocaleString()}</td>
                        <td className="p-3 text-muted-foreground">{formatDuration(avgTime)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(views / maxViews) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{Math.round((views / maxViews) * 100)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── KEYWORDS TAB ── */}
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Search className="h-4 w-4 text-green-500" />
                  الكلمات المفتاحية من Google Search Console
                </h3>
              </div>
              {data.topKeywords.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-muted-foreground mb-1">لا توجد بيانات كلمات مفتاحية</p>
                  <p className="text-xs text-muted-foreground">يتطلب ربط Google Search Console API لجلب بيانات حقيقية</p>
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-right p-3 text-xs text-muted-foreground font-medium">الكلمة المفتاحية</th>
                      <th className="text-right p-3 text-xs text-muted-foreground font-medium">النقرات</th>
                      <th className="text-right p-3 text-xs text-muted-foreground font-medium">الموضع</th>
                      <th className="text-right p-3 text-xs text-muted-foreground font-medium">CTR</th>
                      <th className="text-right p-3 text-xs text-muted-foreground font-medium">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topKeywords.map(({ keyword, clicks, position, ctr }) => (
                      <tr key={keyword} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-foreground font-medium">{keyword}</td>
                        <td className="p-3 text-foreground">{clicks.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`font-bold ${
                            position <= 3 ? 'text-green-500' :
                            position <= 10 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            #{position.toFixed(1)}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{ctr}%</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            position <= 3 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            position <= 10 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {position <= 3 ? '🏆 ممتاز' : position <= 10 ? '⚠️ جيد' : '❌ يحتاج تحسين'}
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
        )}

        {/* ── GEO TAB ── */}
        {activeTab === 'geo' && (
          <div className="space-y-4">
            <div className="bg-card border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                توزيع الزوار حسب الدولة
              </h3>
              <div className="space-y-3">
                {data.topCountries.map(({ country, flag, visitors, percentage }) => (
                  <div key={country}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2 text-foreground">
                        <span className="text-lg">{flag}</span>
                        {country}
                      </span>
                      <span className="text-muted-foreground">{visitors.toLocaleString()} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* US States breakdown */}
            <div className="bg-card border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                أهم الولايات الأمريكية
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { state: 'California', visitors: 2341, pct: 22.8 },
                  { state: 'Texas', visitors: 1876, pct: 18.3 },
                  { state: 'New York', visitors: 1543, pct: 15.0 },
                  { state: 'Florida', visitors: 1234, pct: 12.0 },
                  { state: 'Illinois', visitors: 876, pct: 8.5 },
                  { state: 'Pennsylvania', visitors: 654, pct: 6.4 },
                ].map(({ state, visitors, pct }) => (
                  <div key={state} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground">{state}</p>
                    <p className="text-xs text-muted-foreground">{visitors.toLocaleString()} ({pct}%)</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <p>بيانات تحليلية — USPostalTracking.com</p>
          <Link to="/admin" className="flex items-center gap-1 hover:text-primary">
            <ArrowLeft className="h-3 w-3" />
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  );
}

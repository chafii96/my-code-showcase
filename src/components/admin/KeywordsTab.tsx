import React, { useState, useEffect, useCallback } from "react";
import {
  Search, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Minus,
  Download, RefreshCw, Loader2, ExternalLink, Filter, BarChart2,
  Eye, MousePointer, Target, Hash, Globe, Info, Star,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
} from "recharts";
import { StatCard, EmptyState } from "./shared";

interface KeywordData {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  positionChange?: number;
  page?: string;
}

interface KeywordsSummary {
  totalClicks: number;
  totalImpressions: number;
  avgCTR: number;
  avgPosition: number;
  totalKeywords: number;
  clicksTrend?: number;
  impressionsTrend?: number;
}

export default function KeywordsTab() {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [summary, setSummary] = useState<KeywordsSummary>({
    totalClicks: 0, totalImpressions: 0, avgCTR: 0, avgPosition: 0, totalKeywords: 0
  });
  const [dailyTrend, setDailyTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'clicks' | 'impressions' | 'ctr' | 'position'>('clicks');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterPosition, setFilterPosition] = useState<'all' | 'top3' | 'top10' | 'top20' | 'low'>('all');
  const [subTab, setSubTab] = useState<'overview' | 'keywords' | 'pages'>('overview');
  const [backendOnline, setBackendOnline] = useState(false);

  const fetchKeywords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/keywords', { signal: AbortSignal.timeout(5000) });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) throw new Error('offline');
      const data = await res.json();
      setBackendOnline(true);

      setKeywords(data.keywords || []);
      setSummary(data.summary || {
        totalClicks: 0, totalImpressions: 0, avgCTR: 0, avgPosition: 0, totalKeywords: 0
      });
      setDailyTrend(data.dailyTrend || []);
      setLastRefresh(new Date());
    } catch {
      setBackendOnline(false);
      // Demo data for preview
      setKeywords([
        { keyword: 'usps tracking', clicks: 2450, impressions: 45000, ctr: 5.4, position: 3.2 },
        { keyword: 'usps tracking number', clicks: 1890, impressions: 32000, ctr: 5.9, position: 4.1 },
        { keyword: 'track usps package', clicks: 1240, impressions: 28000, ctr: 4.4, position: 5.8 },
        { keyword: 'usps package tracking', clicks: 980, impressions: 21000, ctr: 4.7, position: 6.3 },
        { keyword: 'usps delivery status', clicks: 750, impressions: 18500, ctr: 4.1, position: 7.2 },
        { keyword: 'usps tracking not updating', clicks: 620, impressions: 15000, ctr: 4.1, position: 4.5 },
        { keyword: 'where is my usps package', clicks: 540, impressions: 12000, ctr: 4.5, position: 8.1 },
        { keyword: 'usps first class tracking', clicks: 430, impressions: 9800, ctr: 4.4, position: 5.6 },
        { keyword: 'usps priority mail tracking', clicks: 380, impressions: 8500, ctr: 4.5, position: 6.7 },
        { keyword: 'usps certified mail tracking', clicks: 320, impressions: 7200, ctr: 4.4, position: 7.8 },
        { keyword: 'usps ground advantage tracking', clicks: 280, impressions: 6500, ctr: 4.3, position: 9.2 },
        { keyword: 'usps tracking stuck in transit', clicks: 250, impressions: 5800, ctr: 4.3, position: 5.1 },
        { keyword: 'usps informed delivery', clicks: 220, impressions: 5200, ctr: 4.2, position: 11.3 },
        { keyword: 'usps tracking 9400', clicks: 190, impressions: 4500, ctr: 4.2, position: 3.8 },
        { keyword: 'usps express mail tracking', clicks: 170, impressions: 4000, ctr: 4.3, position: 8.5 },
      ]);
      setSummary({
        totalClicks: 10720,
        totalImpressions: 223000,
        avgCTR: 4.6,
        avgPosition: 6.4,
        totalKeywords: 15,
        clicksTrend: 12,
        impressionsTrend: 8,
      });
      setDailyTrend([
        { date: '02/26', clicks: 310, impressions: 7200 },
        { date: '02/27', clicks: 340, impressions: 7500 },
        { date: '02/28', clicks: 380, impressions: 8100 },
        { date: '03/01', clicks: 420, impressions: 8800 },
        { date: '03/02', clicks: 390, impressions: 8400 },
        { date: '03/03', clicks: 450, impressions: 9200 },
        { date: '03/04', clicks: 480, impressions: 9500 },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchKeywords(); }, [fetchKeywords]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortDir(column === 'position' ? 'asc' : 'desc');
    }
  };

  const filteredKeywords = keywords
    .filter(k => !searchQuery || k.keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(k => {
      if (filterPosition === 'top3') return k.position <= 3;
      if (filterPosition === 'top10') return k.position <= 10;
      if (filterPosition === 'top20') return k.position <= 20;
      if (filterPosition === 'low') return k.position > 20;
      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortDir === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });

  // Group keywords by landing page
  const pageKeywords: Record<string, { clicks: number; impressions: number; keywords: number }> = {};
  keywords.forEach(k => {
    const page = k.page || '/';
    if (!pageKeywords[page]) pageKeywords[page] = { clicks: 0, impressions: 0, keywords: 0 };
    pageKeywords[page].clicks += k.clicks;
    pageKeywords[page].impressions += k.impressions;
    pageKeywords[page].keywords += 1;
  });
  const sortedPages = Object.entries(pageKeywords).sort((a, b) => b[1].clicks - a[1].clicks);

  const exportCSV = () => {
    const header = ['الكلمة المفتاحية', 'النقرات', 'مرات الظهور', 'CTR %', 'الترتيب', 'الصفحة'];
    const rows = filteredKeywords.map(k => [k.keyword, String(k.clicks), String(k.impressions), `${k.ctr}%`, String(k.position), k.page || '/']);
    const csv = '\uFEFF' + [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `keywords-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const getPositionColor = (pos: number) => {
    if (pos <= 3) return 'text-emerald-400';
    if (pos <= 10) return 'text-blue-400';
    if (pos <= 20) return 'text-amber-400';
    return 'text-red-400';
  };

  const getPositionBg = (pos: number) => {
    if (pos <= 3) return 'bg-emerald-500/15';
    if (pos <= 10) return 'bg-blue-500/15';
    if (pos <= 20) return 'bg-amber-500/15';
    return 'bg-red-500/15';
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Search size={20} className="text-emerald-400" />
            🔍 الكلمات المفتاحية وترتيب البحث
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
            آخر تحديث: {lastRefresh.toLocaleTimeString('ar')}
            <span className="text-slate-600 mx-1">·</span>
            <span className={backendOnline ? 'text-emerald-400' : 'text-amber-400'}>
              {backendOnline ? '✅ بيانات حقيقية' : '📊 بيانات تجريبية'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-700 hover:bg-green-600 rounded-lg text-[10px] text-white transition-colors"><Download size={11} />تصدير CSV</button>
          <button onClick={fetchKeywords} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] text-slate-300 transition-colors"><RefreshCw size={11} />تحديث</button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {([
          { id: 'overview', label: '📊 نظرة عامة' },
          { id: 'keywords', label: '🔍 الكلمات المفتاحية' },
          { id: 'pages', label: '📄 الصفحات' },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              subTab === t.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <StatCard label="إجمالي النقرات" value={summary.totalClicks.toLocaleString()} icon={<MousePointer size={14} />} color="text-blue-400"
          trend={summary.clicksTrend ? { value: `${summary.clicksTrend > 0 ? '+' : ''}${summary.clicksTrend}%`, up: summary.clicksTrend > 0 } : undefined} />
        <StatCard label="مرات الظهور" value={summary.totalImpressions.toLocaleString()} icon={<Eye size={14} />} color="text-cyan-400"
          trend={summary.impressionsTrend ? { value: `${summary.impressionsTrend > 0 ? '+' : ''}${summary.impressionsTrend}%`, up: summary.impressionsTrend > 0 } : undefined} />
        <StatCard label="متوسط CTR" value={`${summary.avgCTR}%`} icon={<Target size={14} />} color="text-emerald-400" />
        <StatCard label="متوسط الترتيب" value={summary.avgPosition.toFixed(1)} icon={<BarChart2 size={14} />} color="text-purple-400" sub={summary.avgPosition <= 10 ? '✅ ضمن الصفحة الأولى' : '⚠️ خارج الصفحة الأولى'} />
        <StatCard label="الكلمات المفتاحية" value={summary.totalKeywords} icon={<Hash size={14} />} color="text-amber-400" />
      </div>

      {/* ──────── OVERVIEW ──────── */}
      {subTab === 'overview' && (
        <>
          {/* Daily Clicks & Impressions Chart */}
          {dailyTrend.length > 0 && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">📈 اتجاه النقرات ومرات الظهور</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={dailyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradClicks" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gradImpressions" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 10 }} width={40} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 10 }} width={50} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                  <Area yAxisId="right" type="monotone" dataKey="impressions" stroke="#10b981" strokeWidth={1.5} fill="url(#gradImpressions)" name="ظهور" />
                  <Area yAxisId="left" type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} fill="url(#gradClicks)" name="نقرات" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top 10 Keywords Bar Chart */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">🏆 أكثر 10 كلمات مفتاحية نقراً</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={keywords.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis type="category" dataKey="keyword" tick={{ fill: '#94a3b8', fontSize: 10 }} width={120} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                <Bar dataKey="clicks" fill="#3b82f6" radius={[0, 4, 4, 0]} name="نقرات" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Position Distribution */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Top 3', count: keywords.filter(k => k.position <= 3).length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: '🥇' },
              { label: 'Top 10', count: keywords.filter(k => k.position <= 10 && k.position > 3).length, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '🔵' },
              { label: 'Top 20', count: keywords.filter(k => k.position <= 20 && k.position > 10).length, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: '🟡' },
              { label: '20+', count: keywords.filter(k => k.position > 20).length, color: 'text-red-400', bg: 'bg-red-500/10', icon: '🔴' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-xl p-4 text-center border border-white/[0.03]`}>
                <p className="text-2xl mb-1">{item.icon}</p>
                <p className={`text-xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-[10px] text-slate-400 mt-1">ترتيب {item.label}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ──────── KEYWORDS TABLE ──────── */}
      {subTab === 'keywords' && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="ابحث عن كلمة مفتاحية..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {([
                { id: 'all', label: 'الكل' },
                { id: 'top3', label: 'Top 3' },
                { id: 'top10', label: 'Top 10' },
                { id: 'top20', label: 'Top 20' },
                { id: 'low', label: '20+' },
              ] as const).map(f => (
                <button key={f.id} onClick={() => setFilterPosition(f.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    filterPosition === f.id ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}>{f.label}</button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500">{filteredKeywords.length} كلمة مفتاحية</p>

          {/* Keywords Table */}
          {filteredKeywords.length === 0 ? <EmptyState icon={<Search size={32} />} title="لا توجد كلمات مفتاحية" subtitle="ستظهر بعد ربط بيانات Search Console أو وصول بيانات حقيقية" /> : (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700 bg-slate-900/50">
                      <th className="text-right p-3 font-medium">#</th>
                      <th className="text-right p-3 font-medium">الكلمة المفتاحية</th>
                      <th className="text-right p-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('clicks')}>
                        <span className="flex items-center gap-1">النقرات {sortBy === 'clicks' && (sortDir === 'desc' ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}</span>
                      </th>
                      <th className="text-right p-3 font-medium cursor-pointer hover:text-white transition-colors hidden sm:table-cell" onClick={() => handleSort('impressions')}>
                        <span className="flex items-center gap-1">الظهور {sortBy === 'impressions' && (sortDir === 'desc' ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}</span>
                      </th>
                      <th className="text-right p-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('ctr')}>
                        <span className="flex items-center gap-1">CTR {sortBy === 'ctr' && (sortDir === 'desc' ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}</span>
                      </th>
                      <th className="text-right p-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('position')}>
                        <span className="flex items-center gap-1">الترتيب {sortBy === 'position' && (sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeywords.map((k, i) => (
                      <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="p-3 text-slate-500 font-mono">{i + 1}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-200 font-medium">{k.keyword}</span>
                            <a href={`https://www.google.com/search?q=${encodeURIComponent(k.keyword)}`} target="_blank" rel="noreferrer"
                              className="text-slate-600 hover:text-blue-400 transition-colors flex-shrink-0">
                              <ExternalLink size={10} />
                            </a>
                          </div>
                          {k.page && <p className="text-[10px] text-slate-500 font-mono mt-0.5">{k.page}</p>}
                        </td>
                        <td className="p-3 text-white font-bold tabular-nums">{k.clicks.toLocaleString()}</td>
                        <td className="p-3 text-slate-400 tabular-nums hidden sm:table-cell">{k.impressions.toLocaleString()}</td>
                        <td className="p-3 text-cyan-400 tabular-nums">{k.ctr}%</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${getPositionBg(k.position)} ${getPositionColor(k.position)}`}>
                            {k.position.toFixed(1)}
                          </span>
                          {k.positionChange !== undefined && k.positionChange !== 0 && (
                            <span className={`ml-1 text-[10px] ${k.positionChange < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {k.positionChange < 0 ? '↑' : '↓'}{Math.abs(k.positionChange).toFixed(1)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ──────── PAGES ──────── */}
      {subTab === 'pages' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">📄 أداء الصفحات في البحث</h3>
          {sortedPages.length === 0 ? <EmptyState icon={<Globe size={32} />} title="لا توجد بيانات" /> : (
            <div className="space-y-2">
              {sortedPages.slice(0, 20).map(([page, data], i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-3 hover:bg-slate-900/50 transition-colors">
                  <span className="text-[10px] text-slate-500 w-5 text-center font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 font-mono truncate">{page}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{data.keywords} كلمات مفتاحية</p>
                  </div>
                  <div className="flex gap-4 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs font-bold text-blue-400 tabular-nums">{data.clicks.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-500">نقرات</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-300 tabular-nums">{data.impressions.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-500">ظهور</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-emerald-900/15 border border-emerald-700/40 rounded-xl p-3 flex items-start gap-2">
        <Info size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] sm:text-xs text-emerald-300">
            بيانات الكلمات المفتاحية تأتي من الخلفية البرمجية عبر <code className="bg-emerald-800/30 px-1 rounded">/api/analytics/keywords</code>
          </p>
          <p className="text-[10px] text-emerald-400/60 mt-0.5">
            💡 لبيانات دقيقة، أضف Google Search Console API إلى السيرفر لجلب بيانات الكلمات المفتاحية الحقيقية
          </p>
        </div>
      </div>
    </div>
  );
}

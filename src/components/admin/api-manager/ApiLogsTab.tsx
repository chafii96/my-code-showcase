import { useState, useMemo, useEffect } from "react";
import { Download, Search, RefreshCw, ChevronLeft, ChevronRight, Activity, CheckCircle, XCircle, Clock, FileText, AlertTriangle, Filter, ChevronsLeft, ChevronsRight } from "lucide-react";
import { TrackingLog } from "./types";
import { useApiData } from "./useApiData";

const STATUS_LABEL: Record<string, string> = { success: 'نجاح', error: 'خطأ', not_found: 'غير موجود' };
const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  success: { bg: 'bg-emerald-500/15 border-emerald-500/25', text: 'text-emerald-400', icon: CheckCircle },
  error: { bg: 'bg-red-500/15 border-red-500/25', text: 'text-red-400', icon: XCircle },
  not_found: { bg: 'bg-amber-500/15 border-amber-500/25', text: 'text-amber-400', icon: AlertTriangle },
};

const DATE_RANGES = [
  { key: 'all', label: 'الكل' },
  { key: 'today', label: 'اليوم' },
  { key: '7d', label: '7 أيام' },
  { key: '30d', label: '30 يوم' },
  { key: 'custom', label: 'مخصص' },
];

const PER_PAGE = 50;

export default function ApiLogsTab() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { data: logs, isLive, refetch } = useApiData<TrackingLog[]>('/tracking-logs?limit=500', [], { pollingInterval: autoRefresh ? 15000 : undefined });
  const [filters, setFilters] = useState({ provider: '', carrier: '', status: '', search: '', dateRange: 'all', dateFrom: '', dateTo: '' });
  const [page, setPage] = useState(1);

  const safeData = Array.isArray(logs) ? logs : [];

  const filtered = useMemo(() => {
    const now = Date.now();
    return safeData.filter(l => {
      if (filters.provider && l.providerUsed !== filters.provider) return false;
      if (filters.carrier && l.carrier !== filters.carrier) return false;
      if (filters.status && l.status !== filters.status) return false;
      if (filters.search && !l.trackingNumberHash.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.dateRange !== 'all') {
        const ts = new Date(l.timestamp).getTime();
        if (filters.dateRange === 'today') {
          const todayStart = new Date().setHours(0, 0, 0, 0);
          if (ts < todayStart) return false;
        } else if (filters.dateRange === '7d') {
          if (ts < now - 7 * 86400000) return false;
        } else if (filters.dateRange === '30d') {
          if (ts < now - 30 * 86400000) return false;
        } else if (filters.dateRange === 'custom') {
          if (filters.dateFrom && ts < new Date(filters.dateFrom).getTime()) return false;
          if (filters.dateTo && ts > new Date(filters.dateTo).getTime() + 86400000) return false;
        }
      }
      return true;
    });
  }, [safeData, filters]);

  useEffect(() => { setPage(1); }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const providers = [...new Set(safeData.map(l => l.providerUsed).filter(Boolean))];
  const carriers = [...new Set(safeData.map(l => l.carrier).filter(Boolean))];

  const summaryStats = useMemo(() => {
    const total = filtered.length;
    const successCount = filtered.filter(l => l.status === 'success').length;
    const successRate = total > 0 ? Math.round(successCount / total * 100) : 0;
    const totalResponseTime = filtered.reduce((s, l) => s + (l.responseTimeMs || 0), 0);
    const avgResponseTime = total > 0 ? Math.round(totalResponseTime / total) : 0;
    const errorCount = filtered.filter(l => l.status === 'error').length;
    const notFoundCount = filtered.filter(l => l.status === 'not_found').length;
    return { total, successCount, successRate, avgResponseTime, errorCount, notFoundCount };
  }, [filtered]);

  const errorAnalysis = useMemo(() => {
    const errors = safeData.filter(l => l.status === 'error');
    const grouped: Record<string, number> = {};
    errors.forEach(e => {
      const msg = e.errorMessage || 'خطأ غير معروف';
      grouped[msg] = (grouped[msg] || 0) + 1;
    });
    return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  }, [safeData]);

  const exportCSV = () => {
    const headers = ['الوقت', 'رقم التتبع', 'الناقل', 'المزود', 'الحساب', 'كاش', 'وقت الاستجابة(مل)', 'الحالة', 'الخطأ', 'IP'];
    const rows = filtered.map(l => [
      new Date(l.timestamp).toLocaleString('en-US'),
      l.trackingNumberHash, l.carrier, l.providerUsed, l.accountUsed,
      l.cacheHit ? 'yes' : 'no', l.responseTimeMs,
      l.status, l.errorMessage || '', l.ipHash
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `tracking-logs-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const getResponseTimeColor = (ms: number) => {
    if (ms < 500) return 'text-emerald-400';
    if (ms < 1500) return 'text-amber-400';
    return 'text-red-400';
  };

  const getResponseTimeBg = (ms: number) => {
    if (ms < 500) return 'bg-emerald-500/10';
    if (ms < 1500) return 'bg-amber-500/10';
    return 'bg-red-500/10';
  };

  const hasActiveFilters = filters.provider || filters.carrier || filters.status || filters.search || filters.dateRange !== 'all';

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 flex items-center justify-center">
            <FileText size={16} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">السجلات والتحليلات</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                {isLive ? '● متصل' : '○ غير متصل'}
              </span>
              <span className="text-[10px] text-slate-500">{safeData.length} سجل</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAutoRefresh(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              autoRefresh
                ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                : 'bg-slate-800/50 text-slate-400 border-white/[0.08] hover:border-white/[0.15]'
            }`}>
            <RefreshCw size={13} className={autoRefresh ? 'animate-spin' : ''} style={autoRefresh ? { animationDuration: '3s' } : {}} />
            {autoRefresh ? 'تحديث تلقائي' : 'تحديث متوقف'}
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500/10 to-blue-600/5 text-blue-400 border border-blue-500/20 hover:from-blue-500/20 hover:to-blue-600/10 transition-all shadow-lg shadow-blue-500/5">
            <Download size={13} /> تصدير CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'إجمالي الطلبات', value: summaryStats.total.toLocaleString(), icon: Activity, color: 'from-blue-500/15 to-blue-600/5 border-blue-500/20', iconColor: 'text-blue-400', valueColor: 'text-white' },
          { label: 'نسبة النجاح', value: `${summaryStats.successRate}%`, icon: CheckCircle, color: 'from-emerald-500/15 to-emerald-600/5 border-emerald-500/20', iconColor: 'text-emerald-400', valueColor: 'text-emerald-400' },
          { label: 'متوسط الاستجابة', value: `${summaryStats.avgResponseTime}`, unit: 'مل/ث', icon: Clock, color: 'from-amber-500/15 to-amber-600/5 border-amber-500/20', iconColor: 'text-amber-400', valueColor: getResponseTimeColor(summaryStats.avgResponseTime) },
          { label: 'الأخطاء', value: summaryStats.errorCount.toString(), icon: XCircle, color: 'from-red-500/15 to-red-600/5 border-red-500/20', iconColor: 'text-red-400', valueColor: 'text-red-400' },
          { label: 'غير موجود', value: summaryStats.notFoundCount.toString(), icon: AlertTriangle, color: 'from-amber-500/15 to-amber-600/5 border-amber-500/20', iconColor: 'text-amber-400', valueColor: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl bg-gradient-to-br ${stat.color} border backdrop-blur-xl p-4 shadow-xl`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={14} className={stat.iconColor} />
              <span className="text-[11px] text-slate-400 font-medium">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.valueColor}`}>
              {stat.value}
              {(stat as any).unit && <span className="text-xs text-slate-500 mr-1">{(stat as any).unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">تصفية</span>
          {hasActiveFilters && (
            <button onClick={() => setFilters({ provider: '', carrier: '', status: '', search: '', dateRange: 'all', dateFrom: '', dateTo: '' })}
              className="text-[10px] text-blue-400 hover:text-blue-300 mr-auto transition-colors">
              مسح الكل
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
              placeholder="بحث برقم التتبع..." className="bg-slate-800/60 border border-white/[0.1] rounded-xl pr-9 pl-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-52 transition-all placeholder:text-slate-500" />
          </div>
          <div className="flex rounded-xl border border-white/[0.1] overflow-hidden">
            {DATE_RANGES.map(r => (
              <button key={r.key} onClick={() => setFilters(p => ({ ...p, dateRange: r.key }))}
                className={`px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  filters.dateRange === r.key
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-inner'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-slate-300'
                }`}>
                {r.label}
              </button>
            ))}
          </div>
          {filters.dateRange === 'custom' && (
            <>
              <input type="date" value={filters.dateFrom} onChange={e => setFilters(p => ({ ...p, dateFrom: e.target.value }))}
                className="bg-slate-800/60 border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
              <input type="date" value={filters.dateTo} onChange={e => setFilters(p => ({ ...p, dateTo: e.target.value }))}
                className="bg-slate-800/60 border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
            </>
          )}
          <select value={filters.provider} onChange={e => setFilters(p => ({ ...p, provider: e.target.value }))}
            className="bg-slate-800/60 border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer min-w-[120px] transition-all">
            <option value="">كل المزودين</option>
            {providers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filters.carrier} onChange={e => setFilters(p => ({ ...p, carrier: e.target.value }))}
            className="bg-slate-800/60 border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer min-w-[120px] transition-all">
            <option value="">كل الناقلين</option>
            {carriers.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
            className="bg-slate-800/60 border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer min-w-[110px] transition-all">
            <option value="">كل الحالات</option>
            <option value="success">نجاح</option>
            <option value="error">خطأ</option>
            <option value="not_found">غير موجود</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto" dir="ltr">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">الوقت</th>
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">رقم التتبع</th>
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">الناقل</th>
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">المزود</th>
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">الحساب</th>
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">الكاش</th>
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">الاستجابة</th>
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">الحالة</th>
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">الخطأ</th>
                <th className="text-left py-3 px-4 font-medium text-[11px] uppercase tracking-wider">IP</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((log, idx) => {
                const statusConf = STATUS_CONFIG[log.status] || { bg: 'bg-slate-500/15 border-slate-500/25', text: 'text-slate-400', icon: Activity };
                const StatusIcon = statusConf.icon;
                return (
                  <tr key={log.id || idx} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-all group">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp).toLocaleString('ar', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <code className="font-mono text-[11px] text-slate-200 bg-slate-800/50 px-2 py-1 rounded-md border border-white/[0.05]">{log.trackingNumberHash}</code>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-semibold text-[11px]">{log.carrier}</td>
                    <td className="py-3 px-4 text-slate-300 text-[11px]">{log.providerUsed}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{log.accountUsed}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                        log.cacheHit
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/15'
                      }`}>
                        {log.cacheHit ? 'HIT' : 'MISS'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${getResponseTimeColor(log.responseTimeMs)} ${getResponseTimeBg(log.responseTimeMs)}`}>
                        {log.responseTimeMs}<span className="text-[9px] font-normal opacity-60">ms</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${statusConf.bg} ${statusConf.text}`}>
                        <StatusIcon size={10} />
                        {STATUS_LABEL[log.status] || log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-red-400/80 truncate max-w-[140px] text-[11px]">{log.errorMessage || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-[10px]">{log.ipHash}</td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={10} className="py-12 text-center text-slate-500">
                  <FileText size={32} className="mx-auto mb-2 opacity-30" />
                  <div>لا توجد سجلات مطابقة</div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > PER_PAGE && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]" dir="rtl">
            <div className="text-xs text-slate-400">
              عرض <span className="font-bold text-white">{((page - 1) * PER_PAGE) + 1}-{Math.min(page * PER_PAGE, filtered.length)}</span> من <span className="font-bold text-white">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 transition-all">
                <ChevronsRight size={14} />
              </button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 transition-all">
                <ChevronRight size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                    }`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 transition-all">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 transition-all">
                <ChevronsLeft size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {errorAnalysis.length > 0 && (
        <div className="rounded-2xl border border-red-500/15 bg-gradient-to-br from-red-500/[0.06] to-red-600/[0.02] backdrop-blur-xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={16} className="text-red-400" />
            <h3 className="text-sm font-bold text-white">تحليل الأخطاء</h3>
            <span className="text-[10px] text-slate-500 mr-auto">{errorAnalysis.length} نوع</span>
          </div>
          <div className="space-y-2">
            {errorAnalysis.map(([msg, count]) => (
              <div key={msg} className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/10 hover:bg-red-500/[0.1] transition-all">
                <span className="text-xs text-red-300">{msg}</span>
                <span className="text-xs font-bold text-red-400 bg-red-500/15 px-2.5 py-1 rounded-lg">{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

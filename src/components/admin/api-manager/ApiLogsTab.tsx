import { useState, useMemo, useEffect, useRef } from "react";
import { Download, Search, RefreshCw, ChevronLeft, ChevronRight, Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { TrackingLog } from "./types";
import { useApiData } from "./useApiData";

const STATUS_LABEL: Record<string, string> = { success: 'نجاح', error: 'خطأ', not_found: 'غير موجود' };
const STATUS_COLOR: Record<string, string> = {
  success: 'bg-emerald-500/20 text-emerald-400',
  error: 'bg-red-500/20 text-red-400',
  not_found: 'bg-amber-500/20 text-amber-400',
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
    return { total, successCount, successRate, avgResponseTime, errorCount };
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

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">السجلات والتحليلات</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
            {isLive ? '● متصل' : '○ غير متصل'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAutoRefresh(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${autoRefresh ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
            <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} style={autoRefresh ? { animationDuration: '3s' } : {}} />
            {autoRefresh ? 'تحديث تلقائي' : 'تحديث متوقف'}
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition-colors">
            <Download size={12} /> تصدير CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-blue-400" />
            <span className="text-[11px] text-slate-400">إجمالي الطلبات</span>
          </div>
          <div className="text-xl font-bold text-white">{summaryStats.total.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-[11px] text-slate-400">نسبة النجاح</span>
          </div>
          <div className="text-xl font-bold text-emerald-400">{summaryStats.successRate}%</div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-amber-400" />
            <span className="text-[11px] text-slate-400">متوسط الاستجابة</span>
          </div>
          <div className="text-xl font-bold text-amber-400">{summaryStats.avgResponseTime}<span className="text-xs text-slate-500 mr-1">مل/ث</span></div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={14} className="text-red-400" />
            <span className="text-[11px] text-slate-400">الأخطاء</span>
          </div>
          <div className="text-xl font-bold text-red-400">{summaryStats.errorCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
            placeholder="بحث برقم التتبع..." className="bg-slate-800 border border-white/[0.08] rounded-lg pr-8 pl-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-48" />
        </div>
        <div className="flex rounded-lg border border-white/[0.08] overflow-hidden">
          {DATE_RANGES.map(r => (
            <button key={r.key} onClick={() => setFilters(p => ({ ...p, dateRange: r.key }))}
              className={`px-3 py-2 text-xs font-medium transition-colors ${filters.dateRange === r.key ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              {r.label}
            </button>
          ))}
        </div>
        {filters.dateRange === 'custom' && (
          <>
            <input type="date" value={filters.dateFrom} onChange={e => setFilters(p => ({ ...p, dateFrom: e.target.value }))}
              className="bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <input type="date" value={filters.dateTo} onChange={e => setFilters(p => ({ ...p, dateTo: e.target.value }))}
              className="bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </>
        )}
        <select value={filters.provider} onChange={e => setFilters(p => ({ ...p, provider: e.target.value }))}
          className="bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">كل المزودين</option>
          {providers.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filters.carrier} onChange={e => setFilters(p => ({ ...p, carrier: e.target.value }))}
          className="bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">كل الناقلين</option>
          {carriers.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
          className="bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">كل الحالات</option>
          <option value="success">نجاح</option>
          <option value="error">خطأ</option>
          <option value="not_found">غير موجود</option>
        </select>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto" dir="ltr">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-white/[0.06] bg-white/[0.02]">
                <th className="text-left py-2.5 px-3">الوقت</th>
                <th className="text-left py-2.5 px-3">رقم التتبع</th>
                <th className="text-left py-2.5 px-3">الناقل</th>
                <th className="text-left py-2.5 px-3">المزود</th>
                <th className="text-left py-2.5 px-3">الحساب</th>
                <th className="text-left py-2.5 px-3">الكاش</th>
                <th className="text-left py-2.5 px-3">الوقت (مل/ث)</th>
                <th className="text-left py-2.5 px-3">الحالة</th>
                <th className="text-left py-2.5 px-3">الخطأ</th>
                <th className="text-left py-2.5 px-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((log, idx) => (
                <tr key={log.id || idx} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString('ar', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="py-2 px-3 font-mono text-slate-300">{log.trackingNumberHash}</td>
                  <td className="py-2 px-3 text-slate-300">{log.carrier}</td>
                  <td className="py-2 px-3 text-slate-300">{log.providerUsed}</td>
                  <td className="py-2 px-3 text-slate-400">{log.accountUsed}</td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${log.cacheHit ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {log.cacheHit ? 'إصابة' : 'فقدان'}
                    </span>
                  </td>
                  <td className={`py-2 px-3 font-semibold ${log.responseTimeMs < 500 ? 'text-emerald-400' : log.responseTimeMs < 1500 ? 'text-amber-400' : 'text-red-400'}`}>
                    {log.responseTimeMs}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLOR[log.status] || 'bg-slate-500/20 text-slate-400'}`}>
                      {STATUS_LABEL[log.status] || log.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-red-400 truncate max-w-[120px]">{log.errorMessage || '—'}</td>
                  <td className="py-2 px-3 font-mono text-slate-500">{log.ipHash}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={10} className="py-8 text-center text-slate-500">لا توجد سجلات مطابقة</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > PER_PAGE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]" dir="rtl">
            <div className="text-xs text-slate-400">
              عرض {((page - 1) * PER_PAGE) + 1}-{Math.min(page * PER_PAGE, filtered.length)} من {filtered.length}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
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
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${page === pageNum ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-white/[0.05]'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {errorAnalysis.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-3">تحليل الأخطاء</h3>
          <div className="space-y-2">
            {errorAnalysis.map(([msg, count]) => (
              <div key={msg} className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10">
                <span className="text-xs text-red-400">{msg}</span>
                <span className="text-xs font-bold text-red-400">{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

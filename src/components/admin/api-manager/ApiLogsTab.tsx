import { useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import { TrackingLog } from "./types";
import { useApiData } from "./useApiData";

const STATUS_LABEL: Record<string, string> = { success: 'نجاح', error: 'خطأ', not_found: 'غير موجود' };
const STATUS_COLOR: Record<string, string> = {
  success: 'bg-emerald-500/20 text-emerald-400',
  error: 'bg-red-500/20 text-red-400',
  not_found: 'bg-amber-500/20 text-amber-400',
};

export default function ApiLogsTab() {
  const { data: logs, isLive } = useApiData<TrackingLog[]>('/tracking-logs?limit=100', [], { pollingInterval: 15000 });
  const [filters, setFilters] = useState({ provider: '', carrier: '', status: '', search: '' });

  const safeData = Array.isArray(logs) ? logs : [];

  const filtered = useMemo(() => {
    return safeData.filter(l => {
      if (filters.provider && l.providerUsed !== filters.provider) return false;
      if (filters.carrier && l.carrier !== filters.carrier) return false;
      if (filters.status && l.status !== filters.status) return false;
      if (filters.search && !l.trackingNumberHash.includes(filters.search)) return false;
      return true;
    });
  }, [safeData, filters]);

  const providers = [...new Set(safeData.map(l => l.providerUsed))];
  const carriers = [...new Set(safeData.map(l => l.carrier))];

  const errorAnalysis = useMemo(() => {
    const errors = safeData.filter(l => l.status === 'error');
    const grouped: Record<string, number> = {};
    errors.forEach(e => {
      const msg = e.errorMessage || 'خطأ غير معروف';
      grouped[msg] = (grouped[msg] || 0) + 1;
    });
    return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  }, [safeData]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">السجلات والتحليلات</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
            {isLive ? '● متصل — تحديث 15 ثانية' : '○ غير متصل'}
          </span>
        </div>
        <button
          onClick={() => {
            const headers = ['الوقت', 'رقم التتبع', 'الناقل', 'المزود', 'الحساب', 'كاش', 'وقت الاستجابة(مل)', 'الحالة', 'الخطأ', 'IP'];
            const rows = filtered.map(l => [
              new Date(l.timestamp).toLocaleString('en-US'),
              l.trackingNumberHash, l.carrier, l.providerUsed, l.accountUsed,
              l.cacheHit ? 'yes' : 'no', l.responseTimeMs,
              l.status, l.errorMessage || '', l.ipHash
            ]);
            const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `tracking-logs-${Date.now()}.csv`; a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition-colors">
          <Download size={12} /> تصدير CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
            placeholder="بحث برقم التتبع..." className="bg-slate-800 border border-white/[0.08] rounded-lg pr-8 pl-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-48" />
        </div>
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
              {filtered.map((log, idx) => (
                <tr key={log.id || idx} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString('ar')}</td>
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
            </tbody>
          </table>
        </div>
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

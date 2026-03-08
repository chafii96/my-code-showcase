import React, { useState, useEffect, useRef, useMemo } from "react";
import { EmptyState } from "./shared";
import { Activity, Search, Download, Trash2, RefreshCw, ChevronRight, ChevronLeft, Calendar } from "lucide-react";

export default function ActivityLogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const PAGE_SIZE = 30;

  const fetchLogs = () => {
    fetch('/api/logs').then(r => r.ok ? r.json() : Promise.reject()).then(d => {
      setLogs(d.logs || []);
      setTotalLogs(d.total || 0);
    }).catch(() => setLogs([]));
  };

  useEffect(() => { fetchLogs(); }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLogs, 10000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [autoRefresh]);

  const LOG_TYPES: Record<string, { label: string; icon: string }> = {
    all: { label: 'الكل', icon: '📋' },
    deploy: { label: 'نشر', icon: '🚀' },
    script: { label: 'سكريبت', icon: '⚡' },
    content: { label: 'محتوى', icon: '📝' },
    seo: { label: 'SEO', icon: '🔍' },
    git: { label: 'Git', icon: '📦' },
    error: { label: 'أخطاء', icon: '❌' },
    monitoring: { label: 'مراقبة', icon: '👁️' },
    login: { label: 'دخول', icon: '🔐' },
  };

  const STATUS_FILTERS: Record<string, { label: string; color: string }> = {
    all: { label: 'الكل', color: 'bg-slate-600' },
    success: { label: 'نجاح', color: 'bg-green-600' },
    info: { label: 'معلومات', color: 'bg-blue-600' },
    warning: { label: 'تحذير', color: 'bg-yellow-600' },
    error: { label: 'خطأ', color: 'bg-red-600' },
  };

  const STATUS_STYLES: Record<string, string> = {
    success: 'bg-green-900/20 border-green-700/40',
    error: 'bg-red-900/20 border-red-700/40',
    warning: 'bg-yellow-900/20 border-yellow-700/40',
    info: 'bg-blue-900/20 border-blue-700/40',
  };

  const filtered = useMemo(() => {
    return logs.filter(l => {
      if (filterType !== 'all' && l.type !== filterType) return false;
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      if (search && !JSON.stringify(l).toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFrom && l.time && l.time < dateFrom) return false;
      if (dateTo && l.time && l.time > dateTo + 'T23:59:59') return false;
      return true;
    });
  }, [logs, filterType, filterStatus, search, dateFrom, dateTo]);

  const pagedLogs = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  const exportLogs = () => {
    if (filtered.length === 0) return;
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `logs-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const clearOldLogs = () => {
    if (!confirm('سيتم حذف السجلات القديمة والإبقاء على آخر 100 سجل فقط. هل أنت متأكد؟')) return;
    fetch('/api/logs', { method: 'DELETE' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => { fetchLogs(); })
      .catch(() => {});
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">📋 سجل النشاط
          <span className="text-xs text-slate-500 font-normal">({totalLogs} سجل)</span>
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setAutoRefresh(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${autoRefresh ? 'bg-green-700 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
            <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} />
            {autoRefresh ? 'تحديث تلقائي ✓' : 'تحديث تلقائي'}
          </button>
          <button onClick={fetchLogs} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors">
            <RefreshCw size={12} /> تحديث
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="بحث في السجلات..." dir="rtl"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {Object.entries(LOG_TYPES).map(([key, t]) => (
          <button key={key} onClick={() => { setFilterType(key); setPage(0); }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
              filterType === key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500">المستوى:</span>
        {Object.entries(STATUS_FILTERS).map(([key, s]) => (
          <button key={key} onClick={() => { setFilterStatus(key); setPage(0); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              filterStatus === key ? `${s.color} text-white` : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}>
            {s.label}
          </button>
        ))}
        <div className="flex items-center gap-1.5 mr-auto">
          <Calendar size={12} className="text-slate-500" />
          <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(0); }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-blue-500" />
          <span className="text-[10px] text-slate-600">—</span>
          <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(0); }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={exportLogs} disabled={filtered.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 rounded-lg text-xs text-white transition-colors">
          <Download size={12} /> تصدير السجلات
        </button>
        <button onClick={clearOldLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-800 hover:bg-red-700 rounded-lg text-xs text-red-200 transition-colors">
          <Trash2 size={12} /> حذف القديم (إبقاء 100)
        </button>
        <span className="text-xs text-slate-500 mr-auto">{filtered.length} نتيجة</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Activity size={32} />} title="لا توجد سجلات" subtitle="ستظهر السجلات بعد تشغيل أي أداة أو حدث" />
      ) : (
        <>
          <div className="space-y-2">
            {pagedLogs.map(log => (
              <div key={log.id} className={`flex items-start gap-3 p-3 rounded-xl border ${STATUS_STYLES[log.status] || STATUS_STYLES.info}`}>
                <span className="text-lg flex-shrink-0">{LOG_TYPES[log.type]?.icon || '📋'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{log.message}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-500">{timeAgo(log.time)}</span>
                    {log.type && <span className="text-[10px] text-slate-600">{LOG_TYPES[log.type]?.label || log.type}</span>}
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  log.status === 'success' ? 'bg-green-900/50 text-green-300' :
                  log.status === 'error' ? 'bg-red-900/50 text-red-300' :
                  log.status === 'warning' ? 'bg-yellow-900/50 text-yellow-300' :
                  'bg-blue-900/50 text-blue-300'
                }`}>
                  {log.status === 'success' ? '✅ نجاح' : log.status === 'error' ? '❌ خطأ' : log.status === 'warning' ? '⚠️ تحذير' : 'ℹ️ معلومات'}
                </span>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>صفحة {page + 1} من {totalPages}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors">
                  <ChevronRight size={12} /> السابق
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors">
                  التالي <ChevronLeft size={12} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { Clock, Database, Download, Filter, RefreshCw, Search, Trash2, Zap, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { CacheEntry, CacheStats, CacheTTLSettings } from "./types";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

interface CacheEntriesResponse {
  entries: (CacheEntry & { expired?: boolean })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CacheManagementTab() {
  const { data: stats, isLive, refetch: refetchStats } = useApiData<CacheStats>('/cache/stats', { totalEntries: 0, hitRateToday: 0, memoryUsedMB: 0, apiCallsSaved: 0, moneySaved: 0 }, { pollingInterval: 15000 });
  const { data: ttl, setData: setTtl } = useApiData<CacheTTLSettings>('/cache/settings', { delivered: 1440, inTransit: 120, outForDelivery: 30, pending: 60, exception: 15, preShipment: 60, unknown: 30, notFound: 5 });
  const [entriesData, setEntriesData] = useState<CacheEntriesResponse>({ entries: [], total: 0, page: 1, limit: 20, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteQuery, setDeleteQuery] = useState('');
  const [confirmFlush, setConfirmFlush] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterExpired, setFilterExpired] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [flushMode, setFlushMode] = useState<'all' | 'expired' | 'status' | 'age'>('all');
  const [flushStatus, setFlushStatus] = useState('not found');
  const [flushAge, setFlushAge] = useState(60);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoadingEntries(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (filterStatus) params.set('status', filterStatus);
      if (filterExpired) params.set('expired', filterExpired);
      params.set('page', String(currentPage));
      params.set('limit', '20');
      const res = await fetch(`/api/cache/entries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.entries) {
          setEntriesData(data);
        } else if (Array.isArray(data)) {
          setEntriesData({ entries: data, total: data.length, page: 1, limit: 20, totalPages: 1 });
        }
      }
    } catch {}
    setLoadingEntries(false);
  }, [searchQuery, filterStatus, filterExpired, currentPage]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  useEffect(() => {
    const iv = setInterval(fetchEntries, 15000);
    return () => clearInterval(iv);
  }, [fetchEntries]);

  const statCards = [
    { label: 'إجمالي المُخزَّن', value: Number(stats.totalEntries).toLocaleString(), icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'معدل الإصابة اليوم', value: `${stats.hitRateToday}%`, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'الذاكرة المستخدمة', value: `${stats.memoryUsedMB} MB`, icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'استدعاءات محفوظة', value: Number(stats.apiCallsSaved).toLocaleString(), icon: RefreshCw, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'أموال مُوفَّرة', value: `$${Number(stats.moneySaved).toFixed(2)}`, icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  const ttlFields: { key: keyof CacheTTLSettings; label: string; desc: string }[] = [
    { key: 'delivered', label: 'تم التسليم', desc: '24 ساعة' },
    { key: 'inTransit', label: 'في الطريق', desc: '30 دقيقة' },
    { key: 'outForDelivery', label: 'جاري التوصيل', desc: '30 دقيقة' },
    { key: 'pending', label: 'قيد الانتظار', desc: '60 دقيقة' },
    { key: 'exception', label: 'استثناء', desc: '15 دقيقة' },
    { key: 'preShipment', label: 'ما قبل الشحن', desc: '60 دقيقة' },
    { key: 'unknown', label: 'غير معروف', desc: '30 دقيقة' },
    { key: 'notFound', label: 'غير موجود', desc: '5 دقائق' },
  ];

  const statusColor = (s: string) => {
    const lower = s.toLowerCase();
    if (lower.includes('deliver')) return 'text-emerald-400';
    if (lower.includes('transit')) return 'text-blue-400';
    if (lower.includes('out for')) return 'text-amber-400';
    if (lower.includes('not found')) return 'text-red-400';
    if (lower.includes('exception')) return 'text-red-400';
    if (lower.includes('pending') || lower.includes('pre')) return 'text-slate-400';
    return 'text-slate-400';
  };

  const saveTTL = async () => {
    const result = await apiCall('/cache/settings', 'POST', ttl);
    toast({ title: result.ok ? "✅ تم حفظ إعدادات TTL" : "❌ فشل الحفظ" });
  };

  const handleFlush = async () => {
    let body: any = {};
    if (flushMode === 'expired') body = { mode: 'expired' };
    else if (flushMode === 'status') body = { mode: 'status', status: flushStatus };
    else if (flushMode === 'age') body = { mode: 'age', maxAgeMinutes: flushAge };
    const result = await apiCall('/cache/flush', 'POST', body);
    const msg = result.data?.message || (result.ok ? 'تم المسح' : 'فشل المسح');
    toast({ title: result.ok ? `✅ ${msg}` : `❌ ${msg}`, variant: result.ok ? "default" : "destructive" });
    setConfirmFlush(false);
    fetchEntries();
    refetchStats();
  };

  const deleteEntry = async (hash: string) => {
    await apiCall(`/cache/${encodeURIComponent(hash)}`, 'DELETE');
    toast({ title: "✅ تم مسح الإدخال" });
    fetchEntries();
    refetchStats();
  };

  const deleteByTrackingNumber = async () => {
    if (!deleteQuery.trim()) return;
    await apiCall(`/cache/${encodeURIComponent(deleteQuery.trim())}`, 'DELETE');
    toast({ title: "✅ تم مسح الإدخال" });
    setDeleteQuery('');
    fetchEntries();
    refetchStats();
  };

  const exportCSV = () => {
    if (!entriesData.entries.length) return;
    const headers = ['رقم التتبع', 'الناقل', 'الحالة', 'تاريخ التخزين', 'تاريخ الانتهاء', 'الإصابات'];
    const rows = entriesData.entries.map(e => [e.trackingNumberHash, e.carrier, e.status, e.cachedAt, e.expiresAt, e.hitCount]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cache-entries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const formatTime = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }); } catch { return dateStr; }
  };

  const formatMinutes = (m: number) => {
    if (m >= 1440) return `${Math.round(m / 1440)} يوم`;
    if (m >= 60) return `${Math.round(m / 60)} ساعة`;
    return `${m} دقيقة`;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
          {isLive ? '● متصل — تحديث تلقائي كل 15 ثانية' : '○ غير متصل'}
        </span>
        <button onClick={() => { refetchStats(); fetchEntries(); }} className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <RefreshCw size={10} /> تحديث
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map(c => (
          <div key={c.label} className={`rounded-xl border border-white/[0.06] ${c.bg} p-4`}>
            <c.icon size={16} className={`${c.color} mb-2`} />
            <p className="text-[10px] text-slate-500">{c.label}</p>
            <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-white">إعدادات مدة الصلاحية (TTL)</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ttlFields.map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-[11px] text-slate-400">{f.label}</label>
              <div className="flex items-center gap-1">
                <input type="number" value={ttl[f.key]} dir="ltr"
                  onChange={e => setTtl(prev => ({ ...prev, [f.key]: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <span className="text-[10px] text-slate-500 w-8">دقيقة</span>
              </div>
              <p className="text-[9px] text-slate-600">الافتراضي: {f.desc}</p>
            </div>
          ))}
        </div>
        <button onClick={saveTTL} className="mt-4 px-4 py-2 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
          حفظ إعدادات TTL
        </button>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 size={16} className="text-red-400" />
          <h3 className="text-sm font-semibold text-white">إجراءات المسح</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400">مسح يدوي برقم التتبع</p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input placeholder="أدخل رقم التتبع الكامل..." value={deleteQuery} onChange={e => setDeleteQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && deleteByTrackingNumber()}
                  className="w-full bg-slate-800 border border-white/[0.08] rounded-lg pr-8 pl-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <button onClick={deleteByTrackingNumber} disabled={!deleteQuery.trim()}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-40">
                مسح
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] text-slate-400">مسح جماعي</p>
            <div className="flex flex-wrap items-center gap-2">
              <select value={flushMode} onChange={e => setFlushMode(e.target.value as any)} dir="rtl"
                className="bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="all">مسح الكل</option>
                <option value="expired">المنتهية فقط</option>
                <option value="status">حسب الحالة</option>
                <option value="age">حسب العمر</option>
              </select>

              {flushMode === 'status' && (
                <select value={flushStatus} onChange={e => setFlushStatus(e.target.value)} dir="rtl"
                  className="bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="not found">غير موجود</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="in transit">في الطريق</option>
                  <option value="unknown">غير معروف</option>
                  <option value="exception">استثناء</option>
                </select>
              )}

              {flushMode === 'age' && (
                <div className="flex items-center gap-1">
                  <input type="number" value={flushAge} onChange={e => setFlushAge(parseInt(e.target.value) || 0)} dir="ltr"
                    className="w-20 bg-slate-800 border border-white/[0.08] rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-[10px] text-slate-500">دقيقة</span>
                </div>
              )}

              {confirmFlush ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertTriangle size={12} className="text-red-400" />
                  <span className="text-[10px] text-red-400">هل أنت متأكد؟</span>
                  <button onClick={handleFlush} className="px-2 py-1 text-[10px] rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">تأكيد</button>
                  <button onClick={() => setConfirmFlush(false)} className="px-2 py-1 text-[10px] rounded bg-slate-700 text-slate-400">إلغاء</button>
                </div>
              ) : (
                <button onClick={() => setConfirmFlush(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={12} /> تنفيذ المسح
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">مدخلات الكاش</h3>
            <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{entriesData.total} إدخال</span>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition-colors">
            <Download size={10} /> تصدير CSV
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input placeholder="بحث برقم التتبع أو الناقل أو الحالة..."
              value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg pr-8 pl-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-1">
            <Filter size={12} className="text-slate-500" />
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} dir="rtl"
              className="bg-slate-800 border border-white/[0.08] rounded-lg px-2 py-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="">كل الحالات</option>
              <option value="delivered">تم التسليم</option>
              <option value="in transit">في الطريق</option>
              <option value="not found">غير موجود</option>
              <option value="unknown">غير معروف</option>
              <option value="exception">استثناء</option>
            </select>
            <select value={filterExpired} onChange={e => { setFilterExpired(e.target.value); setCurrentPage(1); }} dir="rtl"
              className="bg-slate-800 border border-white/[0.08] rounded-lg px-2 py-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="">الكل</option>
              <option value="false">صالحة</option>
              <option value="true">منتهية</option>
            </select>
          </div>
        </div>

        {loadingEntries && entriesData.entries.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">جاري التحميل...</div>
        ) : entriesData.entries.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">لا توجد مدخلات في الكاش</div>
        ) : (
          <>
            <div className="overflow-x-auto" dir="ltr">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-white/[0.06]">
                    <th className="text-left py-2 px-2">رقم التتبع</th>
                    <th className="text-left py-2 px-2">الناقل</th>
                    <th className="text-left py-2 px-2">الحالة</th>
                    <th className="text-left py-2 px-2">تاريخ التخزين</th>
                    <th className="text-left py-2 px-2">تاريخ الانتهاء</th>
                    <th className="text-left py-2 px-2">الإصابات</th>
                    <th className="text-left py-2 px-2">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {entriesData.entries.map((entry, i) => (
                    <tr key={i} className={`border-b border-white/[0.03] hover:bg-white/[0.02] ${entry.expired ? 'opacity-50' : ''}`}>
                      <td className="py-2 px-2 font-mono text-slate-300 text-[10px]">{entry.trackingNumberHash}</td>
                      <td className="py-2 px-2 text-slate-300">{entry.carrier}</td>
                      <td className={`py-2 px-2 font-medium ${statusColor(entry.status)}`}>
                        {entry.status}
                        {entry.expired && <span className="ml-1 text-[8px] text-red-500">(منتهي)</span>}
                      </td>
                      <td className="py-2 px-2 text-slate-400 text-[10px]">{formatTime(entry.cachedAt)}</td>
                      <td className="py-2 px-2 text-slate-400 text-[10px]">{formatTime(entry.expiresAt)}</td>
                      <td className="py-2 px-2 text-blue-400 font-semibold">{entry.hitCount}</td>
                      <td className="py-2 px-2">
                        <button onClick={() => deleteEntry(entry.trackingNumberHash)} className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors" title="مسح">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {entriesData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4" dir="ltr">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] text-slate-500">
                  {currentPage} / {entriesData.totalPages}
                </span>
                <button onClick={() => setCurrentPage(p => Math.min(entriesData.totalPages, p + 1))} disabled={currentPage >= entriesData.totalPages}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

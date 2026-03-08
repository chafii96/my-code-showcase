import { useState, useEffect, useCallback } from "react";
import { Clock, Database, Download, Filter, RefreshCw, Search, Trash2, Zap, AlertTriangle, ChevronLeft, ChevronRight, HardDrive, TrendingUp, X } from "lucide-react";
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

function DonutChart({ hitRate }: { hitRate: number }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const hitPct = Math.min(Math.max(hitRate, 0), 100);
  const missPct = 100 - hitPct;
  const hitDash = (hitPct / 100) * c;
  const missDash = (missPct / 100) * c;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" stroke="url(#hitGrad)" strokeWidth="8"
            strokeDasharray={`${hitDash} ${c - hitDash}`} strokeLinecap="round" className="transition-all duration-700" />
          <defs>
            <linearGradient id="hitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{hitPct}%</span>
          <span className="text-[9px] text-slate-500">إصابة</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400" />
          <span className="text-[11px] text-slate-400">إصابة: {hitPct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <span className="text-[11px] text-slate-400">فائت: {missPct}%</span>
        </div>
      </div>
    </div>
  );
}

function MemoryGauge({ usedMB, maxMB = 512 }: { usedMB: number; maxMB?: number }) {
  const pct = Math.min((usedMB / maxMB) * 100, 100);
  const r = 38;
  const c = 2 * Math.PI * r;
  const halfC = c * 0.75;
  const fill = (pct / 100) * halfC;
  const color = pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#34d399";

  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: "rotate(135deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"
          strokeDasharray={`${halfC} ${c - halfC}`} strokeLinecap="round" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${fill} ${c - fill}`} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <HardDrive size={14} className="text-slate-500 mb-0.5" />
        <span className="text-sm font-bold text-white">{usedMB}</span>
        <span className="text-[8px] text-slate-500">MB / {maxMB}</span>
      </div>
    </div>
  );
}

function FlushModal({ open, onClose, onConfirm, mode }: { open: boolean; onClose: () => void; onConfirm: () => void; mode: string }) {
  if (!open) return null;
  const labels: Record<string, string> = { all: "مسح جميع الكاش", expired: "مسح المنتهية فقط", status: "مسح حسب الحالة", age: "مسح حسب العمر" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-red-500/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">تأكيد عملية المسح</h3>
            <p className="text-xs text-slate-400">{labels[mode] || "مسح الكاش"}</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          هل أنت متأكد من رغبتك في تنفيذ هذه العملية؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف البيانات المحددة نهائياً.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors">
            إلغاء
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center gap-2">
            <Trash2 size={14} /> تأكيد المسح
          </button>
        </div>
      </div>
    </div>
  );
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
    { label: 'إجمالي المُخزَّن', value: Number(stats.totalEntries).toLocaleString(), icon: Database, gradient: 'from-blue-500/20 to-cyan-500/10', iconColor: 'text-blue-400', borderColor: 'border-blue-500/20' },
    { label: 'معدل الإصابة اليوم', value: `${stats.hitRateToday}%`, icon: TrendingUp, gradient: 'from-emerald-500/20 to-green-500/10', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
    { label: 'استدعاءات محفوظة', value: Number(stats.apiCallsSaved).toLocaleString(), icon: RefreshCw, gradient: 'from-amber-500/20 to-orange-500/10', iconColor: 'text-amber-400', borderColor: 'border-amber-500/20' },
    { label: 'أموال مُوفَّرة', value: `$${Number(stats.moneySaved).toFixed(2)}`, icon: Zap, gradient: 'from-rose-500/20 to-pink-500/10', iconColor: 'text-rose-400', borderColor: 'border-rose-500/20' },
  ];

  const ttlFields: { key: keyof CacheTTLSettings; label: string; desc: string; max: number }[] = [
    { key: 'delivered', label: 'تم التسليم', desc: '24 ساعة', max: 2880 },
    { key: 'inTransit', label: 'في الطريق', desc: '2 ساعة', max: 480 },
    { key: 'outForDelivery', label: 'جاري التوصيل', desc: '30 دقيقة', max: 120 },
    { key: 'pending', label: 'قيد الانتظار', desc: '60 دقيقة', max: 240 },
    { key: 'exception', label: 'استثناء', desc: '15 دقيقة', max: 120 },
    { key: 'preShipment', label: 'ما قبل الشحن', desc: '60 دقيقة', max: 240 },
    { key: 'unknown', label: 'غير معروف', desc: '30 دقيقة', max: 120 },
    { key: 'notFound', label: 'غير موجود', desc: '5 دقائق', max: 60 },
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

  const statusBg = (s: string) => {
    const lower = s.toLowerCase();
    if (lower.includes('deliver')) return 'bg-emerald-500/10 border-emerald-500/20';
    if (lower.includes('transit')) return 'bg-blue-500/10 border-blue-500/20';
    if (lower.includes('out for')) return 'bg-amber-500/10 border-amber-500/20';
    if (lower.includes('not found')) return 'bg-red-500/10 border-red-500/20';
    if (lower.includes('exception')) return 'bg-red-500/10 border-red-500/20';
    return 'bg-slate-500/10 border-slate-500/20';
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
      <FlushModal open={confirmFlush} onClose={() => setConfirmFlush(false)} onConfirm={handleFlush} mode={flushMode} />

      <div className="flex items-center justify-between">
        <span className={`text-[10px] px-3 py-1 rounded-full backdrop-blur-sm ${isLive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-600/20'}`}>
          {isLive ? '● متصل — تحديث تلقائي كل 15 ثانية' : '○ غير متصل'}
        </span>
        <button onClick={() => { refetchStats(); fetchEntries(); }} className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all">
          <RefreshCw size={10} /> تحديث
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(c => (
          <div key={c.label} className={`bg-slate-800/60 border ${c.borderColor} rounded-2xl backdrop-blur-sm p-4 bg-gradient-to-br ${c.gradient} transition-all hover:scale-[1.02]`}>
            <div className={`w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3`}>
              <c.icon size={16} className={c.iconColor} />
            </div>
            <p className="text-[10px] text-slate-500 mb-0.5">{c.label}</p>
            <p className={`text-xl font-bold ${c.iconColor}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400" />
            نسبة الإصابة / الفقد
          </h3>
          <DonutChart hitRate={stats.hitRateToday} />
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-5 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2 self-start">
            <HardDrive size={14} className="text-purple-400" />
            استخدام الذاكرة
          </h3>
          <MemoryGauge usedMB={stats.memoryUsedMB} />
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            <Clock size={14} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">إعدادات مدة الصلاحية (TTL)</h3>
            <p className="text-[10px] text-slate-500">تحكم في مدة تخزين كل حالة بالدقائق</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ttlFields.map(f => (
            <div key={f.key} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-slate-300">{f.label}</label>
                <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">{formatMinutes(ttl[f.key])}</span>
              </div>
              <input
                type="range"
                min={1}
                max={f.max}
                value={ttl[f.key]}
                onChange={e => setTtl(prev => ({ ...prev, [f.key]: parseInt(e.target.value) || 0 }))}
                className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/30"
              />
              <div className="flex items-center justify-between">
                <input type="number" value={ttl[f.key]} dir="ltr"
                  onChange={e => setTtl(prev => ({ ...prev, [f.key]: parseInt(e.target.value) || 0 }))}
                  className="w-16 bg-slate-800 border border-white/[0.08] rounded-lg px-2 py-1 text-[10px] text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <p className="text-[9px] text-slate-600">الافتراضي: {f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={saveTTL} className="mt-4 px-5 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all">
          حفظ إعدادات TTL
        </button>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
            <Trash2 size={14} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">إجراءات المسح</h3>
            <p className="text-[10px] text-slate-500">مسح يدوي أو جماعي لمدخلات الكاش</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 space-y-3">
            <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Search size={12} className="text-amber-400" /> مسح يدوي برقم التتبع
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input placeholder="أدخل رقم التتبع الكامل..." value={deleteQuery} onChange={e => setDeleteQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && deleteByTrackingNumber()}
                  className="w-full bg-slate-900/80 border border-white/[0.08] rounded-xl pr-8 pl-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all" />
              </div>
              <button onClick={deleteByTrackingNumber} disabled={!deleteQuery.trim()}
                className="px-4 py-2.5 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-40">
                مسح
              </button>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 space-y-3">
            <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Trash2 size={12} className="text-red-400" /> مسح جماعي
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <select value={flushMode} onChange={e => setFlushMode(e.target.value as any)} dir="rtl"
                className="bg-slate-900/80 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="all">مسح الكل</option>
                <option value="expired">المنتهية فقط</option>
                <option value="status">حسب الحالة</option>
                <option value="age">حسب العمر</option>
              </select>

              {flushMode === 'status' && (
                <select value={flushStatus} onChange={e => setFlushStatus(e.target.value)} dir="rtl"
                  className="bg-slate-900/80 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
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
                    className="w-20 bg-slate-900/80 border border-white/[0.08] rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-[10px] text-slate-500">دقيقة</span>
                </div>
              )}

              <button onClick={() => setConfirmFlush(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 transition-all shadow-lg shadow-red-500/5">
                <Trash2 size={12} /> تنفيذ المسح
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <Database size={14} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">مدخلات الكاش</h3>
              <span className="text-[10px] text-slate-500">{entriesData.total} إدخال</span>
            </div>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-medium bg-slate-700/50 text-slate-300 border border-slate-600/30 hover:bg-slate-700 transition-colors">
            <Download size={10} /> تصدير CSV
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input placeholder="بحث برقم التتبع أو الناقل أو الحالة..."
              value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-900/80 border border-white/[0.08] rounded-xl pr-8 pl-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-slate-500" />
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} dir="rtl"
              className="bg-slate-900/80 border border-white/[0.08] rounded-xl px-2 py-2.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="">كل الحالات</option>
              <option value="delivered">تم التسليم</option>
              <option value="in transit">في الطريق</option>
              <option value="not found">غير موجود</option>
              <option value="unknown">غير معروف</option>
              <option value="exception">استثناء</option>
            </select>
            <select value={filterExpired} onChange={e => { setFilterExpired(e.target.value); setCurrentPage(1); }} dir="rtl"
              className="bg-slate-900/80 border border-white/[0.08] rounded-xl px-2 py-2.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="">الكل</option>
              <option value="false">صالحة</option>
              <option value="true">منتهية</option>
            </select>
          </div>
        </div>

        {loadingEntries && entriesData.entries.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <RefreshCw size={20} className="mx-auto mb-2 animate-spin opacity-30" />
            جاري التحميل...
          </div>
        ) : entriesData.entries.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <Database size={24} className="mx-auto mb-2 opacity-20" />
            لا توجد مدخلات في الكاش
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-white/[0.05]" dir="ltr">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 bg-slate-900/50">
                    <th className="text-left py-3 px-3 font-medium">رقم التتبع</th>
                    <th className="text-left py-3 px-3 font-medium">الناقل</th>
                    <th className="text-left py-3 px-3 font-medium">الحالة</th>
                    <th className="text-left py-3 px-3 font-medium">تاريخ التخزين</th>
                    <th className="text-left py-3 px-3 font-medium">تاريخ الانتهاء</th>
                    <th className="text-left py-3 px-3 font-medium">الإصابات</th>
                    <th className="text-left py-3 px-3 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {entriesData.entries.map((entry, i) => (
                    <tr key={i} className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'} ${entry.expired ? 'opacity-50' : ''}`}>
                      <td className="py-2.5 px-3 font-mono text-slate-300 text-[10px]">{entry.trackingNumberHash}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded-lg text-[10px]">{entry.carrier}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium border ${statusBg(entry.status)} ${statusColor(entry.status)}`}>
                          {entry.status}
                          {entry.expired && <span className="mr-1 text-[8px] text-red-500">(منتهي)</span>}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[10px]">{formatTime(entry.cachedAt)}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-[10px]">{formatTime(entry.expiresAt)}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-lg text-[10px]">{entry.hitCount}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <button onClick={() => deleteEntry(entry.trackingNumberHash)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="مسح">
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
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/[0.06] disabled:opacity-30 transition-all">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                  {currentPage} / {entriesData.totalPages}
                </span>
                <button onClick={() => setCurrentPage(p => Math.min(entriesData.totalPages, p + 1))} disabled={currentPage >= entriesData.totalPages}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/[0.06] disabled:opacity-30 transition-all">
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

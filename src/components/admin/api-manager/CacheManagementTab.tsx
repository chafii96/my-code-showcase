import { useState } from "react";
import { Database, Download, RefreshCw, Search, Trash2, Zap } from "lucide-react";
import { CacheEntry, CacheStats, CacheTTLSettings } from "./types";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

export default function CacheManagementTab() {
  const { data: stats, isLive } = useApiData<CacheStats>('/cache/stats', { totalEntries: 0, hitRateToday: 0, memoryUsedMB: 0, apiCallsSaved: 0, moneySaved: 0 }, { pollingInterval: 30000 });
  const { data: ttl, setData: setTtl } = useApiData<CacheTTLSettings>('/cache/settings', { delivered: 1440, inTransit: 120, outForDelivery: 30, pending: 60, exception: 15, preShipment: 60, unknown: 30, notFound: 30 });
  const { data: entries, refetch: refetchEntries } = useApiData<CacheEntry[]>('/cache/entries', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmFlush, setConfirmFlush] = useState(false);

  const statCards = [
    { label: 'إجمالي المُخزَّن', value: Number(stats.totalEntries).toLocaleString(), icon: Database, color: 'text-blue-400' },
    { label: 'معدل الإصابة اليوم', value: `${stats.hitRateToday}%`, icon: Zap, color: 'text-emerald-400' },
    { label: 'الذاكرة المستخدمة', value: `${stats.memoryUsedMB} MB`, icon: Database, color: 'text-purple-400' },
    { label: 'استدعاءات محفوظة', value: Number(stats.apiCallsSaved).toLocaleString(), icon: RefreshCw, color: 'text-amber-400' },
    { label: 'أموال مُوفَّرة', value: `$${Number(stats.moneySaved).toFixed(2)}`, icon: Zap, color: 'text-rose-400' },
  ];

  const ttlFields: { key: keyof CacheTTLSettings; label: string }[] = [
    { key: 'delivered', label: 'تم التسليم' },
    { key: 'inTransit', label: 'في الطريق' },
    { key: 'outForDelivery', label: 'جاري التوصيل' },
    { key: 'pending', label: 'قيد الانتظار' },
    { key: 'exception', label: 'استثناء' },
    { key: 'preShipment', label: 'ما قبل الشحن' },
    { key: 'unknown', label: 'غير معروف' },
    { key: 'notFound', label: 'غير موجود (سلبي)' },
  ];

  const statusColor = (s: string) => {
    const map: Record<string, string> = { 'Delivered': 'text-emerald-400', 'In Transit': 'text-blue-400', 'Out for Delivery': 'text-amber-400', 'Pending': 'text-slate-400', 'Exception': 'text-red-400' };
    return map[s] || 'text-slate-400';
  };

  const saveTTL = async () => {
    const result = await apiCall('/cache/settings', 'POST', ttl);
    toast({ title: result.ok ? "✅ تم حفظ إعدادات TTL" : "❌ فشل الحفظ" });
  };

  const flushAll = async () => {
    const result = await apiCall('/cache/flush', 'POST');
    toast({ title: result.ok ? "✅ تم مسح الكاش بالكامل" : "❌ فشل المسح", variant: result.ok ? "default" : "destructive" });
    setConfirmFlush(false);
    refetchEntries();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-start">
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
          {isLive ? '● متصل' : '○ غير متصل'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map(c => (
          <div key={c.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <c.icon size={16} className={`${c.color} mb-2`} />
            <p className="text-[10px] text-slate-500">{c.label}</p>
            <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-4">إعدادات مدة الصلاحية (TTL)</h3>
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
            </div>
          ))}
        </div>
        <button onClick={saveTTL} className="mt-4 px-4 py-2 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
          حفظ إعدادات TTL
        </button>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-4">إجراءات الكاش</h3>
        <div className="flex flex-wrap gap-3">
          {confirmFlush ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="text-xs text-red-400">هل أنت متأكد؟</span>
              <button onClick={flushAll} className="px-2 py-1 text-[10px] rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">تأكيد المسح</button>
              <button onClick={() => setConfirmFlush(false)} className="px-2 py-1 text-[10px] rounded bg-slate-700 text-slate-400">إلغاء</button>
            </div>
          ) : (
            <button onClick={() => setConfirmFlush(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
              <Trash2 size={12} /> مسح كل الكاش
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input placeholder="رقم التتبع..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-white/[0.08] rounded-lg pr-8 pl-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-48" />
            </div>
            <button onClick={() => { if (searchQuery) { apiCall(`/cache/${searchQuery}`, 'DELETE'); refetchEntries(); toast({ title: "تم مسح الإدخال" }); } }}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
              مسح بالرقم
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition-colors">
            <Download size={12} /> تصدير CSV
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-4">مدخلات الكاش</h3>
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
              {(Array.isArray(entries) ? entries : []).map((entry, i) => (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2 px-2 font-mono text-slate-300">{entry.trackingNumberHash}</td>
                  <td className="py-2 px-2 text-slate-300">{entry.carrier}</td>
                  <td className={`py-2 px-2 font-medium ${statusColor(entry.status)}`}>{entry.status}</td>
                  <td className="py-2 px-2 text-slate-400">{new Date(entry.cachedAt).toLocaleString('ar')}</td>
                  <td className="py-2 px-2 text-slate-400">{new Date(entry.expiresAt).toLocaleString('ar')}</td>
                  <td className="py-2 px-2 text-blue-400 font-semibold">{entry.hitCount}</td>
                  <td className="py-2 px-2">
                    <div className="flex gap-1">
                      <button onClick={() => { apiCall(`/cache/${entry.trackingNumberHash}`, 'DELETE'); refetchEntries(); }} className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                      <button className="p-1 rounded text-slate-500 hover:text-blue-400 transition-colors"><RefreshCw size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { Edit, Plus, Save, Search, Trash2, X, BarChart3, CheckCircle, XCircle, Package, Truck, Send, Box, Globe2, Plane } from "lucide-react";
import { CarrierPattern, TrackingLog } from "./types";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

interface PatternForm {
  carrier: string;
  pattern: string;
  priority: number;
  example: string;
}

const emptyForm: PatternForm = { carrier: '', pattern: '', priority: 10, example: '' };

const CARRIER_ICONS: Record<string, typeof Package> = {
  'USPS': Send,
  'UPS': Truck,
  'FedEx': Box,
  'DHL': Plane,
  'Amazon': Package,
};

const CARRIER_COLORS: Record<string, string> = {
  'USPS': 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
  'UPS': 'from-amber-500/20 to-amber-600/10 border-amber-500/20',
  'FedEx': 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
  'DHL': 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20',
  'Amazon': 'from-orange-500/20 to-orange-600/10 border-orange-500/20',
};

const CARRIER_TEXT: Record<string, string> = {
  'USPS': 'text-blue-400',
  'UPS': 'text-amber-400',
  'FedEx': 'text-purple-400',
  'DHL': 'text-yellow-400',
  'Amazon': 'text-orange-400',
};

export default function CarrierDetectionTab() {
  const { data: patterns, setData: setPatterns, isLive, refetch } = useApiData<CarrierPattern[]>('/carrier-patterns', []);
  const { data: logs } = useApiData<TrackingLog[]>('/tracking-logs?limit=500', []);
  const [testInput, setTestInput] = useState('');
  const [detectedCarrier, setDetectedCarrier] = useState<string | null>(null);
  const [matchedPatternId, setMatchedPatternId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PatternForm>(emptyForm);
  const [testing, setTesting] = useState(false);

  const safePatterns = Array.isArray(patterns) ? patterns : [];
  const safeLogs = Array.isArray(logs) ? logs : [];

  const carrierStats = useMemo(() => {
    const stats: Record<string, { total: number; success: number; error: number; notFound: number }> = {};
    for (const log of safeLogs) {
      const c = log.carrier || 'unknown';
      if (!stats[c]) stats[c] = { total: 0, success: 0, error: 0, notFound: 0 };
      stats[c].total++;
      if (log.status === 'success') stats[c].success++;
      else if (log.status === 'error') stats[c].error++;
      else if (log.status === 'not_found') stats[c].notFound++;
    }
    return stats;
  }, [safeLogs]);

  const maxTotal = useMemo(() => Math.max(...Object.values(carrierStats).map(s => s.total), 1), [carrierStats]);

  const supportedCarriers = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const p of safePatterns) {
      if (!map[p.carrier]) map[p.carrier] = [];
      map[p.carrier].push(p.pattern);
    }
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [safePatterns]);

  const testDetection = async () => {
    if (!testInput.trim()) return;
    setTesting(true);
    setMatchedPatternId(null);
    const result = await apiCall('/carrier-patterns/detect', 'POST', { trackingNumber: testInput });
    if (result.ok && result.data?.carrier) {
      setDetectedCarrier(result.data.carrier);
      const matched = safePatterns.find(p => {
        try { return new RegExp(p.pattern).test(testInput); } catch { return false; }
      });
      if (matched) setMatchedPatternId(matched.id);
      setTesting(false);
      return;
    }
    const sorted = [...safePatterns].sort((a, b) => a.priority - b.priority);
    for (const p of sorted) {
      try {
        if (new RegExp(p.pattern).test(testInput)) {
          setDetectedCarrier(p.carrier);
          setMatchedPatternId(p.id);
          setTesting(false);
          return;
        }
      } catch {}
    }
    setDetectedCarrier('غير معروف');
    setTesting(false);
  };

  const deletePattern = async (id: string) => {
    setPatterns(prev => (Array.isArray(prev) ? prev : []).filter(p => p.id !== id));
    await apiCall(`/carrier-patterns/${id}`, 'DELETE');
    toast({ title: "تم حذف النمط بنجاح" });
  };

  const handleSave = async () => {
    if (!form.carrier || !form.pattern) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    try { new RegExp(form.pattern); } catch {
      toast({ title: "نمط Regex غير صالح", variant: "destructive" });
      return;
    }

    if (editingId) {
      const updated = { ...form, id: editingId };
      setPatterns(prev => (Array.isArray(prev) ? prev : []).map(p => p.id === editingId ? { ...p, ...updated } : p));
      await apiCall(`/carrier-patterns/${editingId}`, 'PUT', updated);
      toast({ title: "تم تحديث النمط بنجاح" });
    } else {
      const newPattern: CarrierPattern = { id: `cp_${Date.now()}`, ...form };
      setPatterns(prev => [...(Array.isArray(prev) ? prev : []), newPattern]);
      await apiCall('/carrier-patterns', 'POST', newPattern);
      toast({ title: "تم إضافة النمط بنجاح" });
    }
    setForm(emptyForm);
    setShowModal(false);
    setEditingId(null);
    refetch();
  };

  const startEdit = (p: CarrierPattern) => {
    setEditingId(p.id);
    setForm({ carrier: p.carrier, pattern: p.pattern, priority: p.priority, example: p.example });
    setShowModal(true);
  };

  const cancelForm = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const getCarrierIcon = (carrier: string) => {
    const Icon = CARRIER_ICONS[carrier] || Globe2;
    return Icon;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center">
            <Search size={16} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">قواعد اكتشاف الناقل</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                {isLive ? '● متصل' : '○ غير متصل'}
              </span>
              <span className="text-[10px] text-slate-500">{safePatterns.length} نمط مسجل</span>
            </div>
          </div>
        </div>
        <button onClick={() => { setShowModal(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/20">
          <Plus size={16} /> إضافة نمط
        </button>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Search size={18} className="text-blue-400" />
          <h3 className="text-base font-bold text-white">اختبار اكتشاف الناقل</h3>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Package size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={testInput} onChange={e => { setTestInput(e.target.value); setDetectedCarrier(null); setMatchedPatternId(null); }}
              onKeyDown={e => e.key === 'Enter' && testDetection()}
              placeholder="أدخل رقم التتبع للاختبار..." dir="ltr"
              className="w-full bg-slate-800/80 border border-white/[0.1] rounded-xl pr-12 pl-4 py-4 text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono" />
          </div>
          <button onClick={testDetection} disabled={testing || !testInput.trim()}
            className="px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
            {testing ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري...</span>
            ) : (
              <span className="flex items-center gap-2"><Search size={16} /> اكتشاف</span>
            )}
          </button>
        </div>
        {detectedCarrier && (
          <div className={`mt-4 px-5 py-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
            detectedCarrier !== 'غير معروف'
              ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20'
              : 'bg-gradient-to-r from-red-500/10 to-red-600/5 border border-red-500/20'
          }`}>
            {detectedCarrier !== 'غير معروف' ? (
              <>
                {(() => { const Icon = getCarrierIcon(detectedCarrier); return <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CARRIER_COLORS[detectedCarrier] || 'from-slate-500/20 to-slate-600/10 border-slate-500/20'} border flex items-center justify-center`}><Icon size={18} className={CARRIER_TEXT[detectedCarrier] || 'text-slate-400'} /></div>; })()}
                <div>
                  <div className="text-emerald-400 flex items-center gap-1.5"><CheckCircle size={14} /> تم الاكتشاف بنجاح</div>
                  <div className="text-white font-bold text-lg">{detectedCarrier}</div>
                </div>
                {matchedPatternId && (
                  <div className="mr-auto bg-slate-800/60 rounded-lg px-3 py-1.5">
                    <span className="text-[10px] text-slate-400 block">النمط المطابق</span>
                    <code className="text-xs font-mono text-amber-400">{safePatterns.find(p => p.id === matchedPatternId)?.pattern}</code>
                  </div>
                )}
              </>
            ) : (
              <>
                <XCircle size={20} className="text-red-400" />
                <div className="text-red-400">لم يتم التعرف على الناقل — تحقق من الأنماط المسجلة</div>
              </>
            )}
          </div>
        )}
      </div>

      {Object.keys(carrierStats).length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-blue-400" />
            <h3 className="text-base font-bold text-white">إحصائيات الاكتشاف</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(carrierStats).sort((a, b) => b[1].total - a[1].total).map(([carrier, stats]) => {
              const Icon = getCarrierIcon(carrier);
              const pct = Math.round((stats.total / maxTotal) * 100);
              const successPct = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
              const errorPct = stats.total > 0 ? Math.round((stats.error / stats.total) * 100) : 0;
              const notFoundPct = stats.total > 0 ? Math.round((stats.notFound / stats.total) * 100) : 0;
              return (
                <div key={carrier} className="group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${CARRIER_COLORS[carrier] || 'from-slate-500/20 to-slate-600/10 border-slate-500/20'} border flex items-center justify-center flex-shrink-0`}>
                      <Icon size={13} className={CARRIER_TEXT[carrier] || 'text-slate-400'} />
                    </div>
                    <span className="text-xs font-bold text-white w-16">{carrier}</span>
                    <span className="text-[10px] text-slate-500">{stats.total} طلب</span>
                    <div className="mr-auto flex gap-3">
                      <span className="text-[10px] text-emerald-400">{stats.success} نجاح</span>
                      {stats.error > 0 && <span className="text-[10px] text-red-400">{stats.error} خطأ</span>}
                      {stats.notFound > 0 && <span className="text-[10px] text-amber-400">{stats.notFound} غير موجود</span>}
                    </div>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800/60 overflow-hidden flex" style={{ width: `${pct}%`, minWidth: '60px' }}>
                    {successPct > 0 && <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all" style={{ width: `${successPct}%` }} />}
                    {errorPct > 0 && <div className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all" style={{ width: `${errorPct}%` }} />}
                    {notFoundPct > 0 && <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all" style={{ width: `${notFoundPct}%` }} />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[10px] text-slate-400">نجاح</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-[10px] text-slate-400">خطأ</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-[10px] text-slate-400">غير موجود</span></div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">أنماط الاكتشاف ({safePatterns.length})</h3>
        </div>
        <div className="overflow-x-auto" dir="ltr">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-white/[0.06]">
                <th className="text-left py-3 px-5 font-medium text-[11px] uppercase tracking-wider">الأولوية</th>
                <th className="text-left py-3 px-5 font-medium text-[11px] uppercase tracking-wider">الناقل</th>
                <th className="text-left py-3 px-5 font-medium text-[11px] uppercase tracking-wider">النمط (Regex)</th>
                <th className="text-left py-3 px-5 font-medium text-[11px] uppercase tracking-wider">مثال</th>
                <th className="text-left py-3 px-5 font-medium text-[11px] uppercase tracking-wider">الطلبات</th>
                <th className="text-left py-3 px-5 font-medium text-[11px] uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[...safePatterns].sort((a, b) => a.priority - b.priority).map(p => {
                const Icon = getCarrierIcon(p.carrier);
                return (
                  <tr key={p.id} className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-all ${matchedPatternId === p.id ? 'bg-emerald-500/[0.08] ring-1 ring-inset ring-emerald-500/30' : ''}`}>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 text-blue-400 font-bold text-xs">
                        {p.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${CARRIER_COLORS[p.carrier] || 'from-slate-500/20 to-slate-600/10 border-slate-500/20'} border flex items-center justify-center`}>
                          <Icon size={12} className={CARRIER_TEXT[p.carrier] || 'text-slate-400'} />
                        </div>
                        <span className="font-bold text-white">{p.carrier}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <code className="inline-block bg-slate-800/80 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-amber-400 break-all border border-amber-500/10">{p.pattern}</code>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-400 text-[11px]">{p.example || '—'}</td>
                    <td className="py-3.5 px-5">
                      <span className="text-slate-300 font-semibold">{carrierStats[p.carrier]?.total || 0}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit size={13} /></button>
                        <button onClick={() => deletePattern(p.id)} className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {safePatterns.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  <div>لا توجد أنماط — أضف نمط جديد</div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {supportedCarriers.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">الناقلون المدعومون ({supportedCarriers.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {supportedCarriers.map(([carrier, pats]) => {
              const Icon = getCarrierIcon(carrier);
              return (
                <div key={carrier} className={`rounded-xl bg-gradient-to-br ${CARRIER_COLORS[carrier] || 'from-slate-500/10 to-slate-600/5 border-slate-500/15'} border p-4 hover:scale-[1.02] transition-transform`}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center`}>
                      <Icon size={16} className={CARRIER_TEXT[carrier] || 'text-slate-400'} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{carrier}</div>
                      <div className="text-[10px] text-slate-400">{pats.length} نمط</div>
                    </div>
                    {carrierStats[carrier] && (
                      <div className="mr-auto text-left">
                        <div className="text-xs font-bold text-white">{carrierStats[carrier].total}</div>
                        <div className="text-[9px] text-slate-500">طلب</div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {pats.map((pat, i) => (
                      <code key={i} className="block text-[10px] font-mono text-amber-400/80 bg-black/20 px-2 py-1 rounded-md break-all" dir="ltr">{pat}</code>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={cancelForm}>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/[0.1] rounded-2xl p-6 max-w-lg w-full mx-4 space-y-5 shadow-2xl" dir="rtl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center">
                  {editingId ? <Edit size={16} className="text-blue-400" /> : <Plus size={16} className="text-blue-400" />}
                </div>
                <h3 className="text-base font-bold text-white">{editingId ? 'تعديل النمط' : 'إضافة نمط جديد'}</h3>
              </div>
              <button onClick={cancelForm} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">اسم الناقل *</label>
                <input value={form.carrier} onChange={e => setForm(f => ({ ...f, carrier: e.target.value }))}
                  placeholder="مثال: USPS" dir="ltr"
                  className="w-full bg-slate-800/80 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">الأولوية</label>
                <input type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-800/80 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                <span className="text-[10px] text-slate-500">رقم أقل = أولوية أعلى</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">نمط Regex *</label>
              <input value={form.pattern} onChange={e => setForm(f => ({ ...f, pattern: e.target.value }))}
                placeholder="^(94|93|92|91)\d{18,22}$" dir="ltr"
                className="w-full bg-slate-800/80 border border-white/[0.1] rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              <span className="text-[10px] text-slate-500">يستخدم تعبيرات JavaScript العادية</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">مثال رقم تتبع</label>
              <input value={form.example} onChange={e => setForm(f => ({ ...f, example: e.target.value }))}
                placeholder="9400111899223033258" dir="ltr"
                className="w-full bg-slate-800/80 border border-white/[0.1] rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-white/[0.06]">
              <button onClick={cancelForm} className="px-5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all">إلغاء</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/20">
                <Save size={14} /> {editingId ? 'تحديث النمط' : 'حفظ النمط'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { Edit, Plus, Save, Search, Trash2, X, BarChart3, CheckCircle } from "lucide-react";
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

export default function CarrierDetectionTab() {
  const { data: patterns, setData: setPatterns, isLive, refetch } = useApiData<CarrierPattern[]>('/carrier-patterns', []);
  const { data: logs } = useApiData<TrackingLog[]>('/tracking-logs?limit=500', []);
  const [testInput, setTestInput] = useState('');
  const [detectedCarrier, setDetectedCarrier] = useState<string | null>(null);
  const [matchedPatternId, setMatchedPatternId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PatternForm>(emptyForm);

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
    setMatchedPatternId(null);
    const result = await apiCall('/carrier-patterns/detect', 'POST', { trackingNumber: testInput });
    if (result.ok && result.data?.carrier) {
      setDetectedCarrier(result.data.carrier);
      const matched = safePatterns.find(p => {
        try { return new RegExp(p.pattern).test(testInput); } catch { return false; }
      });
      if (matched) setMatchedPatternId(matched.id);
      return;
    }
    const sorted = [...safePatterns].sort((a, b) => a.priority - b.priority);
    for (const p of sorted) {
      try {
        if (new RegExp(p.pattern).test(testInput)) {
          setDetectedCarrier(p.carrier);
          setMatchedPatternId(p.id);
          return;
        }
      } catch {}
    }
    setDetectedCarrier('غير معروف');
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
    setShowAddForm(false);
    setEditingId(null);
    refetch();
  };

  const startEdit = (p: CarrierPattern) => {
    setEditingId(p.id);
    setForm({ carrier: p.carrier, pattern: p.pattern, priority: p.priority, example: p.example });
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">قواعد اكتشاف الناقل</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
            {isLive ? '● متصل' : '○ غير متصل'}
          </span>
        </div>
        <button onClick={() => { setShowAddForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
          <Plus size={12} /> إضافة نمط
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{editingId ? 'تعديل النمط' : 'إضافة نمط جديد'}</h3>
            <button onClick={cancelForm} className="text-slate-400 hover:text-white"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">اسم الناقل *</label>
              <input value={form.carrier} onChange={e => setForm(f => ({ ...f, carrier: e.target.value }))}
                placeholder="مثال: USPS" dir="ltr"
                className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">الأولوية</label>
              <input type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: parseInt(e.target.value) || 0 }))}
                className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">نمط Regex *</label>
            <input value={form.pattern} onChange={e => setForm(f => ({ ...f, pattern: e.target.value }))}
              placeholder="^(94|93|92|91)\d{18,22}$" dir="ltr"
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">مثال رقم تتبع</label>
            <input value={form.example} onChange={e => setForm(f => ({ ...f, example: e.target.value }))}
              placeholder="9400111899223033258" dir="ltr"
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={cancelForm} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors">إلغاء</button>
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              <Save size={12} /> {editingId ? 'تحديث' : 'حفظ'}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-3">اختبار اكتشاف الناقل</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={testInput} onChange={e => { setTestInput(e.target.value); setDetectedCarrier(null); setMatchedPatternId(null); }}
              onKeyDown={e => e.key === 'Enter' && testDetection()}
              placeholder="أدخل رقم التتبع للاختبار..." dir="ltr"
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg pr-9 pl-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <button onClick={testDetection} className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">اكتشاف</button>
        </div>
        {detectedCarrier && (
          <div className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${detectedCarrier !== 'غير معروف' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {detectedCarrier !== 'غير معروف' && <CheckCircle size={14} />}
            الناقل المكتشف: <span className="font-bold">{detectedCarrier}</span>
            {matchedPatternId && <span className="text-[10px] text-slate-400 mr-2">(النمط: {safePatterns.find(p => p.id === matchedPatternId)?.pattern})</span>}
          </div>
        )}
      </div>

      {Object.keys(carrierStats).length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={14} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">إحصائيات الاكتشاف</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(carrierStats).sort((a, b) => b[1].total - a[1].total).map(([carrier, stats]) => (
              <div key={carrier} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="text-xs font-semibold text-white mb-1">{carrier}</div>
                <div className="text-lg font-bold text-blue-400">{stats.total}</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] text-emerald-400">{stats.success} نجاح</span>
                  {stats.error > 0 && <span className="text-[10px] text-red-400">{stats.error} خطأ</span>}
                  {stats.notFound > 0 && <span className="text-[10px] text-amber-400">{stats.notFound} غير موجود</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full text-xs" dir="ltr">
          <thead>
            <tr className="text-slate-500 border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left py-3 px-4">الأولوية</th>
              <th className="text-left py-3 px-4">الناقل</th>
              <th className="text-left py-3 px-4">النمط (Regex)</th>
              <th className="text-left py-3 px-4">مثال</th>
              <th className="text-left py-3 px-4">الطلبات</th>
              <th className="text-left py-3 px-4">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {[...safePatterns].sort((a, b) => a.priority - b.priority).map(p => (
              <tr key={p.id} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${matchedPatternId === p.id ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''}`}>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">#{p.priority}</span></td>
                <td className="py-3 px-4 font-semibold text-white">{p.carrier}</td>
                <td className="py-3 px-4"><code className="bg-slate-800 px-2 py-1 rounded text-[11px] font-mono text-amber-400 break-all">{p.pattern}</code></td>
                <td className="py-3 px-4 font-mono text-slate-400">{p.example}</td>
                <td className="py-3 px-4 text-slate-400">{carrierStats[p.carrier]?.total || 0}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(p)} className="p-1.5 rounded text-slate-500 hover:text-blue-400 transition-colors"><Edit size={12} /></button>
                    <button onClick={() => deletePattern(p.id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {safePatterns.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-slate-500">لا توجد أنماط — أضف نمط جديد</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {supportedCarriers.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-3">الناقلون المدعومون ({supportedCarriers.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {supportedCarriers.map(([carrier, pats]) => (
              <div key={carrier} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="text-xs font-bold text-white mb-1.5">{carrier}</div>
                <div className="space-y-1">
                  {pats.map((pat, i) => (
                    <code key={i} className="block text-[10px] font-mono text-amber-400/80 bg-slate-800/50 px-1.5 py-0.5 rounded break-all" dir="ltr">{pat}</code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

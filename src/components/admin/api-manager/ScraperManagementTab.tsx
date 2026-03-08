import { useState } from "react";
import { Activity, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Clock, Cpu, Globe, Layers, Play, Power, RefreshCw, Shield, XCircle, Zap, Search, BarChart3, Trash2 } from "lucide-react";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

interface UspsLayer {
  id: string;
  name: string;
  description: string;
  targetUrl: string;
  carrier: string;
  enabled: boolean;
  priority: number;
  uaRotation: boolean;
  timeout: number;
  status: "working" | "broken" | "degraded" | "disabled" | "idle";
  successRate: number | null;
  avgResponseTime: number | null;
  lastSuccess: string;
  lastAttempt: string;
  lastError: string;
  totalAttempts: number;
  totalSuccesses: number;
}

interface TestResult {
  layerId: string;
  ok: boolean;
  latency: number;
  status: string;
  eventsFound: number;
  firstEvent: { status: string; location: string; date: string } | null;
  message: string;
}

const STATUS_META = {
  working:  { icon: CheckCircle,  cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",  label: "يعمل" },
  broken:   { icon: XCircle,      cls: "bg-red-500/20 text-red-400 border-red-500/30",              label: "معطل" },
  degraded: { icon: AlertTriangle, cls: "bg-amber-500/20 text-amber-400 border-amber-500/30",       label: "ضعيف" },
  disabled: { icon: Power,        cls: "bg-slate-600/30 text-slate-500 border-slate-600/40",        label: "متوقف" },
  idle:     { icon: Clock,        cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",            label: "جاهز" },
};

const LAYER_ICONS: Record<string, string> = {
  l1: "🌐", l2: "⚡", l3: "📱", l4: "🔍", l5: "🕷️",
};

const UA_CATEGORIES = [
  { name: "Chrome Win", count: 4 },
  { name: "Chrome Mac", count: 2 },
  { name: "Firefox Win", count: 3 },
  { name: "Firefox Mac", count: 1 },
  { name: "Safari Mac", count: 2 },
  { name: "Edge Win", count: 2 },
  { name: "iPhone Safari", count: 2 },
  { name: "Android Chrome", count: 2 },
  { name: "Android Firefox", count: 1 },
  { name: "Opera", count: 1 },
];

function StatusBadge({ status }: { status: UspsLayer["status"] }) {
  const m = STATUS_META[status] || STATUS_META.idle;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${m.cls}`}>
      <m.icon size={10} /> {m.label}
    </span>
  );
}

function RateBar({ rate }: { rate: number | null }) {
  if (rate === null) return <span className="text-slate-500 text-[11px]">—</span>;
  const color = rate >= 80 ? "bg-emerald-500" : rate >= 50 ? "bg-amber-500" : "bg-red-500";
  const textColor = rate >= 80 ? "text-emerald-400" : rate >= 50 ? "text-amber-400" : "text-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-white/[0.05] rounded-full h-1 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(rate, 100)}%` }} />
      </div>
      <span className={`text-[11px] font-semibold w-10 text-right ${textColor}`}>{rate}%</span>
    </div>
  );
}

export default function ScraperManagementTab() {
  const { data: layers, setData: setLayers, isLive, refetch: refresh } = useApiData<UspsLayer[]>('/scrapers', []);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [healthRunning, setHealthRunning] = useState(false);
  const [testTrackingNumbers, setTestTrackingNumbers] = useState<Record<string, string>>({});
  const [showUAPool, setShowUAPool] = useState(false);

  const toggleLayer = async (layer: UspsLayer) => {
    const next = !layer.enabled;
    setLayers(prev => prev.map(l => l.id === layer.id ? { ...l, enabled: next, status: next ? (l.status === "disabled" ? "idle" : l.status) : "disabled" } : l));
    await apiCall(`/scrapers/${layer.id}`, "PUT", { enabled: next });
    toast({ title: `${layer.name} — ${next ? "تم التفعيل" : "تم الإيقاف"}` });
  };

  const testLayer = async (layer: UspsLayer, customTn?: string) => {
    if (testing[layer.id]) return;
    setTesting(t => ({ ...t, [layer.id]: true }));
    const tn = customTn || testTrackingNumbers[layer.id] || '';
    toast({ title: `اختبار ${layer.name}...`, description: tn ? `رقم التتبع: ${tn}` : layer.targetUrl });
    try {
      const res = await apiCall(`/scrapers/${layer.id}/test`, "POST", tn ? { trackingNumber: tn } : undefined);
      if (res.ok) {
        const r: TestResult = { layerId: layer.id, ...res.data };
        setTestResults(prev => ({ ...prev, [layer.id]: r }));
        if (r.ok) {
          toast({ title: `✅ ${layer.name} — ${r.latency}ms`, description: r.message });
        } else {
          toast({ title: `❌ ${layer.name} فشل`, description: r.message, variant: "destructive" });
        }
        setLayers(prev => prev.map(l => l.id === layer.id ? { ...l, status: r.ok ? "working" : "broken" } : l));
      }
    } catch {
      toast({ title: `خطأ في الاختبار`, variant: "destructive" });
    } finally {
      setTesting(t => ({ ...t, [layer.id]: false }));
    }
  };

  const runHealthCheck = async () => {
    setHealthRunning(true);
    toast({ title: "فحص صحة جميع الطبقات...", description: "قد يستغرق حتى 30 ثانية" });
    const enabled = (Array.isArray(layers) ? layers : []).filter(l => l.enabled);
    for (const layer of enabled) {
      await testLayer(layer);
    }
    setHealthRunning(false);
    toast({ title: "اكتمل الفحص الشامل" });
  };

  const layerList = Array.isArray(layers) ? layers : [];
  const workingCount = layerList.filter(l => l.status === "working").length;
  const enabledCount = layerList.filter(l => l.enabled).length;
  const totalAttempts = layerList.reduce((s, l) => s + (l.totalAttempts || 0), 0);
  const totalSuccesses = layerList.reduce((s, l) => s + (l.totalSuccesses || 0), 0);
  const overallRate = totalAttempts > 0 ? Math.round((totalSuccesses / totalAttempts) * 100) : 0;
  const mostUsedLayer = layerList.length > 0 ? [...layerList].sort((a, b) => (b.totalAttempts || 0) - (a.totalAttempts || 0))[0] : null;
  const avgResponseAll = layerList.filter(l => l.avgResponseTime != null).length > 0
    ? Math.round(layerList.filter(l => l.avgResponseTime != null).reduce((s, l) => s + (l.avgResponseTime || 0), 0) / layerList.filter(l => l.avgResponseTime != null).length)
    : 0;

  return (
    <div className="space-y-6" dir="rtl">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
            <Layers size={15} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">محرك الاستخراج المتعدد الطبقات</h2>
            <p className="text-[11px] text-slate-500">5 طبقات USPS متخصصة — تدهور تلقائي عند الفشل</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isLive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-slate-600/20"}`}>
            {isLive ? "● متصل" : "○ غير متصل"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refresh()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700/50 text-slate-300 border border-white/[0.06] hover:bg-slate-700 transition-colors">
            <RefreshCw size={11} /> تحديث
          </button>
          <button onClick={runHealthCheck} disabled={healthRunning} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-colors disabled:opacity-50">
            {healthRunning ? <RefreshCw size={11} className="animate-spin" /> : <Activity size={11} />}
            فحص شامل
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "الطبقات العاملة", value: `${workingCount}/${enabledCount}`, icon: CheckCircle, color: "text-emerald-400" },
          { label: "إجمالي المحاولات", value: totalAttempts > 0 ? totalAttempts.toLocaleString() : "—", icon: Zap, color: "text-blue-400" },
          { label: "معدل النجاح الكلي", value: totalAttempts > 0 ? `${overallRate}%` : "—", icon: BarChart3, color: "text-amber-400" },
          { label: "User-Agents", value: "20 UA", icon: Shield, color: "text-purple-400" },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex items-center gap-3">
            <stat.icon size={16} className={stat.color} />
            <div>
              <p className="text-xs font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {mostUsedLayer && totalAttempts > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
            <BarChart3 size={12} className="text-amber-400" />
            إحصائيات التشغيل
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
            <div>
              <p className="text-slate-500">الطبقة الأكثر استخداماً</p>
              <p className="text-white font-semibold mt-0.5">{LAYER_ICONS[mostUsedLayer.id] || "🔧"} {mostUsedLayer.name}</p>
              <p className="text-slate-600 text-[10px]">{mostUsedLayer.totalAttempts} محاولة</p>
            </div>
            <div>
              <p className="text-slate-500">متوسط زمن الاستجابة</p>
              <p className="text-blue-400 font-semibold mt-0.5">{avgResponseAll > 0 ? `${avgResponseAll}ms` : "—"}</p>
            </div>
            <div>
              <p className="text-slate-500">نسبة النجاح الكلية</p>
              <RateBar rate={overallRate} />
            </div>
            <div>
              <p className="text-slate-500">إجمالي النجاحات</p>
              <p className="text-emerald-400 font-semibold mt-0.5">{totalSuccesses.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-1">
            {layerList.map(layer => {
              const pct = totalAttempts > 0 ? Math.round(((layer.totalAttempts || 0) / totalAttempts) * 100) : 0;
              return (
                <div key={layer.id} className="text-center">
                  <div className="h-12 bg-white/[0.03] rounded relative overflow-hidden flex items-end">
                    <div className={`w-full rounded ${layer.status === 'working' ? 'bg-emerald-500/40' : layer.status === 'broken' ? 'bg-red-500/40' : 'bg-slate-600/40'}`} style={{ height: `${Math.max(pct, 5)}%` }} />
                  </div>
                  <p className="text-[9px] text-slate-500 mt-1">{LAYER_ICONS[layer.id]} L{layer.priority}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {layerList.map(layer => {
          const tr = testResults[layer.id];
          const isOpen = expanded === layer.id;
          const isTesting = testing[layer.id];
          return (
            <div key={layer.id} className={`rounded-xl border transition-colors ${layer.enabled ? "border-white/[0.07] bg-white/[0.025]" : "border-white/[0.04] bg-white/[0.01] opacity-60"}`}>
              <div className="flex items-center gap-3 p-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/[0.06] flex items-center justify-center text-[13px] shrink-0">
                  {LAYER_ICONS[layer.id] || "🔧"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-white">{layer.name}</span>
                    <StatusBadge status={layer.status} />
                    <span className="text-[9px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">P{layer.priority}</span>
                    {layer.uaRotation && (
                      <span className="text-[9px] text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/15 inline-flex items-center gap-0.5">
                        <Shield size={8} /> UA دوار
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-600 font-mono truncate mt-0.5" dir="ltr">{layer.targetUrl}</p>
                </div>

                <div className="hidden lg:flex items-center gap-4 text-[11px] shrink-0">
                  <div className="w-28">
                    <p className="text-slate-500 mb-0.5">معدل النجاح</p>
                    <RateBar rate={layer.successRate} />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500">متوسط الوقت</p>
                    <p className="text-blue-400 font-semibold">{layer.avgResponseTime != null ? `${layer.avgResponseTime}ms` : "—"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500">المحاولات</p>
                    <p className="text-slate-300 font-semibold">{layer.totalAttempts > 0 ? layer.totalAttempts : "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => testLayer(layer)}
                    disabled={isTesting || !layer.enabled}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors disabled:opacity-40"
                  >
                    {isTesting ? <RefreshCw size={9} className="animate-spin" /> : <Play size={9} />}
                    اختبار
                  </button>
                  <button
                    onClick={() => toggleLayer(layer)}
                    className={`p-1.5 rounded-lg transition-colors ${layer.enabled ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-slate-700/60 text-slate-500 hover:bg-slate-700"}`}
                    title={layer.enabled ? "إيقاف الطبقة" : "تفعيل الطبقة"}
                  >
                    <Power size={13} />
                  </button>
                  <button
                    onClick={() => setExpanded(isOpen ? null : layer.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-white/[0.05] p-3 space-y-4">
                  <p className="text-xs text-slate-400">{layer.description}</p>

                  <div className="grid grid-cols-3 gap-2 lg:hidden">
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">معدل النجاح</p>
                      <RateBar rate={layer.successRate} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">متوسط الوقت</p>
                      <p className="text-[11px] text-blue-400 font-semibold">{layer.avgResponseTime != null ? `${layer.avgResponseTime}ms` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">المحاولات</p>
                      <p className="text-[11px] text-slate-300 font-semibold">{layer.totalAttempts > 0 ? layer.totalAttempts : "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    {[
                      { label: "آخر نجاح", value: layer.lastSuccess ? new Date(layer.lastSuccess).toLocaleString("ar") : "لم يتم بعد" },
                      { label: "آخر محاولة", value: layer.lastAttempt ? new Date(layer.lastAttempt).toLocaleString("ar") : "—" },
                      { label: "المهلة الزمنية", value: `${layer.timeout / 1000}s` },
                      { label: "نجاح / محاولات", value: `${layer.totalSuccesses || 0} / ${layer.totalAttempts || 0}` },
                    ].map(item => (
                      <div key={item.label} className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-2">
                        <p className="text-slate-500 text-[10px]">{item.label}</p>
                        <p className="text-slate-300 font-medium mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {layer.lastError && (
                    <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-2.5 flex items-start gap-2">
                      <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-red-400 font-medium">آخر خطأ</p>
                        <p className="text-[11px] text-red-300/70 font-mono mt-0.5" dir="ltr">{layer.lastError}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-2.5">
                    <p className="text-[10px] text-slate-500 mb-2 flex items-center gap-1">
                      <Search size={10} /> اختبار برقم تتبع مخصص
                    </p>
                    <div className="flex items-center gap-2" dir="ltr">
                      <input
                        type="text"
                        value={testTrackingNumbers[layer.id] || ''}
                        onChange={e => setTestTrackingNumbers(prev => ({ ...prev, [layer.id]: e.target.value }))}
                        placeholder="9400111899223033005289"
                        className="flex-1 bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-[11px] text-white placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500/40"
                      />
                      <button
                        onClick={() => testLayer(layer, testTrackingNumbers[layer.id])}
                        disabled={isTesting || !layer.enabled || !testTrackingNumbers[layer.id]?.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-colors disabled:opacity-40"
                      >
                        {isTesting ? <RefreshCw size={9} className="animate-spin" /> : <Play size={9} />}
                        اختبار
                      </button>
                    </div>
                  </div>

                  {tr && (
                    <div className={`rounded-lg border p-3 ${tr.ok ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/15"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {tr.ok ? <CheckCircle size={12} className="text-emerald-400" /> : <XCircle size={12} className="text-red-400" />}
                        <span className={`text-[11px] font-semibold ${tr.ok ? "text-emerald-400" : "text-red-400"}`}>
                          {tr.ok ? "اختبار ناجح" : "فشل الاختبار"}
                        </span>
                        <span className="text-[10px] text-slate-500 mr-auto" dir="ltr">{tr.latency}ms</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{tr.message}</p>
                      {tr.ok && tr.eventsFound > 0 && (
                        <p className="text-[10px] text-emerald-500/70 mt-1">{tr.eventsFound} أحداث مُستخرجة</p>
                      )}
                      {tr.ok && tr.firstEvent && (
                        <div className="mt-2 p-2 bg-white/[0.03] rounded text-[10px] font-mono" dir="ltr">
                          <span className="text-blue-400">{tr.firstEvent.status}</span>
                          {tr.firstEvent.location && <span className="text-slate-500"> — {tr.firstEvent.location}</span>}
                          {tr.firstEvent.date && <span className="text-slate-600"> [{tr.firstEvent.date}]</span>}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={layer.targetUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-slate-300 transition-colors">
                      <Globe size={10} /> فتح URL
                    </a>
                    <span className="text-slate-700">·</span>
                    <span className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Cpu size={10} /> المهلة: {layer.timeout / 1000}s
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {layerList.length === 0 && (
          <div className="text-center py-12 text-slate-600">
            <Layers size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">لم يتم تحميل الطبقات بعد</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <button
          onClick={() => setShowUAPool(!showUAPool)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Shield size={14} className="text-blue-400" />
            تدوير User-Agent التلقائي (20 UA)
          </h3>
          {showUAPool ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
        </button>

        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          يستخدم المحرك مجموعة من 20 User-Agent مختلفة (Chrome, Firefox, Safari, Edge, Mobile) تُختار عشوائياً لكل طلب لتجنب الحظر.
          الطبقات تعمل بالتسلسل — عند نجاح طبقة يتوقف البحث فوراً. عند فشل جميع الطبقات يُستخدم USPS XML API احتياطياً.
        </p>

        {showUAPool && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {UA_CATEGORIES.map(ua => (
                <span key={ua.name} className="text-[9px] px-2 py-1 bg-slate-800 border border-white/[0.05] rounded text-slate-400 flex items-center gap-1">
                  {ua.name}
                  <span className="text-[8px] bg-blue-500/15 text-blue-400 px-1 rounded">{ua.count}</span>
                </span>
              ))}
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-2 mt-2">
              <p className="text-[10px] text-slate-500 mb-1">أمثلة من المجموعة:</p>
              <div className="space-y-1 text-[9px] font-mono text-slate-600" dir="ltr">
                <p className="truncate">Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0</p>
                <p className="truncate">Mozilla/5.0 (iPhone; CPU iPhone OS 17_3) Safari/604.1</p>
                <p className="truncate">Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) Chrome/122.0.0.0</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

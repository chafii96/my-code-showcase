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
  working:  { icon: CheckCircle,  cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25", borderAccent: "border-emerald-500/30", label: "يعمل", dot: "bg-emerald-400" },
  broken:   { icon: XCircle,      cls: "bg-red-500/15 text-red-400 border-red-500/25",             borderAccent: "border-red-500/30",     label: "معطل", dot: "bg-red-400" },
  degraded: { icon: AlertTriangle, cls: "bg-amber-500/15 text-amber-400 border-amber-500/25",      borderAccent: "border-amber-500/30",   label: "ضعيف", dot: "bg-amber-400" },
  disabled: { icon: Power,        cls: "bg-slate-600/20 text-slate-500 border-slate-600/30",        borderAccent: "border-slate-600/30",   label: "متوقف", dot: "bg-slate-500" },
  idle:     { icon: Clock,        cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",           borderAccent: "border-blue-500/30",    label: "جاهز", dot: "bg-blue-400" },
};

const LAYER_ICONS: Record<string, string> = {
  l1: "🌐", l2: "⚡", l3: "📱", l4: "🔍", l5: "🕷️",
};

const UA_CATEGORIES = [
  { name: "Chrome Win", count: 4, icon: "🖥️" },
  { name: "Chrome Mac", count: 2, icon: "💻" },
  { name: "Firefox Win", count: 3, icon: "🦊" },
  { name: "Firefox Mac", count: 1, icon: "🍎" },
  { name: "Safari Mac", count: 2, icon: "🧭" },
  { name: "Edge Win", count: 2, icon: "🌊" },
  { name: "iPhone Safari", count: 2, icon: "📱" },
  { name: "Android Chrome", count: 2, icon: "🤖" },
  { name: "Android Firefox", count: 1, icon: "📲" },
  { name: "Opera", count: 1, icon: "🎭" },
];

function StatusBadge({ status }: { status: UspsLayer["status"] }) {
  const m = STATUS_META[status] || STATUS_META.idle;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${m.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot} animate-pulse`} />
      {m.label}
    </span>
  );
}

function RateBar({ rate, showLabel = true }: { rate: number | null; showLabel?: boolean }) {
  if (rate === null) return <span className="text-slate-500 text-[11px]">—</span>;
  const color = rate >= 80 ? "from-emerald-500 to-emerald-400" : rate >= 50 ? "from-amber-500 to-amber-400" : "from-red-500 to-red-400";
  const textColor = rate >= 80 ? "text-emerald-400" : rate >= 50 ? "text-amber-400" : "text-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-white/[0.05] rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${Math.min(rate, 100)}%` }} />
      </div>
      {showLabel && <span className={`text-[11px] font-bold w-10 text-right ${textColor}`}>{rate}%</span>}
    </div>
  );
}

function ResponseTimeBadge({ ms }: { ms: number | null }) {
  if (ms === null) return <span className="text-slate-600 text-[10px]">—</span>;
  const color = ms < 1000 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : ms < 3000 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-red-400 bg-red-500/10 border-red-500/20";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold border ${color}`}>
      <Clock size={9} /> {ms}ms
    </span>
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
  const [expandedErrors, setExpandedErrors] = useState<Record<string, boolean>>({});

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/25 flex items-center justify-center shadow-lg shadow-purple-500/10">
            <Layers size={18} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">محرك الاستخراج المتعدد الطبقات</h2>
            <p className="text-[11px] text-slate-500">5 طبقات USPS متخصصة — تدهور تلقائي عند الفشل</p>
          </div>
          <span className={`text-[10px] px-3 py-1 rounded-full border backdrop-blur-sm ${isLive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-slate-600/20"}`}>
            {isLive ? "● متصل" : "○ غير متصل"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refresh()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <RefreshCw size={11} /> تحديث
          </button>
          <button onClick={runHealthCheck} disabled={healthRunning} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-400 border border-blue-500/25 hover:from-blue-500/25 hover:to-cyan-500/25 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/5">
            {healthRunning ? <RefreshCw size={11} className="animate-spin" /> : <Activity size={11} />}
            فحص شامل
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "الطبقات العاملة", value: `${workingCount}/${enabledCount}`, icon: CheckCircle, gradient: "from-emerald-500/20 to-green-500/10", iconColor: "text-emerald-400", borderColor: "border-emerald-500/20" },
          { label: "إجمالي المحاولات", value: totalAttempts > 0 ? totalAttempts.toLocaleString() : "—", icon: Zap, gradient: "from-blue-500/20 to-cyan-500/10", iconColor: "text-blue-400", borderColor: "border-blue-500/20" },
          { label: "معدل النجاح الكلي", value: totalAttempts > 0 ? `${overallRate}%` : "—", icon: BarChart3, gradient: "from-amber-500/20 to-orange-500/10", iconColor: "text-amber-400", borderColor: "border-amber-500/20" },
          { label: "User-Agents", value: "20 UA", icon: Shield, gradient: "from-purple-500/20 to-pink-500/10", iconColor: "text-purple-400", borderColor: "border-purple-500/20" },
        ].map(stat => (
          <div key={stat.label} className={`bg-slate-800/60 border ${stat.borderColor} rounded-2xl backdrop-blur-sm p-4 bg-gradient-to-br ${stat.gradient} transition-all hover:scale-[1.02]`}>
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3">
              <stat.icon size={16} className={stat.iconColor} />
            </div>
            <p className="text-[10px] text-slate-500 mb-0.5">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.iconColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {mostUsedLayer && totalAttempts > 0 && (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
              <BarChart3 size={12} className="text-amber-400" />
            </div>
            إحصائيات التشغيل
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "الطبقة الأكثر استخداماً", value: `${LAYER_ICONS[mostUsedLayer.id] || "🔧"} ${mostUsedLayer.name}`, sub: `${mostUsedLayer.totalAttempts} محاولة`, color: "text-white" },
              { label: "متوسط زمن الاستجابة", value: avgResponseAll > 0 ? `${avgResponseAll}ms` : "—", sub: null, color: "text-blue-400" },
              { label: "إجمالي النجاحات", value: totalSuccesses.toLocaleString(), sub: null, color: "text-emerald-400" },
            ].map(item => (
              <div key={item.label} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                <p className="text-[10px] text-slate-500 mb-1">{item.label}</p>
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                {item.sub && <p className="text-[9px] text-slate-600 mt-0.5">{item.sub}</p>}
              </div>
            ))}
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
              <p className="text-[10px] text-slate-500 mb-1">نسبة النجاح الكلية</p>
              <RateBar rate={overallRate} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {layerList.map(layer => {
              const pct = totalAttempts > 0 ? Math.round(((layer.totalAttempts || 0) / totalAttempts) * 100) : 0;
              const m = STATUS_META[layer.status] || STATUS_META.idle;
              return (
                <div key={layer.id} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-2 text-center">
                  <div className="h-16 bg-white/[0.03] rounded-lg relative overflow-hidden flex items-end mb-1.5">
                    <div className={`w-full rounded-lg transition-all duration-500 ${layer.status === 'working' ? 'bg-gradient-to-t from-emerald-500/50 to-emerald-500/20' : layer.status === 'broken' ? 'bg-gradient-to-t from-red-500/50 to-red-500/20' : 'bg-gradient-to-t from-slate-600/50 to-slate-600/20'}`} style={{ height: `${Math.max(pct, 8)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">{LAYER_ICONS[layer.id]} L{layer.priority}</p>
                  <p className="text-[10px] text-white font-bold">{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {layerList.map(layer => {
          const tr = testResults[layer.id];
          const isOpen = expanded === layer.id;
          const isTesting = testing[layer.id];
          const m = STATUS_META[layer.status] || STATUS_META.idle;
          return (
            <div key={layer.id} className={`bg-slate-800/60 rounded-2xl backdrop-blur-sm border-2 transition-all ${layer.enabled ? m.borderAccent : "border-slate-800/50 opacity-60"}`}>
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-center text-lg shrink-0 shadow-inner">
                  {LAYER_ICONS[layer.id] || "🔧"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[12px] font-bold text-white">{layer.name}</span>
                    <StatusBadge status={layer.status} />
                    <span className="text-[9px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded-lg border border-white/[0.05]">P{layer.priority}</span>
                    {layer.uaRotation && (
                      <span className="text-[9px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/15 inline-flex items-center gap-1">
                        <Shield size={8} /> UA دوار
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-600 font-mono truncate" dir="ltr">{layer.targetUrl}</p>
                </div>

                <div className="hidden lg:flex items-center gap-5 shrink-0">
                  <div className="w-32">
                    <p className="text-[9px] text-slate-500 mb-1">معدل النجاح</p>
                    <RateBar rate={layer.successRate} />
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-500 mb-1">زمن الاستجابة</p>
                    <ResponseTimeBadge ms={layer.avgResponseTime} />
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-500 mb-1">المحاولات</p>
                    <p className="text-sm text-slate-300 font-bold">{layer.totalAttempts > 0 ? layer.totalAttempts.toLocaleString() : "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => testLayer(layer)}
                    disabled={isTesting || !layer.enabled}
                    className="flex items-center gap-1 px-3 py-2 text-[10px] font-medium rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 border border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all disabled:opacity-40"
                  >
                    {isTesting ? <RefreshCw size={9} className="animate-spin" /> : <Play size={9} />}
                    اختبار
                  </button>
                  <button
                    onClick={() => toggleLayer(layer)}
                    className={`p-2 rounded-xl transition-all ${layer.enabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20" : "bg-slate-700/60 text-slate-500 border border-slate-600/20 hover:bg-slate-700"}`}
                    title={layer.enabled ? "إيقاف الطبقة" : "تفعيل الطبقة"}
                  >
                    <Power size={14} />
                  </button>
                  <button
                    onClick={() => setExpanded(isOpen ? null : layer.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all"
                  >
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-white/[0.05] p-4 space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed">{layer.description}</p>

                  <div className="grid grid-cols-3 gap-2 lg:hidden">
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">معدل النجاح</p>
                      <RateBar rate={layer.successRate} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">زمن الاستجابة</p>
                      <ResponseTimeBadge ms={layer.avgResponseTime} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">المحاولات</p>
                      <p className="text-[11px] text-slate-300 font-semibold">{layer.totalAttempts > 0 ? layer.totalAttempts : "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { label: "آخر نجاح", value: layer.lastSuccess ? new Date(layer.lastSuccess).toLocaleString("ar") : "لم يتم بعد", icon: CheckCircle, iconColor: "text-emerald-400" },
                      { label: "آخر محاولة", value: layer.lastAttempt ? new Date(layer.lastAttempt).toLocaleString("ar") : "—", icon: Clock, iconColor: "text-blue-400" },
                      { label: "المهلة الزمنية", value: `${layer.timeout / 1000}s`, icon: Cpu, iconColor: "text-purple-400" },
                      { label: "نجاح / محاولات", value: `${layer.totalSuccesses || 0} / ${layer.totalAttempts || 0}`, icon: BarChart3, iconColor: "text-amber-400" },
                    ].map(item => (
                      <div key={item.label} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                        <p className="text-slate-500 text-[10px] flex items-center gap-1 mb-1">
                          <item.icon size={9} className={item.iconColor} /> {item.label}
                        </p>
                        <p className="text-slate-300 font-medium text-[11px]">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {layer.lastError && (
                    <div className="bg-red-500/5 border border-red-500/15 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedErrors(prev => ({ ...prev, [layer.id]: !prev[layer.id] }))}
                        className="w-full flex items-center gap-2 p-3 hover:bg-red-500/5 transition-colors"
                      >
                        <AlertTriangle size={12} className="text-red-400 shrink-0" />
                        <span className="text-[10px] text-red-400 font-medium">آخر خطأ</span>
                        <span className="text-[9px] text-red-500/50 mr-auto">اضغط للتوسيع</span>
                        {expandedErrors[layer.id] ? <ChevronUp size={12} className="text-red-400" /> : <ChevronDown size={12} className="text-red-400" />}
                      </button>
                      {expandedErrors[layer.id] && (
                        <div className="px-3 pb-3 border-t border-red-500/10">
                          <p className="text-[11px] text-red-300/70 font-mono mt-2 leading-relaxed break-all" dir="ltr">{layer.lastError}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/15 rounded-xl p-4">
                    <p className="text-xs font-medium text-blue-300 mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center">
                        <Search size={11} className="text-blue-400" />
                      </div>
                      اختبار برقم تتبع مخصص
                    </p>
                    <div className="flex items-center gap-2" dir="ltr">
                      <input
                        type="text"
                        value={testTrackingNumbers[layer.id] || ''}
                        onChange={e => setTestTrackingNumbers(prev => ({ ...prev, [layer.id]: e.target.value }))}
                        placeholder="9400111899223033005289"
                        className="flex-1 bg-slate-900/80 border border-white/[0.08] rounded-xl px-4 py-2.5 text-[11px] text-white placeholder-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                      />
                      <button
                        onClick={() => testLayer(layer, testTrackingNumbers[layer.id])}
                        disabled={isTesting || !layer.enabled || !testTrackingNumbers[layer.id]?.trim()}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-medium rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 transition-all disabled:opacity-40 shadow-lg shadow-blue-500/5"
                      >
                        {isTesting ? <RefreshCw size={10} className="animate-spin" /> : <Play size={10} />}
                        اختبار
                      </button>
                    </div>
                  </div>

                  {tr && (
                    <div className={`rounded-xl border-2 p-4 ${tr.ok ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/15"}`}>
                      <div className="flex items-center gap-2 mb-3">
                        {tr.ok ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-red-400" />}
                        <span className={`text-[12px] font-bold ${tr.ok ? "text-emerald-400" : "text-red-400"}`}>
                          {tr.ok ? "اختبار ناجح" : "فشل الاختبار"}
                        </span>
                        <ResponseTimeBadge ms={tr.latency} />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{tr.message}</p>
                      {tr.ok && tr.eventsFound > 0 && (
                        <p className="text-[10px] text-emerald-500/70 mt-2 flex items-center gap-1">
                          <CheckCircle size={9} /> {tr.eventsFound} أحداث مُستخرجة
                        </p>
                      )}
                      {tr.ok && tr.firstEvent && (
                        <div className="mt-3 p-3 bg-white/[0.03] rounded-lg border border-white/[0.05] text-[10px] font-mono" dir="ltr">
                          <span className="text-blue-400 font-semibold">{tr.firstEvent.status}</span>
                          {tr.firstEvent.location && <span className="text-slate-500"> — {tr.firstEvent.location}</span>}
                          {tr.firstEvent.date && <span className="text-slate-600"> [{tr.firstEvent.date}]</span>}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap pt-1">
                    <a href={layer.targetUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-blue-500/5">
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
          <div className="text-center py-16 text-slate-600 bg-slate-800/30 rounded-2xl border border-slate-700/30">
            <Layers size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">لم يتم تحميل الطبقات بعد</p>
          </div>
        )}
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-5">
        <button
          onClick={() => setShowUAPool(!showUAPool)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <Shield size={12} className="text-blue-400" />
            </div>
            تدوير User-Agent التلقائي (20 UA)
          </h3>
          {showUAPool ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
        </button>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          يستخدم المحرك مجموعة من 20 User-Agent مختلفة (Chrome, Firefox, Safari, Edge, Mobile) تُختار عشوائياً لكل طلب لتجنب الحظر.
          الطبقات تعمل بالتسلسل — عند نجاح طبقة يتوقف البحث فوراً. عند فشل جميع الطبقات يُستخدم USPS XML API احتياطياً.
        </p>

        {showUAPool && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {UA_CATEGORIES.map(ua => (
              <div key={ua.name} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center hover:bg-white/[0.05] transition-all">
                <div className="text-lg mb-1">{ua.icon}</div>
                <p className="text-[10px] text-slate-300 font-medium">{ua.name}</p>
                <span className="inline-block mt-1 text-[9px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-lg font-bold">{ua.count} UA</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

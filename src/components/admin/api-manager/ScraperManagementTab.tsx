import { useState } from "react";
import { Activity, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Clock, Cpu, Globe, Layers, Play, Power, RefreshCw, Shield, XCircle, Zap } from "lucide-react";
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

  const toggleLayer = async (layer: UspsLayer) => {
    const next = !layer.enabled;
    setLayers(prev => prev.map(l => l.id === layer.id ? { ...l, enabled: next, status: next ? (l.status === "disabled" ? "idle" : l.status) : "disabled" } : l));
    await apiCall(`/scrapers/${layer.id}`, "PUT", { enabled: next });
    toast({ title: `${layer.name} — ${next ? "تم التفعيل" : "تم الإيقاف"}` });
  };

  const testLayer = async (layer: UspsLayer) => {
    if (testing[layer.id]) return;
    setTesting(t => ({ ...t, [layer.id]: true }));
    toast({ title: `اختبار ${layer.name}...`, description: layer.targetUrl });
    try {
      const res = await apiCall(`/scrapers/${layer.id}/test`, "POST");
      if (res.ok) {
        const r: TestResult = { layerId: layer.id, ...res.data };
        setTestResults(prev => ({ ...prev, [layer.id]: r }));
        if (r.ok) {
          toast({ title: `✅ ${layer.name} — ${r.latency}ms`, description: r.message });
        } else {
          toast({ title: `❌ ${layer.name} فشل`, description: r.message, variant: "destructive" });
        }
        // Update layer status visually
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

  return (
    <div className="space-y-6" dir="rtl">

      {/* Header */}
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

      {/* Summary stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "الطبقات العاملة", value: `${workingCount}/${enabledCount}`, icon: CheckCircle, color: "text-emerald-400" },
          { label: "إجمالي المحاولات", value: totalAttempts > 0 ? totalAttempts.toLocaleString() : "—", icon: Zap, color: "text-blue-400" },
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

      {/* Layer cards */}
      <div className="space-y-2">
        {layerList.map(layer => {
          const tr = testResults[layer.id];
          const isOpen = expanded === layer.id;
          const isTesting = testing[layer.id];
          return (
            <div key={layer.id} className={`rounded-xl border transition-colors ${layer.enabled ? "border-white/[0.07] bg-white/[0.025]" : "border-white/[0.04] bg-white/[0.01] opacity-60"}`}>
              {/* Main row */}
              <div className="flex items-center gap-3 p-3">
                {/* Priority badge */}
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/[0.06] flex items-center justify-center text-[13px] shrink-0">
                  {LAYER_ICONS[layer.id] || "🔧"}
                </div>

                {/* Name + status + url */}
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

                {/* Metrics (desktop) */}
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

                {/* Actions */}
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

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-white/[0.05] p-3 space-y-4">
                  <p className="text-xs text-slate-400">{layer.description}</p>

                  {/* Mobile metrics */}
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

                  {/* Runtime info grid */}
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

                  {/* Last error */}
                  {layer.lastError && (
                    <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-2.5 flex items-start gap-2">
                      <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-red-400 font-medium">آخر خطأ</p>
                        <p className="text-[11px] text-red-300/70 font-mono mt-0.5" dir="ltr">{layer.lastError}</p>
                      </div>
                    </div>
                  )}

                  {/* Test result */}
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

      {/* Engine info card */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Shield size={14} className="text-blue-400" />
          تدوير User-Agent التلقائي
        </h3>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          يستخدم المحرك مجموعة من 20 User-Agent مختلفة (Chrome, Firefox, Safari, Edge, Mobile) تُختار عشوائياً لكل طلب لتجنب الحظر.
          الطبقات تعمل بالتسلسل — عند نجاح طبقة يتوقف البحث فوراً. عند فشل جميع الطبقات يُستخدم USPS XML API احتياطياً.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["Chrome Win", "Chrome Mac", "Firefox Win", "Firefox Mac", "Safari Mac", "Edge Win", "iPhone Safari", "Android Chrome", "Android Firefox", "Opera"].map(ua => (
            <span key={ua} className="text-[9px] px-2 py-0.5 bg-slate-800 border border-white/[0.05] rounded text-slate-500">{ua}</span>
          ))}
        </div>
      </div>

    </div>
  );
}

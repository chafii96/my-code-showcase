import { useState } from "react";
import { AlertTriangle, CheckCircle, Code, Globe, Play, Power, RefreshCw, Shield, XCircle } from "lucide-react";
import { ScraperConfig } from "./types";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

const STATUS_AR: Record<string, string> = { working: 'يعمل', broken: 'معطل', disabled: 'متوقف' };

function ScraperStatusBadge({ status }: { status: ScraperConfig['status'] }) {
  const styles = {
    working: { icon: CheckCircle, cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    broken: { icon: XCircle, cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
    disabled: { icon: AlertTriangle, cls: 'bg-slate-500/20 text-slate-500 border-slate-500/30' },
  };
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.cls}`}>
      <s.icon size={10} /> {STATUS_AR[status]}
    </span>
  );
}

export default function ScraperManagementTab() {
  const { data: scrapers, setData: setScrapers, isLive } = useApiData<ScraperConfig[]>('/scrapers', []);
  const [editingSelectors, setEditingSelectors] = useState<string | null>(null);

  const toggleScraper = async (id: string) => {
    setScrapers(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled, status: s.enabled ? 'disabled' : 'working' } : s));
    const scraper = scrapers.find(s => s.id === id);
    if (scraper) await apiCall(`/scrapers/${id}`, 'PUT', { enabled: !scraper.enabled });
    toast({ title: "تم تحديث الـ Scraper" });
  };

  const testScraper = async (s: ScraperConfig) => {
    toast({ title: `جاري اختبار ${s.carrier}...`, description: s.targetUrl });
    const result = await apiCall(`/scrapers/${s.id}/test`, 'POST');
    if (result.ok && result.data?.success) {
      toast({ title: `✅ ${s.carrier} — ${result.data.responseTime}ms` });
    } else {
      toast({ title: `❌ فشل اختبار ${s.carrier}`, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">أدوات الاستخراج (Scrapers)</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
            {isLive ? '● متصل' : '○ غير متصل'}
          </span>
        </div>
        <button onClick={() => toast({ title: "جاري فحص صحة جميع الـ Scrapers..." })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
          <RefreshCw size={12} /> فحص شامل
        </button>
      </div>

      <div className="space-y-3">
        {(Array.isArray(scrapers) ? scrapers : []).map(scraper => (
          <div key={scraper.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={16} className="text-blue-400" />
                  <span className="text-sm font-semibold text-white">{scraper.carrier}</span>
                  <ScraperStatusBadge status={scraper.status} />
                </div>
                <p className="text-[11px] text-slate-500 font-mono truncate" dir="ltr">{scraper.targetUrl}</p>
              </div>
              <div className="flex gap-4 text-[11px]">
                <div className="text-center">
                  <p className="text-slate-500">النجاح</p>
                  <p className={`font-semibold ${scraper.successRate > 80 ? 'text-emerald-400' : scraper.successRate > 50 ? 'text-amber-400' : 'text-red-400'}`}>{scraper.successRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500">متوسط الوقت</p>
                  <p className="text-blue-400 font-semibold">{scraper.avgResponseTime}ms</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500">آخر نجاح</p>
                  <p className="text-slate-300">{scraper.lastSuccess ? new Date(scraper.lastSuccess).toLocaleString('ar') : '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className={`px-2 py-1 rounded ${scraper.userAgentRotation ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                  <Shield size={10} className="inline ml-1" />UA
                </span>
                <span className={`px-2 py-1 rounded ${scraper.proxyEnabled ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-500'}`}>
                  <Globe size={10} className="inline ml-1" />بروكسي
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => testScraper(scraper)} className="px-2.5 py-1.5 text-[10px] font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                  <Play size={10} className="inline ml-1" />اختبار
                </button>
                <button onClick={() => setEditingSelectors(editingSelectors === scraper.id ? null : scraper.id)} className="px-2.5 py-1.5 text-[10px] font-medium rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
                  <Code size={10} className="inline ml-1" />المحددات
                </button>
                <button onClick={() => toggleScraper(scraper.id)}
                  className={`p-1.5 rounded-lg transition-colors ${scraper.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                  <Power size={14} />
                </button>
              </div>
            </div>
            {editingSelectors === scraper.id && (
              <div className="mt-4 pt-4 border-t border-white/[0.04]">
                <h4 className="text-xs font-semibold text-slate-400 mb-2">محددات CSS/XPath</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {Object.entries(scraper.selectors).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase">{key}</label>
                      <input defaultValue={val} dir="ltr" className="w-full bg-slate-800 border border-white/[0.08] rounded px-2 py-1.5 text-[11px] font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
                <button onClick={() => { apiCall(`/scrapers/${scraper.id}`, 'PUT', scraper); toast({ title: "✅ تم حفظ المحددات" }); }}
                  className="mt-3 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                  حفظ المحددات
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-3">مجموعة البروكسي</h3>
        <p className="text-xs text-slate-500 mb-3">إدارة خوادم البروكسي. الصيغة: host:port:user:pass</p>
        <textarea rows={4} placeholder="proxy1.example.com:8080:user:pass&#10;proxy2.example.com:8080:user:pass" dir="ltr"
          className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1.5 rounded-lg text-[10px] font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">حفظ البروكسيات</button>
          <button className="px-3 py-1.5 rounded-lg text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">اختبار الكل</button>
        </div>
      </div>
    </div>
  );
}

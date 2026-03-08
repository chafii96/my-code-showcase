import { useState, useEffect, useMemo } from "react";
import { Ban, CheckCircle, Unlock, Shield, ShieldOff, Activity, AlertTriangle } from "lucide-react";
import { RateLimitRule } from "./types";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

interface RateLimitSettings {
  enabled: boolean;
  maxPerHour: number;
  maxPerDay: number;
  windowMs: number;
  captchaThreshold: number;
  blockVPN: boolean;
  blacklist: string[];
  whitelist: string[];
}

interface TopIpEntry {
  id: string;
  ipHash: string;
  requestsCount: number;
  windowStart: string;
  lastRequest?: string;
  blocked: boolean;
  country?: string;
}

const DEFAULT_SETTINGS: RateLimitSettings = {
  enabled: true,
  maxPerHour: 60,
  maxPerDay: 500,
  windowMs: 3600000,
  captchaThreshold: 30,
  blockVPN: false,
  blacklist: [],
  whitelist: [],
};

export default function RateLimitingTab() {
  const { data: settings, setData: setSettings, isLive, refetch: refetchSettings } = useApiData<RateLimitSettings>(
    '/rate-limits/settings',
    DEFAULT_SETTINGS
  );
  const { data: topIps, refetch: refetchIps } = useApiData<TopIpEntry[]>('/rate-limits/top-ips', [], { pollingInterval: 30000 });
  const [blacklistText, setBlacklistText] = useState('');
  const [whitelistText, setWhitelistText] = useState('');

  useEffect(() => {
    if (settings.blacklist?.length) setBlacklistText(settings.blacklist.join('\n'));
    if (settings.whitelist?.length) setWhitelistText(settings.whitelist.join('\n'));
  }, [settings.blacklist, settings.whitelist]);

  const stats = useMemo(() => {
    const ips = Array.isArray(topIps) ? topIps : [];
    const totalRequests = ips.reduce((sum, ip) => sum + ip.requestsCount, 0);
    const blockedCount = ips.filter(ip => ip.blocked).length;
    const activeRateLimits = ips.filter(ip => ip.requestsCount > (settings.maxPerHour || 60)).length;
    const violationsCount = ips.filter(ip => ip.requestsCount > (settings.captchaThreshold || 30)).length;
    return { totalRequests, blockedCount, activeRateLimits, violationsCount, totalIps: ips.length };
  }, [topIps, settings]);

  const saveSettings = async () => {
    const updated: RateLimitSettings = {
      ...settings,
      blacklist: blacklistText.split('\n').map(s => s.trim()).filter(Boolean),
      whitelist: whitelistText.split('\n').map(s => s.trim()).filter(Boolean),
    };
    setSettings(updated);
    const result = await apiCall('/rate-limits/settings', 'POST', updated);
    if (result.ok) {
      toast({ title: "تم حفظ الإعدادات بنجاح" });
    } else {
      toast({ title: "خطأ في حفظ الإعدادات", variant: "destructive" });
    }
  };

  const toggleBlock = async (ipHash: string, blocked: boolean) => {
    const endpoint = blocked ? `/rate-limits/unblock/${encodeURIComponent(ipHash)}` : `/rate-limits/block/${encodeURIComponent(ipHash)}`;
    const result = await apiCall(endpoint, 'POST');
    if (result.ok) {
      toast({ title: blocked ? "تم إلغاء الحظر" : "تم حظر الـ IP" });
      refetchIps();
      refetchSettings();
    } else {
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const windowMinutes = Math.round((settings.windowMs || 3600000) / 60000);

  const inputClass = "w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-white">تحديد المعدل والحماية</h2>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
          {isLive ? '● متصل' : '○ غير متصل'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
          <Activity size={18} className="mx-auto mb-1 text-blue-400" />
          <div className="text-xl font-bold text-white">{stats.totalRequests.toLocaleString('ar-EG')}</div>
          <div className="text-[10px] text-slate-400">إجمالي الطلبات</div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
          <Shield size={18} className="mx-auto mb-1 text-emerald-400" />
          <div className="text-xl font-bold text-white">{stats.totalIps.toLocaleString('ar-EG')}</div>
          <div className="text-[10px] text-slate-400">عناوين IP فريدة</div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
          <Ban size={18} className="mx-auto mb-1 text-red-400" />
          <div className="text-xl font-bold text-white">{stats.blockedCount.toLocaleString('ar-EG')}</div>
          <div className="text-[10px] text-slate-400">عناوين محظورة</div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
          <AlertTriangle size={18} className="mx-auto mb-1 text-amber-400" />
          <div className="text-xl font-bold text-white">{stats.violationsCount.toLocaleString('ar-EG')}</div>
          <div className="text-[10px] text-slate-400">تجاوز الحد</div>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">إعدادات تحديد المعدل</h3>
          <button onClick={() => setSettings(p => ({ ...p, enabled: !p.enabled }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${settings.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400 border border-white/[0.08]'}`}>
            {settings.enabled ? <Shield size={12} /> : <ShieldOff size={12} />}
            {settings.enabled ? 'الحماية مفعّلة' : 'الحماية معطّلة'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">الحد الأقصى / ساعة</label>
            <input type="number" value={settings.maxPerHour} onChange={e => setSettings(p => ({ ...p, maxPerHour: +e.target.value }))} dir="ltr"
              className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">الحد الأقصى / يوم</label>
            <input type="number" value={settings.maxPerDay} onChange={e => setSettings(p => ({ ...p, maxPerDay: +e.target.value }))} dir="ltr"
              className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">مدة النافذة (دقيقة)</label>
            <input type="number" value={windowMinutes} onChange={e => setSettings(p => ({ ...p, windowMs: +e.target.value * 60000 }))} dir="ltr"
              className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">حد CAPTCHA (طلب)</label>
            <input type="number" value={settings.captchaThreshold} onChange={e => setSettings(p => ({ ...p, captchaThreshold: +e.target.value }))} dir="ltr"
              className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">حظر VPN/بروكسي</label>
            <button onClick={() => setSettings(p => ({ ...p, blockVPN: !p.blockVPN }))}
              className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${settings.blockVPN ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-700 text-slate-400 border border-white/[0.08]'}`}>
              {settings.blockVPN ? 'حظر VPN مفعل' : 'VPN مسموح'}
            </button>
          </div>
        </div>
        <button onClick={saveSettings} className="mt-4 px-4 py-2 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
          حفظ الإعدادات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-2">القائمة السوداء ({(settings.blacklist || []).length})</h3>
          <textarea rows={4} value={blacklistText} onChange={e => setBlacklistText(e.target.value)} placeholder="عنوان IP واحد في كل سطر..." dir="ltr"
            className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-red-500" />
          <button onClick={saveSettings} className="mt-2 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
            <Ban size={10} className="inline ml-1" />تحديث القائمة السوداء
          </button>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-2">القائمة البيضاء ({(settings.whitelist || []).length})</h3>
          <textarea rows={4} value={whitelistText} onChange={e => setWhitelistText(e.target.value)} placeholder="عنوان IP واحد في كل سطر..." dir="ltr"
            className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <button onClick={saveSettings} className="mt-2 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
            <CheckCircle size={10} className="inline ml-1" />تحديث القائمة البيضاء
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">أعلى عناوين IP حسب عدد الطلبات</h3>
          <span className="text-[10px] text-slate-500">{(Array.isArray(topIps) ? topIps : []).length} عنوان</span>
        </div>
        {(Array.isArray(topIps) ? topIps : []).length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">لا توجد بيانات طلبات بعد — ستظهر هنا عند وجود سجلات تتبع</div>
        ) : (
          <div className="overflow-x-auto" dir="ltr">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/[0.06]">
                  <th className="text-left py-2 px-3">IP</th>
                  <th className="text-left py-2 px-3">الطلبات</th>
                  <th className="text-left py-2 px-3">أول طلب</th>
                  <th className="text-left py-2 px-3">آخر طلب</th>
                  <th className="text-left py-2 px-3">الحالة</th>
                  <th className="text-left py-2 px-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {[...(Array.isArray(topIps) ? topIps : [])].sort((a, b) => b.requestsCount - a.requestsCount).map(r => {
                  const overLimit = r.requestsCount > (settings.maxPerHour || 60);
                  return (
                    <tr key={r.id} className={`border-b border-white/[0.03] hover:bg-white/[0.02] ${overLimit && !r.blocked ? 'bg-amber-500/[0.03]' : ''}`}>
                      <td className="py-2 px-3 font-mono text-slate-300">{r.ipHash}</td>
                      <td className={`py-2 px-3 font-semibold ${overLimit ? 'text-red-400' : 'text-amber-400'}`}>{r.requestsCount}</td>
                      <td className="py-2 px-3 text-slate-400">{r.windowStart ? new Date(r.windowStart).toLocaleString('ar-EG') : '—'}</td>
                      <td className="py-2 px-3 text-slate-400">{r.lastRequest ? new Date(r.lastRequest).toLocaleString('ar-EG') : '—'}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.blocked ? 'bg-red-500/20 text-red-400' : overLimit ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {r.blocked ? 'محظور' : overLimit ? 'تجاوز الحد' : 'مسموح'}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <button onClick={() => toggleBlock(r.ipHash, r.blocked)}
                          className={`p-1 rounded transition-colors ${r.blocked ? 'text-emerald-500 hover:text-emerald-400' : 'text-slate-500 hover:text-red-400'}`}
                          title={r.blocked ? 'إلغاء الحظر' : 'حظر'}>
                          {r.blocked ? <Unlock size={12} /> : <Ban size={12} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Ban, CheckCircle, Unlock } from "lucide-react";
import { RateLimitRule } from "./types";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

interface RateLimitSettings {
  maxPerHour: number;
  maxPerDay: number;
  captchaThreshold: number;
  blockVPN: boolean;
  blacklist: string[];
  whitelist: string[];
}

export default function RateLimitingTab() {
  const { data: settings, setData: setSettings, isLive } = useApiData<RateLimitSettings>(
    '/rate-limits/settings',
    { maxPerHour: 60, maxPerDay: 500, captchaThreshold: 30, blockVPN: false, blacklist: [], whitelist: [] }
  );
  const { data: rules } = useApiData<RateLimitRule[]>('/rate-limits/top-ips', [], { pollingInterval: 30000 });
  const [blacklistText, setBlacklistText] = useState('');
  const [whitelistText, setWhitelistText] = useState('');

  const saveSettings = async () => {
    const updated = {
      ...settings,
      blacklist: blacklistText.split('\n').filter(Boolean),
      whitelist: whitelistText.split('\n').filter(Boolean),
    };
    setSettings(updated);
    await apiCall('/rate-limits/settings', 'POST', updated);
    toast({ title: "✅ تم حفظ الإعدادات" });
  };

  const toggleBlock = async (ipHash: string, blocked: boolean) => {
    const endpoint = blocked ? `/rate-limits/unblock/${ipHash}` : `/rate-limits/block/${ipHash}`;
    await apiCall(endpoint, 'POST');
    toast({ title: blocked ? "تم إلغاء الحظر" : "تم حظر الـ IP" });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-white">تحديد المعدل والحماية</h2>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
          {isLive ? '● متصل' : '○ غير متصل'}
        </span>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-4">الإعدادات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">الحد الأقصى / IP / ساعة</label>
            <input type="number" value={settings.maxPerHour} onChange={e => setSettings(p => ({ ...p, maxPerHour: +e.target.value }))} dir="ltr"
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">الحد الأقصى / IP / يوم</label>
            <input type="number" value={settings.maxPerDay} onChange={e => setSettings(p => ({ ...p, maxPerDay: +e.target.value }))} dir="ltr"
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">CAPTCHA بعد X طلب</label>
            <input type="number" value={settings.captchaThreshold} onChange={e => setSettings(p => ({ ...p, captchaThreshold: +e.target.value }))} dir="ltr"
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">حظر VPN/بروكسي</label>
            <button onClick={() => setSettings(p => ({ ...p, blockVPN: !p.blockVPN }))}
              className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${settings.blockVPN ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-700 text-slate-400 border border-white/[0.08]'}`}>
              {settings.blockVPN ? '🔴 حظر VPN مفعل' : '🟢 VPN مسموح'}
            </button>
          </div>
        </div>
        <button onClick={saveSettings} className="mt-4 px-4 py-2 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
          حفظ الإعدادات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-2">القائمة السوداء</h3>
          <textarea rows={4} value={blacklistText} onChange={e => setBlacklistText(e.target.value)} placeholder="عنوان IP واحد في كل سطر..." dir="ltr"
            className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-red-500" />
          <button onClick={saveSettings} className="mt-2 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            <Ban size={10} className="inline ml-1" />تحديث القائمة السوداء
          </button>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-2">القائمة البيضاء</h3>
          <textarea rows={4} value={whitelistText} onChange={e => setWhitelistText(e.target.value)} placeholder="عنوان IP واحد في كل سطر..." dir="ltr"
            className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <button onClick={saveSettings} className="mt-2 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle size={10} className="inline ml-1" />تحديث القائمة البيضاء
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-3">أعلى عناوين IP حسب عدد الطلبات</h3>
        <div className="overflow-x-auto" dir="ltr">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-white/[0.06]">
                <th className="text-left py-2 px-3">IP (مخفي)</th>
                <th className="text-left py-2 px-3">الدولة</th>
                <th className="text-left py-2 px-3">الطلبات</th>
                <th className="text-left py-2 px-3">بداية النافذة</th>
                <th className="text-left py-2 px-3">الحالة</th>
                <th className="text-left py-2 px-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[...(Array.isArray(rules) ? rules : [])].sort((a, b) => b.requestsCount - a.requestsCount).map(r => (
                <tr key={r.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2 px-3 font-mono text-slate-300">{r.ipHash}</td>
                  <td className="py-2 px-3 text-slate-300">{r.country || '—'}</td>
                  <td className="py-2 px-3 font-semibold text-amber-400">{r.requestsCount}</td>
                  <td className="py-2 px-3 text-slate-400">{new Date(r.windowStart).toLocaleString('ar')}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.blocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {r.blocked ? 'محظور' : 'مسموح'}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button onClick={() => toggleBlock(r.ipHash, r.blocked)} className="p-1 rounded text-slate-500 hover:text-amber-400 transition-colors">
                      {r.blocked ? <Unlock size={12} /> : <Ban size={12} />}
                    </button>
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

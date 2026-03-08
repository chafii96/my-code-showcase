import { useState, useEffect, useMemo } from "react";
import { Ban, CheckCircle, Unlock, Shield, ShieldOff, Activity, AlertTriangle, Clock, X, Lock, Globe, Zap } from "lucide-react";
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

function BlockConfirmModal({ open, onClose, onConfirm, ipHash, action }: { open: boolean; onClose: () => void; onConfirm: () => void; ipHash: string; action: 'block' | 'unblock' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`bg-slate-900 border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl ${action === 'block' ? 'border-red-500/30 shadow-red-500/10' : 'border-emerald-500/30 shadow-emerald-500/10'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action === 'block' ? 'bg-red-500/15 border border-red-500/30' : 'bg-emerald-500/15 border border-emerald-500/30'}`}>
            {action === 'block' ? <Ban size={24} className="text-red-400" /> : <Unlock size={24} className="text-emerald-400" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{action === 'block' ? 'تأكيد الحظر' : 'تأكيد إلغاء الحظر'}</h3>
            <p className="text-xs text-slate-400 font-mono" dir="ltr">{ipHash}</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {action === 'block'
            ? 'هل أنت متأكد من رغبتك في حظر عنوان الـ IP هذا؟ سيتم منعه من إجراء أي طلبات تتبع.'
            : 'هل أنت متأكد من رغبتك في إلغاء حظر عنوان الـ IP هذا؟ سيتمكن من إجراء طلبات تتبع مجدداً.'}
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors">
            إلغاء
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${action === 'block' ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'}`}>
            {action === 'block' ? <><Ban size={14} /> حظر</> : <><Unlock size={14} /> إلغاء الحظر</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function WindowVisual({ windowMs, maxPerHour }: { windowMs: number; maxPerHour: number }) {
  const windowMin = Math.round(windowMs / 60000);
  const segments = Math.min(windowMin, 12);
  const perSegment = Math.round(maxPerHour / segments);

  return (
    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
      <p className="text-[10px] text-slate-500 mb-3 flex items-center gap-1.5">
        <Clock size={10} className="text-blue-400" />
        نافذة تحديد المعدل — {windowMin} دقيقة
      </p>
      <div className="flex items-end gap-1 h-12">
        {Array.from({ length: segments }).map((_, i) => {
          const h = 20 + Math.random() * 80;
          const isHigh = h > 70;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-t-sm transition-all ${isHigh ? 'bg-gradient-to-t from-amber-500/60 to-amber-500/20' : 'bg-gradient-to-t from-blue-500/40 to-blue-500/15'}`}
                style={{ height: `${h}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] text-slate-600">0 دقيقة</span>
        <span className="text-[9px] text-slate-500 font-medium">{perSegment} طلب/قسم</span>
        <span className="text-[9px] text-slate-600">{windowMin} دقيقة</span>
      </div>
    </div>
  );
}

export default function RateLimitingTab() {
  const { data: settings, setData: setSettings, isLive, refetch: refetchSettings } = useApiData<RateLimitSettings>(
    '/rate-limits/settings',
    DEFAULT_SETTINGS
  );
  const { data: topIps, refetch: refetchIps } = useApiData<TopIpEntry[]>('/rate-limits/top-ips', [], { pollingInterval: 30000 });
  const [blacklistText, setBlacklistText] = useState('');
  const [whitelistText, setWhitelistText] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ ipHash: string; action: 'block' | 'unblock' } | null>(null);

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
      toast({ title: "✅ تم حفظ الإعدادات بنجاح" });
    } else {
      toast({ title: "❌ خطأ في حفظ الإعدادات", variant: "destructive" });
    }
  };

  const toggleBlock = async (ipHash: string, blocked: boolean) => {
    const endpoint = blocked ? `/rate-limits/unblock/${encodeURIComponent(ipHash)}` : `/rate-limits/block/${encodeURIComponent(ipHash)}`;
    const result = await apiCall(endpoint, 'POST');
    if (result.ok) {
      toast({ title: blocked ? "✅ تم إلغاء الحظر" : "🚫 تم حظر الـ IP" });
      refetchIps();
      refetchSettings();
    } else {
      toast({ title: "❌ حدث خطأ", variant: "destructive" });
    }
    setConfirmAction(null);
  };

  const windowMinutes = Math.round((settings.windowMs || 3600000) / 60000);

  const statCards = [
    { label: "إجمالي الطلبات", value: stats.totalRequests.toLocaleString('ar-EG'), icon: Activity, gradient: "from-blue-500/20 to-cyan-500/10", iconColor: "text-blue-400", borderColor: "border-blue-500/20" },
    { label: "عناوين IP فريدة", value: stats.totalIps.toLocaleString('ar-EG'), icon: Globe, gradient: "from-emerald-500/20 to-green-500/10", iconColor: "text-emerald-400", borderColor: "border-emerald-500/20" },
    { label: "عناوين محظورة", value: stats.blockedCount.toLocaleString('ar-EG'), icon: Ban, gradient: "from-red-500/20 to-rose-500/10", iconColor: "text-red-400", borderColor: "border-red-500/20" },
    { label: "تجاوز الحد", value: stats.violationsCount.toLocaleString('ar-EG'), icon: AlertTriangle, gradient: "from-amber-500/20 to-orange-500/10", iconColor: "text-amber-400", borderColor: "border-amber-500/20" },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <BlockConfirmModal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmAction && toggleBlock(confirmAction.ipHash, confirmAction.action === 'unblock')}
        ipHash={confirmAction?.ipHash || ''}
        action={confirmAction?.action || 'block'}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/25 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Shield size={18} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">تحديد المعدل والحماية</h2>
            <p className="text-[11px] text-slate-500">إدارة حدود الطلبات وحماية النظام</p>
          </div>
        </div>
        <span className={`text-[10px] px-3 py-1 rounded-full border backdrop-blur-sm ${isLive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-600/20'}`}>
          {isLive ? '● متصل' : '○ غير متصل'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(c => (
          <div key={c.label} className={`bg-slate-800/60 border ${c.borderColor} rounded-2xl backdrop-blur-sm p-4 bg-gradient-to-br ${c.gradient} transition-all hover:scale-[1.02]`}>
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3">
              <c.icon size={16} className={c.iconColor} />
            </div>
            <p className="text-[10px] text-slate-500 mb-0.5">{c.label}</p>
            <p className={`text-xl font-bold ${c.iconColor}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <Zap size={14} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">إعدادات تحديد المعدل</h3>
              <p className="text-[10px] text-slate-500">تحكم في حدود الطلبات لكل عنوان IP</p>
            </div>
          </div>
          <button onClick={() => setSettings(p => ({ ...p, enabled: !p.enabled }))}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shadow-lg ${settings.enabled ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-emerald-500/5' : 'bg-slate-700/60 text-slate-400 border border-slate-600/30'}`}>
            {settings.enabled ? <Shield size={12} /> : <ShieldOff size={12} />}
            {settings.enabled ? 'الحماية مفعّلة' : 'الحماية معطّلة'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 space-y-2">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <Clock size={10} className="text-blue-400" /> الحد الأقصى / ساعة
            </label>
            <input type="number" value={settings.maxPerHour} onChange={e => setSettings(p => ({ ...p, maxPerHour: +e.target.value }))} dir="ltr"
              className="w-full bg-slate-900/80 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 space-y-2">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <Activity size={10} className="text-emerald-400" /> الحد الأقصى / يوم
            </label>
            <input type="number" value={settings.maxPerDay} onChange={e => setSettings(p => ({ ...p, maxPerDay: +e.target.value }))} dir="ltr"
              className="w-full bg-slate-900/80 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 space-y-2">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <Clock size={10} className="text-purple-400" /> مدة النافذة (دقيقة)
            </label>
            <input type="number" value={windowMinutes} onChange={e => setSettings(p => ({ ...p, windowMs: +e.target.value * 60000 }))} dir="ltr"
              className="w-full bg-slate-900/80 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 space-y-2">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <AlertTriangle size={10} className="text-amber-400" /> حد CAPTCHA (طلب)
            </label>
            <input type="number" value={settings.captchaThreshold} onChange={e => setSettings(p => ({ ...p, captchaThreshold: +e.target.value }))} dir="ltr"
              className="w-full bg-slate-900/80 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 space-y-2">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <Lock size={10} className="text-red-400" /> حظر VPN/بروكسي
            </label>
            <button onClick={() => setSettings(p => ({ ...p, blockVPN: !p.blockVPN }))}
              className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all ${settings.blockVPN ? 'bg-red-500/15 text-red-400 border border-red-500/25 shadow-lg shadow-red-500/5' : 'bg-slate-800/60 text-slate-400 border border-slate-700/50'}`}>
              {settings.blockVPN ? '🔒 حظر VPN مفعل' : '🔓 VPN مسموح'}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <WindowVisual windowMs={settings.windowMs} maxPerHour={settings.maxPerHour} />
        </div>

        <button onClick={saveSettings} className="mt-4 px-5 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all shadow-lg shadow-blue-500/5">
          حفظ الإعدادات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/60 border border-red-500/15 rounded-2xl backdrop-blur-sm p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center">
              <Ban size={12} className="text-red-400" />
            </div>
            القائمة السوداء
            <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-lg">{(settings.blacklist || []).length}</span>
          </h3>
          <textarea rows={4} value={blacklistText} onChange={e => setBlacklistText(e.target.value)} placeholder="عنوان IP واحد في كل سطر..." dir="ltr"
            className="w-full bg-slate-900/80 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all" />
          <button onClick={saveSettings} className="mt-3 px-4 py-2 rounded-xl text-[10px] font-medium bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 transition-all flex items-center gap-1.5">
            <Ban size={10} /> تحديث القائمة السوداء
          </button>
        </div>
        <div className="bg-slate-800/60 border border-emerald-500/15 rounded-2xl backdrop-blur-sm p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle size={12} className="text-emerald-400" />
            </div>
            القائمة البيضاء
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">{(settings.whitelist || []).length}</span>
          </h3>
          <textarea rows={4} value={whitelistText} onChange={e => setWhitelistText(e.target.value)} placeholder="عنوان IP واحد في كل سطر..." dir="ltr"
            className="w-full bg-slate-900/80 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" />
          <button onClick={saveSettings} className="mt-3 px-4 py-2 rounded-xl text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all flex items-center gap-1.5">
            <CheckCircle size={10} /> تحديث القائمة البيضاء
          </button>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
              <Activity size={14} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">أعلى عناوين IP حسب عدد الطلبات</h3>
              <p className="text-[10px] text-slate-500">{(Array.isArray(topIps) ? topIps : []).length} عنوان نشط</p>
            </div>
          </div>
        </div>
        {(Array.isArray(topIps) ? topIps : []).length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <Activity size={24} className="mx-auto mb-2 opacity-20" />
            لا توجد بيانات طلبات بعد — ستظهر هنا عند وجود سجلات تتبع
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/[0.05]" dir="ltr">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 bg-slate-900/50">
                  <th className="text-left py-3 px-3 font-medium">IP</th>
                  <th className="text-left py-3 px-3 font-medium">الطلبات</th>
                  <th className="text-left py-3 px-3 font-medium">النسبة</th>
                  <th className="text-left py-3 px-3 font-medium">أول طلب</th>
                  <th className="text-left py-3 px-3 font-medium">آخر طلب</th>
                  <th className="text-left py-3 px-3 font-medium">الحالة</th>
                  <th className="text-left py-3 px-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {[...(Array.isArray(topIps) ? topIps : [])].sort((a, b) => b.requestsCount - a.requestsCount).map((r, i) => {
                  const overLimit = r.requestsCount > (settings.maxPerHour || 60);
                  const maxReqs = Math.max(...(Array.isArray(topIps) ? topIps : []).map(ip => ip.requestsCount), 1);
                  const pct = Math.round((r.requestsCount / maxReqs) * 100);
                  return (
                    <tr key={r.id} className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'} ${r.blocked ? 'bg-red-500/[0.03]' : overLimit ? 'bg-amber-500/[0.02]' : ''}`}>
                      <td className="py-3 px-3 font-mono text-slate-300 text-[11px]">{r.ipHash}</td>
                      <td className="py-3 px-3">
                        <span className={`font-bold text-sm ${r.blocked ? 'text-red-400' : overLimit ? 'text-amber-400' : 'text-blue-400'}`}>{r.requestsCount}</span>
                      </td>
                      <td className="py-3 px-3 w-28">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${r.blocked ? 'bg-red-500' : overLimit ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-500 w-7 text-right">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[10px]">{r.windowStart ? new Date(r.windowStart).toLocaleString('ar-EG') : '—'}</td>
                      <td className="py-3 px-3 text-slate-400 text-[10px]">{r.lastRequest ? new Date(r.lastRequest).toLocaleString('ar-EG') : '—'}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${r.blocked ? 'bg-red-500/15 text-red-400 border-red-500/25' : overLimit ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${r.blocked ? 'bg-red-400' : overLimit ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                          {r.blocked ? 'محظور' : overLimit ? 'تجاوز الحد' : 'مسموح'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setConfirmAction({ ipHash: r.ipHash, action: r.blocked ? 'unblock' : 'block' })}
                          className={`p-2 rounded-xl transition-all ${r.blocked ? 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'}`}
                          title={r.blocked ? 'إلغاء الحظر' : 'حظر'}>
                          {r.blocked ? <Unlock size={13} /> : <Ban size={13} />}
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

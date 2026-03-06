import { useState } from "react";
import { Bell, Globe, Wrench } from "lucide-react";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

interface ApiSettings {
  siteName: string;
  adminEmail: string;
  timezone: string;
  language: string;
  notifications: {
    providerExhausted: boolean;
    allProvidersFail: boolean;
    cacheHitRateBelow: boolean;
    cacheHitRateThreshold: number;
    errorRateExceeds: boolean;
    errorRateThreshold: number;
    dailySummary: boolean;
  };
  maintenanceMode: boolean;
}

const defaultSettings: ApiSettings = {
  siteName: 'US Postal Tracking',
  adminEmail: 'admin@uspostaltracking.com',
  timezone: 'UTC',
  language: 'ar',
  notifications: {
    providerExhausted: true, allProvidersFail: true,
    cacheHitRateBelow: true, cacheHitRateThreshold: 50,
    errorRateExceeds: true, errorRateThreshold: 10,
    dailySummary: true,
  },
  maintenanceMode: false,
};

const FIELD_LABELS: Record<string, string> = {
  siteName: 'اسم الموقع',
  adminEmail: 'بريد المشرف',
  timezone: 'المنطقة الزمنية',
  language: 'اللغة',
};

export default function ApiSystemSettingsTab() {
  const { data: settings, setData: setSettings, isLive } = useApiData<ApiSettings>('/api-settings', defaultSettings);

  const updateGeneral = (key: string, val: string) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const updateNotification = (key: string, val: any) => {
    setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, [key]: val } }));
  };

  const toggleMaintenance = () => {
    setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
    apiCall('/api-settings', 'POST', { ...settings, maintenanceMode: !settings.maintenanceMode });
    toast({ title: settings.maintenanceMode ? "🟢 تم إيقاف وضع الصيانة" : "🔴 تم تفعيل وضع الصيانة", variant: settings.maintenanceMode ? "default" : "destructive" });
  };

  const saveAll = async () => {
    const result = await apiCall('/api-settings', 'POST', settings);
    toast({ title: result.ok ? "✅ تم حفظ جميع الإعدادات" : "❌ فشل الحفظ" });
  };

  const notifs = settings.notifications || defaultSettings.notifications;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-white">إعدادات النظام</h2>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
          {isLive ? '● متصل' : '○ غير متصل'}
        </span>
      </div>

      {/* عام */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-white">عام</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['siteName', 'adminEmail', 'timezone', 'language'].map(key => (
            <div key={key} className="space-y-1">
              <label className="text-[11px] text-slate-400">{FIELD_LABELS[key] || key}</label>
              <input value={(settings as any)[key] || ''} onChange={e => updateGeneral(key, e.target.value)}
                className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" dir={key === 'adminEmail' ? 'ltr' : 'rtl'} />
            </div>
          ))}
        </div>
      </div>

      {/* الإشعارات */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">إشعارات البريد الإلكتروني</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'providerExhausted', label: 'تنبيه عند استنفاد المزود' },
            { key: 'allProvidersFail', label: 'تنبيه عند فشل جميع المزودين' },
            { key: 'dailySummary', label: 'تقرير ملخص يومي' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={!!(notifs as any)[item.key]}
                  onChange={e => updateNotification(item.key, e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 rounded-full bg-slate-700 peer-checked:bg-blue-500 transition-colors" />
                <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:-translate-x-4" />
              </div>
              <span className="text-xs text-slate-300">{item.label}</span>
            </label>
          ))}

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={notifs.cacheHitRateBelow}
                  onChange={e => updateNotification('cacheHitRateBelow', e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 rounded-full bg-slate-700 peer-checked:bg-blue-500 transition-colors" />
                <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:-translate-x-4" />
              </div>
              <span className="text-xs text-slate-300">معدل إصابة الكاش ينخفض تحت</span>
            </label>
            <input type="number" value={notifs.cacheHitRateThreshold} dir="ltr"
              onChange={e => updateNotification('cacheHitRateThreshold', +e.target.value)}
              className="w-16 bg-slate-800 border border-white/[0.08] rounded px-2 py-1 text-xs text-white text-center" />
            <span className="text-xs text-slate-500">%</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={notifs.errorRateExceeds}
                  onChange={e => updateNotification('errorRateExceeds', e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 rounded-full bg-slate-700 peer-checked:bg-blue-500 transition-colors" />
                <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:-translate-x-4" />
              </div>
              <span className="text-xs text-slate-300">معدل الأخطاء يتجاوز</span>
            </label>
            <input type="number" value={notifs.errorRateThreshold} dir="ltr"
              onChange={e => updateNotification('errorRateThreshold', +e.target.value)}
              className="w-16 bg-slate-800 border border-white/[0.08] rounded px-2 py-1 text-xs text-white text-center" />
            <span className="text-xs text-slate-500">%</span>
          </div>
        </div>
      </div>

      {/* وضع الصيانة */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-red-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">وضع الصيانة</h3>
              <p className="text-[10px] text-slate-500">يعرض رسالة ودية للمستخدمين أثناء الصيانة</p>
            </div>
          </div>
          <button onClick={toggleMaintenance}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${settings.maintenanceMode ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-700 text-slate-400 border border-white/[0.08]'}`}>
            {settings.maintenanceMode ? '🔴 الصيانة مفعلة' : '🟢 الصيانة متوقفة'}
          </button>
        </div>
      </div>

      <button onClick={saveAll} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
        حفظ جميع الإعدادات
      </button>
    </div>
  );
}

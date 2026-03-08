import { useState } from "react";
import { Globe, Shield, Bot, Database, Wrench, Settings } from "lucide-react";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

interface ApiSettings {
  defaultTimeout: number;
  maxRetries: number;
  loggingLevel: string;
  rateLimitEnabled: boolean;
  vpnBlockingEnabled: boolean;
  corsEnabled: boolean;
  captchaEnabled: boolean;
  captchaThreshold: number;
  cacheEnabled: boolean;
  cacheTTL: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const defaultSettings: ApiSettings = {
  defaultTimeout: 30000,
  maxRetries: 3,
  loggingLevel: 'info',
  rateLimitEnabled: true,
  vpnBlockingEnabled: false,
  corsEnabled: true,
  captchaEnabled: false,
  captchaThreshold: 100,
  cacheEnabled: true,
  cacheTTL: 3600,
  maintenanceMode: false,
  maintenanceMessage: '',
};

export default function ApiSystemSettingsTab() {
  const { data: settings, setData: setSettings, isLive } = useApiData<ApiSettings>('/api-settings', defaultSettings);
  const [saving, setSaving] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const update = <K extends keyof ApiSettings>(key: K, val: ApiSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const saveAll = async () => {
    setSaving(true);
    const result = await apiCall('/api-settings', 'POST', settings);
    setSaving(false);
    toast({
      title: result.ok ? "تم حفظ جميع الإعدادات بنجاح" : "فشل في حفظ الإعدادات",
      variant: result.ok ? "default" : "destructive",
    });
  };

  const handleDangerousToggle = (key: keyof ApiSettings, currentVal: boolean, warningMsg: string) => {
    const newVal = !currentVal;
    const isDangerous = (key === 'maintenanceMode' && newVal) ||
      (key === 'rateLimitEnabled' && !newVal) ||
      (key === 'corsEnabled' && !newVal) ||
      (key === 'vpnBlockingEnabled' && !newVal && currentVal);

    if (isDangerous) {
      setConfirmAction({
        message: warningMsg,
        onConfirm: () => {
          update(key, newVal as any);
          setConfirmAction(null);
        },
      });
    } else {
      update(key, newVal as any);
    }
  };

  const ToggleSwitch = ({ checked, onChange, danger }: { checked: boolean; onChange: () => void; danger?: boolean }) => (
    <button type="button" onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? (danger ? 'bg-red-500' : 'bg-blue-500') : 'bg-slate-700'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'right-0.5' : 'right-[22px]'}`} />
    </button>
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-blue-400" />
          <h2 className="text-lg font-bold text-white">إعدادات API والنظام</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
            {isLive ? '● متصل بالخادم' : '○ غير متصل'}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-white">عام</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">مهلة الـ API (مللي ثانية)</label>
            <input type="number" value={settings.defaultTimeout} dir="ltr"
              onChange={e => update('defaultTimeout', Math.max(1000, +e.target.value))}
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">أقصى عدد محاولات إعادة</label>
            <input type="number" value={settings.maxRetries} dir="ltr" min={0} max={10}
              onChange={e => update('maxRetries', Math.min(10, Math.max(0, +e.target.value)))}
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">مستوى التسجيل</label>
            <select value={settings.loggingLevel}
              onChange={e => update('loggingLevel', e.target.value)}
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="error">خطأ فقط (error)</option>
              <option value="warn">تحذيرات (warn)</option>
              <option value="info">معلومات (info)</option>
              <option value="debug">تصحيح (debug)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">الأمان</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300">تحديد معدل الطلبات (Rate Limiting)</span>
              <p className="text-[10px] text-slate-500">يمنع إساءة استخدام الـ API بتقييد عدد الطلبات</p>
            </div>
            <ToggleSwitch checked={settings.rateLimitEnabled}
              onChange={() => handleDangerousToggle('rateLimitEnabled', settings.rateLimitEnabled, 'تعطيل تحديد المعدل سيسمح بطلبات غير محدودة. هل أنت متأكد؟')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300">حظر VPN/Proxy</span>
              <p className="text-[10px] text-slate-500">يحظر الطلبات القادمة من شبكات VPN والبروكسي</p>
            </div>
            <ToggleSwitch checked={settings.vpnBlockingEnabled}
              onChange={() => update('vpnBlockingEnabled', !settings.vpnBlockingEnabled)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300">CORS</span>
              <p className="text-[10px] text-slate-500">السماح بالطلبات من نطاقات خارجية</p>
            </div>
            <ToggleSwitch checked={settings.corsEnabled}
              onChange={() => handleDangerousToggle('corsEnabled', settings.corsEnabled, 'تعطيل CORS قد يمنع التطبيقات الخارجية من الوصول. هل أنت متأكد؟')} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bot size={16} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-white">CAPTCHA</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300">تفعيل CAPTCHA</span>
              <p className="text-[10px] text-slate-500">يعرض تحقق CAPTCHA عند تجاوز الحد المسموح</p>
            </div>
            <ToggleSwitch checked={settings.captchaEnabled}
              onChange={() => update('captchaEnabled', !settings.captchaEnabled)} />
          </div>
          {settings.captchaEnabled && (
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">عدد الطلبات قبل ظهور CAPTCHA</label>
              <input type="number" value={settings.captchaThreshold} dir="ltr" min={1}
                onChange={e => update('captchaThreshold', Math.max(1, +e.target.value))}
                className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-green-400" />
          <h3 className="text-sm font-semibold text-white">التخزين المؤقت (Cache)</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300">تفعيل التخزين المؤقت</span>
              <p className="text-[10px] text-slate-500">يخزّن ردود الـ API مؤقتاً لتحسين الأداء</p>
            </div>
            <ToggleSwitch checked={settings.cacheEnabled}
              onChange={() => update('cacheEnabled', !settings.cacheEnabled)} />
          </div>
          {settings.cacheEnabled && (
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">مدة الصلاحية الافتراضية (ثانية)</label>
              <input type="number" value={settings.cacheTTL} dir="ltr" min={60}
                onChange={e => update('cacheTTL', Math.max(60, +e.target.value))}
                className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          )}
        </div>
      </div>

      <div className={`rounded-xl border p-4 ${settings.maintenanceMode ? 'border-red-500/30 bg-red-500/5' : 'border-white/[0.06] bg-white/[0.02]'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Wrench size={16} className="text-red-400" />
          <h3 className="text-sm font-semibold text-white">وضع الصيانة</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300">تفعيل وضع الصيانة</span>
              <p className="text-[10px] text-slate-500">يعرض رسالة ودية للمستخدمين ويمنع الوصول للموقع</p>
            </div>
            <ToggleSwitch checked={settings.maintenanceMode} danger
              onChange={() => handleDangerousToggle('maintenanceMode', settings.maintenanceMode, 'تفعيل وضع الصيانة سيمنع جميع المستخدمين من الوصول للموقع. هل أنت متأكد؟')} />
          </div>
          {settings.maintenanceMode && (
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">رسالة الصيانة</label>
              <textarea value={settings.maintenanceMessage}
                onChange={e => update('maintenanceMessage', e.target.value)}
                placeholder="الموقع تحت الصيانة حالياً، سنعود قريباً..."
                rows={2}
                className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
            </div>
          )}
        </div>
      </div>

      <button onClick={saveAll} disabled={saving}
        className="px-6 py-2.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {saving ? 'جارٍ الحفظ...' : 'حفظ جميع الإعدادات'}
      </button>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 space-y-4" dir="rtl">
            <h3 className="text-sm font-bold text-white">تأكيد العملية</h3>
            <p className="text-xs text-slate-300">{confirmAction.message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-lg text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
                إلغاء
              </button>
              <button onClick={confirmAction.onConfirm}
                className="px-4 py-2 rounded-lg text-xs bg-red-500 text-white hover:bg-red-600 transition-colors">
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

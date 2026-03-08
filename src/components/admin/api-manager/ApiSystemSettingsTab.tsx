import { useState } from "react";
import { Globe, Shield, Bot, Database, Wrench, Settings, Save, AlertTriangle, CheckCircle, Zap, Info } from "lucide-react";
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
      className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
        checked
          ? danger ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30' : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
          : 'bg-slate-700 hover:bg-slate-600'
      }`}>
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${checked ? 'right-1' : 'right-[30px]'}`} />
    </button>
  );

  const SettingRow = ({ label, desc, children, danger }: { label: string; desc: string; children: React.ReactNode; danger?: boolean }) => (
    <div className={`flex items-center justify-between py-4 ${danger ? '' : ''}`}>
      <div className="flex-1 ml-4">
        <span className={`text-sm font-medium ${danger ? 'text-red-300' : 'text-slate-200'}`}>{label}</span>
        <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 pb-24" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-600/10 border border-slate-500/20 flex items-center justify-center">
            <Settings size={16} className="text-slate-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">إعدادات API والنظام</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                {isLive ? '● متصل بالخادم' : '○ غير متصل'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Globe size={15} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">الإعدادات العامة</h3>
            <p className="text-[10px] text-slate-500">تحكم في سلوك API الأساسي</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Zap size={11} className="text-blue-400" />
              مهلة الـ API
            </label>
            <input type="number" value={settings.defaultTimeout} dir="ltr"
              onChange={e => update('defaultTimeout', Math.max(1000, +e.target.value))}
              className="w-full bg-slate-800/60 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all" />
            <span className="text-[10px] text-slate-500">بالمللي ثانية — الحد الأدنى 1000</span>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Info size={11} className="text-blue-400" />
              أقصى عدد محاولات إعادة
            </label>
            <input type="number" value={settings.maxRetries} dir="ltr" min={0} max={10}
              onChange={e => update('maxRetries', Math.min(10, Math.max(0, +e.target.value)))}
              className="w-full bg-slate-800/60 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all" />
            <span className="text-[10px] text-slate-500">من 0 إلى 10 محاولات</span>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Info size={11} className="text-blue-400" />
              مستوى التسجيل
            </label>
            <select value={settings.loggingLevel}
              onChange={e => update('loggingLevel', e.target.value)}
              className="w-full bg-slate-800/60 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer transition-all">
              <option value="error">خطأ فقط (error)</option>
              <option value="warn">تحذيرات (warn)</option>
              <option value="info">معلومات (info)</option>
              <option value="debug">تصحيح (debug)</option>
            </select>
            <span className="text-[10px] text-slate-500">يحدد مستوى تفصيل السجلات</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
            <Shield size={15} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">الأمان</h3>
            <p className="text-[10px] text-slate-500">إعدادات حماية API</p>
          </div>
        </div>
        <div className="divide-y divide-white/[0.06]">
          <SettingRow label="تحديد معدل الطلبات (Rate Limiting)" desc="يمنع إساءة استخدام الـ API بتقييد عدد الطلبات">
            <ToggleSwitch checked={settings.rateLimitEnabled}
              onChange={() => handleDangerousToggle('rateLimitEnabled', settings.rateLimitEnabled, 'تعطيل تحديد المعدل سيسمح بطلبات غير محدودة. هل أنت متأكد؟')} />
          </SettingRow>
          <SettingRow label="حظر VPN/Proxy" desc="يحظر الطلبات القادمة من شبكات VPN والبروكسي">
            <ToggleSwitch checked={settings.vpnBlockingEnabled}
              onChange={() => update('vpnBlockingEnabled', !settings.vpnBlockingEnabled)} />
          </SettingRow>
          <SettingRow label="CORS" desc="السماح بالطلبات من نطاقات خارجية" danger={!settings.corsEnabled}>
            <ToggleSwitch checked={settings.corsEnabled}
              onChange={() => handleDangerousToggle('corsEnabled', settings.corsEnabled, 'تعطيل CORS قد يمنع التطبيقات الخارجية من الوصول. هل أنت متأكد؟')} />
          </SettingRow>
        </div>
        {!settings.rateLimitEnabled && (
          <div className="mt-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
            <span className="text-[11px] text-red-300">تحديد المعدل معطل — الـ API معرض لطلبات غير محدودة</span>
          </div>
        )}
        {!settings.corsEnabled && (
          <div className="mt-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
            <span className="text-[11px] text-red-300">CORS معطل — التطبيقات الخارجية لن تتمكن من الوصول</span>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 flex items-center justify-center">
            <Bot size={15} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">CAPTCHA</h3>
            <p className="text-[10px] text-slate-500">حماية من البوتات والاستخدام الآلي</p>
          </div>
        </div>
        <div className="divide-y divide-white/[0.06]">
          <SettingRow label="تفعيل CAPTCHA" desc="يعرض تحقق CAPTCHA عند تجاوز الحد المسموح">
            <ToggleSwitch checked={settings.captchaEnabled}
              onChange={() => update('captchaEnabled', !settings.captchaEnabled)} />
          </SettingRow>
        </div>
        {settings.captchaEnabled && (
          <div className="mt-4 space-y-2">
            <label className="text-xs text-slate-300 font-medium">عدد الطلبات قبل ظهور CAPTCHA</label>
            <input type="number" value={settings.captchaThreshold} dir="ltr" min={1}
              onChange={e => update('captchaThreshold', Math.max(1, +e.target.value))}
              className="w-full bg-slate-800/60 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
            <span className="text-[10px] text-slate-500">عدد الطلبات المسموحة قبل طلب التحقق</span>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 flex items-center justify-center">
            <Database size={15} className="text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">التخزين المؤقت (Cache)</h3>
            <p className="text-[10px] text-slate-500">تحسين أداء الاستجابة</p>
          </div>
        </div>
        <div className="divide-y divide-white/[0.06]">
          <SettingRow label="تفعيل التخزين المؤقت" desc="يخزّن ردود الـ API مؤقتاً لتحسين الأداء وتقليل الطلبات">
            <ToggleSwitch checked={settings.cacheEnabled}
              onChange={() => update('cacheEnabled', !settings.cacheEnabled)} />
          </SettingRow>
        </div>
        {settings.cacheEnabled && (
          <div className="mt-4 space-y-2">
            <label className="text-xs text-slate-300 font-medium">مدة الصلاحية الافتراضية</label>
            <input type="number" value={settings.cacheTTL} dir="ltr" min={60}
              onChange={e => update('cacheTTL', Math.max(60, +e.target.value))}
              className="w-full bg-slate-800/60 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
            <span className="text-[10px] text-slate-500">بالثواني — الحد الأدنى 60 ثانية ({Math.round(settings.cacheTTL / 60)} دقيقة)</span>
          </div>
        )}
      </div>

      <div className={`rounded-2xl border-2 p-6 shadow-xl transition-all ${
        settings.maintenanceMode
          ? 'border-red-500/40 bg-gradient-to-br from-red-500/[0.08] to-red-600/[0.03] shadow-red-500/10'
          : 'border-red-500/15 bg-gradient-to-br from-white/[0.04] to-white/[0.01]'
      }`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 flex items-center justify-center">
            <Wrench size={15} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">وضع الصيانة</h3>
            <p className="text-[10px] text-red-400/80">تحذير: يمنع جميع المستخدمين من الوصول</p>
          </div>
          {settings.maintenanceMode && (
            <span className="mr-auto px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/25 animate-pulse">
              مُفعّل
            </span>
          )}
        </div>
        <div className="divide-y divide-white/[0.06]">
          <SettingRow label="تفعيل وضع الصيانة" desc="يعرض رسالة ودية للمستخدمين ويمنع الوصول للموقع" danger>
            <ToggleSwitch checked={settings.maintenanceMode} danger
              onChange={() => handleDangerousToggle('maintenanceMode', settings.maintenanceMode, 'تفعيل وضع الصيانة سيمنع جميع المستخدمين من الوصول للموقع. هل أنت متأكد؟')} />
          </SettingRow>
        </div>
        {settings.maintenanceMode && (
          <div className="mt-4 space-y-2">
            <label className="text-xs text-slate-300 font-medium">رسالة الصيانة</label>
            <textarea value={settings.maintenanceMessage}
              onChange={e => update('maintenanceMessage', e.target.value)}
              placeholder="الموقع تحت الصيانة حالياً، سنعود قريباً..."
              rows={3}
              className="w-full bg-slate-800/60 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none transition-all" />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pointer-events-none">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between pointer-events-auto">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info size={12} />
            تأكد من مراجعة الإعدادات قبل الحفظ
          </div>
          <button onClick={saveAll} disabled={saving}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-xl ${
              saving
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25 hover:shadow-blue-500/40'
            }`}>
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جارٍ الحفظ...</>
            ) : (
              <><Save size={16} /> حفظ جميع الإعدادات</>
            )}
          </button>
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/[0.1] rounded-2xl p-7 max-w-md w-full mx-4 space-y-5 shadow-2xl" dir="rtl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تأكيد العملية</h3>
                <p className="text-[11px] text-slate-500">هذا الإجراء قد يؤثر على النظام</p>
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/15">
              <p className="text-sm text-slate-200 leading-relaxed">{confirmAction.message}</p>
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <button onClick={() => setConfirmAction(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all border border-white/[0.06]">
                إلغاء
              </button>
              <button onClick={confirmAction.onConfirm}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20">
                تأكيد الإجراء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

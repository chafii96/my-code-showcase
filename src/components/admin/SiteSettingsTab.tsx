import React, { useState } from "react";
import {
  Settings, Globe, Lock, Unlock, Palette, TrendingUp,
  Save, CheckCircle, Loader2, AlertCircle, AlertTriangle,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import { useApiData, apiCall } from "./api-manager/useApiData";

const DEFAULT_CONFIG = {
  site: { siteName: '', siteUrl: '', siteDescription: '', contactEmail: '', twitterHandle: '', facebookPage: '', language: 'en', timezone: 'America/New_York' },
  seo: { defaultTitle: '', defaultDescription: '', defaultKeywords: '', ogImage: '', canonicalDomain: '', robotsIndex: true, robotsFollow: true, structuredDataEnabled: true, openGraphEnabled: true, twitterCardsEnabled: true, hreflangEnabled: false },
  security: { sessionTimeout: 30 },
  appearance: { theme: 'dark', logo: '' },
  maintenance: { enabled: false, message: '' },
  notifications: { alertEmail: '', slackWebhook: '', discordWebhook: '', telegramBotToken: '', telegramChatId: '' },
};

export default function SiteSettingsTab() {
  const { data: config, setData: setConfig, loading } = useApiData<any>('/config', DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState('general');
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);

  const update = (section: string, key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [section]: { ...prev?.[section], [key]: value } }));
  };

  const save = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const { appearance, ...backendConfig } = config;
      if (appearance?.theme) {
        localStorage.setItem('dashboard_theme', appearance.theme);
      }
      const res = await apiCall('/config', 'POST', { ...backendConfig, appearance });
      if (res.ok) {
        setSaveMsg({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' });
      } else {
        setSaveMsg({ type: 'error', text: res.error || 'فشل حفظ الإعدادات' });
      }
    } catch {
      setSaveMsg({ type: 'error', text: 'تعذر الاتصال بالخادم' });
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(null), 4000);
  };

  const changePassword = async () => {
    setPassError(''); setPassSuccess(false);
    if (!passwords.current) { setPassError('أدخل كلمة المرور الحالية'); return; }
    if (passwords.newPass.length < 8) { setPassError('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'); return; }
    if (passwords.newPass !== passwords.confirm) { setPassError('كلمتا المرور غير متطابقتين'); return; }
    if (!/[A-Z]/.test(passwords.newPass) || !/[0-9]/.test(passwords.newPass)) { setPassError('يجب أن تحتوي على حرف كبير ورقم على الأقل'); return; }
    try {
      const res = await fetch('/api/admin/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }) });
      if (res.ok) { setPassSuccess(true); setPasswords({ current: '', newPass: '', confirm: '' }); setTimeout(() => setPassSuccess(false), 4000); }
      else { const d = await res.json().catch(() => ({})); setPassError(d.message || 'فشل تغيير كلمة المرور'); }
    } catch { setPassError('تعذر الاتصال بالخادم'); }
  };

  const passStrength = (pass: string) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (pass.length >= 12) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const strength = passStrength(passwords.newPass);
  const strengthLabel = ['', 'ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'ممتازة'][strength] || '';
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-400'][strength] || '';

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  const SECTIONS = [
    { id: 'general', label: 'عام', icon: <Globe size={14} /> },
    { id: 'seo', label: 'SEO', icon: <TrendingUp size={14} /> },
    { id: 'security', label: 'الأمان', icon: <Lock size={14} /> },
    { id: 'appearance', label: 'المظهر', icon: <Palette size={14} /> },
    { id: 'maintenance', label: 'الصيانة', icon: <AlertTriangle size={14} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Settings size={18} className="text-slate-400" /> الإعدادات</h2>
        <div className="flex items-center gap-2 self-start">
          {saveMsg && (
            <span className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg ${saveMsg.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
              {saveMsg.type === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              {saveMsg.text}
            </span>
          )}
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-blue-600 hover:bg-blue-500 text-white">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            حفظ
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-slate-700 pb-2">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${
              activeSection === s.id ? 'bg-blue-700 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}>{s.icon}{s.label}</button>
        ))}
      </div>

      {activeSection === 'general' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Globe size={16} className="text-cyan-400" />إعدادات الموقع</h3>
          {[
            { key: 'siteName', label: 'اسم الموقع', section: 'site' },
            { key: 'siteDescription', label: 'وصف الموقع', section: 'site' },
            { key: 'siteUrl', label: 'الدومين', section: 'site' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-slate-300 block mb-1">{f.label}</label>
              <input value={config?.[f.section]?.[f.key] || ''} onChange={e => update(f.section, f.key, e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">لغة الموقع</label>
            <select value={config?.site?.language || 'en'} onChange={e => update('site', 'language', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      )}

      {activeSection === 'seo' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-green-400" />إعدادات SEO</h3>
          {[
            { key: 'defaultTitle', label: 'قالب العنوان الافتراضي' },
            { key: 'defaultKeywords', label: 'الكلمات المفتاحية الافتراضية' },
            { key: 'ogImage', label: 'رابط صورة OG' },
            { key: 'canonicalDomain', label: 'النطاق الأساسي (Canonical)' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-slate-300 block mb-1">{f.label}</label>
              <input value={config?.seo?.[f.key] || ''} onChange={e => update('seo', f.key, e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">الوصف الافتراضي</label>
            <textarea value={config?.seo?.defaultDescription || ''} onChange={e => update('seo', 'defaultDescription', e.target.value)} rows={3}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'robotsIndex', label: 'السماح بالفهرسة (index)' },
              { key: 'robotsFollow', label: 'السماح بتتبع الروابط (follow)' },
              { key: 'structuredDataEnabled', label: 'تفعيل Structured Data' },
              { key: 'openGraphEnabled', label: 'تفعيل Open Graph' },
              { key: 'twitterCardsEnabled', label: 'تفعيل Twitter Cards' },
              { key: 'hreflangEnabled', label: 'تفعيل Hreflang' },
            ].map(f => (
              <div key={f.key} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                <span className="text-xs text-slate-300">{f.label}</span>
                <button onClick={() => update('seo', f.key, !config?.seo?.[f.key])} className={config?.seo?.[f.key] ? 'text-green-400' : 'text-slate-600'}>
                  {config?.seo?.[f.key] ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'security' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Lock size={16} className="text-red-400" />تغيير كلمة المرور</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">كلمة المرور الحالية</label>
                <div className="relative">
                  <input type={showPassCurrent ? 'text' : 'password'} value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 pr-10" />
                  <button onClick={() => setShowPassCurrent(!showPassCurrent)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassCurrent ? <Unlock size={14} /> : <Lock size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">كلمة المرور الجديدة</label>
                <div className="relative">
                  <input type={showPassNew ? 'text' : 'password'} value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 pr-10" />
                  <button onClick={() => setShowPassNew(!showPassNew)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassNew ? <Unlock size={14} /> : <Lock size={14} />}
                  </button>
                </div>
                {passwords.newPass && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">{[1, 2, 3, 4, 5].map(i => (<div key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength ? strengthColor : 'bg-slate-700'}`} />))}</div>
                    <p className={`text-xs ${strength >= 4 ? 'text-green-400' : strength >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>قوة كلمة المرور: {strengthLabel}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">تأكيد كلمة المرور</label>
                <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              {passError && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} />{passError}</p>}
              {passSuccess && <p className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12} />تم تغيير كلمة المرور بنجاح</p>}
              <button onClick={changePassword} className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-sm text-white font-medium transition-colors">تغيير كلمة المرور</button>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">مهلة الجلسة</h3>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">مهلة انتهاء الجلسة (دقائق)</label>
              <select value={config?.security?.sessionTimeout || 30} onChange={e => update('security', 'sessionTimeout', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 max-w-xs">
                {[15, 30, 60, 120, 480, 1440].map(m => <option key={m} value={m}>{m >= 60 ? `${m / 60} ساعة` : `${m} دقيقة`}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'appearance' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Palette size={16} className="text-purple-400" />الثيم</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'dark', label: 'داكن', desc: 'مظهر داكن مريح للعين', gradient: 'from-slate-900 to-slate-800', border: 'border-blue-500' },
                { id: 'light', label: 'فاتح', desc: 'مظهر فاتح وواضح', gradient: 'from-slate-100 to-white', border: 'border-amber-400' },
              ].map(t => (
                <button key={t.id} onClick={() => { update('appearance', 'theme', t.id); localStorage.setItem('dashboard_theme', t.id); }}
                  className={`relative p-4 rounded-xl border-2 transition-all text-right ${(config?.appearance?.theme || 'dark') === t.id ? `${t.border} bg-slate-700/50 shadow-lg` : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'}`}>
                  {(config?.appearance?.theme || 'dark') === t.id && <span className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><CheckCircle size={12} className="text-white" /></span>}
                  <p className="text-sm font-medium text-white">{t.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                  <div className={`mt-3 h-6 rounded-md bg-gradient-to-r ${t.gradient}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">الشعار</h3>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">رابط الشعار (URL)</label>
              <input value={config?.appearance?.logo || ''} onChange={e => update('appearance', 'logo', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>
      )}

      {activeSection === 'maintenance' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-400" />وضع الصيانة</h3>
          <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
            <div>
              <p className="text-sm font-medium text-white">تفعيل وضع الصيانة</p>
              <p className="text-xs text-slate-400 mt-0.5">عند التفعيل، سيرى الزوار رسالة الصيانة بدلاً من الموقع</p>
            </div>
            <button onClick={() => update('maintenance', 'enabled', !config?.maintenance?.enabled)} className={config?.maintenance?.enabled ? 'text-amber-400' : 'text-slate-600'}>
              {config?.maintenance?.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">رسالة الصيانة</label>
            <textarea value={config?.maintenance?.message || ''} onChange={e => update('maintenance', 'message', e.target.value)} rows={3}
              placeholder="الموقع تحت الصيانة حالياً، يرجى المحاولة لاحقاً..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none" />
          </div>
        </div>
      )}
    </div>
  );
}

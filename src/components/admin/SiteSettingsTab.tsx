import React, { useState, useEffect } from "react";
import {
  Settings, Globe, Lock, Unlock, Palette, Bell, HardDrive, TrendingUp,
  Code, Calendar, Save, CheckCircle, Loader2, Download, Upload, RefreshCw,
  ToggleLeft, ToggleRight, AlertCircle, Info, Database, Trash2, Link2,
} from "lucide-react";

export default function SiteSettingsTab() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('appearance');
  const [theme, setTheme] = useState(() => localStorage.getItem('dashboard_theme') || 'dark');
  const [language, setLanguage] = useState(() => localStorage.getItem('dashboard_lang') || 'ar');
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(() => localStorage.getItem('dashboard_2fa') === 'true');
  const [sessionTimeout, setSessionTimeout] = useState(() => Number(localStorage.getItem('dashboard_session_timeout') || '30'));
  const [autoBackup, setAutoBackup] = useState(() => localStorage.getItem('dashboard_autobackup') === 'true');
  const [backupFreq, setBackupFreq] = useState(() => localStorage.getItem('dashboard_backup_freq') || 'daily');
  const [emailNotif, setEmailNotif] = useState(() => localStorage.getItem('dashboard_email_notif') !== 'false');
  const [pushNotif, setPushNotif] = useState(() => localStorage.getItem('dashboard_push_notif') === 'true');
  const [errorAlerts, setErrorAlerts] = useState(() => localStorage.getItem('dashboard_error_alerts') !== 'false');
  const [weeklyReport, setWeeklyReport] = useState(() => localStorage.getItem('dashboard_weekly_report') === 'true');
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('dashboard_date_fmt') || 'ar-SA');
  const [timezone, setTimezone] = useState(() => localStorage.getItem('dashboard_tz') || Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => {
    fetch('/api/config').then(r => r.ok ? r.json() : Promise.reject()).then(setConfig).catch(() => {
      const saved = localStorage.getItem('swifttrack_config');
      setConfig(saved ? JSON.parse(saved) : {
        site: { name: 'US Postal Tracking', domain: 'uspostaltracking.com', language: 'en' },
        seo: { titleSuffix: '| US Postal Tracking', defaultDescription: 'Track USPS packages in real-time' },
        notifications: { email: '', slack: false, discord: false },
      });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    localStorage.setItem('dashboard_theme', theme);
    localStorage.setItem('dashboard_lang', language);
    localStorage.setItem('dashboard_2fa', String(twoFAEnabled));
    localStorage.setItem('dashboard_session_timeout', String(sessionTimeout));
    localStorage.setItem('dashboard_autobackup', String(autoBackup));
    localStorage.setItem('dashboard_backup_freq', backupFreq);
    localStorage.setItem('dashboard_email_notif', String(emailNotif));
    localStorage.setItem('dashboard_push_notif', String(pushNotif));
    localStorage.setItem('dashboard_error_alerts', String(errorAlerts));
    localStorage.setItem('dashboard_weekly_report', String(weeklyReport));
    localStorage.setItem('dashboard_date_fmt', dateFormat);
    localStorage.setItem('dashboard_tz', timezone);
    try {
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ site: config?.site, seo: config?.seo, notifications: config?.notifications }) });
      if (!res.ok) throw new Error();
    } catch {
      if (config) localStorage.setItem('swifttrack_config', JSON.stringify(config));
    }
    setSaved(true); setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

  const update = (section: string, key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
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

  const exportAllData = () => {
    const data = { config, theme, language, preferences: { twoFAEnabled, sessionTimeout, autoBackup, backupFreq, emailNotif, pushNotif, errorAlerts, weeklyReport, dateFormat, timezone }, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `dashboard-settings-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const importSettings = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.config) setConfig(data.config);
          if (data.theme) { setTheme(data.theme); localStorage.setItem('dashboard_theme', data.theme); }
          if (data.language) { setLanguage(data.language); localStorage.setItem('dashboard_lang', data.language); }
          if (data.preferences) {
            if (data.preferences.twoFAEnabled !== undefined) setTwoFAEnabled(data.preferences.twoFAEnabled);
            if (data.preferences.sessionTimeout) setSessionTimeout(data.preferences.sessionTimeout);
            if (data.preferences.autoBackup !== undefined) setAutoBackup(data.preferences.autoBackup);
            if (data.preferences.backupFreq) setBackupFreq(data.preferences.backupFreq);
          }
          setSaved(true); setTimeout(() => setSaved(false), 3000);
        } catch { alert('ملف غير صالح'); }
      };
      reader.readAsText(file);
    };
    input.click();
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

  if (!config) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  const SECTIONS = [
    { id: 'appearance', label: 'المظهر', icon: <Palette size={14} /> },
    { id: 'security', label: 'الأمان', icon: <Lock size={14} /> },
    { id: 'site', label: 'الموقع', icon: <Globe size={14} /> },
    { id: 'seo', label: 'SEO', icon: <TrendingUp size={14} /> },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell size={14} /> },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: <HardDrive size={14} /> },
    { id: 'advanced', label: 'متقدم', icon: <Settings size={14} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Settings size={18} className="text-slate-400" /> الإعدادات</h2>
        <div className="flex items-center gap-2 self-start">
          <button onClick={exportAllData} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors"><Download size={12} />تصدير</button>
          <button onClick={importSettings} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors"><Upload size={12} />استيراد</button>
          <button onClick={save} disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? "تم!" : "حفظ"}
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

      {/* APPEARANCE */}
      {activeSection === 'appearance' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Palette size={16} className="text-purple-400" />الثيم</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'dark', label: 'داكن', desc: 'مظهر داكن مريح للعين', icon: '🌙', gradient: 'from-slate-900 to-slate-800', border: 'border-blue-500' },
                { id: 'light', label: 'فاتح', desc: 'مظهر فاتح وواضح', icon: '☀️', gradient: 'from-slate-100 to-white', border: 'border-amber-400' },
                { id: 'auto', label: 'تلقائي', desc: 'يتبع إعدادات النظام', icon: '🔄', gradient: 'from-slate-700 to-slate-400', border: 'border-green-500' },
              ].map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-right ${theme === t.id ? `${t.border} bg-slate-700/50 shadow-lg` : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'}`}>
                  {theme === t.id && <span className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><CheckCircle size={12} className="text-white" /></span>}
                  <span className="text-2xl block mb-2">{t.icon}</span>
                  <p className="text-sm font-medium text-white">{t.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                  <div className={`mt-3 h-6 rounded-md bg-gradient-to-r ${t.gradient}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Globe size={16} className="text-cyan-400" />لغة الواجهة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'ar', label: 'العربية', flag: '🇸🇦', native: 'عربي' },
                { id: 'en', label: 'English', flag: '🇺🇸', native: 'English' },
                { id: 'fr', label: 'Français', flag: '🇫🇷', native: 'Français' },
                { id: 'es', label: 'Español', flag: '🇪🇸', native: 'Español' },
              ].map(l => (
                <button key={l.id} onClick={() => setLanguage(l.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${language === l.id ? 'border-blue-500 bg-blue-900/20' : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'}`}>
                  <span className="text-2xl">{l.flag}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{l.native}</p>
                    <p className="text-xs text-slate-400">{l.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Calendar size={16} className="text-amber-400" />التاريخ والوقت</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">تنسيق التاريخ</label>
                <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                  <option value="ar-SA">هجري</option><option value="ar-EG">ميلادي عربي</option><option value="en-US">MM/DD/YYYY</option><option value="en-GB">DD/MM/YYYY</option><option value="ISO">ISO 8601</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">المنطقة الزمنية</label>
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                  {['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Tokyo', 'UTC'].map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY */}
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
            <h3 className="text-sm font-semibold text-white mb-4">إعدادات الأمان</h3>
            <div className="space-y-3">
              {[
                { label: 'المصادقة الثنائية (2FA)', desc: 'طبقة حماية إضافية', state: twoFAEnabled, set: setTwoFAEnabled },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
                  <div><p className="text-sm font-medium text-white">{n.label}</p><p className="text-xs text-slate-400 mt-0.5">{n.desc}</p></div>
                  <button onClick={() => n.set(!n.state)} className={n.state ? 'text-green-400' : 'text-slate-600'}>{n.state ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}</button>
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">مهلة انتهاء الجلسة (دقائق)</label>
                <select value={sessionTimeout} onChange={e => setSessionTimeout(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                  {[15, 30, 60, 120, 480, 1440].map(m => <option key={m} value={m}>{m >= 60 ? `${m / 60} ساعة` : `${m} دقيقة`}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SITE */}
      {activeSection === 'site' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-4">إعدادات الموقع</h3>
          {[
            { key: 'name', label: 'اسم الموقع', section: 'site' },
            { key: 'domain', label: 'الدومين', section: 'site' },
            { key: 'contactEmail', label: 'بريد التواصل', section: 'site' },
            { key: 'twitterHandle', label: 'Twitter Handle', section: 'site' },
            { key: 'facebookPage', label: 'صفحة Facebook', section: 'site' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-slate-300 block mb-1">{f.label}</label>
              <input value={config[f.section]?.[f.key] || ''} onChange={e => update(f.section, f.key, e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
          ))}
        </div>
      )}

      {/* SEO */}
      {activeSection === 'seo' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-4">إعدادات SEO</h3>
          {[
            { key: 'titleSuffix', label: 'لاحقة العنوان' },
            { key: 'defaultKeywords', label: 'الكلمات المفتاحية الافتراضية' },
            { key: 'canonicalDomain', label: 'النطاق الأساسي (Canonical)' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-slate-300 block mb-1">{f.label}</label>
              <input value={config.seo?.[f.key] || ''} onChange={e => update('seo', f.key, e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">الوصف الافتراضي</label>
            <textarea value={config.seo?.defaultDescription || ''} onChange={e => update('seo', 'defaultDescription', e.target.value)} rows={3}
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
                <button onClick={() => update('seo', f.key, !config.seo?.[f.key])} className={config.seo?.[f.key] ? 'text-green-400' : 'text-slate-600'}>
                  {config.seo?.[f.key] ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {activeSection === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Bell size={16} className="text-blue-400" />تفضيلات الإشعارات</h3>
            <div className="space-y-3">
              {[
                { label: 'إشعارات البريد', desc: 'إرسال تنبيهات عبر البريد', state: emailNotif, set: setEmailNotif },
                { label: 'إشعارات الدفع', desc: 'إشعارات فورية في المتصفح', state: pushNotif, set: setPushNotif },
                { label: 'تنبيهات الأخطاء', desc: 'إشعار فوري عند حدوث أخطاء', state: errorAlerts, set: setErrorAlerts },
                { label: 'التقرير الأسبوعي', desc: 'ملخص أسبوعي بالإحصائيات', state: weeklyReport, set: setWeeklyReport },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
                  <div><p className="text-sm font-medium text-white">{n.label}</p><p className="text-xs text-slate-400 mt-0.5">{n.desc}</p></div>
                  <button onClick={() => n.set(!n.state)} className={n.state ? 'text-green-400' : 'text-slate-600'}>{n.state ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}</button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Link2 size={16} className="text-purple-400" />Webhooks</h3>
            <div className="space-y-3">
              {[
                { key: 'alertEmail', label: 'البريد الإلكتروني', placeholder: 'alerts@example.com' },
                { key: 'slackWebhook', label: 'Slack Webhook', placeholder: 'https://hooks.slack.com/...' },
                { key: 'discordWebhook', label: 'Discord Webhook', placeholder: 'https://discord.com/api/webhooks/...' },
                { key: 'telegramBotToken', label: 'Telegram Bot Token', placeholder: '1234567890:AAF...' },
                { key: 'telegramChatId', label: 'Telegram Chat ID', placeholder: '-1001234567890' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-slate-300 block mb-1">{f.label}</label>
                  <input value={config.notifications?.[f.key] || ''} onChange={e => update('notifications', f.key, e.target.value)} placeholder={f.placeholder}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BACKUP */}
      {activeSection === 'backup' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><HardDrive size={16} className="text-orange-400" />النسخ الاحتياطي</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
                <div><p className="text-sm font-medium text-white">تفعيل النسخ التلقائي</p><p className="text-xs text-slate-400 mt-0.5">نسخ احتياطي تلقائي لجميع الإعدادات</p></div>
                <button onClick={() => setAutoBackup(!autoBackup)} className={autoBackup ? 'text-green-400' : 'text-slate-600'}>{autoBackup ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}</button>
              </div>
              {autoBackup && (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">تكرار النسخ</label>
                  <select value={backupFreq} onChange={e => setBackupFreq(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                    <option value="hourly">كل ساعة</option><option value="daily">يومياً</option><option value="weekly">أسبوعياً</option><option value="monthly">شهرياً</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Download size={16} className="text-blue-400" />تصدير واستيراد</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={exportAllData} className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded-xl text-sm font-medium text-white transition-colors"><Download size={16} />تصدير (JSON)</button>
              <button onClick={importSettings} className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium text-slate-200 transition-colors"><Upload size={16} />استيراد</button>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED */}
      {activeSection === 'advanced' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Code size={16} className="text-cyan-400" />إعدادات المطور</h3>
            <div className="space-y-3">
              {[
                { key: 'debugMode', label: 'وضع التطوير (Debug)', desc: 'إظهار سجلات التصحيح' },
                { key: 'performanceMode', label: 'وضع الأداء العالي', desc: 'تعطيل الرسوم المتحركة' },
                { key: 'compression', label: 'ضغط الأصول', desc: 'تفعيل Gzip/Brotli' },
              ].map(f => (
                <div key={f.key} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
                  <div><p className="text-sm font-medium text-white">{f.label}</p><p className="text-xs text-slate-400 mt-0.5">{f.desc}</p></div>
                  <button onClick={() => update('site', f.key, !config.site?.[f.key])} className={config.site?.[f.key] ? 'text-green-400' : 'text-slate-600'}>
                    {config.site?.[f.key] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Database size={16} className="text-green-400" />التخزين المؤقت</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
                <div><p className="text-sm font-medium text-white">Service Worker Cache</p><p className="text-xs text-slate-400 mt-0.5">تخزين الصفحات محلياً</p></div>
                <button onClick={() => update('site', 'swCache', !config.site?.swCache)} className={config.site?.swCache ? 'text-green-400' : 'text-slate-600'}>
                  {config.site?.swCache ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>
              <button onClick={() => { if ('caches' in window) { caches.keys().then(ks => ks.forEach(k => caches.delete(k))); } localStorage.clear(); alert('تم مسح جميع التخزين المؤقت!'); }}
                className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-sm font-medium text-white transition-colors"><Trash2 size={14} />مسح الكاش</button>
            </div>
          </div>

          <div className="bg-red-900/15 border border-red-700/40 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-red-300 mb-3 flex items-center gap-2"><AlertCircle size={16} />منطقة الخطر</h3>
            <p className="text-xs text-red-400/70 mb-4">هذه الإجراءات لا يمكن التراجع عنها.</p>
            <button onClick={() => { if (confirm('هل أنت متأكد من إعادة ضبط جميع الإعدادات؟')) { localStorage.clear(); window.location.reload(); } }}
              className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg text-sm font-medium text-red-200 transition-colors border border-red-700"><RefreshCw size={14} />إعادة ضبط المصنع</button>
          </div>
        </div>
      )}
    </div>
  );
}

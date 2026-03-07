import React, { useState, useEffect } from "react";
import {
  DollarSign, Save, CheckCircle, Loader2, Plus, Trash2, Edit3,
  ToggleLeft, ToggleRight, Copy, ExternalLink, AlertTriangle,
  TrendingUp, Eye, MousePointer, BarChart3, Globe, Shield,
  FileText, Mail, MapPin, Lock, Clock, CheckSquare, Square,
  MonitorSmartphone, Smartphone, PanelTop, PanelBottom, Columns,
  BookOpen, ArrowRight, Wifi, WifiOff, RefreshCw, Key,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  type AdSenseConfig,
  type AdUnitConfig,
  getAdSenseConfig,
  saveAdSenseConfig,
} from "@/lib/adsense-config";

const STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  not_applied: { label: 'لم يُقدَّم بعد', color: 'text-slate-400 bg-slate-800', icon: '⏳' },
  pending: { label: 'قيد المراجعة', color: 'text-yellow-300 bg-yellow-900/30', icon: '🔄' },
  approved: { label: 'تمت الموافقة ✅', color: 'text-green-300 bg-green-900/30', icon: '✅' },
  rejected: { label: 'مرفوض', color: 'text-red-300 bg-red-900/30', icon: '❌' },
};

const PLACEMENT_INFO = [
  { key: 'header', label: 'أعلى الصفحة (Header)', icon: PanelTop, desc: 'Leaderboard 728×90' },
  { key: 'afterResults', label: 'بعد نتائج التتبع', icon: BarChart3, desc: 'Rectangle 300×250' },
  { key: 'sidebar', label: 'الشريط الجانبي', icon: Columns, desc: 'Skyscraper — Desktop فقط' },
  { key: 'footer', label: 'أسفل الصفحة (Footer)', icon: PanelBottom, desc: 'Banner 728×90' },
  { key: 'inArticle', label: 'داخل المقالات', icon: BookOpen, desc: 'In-Article Fluid' },
];

export default function AdSenseManagerTab() {
  const [config, setConfig] = useState<AdSenseConfig>(getAdSenseConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('config');
  const [editingUnit, setEditingUnit] = useState<string | null>(null);

  // OAuth state
  const [oauthStatus, setOauthStatus] = useState<{ connected: boolean; hasCredentials: boolean }>({ connected: false, hasCredentials: false });
  const [oauthClientId, setOauthClientId] = useState('');
  const [oauthClientSecret, setOauthClientSecret] = useState('');
  const [oauthSaving, setOauthSaving] = useState(false);
  const [fetchingStats, setFetchingStats] = useState(false);

  useEffect(() => {
    fetch('/api/adsense/oauth-status').then(r => r.ok ? r.json() : null).then(d => {
      if (d) setOauthStatus(d);
    }).catch(() => {});
  }, []);

  const save = () => {
    setSaving(true);
    saveAdSenseConfig(config);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 500);
  };

  const updateConfig = (patch: Partial<AdSenseConfig>) => setConfig(prev => ({ ...prev, ...patch }));
  const updateStats = (patch: Partial<AdSenseConfig['stats']>) => setConfig(prev => ({ ...prev, stats: { ...prev.stats, ...patch } }));
  const updatePlacements = (key: string, val: boolean) => setConfig(prev => ({ ...prev, placements: { ...prev.placements, [key]: val } }));

  const addUnit = () => {
    const newUnit: AdUnitConfig = {
      id: `unit-${Date.now()}`,
      name: 'وحدة إعلانية جديدة',
      slotId: '',
      format: 'auto',
      placement: 'header',
      enabled: false,
    };
    updateConfig({ adUnits: [...config.adUnits, newUnit] });
  };

  const updateUnit = (id: string, patch: Partial<AdUnitConfig>) => {
    updateConfig({ adUnits: config.adUnits.map(u => u.id === id ? { ...u, ...patch } : u) });
  };

  const removeUnit = (id: string) => {
    if (!confirm('هل تريد حذف هذه الوحدة الإعلانية؟')) return;
    updateConfig({ adUnits: config.adUnits.filter(u => u.id !== id) });
  };

  const SECTIONS = [
    { id: 'config', label: '⚙️ الإعدادات' },
    { id: 'placements', label: '📍 المواضع' },
    { id: 'revenue', label: '💰 الإيرادات' },
    { id: 'compliance', label: '✅ الامتثال' },
    { id: 'application', label: '📋 حالة الطلب' },
    { id: 'adstxt', label: '📄 ads.txt' },
  ];

  const isConfigured = config.publisherId && config.publisherId.startsWith('ca-pub-');

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign size={18} className="text-yellow-400" />
            Google AdSense Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">إدارة شاملة لـ AdSense — الإعدادات، المواضع، الإيرادات، والامتثال</p>
        </div>
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all self-start ${
            saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? "تم الحفظ!" : "حفظ الكل"}
        </button>
      </div>

      {/* Warning if not configured */}
      {!isConfigured && (
        <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-300">AdSense غير مُهيّأ</p>
            <p className="text-xs text-yellow-400/70 mt-1">أدخل Publisher ID أولاً (مثال: ca-pub-1234567890123456) ثم فعّل الإعلانات</p>
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeSection === s.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Section: Configuration ── */}
      {activeSection === 'config' && (
        <div className="space-y-4">
          {/* Publisher ID & Master Toggle */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-yellow-300 flex items-center gap-2">
              <DollarSign size={14} /> إعدادات Google AdSense الأساسية
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Publisher ID</label>
                <input type="text" value={config.publisherId} onChange={e => updateConfig({ publisherId: e.target.value })}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-yellow-500 font-mono" />
                {config.publisherId && !config.publisherId.startsWith('ca-pub-') && (
                  <p className="text-[10px] text-red-400 mt-1">⚠️ يجب أن يبدأ بـ ca-pub-</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => updateConfig({ enabled: !config.enabled })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      config.enabled ? "bg-green-700 text-green-200" : "bg-slate-700 text-slate-400"
                    }`}>
                    {config.enabled ? <><ToggleRight size={18} />مفعّل</> : <><ToggleLeft size={18} />معطّل</>}
                  </button>
                  <button onClick={() => updateConfig({ autoAds: !config.autoAds })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      config.autoAds ? "bg-blue-700 text-blue-200" : "bg-slate-700 text-slate-400"
                    }`}>
                    {config.autoAds ? <><ToggleRight size={16} />Auto Ads</> : <><ToggleLeft size={16} />Auto Ads</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Units Table */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">الوحدات الإعلانية ({config.adUnits.length})</h3>
              <button onClick={addUnit} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300">
                <Plus size={12} />إضافة وحدة
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700">
                    <th className="text-right py-2 px-2">الاسم</th>
                    <th className="text-right py-2 px-2">Slot ID</th>
                    <th className="text-right py-2 px-2">الشكل</th>
                    <th className="text-right py-2 px-2">الموضع</th>
                    <th className="text-center py-2 px-2">الحالة</th>
                    <th className="text-center py-2 px-2">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {config.adUnits.map(unit => (
                    <React.Fragment key={unit.id}>
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/20">
                        <td className="py-2 px-2 text-slate-200 font-medium">{unit.name}</td>
                        <td className="py-2 px-2 text-slate-400 font-mono text-[10px]">{unit.slotId || '—'}</td>
                        <td className="py-2 px-2 text-slate-400">{unit.format}</td>
                        <td className="py-2 px-2 text-slate-400">{unit.placement}</td>
                        <td className="py-2 px-2 text-center">
                          <button onClick={() => updateUnit(unit.id, { enabled: !unit.enabled })}>
                            {unit.enabled
                              ? <span className="text-green-400 text-[10px] bg-green-900/40 px-2 py-0.5 rounded-full">نشط</span>
                              : <span className="text-slate-500 text-[10px] bg-slate-800 px-2 py-0.5 rounded-full">معطّل</span>
                            }
                          </button>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => setEditingUnit(editingUnit === unit.id ? null : unit.id)} className="text-slate-400 hover:text-blue-400 p-1"><Edit3 size={12} /></button>
                            <button onClick={() => removeUnit(unit.id)} className="text-slate-400 hover:text-red-400 p-1"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                      {editingUnit === unit.id && (
                        <tr>
                          <td colSpan={6} className="p-3 bg-slate-900/50">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="text-[10px] text-slate-500 block mb-1">اسم الوحدة</label>
                                <input value={unit.name} onChange={e => updateUnit(unit.id, { name: e.target.value })}
                                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500 block mb-1">Slot ID</label>
                                <input value={unit.slotId} onChange={e => updateUnit(unit.id, { slotId: e.target.value })}
                                  placeholder="1234567890"
                                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500" />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500 block mb-1">الشكل</label>
                                <select value={unit.format} onChange={e => updateUnit(unit.id, { format: e.target.value as any })}
                                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500">
                                  <option value="auto">Auto</option>
                                  <option value="rectangle">Rectangle</option>
                                  <option value="horizontal">Horizontal</option>
                                  <option value="vertical">Vertical</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500 block mb-1">الموضع</label>
                                <select value={unit.placement} onChange={e => updateUnit(unit.id, { placement: e.target.value })}
                                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500">
                                  <option value="header">Header</option>
                                  <option value="afterResults">After Results</option>
                                  <option value="sidebar">Sidebar</option>
                                  <option value="footer">Footer</option>
                                  <option value="inArticle">In-Article</option>
                                </select>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Section: Placements ── */}
      {activeSection === 'placements' && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <MonitorSmartphone size={14} /> التحكم في مواضع الإعلانات
          </h3>
          <p className="text-xs text-slate-500">فعّل أو عطّل كل موضع إعلاني بشكل مستقل</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLACEMENT_INFO.map(p => {
              const Icon = p.icon;
              const enabled = config.placements[p.key as keyof typeof config.placements];
              return (
                <div key={p.key} className={`border rounded-xl p-4 flex items-center gap-3 transition-all ${
                  enabled ? 'border-green-700/40 bg-green-900/10' : 'border-slate-700/60 bg-slate-900/30'
                }`}>
                  <button onClick={() => updatePlacements(p.key, !enabled)}
                    className={`flex-shrink-0 ${enabled ? 'text-green-400' : 'text-slate-600'}`}>
                    {enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={enabled ? 'text-green-400' : 'text-slate-500'} />
                      <span className="text-sm font-medium text-white">{p.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{p.desc}</p>
                  </div>
                  {enabled && <span className="text-[10px] bg-green-900/50 text-green-300 px-2 py-0.5 rounded-full">✅</span>}
                </div>
              );
            })}
          </div>

          {/* Visual Page Map */}
          <div className="bg-slate-900/50 border border-slate-700/40 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-3 font-medium">🗺️ خريطة الصفحة — مواضع الإعلانات</p>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <div className={`border rounded-lg p-2 text-center text-[10px] ${config.placements.header ? 'border-green-600 bg-green-900/20 text-green-300' : 'border-slate-700 text-slate-600'}`}>
                🔝 Header Ad — 728×90
              </div>
              <div className="border border-slate-700 rounded-lg p-3 text-center text-xs text-slate-500">
                📦 محتوى الصفحة الرئيسي
              </div>
              <div className={`border rounded-lg p-2 text-center text-[10px] ${config.placements.afterResults ? 'border-green-600 bg-green-900/20 text-green-300' : 'border-slate-700 text-slate-600'}`}>
                📊 After Results Ad — 300×250
              </div>
              <div className={`border rounded-lg p-2 text-center text-[10px] ${config.placements.inArticle ? 'border-green-600 bg-green-900/20 text-green-300' : 'border-slate-700 text-slate-600'}`}>
                📰 In-Article Ad — Fluid
              </div>
              <div className={`border rounded-lg p-2 text-center text-[10px] ${config.placements.footer ? 'border-green-600 bg-green-900/20 text-green-300' : 'border-slate-700 text-slate-600'}`}>
                🔻 Footer Ad — 728×90
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Section: Revenue ── */}
      {activeSection === 'revenue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'أرباح اليوم', key: 'todayEarnings', icon: DollarSign, color: 'text-green-400', prefix: '$' },
              { label: 'أرباح الشهر', key: 'monthEarnings', icon: TrendingUp, color: 'text-blue-400', prefix: '$' },
              { label: 'RPM', key: 'rpm', icon: BarChart3, color: 'text-purple-400', prefix: '$' },
              { label: 'الظهورات', key: 'impressions', icon: Eye, color: 'text-yellow-400', prefix: '' },
              { label: 'النقرات', key: 'clicks', icon: MousePointer, color: 'text-orange-400', prefix: '' },
              { label: 'CTR', key: 'ctr', icon: TrendingUp, color: 'text-cyan-400', suffix: '%' },
            ].map(stat => {
              const Icon = stat.icon;
              const val = config.stats[stat.key as keyof typeof config.stats];
              return (
                <div key={stat.key} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className={stat.color} />
                    <span className="text-[10px] text-slate-400">{stat.label}</span>
                  </div>
                  <input type="number" step="0.01" value={val as number}
                    onChange={e => updateStats({ [stat.key]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-lg font-bold text-white focus:outline-none focus:border-blue-500" />
                  <div className="text-[10px] text-slate-600 mt-1">{stat.prefix || ''}{(val as number).toFixed(2)}{(stat as any).suffix || ''}</div>
                </div>
              );
            })}
          </div>

          {/* Auto-fetch from API */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              {oauthStatus.connected ? <Wifi size={12} className="text-green-400" /> : <WifiOff size={12} className="text-slate-500" />}
              Google AdSense API (OAuth)
            </h4>

            {oauthStatus.connected ? (
              <div className="space-y-2">
                <p className="text-[10px] text-green-400">✅ متصل — يمكنك جلب الإحصائيات تلقائياً</p>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      setFetchingStats(true);
                      try {
                        const r = await fetch('/api/adsense/stats');
                        const d = await r.json();
                        if (d.success && d.stats) {
                          updateStats(d.stats);
                          save();
                        } else {
                          toast({ title: '❌ فشل', description: d.error || 'فشل جلب الإحصائيات', variant: 'destructive' });
                        }
                      } catch { toast({ title: '❌ خطأ', description: 'تعذر الاتصال بالسيرفر', variant: 'destructive' }); }
                      setFetchingStats(false);
                    }}
                    disabled={fetchingStats}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs text-white disabled:opacity-50">
                    {fetchingStats ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                    جلب الإحصائيات تلقائياً
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('هل تريد فصل حساب AdSense؟')) {
                        await fetch('/api/adsense/oauth-disconnect', { method: 'POST' });
                        setOauthStatus({ connected: false, hasCredentials: false });
                      }
                    }}
                    className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800/50 border border-red-700/50 rounded-lg text-xs text-red-300">
                    فصل الحساب
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] text-slate-500">
                  اربط حساب AdSense عبر OAuth لجلب الإحصائيات تلقائياً. تحتاج Google Cloud OAuth Client ID.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">OAuth Client ID</label>
                    <input value={oauthClientId} onChange={e => setOauthClientId(e.target.value)}
                      placeholder="xxxxx.apps.googleusercontent.com"
                      className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">OAuth Client Secret</label>
                    <input type="password" value={oauthClientSecret} onChange={e => setOauthClientSecret(e.target.value)}
                      placeholder="GOCSPX-..."
                      className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (!oauthClientId || !oauthClientSecret) return toast({ title: '⚠️ تنبيه', description: 'أدخل Client ID و Secret أولاً', variant: 'destructive' });
                      setOauthSaving(true);
                      try {
                        await fetch('/api/adsense/oauth-config', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ clientId: oauthClientId, clientSecret: oauthClientSecret }),
                        });
                        const urlRes = await fetch('/api/adsense/oauth-url');
                        const { url } = await urlRes.json();
                        window.open(url, '_blank', 'width=600,height=700');
                        // Poll for connection
                        const poll = setInterval(async () => {
                          const s = await fetch('/api/adsense/oauth-status').then(r => r.json());
                          if (s.connected) { setOauthStatus(s); clearInterval(poll); }
                        }, 3000);
                        setTimeout(() => clearInterval(poll), 120000);
                      } catch { alert('تعذر الاتصال بالسيرفر'); }
                      setOauthSaving(false);
                    }}
                    disabled={oauthSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs text-white disabled:opacity-50">
                    {oauthSaving ? <Loader2 size={12} className="animate-spin" /> : <Key size={12} />}
                    ربط حساب AdSense
                  </button>
                  <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300">
                    <ExternalLink size={10} />Google Cloud Console
                  </a>
                </div>
                <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">📋 خطوات الإعداد:</p>
                  <ol className="text-[10px] text-slate-600 space-y-0.5 list-decimal list-inside">
                    <li>افتح Google Cloud Console → APIs & Services → Credentials</li>
                    <li>أنشئ OAuth 2.0 Client ID (Web application)</li>
                    <li>أضف Redirect URI: <code className="bg-slate-800 px-1 rounded">https://yourdomain.com:3001/api/adsense/oauth-callback</code></li>
                    <li>فعّل AdSense Management API من Library</li>
                    <li>الصق Client ID و Secret هنا واضغط "ربط"</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Manual update & dashboard link */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">آخر تحديث: {config.stats.lastUpdated || 'لم يتم التحديث بعد'}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{oauthStatus.connected ? 'متصل عبر OAuth — اضغط "جلب تلقائي" أعلاه' : 'أدخل الأرقام يدوياً أو اربط OAuth'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateStats({ lastUpdated: new Date().toLocaleString('ar') })}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs text-white">
                📝 تحديث يدوي
              </button>
              <a href="https://www.google.com/adsense" target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300">
                <ExternalLink size={10} />AdSense Dashboard
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Section: Compliance ── */}
      {activeSection === 'compliance' && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Shield size={14} className="text-green-400" /> فحص الامتثال لسياسات AdSense
          </h3>
          <p className="text-xs text-slate-500">تأكد من استيفاء موقعك لجميع متطلبات Google AdSense قبل تقديم الطلب</p>

          <div className="space-y-2">
            {[
              { id: 'privacy', label: 'صفحة سياسة الخصوصية', icon: Shield, path: '/privacy-policy', status: true },
              { id: 'about', label: 'صفحة من نحن', icon: FileText, path: '/about', status: true },
              { id: 'contact', label: 'صفحة اتصل بنا', icon: Mail, path: '/contact', status: true },
              { id: 'sitemap', label: 'ملف sitemap.xml', icon: MapPin, path: '/sitemap.xml', status: true },
              { id: 'robots', label: 'ملف robots.txt مُهيّأ', icon: Globe, path: '/robots.txt', status: true },
              { id: 'ssl', label: 'شهادة SSL (HTTPS)', icon: Lock, path: null, status: true },
              { id: 'content', label: 'أكثر من 10 صفحات محتوى', icon: BookOpen, path: null, status: true },
              { id: 'age', label: 'عمر الموقع (6+ أشهر موصى)', icon: Clock, path: null, status: false, warning: true },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  item.status ? 'bg-green-900/10 border border-green-700/30' : item.warning ? 'bg-yellow-900/10 border border-yellow-700/30' : 'bg-red-900/10 border border-red-700/30'
                }`}>
                  <span className="flex-shrink-0">
                    {item.status ? <CheckSquare size={16} className="text-green-400" /> : item.warning ? <AlertTriangle size={16} className="text-yellow-400" /> : <Square size={16} className="text-red-400" />}
                  </span>
                  <Icon size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="text-xs text-slate-200 flex-1">{item.label}</span>
                  {item.path && (
                    <a href={item.path} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      عرض <ExternalLink size={10} />
                    </a>
                  )}
                  {item.warning && <span className="text-[10px] text-yellow-400">⚠️ الموقع جديد</span>}
                </div>
              );
            })}
          </div>

          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mt-3">
            <p className="text-xs text-blue-300">💡 <strong>نصيحة:</strong> Google عادةً ترفض المواقع الجديدة (أقل من شهر). جهّز كل شيء الآن وقدّم الطلب بعد 2-4 أسابيع.</p>
          </div>
        </div>
      )}

      {/* ── Section: Application ── */}
      {activeSection === 'application' && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">📋 متتبع طلب AdSense</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">حالة الطلب</label>
              <select value={config.applicationStatus}
                onChange={e => updateConfig({ applicationStatus: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                <option value="not_applied">لم يُقدَّم بعد</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">تمت الموافقة</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">تاريخ التقديم</label>
              <input type="date" value={config.applicationDate || ''}
                onChange={e => updateConfig({ applicationDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className={`p-4 rounded-xl text-center ${STATUS_LABELS[config.applicationStatus].color}`}>
            <p className="text-2xl mb-1">{STATUS_LABELS[config.applicationStatus].icon}</p>
            <p className="text-sm font-bold">{STATUS_LABELS[config.applicationStatus].label}</p>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">ملاحظات</label>
            <textarea value={config.applicationNotes} onChange={e => updateConfig({ applicationNotes: e.target.value })}
              rows={3} placeholder="أضف ملاحظاتك هنا..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none" />
          </div>

          <a href="https://www.google.com/adsense/start/" target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-sm font-medium text-white transition-all">
            <ExternalLink size={14} />
            فتح لوحة تحكم Google AdSense
            <ArrowRight size={14} />
          </a>
        </div>
      )}

      {/* ── Section: ads.txt ── */}
      {activeSection === 'adstxt' && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <FileText size={14} /> ملف ads.txt
          </h3>
          <p className="text-xs text-slate-500">هذا الملف مطلوب من Google لتأكيد ملكيتك كناشر معتمد</p>

          <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">المحتوى المطلوب لـ <code className="text-blue-400">uspostaltracking.com/ads.txt</code>:</p>
            <pre className="text-sm text-green-400 font-mono bg-black/30 p-3 rounded-lg overflow-x-auto">
              {`google.com, ${config.publisherId || 'pub-XXXXXXXXXX'}, DIRECT, f08c47fec0942fa0`}
            </pre>
            <button onClick={() => navigator.clipboard.writeText(`google.com, ${config.publisherId || 'pub-XXXXXXXXXX'}, DIRECT, f08c47fec0942fa0`)}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300">
              <Copy size={10} />نسخ المحتوى
            </button>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">📍 <strong>الموقع:</strong> يجب أن يكون الملف متاحاً على <code className="text-blue-400">https://uspostaltracking.com/ads.txt</code></p>
            <p className="text-xs text-blue-300/70 mt-1">الملف موجود بالفعل في <code className="text-blue-400">public/ads.txt</code> — حدّث الـ Publisher ID وارفعه</p>
          </div>
        </div>
      )}
    </div>
  );
}

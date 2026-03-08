import { useState, useCallback, useMemo } from "react";
import {
  ChevronDown, ChevronRight, Eye, EyeOff, Play, Plus, RotateCcw, Trash2, Power, X,
  Loader2, CheckCircle, XCircle, AlertTriangle, WifiOff, ArrowUp, ArrowDown,
  Activity, Clock, TrendingUp, Server, Shield, Zap, Edit3, RefreshCw
} from "lucide-react";
import { ApiProvider, ApiAccount } from "./types";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

const STATUS_AR: Record<string, string> = { active: 'نشط', exhausted: 'مستنفد', error: 'خطأ', disabled: 'معطل', inactive: 'غير نشط' };

const PROVIDER_COLORS: Record<string, { gradient: string; border: string; bg: string; text: string; icon: string }> = {
  ship24: { gradient: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'bg-blue-500/20' },
  trackingmore: { gradient: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'bg-emerald-500/20' },
  '17track': { gradient: 'from-orange-500/20 to-orange-600/5', border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', icon: 'bg-orange-500/20' },
  usps_scraper: { gradient: 'from-red-500/20 to-red-600/5', border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400', icon: 'bg-red-500/20' },
};

const PROVIDER_DESCRIPTIONS: Record<string, string> = {
  ship24: 'تتبع شامل عبر أكثر من 1200 شركة شحن عالمية',
  trackingmore: 'واجهة برمجة موثوقة لتتبع الشحنات الدولية',
  '17track': 'منصة تتبع متقدمة تدعم شركات الشحن الصينية',
  usps_scraper: 'استخراج بيانات التتبع مباشرة من موقع USPS',
};

function getProviderTheme(id: string) {
  return PROVIDER_COLORS[id] || { gradient: 'from-slate-500/20 to-slate-600/5', border: 'border-slate-500/30', bg: 'bg-slate-500/10', text: 'text-slate-400', icon: 'bg-slate-500/20' };
}

function getProviderStatus(provider: ApiProvider): 'active' | 'inactive' | 'error' | 'exhausted' {
  if (!provider.enabled) return 'inactive';
  const activeAccounts = provider.accounts.filter(a => a.enabled);
  if (activeAccounts.length === 0) return 'inactive';
  const hasError = activeAccounts.some(a => a.status === 'error');
  if (hasError && activeAccounts.every(a => a.status === 'error')) return 'error';
  const allExhausted = activeAccounts.every(a => a.status === 'exhausted');
  if (allExhausted) return 'exhausted';
  return 'active';
}

function ProviderStatusBadge({ status }: { status: 'active' | 'inactive' | 'error' | 'exhausted' }) {
  const styles = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    error: 'bg-red-500/15 text-red-400 border-red-500/30',
    exhausted: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      {status === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
      {status === 'exhausted' && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
      {STATUS_AR[status] || status}
    </span>
  );
}

function AccountStatusBadge({ status }: { status: ApiAccount['status'] }) {
  const styles = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    exhausted: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    disabled: 'bg-slate-500/20 text-slate-500 border-slate-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles[status]}`}>
      {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      {STATUS_AR[status] || status}
    </span>
  );
}

function QuotaBar({ used, total, label, compact }: { used: number; total: number; label?: string; compact?: boolean }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  const color = pct < 50 ? 'bg-emerald-500' : pct < 80 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="w-full">
      {label && <p className="text-[10px] text-slate-500 mb-1">{label}</p>}
      <div className={`flex justify-between text-slate-400 mb-1 ${compact ? 'text-[9px]' : 'text-[10px]'}`} dir="ltr">
        <span>{used.toLocaleString()} / {total.toLocaleString()}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className={`rounded-full bg-slate-700/50 overflow-hidden ${compact ? 'h-1.5' : 'h-2'}`}>
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

function SuccessRateBar({ rate, size = 'md' }: { rate: number; size?: 'sm' | 'md' }) {
  const color = rate >= 90 ? 'bg-emerald-500' : rate >= 70 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = rate >= 90 ? 'text-emerald-400' : rate >= 70 ? 'text-amber-400' : 'text-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 rounded-full bg-slate-700/50 overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(rate, 100)}%` }} />
      </div>
      <span className={`font-bold tabular-nums ${size === 'sm' ? 'text-[10px]' : 'text-xs'} ${textColor}`}>{rate.toFixed(1)}%</span>
    </div>
  );
}

function HealthOverview({ providers }: { providers: ApiProvider[] }) {
  const totalProviders = providers.length;
  const activeAccounts = providers.reduce((sum, p) => sum + p.accounts.filter(a => a.enabled && a.status === 'active').length, 0);
  const totalAccounts = providers.reduce((sum, p) => sum + p.accounts.length, 0);
  const totalRequests = providers.reduce((sum, p) => sum + p.accounts.reduce((s, a) => s + a.successCount + a.errorCount, 0), 0);
  const totalSuccess = providers.reduce((sum, p) => sum + p.accounts.reduce((s, a) => s + a.successCount, 0), 0);
  const overallRate = totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 0;

  const stats = [
    { label: 'إجمالي المزودين', value: totalProviders, icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'حسابات نشطة', value: `${activeAccounts}/${totalAccounts}`, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'إجمالي الطلبات', value: totalRequests.toLocaleString(), icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'نسبة النجاح', value: `${overallRate.toFixed(1)}%`, icon: TrendingUp, color: overallRate >= 90 ? 'text-emerald-400' : overallRate >= 70 ? 'text-amber-400' : 'text-red-400', bg: overallRate >= 90 ? 'bg-emerald-500/10' : overallRate >= 70 ? 'bg-amber-500/10' : 'bg-red-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${s.bg}`}>
              <s.icon size={16} className={s.color} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProviderHealthBars({ providers }: { providers: ApiProvider[] }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
      <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
        <Activity size={14} className="text-blue-400" />
        صحة المزودين
      </h3>
      {providers.map(p => {
        const theme = getProviderTheme(p.id);
        const totalOps = p.accounts.reduce((s, a) => s + a.successCount + a.errorCount, 0);
        const successOps = p.accounts.reduce((s, a) => s + a.successCount, 0);
        const rate = totalOps > 0 ? (successOps / totalOps) * 100 : 0;
        return (
          <div key={p.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{p.icon}</span>
                <span className="text-[11px] font-medium text-slate-300">{p.name}</span>
              </div>
              <span className={`text-[10px] font-semibold ${theme.text}`}>{totalOps > 0 ? `${rate.toFixed(1)}%` : '—'}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${rate >= 90 ? 'bg-emerald-500' : rate >= 70 ? 'bg-amber-500' : rate > 0 ? 'bg-red-500' : 'bg-slate-600'}`}
                style={{ width: `${totalOps > 0 ? Math.min(rate, 100) : 0}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RotationInfo({ providers, onForceRotate }: { providers: ApiProvider[]; onForceRotate: () => void }) {
  const [confirmRotate, setConfirmRotate] = useState(false);
  const primary = [...providers].sort((a, b) => a.priority - b.priority).find(p => p.enabled);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
      <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
        <RefreshCw size={14} className="text-amber-400" />
        التدوير التلقائي
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">استراتيجية التدوير</span>
          <span className="text-[11px] text-slate-300 font-medium">الأولوية + الحصة المتاحة</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">المزود الأساسي الحالي</span>
          {primary ? (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-white">
              <span>{primary.icon}</span>
              {primary.name}
            </span>
          ) : (
            <span className="text-[11px] text-red-400">لا يوجد مزود نشط</span>
          )}
        </div>
      </div>
      {confirmRotate ? (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
          <span className="text-[10px] text-amber-300 flex-1">هل تريد التبديل للمزود التالي؟</span>
          <button onClick={() => { onForceRotate(); setConfirmRotate(false); }}
            className="px-2.5 py-1 text-[10px] font-medium rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">تأكيد</button>
          <button onClick={() => setConfirmRotate(false)}
            className="px-2.5 py-1 text-[10px] font-medium rounded bg-slate-700 text-slate-400 hover:text-white transition-colors">إلغاء</button>
        </div>
      ) : (
        <button onClick={() => setConfirmRotate(true)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
          <RotateCcw size={12} />
          تبديل إجباري
        </button>
      )}
    </div>
  );
}

function TestResultDisplay({ result }: { result: { ok: boolean; latency?: number; message?: string; httpStatus?: number; sampleResponse?: string } }) {
  return (
    <div className={`mt-3 p-3 rounded-lg border space-y-2 ${result.ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
      <div className="flex items-center gap-2">
        {result.ok ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-red-400" />}
        <span className={`text-xs font-semibold ${result.ok ? 'text-emerald-400' : 'text-red-400'}`}>
          {result.ok ? 'الاختبار ناجح' : 'فشل الاختبار'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        {result.latency !== undefined && (
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="text-slate-500" />
            <span className="text-slate-500">زمن الاستجابة:</span>
            <span className="font-mono text-blue-400 font-semibold">{result.latency}ms</span>
          </div>
        )}
        {result.httpStatus && (
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-slate-500" />
            <span className="text-slate-500">حالة HTTP:</span>
            <span className={`font-mono font-semibold ${result.httpStatus < 400 ? 'text-emerald-400' : 'text-red-400'}`}>{result.httpStatus}</span>
          </div>
        )}
      </div>
      {result.message && (
        <p className={`text-[10px] ${result.ok ? 'text-emerald-400/80' : 'text-red-400/80'}`}>{result.message}</p>
      )}
      {result.sampleResponse && (
        <div className="mt-1">
          <p className="text-[9px] text-slate-500 mb-1">نموذج الاستجابة:</p>
          <pre className="text-[9px] font-mono text-slate-400 bg-slate-800/50 p-2 rounded overflow-x-auto max-h-20" dir="ltr">
            {result.sampleResponse}
          </pre>
        </div>
      )}
    </div>
  );
}

function AddAccountModal({ provider, onClose, onAdd }: {
  provider: ApiProvider;
  onClose: () => void;
  onAdd: (account: ApiAccount) => void;
}) {
  const theme = getProviderTheme(provider.id);
  const [name, setName] = useState(`${provider.name} - حساب ${provider.accounts.length + 1}`);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [dailyQuota, setDailyQuota] = useState(500);
  const [monthlyQuota, setMonthlyQuota] = useState(5000);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'اسم الحساب مطلوب';
    if (name.trim().length > 100) errs.name = 'الاسم طويل جداً (الحد الأقصى 100 حرف)';
    if (!apiKey.trim()) errs.apiKey = 'مفتاح API مطلوب';
    if (apiKey.trim().length < 8) errs.apiKey = 'مفتاح API قصير جداً (8 أحرف على الأقل)';
    if (apiKey.trim().length > 500) errs.apiKey = 'مفتاح API طويل جداً';
    if (dailyQuota < 1) errs.dailyQuota = 'الحصة اليومية يجب أن تكون 1 على الأقل';
    if (monthlyQuota < 1) errs.monthlyQuota = 'الحصة الشهرية يجب أن تكون 1 على الأقل';
    if (monthlyQuota > 1000000) errs.monthlyQuota = 'الحصة كبيرة جداً';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setErrors(p => ({ ...p, apiKey: 'أدخل مفتاح API أولاً' }));
      return;
    }
    setValidating(true);
    setValidated(null);
    const result = await apiCall('/accounts/validate-key', 'POST', { providerId: provider.id, apiKey: apiKey.trim() });
    setValidating(false);
    if (result.ok && result.data?.valid) {
      setValidated(true);
      toast({ title: '✅ مفتاح API صالح', description: result.data?.message || '' });
    } else {
      setValidated(false);
      toast({ title: '⚠️ لم يتم التحقق', description: result.error || 'قد يكون الخادم غير متصل' });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const newAccount: ApiAccount = {
      id: `${provider.id}-${Date.now()}`,
      providerId: provider.id,
      name: name.trim(),
      apiKey: apiKey.trim(),
      dailyQuota,
      monthlyQuota,
      usedToday: 0,
      usedThisMonth: 0,
      enabled: true,
      lastUsed: '',
      successCount: 0,
      errorCount: 0,
      avgResponseTime: 0,
      status: 'active',
    };
    const result = await apiCall('/accounts', 'POST', newAccount);
    if (result.ok && result.data?.id) {
      newAccount.id = result.data.id;
    }
    setSubmitting(false);
    onAdd(newAccount);
    toast({ title: `✅ تمت إضافة ${name} إلى ${provider.name}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-slate-900 shadow-2xl">
        <div className={`flex items-center justify-between p-5 border-b border-white/[0.06] bg-gradient-to-l ${theme.gradient} rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${theme.icon} flex items-center justify-center text-xl`}>
              {provider.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">إضافة حساب جديد</h3>
              <p className={`text-xs ${theme.text} mt-0.5`}>{provider.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">اسم الحساب</label>
            <input value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
              className={`w-full bg-slate-800/80 border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.name ? 'border-red-500/50' : 'border-white/[0.08]'}`}
              placeholder="مثال: Ship24 - حساب 1" />
            {errors.name && <p className="text-[10px] text-red-400">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">مفتاح API</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => { setApiKey(e.target.value); setErrors(p => ({ ...p, apiKey: '' })); setValidated(null); }}
                  className={`w-full bg-slate-800/80 border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pl-10 ${errors.apiKey ? 'border-red-500/50' : 'border-white/[0.08]'}`}
                  placeholder="sk_live_xxxxxxxxxx" dir="ltr" />
                <button onClick={() => setShowKey(!showKey)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button onClick={testApiKey} disabled={validating}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors disabled:opacity-50 whitespace-nowrap ${
                  validated === true ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  validated === false ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                }`}>
                {validating ? <Loader2 size={12} className="animate-spin" /> : validated === true ? <CheckCircle size={12} /> : validated === false ? <XCircle size={12} /> : <Play size={12} />}
                {validating ? 'جاري...' : validated === true ? 'صالح' : validated === false ? 'غير صالح' : 'تحقق'}
              </button>
            </div>
            {errors.apiKey && <p className="text-[10px] text-red-400">{errors.apiKey}</p>}
            {validated === true && <p className="text-[10px] text-emerald-400">✅ تم التحقق من المفتاح بنجاح</p>}
            {validated === false && <p className="text-[10px] text-amber-400">⚠️ لم يتم التحقق — سيتم الحفظ على أي حال</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">الحصة اليومية</label>
              <input type="number" value={dailyQuota} onChange={e => { setDailyQuota(+e.target.value); setErrors(p => ({ ...p, dailyQuota: '' })); }}
                className={`w-full bg-slate-800/80 border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.dailyQuota ? 'border-red-500/50' : 'border-white/[0.08]'}`}
                min={1} dir="ltr" />
              {errors.dailyQuota && <p className="text-[10px] text-red-400">{errors.dailyQuota}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">الحصة الشهرية</label>
              <input type="number" value={monthlyQuota} onChange={e => { setMonthlyQuota(+e.target.value); setErrors(p => ({ ...p, monthlyQuota: '' })); }}
                className={`w-full bg-slate-800/80 border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.monthlyQuota ? 'border-red-500/50' : 'border-white/[0.08]'}`}
                min={1} max={1000000} dir="ltr" />
              {errors.monthlyQuota && <p className="text-[10px] text-red-400">{errors.monthlyQuota}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-start gap-2 p-5 border-t border-white/[0.06]">
          <button onClick={handleSubmit} disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
            {submitting ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            {submitting ? 'جاري الإضافة...' : 'إضافة الحساب'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountRow({ account, providerTheme, onToggle, onDelete, onTest }: {
  account: ApiAccount;
  providerTheme: ReturnType<typeof getProviderTheme>;
  onToggle: () => void;
  onDelete: () => void;
  onTest: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; latency?: number; message?: string; httpStatus?: number; sampleResponse?: string } | null>(null);

  const successRate = account.successCount + account.errorCount > 0
    ? (account.successCount / (account.successCount + account.errorCount)) * 100
    : 0;

  const maskedKey = account.apiKey.length > 8
    ? '••••••••' + account.apiKey.slice(-4)
    : '••••••••';

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await apiCall(`/accounts/${account.id}/test`, 'POST');
    setTesting(false);
    if (result.ok) {
      setTestResult({
        ok: true,
        latency: result.data?.latency,
        message: result.data?.message || 'الاتصال ناجح',
        httpStatus: result.data?.httpStatus || 200,
        sampleResponse: result.data?.sampleResponse,
      });
      toast({ title: `✅ ${account.name}`, description: result.data?.message || `زمن الاستجابة: ${result.data?.latency}ms` });
    } else {
      setTestResult({
        ok: false,
        message: result.error || 'فشل الاتصال',
        httpStatus: result.data?.httpStatus,
      });
      toast({ title: `❌ فشل اختبار ${account.name}`, description: result.error, variant: "destructive" });
    }
    onTest();
  };

  return (
    <div className="border border-white/[0.04] rounded-xl p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">{account.name}</span>
            <AccountStatusBadge status={account.status} />
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={handleTest} disabled={testing}
              className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
              title="اختبار">
              {testing ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
            </button>
            <button onClick={onToggle}
              className={`p-1.5 rounded-lg transition-colors ${account.enabled ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20'}`}
              title={account.enabled ? 'تعطيل' : 'تفعيل'}>
              <Power size={13} />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button onClick={() => { onDelete(); setConfirmDelete(false); }} className="px-2 py-1 text-[9px] rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium">تأكيد</button>
                <button onClick={() => setConfirmDelete(false)} className="px-2 py-1 text-[9px] rounded-lg bg-slate-700 text-slate-400 font-medium">إلغاء</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="حذف">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2" dir="ltr">
          <code className="text-[11px] bg-slate-800/80 px-2.5 py-1 rounded-lg font-mono text-slate-500 flex-1 truncate">
            {maskedKey}
          </code>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <QuotaBar used={account.usedToday} total={account.dailyQuota} label="الحصة اليومية" compact />
          <QuotaBar used={account.usedThisMonth ?? account.usedToday} total={account.monthlyQuota ?? account.dailyQuota} label="الحصة الشهرية" compact />
        </div>

        <div className="flex items-center gap-4 text-[10px] pt-1 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={10} className="text-slate-500" />
            <span className="text-slate-500">النجاح:</span>
            <span className="text-emerald-400 font-semibold">{account.successCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle size={10} className="text-slate-500" />
            <span className="text-slate-500">أخطاء:</span>
            <span className="text-red-400 font-semibold">{account.errorCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="text-slate-500" />
            <span className="text-slate-500">متوسط:</span>
            <span className="text-blue-400 font-semibold">{account.avgResponseTime}ms</span>
          </div>
          <div className="flex items-center gap-1.5 mr-auto">
            <span className="text-slate-500">آخر استخدام:</span>
            <span className="text-slate-400">{account.lastUsed ? new Date(account.lastUsed).toLocaleTimeString('ar') : '—'}</span>
          </div>
        </div>
      </div>

      {testResult && <TestResultDisplay result={testResult} />}
    </div>
  );
}

function ProviderCard({
  provider, expanded, onToggleExpand, onToggleProvider, onToggleAccount, onDeleteAccount, onTestAccount, onAddAccount, onPriorityChange,
}: {
  provider: ApiProvider; expanded: boolean; onToggleExpand: () => void; onToggleProvider: () => void;
  onToggleAccount: (accountId: string) => void; onDeleteAccount: (accountId: string) => void;
  onTestAccount: (account: ApiAccount) => void; onAddAccount: () => void;
  onPriorityChange: (newPriority: number) => void;
}) {
  const theme = getProviderTheme(provider.id);
  const providerStatus = getProviderStatus(provider);
  const activeAccounts = provider.accounts.filter(a => a.enabled).length;
  const totalQuota = provider.accounts.reduce((sum, a) => sum + (a.monthlyQuota ?? a.dailyQuota), 0);
  const usedQuota = provider.accounts.reduce((sum, a) => sum + (a.usedThisMonth ?? a.usedToday), 0);
  const totalSuccess = provider.accounts.reduce((sum, a) => sum + a.successCount, 0);
  const totalError = provider.accounts.reduce((sum, a) => sum + a.errorCount, 0);
  const totalOps = totalSuccess + totalError;
  const providerSuccessRate = totalOps > 0 ? (totalSuccess / totalOps) * 100 : 0;
  const activeWithTime = provider.accounts.filter(a => a.avgResponseTime > 0);
  const avgResponseTime = activeWithTime.length > 0
    ? Math.round(activeWithTime.reduce((s, a) => s + a.avgResponseTime, 0) / activeWithTime.length)
    : 0;

  return (
    <div className={`rounded-2xl border ${theme.border} bg-gradient-to-l ${theme.gradient} overflow-hidden transition-all duration-300`}>
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={onToggleExpand}>
        <div className={`w-12 h-12 rounded-xl ${theme.icon} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
          {provider.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-sm font-bold text-white">{provider.name}</span>
            <ProviderStatusBadge status={providerStatus} />
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            {PROVIDER_DESCRIPTIONS[provider.id] || `${activeAccounts}/${provider.accounts.length} حساب نشط`}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="w-32 space-y-1">
            <p className="text-[9px] text-slate-500 text-center">نسبة النجاح</p>
            {totalOps > 0 ? <SuccessRateBar rate={providerSuccessRate} size="sm" /> : <p className="text-[10px] text-slate-600 text-center">—</p>}
          </div>
          <div className="text-center px-3">
            <p className="text-[9px] text-slate-500">الطلبات</p>
            <p className="text-xs font-bold text-purple-400">{totalOps.toLocaleString()}</p>
          </div>
          <div className="text-center px-3">
            <p className="text-[9px] text-slate-500">متوسط الاستجابة</p>
            <p className="text-xs font-bold text-blue-400">{avgResponseTime > 0 ? `${avgResponseTime}ms` : '—'}</p>
          </div>
          <div className="text-center px-3">
            <p className="text-[9px] text-slate-500">الحصة</p>
            <p className={`text-xs font-bold ${totalQuota > 0 && (usedQuota / totalQuota) > 0.8 ? 'text-red-400' : 'text-emerald-400'}`}>
              {totalQuota > 0 ? `${Math.round((usedQuota / totalQuota) * 100)}%` : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-0.5">
            <button onClick={() => { if (provider.priority > 1) onPriorityChange(provider.priority - 1); }}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-30"
              disabled={provider.priority <= 1}>
              <ArrowUp size={12} />
            </button>
            <span className="w-7 h-7 flex items-center justify-center text-xs font-bold text-white bg-slate-800 rounded-lg border border-white/[0.08]">
              {provider.priority}
            </span>
            <button onClick={() => { if (provider.priority < 99) onPriorityChange(provider.priority + 1); }}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-30"
              disabled={provider.priority >= 99}>
              <ArrowDown size={12} />
            </button>
          </div>

          <button onClick={onToggleProvider}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-colors ${provider.enabled ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-slate-500/20 text-slate-500 hover:bg-slate-500/30'}`}>
            {provider.enabled ? 'مفعل' : 'معطل'}
          </button>
        </div>

        <div className="shrink-0">
          {expanded ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronRight size={18} className="text-slate-500" />}
        </div>
      </div>

      <div className="lg:hidden px-5 pb-3">
        <div className="flex items-center gap-4 text-[10px]">
          <div>
            <span className="text-slate-500">النجاح: </span>
            <span className={`font-semibold ${providerSuccessRate >= 90 ? 'text-emerald-400' : providerSuccessRate >= 70 ? 'text-amber-400' : 'text-slate-400'}`}>
              {totalOps > 0 ? `${providerSuccessRate.toFixed(1)}%` : '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">الطلبات: </span>
            <span className="text-purple-400 font-semibold">{totalOps.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500">الاستجابة: </span>
            <span className="text-blue-400 font-semibold">{avgResponseTime > 0 ? `${avgResponseTime}ms` : '—'}</span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-3 border-t border-white/[0.06] pt-4">
          {totalQuota > 0 && (
            <QuotaBar used={usedQuota} total={totalQuota} label={`إجمالي الحصة الشهرية — ${provider.name}`} />
          )}

          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300">الحسابات ({provider.accounts.length})</h4>
            <button onClick={onAddAccount}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium ${theme.bg} ${theme.text} border ${theme.border} hover:brightness-125 transition-all`}>
              <Plus size={12} />
              إضافة حساب
            </button>
          </div>

          {provider.accounts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <div className="p-3 rounded-full bg-slate-800">
                <AlertTriangle size={20} className="text-slate-500" />
              </div>
              <p className="text-xs text-slate-500">لا توجد حسابات. أضف حساب API للبدء.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {provider.accounts.map(account => (
                <AccountRow key={account.id} account={account} providerTheme={theme}
                  onToggle={() => onToggleAccount(account.id)}
                  onDelete={() => onDeleteAccount(account.id)}
                  onTest={() => onTestAccount(account)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApiProvidersTab() {
  const { data: rawProviders, setData: setProviders, isLive, loading } = useApiData<ApiProvider[]>(
    '/providers', [], { pollingInterval: 30000 }
  );

  const providers = Array.isArray(rawProviders)
    ? rawProviders.filter(p => typeof p.priority === 'number' && typeof p.color === 'string' && Array.isArray(p.accounts))
    : [];

  const [expanded, setExpanded] = useState<Record<string, boolean>>({ ship24: true });
  const [addModalProvider, setAddModalProvider] = useState<ApiProvider | null>(null);

  const sortedProviders = useMemo(() => [...providers].sort((a, b) => a.priority - b.priority), [providers]);

  const changePriority = useCallback((providerId: string, newPriority: number) => {
    setProviders(prev => {
      const updated = prev.map(p => p.id === providerId ? { ...p, priority: newPriority } : p);
      apiCall(`/providers/${providerId}`, 'PUT', { priority: newPriority });
      return updated;
    });
    toast({ title: "✅ تم تحديث الأولوية" });
  }, [setProviders]);

  const toggleProvider = (id: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, enabled: !p.enabled };
      apiCall(`/providers/${id}`, 'PUT', { enabled: updated.enabled });
      return updated;
    }));
    toast({ title: "تم تحديث المزود" });
  };

  const toggleAccount = (providerId: string, accountId: string) => {
    setProviders(prev => prev.map(p => p.id === providerId ? {
      ...p, accounts: p.accounts.map(a => {
        if (a.id !== accountId) return a;
        const updated = { ...a, enabled: !a.enabled, status: (a.enabled ? 'disabled' : 'active') as ApiAccount['status'] };
        apiCall(`/accounts/${accountId}`, 'PUT', { enabled: updated.enabled, status: updated.status });
        return updated;
      })
    } : p));
  };

  const deleteAccount = (providerId: string, accountId: string) => {
    setProviders(prev => prev.map(p => p.id === providerId ? {
      ...p, accounts: p.accounts.filter(a => a.id !== accountId)
    } : p));
    apiCall(`/accounts/${accountId}`, 'DELETE');
    toast({ title: "تم حذف الحساب" });
  };

  const testAccount = async (_account: ApiAccount) => {};

  const addAccount = (providerId: string, account: ApiAccount) => {
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, accounts: [...p.accounts, account] } : p));
  };

  const forceRotate = async () => {
    const result = await apiCall('/providers/force-rotate', 'POST');
    toast({ title: result.ok ? "✅ تم التبديل للحساب التالي" : "❌ فشل التبديل" });
  };

  if (!isLive && !loading && sortedProviders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" dir="rtl">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
          <WifiOff size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white">غير متصل</h3>
        <p className="text-sm text-slate-400 text-center max-w-md">لا يمكن الاتصال بالخادم لتحميل المزودين.</p>
        <p className="text-xs text-slate-500">يتم إعادة المحاولة تلقائياً كل 30 ثانية</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">مزودي API</h2>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${isLive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>
            {isLive ? '● متصل' : '○ غير متصل'}
          </span>
        </div>
      </div>

      <HealthOverview providers={sortedProviders} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ProviderHealthBars providers={sortedProviders} />
        <RotationInfo providers={sortedProviders} onForceRotate={forceRotate} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] text-slate-500">استخدم أزرار الأولوية لتغيير ترتيب المزودين. الرقم الأصغر = أولوية أعلى.</p>
        </div>

        {loading && sortedProviders.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Loader2 size={16} className="animate-spin" />
              <span>جاري تحميل المزودين...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProviders.map(provider => (
              <ProviderCard key={provider.id} provider={provider}
                expanded={!!expanded[provider.id]}
                onToggleExpand={() => setExpanded(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                onToggleProvider={() => toggleProvider(provider.id)}
                onToggleAccount={(accountId) => toggleAccount(provider.id, accountId)}
                onDeleteAccount={(accountId) => deleteAccount(provider.id, accountId)}
                onTestAccount={testAccount}
                onAddAccount={() => { setExpanded(prev => ({ ...prev, [provider.id]: true })); setAddModalProvider(provider); }}
                onPriorityChange={(newPriority) => changePriority(provider.id, newPriority)}
              />
            ))}
          </div>
        )}
      </div>

      {addModalProvider && (
        <AddAccountModal provider={addModalProvider} onClose={() => setAddModalProvider(null)}
          onAdd={(account) => addAccount(addModalProvider.id, account)} />
      )}
    </div>
  );
}

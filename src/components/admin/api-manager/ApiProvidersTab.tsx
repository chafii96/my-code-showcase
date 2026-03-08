import { useState, useCallback } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, Play, Plus, RotateCcw, Trash2, Power, X, Loader2, CheckCircle, XCircle, AlertTriangle, WifiOff } from "lucide-react";
import { ApiProvider, ApiAccount } from "./types";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

const STATUS_AR: Record<string, string> = { active: 'نشط', exhausted: 'مستنفد', error: 'خطأ', disabled: 'معطل' };

function AddAccountModal({ provider, onClose, onAdd }: {
  provider: ApiProvider;
  onClose: () => void;
  onAdd: (account: ApiAccount) => void;
}) {
  const [name, setName] = useState(`${provider.name} - حساب ${provider.accounts.length + 1}`);
  const [apiKey, setApiKey] = useState('');
  const [monthlyQuota, setMonthlyQuota] = useState(100);
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
    if (monthlyQuota < 1) errs.monthlyQuota = 'الحصة يجب أن تكون 1 على الأقل';
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
      dailyQuota: monthlyQuota,
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
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-bold text-white">إضافة حساب جديد</h3>
            <p className="text-xs text-slate-500 mt-0.5">{provider.icon} {provider.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">اسم الحساب</label>
            <input value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
              className={`w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.name ? 'border-red-500/50' : 'border-white/[0.08]'}`}
              placeholder="مثال: Ship24 - حساب 1" />
            {errors.name && <p className="text-[10px] text-red-400">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">مفتاح API</label>
            <div className="flex gap-2">
              <input value={apiKey} onChange={e => { setApiKey(e.target.value); setErrors(p => ({ ...p, apiKey: '' })); setValidated(null); }}
                className={`flex-1 bg-slate-800 border rounded-lg px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.apiKey ? 'border-red-500/50' : 'border-white/[0.08]'}`}
                placeholder="sk_live_xxxxxxxxxx" dir="ltr" />
              <button onClick={testApiKey} disabled={validating}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-50 whitespace-nowrap">
                {validating ? <Loader2 size={12} className="animate-spin" /> : validated === true ? <CheckCircle size={12} /> : validated === false ? <XCircle size={12} /> : <Play size={12} />}
                {validating ? 'جاري...' : 'تحقق'}
              </button>
            </div>
            {errors.apiKey && <p className="text-[10px] text-red-400">{errors.apiKey}</p>}
            {validated === true && <p className="text-[10px] text-emerald-400">✅ تم التحقق من المفتاح بنجاح</p>}
            {validated === false && <p className="text-[10px] text-amber-400">⚠️ لم يتم التحقق — سيتم الحفظ على أي حال</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">الحصة الشهرية</label>
            <input type="number" value={monthlyQuota} onChange={e => { setMonthlyQuota(+e.target.value); setErrors(p => ({ ...p, monthlyQuota: '' })); }}
              className={`w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.monthlyQuota ? 'border-red-500/50' : 'border-white/[0.08]'}`}
              min={1} max={1000000} dir="ltr" />
            {errors.monthlyQuota && <p className="text-[10px] text-red-400">{errors.monthlyQuota}</p>}
            <p className="text-[10px] text-slate-500">الحد الأقصى لاستدعاءات API شهرياً لهذا الحساب</p>
          </div>
        </div>

        <div className="flex justify-start gap-2 p-5 border-t border-white/[0.06]">
          <button onClick={handleSubmit} disabled={submitting}
            className="px-5 py-2 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1.5">
            {submitting ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            {submitting ? 'جاري الإضافة...' : 'إضافة الحساب'}
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

function QuotaBar({ used, total, label }: { used: number; total: number; label?: string }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  const color = pct < 50 ? 'bg-emerald-500' : pct < 80 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="w-full">
      {label && <p className="text-[10px] text-slate-500 mb-1">{label}</p>}
      <div className="flex justify-between text-[10px] text-slate-400 mb-1" dir="ltr">
        <span>{used.toLocaleString()} / {total.toLocaleString()}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ApiAccount['status'] }) {
  const styles = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    exhausted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
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

function AccountRow({ account, onToggle, onDelete, onTest }: {
  account: ApiAccount;
  onToggle: () => void;
  onDelete: () => void;
  onTest: () => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; latency?: number; message?: string } | null>(null);
  const successRate = account.successCount + account.errorCount > 0
    ? ((account.successCount / (account.successCount + account.errorCount)) * 100).toFixed(1)
    : '0.0';

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await apiCall(`/accounts/${account.id}/test`, 'POST');
    setTesting(false);
    if (result.ok) {
      setTestResult({ ok: true, latency: result.data?.latency, message: result.data?.message });
      toast({ title: `✅ ${account.name}`, description: result.data?.message || `زمن الاستجابة: ${result.data?.latency}ms` });
    } else {
      setTestResult({ ok: false, message: result.error });
      toast({ title: `❌ فشل اختبار ${account.name}`, description: result.error, variant: "destructive" });
    }
    onTest();
  };

  return (
    <div className="border border-white/[0.04] rounded-lg p-4 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{account.name}</span>
            <StatusBadge status={account.status} />
          </div>
          <div className="flex items-center gap-2" dir="ltr">
            <code className="text-[11px] bg-slate-800 px-2 py-1 rounded font-mono text-slate-400 flex-1 truncate">
              {showKey ? account.apiKey : '••••••••••••••••'}
            </code>
            <button onClick={() => setShowKey(!showKey)} className="text-slate-500 hover:text-white transition-colors">
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="w-full lg:w-48">
          <QuotaBar used={account.usedThisMonth ?? account.usedToday} total={account.monthlyQuota ?? account.dailyQuota} label="الحصة الشهرية" />
        </div>

        <div className="flex gap-4 text-[11px]">
          <div className="text-center">
            <p className="text-slate-500">النجاح</p>
            <p className="text-emerald-400 font-semibold">{successRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">متوسط الوقت</p>
            <p className="text-blue-400 font-semibold">{account.avgResponseTime}ms</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">آخر استخدام</p>
            <p className="text-slate-300">{account.lastUsed ? new Date(account.lastUsed).toLocaleTimeString('ar') : '—'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleTest} disabled={testing}
            className="px-2.5 py-1.5 text-[10px] font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors disabled:opacity-50 flex items-center gap-1">
            {testing ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
            {testing ? 'جاري...' : 'اختبار'}
          </button>
          <button onClick={onToggle}
            className={`p-1.5 rounded-lg transition-colors ${account.enabled ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20'}`}>
            <Power size={14} />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={() => { onDelete(); setConfirmDelete(false); }} className="px-2 py-1 text-[9px] rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">تأكيد</button>
              <button onClick={() => setConfirmDelete(false)} className="px-2 py-1 text-[9px] rounded bg-slate-700 text-slate-400">إلغاء</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {testResult && (
        <div className={`mt-3 p-2 rounded-lg text-[11px] flex items-center gap-2 ${testResult.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          {testResult.ok ? <CheckCircle size={12} /> : <XCircle size={12} />}
          <span>{testResult.message}</span>
          {testResult.latency && <span className="mr-auto font-mono">{testResult.latency}ms</span>}
        </div>
      )}
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
  const activeAccounts = provider.accounts.filter(a => a.enabled).length;
  const totalQuota = provider.accounts.reduce((sum, a) => sum + (a.monthlyQuota ?? a.dailyQuota), 0);
  const usedQuota = provider.accounts.reduce((sum, a) => sum + (a.usedThisMonth ?? a.usedToday), 0);
  const totalSuccess = provider.accounts.reduce((sum, a) => sum + a.successCount, 0);
  const totalError = provider.accounts.reduce((sum, a) => sum + a.errorCount, 0);
  const totalOps = totalSuccess + totalError;
  const providerSuccessRate = totalOps > 0 ? ((totalSuccess / totalOps) * 100).toFixed(1) : '—';
  const activeWithTime = provider.accounts.filter(a => a.avgResponseTime > 0);
  const avgResponseTime = activeWithTime.length > 0
    ? Math.round(activeWithTime.reduce((s, a) => s + a.avgResponseTime, 0) / activeWithTime.length)
    : 0;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={onToggleExpand}>
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <label className="text-[9px] text-slate-500 ml-1">أولوية</label>
          <input
            type="number"
            min={1}
            max={99}
            value={provider.priority}
            onChange={e => { const v = parseInt(e.target.value); if (v >= 1 && v <= 99) onPriorityChange(v); }}
            className="w-10 h-7 text-center text-xs font-bold bg-slate-800 border border-white/[0.08] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            onClick={e => e.stopPropagation()}
          />
        </div>
        <span className="text-lg">{provider.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{provider.name}</span>
          </div>
          <p className="text-[10px] text-slate-500">
            {activeAccounts}/{provider.accounts.length} حساب نشط · {usedQuota.toLocaleString()}/{totalQuota.toLocaleString()} حصة
          </p>
        </div>

        <div className="hidden md:flex gap-3 text-[10px]">
          <div className="text-center px-2">
            <p className="text-slate-500">نسبة النجاح</p>
            <p className={`font-semibold ${providerSuccessRate !== '—' && parseFloat(providerSuccessRate) >= 90 ? 'text-emerald-400' : providerSuccessRate !== '—' && parseFloat(providerSuccessRate) >= 70 ? 'text-amber-400' : 'text-slate-400'}`}>
              {providerSuccessRate}{providerSuccessRate !== '—' ? '%' : ''}
            </p>
          </div>
          <div className="text-center px-2">
            <p className="text-slate-500">متوسط الاستجابة</p>
            <p className="text-blue-400 font-semibold">{avgResponseTime > 0 ? `${avgResponseTime}ms` : '—'}</p>
          </div>
          <div className="text-center px-2">
            <p className="text-slate-500">الاستخدام الشهري</p>
            <p className="text-purple-400 font-semibold">{totalQuota > 0 ? `${Math.round((usedQuota / totalQuota) * 100)}%` : '—'}</p>
          </div>
        </div>

        <button onClick={e => { e.stopPropagation(); onToggleProvider(); }}
          className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-colors ${provider.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-500'}`}>
          {provider.enabled ? 'مفعل' : 'معطل'}
        </button>
        {expanded ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/[0.04] pt-3">
          {totalQuota > 0 && (
            <QuotaBar used={usedQuota} total={totalQuota} label={`إجمالي الحصة — ${provider.name}`} />
          )}

          {provider.accounts.length === 0 && (
            <div className="flex items-center gap-2 py-4 justify-center text-slate-500 text-xs">
              <AlertTriangle size={14} />
              <span>لا توجد حسابات. أضف حساب API للبدء.</span>
            </div>
          )}
          {provider.accounts.map(account => (
            <AccountRow key={account.id} account={account}
              onToggle={() => onToggleAccount(account.id)}
              onDelete={() => onDeleteAccount(account.id)}
              onTest={() => onTestAccount(account)} />
          ))}
          <button onClick={onAddAccount} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-dashed border-white/10 text-xs text-slate-500 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors">
            <Plus size={14} /> إضافة حساب جديد
          </button>
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

  const sortedProviders = [...providers].sort((a, b) => a.priority - b.priority);

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
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">مزودي API</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
            {isLive ? '● متصل' : '○ غير متصل'}
          </span>
        </div>
        <button onClick={forceRotate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
          <RotateCcw size={12} /> تبديل إجباري
        </button>
      </div>

      <p className="text-[11px] text-slate-500">أدخل رقم الأولوية لتغيير ترتيب المزودين. الرقم الأصغر = أولوية أعلى. التغييرات تُحفظ تلقائياً.</p>

      {loading && sortedProviders.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Loader2 size={16} className="animate-spin" />
            <span>جاري تحميل المزودين...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
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

      {addModalProvider && (
        <AddAccountModal provider={addModalProvider} onClose={() => setAddModalProvider(null)}
          onAdd={(account) => addAccount(addModalProvider.id, account)} />
      )}
    </div>
  );
}

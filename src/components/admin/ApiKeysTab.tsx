import React, { useState } from "react";
import {
  Key, Plus, Pencil, Trash2, CheckCircle, XCircle, Loader2, Lock, Shield, Zap, AlertTriangle,
} from "lucide-react";
import { useApiData, apiCall } from "./api-manager/useApiData";

interface ApiKey {
  id: string;
  keyField?: string;
  name: string;
  provider: string;
  maskedKey: string;
  status: string;
  lastUsed: string | null;
  createdAt: string | null;
  source: string;
  usedToday?: number;
  successCount?: number;
  errorCount?: number;
  dailyQuota?: number;
  monthlyQuota?: number;
  accountId?: string;
  providerId?: string;
}

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  active: { label: "نشط", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  inactive: { label: "غير مضبوط", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  disabled: { label: "معطّل", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  invalid: { label: "غير صالح", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  expired: { label: "منتهي", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const PROVIDER_OPTIONS = [
  { value: "config", label: "إعدادات النظام" },
  { value: "ship24", label: "Ship24" },
  { value: "trackingmore", label: "TrackingMore" },
  { value: "17track", label: "17Track" },
];

export default function ApiKeysTab() {
  const { data: keys, loading, refetch } = useApiData<ApiKey[]>("/apikeys", []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState({ provider: "config", keyField: "", name: "", value: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; message: string }>>({});
  const [actionLoading, setActionLoading] = useState(false);

  const configKeyOptions = [
    { value: "uspsUserId", label: "USPS Web Tools USERID" },
    { value: "uspsPassword", label: "USPS Web Tools Password" },
    { value: "googleSearchConsole", label: "Google Search Console" },
    { value: "googleAnalytics4", label: "Google Analytics 4" },
    { value: "googleAdsense", label: "Google AdSense" },
    { value: "googleIndexingApi", label: "Google Indexing API" },
    { value: "bingWebmaster", label: "Bing Webmaster" },
    { value: "semrushApiKey", label: "SEMrush API" },
    { value: "ahrefsApiKey", label: "Ahrefs API" },
    { value: "indexNowKey", label: "IndexNow" },
    { value: "openaiApiKey", label: "OpenAI API" },
    { value: "cloudflareApiKey", label: "Cloudflare API" },
    { value: "cloudflareZoneId", label: "Cloudflare Zone ID" },
    { value: "recaptchaSiteKey", label: "reCAPTCHA Site Key" },
    { value: "recaptchaSecretKey", label: "reCAPTCHA Secret Key" },
    { value: "slackWebhook", label: "Slack Webhook" },
    { value: "discordWebhook", label: "Discord Webhook" },
    { value: "telegramBotToken", label: "Telegram Bot Token" },
    { value: "telegramChatId", label: "Telegram Chat ID" },
  ];

  const handleAdd = async () => {
    if (!newKey.value) return;
    setActionLoading(true);
    const body: any = { value: newKey.value };
    if (newKey.provider === "config") {
      body.keyField = newKey.keyField;
      body.source = "config";
    } else {
      body.provider = newKey.provider;
      body.name = newKey.name;
      body.source = "failover";
    }
    await apiCall("/apikeys", "POST", body);
    setNewKey({ provider: "config", keyField: "", name: "", value: "" });
    setShowAddForm(false);
    setActionLoading(false);
    refetch();
  };

  const handleUpdate = async (id: string) => {
    if (!editValue) return;
    setActionLoading(true);
    await apiCall(`/apikeys/${encodeURIComponent(id)}`, "PUT", { value: editValue });
    setEditingId(null);
    setEditValue("");
    setActionLoading(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    await apiCall(`/apikeys/${encodeURIComponent(id)}`, "DELETE");
    setDeleteConfirm(null);
    setActionLoading(false);
    refetch();
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    const result = await apiCall<{ ok: boolean; status: string; message: string }>(`/apikeys/${encodeURIComponent(id)}/test`, "POST");
    setTestResults(prev => ({
      ...prev,
      [id]: { ok: result.data?.ok ?? false, message: result.data?.message || result.error || "فشل الاختبار" },
    }));
    setTestingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-blue-400" />
      </div>
    );
  }

  const configKeys = keys.filter(k => k.source === "config");
  const failoverKeys = keys.filter(k => k.source === "failover");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key size={18} className="text-yellow-400" /> إدارة مفاتيح API
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة آمنة لجميع مفاتيح API — تُعرض القيم مخفية ولا تُرسل كاملة أبداً
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all self-start"
        >
          <Plus size={14} /> إضافة مفتاح جديد
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-800/80 border border-blue-700/50 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Plus size={14} className="text-blue-400" /> إضافة مفتاح API جديد
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">المزوّد</label>
              <select
                value={newKey.provider}
                onChange={e => setNewKey(prev => ({ ...prev, provider: e.target.value, keyField: "", name: "" }))}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {PROVIDER_OPTIONS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            {newKey.provider === "config" ? (
              <div>
                <label className="text-xs text-slate-400 mb-1 block">نوع المفتاح</label>
                <select
                  value={newKey.keyField}
                  onChange={e => setNewKey(prev => ({ ...prev, keyField: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">اختر...</option>
                  {configKeyOptions.map(k => (
                    <option key={k.value} value={k.value}>{k.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs text-slate-400 mb-1 block">اسم الحساب</label>
                <input
                  type="text"
                  value={newKey.name}
                  onChange={e => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثلاً: Ship24 - حساب 2"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">قيمة المفتاح</label>
            <input
              type="password"
              value={newKey.value}
              onChange={e => setNewKey(prev => ({ ...prev, value: e.target.value }))}
              placeholder="أدخل قيمة المفتاح..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleAdd}
              disabled={actionLoading || !newKey.value || (newKey.provider === "config" && !newKey.keyField)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
            >
              {actionLoading ? <Loader2 size={14} className="animate-spin" /> : "حفظ"}
            </button>
          </div>
        </div>
      )}

      {configKeys.length > 0 && (
        <div className="bg-slate-800/80 border border-indigo-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Shield size={14} className="text-indigo-400" /> مفاتيح النظام
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-xs">
                  <th className="text-right px-4 py-2">المزوّد</th>
                  <th className="text-right px-4 py-2">اسم المفتاح</th>
                  <th className="text-right px-4 py-2">القيمة</th>
                  <th className="text-right px-4 py-2">الحالة</th>
                  <th className="text-right px-4 py-2">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {configKeys.map(k => {
                  const badge = STATUS_BADGES[k.status] || STATUS_BADGES.inactive;
                  return (
                    <tr key={k.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                      <td className="px-4 py-3 text-slate-300 font-medium">{k.provider}</td>
                      <td className="px-4 py-3 text-slate-200">{k.name}</td>
                      <td className="px-4 py-3">
                        {editingId === k.id ? (
                          <div className="flex gap-2">
                            <input
                              type="password"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              placeholder="أدخل القيمة الجديدة..."
                              className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 w-48 focus:outline-none focus:border-blue-500"
                              autoFocus
                            />
                            <button onClick={() => handleUpdate(k.id)} disabled={actionLoading} className="text-green-400 hover:text-green-300">
                              <CheckCircle size={16} />
                            </button>
                            <button onClick={() => { setEditingId(null); setEditValue(""); }} className="text-slate-400 hover:text-slate-300">
                              <XCircle size={16} />
                            </button>
                          </div>
                        ) : (
                          <code className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded font-mono">
                            {k.maskedKey || "—"}
                          </code>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditingId(k.id); setEditValue(""); }}
                            className="p-1.5 rounded hover:bg-slate-600 text-slate-400 hover:text-slate-200 transition-colors"
                            title="تعديل"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleTest(k.id)}
                            disabled={testingId === k.id}
                            className="p-1.5 rounded hover:bg-slate-600 text-blue-400 hover:text-blue-300 transition-colors"
                            title="اختبار"
                          >
                            {testingId === k.id ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                          </button>
                          {deleteConfirm === k.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(k.id)} className="p-1.5 rounded bg-red-600 text-white text-xs px-2">
                                تأكيد
                              </button>
                              <button onClick={() => setDeleteConfirm(null)} className="p-1.5 rounded bg-slate-600 text-slate-200 text-xs px-2">
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(k.id)}
                              className="p-1.5 rounded hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        {testResults[k.id] && (
                          <div className={`mt-1 text-xs flex items-center gap-1 ${testResults[k.id].ok ? "text-green-400" : "text-red-400"}`}>
                            {testResults[k.id].ok ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                            {testResults[k.id].message}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {failoverKeys.length > 0 && (
        <div className="bg-slate-800/80 border border-green-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Lock size={14} className="text-green-400" /> مفاتيح مزوّدي التتبع
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-xs">
                  <th className="text-right px-4 py-2">المزوّد</th>
                  <th className="text-right px-4 py-2">اسم الحساب</th>
                  <th className="text-right px-4 py-2">القيمة</th>
                  <th className="text-right px-4 py-2">الحالة</th>
                  <th className="text-right px-4 py-2">آخر استخدام</th>
                  <th className="text-right px-4 py-2">إحصائيات</th>
                  <th className="text-right px-4 py-2">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {failoverKeys.map(k => {
                  const badge = STATUS_BADGES[k.status] || STATUS_BADGES.inactive;
                  return (
                    <tr key={k.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                      <td className="px-4 py-3 text-slate-300 font-medium">{k.provider}</td>
                      <td className="px-4 py-3 text-slate-200">{k.name}</td>
                      <td className="px-4 py-3">
                        {editingId === k.id ? (
                          <div className="flex gap-2">
                            <input
                              type="password"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              placeholder="أدخل القيمة الجديدة..."
                              className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 w-48 focus:outline-none focus:border-blue-500"
                              autoFocus
                            />
                            <button onClick={() => handleUpdate(k.id)} disabled={actionLoading} className="text-green-400 hover:text-green-300">
                              <CheckCircle size={16} />
                            </button>
                            <button onClick={() => { setEditingId(null); setEditValue(""); }} className="text-slate-400 hover:text-slate-300">
                              <XCircle size={16} />
                            </button>
                          </div>
                        ) : (
                          <code className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded font-mono">
                            {k.maskedKey || "—"}
                          </code>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {k.lastUsed ? new Date(k.lastUsed).toLocaleDateString("ar-EG") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs space-y-0.5">
                          {k.usedToday !== undefined && (
                            <div className="text-slate-400">اليوم: <span className="text-slate-200">{k.usedToday}</span></div>
                          )}
                          {k.successCount !== undefined && (
                            <div className="text-green-400/70">نجاح: {k.successCount} | خطأ: {k.errorCount}</div>
                          )}
                          {k.dailyQuota ? (
                            <div className="text-slate-500">الحصة: {k.dailyQuota}/يوم</div>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditingId(k.id); setEditValue(""); }}
                            className="p-1.5 rounded hover:bg-slate-600 text-slate-400 hover:text-slate-200 transition-colors"
                            title="تعديل"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleTest(k.id)}
                            disabled={testingId === k.id}
                            className="p-1.5 rounded hover:bg-slate-600 text-blue-400 hover:text-blue-300 transition-colors"
                            title="اختبار"
                          >
                            {testingId === k.id ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                          </button>
                          {deleteConfirm === k.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(k.id)} className="p-1.5 rounded bg-red-600 text-white text-xs px-2">
                                تأكيد
                              </button>
                              <button onClick={() => setDeleteConfirm(null)} className="p-1.5 rounded bg-slate-600 text-slate-200 text-xs px-2">
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(k.id)}
                              className="p-1.5 rounded hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        {testResults[k.id] && (
                          <div className={`mt-1 text-xs flex items-center gap-1 ${testResults[k.id].ok ? "text-green-400" : "text-red-400"}`}>
                            {testResults[k.id].ok ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                            {testResults[k.id].message}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {keys.length === 0 && !loading && (
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-8 text-center">
          <Key size={32} className="mx-auto text-slate-500 mb-3" />
          <p className="text-slate-400 text-sm">لا توجد مفاتيح API مسجّلة</p>
          <p className="text-slate-500 text-xs mt-1">اضغط "إضافة مفتاح جديد" لبدء الإعداد</p>
        </div>
      )}
    </div>
  );
}

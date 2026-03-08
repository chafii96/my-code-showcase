import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Loader2, Shield, AlertTriangle, Lightbulb } from "lucide-react";

interface AuditCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
  impact: "high" | "medium" | "low";
}

interface AuditResult {
  score: number;
  checks: AuditCheck[];
  recommendations: string[];
}

export default function SeoAuditTab() {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  const runAudit = useCallback(() => {
    setLoading(true);
    fetch('/api/seo-audit')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: AuditResult) => { setAudit(data); setLoading(false); })
      .catch(() => { setAudit({ score: 0, checks: [], recommendations: [] }); setLoading(false); });
  }, []);

  useEffect(() => { runAudit(); }, [runAudit]);

  if (loading && !audit) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  if (!audit) return null;

  const scoreColor = audit.score >= 80 ? 'text-green-400' : audit.score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const strokeColor = audit.score >= 80 ? '#22c55e' : audit.score >= 50 ? '#eab308' : '#ef4444';
  const bgGlow = audit.score >= 80 ? 'shadow-green-500/10' : audit.score >= 50 ? 'shadow-yellow-500/10' : 'shadow-red-500/10';

  const failChecks = audit.checks.filter(c => c.status === 'fail');
  const warnChecks = audit.checks.filter(c => c.status === 'warn');
  const passChecks = audit.checks.filter(c => c.status === 'pass');

  const impactBadge = (impact: string) => {
    if (impact === 'high') return <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-medium">عالي</span>;
    if (impact === 'medium') return <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-medium">متوسط</span>;
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-400 font-medium">منخفض</span>;
  };

  const statusIcon = (status: string) => {
    if (status === 'pass') return <CheckCircle size={16} className="text-green-400 flex-shrink-0" />;
    if (status === 'warn') return <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />;
    return <XCircle size={16} className="text-red-400 flex-shrink-0" />;
  };

  const statusBadge = (status: string) => {
    if (status === 'pass') return <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300">ناجح</span>;
    if (status === 'warn') return <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">تحذير</span>;
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">فاشل</span>;
  };

  const renderCheckGroup = (title: string, icon: React.ReactNode, checks: AuditCheck[], borderColor: string) => {
    if (checks.length === 0) return null;
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="text-sm font-semibold text-slate-300">{title} ({checks.length})</h3>
        </div>
        <div className="space-y-1.5">
          {checks.map((c, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor} transition-colors`}>
              {statusIcon(c.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-white font-medium">{c.name}</p>
                  {statusBadge(c.status)}
                  {impactBadge(c.impact)}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{c.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className={`flex flex-col sm:flex-row items-center gap-5 bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 shadow-lg ${bgGlow}`}>
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={strokeColor} strokeWidth="2.5"
              strokeDasharray={`${audit.score} ${100 - audit.score}`} strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s ease' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>{audit.score}</span>
          </div>
        </div>
        <div className="text-center sm:text-right flex-1">
          <div className="flex items-center justify-center sm:justify-end gap-2 mb-1">
            <Shield size={20} className={scoreColor} />
            <h2 className="text-xl font-bold text-white">نتيجة فحص SEO</h2>
          </div>
          <p className={`text-sm ${scoreColor} mb-2`}>
            {audit.score >= 80 ? 'ممتاز' : audit.score >= 50 ? 'جيد — يحتاج بعض التحسينات' : 'يحتاج تحسين عاجل'}
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-400" />{passChecks.length} ناجح</span>
            <span className="flex items-center gap-1"><AlertTriangle size={12} className="text-yellow-400" />{warnChecks.length} تحذير</span>
            <span className="flex items-center gap-1"><XCircle size={12} className="text-red-400" />{failChecks.length} فاشل</span>
          </div>
        </div>
        <button onClick={runAudit} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex-shrink-0">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          إعادة الفحص
        </button>
      </div>

      <div className="space-y-4">
        {renderCheckGroup("مشاكل يجب إصلاحها", <XCircle size={16} className="text-red-400" />, failChecks, "bg-red-900/10 border-red-700/30 hover:border-red-700/50")}
        {renderCheckGroup("تحذيرات", <AlertTriangle size={16} className="text-yellow-400" />, warnChecks, "bg-yellow-900/10 border-yellow-700/30 hover:border-yellow-700/50")}
        {renderCheckGroup("فحوصات ناجحة", <CheckCircle size={16} className="text-green-400" />, passChecks, "bg-green-900/10 border-green-700/30 hover:border-green-700/50")}
      </div>

      {audit.recommendations && audit.recommendations.length > 0 && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-amber-400" />
            <h3 className="text-base font-bold text-white">توصيات لتحسين SEO</h3>
          </div>
          <ul className="space-y-2">
            {audit.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

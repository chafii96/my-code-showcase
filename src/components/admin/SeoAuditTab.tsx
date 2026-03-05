import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SeoAuditTab() {
  const [audit, setAudit] = useState<any>(null);

  useEffect(() => {
    fetch('/api/seo-audit').then(r => r.ok ? r.json() : Promise.reject()).then(setAudit).catch(() => {
      setAudit({ score: 0, checks: [] });
    });
  }, []);

  if (!audit) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  const scoreColor = audit.score >= 90 ? 'text-green-400' : audit.score >= 60 ? 'text-yellow-400' : 'text-red-400';
  const strokeColor = audit.score >= 90 ? '#22c55e' : audit.score >= 60 ? '#eab308' : '#ef4444';

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/80 border border-slate-700/80 rounded-xl p-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={strokeColor} strokeWidth="3"
              strokeDasharray={`${audit.score} ${100 - audit.score}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${scoreColor}`}>{audit.score}%</span>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <h2 className="text-xl font-bold text-white">SEO Score</h2>
          <p className={`text-sm ${scoreColor}`}>
            {audit.score >= 90 ? 'ممتاز' : audit.score >= 60 ? 'جيد' : 'يحتاج تحسين'} — {audit.checks?.filter((c: any) => c.status === 'pass').length}/{audit.checks?.length} فحص ناجح
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {audit.checks?.map((c: any, i: number) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
            c.status === 'pass' ? 'bg-green-900/15 border-green-700/30 hover:border-green-700/50' :
            c.status === 'warn' ? 'bg-yellow-900/15 border-yellow-700/30 hover:border-yellow-700/50' :
            'bg-red-900/15 border-red-700/30 hover:border-red-700/50'
          }`}>
            {c.status === 'pass' ? <CheckCircle size={14} className="text-green-400 flex-shrink-0" /> :
             c.status === 'warn' ? <AlertCircle size={14} className="text-yellow-400 flex-shrink-0" /> :
             <AlertCircle size={14} className="text-red-400 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{c.name}</p>
              <p className="text-xs text-slate-400">{c.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

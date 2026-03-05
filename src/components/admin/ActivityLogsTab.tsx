import React, { useState, useEffect } from "react";
import { EmptyState } from "./shared";
import { Activity } from "lucide-react";

export default function ActivityLogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetch('/api/logs').then(r => r.ok ? r.json() : Promise.reject()).then(d => setLogs(d.logs || [])).catch(() => setLogs([]));
  }, []);

  const LOG_TYPES: Record<string, { label: string; icon: string }> = {
    all: { label: 'الكل', icon: '📋' },
    deploy: { label: 'نشر', icon: '🚀' },
    script: { label: 'سكريبت', icon: '⚡' },
    content: { label: 'محتوى', icon: '📝' },
    seo: { label: 'SEO', icon: '🔍' },
    git: { label: 'Git', icon: '📦' },
    error: { label: 'أخطاء', icon: '❌' },
    monitoring: { label: 'مراقبة', icon: '👁️' },
    login: { label: 'دخول', icon: '🔐' },
  };

  const STATUS_STYLES: Record<string, string> = {
    success: 'bg-green-900/20 border-green-700/40',
    error: 'bg-red-900/20 border-red-700/40',
    warning: 'bg-yellow-900/20 border-yellow-700/40',
    info: 'bg-blue-900/20 border-blue-700/40',
  };

  const filtered = logs.filter(l => filterType === 'all' || l.type === filterType);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">📋 سجل النشاط</h2>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {Object.entries(LOG_TYPES).map(([key, t]) => (
          <button key={key} onClick={() => setFilterType(key)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
              filterType === key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Activity size={32} />} title="لا توجد سجلات" subtitle="ستظهر السجلات بعد تشغيل أي أداة أو حدث" />
      ) : (
        <div className="space-y-2">
          {filtered.map(log => (
            <div key={log.id} className={`flex items-start gap-3 p-3 rounded-xl border ${STATUS_STYLES[log.status] || STATUS_STYLES.info}`}>
              <span className="text-lg flex-shrink-0">{LOG_TYPES[log.type]?.icon || '📋'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{log.message}</p>
                <span className="text-[10px] text-slate-500">{timeAgo(log.time)}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                log.status === 'success' ? 'bg-green-900/50 text-green-300' :
                log.status === 'error' ? 'bg-red-900/50 text-red-300' :
                log.status === 'warning' ? 'bg-yellow-900/50 text-yellow-300' :
                'bg-blue-900/50 text-blue-300'
              }`}>
                {log.status === 'success' ? '✅' : log.status === 'error' ? '❌' : log.status === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

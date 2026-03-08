import React, { useState, useEffect } from "react";
import { GitBranch, GitCommit, Play, RefreshCw, FileText, Clock, User, AlertTriangle, Plus, Trash2, Edit, HelpCircle } from "lucide-react";
import { Script } from "./types";
import { StatCard, EmptyState } from "./shared";

export default function GitTab({ onRun }: { onRun: (s: Script) => void }) {
  const [gitData, setGitData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const loadGit = () => {
    setLoading(true);
    fetch('/api/git').then(r => r.ok ? r.json() : Promise.reject()).then(d => {
      setGitData(d);
      setLoading(false);
    }).catch(() => {
      setGitData({ branch: '—', totalCommits: 0, status: [], log: [], recentCommits: [], modifiedFilesList: [], lastCommit: {} });
      setLoading(false);
    });
  };

  useEffect(() => { loadGit(); }, []);

  const GIT_ACTIONS: (Script & { dangerous?: boolean })[] = [
    { id: 'git-status', name: 'حالة Git', desc: 'حالة الملفات المعدّلة', icon: '📋', category: 'git', cmd: 'git status' },
    { id: 'git-pull', name: 'سحب التحديثات', desc: 'git pull من الخادم', icon: '⬇️', category: 'git', cmd: 'git pull', dangerous: true },
    { id: 'git-push', name: 'رفع التغييرات', desc: 'git add + commit + push', icon: '🚀', category: 'git', cmd: 'git add -A && git commit -m "auto: update" && git push', dangerous: true },
    { id: 'git-diff', name: 'عرض التغييرات', desc: 'الفروقات غير المحفوظة', icon: '🔍', category: 'git', cmd: 'git diff --stat' },
  ];

  const handleAction = (s: Script & { dangerous?: boolean }) => {
    if (s.dangerous) {
      setConfirmAction(s.id);
    } else {
      onRun(s);
    }
  };

  const confirmAndRun = (s: Script) => {
    setConfirmAction(null);
    onRun(s);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      modified: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
      added: 'bg-green-900/40 text-green-300 border-green-700/50',
      deleted: 'bg-red-900/40 text-red-300 border-red-700/50',
      untracked: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
      renamed: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
      other: 'bg-slate-700/40 text-slate-300 border-slate-600/50',
    };
    const icons: Record<string, React.ReactNode> = {
      modified: <Edit size={10} />,
      added: <Plus size={10} />,
      deleted: <Trash2 size={10} />,
      untracked: <HelpCircle size={10} />,
    };
    const labels: Record<string, string> = { modified: 'معدّل', added: 'جديد', deleted: 'محذوف', untracked: 'غير متتبع', renamed: 'مُعاد تسمية', other: 'أخرى' };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${styles[status] || styles.other}`}>
        {icons[status]} {labels[status] || status}
      </span>
    );
  };

  const timeAgo = (iso: string) => {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><GitBranch size={18} className="text-purple-400" /> إدارة Git</h2>
        <button onClick={loadGit} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors">
          <RefreshCw size={12} /> تحديث
        </button>
      </div>

      {gitData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <StatCard label="الفرع الحالي" value={gitData.branch || 'main'} icon={<GitBranch size={16} />} color="text-purple-400" />
            <StatCard label="إجمالي Commits" value={gitData.totalCommits || 0} icon={<GitCommit size={16} />} color="text-blue-400" />
            <StatCard label="ملفات معدّلة" value={gitData.modifiedFilesList?.length || gitData.status?.filter((s: string) => s.trim()).length || 0} icon={<FileText size={16} />} color="text-orange-400" />
          </div>

          {gitData.lastCommit?.message && (
            <div className="bg-gradient-to-l from-purple-900/20 to-slate-800/80 border border-purple-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <GitCommit size={14} className="text-purple-400" />
                <span className="text-xs font-semibold text-purple-300">آخر Commit</span>
              </div>
              <p className="text-sm text-white mb-2">{gitData.lastCommit.message}</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><User size={10} /> {gitData.lastCommit.author}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(gitData.lastCommit.date)}</span>
              </div>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GIT_ACTIONS.map(s => (
          <div key={s.id} className="bg-slate-800/80 border border-pink-800/40 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-pink-700/60 transition-colors relative">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl flex-shrink-0">{s.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{s.name}</p>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            </div>
            {confirmAction === s.id ? (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => confirmAndRun(s)} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-700 hover:bg-red-600 rounded-lg text-xs text-white font-medium transition-colors">
                  <AlertTriangle size={11} /> تأكيد
                </button>
                <button onClick={() => setConfirmAction(null)} className="px-2 py-1.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-xs text-slate-300 transition-colors">
                  إلغاء
                </button>
              </div>
            ) : (
              <button onClick={() => handleAction(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-700 hover:bg-pink-600 rounded-lg text-xs text-white font-medium transition-colors flex-shrink-0">
                <Play size={12} /> تشغيل
              </button>
            )}
          </div>
        ))}
      </div>

      {gitData?.modifiedFilesList && gitData.modifiedFilesList.length > 0 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <FileText size={14} className="text-orange-400" /> الملفات المعدّلة ({gitData.modifiedFilesList.length})
          </h3>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {gitData.modifiedFilesList.map((f: any, i: number) => (
              <div key={i} className="flex items-center gap-3 text-xs py-1.5 px-2 rounded-lg hover:bg-slate-700/30">
                {statusBadge(f.status)}
                <span className="text-slate-300 font-mono truncate">{f.file}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {gitData?.recentCommits && gitData.recentCommits.length > 0 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/40">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <GitCommit size={14} className="text-blue-400" /> سجل Commits ({gitData.recentCommits.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-800">
            {gitData.recentCommits.slice(0, 15).map((c: any, i: number) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-2.5 hover:bg-slate-700/20 transition-colors ${i % 2 === 0 ? 'bg-slate-800/20' : ''}`}>
                <span className="text-slate-600 font-mono text-[11px] flex-shrink-0 mt-0.5 bg-slate-900/60 px-1.5 py-0.5 rounded">{c.hash?.slice(0, 7)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200 truncate">{c.message}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><User size={9} /> {c.author}</span>
                    <span className="flex items-center gap-1"><Clock size={9} /> {timeAgo(c.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

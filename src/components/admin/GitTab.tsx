import React, { useState, useEffect } from "react";
import { GitBranch, Play } from "lucide-react";
import { Script } from "./types";
import { StatCard } from "./shared";

export default function GitTab({ onRun }: { onRun: (s: Script) => void }) {
  const [gitData, setGitData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/git').then(r => r.ok ? r.json() : Promise.reject()).then(setGitData).catch(() => {
      setGitData({ branch: '—', totalCommits: 0, status: [], log: [] });
    });
  }, []);

  const GIT_ACTIONS = [
    { id: 'git-status', name: 'Git Status', desc: 'حالة الملفات المعدّلة', icon: '📋', category: 'git', cmd: 'git status' },
    { id: 'git-push', name: 'Git Add + Commit + Push', desc: 'رفع كل التغييرات', icon: '🚀', category: 'git', cmd: 'git add -A && git commit -m "auto: update" && git push' },
    { id: 'git-log', name: 'Git Log', desc: 'آخر 10 commits', icon: '📜', category: 'git', cmd: 'git log --oneline -10' },
    { id: 'git-diff', name: 'Git Diff', desc: 'التغييرات غير المحفوظة', icon: '🔍', category: 'git', cmd: 'git diff --stat' },
  ];

  return (
    <div className="space-y-4">
      {gitData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <StatCard label="الفرع الحالي" value={gitData.branch} icon={<GitBranch size={16} />} color="text-purple-400" />
          <StatCard label="إجمالي Commits" value={gitData.totalCommits} icon={<GitBranch size={16} />} color="text-blue-400" />
          <StatCard label="ملفات معدّلة" value={gitData.status?.filter((s: string) => s.trim()).length || 0} icon={<GitBranch size={16} />} color="text-orange-400" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GIT_ACTIONS.map(s => (
          <div key={s.id} className="bg-slate-800/80 border border-pink-800/40 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-pink-700/60 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl flex-shrink-0">{s.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{s.name}</p>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            </div>
            <button onClick={() => onRun(s as Script)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-700 hover:bg-pink-600 rounded-lg text-xs text-white font-medium transition-colors flex-shrink-0">
              <Play size={12} />تشغيل
            </button>
          </div>
        ))}
      </div>

      {gitData?.log && gitData.log.length > 0 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">آخر Commits</h3>
          <div className="space-y-2">
            {gitData.log.slice(0, 10).map((l: string, i: number) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <span className="text-slate-600 font-mono w-16 flex-shrink-0">{l.slice(0, 7)}</span>
                <span className="text-slate-300">{l.slice(8)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

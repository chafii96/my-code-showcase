import React, { useState } from "react";
import { Search, Play, Loader2 } from "lucide-react";
import { Script } from "./types";
import { CATEGORIES, Badge } from "./shared";

export default function ToolsTab({ scripts, onRun, running }: { scripts: Script[]; onRun: (s: Script) => void; running: string | null }) {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = scripts.filter(s =>
    (cat === "all" || s.category === cat) &&
    (search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const counts: Record<string, number> = { all: scripts.length };
  scripts.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث في الأدوات..."
          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {Object.entries(CATEGORIES).map(([key, c]) => (
          <button key={key} onClick={() => setCat(key)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
              cat === key ? `${c.bg} ${c.color} ring-1 ring-current` : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}>
            {c.icon}{c.label}
            <span className="ml-0.5 bg-slate-900/50 px-1.5 py-0.5 rounded-full text-[10px]">{counts[key] || 0}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(s => (
          <div key={s.id} className={`bg-slate-800/80 border rounded-xl p-4 flex flex-col gap-3 transition-all hover:border-slate-600 ${
            s.category === 'elite' ? 'border-red-800/60 bg-gradient-to-br from-slate-800 to-red-950/20' : 'border-slate-700/80'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{s.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{s.desc}</p>
                </div>
              </div>
              <Badge cat={s.category} />
            </div>
            <div className="flex items-center justify-between">
              <code className="text-[10px] text-slate-500 bg-slate-900/50 px-2 py-1 rounded truncate max-w-[120px] sm:max-w-[180px]">{s.cmd}</code>
              <button onClick={() => onRun(s)} disabled={running === s.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                  running === s.id
                    ? "bg-yellow-700 text-yellow-200 cursor-wait"
                    : s.category === 'elite'
                      ? "bg-red-700 hover:bg-red-600 text-white"
                      : "bg-blue-700 hover:bg-blue-600 text-white"
                }`}>
                {running === s.id ? <><Loader2 size={12} className="animate-spin" />جاري...</> : <><Play size={12} />تشغيل</>}
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p>لا توجد نتائج للبحث</p>
        </div>
      )}
    </div>
  );
}

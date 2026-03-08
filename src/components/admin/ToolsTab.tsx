import React, { useState, useMemo } from "react";
import { Search, Play, Loader2, ChevronDown, ChevronRight, Clock, AlertTriangle, X } from "lucide-react";
import { Script } from "./types";
import { CATEGORIES, Badge } from "./shared";

function getDesc(s: Script): string {
  return s.description || s.desc || "";
}

export default function ToolsTab({ scripts, onRun, running }: { scripts: Script[]; onRun: (s: Script) => void; running: string | null }) {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [confirmScript, setConfirmScript] = useState<Script | null>(null);

  const filtered = scripts.filter(s =>
    (cat === "all" || s.category === cat) &&
    (search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || getDesc(s).toLowerCase().includes(search.toLowerCase()))
  );

  const counts: Record<string, number> = { all: scripts.length };
  scripts.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });

  const grouped = useMemo(() => {
    const map: Record<string, Script[]> = {};
    filtered.forEach(s => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [filtered]);

  const recentScripts = useMemo(() => {
    return recentIds.map(id => scripts.find(s => s.id === id)).filter(Boolean) as Script[];
  }, [recentIds, scripts]);

  const toggleCollapse = (category: string) => {
    setCollapsed(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleRun = (s: Script) => {
    if (s.dangerous) {
      setConfirmScript(s);
      return;
    }
    executeRun(s);
  };

  const executeRun = (s: Script) => {
    setConfirmScript(null);
    setRecentIds(prev => [s.id, ...prev.filter(id => id !== s.id)].slice(0, 5));
    onRun(s);
  };

  const categoryOrder = Object.keys(CATEGORIES).filter(k => k !== "all");

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
          counts[key] !== undefined || key === "all" ? (
            <button key={key} onClick={() => setCat(key)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
                cat === key ? `${c.bg} ${c.color} ring-1 ring-current` : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}>
              {c.icon}{c.label}
              <span className="ml-0.5 bg-slate-900/50 px-1.5 py-0.5 rounded-full text-[10px]">{counts[key] || 0}</span>
            </button>
          ) : null
        ))}
      </div>

      {recentScripts.length > 0 && cat === "all" && !search && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Clock size={12} />
            آخر الأدوات المستخدمة
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentScripts.map(s => (
              <button key={`recent-${s.id}`} onClick={() => handleRun(s)}
                disabled={running === s.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-xs text-slate-300 hover:bg-slate-700/60 transition-all">
                <span>{s.icon}</span>
                <span>{s.name}</span>
                {running === s.id && <Loader2 size={10} className="animate-spin" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {cat === "all" && !search ? (
        <div className="space-y-3">
          {categoryOrder.map(catKey => {
            const items = grouped[catKey];
            if (!items || items.length === 0) return null;
            const catConfig = CATEGORIES[catKey];
            const isCollapsed = collapsed[catKey];
            return (
              <div key={catKey} className="border border-slate-700/50 rounded-xl overflow-hidden">
                <button onClick={() => toggleCollapse(catKey)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800/80 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={catConfig?.color}>{catConfig?.icon}</span>
                    <span className="text-sm font-semibold text-white">{catConfig?.label}</span>
                    <span className="text-[10px] bg-slate-700/50 px-1.5 py-0.5 rounded-full text-slate-400">{items.length}</span>
                  </div>
                  {isCollapsed ? <ChevronRight size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </button>
                {!isCollapsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                    {items.map(s => (
                      <ToolCard key={s.id} s={s} running={running} onRun={handleRun} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(s => (
            <ToolCard key={s.id} s={s} running={running} onRun={handleRun} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p>لا توجد نتائج للبحث</p>
        </div>
      )}

      {confirmScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setConfirmScript(null)}>
          <div className="bg-slate-800 border border-red-700/50 rounded-2xl p-6 max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">تأكيد العملية الخطرة</h3>
                <p className="text-xs text-slate-400 mt-0.5">{confirmScript.name}</p>
              </div>
              <button onClick={() => setConfirmScript(null)} className="mr-auto text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-slate-300 mb-4">{getDesc(confirmScript)}</p>
            <p className="text-xs text-red-400 mb-5">⚠️ هذه العملية قد تكون خطرة ولا يمكن التراجع عنها. هل أنت متأكد؟</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmScript(null)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
                إلغاء
              </button>
              <button onClick={() => executeRun(confirmScript)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors">
                تأكيد التشغيل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolCard({ s, running, onRun }: { s: Script; running: string | null; onRun: (s: Script) => void }) {
  return (
    <div className={`bg-slate-800/80 border rounded-xl p-4 flex flex-col gap-3 transition-all hover:border-slate-600 ${
      s.dangerous ? 'border-red-800/60 bg-gradient-to-br from-slate-800 to-red-950/20' :
      s.category === 'elite' ? 'border-red-800/60 bg-gradient-to-br from-slate-800 to-red-950/20' : 'border-slate-700/80'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{s.icon}</span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{s.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{getDesc(s)}</p>
          </div>
        </div>
        <Badge cat={s.category} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <code className="text-[10px] text-slate-500 bg-slate-900/50 px-2 py-1 rounded truncate max-w-[100px] sm:max-w-[140px]">{s.cmd?.split(" ")[0] || s.id}</code>
          {s.estimatedTime && (
            <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
              <Clock size={9} />
              {s.estimatedTime}
            </span>
          )}
        </div>
        <button onClick={() => onRun(s)} disabled={running === s.id}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
            running === s.id
              ? "bg-yellow-700 text-yellow-200 cursor-wait"
              : s.dangerous
                ? "bg-red-700 hover:bg-red-600 text-white"
                : s.category === 'elite'
                  ? "bg-red-700 hover:bg-red-600 text-white"
                  : "bg-blue-700 hover:bg-blue-600 text-white"
          }`}>
          {running === s.id ? <><Loader2 size={12} className="animate-spin" />جاري...</> : <><Play size={12} />تشغيل</>}
        </button>
      </div>
    </div>
  );
}

import React, { useRef, useEffect, useMemo } from "react";
import { Terminal, Loader2, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function parseProgress(lines: string[]): { current: number; total: number } | null {
  for (let i = lines.length - 1; i >= 0; i--) {
    const match = lines[i].match(/\[PROGRESS\]\s*(\d+)\/(\d+)/);
    if (match) return { current: parseInt(match[1]), total: parseInt(match[2]) };
  }
  return null;
}

export default function TerminalTab({ lines, running, onClear }: { lines: string[]; running: string | null; onClear: () => void }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "");

  const progress = useMemo(() => parseProgress(lines), [lines]);
  const pct = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  // Filter out [PROGRESS] lines from display to reduce noise
  const displayLines = useMemo(() => lines.filter(l => !l.match(/\[PROGRESS\]/)), [lines]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-green-400" />
          <span className="text-sm font-semibold text-slate-300">Terminal</span>
          {running && <span className="flex items-center gap-1 text-xs text-yellow-400"><Loader2 size={10} className="animate-spin" />جاري التشغيل...</span>}
        </div>
        <button onClick={onClear} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
          <Trash2 size={12} />مسح
        </button>
      </div>

      {progress && running && (
        <div className="space-y-1.5 bg-slate-900 rounded-lg border border-slate-700 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">📄 تقدم التوليد</span>
            <span className="text-cyan-400 font-mono font-bold">{progress.current.toLocaleString()} / {progress.total.toLocaleString()} ({pct}%)</span>
          </div>
          <Progress value={pct} className="h-2.5 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-green-400 [&>div]:transition-all [&>div]:duration-300" />
          {pct < 100 && (
            <p className="text-[10px] text-slate-500 text-center">⏳ يُرجى الانتظار حتى اكتمال التوليد...</p>
          )}
          {pct >= 100 && (
            <p className="text-[10px] text-green-400 text-center">✅ اكتمل توليد جميع الصفحات!</p>
          )}
        </div>
      )}

      <div className="bg-black rounded-xl border border-slate-700 p-4 font-mono text-xs h-[400px] sm:h-[500px] overflow-y-auto">
        {displayLines.length === 0 ? (
          <div className="text-slate-600 text-center mt-20">
            <Terminal size={32} className="mx-auto mb-3 opacity-30" />
            <p>شغّل أي أداة لرؤية المخرجات هنا</p>
          </div>
        ) : (
          displayLines.map((l, i) => (
            <div key={i} className={`leading-relaxed ${
              l.startsWith("[START]") ? "text-cyan-400 font-bold" :
              l.startsWith("[DONE]") ? "text-green-400 font-bold" :
              l.startsWith("[ERROR]") ? "text-red-400" :
              l.includes("✅") || l.includes("✓") ? "text-green-300" :
              l.includes("❌") || l.includes("✗") ? "text-red-300" :
              l.includes("⚠️") || l.includes("⚠") ? "text-yellow-300" :
              l.includes("🔥") || l.includes("☢") ? "text-red-300" :
              "text-slate-300"
            }`}>{stripAnsi(l)}</div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

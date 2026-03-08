import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { Terminal, Loader2, Trash2, Play, ChevronUp, ChevronDown, Hash } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Script } from "@/components/admin/types";

function parseProgress(lines: string[]): { current: number; total: number } | null {
  for (let i = lines.length - 1; i >= 0; i--) {
    const match = lines[i].match(/\[PROGRESS\]\s*(\d+)\/(\d+)/);
    if (match) return { current: parseInt(match[1]), total: parseInt(match[2]) };
  }
  return null;
}

const QUICK_COMMANDS: { label: string; cmd: string }[] = [
  { label: "pm2 status", cmd: "pm2 status" },
  { label: "df -h", cmd: "df -h" },
  { label: "free -m", cmd: "free -m" },
  { label: "uptime", cmd: "uptime" },
  { label: "ls -la dist/", cmd: "ls -la dist/" },
  { label: "cat config", cmd: "cat seo-data/config.json | head -20" },
];

interface TerminalTabProps {
  lines: string[];
  running: string | null;
  onClear: () => void;
  onRun?: (script: Script) => void;
}

export default function TerminalTab({ lines, running, onClear, onRun }: TerminalTabProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "");

  const progress = useMemo(() => parseProgress(lines), [lines]);
  const pct = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  const displayLines = useMemo(() => lines.filter(l => !l.match(/\[PROGRESS\]/)), [lines]);

  const executeCommand = useCallback((cmd: string) => {
    if (!cmd.trim() || !onRun) return;
    const trimmed = cmd.trim();
    setCommandHistory(prev => {
      const filtered = prev.filter(c => c !== trimmed);
      const updated = [trimmed, ...filtered];
      return updated.slice(0, 20);
    });
    setHistoryIndex(-1);
    setInputValue("");
    const script: Script = {
      id: `terminal-cmd-${Date.now()}`,
      name: trimmed,
      cmd: trimmed,
      category: "terminal",
      icon: "terminal",
    };
    onRun(script);
  }, [onRun]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputValue);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInputValue(commandHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInputValue("");
      } else {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-green-400" />
          <span className="text-sm font-semibold text-slate-300">Terminal</span>
          {running && <span className="flex items-center gap-1 text-xs text-yellow-400"><Loader2 size={10} className="animate-spin" />جاري التشغيل...</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Hash size={10} />{displayLines.length} سطر
          </span>
          <button onClick={onClear} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
            <Trash2 size={12} />مسح
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUICK_COMMANDS.map((qc) => (
          <button
            key={qc.cmd}
            onClick={() => executeCommand(qc.cmd)}
            disabled={!!running}
            className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Play size={8} />{qc.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-slate-900 rounded-lg border border-slate-700 p-2">
        <span className="text-green-400 font-mono text-sm">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!!running}
          placeholder="اكتب أمر واضغط Enter..."
          className="flex-1 bg-transparent text-sm font-mono text-slate-200 placeholder-slate-600 outline-none disabled:opacity-50"
          dir="ltr"
        />
        <button
          onClick={() => executeCommand(inputValue)}
          disabled={!!running || !inputValue.trim()}
          className="px-2 py-1 text-xs bg-green-600 hover:bg-green-500 text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          تنفيذ
        </button>
        {commandHistory.length > 0 && (
          <div className="flex items-center gap-0.5 text-slate-600">
            <ChevronUp size={12} />
            <ChevronDown size={12} />
          </div>
        )}
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

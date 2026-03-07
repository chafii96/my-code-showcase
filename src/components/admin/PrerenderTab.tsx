import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Square, Settings2, Loader2, Terminal, RotateCcw, Zap, Clock, FileText, CheckCircle2, XCircle, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PrerenderConfig {
  concurrency: number;
  waitTime: number;
  restartEvery: number;
  skipExisting: boolean;
}

interface PrerenderStatus {
  running: boolean;
  total: number;
  done: number;
  success: number;
  failed: number;
  elapsed: number;
  currentPage: string;
  phase: string;
}

export default function PrerenderTab() {
  const [config, setConfig] = useState<PrerenderConfig>({
    concurrency: 5,
    waitTime: 800,
    restartEvery: 200,
    skipExisting: false,
  });

  const [status, setStatus] = useState<PrerenderStatus>({
    running: false, total: 0, done: 0, success: 0, failed: 0, elapsed: 0, currentPage: '', phase: '',
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  // Check backend
  useEffect(() => {
    fetch('/api/health', { signal: AbortSignal.timeout(3000) })
      .then(r => r.ok ? setBackendOnline(true) : setBackendOnline(false))
      .catch(() => setBackendOnline(false));
  }, []);

  // Check existing prerender status
  useEffect(() => {
    if (backendOnline) {
      fetch('/api/prerender/status').then(r => r.json()).then(d => {
        if (d.totalPages) {
          setLogs(prev => [...prev, `📁 يوجد ${d.totalPages} صفحة مُولّدة مسبقاً (${d.totalSize})`]);
        }
      }).catch(() => {});
    }
  }, [backendOnline]);

  const startPrerender = useCallback(() => {
    if (!backendOnline) return;

    const controller = new AbortController();
    abortRef.current = controller;
    startTimeRef.current = Date.now();

    setStatus({ running: true, total: 0, done: 0, success: 0, failed: 0, elapsed: 0, currentPage: '', phase: 'بدء التشغيل...' });
    setLogs(['[START] ▶ بدء عملية Prerender...', `⚙️ التوازي: ${config.concurrency} | الانتظار: ${config.waitTime}ms | إعادة تشغيل كل: ${config.restartEvery} صفحة`]);

    // Timer for elapsed
    timerRef.current = setInterval(() => {
      setStatus(prev => ({ ...prev, elapsed: Math.round((Date.now() - startTimeRef.current) / 1000) }));
    }, 1000);

    const params = new URLSearchParams({
      concurrency: String(config.concurrency),
      waitTime: String(config.waitTime),
      restartEvery: String(config.restartEvery),
      skipExisting: String(config.skipExisting),
    });

    fetch(`/api/prerender/start?${params}`, {
      method: 'POST',
      signal: controller.signal,
    }).then(res => {
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const read = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus(prev => ({ ...prev, running: false, phase: 'اكتمل ✅' }));
            setLogs(prev => [...prev, '─'.repeat(50), '[DONE] ✅ اكتملت عملية Prerender']);
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const msg = JSON.parse(line.slice(6));
              if (msg.type === 'progress') {
                setStatus(prev => ({
                  ...prev,
                  total: msg.total || prev.total,
                  done: msg.done || prev.done,
                  success: msg.success ?? prev.success,
                  failed: msg.failed ?? prev.failed,
                  currentPage: msg.page || prev.currentPage,
                  phase: msg.phase || prev.phase,
                }));
              }
              if (msg.type === 'log') {
                setLogs(prev => [...prev.slice(-500), msg.line]);
              }
              if (msg.type === 'summary') {
                setLogs(prev => [...prev,
                  `═══════════════════════════════════════`,
                  `✅ نجح: ${msg.success} | ❌ فشل: ${msg.failed} | ⏱️ ${msg.elapsed}`,
                  `📦 الحجم: ${msg.size}`,
                ]);
              }
            } catch {}
          }
          read();
        }).catch(() => {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus(prev => ({ ...prev, running: false, phase: 'توقف' }));
        });
      };
      read();
    }).catch(e => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (e.name !== 'AbortError') {
        setLogs(prev => [...prev, `[ERROR] ${e.message}`]);
      }
      setStatus(prev => ({ ...prev, running: false, phase: 'توقف' }));
    });
  }, [backendOnline, config]);

  const stopPrerender = useCallback(() => {
    abortRef.current?.abort();
    fetch('/api/prerender/stop', { method: 'POST' }).catch(() => {});
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus(prev => ({ ...prev, running: false, phase: 'تم الإيقاف يدوياً' }));
    setLogs(prev => [...prev, '[STOP] ⛔ تم إيقاف العملية يدوياً']);
  }, []);

  const pct = status.total > 0 ? Math.round((status.done / status.total) * 100) : 0;
  const eta = status.done > 0 && status.total > 0
    ? Math.round(((status.elapsed / status.done) * (status.total - status.done)))
    : 0;

  const formatTime = (s: number) => {
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Prerender Manager</h2>
            <p className="text-xs text-slate-400">توليد صفحات HTML ثابتة للزواحف</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
            backendOnline ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
            {backendOnline ? 'Backend متصل' : 'Backend غير متصل'}
          </span>
        </div>
      </div>

      {!backendOnline && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-300">
          ❌ Backend غير متصل. شغّل السيرفر على VPS أولاً:
          <code className="block mt-2 text-xs text-red-400 bg-black/30 rounded p-2 font-mono" dir="ltr">
            cd /var/www/uspostaltracking/server && node index.js
          </code>
        </div>
      )}

      {/* Config */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-200">إعدادات التوليد</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">عدد الصفحات المتوازية</label>
            <input
              type="number" min={1} max={10} value={config.concurrency}
              onChange={e => setConfig(c => ({ ...c, concurrency: Math.max(1, Math.min(10, +e.target.value)) }))}
              disabled={status.running}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
            <p className="text-[10px] text-slate-500 mt-1">RAM منخفض = 2-3 | عادي = 5</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">وقت الانتظار (ms)</label>
            <input
              type="number" min={200} max={5000} step={100} value={config.waitTime}
              onChange={e => setConfig(c => ({ ...c, waitTime: Math.max(200, +e.target.value) }))}
              disabled={status.running}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
            <p className="text-[10px] text-slate-500 mt-1">800ms سريع | 2000ms آمن</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">إعادة تشغيل المتصفح كل</label>
            <input
              type="number" min={50} max={1000} step={50} value={config.restartEvery}
              onChange={e => setConfig(c => ({ ...c, restartEvery: Math.max(50, +e.target.value) }))}
              disabled={status.running}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
            <p className="text-[10px] text-slate-500 mt-1">لمنع تسرب الذاكرة</p>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={config.skipExisting}
                onChange={e => setConfig(c => ({ ...c, skipExisting: e.target.checked }))}
                disabled={status.running}
                className="rounded border-white/20"
              />
              <span className="text-xs text-slate-300">تخطي الصفحات الموجودة</span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {!status.running ? (
          <button
            onClick={startPrerender}
            disabled={!backendOnline}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-lg shadow-green-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play size={16} />
            بدء التوليد
          </button>
        ) : (
          <button
            onClick={stopPrerender}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/25 transition-all"
          >
            <Square size={16} />
            إيقاف
          </button>
        )}
        <button
          onClick={() => setLogs([])}
          disabled={status.running}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all disabled:opacity-40"
        >
          <RotateCcw size={14} />
          مسح السجلات
        </button>
      </div>

      {/* Progress */}
      {(status.running || status.done > 0) && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'الإجمالي', value: status.total.toLocaleString(), icon: FileText, color: 'text-blue-400' },
              { label: 'مكتمل', value: status.done.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'نجح', value: status.success.toLocaleString(), icon: CheckCircle2, color: 'text-green-400' },
              { label: 'فشل', value: status.failed.toLocaleString(), icon: XCircle, color: 'text-red-400' },
              { label: 'المنقضي', value: formatTime(status.elapsed), icon: Clock, color: 'text-amber-400' },
              { label: 'المتبقي', value: status.running ? `~${formatTime(eta)}` : '-', icon: Clock, color: 'text-purple-400' },
            ].map((s, i) => (
              <div key={i} className="bg-black/20 rounded-lg p-3 text-center">
                <s.icon size={14} className={`${s.color} mx-auto mb-1`} />
                <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{status.phase}</span>
              <span className="text-cyan-400 font-mono font-bold">{pct}%</span>
            </div>
            <Progress value={pct} className="h-3 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-green-400 [&>div]:transition-all [&>div]:duration-300" />
            {status.currentPage && (
              <p className="text-[10px] text-slate-500 font-mono truncate" dir="ltr">
                📄 {status.currentPage}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="bg-black rounded-xl border border-slate-700 p-4 font-mono text-xs h-[350px] overflow-y-auto" dir="ltr">
        {logs.length === 0 ? (
          <div className="text-slate-600 text-center mt-20">
            <Terminal size={32} className="mx-auto mb-3 opacity-30" />
            <p>اضغط "بدء التوليد" لبدء عملية Prerender</p>
          </div>
        ) : (
          logs.map((l, i) => (
            <div key={i} className={`leading-relaxed ${
              l.startsWith("[START]") ? "text-cyan-400 font-bold" :
              l.startsWith("[DONE]") ? "text-green-400 font-bold" :
              l.startsWith("[STOP]") ? "text-yellow-400 font-bold" :
              l.startsWith("[ERROR]") ? "text-red-400" :
              l.includes("✅") ? "text-green-300" :
              l.includes("❌") ? "text-red-300" :
              l.includes("⚠") ? "text-yellow-300" :
              "text-slate-300"
            }`}>{l}</div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}

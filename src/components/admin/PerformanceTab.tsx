import React, { useState, useEffect } from "react";
import {
  Loader2, CheckCircle, AlertCircle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function PerformanceTab() {
  const [perfData, setPerfData] = useState<any>(null);
  useEffect(() => {
    fetch('/api/performance').then(r => r.ok ? r.json() : Promise.reject()).then(setPerfData).catch(() => {
      setPerfData({ lighthouse: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 }, coreWebVitals: { lcp: '—', fid: '—', cls: '—', ttfb: '—', inp: '—' }, pageSpeeds: [], history: [] });
    });
  }, []);

  if (!perfData) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  const lh = perfData.lighthouse;
  const cwv = perfData.coreWebVitals;
  const scoreColor = (s: number) => s >= 90 ? 'text-green-400' : s >= 50 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = (s: number) => s >= 90 ? '#22c55e' : s >= 50 ? '#eab308' : '#ef4444';

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">⚡ الأداء و Core Web Vitals</h2>
        <p className="text-xs text-slate-400 mt-1">مقاييس Lighthouse والأداء الفعلي</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: 'Performance', score: lh.performance, icon: '🏎️' },
          { label: 'Accessibility', score: lh.accessibility, icon: '♿' },
          { label: 'Best Practices', score: lh.bestPractices, icon: '✅' },
          { label: 'SEO', score: lh.seo, icon: '🔍' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4 text-center hover:border-slate-600 transition-colors">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreBg(item.score)} strokeWidth="2.5"
                  strokeDasharray={`${item.score} ${100 - item.score}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg sm:text-xl font-bold ${scoreColor(item.score)}`}>{item.score}</span>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 font-medium">{item.icon} {item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">📊 Core Web Vitals</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {[
            { label: 'LCP', value: cwv.lcp, desc: 'Largest Contentful Paint', good: '< 2.5s' },
            { label: 'FID', value: cwv.fid, desc: 'First Input Delay', good: '< 100ms' },
            { label: 'CLS', value: cwv.cls, desc: 'Cumulative Layout Shift', good: '< 0.1' },
            { label: 'TTFB', value: cwv.ttfb, desc: 'Time to First Byte', good: '< 0.8s' },
            { label: 'INP', value: cwv.inp, desc: 'Interaction to Next Paint', good: '< 200ms' },
          ].map((v, i) => (
            <div key={i} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900/70 transition-colors">
              <p className="text-xs text-slate-500 mb-1">{v.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-green-400">{v.value}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-600 mt-1">{v.desc}</p>
              <p className="text-[9px] sm:text-[10px] text-green-600 mt-0.5">✓ {v.good}</p>
            </div>
          ))}
        </div>
      </div>

      {perfData.pageSpeeds?.length > 0 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">🌐 سرعة الصفحات</h3>
          <div className="space-y-2">
            {perfData.pageSpeeds.map((p: any, i: number) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-slate-900/50 rounded-lg p-3">
                <span className="text-xs text-slate-400 w-6 hidden sm:block">{i + 1}</span>
                <span className="text-sm text-slate-200 flex-1 font-mono truncate">{p.page}</span>
                <div className="flex items-center gap-3 sm:gap-4 text-xs">
                  <span><span className="text-slate-500">TTFB:</span> <span className="text-green-400 font-mono">{p.ttfb}</span></span>
                  <span><span className="text-slate-500">Total:</span> <span className="text-blue-400 font-mono">{p.total}</span></span>
                  <span><span className="text-slate-500">Size:</span> <span className="text-purple-400 font-mono">{p.size}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {perfData.history?.length > 0 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">📈 سجل الأداء</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={perfData.history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[80, 100]} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

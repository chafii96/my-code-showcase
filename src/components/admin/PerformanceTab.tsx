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
      setPerfData({
        lighthouse: { performance: 'N/A', accessibility: 'N/A', bestPractices: 'N/A', seo: 'N/A', note: 'يتطلب فحص يدوي' },
        coreWebVitals: { lcp: 'N/A', fid: 'N/A', cls: 'N/A', ttfb: 'N/A', inp: 'N/A' },
        buildInfo: { built: false, totalSize: '—', jsSize: '—', cssSize: '—', imgSize: '—', fontSize: '—', pageCount: 0, componentCount: 0, routeCount: 0, assetCount: 0 },
        responseTimeStats: { avg: 'N/A', p95: 'N/A', p99: 'N/A', count: 0, recentTimes: [] },
        pageSpeeds: [],
        history: [],
      });
    });
  }, []);

  if (!perfData) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  const bi = perfData.buildInfo || {};
  const cwv = perfData.coreWebVitals || {};
  const rts = perfData.responseTimeStats || {};

  const buildSizeData = [
    { name: 'JavaScript', value: bi.jsSizeBytes || 0, color: '#f59e0b' },
    { name: 'CSS', value: bi.cssSizeBytes || 0, color: '#3b82f6' },
    { name: 'صور', value: bi.imgSizeBytes || 0, color: '#10b981' },
    { name: 'خطوط', value: bi.fontSizeBytes || 0, color: '#8b5cf6' },
    { name: 'HTML', value: bi.htmlSizeBytes || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const responseChartData = (rts.recentTimes || []).map((t: number, i: number) => ({ index: i + 1, time: t }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">⚡ تحليل الأداء والبناء</h2>
        <p className="text-xs text-slate-400 mt-1">بيانات حقيقية من ملفات البناء وسجلات التتبع</p>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">📦 تحليل حجم البناء</h3>
        {bi.built ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {[
              { label: 'الحجم الكلي', value: bi.totalSize || '—', icon: '💾', color: 'text-white' },
              { label: 'JavaScript', value: bi.jsSize || '—', icon: '⚡', color: 'text-yellow-400' },
              { label: 'CSS', value: bi.cssSize || '—', icon: '🎨', color: 'text-blue-400' },
              { label: 'الصور', value: bi.imgSize || '—', icon: '🖼️', color: 'text-green-400' },
              { label: 'الخطوط', value: bi.fontSize || '—', icon: '🔤', color: 'text-purple-400' },
              { label: 'HTML', value: bi.htmlSize || '—', icon: '📄', color: 'text-red-400' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900/70 transition-colors">
                <p className="text-xl mb-1">{item.icon}</p>
                <p className={`text-sm sm:text-base font-bold ${item.color}`}>{item.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            <p className="text-2xl mb-2">❌</p>
            <p className="text-sm">مجلد dist/ غير موجود — قم بتشغيل البناء أولاً</p>
          </div>
        )}
      </div>

      {buildSizeData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">📊 توزيع حجم البناء</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={buildSizeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {buildSizeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} formatter={(v: number) => v >= 1048576 ? (v / 1048576).toFixed(2) + ' MB' : (v / 1024).toFixed(1) + ' KB'} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">📁 إحصائيات الملفات</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'عدد الصفحات', value: bi.pageCount || 0, icon: '📄' },
                { label: 'عدد المكونات', value: bi.componentCount || 0, icon: '🧩' },
                { label: 'عدد المسارات', value: bi.routeCount || 0, icon: '🛤️' },
                { label: 'ملفات الأصول', value: bi.assetCount || 0, icon: '📦' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <p className="text-lg mb-1">{item.icon}</p>
                  <p className="text-xl font-bold text-white">{item.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {rts.count > 0 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">⏱️ أوقات الاستجابة (من سجلات التتبع)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
            {[
              { label: 'المتوسط', value: rts.avg, color: 'text-green-400' },
              { label: 'P95', value: rts.p95, color: 'text-yellow-400' },
              { label: 'P99', value: rts.p99, color: 'text-orange-400' },
              { label: 'الأدنى', value: rts.min, color: 'text-blue-400' },
              { label: 'الأعلى', value: rts.max, color: 'text-red-400' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mb-2">عدد الطلبات المسجلة: {rts.count}</p>
          {responseChartData.length > 1 && (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={responseChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="index" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} unit="ms" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} formatter={(v: number) => v + 'ms'} />
                <Area type="monotone" dataKey="time" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} name="وقت الاستجابة" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">📊 تقديرات Core Web Vitals</h3>
        {cwv.note && <p className="text-[10px] text-amber-500/80 mb-3">⚠️ {cwv.note}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {[
            { label: 'LCP', value: cwv.lcp, desc: 'Largest Contentful Paint', good: '< 2.5s' },
            { label: 'TBT', value: cwv.tbt || 'N/A', desc: 'Total Blocking Time', good: '< 200ms' },
            { label: 'FCP', value: cwv.fcp || 'N/A', desc: 'First Contentful Paint', good: '< 1.8s' },
            { label: 'TTFB', value: cwv.ttfb, desc: 'Time to First Byte', good: '< 0.8s' },
            { label: 'CLS', value: cwv.cls, desc: 'Cumulative Layout Shift', good: '< 0.1' },
          ].map((v, i) => (
            <div key={i} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900/70 transition-colors">
              <p className="text-xs text-slate-500 mb-1">{v.label}</p>
              <p className={`text-xl sm:text-2xl font-bold ${v.value === 'N/A' ? 'text-slate-600' : 'text-green-400'}`}>{v.value}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-600 mt-1">{v.desc}</p>
              <p className="text-[9px] sm:text-[10px] text-green-600 mt-0.5">✓ {v.good}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/80 border border-amber-700/40 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-amber-400/80 mb-3 flex items-center gap-2">🔍 Lighthouse — يتطلب فحص يدوي</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: 'Performance', icon: '🏎️' },
            { label: 'Accessibility', icon: '♿' },
            { label: 'Best Practices', icon: '✅' },
            { label: 'SEO', icon: '🔍' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 sm:p-4 text-center opacity-60">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="0 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm sm:text-base font-bold text-slate-500">N/A</span>
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{item.icon} {item.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 mt-3 text-center">
          افتح Chrome DevTools → Lighthouse للحصول على نتائج دقيقة
        </p>
      </div>
    </div>
  );
}

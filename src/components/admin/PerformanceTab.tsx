import React, { useState, useEffect, useMemo } from "react";
import {
  Loader2, CheckCircle, AlertCircle, AlertTriangle, TrendingUp, TrendingDown,
  Zap, HardDrive, Clock, Eye, FileCode, Image, Type, FileText, BarChart3,
  Shield, Gauge, Activity, ArrowUpRight, ArrowDownRight, Info, ChevronDown, ChevronUp
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadialBarChart, RadialBar
} from "recharts";

const TOOLTIP_STYLE = { background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: 12 };

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return bytes + ' B';
}

function parseSize(s: string): number {
  if (!s || s === '—') return 0;
  const match = s.match(/([\d.]+)\s*(MB|KB|B|GB)/i);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'GB') return val * 1073741824;
  if (unit === 'MB') return val * 1048576;
  if (unit === 'KB') return val * 1024;
  return val;
}

function ScoreCircle({ score, size = 140, label }: { score: number; size?: number; label?: string }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
  const bgColor = score >= 80 ? 'rgba(34,197,94,0.1)' : score >= 50 ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color }}>{score}</span>
          <span className="text-[10px] text-slate-500 mt-0.5">من 100</span>
        </div>
      </div>
      {label && <p className="text-xs text-slate-400 mt-2 font-medium">{label}</p>}
    </div>
  );
}

function MetricGauge({ value, max, label, unit, thresholds, tip }: {
  value: number; max: number; label: string; unit: string;
  thresholds: { good: number; mid: number };
  tip: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const status = value <= thresholds.good ? 'good' : value <= thresholds.mid ? 'needs-improvement' : 'poor';
  const statusColor = status === 'good' ? '#22c55e' : status === 'needs-improvement' ? '#eab308' : '#ef4444';
  const statusLabel = status === 'good' ? 'جيد' : status === 'needs-improvement' ? 'يحتاج تحسين' : 'ضعيف';
  const statusBg = status === 'good' ? 'bg-green-500/10 border-green-500/30 text-green-400' : status === 'needs-improvement' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-red-500/10 border-red-500/30 text-red-400';

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 rounded-2xl p-5 hover:border-slate-600/60 transition-all">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-300">{label}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBg}`}>{statusLabel}</span>
      </div>
      <div className="flex items-end gap-1 mb-3">
        <span className="text-3xl font-black" style={{ color: statusColor }}>
          {typeof value === 'number' && !isNaN(value) ? value : 'N/A'}
        </span>
        <span className="text-sm text-slate-500 mb-1">{unit}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-700/50 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${statusColor}, ${statusColor}88)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 mb-3">
        <span>0</span>
        <span>الهدف: {thresholds.good}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-700/30">
        <p className="text-[10px] text-slate-500 flex items-start gap-1.5">
          <Info size={10} className="mt-0.5 shrink-0 text-blue-400" />
          {tip}
        </p>
      </div>
    </div>
  );
}

function ResourceBar({ label, value, maxValue, color, icon }: {
  label: string; value: number; maxValue: number; color: string; icon: string;
}) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-lg w-7 text-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-300 font-medium">{label}</span>
          <span className="text-xs font-bold" style={{ color }}>{formatBytes(value)}</span>
        </div>
        <div className="w-full h-2 bg-slate-700/40 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ value, good, mid, unit }: { value: string | number; good: number; mid: number; unit: string }) {
  const numVal = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numVal)) return <span className="text-slate-500">N/A</span>;
  const status = numVal <= good ? 'text-green-400 bg-green-500/10 border-green-500/30' : numVal <= mid ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' : 'text-red-400 bg-red-500/10 border-red-500/30';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${status}`}>{numVal}{unit}</span>;
}

export default function PerformanceTab() {
  const [perfData, setPerfData] = useState<any>(null);
  const [showLargestFiles, setShowLargestFiles] = useState(false);

  useEffect(() => {
    fetch('/api/performance').then(r => r.ok ? r.json() : Promise.reject()).then(setPerfData).catch(() => {
      setPerfData({
        lighthouse: { performance: 'N/A', accessibility: 'N/A', bestPractices: 'N/A', seo: 'N/A', note: 'يتطلب فحص يدوي' },
        coreWebVitals: { lcp: 'N/A', fid: 'N/A', cls: 'N/A', ttfb: 'N/A', inp: 'N/A', tbt: 'N/A', fcp: 'N/A' },
        buildInfo: { built: false, totalSize: '—', jsSize: '—', cssSize: '—', imgSize: '—', fontSize: '—', htmlSize: '—', pageCount: 0, componentCount: 0, routeCount: 0, assetCount: 0, jsSizeBytes: 0, cssSizeBytes: 0, imgSizeBytes: 0, fontSizeBytes: 0, htmlSizeBytes: 0, totalSizeBytes: 0, largestFiles: [], imageFormats: {}, fontFormats: {} },
        responseTimeStats: { avg: 'N/A', p50: 'N/A', p95: 'N/A', p99: 'N/A', min: 'N/A', max: 'N/A', count: 0, recentTimes: [], slowRequests: [] },
        pageSpeeds: [],
        history: [],
      });
    });
  }, []);

  const bi = perfData?.buildInfo || {};
  const cwv = perfData?.coreWebVitals || {};
  const rts = perfData?.responseTimeStats || {};

  const overallScore = useMemo(() => {
    if (!perfData) return 0;
    let score = 50;
    const totalBytes = bi.totalSizeBytes || parseSize(bi.totalSize);
    if (totalBytes > 0) {
      if (totalBytes < 2 * 1048576) score += 15;
      else if (totalBytes < 5 * 1048576) score += 10;
      else if (totalBytes < 10 * 1048576) score += 5;
    }
    const pages = bi.pageCount || 0;
    const routes = bi.routeCount || 0;
    if (pages > 0 && routes > 0) {
      const coverage = Math.min(routes / Math.max(pages, 1), 1);
      score += Math.round(coverage * 10);
    }
    const avgMs = typeof rts.avg === 'string' ? parseFloat(rts.avg) : rts.avg;
    if (!isNaN(avgMs) && avgMs > 0) {
      if (avgMs < 100) score += 15;
      else if (avgMs < 300) score += 10;
      else if (avgMs < 500) score += 5;
    }
    const imgFormats = bi.imageFormats || {};
    const optimized = (imgFormats.webp || 0) + (imgFormats.avif || 0) + (imgFormats.svg || 0);
    const legacy = (imgFormats.png || 0) + (imgFormats.jpeg || 0) + (imgFormats.jpg || 0) + (imgFormats.gif || 0);
    if (optimized + legacy > 0) {
      score += Math.round((optimized / (optimized + legacy)) * 10);
    }
    return Math.min(Math.max(Math.round(score), 0), 100);
  }, [perfData, bi, rts]);

  if (!perfData) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="animate-spin text-blue-400" />
        <span className="text-sm text-slate-500">جاري تحميل بيانات الأداء...</span>
      </div>
    </div>
  );

  const buildSizeData = [
    { name: 'JavaScript', value: bi.jsSizeBytes || 0, color: '#f59e0b' },
    { name: 'CSS', value: bi.cssSizeBytes || 0, color: '#3b82f6' },
    { name: 'صور', value: bi.imgSizeBytes || 0, color: '#10b981' },
    { name: 'خطوط', value: bi.fontSizeBytes || 0, color: '#8b5cf6' },
    { name: 'HTML', value: bi.htmlSizeBytes || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const totalBytes = bi.totalSizeBytes || buildSizeData.reduce((s, d) => s + d.value, 0);

  const responseChartData = (rts.recentTimes || []).map((t: number, i: number) => {
    const now = new Date();
    const hoursAgo = rts.recentTimes.length - i;
    const time = new Date(now.getTime() - hoursAgo * 3600000);
    return { index: i + 1, time: t, label: `${time.getHours()}:00` };
  });

  const slowRequests = (rts.slowRequests || (rts.recentTimes || []).filter((t: number) => t > 2000)).slice(0, 10);

  const largestFiles = (bi.largestFiles || []).slice(0, 10);

  const imageFormats = bi.imageFormats || {};
  const fontFormats = bi.fontFormats || {};
  const totalImages = Object.values(imageFormats).reduce((a: number, b: any) => a + (b || 0), 0) as number;
  const optimizedImages = (imageFormats.webp || 0) + (imageFormats.avif || 0) + (imageFormats.svg || 0);
  const totalFonts = Object.values(fontFormats).reduce((a: number, b: any) => a + (b || 0), 0) as number;
  const woff2Fonts = fontFormats.woff2 || 0;

  const jsBytes = bi.jsSizeBytes || 0;
  const vendorEstimate = Math.round(jsBytes * 0.65);
  const appEstimate = jsBytes - vendorEstimate;
  const treeshakingScore = jsBytes > 0 ? Math.min(Math.round((1 - jsBytes / (totalBytes || 1)) * 100), 95) : 0;

  const gzipEstimate = totalBytes > 0 ? Math.round(totalBytes * 0.3) : 0;
  const brotliEstimate = totalBytes > 0 ? Math.round(totalBytes * 0.22) : 0;

  const lcpVal = typeof cwv.lcp === 'string' ? parseFloat(cwv.lcp) : cwv.lcp;
  const tbtVal = typeof cwv.tbt === 'string' ? parseFloat(cwv.tbt) : (typeof cwv.fid === 'string' ? parseFloat(cwv.fid) : cwv.fid);
  const clsVal = typeof cwv.cls === 'string' ? parseFloat(cwv.cls) : cwv.cls;

  const htmlParseEst = totalBytes > 0 ? Math.round((bi.htmlSizeBytes || 0) / 1024 * 0.5) : 0;
  const cssBlockEst = totalBytes > 0 ? Math.round((bi.cssSizeBytes || 0) / 1024 * 0.8) : 0;
  const jsExecEst = totalBytes > 0 ? Math.round(jsBytes / 1024 * 0.3) : 0;
  const fontLoadEst = totalBytes > 0 ? Math.round((bi.fontSizeBytes || 0) / 1024 * 0.6) : 0;

  const scoreBreakdown = [
    { label: 'كفاءة حجم البناء', score: totalBytes < 2 * 1048576 ? 95 : totalBytes < 5 * 1048576 ? 75 : totalBytes < 10 * 1048576 ? 55 : 30, color: '#3b82f6' },
    { label: 'تغطية المسارات', score: bi.routeCount > 0 ? Math.min(Math.round((bi.routeCount / Math.max(bi.pageCount, 1)) * 100), 100) : 50, color: '#8b5cf6' },
    { label: 'تحسين الأصول', score: totalImages > 0 ? Math.round((optimizedImages / totalImages) * 100) : 70, color: '#10b981' },
    { label: 'جودة الاستجابة', score: (() => { const a = typeof rts.avg === 'string' ? parseFloat(rts.avg) : rts.avg; if (isNaN(a) || !a) return 70; return a < 100 ? 95 : a < 300 ? 75 : a < 500 ? 50 : 25; })(), color: '#f59e0b' },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-900/90 border border-slate-700/60 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Gauge className="text-blue-400" size={20} />
              نتيجة الأداء العامة
            </h2>
            <ScoreCircle score={overallScore} size={160} />
            <p className="text-[10px] text-slate-500 mt-2">
              {overallScore >= 80 ? 'أداء ممتاز' : overallScore >= 50 ? 'أداء مقبول — يحتاج تحسين' : 'أداء ضعيف — يتطلب إصلاح'}
            </p>
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">تفصيل النتيجة</h3>
            <div className="space-y-3">
              {scoreBreakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-300">{item.label}</span>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700/40 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.score}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}66)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <HardDrive size={16} className="text-blue-400" />
          تحليل البناء التفصيلي
        </h3>
        {bi.built ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
              {[
                { label: 'الحجم الكلي', value: bi.totalSize || formatBytes(totalBytes), icon: '💾', color: 'text-white', sub: bi.built ? 'مبني' : '' },
                { label: 'JavaScript', value: bi.jsSize || formatBytes(jsBytes), icon: '⚡', color: 'text-yellow-400', sub: `${Math.round((jsBytes / (totalBytes || 1)) * 100)}%` },
                { label: 'CSS', value: bi.cssSize || formatBytes(bi.cssSizeBytes || 0), icon: '🎨', color: 'text-blue-400', sub: `${Math.round(((bi.cssSizeBytes || 0) / (totalBytes || 1)) * 100)}%` },
                { label: 'الصور', value: bi.imgSize || formatBytes(bi.imgSizeBytes || 0), icon: '🖼️', color: 'text-green-400', sub: `${totalImages} ملف` },
                { label: 'الخطوط', value: bi.fontSize || formatBytes(bi.fontSizeBytes || 0), icon: '🔤', color: 'text-purple-400', sub: `${totalFonts} خط` },
                { label: 'HTML', value: bi.htmlSize || formatBytes(bi.htmlSizeBytes || 0), icon: '📄', color: 'text-red-400', sub: `${bi.pageCount || 0} صفحة` },
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-700/30 rounded-xl p-3 text-center hover:border-slate-600/50 transition-all">
                  <p className="text-xl mb-1">{item.icon}</p>
                  <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
                  {item.sub && <p className="text-[9px] text-slate-600 mt-0.5">{item.sub}</p>}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
                  <BarChart3 size={14} />
                  توزيع الموارد
                </h4>
                <div className="space-y-1">
                  <ResourceBar label="JavaScript" value={jsBytes} maxValue={totalBytes} color="#f59e0b" icon="⚡" />
                  <ResourceBar label="CSS" value={bi.cssSizeBytes || 0} maxValue={totalBytes} color="#3b82f6" icon="🎨" />
                  <ResourceBar label="الصور" value={bi.imgSizeBytes || 0} maxValue={totalBytes} color="#10b981" icon="🖼️" />
                  <ResourceBar label="الخطوط" value={bi.fontSizeBytes || 0} maxValue={totalBytes} color="#8b5cf6" icon="🔤" />
                  <ResourceBar label="HTML" value={bi.htmlSizeBytes || 0} maxValue={totalBytes} color="#ef4444" icon="📄" />
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-slate-400 mb-3">📊 توزيع حجم البناء</h4>
                {buildSizeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={buildSizeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {buildSizeData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatBytes(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-slate-600 text-sm">لا توجد بيانات</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
                  <FileCode size={14} />
                  تحليل JavaScript
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">كود المكتبات (Vendor)</span>
                    <span className="text-yellow-400 font-bold">{formatBytes(vendorEstimate)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">كود التطبيق (App)</span>
                    <span className="text-emerald-400 font-bold">{formatBytes(appEstimate)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: '35%' }} />
                  </div>
                  <div className="flex justify-between text-xs mt-2 pt-2 border-t border-slate-700/30">
                    <span className="text-slate-400">فعالية Tree-shaking</span>
                    <span className="text-blue-400 font-bold">{treeshakingScore}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
                  📁 إحصائيات الملفات
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'عدد الصفحات', value: bi.pageCount || 0, icon: '📄', color: 'text-blue-400' },
                    { label: 'عدد المكونات', value: bi.componentCount || 0, icon: '🧩', color: 'text-purple-400' },
                    { label: 'عدد المسارات', value: bi.routeCount || 0, icon: '🛤️', color: 'text-green-400' },
                    { label: 'ملفات الأصول', value: bi.assetCount || 0, icon: '📦', color: 'text-yellow-400' },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-700/20">
                      <p className="text-lg mb-1">{item.icon}</p>
                      <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {largestFiles.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowLargestFiles(!showLargestFiles)}
                  className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showLargestFiles ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  أكبر 10 ملفات
                </button>
                {showLargestFiles && (
                  <div className="mt-2 bg-slate-900/40 border border-slate-700/30 rounded-xl p-3 space-y-1.5">
                    {largestFiles.map((f: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-slate-800/40">
                        <span className="text-slate-400 truncate max-w-[70%]" dir="ltr">{f.name || f.path || `ملف ${i + 1}`}</span>
                        <span className="text-slate-300 font-mono font-bold">{f.size || formatBytes(f.sizeBytes || 0)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <p className="text-3xl mb-3">❌</p>
            <p className="text-sm font-medium">مجلد dist/ غير موجود</p>
            <p className="text-xs text-slate-600 mt-1">قم بتشغيل البناء أولاً للحصول على بيانات تحليل البناء</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Clock size={16} className="text-emerald-400" />
          مراقبة أوقات الاستجابة
        </h3>
        {rts.count > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
              {[
                { label: 'P50 (الوسيط)', value: rts.p50 || rts.avg, good: 100, mid: 300, unit: 'ms', color: 'text-green-400' },
                { label: 'المتوسط', value: rts.avg, good: 150, mid: 400, unit: 'ms', color: 'text-emerald-400' },
                { label: 'P95', value: rts.p95, good: 300, mid: 800, unit: 'ms', color: 'text-yellow-400' },
                { label: 'P99', value: rts.p99, good: 500, mid: 1500, unit: 'ms', color: 'text-orange-400' },
                { label: 'الأدنى', value: rts.min, good: 50, mid: 200, unit: 'ms', color: 'text-blue-400' },
                { label: 'الأعلى', value: rts.max, good: 500, mid: 2000, unit: 'ms', color: 'text-red-400' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-700/30 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-500 mb-1">{item.label}</p>
                  <StatusBadge value={item.value} good={item.good} mid={item.mid} unit={item.unit} />
                </div>
              ))}
            </div>

            <div className="mb-2">
              <p className="text-[10px] text-slate-600 mb-2">عدد الطلبات المسجلة: {rts.count} طلب</p>
            </div>

            {responseChartData.length > 1 && (
              <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-3">
                <h4 className="text-[10px] text-slate-500 mb-2">أوقات الاستجابة خلال آخر 24 ساعة</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={responseChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="responseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#475569', fontSize: 10 }} unit="ms" />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [v + 'ms', 'وقت الاستجابة']} />
                    <Area type="monotone" dataKey="time" stroke="#3b82f6" fill="url(#responseGrad)" strokeWidth={2} name="وقت الاستجابة" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {slowRequests.length > 0 && (
              <div className="mt-4 bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle size={12} />
                  طلبات بطيئة ({'>'}2 ثانية)
                </h4>
                <div className="space-y-1">
                  {slowRequests.map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/30">
                      <span className="text-slate-400">طلب #{i + 1}</span>
                      <span className="text-red-400 font-bold">{typeof t === 'number' ? t + 'ms' : t.time + 'ms'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Activity size={32} className="mx-auto mb-2 text-slate-600" />
            <p className="text-sm">لا توجد بيانات استجابة مسجلة حتى الآن</p>
            <p className="text-[10px] text-slate-600 mt-1">ستظهر البيانات بعد تسجيل طلبات التتبع</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Eye size={16} className="text-purple-400" />
          مقاييس Core Web Vitals
        </h3>
        {cwv.note && <p className="text-[10px] text-amber-500/80 mb-3 flex items-center gap-1"><AlertCircle size={10} /> {cwv.note}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricGauge
            value={isNaN(lcpVal) ? 0 : lcpVal}
            max={6}
            label="LCP — أكبر عرض للمحتوى"
            unit="s"
            thresholds={{ good: 2.5, mid: 4 }}
            tip="تحسين: ضغط الصور، استخدام CDN، تحميل مُسبق للخطوط والموارد الحرجة"
          />
          <MetricGauge
            value={isNaN(tbtVal) ? 0 : tbtVal}
            max={600}
            label="TBT/FID — وقت الحظر الكلي"
            unit="ms"
            thresholds={{ good: 200, mid: 400 }}
            tip="تقليل: تقسيم الكود، تأجيل JavaScript غير الحرج، استخدام Web Workers"
          />
          <MetricGauge
            value={isNaN(clsVal) ? 0 : clsVal}
            max={0.5}
            label="CLS — إزاحة التخطيط التراكمية"
            unit=""
            thresholds={{ good: 0.1, mid: 0.25 }}
            tip="تثبيت: تحديد أبعاد الصور والإعلانات، تجنب المحتوى الديناميكي فوق الطي"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          تقديرات سرعة الصفحة
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'تحليل HTML', value: htmlParseEst, icon: '📄', color: '#ef4444', desc: 'وقت تحليل وثيقة HTML' },
            { label: 'حظر CSS', value: cssBlockEst, icon: '🎨', color: '#3b82f6', desc: 'وقت حظر العرض بسبب CSS' },
            { label: 'تنفيذ JS', value: jsExecEst, icon: '⚡', color: '#f59e0b', desc: 'وقت تنفيذ JavaScript' },
            { label: 'تحميل الخطوط', value: fontLoadEst, icon: '🔤', color: '#8b5cf6', desc: 'وقت تحميل الخطوط' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 text-center">
              <p className="text-xl mb-2">{item.icon}</p>
              <p className="text-lg font-bold" style={{ color: item.color }}>{item.value > 0 ? `~${item.value}ms` : 'N/A'}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.label}</p>
              <p className="text-[9px] text-slate-600 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        {bi.built && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <TrendingUp size={12} />
              اقتراحات التحسين
            </h4>
            <div className="space-y-2">
              {jsBytes > 500 * 1024 && (
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <AlertTriangle size={12} className="text-yellow-400 mt-0.5 shrink-0" />
                  <span>حجم JavaScript كبير ({formatBytes(jsBytes)}) — فكر في تقسيم الكود واستخدام التحميل الكسول</span>
                </div>
              )}
              {(bi.cssSizeBytes || 0) > 200 * 1024 && (
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <AlertTriangle size={12} className="text-yellow-400 mt-0.5 shrink-0" />
                  <span>CSS كبير — استخدم PurgeCSS لإزالة الأنماط غير المستخدمة</span>
                </div>
              )}
              {totalImages > 0 && optimizedImages < totalImages && (
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <AlertTriangle size={12} className="text-yellow-400 mt-0.5 shrink-0" />
                  <span>{totalImages - optimizedImages} صورة بصيغ غير محسّنة — حوّل إلى WebP أو AVIF</span>
                </div>
              )}
              {totalFonts > 0 && woff2Fonts < totalFonts && (
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <AlertTriangle size={12} className="text-yellow-400 mt-0.5 shrink-0" />
                  <span>{totalFonts - woff2Fonts} خط بصيغة غير WOFF2 — حوّل لتقليل الحجم</span>
                </div>
              )}
              {jsBytes > 0 && jsBytes <= 500 * 1024 && (bi.cssSizeBytes || 0) <= 200 * 1024 && optimizedImages >= totalImages && woff2Fonts >= totalFonts && (
                <div className="flex items-start gap-2 text-xs text-green-400">
                  <CheckCircle size={12} className="mt-0.5 shrink-0" />
                  <span>الموقع محسّن بشكل جيد! استمر في المراقبة</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Shield size={16} className="text-green-400" />
          حالة تحسين الأصول
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Image size={16} className="text-green-400" />
              <h4 className="text-xs font-semibold text-slate-300">تحسين الصور</h4>
            </div>
            {totalImages > 0 ? (
              <>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-2xl font-black text-green-400">{Math.round((optimizedImages / totalImages) * 100)}%</span>
                  <span className="text-[10px] text-slate-500 mb-1">محسّن</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  {Object.entries(imageFormats).map(([fmt, count]: [string, any]) => (
                    <div key={fmt} className="flex justify-between text-slate-400">
                      <span className="uppercase">{fmt}</span>
                      <span className={['webp', 'avif', 'svg'].includes(fmt) ? 'text-green-400' : 'text-yellow-400'}>{count} ملف</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[10px] text-slate-600">لا توجد بيانات</p>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Type size={16} className="text-purple-400" />
              <h4 className="text-xs font-semibold text-slate-300">تحسين الخطوط</h4>
            </div>
            {totalFonts > 0 ? (
              <>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-2xl font-black text-purple-400">{Math.round((woff2Fonts / totalFonts) * 100)}%</span>
                  <span className="text-[10px] text-slate-500 mb-1">WOFF2</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  {Object.entries(fontFormats).map(([fmt, count]: [string, any]) => (
                    <div key={fmt} className="flex justify-between text-slate-400">
                      <span className="uppercase">{fmt}</span>
                      <span className={fmt === 'woff2' ? 'text-green-400' : 'text-yellow-400'}>{count} ملف</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[10px] text-slate-600">لا توجد بيانات</p>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileCode size={16} className="text-yellow-400" />
              <h4 className="text-xs font-semibold text-slate-300">تقسيم الكود</h4>
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-2xl font-black text-yellow-400">{treeshakingScore}%</span>
              <span className="text-[10px] text-slate-500 mb-1">فعالية</span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>كود المكتبات</span>
                <span className="text-yellow-400">{formatBytes(vendorEstimate)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>كود التطبيق</span>
                <span className="text-emerald-400">{formatBytes(appEstimate)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>عدد المكونات</span>
                <span>{bi.componentCount || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive size={16} className="text-blue-400" />
              <h4 className="text-xs font-semibold text-slate-300">تقدير الضغط</h4>
            </div>
            {totalBytes > 0 ? (
              <>
                <div className="space-y-3 text-[10px]">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>الحجم الأصلي</span>
                      <span className="text-white font-bold">{formatBytes(totalBytes)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Gzip (تقدير)</span>
                      <span className="text-blue-400 font-bold">{formatBytes(gzipEstimate)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700/40 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: '30%' }} />
                    </div>
                    <span className="text-emerald-500">↓ {Math.round((1 - gzipEstimate / totalBytes) * 100)}% توفير</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Brotli (تقدير)</span>
                      <span className="text-purple-400 font-bold">{formatBytes(brotliEstimate)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700/40 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: '22%' }} />
                    </div>
                    <span className="text-emerald-500">↓ {Math.round((1 - brotliEstimate / totalBytes) * 100)}% توفير</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[10px] text-slate-600">لا توجد بيانات بناء</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-800/60 via-slate-800/40 to-slate-900/60 border border-amber-700/30 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-amber-400/80 mb-3 flex items-center gap-2">
          🔍 Lighthouse — يتطلب فحص يدوي
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Performance', icon: '🏎️' },
            { label: 'Accessibility', icon: '♿' },
            { label: 'Best Practices', icon: '✅' },
            { label: 'SEO', icon: '🔍' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center opacity-60">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="0 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-500">N/A</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">{item.icon} {item.label}</p>
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

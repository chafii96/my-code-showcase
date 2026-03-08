import React from "react";
import {
  LayoutDashboard, Globe, TrendingUp, Activity, FileText, Cpu, GitBranch,
  Zap, LucideIcon, Hammer, Server, Database,
} from "lucide-react";

export const CATEGORIES: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  all:        { label: "الكل", color: "text-white", bg: "bg-white/10", icon: <LayoutDashboard size={14}/> },
  elite:      { label: "☢️ Elite", color: "text-red-300", bg: "bg-red-500/15 border border-red-500/20", icon: <Zap size={14}/> },
  indexing:   { label: "أرشفة", color: "text-blue-300", bg: "bg-blue-500/15", icon: <Globe size={14}/> },
  seo:        { label: "SEO", color: "text-emerald-300", bg: "bg-emerald-500/15", icon: <TrendingUp size={14}/> },
  monitoring: { label: "مراقبة", color: "text-amber-300", bg: "bg-amber-500/15", icon: <Activity size={14}/> },
  content:    { label: "محتوى", color: "text-violet-300", bg: "bg-violet-500/15", icon: <FileText size={14}/> },
  technical:  { label: "تقني", color: "text-orange-300", bg: "bg-orange-500/15", icon: <Cpu size={14}/> },
  build:      { label: "بناء", color: "text-yellow-300", bg: "bg-yellow-500/15", icon: <Hammer size={14}/> },
  server:     { label: "سيرفر", color: "text-cyan-300", bg: "bg-cyan-500/15", icon: <Server size={14}/> },
  data:       { label: "بيانات", color: "text-teal-300", bg: "bg-teal-500/15", icon: <Database size={14}/> },
  git:        { label: "Git", color: "text-pink-300", bg: "bg-pink-500/15", icon: <GitBranch size={14}/> },
};

export function Badge({ cat }: { cat: string }) {
  const c = CATEGORIES[cat] || CATEGORIES.all;
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${c.bg} ${c.color}`}>{c.icon}{c.label}</span>;
}

export function StatCard({ label, value, icon, color, sub, trend }: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
  trend?: { value: string; up: boolean };
}) {
  return (
    <div className="admin-card group relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-[0.07] ${color.replace('text-', 'bg-')}`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{label}</span>
          <span className={`${color} opacity-50 group-hover:opacity-90 transition-opacity`}>{icon}</span>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{value}</p>
        <div className="flex items-center justify-between mt-1.5">
          {sub && <p className="text-[10px] sm:text-xs text-slate-500">{sub}</p>}
          {trend && (
            <span className={`text-[10px] font-medium ${trend.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="admin-card border-dashed p-8 sm:p-12 text-center">
      <div className="text-slate-600 mx-auto mb-3 flex justify-center">{icon}</div>
      <p className="text-sm text-slate-400 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{subtitle}</p>}
    </div>
  );
}

export const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', IN: '🇮🇳', GB: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺', DE: '🇩🇪', FR: '🇫🇷', BR: '🇧🇷', MX: '🇲🇽', JP: '🇯🇵',
  SA: '🇸🇦', AE: '🇦🇪', EG: '🇪🇬', TR: '🇹🇷', IT: '🇮🇹', ES: '🇪🇸', NL: '🇳🇱', SE: '🇸🇪', KR: '🇰🇷', CN: '🇨🇳',
  KW: '🇰🇼', QA: '🇶🇦', PK: '🇵🇰', NG: '🇳🇬', RU: '🇷🇺',
};

import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import {
  LayoutDashboard, Zap, Users, Cpu, Terminal, BookOpen, Megaphone,
  TrendingUp, Shield, Key, Database, GitBranch, Activity, Settings,
  ExternalLink, LogOut, Loader2, PanelLeftClose, PanelLeft, Menu,
  ChevronRight, Search, Bell, Server, HardDrive, Bug, Radar, ShieldAlert, FileText, Cog,
} from "lucide-react";
import { Script } from "@/components/admin/types";
import LoginGate, { SESSION_KEY, SESSION_DURATION } from "@/components/admin/LoginGate";
import OverviewTab from "@/components/admin/OverviewTab";
import ToolsTab from "@/components/admin/ToolsTab";
import TerminalTab from "@/components/admin/TerminalTab";
import VisitorAnalyticsTab from "@/components/admin/VisitorAnalyticsTab";
import ApiKeysTab from "@/components/admin/ApiKeysTab";
import AdsManagerTab from "@/components/admin/AdsManagerTab";
import SiteSettingsTab from "@/components/admin/SiteSettingsTab";
import SeoAuditTab from "@/components/admin/SeoAuditTab";
import RobotsTab from "@/components/admin/RobotsTab";
import ContentManagementTab from "@/components/admin/ContentManagementTab";
import PerformanceTab from "@/components/admin/PerformanceTab";
import DatabaseTab from "@/components/admin/DatabaseTab";
import ActivityLogsTab from "@/components/admin/ActivityLogsTab";
import GitTab from "@/components/admin/GitTab";
import KeywordsTab from "@/components/admin/KeywordsTab";

// API Manager tabs (lazy loaded)
const ApiOverviewTab = lazy(() => import("@/components/admin/api-manager/ApiOverviewTab"));
const ApiProvidersTab = lazy(() => import("@/components/admin/api-manager/ApiProvidersTab"));
const CacheManagementTab = lazy(() => import("@/components/admin/api-manager/CacheManagementTab"));
const ScraperManagementTab = lazy(() => import("@/components/admin/api-manager/ScraperManagementTab"));
const CarrierDetectionTab = lazy(() => import("@/components/admin/api-manager/CarrierDetectionTab"));
const RateLimitingTab = lazy(() => import("@/components/admin/api-manager/RateLimitingTab"));
const ApiLogsTab = lazy(() => import("@/components/admin/api-manager/ApiLogsTab"));
const ApiSystemSettingsTab = lazy(() => import("@/components/admin/api-manager/ApiSystemSettingsTab"));
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}'); return s.ts && (Date.now() - s.ts < SESSION_DURATION); } catch { return false; }
  });
  const handleLogout = () => { localStorage.removeItem(SESSION_KEY); setIsAuthenticated(false); };
  if (!isAuthenticated) return <LoginGate onAuth={() => setIsAuthenticated(true)} />;
  return <AdminDashboardContent onLogout={handleLogout} />;
}

function AdminDashboardContent({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState<any>({});
  const [sitemaps, setSitemaps] = useState<any[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [termLines, setTermLines] = useState<string[]>([]);
  const [running, setRunning] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const tryBackend = async () => {
      try {
        const healthRes = await fetch('/api/health', { signal: AbortSignal.timeout(3000) });
        const ct = healthRes.headers.get('content-type') || '';
        if (!healthRes.ok || !ct.includes('application/json')) throw new Error('offline');
        setBackendOnline(true);
        const [statsRes, sitemapsRes, scriptsRes] = await Promise.all([fetch('/api/stats'), fetch('/api/sitemaps'), fetch('/api/scripts')]);
        if (statsRes.ok) { const c = statsRes.headers.get('content-type') || ''; if (c.includes('application/json')) setStats(await statsRes.json()); }
        const smCt = sitemapsRes.headers.get('content-type') || '';
        if (smCt.includes('application/json')) { const d = await sitemapsRes.json(); setSitemaps(d.sitemaps || []); }
        const scCt = scriptsRes.headers.get('content-type') || '';
        if (scCt.includes('application/json')) { const d = await scriptsRes.json(); setScripts(d.scripts || []); }
      } catch { setBackendOnline(false); }
    };
    tryBackend();
  }, []);

  const runScript = useCallback((script: Script) => {
    setTab("terminal");
    setRunning(script.id);
    setTermLines(prev => [...prev, `[START] ▶ ${script.name}`, `$ ${script.cmd}`, '─'.repeat(50)]);
    if (!backendOnline) {
      setTermLines(prev => [...prev, '[ERROR] ❌ Backend غير متصل. شغّل السيرفر على VPS أولاً:', '$ cd /var/www/swifttrack-hub/server && node index.js']);
      setRunning(null);
      return;
    }
    fetch(`/api/run/${script.id}`, { method: 'POST' }).then(res => {
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const read = () => {
        reader.read().then(({ done, value }) => {
          if (done) { setRunning(null); setTermLines(prev => [...prev, '─'.repeat(50), `[DONE] ✅ ${script.name} اكتمل`]); return; }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n'); buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try { const msg = JSON.parse(line.slice(6)); if (msg.type === 'output') setTermLines(prev => [...prev, msg.line]); if (msg.type === 'error') setTermLines(prev => [...prev, `[ERROR] ${msg.line}`]); } catch {}
            }
          }
          read();
        });
      };
      read();
    }).catch(e => { setRunning(null); setTermLines(prev => [...prev, `[ERROR] ${e.message}`]); });
  }, [backendOnline]);

  const SIDEBAR_SECTIONS = [
    { title: 'الرئيسية', items: [
      { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
      { id: "performance", label: "الأداء", icon: Zap },
      { id: "visitors", label: "الزوار", icon: Users },
    ]},
    { title: 'مدير API', items: [
      { id: "api-overview", label: "لوحة API", icon: Server },
      { id: "api-providers", label: "المزودين", icon: Database },
      { id: "api-cache", label: "الكاش", icon: HardDrive },
      { id: "api-scrapers", label: "الاستخراج", icon: Bug },
      { id: "api-carriers", label: "اكتشاف الناقل", icon: Radar },
      { id: "api-ratelimit", label: "تحديد المعدل", icon: ShieldAlert },
      { id: "api-logs", label: "سجلات API", icon: FileText },
      { id: "api-settings", label: "إعدادات API", icon: Cog },
    ]},
    { title: 'الأدوات', items: [
      { id: "tools", label: `الأدوات (${scripts.length})`, icon: Cpu },
      { id: "terminal", label: "Terminal", icon: Terminal, badge: !!running },
    ]},
    { title: 'المحتوى', items: [
      { id: "content", label: "إدارة المحتوى", icon: BookOpen },
      { id: "ads", label: "الإعلانات", icon: Megaphone },
    ]},
    { title: 'SEO', items: [
      { id: "seo", label: "SEO Audit", icon: TrendingUp },
      { id: "keywords", label: "الكلمات المفتاحية", icon: Search },
      { id: "robots", label: "robots.txt", icon: Shield },
    ]},
    { title: 'النظام', items: [
      { id: "apikeys", label: "مفاتيح API", icon: Key },
      { id: "database", label: "البيانات", icon: Database },
      { id: "git", label: "Git", icon: GitBranch },
      { id: "logs", label: "سجل النشاط", icon: Activity },
      { id: "settings", label: "الإعدادات", icon: Settings },
    ]},
  ];

  const currentLabel = SIDEBAR_SECTIONS.flatMap(s => s.items).find(i => i.id === tab)?.label || 'نظرة عامة';
  const isCollapsed = sidebarCollapsed && !sidebarOpen;
  const sidebarWidth = sidebarOpen ? 'w-64' : sidebarCollapsed ? 'w-0 lg:w-[56px]' : 'w-0';

  return (
    <div className="min-h-screen admin-bg text-slate-100 flex" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`${sidebarWidth} admin-sidebar border-l border-white/[0.06] flex flex-col transition-all duration-300 flex-shrink-0 sticky top-0 h-screen overflow-hidden z-40 ${sidebarOpen ? 'fixed lg:relative' : 'relative'}`}>
        {/* Sidebar Header */}
        <div className={`p-3 border-b border-white/[0.06] flex items-center ${sidebarOpen || !sidebarCollapsed ? 'gap-3' : 'justify-center'}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          {(sidebarOpen || (!sidebarCollapsed && window.innerWidth >= 1024)) && (
            <div className="min-w-0">
              <span className="text-sm font-bold text-white whitespace-nowrap block">SwiftTrack</span>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
          {SIDEBAR_SECTIONS.map((section, si) => (
            <div key={si} className="mb-4">
              {sidebarOpen && (
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest px-4 mb-2">{section.title}</p>
              )}
              <div className="space-y-0.5 px-2">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setTab(item.id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-2.5 rounded-xl transition-all ${
                        sidebarOpen ? 'px-3 py-2.5' : 'justify-center py-2.5 px-0'
                      } ${
                        active
                          ? 'bg-blue-500/15 text-blue-400 shadow-sm shadow-blue-500/10'
                          : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <span className="flex-shrink-0 relative">
                        <Icon size={18} />
                        {(item as any).badge && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse ring-2 ring-slate-900" />
                        )}
                      </span>
                      {sidebarOpen && (
                        <span className="text-xs font-medium truncate whitespace-nowrap flex-1 text-right">{item.label}</span>
                      )}
                      {sidebarOpen && active && (
                        <ChevronRight size={12} className="text-blue-400/50 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          {sidebarOpen && (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03]">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'}`} />
              <span className="text-[10px] text-slate-500 whitespace-nowrap flex-1">{backendOnline ? 'Backend متصل' : 'وضع محلي'}</span>
            </div>
          )}
          <button
            onClick={() => { if (window.innerWidth >= 1024) { setSidebarCollapsed(!sidebarCollapsed); } else { setSidebarOpen(false); } }}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors"
          >
            {sidebarOpen || !sidebarCollapsed ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="admin-header border-b border-white/[0.06] px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex-shrink-0 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">{currentLabel}</h2>
              <p className="text-[10px] text-slate-500 truncate">
                {currentTime.toLocaleDateString('ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                <span className="mx-1.5 opacity-30">•</span>
                {currentTime.toLocaleTimeString('ar')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {running && (
              <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-full">
                <Loader2 size={10} className="animate-spin" />
                <span className="hidden sm:inline">جاري التشغيل...</span>
              </span>
            )}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-btn-ghost flex items-center gap-1.5"
            >
              <ExternalLink size={12} />
              <span className="hidden sm:inline">الموقع</span>
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto" dir="ltr">
          <div className="max-w-7xl mx-auto">
            {tab === "overview" && <OverviewTab stats={stats} sitemaps={sitemaps} />}
            {tab === "tools" && <ToolsTab scripts={scripts} onRun={runScript} running={running} />}
            {tab === "terminal" && <TerminalTab lines={termLines} running={running} onClear={() => setTermLines([])} />}
            {tab === "visitors" && <VisitorAnalyticsTab />}
            {tab === "apikeys" && <ApiKeysTab />}
            {tab === "ads" && <AdsManagerTab />}
            {tab === "settings" && <SiteSettingsTab />}
            {tab === "seo" && <SeoAuditTab />}
            {tab === "keywords" && <KeywordsTab />}
            {tab === "git" && <GitTab onRun={runScript} />}
            {tab === "robots" && <RobotsTab />}
            {tab === "content" && <ContentManagementTab />}
            {tab === "performance" && <PerformanceTab />}
            {tab === "database" && <DatabaseTab />}
            {tab === "logs" && <ActivityLogsTab />}
            {/* API Manager Tabs */}
            <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue-400" size={24} /></div>}>
              {tab === "api-overview" && <ApiOverviewTab />}
              {tab === "api-providers" && <ApiProvidersTab />}
              {tab === "api-cache" && <CacheManagementTab />}
              {tab === "api-scrapers" && <ScraperManagementTab />}
              {tab === "api-carriers" && <CarrierDetectionTab />}
              {tab === "api-ratelimit" && <RateLimitingTab />}
              {tab === "api-logs" && <ApiLogsTab />}
              {tab === "api-settings" && <ApiSystemSettingsTab />}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import { Shield, Save, CheckCircle, Loader2, AlertTriangle, Eye, FileText } from "lucide-react";

const TEMPLATES: { name: string; label: string; content: string }[] = [
  {
    name: "standard",
    label: "قياسي (موصى به)",
    content: `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: https://uspostaltracking.com/sitemap.xml`,
  },
  {
    name: "block-all",
    label: "حظر جميع الزواحف",
    content: `User-agent: *
Disallow: /`,
  },
  {
    name: "allow-all",
    label: "السماح بالكل",
    content: `User-agent: *
Allow: /

Sitemap: https://uspostaltracking.com/sitemap.xml`,
  },
];

function getValidationWarnings(content: string): string[] {
  const warnings: string[] = [];
  const lines = content.split("\n").map(l => l.trim().toLowerCase());

  const blocksApi = lines.some(l => l.startsWith("disallow:") && l.includes("/api"));
  if (blocksApi) {
    warnings.push("⚠️ يتم حظر مسار /api/ — تأكد أن هذا مقصود");
  }

  const hasSitemap = lines.some(l => l.startsWith("sitemap:"));
  if (!hasSitemap) {
    warnings.push("⚠️ لا يوجد توجيه Sitemap — يُنصح بإضافته لتحسين SEO");
  }

  return warnings;
}

function parseRules(content: string): { allowed: string[]; blocked: string[] } {
  const allowed: string[] = [];
  const blocked: string[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith("allow:")) {
      const path = trimmed.slice(6).trim();
      if (path) allowed.push(path);
    } else if (trimmed.toLowerCase().startsWith("disallow:")) {
      const path = trimmed.slice(9).trim();
      if (path) blocked.push(path);
    }
  }

  return { allowed, blocked };
}

function HighlightedPreview({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        let className = "text-slate-400";

        if (trimmed.startsWith("#")) {
          className = "text-slate-500 italic";
        } else if (/^user-agent:/i.test(trimmed)) {
          className = "text-blue-400 font-semibold";
        } else if (/^disallow:/i.test(trimmed)) {
          className = "text-red-400";
        } else if (/^allow:/i.test(trimmed)) {
          className = "text-green-400";
        } else if (/^sitemap:/i.test(trimmed)) {
          className = "text-purple-400";
        }

        return <div key={i} className={className}>{line || "\u00A0"}</div>;
      })}
    </div>
  );
}

export default function RobotsTab() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch('/api/robots').then(r => r.ok ? r.json() : Promise.reject()).then(d => setContent(d.content || '')).catch(() => {
      fetch('/robots.txt').then(r => r.text()).then(setContent).catch(() => setContent('User-agent: *\nAllow: /\nSitemap: https://uspostaltracking.com/sitemap.xml'));
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/robots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
      if (!res.ok) throw new Error();
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch {
      localStorage.setItem('uspostaltracking_robots', content);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const warnings = useMemo(() => getValidationWarnings(content), [content]);
  const rules = useMemo(() => parseRules(content), [content]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Shield size={18} className="text-slate-400" />robots.txt</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all">
            <Eye size={14} />{showPreview ? "إخفاء المعاينة" : "معاينة"}
          </button>
          <button onClick={save} disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? "تم الحفظ!" : "حفظ"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center">قوالب جاهزة:</span>
        {TEMPLATES.map(t => (
          <button key={t.name} onClick={() => setContent(t.content)}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5">
            <FileText size={10} />{t.label}
          </button>
        ))}
      </div>

      {warnings.length > 0 && (
        <div className="space-y-1.5">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-800/30 rounded-lg px-3 py-2">
              <AlertTriangle size={12} className="shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      <div className={`grid gap-3 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        <div className="relative">
          <textarea value={content} onChange={e => setContent(e.target.value)}
            className="w-full bg-black border border-slate-700 rounded-xl p-4 font-mono text-sm text-green-400 h-[350px] sm:h-[400px] focus:outline-none focus:border-blue-500 resize-none"
            dir="ltr" spellCheck={false} />
        </div>

        {showPreview && (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 h-[250px] sm:h-[280px] overflow-y-auto">
              <p className="text-xs text-slate-500 mb-2 font-semibold">معاينة مع تلوين:</p>
              <HighlightedPreview content={content} />
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2 font-semibold">ملخص القواعد:</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-green-400 font-semibold mb-1">✅ مسموح ({rules.allowed.length})</p>
                  {rules.allowed.length === 0 ? (
                    <p className="text-[10px] text-slate-600">لا توجد قواعد سماح صريحة</p>
                  ) : (
                    rules.allowed.map((p, i) => (
                      <div key={i} className="text-[11px] font-mono text-green-300 bg-green-900/20 rounded px-2 py-0.5 mb-0.5">{p}</div>
                    ))
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-red-400 font-semibold mb-1">🚫 محظور ({rules.blocked.length})</p>
                  {rules.blocked.length === 0 ? (
                    <p className="text-[10px] text-slate-600">لا توجد قواعد حظر</p>
                  ) : (
                    rules.blocked.map((p, i) => (
                      <div key={i} className="text-[11px] font-mono text-red-300 bg-red-900/20 rounded px-2 py-0.5 mb-0.5">{p}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

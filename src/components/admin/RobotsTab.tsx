import React, { useState, useEffect } from "react";
import { Shield, Save, CheckCircle, Loader2 } from "lucide-react";

export default function RobotsTab() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Shield size={18} className="text-slate-400" />robots.txt</h2>
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? "تم الحفظ!" : "حفظ"}
        </button>
      </div>
      <textarea value={content} onChange={e => setContent(e.target.value)}
        className="w-full bg-black border border-slate-700 rounded-xl p-4 font-mono text-sm text-green-400 h-[350px] sm:h-[400px] focus:outline-none focus:border-blue-500 resize-none" />
    </div>
  );
}

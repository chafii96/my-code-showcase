import React, { useState, useEffect } from "react";
import {
  Key, Save, CheckCircle, Loader2, Lock, Unlock, Copy, ExternalLink, Info,
} from "lucide-react";

export default function ApiKeysTab() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [localKeys, setLocalKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/config').then(r => r.ok ? r.json() : Promise.reject()).then(d => {
      setConfig(d);
      setLocalKeys(d.apiKeys || {});
    }).catch(() => {
      const saved = localStorage.getItem('swifttrack_api_keys');
      const keys = saved ? JSON.parse(saved) : {};
      setConfig({ apiKeys: keys });
      setLocalKeys(keys);
    });
  }, []);

  const saveKeys = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKeys: localKeys }) });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else throw new Error();
    } catch {
      localStorage.setItem('swifttrack_api_keys', JSON.stringify(localKeys));
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const API_GROUPS = [
    {
      title: "USPS Web Tools API", icon: "📦", color: "border-indigo-700/50",
      keys: [
        { key: "uspsUserId", label: "USPS Web Tools USERID", placeholder: "XXXXXXXXXXXXXXXXX", help: "من USPS Web Tools Registration — يُستخدم للتحقق في طلبات API", link: "https://www.usps.com/business/web-tools-apis/welcome.htm" },
        { key: "uspsPassword", label: "USPS Web Tools Password", placeholder: "XXXXXXXXXXXXXXXX", help: "كلمة مرور Web Tools — تُرسل مع كل طلب API", link: "https://www.usps.com/business/web-tools-apis/welcome.htm" },
      ]
    },
    {
      title: "Google Services", icon: "🔍", color: "border-blue-700/50",
      keys: [
        { key: "googleSearchConsole", label: "Google Search Console", placeholder: "sc-domain:example.com أو URL Prefix", help: "من GSC → Settings → Ownership verification", link: "https://search.google.com/search-console" },
        { key: "googleAnalytics4", label: "Google Analytics 4 (Measurement ID)", placeholder: "G-XXXXXXXXXX", help: "من GA4 → Admin → Data Streams → Measurement ID", link: "https://analytics.google.com" },
        { key: "googleAdsense", label: "Google AdSense Publisher ID", placeholder: "pub-XXXXXXXXXXXXXXXX", help: "من AdSense → Account → Account information", link: "https://www.google.com/adsense" },
        { key: "googleIndexingApi", label: "Google Indexing API Key", placeholder: "AIzaSy...", help: "من Google Cloud Console → APIs → Indexing API", link: "https://console.cloud.google.com" },
      ]
    },
    {
      title: "SEO Tools", icon: "📊", color: "border-green-700/50",
      keys: [
        { key: "bingWebmaster", label: "Bing Webmaster API Key", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", help: "من Bing Webmaster Tools → Settings → API access", link: "https://www.bing.com/webmasters" },
        { key: "semrushApiKey", label: "SEMrush API Key", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", help: "من SEMrush → Profile → API", link: "https://www.semrush.com" },
        { key: "ahrefsApiKey", label: "Ahrefs API Key", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", help: "من Ahrefs → API → Generate Key", link: "https://ahrefs.com" },
        { key: "indexNowKey", label: "IndexNow API Key", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", help: "مفتاح فريد تنشئه أنت وتضعه في /[key].txt", link: "https://www.indexnow.org" },
      ]
    },
    {
      title: "AI & Automation", icon: "🤖", color: "border-purple-700/50",
      keys: [
        { key: "openaiApiKey", label: "OpenAI API Key", placeholder: "sk-proj-...", help: "من platform.openai.com → API Keys", link: "https://platform.openai.com/api-keys" },
      ]
    },
    {
      title: "Infrastructure", icon: "☁️", color: "border-orange-700/50",
      keys: [
        { key: "cloudflareApiKey", label: "Cloudflare API Token", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", help: "من Cloudflare → Profile → API Tokens → Create Token", link: "https://dash.cloudflare.com/profile/api-tokens" },
        { key: "cloudflareZoneId", label: "Cloudflare Zone ID", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", help: "من Cloudflare → موقعك → Overview → Zone ID", link: "https://dash.cloudflare.com" },
      ]
    },
    {
      title: "Security", icon: "🛡️", color: "border-red-700/50",
      keys: [
        { key: "recaptchaSiteKey", label: "reCAPTCHA Site Key", placeholder: "6Lc...", help: "من Google reCAPTCHA Admin Console", link: "https://www.google.com/recaptcha/admin" },
        { key: "recaptchaSecretKey", label: "reCAPTCHA Secret Key", placeholder: "6Lc...", help: "من Google reCAPTCHA Admin Console", link: "https://www.google.com/recaptcha/admin" },
      ]
    },
    {
      title: "Notifications", icon: "🔔", color: "border-yellow-700/50",
      keys: [
        { key: "slackWebhook", label: "Slack Webhook URL", placeholder: "https://hooks.slack.com/services/...", help: "من Slack → Apps → Incoming Webhooks", link: "https://api.slack.com/messaging/webhooks" },
        { key: "discordWebhook", label: "Discord Webhook URL", placeholder: "https://discord.com/api/webhooks/...", help: "من Discord → Server Settings → Integrations → Webhooks", link: "https://discord.com" },
        { key: "telegramBotToken", label: "Telegram Bot Token", placeholder: "1234567890:AAF...", help: "من @BotFather على Telegram", link: "https://t.me/BotFather" },
        { key: "telegramChatId", label: "Telegram Chat ID", placeholder: "-1001234567890", help: "من @userinfobot أو @getidsbot", link: "https://t.me/userinfobot" },
      ]
    },
  ];

  if (!config) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Key size={18} className="text-yellow-400" /> إدارة مفاتيح API</h2>
          <p className="text-xs text-slate-400 mt-1">تُحفظ المفاتيح محلياً في <code className="bg-slate-700 px-1 rounded">seo-data/config.json</code></p>
        </div>
        <button onClick={saveKeys} disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all self-start ${
            saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? "تم الحفظ!" : saving ? "جاري الحفظ..." : "حفظ الكل"}
        </button>
      </div>

      {API_GROUPS.map((group, gi) => (
        <div key={gi} className={`bg-slate-800/80 border rounded-xl p-4 ${group.color}`}>
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span className="text-lg">{group.icon}</span>{group.title}
          </h3>
          <div className="space-y-4">
            {group.keys.map((k, ki) => (
              <div key={ki}>
                <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                  <label className="text-xs font-medium text-slate-300">{k.label}</label>
                  <div className="flex items-center gap-2">
                    {localKeys[k.key] && (
                      <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={10} />مُضبوط</span>
                    )}
                    <a href={k.link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <ExternalLink size={10} />فتح
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={visible[k.key] ? "text" : "password"}
                      value={localKeys[k.key] || ""}
                      onChange={e => setLocalKeys(prev => ({ ...prev, [k.key]: e.target.value }))}
                      placeholder={k.placeholder}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 pr-10"
                    />
                    <button onClick={() => setVisible(v => ({ ...v, [k.key]: !v[k.key] }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {visible[k.key] ? <Unlock size={14} /> : <Lock size={14} />}
                    </button>
                  </div>
                  {localKeys[k.key] && (
                    <button onClick={() => navigator.clipboard.writeText(localKeys[k.key])}
                      className="px-2 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0">
                      <Copy size={14} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Info size={10} />{k.help}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

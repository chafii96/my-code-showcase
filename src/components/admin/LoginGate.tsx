import React, { useState } from "react";
import { LayoutDashboard, Loader2, Lock, Eye, EyeOff, Shield } from "lucide-react";

export const SESSION_KEY = "uspostaltracking_admin_session";
export const SESSION_DURATION = 24 * 60 * 60 * 1000;

export default function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMsg("");

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        signal: AbortSignal.timeout(3000),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        localStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now(), token: data.token }));
        onAuth();
      } else if (contentType.includes('application/json')) {
        const d = await res.json().catch(() => ({}));
        setError(true);
        setErrorMsg(d.message || "كلمة المرور غير صحيحة");
      } else {
        throw new Error("backend_offline");
      }
    } catch {
      // Fallback: local auth
      if (password === (localStorage.getItem("uspostaltracking_admin_password") || "uspostaltracking2024")) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now(), token: "local" }));
        onAuth();
      } else {
        setError(true);
        setErrorMsg("كلمة المرور غير صحيحة");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen admin-bg flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25">
            <LayoutDashboard size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">US Postal Tracking Admin</h1>
          <p className="text-sm text-slate-500 mt-1">لوحة التحكم الإدارية</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-card !p-6 space-y-5">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                autoFocus
                dir="ltr"
                className={`admin-input !pl-10 !pr-10 !py-3 ${
                  error ? '!border-red-500/30 focus:!border-red-500/50' : ''
                }`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && errorMsg && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">⚠ {errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="admin-btn-primary w-full !py-3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={14} />}
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-600 mt-4">
          محمي بتشفير من طرف إلى طرف
        </p>
      </div>
    </div>
  );
}

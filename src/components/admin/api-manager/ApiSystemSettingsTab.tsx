import { useState } from "react";
import { Bell, Globe, Wrench } from "lucide-react";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

interface ApiSettings {
  siteName: string;
  adminEmail: string;
  timezone: string;
  language: string;
  notifications: {
    providerExhausted: boolean;
    allProvidersFail: boolean;
    cacheHitRateBelow: boolean;
    cacheHitRateThreshold: number;
    errorRateExceeds: boolean;
    errorRateThreshold: number;
    dailySummary: boolean;
  };
  maintenanceMode: boolean;
}

const defaultSettings: ApiSettings = {
  siteName: 'US Postal Tracking',
  adminEmail: 'admin@uspostaltracking.com',
  timezone: 'UTC',
  language: 'en',
  notifications: {
    providerExhausted: true, allProvidersFail: true,
    cacheHitRateBelow: true, cacheHitRateThreshold: 50,
    errorRateExceeds: true, errorRateThreshold: 10,
    dailySummary: true,
  },
  maintenanceMode: false,
};

export default function ApiSystemSettingsTab() {
  const { data: settings, setData: setSettings, isLive } = useApiData<ApiSettings>('/api-settings', defaultSettings);

  const updateGeneral = (key: string, val: string) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const updateNotification = (key: string, val: any) => {
    setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, [key]: val } }));
  };

  const toggleMaintenance = () => {
    setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
    toast({ title: settings.maintenanceMode ? "Maintenance mode OFF" : "Maintenance mode ON", variant: settings.maintenanceMode ? "default" : "destructive" });
  };

  const saveAll = async () => {
    const result = await apiCall('/api-settings', 'POST', settings);
    toast({ title: result.ok ? "All settings saved" : "Failed (backend offline)" });
  };

  const notifs = settings.notifications || defaultSettings.notifications;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-white">System Settings</h2>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
          {isLive ? '● Live' : '○ Offline'}
        </span>
      </div>

      {/* General */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-white">General</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['siteName', 'adminEmail', 'timezone', 'language'].map(key => (
            <div key={key} className="space-y-1">
              <label className="text-[11px] text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input value={(settings as any)[key] || ''} onChange={e => updateGeneral(key, e.target.value)}
                className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Email Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'providerExhausted', label: 'Alert when provider exhausted' },
            { key: 'allProvidersFail', label: 'Alert when all providers fail' },
            { key: 'dailySummary', label: 'Daily summary report' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={!!(notifs as any)[item.key]}
                  onChange={e => updateNotification(item.key, e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 rounded-full bg-slate-700 peer-checked:bg-blue-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-xs text-slate-300">{item.label}</span>
            </label>
          ))}

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={notifs.cacheHitRateBelow}
                  onChange={e => updateNotification('cacheHitRateBelow', e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 rounded-full bg-slate-700 peer-checked:bg-blue-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-xs text-slate-300">Cache hit rate drops below</span>
            </label>
            <input type="number" value={notifs.cacheHitRateThreshold}
              onChange={e => updateNotification('cacheHitRateThreshold', +e.target.value)}
              className="w-16 bg-slate-800 border border-white/[0.08] rounded px-2 py-1 text-xs text-white text-center" />
            <span className="text-xs text-slate-500">%</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={notifs.errorRateExceeds}
                  onChange={e => updateNotification('errorRateExceeds', e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 rounded-full bg-slate-700 peer-checked:bg-blue-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-xs text-slate-300">Error rate exceeds</span>
            </label>
            <input type="number" value={notifs.errorRateThreshold}
              onChange={e => updateNotification('errorRateThreshold', +e.target.value)}
              className="w-16 bg-slate-800 border border-white/[0.08] rounded px-2 py-1 text-xs text-white text-center" />
            <span className="text-xs text-slate-500">%</span>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-red-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Maintenance Mode</h3>
              <p className="text-[10px] text-slate-500">Returns friendly message to users while maintaining</p>
            </div>
          </div>
          <button onClick={toggleMaintenance}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${settings.maintenanceMode ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-700 text-slate-400 border border-white/[0.08]'}`}>
            {settings.maintenanceMode ? '🔴 Maintenance ON' : '🟢 Maintenance OFF'}
          </button>
        </div>
      </div>

      <button onClick={saveAll} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
        Save All Settings
      </button>
    </div>
  );
}

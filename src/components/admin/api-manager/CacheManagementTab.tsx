import { useState } from "react";
import { Database, Download, RefreshCw, Search, Trash2, Zap } from "lucide-react";
import { mockCacheStats, mockCacheTTL, mockCacheEntries } from "./mockData";
import { CacheTTLSettings } from "./types";
import { toast } from "@/hooks/use-toast";

export default function CacheManagementTab() {
  const [stats] = useState(mockCacheStats);
  const [ttl, setTtl] = useState<CacheTTLSettings>(mockCacheTTL);
  const [entries] = useState(mockCacheEntries);
  const [searchQuery, setSearchQuery] = useState('');

  const statCards = [
    { label: 'Total Cached', value: stats.totalEntries.toLocaleString(), icon: Database, color: 'text-blue-400' },
    { label: 'Hit Rate Today', value: `${stats.hitRateToday}%`, icon: Zap, color: 'text-emerald-400' },
    { label: 'Memory Used', value: `${stats.memoryUsedMB} MB`, icon: Database, color: 'text-purple-400' },
    { label: 'API Calls Saved', value: stats.apiCallsSaved.toLocaleString(), icon: RefreshCw, color: 'text-amber-400' },
    { label: 'Money Saved', value: `$${stats.moneySaved.toFixed(2)}`, icon: Zap, color: 'text-rose-400' },
  ];

  const ttlFields: { key: keyof CacheTTLSettings; label: string; unit: string }[] = [
    { key: 'delivered', label: 'Delivered', unit: 'min' },
    { key: 'inTransit', label: 'In Transit', unit: 'min' },
    { key: 'outForDelivery', label: 'Out for Delivery', unit: 'min' },
    { key: 'pending', label: 'Pending', unit: 'min' },
    { key: 'exception', label: 'Exception', unit: 'min' },
    { key: 'preShipment', label: 'Pre-Shipment', unit: 'min' },
    { key: 'unknown', label: 'Unknown', unit: 'min' },
    { key: 'notFound', label: 'Not Found (Negative)', unit: 'min' },
  ];

  const statusColor = (s: string) => {
    const map: Record<string, string> = { 'Delivered': 'text-emerald-400', 'In Transit': 'text-blue-400', 'Out for Delivery': 'text-amber-400', 'Pending': 'text-slate-400', 'Exception': 'text-red-400' };
    return map[s] || 'text-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map(c => (
          <div key={c.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <c.icon size={16} className={`${c.color} mb-2`} />
            <p className="text-[10px] text-slate-500 uppercase">{c.label}</p>
            <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* TTL Settings */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Cache TTL Settings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ttlFields.map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-[11px] text-slate-400">{f.label}</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={ttl[f.key]}
                  onChange={e => setTtl(prev => ({ ...prev, [f.key]: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-500 w-8">{f.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => toast({ title: "TTL settings saved" })}
          className="mt-4 px-4 py-2 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
        >
          Save TTL Settings
        </button>
      </div>

      {/* Cache Actions */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Cache Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => toast({ title: "Cache flushed", variant: "destructive" })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
            <Trash2 size={12} /> Flush All Cache
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Tracking number..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-white/[0.08] rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
              />
            </div>
            <button className="px-3 py-2 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
              Flush by #
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition-colors">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Cache Entries Table */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Cache Entries</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-white/[0.06]">
                <th className="text-left py-2 px-2">Tracking #</th>
                <th className="text-left py-2 px-2">Carrier</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-left py-2 px-2">Cached At</th>
                <th className="text-left py-2 px-2">Expires At</th>
                <th className="text-left py-2 px-2">Hits</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2 px-2 font-mono text-slate-300">{entry.trackingNumberHash}</td>
                  <td className="py-2 px-2 text-slate-300">{entry.carrier}</td>
                  <td className={`py-2 px-2 font-medium ${statusColor(entry.status)}`}>{entry.status}</td>
                  <td className="py-2 px-2 text-slate-400">{new Date(entry.cachedAt).toLocaleString()}</td>
                  <td className="py-2 px-2 text-slate-400">{new Date(entry.expiresAt).toLocaleString()}</td>
                  <td className="py-2 px-2 text-blue-400 font-semibold">{entry.hitCount}</td>
                  <td className="py-2 px-2">
                    <div className="flex gap-1">
                      <button className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                      <button className="p-1 rounded text-slate-500 hover:text-blue-400 transition-colors"><RefreshCw size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

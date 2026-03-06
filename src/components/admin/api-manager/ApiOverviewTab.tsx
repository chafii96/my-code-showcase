import { useState } from "react";
import { Activity, Database, DollarSign, Gauge, Server, TrendingUp, Zap, RefreshCw } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mockSystemStats, mockHourlyData, mockProviderUsage, mockProviders, mockTrackingLogs } from "./mockData";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ApiOverviewTab() {
  const [stats] = useState(mockSystemStats);
  const [hourlyData] = useState(mockHourlyData);
  const [providerUsage] = useState(mockProviderUsage);

  const statCards = [
    { label: 'Total Requests Today', value: stats.totalRequestsToday.toLocaleString(), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Cache Hit Rate', value: `${stats.cacheHitRate}%`, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Active Provider', value: stats.activeProvider, icon: Server, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'API Calls Saved', value: stats.apiCallsSaved.toLocaleString(), icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Est. Cost This Month', value: `$${stats.estimatedCost}`, icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Success Rate', value: `${stats.successRate}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  ];

  const recentLogs = mockTrackingLogs.slice(0, 15);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-xl border p-4 ${card.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={16} className={card.color} />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{card.label}</span>
            </div>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Requests per hour */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Requests per Hour (24h)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Provider Usage Pie */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Provider Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={providerUsage} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" nameKey="name" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {providerUsage.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cache vs API */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Cache Hits vs API Calls</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="cacheHits" fill="#8b5cf6" name="Cache Hits" radius={[4, 4, 0, 0]} />
              <Bar dataKey="apiCalls" fill="#f59e0b" name="API Calls" radius={[4, 4, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Success Rate */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Success Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={hourlyData.map((h, i) => ({ ...h, successRate: 90 + Math.random() * 10 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} />
              <YAxis domain={[85, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="successRate" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Live Activity Feed</h3>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-white/[0.06]">
                <th className="text-left py-2 px-2">Time</th>
                <th className="text-left py-2 px-2">Tracking #</th>
                <th className="text-left py-2 px-2">Carrier</th>
                <th className="text-left py-2 px-2">Provider</th>
                <th className="text-left py-2 px-2">Cache</th>
                <th className="text-left py-2 px-2">Time (ms)</th>
                <th className="text-left py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map(log => (
                <tr key={log.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2 px-2 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2 px-2 font-mono text-slate-300">{log.trackingNumberHash}</td>
                  <td className="py-2 px-2 text-slate-300">{log.carrier}</td>
                  <td className="py-2 px-2 text-slate-300">{log.providerUsed}</td>
                  <td className="py-2 px-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${log.cacheHit ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {log.cacheHit ? 'HIT' : 'MISS'}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-slate-300">{log.responseTimeMs}</td>
                  <td className="py-2 px-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {log.status}
                    </span>
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

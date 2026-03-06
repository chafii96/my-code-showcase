import { useState, useCallback } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, GripVertical, Play, Plus, RotateCcw, Trash2, Power } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mockProviders } from "./mockData";
import { ApiProvider, ApiAccount } from "./types";
import { useApiData, apiCall } from "./useApiData";
import { toast } from "@/hooks/use-toast";

function QuotaBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  const color = pct < 50 ? 'bg-emerald-500' : pct < 80 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
        <span>{used.toLocaleString()} / {total.toLocaleString()}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ApiAccount['status'] }) {
  const styles = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    exhausted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    disabled: 'bg-slate-500/20 text-slate-500 border-slate-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles[status]}`}>
      {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function AccountRow({ account, onToggle, onDelete, onTest }: {
  account: ApiAccount;
  onToggle: () => void;
  onDelete: () => void;
  onTest: () => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const successRate = account.successCount + account.errorCount > 0
    ? ((account.successCount / (account.successCount + account.errorCount)) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="border border-white/[0.04] rounded-lg p-4 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{account.name}</span>
            <StatusBadge status={account.status} />
          </div>
          <div className="flex items-center gap-2">
            <code className="text-[11px] bg-slate-800 px-2 py-1 rounded font-mono text-slate-400 flex-1 truncate">
              {showKey ? account.apiKey : '••••••••••••••••'}
            </code>
            <button onClick={() => setShowKey(!showKey)} className="text-slate-500 hover:text-white transition-colors">
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="w-full lg:w-48">
          <QuotaBar used={account.usedToday} total={account.dailyQuota} />
        </div>

        <div className="flex gap-4 text-[11px]">
          <div className="text-center">
            <p className="text-slate-500">Success</p>
            <p className="text-emerald-400 font-semibold">{successRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">Avg Time</p>
            <p className="text-blue-400 font-semibold">{account.avgResponseTime}ms</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">Last Used</p>
            <p className="text-slate-300">{account.lastUsed ? new Date(account.lastUsed).toLocaleTimeString() : '—'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onTest} className="px-2.5 py-1.5 text-[10px] font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
            <Play size={10} className="inline mr-1" />Test
          </button>
          <button onClick={onToggle}
            className={`p-1.5 rounded-lg transition-colors ${account.enabled ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20'}`}>
            <Power size={14} />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Sortable Provider Card
function SortableProviderCard({
  provider,
  expanded,
  onToggleExpand,
  onToggleProvider,
  onToggleAccount,
  onDeleteAccount,
  onTestAccount,
}: {
  provider: ApiProvider;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleProvider: () => void;
  onToggleAccount: (accountId: string) => void;
  onDeleteAccount: (accountId: string) => void;
  onTestAccount: (account: ApiAccount) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: provider.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto' as any,
  };

  const activeAccounts = provider.accounts.filter(a => a.enabled).length;
  const totalQuota = provider.accounts.reduce((sum, a) => sum + a.dailyQuota, 0);
  const usedQuota = provider.accounts.reduce((sum, a) => sum + a.usedToday, 0);

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={onToggleExpand}>
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 touch-none" onClick={e => e.stopPropagation()}>
          <GripVertical size={14} />
        </div>

        <span className="text-lg">{provider.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{provider.name}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white" style={{ background: provider.color }}>
              #{provider.priority}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            {activeAccounts}/{provider.accounts.length} accounts active · {usedQuota.toLocaleString()}/{totalQuota.toLocaleString()} quota used
          </p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleProvider(); }}
          className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-colors ${provider.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-500'}`}
        >
          {provider.enabled ? 'Enabled' : 'Disabled'}
        </button>
        {expanded ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-white/[0.04] pt-3">
          {provider.accounts.map(account => (
            <AccountRow
              key={account.id}
              account={account}
              onToggle={() => onToggleAccount(account.id)}
              onDelete={() => onDeleteAccount(account.id)}
              onTest={() => onTestAccount(account)}
            />
          ))}
          <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-dashed border-white/10 text-xs text-slate-500 hover:text-white hover:border-white/20 transition-colors">
            <Plus size={14} /> Add New Account
          </button>
        </div>
      )}
    </div>
  );
}

export default function ApiProvidersTab() {
  const { data: providers, setData: setProviders, isLive } = useApiData<ApiProvider[]>(
    '/providers', mockProviders, { pollingInterval: 30000 }
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ ship24: true });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProviders(prev => {
      const oldIndex = prev.findIndex(p => p.id === active.id);
      const newIndex = prev.findIndex(p => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const reordered = arrayMove(prev, oldIndex, newIndex).map((p, i) => ({
        ...p,
        priority: i + 1,
      }));

      // Persist to backend
      reordered.forEach(p => {
        apiCall(`/providers/${p.id}`, 'PUT', { priority: p.priority });
      });

      toast({ title: "Provider priority updated" });
      return reordered;
    });
  }, [setProviders]);

  const toggleProvider = (id: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, enabled: !p.enabled };
      apiCall(`/providers/${id}`, 'PUT', { enabled: updated.enabled });
      return updated;
    }));
    toast({ title: "Provider updated" });
  };

  const toggleAccount = (providerId: string, accountId: string) => {
    setProviders(prev => prev.map(p => p.id === providerId ? {
      ...p, accounts: p.accounts.map(a => {
        if (a.id !== accountId) return a;
        const updated = { ...a, enabled: !a.enabled, status: (a.enabled ? 'disabled' : 'active') as ApiAccount['status'] };
        apiCall(`/accounts/${accountId}`, 'PUT', { enabled: updated.enabled, status: updated.status });
        return updated;
      })
    } : p));
  };

  const deleteAccount = (providerId: string, accountId: string) => {
    setProviders(prev => prev.map(p => p.id === providerId ? {
      ...p, accounts: p.accounts.filter(a => a.id !== accountId)
    } : p));
    apiCall(`/accounts/${accountId}`, 'DELETE');
    toast({ title: "Account deleted" });
  };

  const testAccount = async (account: ApiAccount) => {
    toast({ title: `Testing ${account.name}...`, description: "Sending test tracking request" });
    const result = await apiCall(`/accounts/${account.id}/test`, 'POST');
    if (result.ok) {
      toast({ title: `✅ ${account.name} — ${result.data?.responseTime}ms` });
    } else {
      toast({ title: `❌ Test failed`, description: result.error, variant: "destructive" });
    }
  };

  const forceRotate = async () => {
    const result = await apiCall('/providers/force-rotate', 'POST');
    toast({ title: result.ok ? "Rotated to next account" : "Rotation failed" });
  };

  const sortedProviders = [...providers].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">API Providers</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
            {isLive ? '● Live' : '○ Offline'}
          </span>
        </div>
        <button onClick={forceRotate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
          <RotateCcw size={12} /> Force Rotate
        </button>
      </div>

      <p className="text-[11px] text-slate-500">↕ Drag providers to reorder priority. Changes are saved automatically.</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedProviders.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sortedProviders.map(provider => (
              <SortableProviderCard
                key={provider.id}
                provider={provider}
                expanded={!!expanded[provider.id]}
                onToggleExpand={() => setExpanded(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                onToggleProvider={() => toggleProvider(provider.id)}
                onToggleAccount={(accountId) => toggleAccount(provider.id, accountId)}
                onDeleteAccount={(accountId) => deleteAccount(provider.id, accountId)}
                onTestAccount={testAccount}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

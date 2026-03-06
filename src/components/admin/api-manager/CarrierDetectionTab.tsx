import { useState } from "react";
import { Edit, Plus, Search, Trash2, Upload } from "lucide-react";
import { mockCarrierPatterns } from "./mockData";
import { CarrierPattern } from "./types";
import { toast } from "@/hooks/use-toast";

export default function CarrierDetectionTab() {
  const [patterns, setPatterns] = useState<CarrierPattern[]>(mockCarrierPatterns);
  const [testInput, setTestInput] = useState('');
  const [detectedCarrier, setDetectedCarrier] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const testDetection = () => {
    if (!testInput.trim()) return;
    for (const p of patterns.sort((a, b) => a.priority - b.priority)) {
      try {
        if (new RegExp(p.pattern).test(testInput)) {
          setDetectedCarrier(p.carrier);
          return;
        }
      } catch {}
    }
    setDetectedCarrier('Unknown');
  };

  const deletePattern = (id: string) => {
    setPatterns(prev => prev.filter(p => p.id !== id));
    toast({ title: "Pattern deleted" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Carrier Detection Rules</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition-colors">
            <Upload size={12} /> Import JSON
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
            <Plus size={12} /> Add Pattern
          </button>
        </div>
      </div>

      {/* Test Detection */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Test Carrier Detection</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={testInput}
              onChange={e => setTestInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && testDetection()}
              placeholder="Enter tracking number to test..."
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button onClick={testDetection} className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            Detect
          </button>
        </div>
        {detectedCarrier && (
          <div className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium ${detectedCarrier !== 'Unknown' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            Detected: <span className="font-bold">{detectedCarrier}</span>
          </div>
        )}
      </div>

      {/* Patterns Table */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left py-3 px-4">Priority</th>
              <th className="text-left py-3 px-4">Carrier</th>
              <th className="text-left py-3 px-4">Pattern (Regex)</th>
              <th className="text-left py-3 px-4">Example</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patterns.sort((a, b) => a.priority - b.priority).map(p => (
              <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">#{p.priority}</span>
                </td>
                <td className="py-3 px-4 font-semibold text-white">{p.carrier}</td>
                <td className="py-3 px-4">
                  <code className="bg-slate-800 px-2 py-1 rounded text-[11px] font-mono text-amber-400">{p.pattern}</code>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">{p.example}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded text-slate-500 hover:text-blue-400 transition-colors"><Edit size={12} /></button>
                    <button onClick={() => deletePattern(p.id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

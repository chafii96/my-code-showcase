import React, { useState, useMemo } from "react";
import {
  Search, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Minus,
  Download, RefreshCw, Loader2, ExternalLink, Filter, BarChart2,
  Eye, MousePointer, Target, Hash, Globe, Info, Star, Plus, Trash2, X,
} from "lucide-react";
import { StatCard, EmptyState } from "./shared";
import { useApiData, apiCall } from "./api-manager/useApiData";

interface KeywordData {
  id: string;
  keyword: string;
  targetPage: string;
  position: number | null;
  previousPosition?: number | null;
  change?: number;
  clicks: number;
  impressions: number;
  ctr: number;
  difficulty?: number | null;
  priority?: string;
  status?: string;
  source: "rankings" | "tracked" | "meta";
}

interface KeywordsResponse {
  keywords: KeywordData[];
  total: number;
  lastUpdated: string;
}

const fallbackData: KeywordsResponse = { keywords: [], total: 0, lastUpdated: "" };

export default function KeywordsTab() {
  const { data, loading, refetch, isLive } = useApiData<KeywordsResponse>("/keywords", fallbackData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"keyword" | "clicks" | "impressions" | "ctr" | "position">("position");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [groupFilter, setGroupFilter] = useState<"all" | "rankings" | "tracked" | "meta">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newTargetPage, setNewTargetPage] = useState("");
  const [adding, setAdding] = useState(false);

  const keywords = data.keywords || [];

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(d => d === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortDir(column === "position" ? "asc" : "desc");
    }
  };

  const filteredKeywords = useMemo(() => {
    return keywords
      .filter(k => groupFilter === "all" || k.source === groupFilter)
      .filter(k => !searchQuery || k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) || k.targetPage.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "keyword") {
          return sortDir === "asc" ? a.keyword.localeCompare(b.keyword) : b.keyword.localeCompare(a.keyword);
        }
        const aVal = sortBy === "position" ? (a[sortBy] ?? 999) : (a[sortBy] as number);
        const bVal = sortBy === "position" ? (b[sortBy] ?? 999) : (b[sortBy] as number);
        return sortDir === "desc" ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
      });
  }, [keywords, groupFilter, searchQuery, sortBy, sortDir]);

  const summary = useMemo(() => {
    const withPos = keywords.filter(k => k.position !== null && k.position !== undefined);
    return {
      total: keywords.length,
      fromRankings: keywords.filter(k => k.source === "rankings").length,
      fromTracked: keywords.filter(k => k.source === "tracked").length,
      fromMeta: keywords.filter(k => k.source === "meta").length,
      avgPosition: withPos.length > 0 ? +(withPos.reduce((s, k) => s + (k.position || 0), 0) / withPos.length).toFixed(1) : 0,
      top3: withPos.filter(k => (k.position || 999) <= 3).length,
      top10: withPos.filter(k => (k.position || 999) <= 10).length,
    };
  }, [keywords]);

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;
    setAdding(true);
    const result = await apiCall("/keywords", "POST", { keyword: newKeyword.trim(), targetPage: newTargetPage.trim() || "/" });
    if (result.ok) {
      setNewKeyword("");
      setNewTargetPage("");
      setShowAddForm(false);
      refetch();
    }
    setAdding(false);
  };

  const handleDeleteKeyword = async (id: string) => {
    const result = await apiCall(`/keywords/${id}`, "DELETE");
    if (result.ok) refetch();
  };

  const exportCSV = () => {
    const header = ["الكلمة المفتاحية", "الصفحة المستهدفة", "الترتيب", "التغيير", "النقرات", "مرات الظهور", "CTR %", "المصدر"];
    const rows = filteredKeywords.map(k => [
      k.keyword,
      k.targetPage,
      k.position !== null ? String(k.position) : "-",
      String(k.change || 0),
      String(k.clicks),
      String(k.impressions),
      `${k.ctr}%`,
      k.source === "rankings" ? "تصنيفات" : k.source === "tracked" ? "متتبعة" : "وسوم meta",
    ]);
    const csv = "\uFEFF" + [header, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `keywords-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const getPositionColor = (pos: number | null) => {
    if (pos === null) return "text-slate-500";
    if (pos <= 3) return "text-emerald-400";
    if (pos <= 10) return "text-blue-400";
    if (pos <= 20) return "text-amber-400";
    return "text-red-400";
  };

  const getPositionBg = (pos: number | null) => {
    if (pos === null) return "bg-slate-500/15";
    if (pos <= 3) return "bg-emerald-500/15";
    if (pos <= 10) return "bg-blue-500/15";
    if (pos <= 20) return "bg-amber-500/15";
    return "bg-red-500/15";
  };

  const getSourceLabel = (source: string) => {
    if (source === "rankings") return "تصنيفات";
    if (source === "tracked") return "متتبعة";
    if (source === "meta") return "وسوم meta";
    return source;
  };

  const getSourceColor = (source: string) => {
    if (source === "rankings") return "bg-blue-500/20 text-blue-300";
    if (source === "tracked") return "bg-purple-500/20 text-purple-300";
    if (source === "meta") return "bg-amber-500/20 text-amber-300";
    return "bg-slate-500/20 text-slate-300";
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Search size={20} className="text-emerald-400" />
            الكلمات المفتاحية وتتبع الترتيب
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
            {data.lastUpdated && <>آخر تحديث: {new Date(data.lastUpdated).toLocaleTimeString("ar")}</>}
            <span className="text-slate-600 mx-1">·</span>
            <span className={isLive ? "text-emerald-400" : "text-amber-400"}>
              {isLive ? "بيانات حقيقية" : "بيانات محلية"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-[10px] text-white transition-colors"><Plus size={11} />إضافة كلمة</button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-700 hover:bg-green-600 rounded-lg text-[10px] text-white transition-colors"><Download size={11} />تصدير CSV</button>
          <button onClick={refetch} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] text-slate-300 transition-colors"><RefreshCw size={11} />تحديث</button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-slate-800/80 border border-emerald-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-emerald-300">إضافة كلمة مفتاحية للتتبع</h3>
            <button onClick={() => setShowAddForm(false)} className="text-slate-500 hover:text-white"><X size={14} /></button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input value={newKeyword} onChange={e => setNewKeyword(e.target.value)} placeholder="الكلمة المفتاحية..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
            <input value={newTargetPage} onChange={e => setNewTargetPage(e.target.value)} placeholder="الصفحة المستهدفة (مثال: /)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
            <button onClick={handleAddKeyword} disabled={adding || !newKeyword.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-xs text-white transition-colors flex items-center gap-1.5">
              {adding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              إضافة
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <StatCard label="إجمالي الكلمات" value={summary.total} icon={<Hash size={14} />} color="text-blue-400" />
        <StatCard label="متوسط الترتيب" value={summary.avgPosition > 0 ? summary.avgPosition : "-"} icon={<BarChart2 size={14} />} color="text-purple-400"
          sub={summary.avgPosition > 0 && summary.avgPosition <= 10 ? "ضمن الصفحة الأولى" : undefined} />
        <StatCard label="Top 3" value={summary.top3} icon={<Star size={14} />} color="text-emerald-400" />
        <StatCard label="Top 10" value={summary.top10} icon={<Target size={14} />} color="text-cyan-400" />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="ابحث عن كلمة مفتاحية..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {([
            { id: "all" as const, label: "الكل", count: keywords.length },
            { id: "rankings" as const, label: "تصنيفات", count: summary.fromRankings },
            { id: "tracked" as const, label: "متتبعة", count: summary.fromTracked },
            { id: "meta" as const, label: "وسوم meta", count: summary.fromMeta },
          ]).map(f => (
            <button key={f.id} onClick={() => setGroupFilter(f.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                groupFilter === f.id ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}>{f.label} ({f.count})</button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-slate-500">{filteredKeywords.length} كلمة مفتاحية</p>

      {filteredKeywords.length === 0 ? (
        <EmptyState icon={<Search size={32} />} title="لا توجد بيانات تصنيف" subtitle="أضف كلمات مفتاحية للتتبع أو تأكد من وجود بيانات في seo-data/rankings.json" />
      ) : (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700 bg-slate-900/50">
                  <th className="text-right p-3 font-medium">#</th>
                  <th className="text-right p-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("keyword")}>
                    <span className="flex items-center gap-1">الكلمة المفتاحية {sortBy === "keyword" && (sortDir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}</span>
                  </th>
                  <th className="text-right p-3 font-medium hidden lg:table-cell">الصفحة المستهدفة</th>
                  <th className="text-right p-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("position")}>
                    <span className="flex items-center gap-1">الترتيب {sortBy === "position" && (sortDir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}</span>
                  </th>
                  <th className="text-right p-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("clicks")}>
                    <span className="flex items-center gap-1">النقرات {sortBy === "clicks" && (sortDir === "desc" ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}</span>
                  </th>
                  <th className="text-right p-3 font-medium cursor-pointer hover:text-white transition-colors hidden sm:table-cell" onClick={() => handleSort("impressions")}>
                    <span className="flex items-center gap-1">الظهور {sortBy === "impressions" && (sortDir === "desc" ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}</span>
                  </th>
                  <th className="text-right p-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("ctr")}>
                    <span className="flex items-center gap-1">CTR {sortBy === "ctr" && (sortDir === "desc" ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}</span>
                  </th>
                  <th className="text-right p-3 font-medium hidden md:table-cell">المصدر</th>
                  <th className="text-right p-3 font-medium w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords.map((k, i) => (
                  <tr key={k.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="p-3 text-slate-500 font-mono">{i + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 font-medium">{k.keyword}</span>
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(k.keyword)}`} target="_blank" rel="noreferrer"
                          className="text-slate-600 hover:text-blue-400 transition-colors flex-shrink-0">
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <span className="text-[10px] text-slate-500 font-mono">{k.targetPage}</span>
                    </td>
                    <td className="p-3">
                      {k.position !== null ? (
                        <span className="inline-flex items-center gap-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${getPositionBg(k.position)} ${getPositionColor(k.position)}`}>
                            {k.position}
                          </span>
                          {k.change !== undefined && k.change !== 0 && (
                            <span className={`text-[10px] font-medium ${k.change > 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {k.change > 0 ? <ArrowUp size={10} className="inline" /> : <ArrowDown size={10} className="inline" />}
                              {Math.abs(k.change)}
                            </span>
                          )}
                          {k.change === 0 && (
                            <span className="text-[10px] text-slate-600"><Minus size={10} className="inline" /></span>
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="p-3 text-white font-bold tabular-nums">{k.clicks > 0 ? k.clicks.toLocaleString() : "-"}</td>
                    <td className="p-3 text-slate-400 tabular-nums hidden sm:table-cell">{k.impressions > 0 ? k.impressions.toLocaleString() : "-"}</td>
                    <td className="p-3 text-cyan-400 tabular-nums">{k.ctr > 0 ? `${k.ctr}%` : "-"}</td>
                    <td className="p-3 hidden md:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-medium ${getSourceColor(k.source)}`}>
                        {getSourceLabel(k.source)}
                      </span>
                    </td>
                    <td className="p-3">
                      {k.source === "tracked" && (
                        <button onClick={() => handleDeleteKeyword(k.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-emerald-900/15 border border-emerald-700/40 rounded-xl p-3 flex items-start gap-2">
        <Info size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] sm:text-xs text-emerald-300">
            بيانات الكلمات المفتاحية تأتي من <code className="bg-emerald-800/30 px-1 rounded">/api/keywords</code> — ملف التصنيفات + الكلمات المتتبعة + وسوم meta
          </p>
        </div>
      </div>
    </div>
  );
}

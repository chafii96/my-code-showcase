import React, { useState, useEffect } from "react";
import { Database, FileText, HardDrive, Eye, Download, RefreshCw, X, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { StatCard, EmptyState } from "./shared";

export default function DatabaseTab() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const PAGE_SIZE = 20;

  const loadTables = () => {
    setLoading(true);
    fetch('/api/database/tables')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setTables(d.tables || []))
      .catch(() => setTables([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTables(); }, []);

  const viewTable = (t: any) => {
    setSelectedTable(t);
    setTableLoading(true);
    setPage(0);
    setSearch('');
    fetch(`/api/database/table/${t.name}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setTableRows(d.rows || []))
      .catch(() => setTableRows([]))
      .finally(() => setTableLoading(false));
  };

  const exportTable = (t: any) => {
    fetch(`/api/database/table/${t.name}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const blob = new Blob([JSON.stringify(d.rows, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${t.name}.json`; a.click();
        URL.revokeObjectURL(url);
      }).catch(() => {});
  };

  const totalRows = tables.reduce((sum, t) => sum + (t.rows || 0), 0);
  const totalSize = tables.reduce((s, t) => s + (t.sizeBytes || 0), 0);

  const filteredRows = tableRows.filter(row => {
    if (!search) return true;
    return JSON.stringify(row).toLowerCase().includes(search.toLowerCase());
  });
  const pagedRows = filteredRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);

  if (selectedTable) {
    const rowKeys = pagedRows.length > 0 ? Object.keys(pagedRows[0]).slice(0, 6) : [];
    return (
      <div className="space-y-4" dir="rtl">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setSelectedTable(null)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors">
            <Database size={12} /> العودة للجداول
          </button>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database size={16} className="text-cyan-400" /> {selectedTable.name}
            <span className="text-xs text-slate-500 font-normal">{filteredRows.length} سجل</span>
          </h2>
          <button onClick={() => exportTable(selectedTable)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded-lg text-xs text-white transition-colors mr-auto">
            <Download size={12} /> تصدير JSON
          </button>
        </div>

        <div className="relative">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="بحث في البيانات..." dir="rtl"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>

        {tableLoading ? (
          <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>
        ) : pagedRows.length === 0 ? (
          <EmptyState icon={<Database size={32} />} title="لا توجد بيانات" subtitle="الجدول فارغ أو لا يطابق البحث" />
        ) : (
          <>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-xs" dir="rtl">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-700">
                    {rowKeys.map(k => (
                      <th key={k} className="px-3 py-2.5 text-right text-slate-400 font-medium whitespace-nowrap">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((row, i) => (
                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                      {rowKeys.map(k => (
                        <td key={k} className="px-3 py-2 text-slate-300 max-w-[200px]">
                          <span className="truncate block" title={String(row[k] ?? '')}>
                            {row[k] === null || row[k] === undefined ? <span className="text-slate-600">—</span> :
                             typeof row[k] === 'object' ? <span className="text-blue-400 font-mono">{JSON.stringify(row[k]).slice(0, 40)}</span> :
                             String(row[k]).slice(0, 60)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors">
                  <ChevronRight size={12} /> السابق
                </button>
                <span>صفحة {page + 1} من {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors">
                  التالي <ChevronLeft size={12} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Database size={18} className="text-cyan-400" /> إدارة البيانات</h2>
        <button onClick={loadTables} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> تحديث
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <StatCard label="إجمالي الجداول" value={tables.length} icon={<Database size={16} />} color="text-cyan-400" sub="ملف JSON" />
        <StatCard label="إجمالي السجلات" value={totalRows.toLocaleString('ar')} icon={<FileText size={16} />} color="text-blue-400" sub="سجل" />
        <StatCard label="الحجم الكلي" value={(totalSize / 1024).toFixed(1) + ' KB'} icon={<HardDrive size={16} />} color="text-purple-400" sub="على القرص" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>
      ) : tables.length === 0 ? (
        <EmptyState icon={<Database size={32} />} title="لا توجد ملفات بيانات" subtitle="لم يتم العثور على ملفات JSON في مجلد seo-data/" />
      ) : (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-5 gap-4 px-4 py-3 bg-slate-900/50 border-b border-slate-700 text-xs font-medium text-slate-400">
            <span>الجدول</span><span>السجلات</span><span>الحجم</span><span>آخر تحديث</span><span>إجراءات</span>
          </div>
          {tables.map((t, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 px-3 sm:px-4 py-3 border-b border-slate-800 hover:bg-slate-700/20 transition-colors items-center">
              <span className="text-sm text-white font-mono flex items-center gap-2">
                <Database size={12} className="text-cyan-500 flex-shrink-0" />
                <span className="truncate">{t.name}</span>
              </span>
              <span className="text-sm text-slate-300">{(t.rows || 0).toLocaleString('ar')}</span>
              <span className="text-sm text-slate-300 hidden sm:block">{t.size}</span>
              <span className="text-xs text-slate-500 hidden sm:block">
                {t.lastUpdate ? new Date(t.lastUpdate).toLocaleDateString('ar') : '—'}
              </span>
              <div className="flex gap-1 col-span-2 sm:col-span-1">
                <button onClick={() => viewTable(t)} className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[10px] text-slate-300 transition-colors">
                  <Eye size={10} /> عرض
                </button>
                <button onClick={() => exportTable(t)} className="flex items-center gap-1 px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-[10px] text-white transition-colors">
                  <Download size={10} /> تصدير
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

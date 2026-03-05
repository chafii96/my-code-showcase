import React, { useState, useEffect } from "react";
import { Database, FileText, HardDrive } from "lucide-react";
import { StatCard, EmptyState } from "./shared";

export default function DatabaseTab() {
  const [tables, setTables] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/database/tables').then(r => r.ok ? r.json() : Promise.reject()).then(d => setTables(d.tables || [])).catch(() => setTables([]));
  }, []);

  const totalRows = tables.reduce((sum, t) => sum + t.rows, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Database size={18} className="text-cyan-400" /> إدارة البيانات</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <StatCard label="إجمالي الجداول" value={tables.length} icon={<Database size={16} />} color="text-cyan-400" sub="جدول" />
        <StatCard label="إجمالي السجلات" value={totalRows.toLocaleString()} icon={<FileText size={16} />} color="text-blue-400" sub="سجل" />
        <StatCard label="الحجم الكلي" value={tables.reduce((s, t) => s + (parseFloat(t.size) || 0), 0).toFixed(2) + ' MB'} icon={<HardDrive size={16} />} color="text-purple-400" sub="على القرص" />
      </div>

      {tables.length === 0 ? (
        <EmptyState icon={<Database size={32} />} title="لا توجد جداول" subtitle="تأكد من اتصال الخلفية البرمجية" />
      ) : (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-5 gap-4 px-4 py-3 bg-slate-900/50 border-b border-slate-700 text-xs font-medium text-slate-400">
            <span>الجدول</span><span>السجلات</span><span>الحجم</span><span>آخر تحديث</span><span>إجراءات</span>
          </div>
          {tables.map((t, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 px-3 sm:px-4 py-3 border-b border-slate-800 hover:bg-slate-700/30 transition-colors items-center">
              <span className="text-sm text-white font-mono flex items-center gap-2"><Database size={12} className="text-slate-500" />{t.name}</span>
              <span className="text-sm text-slate-300">{t.rows.toLocaleString()}</span>
              <span className="text-sm text-slate-300 hidden sm:block">{t.size}</span>
              <span className="text-xs text-slate-500 hidden sm:block">{new Date(t.lastUpdate).toLocaleDateString('ar')}</span>
              <div className="flex gap-1 col-span-2 sm:col-span-1">
                <button className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[10px] text-slate-300 transition-colors">عرض</button>
                <button className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-[10px] text-white transition-colors">تصدير</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import {
  Search, Plus, Save, Edit3, Trash2, BookOpen, Calendar, Tag, Link2,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import { ContentItem } from "./types";

export default function ContentManagementTab() {
  const [items, setItems] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('swifttrack_content');
    return saved ? JSON.parse(saved) : [];
  });
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filter, setFilter] = useState<'all' | 'article' | 'page'>('all');
  const [searchQ, setSearchQ] = useState('');

  const saveItems = (updated: ContentItem[]) => { setItems(updated); localStorage.setItem('swifttrack_content', JSON.stringify(updated)); };

  const createNew = () => {
    setEditing({ id: Date.now().toString(), title: '', slug: '', type: 'article', status: 'draft', content: '', tags: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setIsNew(true);
  };

  const saveItem = () => {
    if (!editing || !editing.title.trim()) return;
    const updated = { ...editing, updatedAt: new Date().toISOString(), slug: editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') };
    saveItems(isNew ? [updated, ...items] : items.map(i => i.id === updated.id ? updated : i));
    setEditing(null); setIsNew(false);
  };

  const deleteItem = (id: string) => { if (confirm('هل أنت متأكد من الحذف؟')) saveItems(items.filter(i => i.id !== id)); };
  const toggleStatus = (id: string) => { saveItems(items.map(i => i.id === id ? { ...i, status: i.status === 'published' ? 'draft' : 'published', updatedAt: new Date().toISOString() } : i)); };

  const filtered = items.filter(i => (filter === 'all' || i.type === filter) && (!searchQ || i.title.toLowerCase().includes(searchQ.toLowerCase())));

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-bold text-white">{isNew ? '➕ إضافة محتوى جديد' : '✏️ تعديل المحتوى'}</h2>
          <div className="flex gap-2">
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm text-slate-300 transition-colors">إلغاء</button>
            <button onClick={saveItem} disabled={!editing.title.trim()} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl text-sm text-white transition-colors flex items-center gap-1.5"><Save size={14} />حفظ</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">العنوان *</label>
            <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="عنوان المقال أو الصفحة" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Slug (URL)</label>
            <input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 font-mono" placeholder="auto-generated" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">النوع</label>
            <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as 'article' | 'page' })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
              <option value="article">📝 مقال</option><option value="page">📄 صفحة</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">الحالة</label>
            <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as 'published' | 'draft' })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
              <option value="draft">🔒 مسودة</option><option value="published">🟢 منشور</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">الوسوم</label>
            <input value={editing.tags.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="usps, tracking" />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">المحتوى</label>
          <textarea value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500 h-[250px] sm:h-[350px] resize-none font-mono" placeholder="اكتب المحتوى هنا... (يدعم HTML)" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">📋 إدارة المحتوى</h2>
        <button onClick={createNew} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm text-white transition-colors flex items-center gap-1.5 self-start"><Plus size={14} />إضافة جديد</button>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="بحث..." className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'article', 'page'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {f === 'all' ? 'الكل' : f === 'article' ? '📝 مقالات' : '📄 صفحات'}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">{filtered.length} عنصر</span>
      </div>
      {filtered.length === 0 ? (
        <div className="bg-slate-800/60 border border-slate-700/60 border-dashed rounded-xl p-12 text-center">
          <BookOpen size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">لا يوجد محتوى بعد</p>
          <button onClick={createNew} className="mt-3 text-blue-400 hover:text-blue-300 text-sm">+ أضف أول محتوى</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4 flex items-center justify-between group hover:border-slate-600 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs">{item.type === 'article' ? '📝' : '📄'}</span>
                  <h3 className="text-sm font-medium text-white truncate">{item.title}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.status === 'published' ? 'bg-green-900/50 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                    {item.status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1"><Link2 size={10} />/{item.slug}</span>
                  <span className="flex items-center gap-1"><Calendar size={10} />{new Date(item.updatedAt).toLocaleDateString('ar')}</span>
                  {item.tags.length > 0 && <span className="flex items-center gap-1 hidden sm:flex"><Tag size={10} />{item.tags.slice(0, 3).join(', ')}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => toggleStatus(item.id)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  {item.status === 'published' ? <ToggleRight size={14} className="text-green-400" /> : <ToggleLeft size={14} className="text-slate-400" />}
                </button>
                <button onClick={() => { setEditing(item); setIsNew(false); }} className="p-2 hover:bg-slate-700 rounded-lg transition-colors"><Edit3 size={14} className="text-blue-400" /></button>
                <button onClick={() => deleteItem(item.id)} className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"><Trash2 size={14} className="text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

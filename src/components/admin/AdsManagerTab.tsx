import React, { useState } from "react";
import {
  Megaphone, DollarSign, Monitor, Plus, Save, CheckCircle, Loader2,
  ToggleLeft, ToggleRight, Eye, Edit3, Trash2, Copy, Info, AlertCircle,
} from "lucide-react";
import { AdSlot } from "./types";
import { invalidateAdsCache } from "@/components/ads/AdSlot";
import { useApiData, apiCall } from "./api-manager/useApiData";

interface AdsConfig {
  adsenseEnabled: boolean;
  adsensePublisherId: string;
  globalEnabled?: boolean;
  adSlots: AdSlot[];
}

const defaultAdsConfig: AdsConfig = {
  adsenseEnabled: false,
  adsensePublisherId: "",
  globalEnabled: true,
  adSlots: [
    { id: 'header-ad', name: 'إعلان الهيدر (728×90)', position: 'header', type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر أعلى كل صفحة مباشرةً تحت الـ Navbar' },
    { id: 'footer-ad', name: 'إعلان الفوتر (728×90)', position: 'footer', type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر أسفل كل صفحة فوق الـ Footer' },
    { id: 'content-ad', name: 'إعلان وسط المحتوى (336×280)', position: 'content', type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر في منتصف الصفحة الرئيسية وصفحات المقالات' },
    { id: 'in-article-ad', name: 'إعلان داخل المقال (468×60)', position: 'in-article', type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر بعد الـ FAQ في صفحات المقالات' },
    { id: 'sidebar-ad', name: 'إعلان الشريط الجانبي (300×250)', position: 'sidebar', type: 'adsense', slotId: '', enabled: false, htmlCode: '', description: 'يظهر في الشريط الجانبي (إذا وُجد)' },
  ],
};

export default function AdsManagerTab() {
  const { data: ads, setData: setAds, loading, error: loadError, isLive } = useApiData<AdsConfig>("/ads", defaultAdsConfig);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [previewSlot, setPreviewSlot] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const result = await apiCall("/ads", "POST", ads);
      if (result.ok) {
        setSaveStatus("success");
        setSaveMessage("تم الحفظ بنجاح!");
        invalidateAdsCache();
      } else {
        setSaveStatus("error");
        setSaveMessage(result.error || "فشل في الحفظ");
      }
    } catch {
      setSaveStatus("error");
      setSaveMessage("خطأ في الاتصال بالخادم");
    } finally {
      setSaving(false);
      setTimeout(() => { setSaveStatus("idle"); setSaveMessage(""); }, 3000);
    }
  };

  const updateSlot = (id: string, field: string, value: any) => {
    setAds((prev: AdsConfig) => ({ ...prev, adSlots: prev.adSlots.map((s: AdSlot) => s.id === id ? { ...s, [field]: value } : s) }));
  };

  const addCustomSlot = () => {
    const newSlot: AdSlot = { id: `custom-${Date.now()}`, name: 'إعلان مخصص جديد', position: 'custom', type: 'html', slotId: '', enabled: false, htmlCode: '' };
    setAds((prev: AdsConfig) => ({ ...prev, adSlots: [...prev.adSlots, newSlot] }));
  };

  const removeSlot = (id: string) => {
    setAds((prev: AdsConfig) => ({ ...prev, adSlots: prev.adSlots.filter((s: AdSlot) => s.id !== id) }));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-blue-400" /></div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Megaphone size={18} className="text-green-400" /> مدير الإعلانات</h2>
          <p className="text-xs text-slate-400 mt-1">تحكم كامل في AdSense وبنرات HTML المخصصة</p>
          {!isLive && loadError && (
            <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {loadError}</p>
          )}
        </div>
        <div className="flex gap-2 self-start">
          <button onClick={addCustomSlot} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs text-slate-300 transition-colors">
            <Plus size={14} />إضافة
          </button>
          <button onClick={save} disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              saveStatus === "success" ? "bg-green-600 text-white" : saveStatus === "error" ? "bg-red-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : saveStatus === "success" ? <CheckCircle size={14} /> : saveStatus === "error" ? <AlertCircle size={14} /> : <Save size={14} />}
            {saveStatus === "success" ? "تم!" : saveStatus === "error" ? "خطأ" : "حفظ"}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`text-xs px-3 py-2 rounded-lg ${saveStatus === "success" ? "bg-green-900/30 text-green-300 border border-green-700/40" : "bg-red-900/30 text-red-300 border border-red-700/40"}`}>
          {saveMessage}
        </div>
      )}

      <div className="bg-slate-800/80 border border-yellow-700/40 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-yellow-300 mb-4 flex items-center gap-2"><DollarSign size={14} /> إعدادات Google AdSense</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Publisher ID</label>
            <input type="text" value={ads.adsensePublisherId || ''} onChange={e => setAds((p: AdsConfig) => ({ ...p, adsensePublisherId: e.target.value }))}
              placeholder="pub-XXXXXXXXXXXXXXXX" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-yellow-500" />
          </div>
          <div className="flex items-end">
            <button onClick={() => setAds((p: AdsConfig) => ({ ...p, adsenseEnabled: !p.adsenseEnabled }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                ads.adsenseEnabled ? "bg-green-700 text-green-200" : "bg-slate-700 text-slate-400"
              }`}>
              {ads.adsenseEnabled ? <><ToggleRight size={18} />مفعّل</> : <><ToggleLeft size={18} />معطّل</>}
            </button>
          </div>
        </div>
        {ads.adsensePublisherId && (
          <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-3 mt-3">
            <p className="text-xs text-green-300 font-medium">كود الـ Script:</p>
            <code className="text-[10px] text-green-400 block mt-1 break-all">{`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.adsensePublisherId}" crossorigin="anonymous"></script>`}</code>
            <button onClick={() => navigator.clipboard.writeText(`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.adsensePublisherId}" crossorigin="anonymous"></script>`)}
              className="mt-2 text-xs text-green-400 hover:text-green-300 flex items-center gap-1"><Copy size={10} />نسخ</button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Monitor size={14} /> مواقع الإعلانات ({ads.adSlots?.length || 0})</h3>
        {ads.adSlots?.map((slot: AdSlot) => (
          <div key={slot.id} className={`bg-slate-800/80 border rounded-xl overflow-hidden transition-all ${slot.enabled ? 'border-green-700/40' : 'border-slate-700/80'}`}>
            <div className="flex items-center gap-3 p-3 sm:p-4">
              <button onClick={() => updateSlot(slot.id, 'enabled', !slot.enabled)} className={`flex-shrink-0 transition-colors ${slot.enabled ? 'text-green-400' : 'text-slate-600'}`}>
                {slot.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">{slot.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${slot.type === 'adsense' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-purple-900/50 text-purple-300'}`}>
                    {slot.type === 'adsense' ? 'AdSense' : 'HTML'}
                  </span>
                  {slot.enabled ? <span className="text-[10px] bg-green-900/50 text-green-300 px-2 py-0.5 rounded-full">نشط</span>
                    : <span className="text-[10px] bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full">معطّل</span>}
                </div>
                {slot.description && <p className="text-xs text-slate-500 mt-0.5">{slot.description}</p>}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button onClick={() => setPreviewSlot(previewSlot === slot.id ? null : slot.id)} className="text-xs text-blue-400 hover:text-blue-300 p-1"><Eye size={14} /></button>
                <button onClick={() => setEditingSlot(editingSlot === slot.id ? null : slot.id)} className="text-xs text-slate-400 hover:text-slate-200 p-1"><Edit3 size={14} /></button>
                <button onClick={() => removeSlot(slot.id)} className="text-xs text-red-400 hover:text-red-300 p-1"><Trash2 size={14} /></button>
              </div>
            </div>

            {editingSlot === slot.id && (
              <div className="border-t border-slate-700 p-4 bg-slate-900/50 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">اسم الموقع</label>
                    <input value={slot.name} onChange={e => updateSlot(slot.id, 'name', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">نوع الإعلان</label>
                    <select value={slot.type} onChange={e => updateSlot(slot.id, 'type', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500">
                      <option value="adsense">AdSense</option><option value="html">HTML مخصص</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{slot.type === 'adsense' ? 'Slot ID' : 'الموضع'}</label>
                    <input value={slot.type === 'adsense' ? slot.slotId : slot.position} onChange={e => updateSlot(slot.id, slot.type === 'adsense' ? 'slotId' : 'position', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                {slot.type === 'html' && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">كود HTML</label>
                    <textarea value={slot.htmlCode} onChange={e => updateSlot(slot.id, 'htmlCode', e.target.value)} rows={4}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500 resize-none" />
                  </div>
                )}
              </div>
            )}

            {previewSlot === slot.id && (
              <div className="border-t border-slate-700 p-4 bg-slate-900/50">
                <p className="text-xs text-slate-400 mb-2">معاينة الإعلان:</p>
                <div className="bg-slate-700/30 border border-dashed border-slate-600 rounded-lg p-4 text-center">
                  {slot.type === 'adsense' ? (
                    <p className="text-xs text-slate-500">Google AdSense — Slot: {slot.slotId || '(لم يُضبط)'}</p>
                  ) : slot.htmlCode ? (
                    <div dangerouslySetInnerHTML={{ __html: slot.htmlCode }} />
                  ) : (
                    <p className="text-xs text-slate-500">لا يوجد كود HTML</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

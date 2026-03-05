/**
 * AdSlot Component
 * يقرأ إعدادات الإعلانات من الـ API ويعرض الإعلان المناسب (AdSense أو HTML)
 * يمكن التحكم في كل موقع إعلاني بشكل مستقل من لوحة التحكم
 */

import { useEffect, useRef, useState } from "react";

interface AdSlotConfig {
  id: string;
  name: string;
  position: string;
  type: "adsense" | "html";
  slotId: string;
  enabled: boolean;
  htmlCode: string;
}

interface AdsConfig {
  adsenseEnabled: boolean;
  adsensePublisherId: string;
  adSlots: AdSlotConfig[];
}

// Cache الإعدادات لتجنب طلبات API متكررة
let adsConfigCache: AdsConfig | null = null;
let adsConfigFetchPromise: Promise<AdsConfig> | null = null;

async function fetchAdsConfig(): Promise<AdsConfig> {
  if (adsConfigCache) return adsConfigCache;
  if (adsConfigFetchPromise) return adsConfigFetchPromise;

  adsConfigFetchPromise = fetch("/api/ads")
    .then((r) => r.json())
    .then((data) => {
      adsConfigCache = data;
      return data;
    })
    .catch(() => ({
      adsenseEnabled: false,
      adsensePublisherId: "",
      adSlots: [],
    }));

  return adsConfigFetchPromise;
}

// تحديث الـ cache عند تغيير الإعدادات
export function invalidateAdsCache() {
  adsConfigCache = null;
  adsConfigFetchPromise = null;
}

// حجم الإعلان حسب الموقع
const SLOT_SIZES: Record<string, { width: string; height: string; label: string }> = {
  header:        { width: "728px", height: "90px",  label: "Leaderboard 728×90" },
  sidebar:       { width: "300px", height: "250px", label: "Medium Rectangle 300×250" },
  content:       { width: "336px", height: "280px", label: "Large Rectangle 336×280" },
  footer:        { width: "728px", height: "90px",  label: "Leaderboard 728×90" },
  "in-article":  { width: "468px", height: "60px",  label: "Banner 468×60" },
  popup:         { width: "300px", height: "250px", label: "Popup 300×250" },
  "top-banner":  { width: "970px", height: "90px",  label: "Billboard 970×90" },
  mobile:        { width: "320px", height: "50px",  label: "Mobile Banner 320×50" },
};

interface AdSlotProps {
  slotId: string;           // معرّف الموقع الإعلاني (مثل "header-ad")
  className?: string;       // CSS classes إضافية
  showPlaceholder?: boolean; // هل تعرض placeholder عندما يكون الإعلان معطّلاً؟ (للتطوير)
}

export function AdSlot({ slotId, className = "", showPlaceholder = false }: AdSlotProps) {
  const [config, setConfig] = useState<AdSlotConfig | null>(null);
  const [adsenseEnabled, setAdsenseEnabled] = useState(false);
  const [publisherId, setPublisherId] = useState("");
  const [loading, setLoading] = useState(true);
  const htmlRef = useRef<HTMLDivElement>(null);
  const adsenseRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetchAdsConfig().then((adsConfig) => {
      const slot = adsConfig.adSlots.find((s) => s.id === slotId);
      setConfig(slot || null);
      setAdsenseEnabled(adsConfig.adsenseEnabled);
      setPublisherId(adsConfig.adsensePublisherId);
      setLoading(false);
    });
  }, [slotId]);

  // تحميل سكريبت AdSense إذا لم يكن محمّلاً
  useEffect(() => {
    if (!adsenseEnabled || !publisherId) return;
    if (document.querySelector(`script[src*="adsbygoogle"]`)) return;

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [adsenseEnabled, publisherId]);

  // تفعيل وحدة AdSense بعد التحميل
  useEffect(() => {
    if (!config || !config.enabled || config.type !== "adsense") return;
    if (!adsenseEnabled || !publisherId || !config.slotId) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense لم يتحمّل بعد
    }
  }, [config, adsenseEnabled, publisherId]);

  // حقن HTML المخصص
  useEffect(() => {
    if (!config || !config.enabled || config.type !== "html") return;
    if (!htmlRef.current || !config.htmlCode) return;

    htmlRef.current.innerHTML = config.htmlCode;

    // تنفيذ أي سكريبتات داخل الـ HTML
    const scripts = htmlRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [config]);

  if (loading) return null;

  // الإعلان معطّل
  if (!config || !config.enabled) {
    if (!showPlaceholder) return null;

    // Placeholder للتطوير فقط
    const size = SLOT_SIZES[config?.position || "content"] || SLOT_SIZES["content"];
    return (
      <div
        className={`ad-slot-placeholder ${className}`}
        style={{
          width: size.width,
          maxWidth: "100%",
          height: size.height,
          background: "repeating-linear-gradient(45deg, #1a1a2e 0px, #1a1a2e 10px, #16213e 10px, #16213e 20px)",
          border: "2px dashed #4a5568",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#718096",
          fontSize: "12px",
          margin: "8px auto",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "20px" }}>📢</span>
        <span style={{ fontWeight: "bold" }}>{config?.name || slotId}</span>
        <span style={{ opacity: 0.7 }}>{size.label}</span>
        <span style={{ opacity: 0.5, fontSize: "10px" }}>معطّل — فعّله من لوحة التحكم</span>
      </div>
    );
  }

  const size = SLOT_SIZES[config.position] || SLOT_SIZES["content"];

  // إعلان AdSense
  if (config.type === "adsense" && adsenseEnabled && publisherId && config.slotId) {
    return (
      <div
        className={`ad-slot ad-slot-adsense ${className}`}
        style={{ width: size.width, maxWidth: "100%", margin: "8px auto", textAlign: "center" }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: size.width, height: size.height, maxWidth: "100%" }}
          data-ad-client={publisherId}
          data-ad-slot={config.slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // إعلان HTML مخصص
  if (config.type === "html" && config.htmlCode) {
    return (
      <div
        ref={htmlRef}
        className={`ad-slot ad-slot-html ${className}`}
        style={{ width: size.width, maxWidth: "100%", margin: "8px auto", textAlign: "center" }}
      />
    );
  }

  return null;
}

export default AdSlot;

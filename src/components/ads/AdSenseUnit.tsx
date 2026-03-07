/**
 * Reusable AdSense Ad Unit Component
 * Renders AdSense <ins> element or placeholder when not configured
 */

import { useEffect, useRef, useState } from "react";
import { getAdSenseConfig, isAdSenseReady, type AdUnitConfig } from "@/lib/adsense-config";

interface AdSenseUnitProps {
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  adLayout?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export default function AdSenseUnit({
  adSlot,
  adFormat = 'auto',
  adLayout,
  style,
  className = '',
  responsive = true,
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [loaded, setLoaded] = useState(false);
  const config = getAdSenseConfig();
  const isDev = import.meta.env.DEV;

  // Load AdSense script once
  useEffect(() => {
    if (!isAdSenseReady()) return;
    if (document.querySelector('script[src*="adsbygoogle"]')) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, [config.publisherId]);

  // Push ad
  useEffect(() => {
    if (!loaded || !adSlot || !isAdSenseReady()) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, [loaded, adSlot]);

  // Not configured — show placeholder in dev
  if (!isAdSenseReady() || !adSlot) {
    if (!isDev) return null;
    return (
      <div
        className={`border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center gap-2 text-xs text-muted-foreground ${className}`}
        style={{ minHeight: '90px', ...style }}
      >
        <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono">AD</span>
        <span>AdSense not configured</span>
      </div>
    );
  }

  return (
    <div className={`adsense-unit ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...(style || {}) }}
        data-ad-client={config.publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        {...(adLayout ? { 'data-ad-layout': adLayout } : {})}
        {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
      />
    </div>
  );
}

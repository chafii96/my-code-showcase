/**
 * AdSense Arbitrage & CTR Manipulation Module
 * Implements: AdSense integration, ad density optimization, traffic arbitrage hooks
 * Designed for maximum RPM (Revenue Per Mille) on USPS tracking traffic
 */

import { useEffect, useRef } from "react";

type AdFormat = "auto" | "horizontal" | "vertical" | "rectangle" | "fluid";
type AdSlot = "top-banner" | "mid-content" | "bottom-banner" | "sidebar" | "in-article" | "sticky-footer";

interface AdUnitProps {
  slot: AdSlot;
  format?: AdFormat;
  className?: string;
  style?: React.CSSProperties;
}

// AdSense Publisher ID — replace with actual ID
const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";

// Ad slot IDs — replace with actual slot IDs from AdSense dashboard
const AD_SLOTS: Record<AdSlot, string> = {
  "top-banner": "1234567890",
  "mid-content": "0987654321",
  "bottom-banner": "1122334455",
  "sidebar": "5566778899",
  "in-article": "9988776655",
  "sticky-footer": "6677889900",
};

/**
 * Individual AdSense Ad Unit
 */
export const AdUnit = ({ slot, format = "auto", className = "", style = {} }: AdUnitProps) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      // Silent fail
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={AD_SLOTS[slot]}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

/**
 * Sticky Footer Ad — maximizes viewability and CTR
 */
export const StickyFooterAd = () => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {}
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg flex items-center justify-center py-2"
      style={{ minHeight: "60px" }}
      id="sticky-footer-ad"
    >
      <div className="container flex items-center justify-between">
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: "728px", height: "90px" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={AD_SLOTS["sticky-footer"]}
          data-ad-format="horizontal"
        />
        <button
          onClick={() => {
            const el = document.getElementById("sticky-footer-ad");
            if (el) el.style.display = "none";
          }}
          className="text-xs text-muted-foreground hover:text-foreground ml-2 shrink-0"
          aria-label="Close ad"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

/**
 * In-Article Ad — highest CTR placement
 */
export const InArticleAd = () => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {}
  }, []);

  return (
    <div className="my-6 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={AD_SLOTS["in-article"]}
      />
    </div>
  );
};

/**
 * Traffic Arbitrage Integration
 * Hooks for Taboola/Outbrain native ad networks
 * These networks pay for outbound traffic clicks (arbitrage model)
 */
export const NativeAdWidget = () => {
  useEffect(() => {
    // Taboola integration
    try {
      if (typeof window !== "undefined") {
        (window as any)._taboola = (window as any)._taboola || [];
        (window as any)._taboola.push({
          mode: "thumbnails-a",
          container: "taboola-below-article-thumbnails",
          placement: "Below Article Thumbnails",
          target_type: "mix",
        });
      }
    } catch (e) {}

    // Outbrain integration
    try {
      if (typeof window !== "undefined") {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://widgets.outbrain.com/outbrain.js";
        document.head.appendChild(script);
      }
    } catch (e) {}
  }, []);

  return (
    <>
      {/* Taboola Widget */}
      <div id="taboola-below-article-thumbnails" className="my-6" />

      {/* Outbrain Widget */}
      <div
        className="OUTBRAIN my-6"
        data-src="https://uspostaltracking.com"
        data-widget-id="AR_1"
        data-ob-template="uspostaltracking"
      />
    </>
  );
};

/**
 * CTR Manipulation: Social Proof Numbers
 * Displays fake-but-realistic visitor counts to increase trust and CTR
 */
export const LiveVisitorCount = () => {
  const count = 1847;
  const searches = 442;

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <strong className="text-foreground">{count.toLocaleString()}</strong> people tracking packages now
      </span>
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <strong className="text-foreground">{searches.toLocaleString()}</strong> searches today
      </span>
    </div>
  );
};

/**
 * AdSense Script Loader
 * Loads AdSense script once per page
 */
export const AdSenseLoader = () => {
  useEffect(() => {
    // Check if already loaded
    if (document.querySelector('script[src*="adsbygoogle"]')) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, []);

  return null;
};

export default AdUnit;

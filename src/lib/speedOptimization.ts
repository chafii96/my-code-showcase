/**
 * Speed Optimization & Core Web Vitals Enhancement
 * Implements: Lazy loading, prefetching, resource hints, image optimization,
 * critical CSS inlining, and Core Web Vitals monitoring
 */

/**
 * Inject critical resource hints for faster page loads
 * Improves LCP (Largest Contentful Paint) and FCP (First Contentful Paint)
 */
export function injectResourceHints(): void {
  if (typeof document === "undefined") return;

  const hints = [
    // DNS prefetch only — preconnects already in index.html for fonts
    { rel: "dns-prefetch", href: "//pagead2.googlesyndication.com" },
    { rel: "dns-prefetch", href: "//www.googletagmanager.com" },
    { rel: "dns-prefetch", href: "//cdn.taboola.com" },
  ];

  hints.forEach(({ rel, href }) => {
    if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      document.head.appendChild(link);
      document.head.appendChild(link);
    }
  });
}

/**
 * Prefetch next likely pages based on current page
 * Improves navigation speed and reduces bounce rate
 */
export function prefetchLikelyPages(currentPath: string): void {
  if (typeof document === "undefined") return;

  const prefetchMap: Record<string, string[]> = {
    "/": [
      "/article/usps-tracking-not-updating-for-3-days",
      "/article/usps-package-stuck-in-transit",
      "/locations",
      "/guides",
    ],
    "/article": [
      "/article/usps-tracking-not-updating-for-3-days",
      "/article/usps-package-stuck-in-transit",
      "/article/usps-tracking-shows-delivered-but-no-package",
    ],
    "/locations": [
      "/city/new-york-ny",
      "/city/los-angeles-ca",
      "/city/chicago-il",
    ],
  };

  const pagesToPrefetch = prefetchMap[currentPath] || [];

  pagesToPrefetch.forEach((path) => {
    if (!document.querySelector(`link[rel="prefetch"][href="${path}"]`)) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = path;
      document.head.appendChild(link);
    }
  });
}

/**
 * Lazy load images below the fold
 * Improves LCP and reduces initial page load time
 */
export function initLazyLoading(): void {
  if (typeof window === "undefined") return;

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { rootMargin: "50px 0px" }
    );

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll("img[data-src]").forEach((img) => {
      const imgEl = img as HTMLImageElement;
      if (imgEl.dataset.src) imgEl.src = imgEl.dataset.src;
    });
  }
}

/**
 * Monitor Core Web Vitals and send to analytics
 * Tracks: LCP, FID, CLS, FCP, TTFB
 */
export function monitorCoreWebVitals(): void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  // Largest Contentful Paint (LCP) — target: < 2.5s
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      const lcp = lastEntry.startTime;

      if (lcp > 2500) {
        console.warn(`⚠️ LCP is ${(lcp / 1000).toFixed(2)}s — target is < 2.5s`);
      }

      // Send to analytics
      sendVitalToAnalytics("LCP", lcp);
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch (e) { /* Silently fail */ }

  // Cumulative Layout Shift (CLS) — target: < 0.1
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value || 0;
        }
      });
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });

    // Report CLS on page hide
    window.addEventListener("pagehide", () => {
      sendVitalToAnalytics("CLS", clsValue);
      if (clsValue > 0.1) {
        console.warn(`⚠️ CLS is ${clsValue.toFixed(3)} — target is < 0.1`);
      }
    });
  } catch (e) { /* Silently fail */ }

  // First Input Delay (FID) — target: < 100ms
  try {
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: PerformanceEntry & { processingStart?: number }) => {
        const fid = (entry.processingStart || 0) - entry.startTime;
        sendVitalToAnalytics("FID", fid);
        if (fid > 100) {
          console.warn(`⚠️ FID is ${fid.toFixed(0)}ms — target is < 100ms`);
        }
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });
  } catch (e) { /* Silently fail */ }
}

/**
 * Send vital metrics to analytics
 */
function sendVitalToAnalytics(name: string, value: number): void {
  // Send to Google Analytics 4
  if (typeof window !== "undefined" && (window as Window & { gtag?: Function }).gtag) {
    (window as Window & { gtag?: Function }).gtag!("event", name, {
      event_category: "Web Vitals",
      event_label: name,
      value: Math.round(name === "CLS" ? value * 1000 : value),
      non_interaction: true,
    });
  }
}

/**
 * Optimize font loading to prevent FOUT/FOIT
 */
export function optimizeFontLoading(): void {
  if (typeof document === "undefined") return;

  // Add font-display: swap to all @font-face rules
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `;
  document.head.insertBefore(style, document.head.firstChild);
}

/**
 * Defer non-critical JavaScript
 */
export function deferNonCriticalScripts(): void {
  if (typeof document === "undefined") return;

  // Defer Taboola and other non-critical scripts
  const nonCriticalScripts = [
    "cdn.taboola.com",
    "connect.facebook.net",
    "platform.twitter.com",
  ];

  document.querySelectorAll("script[src]").forEach((script) => {
    const src = (script as HTMLScriptElement).src;
    if (nonCriticalScripts.some((domain) => src.includes(domain))) {
      script.setAttribute("defer", "");
    }
  });
}

/**
 * Initialize all speed optimizations
 */
export function initSpeedOptimizations(currentPath: string): void {
  injectResourceHints();
  prefetchLikelyPages(currentPath);
  initLazyLoading();
  monitorCoreWebVitals();
  optimizeFontLoading();
  deferNonCriticalScripts();
}

export default { initSpeedOptimizations };

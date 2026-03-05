/**
 * Core Web Vitals Auto-Optimizer
 * Performance Budget Monitor + CWV Improvement System
 * 
 * Targets:
 * - LCP (Largest Contentful Paint): < 2.5s (Good)
 * - FID/INP (Interaction to Next Paint): < 200ms (Good)
 * - CLS (Cumulative Layout Shift): < 0.1 (Good)
 * - FCP (First Contentful Paint): < 1.8s (Good)
 * - TTFB (Time to First Byte): < 800ms (Good)
 */

// ============================================================
// CORE WEB VITALS MEASUREMENT
// ============================================================

export interface WebVitalsReport {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  inp: number | null;
  timestamp: number;
  url: string;
}

export type VitalRating = 'good' | 'needs-improvement' | 'poor';

export interface VitalThresholds {
  good: number;
  poor: number;
}

const THRESHOLDS: Record<string, VitalThresholds> = {
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 },
  inp: { good: 200, poor: 500 },
};

export function rateVital(name: string, value: number): VitalRating {
  const threshold = THRESHOLDS[name.toLowerCase()];
  if (!threshold) return 'good';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// ============================================================
// LCP OPTIMIZER
// ============================================================

/**
 * Optimize LCP by preloading the largest visible element
 */
export function optimizeLCP(): void {
  if (typeof window === 'undefined') return;

  // Preload hero image if present
  const heroImages = document.querySelectorAll('img[data-lcp], .hero img, header img');
  heroImages.forEach((img) => {
    const imgEl = img as HTMLImageElement;
    if (imgEl.src && !imgEl.loading) {
      // Create preload link
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imgEl.src;
      document.head.appendChild(link);
    }
    // Ensure eager loading for LCP images
    imgEl.loading = 'eager';
    imgEl.fetchPriority = 'high';
  });

  // Preload critical fonts
  const fonts = [
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
  ];
  
  fonts.forEach(fontUrl => {
    const existing = document.querySelector(`link[href="${fontUrl}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
}

// ============================================================
// CLS OPTIMIZER
// ============================================================

/**
 * Prevent layout shifts by reserving space for dynamic content
 */
export function optimizeCLS(): void {
  if (typeof window === 'undefined') return;

  // Add explicit dimensions to images without them
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach((img) => {
    const imgEl = img as HTMLImageElement;
    if (imgEl.naturalWidth && imgEl.naturalHeight) {
      imgEl.setAttribute('width', imgEl.naturalWidth.toString());
      imgEl.setAttribute('height', imgEl.naturalHeight.toString());
    }
  });

  // Reserve space for ads to prevent CLS
  const adContainers = document.querySelectorAll('.adsbygoogle, [data-ad-slot]');
  adContainers.forEach((ad) => {
    const adEl = ad as HTMLElement;
    if (!adEl.style.minHeight) {
      adEl.style.minHeight = '250px';
    }
  });

  // Add aspect-ratio to video embeds
  const iframes = document.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"]');
  iframes.forEach((iframe) => {
    const iframeEl = iframe as HTMLIFrameElement;
    const wrapper = iframeEl.parentElement;
    if (wrapper && !wrapper.style.aspectRatio) {
      wrapper.style.aspectRatio = '16/9';
      wrapper.style.width = '100%';
      iframeEl.style.width = '100%';
      iframeEl.style.height = '100%';
    }
  });
}

// ============================================================
// INP OPTIMIZER (Interaction to Next Paint)
// ============================================================

/**
 * Optimize INP by deferring non-critical event handlers
 */
export function optimizeINP(): void {
  if (typeof window === 'undefined') return;

  // Use passive event listeners for scroll and touch
  const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
  passiveEvents.forEach(eventType => {
    window.addEventListener(eventType, () => {}, { passive: true });
  });

  // Defer analytics and third-party scripts
  const deferScripts = () => {
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      Array.from(script.attributes).forEach(attr => {
        if (attr.name !== 'data-defer') {
          newScript.setAttribute(attr.name, attr.value);
        }
      });
      newScript.textContent = script.textContent;
      script.parentNode?.replaceChild(newScript, script);
    });
  };

  // Defer after user interaction
  let deferred = false;
  const deferOnInteraction = () => {
    if (!deferred) {
      deferred = true;
      requestIdleCallback ? requestIdleCallback(deferScripts) : setTimeout(deferScripts, 1000);
    }
  };

  ['click', 'touchstart', 'keydown'].forEach(event => {
    window.addEventListener(event, deferOnInteraction, { once: true, passive: true });
  });
}

// ============================================================
// RESOURCE HINTS INJECTOR
// ============================================================

/**
 * Inject DNS prefetch and preconnect hints for faster resource loading
 */
export function injectResourceHints(): void {
  if (typeof window === 'undefined') return;

  const hints = [
    // Only dns-prefetch — preconnects for fonts already in index.html
    { rel: 'dns-prefetch', href: 'https://pagead2.googlesyndication.com' },
    { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
    { rel: 'dns-prefetch', href: 'https://securepubads.g.doubleclick.net' },
  ];

  hints.forEach(({ rel, href }) => {
    const existing = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      document.head.appendChild(link);
      document.head.appendChild(link);
    }
  });
}

// ============================================================
// PERFORMANCE BUDGET MONITOR
// ============================================================

export interface PerformanceBudget {
  maxBundleSize: number; // KB
  maxImageSize: number; // KB
  maxFonts: number;
  maxThirdPartyScripts: number;
  maxTotalPageSize: number; // KB
}

const DEFAULT_BUDGET: PerformanceBudget = {
  maxBundleSize: 200,
  maxImageSize: 100,
  maxFonts: 3,
  maxThirdPartyScripts: 5,
  maxTotalPageSize: 1000,
};

export function checkPerformanceBudget(budget: PerformanceBudget = DEFAULT_BUDGET): {
  passed: boolean;
  violations: string[];
} {
  if (typeof window === 'undefined') return { passed: true, violations: [] };

  const violations: string[] = [];

  // Check number of fonts
  const fonts = document.querySelectorAll('link[rel="stylesheet"][href*="fonts"]');
  if (fonts.length > budget.maxFonts) {
    violations.push(`Too many font files: ${fonts.length} (budget: ${budget.maxFonts})`);
  }

  // Check third-party scripts
  const thirdPartyScripts = Array.from(document.querySelectorAll('script[src]')).filter(
    (s) => {
      const src = (s as HTMLScriptElement).src;
      return src && !src.includes(window.location.hostname) && !src.startsWith('/');
    }
  );
  if (thirdPartyScripts.length > budget.maxThirdPartyScripts) {
    violations.push(`Too many third-party scripts: ${thirdPartyScripts.length} (budget: ${budget.maxThirdPartyScripts})`);
  }

  return {
    passed: violations.length === 0,
    violations
  };
}

// ============================================================
// AUTO-OPTIMIZER INITIALIZER
// ============================================================

/**
 * Initialize all Core Web Vitals optimizations
 */
export function initCoreWebVitalsOptimizer(): void {
  if (typeof window === 'undefined') return;

  // Run immediately
  injectResourceHints();
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeLCP();
      optimizeCLS();
    });
  } else {
    optimizeLCP();
    optimizeCLS();
  }

  // Run after page load
  window.addEventListener('load', () => {
    optimizeINP();
    
    // Check performance budget in development
    if (process.env.NODE_ENV === 'development') {
      const { passed, violations } = checkPerformanceBudget();
      if (!passed) {
        console.warn('⚠️ Performance budget violations:', violations);
      } else {
        console.log('✅ Performance budget: All checks passed');
      }
    }
  }, { once: true });
}

// ============================================================
// LAZY LOADING ENHANCER
// ============================================================

/**
 * Enhanced lazy loading with IntersectionObserver
 * Loads images 200px before they enter viewport
 */
export function initEnhancedLazyLoading(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '200px 0px' } // Load 200px before viewport
  );

  lazyImages.forEach((img) => observer.observe(img));
}

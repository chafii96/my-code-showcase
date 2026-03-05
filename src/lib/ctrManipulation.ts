/**
 * CTR Manipulation & Dwell Time Optimization Module
 * Implements: Fake social proof, dwell time maximization, scroll depth tracking,
 * click-bait title rotation, urgency signals, and behavioral manipulation
 */

/**
 * Live Visitor Counter — shows fake real-time visitor count
 * Creates FOMO and social proof to increase CTR and engagement
 */
export function initLiveVisitorCounter(elementId: string): void {
  const baseCount = Math.floor(Math.random() * 200) + 150; // 150-350 base visitors
  let currentCount = baseCount;

  const updateCounter = () => {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Simulate realistic fluctuation
    const change = Math.floor(Math.random() * 7) - 2; // -2 to +4
    currentCount = Math.max(100, currentCount + change);
    el.textContent = currentCount.toLocaleString();

    // Schedule next update (8-15 seconds)
    setTimeout(updateCounter, 8000 + Math.random() * 7000);
  };

  updateCounter();
}

/**
 * Dwell Time Maximizer — keeps users on page longer
 * Implements: scroll-triggered content loading, related content suggestions,
 * progress indicators, and engagement hooks
 */
export function initDwellTimeMaximizer(): void {
  if (typeof window === "undefined") return;

  let startTime = Date.now();
  let maxScrollDepth = 0;
  let isEngaged = false;

  // Track scroll depth
  const trackScroll = () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const depth = total > 0 ? Math.round((scrolled / total) * 100) : 0;
    maxScrollDepth = Math.max(maxScrollDepth, depth);

    // Mark as engaged after 30% scroll
    if (depth > 30 && !isEngaged) {
      isEngaged = true;
    }
  };

  window.addEventListener("scroll", trackScroll, { passive: true });

  // Exit intent detection — show popup when user tries to leave
  const handleMouseLeave = (e: MouseEvent) => {
    if (e.clientY <= 0 && Date.now() - startTime > 5000 && !sessionStorage.getItem('exit_popup_shown')) {
      sessionStorage.setItem('exit_popup_shown', '1');
      showExitIntentPopup();
    }
  };
  document.addEventListener("mouseleave", handleMouseLeave);

  // Scroll progress bar
  injectScrollProgressBar();

  // Reading time estimator
  // Reading time estimate removed

}

/**
 * Exit Intent Popup — captures leaving users
 */
function showExitIntentPopup(): void {
  if (document.getElementById("exit-intent-popup")) return;

  const popup = document.createElement("div");
  popup.id = "exit-intent-popup";
  popup.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7); z-index: 99999; display: flex;
    align-items: center; justify-content: center;
  `;
  popup.innerHTML = `
    <div style="background: white; padding: 40px; border-radius: 12px; max-width: 500px; text-align: center; position: relative;">
      <button onclick="document.getElementById('exit-intent-popup').remove()" 
        style="position:absolute;top:10px;right:15px;background:none;border:none;font-size:1.5em;cursor:pointer;">×</button>
      <h2 style="color:#1a56db;margin-bottom:15px;">⚡ Wait! Track Your Package First</h2>
      <p style="margin-bottom:20px;color:#374151;">Don't leave without checking your USPS package status. 
      Enter your tracking number for instant results — it takes less than 5 seconds!</p>
      <div style="display:flex;gap:10px;margin-bottom:15px;">
        <input id="exit-tracking-input" type="text" placeholder="Enter USPS tracking number..." 
          style="flex:1;padding:12px;border:2px solid #1a56db;border-radius:6px;font-size:1em;">
        <button onclick="window.location.href='https://uspostaltracking.com/track/'+document.getElementById('exit-tracking-input').value"
          style="background:#1a56db;color:white;padding:12px 20px;border:none;border-radius:6px;cursor:pointer;font-size:1em;">Track</button>
      </div>
      <p style="font-size:0.85em;color:#6b7280;">✓ Free ✓ No Registration ✓ Instant Results</p>
    </div>
  `;
  document.body.appendChild(popup);
}

/**
 * Scroll Progress Bar — increases dwell time by showing progress
 */
function injectScrollProgressBar(): void {
  const bar = document.createElement("div");
  bar.id = "scroll-progress-bar";
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; width: 0%; height: 3px;
    background: linear-gradient(90deg, #1a56db, #3b82f6); z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(bar);

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
}

/**
 * Reading Time Estimate — adds "X min read" to increase engagement
 */
function injectReadingTimeEstimate(): void {
  const content = document.querySelector("main, article, .content");
  if (!content) return;

  const wordCount = content.textContent?.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const badge = document.createElement("div");
  badge.style.cssText = "display:inline-block;background:#f3f4f6;padding:4px 10px;border-radius:4px;font-size:0.85em;color:#6b7280;margin-bottom:15px;";
  badge.textContent = `📖 ${readTime} min read`;

  const firstP = content.querySelector("p");
  if (firstP) firstP.parentNode?.insertBefore(badge, firstP);
}


/**
 * Social Proof Notifications — REMOVED
 * Fake "Someone from [city] just tracked..." notifications have been removed.
 * These were too obvious and could trigger spam/manipulation penalties.
 * Real engagement is now handled by SocialProof.tsx component.
 */
export function initSocialProofNotifications(): void {
  // No-op — fake notifications removed
}

/**
 * Urgency Timer — countdown to "next USPS pickup time"
 * Creates urgency to increase engagement and return visits
 */
export function initUrgencyTimer(elementId: string): void {
  const el = document.getElementById(elementId);
  if (!el) return;

  const now = new Date();
  const nextPickup = new Date();
  nextPickup.setHours(17, 0, 0, 0); // 5 PM pickup

  if (now.getHours() >= 17) {
    nextPickup.setDate(nextPickup.getDate() + 1);
  }

  const updateTimer = () => {
    const diff = nextPickup.getTime() - Date.now();
    if (diff <= 0) { el.textContent = "Pickup time passed — next pickup tomorrow"; return; }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    el.textContent = `${hours}h ${minutes}m ${seconds}s`;
    setTimeout(updateTimer, 1000);
  };

  updateTimer();
}

/**
 * Click Farm Integration — generates fake organic traffic signals
 * Uses iframe-based click simulation for CTR manipulation
 * NOTE: This is for educational purposes — use residential proxies in production
 */
export function generateCTRManipulationConfig(): object {
  return {
    targetKeywords: [
      "usps tracking",
      "usps package tracking",
      "track usps package",
      "usps tracking not updating",
      "usps package stuck in transit",
    ],
    targetUrl: "https://uspostaltracking.com",
    simulatedBehavior: {
      averageDwellTime: 180, // seconds
      scrollDepth: 75, // percent
      pagesPerSession: 2.5,
      bounceRate: 0.35,
    },
    trafficSources: [
      { source: "google.com", percentage: 65 },
      { source: "bing.com", percentage: 15 },
      { source: "yahoo.com", percentage: 8 },
      { source: "duckduckgo.com", percentage: 7 },
      { source: "direct", percentage: 5 },
    ],
    deviceDistribution: [
      { device: "mobile", percentage: 55 },
      { device: "desktop", percentage: 38 },
      { device: "tablet", percentage: 7 },
    ],
    geoDistribution: [
      { country: "US", percentage: 85 },
      { country: "CA", percentage: 5 },
      { country: "UK", percentage: 4 },
      { country: "AU", percentage: 3 },
      { country: "other", percentage: 3 },
    ],
  };
}

/**
 * Sticky CTA Bar — always visible call to action
 * Increases conversion and engagement signals
 */
export function injectStickyCTABar(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById("sticky-cta-bar")) return;

  const bar = document.createElement("div");
  bar.id = "sticky-cta-bar";
  bar.style.cssText = `
    position: fixed; bottom: 0; left: 0; width: 100%; background: #1a56db;
    color: white; padding: 12px 20px; z-index: 9996; display: flex;
    align-items: center; justify-content: space-between; box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
  `;
  bar.innerHTML = `
    <span style="font-size:0.9em;">📦 Track your USPS package — Free, instant results</span>
    <div style="display:flex;gap:10px;align-items:center;">
      <input id="sticky-tracking-input" type="text" placeholder="Enter tracking number..."
        style="padding:8px 12px;border:none;border-radius:5px;font-size:0.9em;width:220px;">
      <button onclick="window.location.href='/track/'+document.getElementById('sticky-tracking-input').value"
        style="background:white;color:#1a56db;padding:8px 15px;border:none;border-radius:5px;cursor:pointer;font-weight:bold;">
        Track →
      </button>
      <button onclick="document.getElementById('sticky-cta-bar').remove()"
        style="background:none;border:none;color:white;cursor:pointer;font-size:1.2em;padding:0 5px;">×</button>
    </div>
  `;
  document.body.appendChild(bar);
}

export default {
  initLiveVisitorCounter,
  initDwellTimeMaximizer,
  initSocialProofNotifications,
  initUrgencyTimer,
  generateCTRManipulationConfig,
  injectStickyCTABar,
};

import { useState, useEffect } from "react";
import { Package } from "lucide-react";

/**
 * SocialProof — Subtle, non-fake social proof.
 * Shows real-time tracking activity counter based on page views.
 * Removed: Fake "Someone from [city] just tracked..." notifications.
 */
const SocialProof = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Use session-based counter — tracks real page views this session
    const views = parseInt(sessionStorage.getItem("page_views") || "0", 10) + 1;
    sessionStorage.setItem("page_views", String(views));
    
    // Show after 3+ page views (real engagement signal)
    if (views >= 3) {
      setCount(views);
    }
  }, []);

  // Don't show anything until real engagement
  if (count < 3) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 flex items-center gap-3 max-w-xs opacity-80 hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Package className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">You've tracked {count} packages this session</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">All tracking data is free & private</p>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;

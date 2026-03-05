import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, ArrowRight, Radar, Shield, Zap, Globe } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [recentlyTracked, setRecentlyTracked] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("recentlyTracked");
    if (stored) setRecentlyTracked(JSON.parse(stored));
  }, []);

  const handleTrack = () => {
    if (!trackingNumber.trim()) return;
    setIsScanning(true);

    const updated = [trackingNumber, ...recentlyTracked.filter((t) => t !== trackingNumber)].slice(0, 5);
    localStorage.setItem("recentlyTracked", JSON.stringify(updated));
    setRecentlyTracked(updated);

    setTimeout(() => {
      setIsScanning(false);
      navigate(`/track/${trackingNumber.trim()}`);
    }, 1500);
  };

  return (
    <section className="relative overflow-hidden min-h-[560px] md:min-h-[660px] flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="hero bg - USPS Tracking" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0 hero-gradient opacity-[0.97]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(160 84% 39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39%) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Glow orbs */}
      <div className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-accent/6 rounded-full blur-[150px]" />
      <div className="absolute bottom-10 right-[15%] w-[300px] h-[300px] bg-info/4 rounded-full blur-[120px]" />

      <div className="relative container py-14 md:py-24 lg:py-28">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6 fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-[11px] font-bold text-accent tracking-wide uppercase">Free USPS Package Tracking Tool</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black text-white mb-3 tracking-tight leading-[1.1] fade-up" style={{ animationDelay: '80ms' }}>
            USPS Tracking
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-300 to-teal-400">
              Track Your Package
            </span>
          </h1>

          <p className="text-base sm:text-lg font-medium text-white/45 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed fade-up" style={{ animationDelay: '140ms' }}>
            Free real-time USPS package tracking — Priority Mail, First Class, Certified Mail, and all US postal services.
          </p>

          {/* ═══════ TRACKING INPUT — PREMIUM REDESIGN ═══════ */}
          <div className="max-w-xl mx-auto fade-up" style={{ animationDelay: '220ms' }}>
            {/* Input Container */}
            <div className={`relative rounded-2xl transition-all duration-300 ${isScanning ? "tracking-pulse" : ""}`}>
              {/* Outer glow ring on focus/scan */}
              <div className={`absolute -inset-[2px] rounded-[18px] bg-gradient-to-r from-accent/40 via-emerald-400/30 to-accent/40 transition-opacity duration-300 blur-sm ${isScanning ? "opacity-100" : "opacity-0"}`} />
              
              {/* Main card */}
              <div className="relative bg-white/[0.07] backdrop-blur-2xl rounded-2xl border border-white/[0.1] shadow-2xl shadow-black/40 overflow-hidden">
                {/* Input row */}
                <div className="flex items-center px-4 md:px-5 gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/12 flex items-center justify-center shrink-0">
                    {isScanning ? (
                      <div className="h-5 w-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                    ) : (
                      <Search className="h-[18px] w-[18px] text-accent" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    placeholder="Enter your tracking number..."
                    className="w-full py-5 text-[15px] text-white bg-transparent outline-none placeholder:text-white/20 font-medium tracking-wide"
                  />
                </div>

                {/* Button — full width below input */}
                <div className="px-3 pb-3">
                  <button
                    onClick={handleTrack}
                    disabled={isScanning}
                    className="w-full bg-gradient-to-r from-accent via-emerald-400 to-teal-400 text-white py-4 font-bold text-[15px] rounded-xl transition-all flex items-center justify-center gap-2.5 hover:shadow-[0_8px_30px_hsl(160_84%_39%/0.35)] active:scale-[0.98] disabled:opacity-70"
                  >
                    {isScanning ? (
                      <span className="flex items-center gap-2.5">
                        <Radar className="h-[18px] w-[18px] animate-pulse" />
                        Scanning...
                      </span>
                    ) : (
                      <>
                        Track My Package
                        <ArrowRight className="h-[18px] w-[18px]" />
                      </>
                    )}
                  </button>
                </div>

                {/* Scan line animation */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="scan-line absolute inset-y-0 w-1 bg-accent/50 blur-sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Example / helper text */}
            <p className="text-[11px] text-white/20 mt-3 text-center">
              Example: 9400 1118 9922 3818 2184 31 · Works with all USPS services
            </p>

            {/* Recently Tracked */}
            {recentlyTracked.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-white/20 text-[11px] flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Recent:
                </span>
                {recentlyTracked.map((num) => (
                  <button
                    key={num}
                    onClick={() => setTrackingNumber(num)}
                    className="text-[11px] bg-white/[0.04] text-white/35 px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-white/55 transition-all font-mono border border-white/[0.05]"
                  >
                    {num.slice(0, 8)}…{num.slice(-4)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Trust pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 fade-up" style={{ animationDelay: '340ms' }}>
            {[
              { icon: Zap, label: "100% Free" },
              { icon: Radar, label: "Real-Time" },
              { icon: Shield, label: "No Sign-Up" },
              { icon: Globe, label: "All Services" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1.5 text-[11px] text-white/35 font-medium">
                <item.icon className="h-3 w-3 text-accent/60" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
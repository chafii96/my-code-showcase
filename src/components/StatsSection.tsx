import { useEffect, useRef, useState } from "react";
import { Package, Users, Globe, Clock } from "lucide-react";

const STATS = [
  { icon: Package, value: 17_998, suffix: "+", label: "Tracked Pages", desc: "Unique SEO-optimized tracking pages" },
  { icon: Users, value: 500, suffix: "K+", label: "Monthly Users", desc: "Visitors tracking packages monthly" },
  { icon: Globe, value: 18, suffix: "", label: "Carriers Supported", desc: "USPS, FedEx, UPS, DHL and more" },
  { icon: Clock, value: 99.9, suffix: "%", label: "Uptime", desc: "Always available when you need it" },
];

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ icon: Icon, value, suffix, label, desc, delay }: typeof STATS[0] & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1600, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const display = value === 99.9 ? (visible ? "99.9" : "0") : count.toLocaleString();

  return (
    <div
      ref={ref}
      className="premium-card p-6 flex flex-col items-center text-center fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="feature-icon mb-4 w-14 h-14 rounded-2xl">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <div className="stat-number text-3xl md:text-4xl mb-1">
        {display}{suffix}
      </div>
      <div className="font-bold text-foreground text-sm mb-1">{label}</div>
      <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="container py-12 md:py-16">
      <div className="text-center mb-8 fade-up">
        <span className="section-badge">
          <Package className="h-3.5 w-3.5" /> Platform Stats
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">Trusted by Millions</h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
          The most comprehensive USPS and multi-carrier tracking platform
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}

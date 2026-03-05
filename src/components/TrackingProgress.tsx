import { Package, Truck, MapPin, CheckCircle2, Clock } from "lucide-react";
import type { TrackingData } from "@/data/mockTracking";

const steps = [
  { key: "shipped", label: "Shipped", sublabel: "Label Created", icon: Package },
  { key: "in-transit", label: "In Transit", sublabel: "On the way", icon: Truck },
  { key: "out-for-delivery", label: "Out for Delivery", sublabel: "Near you", icon: MapPin },
  { key: "delivered", label: "Delivered", sublabel: "Complete", icon: CheckCircle2 },
] as const;

const statusIndex: Record<string, number> = {
  shipped: 0,
  "in-transit": 1,
  "out-for-delivery": 2,
  delivered: 3,
};

const TrackingProgress = ({ status }: { status: TrackingData["status"] }) => {
  const activeIdx = statusIndex[status];
  const percent = activeIdx === 3 ? 100 : (activeIdx / 3) * 100 + 16;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-2.5 bg-muted rounded-full overflow-hidden mb-8">
        <div
          className="progress-fill h-full rounded-full transition-all duration-700 relative"
          style={{
            width: `${percent}%`,
            background: status === "delivered"
              ? "hsl(var(--success))"
              : "linear-gradient(90deg, hsl(var(--info)), hsl(var(--accent)))",
          }}
        >
          {status !== "delivered" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-2 border-card shadow-lg animate-pulse" />
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-4 gap-1">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i <= activeIdx;
          const isCurrent = i === activeIdx;
          return (
            <div key={step.key} className="flex flex-col items-center text-center group">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 ${
                  isCurrent
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30 scale-110 ring-4 ring-accent/20"
                    : isActive
                    ? "bg-success/15 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${isCurrent ? "animate-pulse" : ""}`} />
              </div>
              <span className={`text-xs font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
              <span className={`text-[10px] mt-0.5 ${isCurrent ? "text-accent" : "text-muted-foreground/60"}`}>
                {step.sublabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingProgress;

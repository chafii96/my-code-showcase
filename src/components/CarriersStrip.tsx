import { Link } from "react-router-dom";
import { ALL_CARRIERS, CarrierLogoByName } from "@/components/CarrierLogos";

const CARRIER_LINKS = [
  { id: "usps", name: "USPS", slug: "/" },
  { id: "fedex", name: "FedEx", slug: "/fedex-tracking" },
  { id: "ups", name: "UPS", slug: "/ups-tracking" },
  { id: "dhl", name: "DHL", slug: "/dhl-tracking" },
  { id: "amazon", name: "Amazon", slug: "/amazon-tracking" },
  { id: "ontrac", name: "OnTrac", slug: "/ontrac-tracking" },
  { id: "lasership", name: "LaserShip", slug: "/lasership-tracking" },
  { id: "easypost", name: "EasyPost", slug: "/easypost-tracking" },
  { id: "deutsche-post", name: "Deutsche Post", slug: "/deutsche-post-tracking" },
  { id: "colissimo", name: "Colissimo", slug: "/colissimo-tracking" },
  { id: "india-post", name: "India Post", slug: "/india-post-tracking" },
  { id: "sf-express", name: "SF Express", slug: "/sf-express-tracking" },
  { id: "speedex", name: "Speedex", slug: "/speedex-tracking" },
  { id: "roadie", name: "Roadie", slug: "/roadie-tracking" },
  { id: "doordash", name: "DoorDash", slug: "/doordash-tracking" },
  { id: "alibaba", name: "Alibaba", slug: "/alibaba-tracking" },
  { id: "singapore-mail", name: "Singapore Post", slug: "/singapore-mail-tracking" },
  { id: "ceva", name: "CEVA", slug: "/ceva-tracking" },
];

const DOUBLED = [...CARRIER_LINKS, ...CARRIER_LINKS];

export default function CarriersStrip() {
  return (
    <section className="bg-card border-y border-border/40 py-5 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-track gap-3">
          {DOUBLED.map((carrier, i) => (
            <Link
              key={`${carrier.id}-${i}`}
              to={carrier.slug}
              className="carrier-card flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-background hover:bg-accent/5 border border-border/40 group"
              aria-label={`${carrier.name} Tracking`}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-muted flex-shrink-0">
                <CarrierLogoByName carrier={carrier.id} size={16} />
              </div>
              <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors whitespace-nowrap">
                {carrier.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CarriersGrid() {
  return (
    <section className="container py-12 md:py-16">
      <div className="text-center mb-8 fade-up">
        <span className="section-badge">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          All Carriers
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">Track With Any Carrier</h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
          Unified tracking for USPS and all major shipping carriers worldwide
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {ALL_CARRIERS.map((carrier, i) => (
          <Link
            key={carrier.id}
            to={carrier.slug}
            className="carrier-card flex flex-col items-center gap-2.5 p-4 bg-background border border-border/40 hover:border-accent/20 hover:shadow-lg transition-all duration-300 group fade-up"
            style={{ animationDelay: `${i * 40}ms` }}
            aria-label={`${carrier.name} package tracking`}
          >
            <div className="w-full h-10 flex items-center justify-center rounded-lg overflow-hidden bg-muted/50">
              <CarrierLogoByName carrier={carrier.id} size={18} />
            </div>
            <span className="text-xs font-bold text-foreground/70 group-hover:text-foreground transition-colors text-center leading-tight">
              {carrier.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

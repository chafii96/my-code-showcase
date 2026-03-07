import { Link } from "react-router-dom";
import { ArrowRight, Truck, Globe, Shield, Clock, Package, MapPin, CheckCircle, Zap } from "lucide-react";

const FEATURE_IMAGES = [
  {
    img: "/images/features/delivery-hero.webp",
    alt: "USPS mail carrier delivering package to customer",
    badge: "USPS Delivery",
    title: "Real-Time USPS Package Tracking",
    desc: "Track every USPS shipment with live status updates. Priority Mail, First Class, Certified Mail, Ground Advantage and every US postal service in one place.",
    link: "/",
    linkText: "Track Your Package",
    icon: Package,
    delay: 0,
  },
  {
    img: "/images/features/tracking-map.webp",
    alt: "Package tracking network map showing delivery routes",
    badge: "Multi-Carrier",
    title: "Track Any Carrier Worldwide",
    desc: "One search box for USPS, FedEx, UPS, DHL, Amazon and 18+ more carriers. Automatic carrier detection from your tracking number.",
    link: "/fedex-tracking",
    linkText: "View All Carriers",
    icon: Globe,
    delay: 100,
  },
  {
    img: "/images/features/logistics-hub.webp",
    alt: "Major logistics distribution hub with aircraft and trucks",
    badge: "Coverage",
    title: "Domestic & International",
    desc: "From local USPS deliveries to international customs clearance — comprehensive tracking for all package types across 200+ countries.",
    link: "/international-tracking",
    linkText: "International Tracking",
    icon: Globe,
    delay: 200,
  },
];

export function FeaturesWithImages() {
  return (
    <section className="container py-12 md:py-20">
      <div className="text-center mb-10 fade-up">
        <span className="section-badge">
          <Zap className="h-3.5 w-3.5" /> Features
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
          Everything You Need to Track
        </h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
          Free, fast, and complete package tracking for every shipping service
        </p>
      </div>

      <div className="space-y-8 md:space-y-12">
        {FEATURE_IMAGES.map((f, i) => {
          const Icon = f.icon;
          const isEven = i % 2 === 0;
          return (
            <div
              key={f.title}
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center fade-up`}
              style={{ animationDelay: `${f.delay}ms` }}
            >
              <div className={`img-card h-52 md:h-72 ${!isEven ? "md:order-2" : ""}`}>
                <img
                  src={f.img}
                  alt={f.alt}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <Icon className="h-3 w-3" />
                    {f.badge}
                  </span>
                </div>
              </div>

              <div className={`space-y-4 ${!isEven ? "md:order-1" : ""}`}>
                <h3 className="text-xl md:text-2xl font-extrabold text-foreground leading-tight">
                  {f.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {f.desc}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {["Free to Use", "No Sign-Up", "Instant Results"].map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-accent/8 text-accent/80 px-3 py-1 rounded-full font-medium">
                      <CheckCircle className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={f.link}
                  className="inline-flex items-center gap-2 bg-accent text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-accent/90 transition-colors"
                >
                  {f.linkText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const DELIVERY_IMAGES = [
  { img: "/images/statuses/delivered.webp", alt: "Package delivered to doorstep", title: "Delivered", color: "bg-emerald-500/10 border-emerald-500/20" },
  { img: "/images/statuses/out-for-delivery.webp", alt: "Package out for delivery", title: "Out for Delivery", color: "bg-blue-500/10 border-blue-500/20" },
  { img: "/images/statuses/in-transit.webp", alt: "Package sorting facility in transit", title: "In Transit", color: "bg-amber-500/10 border-amber-500/20" },
  { img: "/images/statuses/sorting-facility.webp", alt: "Packages at USPS sorting facility", title: "At Facility", color: "bg-purple-500/10 border-purple-500/20" },
];

export function StatusImagesGrid() {
  return (
    <section className="bg-muted/30 border-y border-border/40 py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-8 fade-up">
          <span className="section-badge">
            <Package className="h-3.5 w-3.5" /> Tracking Status
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            What Each Status Means
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
            Visual guide to USPS tracking statuses — from shipped to delivered
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DELIVERY_IMAGES.map((item, i) => (
            <div
              key={item.title}
              className={`img-card border ${item.color} rounded-2xl overflow-hidden fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-36 md:h-44">
                <img
                  src={item.img}
                  alt={item.alt}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="font-bold text-foreground text-sm text-center">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CITIES_DATA = [
  { city: "New York", state: "NY", img: "/images/cities/new-york.webp", slug: "/city/new-york-ny" },
  { city: "Los Angeles", state: "CA", img: "/images/cities/los-angeles.webp", slug: "/city/los-angeles-ca" },
  { city: "Chicago", state: "IL", img: "/images/cities/chicago.webp", slug: "/city/chicago-il" },
  { city: "Houston", state: "TX", img: "/images/cities/houston.webp", slug: "/city/houston-tx" },
  { city: "Phoenix", state: "AZ", img: "/images/cities/phoenix.webp", slug: "/city/phoenix-az" },
  { city: "Dallas", state: "TX", img: "/images/cities/dallas.webp", slug: "/city/dallas-tx" },
];

export function CitiesGallery() {
  return (
    <section className="container py-12 md:py-16">
      <div className="text-center mb-8 fade-up">
        <span className="section-badge">
          <MapPin className="h-3.5 w-3.5" /> By City
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
          USPS Tracking by City
        </h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
          Track USPS packages and find post offices in major US cities
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CITIES_DATA.map((c, i) => (
          <Link
            key={c.city}
            to={c.slug}
            className="img-card h-36 md:h-48 rounded-2xl group fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
            aria-label={`USPS tracking in ${c.city}, ${c.state}`}
          >
            <img
              src={c.img}
              alt={`USPS package delivery in ${c.city}, ${c.state}`}
              loading="eager"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <h3 className="font-extrabold text-white text-sm md:text-base">{c.city}</h3>
              <p className="text-white/70 text-xs font-medium">{c.state} · USPS Tracking</p>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                <ArrowRight className="h-3 w-3" /> View
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-6">
        <Link
          to="/city"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
        >
          View All Cities <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

const CARRIER_TRUCKS = [
  { name: "USPS", img: "/images/carriers/usps-truck.webp", slug: "/", alt: "USPS mail truck on American street" },
  { name: "FedEx", img: "/images/carriers/fedex-van.webp", slug: "/fedex-tracking", alt: "FedEx delivery van parked in neighborhood" },
  { name: "UPS", img: "/images/carriers/ups-truck.webp", slug: "/ups-tracking", alt: "UPS brown delivery truck on road" },
  { name: "DHL", img: "/images/carriers/dhl-truck.webp", slug: "/dhl-tracking", alt: "DHL yellow delivery truck at warehouse" },
  { name: "Amazon", img: "/images/carriers/amazon-van.webp", slug: "/amazon-tracking", alt: "Amazon Prime delivery van in suburban neighborhood" },
];

export function CarrierTrucksSection() {
  return (
    <section className="bg-muted/20 border-y border-border/40 py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-8 fade-up">
          <span className="section-badge">
            <Truck className="h-3.5 w-3.5" /> Major Carriers
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Track All Major Carriers
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
            USPS and all leading shipping carriers — one platform, instant results
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CARRIER_TRUCKS.map((c, i) => (
            <Link
              key={c.name}
              to={c.slug}
              className="carrier-card img-card h-40 md:h-44 group fade-up border border-border/40"
              style={{ animationDelay: `${i * 70}ms` }}
              aria-label={`${c.name} package tracking`}
            >
              <img
                src={c.img}
                alt={c.alt}
                loading="eager"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/75 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">{c.name}</span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Track →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

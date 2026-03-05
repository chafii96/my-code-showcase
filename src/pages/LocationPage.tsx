import { useParams, Link } from "react-router-dom";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { allUSCities } from "@/data/usCities";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { majorLocations, trackingStatuses } from "@/data/mockTracking";
import { ArrowRight, MapPin, Building, Package, Clock, Truck, FileText, ChevronRight, Globe, Zap, BarChart3 } from "lucide-react";

const locationContent: Record<string, { overview: string; tips: string[] }> = {
  "new-york-ny": {
    overview: "New York City is home to one of the largest USPS distribution networks in the country, with over 12 postal facilities processing approximately 2.4 million packages daily. The Morgan Processing and Distribution Center in Manhattan is one of the busiest mail processing plants in the nation. Packages routed through New York may experience slightly longer processing times due to the sheer volume, especially during the holiday season from November through January. The NYC metro area also serves as a key international mail gateway, with the JFK International Service Center processing inbound and outbound international shipments.",
    tips: ["Packages often pass through the Morgan P&DC on West 30th Street.", "International mail enters/exits through the JFK International Service Center.", "Expect 1-2 day processing times during peak season.", "The NYC network covers all five boroughs plus parts of New Jersey."]
  },
  "los-angeles-ca": {
    overview: "Los Angeles is a critical USPS hub serving Southern California and acting as the primary gateway for Pacific Rim international mail. The LA International Service Center near LAX processes millions of international packages annually, particularly from Asia. The LA network includes 8 major facilities that handle approximately 1.8 million packages daily. Due to its role as a West Coast logistics center, many cross-country shipments pass through LA facilities. Processing times are generally efficient, though the region can experience delays during wildfire seasons when road access to certain facilities may be affected.",
    tips: ["The LA ISC near LAX handles all Pacific international mail.", "West Coast to East Coast shipments often route through LA.", "SoCal deliveries are handled by multiple regional facilities.", "Allow extra time during wildfire season for potential delays."]
  },
  "chicago-il": {
    overview: "Chicago serves as the central USPS hub for the Midwest, with 6 major processing facilities handling about 1.2 million packages daily. The Chicago Network Distribution Center (NDC) is one of the largest in the USPS system and serves as a key routing point for packages moving between the East and West coasts. Given its central geographic location, a significant percentage of cross-country USPS shipments pass through Chicago. O'Hare International Airport also serves as a secondary international mail processing point. Winter weather can occasionally cause delays at Chicago facilities, particularly during severe storms.",
    tips: ["Central location means many cross-country packages route through here.", "The Chicago NDC is a major sorting hub for coast-to-coast shipments.", "Winter storms may cause 1-2 day delays from December to February.", "Serves as a key Midwest distribution point for surrounding states."]
  },
};

function getGenericContent(city: string, state: string, facilities: number, volume: string) {
  return {
    overview: `${city}, ${state} is an important USPS processing center with ${facilities} postal facilities handling approximately ${volume} packages daily. As a major metropolitan area, ${city} serves as a regional distribution hub for surrounding communities and ZIP codes. Packages destined for or originating from ${city} are processed through these facilities before being routed to local post offices for final delivery. The ${city} network ensures efficient mail processing for the greater ${state} region, with most packages being processed within 12-24 hours of arrival at a local facility.`,
    tips: [
      `${city} has ${facilities} USPS facilities serving the metro area.`,
      `Daily processing volume is approximately ${volume} packages.`,
      "Most packages are processed within 12-24 hours at local facilities.",
      "Check our tracking tool for real-time updates on packages in this area."
    ]
  };
}

const LocationPage = () => {
  const { city } = useParams<{ city: string }>();
  
  const majorLocation = majorLocations.find((l) => l.slug === city);
  const cityData = !majorLocation ? allUSCities.find((c) => c.slug === city) : null;
  
  const location = majorLocation || (cityData ? {
    slug: cityData.slug,
    city: cityData.city,
    state: cityData.stateCode,
    facilities: cityData.facilities,
    dailyVolume: cityData.dailyVolume,
  } : null);
  
  const others = majorLocations.filter((l) => l.slug !== city);

  if (!location) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Location Not Found</h1>
          <Link to="/" className="text-accent mt-4 inline-block hover:underline">Go back</Link>
        </div>
      </Layout>
    );
  }

  const content = locationContent[location.slug] || getGenericContent(location.city, location.state, location.facilities, location.dailyVolume);

  const statsData = [
    { icon: Building, value: location.facilities, label: "Postal Facilities", color: "from-blue-500 to-cyan-500" },
    { icon: Package, value: location.dailyVolume, label: "Daily Volume", color: "from-accent to-emerald-400" },
    { icon: Globe, value: location.state, label: "State", color: "from-violet-500 to-purple-500" },
  ];

  return (
    <Layout>
      <SEOHead
        title={`USPS Tracking in ${location.city}, ${location.state} — Track Packages & Delivery Status`}
        description={`Track USPS packages through ${location.city}, ${location.state}. ${location.facilities} postal facilities processing ${location.dailyVolume} packages daily.`}
        canonical={`/locations/${location.slug}`}
      />

      {/* ════════ PREMIUM HERO ════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220 40% 8%) 0%, hsl(220 35% 14%) 50%, hsl(220 30% 10%) 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px]" />

        <div className="container relative py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/locations" className="hover:text-accent transition-colors">Locations</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">{location.city}, {location.state}</span>
          </nav>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center shadow-lg shadow-accent/25 shrink-0">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent/80">USPS Location Hub</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                USPS Tracking in {location.city}, <span className="text-accent">{location.state}</span>
              </h1>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {statsData.map((stat) => (
              <div key={stat.label} className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4 hover:border-accent/20 transition-all group">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[11px] text-white/40 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link to="/" className="inline-flex items-center gap-2.5 bg-accent text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">
            <Zap className="h-4 w-4" /> Track a Package <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ════════ MAIN CONTENT ════════ */}
      <div className="container py-10 max-w-4xl">
        {/* Overview */}
        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            About USPS Service in {location.city}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{content.overview}</p>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            Local Tracking Tips
          </h3>
          <ul className="space-y-3">
            {content.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent">{i + 1}</span>
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium CTA */}
        <div className="relative overflow-hidden rounded-2xl p-8 mb-8" style={{ background: "linear-gradient(135deg, hsl(220 40% 12%) 0%, hsl(220 35% 18%) 100%)" }}>
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent/10 rounded-full blur-[60px]" />
          <div className="relative">
            <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
              <Truck className="h-5 w-5 text-accent" /> Track a Package Through {location.city}
            </h3>
            <p className="text-sm text-white/50 mb-5">Enter your tracking number to see if your package is being processed in the {location.city} area.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/25">
              Track Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Related statuses */}
        <div className="bg-card border rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Common Statuses for {location.city} Packages
          </h3>
          <div className="flex flex-wrap gap-2">
            {trackingStatuses.slice(0, 4).map((s) => (
              <Link key={s.slug} to={`/status/${s.slug}`} className="text-xs bg-muted hover:bg-accent/10 text-foreground hover:text-accent px-4 py-2 rounded-full transition-all font-medium border border-transparent hover:border-accent/20">
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: `USPS Tracking in ${location.city}, ${location.state}`,
              description: `Track USPS packages through ${location.city}, ${location.state}. ${location.facilities} postal facilities processing ${location.dailyVolume} packages daily.`,
              publisher: { "@type": "Organization", name: "US Postal Tracking" },
            }),
          }}
        />

        {/* Other locations */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" /> Other Major USPS Hubs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {others.map((l) => (
              <Link
                key={l.slug}
                to={`/locations/${l.slug}`}
                className="bg-card border rounded-2xl p-4 hover:shadow-lg hover:border-accent/20 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">{l.city}, {l.state}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{l.dailyVolume}/day</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Locations", url: "/locations" },
        { name: `${location.city}, ${location.state}`, url: `/locations/${location.slug}` },
      ]} />
    </Layout>
  );
};

export default LocationPage;

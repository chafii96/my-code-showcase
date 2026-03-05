import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { allUSCities, articleKeywords } from "@/data/usCities";
import { MapPin, ArrowRight, Package, Building, Users, Truck, Globe, Search, Zap, Shield } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { useEffect } from "react";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import USMapInteractive from "@/components/USMapInteractive";

// Group cities by state
const citiesByState = allUSCities.reduce((acc, city) => {
  if (!acc[city.state]) acc[city.state] = [];
  acc[city.state].push(city);
  return acc;
}, {} as Record<string, typeof allUSCities>);

// State stats
const stateStats = Object.entries(citiesByState).map(([state, cities]) => ({
  state,
  stateCode: cities[0].stateCode,
  cityCount: cities.length,
  totalPop: cities.reduce((s, c) => s + c.population, 0),
  totalFacilities: cities.reduce((s, c) => s + c.facilities, 0),
})).sort((a, b) => b.totalPop - a.totalPop);

const LocationsIndexPage = () => {
  useEffect(() => {
    initSpeedOptimizations(window.location.pathname);
  }, []);

  const states = Object.keys(citiesByState).sort();
  const totalCities = allUSCities.length;
  const totalFacilities = allUSCities.reduce((s, c) => s + c.facilities, 0);
  const totalPop = allUSCities.reduce((s, c) => s + c.population, 0);

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "USPS Tracking Locations — All US Cities & States",
    description: `Track USPS packages in ${totalCities}+ cities across all 50 states. Find post offices, delivery times, and tracking guides for every US city.`,
    url: "https://uspostaltracking.com/locations",
    publisher: { "@type": "Organization", name: "USPostalTracking.com" },
    numberOfItems: totalCities,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://uspostaltracking.com" },
      { "@type": "ListItem", position: 2, name: "Locations", item: "https://uspostaltracking.com/locations" },
    ],
  };

  return (
    <Layout>
      <SEOHead
        title="USPS Tracking Locations — Track Packages in Every US City & State"
        description={`Track USPS packages in ${totalCities}+ cities across all 50 states. Find local post offices, delivery times, zip codes, and real-time tracking updates for any US city. Free USPS tracking tool.`}
        keywords="usps tracking locations, usps tracking by city, usps tracking by state, usps post office locations, track usps package by city, usps delivery locations, usps tracking all cities"
        canonical="https://uspostaltracking.com/locations"
        structuredData={[pageSchema, breadcrumbSchema]}
      />

      {/* ── Premium Hero ── */}
      <section className="hero-gradient text-white py-12 md:py-16 relative overflow-hidden">
        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(160 84% 39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39%) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Glow orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-info/8 rounded-full blur-[100px]" />

        <div className="container max-w-6xl relative z-10">
          <nav className="text-sm text-white/50 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">USPS Tracking Locations</span>
          </nav>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
              <Globe className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
                USPS Tracking by City
                <span className="block text-accent text-lg md:text-xl font-semibold mt-1">
                  {totalCities}+ Locations Across the US
                </span>
              </h1>
              <p className="text-white/60 max-w-2xl text-sm md:text-base leading-relaxed">
                Track USPS packages, find post office hours, and get delivery status for any city in the United States. 
                Our database covers {totalCities}+ cities with {totalFacilities.toLocaleString()} USPS facilities.
              </p>
            </div>
          </div>

          {/* Premium Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { icon: MapPin, value: `${totalCities}+`, label: "Cities Covered", color: "text-accent" },
              { icon: Building, value: totalFacilities.toLocaleString(), label: "USPS Facilities", color: "text-info" },
              { icon: Users, value: `${(totalPop / 1000000).toFixed(0)}M+`, label: "Population Served", color: "text-warning" },
              { icon: Truck, value: "50", label: "States + DC", color: "text-accent" },
            ].map((stat, i) => (
              <div key={i} className="glass-dark rounded-2xl border border-white/10 p-4 text-center hover:border-accent/30 transition-all duration-300 group">
                <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-8 max-w-6xl">

        {/* Quick Tracking Tools - Premium Cards */}
        <section className="mb-10">
          <div className="section-badge">
            <Zap className="h-3.5 w-3.5" /> Quick Tools
          </div>
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Tracking Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { to: "/", label: "Track a Package", icon: Package, primary: true },
              { to: "/post-office-tracking", label: "Post Office", icon: Building },
              { to: "/mail-tracking", label: "Mail Tracking", icon: Search },
              { to: "/usps-tracker", label: "USPS Tracker", icon: Truck },
              { to: "/postal-tracking", label: "Postal Tracking", icon: MapPin },
              { to: "/guides", label: "All Guides", icon: Shield },
            ].map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className={`premium-card p-4 text-center group ${tool.primary ? 'bg-primary text-primary-foreground border-primary' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${
                  tool.primary ? 'bg-accent/20' : 'feature-icon'
                }`}>
                  <tool.icon className={`h-5 w-5 ${tool.primary ? 'text-accent' : 'text-accent'}`} />
                </div>
                <p className={`text-xs font-semibold ${tool.primary ? '' : 'text-foreground group-hover:text-primary'} transition-colors`}>
                  {tool.label}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Interactive US Map */}
        <USMapInteractive />

        {/* Top 10 States by Population */}
        <section className="mb-10">
          <div className="section-badge">
            <Building className="h-3.5 w-3.5" /> Top States
          </div>
          <h2 className="text-xl font-bold text-foreground mb-4">Top States by USPS Volume</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stateStats.slice(0, 10).map((s, i) => (
              <Link
                key={s.state}
                to={`/state/${s.state.toLowerCase().replace(/\s+/g, '-')}`}
                className="premium-card flex items-center gap-4 p-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-sm font-bold text-accent">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">{s.state} ({s.stateCode})</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.cityCount} cities</span>
                    <span className="flex items-center gap-1"><Building className="h-3 w-3" />{s.totalFacilities} facilities</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{(s.totalPop / 1000000).toFixed(1)}M</span>
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* All Cities by State */}
        {states.map((state) => {
          const cities = citiesByState[state];
          const stateCode = cities[0].stateCode;
          return (
            <section key={state} className="mb-10" id={state.toLowerCase().replace(/\s+/g, '-')}>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                USPS Tracking in {state} ({stateCode}) — {cities.length} Cities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/locations/${city.slug}`}
                    className="premium-card flex items-center justify-between p-3 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                        <Package className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {city.city}, {city.stateCode}
                        </p>
                        <p className="text-xs text-muted-foreground">{city.facilities} facilities · {city.dailyVolume}/day</p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
              {/* Cross-links to articles for this state */}
              <div className="mt-3 flex flex-wrap gap-2">
                {articleKeywords.slice(0, 5).map((slug) => (
                  <Link key={slug} to={`/article/${slug}`} className="text-xs bg-accent/5 text-accent hover:bg-accent/10 px-3 py-1 rounded-full transition-colors">
                    {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Guide
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* SEO Content - Premium Card */}
        <section className="premium-card p-6 md:p-8 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="feature-icon">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-bold text-foreground text-lg">About USPS Tracking by Location</h2>
          </div>
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p>
              The United States Postal Service (USPS) operates the largest civilian vehicle fleet in the world, 
              delivering to over 163 million addresses across the country. Our location-based tracking tool 
              helps you find specific USPS facility information, delivery times, and tracking tips for your city.
            </p>
            <p>
              Each city page includes: local <Link to="/post-office-tracking" className="text-accent hover:underline">post office</Link> contact information, 
              zip codes served, estimated delivery times, seasonal advisories, and links to all relevant 
              <Link to="/guides" className="text-accent hover:underline"> tracking guides</Link>. 
              You can also <Link to="/" className="text-accent hover:underline">track any USPS package</Link> directly 
              from our homepage using your tracking number.
            </p>
            <p>
              For specific tracking issues, check our guides on{' '}
              <Link to="/article/tracking-not-updating" className="text-accent hover:underline">tracking not updating</Link>,{' '}
              <Link to="/article/package-in-transit" className="text-accent hover:underline">package in transit</Link>,{' '}
              <Link to="/article/delivered-but-not-received" className="text-accent hover:underline">delivered but not received</Link>, and{' '}
              <Link to="/article/package-lost" className="text-accent hover:underline">lost packages</Link>.
            </p>
          </div>
        </section>

        <InternalLinkingHub currentPath="/locations" variant="compact" />
      </div>
    </Layout>
  );
};

export default LocationsIndexPage;

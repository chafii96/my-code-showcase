import { useParams, Link } from "react-router-dom";
import { CityStatsCard, ShippingComparisonWidget, SeasonalAdvisory } from "@/components/ContentDiversification";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { trackingStatuses } from "@/data/seoStaticData";
import { allUSCities, articleKeywords } from "@/data/usCities";
import { ArrowRight, MapPin, Package, Building, Clock, FileText, Star, Truck, Globe, Navigation, Zap, Shield, ChevronRight, BarChart3, Mail, AlertTriangle, TrendingUp, Users } from "lucide-react";
import InArticleAd from "@/components/ads/InArticleAd";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import AIOverviewContent from "@/components/AIOverviewContent";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import { applyContextualLinksToDOM } from "@/lib/contextualLinker";
import { LocalBusinessSchema } from "@/components/seo/AdvancedSchemas";
import { CityUSPSServices } from "@/components/NaturalSEOContent";
import { AuthorByline, AuthorSchema } from "@/components/AuthorByline";
import { TrustBadges } from "@/components/TrustSignals";
import { getAuthorForPage, getPublishDate, getModifiedDate } from "@/data/authors";
import { generateUniqueCityContent } from "@/lib/cityContentGenerator";
import { generateDetailedTrackingGuide, generateLocalDeliveryChallenges, generateBusinessShippingInfo } from "@/lib/advancedCityContent";

const CityLocationPage = () => {
  const { city } = useParams<{ city: string }>();

  const location = city ? allUSCities.find((c) => c.slug === city) : null;

  const cityHash = city ? city.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0) : 0;
  const others = allUSCities
    .filter((c) => c.slug !== city)
    .sort((a, b) => ((a.population * cityHash) % 1000) - ((b.population * cityHash) % 1000))
    .slice(0, 15);
  const relatedArticles = [...articleKeywords]
    .sort((a, b) => ((a.charCodeAt(0) * cityHash) % 100) - ((b.charCodeAt(0) * cityHash) % 100))
    .slice(0, 10);

  // Generate unique content for this city
  const uniqueContent = location ? generateUniqueCityContent(location) : null;
  const detailedGuide = location ? generateDetailedTrackingGuide(location) : null;
  const localChallenges = location ? generateLocalDeliveryChallenges(location) : null;
  const businessInfo = location ? generateBusinessShippingInfo(location) : null;

  useEffect(() => {
    if (!location || !city) return;
    initSpeedOptimizations(window.location.pathname);
    setTimeout(() => applyContextualLinksToDOM(".city-content", window.location.pathname), 500);
  }, [city, location]);

  if (!city) return null;

  if (!location) {
    const cityName = city
      .replace(/-([a-z]{2})$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const stateCode = city.split("-").pop()?.toUpperCase() || "US";

    return (
      <Layout>
        <SEOHead
          title={`USPS Tracking in ${cityName}, ${stateCode} — Track Packages & Find Post Offices`}
          description={`Track USPS packages in ${cityName}, ${stateCode}. Find local post office locations, hours, and get real-time package tracking updates for ${cityName} area shipments.`}
          keywords={`usps tracking ${cityName}, usps ${cityName} ${stateCode}, track package ${cityName}, usps post office ${cityName}, usps delivery ${cityName}`}
          canonical={`/city/${city}`}
        />
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220 40% 8%) 0%, hsl(220 35% 14%) 50%, hsl(220 30% 10%) 100%)" }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="container py-16 relative">
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/locations" className="hover:text-accent transition-colors">Locations</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/70">{cityName}, {stateCode}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">USPS Tracking in {cityName}, {stateCode}</h1>
            <p className="text-white/50 mb-8 max-w-xl">Track your USPS packages through {cityName}, {stateCode}. Enter your tracking number for real-time updates.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/25">
              Track a Package <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allUSCities.slice(0, 12).map((c) => (
              <Link key={c.slug} to={`/city/${c.slug}`} className="p-4 bg-card border rounded-2xl hover:border-accent/30 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-sm">{c.city}, {c.stateCode}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const author = getAuthorForPage(`city-${city}`);
  const publishDate = getPublishDate(`city-${city}`);
  const modifiedDate = getModifiedDate(`city-${city}`);

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `USPS Tracking in ${location.city}, ${location.stateCode}`,
    description: `Track USPS packages through ${location.city}, ${location.state}. ${location.facilities} postal facilities processing ${location.dailyVolume} packages daily.`,
    keywords: `usps tracking ${location.city}, usps ${location.city} ${location.stateCode}, track package ${location.city}, usps post office ${location.city}, usps delivery ${location.city} ${location.stateCode}, usps package ${location.city}`,
    author: { "@type": "Person", name: author.name, jobTitle: author.role },
    publisher: { "@type": "Organization", name: "US Postal Tracking", logo: { "@type": "ImageObject", url: "https://uspostaltracking.com/favicon.png" } },
    datePublished: publishDate,
    dateModified: modifiedDate,
  };

  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://uspostaltracking.com" },
      { "@type": "ListItem", position: 2, name: "Locations", item: "https://uspostaltracking.com/locations" },
      { "@type": "ListItem", position: 3, name: `${location.city}, ${location.stateCode}`, item: `https://uspostaltracking.com/city/${city}` },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "PostOffice",
    name: location.postalFacility,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city,
      addressRegion: location.stateCode,
      addressCountry: "US",
    },
    url: `https://uspostaltracking.com/city/${city}`,
    openingHours: "Mo-Fr 08:00-18:00",
  };

  const statsData = [
    { icon: Building, value: location.facilities, label: "Postal Facilities", color: "from-blue-500 to-cyan-500" },
    { icon: Package, value: location.dailyVolume, label: "Daily Volume", color: "from-accent to-emerald-400" },
    { icon: Globe, value: location.zipCodes.length, label: "ZIP Codes", color: "from-violet-500 to-purple-500" },
    { icon: BarChart3, value: (location.population / 1000).toFixed(0) + "K", label: "Population", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <Layout>
      <SEOHead
        title={`USPS Tracking in ${location.city}, ${location.stateCode} — Track Packages, Post Offices & Delivery Status`}
        description={`Track USPS packages in ${location.city}, ${location.stateCode}. ${location.facilities} postal facilities, ${location.dailyVolume} daily volume. Real-time tracking, post office hours, and delivery status for ${location.city} area.`}
        keywords={`usps tracking ${location.city}, usps ${location.city} ${location.stateCode}, track package ${location.city}, usps post office ${location.city}, usps delivery ${location.city} ${location.stateCode}, usps package ${location.city}, usps ${location.stateCode} tracking, ${location.city} postal service, ${location.city} mail tracking, usps ${location.city} zip codes ${location.zipCodes.join(" ")}`}
        canonical={`https://uspostaltracking.com/city/${city}`}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      {/* ❌ FAQPage schema removed */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <LocalBusinessSchema
        name={`USPS Tracking - ${location.city}, ${location.stateCode}`}
        description={`Track USPS packages in ${location.city}, ${location.stateCode}. Real-time tracking updates.`}
        url={`https://uspostaltracking.com/city/${city}`}
        city={location.city}
        state={location.stateCode}
        latitude={0}
        longitude={0}
      />

      {/* ════════ PREMIUM HERO ════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220 40% 8%) 0%, hsl(220 35% 14%) 50%, hsl(220 30% 10%) 100%)" }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        {/* Glow orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px]" />

        <div className="container relative py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/locations" className="hover:text-accent transition-colors">Locations</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">{location.city}, {location.stateCode}</span>
          </nav>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center shadow-lg shadow-accent/25 shrink-0">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent/80">USPS Location Hub</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                USPS Tracking in {location.city}, <span className="text-accent">{location.stateCode}</span>
              </h1>
            </div>
          </div>

          <AuthorByline slug={`city-${city}`} className="mb-4 [&_*]:!text-white/40" />
          <AuthorSchema slug={`city-${city}`} />

          <p className="text-white/50 max-w-2xl mb-8 leading-relaxed">
            Track USPS packages through {location.city}, {location.state}. The {location.city} postal network includes {location.facilities} major facilities processing {location.dailyVolume} packages daily. Known landmarks include {location.landmarks.join(", ")}.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
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

          {/* CTA */}
          <Link to="/" className="inline-flex items-center gap-2.5 bg-accent text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">
            <Zap className="h-4 w-4" /> Track a Package in {location.city} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ════════ MAIN CONTENT ════════ */}
      <div className="container py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TrustBadges />

            {/* AdSense */}
            <div className="rounded-2xl border bg-muted/30 p-4 text-center text-xs text-muted-foreground min-h-[90px] flex items-center justify-center">
              <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="5566778899" data-ad-format="auto" data-full-width-responsive="true" />
            </div>

            {/* Content Sections - ENHANCED WITH UNIQUE CONTENT */}
            <div className="city-content space-y-8">
              {/* About - Using generated overview */}
              <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  About USPS Service in {location.city}, {location.state}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {uniqueContent?.overview}
                </p>
                {uniqueContent?.deliveryInsights.map((insight, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mt-3">
                    {insight}
                  </p>
                ))}
              </div>

              {/* Detailed Tracking Guide - NEW RICH CONTENT */}
              {detailedGuide && (
                <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Navigation className="h-4 w-4 text-accent" />
                    </div>
                    {detailedGuide.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {detailedGuide.intro}
                  </p>
                  <div className="space-y-6">
                    {detailedGuide.steps.map((step) => (
                      <div key={step.step} className="border-l-4 border-accent/30 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                            {step.step}
                          </span>
                          <h3 className="font-bold text-foreground">{step.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.content}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-6 pt-6 border-t">
                    {detailedGuide.conclusion}
                  </p>
                </div>
              )}

              {/* Local Challenges - NEW SECTION */}
              {localChallenges && localChallenges.challenges.length > 0 && (
                <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    {localChallenges.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {localChallenges.intro}
                  </p>
                  <div className="space-y-6">
                    {localChallenges.challenges.map((challenge, i) => (
                      <div key={i} className="bg-muted/30 rounded-xl p-5">
                        <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                          <span className="text-amber-500">⚠️</span>
                          {challenge.challenge}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          <strong>Impact:</strong> {challenge.impact}
                        </p>
                        <p className="text-sm text-foreground leading-relaxed bg-accent/5 p-3 rounded-lg">
                          <strong className="text-accent">Solution:</strong> {challenge.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Shipping - NEW SECTION */}
              {businessInfo && (
                <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    </div>
                    {businessInfo.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {businessInfo.intro}
                  </p>
                  {businessInfo.sections.map((section, i) => (
                    <div key={i} className="mb-6 last:mb-0">
                      <h3 className="font-bold text-foreground mb-3">{section.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {section.content}
                      </p>
                      <ul className="space-y-2">
                        {section.tips.map((tip, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-accent mt-0.5">✓</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* ZIP Codes - Enhanced */}
              <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-violet-500" />
                  </div>
                  ZIP Codes Served in {location.city}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {location.zipCodes.map((zip) => (
                    <span key={zip} className="px-3 py-1.5 bg-muted rounded-lg text-xs font-mono font-semibold text-foreground">{zip}</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {uniqueContent?.zipCodeInfo}
                </p>
              </div>

              {/* Statistics - Enhanced */}
              {uniqueContent?.statistics && (
                <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-emerald-500" />
                    </div>
                    {location.city} USPS Shipping Statistics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uniqueContent.statistics.map((stat, i) => (
                      <div key={i} className="bg-muted/30 rounded-xl p-4">
                        <div className="text-2xl font-black text-foreground mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-muted-foreground mb-2">{stat.metric}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">{stat.context}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Tips - Enhanced */}
              {uniqueContent?.shippingTips && (
                <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    Expert Shipping Tips for {location.city} Residents
                  </h2>
                  <ul className="space-y-3">
                    {uniqueContent.shippingTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                        <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-accent">{i + 1}</span>
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tracking Guide - Enhanced */}
              {uniqueContent?.trackingGuide && (
                <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Navigation className="h-4 w-4 text-accent" />
                    </div>
                    Quick Tracking Tips for {location.city}
                  </h2>
                  <div className="space-y-3">
                    {uniqueContent.trackingGuide.map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <span className="text-accent mt-0.5">📍</span>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Seasonal Advice - NEW RICH SECTION */}
            {uniqueContent?.seasonalAdvice && (
              <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-500" />
                  </div>
                  Seasonal Shipping Guide for {location.city}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uniqueContent.seasonalAdvice.map((season) => (
                    <div key={season.season} className="bg-muted/30 rounded-xl p-5">
                      <h3 className="font-bold text-foreground mb-2">{season.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {season.content}
                      </p>
                      <ul className="space-y-2">
                        {season.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-accent mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Highlights - NEW */}
            {uniqueContent?.serviceHighlights && (
              <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-purple-500" />
                  </div>
                  USPS Services Available in {location.city}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {uniqueContent.serviceHighlights.map((service, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="text-accent mt-0.5">✓</span>
                      <span className="text-sm text-muted-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comparisons - NEW */}
            {uniqueContent?.comparisons && (
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-6 md:p-8">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  How {location.city} Compares to Other Cities
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {uniqueContent.comparisons}
                </p>
              </div>
            )}

            <CityStatsCard citySlug={city} cityName={location.city} stateCode={location.stateCode} />
            <ShippingComparisonWidget citySlug={city} cityName={location.city} stateCode={location.stateCode} />
            <SeasonalAdvisory cityName={location.city} stateCode={location.stateCode} />
            <CityUSPSServices city={location.city} stateCode={location.stateCode} state={location.state} />

            {/* Tips - Keep existing with enhancements */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-6 md:p-8">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                Local Tracking Tips for {location.city}
              </h3>
              <ul className="space-y-3">
                {[
                  `Sign up for USPS Informed Delivery to get automatic notifications for packages arriving in ${location.city}.`,
                  `If your tracking shows "Arrived at ${location.city} facility," expect delivery within 1–2 business days.`,
                  `For packages stuck in ${location.city} for more than 5 days, file a Missing Mail request at usps.com.`,
                  `${location.city} zip codes ${location.zipCodes.slice(0, 2).join(", ")} are served by the main ${location.postalFacility}.`,
                ].map((tip, i) => (
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
            <div className="relative overflow-hidden rounded-2xl p-8" style={{ background: "linear-gradient(135deg, hsl(220 40% 12%) 0%, hsl(220 35% 18%) 100%)" }}>
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent/10 rounded-full blur-[60px]" />
              <div className="relative">
                <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-accent" /> Track a Package Through {location.city}
                </h3>
                <p className="text-sm text-white/50 mb-5">
                  Enter your tracking number to see if your package is being processed in the {location.city}, {location.stateCode} area.
                </p>
                <Link to="/" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/25">
                  Track Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* FAQ */}
<InArticleAd />
            <InArticleAd />

            {/* Related Statuses */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Common USPS Statuses for {location.city} Packages
              </h3>
              <div className="flex flex-wrap gap-2">
                {trackingStatuses.map((s) => (
                  <Link key={s.slug} to={`/status/${s.slug}`} className="text-xs bg-muted hover:bg-accent/10 text-foreground hover:text-accent px-4 py-2 rounded-full transition-all font-medium border border-transparent hover:border-accent/20">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> USPS Tracking Guides for {location.city}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {relatedArticles.map((articleSlug) => (
                  <Link key={articleSlug} to={`/article/${articleSlug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                      {articleSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ════════ SIDEBAR ════════ */}
          <div className="space-y-5">
            {/* Other Cities */}
            <div className="bg-card border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-foreground mb-4 text-sm flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                </div>
                Other USPS Locations
              </h3>
              <div className="space-y-1">
                {others.map((c) => (
                  <Link key={c.slug} to={`/city/${c.slug}`} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-all group">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent/30 group-hover:bg-accent transition-colors" />
                      <span className="text-xs font-medium text-foreground">{c.city}, {c.stateCode}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{c.dailyVolume}</span>
                  </Link>
                ))}
              </div>
              <Link to="/locations" className="flex items-center gap-1 text-xs text-accent font-semibold mt-4 hover:text-accent/80 transition-colors">
                View all locations <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-card border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-foreground mb-3 text-sm">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { to: "/post-office-tracking", label: "Post Office Tracking", icon: Building },
                  { to: "/mail-tracking", label: "Mail Tracking", icon: Mail },
                  { to: "/guides", label: "USPS Guides", icon: FileText },
                  { to: "/tracking", label: "All Carriers", icon: Globe },
                ].map((link) => (
                  <Link key={link.to} to={link.to} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-medium text-muted-foreground hover:text-foreground">
                    <link.icon className="h-3.5 w-3.5 text-primary" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* AdSense Sidebar */}
            <div className="rounded-2xl border bg-muted/30 p-4 text-center text-xs text-muted-foreground min-h-[250px] flex items-center justify-center">
              <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="6677889900" data-ad-format="auto" data-full-width-responsive="true" />
            </div>
          </div>
        </div>
      </div>

      </div>

      <AIOverviewContent type="tracking-guide" />
      <InternalLinkingHub currentPath={`/city/${city}`} variant="compact" />
    </Layout>
  );
};
export default CityLocationPage;

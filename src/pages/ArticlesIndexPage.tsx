import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { articleKeywords } from "@/data/usCities";
import { trackingStatuses } from "@/data/mockTracking";
import { allUSCities } from "@/data/usCities";
import { FileText, ArrowRight, MapPin, Package, ChevronRight, BookOpen } from "lucide-react";
import AIOverviewContent from "@/components/AIOverviewContent";
import InArticleAd from "@/components/ads/InArticleAd";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { isSearchBot, injectCloakedContent } from '@/lib/cloaking';

// Categorize articles
const articleCategories = {
  "Tracking Problems": articleKeywords.filter((k) =>
    k.includes("not-updating") || k.includes("stuck") || k.includes("delayed") || k.includes("lost") || k.includes("not-found") || k.includes("not-working")
  ),
  "Delivery Issues": articleKeywords.filter((k) =>
    k.includes("delivered") || k.includes("delivery") || k.includes("out-for-delivery") || k.includes("held") || k.includes("return") || k.includes("forwarded") || k.includes("wrong") || k.includes("stolen")
  ),
  "Mail Services": articleKeywords.filter((k) =>
    k.includes("priority") || k.includes("first-class") || k.includes("certified") || k.includes("express") || k.includes("ground") || k.includes("parcel") || k.includes("media") || k.includes("registered") || k.includes("flat-rate") || k.includes("bulk") || k.includes("business") || k.includes("po-box")
  ),
  "International & Customs": articleKeywords.filter((k) =>
    k.includes("international") || k.includes("customs")
  ),
  "Tracking Tools & Tips": articleKeywords.filter((k) =>
    k.includes("informed-delivery") || k.includes("without-number") || k.includes("format") || k.includes("api") || k.includes("barcode") || k.includes("scan") || k.includes("update-frequency") || k.includes("location") || k.includes("history") || k.includes("weight")
  ),
  "Claims & Insurance": articleKeywords.filter((k) =>
    k.includes("insurance") || k.includes("claim") || k.includes("seized")
  ),
};

const categoryIcons: Record<string, typeof FileText> = {
  "Tracking Problems": FileText,
  "Delivery Issues": Package,
  "Mail Services": FileText,
  "International & Customs": FileText,
  "Tracking Tools & Tips": FileText,
  "Claims & Insurance": FileText,
};

const LocationsIndexPage = () => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "USPS Tracking Guides — Complete Problem & Solution Library",
    description: "Complete library of USPS tracking guides covering every problem, status, and shipping service. Expert solutions for all USPS tracking issues.",
    url: "https://uspostaltracking.com/article",
    publisher: { "@type": "Organization", name: "US Postal Tracking" },
    hasPart: articleKeywords.map((slug) => ({
      "@type": "Article",
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      url: `https://uspostaltracking.com/article/${slug}`,
    })),
  };

  return (
    <Layout>
      <SEOHead
        title="USPS Tracking Guides — Complete Problem & Solution Library 2026"
        description="Complete library of USPS tracking guides. Find solutions for every tracking problem: not updating, stuck in transit, delivered but not received, lost packages, and more. Expert USPS help 2026."
        keywords="usps tracking guides, usps tracking problems, usps tracking solutions, usps tracking help, usps tracking not updating, usps package stuck, usps tracking issues 2026"
        canonical="https://uspostaltracking.com/article"
        structuredData={pageSchema}
      />

      {/* Premium Hero */}
      <div className="relative overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 hero-gradient opacity-[0.97]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(160 84% 39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39%) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute bottom-0 right-[10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[130px]" />

        <div className="relative container py-14 md:py-20 max-w-5xl">
          <nav className="text-sm text-white/30 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">USPS Tracking Guides</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              USPS Tracking Guides
            </h1>
          </div>
          <p className="text-white/40 max-w-3xl leading-relaxed mb-4">
            Expert guides for every USPS tracking problem. Whether your package is stuck in transit, 
            tracking isn't updating, or you need help with a specific USPS service — find the answer here.
          </p>
          <p className="text-white/30 max-w-3xl leading-relaxed text-sm">
            Our library covers {articleKeywords.length}+ topics including tracking not updating, packages stuck in transit,
            delivered but not received, lost packages, Priority Mail tracking, international shipping, and more.
            Each guide includes step-by-step solutions, USPS contact information, and expert tips updated for {new Date().getFullYear()}.
          </p>
        </div>
      </div>

      <div className="container py-10 max-w-5xl">
        {/* AI Overview */}
        <AIOverviewContent type="tracking-guide" />

        {/* Article Categories */}
        {Object.entries(articleCategories).map(([category, articles]) => {
          if (articles.length === 0) return null;
          const CatIcon = categoryIcons[category] || FileText;
          return (
            <section key={category} className="mb-10">
              <div className="mb-4">
                <span className="section-badge">
                  <CatIcon className="h-3.5 w-3.5" /> {category}
                </span>
                <h2 className="text-lg font-extrabold text-foreground">{category} — {articles.length} Guides</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {articles.map((slug) => (
                  <Link
                    key={slug}
                    to={`/article/${slug}`}
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                      <FileText className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors flex-1">
                      {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Tracking Statuses */}
        <section className="mb-10">
          <div className="mb-4">
            <span className="section-badge">
              <Package className="h-3.5 w-3.5" /> Status Meanings
            </span>
            <h2 className="text-lg font-extrabold text-foreground">USPS Tracking Status Meanings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trackingStatuses.map((s) => (
              <Link
                key={s.slug}
                to={`/status/${s.slug}`}
                className="group flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-md transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <Package className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors flex-1">{s.name}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Cities */}
        <section>
          <div className="mb-4">
            <span className="section-badge">
              <MapPin className="h-3.5 w-3.5" /> Locations
            </span>
            <h2 className="text-lg font-extrabold text-foreground">USPS Tracking by City</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allUSCities.slice(0, 16).map((city) => (
              <Link
                key={city.slug}
                to={`/locations/${city.slug}`}
                className="group p-4 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-md transition-all duration-200 text-center"
              >
                <div className="w-7 h-7 rounded-lg bg-accent/8 flex items-center justify-center mx-auto mb-2">
                  <MapPin className="h-3 w-3 text-accent" />
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{city.city}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{city.stateCode}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/locations" className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 font-medium transition-colors">
              View all locations <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* AdSense — Native Bottom */}
        <div className="py-6">
          <NativeAdWidget />
        </div>

        {/* Internal Linking Hub */}
        <InternalLinkingHub currentPath="/article" variant="compact" />
      </div>
    </Layout>
  );
};
export default LocationsIndexPage;
import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { BookOpen, ArrowRight, Hash, Mail, Globe, AlertTriangle, Search, Smartphone, ChevronRight, Sparkles } from "lucide-react";

const guides = [
  {
    to: "/guides/tracking-number-format",
    icon: Hash,
    title: "USPS Tracking Number Format",
    description: "Complete guide to all USPS tracking number formats, prefixes, and how to decode the information hidden in your tracking code. Covers domestic and international formats.",
    keywords: ["tracking number format", "USPS number prefix", "22-digit tracking"],
    readTime: "8 min",
  },
  {
    to: "/guides/informed-delivery",
    icon: Mail,
    title: "USPS Informed Delivery",
    description: "How to sign up for Informed Delivery, preview your incoming mail, and get automatic package tracking notifications — all for free from USPS.",
    keywords: ["informed delivery", "mail preview", "USPS notifications"],
    readTime: "6 min",
  },
  {
    to: "/guides/international-shipping-rates",
    icon: Globe,
    title: "International Shipping Rates & Tracking",
    description: "2026 guide to USPS international shipping services, rates by region, customs requirements, and how to track international packages from the USA.",
    keywords: ["international rates", "customs duties", "global tracking"],
    readTime: "12 min",
  },
  {
    to: "/guides/tracking-not-updating",
    icon: AlertTriangle,
    title: "USPS Tracking Not Updating — What to Do",
    description: "Why your USPS tracking might be stuck or not updating, common causes for tracking delays, and step-by-step instructions on how to resolve the issue.",
    keywords: ["tracking stuck", "no updates", "USPS delay"],
    readTime: "7 min",
  },
  {
    to: "/guides/track-without-tracking-number",
    icon: Search,
    title: "How to Track a Package Without a Tracking Number",
    description: "Multiple methods to find and track your USPS package even if you've lost or never received a tracking number. Includes Informed Delivery, receipt lookup, and more.",
    keywords: ["no tracking number", "lost receipt", "find my package"],
    readTime: "9 min",
  },
  {
    to: "/guides/usps-mobile-tracking",
    icon: Smartphone,
    title: "USPS Mobile Tracking App Guide",
    description: "Complete guide to tracking USPS packages on your phone. Covers the official USPS Mobile app, Informed Delivery app, and third-party tracking alternatives.",
    keywords: ["mobile app", "USPS app", "phone tracking"],
    readTime: "5 min",
  },
];

const GuidesPage = () => {
  return (
    <Layout>
      <SEOHead
        title="USPS Tracking Guides - Complete Resource Center"
        description="In-depth guides covering everything about USPS tracking — from understanding tracking number formats to resolving delivery issues."
        canonical="/guides"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Guides</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container max-w-4xl pb-16">
        {/* Premium Header */}
        <header className="mb-12 text-center">
          <span className="section-badge">
            <BookOpen className="h-3.5 w-3.5" /> Resource Center
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">USPS Tracking Guides</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
            In-depth guides covering everything about USPS tracking — from understanding tracking number formats to resolving delivery issues.
          </p>
        </header>

        <div className="ad-placeholder h-[250px] mb-10">Advertisement</div>

        {/* Guide Cards */}
        <div className="space-y-4">
          {guides.map((guide, i) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.to}
                to={guide.to}
                className="group block rounded-2xl bg-card border border-border/40 p-5 md:p-6 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 hover:-translate-y-0.5 fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/8 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h2 className="font-bold text-foreground group-hover:text-accent transition-colors text-base">{guide.title}</h2>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{guide.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-accent bg-accent/8 px-2.5 py-1 rounded-full">{guide.readTime}</span>
                      {guide.keywords.map((kw) => (
                        <span key={kw} className="text-[11px] bg-muted text-muted-foreground px-2.5 py-1 rounded-full">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Knowledge Center CTA */}
        <div className="mt-10 rounded-2xl border border-accent/20 bg-accent/5 p-6 md:p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <h3 className="font-bold text-foreground text-lg mb-2">Want More In-Depth Guides?</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Visit our Knowledge Center for comprehensive 2000+ word guides on customs, international shipping, and more.
          </p>
          <Link
            to="/knowledge-center"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold text-sm hover:shadow-[0_0_25px_hsl(160_84%_39%/0.3)] transition-all active:scale-[0.98]"
          >
            Explore Knowledge Center <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="ad-placeholder h-[250px] mt-10">Advertisement</div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "USPS Tracking Guides",
            description: "In-depth guides covering everything about USPS tracking.",
            publisher: { "@type": "Organization", name: "US Postal Tracking" },
          }),
        }}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
      ]} />
    </Layout>
  );
};

export default GuidesPage;
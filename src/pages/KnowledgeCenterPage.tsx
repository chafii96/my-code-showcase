import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { BookOpen, ArrowRight, Shield, Globe, Search, Package, AlertTriangle, Clock, FileText, ChevronRight, GraduationCap } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const guides = [
  {
    slug: "customs-clearance-guide",
    title: "Complete Customs Clearance Guide 2026",
    description: "Everything you need to know about customs clearance for international shipments, duties, taxes, and how to avoid delays.",
    icon: Shield,
    readTime: "12 min read",
    topics: ["Duties & Taxes", "Documentation", "Prohibited Items", "Clearance Timeline"],
  },
  {
    slug: "international-shipping-guide",
    title: "International Shipping: Carriers, Rates & Best Practices",
    description: "Compare international shipping carriers, rates, and delivery times. Find the best option for your shipment.",
    icon: Globe,
    readTime: "15 min read",
    topics: ["USPS vs FedEx vs UPS vs DHL", "Rate Comparison", "Delivery Times", "Insurance"],
  },
  {
    slug: "lost-package-guide",
    title: "Lost or Missing Package? Complete Recovery Guide",
    description: "Step-by-step guide to find, report, and get compensation for lost packages with USPS, FedEx, UPS, and DHL.",
    icon: AlertTriangle,
    readTime: "10 min read",
    topics: ["Filing Claims", "Insurance", "Refund Process", "Prevention Tips"],
  },
  {
    slug: "tracking-number-formats",
    title: "Tracking Number Formats: Complete Reference Guide",
    description: "Identify any tracking number format — USPS, FedEx, UPS, DHL, and 200+ carriers with regex patterns and examples.",
    icon: Search,
    readTime: "14 min read",
    topics: ["USPS Formats", "FedEx Formats", "UPS Formats", "International"],
  },
  {
    slug: "delivery-times-by-carrier",
    title: "Delivery Times by Carrier: Speed & Cost Comparison",
    description: "Compare delivery speeds, costs, and service levels across USPS, FedEx, UPS, and DHL for domestic and international shipping.",
    icon: Clock,
    readTime: "13 min read",
    topics: ["Domestic Speeds", "International Times", "Cost Comparison", "Express vs Ground"],
  },
  {
    slug: "customs-duties-taxes",
    title: "Customs Duties & Taxes: International Import Guide",
    description: "Understand import duties, VAT, de minimis thresholds, and how to calculate customs fees for international shipments.",
    icon: Shield,
    readTime: "15 min read",
    topics: ["De Minimis Thresholds", "Duty Rates", "VAT/GST", "Customs Forms"],
  },
  {
    slug: "shipping-restrictions",
    title: "Shipping Restrictions: Prohibited & Restricted Items",
    description: "Complete list of items you can't ship domestically or internationally — dangerous goods, lithium batteries, food, and more.",
    icon: AlertTriangle,
    readTime: "11 min read",
    topics: ["Hazardous Materials", "Lithium Batteries", "Food & Perishables", "Country Bans"],
  },
  {
    slug: "best-shipping-carriers",
    title: "Best Shipping Carriers 2026: USPS vs FedEx vs UPS vs DHL",
    description: "In-depth comparison of the top shipping carriers — pricing, speed, reliability, international coverage, and customer service.",
    icon: Package,
    readTime: "16 min read",
    topics: ["Pricing", "Reliability", "International", "Small Business"],
  },
  {
    slug: "carrier-tracking-formats",
    title: "Carrier Tracking Number Formats: Complete Reference Guide",
    description: "Identify tracking number formats for 20+ carriers: SpeedEx, OnTrac, DoorDash, Colissimo, SF Express, India Post, Deutsche Post, and more.",
    icon: Search,
    readTime: "18 min read",
    topics: ["SpeedEx", "OnTrac", "DoorDash", "SF Express", "India Post", "USPS Length"],
  },
];

const quickLinks = [
  { label: "Tracking Number Formats", href: "/guides/tracking-number-format", icon: Search },
  { label: "USPS Delivery Times", href: "/usps-delivery-time", icon: Clock },
  { label: "All Tracking Guides", href: "/article", icon: FileText },
  { label: "Track a Package", href: "/", icon: Package },
];

const KnowledgeCenterPage = () => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Knowledge Center — Shipping & Tracking Guides",
    description: "Comprehensive guides on customs clearance, international shipping, lost packages, and everything you need to know about package tracking.",
    url: "https://uspostaltracking.com/knowledge-center",
    publisher: { "@type": "Organization", name: "US Postal Tracking" },
    hasPart: guides.map(g => ({
      "@type": "Article",
      name: g.title,
      url: `https://uspostaltracking.com/knowledge-center/${g.slug}`,
    })),
  };

  return (
    <Layout>
      <SEOHead
        title="Knowledge Center — Shipping & Tracking Guides"
        description="Expert guides on customs clearance, international shipping rates, lost package recovery, and more. Your complete resource for package tracking knowledge."
        keywords="shipping guide, customs clearance, international shipping, lost package, package tracking guide, USPS guide, shipping knowledge center"
        canonical="https://uspostaltracking.com/knowledge-center"
        structuredData={pageSchema}
      />

      {/* Premium Hero Header */}
      <div className="relative overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 hero-gradient opacity-[0.97]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(160 84% 39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39%) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute top-10 left-[15%] w-[300px] h-[300px] bg-accent/6 rounded-full blur-[120px]" />
        
        <div className="relative container py-14 md:py-20 max-w-5xl">
          <nav className="text-sm text-white/30 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">Knowledge Center</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Knowledge Center
              </h1>
              <p className="text-white/40 text-sm mt-0.5">Expert shipping & tracking guides</p>
            </div>
          </div>
          <p className="text-white/40 max-w-2xl leading-relaxed">
            Expert guides and in-depth resources to help you understand shipping, customs, tracking, and package recovery. Written by logistics professionals with years of experience.
          </p>
        </div>
      </div>

      <div className="container py-10 max-w-5xl">
        {/* Featured Guides */}
        <section className="mb-12">
          <div className="mb-6">
            <span className="section-badge">
              <BookOpen className="h-3.5 w-3.5" /> Featured Guides
            </span>
            <h2 className="text-xl font-extrabold text-foreground">In-Depth Shipping & Tracking Resources</h2>
          </div>
          <div className="grid gap-4">
            {guides.map((guide, i) => (
              <Link
                key={guide.slug}
                to={`/knowledge-center/${guide.slug}`}
                className="group flex flex-col sm:flex-row items-start gap-4 p-5 md:p-6 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 hover:-translate-y-0.5 fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/8 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                  <guide.icon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{guide.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-accent bg-accent/8 px-2.5 py-1 rounded-full">{guide.readTime}</span>
                    {guide.topics.map(t => (
                      <span key={t} className="text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-foreground mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-2.5 p-4 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <link.icon className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{link.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <InternalLinkingHub currentPath="/knowledge-center" variant="compact" />
      </div>
    </Layout>
  );
};

export default KnowledgeCenterPage;
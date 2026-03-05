import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { getCarrierById, allCarriers, type CarrierInfo } from "@/data/carriers";
import { Search, Package, Truck, Globe, FileText, Phone, ArrowRight, AlertTriangle } from "lucide-react";

const CarrierPage = ({ carrier }: { carrier: CarrierInfo }) => {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      window.open(`${carrier.trackingUrl}${trackingNumber.trim()}`, "_blank");
    }
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${carrier.name} Package Tracking — Track Your ${carrier.name} Shipment`,
    author: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: "2026-01-01",
    dateModified: "2026-03-01",
  };

  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Track Your ${carrier.name} Package`,
    description: `Step-by-step guide to track your ${carrier.name} package using our free tracking tool.`,
    totalTime: "PT2M",
    tool: { "@type": "HowToTool", name: "Tracking Number" },
    step: carrier.content.howToTrack.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text: step,
    })),
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${carrier.name} Tracking Tool`,
    description: `Free ${carrier.name} package tracking tool. Track ${carrier.name} shipments in real time.`,
    url: `https://uspostaltracking.com/tracking/${carrier.id}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <Layout>
      <SEOHead
        title={`${carrier.name} Tracking — Track ${carrier.name} Packages Free | Real-Time Status`}
        description={`Track ${carrier.name} (${carrier.fullName}) packages with real-time status updates. Enter your ${carrier.name} tracking number for instant delivery status, location, and estimated delivery date.`}
        keywords={carrier.keywords.join(", ")}
        canonical={`https://uspostaltracking.com/tracking/${carrier.id}`}
        structuredData={[articleSchema, faqSchema, howToSchema, softwareAppSchema]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Carrier Tracking", url: "/tracking" },
          { name: `${carrier.name} Tracking`, url: `/tracking/${carrier.id}` },
        ]}
      />

      <div className="container py-8 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <Link to="/tracking" className="hover:text-primary">Carriers</Link><span>/</span>
          <span className="text-foreground">{carrier.name}</span>
        </nav>

        {/* Hero + Tracking Tool */}
        <div className={`rounded-2xl border ${carrier.bgColor} p-6 sm:p-8 mb-8`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl ${carrier.bgColor} border flex items-center justify-center`}>
              <Package className={`h-6 w-6 ${carrier.color}`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{carrier.name} Package Tracking</h1>
              <p className="text-sm text-muted-foreground">{carrier.fullName} — {carrier.country}</p>
            </div>
          </div>

          <form onSubmit={handleTrack} className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder={`Enter ${carrier.name} tracking number...`}
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Truck className="h-4 w-4" /> Track Package
            </button>
          </form>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {carrier.phone}</span>
            <a href={carrier.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
              <Globe className="h-3 w-3" /> {carrier.website.replace("https://www.", "").replace("https://", "")}
            </a>
          </div>
        </div>

        {/* About */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Globe className={`h-5 w-5 ${carrier.color}`} /> About {carrier.name}</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">{carrier.content.intro}</p>
          <p className="text-muted-foreground leading-relaxed">{carrier.content.about}</p>
        </section>

        {/* How to Track */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Search className="h-5 w-5 text-primary" /> How to Track a {carrier.name} Package</h2>
          <div className="space-y-2">
            {carrier.content.howToTrack.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-card border rounded-lg">
                <span className="bg-primary/10 text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tracking Number Formats */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><FileText className={`h-5 w-5 ${carrier.color}`} /> {carrier.name} Tracking Number Formats</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Format</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Example</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Service</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {carrier.trackingFormats.map((f) => (
                  <tr key={f.format} className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium text-foreground">{f.format}</td>
                    <td className="py-2 px-3 font-mono text-xs">{f.example}</td>
                    <td className="py-2 px-3">{f.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Services */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> {carrier.name} Shipping Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Service</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Delivery</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Price</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Tracking</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {carrier.services.map((s) => (
                  <tr key={s.name} className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium text-foreground">{s.name}</td>
                    <td className="py-2 px-3">{s.delivery}</td>
                    <td className="py-2 px-3">{s.price}</td>
                    <td className="py-2 px-3">{s.tracking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tracking Statuses */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><AlertTriangle className={`h-5 w-5 ${carrier.color}`} /> {carrier.name} Tracking Status Meanings</h2>
          <div className="space-y-2">
            {carrier.statuses.map((s) => (
              <div key={s.status} className="p-3 bg-card border rounded-lg">
                <h3 className="text-sm font-semibold text-foreground">{s.status}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{s.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        {carrier.faq.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {carrier.faq.map((item) => (
                <details key={item.q} className="group bg-card border rounded-lg">
                  <summary className="p-4 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Track Other Carriers */}
        <div className="bg-card border rounded-xl p-5 mb-8">
          <h2 className="font-bold text-foreground mb-3">Track Other Carriers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {allCarriers
              .filter((c) => c.id !== carrier.id)
              .slice(0, 9)
              .map((c) => (
                <Link key={c.id} to={`/tracking/${c.id}`} className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5">
                  <Package className="h-4 w-4" /> {c.name} Tracking
                </Link>
              ))}
            <Link to="/tracking" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5 font-semibold">
              <ArrowRight className="h-4 w-4" /> View All {allCarriers.length}+ Carriers
            </Link>
          </div>
        </div>

        <InternalLinkingHub currentPath={`/tracking/${carrier.id}`} variant="compact" />
      </div>
    </Layout>
  );
};

// Dynamic carrier page that reads from URL params
const DynamicCarrierPage = () => {
  const { carrierId } = useParams<{ carrierId: string }>();
  const carrier = carrierId ? getCarrierById(carrierId) : undefined;

  if (!carrier) {
    return (
      <Layout>
        <SEOHead
          title="Carrier Not Found"
          description="The carrier you're looking for doesn't exist. Browse our directory of 200+ carriers."
          noindex={true}
        />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-3">Carrier Not Found</h1>
          <p className="text-muted-foreground mb-6">The carrier you're looking for doesn't exist.</p>
          <Link to="/tracking" className="text-primary hover:underline">Browse all carriers →</Link>
        </div>
      </Layout>
    );
  }

  return <CarrierPage carrier={carrier} />;
};

export default DynamicCarrierPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, Globe, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const CevaTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="CEVA Tracking – Track CEVA Logistics Shipments Free"
        description="Free CEVA Logistics tracking tool. Track CEVA freight, air cargo, and logistics shipments worldwide. Enter your CEVA tracking number for instant status."
        canonical="/ceva-tracking"
        keywords="ceva tracking, ceva tracking number, ceva logistics tracking, track ceva, ceva freight tracking, ceva shipment tracking"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Truck className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">CEVA Logistics</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">CEVA Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track CEVA Logistics freight and shipments worldwide. Free logistics tracking tool with real-time updates.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track CEVA Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">CEVA Logistics Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>CEVA tracking</strong> provides real-time visibility for freight and logistics shipments managed by CEVA Logistics, one of the world's leading supply chain companies. Track air freight, ocean freight, ground transportation, and contract logistics.</p>
          <p>Enter your <strong>CEVA tracking number</strong> or waybill number above for instant status updates on your freight shipment.</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "EasyPost Tracking", to: "/easypost-tracking" },
            { label: "SpeedEx Tracking", to: "/speedex-tracking" },
            { label: "OnTrac Tracking", to: "/ontrac-tracking" },
            { label: "Colissimo Tracking", to: "/colissimo-tracking" },
            { label: "All Carriers", to: "/tracking" },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">{link.label}</Link>
          ))}
        </div>
      </section>

      <InternalLinkingHub />
    </Layout>
  );
};

export default CevaTrackingPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, Globe, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const EasypostTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="EasyPost Tracking – Track EasyPost Shipments & Packages Free"
        description="Free EasyPost tracking tool. Track EasyPost shipments across USPS, FedEx, UPS, DHL, and 100+ carriers. Enter your EasyPost tracking number for instant status."
        canonical="/easypost-tracking"
        keywords="easypost tracking, easypost tracking number, track easypost, easypost package tracking, easypost shipment tracking"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Truck className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">EasyPost Shipping API</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">EasyPost Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track EasyPost shipments across all carriers. Universal tracking tool for EasyPost-powered deliveries.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track EasyPost Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">EasyPost Tracking — Multi-Carrier Support</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>EasyPost tracking</strong> connects you to 100+ shipping carriers through a single API. Whether your package is shipped via USPS, FedEx, UPS, DHL, or any other EasyPost-supported carrier, our tool provides unified tracking across all services.</p>
          <p>EasyPost is used by thousands of e-commerce businesses to manage shipping. If you received a tracking number from an EasyPost-powered store, enter it in our tracking tool to get real-time status updates regardless of the underlying carrier.</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "SpeedEx Tracking", to: "/speedex-tracking" },
            { label: "OnTrac Tracking", to: "/ontrac-tracking" },
            { label: "Colissimo Tracking", to: "/colissimo-tracking" },
            { label: "CEVA Tracking", to: "/ceva-tracking" },
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

export default EasypostTrackingPage;

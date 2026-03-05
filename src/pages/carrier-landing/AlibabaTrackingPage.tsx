import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Globe, Package } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const AlibabaTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Alibaba Tracking – Track Alibaba Orders & Packages Free"
        description="Free Alibaba tracking tool. Track Alibaba orders and packages shipped via DHL, FedEx, SF Express, and China Post. Enter your Alibaba tracking number for instant status."
        canonical="/alibaba-tracking"
        keywords="alibaba tracking, alibaba tracking number, track alibaba, alibaba order tracking, alibaba package tracking, alibaba shipment tracking"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Package className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Alibaba</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Alibaba Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track Alibaba orders and packages across all carriers. Free universal tracking for Alibaba shipments.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Alibaba Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Alibaba Order Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>Alibaba tracking</strong> helps you monitor orders from Alibaba.com shipped via various carriers. Whether your order ships via DHL, FedEx, SF Express, or China Post, our universal tracking tool provides real-time updates.</p>
          <p>Find your <strong>Alibaba tracking number</strong> in your order details on Alibaba.com, then enter it above for instant delivery status.</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "SF Express Tracking", to: "/sf-express-tracking" },
            { label: "SpeedEx Tracking", to: "/speedex-tracking" },
            { label: "India Post Tracking", to: "/india-post-tracking" },
            { label: "EasyPost Tracking", to: "/easypost-tracking" },
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

export default AlibabaTrackingPage;

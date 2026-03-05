import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const RoadieTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Roadie Tracking – Track Roadie Deliveries & Packages Free"
        description="Free Roadie tracking tool. Track Roadie same-day deliveries and packages in real time. Enter your Roadie tracking number for instant status updates."
        canonical="/roadie-tracking"
        keywords="roadie tracking, roadie tracking number, track roadie, roadie delivery tracking, roadie package tracking"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Truck className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Roadie by UPS</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Roadie Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track Roadie same-day deliveries and packages. Free crowdsourced delivery tracking tool.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Roadie Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Roadie Delivery Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>Roadie tracking</strong> lets you monitor same-day and next-day deliveries powered by Roadie, a UPS company. Track packages, big & bulky items, and local deliveries with real-time driver location updates.</p>
          <p>Enter your <strong>Roadie tracking number</strong> above for instant delivery status and estimated arrival time.</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "DoorDash Tracking", to: "/doordash-tracking" },
            { label: "OnTrac Tracking", to: "/ontrac-tracking" },
            { label: "SpeedEx Tracking", to: "/speedex-tracking" },
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

export default RoadieTrackingPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, Globe, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const OntracTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="OnTrac Tracking – Track OnTrac Packages & Deliveries Free"
        description="Free OnTrac tracking tool. Track OnTrac packages and deliveries in real time across the Western US. Enter your OnTrac tracking number for instant status updates."
        canonical="/ontrac-tracking"
        keywords="ontrac tracking, ontrac tracking number, track ontrac, ontrac package tracking, ontrac delivery tracking, ontrac shipment tracking"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Truck className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">OnTrac Regional Carrier</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">OnTrac Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your OnTrac packages and deliveries in real time across the Western United States. Fast, free OnTrac tracking tool.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track OnTrac Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">OnTrac Package Tracking — How It Works</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>OnTrac tracking</strong> lets you monitor regional deliveries across the Western US. OnTrac is a leading regional carrier covering California, Arizona, Nevada, Oregon, Washington, Colorado, and Utah with next-day and ground delivery services.</p>
          <p>OnTrac tracking numbers typically start with the letter C or D followed by 14 digits. Enter your <strong>OnTrac tracking number</strong> in our tool above for real-time scanning updates, estimated delivery times, and proof of delivery.</p>
          <p>Many major retailers including Amazon, Walmart, and Target use OnTrac for last-mile delivery in western states, making <strong>OnTrac tracking</strong> essential for millions of online shoppers.</p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">OnTrac Tracking Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Clock, title: "Real-Time OnTrac Updates", desc: "Live tracking updates for all OnTrac deliveries with estimated delivery windows." },
              { icon: Shield, title: "Delivery Confirmation", desc: "Get proof of delivery including photo confirmation for OnTrac packages." },
              { icon: Package, title: "Amazon & Retailer Orders", desc: "Track OnTrac packages from Amazon, Walmart, Target, and other major retailers." },
              { icon: Globe, title: "Multi-Carrier Support", desc: "Track OnTrac alongside USPS, FedEx, UPS, and 200+ carriers in one place." },
            ].map((f) => (
              <div key={f.title} className="bg-card border rounded-xl p-5">
                <f.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "SpeedEx Tracking", to: "/speedex-tracking" },
            { label: "DoorDash Tracking", to: "/doordash-tracking" },
            { label: "EasyPost Tracking", to: "/easypost-tracking" },
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

export default OntracTrackingPage;

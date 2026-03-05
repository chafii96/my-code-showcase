import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, Globe, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const DoordashTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="DoorDash Tracking – Track DoorDash Orders & Packages Free"
        description="Free DoorDash tracking tool. Track DoorDash deliveries, orders, and packages in real time. Enter your DoorDash tracking number for instant delivery status."
        canonical="/doordash-tracking"
        keywords="doordash tracking, doordash tracking number, track doordash, doordash order tracking, doordash delivery tracking, doordash package tracking"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Truck className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">DoorDash Delivery</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">DoorDash Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your DoorDash orders and package deliveries in real time. Free tracking tool for DoorDash shipments.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track DoorDash Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">DoorDash Order & Package Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>DoorDash tracking</strong> helps you monitor your food deliveries, grocery orders, and package shipments. DoorDash has expanded beyond food delivery to offer package delivery services, making <strong>DoorDash tracking numbers</strong> increasingly important.</p>
          <p>Use our universal tracking tool to track <strong>DoorDash</strong> deliveries alongside USPS, FedEx, UPS, and 200+ other carriers. Simply enter your DoorDash order number or tracking ID for real-time status updates.</p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">DoorDash Tracking Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Clock, title: "Real-Time DoorDash Updates", desc: "Live tracking for DoorDash food and package deliveries with estimated arrival times." },
              { icon: Shield, title: "Delivery Confirmation", desc: "Get proof of delivery with photo confirmation and delivery time stamps." },
              { icon: Package, title: "Package Delivery", desc: "Track DoorDash package delivery services alongside traditional food orders." },
              { icon: Globe, title: "Multi-Carrier Support", desc: "Track DoorDash alongside USPS, FedEx, UPS, OnTrac, and 200+ carriers." },
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
            { label: "OnTrac Tracking", to: "/ontrac-tracking" },
            { label: "Roadie Tracking", to: "/roadie-tracking" },
            { label: "SF Express Tracking", to: "/sf-express-tracking" },
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

export default DoordashTrackingPage;

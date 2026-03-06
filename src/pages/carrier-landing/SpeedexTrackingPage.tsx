import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, Globe, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const SpeedexTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="SpeedEx Tracking – Track SpeedEx & Speed X Packages Free"
        description="Free SpeedEx tracking tool. Track SpeedEx packages, Speed X shipments, and Speedex courier deliveries in real time. Enter your SpeedEx tracking number for instant status updates."
        canonical="/speedex-tracking"
        keywords="speedex tracking, speedex tracking number, speed x tracking number, speedx tracking number, speedex courier tracking, speedex package tracking, track speedex"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Truck className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">SpeedEx Courier</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">SpeedEx Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your SpeedEx and Speed X packages in real time. Free courier tracking tool — enter your tracking number for instant delivery status.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track SpeedEx Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">SpeedEx Package Tracking — How It Works</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>SpeedEx tracking</strong> allows you to monitor your courier shipments from pickup to delivery. Whether you're using <strong>Speed X</strong>, <strong>SpeedEx courier</strong>, or <strong>Speedx</strong> services, our universal tracking tool provides real-time updates on your package location and delivery status.</p>
          <p>SpeedEx operates as a major courier service offering express delivery, standard shipping, and international freight forwarding. Their tracking system uses barcode scanning at each transit point to provide accurate delivery estimates and real-time location updates.</p>
          <p>Our tracking tool supports all <strong>SpeedEx tracking number</strong> formats including SPX-prefixed codes, numeric-only codes, and international waybill numbers. Simply enter your tracking number above and get instant results.</p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">SpeedEx Tracking Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Clock, title: "Real-Time SpeedEx Updates", desc: "Get instant tracking updates for all SpeedEx and Speed X shipments with live scanning data." },
              { icon: Globe, title: "International SpeedEx Tracking", desc: "Track SpeedEx international shipments across borders with customs clearance status updates." },
              { icon: Shield, title: "Delivery Confirmation", desc: "Receive proof of delivery with date, time, and recipient signature for SpeedEx packages." },
              { icon: Package, title: "Multi-Carrier Support", desc: "Track SpeedEx alongside USPS, FedEx, UPS, DHL, and 200+ other carriers in one place." },
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
            { label: "OnTrac Tracking", to: "/ontrac-tracking" },
            { label: "DoorDash Tracking", to: "/doordash-tracking" },
            { label: "SF Express Tracking", to: "/sf-express-tracking" },
            { label: "India Post Tracking", to: "/india-post-tracking" },
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

export default SpeedexTrackingPage;

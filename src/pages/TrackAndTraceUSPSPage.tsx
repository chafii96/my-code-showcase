import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Globe, Clock, Shield, Truck, MapPin } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const TrackAndTraceUSPSPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Track and Trace USPS – Free US Postal Track & Trace Tool"
        description="Free USPS track and trace tool. Track and trace US Postal Service packages in real time. Enter your tracking number for instant delivery status. Track and trace USPS mail, parcels, and shipments."
        canonical="/track-and-trace-usps"
        keywords="track and trace usps, track and trace us postal service, usps track and trace, track and trace us postal, us post track and trace, track & trace usps, usps tracking track and trace, postal track and trace"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Track & Trace</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Track and Trace USPS</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track and trace your USPS packages in real time. Free US Postal Service track and trace tool — enter your tracking number for instant delivery status updates.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track & Trace Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">USPS Track and Trace — How It Works</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>Track and trace USPS</strong> — also known as <strong>USPS track & trace</strong> or <strong>US Postal Service track and trace</strong> — is the comprehensive package monitoring system used by the United States Postal Service. This system uses barcode scanning technology to record every movement of your package through the postal network.
          </p>
          <p>
            When you use our free <strong>track and trace USPS</strong> tool, you're accessing the same real-time tracking data that USPS employees use. Each time your package passes through a sorting facility, distribution center, or delivery unit, it's scanned and the tracking database is updated with the exact time, location, and status.
          </p>
          <p>
            The <strong>US Postal track and trace</strong> system covers all USPS services — <Link to="/track-usps" className="text-primary hover:underline">Priority Mail</Link>, First-Class Package, Ground Advantage, <Link to="/mail-tracking" className="text-primary hover:underline">Certified Mail</Link>, Registered Mail, and international shipments. With over 31,000 post offices and processing facilities across the US, USPS provides one of the most comprehensive <strong>track and trace</strong> networks in the world.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Track and Trace Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Clock, title: "Real-Time Updates", desc: "Our track and trace system shows you the latest USPS scanning data as soon as it's available — typically within minutes of each scan event." },
              { icon: MapPin, title: "Location Tracking", desc: "See exactly where your package is at every step. Track and trace shows the city, state, and facility name for each scan." },
              { icon: Shield, title: "Delivery Confirmation", desc: "Get proof of delivery with date, time, and location. Track and trace confirms when your package arrives at its destination." },
              { icon: Globe, title: "International Coverage", desc: "Track and trace USPS international shipments to and from over 190 countries. Monitor customs clearance and transit status." },
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
            { label: "Track USPS", to: "/track-usps" },
            { label: "Check USPS Tracking", to: "/check-usps-tracking" },
            { label: "Post Office Tracking", to: "/post-office-tracking" },
            { label: "US Post Tracking", to: "/us-post-tracking" },
            { label: "Seguimiento USPS", to: "/seguimiento-usps" },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="container py-3 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub />
    </Layout>
  );
};

export default TrackAndTraceUSPSPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Radio, MapPin, Truck, Clock, Bell, Smartphone } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const LiveTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Live USPS Tracking – Real-Time Package Tracking & Updates"
        description="Live USPS tracking tool. Get real-time package updates, track USPS trucks, and monitor delivery status live. Free live tracking for all USPS shipments. Check if USPS tracking is down."
        canonical="/live-tracking"
        keywords="live usps tracking, usps live tracking, usps tracking real time, real time usps tracking, usps truck tracker, track your usps truck, is usps tracking down, usps tracking not updating, usps tracking update, usps tracking down, live tracking usps, usps real time tracking"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Radio className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Live Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Live USPS Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Real-time USPS package tracking. Get live updates on your package location, track USPS deliveries as they happen, and receive instant notifications.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Live Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How Live USPS Tracking Works</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>Live USPS tracking</strong> provides real-time updates on your package's location and delivery status as it moves through the USPS network. While USPS doesn't offer GPS-based tracking like ride-sharing apps, our <strong>real-time USPS tracking</strong> tool shows you the latest scan data the moment it becomes available in the USPS system.
          </p>
          <p>
            Every time your package is scanned at a USPS facility — whether at acceptance, during sorting, at regional distribution centers, or at your local post office — our <strong>live tracking tool</strong> captures and displays that update. For packages in active transit, you can see multiple updates per day as your package moves from facility to facility.
          </p>
          <p>
            One of the most searched queries is "<strong>track your USPS truck</strong>" or "<strong>USPS truck tracker</strong>". While individual mail trucks don't have public GPS tracking, the "<strong>Out for Delivery</strong>" scan means your package is on your mail carrier's truck and will typically arrive within a few hours. Our tool immediately shows this status change.
          </p>
          <p>
            Another common concern is "<strong>is USPS tracking down</strong>" — when tracking seems unresponsive. Our tool independently queries USPS data, providing an alternative when the official USPS website is experiencing issues. If your tracking truly isn't updating, we explain the most likely reasons and what actions to take.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Real-Time Tracking Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Radio, title: "Live Status Updates", desc: "See the latest tracking status the moment it's scanned by USPS. No delays, no caching — live data directly from USPS systems." },
              { icon: MapPin, title: "Location History", desc: "Full timeline of every facility your package has passed through, with timestamps and city/state locations." },
              { icon: Clock, title: "Estimated Delivery", desc: "Predicted delivery date and time based on shipping service, origin/destination distance, and current package location." },
              { icon: Bell, title: "Text Notifications", desc: "Text your tracking number to 28777 (2USPS) for automatic SMS updates when your package status changes." },
              { icon: Truck, title: "Out for Delivery Alerts", desc: "Know the moment your package is loaded on the mail truck for delivery. Typically means delivery within hours." },
              { icon: Smartphone, title: "Mobile-Friendly", desc: "Track from any device. Our tool is fully responsive and works on phones, tablets, and desktop computers." },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-xl p-5">
                <item.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">USPS Tracking Not Updating? Common Causes</h2>
        <div className="space-y-3">
          {[
            { cause: "Package Between Scanning Points", fix: "Your package is in transit between facilities and hasn't been scanned yet. Updates will resume when it arrives at the next facility." },
            { cause: "High Volume Periods", fix: "During holidays (Nov-Jan) and sale events, USPS processes massive volumes. Scanning delays of 24-48 hours are common." },
            { cause: "Weather Delays", fix: "Severe weather can delay packages and scanning. Check USPS Service Alerts for weather-related disruptions in your area." },
            { cause: "Rural Delivery Areas", fix: "Rural areas have fewer scanning points. Your package may go from a regional center directly to delivery without intermediate scans." },
            { cause: "Pre-Shipment / Label Created", fix: "The sender has created a shipping label but hasn't dropped off the package yet. Tracking begins when USPS receives the package." },
          ].map((item) => (
            <div key={item.cause} className="bg-card border rounded-lg p-4">
              <h3 className="font-bold text-sm text-foreground">{item.cause}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.fix}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Tracking Lookup", to: "/tracking-lookup" },
            { label: "Tracking Not Updating", to: "/tracking-not-updating" },
            { label: "Where Is My Package", to: "/where-is-my-package" },
            { label: "Track USPS", to: "/track-usps" },
            { label: "USPS Tracker", to: "/usps-tracker" },
            { label: "Priority Mail Tracking", to: "/priority-mail-tracking" },
            { label: "Package Tracker USPS", to: "/package-tracker-usps" },
            { label: "Mail Tracking", to: "/mail-tracking" },
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

export default LiveTrackingPage;

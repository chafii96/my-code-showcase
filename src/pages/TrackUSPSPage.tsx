import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Truck, Clock, Shield, MapPin, CheckCircle } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { majorLocations, trackingStatuses } from "@/data/mockTracking";
import { AdSlot } from "@/components/ads/AdSlot";

const TrackUSPSPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Track USPS – Track Your USPS Package Online Free"
        description="Track USPS packages online for free. Enter your tracking number to track USPS shipments in real time. Track USPS Priority Mail, First Class, and all postal services."
        canonical="/track-usps"
        keywords="track usps, track usps package, track a usps, track usps tracking, usps track, tracking usps, tracking usps tracking, track package usps, tracking package through usps, track us post office"
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Package className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Free Package Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Track USPS</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your USPS package online — free, instant, and accurate. Enter your tracking number to see real-time delivery status for any USPS shipment.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track USPS Package Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How to Track USPS Packages</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            To <strong>track USPS</strong> packages, all you need is your tracking number. Every USPS shipment — from Priority Mail to Ground Advantage — includes a unique tracking number that lets you monitor your package's journey in real time. Our free tool makes it easy to <strong>track USPS</strong> packages with instant results and detailed scan history.
          </p>
          <p>
            When you <strong>track a USPS</strong> package here, you'll see every scan event including pickup, facility processing, transportation between centers, and final delivery. Each update includes the exact time, location, and status so you always know where your package is. Whether you're <strong>tracking USPS</strong> Priority Mail, First Class, or Certified Mail — our tool covers all services.
          </p>
          <h3 className="text-lg font-semibold text-foreground">Where to Find Your USPS Tracking Number</h3>
          <p>
            Your USPS tracking number can be found on your shipping receipt, order confirmation email, or the package label itself. Domestic tracking numbers are 20-22 digits long and typically start with 9400 (Priority Mail), 9270 (Express), or 9300 (Ground). International tracking numbers are 13 characters like EA123456789US. Once you have it, you can <strong>track USPS</strong> packages instantly using the search box above.
          </p>
          <h3 className="text-lg font-semibold text-foreground">Track USPS Without a Tracking Number</h3>
          <p>
            Don't have a tracking number? You can still <strong>track USPS</strong> shipments using <Link to="/guides/informed-delivery" className="text-primary hover:underline">USPS Informed Delivery</Link> — a free service that automatically detects and tracks all incoming packages to your address. You can also contact the sender for the tracking number or visit your <Link to="/post-office-tracking" className="text-primary hover:underline">local post office</Link>.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Track USPS — All Services Supported</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Truck, title: "Track USPS Priority Mail", desc: "1-3 day delivery with full tracking and $100 insurance. Numbers start with 9400 or 9205.", link: "/status/in-transit-to-next-facility" },
              { icon: Clock, title: "Track USPS Express Mail", desc: "Guaranteed 1-2 day delivery. Track USPS Express packages with overnight updates.", link: "/status/out-for-delivery" },
              { icon: Package, title: "Track USPS Ground Advantage", desc: "2-5 day delivery for packages up to 70 lbs. The most cost-effective USPS option.", link: "/status/delivered" },
              { icon: Shield, title: "Track USPS Certified Mail", desc: "Track certified letters and documents with proof of mailing and delivery confirmation.", link: "/status/shipping-label-created" },
            ].map((s) => (
              <Link key={s.title} to={s.link} className="bg-card border rounded-xl p-5 hover:border-primary/30 transition-all group">
                <s.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Track USPS FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "How do I track USPS packages?", a: "Enter your 20-22 digit USPS tracking number in the search box on this page. You'll instantly see the real-time status of your USPS package including location, timestamps, and estimated delivery." },
            { q: "Is it free to track USPS packages?", a: "Yes! USPS tracking is a free service included with every trackable shipment. Our online tool to track USPS packages is also completely free — no registration or payment required." },
            { q: "Why can't I track my USPS package?", a: "If you can't track your USPS package, the tracking number may not be in the system yet (wait 24 hours after shipping), or the number may be incorrect. Double-check the number on your receipt and try again." },
            { q: "How long does USPS tracking take to update?", a: "USPS tracking updates each time your package is scanned at a facility. Updates typically appear within minutes, but during peak periods, delays of 24-48 hours are possible." },
          ].map((item, i) => (
            <div key={i} className="bg-card border rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-4">Track USPS by Location</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {majorLocations.map((l) => (
              <Link key={l.slug} to={`/locations/${l.slug}`} className="bg-card border rounded-lg p-3 hover:border-primary/30 transition-all text-sm">
                <span className="font-semibold text-foreground">{l.city}, {l.state}</span>
                <p className="text-xs text-muted-foreground mt-1">{l.facilities} facilities</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/track-usps" variant="compact" />
    </Layout>
  );
};

export default TrackUSPSPage;

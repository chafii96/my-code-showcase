import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Truck, Clock, Shield, Globe, Zap, CheckCircle } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { trackingStatuses } from "@/data/seoStaticData";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSTrackerPage = () => {
  return (
    <Layout>
      <SEOHead
        title="USPS Tracker – Free USPS Package Tracker Online"
        description="Free USPS tracker tool. Track any USPS package instantly with our online tracker. Works for Priority Mail, First Class, Certified Mail, and all USPS services. Real-time package tracker updates."
        canonical="/usps-tracker"
        keywords="usps tracker, usps package tracker, package tracker usps, usps tracker free, usps online tracker, usps tracker tool, free usps tracker, usps package tracker free, usps shipment tracker"
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Free Online Tracker</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Tracker</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            The fastest free USPS package tracker online. Enter your tracking number for instant, real-time delivery status updates on any USPS shipment.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Your Package <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is USPS Tracker?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            Our <strong>USPS tracker</strong> is a free online tool that connects directly to the United States Postal Service tracking system to give you real-time package status updates. Whether you're looking for a <strong>USPS package tracker</strong>, a <strong>package tracker USPS</strong> tool, or simply want to check where your shipment is, our <strong>USPS tracker</strong> provides instant results.
          </p>
          <p>
            Unlike other tracking tools, our <strong>USPS tracker</strong> is completely free — no registration, no login, no hidden fees. Simply enter your USPS tracking number (20-22 digits for domestic, 13 characters for international) and get a complete history of your package's journey including every scan, timestamp, and facility location.
          </p>
          <p>
            Our <strong>USPS package tracker</strong> works for every USPS shipping service: <Link to="/postal-tracking" className="text-primary hover:underline">Priority Mail</Link>, First-Class Package, USPS Ground Advantage, Certified Mail, Media Mail, Priority Mail Express, and all international services. You can also use our tracker for <Link to="/mail-tracking" className="text-primary hover:underline">mail tracking</Link> including Registered and Certified letters.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Why Use Our USPS Tracker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "Instant Results", desc: "Get tracking updates in under 2 seconds. Our USPS tracker is optimized for speed." },
              { icon: Shield, title: "100% Free & Private", desc: "No registration, no login. Your tracking data is never stored or shared." },
              { icon: Globe, title: "All USPS Services", desc: "Track Priority Mail, First Class, Ground Advantage, Certified Mail, and international." },
              { icon: Clock, title: "Real-Time Updates", desc: "See live status updates as your package moves through the USPS network." },
              { icon: Package, title: "Full Scan History", desc: "View every scan event with timestamps, locations, and facility details." },
              { icon: CheckCircle, title: "Status Explanations", desc: "Understand what each tracking status means with our built-in guides." },
            ].map((f) => (
              <div key={f.title} className="bg-card border rounded-xl p-5">
                <f.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How to Use Our USPS Package Tracker</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <ol>
            <li><strong>Find your tracking number</strong> — check your receipt, shipping confirmation email, or the package label.</li>
            <li><strong>Enter the number above</strong> — type or paste your USPS tracking number into the search box.</li>
            <li><strong>Get instant results</strong> — see real-time status, location, estimated delivery, and full scan history.</li>
          </ol>
          <p>
            Our <strong>USPS tracker</strong> accepts all standard tracking number formats: 20-22 digit domestic numbers (starting with 9400, 9205, 9270, 9300, 9407), and 13-character international codes (like EA123456789US). If you don't have a tracking number, learn how to <Link to="/guides/track-without-tracking-number" className="text-primary hover:underline">track without a number</Link> using USPS Informed Delivery.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">USPS Tracker FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Is this USPS tracker free?", a: "Yes! Our USPS tracker is 100% free with no registration required. You can track unlimited USPS packages at no cost." },
              { q: "How accurate is this USPS package tracker?", a: "Our USPS tracker connects directly to the official USPS tracking system, so the data is the same as what you'd see on usps.com. Updates appear within seconds of a scan." },
              { q: "Can I track multiple packages with this USPS tracker?", a: "Yes! You can track as many USPS packages as you want. Simply enter each tracking number one at a time to get instant results." },
              { q: "What's the difference between USPS tracker and USPS tracking?", a: "They're the same thing! 'USPS tracker' and 'USPS tracking' both refer to the service that lets you monitor your USPS packages. Our tracker tool provides a fast, clean interface for accessing USPS tracking data." },
            ].map((item, i) => (
              <div key={i} className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-tracker" variant="compact" />
    </Layout>
  );
};

export default USPSTrackerPage;

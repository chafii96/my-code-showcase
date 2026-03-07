import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, CheckCircle, Zap, Globe } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { trackingStatuses } from "@/data/seoStaticData";
import { AdSlot } from "@/components/ads/AdSlot";

const PackageTrackerUSPSPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Package Tracker USPS – Track USPS Packages Free Online"
        description="Free USPS package tracker. Track any USPS package by tracking number. Our package tracker works for Priority Mail, First Class, Certified Mail, and all USPS services. Instant results."
        canonical="/package-tracker-usps"
        keywords="package tracker usps, usps package tracker, package tracker usps free, usps package tracker free, package tracking usps, usps package tracker online, free package tracker usps"
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Package className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Free Package Tracker</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Package Tracker USPS</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            The best free USPS package tracker. Enter your tracking number for instant, real-time delivery status on any USPS package.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track USPS Package <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">USPS Package Tracker — Fast, Free, Accurate</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            Looking for a reliable <strong>package tracker USPS</strong>? You're in the right place. Our <strong>USPS package tracker</strong> gives you instant access to real-time delivery status for any USPS shipment. Whether you need to check on a Priority Mail package, track a First-Class shipment, or monitor a Certified Mail letter, our <strong>package tracker</strong> provides complete, accurate results.
          </p>
          <p>
            Our <strong>USPS package tracker</strong> is different from other tracking tools because it's designed for speed and simplicity. Enter your tracking number, and within seconds you'll see your package's complete journey — every scan, every facility, every timestamp. No registration, no ads blocking your results, no waiting. Just fast, free <strong>USPS package tracking</strong>.
          </p>
          <p>
            You can also use our <strong>package tracker USPS</strong> tool alongside other resources: check <Link to="/post-office-tracking" className="text-primary hover:underline">post office tracking</Link> for facility information, explore <Link to="/mail-tracking" className="text-primary hover:underline">mail tracking</Link> options, or browse our <Link to="/postal-tracking" className="text-primary hover:underline">postal tracking</Link> guide for comprehensive coverage.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">What You Can Track with Our USPS Package Tracker</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-card border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted border-b">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Package Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Delivery Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Tracking Number Format</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { type: "Priority Mail", time: "1-3 days", format: "Starts with 9400 or 9205 (22 digits)" },
                  { type: "Priority Mail Express", time: "1-2 days", format: "Starts with 9270 (22 digits)" },
                  { type: "First-Class Package", time: "1-5 days", format: "Starts with 9400 (22 digits)" },
                  { type: "Ground Advantage", time: "2-5 days", format: "Starts with 9300 or 9400 (22 digits)" },
                  { type: "Certified Mail", time: "3-5 days", format: "Starts with 9407 (22 digits)" },
                  { type: "International", time: "6-21 days", format: "13 characters (e.g., EA123456789US)" },
                ].map((r) => (
                  <tr key={r.type} className="hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">{r.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">{r.time}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{r.format}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Package Tracker USPS FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "What is a USPS package tracker?", a: "A USPS package tracker is an online tool that lets you check the delivery status of USPS packages in real time. Enter your tracking number to see where your package is, when it was last scanned, and when it's expected to arrive." },
            { q: "How do I use the USPS package tracker?", a: "Simply enter your USPS tracking number (found on your receipt or shipping confirmation) into the search box on this page. Our package tracker will instantly show you the complete tracking history." },
            { q: "Is the USPS package tracker free?", a: "Yes! Our USPS package tracker is 100% free. USPS includes tracking with every shipping service at no additional cost, and our online tracker requires no registration or payment." },
            { q: "Can I track a USPS package without the tracking number?", a: "You can use USPS Informed Delivery to automatically track packages to your address without needing the tracking number. Sign up free at informeddelivery.usps.com." },
          ].map((item, i) => (
            <div key={i} className="bg-card border rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/package-tracker-usps" variant="compact" />
    </Layout>
  );
};

export default PackageTrackerUSPSPage;

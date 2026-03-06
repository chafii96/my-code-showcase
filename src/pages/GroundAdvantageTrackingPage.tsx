import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Truck, Clock, Shield, Package, DollarSign, MapPin } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const GroundAdvantageTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Ground Advantage Tracking – Track Ground Advantage Free"
        description="Free USPS Ground Advantage tracking tool. Track Ground Advantage packages with real-time updates, 2-5 day delivery status & $100 insurance. Enter your tracking number now."
        canonical="/ground-advantage-tracking"
        keywords="usps ground advantage tracking, ground advantage tracking, usps ground tracking, does usps ground advantage have tracking, usps ground advantage, ground advantage usps tracking, track usps ground advantage, usps ground advantage tracking number, usps ground tracking number"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Truck className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Ground Advantage Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Ground Advantage Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your USPS Ground Advantage packages — free real-time tracking with 2-5 day delivery updates. The most affordable USPS shipping service with full tracking included.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Ground Advantage <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is USPS Ground Advantage Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USPS Ground Advantage</strong> is the newest and most affordable USPS shipping service, launched in July 2023 to replace three legacy services: First-Class Package Service, Parcel Select Ground, and USPS Retail Ground. <strong>Ground Advantage tracking</strong> is included free with every shipment, giving you real-time visibility from pickup to delivery.
          </p>
          <p>
            When you <strong>track USPS Ground Advantage</strong> packages, you get the same detailed tracking information available to postal employees — including acceptance scans, facility transfers, out-for-delivery notifications, and delivery confirmation. Our free tracking tool makes it easy to monitor your <strong>Ground Advantage shipments</strong> with just your tracking number.
          </p>
          <p>
            Ground Advantage delivers in <strong>2-5 business days</strong> within the continental United States and includes <strong>$100 insurance coverage</strong> at no additional cost. It's the go-to choice for e-commerce sellers, small businesses, and individual shippers who want reliable, affordable shipping with full tracking capabilities.
          </p>
          <p>
            One of the most common questions is "<strong>does USPS Ground Advantage have tracking?</strong>" — and the answer is a definitive yes. Unlike some older USPS services that had limited or no tracking, Ground Advantage provides end-to-end tracking for every package, making it a massive upgrade over its predecessor services.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Ground Advantage vs Other USPS Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-card">
                  <th className="text-left p-3 border font-bold text-foreground">Feature</th>
                  <th className="text-left p-3 border font-bold text-foreground">Ground Advantage</th>
                  <th className="text-left p-3 border font-bold text-foreground">Priority Mail</th>
                  <th className="text-left p-3 border font-bold text-foreground">First Class Mail</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Delivery Time", "2-5 days", "1-3 days", "1-5 days"],
                  ["Tracking", "✅ Full tracking", "✅ Full tracking", "❌ Letters only"],
                  ["Insurance", "$100 included", "$100 included", "None"],
                  ["Max Weight", "70 lbs", "70 lbs", "3.5 oz (letters)"],
                  ["Starting Price", "~$4.50", "~$8.70", "$0.68 (stamp)"],
                  ["Free Supplies", "No", "Yes (flat rate)", "No"],
                ].map(([feat, ga, pm, fc]) => (
                  <tr key={feat} className="hover:bg-muted/50">
                    <td className="p-3 border font-medium">{feat}</td>
                    <td className="p-3 border font-bold text-primary">{ga}</td>
                    <td className="p-3 border">{pm}</td>
                    <td className="p-3 border">{fc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Priority Mail Tracking", to: "/priority-mail-tracking" },
            { label: "First Class Tracking", to: "/first-class-tracking" },
            { label: "Express Mail Tracking", to: "/express-mail-tracking" },
            { label: "Certified Mail Tracking", to: "/certified-mail-tracking" },
            { label: "International Tracking", to: "/international-tracking" },
            { label: "Tracking Number Formats", to: "/tracking-number-formats" },
            { label: "Live Tracking", to: "/live-tracking" },
            { label: "Track USPS", to: "/track-usps" },
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

export default GroundAdvantageTrackingPage;

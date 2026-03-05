import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Truck, Clock, Shield, Package, Zap, DollarSign } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const PriorityMailTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Priority Mail Tracking – Track Priority Mail Free"
        description="Free USPS Priority Mail tracking. Track your Priority Mail package in real-time with delivery updates, estimated delivery date & $100 insurance status. Enter your tracking number now."
        canonical="/priority-mail-tracking"
        keywords="usps priority mail tracking, priority mail tracking, usps priority tracking, track priority mail, priority mail tracking number, usps priority mail, priority mail usps tracking, usps priority mail tracker, track usps priority mail, priority tracking usps"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Truck className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Priority Mail Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Priority Mail Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your USPS Priority Mail packages in real time. Free tracking with delivery updates, estimated arrival, and $100 insurance coverage status.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Priority Mail <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is USPS Priority Mail Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USPS Priority Mail tracking</strong> allows you to monitor the real-time location and delivery status of packages sent via USPS Priority Mail — the most popular shipping service in the United States. With <strong>Priority Mail tracking</strong>, you get updates from the moment your package is accepted at a USPS facility until it arrives at the recipient's door.
          </p>
          <p>
            Priority Mail is USPS's flagship shipping service, offering 1-3 business day delivery for packages up to 70 lbs. Every <strong>Priority Mail shipment includes free tracking</strong>, $100 insurance coverage, and access to free USPS packaging supplies. Our free <strong>Priority Mail tracking tool</strong> provides the same detailed scan history that postal employees use internally.
          </p>
          <p>
            Whether you're a business shipping products to customers or an individual sending a gift to a loved one, <strong>USPS Priority Mail tracking</strong> gives you peace of mind. You can track your package from your phone, computer, or tablet — and our tool works with all Priority Mail services including Flat Rate boxes, Regional Rate boxes, and weight-based Priority Mail.
          </p>
          <p>
            USPS processes over <strong>600 million Priority Mail packages annually</strong>, making it the most used expedited shipping service in the country. With our tracking tool, you can monitor every one of these shipments in real time, completely free of charge.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Priority Mail Service Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Package, title: "Priority Mail Flat Rate", desc: "Ship anything that fits in USPS-provided flat rate boxes for one price, regardless of weight (up to 70 lbs). Available in small, medium, and large box sizes.", price: "From $9.45" },
              { icon: Truck, title: "Priority Mail (Weight-Based)", desc: "Pay based on weight and distance. Ideal for lightweight items where flat rate pricing isn't advantageous. 1-3 business day delivery.", price: "From $8.70" },
              { icon: Zap, title: "Priority Mail Express", desc: "Guaranteed overnight to 2-day delivery with money-back guarantee. Includes $100 insurance and tracking. Sunday & holiday delivery available.", price: "From $28.75" },
              { icon: DollarSign, title: "Priority Mail Regional Rate", desc: "Zone-based pricing using USPS-provided boxes. Savings up to 20% compared to standard Priority Mail for heavier, regional shipments.", price: "From $9.25" },
            ].map((s) => (
              <div key={s.title} className="bg-card border rounded-xl p-5">
                <s.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                <span className="inline-block mt-2 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Priority Mail Delivery Time by Zone</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 border font-bold text-foreground">Zone</th>
                <th className="text-left p-3 border font-bold text-foreground">Distance</th>
                <th className="text-left p-3 border font-bold text-foreground">Estimated Delivery</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Zone 1-2", "Local (0-150 miles)", "1 business day"],
                ["Zone 3", "151-300 miles", "1-2 business days"],
                ["Zone 4", "301-600 miles", "2 business days"],
                ["Zone 5", "601-1,000 miles", "2 business days"],
                ["Zone 6", "1,001-1,400 miles", "2-3 business days"],
                ["Zone 7", "1,401-1,800 miles", "2-3 business days"],
                ["Zone 8", "1,801+ miles", "3 business days"],
              ].map(([zone, dist, time]) => (
                <tr key={zone} className="hover:bg-muted/50">
                  <td className="p-3 border font-medium">{zone}</td>
                  <td className="p-3 border">{dist}</td>
                  <td className="p-3 border">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Express Mail Tracking", to: "/express-mail-tracking" },
            { label: "Certified Mail Tracking", to: "/certified-mail-tracking" },
            { label: "First Class Tracking", to: "/first-class-tracking" },
            { label: "Ground Advantage Tracking", to: "/ground-advantage-tracking" },
            { label: "International Tracking", to: "/international-tracking" },
            { label: "Live Tracking", to: "/live-tracking" },
            { label: "Track USPS", to: "/track-usps" },
            { label: "USPS Tracker", to: "/usps-tracker" },
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

export default PriorityMailTrackingPage;

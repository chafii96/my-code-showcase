import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Zap, Clock, Shield, Package, DollarSign, Calendar } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const ExpressMailTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Express Mail Tracking – Track Express Mail Overnight"
        description="Free USPS Express Mail tracking. Track Priority Mail Express packages with guaranteed overnight delivery, real-time updates & money-back guarantee. Enter your Express Mail tracking number."
        canonical="/express-mail-tracking"
        keywords="usps express mail tracking, express mail tracking, usps express tracking, priority mail express tracking, usps priority mail express tracking, track express mail usps, usps express mail, express mail tracking number, usps overnight tracking"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Express Mail Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Express Mail Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track USPS Priority Mail Express — the fastest USPS shipping service. Guaranteed overnight delivery with money-back guarantee, Sunday delivery, and full tracking.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Express Mail <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is USPS Express Mail Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USPS Express Mail tracking</strong> (officially <strong>Priority Mail Express</strong>) provides real-time monitoring for USPS's fastest domestic shipping service. With <strong>guaranteed overnight to 2-day delivery</strong> and a money-back guarantee, Priority Mail Express is the premium choice when speed is critical.
          </p>
          <p>
            Our free <strong>Express Mail tracking tool</strong> gives you detailed tracking updates including exact delivery commitment times, signature confirmation, and facility-by-facility scan history. <strong>USPS Express tracking</strong> provides more detailed data than any other USPS service because of its guaranteed delivery windows.
          </p>
          <p>
            Priority Mail Express is the only USPS service that delivers <strong>365 days a year</strong>, including Sundays and federal holidays. It includes $100 insurance, free package pickup, and a money-back guarantee if the delivery commitment isn't met. Starting at approximately $28.75, it's the premium option for time-critical shipments.
          </p>
          <p>
            <strong>Express Mail tracking numbers</strong> for domestic shipments typically start with 9270, while international Express Mail (Priority Mail Express International) uses the EA, EB, or EC prefix followed by 9 digits and "US" (e.g., EA123456789US).
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Express Mail Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "Overnight Delivery", desc: "Guaranteed next-day delivery by 10:30 AM to most addresses. 2-day delivery to rural areas." },
              { icon: Calendar, title: "365-Day Delivery", desc: "The only USPS service delivering Sundays and holidays for an additional fee." },
              { icon: DollarSign, title: "Money-Back Guarantee", desc: "Full refund of postage if delivery commitment is not met. File claim within 30 days." },
              { icon: Shield, title: "$100 Insurance", desc: "Includes $100 insurance for documents and merchandise. Up to $5,000 additional coverage available." },
              { icon: Package, title: "Free Pickup", desc: "Schedule free package pickup from your home or business through USPS.com or by calling 1-800-ASK-USPS." },
              { icon: Clock, title: "Waiver of Signature", desc: "Option to waive signature requirement so packages can be left without recipient present." },
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
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Priority Mail Tracking", to: "/priority-mail-tracking" },
            { label: "Certified Mail Tracking", to: "/certified-mail-tracking" },
            { label: "Ground Advantage Tracking", to: "/ground-advantage-tracking" },
            { label: "First Class Tracking", to: "/first-class-tracking" },
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

export default ExpressMailTrackingPage;

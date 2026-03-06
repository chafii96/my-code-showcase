import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Globe, Clock, Shield, Truck, MapPin } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPostTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="US Post Tracking – Track US Post Packages Online Free"
        description="Free US Post tracking tool. Track US Post packages, mail, and shipments by tracking number. Real-time US postal tracking updates for all USPS services. Track US Post online instantly."
        canonical="/us-post-tracking"
        keywords="us post tracking, us post track, us post package tracking, track us post, us post office tracking, us post mail tracking, us post parcel tracking, us postal tracking, united states post tracking"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">US Post Office Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">US Post Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your US Post packages online — free, instant, and real-time. Monitor any United States Postal Service shipment with our free tracking tool.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track US Post Package <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is US Post Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>US Post tracking</strong> — commonly referred to as <strong>USPS tracking</strong>, <strong>US postal tracking</strong>, or <strong>United States Post tracking</strong> — is a free service that lets you monitor the real-time location and delivery status of packages shipped through the United States Postal Service. When you <strong>track US Post</strong> packages with our tool, you get instant access to the same tracking data used by postal employees.
          </p>
          <p>
            Whether people search for "<strong>US Post track</strong>", "<strong>US Post package tracking</strong>", or "<strong>US Post office tracking</strong>", they're all looking for the same thing — a reliable way to monitor their USPS shipments. Our <strong>US Post tracking</strong> tool covers every USPS shipping service, from Priority Mail and First Class to Certified Mail and Media Mail.
          </p>
          <p>
            The <strong>US Post</strong> (USPS) is the world's largest postal service, delivering to more than 163 million addresses across all 50 states, US territories, and military addresses worldwide. Every day, USPS processes approximately <strong>318 million pieces of mail</strong>. Our free <strong>US Post tracking</strong> tool lets you track any of these shipments in seconds.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">US Post Tracking — All Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Truck, title: "US Post Priority Mail", desc: "1-3 business day delivery with full tracking, $100 insurance, and free pickup. The most popular US Post shipping service.", link: "/track-usps" },
              { icon: Package, title: "US Post First-Class", desc: "Affordable shipping for packages under 13 oz with tracking. 1-5 business day delivery within the US.", link: "/postal-tracking" },
              { icon: Shield, title: "US Post Certified Mail", desc: "Proof of mailing and delivery with signature confirmation. Essential for legal documents and important correspondence.", link: "/mail-tracking" },
              { icon: Globe, title: "US Post International", desc: "Track international shipments to and from the US. International tracking numbers end in 'US' (e.g., EA123456789US).", link: "/usa-tracking" },
            ].map((s) => (
              <Link key={s.title} to={s.link} className="bg-card border rounded-xl p-5 hover:border-primary/30 transition-all group">
                <s.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related US Post Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Track USPS", to: "/track-usps" },
            { label: "Post Office Tracking", to: "/post-office-tracking" },
            { label: "Postal Tracking", to: "/postal-tracking" },
            { label: "Mail Tracking", to: "/mail-tracking" },
            { label: "Where Is My Package", to: "/where-is-my-package" },
            { label: "Package Tracker USPS", to: "/package-tracker-usps" },
            { label: "USA Tracking", to: "/usa-tracking" },
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

export default USPostTrackingPage;

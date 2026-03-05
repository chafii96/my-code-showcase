import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Globe, Clock, Shield, Truck, MapPin } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USATrackingPage = () => {
  return (
    <Layout>
      <SEOHead
        title="USA Tracking – Track Packages in the United States"
        description="Free USA tracking tool for all US postal services. Track USPS packages, mail, and shipments across the United States. Real-time USA package tracking with instant updates."
        canonical="/usa-tracking"
        keywords="usa tracking, usps tracking usa, usa package tracking, tracking usa, track package usa, united states tracking, usa postal tracking, usa mail tracking, us tracking, package tracking usa"
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">United States Package Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USA Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track packages across the United States with our free USA tracking tool. Monitor USPS shipments in real time — from coast to coast.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track USA Package <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">USA Tracking — Track Packages Across America</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USA tracking</strong> refers to the ability to track packages and mail shipped within or to the United States. The primary carrier for <strong>USA package tracking</strong> is the United States Postal Service (USPS), which handles over 7.3 billion pieces of mail annually through more than 31,000 post offices across all 50 states.
          </p>
          <p>
            Our <strong>USA tracking</strong> tool provides free, real-time access to USPS tracking data. Whether you're tracking a package shipped domestically within the US, or an international shipment arriving in the United States, our tool gives you instant status updates. Simply enter your USPS tracking number to get started with <strong>USPS tracking USA</strong>.
          </p>
          <p>
            Looking for other tracking services? Our <strong>USA tracking</strong> tool specializes in USPS — the largest postal service in the world. For other carriers, you can also use our tool as a starting point. But for anything shipped through the <Link to="/postal-tracking" className="text-primary hover:underline">US postal service</Link>, including <Link to="/post-office-tracking" className="text-primary hover:underline">post office</Link> shipments and <Link to="/mail-tracking" className="text-primary hover:underline">mail tracking</Link>, we provide the fastest and most reliable results.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">USA Tracking Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Package, title: "Domestic USA Tracking", desc: "Track packages shipped within the United States. USPS delivers to every address in America, including PO boxes and military addresses (APO/FPO).", link: "/usps-tracker" },
              { icon: Globe, title: "International to USA Tracking", desc: "Track international packages arriving in the United States. International tracking numbers ending in 'US' indicate USPS as the receiving carrier.", link: "/guides/international-shipping-rates" },
              { icon: Truck, title: "USA Express Tracking", desc: "Track time-critical USA shipments with Priority Mail Express. Guaranteed overnight to 2-day delivery with full tracking.", link: "/track-usps" },
              { icon: MapPin, title: "USA Tracking by State", desc: "Track packages through specific US states and cities. See local delivery times and USPS facility information.", link: "/locations" },
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
        <h2 className="text-2xl font-bold text-foreground mb-6">USA Tracking FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "How do I track a package in the USA?", a: "Enter your USPS tracking number in the search box on this page. USA tracking works for all USPS services including Priority Mail, First Class, Ground Advantage, and international packages arriving in the US." },
            { q: "What is the best USA tracking tool?", a: "Our USA tracking tool provides the fastest, most reliable results by connecting directly to the USPS tracking system. It's free, requires no registration, and shows full scan history with timestamps." },
            { q: "Can I track international packages to the USA?", a: "Yes! Enter your international tracking number (13 characters ending in 'US') to track packages arriving in the United States. Our USA tracking tool shows all USPS scans from the moment the package enters the US postal system." },
            { q: "Is USA tracking the same as USPS tracking?", a: "Essentially yes. When people search for 'USA tracking,' they're typically looking for USPS tracking — the United States Postal Service's package tracking system. Our tool provides the same real-time data as the official USPS website." },
          ].map((item, i) => (
            <div key={i} className="bg-card border rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usa-tracking" variant="compact" />
    </Layout>
  );
};

export default USATrackingPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, Globe, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const SfExpressTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="SF Express Tracking – Track SF Express & SFC Packages Free"
        description="Free SF Express tracking tool. Track SF Express, SFC, and SF tracking packages from China worldwide. Enter your SF tracking number for instant delivery status."
        canonical="/sf-express-tracking"
        keywords="sf express tracking, sf express tracking number, sf tracking number, sfc tracking number, sf tracking, track sf express, sf express china tracking"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">SF Express China</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">SF Express Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track SF Express and SFC packages from China worldwide. Free tracking tool with real-time updates.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track SF Express Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">SF Express & SFC Package Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>SF Express tracking</strong> (顺丰速运) is China's largest express delivery company. Track <strong>SF Express</strong>, <strong>SFC</strong>, and <strong>SF tracking</strong> packages shipped from China to destinations worldwide with our universal tracking tool.</p>
          <p>SF Express operates in over 50 countries with a fleet of cargo aircraft and delivery vehicles. Their tracking numbers are typically 12-15 digits, often prefixed with SF. Enter your <strong>SF Express tracking number</strong> above for instant delivery status.</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Alibaba Tracking", to: "/alibaba-tracking" },
            { label: "India Post Tracking", to: "/india-post-tracking" },
            { label: "Singapore Mail Tracking", to: "/singapore-mail-tracking" },
            { label: "SpeedEx Tracking", to: "/speedex-tracking" },
            { label: "All Carriers", to: "/tracking" },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">{link.label}</Link>
          ))}
        </div>
      </section>

      <InternalLinkingHub />
    </Layout>
  );
};

export default SfExpressTrackingPage;

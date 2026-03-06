import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, Globe } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const IndiaPostTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="India Post Tracking – Track Indian Postal Service Packages Free"
        description="Free India Post tracking tool. Track Indian postal service packages, Speed Post, and registered mail. Enter your India Post tracking number for instant status."
        canonical="/india-post-tracking"
        keywords="india post tracking, india post tracking number, indian postal service tracking number, track india post, india post speed post tracking, india post international tracking"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">India Post</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">India Post Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track India Post packages, Speed Post, and registered mail worldwide. Free Indian postal service tracking tool.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track India Post Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">India Post & Speed Post Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>India Post tracking</strong> covers the world's largest postal network with over 155,000 post offices across India. Track <strong>Indian postal service</strong> packages including Speed Post, Registered Mail, and international parcels with our free tool.</p>
          <p>India Post tracking numbers for international mail follow the UPU S10 standard ending in "IN". Domestic Speed Post numbers are typically 13 digits. Enter your <strong>India Post tracking number</strong> for real-time updates.</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Singapore Mail Tracking", to: "/singapore-mail-tracking" },
            { label: "SF Express Tracking", to: "/sf-express-tracking" },
            { label: "Colissimo Tracking", to: "/colissimo-tracking" },
            { label: "Deutsche Post Tracking", to: "/deutsche-post-tracking" },
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

export default IndiaPostTrackingPage;

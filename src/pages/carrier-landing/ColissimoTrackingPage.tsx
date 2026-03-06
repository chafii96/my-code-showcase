import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, Globe, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const ColissimoTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Colissimo Tracking – Track La Poste France Packages Free"
        description="Free Colissimo tracking tool. Track La Poste France Colissimo packages worldwide. Enter your Colissimo tracking number for instant delivery status updates."
        canonical="/colissimo-tracking"
        keywords="colissimo tracking, colissimo tracking number, track colissimo, la poste tracking, colissimo france tracking, colissimo package tracking"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">La Poste France</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Colissimo Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track Colissimo packages from La Poste France worldwide. Free tracking tool with real-time status updates.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Colissimo Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Colissimo Package Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>Colissimo tracking</strong> allows you to monitor packages shipped through La Poste, France's national postal service. Colissimo is the premium parcel service of La Poste, offering domestic and international delivery with full tracking capabilities.</p>
          <p><strong>Colissimo tracking numbers</strong> follow the Universal Postal Union S10 standard with the country code FR. Enter your Colissimo tracking number above for real-time updates on your package from France.</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Deutsche Post Tracking", to: "/deutsche-post-tracking" },
            { label: "India Post Tracking", to: "/india-post-tracking" },
            { label: "Singapore Mail Tracking", to: "/singapore-mail-tracking" },
            { label: "SF Express Tracking", to: "/sf-express-tracking" },
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

export default ColissimoTrackingPage;

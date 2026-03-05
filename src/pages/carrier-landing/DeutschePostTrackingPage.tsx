import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Globe } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const DeutschePostTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Deutsche Post Tracking – Track German Post Packages Free"
        description="Free Deutsche Post tracking tool. Track Deutsche Post and DHL Germany packages worldwide. Enter your Deutsche Post tracking number for instant delivery status."
        canonical="/deutsche-post-tracking"
        keywords="deutsche post tracking, deutsche post tracking number, track deutsche post, german post tracking, dhl germany tracking, deutsche post international tracking"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Deutsche Post</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Deutsche Post Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track Deutsche Post and DHL Germany packages worldwide. Free German postal tracking tool.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Deutsche Post Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Deutsche Post & DHL Germany Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>Deutsche Post tracking</strong> covers Germany's national postal service, part of the DHL Group. Track registered letters, parcels, Warenpost, and international shipments from Germany worldwide.</p>
          <p>Deutsche Post tracking numbers ending in "DE" follow international standards. Enter your <strong>Deutsche Post tracking number</strong> for real-time status updates.</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Colissimo Tracking", to: "/colissimo-tracking" },
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

export default DeutschePostTrackingPage;

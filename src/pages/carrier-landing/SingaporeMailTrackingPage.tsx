import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Globe } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const SingaporeMailTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Singapore Mail Tracking – Track SingPost Packages Free"
        description="Free Singapore Mail tracking tool. Track SingPost packages and Singapore postal service mail worldwide. Enter your Singapore tracking number for instant status."
        canonical="/singapore-mail-tracking"
        keywords="singapore mail tracking, singapore mail tracking number, singpost tracking, singapore post tracking, track singapore mail, singapore postal tracking"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">SingPost</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Singapore Mail Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track Singapore Post and SingPost packages worldwide. Free postal tracking tool with real-time updates.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track SingPost Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Singapore Post & SingPost Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>Singapore Mail tracking</strong> covers packages shipped through SingPost (Singapore Post), Singapore's national postal operator. Track registered mail, parcels, and EMS shipments from Singapore to destinations worldwide.</p>
          <p>Singapore Post tracking numbers ending in "SG" follow the international UPU standard. Enter your <strong>Singapore mail tracking number</strong> above for instant delivery status updates.</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "India Post Tracking", to: "/india-post-tracking" },
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

export default SingaporeMailTrackingPage;

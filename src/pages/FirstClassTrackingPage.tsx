import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Mail, Clock, Package, DollarSign } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const FirstClassTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS First Class Tracking – Track First Class Mail & Packages"
        description="Free USPS First Class mail tracking. Track First Class packages and mail with real-time updates. Learn about First Class tracking numbers, delivery times & how to add tracking to letters."
        canonical="/first-class-tracking"
        keywords="usps first class tracking, first class mail tracking, usps first class mail tracking, usps 1st class mail tracking, first class tracking, track first class usps, first class package tracking, usps first class, first class mail usps tracking"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Mail className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">First Class Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS First Class Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track USPS First Class packages and mail. Free real-time tracking for First-Class Package Service and Certified First-Class Mail.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track First Class <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is USPS First Class Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USPS First Class tracking</strong> refers to monitoring the delivery status of mail and packages sent via USPS First-Class service. It's important to understand that <strong>First-Class Mail letters</strong> (standard letters and postcards) do NOT include tracking by default — but <strong>First-Class Packages</strong> do include free tracking.
          </p>
          <p>
            As of July 2023, <strong>USPS First-Class Package Service</strong> has been replaced by <strong>USPS Ground Advantage</strong>. If you have an older First-Class Package tracking number, it will still work with our tracking tool. New shipments should use Ground Advantage, which offers the same tracking capabilities plus $100 insurance.
          </p>
          <p>
            <strong>USPS First Class Mail</strong> is the most commonly used mailing service in America, with USPS processing over <strong>54 billion pieces of First-Class Mail annually</strong>. While standard letters don't include tracking, you can add tracking by upgrading to <strong>Certified Mail</strong> ($4.15 extra), which provides proof of mailing and delivery confirmation.
          </p>
          <p>
            For those searching for "<strong>usps 1st class mail tracking</strong>" or "<strong>first class mail tracking</strong>", our tool covers all variations of USPS First-Class services. Enter your tracking number above to get instant real-time updates on your package or certified mail piece.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">First Class Mail vs First Class Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-xl p-5">
              <Mail className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-bold text-foreground">First-Class Mail (Letters)</h3>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Letters up to 3.5 oz, postcards, large envelopes</li>
                <li>• Starts at $0.68 (Forever Stamp)</li>
                <li>• 1-5 business day delivery</li>
                <li>• ❌ No tracking included</li>
                <li>• ✅ Add tracking via Certified Mail (+$4.15)</li>
              </ul>
            </div>
            <div className="bg-card border rounded-xl p-5 border-primary/30">
              <Package className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-bold text-foreground">First-Class Package → Ground Advantage</h3>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Packages up to 70 lbs</li>
                <li>• Starts at ~$4.50</li>
                <li>• 2-5 business day delivery</li>
                <li>• ✅ Free tracking included</li>
                <li>• ✅ $100 insurance included</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Ground Advantage Tracking", to: "/ground-advantage-tracking" },
            { label: "Priority Mail Tracking", to: "/priority-mail-tracking" },
            { label: "Certified Mail Tracking", to: "/certified-mail-tracking" },
            { label: "Mail Tracking", to: "/mail-tracking" },
            { label: "Express Mail Tracking", to: "/express-mail-tracking" },
            { label: "Tracking Lookup", to: "/tracking-lookup" },
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

export default FirstClassTrackingPage;

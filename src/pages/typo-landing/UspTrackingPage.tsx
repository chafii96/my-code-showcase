import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const UspTrackingPage = () => (
  <Layout>
    <SEOHead
      title="USP Tracking – Did You Mean USPS Tracking? Free Package Tracker"
      description="Looking for usp tracking? You probably meant USPS tracking. Use our free USPS tracking tool to track packages in real time. Enter your tracking number now."
      canonical="/usp-tracking"
      keywords="usp tracking, usp tracking number, usps tracking, usps tracking number, usps package tracking, track usps"
    />

    <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
      <div className="container max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Tracking</h1>
        <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-4">
          Looking for <strong>"usp tracking"</strong>? You're in the right place! Track USPS packages for free.
        </p>
        <p className="text-sm text-primary-foreground/50 mb-8">
          Common searches: usp tracking, usp tracking number, usps tracking
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
          <Search className="h-5 w-5" /> Track USPS Now <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    <section className="container max-w-4xl py-12">
      <h2 className="text-2xl font-bold text-foreground mb-4">Did You Mean "USPS Tracking"?</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
        <p>Many people search for <strong>"usp tracking"</strong> when they mean <strong>USPS tracking</strong> (United States Postal Service). It's a very common typo! Our free <Link to="/" className="text-primary hover:underline">USPS tracking</Link> tool provides real-time package tracking for all USPS shipments.</p>
        <p>Whether you typed "usp tracking", "usp tracking number", or "usp package tracking", we've got you covered. Simply enter your tracking number above to track any USPS package instantly.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "USPS Tracking", to: "/" },
          { label: "Track USPS", to: "/track-usps" },
          { label: "Tracking Lookup", to: "/tracking-lookup" },
          { label: "USPS Tracker", to: "/usps-tracker" },
          { label: "Mail Tracking", to: "/mail-tracking" },
          { label: "Live Tracking", to: "/live-tracking" },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">{link.label}</Link>
        ))}
      </div>
    </section>

    <InternalLinkingHub />
  </Layout>
);

export default UspTrackingPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const IspsTrackPage = () => (
  <Layout>
    <SEOHead
      title="ISPS Track – Did You Mean USPS Track? Free Package Tracker"
      description="Looking for isps track? You probably meant USPS track. Use our free USPS tracking tool to track packages in real time. Enter your tracking number now."
      canonical="/isps-track"
      keywords="isps track, isps tracking, usps track, usps tracking, ups tracking, usps package tracking"
    />

    <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
      <div className="container max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Track</h1>
        <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-4">
          Looking for <strong>"isps track"</strong>? You're in the right place! Track USPS packages for free.
        </p>
        <p className="text-sm text-primary-foreground/50 mb-8">
          Common searches: isps track, isps tracking, usps track
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
          <Search className="h-5 w-5" /> Track USPS Now <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    <section className="container max-w-4xl py-12">
      <h2 className="text-2xl font-bold text-foreground mb-4">Did You Mean "USPS Track"?</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
        <p>Many people search for <strong>"isps track"</strong> when they mean <strong>USPS track</strong>. You've found the right tool! Our free <Link to="/" className="text-primary hover:underline">USPS tracking</Link> tool provides real-time package tracking for all USPS shipments.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "USPS Tracking", to: "/" },
          { label: "Track USPS", to: "/track-usps" },
          { label: "US Post Tracking", to: "/us-post-tracking" },
          { label: "Postal Tracking", to: "/postal-tracking" },
          { label: "USA Tracking", to: "/usa-tracking" },
          { label: "Track Parcel USA", to: "/track-parcel-usa" },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">{link.label}</Link>
        ))}
      </div>
    </section>

    <InternalLinkingHub />
  </Layout>
);

export default IspsTrackPage;

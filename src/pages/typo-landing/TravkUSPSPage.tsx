import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const TravkUSPSPage = () => (
  <Layout>
    <SEOHead
      title="Travk USPS – Did You Mean Track USPS? Free Package Tracker"
      description="Looking for travk usps? You probably meant track USPS. Use our free USPS tracking tool to track packages in real time. Enter your tracking number now."
      canonical="/travk-usps"
      keywords="travk usps, track usps, trak usps, trck usps, usps track, usps tracking"
    />

    <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
      <div className="container max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Track USPS</h1>
        <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-4">
          Looking for <strong>"travk usps"</strong>? You're in the right place! Track your USPS packages for free.
        </p>
        <p className="text-sm text-primary-foreground/50 mb-8">
          Common searches: travk usps, trak usps, trck usps, isps track
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
          <Search className="h-5 w-5" /> Track USPS Now <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    <section className="container max-w-4xl py-12">
      <h2 className="text-2xl font-bold text-foreground mb-4">Did You Mean "Track USPS"?</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
        <p>Many people search for <strong>"travk usps"</strong> or <strong>"isps track"</strong> when they want to track USPS packages. You've found the right tool! Our free <Link to="/" className="text-primary hover:underline">USPS tracking</Link> tool provides real-time package status updates.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "USPS Tracking", to: "/" },
          { label: "Track USPS", to: "/track-usps" },
          { label: "Track My USPS Package", to: "/track-my-usps-package" },
          { label: "Mail Tracking", to: "/mail-tracking" },
          { label: "Post Office Tracking", to: "/post-office-tracking" },
          { label: "Check USPS Tracking", to: "/check-usps-tracking" },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">{link.label}</Link>
        ))}
      </div>
    </section>

    <InternalLinkingHub />
  </Layout>
);

export default TravkUSPSPage;

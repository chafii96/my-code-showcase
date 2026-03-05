import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const USPSTrackintPage = () => (
  <Layout>
    <SEOHead
      title="USPS Trackint – Did You Mean USPS Tracking? Free Package Tracker"
      description="Looking for USPS trackint? You probably meant USPS tracking. Use our free USPS package tracking tool to track your shipments in real time. Enter your tracking number now."
      canonical="/usps-trackint"
      keywords="usps trackint, usps trackjng, usps tracking.m, usps tracking., usps tra, usps.tracking, usps tracking"
    />

    <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
      <div className="container max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Tracking</h1>
        <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-4">
          Looking for <strong>"usps trackint"</strong>? You're in the right place! Track your USPS packages in real time with our free tracking tool.
        </p>
        <p className="text-sm text-primary-foreground/50 mb-8">
          Common searches: usps trackint, usps trackjng, usps tracking.m, usps.tracking, usps tra
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
          <Search className="h-5 w-5" /> Track USPS Package <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    <section className="container max-w-4xl py-12">
      <h2 className="text-2xl font-bold text-foreground mb-4">Did You Mean "USPS Tracking"?</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
        <p>Many people search for <strong>"usps trackint"</strong>, <strong>"usps trackjng"</strong>, or <strong>"usps.tracking"</strong> when they're looking for the USPS package tracking tool. No worries — you've found it! Our free <Link to="/" className="text-primary hover:underline">USPS tracking</Link> tool lets you track any USPS package with a valid tracking number.</p>
        <p>Whether you typed <strong>usps trackint</strong>, <strong>usps tra</strong>, or <strong>usps tracking.m</strong>, we've got you covered. Simply enter your USPS tracking number above to get real-time delivery status updates.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "USPS Tracking", to: "/" },
          { label: "Track USPS", to: "/track-usps" },
          { label: "Post Office Tracking", to: "/post-office-tracking" },
          { label: "Mail Tracking", to: "/mail-tracking" },
          { label: "Track My USPS Package", to: "/track-my-usps-package" },
          { label: "Check USPS Tracking", to: "/check-usps-tracking" },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">{link.label}</Link>
        ))}
      </div>
    </section>

    <InternalLinkingHub />
  </Layout>
);

export default USPSTrackintPage;

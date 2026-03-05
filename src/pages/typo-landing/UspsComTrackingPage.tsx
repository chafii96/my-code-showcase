import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const UspsComTrackingPage = () => (
  <Layout>
    <SEOHead
      title="USPS COM Tracking – Free USPS.com Package Tracker"
      description="Looking for usps com tracking or usps.com/tracking? Track your USPS packages for free with real-time updates. Enter your tracking number for instant results."
      canonical="/usps-com-tracking"
      keywords="usps com tracking, usps.com/tracking, usps.com usps tracking, usps com usps tracking, usps com track, usps.com-track, usps.com tracking"
      structuredData={[{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How do I use USPS.com tracking?", acceptedAnswer: { "@type": "Answer", text: "You can track USPS packages by entering your tracking number on our free tracking tool. We provide the same tracking data as usps.com with a faster, more user-friendly experience." }},
          { "@type": "Question", name: "What is USPS.com/tracking?", acceptedAnswer: { "@type": "Answer", text: "USPS.com/tracking is the official USPS tracking page. You can also use our free alternative tracker which provides real-time updates for all USPS shipments." }},
        ]
      }]}
    />

    <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
      <div className="container max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS.COM Tracking</h1>
        <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-4">
          Searching for <strong>"usps com tracking"</strong>? Track your packages here instantly – free and fast!
        </p>
        <p className="text-sm text-primary-foreground/50 mb-8">
          Common searches: usps com tracking, usps.com/tracking, usps.com usps tracking, usps com track
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
          <Search className="h-5 w-5" /> Track USPS Now <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    <section className="container max-w-4xl py-12">
      <h2 className="text-2xl font-bold text-foreground mb-4">USPS.COM Tracking – Track Packages Online</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
        <p>If you searched for <strong>"usps com tracking"</strong>, <strong>"usps.com/tracking"</strong>, or <strong>"usps.com usps tracking"</strong>, you want to track a USPS package. Our free <Link to="/" className="text-primary hover:underline">USPS tracking tool</Link> gives you instant access to real-time tracking data for any USPS shipment.</p>
        <p>Enter your USPS tracking number (usually 20-22 digits starting with 9) to see your package's current location, delivery status, and estimated delivery date.</p>
        <h3 className="text-lg font-semibold text-foreground">USPS Tracking Number Formats</h3>
        <p>Not sure about your tracking number? Check our <Link to="/tracking-number-formats" className="text-primary hover:underline">USPS tracking number formats guide</Link> to identify your shipment type:</p>
        <ul>
          <li><strong>Priority Mail:</strong> 9405 or 9205 followed by 18 digits</li>
          <li><strong>Certified Mail:</strong> 9407 followed by 18 digits</li>
          <li><strong>First Class:</strong> 9400 or 9200 followed by 18 digits</li>
          <li><strong>Express Mail:</strong> EA-EZ followed by 9 digits and US</li>
        </ul>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "USPS Tracking", to: "/" },
          { label: "Track & Trace USPS", to: "/track-and-trace-usps" },
          { label: "US Post Tracking", to: "/us-post-tracking" },
          { label: "Post Office Tracking", to: "/post-office-tracking" },
          { label: "Tracking Number Formats", to: "/tracking-number-formats" },
          { label: "Tracking Lookup", to: "/tracking-lookup" },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">{link.label}</Link>
        ))}
      </div>
    </section>

    <InternalLinkingHub currentPath="/usps-com-tracking" />
  </Layout>
);

export default UspsComTrackingPage;

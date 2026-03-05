import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const UspsTrackingSearchPage = () => (
  <Layout>
    <SEOHead
      title="USPS Tracking Search – Look Up Any USPS Package Free"
      description="Use our free USPS tracking search tool to look up any package. Enter your USPS tracking number for instant delivery status, location updates, and estimated arrival."
      canonical="/usps-tracking-search"
      keywords="usps tracking search, usps search tracking, usps tracking number search, usps tracking number lookup, usps tracking lookup, tracking number usps search"
      structuredData={[{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How do I search for my USPS tracking number?", acceptedAnswer: { "@type": "Answer", text: "Enter your USPS tracking number in our free search tool above. You'll instantly see your package's current status, location, and estimated delivery date." }},
          { "@type": "Question", name: "Can I search USPS tracking by name?", acceptedAnswer: { "@type": "Answer", text: "USPS tracking requires a tracking number. If you've lost your number, check your email receipt, the sender's records, or sign up for USPS Informed Delivery to track mail sent to your address." }},
          { "@type": "Question", name: "What if my USPS tracking search shows no results?", acceptedAnswer: { "@type": "Answer", text: "If your tracking search returns no results, the package may not yet be scanned into the system. Wait 24 hours and try again. Check our guide on tracking not updating for more help." }},
        ]
      }]}
    />

    <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
      <div className="container max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Tracking Search</h1>
        <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-4">
          Search and track any USPS package instantly with our free tracking tool.
        </p>
        <p className="text-sm text-primary-foreground/50 mb-8">
          Common searches: usps tracking search, usps tracking number search, usps tracking number lookup
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
          <Search className="h-5 w-5" /> Search USPS Tracking <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    <section className="container max-w-4xl py-12">
      <h2 className="text-2xl font-bold text-foreground mb-4">How to Search USPS Tracking</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
        <p>Our <strong>USPS tracking search</strong> tool makes it easy to find your package. Simply enter your tracking number and get instant results with real-time delivery updates.</p>
        <h3 className="text-lg font-semibold text-foreground">Step-by-Step USPS Tracking Search</h3>
        <ol>
          <li><strong>Find your tracking number</strong> – Check your receipt, shipping confirmation email, or the sender</li>
          <li><strong>Enter the number above</strong> – Paste or type your USPS tracking number</li>
          <li><strong>Get instant results</strong> – See current status, location, and delivery estimate</li>
          <li><strong>Track in real-time</strong> – Bookmark the results page for ongoing updates</li>
        </ol>
        <h3 className="text-lg font-semibold text-foreground">Lost Your Tracking Number?</h3>
        <p>If you can't find your tracking number, try these options:</p>
        <ul>
          <li>Check your email for shipping confirmation</li>
          <li>Contact the sender or retailer</li>
          <li>Sign up for <strong>USPS Informed Delivery</strong> to see incoming mail</li>
          <li>Visit your local post office with your receipt</li>
        </ul>
        <p>For more help, see our guide on <Link to="/tracking-not-updating" className="text-primary hover:underline">what to do when USPS tracking is not updating</Link>.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "USPS Tracking", to: "/" },
          { label: "Tracking Lookup", to: "/tracking-lookup" },
          { label: "Live Tracking", to: "/live-tracking" },
          { label: "Check USPS Tracking", to: "/check-usps-tracking" },
          { label: "Track My Package", to: "/track-my-usps-package" },
          { label: "Tracking Not Updating", to: "/tracking-not-updating" },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">{link.label}</Link>
        ))}
      </div>
    </section>

    <InternalLinkingHub currentPath="/usps-tracking-search" />
  </Layout>
);

export default UspsTrackingSearchPage;

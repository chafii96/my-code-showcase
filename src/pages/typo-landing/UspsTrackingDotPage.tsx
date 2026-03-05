import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const UspsTrackingDotPage = () => (
  <Layout>
    <SEOHead
      title="USPS Tracking – Free Package & Mail Tracker | usps.tracking"
      description="Searched for usps.tracking or usps tracking.? You're in the right place. Track any USPS package for free with real-time updates. Enter your tracking number now."
      canonical="/usps-tracking-dot"
      keywords="usps.tracking, usps tracking., usps' tracking, usps.com tracking, usps tracking website, usps tracking search"
      structuredData={[{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What does usps.tracking mean?", acceptedAnswer: { "@type": "Answer", text: "People searching for 'usps.tracking' or 'usps tracking.' are looking for the USPS package tracking service. You can track any USPS package for free using a valid tracking number." }},
          { "@type": "Question", name: "How do I track a USPS package?", acceptedAnswer: { "@type": "Answer", text: "Enter your USPS tracking number (typically 20-22 digits) in our free tracking tool to get real-time status updates on your package." }},
        ]
      }]}
    />

    <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
      <div className="container max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Tracking</h1>
        <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-4">
          Searched for <strong>"usps.tracking"</strong> or <strong>"usps tracking."</strong>? You're in the right place!
        </p>
        <p className="text-sm text-primary-foreground/50 mb-8">
          Common searches: usps.tracking, usps tracking., usps' tracking, usps.com tracking
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
          <Search className="h-5 w-5" /> Track Your Package <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    <section className="container max-w-4xl py-12">
      <h2 className="text-2xl font-bold text-foreground mb-4">USPS Tracking – Official Package Tracker</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
        <p>If you typed <strong>"usps.tracking"</strong>, <strong>"usps tracking."</strong>, or <strong>"usps' tracking"</strong>, you were looking for the United States Postal Service tracking tool. Our free <Link to="/" className="text-primary hover:underline">USPS tracking</Link> service provides instant, real-time updates on any USPS shipment.</p>
        <p>Simply enter your tracking number above to get the latest status of your package, including location updates, delivery estimates, and delivery confirmation.</p>
        <h3 className="text-lg font-semibold text-foreground">What Can You Track?</h3>
        <ul>
          <li><Link to="/priority-mail-tracking" className="text-primary hover:underline">Priority Mail</Link> – 1-3 day delivery with tracking</li>
          <li><Link to="/certified-mail-tracking" className="text-primary hover:underline">Certified Mail</Link> – Proof of mailing and delivery</li>
          <li><Link to="/first-class-tracking" className="text-primary hover:underline">First Class Mail</Link> – Letters and lightweight packages</li>
          <li><Link to="/express-mail-tracking" className="text-primary hover:underline">Priority Mail Express</Link> – Overnight guaranteed delivery</li>
          <li><Link to="/ground-advantage-tracking" className="text-primary hover:underline">Ground Advantage</Link> – Affordable ground shipping</li>
          <li><Link to="/international-tracking" className="text-primary hover:underline">International shipments</Link> – Global package tracking</li>
        </ul>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "USPS Tracking", to: "/" },
          { label: "Tracking Lookup", to: "/tracking-lookup" },
          { label: "Live Tracking", to: "/live-tracking" },
          { label: "USPS Tracker", to: "/usps-tracker" },
          { label: "Mail Tracking", to: "/mail-tracking" },
          { label: "Track USPS", to: "/track-usps" },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">{link.label}</Link>
        ))}
      </div>
    </section>

    <InternalLinkingHub currentPath="/usps-tracking-dot" />
  </Layout>
);

export default UspsTrackingDotPage;

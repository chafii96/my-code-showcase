import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AlertTriangle, CheckCircle, Clock, DollarSign, Phone, FileText, Shield, Search, Package } from "lucide-react";

const carrierClaims = [
  {
    carrier: "USPS",
    deadline: "60 days from mailing date",
    process: [
      "Wait 7 days (domestic) or 30 days (international) after expected delivery",
      "Submit a Missing Mail Search request at usps.com",
      "If not found within 7 days, file an insurance claim online",
      "Provide proof of value (receipt, invoice, screenshot)",
      "USPS reviews and responds within 5-10 business days",
    ],
    contact: "1-800-275-8777",
    maxCoverage: "Up to $5,000 (Priority Mail Express) or declared value",
  },
  {
    carrier: "FedEx",
    deadline: "60 days from ship date (9 months for international)",
    process: [
      "Contact FedEx at 1-800-463-3339 to report missing package",
      "FedEx initiates a trace (takes 1-2 business days)",
      "If not found, file a claim online at fedex.com/claims",
      "Provide tracking number, proof of value, and damage photos if applicable",
      "FedEx processes claims within 5-7 business days",
    ],
    contact: "1-800-463-3339",
    maxCoverage: "Up to $100 default ($300 for FedEx Express) or declared value",
  },
  {
    carrier: "UPS",
    deadline: "60 days from delivery date (or scheduled delivery)",
    process: [
      "File a claim at ups.com/claims within 60 days",
      "Provide tracking number and proof of value",
      "UPS investigates (typically 8-15 business days)",
      "If approved, UPS issues payment via check or direct deposit",
    ],
    contact: "1-800-742-5877",
    maxCoverage: "Up to $100 default or declared value",
  },
  {
    carrier: "DHL",
    deadline: "30 days from ship date",
    process: [
      "Contact DHL customer service to report the issue",
      "File a claim online at dhl.com",
      "Provide commercial invoice and proof of value",
      "DHL investigates within 5-10 business days",
    ],
    contact: "1-800-225-5345",
    maxCoverage: "Based on declared value and service level",
  },
];

const preventionTips = [
  { tip: "Always purchase shipping insurance for items over $50", icon: Shield },
  { tip: "Use signature confirmation for valuable packages", icon: FileText },
  { tip: "Take photos of items and packaging before shipping", icon: Search },
  { tip: "Use trackable shipping services — never ship valuable items without tracking", icon: Package },
  { tip: "Ship to verified addresses and avoid P.O. boxes for valuable items", icon: CheckCircle },
  { tip: "Keep all receipts and proof of purchase for potential claims", icon: DollarSign },
];

const LostPackageGuide = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Lost or Missing Package? Complete Recovery Guide 2026",
    author: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: "2026-02-01",
    dateModified: "2026-03-01",
  };

  return (
    <Layout>
      <SEOHead
        title="Lost Package? Complete Recovery Guide 2026 — USPS, FedEx, UPS, DHL Claims"
        description="Step-by-step guide to find, report, and get compensation for lost packages. File claims with USPS, FedEx, UPS, and DHL. Includes deadlines, contact numbers, and prevention tips."
        keywords="lost package, missing package, lost package claim, USPS lost package, FedEx lost package, UPS lost package, DHL lost package, shipping insurance claim, package not delivered"
        canonical="https://uspostaltracking.com/knowledge-center/lost-package-guide"
        structuredData={[articleSchema]}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Knowledge Center", url: "/knowledge-center" },
        { name: "Lost Package Guide", url: "/knowledge-center/lost-package-guide" },
      ]} />

      <div className="container py-8 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <Link to="/knowledge-center" className="hover:text-primary">Knowledge Center</Link><span>/</span>
          <span className="text-foreground">Lost Package Guide</span>
        </nav>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">10 min read • Updated March 2026</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Lost or Missing Package? Complete Recovery Guide</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          A missing package is stressful, but don't panic. This guide walks you through exactly what to do — from verifying your tracking status to filing claims and getting refunds with every major carrier.
        </p>

        {/* Step 1: Verify */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Search className="h-5 w-5 text-blue-500" /> Step 1: Verify Before You Panic</h2>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
            <p className="text-sm text-muted-foreground mb-3">Before filing a claim, check these common situations first:</p>
            <div className="space-y-2">
              {[
                "Check all possible delivery locations (porch, garage, mailbox, with neighbor)",
                "Verify the shipping address is correct",
                "Check if someone else at the address accepted the package",
                "Look for a delivery notice or \"Sorry We Missed You\" slip",
                "Wait until end of day — packages marked \"delivered\" may still be in transit",
                "Check tracking status — the package may be delayed, not lost",
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step 2: Carrier Claims */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-violet-500" /> Step 2: File a Claim by Carrier</h2>

          {carrierClaims.map(carrier => (
            <div key={carrier.carrier} className="mb-6 bg-card border rounded-xl overflow-hidden">
              <div className="bg-muted/50 p-4 flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-bold text-foreground text-base">{carrier.carrier}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Deadline: {carrier.deadline}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {carrier.contact}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-foreground mb-2">How to File:</h4>
                  <ol className="space-y-1.5">
                    {carrier.process.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="bg-primary/10 text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex items-center gap-2 text-sm bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2.5">
                  <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Max Coverage:</strong> {carrier.maxCoverage}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Claim Deadlines Comparison */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-amber-500" /> Claim Deadlines at a Glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-3 text-foreground font-semibold">Carrier</th>
                  <th className="text-left py-2 pr-3 text-foreground font-semibold">Filing Deadline</th>
                  <th className="text-left py-2 pr-3 text-foreground font-semibold">Default Insurance</th>
                  <th className="text-left py-2 text-foreground font-semibold">Processing Time</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50"><td className="py-2 pr-3 font-medium text-foreground">USPS</td><td className="py-2 pr-3">60 days</td><td className="py-2 pr-3">$50–$100</td><td className="py-2">5–10 days</td></tr>
                <tr className="border-b border-border/50"><td className="py-2 pr-3 font-medium text-foreground">FedEx</td><td className="py-2 pr-3">60 days</td><td className="py-2 pr-3">$100–$300</td><td className="py-2">5–7 days</td></tr>
                <tr className="border-b border-border/50"><td className="py-2 pr-3 font-medium text-foreground">UPS</td><td className="py-2 pr-3">60 days</td><td className="py-2 pr-3">$100</td><td className="py-2">8–15 days</td></tr>
                <tr className="border-b border-border/50"><td className="py-2 pr-3 font-medium text-foreground">DHL</td><td className="py-2 pr-3">30 days</td><td className="py-2 pr-3">Varies</td><td className="py-2">5–10 days</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Prevention */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-500" /> Prevention Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {preventionTips.map(item => (
              <div key={item.tip} className="flex gap-3 p-4 bg-card border rounded-lg">
                <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{item.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "What should I do if my USPS package is lost?", a: "Wait 7 days past expected delivery, submit a Missing Mail Search at usps.com, then file an insurance claim if not found within 7 days." },
              { q: "How long do I have to file a lost package claim?", a: "USPS: 60 days. FedEx: 60 days (9 months international). UPS: 60 days. DHL: 30 days. File as soon as possible." },
              { q: "Can I get a refund without insurance?", a: "Yes, but limited to default coverage: USPS Priority Mail ($100), FedEx ($100–$300), UPS ($100). Additional insurance is recommended for valuable items." },
            ].map(item => (
              <details key={item.q} className="group bg-card border rounded-lg">
                <summary className="p-4 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {item.q}<span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <div className="bg-card border rounded-xl p-5 mb-8">
          <h2 className="font-bold text-foreground mb-3">Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link to="/knowledge-center/customs-clearance-guide" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5"><Shield className="h-4 w-4" /> Customs Clearance Guide</Link>
            <Link to="/knowledge-center/international-shipping-guide" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5"><Package className="h-4 w-4" /> International Shipping Guide</Link>
            <Link to="/usps-lost-package" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5"><AlertTriangle className="h-4 w-4" /> USPS Lost Package Help</Link>
            <Link to="/usps-package-not-delivered" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5"><Package className="h-4 w-4" /> USPS Not Delivered</Link>
          </div>
        </div>

        <InternalLinkingHub currentPath="/knowledge-center/lost-package-guide" variant="compact" />
      </div>
    </Layout>
  );
};

export default LostPackageGuide;

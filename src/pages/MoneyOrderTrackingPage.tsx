import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, DollarSign, Shield, FileText, HelpCircle } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const MoneyOrderTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Money Order Tracking – Track Money Orders Online Free"
        description="Track USPS money orders online. Verify if your money order has been cashed, check status, and learn how to file a claim for lost or stolen USPS money orders. Free money order tracking tool."
        canonical="/money-order-tracking"
        keywords="usps money order tracking, track a money order from usps, usps money order, money order tracking usps, track money order usps, usps money order status, usps money order inquiry, how to track usps money order, usps money order verification"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <DollarSign className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Money Order Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Money Order Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track and verify USPS money orders online. Check if your money order has been cashed, file inquiries, and learn how to replace lost or stolen money orders.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Package <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How to Track a USPS Money Order</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USPS money order tracking</strong> works differently from package tracking. Unlike packages with barcode-based tracking, money orders are tracked using their <strong>11-digit serial number</strong> and the <strong>exact dollar amount</strong>. This information is printed on both the money order itself and the customer receipt stub.
          </p>
          <p>
            USPS sells domestic money orders up to <strong>$1,000</strong> and international money orders up to <strong>$700</strong>. The fee for a domestic money order is $1.75 (up to $500) or $2.40 ($500.01-$1,000). To <strong>track a money order from USPS</strong>, keep your receipt stub — it contains the serial number needed for tracking and claims.
          </p>
          <p>
            You can verify whether your <strong>USPS money order</strong> has been cashed through three methods: online verification at USPS.com, by calling <strong>1-866-459-7822</strong>, or by submitting <strong>PS Form 6401</strong> at your local post office. Online verification is the fastest, providing instant results for money orders processed within the last few years.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Money Order Tracking Steps</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Find Your Serial Number", desc: "Locate the 11-digit serial number on your money order receipt stub (the detachable part you kept). It's at the top of the receipt." },
              { step: 2, title: "Note the Exact Amount", desc: "You'll need the exact dollar amount of the money order. This serves as a secondary verification to prevent unauthorized inquiries." },
              { step: 3, title: "Check Online", desc: "Visit USPS.com → Shop → Money Orders → Money Order Inquiry. Enter the serial number and amount to check if it's been cashed." },
              { step: 4, title: "File a Claim if Needed", desc: "If lost/stolen, complete PS Form 6401 at your post office. Pay the $6.95 processing fee. USPS will investigate and issue a replacement (takes up to 60 days)." },
            ].map((item) => (
              <div key={item.step} className="bg-card border rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Certified Mail Tracking", to: "/certified-mail-tracking" },
            { label: "Priority Mail Tracking", to: "/priority-mail-tracking" },
            { label: "Tracking Lookup", to: "/tracking-lookup" },
            { label: "Mail Tracking", to: "/mail-tracking" },
            { label: "Track USPS", to: "/track-usps" },
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

export default MoneyOrderTrackingPage;

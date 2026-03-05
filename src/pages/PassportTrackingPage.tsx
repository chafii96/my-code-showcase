import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, FileText, Clock, Shield, MapPin } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const PassportTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Passport Tracking – Track Passport Delivery Status"
        description="Track USPS passport delivery online. Monitor your new or renewed passport shipment via USPS Priority Mail Express. Free passport delivery tracking with real-time updates."
        canonical="/passport-tracking"
        keywords="usps passport tracking, passport tracker usps, tracking usps passport, usps passport delivery, track passport usps, usps passport, passport tracking usps, passport delivery tracking, usps passport status"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <FileText className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Passport Delivery Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Passport Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your U.S. passport delivery through USPS. Monitor the shipment of your new or renewed passport via Priority Mail Express with free real-time tracking.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Passport Delivery <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How USPS Passport Tracking Works</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USPS passport tracking</strong> allows you to monitor the delivery of your U.S. passport after it's been processed and shipped by the Department of State. All U.S. passports are delivered via <strong>USPS Priority Mail Express</strong>, the fastest USPS shipping service, ensuring your important travel document arrives safely and quickly.
          </p>
          <p>
            When the State Department mails your passport, you'll receive an email with a <strong>USPS Priority Mail Express tracking number</strong>. Enter this number in our tracking tool to see real-time updates on your passport's journey from the processing facility to your mailbox. Passports typically arrive within <strong>1-2 business days</strong> after being shipped.
          </p>
          <p>
            Many people search for "<strong>passport tracker USPS</strong>" or "<strong>tracking USPS passport</strong>" because they're anxious about receiving their passport before a planned trip. Our tool provides the same detailed tracking data that USPS employees see internally, including facility scans, out-for-delivery notifications, and delivery confirmation.
          </p>
          <p>
            It's important to note that <strong>USPS passport tracking</strong> only covers the delivery portion. To track your overall passport application status (processing stage), visit <strong>travel.state.gov</strong> and check your application status there. Once the passport ships, switch to our USPS tracking tool for delivery monitoring.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Passport Application Timeline</h2>
          <div className="space-y-3">
            {[
              { step: "Application Submitted", time: "Day 0", desc: "Apply at a passport acceptance facility or by mail. Routine processing begins." },
              { step: "Application Processing", time: "4-8 weeks (routine) / 2-3 weeks (expedited)", desc: "State Department reviews your application, verifies documents, and produces your passport." },
              { step: "Passport Shipped via USPS", time: "After processing", desc: "You receive a USPS Priority Mail Express tracking number via email." },
              { step: "Passport Delivered", time: "1-2 business days after shipping", desc: "Delivered to your address via Priority Mail Express. Signature may be required." },
            ].map((item) => (
              <div key={item.step} className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-foreground">{item.step}</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{item.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
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
            { label: "Express Mail Tracking", to: "/express-mail-tracking" },
            { label: "Priority Mail Tracking", to: "/priority-mail-tracking" },
            { label: "Certified Mail Tracking", to: "/certified-mail-tracking" },
            { label: "Tracking Lookup", to: "/tracking-lookup" },
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

export default PassportTrackingPage;

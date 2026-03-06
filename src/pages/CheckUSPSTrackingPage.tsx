import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, CheckCircle, Clock, Shield, AlertTriangle } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const CheckUSPSTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Check USPS Tracking – Free USPS Tracking Status Checker"
        description="Check USPS tracking status online free. Enter your USPS tracking number to check delivery status, current location, and estimated arrival. Free USPS tracking checker — instant results."
        canonical="/check-usps-tracking"
        keywords="check usps tracking, check usps tracking status, usps tracking check, check my usps tracking, check usps package tracking, usps check tracking number, check tracking usps, usps tracking status check"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Free Tracking Checker</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Check USPS Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Check your USPS tracking status instantly — free and online. Enter your tracking number to see real-time delivery updates for any USPS package.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Check Tracking Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How to Check USPS Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            To <strong>check USPS tracking</strong>, all you need is your tracking number. Our free tracking checker connects directly to the USPS database to show you the most up-to-date information about your package's location and delivery status.
          </p>
          <p>
            When you <strong>check USPS tracking status</strong> on our site, you'll see a complete timeline of your package's journey — from the moment it was accepted by USPS to its current location. Each scan event includes the date, time, facility location, and status code.
          </p>
          <p>
            Our <strong>USPS tracking checker</strong> works for all USPS services: Priority Mail, First-Class Package, Ground Advantage, Certified Mail, Registered Mail, and international shipments. Whether you need to <strong>check USPS package tracking</strong> for a holiday gift or an important document, we've got you covered.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">USPS Tracking Statuses Explained</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Package, title: "Pre-Shipment", desc: "Label created but USPS hasn't received the package yet. The sender has printed a shipping label.", status: "⏳" },
              { icon: Clock, title: "In Transit", desc: "Your package is moving through the USPS network. It's being transported between facilities.", status: "🚛" },
              { icon: Shield, title: "Out for Delivery", desc: "Your package is on the delivery vehicle and should arrive today. Watch for your mail carrier!", status: "📦" },
              { icon: CheckCircle, title: "Delivered", desc: "Your package has been successfully delivered. Check your mailbox, porch, or designated safe location.", status: "✅" },
              { icon: AlertTriangle, title: "Alert / Exception", desc: "An issue needs attention — delivery attempt failed, address problems, or customs hold.", status: "⚠️" },
              { icon: Package, title: "Available for Pickup", desc: "Your package is at the post office ready for you to pick up. Bring valid photo ID.", status: "🏢" },
            ].map((s) => (
              <div key={s.title} className="bg-card border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{s.status}</span>
                  <h3 className="font-bold text-foreground">{s.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More USPS Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Track USPS", to: "/track-usps" },
            { label: "Track My USPS Package", to: "/track-my-usps-package" },
            { label: "Where Is My Package", to: "/where-is-my-package" },
            { label: "USPS Tracker", to: "/usps-tracker" },
            { label: "Post Office Tracking", to: "/post-office-tracking" },
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

export default CheckUSPSTrackingPage;

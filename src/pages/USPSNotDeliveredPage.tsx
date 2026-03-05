import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { AlertTriangle, Search, ArrowRight, CheckCircle, Clock, MapPin, Phone, Package, Eye } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSNotDeliveredPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Package Not Delivered – What to Do When USPS Doesn't Deliver"
        description="USPS package not delivered? Step-by-step guide to find your missing package, file a complaint, request redelivery, or get a refund. Track your USPS package status now."
        canonical="/usps-package-not-delivered"
        keywords="usps package not delivered, usps says delivered but not received, usps not delivered, usps missed delivery, usps package not received, usps delivery failure, usps didn't deliver, usps no delivery"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Delivery Issues Help</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Package Not Delivered</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Expecting a package that never arrived? We'll help you figure out what happened and what to do next.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" />Check Package Status<ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Scenarios */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Common "Not Delivered" Scenarios</h2>
        <div className="space-y-4">
          {[
            { scenario: "Tracking Says \"Delivered\" But No Package", action: "Wait 24 hours, check all delivery locations (mailbox, doors, neighbors, building office), check security cameras. If still missing, file a Missing Mail request at usps.com.", icon: Eye },
            { scenario: "Tracking Says \"Out for Delivery\" But Not Received", action: "Carriers deliver until 8PM. If it's still showing Out for Delivery by 8PM, wait until the next business day. Sometimes packages are rescanned the next morning.", icon: Clock },
            { scenario: "Tracking Says \"In Transit\" Past Expected Date", action: "Your package is delayed but still moving. Wait 5-7 business days past the expected date before filing a Missing Mail request. Weather, volume, and routing issues can cause delays.", icon: Package },
            { scenario: "Tracking Says \"Delivery Attempted\" / \"Notice Left\"", action: "Your carrier tried to deliver but you weren't home (or the package required a signature). Check your mailbox for PS Form 3849. Schedule redelivery at usps.com/redelivery or pick up at the post office.", icon: MapPin },
            { scenario: "Tracking Says \"Held at Post Office\"", action: "Your package is waiting for you. Bring photo ID and pick it up during business hours. USPS holds packages for 15 days before returning to sender.", icon: CheckCircle },
          ].map((item) => (
            <div key={item.scenario} className="bg-card border rounded-xl p-5">
              <div className="flex items-start gap-3">
                <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.scenario}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Not Delivered FAQ</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((item, i) => (
              <div key={i} className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Still Need Help?</h2>
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Call USPS: 1-800-275-8777</span>
          </div>
          <p className="text-sm text-muted-foreground">Available Mon–Sat 8AM–8:30PM ET. Have your tracking number ready. Press 3 → 2 for package inquiries.</p>
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-package-not-delivered" variant="compact" />
    </Layout>
  );
};

export default USPSNotDeliveredPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Package, Search, MapPin, Clock, AlertTriangle, CheckCircle, ArrowRight, Phone, Mail } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const WhereIsMyPackagePage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Where Is My Package USPS – Track Your USPS Package Location"
        description="Find out where your USPS package is right now. Free real-time USPS package tracking — enter your tracking number to see current location, delivery status, and estimated arrival time."
        canonical="/where-is-my-package"
        keywords="where is my package usps, where is my usps package, find my usps package, usps package location, where is my mail usps, usps where is my package, track my usps package location"
        structuredData={faqSchema}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Real-Time Package Finder</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            Where Is My USPS Package?
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Find your USPS package right now — enter your tracking number below and see exactly where your package is, when it was last scanned, and when it will arrive.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" />
            Find My Package Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* How to Find Your Package */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How to Find Your USPS Package</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            Wondering <strong>"where is my package USPS?"</strong> — you're not alone. Millions of Americans track USPS packages every day. The fastest way to find your package is to enter your <strong>USPS tracking number</strong> in the search box above. You'll instantly see:
          </p>
          <ul>
            <li><strong>Current location</strong> — the last USPS facility that scanned your package</li>
            <li><strong>Delivery status</strong> — In Transit, Out for Delivery, Delivered, or Alert</li>
            <li><strong>Estimated delivery date</strong> — when USPS expects to deliver your package</li>
            <li><strong>Complete scan history</strong> — every stop your package has made</li>
          </ul>
        </div>
      </section>

      {/* Package Status Guide */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Your USPS Package Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { status: "In Transit", desc: "Your package is moving through the USPS network and on its way to you. It may not be scanned at every facility.", icon: Package, color: "text-blue-600" },
              { status: "Out for Delivery", desc: "Great news! Your package is on the mail carrier's truck and will be delivered today.", icon: MapPin, color: "text-green-600" },
              { status: "Delivered", desc: "Your package has been delivered. Check your mailbox, front door, or ask neighbors.", icon: CheckCircle, color: "text-emerald-600" },
              { status: "In Transit, Arriving Late", desc: "Your package is delayed but still moving. Weather, high volume, or routing changes can cause delays.", icon: Clock, color: "text-orange-600" },
              { status: "Alert / Exception", desc: "There's an issue with delivery — wrong address, recipient not available, or customs hold. Check details for next steps.", icon: AlertTriangle, color: "text-red-600" },
              { status: "Pre-Shipment", desc: "USPS has received electronic shipping info but hasn't received the physical package yet.", icon: Mail, color: "text-gray-600" },
            ].map((item) => (
              <div key={item.status} className="bg-card border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <h3 className="font-semibold text-foreground">{item.status}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Do If Package Is Missing */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What to Do If You Can't Find Your USPS Package</h2>
        <div className="space-y-6">
          {[
            { step: "1", title: "Check All Delivery Locations", desc: "Look at your front door, back door, mailbox, porch, garage, and with neighbors. USPS carriers sometimes leave packages in safe spots." },
            { step: "2", title: "Wait 24 Hours After \"Delivered\"", desc: "Sometimes packages are scanned as delivered before the carrier completes the route. Wait a full day before taking action." },
            { step: "3", title: "Contact Your Local Post Office", desc: "Call your local USPS office with your tracking number. They can check with the carrier who delivered it and may be able to locate it." },
            { step: "4", title: "File a Missing Mail Request", desc: "Go to usps.com/help/missing-mail.htm and submit a search request. USPS will investigate and try to locate your package within 7-14 days." },
            { step: "5", title: "File an Insurance Claim", desc: "If your package was insured (Priority Mail includes $100 insurance), file a claim at usps.com/help/claims.htm after the investigation period." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{item.step}</span>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
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

      {/* USPS Contact Info */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Contact USPS About Your Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-5 text-center">
            <Phone className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-sm">Call USPS</h3>
            <p className="text-sm text-muted-foreground mt-1">1-800-275-8777</p>
            <p className="text-xs text-muted-foreground">Mon–Sat 8AM–8:30PM ET</p>
          </div>
          <div className="bg-card border rounded-lg p-5 text-center">
            <Mail className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-sm">Email USPS</h3>
            <p className="text-sm text-muted-foreground mt-1">usps.com/help</p>
            <p className="text-xs text-muted-foreground">Response within 1-3 days</p>
          </div>
          <div className="bg-card border rounded-lg p-5 text-center">
            <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-sm">Visit Post Office</h3>
            <p className="text-sm text-muted-foreground mt-1">Find nearest location</p>
            <p className="text-xs text-muted-foreground">Bring your tracking number</p>
          </div>
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/where-is-my-package" variant="compact" />
    </Layout>
  );
};

export default WhereIsMyPackagePage;

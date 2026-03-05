import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Truck, Search, Clock, Package, CheckCircle, ArrowRight, Calendar, Home } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSSchedulePickupPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Schedule Pickup – Free USPS Package Pickup from Home"
        description="Schedule a free USPS package pickup from your home or office. Learn how to arrange USPS carrier pickup for Priority Mail, Ground Advantage, and more. No trip to the post office needed."
        canonical="/usps-schedule-pickup"
        keywords="usps schedule pickup, usps pickup, usps package pickup, schedule usps pickup, usps free pickup, usps carrier pickup, usps pickup from home, usps pickup schedule"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Free Pickup Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Schedule Pickup</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Skip the trip to the post office. Schedule a free USPS package pickup from your home or office — your mail carrier picks up your packages during regular delivery.
          </p>
          <a href="https://tools.usps.com/schedule-pickup-steps.htm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Calendar className="h-5 w-5" />Schedule Pickup at USPS.com<ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* How to Schedule */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Schedule a USPS Pickup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Go to USPS.com", desc: "Visit tools.usps.com/schedule-pickup-steps.htm and log in or create a free USPS account.", icon: Search },
            { step: "2", title: "Enter Address", desc: "Enter the pickup address where your packages will be waiting for the carrier.", icon: Home },
            { step: "3", title: "Select Date & Packages", desc: "Choose your pickup date and describe the number and type of packages.", icon: Calendar },
            { step: "4", title: "Leave Packages Out", desc: "Place packages in a visible, accessible location before your carrier arrives.", icon: Package },
          ].map((item) => (
            <div key={item.step} className="bg-card border rounded-xl p-5 text-center">
              <span className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto mb-3">{item.step}</span>
              <item.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligible Services */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">What Can USPS Pick Up for Free?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Priority Mail & Priority Mail Express", eligible: true },
              { name: "USPS Ground Advantage", eligible: true },
              { name: "First-Class Package Service", eligible: true },
              { name: "International Priority Mail", eligible: true },
              { name: "USPS Returns", eligible: true },
              { name: "Media Mail (with other eligible packages)", eligible: true },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-3 bg-card border rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{s.name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">Note: At least one package must be a Priority Mail, Priority Mail Express, or international package to schedule a pickup. You can include other mail classes in the same pickup.</p>
        </div>
      </section>

      {/* Tips */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Tips for a Smooth USPS Pickup</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-3 leading-relaxed">
          <ul>
            <li><strong>Schedule by 2AM ET</strong> for same-day pickup (or next business day if after 2AM)</li>
            <li><strong>Place packages in a visible location</strong> — front porch, by the mailbox, or office reception</li>
            <li><strong>Secure all labels</strong> — tape over labels to prevent weather damage</li>
            <li><strong>Include a pickup note</strong> if packages are in a non-obvious location</li>
            <li><strong>Leave packages out early</strong> — carriers may arrive as early as 8AM</li>
            <li><strong>Track after pickup</strong> — enter your tracking numbers on our site to confirm the carrier scanned your packages</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">USPS Pickup FAQ</h2>
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

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-schedule-pickup" variant="compact" />
    </Layout>
  );
};

export default USPSSchedulePickupPage;

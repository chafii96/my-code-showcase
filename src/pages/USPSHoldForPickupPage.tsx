import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Building, Search, Clock, Package, ArrowRight, CheckCircle, MapPin, Shield } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSHoldForPickupPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Hold for Pickup – How to Hold & Pick Up a USPS Package"
        description="Learn how to hold a USPS package for pickup at your local post office. Complete guide to USPS hold for pickup, redelivery, and Package Intercept services."
        canonical="/usps-hold-for-pickup"
        keywords="usps hold for pickup, hold usps package at post office, usps package pickup, usps hold mail, usps redelivery, pick up usps package, usps package intercept, usps hold package"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Building className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Post Office Pickup</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Hold for Pickup</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Can't be home for delivery? Hold your USPS package at the post office and pick it up when it's convenient for you.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" />Track Your Package<ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* 3 Ways to Hold */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">3 Ways to Hold a USPS Package for Pickup</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Package Intercept", desc: "Redirect a package to your post office before delivery. Costs $16.35 and works for most domestic packages. Request at usps.com/manage/package-intercept.htm.", icon: Shield, when: "Before delivery attempt" },
            { title: "Redelivery/Hold Request", desc: "After a failed delivery attempt, you'll get a PS Form 3849 notice. Go to usps.com/redelivery to schedule pickup at the post office or a new delivery date.", icon: Clock, when: "After failed delivery" },
            { title: "Hold Mail Service", desc: "Hold ALL your mail at the post office for 3-30 days while you're away. Free service. Request at usps.com/holdmail.", icon: Building, when: "Vacation / travel" },
          ].map((item) => (
            <div key={item.title} className="bg-card border rounded-xl p-6">
              <item.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-primary font-medium mb-2">{item.when}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What to Bring */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">What to Bring When Picking Up a USPS Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { item: "Valid Photo ID", desc: "Driver's license, passport, state ID, or military ID. The name must match the package addressee.", required: true },
              { item: "Delivery Notice (PS Form 3849)", desc: "The pink/orange slip left by your carrier after a failed delivery attempt. Helpful but not always required.", required: false },
              { item: "Tracking Number", desc: "Your USPS tracking number helps the clerk locate your package quickly. Have it ready on your phone.", required: false },
              { item: "Authorization Letter (if picking up for someone else)", desc: "If the package isn't addressed to you, bring a signed authorization letter from the addressee plus copies of both IDs.", required: true },
            ].map((item) => (
              <div key={item.item} className="bg-card border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className={`h-4 w-4 ${item.required ? 'text-primary' : 'text-muted-foreground'}`} />
                  <h3 className="font-semibold text-foreground text-sm">{item.item}</h3>
                  {item.required && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Required</span>}
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Hold for Pickup FAQ</h2>
        <div className="space-y-4">
          {faqSchema.mainEntity.map((item, i) => (
            <div key={i} className="bg-card border rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-hold-for-pickup" variant="compact" />
    </Layout>
  );
};

export default USPSHoldForPickupPage;

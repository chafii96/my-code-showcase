import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { AlertTriangle, Search, Phone, Mail, FileText, ArrowRight, Shield, Clock, MapPin, CheckCircle } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSLostPackagePage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Lost Package – What to Do When USPS Loses Your Package"
        description="Step-by-step guide for dealing with a lost USPS package. Learn how to file a missing mail request, insurance claim, and get a refund from USPS. Track your lost USPS package now."
        canonical="/usps-lost-package"
        keywords="usps lost package, usps lost my package, usps package lost in transit, lost usps package claim, usps missing package, usps lost package refund, usps lost mail, usps package not delivered"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-destructive/90 via-destructive/80 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Lost Package Help</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Lost Package</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Lost a USPS package? Don't panic. Follow our step-by-step guide to find your package, file a claim, and get your money back.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" />Track Package Status<ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">What to Do When USPS Loses Your Package</h2>
        <div className="space-y-6">
          {[
            { step: "1", title: "Track Your Package First", desc: "Before assuming it's lost, enter your tracking number above. Your package might be delayed, not lost. Check if the status shows 'In Transit, Arriving Late' — this means it's still moving but behind schedule.", icon: Search },
            { step: "2", title: "Wait the Required Period", desc: "USPS requires you to wait 7 business days after the expected delivery date for domestic packages (30 days for international) before filing a missing mail request. This gives time for delayed packages to arrive.", icon: Clock },
            { step: "3", title: "File a Missing Mail Search Request", desc: "Go to usps.com/help/missing-mail.htm and submit a detailed search request. Include your tracking number, package description, contents, sender/receiver addresses, and mailing date. USPS will search for up to 30 days.", icon: FileText },
            { step: "4", title: "Contact Your Local Post Office", desc: "Call or visit the destination post office with your tracking number. The local postmaster can check with carriers and look in their facility for your package. Local offices often resolve issues faster than the national helpline.", icon: MapPin },
            { step: "5", title: "File an Insurance Claim", desc: "If USPS can't find your package and it was insured, file a claim at usps.com/help/claims.htm. Priority Mail includes $100 insurance automatically. You'll need proof of value (receipt) and the tracking information.", icon: Shield },
            { step: "6", title: "Request Seller Replacement/Refund", desc: "If you bought the item online, contact the seller for a replacement or refund. Most retailers (Amazon, eBay, etc.) will reship or refund if USPS confirms the package is lost. Many sellers don't require you to wait the full search period.", icon: CheckCircle },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start bg-card border rounded-xl p-5">
              <span className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">{item.step}</span>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Common Reasons */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Common Reasons USPS Packages Get Lost</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Incorrect or Incomplete Address", desc: "Missing apartment numbers, wrong ZIP codes, or misspelled street names are the #1 cause of lost packages. Always verify the address before shipping." },
              { title: "Label Damage During Transit", desc: "Labels can get torn, smeared, or detached during sorting. Use clear tape over the label and include a return address inside the package as backup." },
              { title: "Missorted at Facility", desc: "With millions of packages processed daily, occasional missorting happens. Your package may end up on the wrong truck and be rerouted, causing significant delays." },
              { title: "Delivered to Wrong Address", desc: "Carriers sometimes deliver to the wrong house, especially in apartment complexes or new developments. Check with neighbors within a 2-house radius." },
              { title: "Stolen After Delivery (Porch Piracy)", desc: "The package may have been delivered and stolen. Check any doorbell cameras and ask neighbors if they saw anything. Consider requiring a signature for valuable items." },
              { title: "Customs Hold (International)", desc: "International packages can be held at customs for inspection without tracking updates. This can last 1-30 days depending on the contents and country regulations." },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Lost USPS Package FAQ</h2>
        <div className="space-y-4">
          {faqSchema.mainEntity.map((item, i) => (
            <div key={i} className="bg-card border rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-4">USPS Customer Service for Lost Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-lg p-5">
              <Phone className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground text-sm">Phone Support</h3>
              <p className="text-sm text-muted-foreground">1-800-275-8777 (Mon–Sat 8AM–8:30PM ET)</p>
              <p className="text-xs text-muted-foreground mt-1">Press 3 → 2 for package inquiries</p>
            </div>
            <div className="bg-card border rounded-lg p-5">
              <Mail className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground text-sm">Online Help</h3>
              <p className="text-sm text-muted-foreground">usps.com/help/missing-mail.htm</p>
              <p className="text-xs text-muted-foreground mt-1">Submit a Missing Mail search request</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-lost-package" variant="compact" />
    </Layout>
  );
};

export default USPSLostPackagePage;

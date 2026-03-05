import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Clock, Package, Truck, MapPin, ArrowRight, Search, Zap, Globe } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSDeliveryTimePage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const deliveryServices = [
    { name: "Priority Mail Express", time: "1–2 business days", guaranteed: true, insurance: "$100", price: "From $28.75", icon: Zap },
    { name: "Priority Mail", time: "1–3 business days", guaranteed: false, insurance: "$100", price: "From $8.70", icon: Truck },
    { name: "First-Class Package", time: "1–5 business days", guaranteed: false, insurance: "None (add-on)", price: "From $4.65", icon: Package },
    { name: "USPS Ground Advantage", time: "2–5 business days", guaranteed: false, insurance: "$100", price: "From $5.00", icon: MapPin },
    { name: "Media Mail", time: "2–8 business days", guaranteed: false, insurance: "None (add-on)", price: "From $3.82", icon: Package },
    { name: "Priority Mail International", time: "6–10 business days", guaranteed: false, insurance: "$200", price: "From $44.50", icon: Globe },
  ];

  return (
    <Layout>
      <SEOHead
        title="USPS Delivery Time – How Long Does USPS Take to Deliver?"
        description="Complete guide to USPS delivery times for every shipping service. Priority Mail (1-3 days), First Class (1-5 days), Ground Advantage (2-5 days), and more. Track your package delivery time."
        canonical="/usps-delivery-time"
        keywords="usps delivery time, how long does usps take, usps delivery days, usps shipping time, how long does usps priority mail take, usps first class delivery time, usps ground advantage delivery time"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Delivery Time Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Delivery Time</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            How long does USPS take to deliver? Find delivery times for every USPS shipping service, plus tips on how to get your package faster.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" />Track My Package<ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Delivery Times Table */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">USPS Delivery Times by Service</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 text-sm font-semibold text-foreground">Service</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">Delivery Time</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground hidden md:table-cell">Insurance</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">Starting Price</th>
              </tr>
            </thead>
            <tbody>
              {deliveryServices.map((s) => (
                <tr key={s.name} className="border-b border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <s.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-foreground">{s.time}</span>
                    {s.guaranteed && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Guaranteed</span>}
                  </td>
                  <td className="p-3 hidden md:table-cell text-sm text-muted-foreground">{s.insurance}</td>
                  <td className="p-3 text-sm font-medium text-foreground">{s.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">* All times are in business days. Prices reflect 2026 rates and may vary by weight and distance.</p>
      </section>

      {/* Factors Affecting Delivery */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Factors That Affect USPS Delivery Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Distance", desc: "Cross-country shipments take longer than local deliveries. A package from New York to California takes 3-5 days via Priority Mail vs. 1-2 days within New York." },
              { title: "Weather & Natural Disasters", desc: "Severe weather (hurricanes, blizzards, flooding) can delay USPS delivery by several days. USPS suspends delivery in unsafe conditions." },
              { title: "Holiday Volume", desc: "Peak shipping seasons (November–January) cause significant delays. During Christmas, add 1-3 extra business days to normal delivery estimates." },
              { title: "Customs Processing", desc: "International packages must clear US Customs, which can add 1-14 days depending on the item, value, and country of origin." },
              { title: "Address Issues", desc: "Incorrect or incomplete addresses cause delays. Always include apartment/suite numbers, correct ZIP codes, and the recipient's full name." },
              { title: "Weekend & Holiday Schedule", desc: "USPS doesn't deliver on federal holidays. Packages shipped Friday may not arrive until Monday or Tuesday, adding to perceived delivery time." },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How to Get Faster USPS Delivery</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-3 leading-relaxed">
          <ol>
            <li><strong>Choose Priority Mail Express</strong> for guaranteed 1-2 day delivery with a money-back guarantee.</li>
            <li><strong>Ship early in the week</strong> — packages shipped Monday–Wednesday avoid weekend delays.</li>
            <li><strong>Drop off at the post office</strong> instead of your mailbox to ensure same-day processing.</li>
            <li><strong>Use correct packaging</strong> — oversized or improperly packaged items may be delayed for re-packing.</li>
            <li><strong>Verify the address</strong> — use USPS Address Verification to confirm the ZIP+4 code before shipping.</li>
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">USPS Delivery Time FAQ</h2>
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
      <InternalLinkingHub currentPath="/usps-delivery-time" variant="compact" />
    </Layout>
  );
};

export default USPSDeliveryTimePage;

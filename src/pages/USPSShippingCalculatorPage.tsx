import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Calculator, Search, ArrowRight, Package, Truck, Zap, MapPin, Globe, DollarSign } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSShippingCalculatorPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const rateComparison = [
    { service: "First-Class Package", weight: "Under 13 oz", from: "$4.65", time: "1-5 days", best: "Small, light items" },
    { service: "USPS Ground Advantage", weight: "Up to 70 lbs", from: "$5.00", time: "2-5 days", best: "Most packages" },
    { service: "Priority Mail", weight: "Up to 70 lbs", from: "$8.70", time: "1-3 days", best: "Fast + insured" },
    { service: "Priority Mail Express", weight: "Up to 70 lbs", from: "$28.75", time: "1-2 days", best: "Urgent shipments" },
    { service: "Media Mail", weight: "Up to 70 lbs", from: "$3.82", time: "2-8 days", best: "Books & media only" },
    { service: "Flat Rate Small Box", weight: "Up to 70 lbs", from: "$10.40", time: "1-3 days", best: "Heavy small items" },
    { service: "Flat Rate Medium Box", weight: "Up to 70 lbs", from: "$17.10", time: "1-3 days", best: "Heavy medium items" },
    { service: "Flat Rate Large Box", weight: "Up to 70 lbs", from: "$22.45", time: "1-3 days", best: "Heavy large items" },
  ];

  return (
    <Layout>
      <SEOHead
        title="USPS Shipping Calculator – Calculate USPS Shipping Costs & Rates"
        description="Calculate USPS shipping costs for any package. Compare rates for Priority Mail, Ground Advantage, First Class, and Flat Rate boxes. Find the cheapest way to ship with USPS in 2026."
        canonical="/usps-shipping-calculator"
        keywords="usps shipping calculator, usps shipping cost, usps postage calculator, how much does usps shipping cost, usps rates, usps shipping prices, usps flat rate, calculate usps shipping, usps package cost"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Calculator className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Shipping Rates Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Shipping Calculator</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Find out how much it costs to ship with USPS. Compare rates across all services and find the cheapest option for your package.
          </p>
          <a href="https://postcalc.usps.com/Calculator/MailServices" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Calculator className="h-5 w-5" />Calculate at USPS.com<ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Rate Table */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">USPS Shipping Rates Comparison (2025–2026)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 font-semibold text-foreground">Service</th>
                <th className="text-left p-3 font-semibold text-foreground">Max Weight</th>
                <th className="text-left p-3 font-semibold text-foreground">Starting At</th>
                <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Delivery</th>
                <th className="text-left p-3 font-semibold text-foreground hidden lg:table-cell">Best For</th>
              </tr>
            </thead>
            <tbody>
              {rateComparison.map((r) => (
                <tr key={r.service} className="border-b border-border">
                  <td className="p-3 font-medium text-foreground">{r.service}</td>
                  <td className="p-3 text-muted-foreground">{r.weight}</td>
                  <td className="p-3 font-semibold text-primary">{r.from}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{r.time}</td>
                  <td className="p-3 text-muted-foreground hidden lg:table-cell">{r.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">* Prices are retail rates as of January 2026. Online/commercial rates may be lower. Actual cost depends on weight, dimensions, and distance.</p>
      </section>

      {/* Save Money Tips */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Save on USPS Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Use Flat Rate Boxes for Heavy Items", desc: "If your item weighs over 5 lbs and fits in a Flat Rate box, you'll save significantly. A 20 lb item in a Large Flat Rate Box costs $22.45 vs. $30+ by weight.", icon: Package },
              { title: "Ship Online for Commercial Rates", desc: "Buying postage online at usps.com or through services like Pirate Ship saves 5-20% compared to retail post office rates.", icon: DollarSign },
              { title: "Use Free USPS Supplies", desc: "USPS provides free Priority Mail and Flat Rate boxes, envelopes, and labels. Order at store.usps.com/store — delivered free to your address.", icon: Truck },
              { title: "Consider Ground Advantage", desc: "USPS Ground Advantage replaced Parcel Select and Retail Ground. It's often 30-50% cheaper than Priority Mail with only 1-2 extra days of delivery time.", icon: MapPin },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Shipping Cost FAQ</h2>
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
      <InternalLinkingHub currentPath="/usps-shipping-calculator" variant="compact" />
    </Layout>
  );
};

export default USPSShippingCalculatorPage;

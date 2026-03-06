import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { Globe, CheckCircle, Clock, DollarSign, Package, Truck, Shield, Star } from "lucide-react";

const carriers = [
  {
    name: "USPS",
    services: [
      { service: "Priority Mail International", time: "6–10 days", price: "From $28.50", tracking: "Full" },
      { service: "Priority Mail Express International", time: "3–5 days", price: "From $45.95", tracking: "Full" },
      { service: "First-Class Mail International", time: "7–21 days", price: "From $1.50", tracking: "Limited" },
      { service: "Global Express Guaranteed (GXG)", time: "1–3 days", price: "From $67.50", tracking: "Full + Guarantee" },
    ],
    pros: ["Most affordable for small packages", "Wide international coverage", "Free tracking on Priority services"],
    cons: ["Slower than private carriers", "Limited tracking on First-Class", "No guaranteed delivery on most services"],
  },
  {
    name: "FedEx",
    services: [
      { service: "FedEx International Economy", time: "5–7 days", price: "From $35", tracking: "Full" },
      { service: "FedEx International Priority", time: "1–3 days", price: "From $55", tracking: "Full" },
      { service: "FedEx International First", time: "1–2 days", price: "From $85", tracking: "Full + Guarantee" },
    ],
    pros: ["Fast and reliable", "Excellent tracking", "In-house customs brokerage"],
    cons: ["More expensive than USPS", "Surcharges on remote areas", "Dimensional weight pricing"],
  },
  {
    name: "UPS",
    services: [
      { service: "UPS Worldwide Expedited", time: "3–5 days", price: "From $40", tracking: "Full" },
      { service: "UPS Worldwide Express", time: "1–3 days", price: "From $60", tracking: "Full" },
      { service: "UPS Worldwide Express Plus", time: "Next day", price: "From $90", tracking: "Full + Guarantee" },
    ],
    pros: ["Strong B2B services", "Reliable delivery times", "UPS My Choice tracking"],
    cons: ["Premium pricing", "Complex rate structure", "Fuel surcharges"],
  },
  {
    name: "DHL",
    services: [
      { service: "DHL Express Worldwide", time: "2–5 days", price: "From $45", tracking: "Full" },
      { service: "DHL Express 9:00/10:30/12:00", time: "1–2 days", price: "From $75", tracking: "Full + Time-definite" },
      { service: "DHL eCommerce", time: "5–10 days", price: "From $15", tracking: "Basic" },
    ],
    pros: ["Fastest customs clearance", "Best international coverage", "Strong in Asia/Europe"],
    cons: ["Higher prices for Americas", "Weight surcharges", "Limited rural delivery"],
  },
];

const InternationalShippingGuide = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "International Shipping Guide: Carriers, Rates & Best Practices 2026",
    author: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: "2026-01-20",
    dateModified: "2026-03-01",
  };

  return (
    <Layout>
      <SEOHead
        title="International Shipping Guide 2026 — Compare USPS, FedEx, UPS, DHL Rates"
        description="Compare international shipping carriers, rates, and delivery times. Find the cheapest and fastest way to ship packages internationally from the US in 2026."
        keywords="international shipping guide, cheapest international shipping, USPS vs FedEx vs UPS vs DHL, international shipping rates, ship package internationally, international delivery times"
        canonical="https://uspostaltracking.com/knowledge-center/international-shipping-guide"
        structuredData={[articleSchema]}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Knowledge Center", url: "/knowledge-center" },
        { name: "International Shipping Guide", url: "/knowledge-center/international-shipping-guide" },
      ]} />

      <div className="container py-8 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <Link to="/knowledge-center" className="hover:text-primary">Knowledge Center</Link><span>/</span>
          <span className="text-foreground">International Shipping Guide</span>
        </nav>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">15 min read • Updated March 2026</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">International Shipping: Carriers, Rates & Best Practices</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Choosing the right carrier for international shipping can save you hundreds of dollars and days of waiting. This guide compares USPS, FedEx, UPS, and DHL side-by-side to help you make the best choice for your shipment.
        </p>

        {/* Quick Comparison */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /> Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-3 text-foreground font-semibold">Carrier</th>
                  <th className="text-left py-2 pr-3 text-foreground font-semibold">Best For</th>
                  <th className="text-left py-2 pr-3 text-foreground font-semibold">Speed</th>
                  <th className="text-left py-2 text-foreground font-semibold">Price</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50"><td className="py-2.5 pr-3 font-medium text-foreground">USPS</td><td className="py-2.5 pr-3">Small packages, budget</td><td className="py-2.5 pr-3">6–21 days</td><td className="py-2.5">💰</td></tr>
                <tr className="border-b border-border/50"><td className="py-2.5 pr-3 font-medium text-foreground">FedEx</td><td className="py-2.5 pr-3">Business, reliability</td><td className="py-2.5 pr-3">1–7 days</td><td className="py-2.5">💰💰💰</td></tr>
                <tr className="border-b border-border/50"><td className="py-2.5 pr-3 font-medium text-foreground">UPS</td><td className="py-2.5 pr-3">Heavy/large packages</td><td className="py-2.5 pr-3">1–5 days</td><td className="py-2.5">💰💰💰</td></tr>
                <tr className="border-b border-border/50"><td className="py-2.5 pr-3 font-medium text-foreground">DHL</td><td className="py-2.5 pr-3">Asia/Europe, speed</td><td className="py-2.5 pr-3">1–5 days</td><td className="py-2.5">💰💰</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Carrier Details */}
        {carriers.map(carrier => (
          <section key={carrier.name} className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> {carrier.name} International Shipping
            </h2>

            {/* Services Table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2 px-3 text-foreground font-semibold">Service</th>
                    <th className="text-left py-2 px-3 text-foreground font-semibold">Delivery</th>
                    <th className="text-left py-2 px-3 text-foreground font-semibold">Starting Price</th>
                    <th className="text-left py-2 px-3 text-foreground font-semibold">Tracking</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {carrier.services.map(s => (
                    <tr key={s.service} className="border-b border-border/50">
                      <td className="py-2 px-3 font-medium text-foreground">{s.service}</td>
                      <td className="py-2 px-3">{s.time}</td>
                      <td className="py-2 px-3">{s.price}</td>
                      <td className="py-2 px-3">{s.tracking}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">✅ Pros</h3>
                <ul className="space-y-1">
                  {carrier.pros.map(p => <li key={p} className="text-sm text-muted-foreground flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />{p}</li>)}
                </ul>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">❌ Cons</h3>
                <ul className="space-y-1">
                  {carrier.cons.map(c => <li key={c} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span>{c}</li>)}
                </ul>
              </div>
            </div>
          </section>
        ))}

        {/* Tips */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-blue-500" /> Best Practices for International Shipping</h2>
          <div className="space-y-3">
            {[
              { tip: "Always insure valuable shipments", detail: "Purchase shipping insurance for items worth more than $100. Most carriers offer insurance as an add-on." },
              { tip: "Use proper packaging", detail: "International packages travel longer distances and go through more handling. Use double-wall corrugated boxes and plenty of cushioning." },
              { tip: "Fill out customs forms accurately", detail: "Inaccurate or incomplete customs declarations are the #1 cause of delays. Include HS codes when possible." },
              { tip: "Check destination country restrictions", detail: "Every country has different import regulations. Some items that are legal to ship in the US may be prohibited in other countries." },
              { tip: "Consider delivery duties paid (DDP)", detail: "Paying duties and taxes upfront (DDP) prevents your recipient from paying unexpected fees at delivery." },
            ].map(item => (
              <div key={item.tip} className="flex gap-3 p-4 bg-card border rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{item.tip}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "What is the cheapest way to ship internationally from the US?", a: "USPS First-Class Mail International is the cheapest, starting at $1.50 for letters and small packages under 4 lbs. For larger packages, USPS Priority Mail International is usually the most affordable." },
              { q: "Which carrier is fastest for international shipping?", a: "DHL Express is generally the fastest, offering 1-2 day delivery with the fastest customs clearance. FedEx International First and UPS Worldwide Express Plus also offer next-day delivery." },
              { q: "Do I need customs forms for international shipping?", a: "Yes, all international shipments require customs documentation. Accurate documentation prevents delays." },
            ].map(item => (
              <details key={item.q} className="group bg-card border rounded-lg">
                <summary className="p-4 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {item.q}<span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <div className="bg-card border rounded-xl p-5 mb-8">
          <h2 className="font-bold text-foreground mb-3">Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link to="/knowledge-center/customs-clearance-guide" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5"><Shield className="h-4 w-4" /> Customs Clearance Guide</Link>
            <Link to="/knowledge-center/lost-package-guide" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5"><Package className="h-4 w-4" /> Lost Package Recovery Guide</Link>
          </div>
        </div>

        <InternalLinkingHub currentPath="/knowledge-center/international-shipping-guide" variant="compact" />
      </div>
    </Layout>
  );
};

export default InternationalShippingGuide;

import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { Shield, AlertTriangle, Globe, Package, Ban, CheckCircle } from "lucide-react";

const ShippingRestrictionsGuide = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "International Shipping Restrictions — What You Can & Cannot Ship",
    author: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: "2026-02-05",
    dateModified: "2026-03-01",
    publisher: { "@type": "Organization", name: "US Postal Tracking", url: "https://uspostaltracking.com" },
  };

  return (
    <Layout>
      <SEOHead
        title="International Shipping Restrictions Guide — Prohibited & Restricted Items 2026"
        description="Complete guide to international shipping restrictions. Learn what items are prohibited, restricted, and allowed for shipping via USPS, FedEx, UPS, and DHL. Country-specific regulations included."
        keywords="shipping restrictions, prohibited items shipping, international shipping rules, what can I ship internationally, USPS prohibited items, hazardous materials shipping, lithium battery shipping, restricted items list"
        canonical="https://uspostaltracking.com/knowledge-center/shipping-restrictions"
        structuredData={[articleSchema]}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Knowledge Center", url: "/knowledge-center" },
        { name: "Shipping Restrictions", url: "/knowledge-center/shipping-restrictions" },
      ]} />

      <div className="container py-8 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <Link to="/knowledge-center" className="hover:text-primary">Knowledge Center</Link><span>/</span>
          <span className="text-foreground">Shipping Restrictions</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          <Shield className="inline h-8 w-8 text-primary mr-2" />
          International Shipping Restrictions — Complete Guide
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Every country has its own rules about what can and cannot be shipped across its borders. Violating these rules can result in <strong>package seizure, fines, or criminal charges</strong>. This guide covers <strong>universally prohibited items</strong>, <strong>carrier-specific restrictions</strong>, and <strong>country-specific regulations</strong> to help you ship safely and legally.
        </p>

        {/* Universally Prohibited */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Ban className="h-6 w-6 text-red-500" /> Universally Prohibited Items
          </h2>
          <p className="text-muted-foreground mb-4">These items are banned from international shipping by <strong>all carriers and all countries</strong>:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { item: "Explosives & Fireworks", desc: "TNT, dynamite, gunpowder, fireworks, flares, ammunition" },
              { item: "Flammable Liquids & Gases", desc: "Gasoline, lighter fluid, aerosols, propane, butane" },
              { item: "Radioactive Materials", desc: "Uranium, plutonium, radioactive isotopes" },
              { item: "Narcotics & Illegal Drugs", desc: "Marijuana (even if legal in your state), cocaine, heroin, etc." },
              { item: "Weapons & Ammunition", desc: "Firearms, knives, swords, tasers, pepper spray, ammunition" },
              { item: "Infectious Substances", desc: "Biological hazards, medical waste, pathogen cultures" },
              { item: "Counterfeit Goods", desc: "Fake branded items, pirated software, copied media" },
              { item: "Currency & Financial Instruments", desc: "Cash, bearer bonds, unprocessed precious metals" },
            ].map((item) => (
              <div key={item.item} className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2"><Ban className="h-4 w-4 text-red-500" /> {item.item}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Restricted Items */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" /> Restricted Items (Require Special Handling)
          </h2>
          <p className="text-muted-foreground mb-4">These items <strong>can be shipped</strong> but require special packaging, documentation, or are limited to specific services:</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-3 border font-semibold">Item</th>
                  <th className="text-left py-3 px-3 border font-semibold">Restriction</th>
                  <th className="text-left py-3 px-3 border font-semibold">USPS</th>
                  <th className="text-left py-3 px-3 border font-semibold">FedEx/UPS</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Lithium Batteries (in device)", "Limited to devices < 100Wh", "✅ Air & Ground", "✅ With declaration"],
                  ["Lithium Batteries (loose)", "Max 100Wh per battery", "❌ Prohibited", "⚠️ Ground only"],
                  ["Alcohol", "Must have license", "❌ Prohibited", "✅ With license"],
                  ["Tobacco Products", "Varies by destination", "✅ Limited qty", "✅ With permits"],
                  ["Perfume (flammable)", "Max 150ml per package", "⚠️ Ground only", "✅ With ORM-D label"],
                  ["Perishable Food", "Proper packaging required", "✅ With packaging", "✅ Cold chain available"],
                  ["Prescription Medications", "Requires documentation", "⚠️ With prescription", "⚠️ With prescription"],
                  ["Dry Ice", "Max 2.5kg (5.5 lbs)", "❌ Prohibited", "✅ With UN3373 label"],
                  ["Aerosol Cans", "Non-flammable only", "❌ Prohibited int'l", "⚠️ Ground only"],
                  ["Seeds & Plants", "USDA permit required", "⚠️ With permit", "⚠️ With permit"],
                ].map(([item, restriction, usps, fedex]) => (
                  <tr key={item} className="border-b">
                    <td className="py-2 px-3 border font-medium text-foreground">{item}</td>
                    <td className="py-2 px-3 border">{restriction}</td>
                    <td className="py-2 px-3 border">{usps}</td>
                    <td className="py-2 px-3 border">{fedex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Country-Specific */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-green-600" /> Country-Specific Restrictions
          </h2>
          <p className="text-muted-foreground mb-4">Some items are legal to ship from the US but <strong>prohibited in the destination country</strong>:</p>
          <div className="space-y-4">
            {[
              { country: "🇦🇺 Australia", items: "All food (meat, dairy, fruits, vegetables, honey), seeds, soil, feathers, animal products. Strict biosecurity — packages may be fumigated or destroyed." },
              { country: "🇧🇷 Brazil", items: "Electronics over $500 (subject to 60% tax), cosmetics without ANVISA registration, supplements and vitamins in large quantities." },
              { country: "🇸🇦 Saudi Arabia", items: "Pork products, alcohol, religious items that aren't Islamic, materials deemed offensive to Islamic values, non-halal food products." },
              { country: "🇮🇳 India", items: "Satellite phones, drone equipment, maps of India (must be printed in India), gold/silver bars, e-cigarettes and vaping products." },
              { country: "🇯🇵 Japan", items: "Rice (without import quota), certain meat products, fresh fruits, soil, stimulant medications (e.g., Adderall), ivory products." },
              { country: "🇩🇪 Germany", items: "Nazi memorabilia, violent video games (unrated), supplements with ingredients not approved by EU, CBD products over 0.2% THC." },
              { country: "🇸🇬 Singapore", items: "Chewing gum (except therapeutic), firecrackers, toy guns that resemble real firearms, publications that are offensive to religious groups." },
            ].map((item) => (
              <div key={item.country} className="p-4 bg-card border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{item.country}</h3>
                <p className="text-sm text-muted-foreground">{item.items}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" /> Best Practices for Compliant Shipping
          </h2>
          <div className="space-y-3">
            {[
              "Always check the destination country's import regulations BEFORE shipping.",
              "Use the carrier's online tools to verify restricted items (USPS International Mail Manual, FedEx Service Guide).",
              "Declare all contents accurately on the customs form — false declarations are illegal.",
              "Label hazardous materials properly with required UN numbers and shipping names.",
              "Use appropriate packaging for fragile, liquid, or temperature-sensitive items.",
              "Keep copies of all shipping documentation for at least 5 years.",
              "Consider purchasing shipping insurance for high-value international packages.",
              "When in doubt, contact the carrier's customer service before shipping.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-card border rounded-lg">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/knowledge-center/customs-duties-taxes" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">Customs Duties & Taxes</span><p className="text-xs text-muted-foreground">Import costs by country</p></div>
            </Link>
            <Link to="/knowledge-center/customs-clearance-guide" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">Customs Clearance Guide</span><p className="text-xs text-muted-foreground">Step-by-step process</p></div>
            </Link>
          </div>
        </section>

        <InternalLinkingHub currentPath="/knowledge-center/shipping-restrictions" variant="compact" />
      </div>
    </Layout>
  );
};

export default ShippingRestrictionsGuide;
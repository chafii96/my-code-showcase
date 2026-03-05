import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, DollarSign, Package, Globe } from "lucide-react";

const CustomsClearanceGuide = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Complete Customs Clearance Guide 2026",
    description: "Everything you need to know about customs clearance for international shipments.",
    author: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: "2026-01-15",
    dateModified: "2026-03-01",
    publisher: { "@type": "Organization", name: "US Postal Tracking", url: "https://uspostaltracking.com" },
  };

  return (
    <Layout>
      <SEOHead
        title="Complete Customs Clearance Guide 2026 — Duties, Taxes & Documentation"
        description="Learn everything about customs clearance: how duties and taxes are calculated, required documentation, prohibited items, and how to avoid delays. Updated for 2026."
        keywords="customs clearance guide, customs duties, import taxes, customs declaration, international shipping customs, USPS customs, how to clear customs, customs delay"
        canonical="https://uspostaltracking.com/knowledge-center/customs-clearance-guide"
        structuredData={[articleSchema, faqSchema]}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Knowledge Center", url: "/knowledge-center" },
        { name: "Customs Clearance Guide", url: "/knowledge-center/customs-clearance-guide" },
      ]} />

      <div className="container py-8 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <Link to="/knowledge-center" className="hover:text-primary">Knowledge Center</Link><span>/</span>
          <span className="text-foreground">Customs Clearance Guide</span>
        </nav>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-blue-500" />
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">12 min read • Updated March 2026</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Complete Customs Clearance Guide 2026</h1>
        <p className="text-muted-foreground mb-8 text-base leading-relaxed">
          Whether you're shipping a gift overseas or importing goods for your business, understanding customs clearance is essential. This guide covers everything from duties and taxes to documentation requirements, common delays, and how to ensure your package clears customs smoothly.
        </p>

        {/* Table of Contents */}
        <div className="bg-card border rounded-xl p-5 mb-8">
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground">
            <li><a href="#what-is-customs" className="hover:text-primary">What Is Customs Clearance?</a></li>
            <li><a href="#duties-taxes" className="hover:text-primary">How Duties & Taxes Are Calculated</a></li>
            <li><a href="#documentation" className="hover:text-primary">Required Documentation</a></li>
            <li><a href="#prohibited" className="hover:text-primary">Prohibited & Restricted Items</a></li>
            <li><a href="#timeline" className="hover:text-primary">Customs Clearance Timeline</a></li>
            <li><a href="#delays" className="hover:text-primary">Common Delays & How to Avoid Them</a></li>
            <li><a href="#faq" className="hover:text-primary">Frequently Asked Questions</a></li>
          </ol>
        </div>

        {/* Content Sections */}
        <article className="prose prose-sm sm:prose-base max-w-none text-foreground">
          <section id="what-is-customs" className="mb-10">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Shield className="h-5 w-5 text-blue-500" /> What Is Customs Clearance?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Customs clearance is the process of getting approval from a country's customs authority to import or export goods. Every international shipment — whether sent via USPS, FedEx, UPS, or DHL — must go through customs inspection at the destination country.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              During this process, customs officers verify the contents of the package against the declaration form, assess applicable duties and taxes, and check for prohibited or restricted items. Once cleared, the package is released for delivery.
            </p>
          </section>

          <section id="duties-taxes" className="mb-10">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-500" /> How Duties & Taxes Are Calculated</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Customs duties and import taxes are calculated based on several factors. Understanding these can help you estimate costs before shipping.
            </p>
            <div className="grid gap-3">
              {[
                { title: "Declared Value", desc: "The monetary value you declare on the customs form. Undervaluing items is illegal and can result in fines or seizure." },
                { title: "HS Code Classification", desc: "Every product has a Harmonized System code that determines the applicable tariff rate. Different products have different duty rates." },
                { title: "Country of Origin", desc: "Some countries have trade agreements that reduce or eliminate duties. Products from certain countries may face higher tariffs." },
                { title: "De Minimis Threshold", desc: "Most countries have a value threshold below which no duties are charged. US: $800, EU: €150, UK: £135, Canada: CAD $20, Australia: AUD $1,000." },
              ].map(item => (
                <div key={item.title} className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="documentation" className="mb-10">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><FileText className="h-5 w-5 text-violet-500" /> Required Documentation</h2>
            <div className="space-y-3">
              {[
                { title: "Customs Declaration Form", desc: "USPS uses PS Form 2976 (for items under $400) or PS Form 2976-A (for items over $400). Include accurate item descriptions, quantities, values, and HS codes." },
                { title: "Commercial Invoice", desc: "Required for commercial shipments. Must include seller/buyer details, item descriptions, unit prices, total value, and country of origin." },
                { title: "Certificate of Origin", desc: "May be required for certain goods to qualify for preferential duty rates under trade agreements (e.g., USMCA for North American trade)." },
                { title: "Import/Export Permits", desc: "Certain goods (food, electronics, pharmaceuticals) may require special permits or licenses from the destination country's regulatory agencies." },
              ].map(doc => (
                <div key={doc.title} className="flex gap-3 p-4 bg-card border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="prohibited" className="mb-10">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Prohibited & Restricted Items</h2>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
              <p className="text-sm text-muted-foreground mb-3">The following items are generally prohibited from international shipping via USPS and most carriers:</p>
              <div className="grid grid-cols-2 gap-2">
                {["Explosives & Fireworks", "Firearms & Ammunition", "Narcotics & Drugs", "Hazardous Chemicals", "Live Animals", "Perishable Foods*", "Counterfeit Goods", "Currency & Securities"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-red-500">✕</span> {item}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">* Perishable foods may be shipped with proper packaging and documentation in some cases.</p>
            </div>
          </section>

          <section id="timeline" className="mb-10">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Clock className="h-5 w-5 text-blue-500" /> Customs Clearance Timeline</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 text-foreground font-semibold">Carrier</th>
                    <th className="text-left py-2 pr-4 text-foreground font-semibold">Typical Time</th>
                    <th className="text-left py-2 text-foreground font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["USPS", "1–5 business days", "Priority Mail International is usually faster"],
                    ["FedEx", "Same day – 2 days", "FedEx handles customs brokerage in most countries"],
                    ["UPS", "Same day – 2 days", "UPS has dedicated customs brokerage teams"],
                    ["DHL", "Same day – 1 day", "DHL Express is often the fastest for customs clearance"],
                  ].map(([carrier, time, notes]) => (
                    <tr key={carrier} className="border-b border-border/50">
                      <td className="py-2.5 pr-4 font-medium text-foreground">{carrier}</td>
                      <td className="py-2.5 pr-4">{time}</td>
                      <td className="py-2.5">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="delays" className="mb-10">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Common Delays & How to Avoid Them</h2>
            <div className="space-y-3">
              {[
                { problem: "Incomplete or inaccurate customs declaration", solution: "Always provide detailed, accurate descriptions of contents. Include HS codes when possible." },
                { problem: "Undervalued or overvalued goods", solution: "Declare the true value of items. Customs officers compare declared values against market prices." },
                { problem: "Missing documentation", solution: "Double-check that all required forms are attached before shipping. Use USPS Customs Form Wizard online." },
                { problem: "Restricted items requiring inspection", solution: "Check destination country regulations before shipping. Some items need permits or special packaging." },
                { problem: "High-volume periods (holidays, sales)", solution: "Ship early during peak seasons. Allow extra 3-5 days for customs processing during November-January." },
              ].map(item => (
                <div key={item.problem} className="p-4 bg-card border rounded-lg">
                  <p className="text-sm font-semibold text-foreground mb-1">❌ {item.problem}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">✅ {item.solution}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className="mb-10">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                { q: "How long does customs clearance take for USPS packages?", a: "USPS customs clearance typically takes 1-5 business days. Priority Mail International packages are often cleared within 1-2 days, while First-Class International may take 3-5 days." },
                { q: "What items are prohibited from international shipping?", a: "Prohibited items include hazardous materials, firearms, live animals, perishable foods (without proper packaging), controlled substances, and counterfeit goods." },
                { q: "How are customs duties and taxes calculated?", a: "Based on declared value, HS code classification, destination country's tariff rates, and trade agreements. Most countries have a de minimis threshold." },
                { q: "What is a customs declaration form?", a: "A required document (PS Form 2976 or 2976-A for USPS) that describes contents, value, and purpose of an international shipment." },
              ].map(item => (
                <details key={item.q} className="group bg-card border rounded-lg">
                  <summary className="p-4 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {/* Related Guides */}
        <div className="bg-card border rounded-xl p-5 mb-8">
          <h2 className="font-bold text-foreground mb-3">Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link to="/knowledge-center/international-shipping-guide" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5">
              <Package className="h-4 w-4" /> International Shipping Guide
            </Link>
            <Link to="/knowledge-center/lost-package-guide" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5">
              <AlertTriangle className="h-4 w-4" /> Lost Package Recovery Guide
            </Link>
            <Link to="/guides/international-shipping-rates" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5">
              <DollarSign className="h-4 w-4" /> USPS International Shipping Rates
            </Link>
            <Link to="/article/usps-international-tracking" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5">
              <Globe className="h-4 w-4" /> USPS International Tracking
            </Link>
          </div>
        </div>

        <InternalLinkingHub currentPath="/knowledge-center/customs-clearance-guide" variant="compact" />
      </div>
    </Layout>
  );
};

export default CustomsClearanceGuide;

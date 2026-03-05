import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { DollarSign, Globe, Package, AlertTriangle, CheckCircle, FileText, Shield } from "lucide-react";

const CustomsDutiesTaxesGuide = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Customs Duties & Taxes Guide — International Shipping Costs Explained",
    author: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: "2026-02-01",
    dateModified: "2026-03-01",
    publisher: { "@type": "Organization", name: "US Postal Tracking", url: "https://uspostaltracking.com" },
  };

  return (
    <Layout>
      <SEOHead
        title="Customs Duties & Taxes Guide — Import Costs by Country 2026"
        description="Complete guide to customs duties, import taxes, and VAT for international shipping. Learn duty-free thresholds by country, how duties are calculated, and how to avoid unexpected charges."
        keywords="customs duties, import taxes, vat on imports, customs duty calculator, duty free threshold, international shipping taxes, import duty rates, customs charges, de minimis threshold"
        canonical="https://uspostaltracking.com/knowledge-center/customs-duties-taxes"
        structuredData={[articleSchema, faqSchema]}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Knowledge Center", url: "/knowledge-center" },
        { name: "Customs Duties & Taxes", url: "/knowledge-center/customs-duties-taxes" },
      ]} />

      <div className="container py-8 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <Link to="/knowledge-center" className="hover:text-primary">Knowledge Center</Link><span>/</span>
          <span className="text-foreground">Customs Duties & Taxes</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          <DollarSign className="inline h-8 w-8 text-primary mr-2" />
          Customs Duties & Import Taxes — Complete Guide
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          When shipping internationally, understanding <strong>customs duties</strong>, <strong>import taxes</strong>, and <strong>VAT</strong> is essential to avoid surprises. This guide explains how import costs are calculated, the <strong>duty-free thresholds by country</strong>, and practical tips to minimize your customs charges.
        </p>

        {/* What Are Duties */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> What Are Customs Duties & Import Taxes?
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            <strong>Customs duties</strong> are taxes imposed by a country's government on goods imported from abroad. They serve two purposes: generating revenue and protecting domestic industries from foreign competition. Import taxes are calculated as a percentage of the declared value of the goods.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            <strong>Value-Added Tax (VAT)</strong> or <strong>Goods and Services Tax (GST)</strong> is a consumption tax applied to imported goods in addition to customs duties. Most countries outside the US charge VAT on imports. The US uses a state-level sales tax system instead.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Total Import Cost Formula:</h3>
            <p className="font-mono text-sm text-primary">Total Cost = Declared Value + Shipping Cost + Customs Duty + VAT/GST + Processing Fees</p>
          </div>
        </section>

        {/* De Minimis Thresholds */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-green-600" /> Duty-Free Thresholds by Country (De Minimis)
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Most countries have a <strong>de minimis threshold</strong> — a value below which imported goods are exempt from customs duties. Here are the thresholds for the most popular shipping destinations:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-3 border font-semibold">Country</th>
                  <th className="text-left py-3 px-3 border font-semibold">Duty-Free Threshold</th>
                  <th className="text-left py-3 px-3 border font-semibold">VAT/GST Rate</th>
                  <th className="text-left py-3 px-3 border font-semibold">VAT Threshold</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["🇺🇸 United States", "$800", "No federal VAT (state sales tax varies)", "$800"],
                  ["🇨🇦 Canada", "CAD $20", "5% GST + provincial tax", "CAD $20"],
                  ["🇬🇧 United Kingdom", "£135", "20% VAT", "£0 (all imports)"],
                  ["🇪🇺 European Union", "€150", "19-27% VAT (varies by country)", "€0 (all imports since July 2021)"],
                  ["🇦🇺 Australia", "AUD $1,000", "10% GST", "AUD $0 (all imports)"],
                  ["🇯🇵 Japan", "¥10,000 (~$67)", "10% consumption tax", "¥10,000"],
                  ["🇰🇷 South Korea", "$150", "10% VAT", "$150"],
                  ["🇨🇳 China", "CNY 50 (~$7)", "13% VAT", "CNY 50"],
                  ["🇧🇷 Brazil", "$50", "60% import tax + 17-25% ICMS", "$50"],
                  ["🇮🇳 India", "No threshold (all imports taxed)", "12-28% GST", "$0"],
                  ["🇲🇽 Mexico", "$50", "16% IVA", "$50"],
                  ["🇸🇬 Singapore", "SGD $400", "9% GST", "SGD $400"],
                  ["🇳🇿 New Zealand", "NZD $1,000", "15% GST", "NZD $0 (all imports)"],
                  ["🇹🇭 Thailand", "THB 1,500 (~$42)", "7% VAT", "THB 1,500"],
                  ["🇦🇪 UAE", "AED 1,000 (~$272)", "5% VAT", "AED 0"],
                ].map(([country, threshold, vat, vatThreshold]) => (
                  <tr key={country} className="border-b">
                    <td className="py-2 px-3 border font-medium text-foreground">{country}</td>
                    <td className="py-2 px-3 border font-semibold">{threshold}</td>
                    <td className="py-2 px-3 border">{vat}</td>
                    <td className="py-2 px-3 border">{vatThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-yellow-600" /> Important Note</h3>
            <p className="text-sm text-muted-foreground">Thresholds change frequently. The EU eliminated its €22 VAT exemption in July 2021, and the US $800 threshold is under review. Always check the latest regulations before shipping.</p>
          </div>
        </section>

        {/* How Duties Are Calculated */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" /> How Customs Duties Are Calculated
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Step 1: Product Classification (HS Code)</h3>
              <p className="text-sm text-muted-foreground">Every product is classified using the Harmonized System (HS) — a 6-10 digit code. For example: 6403.91 = leather shoes, 8471.30 = laptops, 4202.12 = suitcases. The HS code determines the duty rate.</p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Step 2: Determine Customs Value</h3>
              <p className="text-sm text-muted-foreground">Customs value is typically the transaction value (what you paid for the goods) plus insurance and freight costs (CIF value). Some countries use FOB (Free On Board) value, which excludes shipping costs.</p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Step 3: Apply Duty Rate</h3>
              <p className="text-sm text-muted-foreground">The duty rate varies by product and country of origin. Average US duty rates: textiles (12-32%), electronics (0-5%), shoes (0-48%), food (0-20%). Trade agreements (USMCA, US-Korea FTA) can reduce or eliminate duties.</p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Step 4: Add VAT/GST</h3>
              <p className="text-sm text-muted-foreground">VAT is calculated on the total of: goods value + shipping + duties. For example: €100 goods + €20 shipping + €12 duty = €132 × 19% VAT = €25.08 VAT. Total: €157.08.</p>
            </div>
          </div>
        </section>

        {/* Shipping Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" /> Shipping Terms: DAP vs DDP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-card border rounded-lg">
              <h3 className="font-bold text-foreground mb-2">DAP / DDU (Receiver Pays)</h3>
              <p className="text-sm text-muted-foreground mb-3">The receiver is responsible for paying all customs duties and taxes upon delivery or pickup. This is the default for most international shipments.</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Lower shipping cost for sender</li>
                <li>❌ Receiver may refuse delivery if duties are high</li>
                <li>❌ Package may be held at customs</li>
              </ul>
            </div>
            <div className="p-5 bg-card border rounded-lg">
              <h3 className="font-bold text-foreground mb-2">DDP (Sender Pays)</h3>
              <p className="text-sm text-muted-foreground mb-3">The sender prepays all customs duties and taxes. The receiver gets the package with no additional charges. Common for eCommerce businesses.</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Better customer experience</li>
                <li>✅ No delivery delays for duties</li>
                <li>❌ Higher cost for sender</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" /> Tips to Minimize Customs Charges
          </h2>
          <div className="space-y-3">
            {[
              "Declare accurate values — under-declaring is illegal and can result in fines, seizure, or criminal charges.",
              "Use correct HS codes — the right product classification can significantly affect duty rates.",
              "Take advantage of trade agreements (USMCA, EU-UK TCA) that may reduce or eliminate duties.",
              "Stay under the de minimis threshold when possible — splitting large orders into smaller shipments may help.",
              "Include all required documentation (commercial invoice, packing list, certificate of origin) to avoid delays.",
              "Consider DDP shipping for business-to-consumer orders to improve customer satisfaction.",
              "Use duty drawback programs if you re-export imported goods.",
              "Consult a customs broker for high-value or complex shipments.",
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
            <Link to="/knowledge-center/customs-clearance-guide" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">Customs Clearance Guide</span><p className="text-xs text-muted-foreground">Step-by-step customs process</p></div>
            </Link>
            <Link to="/knowledge-center/international-shipping-guide" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">International Shipping Guide</span><p className="text-xs text-muted-foreground">Compare international carriers</p></div>
            </Link>
          </div>
        </section>

        <InternalLinkingHub currentPath="/knowledge-center/customs-duties-taxes" variant="compact" />
      </div>
    </Layout>
  );
};

export default CustomsDutiesTaxesGuide;
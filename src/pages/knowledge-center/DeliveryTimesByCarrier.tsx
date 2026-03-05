import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { Clock, Package, Globe, Truck, AlertTriangle, CheckCircle } from "lucide-react";

const DeliveryTimesByCarrier = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Delivery Times by Carrier — Complete Comparison Guide 2026",
    author: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: "2026-01-25",
    dateModified: "2026-03-01",
    publisher: { "@type": "Organization", name: "US Postal Tracking", url: "https://uspostaltracking.com" },
  };

  return (
    <Layout>
      <SEOHead
        title="Delivery Times by Carrier — USPS, FedEx, UPS, DHL Comparison Guide 2026"
        description="Compare delivery times for all major carriers. Complete guide to USPS, FedEx, UPS, DHL shipping speeds for domestic and international deliveries. Updated for 2026."
        keywords="delivery times, shipping times, usps delivery time, fedex delivery time, ups shipping speed, dhl express delivery, carrier comparison, fastest shipping, how long does shipping take"
        canonical="https://uspostaltracking.com/knowledge-center/delivery-times-by-carrier"
        structuredData={[articleSchema, faqSchema]}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Knowledge Center", url: "/knowledge-center" },
        { name: "Delivery Times by Carrier", url: "/knowledge-center/delivery-times-by-carrier" },
      ]} />

      <div className="container py-8 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <Link to="/knowledge-center" className="hover:text-primary">Knowledge Center</Link><span>/</span>
          <span className="text-foreground">Delivery Times by Carrier</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          <Clock className="inline h-8 w-8 text-primary mr-2" />
          Delivery Times by Carrier — Complete Comparison Guide
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Choosing the right carrier and service level can mean the difference between next-day delivery and waiting weeks. This guide compares <strong>delivery times for all major carriers</strong> including USPS, FedEx, UPS, and DHL — for both <strong>domestic US</strong> and <strong>international</strong> shipments.
        </p>

        {/* Domestic Comparison */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" /> Domestic US Delivery Times Comparison
          </h2>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-3 border font-semibold">Service</th>
                  <th className="text-left py-3 px-3 border font-semibold">Delivery Time</th>
                  <th className="text-left py-3 px-3 border font-semibold">Starting Price</th>
                  <th className="text-left py-3 px-3 border font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["FedEx First Overnight", "Next day by 8 AM", "$65+", "Urgent documents"],
                  ["UPS Next Day Air Early", "Next day by 8 AM", "$75+", "Critical shipments"],
                  ["USPS Priority Mail Express", "Next day by noon", "$28+", "Cost-effective overnight"],
                  ["FedEx Priority Overnight", "Next day by 10:30 AM", "$45+", "Business packages"],
                  ["UPS Next Day Air", "Next day by 10:30 AM", "$50+", "Large packages"],
                  ["FedEx 2Day", "2 business days", "$20+", "Non-urgent business"],
                  ["UPS 2nd Day Air", "2 business days", "$25+", "Balanced speed/cost"],
                  ["USPS Priority Mail", "1-3 business days", "$8+", "Best value for speed"],
                  ["FedEx Ground", "1-5 business days", "$9+", "Economy shipping"],
                  ["UPS Ground", "1-5 business days", "$10+", "Economy shipping"],
                  ["USPS Ground Advantage", "2-5 business days", "$5+", "Budget-friendly"],
                  ["USPS First-Class Mail", "2-5 business days", "$0.68+", "Lightweight items"],
                  ["FedEx SmartPost", "2-7 business days", "$5+", "Lightweight eCommerce"],
                  ["USPS Media Mail", "2-8 business days", "$3.65+", "Books & media only"],
                ].map(([service, time, price, best]) => (
                  <tr key={service} className="border-b">
                    <td className="py-2 px-3 border font-medium text-foreground">{service}</td>
                    <td className="py-2 px-3 border">{time}</td>
                    <td className="py-2 px-3 border font-semibold">{price}</td>
                    <td className="py-2 px-3 border text-xs">{best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* International */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-green-600" /> International Delivery Times
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            International delivery times vary significantly based on the carrier, service level, and destination country. <strong>Express services</strong> (DHL Express, FedEx International, UPS Worldwide) are the fastest but most expensive. <strong>Standard postal services</strong> are cheaper but slower.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-3 border font-semibold">Service</th>
                  <th className="text-left py-3 px-3 border font-semibold">To Europe</th>
                  <th className="text-left py-3 px-3 border font-semibold">To Asia</th>
                  <th className="text-left py-3 px-3 border font-semibold">To S. America</th>
                  <th className="text-left py-3 px-3 border font-semibold">Price Range</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["DHL Express", "1-2 days", "2-3 days", "2-4 days", "$50-200"],
                  ["FedEx International Priority", "1-3 days", "2-4 days", "2-5 days", "$45-180"],
                  ["UPS Worldwide Express", "1-3 days", "2-4 days", "2-5 days", "$50-200"],
                  ["USPS Priority Mail Int'l", "6-10 days", "6-10 days", "6-10 days", "$30-80"],
                  ["USPS First-Class Int'l", "7-21 days", "7-21 days", "7-21 days", "$15-40"],
                  ["China Post (EMS)", "5-10 days", "3-7 days", "7-15 days", "$20-50"],
                  ["China Post (ePacket)", "7-20 days", "5-15 days", "15-30 days", "$5-15"],
                  ["China Post (Air Mail)", "15-30 days", "10-20 days", "20-45 days", "$3-10"],
                ].map(([service, europe, asia, sa, price]) => (
                  <tr key={service} className="border-b">
                    <td className="py-2 px-3 border font-medium text-foreground">{service}</td>
                    <td className="py-2 px-3 border">{europe}</td>
                    <td className="py-2 px-3 border">{asia}</td>
                    <td className="py-2 px-3 border">{sa}</td>
                    <td className="py-2 px-3 border font-semibold">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Factors Affecting Delivery */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" /> Factors That Affect Delivery Times
          </h2>
          <div className="space-y-4">
            {[
              { title: "Customs Clearance (International)", desc: "International packages must pass through customs in the destination country. This can add 1-5 business days. Accurate customs declarations and proper documentation minimize delays. Some countries like Brazil and India have slower customs processing." },
              { title: "Weather & Natural Disasters", desc: "Severe weather events (hurricanes, snowstorms, floods) can delay deliveries by days or even weeks. Carriers typically resume normal operations within 1-3 days after weather events clear." },
              { title: "Peak Season & Holidays", desc: "During peak shipping seasons (November-December for holidays, major sale events like Black Friday), carriers experience high volume. Delivery times can be 1-3 days longer than normal. Plan ahead during these periods." },
              { title: "Remote or Rural Areas", desc: "Deliveries to rural areas, military bases (APO/FPO), PO Boxes, or territories (Alaska, Hawaii, Puerto Rico) may take 1-3 additional business days compared to major metro areas." },
              { title: "Package Size & Weight", desc: "Oversized or overweight packages may require special handling and ground transportation instead of air, adding to delivery time. Each carrier has different size and weight limits." },
              { title: "Weekends & Holidays", desc: "Most carriers don't count weekends or holidays as business days. USPS delivers on Saturdays but not Sundays (except Amazon packages). FedEx Home Delivery operates Tuesday-Saturday. UPS delivers Monday-Saturday." },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-card border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" /> Tips to Get Faster Delivery
          </h2>
          <div className="space-y-3">
            {[
              "Ship early in the day — packages dropped off before carrier pickup times ship the same day.",
              "Use express or priority services for time-sensitive shipments.",
              "Provide accurate and complete addresses to avoid delivery exceptions.",
              "Sign up for carrier notification services (USPS Informed Delivery, FedEx Delivery Manager, UPS My Choice).",
              "Ship from locations close to major carrier hubs for faster ground transit.",
              "Avoid shipping during peak holiday seasons if timing is critical.",
              "For international packages, include detailed customs declarations to avoid delays.",
              "Consider using multi-carrier shipping platforms to compare rates and transit times.",
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
            <Link to="/tracking" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">All Carriers</span><p className="text-xs text-muted-foreground">Browse 200+ carriers</p></div>
            </Link>
            <Link to="/knowledge-center/tracking-number-formats" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">Tracking Number Formats</span><p className="text-xs text-muted-foreground">Identify any tracking number</p></div>
            </Link>
          </div>
        </section>

        <InternalLinkingHub currentPath="/knowledge-center/delivery-times-by-carrier" variant="compact" />
      </div>
    </Layout>
  );
};

export default DeliveryTimesByCarrier;
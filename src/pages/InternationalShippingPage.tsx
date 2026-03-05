import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Globe, DollarSign, Clock, Package, AlertTriangle, MapPin } from "lucide-react";

const InternationalShippingPage = () => {
  return (
    <Layout>
      <SEOHead
        title="USPS International Shipping Rates & Tracking Guide 2026"
        description="Comprehensive guide to USPS international shipping services, rates, delivery times, customs requirements, and how to track international packages."
        canonical="/guides/international-shipping-rates"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>USPS International Shipping Rates</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <article className="container max-w-4xl pb-16">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <Globe className="h-4 w-4" /> Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            USPS International Shipping Rates & Tracking: Complete 2026 Guide
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Comprehensive guide to USPS international shipping services, rates, delivery times, customs requirements, and how to track international packages from the USA.
          </p>
        </header>

        <div className="ad-placeholder h-[250px] mb-10">Advertisement</div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> USPS International Shipping Services Overview</h2>
          <p>
            The United States Postal Service offers several international shipping services ranging from affordable letter mail to expedited express delivery. Each service tier differs in speed, tracking capability, insurance coverage, and price. Choosing the right service depends on your budget, urgency, and whether you need full tracking visibility or basic delivery confirmation.
          </p>

          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Service</th>
                  <th className="text-left p-3 font-semibold text-foreground">Delivery Time</th>
                  <th className="text-left p-3 font-semibold text-foreground">Tracking</th>
                  <th className="text-left p-3 font-semibold text-foreground">Starting Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="p-3 text-foreground font-medium">Priority Mail Express International</td><td className="p-3">3–5 business days</td><td className="p-3 text-primary font-medium">Full tracking</td><td className="p-3">~$45</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Priority Mail International</td><td className="p-3">6–10 business days</td><td className="p-3 text-primary font-medium">Full tracking</td><td className="p-3">~$28</td></tr>
                <tr><td className="p-3 text-foreground font-medium">First-Class Package International</td><td className="p-3">7–21 business days</td><td className="p-3 text-accent font-medium">Limited tracking</td><td className="p-3">~$14</td></tr>
                <tr><td className="p-3 text-foreground font-medium">First-Class Mail International</td><td className="p-3">7–21 business days</td><td className="p-3 text-destructive font-medium">No tracking</td><td className="p-3">~$1.55</td></tr>
                <tr><td className="p-3 text-foreground font-medium">USPS Retail Ground (APO/FPO)</td><td className="p-3">Varies</td><td className="p-3 text-primary font-medium">Full tracking</td><td className="p-3">Varies</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs italic">Prices are approximate and vary by destination country, package weight, and dimensions. Use the USPS Price Calculator for exact rates.</p>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" /> Understanding International Shipping Rates</h2>
          <p>
            USPS international shipping rates are determined by several factors: the destination country (grouped into price groups 1–9), the package weight, dimensions, and the service level selected. USPS groups countries into price tiers — Canada and Mexico are typically the cheapest destinations, while remote island nations and certain African countries fall into higher price groups.
          </p>
          <p>
            <strong>Dimensional weight</strong> (DIM weight) also affects pricing for larger packages. USPS calculates DIM weight by multiplying length × width × height (in inches) and dividing by 166. If the DIM weight exceeds the actual weight, USPS charges based on the DIM weight. This is particularly important for lightweight but bulky items.
          </p>
          <p>
            To save on international shipping costs, consider these strategies: use USPS Click-N-Ship for commercial pricing (often 5–15% cheaper than retail rates), ship flat-rate envelopes or boxes when available for international service, and consolidate multiple items into a single shipment when possible.
          </p>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Tracking International USPS Packages</h2>
          <p>
            Tracking international USPS shipments works differently from domestic tracking. While the package is within the US postal network, you'll see regular scan updates similar to domestic shipments. Once the package leaves the United States and enters the destination country's postal system, tracking updates depend on the receiving country's infrastructure.
          </p>
          <p>
            <strong>Common tracking gaps:</strong> It's normal to see no updates for 5–14 days when a package is in transit between countries. This "dead zone" occurs while the package is on a plane or ship and hasn't been scanned by the destination country's customs or postal service. Don't panic — this is standard for international mail.
          </p>
          <p>
            International tracking numbers from USPS follow the 13-character UPU S10 format (e.g., <span className="font-mono text-foreground">EE123456789US</span>). You can track these numbers on our <Link to="/" className="text-primary hover:underline">tracking tool</Link>, on the official USPS website, or on the destination country's postal service website for more detailed local delivery information. Learn more about <Link to="/guides/tracking-number-format" className="text-primary hover:underline">USPS tracking number formats</Link>.
          </p>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-accent" /> Customs & Duties: What You Need to Know</h2>
          <p>
            Every international shipment from the US requires a customs declaration form. For items valued under $2,500, USPS uses the PS Form 2976 (for small items) or PS Form 2976-A (for detailed declarations). These forms declare the contents, value, and purpose of the shipment (gift, merchandise, documents, etc.).
          </p>
          <p>
            <strong>Important:</strong> The recipient may be required to pay import duties, taxes (such as VAT or GST), and customs handling fees upon delivery. These charges are determined by the destination country's customs authority and are the responsibility of the recipient, not the sender. Common duty thresholds vary significantly — the EU has a €150 threshold for customs duties, while countries like Australia use AUD 1,000.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Prohibited items:</strong> Each country has specific import restrictions. Check the USPS International Mail Manual (IMM) for country-specific prohibitions before shipping.</li>
            <li><strong>Commercial shipments:</strong> Merchandise shipments require an accurate declaration of value. Undervaluing items on customs forms is illegal and can result in fines or seizure.</li>
            <li><strong>HS tariff codes:</strong> Including the correct Harmonized System (HS) tariff code on your customs form speeds up customs processing and reduces the chance of delays.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Delivery Times by Region</h2>
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Region</th>
                  <th className="text-left p-3 font-semibold text-foreground">Express</th>
                  <th className="text-left p-3 font-semibold text-foreground">Priority</th>
                  <th className="text-left p-3 font-semibold text-foreground">First-Class</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="p-3 text-foreground font-medium">Canada & Mexico</td><td className="p-3">3–5 days</td><td className="p-3">6–10 days</td><td className="p-3">7–14 days</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Western Europe</td><td className="p-3">3–5 days</td><td className="p-3">6–10 days</td><td className="p-3">10–21 days</td></tr>
                <tr><td className="p-3 text-foreground font-medium">East Asia</td><td className="p-3">3–5 days</td><td className="p-3">6–10 days</td><td className="p-3">10–21 days</td></tr>
                <tr><td className="p-3 text-foreground font-medium">South America</td><td className="p-3">3–5 days</td><td className="p-3">6–14 days</td><td className="p-3">14–28 days</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Africa</td><td className="p-3">5–7 days</td><td className="p-3">10–21 days</td><td className="p-3">21–42 days</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Oceania</td><td className="p-3">3–5 days</td><td className="p-3">6–10 days</td><td className="p-3">14–28 days</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs italic">Delivery times are estimates and do not include customs processing delays. Actual delivery times may vary significantly.</p>

          <h2 className="text-xl font-bold text-foreground">International Shipping Insurance & Claims</h2>
          <p>
            Priority Mail Express International includes up to $200 in insurance coverage by default. Priority Mail International includes limited indemnity coverage. For higher-value shipments, you can purchase additional insurance up to $5,000 through USPS. First-Class international services do not include any insurance coverage.
          </p>
          <p>
            To file an international insurance claim, you'll need the original mailing receipt, proof of value (invoice or receipt for the contents), and evidence of damage or loss. International claims can take 30–90 days to process due to coordination between the US and destination country postal services. File claims at usps.com/help/claims.htm.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-foreground mb-2">Track Your International Package</h3>
            <p className="text-sm mb-4">Enter your 13-character international tracking number for real-time updates.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Package className="h-4 w-4" /> Track Now
            </Link>
          </div>
        </div>

        <div className="ad-placeholder h-[250px] mt-10">Advertisement</div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "USPS International Shipping Rates & Tracking: Complete 2026 Guide",
            description: "Comprehensive guide to USPS international shipping services, rates, delivery times, customs requirements, and how to track international packages from the USA.",
            author: { "@type": "Organization", name: "US Postal Tracking" },
            publisher: { "@type": "Organization", name: "US Postal Tracking" },
          }),
        }}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: "International Shipping Rates", url: "/guides/international-shipping-rates" },
      ]} />
    </Layout>
  );
};

export default InternationalShippingPage;

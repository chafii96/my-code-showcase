import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Package, Hash, Info, CheckCircle, AlertTriangle } from "lucide-react";

const TrackingNumberFormatPage = () => {
  return (
    <Layout>
      <SEOHead
        title="USPS Tracking Number Format - Complete Guide to Every Code"
        description="Learn how to identify USPS tracking number formats, what each prefix means, and how to decode the information hidden in your tracking code."
        canonical="/guides/tracking-number-format"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>USPS Tracking Number Format</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <article className="container max-w-4xl pb-16">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <Hash className="h-4 w-4" /> Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            USPS Tracking Number Format: Complete Guide to Every Code
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Learn how to identify USPS tracking number formats, what each prefix means, and how to decode the information hidden in your tracking code.
          </p>
        </header>

        <div className="ad-placeholder h-[250px] mb-10">Advertisement</div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Overview of USPS Tracking Numbers</h2>
          <p>
            Every USPS shipment is assigned a unique tracking number that allows senders and recipients to monitor the package's journey from origin to destination. These tracking numbers vary in length and format depending on the shipping service used. Understanding the format of your tracking number can help you identify the type of service, the origin of the package, and even troubleshoot delivery issues.
          </p>
          <p>
            USPS tracking numbers are typically between 13 and 34 characters long. Domestic tracking numbers are usually numeric-only, while international tracking numbers use an alphanumeric format standardized by the Universal Postal Union (UPU). The structure of the number encodes important metadata about the shipment class and routing.
          </p>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Info className="h-5 w-5 text-primary" /> Domestic Tracking Number Formats</h2>
          
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Service</th>
                  <th className="text-left p-3 font-semibold text-foreground">Format / Prefix</th>
                  <th className="text-left p-3 font-semibold text-foreground">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="p-3 text-foreground font-medium">Priority Mail</td><td className="p-3 font-mono text-xs">9400 1xxx xxxx xxxx xxxx xx</td><td className="p-3">22 digits</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Priority Mail Express</td><td className="p-3 font-mono text-xs">9270 1xxx xxxx xxxx xxxx xx</td><td className="p-3">22 digits</td></tr>
                <tr><td className="p-3 text-foreground font-medium">First-Class Package</td><td className="p-3 font-mono text-xs">9400 1xxx xxxx xxxx xxxx xx</td><td className="p-3">22 digits</td></tr>
                <tr><td className="p-3 text-foreground font-medium">USPS Retail Ground</td><td className="p-3 font-mono text-xs">9205 5xxx xxxx xxxx xxxx xx</td><td className="p-3">22 digits</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Certified Mail</td><td className="p-3 font-mono text-xs">9407 3xxx xxxx xxxx xxxx xx</td><td className="p-3">22 digits</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Registered Mail</td><td className="p-3 font-mono text-xs">9208 8xxx xxxx xxxx xxxx xx</td><td className="p-3">22 digits</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Collect on Delivery</td><td className="p-3 font-mono text-xs">9303 3xxx xxxx xxxx xxxx xx</td><td className="p-3">22 digits</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Signature Confirmation</td><td className="p-3 font-mono text-xs">9202 1xxx xxxx xxxx xxxx xx</td><td className="p-3">22 digits</td></tr>
              </tbody>
            </table>
          </div>

          <p>
            Most domestic USPS tracking numbers are 20 to 22 digits long. The first four digits typically indicate the mail class. For example, numbers beginning with <strong>9400</strong> are commonly used for Priority Mail and First-Class packages, while <strong>9270</strong> indicates Priority Mail Express. The remaining digits encode routing information, a unique serial number, and a check digit for validation.
          </p>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> International Tracking Number Format</h2>
          <p>
            International USPS tracking numbers follow the Universal Postal Union (UPU) S10 standard. They are exactly 13 characters long and follow a specific alphanumeric pattern:
          </p>
          <div className="bg-card border rounded-lg p-5">
            <p className="font-mono text-center text-lg text-foreground tracking-widest">AA 123 456 789 US</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
              <div className="text-center"><span className="font-semibold text-foreground block">First 2 Letters</span>Service type indicator (e.g., EE = EMS, RR = Registered, CP = Parcel)</div>
              <div className="text-center"><span className="font-semibold text-foreground block">9 Digits</span>Unique serial number with check digit (last digit)</div>
              <div className="text-center"><span className="font-semibold text-foreground block">Last 2 Letters</span>Country of origin code (US = United States)</div>
            </div>
          </div>
          <p>
            Common prefix letters include: <strong>EA–EZ</strong> for EMS/Express Mail, <strong>RA–RZ</strong> for Registered Mail, <strong>CA–CZ</strong> for Parcels, <strong>LA–LZ</strong> for Letter Post, and <strong>UA–UZ</strong> for uninsured parcels. If your international tracking number ends in "US", it originated from the United States.
          </p>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-accent" /> Common Tracking Number Issues</h2>
          <p>
            If your USPS tracking number isn't working, here are common reasons and solutions:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Pre-shipment scan only:</strong> The sender has created a label but hasn't dropped the package off yet. Wait 24–48 hours.</li>
            <li><strong>Number not found:</strong> Double-check the number for typos. USPS tracking data may take up to 24 hours to appear after initial scan.</li>
            <li><strong>Expired tracking:</strong> USPS tracking information is available for 120 days after delivery or last activity.</li>
            <li><strong>Third-party tracking numbers:</strong> Some retailers use carrier-neutral codes (e.g., starting with "1Z" for UPS, "JD" for certain consolidators). Ensure your number is actually USPS.</li>
            <li><strong>Missing digits:</strong> USPS domestic numbers are typically 20–22 digits. If yours is shorter, check the receipt or confirmation email.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground">How to Find Your USPS Tracking Number</h2>
          <p>
            Your tracking number can be found on the shipping receipt, email confirmation from the sender or retailer, the USPS Informed Delivery dashboard, or directly on the package label near the barcode. If you've lost your tracking number, contact the sender or check your email for shipping confirmation messages containing the tracking code.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-foreground mb-2">Track Your Package Now</h3>
            <p className="text-sm mb-4">Enter your USPS tracking number to get real-time status updates.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Package className="h-4 w-4" /> Go to Tracking Tool
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
            headline: "USPS Tracking Number Format: Complete Guide to Every Code",
            description: "Learn how to identify USPS tracking number formats, what each prefix means, and how to decode the information hidden in your tracking code.",
            author: { "@type": "Organization", name: "US Postal Tracking" },
            publisher: { "@type": "Organization", name: "US Postal Tracking" },
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How many digits is a USPS tracking number?", acceptedAnswer: { "@type": "Answer", text: "Most domestic USPS tracking numbers are 20 to 22 digits long. International tracking numbers follow the UPU S10 standard and are exactly 13 characters (2 letters + 9 digits + 2-letter country code)." }},
          { "@type": "Question", name: "What does a USPS tracking number starting with 9400 mean?", acceptedAnswer: { "@type": "Answer", text: "Tracking numbers starting with 9400 are typically used for Priority Mail and First-Class Package Service. The prefix 9400 indicates the mail class, followed by routing information and a unique serial number." }},
          { "@type": "Question", name: "Why is my USPS tracking number not working?", acceptedAnswer: { "@type": "Answer", text: "Common reasons include: the sender created a label but hasn't shipped yet (wait 24-48 hours), a typo in the number, expired tracking data (available for 120 days after delivery), or the number belongs to another carrier like UPS or FedEx." }},
          { "@type": "Question", name: "What do the letters in an international USPS tracking number mean?", acceptedAnswer: { "@type": "Answer", text: "The first two letters indicate the service type: EA-EZ for EMS/Express Mail, RA-RZ for Registered Mail, CA-CZ for Parcels, LA-LZ for Letter Post. The last two letters indicate the country of origin (US = United States)." }},
          { "@type": "Question", name: "Where can I find my USPS tracking number?", acceptedAnswer: { "@type": "Answer", text: "Your tracking number can be found on the shipping receipt, email confirmation from the retailer, the USPS Informed Delivery dashboard, or directly on the package label near the barcode." }},
        ]
      })}} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: "Tracking Number Format", url: "/guides/tracking-number-format" },
      ]} />
    </Layout>
  );
};

export default TrackingNumberFormatPage;

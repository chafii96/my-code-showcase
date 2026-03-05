import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { FileText, Package, Search, CheckCircle, AlertTriangle, Globe, Hash } from "lucide-react";

const TrackingNumberFormatsGuide = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Complete Guide to Tracking Number Formats — All Major Carriers",
    description: "Learn how to identify and use tracking numbers from USPS, FedEx, UPS, DHL, and 200+ carriers worldwide.",
    author: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: "2026-01-20",
    dateModified: "2026-03-01",
    publisher: { "@type": "Organization", name: "US Postal Tracking", url: "https://uspostaltracking.com" },
  };

  return (
    <Layout>
      <SEOHead
        title="Tracking Number Formats Guide — USPS, FedEx, UPS, DHL & 200+ Carriers"
        description="Complete guide to tracking number formats for all major carriers. Learn how to identify USPS, FedEx, UPS, DHL tracking numbers, what each digit means, and how to track your package."
        keywords="tracking number format, usps tracking number format, fedex tracking number, ups tracking number 1z, dhl tracking number format, tracking number lookup, how many digits tracking number, identify carrier by tracking number"
        canonical="https://uspostaltracking.com/knowledge-center/tracking-number-formats"
        structuredData={[articleSchema, faqSchema]}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Knowledge Center", url: "/knowledge-center" },
        { name: "Tracking Number Formats", url: "/knowledge-center/tracking-number-formats" },
      ]} />

      <div className="container py-8 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <Link to="/knowledge-center" className="hover:text-primary">Knowledge Center</Link><span>/</span>
          <span className="text-foreground">Tracking Number Formats</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          <Hash className="inline h-8 w-8 text-primary mr-2" />
          Complete Guide to Tracking Number Formats
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Every package shipped worldwide comes with a unique tracking number. Understanding the format of this number helps you identify the carrier, the type of service used, and how to track your shipment accurately. This comprehensive guide covers tracking number formats for <strong>USPS, FedEx, UPS, DHL</strong>, and <strong>200+ international carriers</strong>.
        </p>

        {/* USPS Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" /> USPS Tracking Number Formats
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            The United States Postal Service (USPS) uses several tracking number formats depending on the service type. Most domestic USPS tracking numbers are <strong>20 to 22 digits</strong> long and consist entirely of numbers. International USPS tracking numbers follow the Universal Postal Union (UPU) standard: <strong>2 letters + 9 digits + "US"</strong> (13 characters total).
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-4 border font-semibold">Service</th>
                  <th className="text-left py-3 px-4 border font-semibold">Format</th>
                  <th className="text-left py-3 px-4 border font-semibold">Example</th>
                  <th className="text-left py-3 px-4 border font-semibold">Length</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Priority Mail", "Starts with 9400 or 9205", "9400 1234 5678 9012 3456 78", "22 digits"],
                  ["Priority Mail Express", "Starts with 9270", "9270 1234 5678 9012 3456 78", "22 digits"],
                  ["Certified Mail", "Starts with 9407", "9407 1234 5678 9012 3456 78", "22 digits"],
                  ["First-Class Package", "Starts with 9400 or 9202", "9400 1234 5678 9012 3456 78", "22 digits"],
                  ["Registered Mail", "Starts with 9208", "9208 8000 1234 5678 9012 34", "22 digits"],
                  ["Ground Advantage", "Starts with 9300 or 9261", "9300 1234 5678 9012 3456 78", "22 digits"],
                  ["International (EMS)", "EA + 9 digits + US", "EA123456789US", "13 chars"],
                  ["International Registered", "RR + 9 digits + US", "RR123456789US", "13 chars"],
                  ["International Parcel", "CP + 9 digits + US", "CP123456789US", "13 chars"],
                ].map(([service, format, example, length]) => (
                  <tr key={service} className="border-b">
                    <td className="py-2 px-4 border font-medium text-foreground">{service}</td>
                    <td className="py-2 px-4 border">{format}</td>
                    <td className="py-2 px-4 border font-mono text-xs">{example}</td>
                    <td className="py-2 px-4 border">{length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-600" /> Pro Tip: USPS Tracking Number Check Digit</h3>
            <p className="text-sm text-muted-foreground">USPS tracking numbers include a check digit (the last digit) calculated using a specific algorithm. If your tracking number doesn't work, verify you've copied all digits correctly — even one wrong digit will cause the lookup to fail.</p>
          </div>
        </section>

        {/* FedEx Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-6 w-6 text-orange-500" /> FedEx Tracking Number Formats
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            FedEx uses <strong>numeric-only tracking numbers</strong> that vary in length depending on the service. The most common format is <strong>12 digits</strong> for FedEx Express and FedEx Ground. FedEx SmartPost packages (delivered by USPS for the last mile) use longer 20-22 digit numbers.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse border">
              <thead><tr className="bg-muted/50"><th className="text-left py-3 px-4 border font-semibold">Service</th><th className="text-left py-3 px-4 border font-semibold">Format</th><th className="text-left py-3 px-4 border font-semibold">Example</th></tr></thead>
              <tbody className="text-muted-foreground">
                {[
                  ["FedEx Express / Ground", "12 digits", "123456789012"],
                  ["FedEx Ground (alt)", "15 digits", "123456789012345"],
                  ["FedEx SmartPost", "20-22 digits", "61299998620341515252"],
                  ["FedEx Freight", "12 digits", "123456789012"],
                  ["Door Tag", "DT + 12 digits", "DT123456789012"],
                ].map(([service, format, example]) => (
                  <tr key={service} className="border-b"><td className="py-2 px-4 border font-medium text-foreground">{service}</td><td className="py-2 px-4 border">{format}</td><td className="py-2 px-4 border font-mono text-xs">{example}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* UPS Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-6 w-6 text-amber-700" /> UPS Tracking Number Formats
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            UPS tracking numbers are the <strong>easiest to identify</strong> — they always start with <strong>"1Z"</strong> followed by 16 alphanumeric characters (total 18 characters). This unique prefix means you can immediately identify a UPS package without guessing the carrier.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse border">
              <thead><tr className="bg-muted/50"><th className="text-left py-3 px-4 border font-semibold">Service</th><th className="text-left py-3 px-4 border font-semibold">Format</th><th className="text-left py-3 px-4 border font-semibold">Example</th></tr></thead>
              <tbody className="text-muted-foreground">
                {[
                  ["All UPS Services", "1Z + 16 alphanumeric", "1Z999AA10123456784"],
                  ["UPS Mail Innovations", "T + 10 digits", "T1234567890"],
                  ["UPS Freight", "9 digits", "123456789"],
                ].map(([service, format, example]) => (
                  <tr key={service} className="border-b"><td className="py-2 px-4 border font-medium text-foreground">{service}</td><td className="py-2 px-4 border">{format}</td><td className="py-2 px-4 border font-mono text-xs">{example}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The structure of a UPS tracking number contains encoded information: the first 2 characters after "1Z" represent the shipper's UPS account number, and the last digit is a check digit calculated using a modulo algorithm. This helps prevent errors when manually entering tracking numbers.
          </p>
        </section>

        {/* DHL Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-6 w-6 text-yellow-500" /> DHL Tracking Number Formats
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            DHL operates multiple services worldwide, each with different tracking number formats. <strong>DHL Express</strong> uses <strong>10-digit numbers</strong>, while <strong>DHL eCommerce</strong> uses longer formats with prefixes like "JD" or "GM".
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse border">
              <thead><tr className="bg-muted/50"><th className="text-left py-3 px-4 border font-semibold">Service</th><th className="text-left py-3 px-4 border font-semibold">Format</th><th className="text-left py-3 px-4 border font-semibold">Example</th></tr></thead>
              <tbody className="text-muted-foreground">
                {[
                  ["DHL Express", "10 digits", "1234567890"],
                  ["DHL eCommerce", "JD + 18 digits", "JD014600003944032948"],
                  ["DHL Global Mail", "GM + 18 digits", "GM123456789012345678"],
                  ["DHL Parcel (Germany)", "LX + 9 digits + DE", "LX123456789DE"],
                  ["DHL Paket", "00 + 18 digits", "00340434161094042557"],
                ].map(([service, format, example]) => (
                  <tr key={service} className="border-b"><td className="py-2 px-4 border font-medium text-foreground">{service}</td><td className="py-2 px-4 border">{format}</td><td className="py-2 px-4 border font-mono text-xs">{example}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* International Postal */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-green-600" /> International Postal Tracking Numbers (UPU Standard)
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            All national postal services that are members of the <strong>Universal Postal Union (UPU)</strong> follow a standardized 13-character tracking format: <strong>2 letters + 9 digits + 2-letter country code</strong>. The first two letters indicate the type of mail service:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse border">
              <thead><tr className="bg-muted/50"><th className="text-left py-3 px-4 border font-semibold">Prefix</th><th className="text-left py-3 px-4 border font-semibold">Service Type</th><th className="text-left py-3 px-4 border font-semibold">Examples</th></tr></thead>
              <tbody className="text-muted-foreground">
                {[
                  ["RR, RX, RG, RM", "Registered Mail", "RR123456789CN, RR987654321GB"],
                  ["EA, EB, EC, ED, EE", "EMS Express Mail", "EA123456789US, EE123456789JP"],
                  ["CP, CX", "Parcel Post", "CP123456789DE, CX123456789FR"],
                  ["LN, LX, LZ", "ePacket / Lightweight", "LN123456789CN, LZ123456789HK"],
                  ["RA, RB, RC", "Letter Post Registered", "RA123456789IN, RC123456789AU"],
                  ["UV, UB, UC", "Uninsured Parcel", "UV123456789KR, UB123456789TH"],
                ].map(([prefix, type, examples]) => (
                  <tr key={prefix} className="border-b"><td className="py-2 px-4 border font-mono font-medium text-foreground">{prefix}</td><td className="py-2 px-4 border">{type}</td><td className="py-2 px-4 border font-mono text-xs">{examples}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The 2-letter country code at the end identifies the origin country: <strong>US</strong> (United States), <strong>CN</strong> (China), <strong>GB</strong> (United Kingdom), <strong>DE</strong> (Germany), <strong>JP</strong> (Japan), <strong>KR</strong> (South Korea), <strong>AU</strong> (Australia), etc. This is crucial for international tracking — knowing the origin country helps you select the right carrier's tracking system.
          </p>
        </section>

        {/* Carrier Identification */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" /> How to Identify a Carrier by Tracking Number
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Don't know which carrier shipped your package? Use these quick identification rules:
          </p>
          <div className="space-y-3">
            {[
              { prefix: "Starts with 1Z", carrier: "UPS", color: "text-amber-700 bg-amber-50 dark:bg-amber-950/20" },
              { prefix: "Starts with 9400, 9205, 9270, 9407", carrier: "USPS (Domestic)", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20" },
              { prefix: "12 or 15 digits (numeric only)", carrier: "FedEx", color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20" },
              { prefix: "10 digits (numeric only)", carrier: "DHL Express", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20" },
              { prefix: "Starts with JD or GM", carrier: "DHL eCommerce", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20" },
              { prefix: "13 chars ending in CN", carrier: "China Post", color: "text-green-600 bg-green-50 dark:bg-green-950/20" },
              { prefix: "13 chars ending in GB", carrier: "Royal Mail (UK)", color: "text-red-600 bg-red-50 dark:bg-red-950/20" },
              { prefix: "13 chars ending in JP", carrier: "Japan Post", color: "text-red-500 bg-red-50 dark:bg-red-950/20" },
              { prefix: "Starts with JVGL or JJD", carrier: "DHL Global Forwarding", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20" },
            ].map((item) => (
              <div key={item.prefix} className={`p-4 rounded-lg border ${item.color}`}>
                <span className="font-mono font-semibold text-sm">{item.prefix}</span>
                <span className="mx-2 text-muted-foreground">→</span>
                <span className="font-semibold">{item.carrier}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Other Carriers */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" /> Other Major Carriers
          </h2>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse border">
              <thead><tr className="bg-muted/50"><th className="text-left py-3 px-4 border font-semibold">Carrier</th><th className="text-left py-3 px-4 border font-semibold">Format</th><th className="text-left py-3 px-4 border font-semibold">Example</th></tr></thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Amazon Logistics", "TBA + 12 digits", "TBA123456789012"],
                  ["Canada Post", "13-16 digits", "1234567890123456"],
                  ["Australia Post", "13 chars ending in AU", "RR123456789AU"],
                  ["La Poste (France)", "13 chars ending in FR", "RC123456789FR"],
                  ["Deutsche Post", "13 chars ending in DE", "RR123456789DE"],
                  ["Japan Post (EMS)", "13 chars ending in JP", "EJ123456789JP"],
                  ["Korea Post", "13 chars ending in KR", "EA123456789KR"],
                  ["India Post", "13 chars ending in IN", "EE123456789IN"],
                  ["Singapore Post", "13 chars ending in SG", "RR123456789SG"],
                  ["Correos (Spain)", "13 chars ending in ES", "PQ123456789ES"],
                ].map(([carrier, format, example]) => (
                  <tr key={carrier} className="border-b"><td className="py-2 px-4 border font-medium text-foreground">{carrier}</td><td className="py-2 px-4 border">{format}</td><td className="py-2 px-4 border font-mono text-xs">{example}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" /> Common Tracking Number Issues & Solutions
          </h2>
          <div className="space-y-4">
            {[
              { q: "Tracking number not found", a: "Wait 24-48 hours after shipment — carriers need time to register the package in their system. If it still doesn't work after 48 hours, contact the sender to verify the tracking number." },
              { q: "Tracking not updating", a: "Packages between scan points won't show updates. International shipments may have gaps of several days during transit between countries. For domestic USPS, if tracking hasn't updated in 5+ business days, file a Missing Mail request." },
              { q: "Wrong carrier detected", a: "Some tracking numbers can match multiple carriers. If you know the carrier, go directly to their tracking page. Our multi-carrier tracker tries all carriers automatically to find the right match." },
              { q: "Tracking shows delivered but package not received", a: "Wait 24 hours — some carriers mark packages as delivered before the driver completes the route. Check with neighbors, look in alternative delivery spots (back door, garage), and check for a delivery photo if available." },
            ].map((item) => (
              <div key={item.q} className="p-4 bg-card border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/tracking" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">All Carriers</span><p className="text-xs text-muted-foreground">Browse 200+ carriers</p></div>
            </Link>
            <Link to="/knowledge-center/customs-clearance-guide" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">Customs Clearance Guide</span><p className="text-xs text-muted-foreground">International shipping duties & taxes</p></div>
            </Link>
            <Link to="/knowledge-center/delivery-times-by-carrier" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">Delivery Times</span><p className="text-xs text-muted-foreground">Compare carrier delivery speeds</p></div>
            </Link>
            <Link to="/knowledge-center/lost-package-guide" className="p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <div><span className="font-semibold text-sm text-foreground">Lost Package Guide</span><p className="text-xs text-muted-foreground">What to do if your package is lost</p></div>
            </Link>
          </div>
        </section>

        <InternalLinkingHub currentPath="/knowledge-center/tracking-number-formats" variant="compact" />
      </div>
    </Layout>
  );
};

export default TrackingNumberFormatsGuide;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Hash, Package, Globe, Truck, Info } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const carrierFormats = [
  { name: "SpeedEx / Speed X", format: "SPX + 8-12 digits", example: "SPX123456789", length: "10-15 chars", country: "Global" },
  { name: "OnTrac", format: "C or D + 14 digits", example: "C11000123456789", length: "15 chars", country: "USA (Western)" },
  { name: "DoorDash", format: "Numeric order ID", example: "DD-1234567890", length: "10-15 chars", country: "USA" },
  { name: "EasyPost", format: "Varies by carrier", example: "EZ4000000004", length: "Varies", country: "Global" },
  { name: "Colissimo (La Poste)", format: "2L + 9D + FR", example: "CB123456789FR", length: "13 chars", country: "France" },
  { name: "Deutsche Post", format: "2L + 9D + DE", example: "RR123456789DE", length: "13 chars", country: "Germany" },
  { name: "SF Express (顺丰)", format: "SF + 12 digits", example: "SF1234567890123", length: "12-15 chars", country: "China" },
  { name: "SFC Service", format: "SFC + digits", example: "SFC12345678", length: "10-12 chars", country: "China" },
  { name: "India Post", format: "2L + 9D + IN", example: "EA123456789IN", length: "13 chars", country: "India" },
  { name: "Singapore Post", format: "2L + 9D + SG", example: "RR123456789SG", length: "13 chars", country: "Singapore" },
  { name: "CEVA Logistics", format: "Alphanumeric waybill", example: "CEVA1234567890", length: "10-20 chars", country: "Global" },
  { name: "Roadie (UPS)", format: "Numeric delivery ID", example: "RD-12345678", length: "8-12 chars", country: "USA" },
  { name: "Alibaba / AliExpress", format: "Varies (carrier-dependent)", example: "LP00123456789CN", length: "13-20 chars", country: "China" },
  { name: "JS Express", format: "JD/JS + digits", example: "JD0012345678901", length: "15 chars", country: "China" },
  { name: "SPX Express", format: "SPXPH + digits", example: "SPXPH1234567890", length: "15 chars", country: "Southeast Asia" },
  { name: "UMAC Express Cargo", format: "UMAC + digits", example: "UMAC123456789", length: "13 chars", country: "Philippines" },
  { name: "Pitt Ohio", format: "Numeric PRO number", example: "12345678901", length: "11 digits", country: "USA" },
  { name: "Averitt Express", format: "Numeric PRO number", example: "1234567890", length: "10 digits", country: "USA" },
  { name: "Yodel", format: "JD + 18 digits", example: "JD014600012345678901", length: "20 chars", country: "UK" },
  { name: "Pošta (Czech/Slovak)", format: "2L + 9D + CZ/SK", example: "RR123456789CZ", length: "13 chars", country: "Czech/Slovakia" },
];

const CarrierTrackingFormatsGuide = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Carrier Tracking Number Formats — Complete Reference Guide 2026"
        description="Complete reference guide for tracking number formats across 20+ carriers: SpeedEx, OnTrac, DoorDash, Colissimo, SF Express, India Post, USPS, and more. Identify any tracking number instantly."
        canonical="/knowledge-center/carrier-tracking-formats"
        keywords="tracking number format, usps tracking number length, how many digits usps tracking number, how long is a usps tracking number, speedex tracking number, ontrac tracking number, doordash tracking number, sf express tracking number, colissimo tracking number, india post tracking number"
/>

      <article className="container max-w-4xl py-10">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/knowledge-center" className="hover:text-primary transition-colors">Knowledge Center</Link>
          <span>/</span>
          <span className="text-foreground">Carrier Tracking Formats</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <Hash className="h-4 w-4" /> Reference Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Tracking Number Formats: Complete Carrier Reference Guide
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Identify tracking number formats for 20+ carriers including SpeedEx, OnTrac, DoorDash, Colissimo, SF Express, India Post, Deutsche Post, and more. Learn how many digits each carrier uses and what the prefixes mean.
          </p>
        </header>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-8 leading-relaxed">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> All Carrier Tracking Number Formats
          </h2>

          <div className="bg-card border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Carrier</th>
                  <th className="text-left p-3 font-semibold text-foreground">Format</th>
                  <th className="text-left p-3 font-semibold text-foreground">Example</th>
                  <th className="text-left p-3 font-semibold text-foreground">Length</th>
                  <th className="text-left p-3 font-semibold text-foreground">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {carrierFormats.map((c) => (
                  <tr key={c.name}>
                    <td className="p-3 text-foreground font-medium">{c.name}</td>
                    <td className="p-3 font-mono text-xs">{c.format}</td>
                    <td className="p-3 font-mono text-xs">{c.example}</td>
                    <td className="p-3">{c.length}</td>
                    <td className="p-3">{c.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" /> USPS Tracking Number Length
          </h2>
          <p>
            <strong>How many digits is a USPS tracking number?</strong> USPS domestic tracking numbers are typically <strong>20 to 22 digits</strong> long, consisting entirely of numbers. The first four digits indicate the mail class (e.g., 9400 for Priority Mail, 9270 for Priority Mail Express).
          </p>
          <p>
            <strong>How long is a USPS tracking number?</strong> International USPS tracking numbers are exactly <strong>13 characters</strong> following the Universal Postal Union S10 standard: 2 letters + 9 digits + 2-letter country code (e.g., EA123456789US).
          </p>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> International Postal Tracking Formats
          </h2>
          <p>
            Most international postal services follow the UPU S10 standard: 2 service indicator letters + 9 digits (8 serial + 1 check digit) + 2-letter ISO country code. Common service indicators include:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>EA-EZ:</strong> EMS / Express Mail</li>
            <li><strong>RA-RZ:</strong> Registered Mail</li>
            <li><strong>CA-CZ:</strong> Parcels</li>
            <li><strong>LA-LZ:</strong> Letter Post</li>
            <li><strong>UA-UZ:</strong> Uninsured Parcels</li>
          </ul>
          <p>Country codes: US (United States), FR (France), DE (Germany), IN (India), SG (Singapore), CN (China), CZ (Czech Republic), GB (United Kingdom).</p>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" /> How to Identify a Tracking Number
          </h2>
          <p>
            Not sure which carrier your tracking number belongs to? Here are quick identification tips:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Starts with 1Z:</strong> UPS</li>
            <li><strong>12-22 digits only:</strong> FedEx</li>
            <li><strong>20-22 digits starting with 94xx:</strong> USPS</li>
            <li><strong>10 digits:</strong> DHL Express</li>
            <li><strong>Starts with C or D + 14 digits:</strong> OnTrac</li>
            <li><strong>Starts with SF:</strong> SF Express</li>
            <li><strong>Starts with SPX:</strong> SpeedEx / SPX Express</li>
            <li><strong>Ends in FR:</strong> Colissimo / La Poste France</li>
            <li><strong>Ends in DE:</strong> Deutsche Post / DHL Germany</li>
            <li><strong>Ends in IN:</strong> India Post</li>
            <li><strong>Ends in SG:</strong> Singapore Post</li>
            <li><strong>Starts with JD:</strong> Yodel (UK)</li>
          </ul>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-foreground mb-2">Track Any Package Now</h3>
            <p className="text-sm mb-4">Our universal tracking tool auto-detects the carrier from your tracking number. Works with 200+ carriers worldwide.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Package className="h-4 w-4" /> Go to Tracking Tool
            </Link>
          </div>
        </div>
      </article>

      <div className="container max-w-4xl pb-10">
        <InternalLinkingHub currentPath="/knowledge-center/carrier-tracking-formats" variant="compact" />
      </div>
    </Layout>
  );
};

export default CarrierTrackingFormatsGuide;

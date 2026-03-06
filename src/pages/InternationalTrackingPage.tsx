import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Globe, Clock, Shield, Package, Plane, AlertTriangle, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const InternationalTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS International Tracking – Track International Packages Free"
        description="Free USPS international tracking tool. Track international packages, customs status & delivery worldwide. Enter your international tracking number for real-time updates on USPS international shipments."
        canonical="/international-tracking"
        keywords="usps international tracking, usps tracking international, international usps tracking, usps tracking overseas packages, usps international package tracking, usps tracking international package, usps global tracking, usps international mail tracking, track usps international, international tracking usps"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">International Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS International Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track USPS international packages worldwide. Monitor customs clearance, transit status, and delivery for international shipments to and from the United States.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track International Package <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is USPS International Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USPS international tracking</strong> lets you monitor packages shipped to and from the United States via USPS international mail services. Whether you're sending a package overseas or waiting for an international delivery, our free <strong>USPS international tracking tool</strong> provides real-time updates on your shipment's journey across borders.
          </p>
          <p>
            USPS delivers to more than <strong>190 countries worldwide</strong> through partnerships with national postal services around the globe. When you <strong>track USPS international</strong> shipments, you can see when your package clears US customs, enters the destination country, passes through foreign customs, and is delivered to the final address.
          </p>
          <p>
            International tracking numbers follow the Universal Postal Union (UPU) standard format: <strong>two letters + nine digits + two-letter country code</strong>. For packages originating in the US, the tracking number ends in "US" (e.g., EA123456789US). Our tool recognizes tracking numbers from all countries, allowing you to track incoming packages to the US as well.
          </p>
          <p>
            USPS offers several international shipping services with varying levels of tracking detail: <strong>Priority Mail Express International</strong> (full tracking, 3-5 days), <strong>Priority Mail International</strong> (full tracking, 6-10 days), <strong>First-Class Mail International</strong> (limited tracking, 7-21 days), and <strong>First-Class Package International Service</strong> (tracking included, 7-21 days).
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">USPS International Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Plane, title: "Priority Mail Express International", desc: "Fastest USPS international service: 3-5 business days to most destinations. Full tracking, $200 insurance, money-back guarantee.", time: "3-5 days" },
              { icon: Truck, title: "Priority Mail International", desc: "6-10 business days delivery. Full tracking, flat rate boxes available. $200 insurance for merchandise. Most popular for international shipping.", time: "6-10 days" },
              { icon: Package, title: "First-Class Package International", desc: "Affordable option for packages up to 4 lbs. 7-21 business days. Tracking included for packages. Ideal for small, lightweight items.", time: "7-21 days" },
              { icon: Globe, title: "Global Express Guaranteed (GXG)", desc: "Premium service with guaranteed 1-3 day delivery to major global markets. Date-certain delivery with full tracking and up to $2,499 insurance.", time: "1-3 days" },
            ].map((s) => (
              <div key={s.title} className="bg-card border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <s.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{s.time}</span>
                </div>
                <h3 className="font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">International Tracking Number Formats</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 border font-bold text-foreground">Prefix</th>
                <th className="text-left p-3 border font-bold text-foreground">Service</th>
                <th className="text-left p-3 border font-bold text-foreground">Example</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["EA, EB, EC", "Priority Mail Express International", "EA123456789US"],
                ["CP, CX", "Priority Mail International (Flat Rate)", "CP123456789US"],
                ["LA, LB, LC", "First-Class Package International", "LA123456789US"],
                ["RA, RB, RC", "Registered Mail International", "RA123456789US"],
                ["UD, UE", "Global Express Guaranteed", "UD123456789US"],
              ].map(([prefix, service, example]) => (
                <tr key={prefix} className="hover:bg-muted/50">
                  <td className="p-3 border font-mono font-bold">{prefix}</td>
                  <td className="p-3 border">{service}</td>
                  <td className="p-3 border font-mono">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">Common International Tracking Issues</h2>
          <div className="space-y-3">
            {[
              { icon: AlertTriangle, title: "Tracking Not Updating After Leaving US", desc: "This is normal. When packages transfer between postal systems, there may be a gap in tracking updates until the destination country's postal service scans the package." },
              { icon: Clock, title: "Package Stuck in Customs", desc: "Customs processing can take 1-4 weeks depending on the country. Items may be inspected, require documentation, or need duties/taxes paid before release." },
              { icon: Shield, title: "Customs Fees & Duties", desc: "Recipients may need to pay import duties and taxes before delivery. These fees are determined by the destination country and are not included in USPS shipping costs." },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-lg p-4 flex gap-3">
                <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Priority Mail Tracking", to: "/priority-mail-tracking" },
            { label: "Express Mail Tracking", to: "/express-mail-tracking" },
            { label: "Certified Mail Tracking", to: "/certified-mail-tracking" },
            { label: "Tracking Number Formats", to: "/tracking-number-formats" },
            { label: "Live Tracking", to: "/live-tracking" },
            { label: "USA Tracking", to: "/usa-tracking" },
            { label: "Track Parcel USA", to: "/track-parcel-usa" },
            { label: "USPS Tracker", to: "/usps-tracker" },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="container py-3 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub />
    </Layout>
  );
};

export default InternationalTrackingPage;

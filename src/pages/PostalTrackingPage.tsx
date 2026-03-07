import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Package, Truck, MapPin, Clock, Shield, CheckCircle, ArrowRight, Search, Globe, Mail } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { trackingStatuses, majorLocations } from "@/data/seoStaticData";
import { AdSlot } from "@/components/ads/AdSlot";

const PostalTrackingPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Postal Tracking – Track Your US Postal Service Package"
        description="Free postal tracking tool. Track packages through the United States Postal Service. US postal tracking for Priority Mail, First Class, Certified Mail. Real-time postal service tracking updates."
        canonical="/postal-tracking"
        keywords="postal tracking, us postal tracking, united states postal service tracking, postal service tracking, united postal tracking, us postal service tracking, track postal, us postage tracking, united states postal system tracking, postal tracker"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">US Postal Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            Postal Tracking
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track packages through the United States Postal Service. Free, instant US postal tracking for all USPS shipping services.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors"
          >
            <Search className="h-5 w-5" />
            Track Your Package Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* What is Postal Tracking */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is US Postal Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>Postal tracking</strong> — also known as <strong>US postal tracking</strong>, <strong>United States Postal Service tracking</strong>, or <strong>postal service tracking</strong> — is the free package monitoring service from USPS. When you ship through the <strong>United States Postal Service</strong>, every trackable item receives a unique tracking number that lets you follow its journey from sender to recipient in real time.
          </p>
          <p>
            Our <strong>postal tracking</strong> tool connects directly to the USPS tracking system to provide instant delivery status updates. Whether you're looking for <strong>US postal service tracking</strong>, <strong>united postal tracking</strong>, or <strong>US postage tracking</strong>, you've found the right place. Enter your tracking number above to get started.
          </p>
          <p>
            The <strong>United States Postal Service</strong> is the largest postal system in the world, processing over <strong>7.3 billion pieces of mail</strong> annually through more than 31,000 post offices. Our <strong>postal tracker</strong> gives you access to the same real-time tracking data used by USPS employees nationwide, completely free.
          </p>
        </div>
      </section>

      {/* USPS Services */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Postal Service Tracking — All USPS Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-card border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted border-b">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">USPS Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Delivery Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Tracking</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Insurance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { service: "Priority Mail Express", time: "1-2 days", tracking: "✅ Full", insurance: "$100 included" },
                  { service: "Priority Mail", time: "1-3 days", tracking: "✅ Full", insurance: "$100 included" },
                  { service: "First-Class Package", time: "1-5 days", tracking: "✅ Full", insurance: "Optional" },
                  { service: "USPS Ground Advantage", time: "2-5 days", tracking: "✅ Full", insurance: "Optional" },
                  { service: "Certified Mail", time: "3-5 days", tracking: "✅ Full", insurance: "Optional" },
                  { service: "Media Mail", time: "2-8 days", tracking: "✅ Full", insurance: "Optional" },
                  { service: "International Priority", time: "6-10 days", tracking: "✅ Full", insurance: "$200 included" },
                ].map((s) => (
                  <tr key={s.service} className="hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">{s.service}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.time}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.tracking}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.insurance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How Postal Tracking Works */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How United States Postal Service Tracking Works</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            When you ship a package through the <strong>United States Postal Service</strong>, it passes through a sophisticated network of sorting facilities and distribution centers. At each point, automated barcode scanners record the package's location and time, creating the tracking history you see when you use our <strong>postal tracking</strong> tool.
          </p>
          <p>
            <strong>US postal tracking</strong> statuses include: <Link to="/status/in-transit-to-next-facility" className="text-primary hover:underline">"In Transit to Next Facility"</Link> (your package is moving between USPS centers), <Link to="/status/out-for-delivery" className="text-primary hover:underline">"Out for Delivery"</Link> (it's on a carrier's vehicle for delivery today), and <Link to="/status/delivered" className="text-primary hover:underline">"Delivered"</Link> (successfully delivered to the address).
          </p>
          <p>
            If your <strong>postal service tracking</strong> isn't updating, don't worry — this usually means your package is between scan points. Most tracking updates occur within 24 hours of a scan. For packages that haven't updated in 5+ business days, we recommend filing a <a href="https://www.usps.com/help/missing-mail.htm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Missing Mail request</a> with USPS.
          </p>
        </div>
      </section>

      {/* Tracking Number Formats */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">US Postal Tracking Number Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { prefix: "9400 / 9205", service: "Priority Mail", digits: "22 digits" },
              { prefix: "9270", service: "Priority Mail Express", digits: "22 digits" },
              { prefix: "9300 / 9400", service: "Ground Advantage", digits: "22 digits" },
              { prefix: "9407", service: "Certified Mail", digits: "22 digits" },
              { prefix: "9202", service: "Signature Confirmation", digits: "22 digits" },
              { prefix: "EA/EB/EC + US", service: "International", digits: "13 characters" },
            ].map((f) => (
              <div key={f.prefix} className="bg-card border rounded-lg p-4">
                <p className="font-mono text-sm font-bold text-primary">{f.prefix}</p>
                <p className="text-sm text-foreground font-semibold">{f.service}</p>
                <p className="text-xs text-muted-foreground">{f.digits}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Postal Tracking FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "What is postal tracking?", a: "Postal tracking (also called US postal tracking or USPS tracking) is a free service from the United States Postal Service that lets you monitor the delivery status of packages and mail in real time using a tracking number." },
            { q: "How do I track a package through the US postal service?", a: "Enter your USPS tracking number (20-22 digits for domestic, 13 characters for international) in the search box at the top of this page. You'll see real-time status updates including location, timestamps, and estimated delivery date." },
            { q: "Is US postal tracking free?", a: "Yes! All USPS shipping services include free postal tracking. Our postal tracking tool is also completely free with no registration required." },
            { q: "What's the difference between postal tracking and USPS tracking?", a: "They're the same thing. Postal tracking, US postal tracking, USPS tracking, postal service tracking, and post office tracking all refer to the United States Postal Service's package tracking system." },
            { q: "Can I track international postal shipments?", a: "Yes! Enter your international tracking number (13 characters like EA123456789US) to track packages sent through the US postal service internationally. We support tracking to and from over 190 countries." },
          ].map((item, i) => (
            <div key={i} className="bg-card border rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tracking Statuses */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-4">US Postal Tracking Statuses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trackingStatuses.map((s) => (
              <Link key={s.slug} to={`/status/${s.slug}`} className="bg-card border rounded-lg p-4 hover:border-primary/30 transition-all group">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-4 flex justify-center">
        <AdSlot slotId="content-ad" />
      </div>
      <InternalLinkingHub currentPath="/postal-tracking" variant="compact" />
    </Layout>
  );
};

export default PostalTrackingPage;

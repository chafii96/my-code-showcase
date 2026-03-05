import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Globe, Truck, Clock } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const TrackParcelUSAPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Track Parcel USA – Free USA Parcel Tracking Tool"
        description="Track parcel USA — free online parcel tracking for the United States. Enter your tracking number to track any USA parcel in real time. USPS parcel tracking with instant delivery status updates."
        canonical="/track-parcel-usa"
        keywords="track parcel usa, track parcel united states, usa parcel tracking, track usa parcel, parcel tracking usa, track a parcel usa, usa parcel track, parcel tracker usa, track my parcel usa"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">USA Parcel Tracker</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Track Parcel USA</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your USA parcel online — free, instant, and real-time. Enter your tracking number to see delivery status for any parcel shipped within or to the United States.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track USA Parcel <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Track Parcel USA — How It Works</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            To <strong>track parcel USA</strong>, enter your USPS tracking number in the search box above. Our free <strong>USA parcel tracking</strong> tool connects directly to the United States Postal Service database to retrieve real-time delivery status information for any parcel shipped within the US or arriving from overseas.
          </p>
          <p>
            Whether you're looking for <strong>USA parcel tracking</strong>, want to <strong>track a parcel USA</strong>, or need a <strong>parcel tracker USA</strong>, our tool provides comprehensive tracking for all USPS services. USPS is the primary carrier for parcels in the United States, handling billions of shipments each year through its network of 31,000+ post offices.
          </p>
          <p>
            Our <strong>track parcel USA</strong> tool is especially useful for international shoppers and businesses sending parcels to the United States. Once a parcel enters the US postal network, USPS scans it at customs, sorting facilities, and delivery points — and you can monitor every step right here.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">USA Parcel Delivery Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Truck, title: "Domestic USA Parcels", items: ["Priority Mail Express: 1-2 days", "Priority Mail: 1-3 days", "First-Class Package: 1-5 days", "Ground Advantage: 2-5 days"] },
              { icon: Globe, title: "International to USA", items: ["Priority Mail International: 6-10 days", "First-Class Intl: 7-21 days", "Global Express Guaranteed: 1-3 days", "Customs processing: 1-5 extra days"] },
            ].map((s) => (
              <div key={s.title} className="bg-card border rounded-xl p-5">
                <s.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-foreground mb-3">{s.title}</h3>
                <ul className="space-y-1.5">
                  {s.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">More USA Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "USA Tracking", to: "/usa-tracking" },
            { label: "Track USPS", to: "/track-usps" },
            { label: "US Post Tracking", to: "/us-post-tracking" },
            { label: "Track & Trace USPS", to: "/track-and-trace-usps" },
            { label: "Post Office Tracking", to: "/post-office-tracking" },
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

export default TrackParcelUSAPage;

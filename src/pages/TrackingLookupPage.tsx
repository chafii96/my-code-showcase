import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Eye, Hash, Globe, Package, HelpCircle, Shield } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const TrackingLookupPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Tracking Lookup – Search & Look Up Tracking Numbers Free"
        description="Free USPS tracking number lookup tool. Search any USPS tracking number for real-time status updates. Look up tracking by number, find lost tracking numbers, and get delivery information instantly."
        canonical="/tracking-lookup"
        keywords="usps tracking number lookup, usps tracking lookup, usps tracking search, usps search tracking, usps tracking number search, usps tracking by number, tracking number lookup usps, look up usps tracking, usps tracking number customer service, usps tracking info, usps tracking information, usps tracking online"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Eye className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Tracking Lookup</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Tracking Lookup</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Look up any USPS tracking number instantly. Free tracking number search with real-time delivery status, location history, and estimated delivery dates.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Look Up Tracking Number <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">USPS Tracking Number Lookup — How It Works</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USPS tracking number lookup</strong> is the fastest way to find the current location and delivery status of any USPS package or mail piece. Our free <strong>USPS tracking lookup</strong> tool queries USPS servers in real time, returning the same detailed tracking information available to postal employees.
          </p>
          <p>
            When you <strong>search USPS tracking</strong> by number, you'll see a complete timeline of your package's journey: from acceptance at the origin post office, through each USPS processing facility, to out-for-delivery status, and final delivery confirmation. Our <strong>USPS tracking search</strong> tool supports all domestic and international tracking number formats.
          </p>
          <p>
            People commonly search for "<strong>USPS tracking number lookup</strong>", "<strong>USPS tracking by number</strong>", or "<strong>USPS tracking number search</strong>" when they need to check on a package. Our tool makes this process simple — just paste your number and get instant results. No account required, no fees, no registration.
          </p>
          <p>
            Beyond simple lookup, our tool also helps when your <strong>USPS tracking is not updating</strong>. We provide explanations for common tracking statuses, estimated delivery windows based on the shipping service, and guidance on what to do if your package appears stuck in transit or shows unusual tracking activity.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Ways to Look Up USPS Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Search, title: "Online Tracking (This Tool)", desc: "Enter your tracking number above for instant, free results. Works 24/7, no registration needed. Supports all USPS services.", best: true },
              { icon: Globe, title: "USPS.com Official Website", desc: "Visit usps.com/tracking and enter your number. Official USPS website with same tracking data." },
              { icon: Hash, title: "Text to 28777 (2USPS)", desc: "Text your tracking number to 28777 for SMS tracking updates. Text 'follow [number]' for automatic notifications." },
              { icon: HelpCircle, title: "Call 1-800-222-1811", desc: "Call USPS customer service for tracking assistance. Available Mon-Fri 8AM-8:30PM, Sat 8AM-6PM ET." },
              { icon: Package, title: "USPS Mobile App", desc: "Download the free USPS Mobile app for iOS/Android. Scan tracking barcodes with your camera for instant lookup." },
              { icon: Shield, title: "Informed Delivery", desc: "Free service showing images of incoming mail. Track packages without tracking numbers. Sign up at informeddelivery.usps.com." },
            ].map((item) => (
              <div key={item.title} className={`bg-card border rounded-xl p-5 ${item.best ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}>
                <item.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                {item.best && <span className="inline-block mt-2 text-xs font-bold text-primary">⭐ Recommended</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Lost Your USPS Tracking Number?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            If you've <strong>lost your USPS tracking number</strong> or <strong>misplaced your USPS tracking number</strong>, don't panic. Here are several ways to find it:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Check your email:</strong> If you purchased shipping online, the tracking number is in your confirmation email.</li>
            <li><strong>Check the sender's records:</strong> Contact the sender (retailer, eBay seller, etc.) to request the tracking number.</li>
            <li><strong>USPS Informed Delivery:</strong> If enrolled, log in to see tracking for packages addressed to you.</li>
            <li><strong>USPS receipt:</strong> Check your physical receipt from the post office — the tracking number is printed on it.</li>
            <li><strong>Contact your local post office:</strong> They may be able to look up the tracking number with the date, destination, and other details.</li>
          </ul>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Track USPS", to: "/track-usps" },
            { label: "USPS Tracker", to: "/usps-tracker" },
            { label: "Tracking Number Formats", to: "/tracking-number-formats" },
            { label: "Tracking Not Updating", to: "/tracking-not-updating" },
            { label: "Live Tracking", to: "/live-tracking" },
            { label: "Mail Tracking", to: "/mail-tracking" },
            { label: "Where Is My Package", to: "/where-is-my-package" },
            { label: "Package Tracker USPS", to: "/package-tracker-usps" },
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

export default TrackingLookupPage;

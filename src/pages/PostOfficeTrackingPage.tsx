import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Hero from "@/components/Hero";
import FAQSection from "@/components/FAQSection";
import { Link } from "react-router-dom";
import { Package, Truck, MapPin, Clock, Shield, CheckCircle, ArrowRight, Building, Search } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { majorLocations } from "@/data/mockTracking";
import { AdSlot } from "@/components/ads/AdSlot";

const PostOfficeTrackingPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Post Office Tracking – Track Your Post Office Package Online"
        description="Free post office tracking tool. Track your post office package, parcel, or mail online. Works for all USPS services — Priority Mail, First Class, Certified Mail. Real-time post office tracking updates."
        canonical="/post-office-tracking"
        keywords="post office tracking, post office tracking online, track post office parcel, post office usa tracking, post office tracking website, post office package tracking, track post office, usps post office tracking"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Building className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Official Tracking Tool</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            Post Office Tracking
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your post office package online — free, instant, and real-time. Enter your tracking number below to get delivery status updates from the United States Postal Service.
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

      {/* What is Post Office Tracking */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is Post Office Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>Post office tracking</strong> is a free service provided by the United States Postal Service (USPS) that allows you to monitor the status and location of your packages and mail. When you ship a package through any US post office, you receive a tracking number that you can use to <strong>track your post office package online</strong> at any time.
          </p>
          <p>
            Whether you call it <strong>post office tracking</strong>, <strong>USPS tracking</strong>, <strong>postal tracking</strong>, or <strong>mail tracking</strong>, the service is the same — a comprehensive real-time tracking system that covers every USPS shipping service from Priority Mail to First Class, Certified Mail to Media Mail. Our <strong>post office tracking website</strong> provides instant access to the same tracking data used by USPS post offices nationwide.
          </p>
        </div>
      </section>

      {/* How to Track */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Track a Post Office Package Online</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Package, step: "1", title: "Get Your Tracking Number", desc: "Find the tracking number on your post office receipt, email confirmation, or the package label. USPS tracking numbers are typically 20-22 digits long." },
              { icon: Search, step: "2", title: "Enter It Above", desc: "Type or paste your post office tracking number into the search box on this page. Our tool works for all USPS services and package types." },
              { icon: CheckCircle, step: "3", title: "View Real-Time Updates", desc: "See your package's complete journey including every scan at USPS facilities, current location, and estimated delivery date." },
            ].map((item) => (
              <div key={item.step} className="bg-card border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">{item.step}</span>
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Post Office Services */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Post Office Shipping Services with Tracking</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            Every major shipping service at the US post office includes free <strong>post office tracking</strong>. Here's what's available:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            {[
              { name: "Priority Mail", time: "1-3 days", tracking: "Full tracking + $100 insurance", icon: Truck },
              { name: "Priority Mail Express", time: "1-2 days (guaranteed)", tracking: "Full tracking + $100 insurance", icon: Clock },
              { name: "First-Class Package", time: "1-5 days", tracking: "Full tracking included", icon: Package },
              { name: "USPS Ground Advantage", time: "2-5 days", tracking: "Full tracking included", icon: MapPin },
              { name: "Certified Mail", time: "3-5 days", tracking: "Tracking + proof of mailing", icon: Shield },
              { name: "Media Mail", time: "2-8 days", tracking: "Full tracking included", icon: Package },
            ].map((s) => (
              <div key={s.name} className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">{s.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{s.time} · {s.tracking}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Post Office Tracking FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "How do I track a post office parcel?", a: "Enter your USPS tracking number (found on your receipt or shipping label) in the search box at the top of this page. You'll instantly see the real-time status of your post office parcel, including its current location and estimated delivery date." },
              { q: "Is post office tracking the same as USPS tracking?", a: "Yes! Post office tracking, USPS tracking, US postal tracking, and postal service tracking all refer to the same free package tracking service from the United States Postal Service. Any of these terms will lead you to track your package." },
              { q: "Can I track a post office package without a tracking number?", a: "You can use USPS Informed Delivery, a free service that automatically previews incoming mail and tracks packages to your address. Sign up at informeddelivery.usps.com. You can also contact the sender for the tracking number." },
              { q: "How long does post office tracking take to update?", a: "Post office tracking updates each time your package is scanned at a USPS facility. Updates typically appear within minutes of a scan, but during peak seasons, delays of 24-48 hours are possible. If tracking hasn't updated for 5+ business days, file a Missing Mail request." },
              { q: "What post office tracking website should I use?", a: "You're on the right one! Our post office tracking website connects directly to the USPS tracking system. You can also use the official USPS website at tools.usps.com, but our tool provides the same real-time data with a faster, cleaner interface." },
            ].map((item, i) => (
              <div key={i} className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track by City */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Post Office Tracking by City</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {majorLocations.map((l) => (
            <Link key={l.slug} to={`/locations/${l.slug}`} className="bg-card border rounded-lg p-3 hover:border-primary/30 transition-all text-sm">
              <span className="font-semibold text-foreground">{l.city}, {l.state}</span>
              <p className="text-xs text-muted-foreground mt-1">{l.facilities} post offices</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="container py-4 flex justify-center">
        <AdSlot slotId="content-ad" />
      </div>
      <InternalLinkingHub currentPath="/post-office-tracking" variant="compact" />
    </Layout>
  );
};

export default PostOfficeTrackingPage;

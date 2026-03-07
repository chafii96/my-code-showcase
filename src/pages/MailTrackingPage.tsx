import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Mail, Package, Truck, Clock, Shield, CheckCircle, ArrowRight, Search, Globe } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { majorLocations } from "@/data/seoStaticData";
import { AdSlot } from "@/components/ads/AdSlot";

const MailTrackingPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Mail Tracking – Track Your Mail & Packages Online Free"
        description="Free mail tracking tool. Track USPS mail, letters, and packages by tracking number. Works for all US postal services. Get real-time mail delivery status updates instantly."
        canonical="/mail-tracking"
        keywords="mail tracking, track mail, us mail tracking, mail tracking usps, track my mail, usps mail tracking, mail package tracking, postal mail tracking, track mail online, mail delivery tracking"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Mail className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Free Mail Tracker</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            Mail Tracking
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your mail and packages online — free, instant, and real-time. Monitor letters, parcels, and shipments through the US postal system.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors"
          >
            <Search className="h-5 w-5" />
            Track Your Mail Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* What is Mail Tracking */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is Mail Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>Mail tracking</strong> is the ability to monitor the location and delivery status of mail and packages sent through the United States Postal Service (USPS). When you <strong>track mail</strong> using our free tool, you get real-time updates showing exactly where your mail is in the postal system — from pickup to delivery.
          </p>
          <p>
            <strong>US mail tracking</strong> covers all types of postal items: packages, parcels, letters (Certified and Registered), and international shipments. Whether you need <strong>USPS mail tracking</strong> for a Priority Mail package, want to <strong>track mail</strong> sent via First Class, or need to monitor a Certified letter, our tracking tool provides instant status updates 24/7.
          </p>
          <p>
            Our <strong>mail tracking</strong> service is completely free and requires no registration. Simply enter your USPS tracking number — typically 20 to 22 digits for domestic mail, or 13 characters for international mail (e.g., EA123456789US) — and get comprehensive delivery status information including timestamps, locations, and estimated delivery dates.
          </p>
        </div>
      </section>

      {/* Types of Mail You Can Track */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Types of Mail You Can Track</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Package, title: "Packages & Parcels", desc: "Track any USPS package from small First-Class packages to large Priority Mail and Ground Advantage shipments. All packages include free tracking.", types: "Priority Mail, First-Class Package, Ground Advantage, Media Mail" },
              { icon: Mail, title: "Certified & Registered Mail", desc: "Track important documents and legal mail with proof of mailing and delivery confirmation. Certified Mail provides electronic verification.", types: "Certified Mail, Registered Mail, Signature Confirmation" },
              { icon: Truck, title: "Express & Overnight Mail", desc: "Track time-critical shipments with guaranteed delivery dates. Priority Mail Express includes tracking and $100 insurance automatically.", types: "Priority Mail Express, Next-Day, 2-Day" },
              { icon: Globe, title: "International Mail", desc: "Track international packages and letters sent to or from the US. International tracking uses 13-character alphanumeric codes ending in 'US'.", types: "Priority Mail International, First-Class International, Global Express" },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                <p className="text-xs text-muted-foreground/70"><strong>Services:</strong> {item.types}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USPS Informed Delivery */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Track Mail Without a Tracking Number</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            Can't find your tracking number? <strong>USPS Informed Delivery</strong> lets you <strong>track mail</strong> automatically — even regular First-Class letters that don't include standard tracking. This free USPS service sends you daily email digests with:
          </p>
          <ul>
            <li><strong>Grayscale images</strong> of incoming letter-sized mail pieces</li>
            <li><strong>Package tracking notifications</strong> for parcels addressed to you</li>
            <li><strong>Estimated delivery dates</strong> for all incoming mail</li>
            <li><strong>Digital access</strong> to your mail before it arrives</li>
          </ul>
          <p>
            Sign up for free at <a href="https://informeddelivery.usps.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">informeddelivery.usps.com</a>. It's the best way to <strong>track your mail</strong> when you don't have a tracking number.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Mail Tracking FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "How do I track my mail?", a: "Enter your USPS tracking number in the search box at the top of this page. Your tracking number is on your receipt, shipping confirmation email, or the package label. For regular letters, use USPS Informed Delivery to preview incoming mail." },
              { q: "Is mail tracking free?", a: "Yes! USPS mail tracking is completely free for all trackable services. Every USPS shipping service includes tracking at no extra cost. Our mail tracking tool is also free with no registration required." },
              { q: "Can I track regular First-Class letters?", a: "Standard First-Class letters don't include tracking, but you can add Certified Mail service for $4.15 to get full tracking. Alternatively, USPS Informed Delivery provides free grayscale previews of all incoming letter-sized mail." },
              { q: "How long does mail tracking take to update?", a: "Mail tracking updates each time your item is scanned at a USPS facility. Updates typically appear within minutes, but during peak periods, delays of 24-48 hours are possible." },
              { q: "What's the difference between mail tracking and package tracking?", a: "They're essentially the same service. 'Mail tracking' and 'package tracking' both refer to USPS's ability to show you the real-time status of items moving through the postal system. The term 'mail tracking' often includes letters and documents in addition to packages." },
            ].map((item, i) => (
              <div key={i} className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-4 flex justify-center">
        <AdSlot slotId="content-ad" />
      </div>
      <InternalLinkingHub currentPath="/mail-tracking" variant="compact" />
    </Layout>
  );
};

export default MailTrackingPage;

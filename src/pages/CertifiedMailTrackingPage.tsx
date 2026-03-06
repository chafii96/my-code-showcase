import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Shield, Clock, FileText, CheckCircle, AlertTriangle, Package } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const CertifiedMailTrackingPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Track USPS Certified Mail",
    step: [
      { "@type": "HowToStep", name: "Find Your Tracking Number", text: "Locate your 20-digit certified mail tracking number on your PS Form 3800 receipt. It starts with 9407." },
      { "@type": "HowToStep", name: "Enter the Number", text: "Type or paste your certified mail tracking number into the search box on this page." },
      { "@type": "HowToStep", name: "View Results", text: "Click 'Track' to see real-time certified mail status including proof of mailing, delivery attempts, and signature confirmation." },
    ],
  };

  return (
    <Layout>
      <SEOHead
        title="USPS Certified Mail Tracking – Track Certified Mail Online Free"
        description="Free USPS Certified Mail tracking tool. Track certified mail by tracking number with real-time updates, proof of mailing, delivery confirmation & signature status. Track USPS certified mail instantly."
        canonical="/certified-mail-tracking"
        keywords="usps certified mail tracking, certified mail tracking, track certified mail usps, usps certified mail tracker, certified mail tracking number, usps certified mail tracking number, track certified mail, certified mail usps, usps certified mail, certified mail tracking usps"
        structuredData={[ howToSchema]}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Certified Mail Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Certified Mail Tracking</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Track your USPS Certified Mail online — free, instant, real-time. Get proof of mailing, delivery status, and signature confirmation for any certified mail piece.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track Certified Mail <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">What is USPS Certified Mail Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>USPS Certified Mail tracking</strong> is a premium postal service that provides senders with legal proof of mailing and proof of delivery. When you send <strong>certified mail through USPS</strong>, you receive a unique 20-digit tracking number that allows you to monitor your mail piece from the moment it's accepted at the post office until it's delivered and signed for by the recipient.
          </p>
          <p>
            Our free <strong>certified mail tracking</strong> tool gives you instant access to the same tracking data used by USPS postal employees. Whether you need to <strong>track certified mail USPS</strong> for legal documents, court filings, tax returns, or important business correspondence, our tool provides real-time updates including proof of mailing timestamps, delivery attempt records, and signature confirmation details.
          </p>
          <p>
            <strong>USPS Certified Mail</strong> is one of the most trusted mailing services in the United States, used by millions of individuals, businesses, law firms, and government agencies annually. The service costs $4.15 (as of 2025) in addition to regular postage and provides an official record that the USPS accepted your mail piece on a specific date and time.
          </p>
          <p>
            Unlike regular First-Class Mail, <strong>certified mail</strong> requires the recipient to sign upon delivery, creating an indisputable record that the item was received. This makes <strong>USPS certified mail tracking</strong> essential for time-sensitive legal notices, IRS filings, insurance claims, contract deliveries, and any correspondence where proof of delivery is legally required.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">USPS Certified Mail Tracking Number Format</h2>
          <div className="bg-card border rounded-xl p-6 mb-6">
            <h3 className="font-bold text-foreground mb-3">How to Identify Your Certified Mail Tracking Number</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>USPS Certified Mail tracking numbers follow a specific format:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Length:</strong> 20 digits (no letters)</li>
                <li><strong>Prefix:</strong> Usually starts with <code className="bg-muted px-1 rounded">9407</code></li>
                <li><strong>Example:</strong> <code className="bg-muted px-1 rounded">9407 1118 9922 3397 7194 00</code></li>
                <li><strong>Location on receipt:</strong> Found on PS Form 3800 (the green certified mail receipt)</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: "Proof of Mailing", desc: "Official USPS record that your mail was accepted on a specific date and time. Admissible as legal evidence." },
              { icon: CheckCircle, title: "Signature Required", desc: "Recipient must sign upon delivery. Creates indisputable proof that the item was received." },
              { icon: Clock, title: "3-5 Business Days", desc: "Standard delivery within continental US. Add Return Receipt for mailed-back proof of delivery." },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-xl p-5">
                <item.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Certified Mail Tracking Statuses Explained</h2>
        <div className="space-y-3">
          {[
            { status: "Accepted at USPS Origin Facility", meaning: "Your certified mail has been scanned and accepted by USPS. This is your proof of mailing timestamp.", color: "text-blue-600" },
            { status: "In Transit to Destination", meaning: "Your certified mail is moving through the USPS network toward the recipient's local post office.", color: "text-yellow-600" },
            { status: "Out for Delivery", meaning: "Your certified mail is on the mail carrier's route and will be delivered today. Signature required.", color: "text-orange-600" },
            { status: "Delivered, Left with Individual", meaning: "Your certified mail has been delivered and signed for by the recipient or authorized agent.", color: "text-green-600" },
            { status: "Notice Left (No Authorized Recipient Available)", meaning: "Delivery attempted but no one was available to sign. A PS Form 3849 notice was left. Item held at post office for 15 days.", color: "text-red-600" },
            { status: "Available for Pickup", meaning: "After a failed delivery attempt, your certified mail is being held at the local post office for the recipient to pick up.", color: "text-purple-600" },
            { status: "Return to Sender", meaning: "The recipient did not pick up the certified mail within the holding period (usually 15 days). It's being returned to you.", color: "text-gray-600" },
          ].map((s) => (
            <div key={s.status} className="bg-card border rounded-lg p-4">
              <h3 className={`font-bold text-sm ${s.color}`}>{s.status}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">When to Use USPS Certified Mail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: FileText, title: "Legal Notices & Court Filings", desc: "Eviction notices, cease and desist letters, lawsuit notifications, and court-required correspondence all benefit from certified mail's proof of delivery." },
              { icon: Shield, title: "IRS Tax Returns & Documents", desc: "Send tax returns, amended filings, and IRS correspondence via certified mail to establish a legal record of timely filing." },
              { icon: Package, title: "Insurance Claims", desc: "File insurance claims and send policy documents with certified mail to create a verifiable paper trail." },
              { icon: AlertTriangle, title: "Contract & Business Correspondence", desc: "Send contracts, termination notices, demand letters, and formal business communications with certified mail for legal protection." },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-xl p-5">
                <item.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related USPS Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Priority Mail Tracking", to: "/priority-mail-tracking" },
            { label: "Express Mail Tracking", to: "/express-mail-tracking" },
            { label: "First Class Tracking", to: "/first-class-tracking" },
            { label: "International Tracking", to: "/international-tracking" },
            { label: "Tracking Number Formats", to: "/tracking-number-formats" },
            { label: "Track USPS", to: "/track-usps" },
            { label: "USPS Tracker", to: "/usps-tracker" },
            { label: "Tracking Lookup", to: "/tracking-lookup" },
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

export default CertifiedMailTrackingPage;

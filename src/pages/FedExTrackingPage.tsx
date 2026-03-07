import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, MapPin, CheckCircle, Truck, AlertTriangle, Globe, Shield, Phone } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const FedExTrackingPage = () => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Track a FedEx Package",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Find Your FedEx Tracking Number", text: "Locate your FedEx tracking number in your shipping confirmation email. FedEx tracking numbers are 12 or 15 digits, or 20 digits for FedEx Ground." },
      { "@type": "HowToStep", name: "Enter the Tracking Number", text: "Type or paste your FedEx tracking number into the tracker on this page." },
      { "@type": "HowToStep", name: "View Real-Time Status", text: "See your FedEx shipment's current location, delivery date, and status instantly." },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FedEx Package Tracker",
    url: "https://uspostaltracking.com/fedex-tracking",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free FedEx tracking tool. Track FedEx Express, Ground, Home Delivery, and Freight packages with real-time updates.",
  };

  const statuses = [
    { icon: Package, label: "Label Created", desc: "A shipping label has been created. FedEx has not yet received the package from the shipper.", color: "text-blue-400" },
    { icon: Truck, label: "Picked Up", desc: "FedEx has picked up your package from the sender and it's entered the FedEx network.", color: "text-blue-600" },
    { icon: MapPin, label: "In Transit", desc: "Your package is moving between FedEx facilities on the way to its destination.", color: "text-amber-500" },
    { icon: Globe, label: "At Local FedEx Facility", desc: "Your package has arrived at the FedEx facility nearest to the delivery address.", color: "text-purple-500" },
    { icon: Truck, label: "On FedEx Vehicle for Delivery", desc: "Your package is on the delivery vehicle and will be delivered today.", color: "text-green-400" },
    { icon: CheckCircle, label: "Delivered", desc: "Your FedEx package has been successfully delivered.", color: "text-emerald-600" },
    { icon: AlertTriangle, label: "Delivery Attempt Made", desc: "FedEx attempted delivery but was unable to complete it. A door tag has been left with options for redelivery.", color: "text-red-500" },
    { icon: Shield, label: "Hold at FedEx Location", desc: "Your package is being held at a FedEx facility for pickup. Bring a valid ID.", color: "text-orange-500" },
  ];

  const numberFormats = [
    { service: "FedEx Express", format: "12 digits", example: "771234567890", note: "Used for FedEx Express domestic and international shipments" },
    { service: "FedEx Ground", format: "15 or 20 digits", example: "999999999999999", note: "Also may start with 96 for Ground shipments" },
    { service: "FedEx Home Delivery", format: "20 digits", example: "61299999999999999999", note: "Typically starts with 612 or 02" },
    { service: "FedEx SmartPost", format: "20–22 digits", example: "92612999999999999999", note: "Usually starts with 92 — handed off to USPS for delivery" },
    { service: "FedEx Freight", format: "12 digits (PRO#)", example: "123456789012", note: "PRO number used for LTL freight shipments" },
    { service: "FedEx International", format: "12–22 digits", example: "7489998888880", note: "International air waybill or express tracking numbers" },
  ];

  const faqs = [
    { q: "How long does FedEx tracking take to update?", a: "FedEx tracking updates in real time as your package is scanned at each facility. For FedEx Express, scans happen at every major hub — typically every 2–4 hours. For FedEx Ground, scans occur when the package is picked up, sorted, and out for delivery. Allow up to 24 hours after a label is created for the package to appear in the system." },
    { q: "Why does my FedEx tracking say 'Label Created' for days?", a: "This status means a shipping label was printed but FedEx hasn't physically received the package yet. The shipper may be waiting to hand it over. Once FedEx scans it at the first pickup point, the status will change to 'Picked Up.'" },
    { q: "Can I track FedEx without a tracking number?", a: "Yes — if you have a FedEx account, you can track by reference number, PO number, or order number. You can also use the FedEx InSight service for proactive account-level tracking. Alternatively, contact the sender for your tracking number." },
    { q: "What does 'FedEx package on FedEx vehicle for delivery' mean?", a: "This status means your package is on the delivery truck and is scheduled to be delivered today. Delivery typically occurs during business hours — before 8 PM for residential and before 5 PM for business deliveries." },
    { q: "How do I know if my FedEx package requires a signature?", a: "Check the details section of your tracking page. If 'Signature Required' is shown, someone must be present to sign. FedEx Express allows you to use FedEx Delivery Manager to grant permission to leave the package without a signature." },
    { q: "What is FedEx SmartPost and how is it tracked?", a: "FedEx SmartPost (now FedEx Ground Economy) uses FedEx for the main transit and hands the package off to USPS for final delivery. You can track it with your FedEx tracking number until handoff, then with a USPS tracking number starting with 92." },
    { q: "How long can FedEx hold a package?", a: "FedEx typically holds packages at a FedEx location for up to 5 business days after a missed delivery attempt. After that, the package is returned to the sender. You can pick it up with a government-issued ID." },
  ];

  return (
    <Layout>
      <SEOHead
        title="FedEx Tracking — Track Your FedEx Package in Real Time"
        description="Track your FedEx package instantly. Free FedEx tracking tool for Express, Ground, Home Delivery, and Freight. Real-time delivery status, location updates, and estimated delivery date."
        canonical="https://uspostaltracking.com/fedex-tracking"
        keywords="fedex tracking, track fedex package, fedex package tracker, fedex delivery status, fedex ground tracking, fedex express tracking, fedex shipment tracking, fedex tracking number"
        schema={[howToSchema, appSchema]}
      />

      <section className="bg-gradient-to-br from-[#4D148C] via-[#FF6600] to-[#4D148C] text-white py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Truck className="h-4 w-4" />
            FedEx Package Tracker
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            FedEx Tracking
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-4">
            Track any FedEx package instantly — Express, Ground, Home Delivery, and Freight.
          </p>
          <p className="text-sm text-white/80 max-w-xl mx-auto mb-8">
            Enter your FedEx tracking number for real-time location updates and estimated delivery date.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-white text-[#4D148C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
          >
            <Search className="h-5 w-5" />
            Track FedEx Package
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-xs text-white/70 mt-4">Free · No registration · Instant results · All FedEx services</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">What is FedEx Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>FedEx tracking</strong> lets you monitor your FedEx shipment from pickup to delivery with real-time scan data. FedEx (Federal Express) is one of the world's largest courier delivery services, operating in over 220 countries and delivering approximately 15 million packages per day. Whether you're tracking a domestic overnight Express package or a Ground shipment across the country, <strong>FedEx tracking by tracking number</strong> gives you complete visibility.
          </p>
          <p>
            When you send or receive a package with FedEx, a unique <strong>FedEx tracking number</strong> is assigned. This number powers our free <strong>FedEx package tracker</strong>, showing you real-time scan events as your package moves through FedEx's network — from the sender's location, through sorting hubs, onto delivery vehicles, and finally to your door.
          </p>
          <p>
            FedEx operates multiple distinct service levels in the United States. <strong>FedEx Express</strong> offers time-definite overnight and day-specific delivery with comprehensive scan events at every hub. <strong>FedEx Ground</strong> provides cost-effective 1–7 business day delivery for businesses. <strong>FedEx Home Delivery</strong> is the residential Ground service with evening and weekend delivery options. <strong>FedEx Ground Economy</strong> (formerly SmartPost) uses FedEx for main transit and USPS for final-mile delivery.
          </p>
          <p>
            Our free <strong>FedEx tracking tool</strong> supports all FedEx service types. Enter your tracking number regardless of format — 12-digit Express, 15-digit Ground, or 20-digit SmartPost — and get instant results with your shipment's current status, location, and estimated delivery date.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">FedEx Tracking Number Formats</h2>
          <p className="text-muted-foreground mb-6">FedEx uses different tracking number formats depending on the service type. Enter any of these formats in our tracker:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {numberFormats.map((f) => (
              <div key={f.service} className="bg-card border rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-1">{f.service}</h3>
                <p className="text-xs text-muted-foreground mb-2">{f.note}</p>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Format: <span className="font-medium text-foreground">{f.format}</span></p>
                  <code className="text-primary font-mono text-sm">{f.example}</code>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-4">
            <p className="text-sm text-purple-800"><strong>Tip:</strong> Your FedEx tracking number is in your shipping confirmation email or on your shipping receipt. Copy it exactly — do not add spaces — for the most accurate results.</p>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">FedEx Tracking Status Messages Explained</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {statuses.map((s) => (
            <div key={s.label} className="bg-card border rounded-xl p-5 flex gap-4">
              <s.icon className={`h-6 w-6 ${s.color} flex-shrink-0 mt-0.5`} />
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">{s.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">FedEx Delivery Times by Service</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-xl overflow-hidden bg-card">
              <thead className="bg-[#4D148C]">
                <tr>
                  <th className="p-4 text-left font-bold text-white">FedEx Service</th>
                  <th className="p-4 text-left font-bold text-white">Transit Time</th>
                  <th className="p-4 text-left font-bold text-white">Delivery</th>
                  <th className="p-4 text-left font-bold text-white">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["FedEx First Overnight", "Next business day by 8 AM", "Business", "Full real-time"],
                  ["FedEx Priority Overnight", "Next business day by 10:30 AM", "Business", "Full real-time"],
                  ["FedEx Standard Overnight", "Next business day by 3 PM", "Business", "Full real-time"],
                  ["FedEx 2Day", "2 business days by 10:30 AM", "Business & Residential", "Full real-time"],
                  ["FedEx Ground", "1–7 business days", "Business", "Full real-time"],
                  ["FedEx Home Delivery", "1–7 business days", "Residential", "Full + evening/weekend"],
                  ["FedEx Ground Economy", "2–7 business days", "Via USPS last mile", "FedEx + USPS"],
                ].map(([svc, time, del, trk]) => (
                  <tr key={svc} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-semibold text-foreground">{svc}</td>
                    <td className="p-4 text-muted-foreground">{time}</td>
                    <td className="p-4 text-muted-foreground">{del}</td>
                    <td className="p-4 text-muted-foreground">{trk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">FedEx Tracking FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-card border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">FedEx Customer Service</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Phone className="h-5 w-5 text-[#FF6600] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">FedEx Customer Support</p>
                <p className="text-xs text-muted-foreground">1-800-463-3339<br />24/7 automated tracking<br />Live agents: 24/7</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Package className="h-5 w-5 text-[#FF6600] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">FedEx Freight</p>
                <p className="text-xs text-muted-foreground">1-866-393-4585<br />Mon–Fri 8am–8pm ET<br />fedexfreight.fedex.com</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Globe className="h-5 w-5 text-[#FF6600] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">Online Tools</p>
                <p className="text-xs text-muted-foreground">fedex.com/tracking<br />FedEx Delivery Manager<br />FedEx Mobile App</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Track Your FedEx Package Now</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Enter your FedEx tracking number — Express, Ground, Home Delivery, or Freight — and get instant real-time delivery updates completely free.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-[#4D148C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3a0f6e] transition-all shadow-lg"
        >
          <Search className="h-5 w-5" />
          Track FedEx Package
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <InternalLinkingHub currentPage="/fedex-tracking" />
    </Layout>
  );
};

export default FedExTrackingPage;

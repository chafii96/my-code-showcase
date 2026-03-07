import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, MapPin, CheckCircle, Truck, AlertTriangle, Globe, Shield, Phone } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const DHLTrackingPage = () => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Track a DHL Package",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Find Your DHL Tracking Number", text: "Locate your DHL tracking number in your shipping confirmation email. DHL Express numbers are 10–11 digits. DHL eCommerce numbers typically start with 'GM' or are 22 digits." },
      { "@type": "HowToStep", name: "Enter the Tracking Number", text: "Type or paste your DHL tracking number into the tracker on this page." },
      { "@type": "HowToStep", name: "View Real-Time Status", text: "See your DHL shipment's current location, customs clearance status, and estimated delivery date instantly." },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DHL Package Tracker",
    url: "https://uspostaltracking.com/dhl-tracking",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free DHL tracking tool. Track DHL Express, DHL eCommerce, and DHL Parcel packages with real-time updates.",
  };

  const statuses = [
    { icon: Package, label: "Shipment Information Received", desc: "DHL has received the shipment data electronically. The physical package has not yet been picked up.", color: "text-blue-400" },
    { icon: Truck, label: "Picked Up", desc: "DHL has collected your package from the sender's location and brought it into the DHL network.", color: "text-blue-600" },
    { icon: MapPin, label: "In Transit", desc: "Your package is moving through the DHL network between processing centers.", color: "text-amber-500" },
    { icon: Globe, label: "Customs Clearance", desc: "Your package is being processed by customs. This is normal for international DHL shipments and can take 1–5 business days.", color: "text-purple-500" },
    { icon: CheckCircle, label: "With Delivery Courier", desc: "Your package is on the final delivery vehicle and will arrive today.", color: "text-green-500" },
    { icon: CheckCircle, label: "Delivered", desc: "Your DHL shipment has been successfully delivered.", color: "text-emerald-600" },
    { icon: AlertTriangle, label: "Delivery Attempted", desc: "DHL attempted delivery but couldn't complete it. Another attempt will be made or you can pick it up at a DHL Service Point.", color: "text-red-500" },
    { icon: Shield, label: "On Hold / Customs Delay", desc: "Your shipment is held pending additional documentation or customs payment. DHL will contact you with instructions.", color: "text-orange-500" },
  ];

  const numberFormats = [
    { service: "DHL Express", format: "10–11 digits (numeric)", example: "1234567890", note: "International express shipping — fastest service" },
    { service: "DHL eCommerce", format: "22 digits or GM prefix", example: "GM9012345678901234567", note: "Domestic parcels via USPS final mile" },
    { service: "DHL Parcel", format: "JD + 16 digits", example: "JD014600006281074471", note: "German/European DHL parcel services" },
    { service: "DHL Freight", format: "9–10 digits", example: "1234567890", note: "Freight and pallet shipments" },
  ];

  const faqs = [
    { q: "How do I track a DHL package?", a: "Enter your DHL tracking number in the tracker above and click Track. You'll instantly see your DHL shipment's current location, status, and estimated delivery date. DHL tracking numbers can be 10–22 characters long depending on the service type." },
    { q: "What does 'DHL with tracking' mean?", a: "'DHL with tracking' means your shipment includes full DHL tracking capability — you can monitor it from pickup to delivery. Not all DHL services include tracking; budget options may have limited or no tracking. Most DHL Express and DHL eCommerce shipments include full tracking." },
    { q: "How long does DHL take to deliver?", a: "DHL Express typically delivers in 1–5 business days internationally, and 1–3 days domestically. DHL eCommerce takes 2–8 business days. DHL Freight transit times vary by route and service level selected." },
    { q: "My DHL tracking number isn't working — why?", a: "New DHL tracking numbers can take up to 24 hours to activate in the system after the label is created. If tracking still doesn't work after 24 hours, verify you have the correct tracking number (no extra spaces or missing digits) and try again. Contact DHL at 1-800-225-5345 if the problem persists." },
    { q: "What does 'Shipment on hold' mean in DHL tracking?", a: "Your DHL shipment is temporarily stopped, usually due to customs issues, required documentation, duty payment, or an address problem. DHL will email or call you with specific instructions. Act quickly since delays can affect your delivery date." },
    { q: "How do I track DHL eCommerce packages?", a: "DHL eCommerce (formerly DHL Global Mail) packages often have tracking numbers starting with 'GM' or 22-digit numbers. Use the tracker above and enter your full tracking number including any prefix letters. Note that DHL eCommerce uses USPS for final-mile delivery in the US, so your tracking may transfer to USPS near the end." },
    { q: "Does DHL deliver on Saturday and Sunday?", a: "DHL Express delivers on Saturdays in most US cities. Sunday delivery is not available for DHL Express. DHL eCommerce uses USPS for final-mile delivery, which does operate on Sundays in many areas." },
    { q: "What is the difference between DHL Express and DHL eCommerce?", a: "DHL Express is DHL's premium international courier service — fast (1–5 days), expensive, with full real-time tracking. DHL eCommerce is a budget international shipping service that uses local postal carriers (like USPS in the US) for final delivery — slower (2–12 days) but much cheaper for lightweight packages." },
  ];

  return (
    <Layout>
      <SEOHead
        title="DHL Tracking — Track DHL Package by Tracking Number Free | Real-Time"
        description="Track DHL packages free with real-time updates. Enter your DHL tracking number to see current location, delivery status, and ETA. Supports DHL Express, DHL eCommerce & DHL Parcel tracking."
        canonical="/dhl-tracking"
        keywords="dhl tracking, dhl tracking number, track dhl package, dhl package tracker, dhl with tracking, dhl tracking by tracking number, track dhl tracking, dhl be tracking, dhl express tracking, dhl ecommerce tracking, dhl shipment tracking, dhl parcel tracking, dhl delivery tracking, dhl track my package"
        structuredData={[howToSchema, appSchema]}
      />

      <section className="bg-gradient-to-br from-yellow-400 via-yellow-400 to-yellow-500 py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-black/10 border border-black/15 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-yellow-900" />
            <span className="text-xs font-semibold text-yellow-900 uppercase tracking-wide">DHL Package Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight text-yellow-950">
            DHL Tracking
          </h1>
          <p className="text-xl text-yellow-900 max-w-2xl mx-auto mb-2">
            Track any DHL package instantly — Express, eCommerce, and Parcel.
          </p>
          <p className="text-sm text-yellow-800 max-w-xl mx-auto mb-8">
            Enter your DHL tracking number for real-time location updates, customs status, and estimated delivery date.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Search className="h-5 w-5" />
            Track DHL Package
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-xs text-yellow-800 mt-4">Free · No registration · Instant results · All DHL services</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">What is DHL Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>DHL tracking</strong> lets you monitor your DHL shipment from the moment it's picked up until it's delivered to your door. DHL (Dalsey, Hillblom, and Lynn) is one of the world's largest international courier, parcel, and express mail service companies, operating in over 220 countries and territories. Whether you're expecting a package from Germany, China, the UK, or a domestic US shipment, <strong>DHL tracking by tracking number</strong> gives you complete visibility into your delivery.
          </p>
          <p>
            When you send or receive a package with DHL, a unique <strong>DHL tracking number</strong> is assigned to your shipment. This number lets you use our free <strong>DHL package tracker</strong> to see real-time scan events as your package moves through DHL's global network — from the sender's warehouse, through international hubs, customs clearance, into the destination country, and finally onto the delivery vehicle.
          </p>
          <p>
            DHL operates several distinct services in the United States, each with different tracking capabilities and delivery timelines. <strong>DHL Express</strong> is the fastest and most feature-rich service, offering door-to-door delivery in as little as 1–3 business days with full real-time tracking. <strong>DHL eCommerce</strong> is designed for high-volume online retailers, using USPS for last-mile delivery within the US. <strong>DHL Freight</strong> handles larger freight shipments with full tracking capability.
          </p>
          <p>
            Our free <strong>DHL tracking tool</strong> supports all major DHL service types — simply enter your tracking number regardless of whether it starts with letters or is purely numeric, and get instant results showing your shipment's current status, GPS-level location data where available, customs clearance updates, and the most recent estimated delivery date.
          </p>
          <p>
            <strong>DHL with tracking</strong> is different from standard DHL economy services, which may offer limited scan events. Full DHL tracking gives you 8–15 scan events covering every major milestone in your package's journey, making it easy to know exactly when to expect your delivery.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">DHL Tracking Number Formats</h2>
          <p className="text-muted-foreground mb-6">DHL uses different tracking number formats depending on the service type. Enter any of these formats in our tracker:</p>
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <p className="text-sm text-blue-800"><strong>Tip:</strong> Your DHL tracking number is in your shipping confirmation email. Copy and paste it exactly — including any letter prefixes — for the most accurate results.</p>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">DHL Tracking Status Messages Explained</h2>
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
          <h2 className="text-3xl font-bold text-foreground mb-6">DHL Delivery Times by Service</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-xl overflow-hidden bg-card">
              <thead className="bg-yellow-400">
                <tr>
                  <th className="p-4 text-left font-bold text-yellow-950">DHL Service</th>
                  <th className="p-4 text-left font-bold text-yellow-950">Domestic US</th>
                  <th className="p-4 text-left font-bold text-yellow-950">International</th>
                  <th className="p-4 text-left font-bold text-yellow-950">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["DHL Express", "1–3 business days", "1–5 business days", "Full real-time"],
                  ["DHL eCommerce", "2–8 business days", "7–14 business days", "Full + USPS handoff"],
                  ["DHL Parcel", "2–5 business days", "N/A (EU focused)", "Full real-time"],
                  ["DHL Freight", "1–5 business days", "Variable by route", "Full real-time"],
                  ["DHL Global Mail", "7–14 business days", "10–30 business days", "Limited milestones"],
                ].map(([svc, dom, intl, trk]) => (
                  <tr key={svc} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-semibold text-foreground">{svc}</td>
                    <td className="p-4 text-muted-foreground">{dom}</td>
                    <td className="p-4 text-muted-foreground">{intl}</td>
                    <td className="p-4 text-muted-foreground">{trk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">DHL Tracking FAQ</h2>
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
          <h2 className="text-2xl font-bold text-foreground mb-4">DHL Customer Service</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Phone className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">DHL Express US</p>
                <p className="text-xs text-muted-foreground">1-800-225-5345<br />Mon–Fri 8am–8pm ET<br />Sat 8am–5pm ET</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Package className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">DHL eCommerce</p>
                <p className="text-xs text-muted-foreground">1-800-805-9306<br />Mon–Fri 9am–6pm ET<br />ecommerce.dhl.com</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Globe className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">Online Tools</p>
                <p className="text-xs text-muted-foreground">dhl.com/en/express/tracking.html<br />Live chat available<br />My DHL+ account portal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Track Your DHL Package Now</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Enter your DHL tracking number — Express, eCommerce, Parcel, or Freight — and get instant real-time delivery updates completely free.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-yellow-400 text-yellow-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all shadow-lg"
        >
          <Search className="h-5 w-5" />
          Track DHL Package
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <InternalLinkingHub currentPage="/dhl-tracking" />
    </Layout>
  );
};

export default DHLTrackingPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, MapPin, CheckCircle, Truck, AlertTriangle, Globe, Shield, Phone } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const UPSTrackingPage = () => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Track a UPS Package",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Find Your UPS Tracking Number", text: "Locate your UPS tracking number in your shipping confirmation email. UPS tracking numbers start with '1Z' followed by 16 alphanumeric characters." },
      { "@type": "HowToStep", name: "Enter the Tracking Number", text: "Type or paste your UPS tracking number into the tracker on this page." },
      { "@type": "HowToStep", name: "View Real-Time Status", text: "See your UPS shipment's current location, delivery date, and scan history instantly." },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "UPS Package Tracker",
    url: "https://uspostaltracking.com/ups-tracking",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free UPS tracking tool. Track UPS Ground, Air, and international packages with real-time delivery updates.",
  };

  const statuses = [
    { icon: Package, label: "Order Processed", desc: "UPS has received the shipment data. The physical package has not been picked up from the shipper yet.", color: "text-blue-400" },
    { icon: Truck, label: "Origin Scan", desc: "UPS has picked up your package and completed the first scan at the origin facility.", color: "text-blue-600" },
    { icon: MapPin, label: "In Transit", desc: "Your package is moving through UPS facilities on its way to the destination.", color: "text-amber-500" },
    { icon: Globe, label: "Export Scan / Import Scan", desc: "Your package has been processed for international export or has cleared customs in the destination country.", color: "text-purple-500" },
    { icon: Truck, label: "Out for Delivery", desc: "Your package is on the UPS driver's vehicle and will be delivered today.", color: "text-green-400" },
    { icon: CheckCircle, label: "Delivered", desc: "Your UPS package has been successfully delivered to the recipient or a designated location.", color: "text-emerald-600" },
    { icon: AlertTriangle, label: "Delivery Attempt – No Access", desc: "UPS attempted delivery but could not access the delivery location. A UPS InfoNotice has been left.", color: "text-red-500" },
    { icon: Shield, label: "On Hold / Exception", desc: "Your package is being held due to an exception such as address correction, weather, or a required signature.", color: "text-orange-500" },
  ];

  const numberFormats = [
    { service: "UPS Ground / Air (Standard)", format: "1Z + 16 characters", example: "1Z999AA10123456784", note: "Most common UPS format — starts with 1Z followed by shipper number and package ID" },
    { service: "UPS Mail Innovations", format: "22 digits", example: "9270199900000000000001", note: "Starts with 92 — last mile delivered by USPS" },
    { service: "UPS SurePost", format: "22 digits", example: "9274899999999990001231", note: "Starts with 92 or 93 — USPS last-mile delivery" },
    { service: "UPS Freight", format: "9–11 digits", example: "01234567890", note: "PRO number used for UPS Freight and LTL shipments" },
    { service: "UPS Simple Rate", format: "1Z + 16 characters", example: "1ZXXXXXXXXXXXXXXXX", note: "Uses the same 1Z format, service level differs" },
    { service: "UPS Access Point", format: "1Z + 16 characters", example: "1ZABC1230101234567", note: "Standard 1Z number — package held at UPS Access Point" },
  ];

  const faqs = [
    { q: "What does a UPS tracking number look like?", a: "Standard UPS tracking numbers start with '1Z' followed by 6-character shipper account number, 2-digit service code, 8-digit package identifier, and 1 check digit — totaling 18 characters. Example: 1Z999AA10123456784. UPS SurePost and Mail Innovations packages use 22-digit numbers starting with 92 or 93." },
    { q: "Why is my UPS package stuck 'In Transit'?", a: "UPS packages showing 'In Transit' for more than 5 business days may be delayed due to weather, high volume, or a service exception. Check for any exception notices on the tracking page. For high-value shipments, you can file a UPS claim after 24 hours past the expected delivery date." },
    { q: "What time does UPS deliver packages?", a: "UPS Ground and Home typically delivers between 9 AM and 7 PM on business days. UPS Air (Next Day Air, 2nd Day Air) usually arrives by 10:30 AM or noon depending on the service level chosen by the shipper. UPS My Choice members can get a 4-hour delivery window." },
    { q: "Can I change my UPS delivery address?", a: "Yes — if you're a UPS My Choice member, you can redirect packages to a different address, a UPS Access Point, or hold at a UPS facility. Changes must be made before the package is out for delivery. Contact UPS at 1-800-742-5877 for assistance." },
    { q: "What is a UPS Access Point?", a: "A UPS Access Point is a convenient drop-off and pickup location at local businesses like The UPS Store, Michaels, or CVS. If you missed a delivery, UPS may redirect your package to a nearby Access Point where you can pick it up with a valid ID within 7 calendar days." },
    { q: "How do I track a UPS SurePost package?", a: "UPS SurePost (now UPS Ground Saver) uses UPS for the main transit and USPS for final delivery. You can track it with your UPS 1Z tracking number through most of the journey. Once handed to USPS, you can use the corresponding USPS tracking number found on the UPS tracking page." },
    { q: "What does UPS 'Exception' status mean?", a: "A UPS 'Exception' means something unexpected occurred — like an address correction needed, weather delay, customs hold, or refused delivery. The exception details on the tracking page explain the issue and what action is required." },
  ];

  return (
    <Layout>
      <SEOHead
        title="UPS Tracking — Track Your UPS Package in Real Time"
        description="Track your UPS package instantly. Free UPS tracking tool for Ground, Air, and international shipments. Real-time delivery status, location updates, and estimated delivery date."
        canonical="https://uspostaltracking.com/ups-tracking"
        keywords="ups tracking, track ups package, ups package tracker, ups delivery status, ups ground tracking, ups 1z tracking, ups shipment tracking, ups tracking number, track ups shipment"
        schema={[howToSchema, appSchema]}
      />

      <section className="bg-gradient-to-br from-[#351C15] via-[#5c3317] to-[#351C15] text-white py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Truck className="h-4 w-4" />
            UPS Package Tracker
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            UPS Tracking
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-4">
            Track any UPS package instantly — Ground, Air, SurePost, and Freight.
          </p>
          <p className="text-sm text-white/80 max-w-xl mx-auto mb-8">
            Enter your UPS tracking number (starting with 1Z) for real-time location updates and estimated delivery date.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-[#FFB500] text-[#351C15] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e6a300] transition-all shadow-lg hover:shadow-xl"
          >
            <Search className="h-5 w-5" />
            Track UPS Package
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-xs text-white/70 mt-4">Free · No registration · Instant results · All UPS services</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">What is UPS Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>UPS tracking</strong> lets you monitor your UPS shipment from pickup through every transit hub to final delivery. UPS (United Parcel Service) is one of the world's largest package delivery companies, handling over 24 million packages per day across more than 220 countries and territories. Whether you're tracking a 1Z Ground package or an international Air freight shipment, <strong>UPS tracking by tracking number</strong> gives you complete real-time visibility.
          </p>
          <p>
            Every UPS shipment is assigned a unique tracking number — most starting with <strong>1Z</strong>. This number powers our free <strong>UPS package tracker</strong>, showing you scan events at every facility your package passes through — from the initial pickup scan, through UPS sorting hubs, onto the delivery vehicle, and to your door.
          </p>
          <p>
            UPS offers multiple service levels. <strong>UPS Next Day Air</strong> guarantees overnight delivery by 10:30 AM or noon. <strong>UPS 2nd Day Air</strong> delivers in 2 business days. <strong>UPS Ground</strong> provides 1–7 business day delivery across the US at lower cost. <strong>UPS SurePost</strong> (now UPS Ground Saver) uses USPS for the final mile, ideal for lightweight residential packages.
          </p>
          <p>
            Our free <strong>UPS tracking tool</strong> supports all UPS service types and tracking number formats. Enter your 18-character 1Z number or 22-digit SurePost number and get instant results including current location, scan history, and estimated delivery window.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">UPS Tracking Number Formats</h2>
          <p className="text-muted-foreground mb-6">UPS uses different tracking number formats depending on the service type. Enter any of these formats in our tracker:</p>
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
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
            <p className="text-sm text-amber-800"><strong>Tip:</strong> Your UPS tracking number is in your shipping confirmation email or on the shipping label receipt. Copy it exactly — most UPS tracking numbers start with 1Z.</p>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">UPS Tracking Status Messages Explained</h2>
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
          <h2 className="text-3xl font-bold text-foreground mb-6">UPS Delivery Times by Service</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-xl overflow-hidden bg-card">
              <thead className="bg-[#351C15]">
                <tr>
                  <th className="p-4 text-left font-bold text-white">UPS Service</th>
                  <th className="p-4 text-left font-bold text-white">Transit Time</th>
                  <th className="p-4 text-left font-bold text-white">Delivery By</th>
                  <th className="p-4 text-left font-bold text-white">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["UPS Next Day Air Early", "Next business day", "By 8 AM", "Full real-time"],
                  ["UPS Next Day Air", "Next business day", "By 10:30 AM", "Full real-time"],
                  ["UPS Next Day Air Saver", "Next business day", "By 3 PM", "Full real-time"],
                  ["UPS 2nd Day Air A.M.", "2 business days", "By 10:30 AM", "Full real-time"],
                  ["UPS 2nd Day Air", "2 business days", "By end of day", "Full real-time"],
                  ["UPS 3 Day Select", "3 business days", "By end of day", "Full real-time"],
                  ["UPS Ground", "1–7 business days", "By 7 PM", "Full real-time"],
                  ["UPS Ground Saver", "2–7 business days", "Via USPS", "UPS + USPS"],
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
        <h2 className="text-3xl font-bold text-foreground mb-6">UPS Tracking FAQ</h2>
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
          <h2 className="text-2xl font-bold text-foreground mb-4">UPS Customer Service</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Phone className="h-5 w-5 text-[#FFB500] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">UPS Customer Support</p>
                <p className="text-xs text-muted-foreground">1-800-742-5877<br />24/7 automated tracking<br />Live agents: Mon–Fri 8am–8pm ET</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Package className="h-5 w-5 text-[#FFB500] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">UPS Freight</p>
                <p className="text-xs text-muted-foreground">1-800-333-7400<br />Mon–Fri 8am–6pm ET<br />ltl.upsfreight.com</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Globe className="h-5 w-5 text-[#FFB500] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">Online Tools</p>
                <p className="text-xs text-muted-foreground">ups.com/track<br />UPS My Choice<br />UPS Mobile App</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Track Your UPS Package Now</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Enter your UPS tracking number — Ground, Air, SurePost, or Freight — and get instant real-time delivery updates completely free.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-[#351C15] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#4a2820] transition-all shadow-lg"
        >
          <Search className="h-5 w-5" />
          Track UPS Package
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <InternalLinkingHub currentPage="/ups-tracking" />
    </Layout>
  );
};

export default UPSTrackingPage;

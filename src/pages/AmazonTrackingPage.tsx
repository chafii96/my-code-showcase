import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, MapPin, CheckCircle, Truck, AlertTriangle, Phone, Globe, ShoppingCart } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const AmazonTrackingPage = () => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Track an Amazon Package",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Find Your Amazon Tracking Number or Order ID", text: "Go to Amazon.com → Account & Lists → Returns & Orders. Find your order and click 'Track Package'. Your tracking number or order ID is shown there." },
      { "@type": "HowToStep", name: "Enter the Tracking Number", text: "Copy your Amazon tracking number (or TBA number) and paste it into the tracker on this page." },
      { "@type": "HowToStep", name: "Get Real-Time Updates", text: "See your Amazon package location, current status, and updated delivery estimate instantly." },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Amazon Package Tracker",
    url: "https://uspostaltracking.com/amazon-tracking",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free Amazon package tracking. Track Amazon orders by tracking number or TBA number in real time.",
  };

  const statuses = [
    { icon: ShoppingCart, label: "Order Placed / Label Created", desc: "Amazon has created a shipping label for your order. The package may not have been physically picked up yet.", color: "text-blue-400" },
    { icon: Package, label: "Package Accepted / Picked Up", desc: "Amazon Logistics or the carrier has scanned and accepted your package into their delivery network.", color: "text-blue-600" },
    { icon: Truck, label: "In Transit", desc: "Your Amazon package is moving through the delivery network toward your address.", color: "text-amber-500" },
    { icon: MapPin, label: "Out for Delivery", desc: "Your package is on the delivery vehicle and will arrive today. Amazon typically provides a 4-hour delivery window.", color: "text-green-500" },
    { icon: CheckCircle, label: "Delivered", desc: "Your Amazon package has been delivered. Check your door, garage, or designated safe place.", color: "text-emerald-600" },
    { icon: AlertTriangle, label: "Delivery Attempted", desc: "The carrier attempted delivery but couldn't complete it. Another attempt will be made the next business day.", color: "text-red-500" },
    { icon: AlertTriangle, label: "Delayed", desc: "Your package is experiencing a delay in transit. Amazon will update the estimated delivery date automatically.", color: "text-orange-500" },
    { icon: Package, label: "Delivered to Agent", desc: "Your package was delivered to a leasing office, neighbor, Amazon Hub Locker, or other designated agent.", color: "text-purple-500" },
  ];

  const carriers = [
    { name: "Amazon Logistics (AMZL)", id: "TBA", desc: "Amazon's own delivery fleet. Tracking numbers start with 'TBA' followed by 12 digits.", coverage: "Major US metros and suburbs" },
    { name: "USPS", id: "9400...", desc: "US Postal Service delivers many Amazon packages for final-mile, especially rural areas. 22-digit tracking number.", coverage: "All 50 states" },
    { name: "UPS", id: "1Z...", desc: "United Parcel Service handles many Amazon Prime and Amazon Business shipments.", coverage: "All 50 states" },
    { name: "FedEx", id: "Variable", desc: "FedEx handles some Amazon deliveries, particularly for Amazon Business and large items.", coverage: "All 50 states" },
    { name: "OnTrac / LaserShip", id: "1LS...", desc: "Regional carrier used for Amazon deliveries in Eastern US and West Coast markets.", coverage: "30+ states" },
    { name: "DHL eCommerce", id: "GM...", desc: "Used for some Amazon international orders entering the US.", coverage: "International to US" },
  ];

  const faqs = [
    { q: "How do I track my Amazon package?", a: "Go to Amazon.com → Returns & Orders → find your order → click Track Package. You can also enter your Amazon tracking number (or TBA number) directly into the tracker on this page. Amazon tracking numbers start with 'TBA' for Amazon Logistics, or are standard carrier tracking numbers (starting with '1Z' for UPS, '9400' for USPS, etc.)." },
    { q: "What is an Amazon tracking ID?", a: "An Amazon tracking ID (also called a tracking number) is a unique code assigned to your shipment that lets you track it through the delivery process. For Amazon Logistics deliveries, this is a 'TBA' number (e.g., TBA123456789000). For third-party carriers, it's the carrier's standard tracking number format." },
    { q: "Why isn't my Amazon tracking updating?", a: "Amazon tracking can lag by 1–6 hours between scan events. If your tracking hasn't updated in over 24 hours, your package may still be in transit between scan points. Check the 'Map Tracking' feature on the Amazon app on the day of delivery for real-time driver location. If the delivery date has passed without delivery, contact Amazon customer service." },
    { q: "What does 'TBA' mean in Amazon tracking?", a: "'TBA' stands for 'Tracking By Amazon' and indicates your package is being delivered by Amazon Logistics (AMZL), Amazon's own delivery network. TBA tracking numbers are 15 characters long: TBA + 12 digits. These can be tracked on this page or directly through the Amazon app." },
    { q: "My Amazon package shows delivered but I didn't receive it — what do I do?", a: "Wait 24 hours in case the scan was premature. Check with neighbors, your building's mail area, or any safe spots the driver might have chosen. If still not found after 24 hours, go to Amazon → Contact Us → an order issue → 'Package didn't arrive' to get a replacement or refund. Amazon's A-to-Z Guarantee covers most lost packages." },
    { q: "How do I track an Amazon package without a tracking number?", a: "You can track Amazon packages directly from your Amazon account under Returns & Orders — no separate tracking number needed. Just click 'Track Package' next to your order. If you're tracking a gift or someone else's order, you'll need the tracking number from the shipping confirmation email." },
    { q: "Does Amazon deliver on Sundays?", a: "Yes! Amazon Prime delivers on Sundays in most US areas through Amazon Logistics and USPS Sunday delivery. If your Prime order is placed by Friday night, you often have the option for Sunday delivery." },
    { q: "How early and late does Amazon deliver?", a: "Amazon Logistics typically delivers between 8 AM and 10 PM local time. USPS and UPS deliveries follow their standard hours (8 AM–8 PM). Amazon may deliver as late as 10 PM for high-demand days like Prime Day or the holiday season." },
  ];

  return (
    <Layout>
      <SEOHead
        title="Amazon Tracking — Track Amazon Package by Tracking Number Free | Real-Time"
        description="Track Amazon packages free with real-time updates. Enter your Amazon tracking number or TBA number for instant delivery status and location. Supports Amazon Logistics, USPS, UPS & FedEx Amazon orders."
        canonical="/amazon-tracking"
        keywords="amazon tracking, amazon tracking number, amazon tracking id, track amazon package, amazon package tracking, tracking id amazon, amazon order tracking, amazon logistics tracking, tba tracking amazon, amazon shipment tracking, amazon delivery tracking, track my amazon package, amazon package tracker"
        structuredData={[howToSchema, appSchema]}
      />

      <section className="bg-gradient-to-br from-[#232F3E] via-[#37475A] to-[#232F3E] text-white py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF9900]/20 border border-[#FF9900]/30 rounded-full px-4 py-2 mb-6">
            <ShoppingCart className="h-4 w-4 text-[#FF9900]" />
            <span className="text-xs font-semibold text-[#FF9900] uppercase tracking-wide">Amazon Package Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            Amazon Tracking
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-2">
            Track any Amazon package instantly — AMZL, USPS, UPS, and FedEx.
          </p>
          <p className="text-sm text-white/60 max-w-xl mx-auto mb-8">
            Enter your Amazon tracking number or TBA number to get real-time delivery updates, package location, and estimated delivery date.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-[#FF9900] text-[#232F3E] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FF9900]/90 transition-all shadow-lg hover:shadow-xl"
          >
            <Search className="h-5 w-5" />
            Track Amazon Package
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-xs text-white/50 mt-4">Free · No login required · Instant results</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">What is Amazon Package Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>Amazon package tracking</strong> lets you follow your Amazon order from the moment it leaves the warehouse until it arrives at your door. When you place an order on Amazon, the package gets a unique <strong>Amazon tracking number</strong> — this lets you monitor every step of the delivery process in real time.
          </p>
          <p>
            Amazon uses multiple carriers to deliver packages across the United States, including its own delivery network (<strong>Amazon Logistics</strong>, identified by "TBA" tracking numbers), USPS, UPS, FedEx, and regional carriers like LaserShip and OnTrac. The carrier used for your order depends on your location, the item, delivery speed selected, and Amazon's capacity at the time of shipment.
          </p>
          <p>
            Our free <strong>Amazon tracking</strong> tool supports all Amazon carrier types. Whether your tracking number starts with "TBA" (Amazon Logistics), "1Z" (UPS), "9400" (USPS), or another format, just enter it above for instant status updates. You'll see your package's current location, the latest scan event, and the estimated delivery date.
          </p>
          <p>
            <strong>Amazon tracking IDs</strong> are assigned automatically when Amazon creates your shipping label. Amazon Prime customers get priority tracking with more frequent scan events and, on the day of delivery, a live map feature in the Amazon app showing the driver's real-time location. For standard (non-Prime) orders, tracking updates occur at key milestones: acceptance, regional hub arrival, local facility arrival, out for delivery, and delivered.
          </p>
          <p>
            If you're expecting multiple items in one order, note that Amazon often ships from multiple warehouses — each shipment gets its own tracking number. Check your "Returns & Orders" page to see all tracking numbers for a single order.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">Amazon Tracking Number Formats by Carrier</h2>
          <p className="text-muted-foreground mb-6">Amazon uses different carriers — each has a distinct tracking number format. Our tracker supports all of them:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {carriers.map((c) => (
              <div key={c.name} className="bg-card border rounded-xl p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-foreground text-sm">{c.name}</h3>
                  <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">{c.id}</code>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{c.desc}</p>
                <p className="text-xs text-muted-foreground"><span className="font-medium">Coverage:</span> {c.coverage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">Amazon Tracking Status Meanings</h2>
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
          <h2 className="text-3xl font-bold text-foreground mb-6">Amazon Delivery Times</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Same-Day", time: "2–5 hours", note: "Prime members in select cities", color: "border-green-300 bg-green-50" },
              { label: "Next Day", time: "1 business day", note: "Prime Next Day Delivery", color: "border-blue-300 bg-blue-50" },
              { label: "Prime 2-Day", time: "2 business days", note: "Standard Amazon Prime", color: "border-purple-300 bg-purple-50" },
              { label: "Standard", time: "4–8 business days", note: "Free shipping for all", color: "border-gray-300 bg-gray-50" },
            ].map((d) => (
              <div key={d.label} className={`border-2 rounded-xl p-4 text-center ${d.color}`}>
                <Clock className="h-6 w-6 mx-auto mb-2 text-foreground/60" />
                <div className="font-black text-foreground">{d.label}</div>
                <div className="text-sm font-semibold text-foreground my-1">{d.time}</div>
                <p className="text-xs text-muted-foreground">{d.note}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#FF9900]/10 border border-[#FF9900]/30 rounded-xl p-4">
            <p className="text-sm text-foreground"><strong>Prime Delivery Guarantee:</strong> If Amazon Prime guarantees a delivery date and the package doesn't arrive on time, you may be eligible for a free month of Prime or a $5–$10 promotional credit. Contact Amazon customer service if this happens.</p>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">Amazon Package Tracking FAQ</h2>
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
          <h2 className="text-2xl font-bold text-foreground mb-4">Amazon Customer Service for Tracking Issues</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Phone className="h-5 w-5 text-[#FF9900] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">Amazon Phone Support</p>
                <p className="text-xs text-muted-foreground">1-888-280-4331<br />Available 24/7<br />Say "track my package"</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Globe className="h-5 w-5 text-[#FF9900] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">Live Chat & Email</p>
                <p className="text-xs text-muted-foreground">amazon.com/contact-us<br />Live chat 24/7<br />Usually fastest option</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <ShoppingCart className="h-5 w-5 text-[#FF9900] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">Missing Package Claim</p>
                <p className="text-xs text-muted-foreground">Account → Returns & Orders<br />→ Contact Seller<br />A-to-Z Guarantee applies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Track Your Amazon Package Now</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Enter your Amazon tracking number, TBA number, or order ID to get instant real-time delivery updates — completely free, no login required.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-[#FF9900] text-[#232F3E] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FF9900]/90 transition-all shadow-lg"
        >
          <Search className="h-5 w-5" />
          Track Amazon Package
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <InternalLinkingHub currentPage="/amazon-tracking" />
    </Layout>
  );
};

export default AmazonTrackingPage;

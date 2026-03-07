import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, MapPin, CheckCircle, Truck, AlertTriangle, Phone, Globe } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";

const LaserShipTrackingPage = () => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Track a LaserShip Package",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Find Your LaserShip Tracking Number", text: "Locate your LaserShip tracking number in your shipping confirmation email or Amazon order details. It typically starts with '1LS' followed by 18 digits." },
      { "@type": "HowToStep", name: "Enter the Tracking Number", text: "Type or paste your LaserShip tracking number into the tracking search box on this page and click Track." },
      { "@type": "HowToStep", name: "View Real-Time Status", text: "Instantly see your LaserShip package location, estimated delivery date, and full delivery history." },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "LaserShip Package Tracker",
    url: "https://uspostaltracking.com/lasership-tracking",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free LaserShip tracking tool. Track LaserShip packages by tracking number with real-time updates and delivery estimates.",
  };

  const statuses = [
    { icon: Package, label: "Order Received", desc: "LaserShip has received the shipment data from the retailer and is preparing to pick up your package.", color: "text-blue-500" },
    { icon: Truck, label: "Package Picked Up", desc: "Your package has been collected from the retailer's warehouse and is now in the LaserShip network.", color: "text-indigo-500" },
    { icon: MapPin, label: "In Transit", desc: "Your package is moving between LaserShip facilities toward your delivery address.", color: "text-amber-500" },
    { icon: Truck, label: "Out for Delivery", desc: "Your package is on a LaserShip delivery vehicle and will be delivered today.", color: "text-green-500" },
    { icon: CheckCircle, label: "Delivered", desc: "Your package has been delivered. Check your door, mailbox, or ask neighbors if you can't find it.", color: "text-emerald-600" },
    { icon: AlertTriangle, label: "Delivery Attempted", desc: "LaserShip attempted delivery but was unable to complete it. A new attempt will be made the next business day.", color: "text-red-500" },
  ];

  const deliveryZones = [
    { state: "New York", cities: "NYC, Buffalo, Albany, Rochester" },
    { state: "New Jersey", cities: "Newark, Jersey City, Trenton, Camden" },
    { state: "Massachusetts", cities: "Boston, Worcester, Springfield" },
    { state: "Pennsylvania", cities: "Philadelphia, Pittsburgh, Allentown" },
    { state: "Florida", cities: "Miami, Orlando, Tampa, Jacksonville" },
    { state: "Virginia", cities: "Richmond, Norfolk, Arlington" },
    { state: "Maryland", cities: "Baltimore, Rockville, Frederick" },
    { state: "Connecticut", cities: "Hartford, New Haven, Bridgeport" },
    { state: "Georgia", cities: "Atlanta, Savannah, Augusta" },
    { state: "Texas", cities: "Dallas, Houston, Austin, San Antonio" },
    { state: "Ohio", cities: "Columbus, Cleveland, Cincinnati" },
    { state: "Illinois", cities: "Chicago, Aurora, Naperville" },
  ];

  const faqs = [
    { q: "What is LaserShip tracking?", a: "LaserShip tracking allows you to monitor your package's journey from pickup to delivery in real time. Each LaserShip shipment gets a unique tracking number that lets you see exactly where your package is at any given moment." },
    { q: "How long does LaserShip take to deliver?", a: "LaserShip typically delivers within 1–3 business days for most shipments on the East Coast. Same-day and next-day delivery is available in select metro areas like New York, Boston, Washington D.C., and Philadelphia." },
    { q: "Is LaserShip the same as OnTrac?", a: "Yes — LaserShip and OnTrac merged in 2022 and now operate as a single company under the OnTrac brand in some markets. LaserShip continues to operate under its original name in eastern US markets. Your tracking number works the same way regardless of which name you see." },
    { q: "My LaserShip tracking isn't updating — what should I do?", a: "Tracking updates can lag by 2–4 hours. If your tracking hasn't updated in over 24 hours, contact the retailer first (Amazon, Target, etc.) since they manage the shipping relationship. You can also call LaserShip customer service at 1-804-414-2590." },
    { q: "What does 'Delivery Attempted' mean on LaserShip?", a: "LaserShip attempted to deliver your package but couldn't complete the delivery — usually because no one was home to sign, or the address was inaccessible. LaserShip will typically re-attempt delivery the next business day." },
    { q: "Does LaserShip deliver on weekends?", a: "Yes! LaserShip delivers 7 days a week including Saturdays and Sundays in most service areas. This is one of LaserShip's advantages over USPS and traditional carriers." },
    { q: "Can I reschedule a LaserShip delivery?", a: "Contact LaserShip directly at 1-804-414-2590 or through their website. You can also contact the original retailer (like Amazon) to reschedule or redirect your delivery." },
  ];

  return (
    <Layout>
      <SEOHead
        title="LaserShip Tracking — Track LaserShip Packages Free | Real-Time Updates"
        description="Track LaserShip packages free with real-time updates. Enter your LaserShip tracking number for instant delivery status, location, and estimated delivery date. LaserShip package tracker tool."
        canonical="/lasership-tracking"
        keywords="lasership tracking, lasership tracking number, track lasership package, lasership package tracker, lasership delivery tracking, lasership shipment tracking, lasership tracking by number, lasership shipping tracker, lasership track my package, lasership tracking status"
        structuredData={[howToSchema, appSchema]}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <Truck className="h-4 w-4 text-yellow-300" />
            <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wide">LaserShip Package Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            LaserShip Tracking
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-2">
            Track any LaserShip package instantly — free, no account required.
          </p>
          <p className="text-sm text-primary-foreground/60 max-w-xl mx-auto mb-8">
            Enter your LaserShip tracking number to get real-time delivery updates, package location, and estimated delivery date.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
          >
            <Search className="h-5 w-5" />
            Track LaserShip Package
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-xs text-primary-foreground/50 mt-4">Free · No registration · Instant results</p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">What is LaserShip Tracking?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            <strong>LaserShip tracking</strong> is a real-time package monitoring service that lets you follow your shipment from the moment it leaves the retailer's warehouse until it lands at your door. LaserShip — one of the largest regional last-mile carriers in the United States — serves over 30 states primarily on the East Coast and Midwest, handling millions of packages per year for major retailers like Amazon, Target, Walmart, and Gap.
          </p>
          <p>
            When you order from an online retailer that ships with LaserShip, you receive a unique <strong>LaserShip tracking number</strong> in your shipping confirmation email. This tracking number lets you use our free <strong>LaserShip package tracker</strong> to see exactly where your package is at any moment — whether it's at a sorting facility, loaded onto a delivery truck, or sitting on your front porch.
          </p>
          <p>
            LaserShip's tracking system updates in near real-time as your package moves through scan points at warehouses, distribution centers, and delivery vehicles. Most customers see 4–8 tracking events from pickup to delivery, giving you a complete picture of your package's journey.
          </p>
          <p>
            In 2022, LaserShip merged with OnTrac (a West Coast carrier) to form one of the largest alternative delivery networks in the country. If you're on the East Coast, you'll still see the LaserShip name and use LaserShip tracking numbers. West Coast customers may see OnTrac branding. Both networks share the same tracking infrastructure, so your <strong>LaserShip tracking number</strong> format remains consistent.
          </p>
          <p>
            Our free <strong>LaserShip tracking tool</strong> gives you instant access to the same tracking data that retailers use to monitor their shipments. No account is required — just enter your tracking number and get results in seconds.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">LaserShip Tracking Number Format</h2>
          <div className="bg-card border rounded-xl p-6 mb-6">
            <h3 className="font-bold text-foreground mb-4 text-lg">How to Identify Your LaserShip Tracking Number</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-3">LaserShip tracking numbers come in two common formats:</p>
                <div className="space-y-3">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Format 1 (Most Common)</p>
                    <code className="text-primary font-mono text-sm">1LS123456789ABCDEF</code>
                    <p className="text-xs text-muted-foreground mt-1">Starts with "1LS" + 15 alphanumeric characters</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Format 2 (Numeric Only)</p>
                    <code className="text-primary font-mono text-sm">LSO0012345678901234</code>
                    <p className="text-xs text-muted-foreground mt-1">Starts with "LSO" + 16 digits</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-3">Where to find your tracking number:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Shipping confirmation email from the retailer</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Amazon order details page under "Track Package"</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Retailer's "My Orders" or "Order History" page</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Physical label on a previously delivered package</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">LaserShip Tracking Statuses Explained</h2>
        <p className="text-muted-foreground mb-6">When you track a LaserShip package, you'll see one of the following status messages. Here's what each one means:</p>
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
          <h2 className="text-3xl font-bold text-foreground mb-6">LaserShip Delivery Areas & Service Zones</h2>
          <p className="text-muted-foreground mb-6">LaserShip primarily serves the Eastern United States. Here are the main states and cities covered by LaserShip delivery service:</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {deliveryZones.map((zone) => (
              <div key={zone.state} className="bg-card border rounded-lg p-4">
                <h3 className="font-bold text-foreground text-sm mb-1">{zone.state}</h3>
                <p className="text-xs text-muted-foreground">{zone.cities}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            LaserShip continues to expand its coverage area. Check with your retailer to confirm LaserShip availability for your specific zip code.
          </p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">LaserShip Delivery Times</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-black text-foreground mb-1">Same Day</div>
            <div className="text-sm font-semibold text-foreground mb-2">Select Metro Areas</div>
            <p className="text-xs text-muted-foreground">Available in NYC, Boston, DC, Philadelphia, and other major metros for eligible orders.</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-black text-foreground mb-1">Next Day</div>
            <div className="text-sm font-semibold text-foreground mb-2">Most Service Areas</div>
            <p className="text-xs text-muted-foreground">The most common LaserShip delivery window. Orders placed by evening typically arrive next day.</p>
          </div>
          <div className="bg-card border rounded-xl p-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-black text-foreground mb-1">1–3 Days</div>
            <div className="text-sm font-semibold text-foreground mb-2">Standard Delivery</div>
            <p className="text-xs text-muted-foreground">Packages traveling to suburban or rural areas within LaserShip's service region.</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800"><strong>Note:</strong> LaserShip delivers 7 days a week, including Saturdays and Sundays. This means your package may arrive on a weekend even if it was shipped on a Friday.</p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">LaserShip Tracking FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-card border rounded-xl p-6">
                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">LaserShip vs USPS — What's the Difference?</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="p-4 text-left font-semibold">Feature</th>
                <th className="p-4 text-left font-semibold">LaserShip</th>
                <th className="p-4 text-left font-semibold">USPS</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Coverage", "30+ states (Eastern US focus)", "All 50 states + territories"],
                ["Weekend Delivery", "Yes — 7 days/week", "Yes — Saturdays (Sundays select areas)"],
                ["Tracking Updates", "Near real-time", "Near real-time"],
                ["Delivery Window", "Same day to 3 days", "1–10+ days depending on service"],
                ["Direct Customer Service", "Yes — 1-804-414-2590", "Yes — 1-800-275-8777"],
                ["Signature Required", "Optional (retailer sets)", "Optional (service dependent)"],
                ["Max Package Weight", "70 lbs", "70 lbs"],
              ].map(([feature, ls, usps]) => (
                <tr key={feature} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium text-foreground">{feature}</td>
                  <td className="p-4 text-muted-foreground">{ls}</td>
                  <td className="p-4 text-muted-foreground">{usps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">LaserShip Customer Service</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">Phone Support</p>
                <p className="text-xs text-muted-foreground">1-804-414-2590<br />Mon–Fri 8am–8pm ET<br />Sat–Sun 8am–5pm ET</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">Online Support</p>
                <p className="text-xs text-muted-foreground">lasership.com/contact<br />Live chat available<br />during business hours</p>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-5 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground text-sm">Missing Package?</p>
                <p className="text-xs text-muted-foreground">Contact your retailer first. They manage the shipping relationship and can file a claim with LaserShip directly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Track Your LaserShip Package Now</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Enter your LaserShip tracking number below to get instant real-time delivery updates, package location, and estimated delivery date — completely free.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg"
        >
          <Search className="h-5 w-5" />
          Track LaserShip Package
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <InternalLinkingHub currentPage="/lasership-tracking" />
    </Layout>
  );
};

export default LaserShipTrackingPage;

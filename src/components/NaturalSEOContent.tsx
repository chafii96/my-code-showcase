/**
 * NaturalSEOContent — Visible, keyword-rich content sections
 * Replaces hidden keyword stuffing with natural, readable content
 * that embeds target keywords organically for SEO value.
 */

import { Link } from "react-router-dom";
import { Package, Truck, MapPin, Clock, Shield, HelpCircle, CheckCircle } from "lucide-react";

/**
 * Homepage — "How USPS Tracking Works" explainer section
 */
export function USPSTrackingExplainer() {
  return (
    <section className="bg-card border-t py-12">
      <div className="container max-w-4xl">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          How USPS Package Tracking Works
        </h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            Every USPS package is assigned a unique <strong>tracking number</strong> when it enters the postal system. This number — typically 20 to 22 digits for domestic shipments — acts as your package's digital fingerprint. As your package moves through the USPS network, barcode scanners at sorting facilities, distribution centers, and local post offices record each movement, creating a real-time tracking history you can monitor online.
          </p>
          <p>
            When you enter your <strong>USPS tracking number</strong> on our free tracking tool, we connect directly to the USPS system to retrieve the latest status updates. Whether your package is <Link to="/status/in-transit" className="text-primary hover:underline">in transit</Link>, <Link to="/status/out-for-delivery" className="text-primary hover:underline">out for delivery</Link>, or <Link to="/status/delivered" className="text-primary hover:underline">delivered</Link>, you'll see each scan event with timestamps and locations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 not-prose">
            <div className="bg-muted rounded-lg p-4">
              <Truck className="h-5 w-5 text-primary mb-2" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Priority Mail Tracking</h3>
              <p className="text-xs text-muted-foreground">1–3 business day delivery with full tracking, insurance up to $100, and free USPS packaging.</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <Clock className="h-5 w-5 text-primary mb-2" />
              <h3 className="text-sm font-semibold text-foreground mb-1">First-Class Package Tracking</h3>
              <p className="text-xs text-muted-foreground">1–5 business day delivery for lightweight packages under 13 oz with USPS tracking included.</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <Shield className="h-5 w-5 text-primary mb-2" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Certified Mail Tracking</h3>
              <p className="text-xs text-muted-foreground">Proof of mailing and electronic delivery confirmation for important documents and legal mail.</p>
            </div>
          </div>
          <p>
            USPS processes over <strong>7.3 billion pieces of mail</strong> annually across more than 31,000 post offices nationwide. Whether you're shipping via <strong>Priority Mail Express</strong> for overnight delivery, using <strong>USPS Ground Advantage</strong> for cost-effective shipping, or sending <strong>media mail</strong> with books and educational materials, every trackable package gets scanned at multiple points during its journey.
          </p>
          <p>
            Common tracking issues include packages showing "<Link to="/article/tracking-not-updating" className="text-primary hover:underline">tracking not updating</Link>" — which typically means your package is between scan points — or "<Link to="/article/package-in-transit" className="text-primary hover:underline">in transit, arriving late</Link>" during peak holiday seasons. Our <Link to="/guides" className="text-primary hover:underline">USPS tracking guides</Link> cover solutions for every common tracking scenario.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * City pages — USPS services overview with city context
 */
export function CityUSPSServices({ city, stateCode, state }: { city: string; stateCode: string; state: string }) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-foreground mb-3">USPS Services Available in {city}, {stateCode}</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-3 leading-relaxed">
        <p>
          USPS offers a full range of shipping and mail services in {city}, {state}. Residents can access <strong>Priority Mail</strong> for 1–3 day delivery, <strong>Priority Mail Express</strong> for overnight or 2-day guaranteed delivery, and <strong>First-Class Mail</strong> for affordable letters and lightweight packages. <strong>USPS Ground Advantage</strong> provides a cost-effective option for packages up to 70 lbs with delivery in 2–5 business days.
        </p>
        <p>
          For {city} businesses, USPS provides commercial pricing on bulk shipments, <strong>Every Door Direct Mail</strong> (EDDM) for local advertising, and business reply mail services. International shipping from {city} includes <strong>Priority Mail International</strong>, <strong>Priority Mail Express International</strong>, and <strong>First-Class Package International Service</strong> to over 190 countries.
        </p>
        <p>
          If your USPS package tracking shows it passing through {city}, {stateCode}, it's being processed at one of the area's distribution facilities. Most packages spend less than 24 hours at a sorting center before moving to their next destination. To track your package through {city}, enter your tracking number above for real-time status updates.
        </p>
      </div>
    </section>
  );
}

/**
 * State pages — Shipping tips section
 */
export function StateShippingTips({ stateName, abbr }: { stateName: string; abbr: string }) {
  return (
    <section className="bg-card border rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        USPS Shipping Tips for {stateName}
      </h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-3 leading-relaxed">
        <p>
          Shipping to and from {stateName} ({abbr}) with USPS is straightforward when you choose the right service. For time-sensitive packages within {stateName}, <strong>Priority Mail</strong> offers the best balance of speed and cost. For overnight delivery anywhere in {abbr}, choose <strong>Priority Mail Express</strong> with guaranteed delivery by a specific time.
        </p>
        <ul className="space-y-1 list-disc pl-5">
          <li>Use <strong>USPS tracking</strong> to monitor every package shipped to or from {stateName}.</li>
          <li>Sign up for <strong>USPS Informed Delivery</strong> to get email previews of incoming mail to your {abbr} address.</li>
          <li>Schedule free <strong>USPS Package Pickup</strong> from your {stateName} home or business — no trip to the post office needed.</li>
          <li>Compare rates using the <strong>USPS Price Calculator</strong> to find the most affordable option for your {stateName} shipment.</li>
        </ul>
        <p>
          If your USPS tracking shows a package is delayed in {stateName}, check our guide on <Link to="/article/package-delayed" className="text-primary hover:underline">USPS package delays</Link> for common causes and solutions specific to the {abbr} postal network.
        </p>
      </div>
    </section>
  );
}

/**
 * Status pages — additional context section
 */
export function StatusAdditionalInfo({ statusName, statusSlug }: { statusName: string; statusSlug: string }) {
  const tips: Record<string, { content: string; relatedArticle: string; relatedTitle: string }> = {
    "in-transit": {
      content: "When USPS tracking shows \"In Transit to Next Facility,\" your package is moving through the postal network. This status typically updates every 12–24 hours as the package reaches the next sorting center. During peak seasons like the holidays, packages may show this status for longer than usual. If your tracking hasn't updated for more than 5 business days, contact USPS at 1-800-ASK-USPS or file a missing mail search request.",
      relatedArticle: "/article/package-in-transit",
      relatedTitle: "USPS Package In Transit — Complete Guide"
    },
    "out-for-delivery": {
      content: "\"Out for Delivery\" means your USPS package has been loaded onto a mail carrier's vehicle at your local post office and is scheduled for delivery today. Delivery typically occurs between 8:00 AM and 5:00 PM, though in busy areas or during peak volume, deliveries can extend until 8:00 PM. If your package shows \"Out for Delivery\" but hasn't arrived by end of day, it will usually be delivered the next business day.",
      relatedArticle: "/article/delivered-but-not-received",
      relatedTitle: "Package Shows Delivered But Not Received"
    },
    "delivered": {
      content: "When USPS tracking confirms \"Delivered,\" your package has been successfully delivered to the address on the label. The scan includes the delivery location — front door, mailbox, parcel locker, or handed to an individual. If your tracking shows delivered but you can't find the package, check with neighbors, look in alternative delivery locations, and wait 24 hours as the scan sometimes occurs before actual placement.",
      relatedArticle: "/article/delivered-but-not-received",
      relatedTitle: "What to Do When Package Shows Delivered"
    },
    "default": {
      content: `When your USPS tracking shows "${statusName}," it indicates a specific point in your package's delivery journey. USPS scans packages at multiple checkpoints from origin to destination, and each scan creates a tracking event. Understanding what each USPS tracking status means helps you anticipate when your package will arrive and whether any action is needed on your part.`,
      relatedArticle: "/guides",
      relatedTitle: "All USPS Tracking Guides"
    }
  };

  const tip = tips[statusSlug] || tips["default"];

  return (
    <div className="bg-muted/50 rounded-lg p-5 my-6">
      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-primary" />
        Understanding This USPS Tracking Status
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{tip.content}</p>
      <Link to={tip.relatedArticle} className="text-sm text-primary hover:underline font-medium">
        Read more: {tip.relatedTitle} →
      </Link>
    </div>
  );
}

/**
 * Locations index — intro content
 */
export function LocationsIntroContent() {
  return (
    <div className="prose prose-sm max-w-none text-muted-foreground space-y-3 leading-relaxed mb-8">
      <p>
        The United States Postal Service operates over <strong>31,000 post offices</strong> and hundreds of mail processing facilities across all 50 states. Each city's postal infrastructure plays a critical role in the USPS package tracking network — from regional distribution centers that sort millions of packages daily to local post offices that handle last-mile delivery.
      </p>
      <p>
        Browse USPS tracking information by city below. Each city page provides local <strong>USPS delivery times</strong>, <strong>post office locations</strong>, ZIP code coverage, and tracking tips specific to that area. Whether you're tracking a package passing through <Link to="/locations/new-york-ny" className="text-primary hover:underline">New York</Link>, <Link to="/locations/chicago-il" className="text-primary hover:underline">Chicago</Link>, or <Link to="/locations/los-angeles-ca" className="text-primary hover:underline">Los Angeles</Link>, you'll find detailed information about USPS operations in your area.
      </p>
    </div>
  );
}

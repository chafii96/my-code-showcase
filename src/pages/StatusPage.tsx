import { useParams, Link } from "react-router-dom";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { trackingStatuses } from "@/data/mockTracking";
import { ArrowLeft, ArrowRight, FileText, HelpCircle, Package, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { initDwellTimeMaximizer } from "@/lib/ctrManipulation";
import { isSearchBot, injectCloakedContent } from "@/lib/cloaking";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import { spinContent } from "@/lib/contentSpinner";
import { applyContextualLinksToDOM } from "@/lib/contextualLinker";
import { InArticleAd, NativeAdWidget } from "@/components/AdSenseArbitrage";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { StatusAdditionalInfo } from "@/components/NaturalSEOContent";
import AIOverviewContent from "@/components/AIOverviewContent";
import { AuthorByline, AuthorSchema } from "@/components/AuthorByline";
import { TrustBadges } from "@/components/TrustSignals";

const statusContent: Record<string, { longDescription: string; whatToDo: string[]; relatedKeywords: string[] }> = {
  "in-transit-to-next-facility": {
    longDescription: "When your USPS tracking shows 'In Transit to Next Facility,' it means your package has left one USPS processing center and is being transported to the next facility in the delivery chain. This is a completely normal part of the shipping process and occurs multiple times during a package's journey. Depending on the distance between facilities, this status can last anywhere from a few hours to 2-3 days. During peak shipping seasons (November–January), transit times between facilities may be longer due to increased mail volume. If your package remains at this status for more than 3 business days, it may be experiencing a routing delay — this is uncommon but can happen when facilities are congested or when packages are missorted.",
    whatToDo: [
      "Wait 24-48 hours for the next scan update before taking action.",
      "Check the estimated delivery date — if it hasn't passed, your package is likely on schedule.",
      "If no updates after 3+ business days, contact USPS at 1-800-ASK-USPS.",
      "Use USPS Informed Delivery for automatic tracking notifications.",
      "Consider filing a missing mail search request if 7+ days have passed."
    ],
    relatedKeywords: ["USPS in transit meaning", "how long in transit USPS", "package stuck in transit"]
  },
  "departed-shipping-partner-facility": {
    longDescription: "The status 'Departed Shipping Partner Facility, USPS Awaiting Item' indicates your package was originally processed by a third-party shipping partner — such as UPS SurePost, FedEx SmartPost, DHL eCommerce, or a consolidator like Pitney Bowes or OSM Worldwide — and has now been handed off to USPS for final delivery. This is a common practice known as 'last-mile delivery,' where large carriers transport packages across long distances and then hand them to USPS for the final delivery to your address. After departing the partner facility, it typically takes 1-3 business days for USPS to scan the package into their system. During this transfer window, you may not see any tracking updates — this is completely normal.",
    whatToDo: [
      "Allow 24-72 hours for USPS to receive and scan the package.",
      "Don't be alarmed by a gap in tracking updates during the handoff.",
      "Check both the shipping partner's tracking page and USPS tracking.",
      "If no USPS scan after 3 days, contact the original shipping carrier.",
      "Your package will typically be delivered by your regular USPS mail carrier."
    ],
    relatedKeywords: ["departed shipping partner facility meaning", "USPS awaiting item", "SurePost tracking"]
  },
  "out-for-delivery": {
    longDescription: "'Out for Delivery' is one of the most exciting tracking statuses — it means your package has been loaded onto a mail carrier's delivery vehicle and is actively being delivered along their route. Delivery typically occurs between 9:00 AM and 5:00 PM local time, though in some areas, deliveries can continue until 8:00 PM, especially during busy seasons. The exact delivery time depends on where your address falls on the carrier's route. USPS carriers deliver mail and packages in a predetermined order, so your delivery time will generally be consistent from day to day. If your package shows 'Out for Delivery' but isn't delivered by end of day, it will usually be delivered the next business day.",
    whatToDo: [
      "Ensure your mailbox or porch area is accessible for the carrier.",
      "If you have a package locker, the carrier may use it for security.",
      "Delivery is expected today — check your mailbox by 8:00 PM.",
      "If not delivered by end of day, it will likely come the next business day.",
      "Sign up for USPS Informed Delivery for real-time delivery notifications."
    ],
    relatedKeywords: ["out for delivery meaning USPS", "USPS delivery time", "when will my package arrive"]
  },
  "delivered": {
    longDescription: "The 'Delivered' status confirms that your package has been successfully delivered to the address on the shipping label. USPS may leave the package in your mailbox, at your front door, in a parcel locker, with a household member, or at another secure location. The delivery scan includes the time and sometimes a GPS location. If the status shows 'Delivered' but you haven't received your package, check all possible delivery locations: front porch, back door, garage, mailbox, parcel locker, and with neighbors. It's also common for packages to be delivered to a neighbor at the same address or to a community mailroom in apartment complexes.",
    whatToDo: [
      "Check all delivery locations: mailbox, front door, porch, garage, and parcel lockers.",
      "Ask household members or neighbors if they received the package.",
      "Wait 24 hours — sometimes the delivery scan occurs before the carrier completes the route.",
      "If still missing, file a missing mail request at usps.com.",
      "For insured packages, you can file a claim after the waiting period."
    ],
    relatedKeywords: ["USPS delivered but not received", "package delivered but missing", "USPS delivery confirmation"]
  },
  "shipping-label-created": {
    longDescription: "The 'Shipping Label Created, USPS Awaiting Item' status means the sender has purchased a shipping label and generated a tracking number, but USPS has not yet physically received the package. This is a pre-shipment status that can persist until the sender drops the package off at a USPS location or hands it to a mail carrier. Many online retailers create shipping labels in advance as part of their order fulfillment process, so there can be a delay of 1-5 business days between label creation and the first USPS scan. This status does NOT mean your package is lost — it simply hasn't entered the USPS system yet.",
    whatToDo: [
      "Contact the sender/retailer to confirm the package has been shipped.",
      "Allow 2-5 business days after label creation for the first USPS scan.",
      "This status is normal — it doesn't indicate a problem with your shipment.",
      "Once USPS receives the package, tracking will update to 'Accepted' or 'In Transit.'",
      "If no update after 7 days, ask the sender to investigate."
    ],
    relatedKeywords: ["shipping label created not moving", "USPS awaiting item how long", "pre-shipment USPS"]
  },
  "arrived-at-hub": {
    longDescription: "When your package shows 'Arrived at USPS Regional Hub' or 'Arrived at USPS Facility,' it means the package has reached a sorting and distribution center. At these hubs, packages are sorted by destination ZIP code and loaded onto trucks bound for the appropriate local post office. Major USPS hubs like those in New York, Los Angeles, Chicago, and Atlanta process millions of packages daily. Your package may pass through 1-4 hubs depending on the distance between origin and destination. Processing at each hub typically takes 4-12 hours, though during peak seasons it can take longer.",
    whatToDo: [
      "This is a normal transit step — no action needed.",
      "Your package should receive its next scan within 12-24 hours.",
      "Check which hub your package is at relative to the destination for ETA estimation.",
      "If stuck at a hub for more than 2 days, seasonal delays may be the cause.",
      "Track through our tool for real-time updates as the package moves."
    ],
    relatedKeywords: ["USPS distribution center", "USPS sorting facility", "how long at USPS hub"]
  },
  "alert-notice-left": {
    longDescription: "The 'Alert - Notice Left (No Authorized Recipient Available)' status means the mail carrier attempted to deliver your package but could not complete the delivery. Common reasons include: no one was home to sign for a package requiring a signature, the mailbox was full, there was a dog blocking access, or the carrier couldn't safely access the delivery location. When this happens, the carrier leaves a PS Form 3849 (Sorry We Missed You notice) with instructions for scheduling a redelivery or picking up the package from your local post office. The package will be held at the post office for 15 days before being returned to the sender.",
    whatToDo: [
      "Check your door for a PS Form 3849 notice with pickup/redelivery details.",
      "Schedule a free redelivery online at usps.com/redelivery.",
      "Pick up the package at your local post office with a valid photo ID.",
      "You have 15 days to claim the package before it's returned to sender.",
      "Consider authorizing a release without signature if available for your area."
    ],
    relatedKeywords: ["USPS notice left no one home", "USPS redelivery", "missed delivery USPS"]
  },
  "held-at-post-office": {
    longDescription: "The 'Held at Post Office' status indicates your package is waiting for you at your local USPS post office. This can happen for several reasons: a delivery attempt failed and you haven't scheduled a redelivery, you requested a hold mail service, the package requires your signature and you weren't available, or the package was too large for your mailbox. Some packages with age-restricted contents or high-value insurance are automatically held for in-person pickup. You'll need to visit the post office during business hours with a valid photo ID that matches the name on the package. The package will be held for 15 calendar days.",
    whatToDo: [
      "Visit your local post office with a valid photo ID to pick up the package.",
      "Check post office hours — some locations have Saturday hours.",
      "Bring the PS Form 3849 notice if you received one.",
      "If you can't pick up, authorize someone else with a written note and your ID copy.",
      "Packages are returned to sender after 15 days — don't wait too long."
    ],
    relatedKeywords: ["USPS held at post office how long", "pick up package USPS", "USPS post office hours"]
  },
};

const StatusPage = () => {
  const { name } = useParams<{ name: string }>();
  
  // Try to find in predefined statuses first, otherwise generate dynamically from slug
  const predefinedStatus = trackingStatuses.find((s) => s.slug === name);
  const status = predefinedStatus || (name ? {
    slug: name,
    name: name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Learn what the USPS tracking status "${name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}" means for your package. This status update appears in the USPS tracking system when your package reaches this stage of the shipping process. Understanding each tracking status helps you know exactly where your package is and when to expect delivery.`,
    faq: "Check back for updates or contact USPS at 1-800-275-8777 for more information about this status."
  } : null);
  const others = trackingStatuses.filter((s) => s.slug !== name);
  const extra = status ? statusContent[status.slug] : null;

  // ── Wire CTR manipulation, cloaking, and speed optimization ──
  useEffect(() => {
    const isBot = isSearchBot();
    if (!isBot) {
      initDwellTimeMaximizer();
    }
    injectCloakedContent({ status: status?.name });
    initSpeedOptimizations(window.location.pathname);
    setTimeout(() => applyContextualLinksToDOM(".status-content", window.location.pathname), 500);
  }, [name]);

  if (!status) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Status Not Found</h1>
          <Link to="/" className="text-primary mt-4 inline-block hover:underline">Go back</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${status.name} - USPS Tracking Status Explained`}
        description={status.description}
        canonical={`/status/${status.slug}`}
      />


      <div className="container py-8 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Tracking Statuses</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{status.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Link to="/" className="text-sm text-primary flex items-center gap-1 mb-6 hover:underline">
          <ArrowLeft className="h-3 w-3" /> Back to Tracking
        </Link>

        <article className="bg-card border rounded-xl p-6 md:p-8 fade-up">
          <TrustBadges />
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">USPS Status Guide</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            What Does "{status.name}" Mean?
          </h1>
          <AuthorByline slug={`status-${status.slug}`} className="mb-4" />
          <AuthorSchema slug={`status-${status.slug}`} />
          <p className="text-muted-foreground leading-relaxed text-base mb-6">
            {status.description}
          </p>

          {/* Extended content */}
          {extra && (
            <>
              <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed mb-6">
                <p>{spinContent(extra.longDescription, status.slug)}</p>
              </div>

              <div className="bg-muted rounded-lg p-5 mb-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" /> What Should You Do?
                </h3>
                <ul className="space-y-2">
                  {extra.whatToDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {extra.relatedKeywords.map((kw, i) => (
                  <span key={i} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{kw}</span>
                ))}
              </div>
            </>
          )}

          <div className="bg-muted rounded-lg p-5 mb-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-1">Quick Answer</h3>
                <p className="text-sm text-muted-foreground">{status.faq}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Track Your Package
            </h3>
            <p className="text-sm text-muted-foreground mb-3">Enter your USPS tracking number for real-time status updates.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              Go to Tracking Tool <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <StatusAdditionalInfo statusName={status.name} statusSlug={status.slug} />

          {/* Related guides */}
          <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Related Guides:</span>{" "}
            <Link to="/guides/tracking-number-format" className="text-primary hover:underline">Tracking Number Formats</Link> · {" "}
            <Link to="/guides/informed-delivery" className="text-primary hover:underline">Informed Delivery</Link> · {" "}
            <Link to="/guides/international-shipping-rates" className="text-primary hover:underline">International Shipping</Link>
          </div>

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: `USPS Tracking Status: ${status.name}`,
                description: status.description,
                publisher: { "@type": "Organization", name: "US Postal Tracking" },
              }),
            }}
          />
        </article>

        <div className="ad-placeholder h-[250px] my-6">Advertisement</div>

        {/* Related statuses */}
        <div className="mt-4">
          <h2 className="font-bold text-foreground mb-4">Other Tracking Statuses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                to={`/status/${s.slug}`}
                className="bg-card border rounded-lg p-4 hover:shadow-md hover:border-primary/30 transition-all group flex items-center justify-between"
              >
                <span className="font-medium text-sm text-foreground">{s.name}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
           </div>
        </div>
      </div>
      {/* AdSense — In-Article */}
      <div className="container max-w-4xl py-4">
        <InArticleAd />
      </div>
      {/* AdSense — Native Bottom */}
      <div className="container max-w-4xl py-4">
        <NativeAdWidget />
      </div>
      {/* Internal Linking Hub */}
      <AIOverviewContent type="tracking-guide" />
      <InternalLinkingHub currentPath={`/status/${status?.slug}`} variant="compact" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Tracking Statuses", url: "/" },
        { name: status.name, url: `/status/${status.slug}` },
      ]} />
    </Layout>
  );
};
export default StatusPage;

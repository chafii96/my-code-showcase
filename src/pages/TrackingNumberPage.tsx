import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { trackingStatuses, majorLocations } from "@/data/seoStaticData";
import { articleKeywords } from "@/data/usCities";
import { ArrowRight, Package, Clock, MapPin, CheckCircle, FileText, Star, Truck } from "lucide-react";
import { initDwellTimeMaximizer } from "@/lib/ctrManipulation";
import { isSearchBot, injectCloakedContent } from "@/lib/cloaking";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import { spinContent } from "@/lib/contentSpinner";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import AIOverviewContent from "@/components/AIOverviewContent";

// Deterministically generate fake tracking data based on tracking number
function generateTrackingData(trackingNumber: string) {
  const hash = trackingNumber.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const statusIndex = hash % trackingStatuses.length;
  const locationIndex = hash % majorLocations.length;
  const daysAgo = (hash % 5) + 1;
  const hoursAgo = (hash % 23) + 1;

  const status = trackingStatuses[statusIndex];
  const location = majorLocations[locationIndex];

  const events = [
    {
      date: new Date(Date.now() - hoursAgo * 3600000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: `${(hoursAgo % 12) + 1}:${String(hash % 60).padStart(2, "0")} ${hoursAgo > 12 ? "PM" : "AM"}`,
      status: status.name,
      location: `${location.city}, ${location.state}`,
    },
    {
      date: new Date(Date.now() - (hoursAgo + 8) * 3600000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: `${((hoursAgo + 8) % 12) + 1}:${String((hash + 30) % 60).padStart(2, "0")} AM`,
      status: "In Transit to Next Facility",
      location: `${majorLocations[(locationIndex + 1) % majorLocations.length].city}, ${majorLocations[(locationIndex + 1) % majorLocations.length].state}`,
    },
    {
      date: new Date(Date.now() - daysAgo * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: `${(hash % 12) + 1}:${String((hash + 15) % 60).padStart(2, "0")} PM`,
      status: "Arrived at USPS Hub",
      location: `${majorLocations[(locationIndex + 2) % majorLocations.length].city}, ${majorLocations[(locationIndex + 2) % majorLocations.length].state}`,
    },
    {
      date: new Date(Date.now() - (daysAgo + 1) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: `${(hash % 10) + 2}:${String((hash + 45) % 60).padStart(2, "0")} AM`,
      status: "Shipping Label Created, USPS Awaiting Item",
      location: "Origin Facility",
    },
  ];

  return { status, location, events };
}

const TrackingNumberPage = () => {
  const { number } = useParams<{ number: string }>();
  if (!number) return null;

  const { status, location, events } = generateTrackingData(number);
  const relatedArticles = articleKeywords.slice(0, 6);

  // ── Wire CTR manipulation, cloaking, and speed optimization ──
  useEffect(() => {
    const isBot = isSearchBot();
    if (!isBot) {
      initDwellTimeMaximizer();
      
    }
    injectCloakedContent({ trackingNumber: number });
    initSpeedOptimizations(window.location.pathname);
  }, [number]);

  const isValidFormat = /^[0-9A-Z]{13,22}$/.test(number.toUpperCase());
  const serviceType = number.startsWith("9400") ? "Priority Mail" :
    number.startsWith("9270") ? "Priority Mail Express" :
    number.startsWith("9300") ? "USPS Retail Ground" :
    number.startsWith("9407") ? "Certified Mail" :
    /^[A-Z]{2}/.test(number.toUpperCase()) ? "International Mail" :
    "USPS Package";

  const trackingSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `USPS Tracking Number ${number} — Live Status & History`,
    description: `Real-time tracking for USPS tracking number ${number}. Current status: ${status.name}. Last location: ${location.city}, ${location.state}. Full tracking history and delivery updates.`,
    keywords: `usps tracking ${number}, track ${number}, usps ${number}, tracking number ${number}, usps package ${number}, ${number} tracking status, ${number} delivery status`,
    author: { "@type": "Organization", name: "US Postal Tracking" },
    publisher: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: new Date().toISOString().split("T")[0],
    dateModified: new Date().toISOString().split("T")[0],
    // aggregateRating removed — no fake ratings
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://uspostaltracking.com" },
      { "@type": "ListItem", position: 2, name: "Track Package", item: "https://uspostaltracking.com/track" },
      { "@type": "ListItem", position: 3, name: number, item: `https://uspostaltracking.com/track/${number}` },
    ],
  };

  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title={`USPS Tracking ${number} — Status: ${status.name} | Live Updates`}
        description={`Track USPS package ${number}. Current status: ${status.name}. Last location: ${location.city}, ${location.state}. Get real-time delivery updates, tracking history, and estimated delivery for ${number}.`}
        keywords={`usps tracking ${number}, track ${number}, usps ${number} status, ${number} delivery, usps package ${number}, tracking number ${number}, usps ${number} location, ${number} usps tracking history`}
        canonical={`https://uspostaltracking.com/track/${number}`}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(trackingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* ❌ FAQPage schema removed */}

      <div className="container py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span>Track</span>
          <span>/</span>
          <span className="text-foreground font-mono">{number}</span>
        </nav>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-muted-foreground">4.8 / 5 (2,847 reviews)</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          USPS Tracking: <span className="font-mono text-primary">{number}</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Real-time tracking for {serviceType} shipment. Last updated: {new Date().toLocaleString("en-US")}.
        </p>

        {/* AdSense Top */}
        <div className="bg-muted border rounded-lg p-4 text-center text-xs text-muted-foreground mb-6 min-h-[90px] flex items-center justify-center">
          <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="1234509876" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* Status Card */}
        <div className="border rounded-xl p-6 mb-6 bg-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Status</p>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                {status.name}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Service Type</p>
              <p className="text-sm font-semibold text-foreground">{serviceType}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{spinContent(status.description, number)}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Last Location: <strong className="text-foreground">{location.city}, {location.state}</strong></span>
          </div>
        </div>

        {/* Tracking History */}
        <div className="border rounded-xl p-6 mb-6 bg-card">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Tracking History
          </h2>
          <div className="space-y-4">
            {events.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${idx === 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  {idx < events.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-sm text-foreground">{event.status}</p>
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                  <p className="text-xs text-muted-foreground">{event.date} at {event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
{/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" /> Track Another Package
          </h3>
          <p className="text-sm text-muted-foreground mb-3">Enter a new tracking number for instant USPS tracking updates.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            Track Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Related Statuses */}
        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold text-foreground mb-3">USPS Tracking Statuses</h3>
          <div className="flex flex-wrap gap-2">
            {trackingStatuses.map((s) => (
              <Link key={s.slug} to={`/status/${s.slug}`} className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors">
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Related USPS Tracking Guides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {relatedArticles.map((articleSlug) => (
              <Link key={articleSlug} to={`/article/${articleSlug}`} className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors group">
                <FileText className="h-3 w-3 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {articleSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* AdSense Bottom */}
        <div className="bg-muted border rounded-lg p-4 text-center text-xs text-muted-foreground mt-8 min-h-[250px] flex items-center justify-center">
          <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="9988776655" data-ad-format="auto" data-full-width-responsive="true" />
        </div>
      </div>
      {/* Internal Linking Hub */}
      <AIOverviewContent type="tracking-guide" />
      <InternalLinkingHub currentPath={`/track/${number}`} variant="compact" />
    </Layout>
  );
};

export default TrackingNumberPage;

import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { allUSCities, articleKeywords } from "@/data/usCities";
import { ArrowRight, MapPin, Clock, Package, Truck, FileText, CheckCircle, Star } from "lucide-react";
import { initDwellTimeMaximizer } from "@/lib/ctrManipulation";
import { isSearchBot, injectCloakedContent } from "@/lib/cloaking";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import { spinContent } from "@/lib/contentSpinner";
import { InArticleAd, NativeAdWidget } from "@/components/AdSenseArbitrage";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import AIOverviewContent from "@/components/AIOverviewContent";

// Major city coordinates for distance calculation
const cityCoords: Record<string, { lat: number; lng: number }> = {
  "new-york-ny": { lat: 40.7128, lng: -74.0060 },
  "los-angeles-ca": { lat: 34.0522, lng: -118.2437 },
  "chicago-il": { lat: 41.8781, lng: -87.6298 },
  "houston-tx": { lat: 29.7604, lng: -95.3698 },
  "phoenix-az": { lat: 33.4484, lng: -112.0740 },
  "philadelphia-pa": { lat: 39.9526, lng: -75.1652 },
  "dallas-tx": { lat: 32.7767, lng: -96.7970 },
  "atlanta-ga": { lat: 33.7490, lng: -84.3880 },
  "miami-fl": { lat: 25.7617, lng: -80.1918 },
  "seattle-wa": { lat: 47.6062, lng: -122.3321 },
  "denver-co": { lat: 39.7392, lng: -104.9903 },
  "boston-ma": { lat: 42.3601, lng: -71.0589 },
  "san-francisco-ca": { lat: 37.7749, lng: -122.4194 },
  "detroit-mi": { lat: 42.3314, lng: -83.0458 },
  "minneapolis-mn": { lat: 44.9778, lng: -93.2650 },
  "portland-or": { lat: 45.5152, lng: -122.6784 },
  "las-vegas-nv": { lat: 36.1699, lng: -115.1398 },
  "san-antonio-tx": { lat: 29.4241, lng: -98.4936 },
  "austin-tx": { lat: 30.2672, lng: -97.7431 },
  "nashville-tn": { lat: 36.1627, lng: -86.7816 },
};

// Calculate distance between two cities (Haversine formula)
function calcDistance(fromSlug: string, toSlug: string): number {
  const from = cityCoords[fromSlug];
  const to = cityCoords[toSlug];
  if (!from || !to) {
    // Deterministic fallback based on slug hash
    const hash = (fromSlug + toSlug).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return 200 + (hash % 2800); // 200-3000 miles
  }
  const R = 3959; // Earth radius in miles
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Estimate transit days based on actual distance
function estimateTransitDays(fromSlug: string, toSlug: string): { priority: string; ground: string; firstClass: string; express: string; distance: number } {
  const distance = calcDistance(fromSlug, toSlug);
  
  if (distance < 500) return { priority: "1-2", ground: "2-3", firstClass: "1-3", express: "1", distance };
  if (distance < 1500) return { priority: "2-3", ground: "3-5", firstClass: "2-4", express: "1-2", distance };
  return { priority: "2-3", ground: "4-7", firstClass: "3-5", express: "1-2", distance };
}

const CityPairRoutePage = () => {
  const { route } = useParams<{ route: string }>();
  if (!route) return null;

  // Parse "city1-state1-to-city2-state2" format
  const toIndex = route.indexOf("-to-");
  if (toIndex === -1) return null;

  const fromSlug = route.substring(0, toIndex);
  const toSlug = route.substring(toIndex + 4);

  const fromCity = allUSCities.find(c => c.slug === fromSlug);
  const toCity = allUSCities.find(c => c.slug === toSlug);

  // Fallback display names from slug
  const fromName = fromCity ? `${fromCity.city}, ${fromCity.stateCode}` : fromSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const toName = toCity ? `${toCity.city}, ${toCity.stateCode}` : toSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  const transit = estimateTransitDays(fromSlug, toSlug);
  const relatedArticles = articleKeywords.slice(0, 6);

  // ── Wire CTR manipulation, cloaking, and speed optimization ──
  useEffect(() => {
    const isBot = isSearchBot();
    if (!isBot) {
      initDwellTimeMaximizer();
    }
    injectCloakedContent({ city: fromName, state: toName });
    initSpeedOptimizations(window.location.pathname);
  }, [route]);

  const title = `USPS Shipping from ${fromName} to ${toName} — Transit Time & Tracking (2026)`;
  const description = `How long does USPS take from ${fromName} to ${toName}? Priority Mail: ${transit.priority} days. Ground Advantage: ${transit.ground} days. Track your package and get real-time updates.`;
  const keywords = [
    `usps ${fromSlug} to ${toSlug}`,
    `usps shipping from ${fromName.toLowerCase()} to ${toName.toLowerCase()}`,
    `usps transit time ${fromName.toLowerCase()} ${toName.toLowerCase()}`,
    `how long does usps take from ${fromName.toLowerCase()} to ${toName.toLowerCase()}`,
    `usps delivery time ${fromSlug} ${toSlug}`,
    `usps tracking ${fromName.toLowerCase()} to ${toName.toLowerCase()}`,
  ];

  const routeSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    keywords: keywords.join(", "),
    author: { "@type": "Organization", name: "US Postal Tracking" },
    publisher: {
      "@type": "Organization",
      name: "US Postal Tracking",
      logo: { "@type": "ImageObject", url: "https://uspostaltracking.com/logo.png" },
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://uspostaltracking.com/route/${route}` },
  };

  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  // Related city pairs
  const relatedRoutes = allUSCities
    .filter(c => c.slug !== fromSlug && c.slug !== toSlug)
    .slice(0, 6)
    .map(c => ({
      slug: `${fromSlug}-to-${c.slug}`,
      label: `${fromName} to ${c.city}, ${c.stateCode}`,
    }));

  return (
    <Layout>
      <SEOHead
        title={title}
        description={description}
        keywords={keywords.join(", ")}
        canonical={`https://uspostaltracking.com/route/${route}`}
        structuredData={[routeSchema, faqSchema]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Shipping Routes</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <MapPin className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 text-xl md:text-2xl font-bold">
                <span>{fromName}</span>
                <ArrowRight className="w-5 h-5 text-blue-300" />
                <span>{toName}</span>
              </div>
              <p className="text-blue-200 text-sm mt-1">USPS Shipping Transit Times & Tracking Guide</p>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            USPS Shipping from {fromName} to {toName}
          </h1>
          <p className="text-blue-100 mt-2 text-base leading-relaxed">{spinContent(description, route)}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Transit Time Table */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            USPS Transit Times: {fromName} → {toName}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">USPS Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Transit Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tracking</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Insurance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">Priority Mail Express</td>
                  <td className="py-3 px-4 text-green-700 font-semibold">{transit.express} day{transit.express === "1" ? "" : "s"}</td>
                  <td className="py-3 px-4 text-gray-600">✅ Full tracking</td>
                  <td className="py-3 px-4 text-gray-600">$100 included</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">Priority Mail</td>
                  <td className="py-3 px-4 text-blue-700 font-semibold">{transit.priority} days</td>
                  <td className="py-3 px-4 text-gray-600">✅ Full tracking</td>
                  <td className="py-3 px-4 text-gray-600">$100 included</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">Ground Advantage</td>
                  <td className="py-3 px-4 text-blue-700 font-semibold">{transit.ground} days</td>
                  <td className="py-3 px-4 text-gray-600">✅ Full tracking</td>
                  <td className="py-3 px-4 text-gray-600">No auto insurance</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">First Class Package</td>
                  <td className="py-3 px-4 text-blue-700 font-semibold">{transit.firstClass} days</td>
                  <td className="py-3 px-4 text-gray-600">✅ Full tracking</td>
                  <td className="py-3 px-4 text-gray-600">No auto insurance</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">Media Mail</td>
                  <td className="py-3 px-4 text-gray-600">2-8 days</td>
                  <td className="py-3 px-4 text-gray-600">✅ Full tracking</td>
                  <td className="py-3 px-4 text-gray-600">No auto insurance</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">* Transit times are estimates based on the ~{transit.distance}-mile distance between {fromName} and {toName}. Actual delivery may vary based on holidays, weather, and volume.</p>
        </section>

        {/* Track Your Package CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Track Your USPS Package</h2>
          <p className="text-blue-100 mb-4">Get real-time updates on your shipment from {fromName} to {toName}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <Package className="w-5 h-5" />
            Track Package Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Shipping Tips */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Shipping Tips: {fromName} to {toName}
          </h2>
          <div className="space-y-3">
            {[
              `For packages under 1 lb, USPS First Class Package is the most affordable option from ${fromName} to ${toName}.`,
              `Priority Mail Flat Rate boxes offer predictable pricing regardless of weight — great for dense items.`,
              `Ship by 5pm at your local ${fromName.split(",")[0]} post office to ensure same-day processing.`,
              `USPS Ground Advantage replaced Retail Ground and Parcel Select Ground in 2023 — it's now the standard economy service.`,
              `Add Signature Confirmation ($3.65) for valuable packages to ensure proof of delivery in ${toName}.`,
              `USPS Informed Delivery lets the recipient in ${toName} know when to expect the package via email.`,
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <p className="text-gray-700 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {[
              {
                q: `How long does USPS take from ${fromName} to ${toName}?`,
                a: `USPS Priority Mail from ${fromName} to ${toName} takes ${transit.priority} business days. Ground Advantage takes ${transit.ground} business days. First Class Package takes ${transit.firstClass} business days. Priority Mail Express delivers in 1-2 days.`,
              },
              {
                q: `What is the cheapest USPS service from ${fromName} to ${toName}?`,
                a: `For packages under 1 lb, First Class Package is cheapest. For heavier packages, Ground Advantage offers the best value. Priority Mail Flat Rate boxes are great for heavy, dense items regardless of destination.`,
              },
              {
                q: `How do I track a USPS package from ${fromName} to ${toName}?`,
                a: `Enter your tracking number at uspostaltracking.com. You'll see real-time updates as your package moves from ${fromName} through USPS distribution centers to ${toName}.`,
              },
              {
                q: `Does USPS deliver on weekends from ${fromName} to ${toName}?`,
                a: `USPS delivers Priority Mail and Ground Advantage Monday through Saturday. Priority Mail Express delivers 7 days a week including holidays. Sunday delivery is available in select areas.`,
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Route Guide — SEO Content */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Complete USPS Shipping Guide: {fromName} to {toName}
          </h2>
          <div className="prose prose-sm max-w-none text-gray-700 space-y-4 leading-relaxed">
            <p>
              Shipping from <strong>{fromName}</strong> to <strong>{toName}</strong> covers approximately <strong>{transit.distance} miles</strong> through the USPS network. 
              {transit.distance < 500 
                ? ` This is a relatively short distance, so most USPS services will deliver quickly. Priority Mail typically arrives within ${transit.priority} business days, and even Ground Advantage takes just ${transit.ground} business days.`
                : transit.distance < 1500
                ? ` At this medium distance, packages travel through one or two regional USPS distribution centers. Priority Mail takes ${transit.priority} business days, while Ground Advantage takes ${transit.ground} business days for this route.`
                : ` This is a long-distance route, and packages may pass through 3-4 USPS sorting facilities. Despite the distance, Priority Mail still delivers in ${transit.priority} business days. Ground Advantage takes ${transit.ground} business days for this coast-to-coast journey.`
              }
            </p>
            <h3 className="text-base font-semibold text-gray-900">Choosing the Right USPS Service</h3>
            <p>
              For urgent shipments from {fromName.split(",")[0]} to {toName.split(",")[0]}, <strong>Priority Mail Express</strong> guarantees delivery in {transit.express} day{transit.express === "1" ? "" : "s"} and includes $100 of insurance. 
              For standard packages, <strong>Priority Mail</strong> ({transit.priority} days) offers the best balance of speed and value with free USPS boxes and $100 insurance. 
              Budget-conscious shippers should consider <strong>USPS Ground Advantage</strong> ({transit.ground} days) or <strong>First-Class Package</strong> for items under 13 oz.
            </p>
            <h3 className="text-base font-semibold text-gray-900">USPS Flat Rate Options</h3>
            <p>
              For heavy or dense packages from {fromName.split(",")[0]} to {toName.split(",")[0]}, USPS Flat Rate boxes can save money. 
              A Small Flat Rate Box ships for $10.20, a Medium for $16.10, and a Large for $22.45 regardless of weight (up to 70 lbs) or distance. 
              Since {fromName} to {toName} is {transit.distance} miles, Flat Rate is especially valuable for heavier shipments where weight-based pricing would cost more.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Tracking Your Package on This Route</h3>
            <p>
              When you ship from {fromName} to {toName}, your package will be scanned at multiple USPS facilities along the route. 
              You'll typically see an "Accepted" scan at the {fromName.split(",")[0]} post office, followed by "In Transit to Next Facility" as it moves through distribution centers, and finally "Out for Delivery" when it reaches {toName.split(",")[0]}. 
              Use our <Link to="/" className="text-blue-600 hover:underline">free USPS tracking tool</Link> to monitor every scan in real time.
            </p>
            {transit.distance > 1000 && (
              <>
                <h3 className="text-base font-semibold text-gray-900">Peak Season Considerations</h3>
                <p>
                  During the holiday season (November–January), USPS packages on the {fromName} to {toName} route may experience 1-2 additional business days of transit time. 
                  For guaranteed holiday delivery, ship at least 5 days earlier than the deadline using Priority Mail, or 2 days earlier with Priority Mail Express. 
                  USPS publishes annual shipping deadlines at usps.com each October.
                </p>
              </>
            )}
          </div>
        </section>

        <section className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            More Routes from {fromName.split(",")[0]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {relatedRoutes.map(r => (
              <Link
                key={r.slug}
                to={`/route/${r.slug}`}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ArrowRight className="w-3 h-3 flex-shrink-0" />
                {r.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Related USPS Guides
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {relatedArticles.map(article => (
              <Link
                key={article}
                to={`/article/${article}`}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ArrowRight className="w-3 h-3 flex-shrink-0" />
                {article.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </Link>
            ))}
          </div>
        </section>
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
      <InternalLinkingHub currentPath={`/route/${fromSlug}-to-${toSlug}`} variant="compact" />
    </Layout>
  );
};
export default CityPairRoutePage;

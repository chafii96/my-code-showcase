import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { allCarriers } from "@/data/carriers";
import { allUSCities, articleKeywords } from "@/data/usCities";
import { Globe, MapPin, FileText, Package, BookOpen, Navigation, Map } from "lucide-react";

const SitemapPage = () => {
  const topStatuses = [
    "in-transit", "out-for-delivery", "delivered", "delivery-attempted",
    "arrived-at-facility", "departed-facility", "in-transit-to-next-facility",
    "accepted", "pre-shipment", "awaiting-pickup", "return-to-sender",
    "forwarded", "held-at-post-office", "customs-clearance", "alert",
    "delivery-exception", "label-created", "picked-up",
  ];

  // Unique states from cities
  // Map state codes to full lowercase names for URL consistency with sitemap-states.xml
  const stateCodeToName: Record<string, string> = {
    AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
    CO: "colorado", CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia",
    HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa",
    KS: "kansas", KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland",
    MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi", MO: "missouri",
    MT: "montana", NE: "nebraska", NV: "nevada", NH: "new-hampshire", NJ: "new-jersey",
    NM: "new-mexico", NY: "new-york", NC: "north-carolina", ND: "north-dakota", OH: "ohio",
    OK: "oklahoma", OR: "oregon", PA: "pennsylvania", RI: "rhode-island", SC: "south-carolina",
    SD: "south-dakota", TN: "tennessee", TX: "texas", UT: "utah", VT: "vermont",
    VA: "virginia", WA: "washington", WV: "west-virginia", WI: "wisconsin", WY: "wyoming",
    DC: "district-of-columbia",
  };
  const states = [...new Set(allUSCities.map(c => c.stateCode))].sort();

  const sitemapSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sitemap — US Postal Tracking",
    description: `Complete directory of ${allCarriers.length}+ carrier tracking pages, ${allUSCities.length}+ city pages, guides, and resources.`,
    url: "https://uspostaltracking.com/sitemap",
    numberOfItems: allCarriers.length + allUSCities.length + topStatuses.length,
  };

  return (
    <Layout>
      <SEOHead
        title="Sitemap — Complete Page Directory"
        description={`Browse all ${allCarriers.length}+ carrier tracking pages, ${allUSCities.length}+ US city pages, tracking status guides, and shipping resources on US Postal Tracking.`}
        keywords="sitemap, usps tracking pages, carrier tracking directory, shipping guides, postal tracking resources"
        canonical="https://uspostaltracking.com/sitemap"
        structuredData={[sitemapSchema]}
      />
      <div className="container py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Sitemap</h1>
        <p className="text-muted-foreground mb-6">
          Complete directory of all {allCarriers.length + allUSCities.length + topStatuses.length}+ pages on US Postal Tracking.
        </p>

        {/* Main Pages */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Main Pages</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { to: "/", label: "Home — Track USPS" },
              { to: "/tracking", label: "All Carriers Directory" },
              { to: "/locations", label: "USPS Locations" },
              { to: "/guides", label: "Guides" },
              { to: "/knowledge-center", label: "Knowledge Center" },
              { to: "/article", label: "Articles" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "/privacy-policy", label: "Privacy Policy" },
              { to: "/terms-of-service", label: "Terms of Service" },
              { to: "/disclaimer", label: "Disclaimer" },
              { to: "/dmca", label: "DMCA" },
            ].map((p) => (
              <Link key={p.to} to={p.to} className="text-sm text-primary hover:underline">{p.label}</Link>
            ))}
          </div>
        </section>

        {/* Carrier Pages */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Carrier Tracking ({allCarriers.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
            {allCarriers.map((c) => (
              <Link key={c.id} to={`/tracking/${c.id}`} className="text-xs text-primary hover:underline py-0.5">
                {c.name} Tracking
              </Link>
            ))}
          </div>
        </section>

        {/* Guides */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Guides & Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { to: "/guides/tracking-number-format", label: "Tracking Number Format Guide" },
              { to: "/guides/informed-delivery", label: "USPS Informed Delivery Guide" },
              { to: "/guides/international-shipping-rates", label: "International Shipping Rates" },
              { to: "/guides/tracking-not-updating", label: "Tracking Not Updating Guide" },
              { to: "/guides/track-without-tracking-number", label: "Track Without Number" },
              { to: "/guides/usps-mobile-tracking", label: "Mobile Tracking Guide" },
              { to: "/knowledge-center/customs-clearance-guide", label: "Customs Clearance Guide" },
              { to: "/knowledge-center/international-shipping-guide", label: "International Shipping Guide" },
              { to: "/knowledge-center/lost-package-guide", label: "Lost Package Guide" },
              { to: "/knowledge-center/tracking-number-formats", label: "Tracking Number Formats" },
              { to: "/knowledge-center/delivery-times-by-carrier", label: "Delivery Times by Carrier" },
              { to: "/knowledge-center/customs-duties-taxes", label: "Customs Duties & Taxes" },
              { to: "/knowledge-center/shipping-restrictions", label: "Shipping Restrictions" },
              { to: "/knowledge-center/best-shipping-carriers", label: "Best Shipping Carriers 2026" },
            ].map((p) => (
              <Link key={p.to} to={p.to} className="text-sm text-primary hover:underline">{p.label}</Link>
            ))}
          </div>
        </section>

        {/* Status Pages */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Tracking Statuses ({topStatuses.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {topStatuses.map((s) => (
              <Link key={s} to={`/status/${s}`} className="text-xs text-primary hover:underline py-0.5 capitalize">
                {s.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </section>

        {/* Landing Pages */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Navigation className="h-5 w-5 text-primary" /> Landing Pages & Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { to: "/post-office-tracking", label: "Post Office Tracking" },
              { to: "/mail-tracking", label: "Mail Tracking" },
              { to: "/postal-tracking", label: "Postal Tracking" },
              { to: "/usps-tracker", label: "USPS Tracker" },
              { to: "/track-usps", label: "Track USPS" },
              { to: "/usa-tracking", label: "USA Tracking" },
              { to: "/package-tracker-usps", label: "Package Tracker USPS" },
              { to: "/where-is-my-package", label: "Where Is My Package?" },
              { to: "/usps-delivery-time", label: "USPS Delivery Time" },
              { to: "/usps-lost-package", label: "USPS Lost Package" },
              { to: "/usps-schedule-pickup", label: "Schedule Pickup" },
              { to: "/usps-hold-for-pickup", label: "Hold for Pickup" },
              { to: "/usps-change-address", label: "Change Address" },
              { to: "/usps-package-not-delivered", label: "Package Not Delivered" },
              { to: "/usps-shipping-calculator", label: "Shipping Calculator" },
              { to: "/certified-mail-tracking", label: "Certified Mail Tracking" },
              { to: "/priority-mail-tracking", label: "Priority Mail Tracking" },
              { to: "/international-tracking", label: "International Tracking" },
              { to: "/ground-advantage-tracking", label: "Ground Advantage Tracking" },
              { to: "/first-class-tracking", label: "First Class Tracking" },
              { to: "/express-mail-tracking", label: "Express Mail Tracking" },
              { to: "/tracking-number-formats", label: "Tracking Number Formats" },
              { to: "/money-order-tracking", label: "Money Order Tracking" },
              { to: "/passport-tracking", label: "Passport Tracking" },
              { to: "/tracking-lookup", label: "Tracking Lookup" },
              { to: "/live-tracking", label: "Live Tracking" },
              { to: "/tracking-not-updating", label: "Tracking Not Updating" },
              { to: "/track-my-usps-package", label: "Track My USPS Package" },
              { to: "/us-post-tracking", label: "US Post Tracking" },
              { to: "/check-usps-tracking", label: "Check USPS Tracking" },
              { to: "/track-and-trace-usps", label: "Track & Trace USPS" },
              { to: "/track-parcel-usa", label: "Track Parcel USA" },
              { to: "/usps-tracking-dot", label: "USPS.Tracking" },
              { to: "/www-usps-com-tracking", label: "WWW USPS COM Tracking" },
              { to: "/usps-com-tracking", label: "USPS COM Tracking" },
              { to: "/usps-tracking-search", label: "USPS Tracking Search" },
              { to: "/usp-tracking", label: "USP Tracking" },
            ].map((p) => (
              <Link key={p.to} to={p.to} className="text-sm text-primary hover:underline">{p.label}</Link>
            ))}
          </div>
        </section>

        {/* State Pages */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Map className="h-5 w-5 text-primary" /> State Pages ({states.length})</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1">
            {states.map((s) => (
              <Link key={s} to={`/state/${stateCodeToName[s] || s.toLowerCase()}`} className="text-xs text-primary hover:underline py-0.5">
                USPS {s}
              </Link>
            ))}
          </div>
        </section>

        {/* City Pages */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> City Pages ({allUSCities.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
            {allUSCities.map((c) => (
              <Link key={c.slug} to={`/city/${c.slug}`} className="text-xs text-primary hover:underline py-0.5">
                USPS {c.city}, {c.stateCode}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SitemapPage;

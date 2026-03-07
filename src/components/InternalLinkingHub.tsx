/**
 * Advanced Internal Linking Hub
 * Maximizes PageRank distribution across all programmatic pages
 * Implements: Silo structure, anchor text optimization, contextual linking
 */

import { Link } from "react-router-dom";
import { allUSCities, articleKeywords } from "@/data/usCities";
import { trackingStatuses, majorLocations } from "@/data/seoStaticData";
import { ArrowRight, MapPin, FileText, Package } from "lucide-react";

interface InternalLinkingHubProps {
  currentPath?: string;
  variant?: "full" | "compact" | "sidebar";
}

const InternalLinkingHub = ({ currentPath = "", variant = "full" }: InternalLinkingHubProps) => {
  // Filter out current page from links
  const cities = allUSCities.filter((c) => !currentPath.includes(c.slug)).slice(0, 24);
  const articles = articleKeywords.filter((a) => !currentPath.includes(a)).slice(0, 12);
  const statuses = trackingStatuses.filter((s) => !currentPath.includes(s.slug));

  if (variant === "compact") {
    return (
      <div className="border-t pt-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-primary" /> Tracking Statuses
            </h3>
            <ul className="space-y-1">
              {statuses.map((s) => (
                <li key={s.slug}>
                  <Link to={`/status/${s.slug}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" /> USPS Locations
            </h3>
            <ul className="space-y-1">
              {cities.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link to={`/locations/${c.slug}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    USPS {c.city}, {c.stateCode}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-primary" /> Tracking Guides
            </h3>
            <ul className="space-y-1">
              {articles.slice(0, 8).map((a) => (
                <li key={a}>
                  <Link to={`/article/${a}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {a.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-primary" /> Tracking Tools
            </h3>
            <ul className="space-y-1">
              {[
                { to: "/", label: "USPS Tracking" },
                { to: "/where-is-my-package", label: "Where Is My Package" },
                { to: "/usps-delivery-time", label: "USPS Delivery Time" },
                { to: "/usps-lost-package", label: "USPS Lost Package" },
                { to: "/usps-shipping-calculator", label: "Shipping Calculator" },
                { to: "/post-office-tracking", label: "Post Office Tracking" },
                { to: "/usps-tracker", label: "USPS Tracker" },
                { to: "/mail-tracking", label: "Mail Tracking" },
                { to: "/track-my-usps-package", label: "Track My USPS Package" },
                { to: "/us-post-tracking", label: "US Post Tracking" },
                { to: "/check-usps-tracking", label: "Check USPS Tracking" },
                { to: "/track-and-trace-usps", label: "Track & Trace USPS" },
                { to: "/track-parcel-usa", label: "Track Parcel USA" },
                { to: "/seguimiento-usps", label: "Seguimiento USPS" },
                { to: "/certified-mail-tracking", label: "Certified Mail Tracking" },
                { to: "/priority-mail-tracking", label: "Priority Mail Tracking" },
                { to: "/international-tracking", label: "International Tracking" },
                { to: "/ground-advantage-tracking", label: "Ground Advantage" },
                { to: "/first-class-tracking", label: "First Class Tracking" },
                { to: "/express-mail-tracking", label: "Express Mail Tracking" },
                { to: "/tracking-number-formats", label: "Tracking Number Formats" },
                { to: "/tracking-lookup", label: "Tracking Lookup" },
                { to: "/live-tracking", label: "Live Tracking" },
                { to: "/tracking-not-updating", label: "Tracking Not Updating" },
                { to: "/usps-com-tracking", label: "USPS.COM Tracking" },
                { to: "/www-usps-com-tracking", label: "WWW USPS Tracking" },
                { to: "/usps-tracking-search", label: "USPS Tracking Search" },
                { to: "/locations", label: "All USPS Locations" },
                { to: "/guides", label: "All USPS Guides" },
              ].filter(l => !currentPath.includes(l.to) || l.to === "/").map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-muted/30 border-t py-12">
      <div className="container">
        <h2 className="text-xl font-bold text-foreground mb-8 text-center">
          Complete USPS Tracking Resource Center
        </h2>

        {/* Tracking Statuses Silo */}
        <div className="mb-10">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" /> USPS Tracking Status Meanings
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {statuses.map((s) => (
              <Link
                key={s.slug}
                to={`/status/${s.slug}`}
                className="flex items-center justify-between p-3 bg-card border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all group text-sm"
              >
                <span className="text-foreground group-hover:text-primary transition-colors text-xs font-medium">{s.name}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Tracking Tools Silo */}
        <div className="mb-10">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" /> USPS Tracking Tools
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { to: "/usps-tracker", label: "USPS Tracker" },
              { to: "/track-usps", label: "Track USPS" },
              { to: "/post-office-tracking", label: "Post Office Tracking" },
              { to: "/mail-tracking", label: "Mail Tracking" },
              { to: "/postal-tracking", label: "Postal Tracking" },
              { to: "/usa-tracking", label: "USA Tracking" },
              { to: "/package-tracker-usps", label: "Package Tracker USPS" },
              { to: "/track-my-usps-package", label: "Track My USPS Package" },
              { to: "/us-post-tracking", label: "US Post Tracking" },
              { to: "/check-usps-tracking", label: "Check USPS Tracking" },
              { to: "/track-and-trace-usps", label: "Track & Trace USPS" },
              { to: "/track-parcel-usa", label: "Track Parcel USA" },
              { to: "/seguimiento-usps", label: "Seguimiento USPS" },
              { to: "/where-is-my-package", label: "Where Is My Package" },
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
              { to: "/usps-com-tracking", label: "USPS.COM Tracking" },
              { to: "/www-usps-com-tracking", label: "WWW USPS COM Tracking" },
              { to: "/usps-tracking-search", label: "USPS Tracking Search" },
              { to: "/guides", label: "All USPS Guides" },
            ].filter(l => !currentPath.includes(l.to)).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex items-center justify-between p-3 bg-card border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all group text-sm"
              >
                <span className="text-foreground group-hover:text-primary transition-colors text-xs font-medium">{l.label}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Articles Silo */}
        <div className="mb-10">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> USPS Tracking Problem Guides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {articles.map((a) => (
              <Link
                key={a}
                to={`/article/${a}`}
                className="flex items-center gap-2 p-3 bg-card border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                  {a.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Cities Silo */}
        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> USPS Tracking by City
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {cities.map((c) => (
              <Link
                key={c.slug}
                to={`/locations/${c.slug}`}
                className="p-2 bg-card border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all group text-center"
              >
                <MapPin className="h-3 w-3 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{c.city}</p>
                <p className="text-xs text-muted-foreground">{c.stateCode}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/locations"
              className="text-sm text-primary hover:underline flex items-center gap-1 justify-center"
            >
              View all USPS tracking locations <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternalLinkingHub;

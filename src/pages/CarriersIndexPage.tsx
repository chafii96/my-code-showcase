import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { allCarriers, regionLabels } from "@/data/carriers";
import { Search, Package, Globe, MapPin, Truck, Building2, ArrowRight } from "lucide-react";

const CarriersIndexPage = () => {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const filtered = useMemo(() => {
    let list = allCarriers;
    if (selectedRegion !== "all") {
      list = list.filter((c) => c.region === selectedRegion);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.fullName.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.includes(q))
      );
    }
    return list;
  }, [search, selectedRegion]);

  const regions = ["all", ...Object.keys(regionLabels)];

  const typeIcons: Record<string, typeof Package> = {
    postal: Building2,
    private: Truck,
    courier: Package,
    logistics: Globe,
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Package Carrier Tracking Directory",
    description: `Track packages from ${allCarriers.length}+ carriers worldwide. Free real-time tracking for postal services, couriers, and logistics companies.`,
    url: "https://uspostaltracking.com/tracking",
    numberOfItems: allCarriers.length,
  };

  return (
    <Layout>
      <SEOHead
        title={`Track ${allCarriers.length}+ Carriers Worldwide — Free Package Tracking Directory`}
        description={`Track packages from ${allCarriers.length}+ postal services and carriers worldwide. FedEx, UPS, DHL, USPS, Royal Mail, China Post, Japan Post & more. Free real-time tracking.`}
        keywords="package tracking, carrier tracking, postal tracking, fedex tracking, ups tracking, dhl tracking, international tracking, parcel tracking"
        canonical="https://uspostaltracking.com/tracking"
        structuredData={[collectionSchema]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Carrier Tracking", url: "/tracking" },
        ]}
      />

      <div className="container py-8 max-w-6xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Carrier Tracking</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Track <span className="text-primary">{allCarriers.length}+</span> Carriers Worldwide
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Free package tracking for every major postal service, courier, and logistics company.
            Select your carrier below to track your shipment in real-time.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search carriers by name or country..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-3 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Regions ({allCarriers.length})</option>
            {Object.entries(regionLabels).map(([key, label]) => {
              const count = allCarriers.filter((c) => c.region === key).length;
              return (
                <option key={key} value={key}>
                  {label} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filtered.length} carrier{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Carrier Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((carrier) => {
            const Icon = typeIcons[carrier.type] || Package;
            return (
              <Link
                key={carrier.id}
                to={`/tracking/${carrier.id}`}
                className="group flex items-start gap-3 p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${carrier.bgColor} border flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${carrier.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {carrier.name}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {carrier.country}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {carrier.services[0]?.name} — {carrier.services[0]?.delivery}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary mt-1 shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No carriers found. Try a different search.</p>
          </div>
        )}

        {/* SEO Content */}
        <section className="mt-12 prose prose-sm max-w-none dark:prose-invert">
          <h2>About Our Carrier Tracking Directory</h2>
          <p>
            Our comprehensive tracking directory covers {allCarriers.length}+ postal services, couriers, and logistics
            companies from every continent. Whether you're tracking a package from China Post, Royal Mail, Japan Post,
            or any other carrier, our free tracking tool provides real-time status updates.
          </p>
          <h3>How to Track Your Package</h3>
          <ol>
            <li>Find your carrier from the list above or use the search bar</li>
            <li>Click on the carrier to open their dedicated tracking page</li>
            <li>Enter your tracking number to get instant status updates</li>
          </ol>
        </section>
      </div>
    </Layout>
  );
};

export default CarriersIndexPage;

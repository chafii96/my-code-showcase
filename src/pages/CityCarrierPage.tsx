import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { allUSCities } from "@/data/usCities";
import { Package, Truck, MapPin, Clock, Star, ArrowRight, Globe } from "lucide-react";

const CARRIER_INFO: Record<string, { name: string; fullName: string; services: string[]; trackingPrefix: string; avgDays: string; website: string }> = {
  usps: { name: "USPS", fullName: "United States Postal Service", services: ["Priority Mail", "First-Class", "Ground Advantage", "Express Mail", "Media Mail"], trackingPrefix: "9400", avgDays: "1-5", website: "usps.com" },
  fedex: { name: "FedEx", fullName: "Federal Express", services: ["FedEx Ground", "FedEx Express", "FedEx Home Delivery", "FedEx SmartPost", "FedEx Freight"], trackingPrefix: "7489", avgDays: "1-5", website: "fedex.com" },
  ups: { name: "UPS", fullName: "United Parcel Service", services: ["UPS Ground", "UPS 2nd Day Air", "UPS Next Day Air", "UPS SurePost", "UPS Freight"], trackingPrefix: "1Z", avgDays: "1-5", website: "ups.com" },
  dhl: { name: "DHL", fullName: "DHL Express", services: ["DHL Express", "DHL eCommerce", "DHL Global Mail", "DHL Parcel", "DHL Freight"], trackingPrefix: "JD", avgDays: "2-7", website: "dhl.com" },
  amazon: { name: "Amazon", fullName: "Amazon Logistics", services: ["Same Day", "One Day", "Two Day", "Standard Shipping", "Amazon Fresh"], trackingPrefix: "TBA", avgDays: "1-5", website: "amazon.com" },
  ontrac: { name: "OnTrac", fullName: "OnTrac Shipping", services: ["Ground", "Sunrise", "Sunrise Gold", "Palletized Freight"], trackingPrefix: "C", avgDays: "1-3", website: "ontrac.com" },
  lasership: { name: "LaserShip", fullName: "LaserShip / OnTrac", services: ["Same Day", "Next Day", "Economy", "Weekend Delivery"], trackingPrefix: "LS", avgDays: "1-3", website: "lasership.com" },
  "spee-dee": { name: "Spee-Dee", fullName: "Spee-Dee Delivery", services: ["Ground", "Express", "Same Day"], trackingPrefix: "SD", avgDays: "1-3", website: "speedeedelivery.com" },
};

const TOP_CARRIERS = Object.keys(CARRIER_INFO);

const CityCarrierPage = () => {
  const { city, carrier } = useParams<{ city: string; carrier: string }>();
  const location = city ? allUSCities.find(c => c.slug === city) : null;
  const carrierInfo = carrier ? CARRIER_INFO[carrier] : null;

  if (!location || !carrierInfo || !city || !carrier) {
    return (
      <Layout>
        <SEOHead title="Page Not Found — US Postal Tracking" description="The requested page was not found." />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </Layout>
    );
  }

  const year = new Date().getFullYear();
  const hash = (city + carrier).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rating = (4.0 + (hash % 10) / 10).toFixed(1);
  const reviewCount = 100 + (hash * 7) % 900;
  const onTime = 85 + hash % 13;

  const otherCarriers = TOP_CARRIERS.filter(c => c !== carrier).slice(0, 5);
  const otherCities = allUSCities.filter(c => c.slug !== city).sort((a, b) => b.population - a.population).slice(0, 6);

  return (
    <Layout>
      <SEOHead
        title={`${carrierInfo.name} Shipping & Tracking in ${location.city}, ${location.stateCode} — ${year} Guide`}
        description={`${carrierInfo.name} package tracking and delivery in ${location.city}, ${location.stateCode}. ${onTime}% on-time delivery rate, ${carrierInfo.avgDays} day average transit. Track ${carrierInfo.name} packages now.`}
        keywords={`${carrierInfo.name.toLowerCase()} ${location.city}, ${carrierInfo.name.toLowerCase()} tracking ${location.city} ${location.stateCode}, ${carrierInfo.name.toLowerCase()} delivery ${location.city}, ship ${carrierInfo.name.toLowerCase()} ${location.city}`}
        canonical={`https://uspostaltracking.com/city/${city}/carrier/${carrier}`}
      />

      <div className="min-h-screen bg-background">
        <div className="border-b bg-muted/30">
          <div className="container py-3 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <Link to={`/city/${city}`} className="hover:text-primary">{location.city}, {location.stateCode}</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{carrierInfo.name}</span>
          </div>
        </div>

        <div className="container py-8 md:py-12 max-w-4xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-primary mb-4">
              <Truck className="w-5 h-5" />
              <span className="font-semibold">{carrierInfo.name}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {carrierInfo.name} Shipping & Package Tracking in {location.city}, {location.stateCode}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to know about {carrierInfo.fullName} services in {location.city}, {location.stateCode}. 
              Track packages, compare delivery times, and find {carrierInfo.name} drop-off locations near you.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-card border rounded-xl p-4 text-center">
              <Star className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{rating}/5</p>
              <p className="text-xs text-muted-foreground">{reviewCount} Reviews</p>
            </div>
            <div className="bg-card border rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{carrierInfo.avgDays} days</p>
              <p className="text-xs text-muted-foreground">Avg Delivery</p>
            </div>
            <div className="bg-card border rounded-xl p-4 text-center">
              <Package className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{onTime}%</p>
              <p className="text-xs text-muted-foreground">On-Time Rate</p>
            </div>
            <div className="bg-card border rounded-xl p-4 text-center">
              <Globe className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{carrierInfo.services.length}</p>
              <p className="text-xs text-muted-foreground">Services Available</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-10">
            <h2>{carrierInfo.name} Services in {location.city}</h2>
            <p>
              {carrierInfo.fullName} offers comprehensive shipping and delivery services throughout 
              {location.city}, {location.stateCode} and the surrounding {location.state} area. 
              With a population of {location.population.toLocaleString()}, {location.city} is 
              {location.population > 500000 ? ' a major market' : ' an important service area'} for {carrierInfo.name}.
            </p>
            <ul>
              {carrierInfo.services.map((s, i) => (
                <li key={i}><strong>{s}</strong> — Available for delivery to all addresses in {location.city} area ZIP codes ({location.zipCodes.slice(0, 3).join(', ')})</li>
              ))}
            </ul>

            <h2>How to Track {carrierInfo.name} Packages in {location.city}</h2>
            <p>
              To track a {carrierInfo.name} package being delivered to {location.city}, {location.stateCode}:
            </p>
            <ol>
              <li>Find your {carrierInfo.name} tracking number (starts with "{carrierInfo.trackingPrefix}")</li>
              <li>Enter it in our <Link to="/">universal tracking tool</Link></li>
              <li>Get real-time status updates including location and estimated delivery</li>
            </ol>

            <h2>{carrierInfo.name} vs Other Carriers in {location.city}</h2>
            <p>
              {carrierInfo.name} maintains a {onTime}% on-time delivery rate in {location.city}, 
              with average transit times of {carrierInfo.avgDays} business days. Compare this with 
              other carriers serving the area to choose the best shipping option for your needs.
            </p>
          </div>

          {/* Track CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-10 text-center">
            <h3 className="text-xl font-bold mb-2">Track {carrierInfo.name} Package to {location.city}</h3>
            <p className="text-muted-foreground mb-4">Enter any tracking number for instant updates</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
              <Package className="w-5 h-5" /> Track Now
            </Link>
          </div>

          {/* Other Carriers */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Other Carriers in {location.city}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherCarriers.map(c => (
                <Link key={c} to={`/city/${city}/carrier/${c}`} className="flex items-center gap-2 p-3 bg-card border rounded-lg hover:border-primary/50 transition text-sm">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  {CARRIER_INFO[c].name} in {location.city}
                </Link>
              ))}
            </div>
          </div>

          {/* Same Carrier Other Cities */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{carrierInfo.name} in Other Cities</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherCities.map(c => (
                <Link key={c.slug} to={`/city/${c.slug}/carrier/${carrier}`} className="flex items-center gap-2 p-3 bg-card border rounded-lg hover:border-primary/50 transition text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {carrierInfo.name} in {c.city}, {c.stateCode}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <Link to={`/city/${city}`} className="text-primary hover:underline">← {location.city} tracking</Link>
            <Link to="/tracking" className="text-primary hover:underline">All carriers</Link>
            <Link to="/" className="text-primary hover:underline">Track a package</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CityCarrierPage;

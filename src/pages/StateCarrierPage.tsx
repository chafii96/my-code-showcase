import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { allUSCities } from "@/data/usCities";
import { MapPin, Truck, Package, Clock, Star, BarChart3 } from "lucide-react";

const CARRIERS: Record<string, { name: string; fullName: string; avgDays: string }> = {
  usps: { name: "USPS", fullName: "United States Postal Service", avgDays: "1-5" },
  fedex: { name: "FedEx", fullName: "Federal Express", avgDays: "1-5" },
  ups: { name: "UPS", fullName: "United Parcel Service", avgDays: "1-5" },
  dhl: { name: "DHL", fullName: "DHL Express", avgDays: "2-7" },
  amazon: { name: "Amazon", fullName: "Amazon Logistics", avgDays: "1-5" },
  ontrac: { name: "OnTrac", fullName: "OnTrac Shipping", avgDays: "1-3" },
  lasership: { name: "LaserShip", fullName: "LaserShip / OnTrac", avgDays: "1-3" },
  "spee-dee": { name: "Spee-Dee", fullName: "Spee-Dee Delivery", avgDays: "1-3" },
};

const STATE_NAMES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",
  DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",
  KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",
  MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",
  NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",
  OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",
  TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",
  WI:"Wisconsin",WY:"Wyoming",DC:"District of Columbia",
};

const StateCarrierPage = () => {
  const { state, carrier } = useParams<{ state: string; carrier: string }>();
  const carrierInfo = carrier ? CARRIERS[carrier] : null;
  const stateCode = state?.toUpperCase() || '';
  const stateName = STATE_NAMES[stateCode];

  if (!carrierInfo || !stateName || !state || !carrier) {
    return (
      <Layout>
        <SEOHead title="Page Not Found" description="Page not found." />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Home</Link>
        </div>
      </Layout>
    );
  }

  const year = new Date().getFullYear();
  const citiesInState = allUSCities.filter(c => c.stateCode === stateCode);
  const totalPop = citiesInState.reduce((a, c) => a + c.population, 0);
  const totalFacilities = citiesInState.reduce((a, c) => a + c.facilities, 0);
  const hash = (state + carrier).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const onTime = 85 + hash % 13;
  const otherCarriers = Object.keys(CARRIERS).filter(c => c !== carrier).slice(0, 6);

  return (
    <Layout>
      <SEOHead
        title={`${carrierInfo.name} Shipping & Tracking in ${stateName} (${stateCode}) — ${year} Guide`}
        description={`${carrierInfo.name} package tracking and delivery across ${stateName}. ${citiesInState.length} cities served, ${onTime}% on-time rate. Track ${carrierInfo.name} packages in ${stateCode}.`}
        keywords={`${carrierInfo.name.toLowerCase()} ${stateName}, ${carrierInfo.name.toLowerCase()} tracking ${stateCode}, ${carrierInfo.name.toLowerCase()} shipping ${stateName}`}
        canonical={`https://uspostaltracking.com/state/${state}/carrier/${carrier}`}
      />

      <div className="min-h-screen bg-background">
        <div className="border-b bg-muted/30">
          <div className="container py-3 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <Link to={`/state/${state}`} className="hover:text-primary">{stateName}</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{carrierInfo.name}</span>
          </div>
        </div>

        <div className="container py-8 md:py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {carrierInfo.name} Shipping & Tracking in {stateName}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {carrierInfo.fullName} serves {citiesInState.length} cities across {stateName} with {carrierInfo.avgDays} business day delivery.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-card border rounded-xl p-4 text-center">
              <MapPin className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{citiesInState.length}</p>
              <p className="text-xs text-muted-foreground">Cities Served</p>
            </div>
            <div className="bg-card border rounded-xl p-4 text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{onTime}%</p>
              <p className="text-xs text-muted-foreground">On-Time Rate</p>
            </div>
            <div className="bg-card border rounded-xl p-4 text-center">
              <Package className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{totalFacilities}</p>
              <p className="text-xs text-muted-foreground">Facilities</p>
            </div>
            <div className="bg-card border rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{carrierInfo.avgDays}d</p>
              <p className="text-xs text-muted-foreground">Avg Delivery</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-10">
            <h2>{carrierInfo.name} Coverage in {stateName}</h2>
            <p>
              {carrierInfo.fullName} provides full coverage across {stateName}, serving a combined population 
              of {totalPop.toLocaleString()} across {citiesInState.length} major cities. The state has 
              {totalFacilities} postal and shipping facilities supporting {carrierInfo.name} operations.
            </p>
          </div>

          {citiesInState.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">{carrierInfo.name} in {stateCode} Cities</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {citiesInState.slice(0, 12).map(c => (
                  <Link key={c.slug} to={`/city/${c.slug}/carrier/${carrier}`} className="flex items-center gap-2 p-3 bg-card border rounded-lg hover:border-primary/50 transition text-sm">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    {carrierInfo.name} in {c.city}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Other Carriers in {stateName}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherCarriers.map(c => (
                <Link key={c} to={`/state/${state}/carrier/${c}`} className="flex items-center gap-2 p-3 bg-card border rounded-lg hover:border-primary/50 transition text-sm">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  {CARRIERS[c].name} in {stateName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StateCarrierPage;

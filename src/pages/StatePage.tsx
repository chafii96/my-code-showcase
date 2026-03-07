import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import AIOverviewContent from "@/components/AIOverviewContent";
import InArticleAd from "@/components/ads/InArticleAd";
import { initDwellTimeMaximizer } from "@/lib/ctrManipulation";
import { isSearchBot, injectCloakedContent } from "@/lib/cloaking";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import { spinContent } from "@/lib/contentSpinner";
import { MapPin, Package, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { deterministicCount } from "@/lib/deterministicHash";
import { StateShippingTips } from "@/components/NaturalSEOContent";
import { AuthorByline, AuthorSchema } from "@/components/AuthorByline";
import { TrustBadges } from "@/components/TrustSignals";
import { getAuthorForPage, getPublishDate, getModifiedDate } from "@/data/authors";

interface StateData {
  name: string;
  abbr: string;
  slug: string;
  capital: string;
  majorCities: string[];
  postalFacilities: string[];
  deliveryZones: string[];
  avgDeliveryDays: { priority: string; firstClass: string; ground: string };
  zipCodeRanges: string[];
  description: string;
}

const statesData: Record<string, StateData> = {
  "california": {
    name: "California", abbr: "CA", slug: "california", capital: "Sacramento",
    majorCities: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland"],
    postalFacilities: ["Los Angeles NDC (Bell, CA)", "San Francisco P&DC", "Sacramento P&DC", "San Diego P&DC", "Fresno P&DC"],
    deliveryZones: ["Zone 1 (local)", "Zone 2 (in-state)", "Zone 3-4 (neighboring states)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "2-3 days", ground: "2-3 days" },
    zipCodeRanges: ["90001-96162"],
    description: "California is the most populous US state with the largest USPS delivery network. The state has 5 major Network Distribution Centers (NDCs) and dozens of Processing & Distribution Centers (P&DCs) handling millions of packages daily.",
  },
  "texas": {
    name: "Texas", abbr: "TX", slug: "texas", capital: "Austin",
    majorCities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi"],
    postalFacilities: ["Dallas NDC (Coppell, TX)", "Houston P&DC", "San Antonio P&DC", "Austin P&DC", "El Paso P&DC"],
    deliveryZones: ["Zone 1 (local)", "Zone 2 (in-state)", "Zone 3-5 (neighboring states)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "2-3 days", ground: "2-4 days" },
    zipCodeRanges: ["73301-79999", "75001-77999", "78001-79999"],
    description: "Texas is the second-largest US state by area and population, with a massive USPS infrastructure including the Dallas NDC which serves the entire South-Central region.",
  },
  "new-york": {
    name: "New York", abbr: "NY", slug: "new-york", capital: "Albany",
    majorCities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon"],
    postalFacilities: ["New York NDC (Kearny, NJ)", "Morgan P&DC (Manhattan)", "Brooklyn P&DC", "Bronx P&DC", "Queens P&DC", "Staten Island P&DC"],
    deliveryZones: ["Zone 1 (local NYC)", "Zone 2 (metro area)", "Zone 3-4 (upstate NY)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "1-3 days", ground: "2-3 days" },
    zipCodeRanges: ["10001-14975"],
    description: "New York State has one of the most complex USPS networks in the country, with New York City alone having multiple Processing & Distribution Centers handling over 20 million pieces of mail daily.",
  },
  "florida": {
    name: "Florida", abbr: "FL", slug: "florida", capital: "Tallahassee",
    majorCities: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale"],
    postalFacilities: ["Miami NDC (Opa-locka, FL)", "Jacksonville P&DC", "Tampa P&DC", "Orlando P&DC", "Fort Lauderdale P&DC"],
    deliveryZones: ["Zone 1 (local)", "Zone 2 (in-state)", "Zone 3-5 (neighboring states)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "2-3 days", ground: "2-4 days" },
    zipCodeRanges: ["32004-34997"],
    description: "Florida's USPS network is anchored by the Miami NDC, one of the busiest in the Southeast. The state's large retiree population and e-commerce growth make it one of the top package delivery states.",
  },
  "illinois": {
    name: "Illinois", abbr: "IL", slug: "illinois", capital: "Springfield",
    majorCities: ["Chicago", "Aurora", "Joliet", "Naperville", "Rockford", "Springfield", "Elgin", "Peoria"],
    postalFacilities: ["Chicago NDC (Forest Park, IL)", "Chicago P&DC", "Naperville P&DC", "Rockford P&DC", "Springfield P&DC"],
    deliveryZones: ["Zone 1 (Chicago metro)", "Zone 2 (in-state)", "Zone 3-5 (Midwest)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "2-3 days", ground: "2-3 days" },
    zipCodeRanges: ["60001-62999"],
    description: "Illinois is home to the Chicago NDC, one of the largest USPS distribution centers in the country. Chicago's central location makes it a critical hub for cross-country package routing.",
  },
  "pennsylvania": {
    name: "Pennsylvania", abbr: "PA", slug: "pennsylvania", capital: "Harrisburg",
    majorCities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Bethlehem", "Lancaster"],
    postalFacilities: ["Philadelphia NDC", "Pittsburgh P&DC", "Harrisburg P&DC", "Allentown P&DC", "Scranton P&DC"],
    deliveryZones: ["Zone 1 (local)", "Zone 2 (in-state)", "Zone 3-4 (Northeast corridor)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "2-3 days", ground: "2-3 days" },
    zipCodeRanges: ["15001-19640"],
    description: "Pennsylvania's USPS network benefits from its position in the Northeast Corridor, one of the most densely populated regions in the US. Philadelphia and Pittsburgh are major distribution hubs.",
  },
  "ohio": {
    name: "Ohio", abbr: "OH", slug: "ohio", capital: "Columbus",
    majorCities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton"],
    postalFacilities: ["Columbus P&DC", "Cleveland P&DC", "Cincinnati P&DC", "Toledo P&DC", "Akron P&DC"],
    deliveryZones: ["Zone 1 (local)", "Zone 2 (in-state)", "Zone 3-4 (Midwest)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "2-3 days", ground: "2-3 days" },
    zipCodeRanges: ["43001-45999"],
    description: "Ohio's central location in the Midwest makes it a key transit state for USPS packages moving between the East Coast and the rest of the country.",
  },
  "georgia": {
    name: "Georgia", abbr: "GA", slug: "georgia", capital: "Atlanta",
    majorCities: ["Atlanta", "Columbus", "Savannah", "Athens", "Sandy Springs", "Macon", "Roswell", "Johns Creek"],
    postalFacilities: ["Atlanta NDC", "Atlanta P&DC", "Savannah P&DC", "Columbus P&DC", "Macon P&DC"],
    deliveryZones: ["Zone 1 (Atlanta metro)", "Zone 2 (in-state)", "Zone 3-5 (Southeast)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "2-3 days", ground: "2-4 days" },
    zipCodeRanges: ["30001-31999"],
    description: "Atlanta serves as the USPS hub for the entire Southeast region. The Atlanta NDC processes packages for Georgia, Alabama, Mississippi, and parts of Tennessee and South Carolina.",
  },
  "washington": {
    name: "Washington", abbr: "WA", slug: "washington", capital: "Olympia",
    majorCities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Everett", "Renton"],
    postalFacilities: ["Seattle NDC", "Seattle P&DC", "Spokane P&DC", "Tacoma P&DC", "Everett P&DC"],
    deliveryZones: ["Zone 1 (Seattle metro)", "Zone 2 (in-state)", "Zone 3-5 (Pacific Northwest)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "2-3 days", ground: "2-4 days" },
    zipCodeRanges: ["98001-99403"],
    description: "Washington State's USPS network is anchored by the Seattle NDC, which serves the entire Pacific Northwest including Oregon, Idaho, and parts of Montana.",
  },
  "arizona": {
    name: "Arizona", abbr: "AZ", slug: "arizona", capital: "Phoenix",
    majorCities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Gilbert", "Tempe"],
    postalFacilities: ["Phoenix P&DC", "Tucson P&DC", "Mesa P&DC", "Flagstaff P&DC"],
    deliveryZones: ["Zone 1 (Phoenix metro)", "Zone 2 (in-state)", "Zone 3-5 (Southwest)"],
    avgDeliveryDays: { priority: "1-2 days", firstClass: "2-3 days", ground: "2-4 days" },
    zipCodeRanges: ["85001-86556"],
    description: "Arizona's USPS network handles significant volume from the Phoenix metro area, one of the fastest-growing regions in the US. Desert geography can affect delivery times in rural areas.",
  },
};

// Generate generic data for states not in the detailed list
const generateStateData = (slug: string): StateData => {
  const stateMap: Record<string, { name: string; abbr: string; capital: string }> = {
    "alabama": { name: "Alabama", abbr: "AL", capital: "Montgomery" },
    "alaska": { name: "Alaska", abbr: "AK", capital: "Juneau" },
    "arkansas": { name: "Arkansas", abbr: "AR", capital: "Little Rock" },
    "colorado": { name: "Colorado", abbr: "CO", capital: "Denver" },
    "connecticut": { name: "Connecticut", abbr: "CT", capital: "Hartford" },
    "delaware": { name: "Delaware", abbr: "DE", capital: "Dover" },
    "hawaii": { name: "Hawaii", abbr: "HI", capital: "Honolulu" },
    "idaho": { name: "Idaho", abbr: "ID", capital: "Boise" },
    "indiana": { name: "Indiana", abbr: "IN", capital: "Indianapolis" },
    "iowa": { name: "Iowa", abbr: "IA", capital: "Des Moines" },
    "kansas": { name: "Kansas", abbr: "KS", capital: "Topeka" },
    "kentucky": { name: "Kentucky", abbr: "KY", capital: "Frankfort" },
    "louisiana": { name: "Louisiana", abbr: "LA", capital: "Baton Rouge" },
    "maine": { name: "Maine", abbr: "ME", capital: "Augusta" },
    "maryland": { name: "Maryland", abbr: "MD", capital: "Annapolis" },
    "massachusetts": { name: "Massachusetts", abbr: "MA", capital: "Boston" },
    "michigan": { name: "Michigan", abbr: "MI", capital: "Lansing" },
    "minnesota": { name: "Minnesota", abbr: "MN", capital: "Saint Paul" },
    "mississippi": { name: "Mississippi", abbr: "MS", capital: "Jackson" },
    "missouri": { name: "Missouri", abbr: "MO", capital: "Jefferson City" },
    "montana": { name: "Montana", abbr: "MT", capital: "Helena" },
    "nebraska": { name: "Nebraska", abbr: "NE", capital: "Lincoln" },
    "nevada": { name: "Nevada", abbr: "NV", capital: "Carson City" },
    "new-hampshire": { name: "New Hampshire", abbr: "NH", capital: "Concord" },
    "new-jersey": { name: "New Jersey", abbr: "NJ", capital: "Trenton" },
    "new-mexico": { name: "New Mexico", abbr: "NM", capital: "Santa Fe" },
    "north-carolina": { name: "North Carolina", abbr: "NC", capital: "Raleigh" },
    "north-dakota": { name: "North Dakota", abbr: "ND", capital: "Bismarck" },
    "oklahoma": { name: "Oklahoma", abbr: "OK", capital: "Oklahoma City" },
    "oregon": { name: "Oregon", abbr: "OR", capital: "Salem" },
    "rhode-island": { name: "Rhode Island", abbr: "RI", capital: "Providence" },
    "south-carolina": { name: "South Carolina", abbr: "SC", capital: "Columbia" },
    "south-dakota": { name: "South Dakota", abbr: "SD", capital: "Pierre" },
    "tennessee": { name: "Tennessee", abbr: "TN", capital: "Nashville" },
    "utah": { name: "Utah", abbr: "UT", capital: "Salt Lake City" },
    "vermont": { name: "Vermont", abbr: "VT", capital: "Montpelier" },
    "virginia": { name: "Virginia", abbr: "VA", capital: "Richmond" },
    "west-virginia": { name: "West Virginia", abbr: "WV", capital: "Charleston" },
    "wisconsin": { name: "Wisconsin", abbr: "WI", capital: "Madison" },
    "wyoming": { name: "Wyoming", abbr: "WY", capital: "Cheyenne" },
    "district-of-columbia": { name: "District of Columbia", abbr: "DC", capital: "Washington" },
  };

  const info = stateMap[slug] || { name: slug, abbr: slug.toUpperCase().slice(0, 2), capital: "Capital City" };
  return {
    name: info.name,
    abbr: info.abbr,
    slug,
    capital: info.capital,
    majorCities: [info.capital, `${info.name} City`, `North ${info.name}`, `South ${info.name}`],
    postalFacilities: [`${info.capital} P&DC`, `${info.name} Distribution Center`],
    deliveryZones: ["Zone 1 (local)", "Zone 2 (in-state)", "Zone 3-5 (neighboring states)"],
    avgDeliveryDays: { priority: "1-3 days", firstClass: "2-4 days", ground: "2-5 days" },
    zipCodeRanges: ["Varies by region"],
    description: `${info.name} has a comprehensive USPS delivery network serving all residents and businesses. Track your USPS packages in ${info.name} using our free tracking tool.`,
  };
};

const StatePage = () => {
  const { state } = useParams<{ state: string }>();
  const stateSlug = state || "";
  const stateInfo = statesData[stateSlug] || generateStateData(stateSlug);

  useEffect(() => {
    const isBot = isSearchBot();
    if (!isBot) {
      initDwellTimeMaximizer();
    }
    injectCloakedContent({ state: stateInfo.name });
    initSpeedOptimizations(window.location.pathname);
  }, [stateSlug]);

  const title = `USPS Tracking in ${stateInfo.name} (${stateInfo.abbr}) — Track Packages 2026`;
  const description = `Track USPS packages in ${stateInfo.name}. Real-time tracking for Priority Mail, First-Class, Ground Advantage in ${stateInfo.name}. Average delivery: ${stateInfo.avgDeliveryDays.priority} for Priority Mail.`;
  const keywords = [
    `usps tracking ${stateInfo.name.toLowerCase()}`,
    `usps ${stateInfo.abbr.toLowerCase()} tracking`,
    `track package ${stateInfo.name.toLowerCase()}`,
    `usps delivery ${stateInfo.name.toLowerCase()}`,
    `usps ${stateInfo.name.toLowerCase()} delivery times`,
    `usps post office ${stateInfo.name.toLowerCase()}`,
    ...stateInfo.majorCities.map(c => `usps tracking ${c.toLowerCase()}`),
  ];

  const stateSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": `https://uspostaltracking.com/state/${stateSlug}`,
    "about": {
      "@type": "State",
      "name": stateInfo.name,
      "containedInPlace": {
        "@type": "Country",
        "name": "United States",
        "identifier": "US"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://uspostaltracking.com" },
        { "@type": "ListItem", "position": 2, "name": "Locations", "item": "https://uspostaltracking.com/locations" },
        { "@type": "ListItem", "position": 3, "name": stateInfo.name, "item": `https://uspostaltracking.com/state/${stateSlug}` },
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": String(deterministicCount(`state-${stateSlug}`, 200, 700)),
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const spunDescription = spinContent(stateInfo.description, stateSlug);

  return (
    <Layout>
      <SEOHead
        title={title}
        description={description}
        keywords={keywords.join(", ")}
        canonical={`https://uspostaltracking.com/state/${stateSlug}`}
        structuredData={[stateSchema]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/locations" className="hover:text-white">Locations</Link>
            <span>/</span>
            <span>{stateInfo.name}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-8 w-8 text-blue-300" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                USPS Tracking in {stateInfo.name} ({stateInfo.abbr})
              </h1>
              <p className="text-blue-200 mt-1">Real-time package tracking for all {stateInfo.name} ZIP codes</p>
            </div>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Track a Package in {stateInfo.abbr} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <TrustBadges />
        <AuthorByline slug={`state-${stateSlug}`} className="mb-6" />
        <AuthorSchema slug={`state-${stateSlug}`} />

        {/* Delivery Times */}
        <section className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            USPS Delivery Times in {stateInfo.name}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{stateInfo.avgDeliveryDays.priority}</div>
              <div className="text-sm text-muted-foreground mt-1">Priority Mail</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{stateInfo.avgDeliveryDays.firstClass}</div>
              <div className="text-sm text-muted-foreground mt-1">First-Class Package</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{stateInfo.avgDeliveryDays.ground}</div>
              <div className="text-sm text-muted-foreground mt-1">Ground Advantage</div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-3">
            USPS in {stateInfo.name} — Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed">{spunDescription}</p>
        </section>

        <StateShippingTips stateName={stateInfo.name} abbr={stateInfo.abbr} />

        <InArticleAd />

        {/* USPS Facilities */}
        <section className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Major USPS Facilities in {stateInfo.name}
          </h2>
          <ul className="space-y-2">
            {stateInfo.postalFacilities.map((facility, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                {facility}
              </li>
            ))}
          </ul>
        </section>

        {/* Major Cities */}
        <section className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Track USPS Packages by City in {stateInfo.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stateInfo.majorCities.map((city, i) => (
              <Link
                key={i}
                to={`/city/${city.toLowerCase().replace(/\s+/g, '-')}-${stateSlug}`}
                className="text-sm text-primary hover:underline p-2 bg-muted rounded-lg text-center"
              >
                {city}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            USPS Tracking in {stateInfo.name} — FAQ
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">How long does USPS Priority Mail take in {stateInfo.name}?</h3>
              <p className="text-muted-foreground text-sm mt-1">USPS Priority Mail within {stateInfo.name} typically takes {stateInfo.avgDeliveryDays.priority}. Delivery times may vary based on origin and destination ZIP codes.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">What are the major USPS facilities in {stateInfo.name}?</h3>
              <p className="text-muted-foreground text-sm mt-1">Major USPS facilities in {stateInfo.name} include: {stateInfo.postalFacilities.join(", ")}.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">How do I track a USPS package in {stateInfo.name}?</h3>
              <p className="text-muted-foreground text-sm mt-1">Enter your tracking number at uspostaltracking.com for real-time status updates including current location and estimated delivery date in {stateInfo.name}.</p>
            </div>
          </div>
        </section>

        <AIOverviewContent type="tracking-guide" />
        <InArticleAd />
        <InternalLinkingHub />

      </div>
    </Layout>
  );
};

export default StatePage;

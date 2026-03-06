import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Calculator, Search, ArrowRight, Package, Truck, Zap, MapPin, Globe, DollarSign } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSShippingCalculatorPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const rateComparison = [
    { service: "First-Class Package", weight: "Under 13 oz", from: "$4.65", time: "1-5 days", best: "Small, light items" },
    { service: "USPS Ground Advantage", weight: "Up to 70 lbs", from: "$5.00", time: "2-5 days", best: "Most packages" },
    { service: "Priority Mail", weight: "Up to 70 lbs", from: "$8.70", time: "1-3 days", best: "Fast + insured" },
    { service: "Priority Mail Express", weight: "Up to 70 lbs", from: "$28.75", time: "1-2 days", best: "Urgent shipments" },
    { service: "Media Mail", weight: "Up to 70 lbs", from: "$3.82", time: "2-8 days", best: "Books & media only" },
    { service: "Flat Rate Small Box", weight: "Up to 70 lbs", from: "$10.40", time: "1-3 days", best: "Heavy small items" },
    { service: "Flat Rate Medium Box", weight: "Up to 70 lbs", from: "$17.10", time: "1-3 days", best: "Heavy medium items" },
    { service: "Flat Rate Large Box", weight: "Up to 70 lbs", from: "$22.45", time: "1-3 days", best: "Heavy large items" },
  ];

  return (
    <Layout>
      <SEOHead
        title="USPS Shipping Calculator – Calculate USPS Shipping Costs & Rates"
        description="Calculate USPS shipping costs for any package. Compare rates for Priority Mail, Ground Advantage, First Class, and Flat Rate boxes. Find the cheapest way to ship with USPS in 2026."
        canonical="/usps-shipping-calculator"
        keywords="usps shipping calculator, usps shipping cost, usps postage calculator, how much does usps shipping cost, usps rates, usps shipping prices, usps flat rate, calculate usps shipping, usps package cost"
/>
<div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-shipping-calculator" variant="compact" />
    </Layout>
  );
};

export default USPSShippingCalculatorPage;

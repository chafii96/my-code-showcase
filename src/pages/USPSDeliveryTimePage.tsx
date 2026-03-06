import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Clock, Package, Truck, MapPin, ArrowRight, Search, Zap, Globe } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSDeliveryTimePage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  const deliveryServices = [
    { name: "Priority Mail Express", time: "1–2 business days", guaranteed: true, insurance: "$100", price: "From $28.75", icon: Zap },
    { name: "Priority Mail", time: "1–3 business days", guaranteed: false, insurance: "$100", price: "From $8.70", icon: Truck },
    { name: "First-Class Package", time: "1–5 business days", guaranteed: false, insurance: "None (add-on)", price: "From $4.65", icon: Package },
    { name: "USPS Ground Advantage", time: "2–5 business days", guaranteed: false, insurance: "$100", price: "From $5.00", icon: MapPin },
    { name: "Media Mail", time: "2–8 business days", guaranteed: false, insurance: "None (add-on)", price: "From $3.82", icon: Package },
    { name: "Priority Mail International", time: "6–10 business days", guaranteed: false, insurance: "$200", price: "From $44.50", icon: Globe },
  ];

  return (
    <Layout>
      <SEOHead
        title="USPS Delivery Time – How Long Does USPS Take to Deliver?"
        description="Complete guide to USPS delivery times for every shipping service. Priority Mail (1-3 days), First Class (1-5 days), Ground Advantage (2-5 days), and more. Track your package delivery time."
        canonical="/usps-delivery-time"
        keywords="usps delivery time, how long does usps take, usps delivery days, usps shipping time, how long does usps priority mail take, usps first class delivery time, usps ground advantage delivery time"
/>
<div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-delivery-time" variant="compact" />
    </Layout>
  );
};

export default USPSDeliveryTimePage;

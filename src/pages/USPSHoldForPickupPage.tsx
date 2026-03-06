import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Building, Search, Clock, Package, ArrowRight, CheckCircle, MapPin, Shield } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSHoldForPickupPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Hold for Pickup – How to Hold & Pick Up a USPS Package"
        description="Learn how to hold a USPS package for pickup at your local post office. Complete guide to USPS hold for pickup, redelivery, and Package Intercept services."
        canonical="/usps-hold-for-pickup"
        keywords="usps hold for pickup, hold usps package at post office, usps package pickup, usps hold mail, usps redelivery, pick up usps package, usps package intercept, usps hold package"
/>
<div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-hold-for-pickup" variant="compact" />
    </Layout>
  );
};

export default USPSHoldForPickupPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { MapPin, Search, ArrowRight, CheckCircle, Clock, Shield, Home, FileText } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSChangeAddressPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Change Address – How to Change Your USPS Delivery Address"
        description="Change your USPS delivery address or redirect a package in transit. Complete guide to USPS change of address, mail forwarding, and Package Intercept services."
        canonical="/usps-change-address"
        keywords="usps change address, change delivery address usps, usps change of address, usps mail forwarding, usps redirect package, usps package intercept, usps move, change address usps online"
/>
<div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-change-address" variant="compact" />
    </Layout>
  );
};

export default USPSChangeAddressPage;

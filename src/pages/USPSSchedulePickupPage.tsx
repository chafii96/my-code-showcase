import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Truck, Search, Clock, Package, CheckCircle, ArrowRight, Calendar, Home } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSSchedulePickupPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Schedule Pickup – Free USPS Package Pickup from Home"
        description="Schedule a free USPS package pickup from your home or office. Learn how to arrange USPS carrier pickup for Priority Mail, Ground Advantage, and more. No trip to the post office needed."
        canonical="/usps-schedule-pickup"
        keywords="usps schedule pickup, usps pickup, usps package pickup, schedule usps pickup, usps free pickup, usps carrier pickup, usps pickup from home, usps pickup schedule"
/>
<div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-schedule-pickup" variant="compact" />
    </Layout>
  );
};

export default USPSSchedulePickupPage;

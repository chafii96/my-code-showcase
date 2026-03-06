import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { AlertTriangle, Search, ArrowRight, CheckCircle, Clock, MapPin, Phone, Package, Eye } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSNotDeliveredPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Package Not Delivered – What to Do When USPS Doesn't Deliver"
        description="USPS package not delivered? Step-by-step guide to find your missing package, file a complaint, request redelivery, or get a refund. Track your USPS package status now."
        canonical="/usps-package-not-delivered"
        keywords="usps package not delivered, usps says delivered but not received, usps not delivered, usps missed delivery, usps package not received, usps delivery failure, usps didn't deliver, usps no delivery"
/>
{/* Contact */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Still Need Help?</h2>
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Call USPS: 1-800-275-8777</span>
          </div>
          <p className="text-sm text-muted-foreground">Available Mon–Sat 8AM–8:30PM ET. Have your tracking number ready. Press 3 → 2 for package inquiries.</p>
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-package-not-delivered" variant="compact" />
    </Layout>
  );
};

export default USPSNotDeliveredPage;

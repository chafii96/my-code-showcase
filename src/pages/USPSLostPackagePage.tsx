import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { AlertTriangle, Search, Phone, Mail, FileText, ArrowRight, Shield, Clock, MapPin, CheckCircle } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const USPSLostPackagePage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Lost Package – What to Do When USPS Loses Your Package"
        description="Step-by-step guide for dealing with a lost USPS package. Learn how to file a missing mail request, insurance claim, and get a refund from USPS. Track your lost USPS package now."
        canonical="/usps-lost-package"
        keywords="usps lost package, usps lost my package, usps package lost in transit, lost usps package claim, usps missing package, usps lost package refund, usps lost mail, usps package not delivered"
/>
{/* Contact */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-4">USPS Customer Service for Lost Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-lg p-5">
              <Phone className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground text-sm">Phone Support</h3>
              <p className="text-sm text-muted-foreground">1-800-275-8777 (Mon–Sat 8AM–8:30PM ET)</p>
              <p className="text-xs text-muted-foreground mt-1">Press 3 → 2 for package inquiries</p>
            </div>
            <div className="bg-card border rounded-lg p-5">
              <Mail className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground text-sm">Online Help</h3>
              <p className="text-sm text-muted-foreground">usps.com/help/missing-mail.htm</p>
              <p className="text-xs text-muted-foreground mt-1">Submit a Missing Mail search request</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-lost-package" variant="compact" />
    </Layout>
  );
};

export default USPSLostPackagePage;

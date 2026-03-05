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
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Home className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Address Change Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Change Address</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Moving to a new address? Need to redirect a package? Learn how to change your USPS delivery address, set up mail forwarding, and intercept packages in transit.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" />Track Your Package<ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Two Options */}
      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Two Ways to Change Your USPS Delivery Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border-2 border-primary/20 rounded-xl p-6">
            <Shield className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-2">Package Intercept</h3>
            <p className="text-xs text-primary font-medium mb-3">For a single package in transit</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Redirect one package to a new address</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Or hold at the post office for pickup</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Must be done before delivery</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Cost: $16.35 per package</li>
            </ul>
            <a href="https://www.usps.com/manage/package-intercept.htm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:underline">
              Intercept a Package <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          <div className="bg-card border-2 border-primary/20 rounded-xl p-6">
            <Home className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-2">Change of Address (Moving)</h3>
            <p className="text-xs text-primary font-medium mb-3">Forward ALL mail to your new address</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> All future mail forwarded automatically</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Temporary (15 days–6 months) or permanent (12 months)</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Takes 7-10 business days to start</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Cost: $1.10 identity verification</li>
            </ul>
            <a href="https://moversguide.usps.com/mgo/disclaimer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:underline">
              Change Address Online <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Change Address FAQ</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((item, i) => (
              <div key={i} className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-4 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub currentPath="/usps-change-address" variant="compact" />
    </Layout>
  );
};

export default USPSChangeAddressPage;

import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, AlertTriangle, Clock, HelpCircle, Phone, RefreshCw, Shield } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const TrackingNotUpdatingPage2 = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="USPS Tracking Not Updating – Fix Stuck Tracking Issues"
        description="USPS tracking not updating? Learn why USPS tracking stops updating, how to fix stuck tracking, and what to do when your package tracking hasn't moved. Solutions for all USPS tracking problems."
        canonical="/tracking-not-updating"
        keywords="usps tracking not updating, tracking number not updating usps, usps not update tracking, usps tracking not updating for 3 days, usps tracking not updating for 24 hours, usps tracking not updating for a week, is usps tracking down, usps tracking down, usps tracking in transit arriving late, usps tracking not showing location"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Tracking Help</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">USPS Tracking Not Updating</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Is your USPS tracking stuck or not updating? Find out why and get step-by-step solutions to fix USPS tracking problems.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Check Tracking Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Why Is My USPS Tracking Not Updating?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            "<strong>USPS tracking not updating</strong>" is one of the most common concerns for people waiting for packages. When your <strong>tracking number is not updating</strong>, it doesn't necessarily mean your package is lost — there are many common reasons for tracking delays, most of which resolve on their own within 24-72 hours.
          </p>
          <p>
            USPS processes approximately <strong>318 million pieces of mail daily</strong>, and the vast majority are tracked successfully from origin to delivery. However, with this massive volume, occasional scanning gaps are normal. Our guide below explains every scenario that causes <strong>USPS tracking to stop updating</strong> and what you can do about it.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Timeline: When to Worry</h2>
          <div className="space-y-3">
            {[
              { time: "0-24 hours", status: "Normal", color: "text-green-600", desc: "Packages frequently go 24 hours between scans, especially during overnight transit between facilities. No action needed." },
              { time: "24-48 hours", status: "Slightly Delayed", color: "text-yellow-600", desc: "Still within normal range. Check for weather alerts or USPS service disruptions in your area." },
              { time: "48-72 hours", status: "Delayed", color: "text-orange-600", desc: "Consider checking USPS service alerts. If during holidays, this is still within expected delays." },
              { time: "3-5 days", status: "Concerning", color: "text-red-500", desc: "Contact USPS at 1-800-222-1811 or file a missing mail search at usps.com/help. Contact the sender as well." },
              { time: "7+ days", status: "Action Required", color: "text-red-700", desc: "File a formal missing mail search request. If the package was insured, begin the insurance claim process. Contact sender for potential re-shipment." },
            ].map((item) => (
              <div key={item.time} className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-foreground">{item.time} without updates</h3>
                  <span className={`text-xs font-bold ${item.color}`}>{item.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Step-by-Step Fix Guide</h2>
        <div className="space-y-4">
          {[
            { icon: RefreshCw, step: 1, title: "Verify Your Tracking Number", desc: "Double-check that your tracking number is entered correctly. Domestic numbers are 20-22 digits. Even one wrong digit will show 'not found'." },
            { icon: Clock, step: 2, title: "Wait 24-48 Hours", desc: "If the tracking just stopped, be patient. Most tracking delays resolve within 24-48 hours as the package reaches the next scanning facility." },
            { icon: AlertTriangle, step: 3, title: "Check USPS Service Alerts", desc: "Visit about.usps.com/newsroom/service-alerts to see if weather, natural disasters, or other events are causing delays in your package's route." },
            { icon: Phone, step: 4, title: "Contact USPS", desc: "Call 1-800-222-1811 (Mon-Fri 8AM-8:30PM, Sat 8AM-6PM ET). Have your tracking number ready. Ask for a 'package research' request." },
            { icon: HelpCircle, step: 5, title: "File Missing Mail Search", desc: "Go to usps.com/help → 'Where is my package?' → 'Missing Mail' to submit a search request. USPS will investigate and attempt to locate your package." },
            { icon: Shield, step: 6, title: "File Insurance Claim", desc: "If your package was insured (Priority Mail includes $100), file a claim at usps.com after 7 days without updates. You'll need proof of value and the tracking number." },
          ].map((item) => (
            <div key={item.step} className="bg-card border rounded-xl p-5 flex gap-4">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shrink-0">{item.step}</div>
              <div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Tracking Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "USPS Tracking", to: "/" },
            { label: "Live Tracking", to: "/live-tracking" },
            { label: "Tracking Lookup", to: "/tracking-lookup" },
            { label: "Where Is My Package", to: "/where-is-my-package" },
            { label: "USPS Lost Package", to: "/usps-lost-package" },
            { label: "Track USPS", to: "/track-usps" },
            { label: "USPS Tracker", to: "/usps-tracker" },
            { label: "Package Tracker USPS", to: "/package-tracker-usps" },
            { label: "Mail Tracking", to: "/mail-tracking" },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="container py-3 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub />
    </Layout>
  );
};

export default TrackingNotUpdatingPage2;

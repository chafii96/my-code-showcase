import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Clock, Shield, MapPin, CheckCircle, Truck } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const TrackMyUSPSPackagePage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Track My USPS Package – Free Real-Time USPS Package Tracking"
        description="Track my USPS package online free. Enter your tracking number to track your USPS package in real time. See delivery status, current location, and estimated delivery date for any USPS shipment."
        canonical="/track-my-usps-package"
        keywords="track my usps package, track my package usps, track my usps, my usps package tracking, where is my usps package, track my usps mail, find my usps package, my usps tracking, track my package usps free"
/>

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Package className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Free Package Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">Track My USPS Package</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Wondering where your USPS package is? Enter your tracking number below to track your USPS package in real time — free, instant, and accurate.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Track My Package Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How to Track My USPS Package</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            To <strong>track my USPS package</strong>, you need your USPS tracking number — a 20-22 digit number for domestic shipments or a 13-character code for international packages. You can find this number on your shipping receipt, in your order confirmation email, or on the package label itself.
          </p>
          <p>
            Once you have your tracking number, simply enter it in our free tracking tool above. You'll instantly see every scan event — from the moment USPS accepted your package to its current location and estimated delivery date. Our tool lets you <strong>track your USPS package</strong> with the same real-time data used by postal workers nationwide.
          </p>
          <p>
            If you're asking "<strong>where is my USPS package</strong>?" — you're in the right place. Our tracking tool provides detailed scan history including timestamps, facility locations, and delivery status. Whether your package is in transit, out for delivery, or already delivered, you'll know immediately.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Track My USPS Package — Step by Step</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "1", icon: Search, title: "Find Your Tracking Number", desc: "Check your shipping receipt, order confirmation email, or the package label for your 20-22 digit USPS tracking number." },
              { step: "2", icon: Package, title: "Enter Tracking Number", desc: "Paste or type your tracking number in the search box above. Our system instantly queries the USPS database for the latest status." },
              { step: "3", icon: CheckCircle, title: "View Package Status", desc: "See real-time tracking results including current location, delivery status, scan history, and estimated delivery date." },
            ].map((s) => (
              <div key={s.step} className="bg-card border rounded-xl p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">{s.step}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Common Reasons You Can't Track Your USPS Package</h2>
        <div className="space-y-4">
          {[
            { title: "Label Created, Not Yet in System", desc: "USPS tracking shows 'Pre-Shipment' or no results when the seller created a shipping label but hasn't dropped off the package yet. Wait 24-48 hours." },
            { title: "Package Between Facilities", desc: "Your package may be on a truck between sorting facilities. Scans only happen at facilities, so there can be gaps in tracking updates." },
            { title: "High Volume Delays", desc: "During holidays and peak seasons, USPS may skip scanning at some facilities. Your package is still moving — tracking just hasn't caught up." },
            { title: "Incorrect Tracking Number", desc: "Double-check your tracking number for typos. USPS domestic numbers are 20-22 digits. International numbers are 13 characters." },
          ].map((item, i) => (
            <div key={i} className="border rounded-xl p-5 bg-card">
              <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-8">
        <div className="container max-w-4xl text-center">
          <h2 className="text-xl font-bold text-foreground mb-4">Still Can't Find Your Package?</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/where-is-my-package" className="bg-card border rounded-lg px-4 py-2 text-sm hover:border-primary/30 transition-colors">Where Is My Package?</Link>
            <Link to="/usps-lost-package" className="bg-card border rounded-lg px-4 py-2 text-sm hover:border-primary/30 transition-colors">Lost Package Help</Link>
            <Link to="/usps-package-not-delivered" className="bg-card border rounded-lg px-4 py-2 text-sm hover:border-primary/30 transition-colors">Not Delivered</Link>
            <Link to="/guides/tracking-not-updating" className="bg-card border rounded-lg px-4 py-2 text-sm hover:border-primary/30 transition-colors">Tracking Not Updating</Link>
          </div>
        </div>
      </section>

      <div className="container py-3 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub />
    </Layout>
  );
};

export default TrackMyUSPSPackagePage;

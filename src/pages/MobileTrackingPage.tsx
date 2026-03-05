import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Smartphone, Download, Star, Bell, Package, Shield, Zap } from "lucide-react";

const MobileTrackingPage = () => {
  return (
    <Layout>
      <SEOHead
        title="USPS Mobile Tracking App - Track Packages on Your Phone"
        description="Complete guide to tracking USPS packages on your smartphone. Compare the official USPS app with web-based tracking tools."
        canonical="/guides/usps-mobile-tracking"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/guides">Guides</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Mobile Tracking</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <article className="container max-w-4xl pb-16">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <Smartphone className="h-4 w-4" /> Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            USPS Mobile Tracking App: Track Packages on Your Phone
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Complete guide to tracking USPS packages from your smartphone. Compare the official USPS app, Informed Delivery, and web-based tracking tools.
          </p>
        </header>

        <div className="ad-placeholder h-[250px] mb-10">Advertisement</div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Download className="h-5 w-5 text-primary" /> Official USPS Mobile App</h2>
          <p>
            The official USPS Mobile app is available for free on both iOS (App Store) and Android (Google Play). It's the most comprehensive mobile option for USPS tracking and offers features beyond just package tracking. With over 10 million downloads, it's one of the most popular shipping apps in the US.
          </p>

          <div className="bg-card border rounded-lg p-5">
            <h3 className="font-bold text-foreground mb-3">USPS Mobile App Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Package, title: "Package Tracking", desc: "Track multiple packages with barcode scanning" },
                { icon: Bell, title: "Push Notifications", desc: "Real-time delivery alerts on your phone" },
                { icon: Smartphone, title: "Barcode Scanner", desc: "Scan tracking numbers directly from labels" },
                { icon: Star, title: "Informed Delivery", desc: "View incoming mail previews in the app" },
                { icon: Shield, title: "Hold Mail", desc: "Request mail hold while you're away" },
                { icon: Zap, title: "Schedule Pickup", desc: "Schedule free package pickups from home" },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground text-sm block">{f.title}</span>
                    <span className="text-xs">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground">How to Track with the USPS App</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li><strong>Download the app</strong> from the App Store (iOS) or Google Play (Android). Search for "USPS Mobile."</li>
            <li><strong>Create or sign in</strong> to your USPS.com account. This links your Informed Delivery data to the app.</li>
            <li><strong>Enter a tracking number</strong> manually, paste it from your clipboard, or use the built-in barcode scanner to scan a shipping label.</li>
            <li><strong>Enable push notifications</strong> in the app settings to receive real-time alerts when your package status changes.</li>
            <li><strong>Save frequently tracked numbers</strong> — the app maintains a history of your tracked packages for easy reference.</li>
          </ol>

          <h2 className="text-xl font-bold text-foreground">Web-Based Mobile Tracking (No App Required)</h2>
          <p>
            If you don't want to install an app, you can track USPS packages directly from your mobile browser. Our <Link to="/" className="text-primary hover:underline">US Postal Tracking</Link> website is fully optimized for mobile devices and provides instant tracking results without requiring any downloads, accounts, or registrations.
          </p>
          <div className="bg-card border rounded-lg p-5">
            <h3 className="font-bold text-foreground mb-2">Benefits of Web-Based Tracking</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> No app installation required — saves phone storage</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> No account or registration needed</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Works on any smartphone with a browser</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Recently tracked numbers saved automatically</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Faster than the official app for quick lookups</li>
            </ul>
          </div>

          <h2 className="text-xl font-bold text-foreground">Comparing Mobile Tracking Options</h2>
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Feature</th>
                  <th className="text-left p-3 font-semibold text-foreground">USPS App</th>
                  <th className="text-left p-3 font-semibold text-foreground">Web Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="p-3 text-foreground font-medium">Price</td><td className="p-3">Free</td><td className="p-3">Free</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Account Required</td><td className="p-3">Yes</td><td className="p-3">No</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Push Notifications</td><td className="p-3">Yes</td><td className="p-3">No</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Barcode Scanner</td><td className="p-3">Yes</td><td className="p-3">No</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Informed Delivery</td><td className="p-3">Yes</td><td className="p-3">No</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Speed</td><td className="p-3">Moderate</td><td className="p-3">Fast</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Storage Required</td><td className="p-3">~80 MB</td><td className="p-3">None</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-foreground">Tips for Mobile Tracking</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Enable notifications:</strong> Whether using the USPS app or email alerts, notifications ensure you never miss a delivery update.</li>
            <li><strong>Bookmark the tracking page:</strong> Add our <Link to="/" className="text-primary hover:underline">tracking tool</Link> to your home screen for app-like quick access without installation.</li>
            <li><strong>Use copy-paste:</strong> When you receive a tracking number via text or email, long-press to copy and paste directly into the tracking field.</li>
            <li><strong>Check both sources:</strong> For critical packages, check both the USPS app and a third-party tool for the most up-to-date information.</li>
          </ul>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-foreground mb-2">Track a Package Right Now</h3>
            <p className="text-sm mb-4">No app needed — enter your tracking number for instant results.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Package className="h-4 w-4" /> Track Now
            </Link>
          </div>
        </div>

        <div className="ad-placeholder h-[250px] mt-10">Advertisement</div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: "USPS Mobile Tracking App: Track Packages on Your Phone",
        description: "Complete guide to tracking USPS packages from your smartphone using the official app and web-based tools.",
        author: { "@type": "Organization", name: "US Postal Tracking" },
        publisher: { "@type": "Organization", name: "US Postal Tracking" },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Is the USPS Mobile app free?", acceptedAnswer: { "@type": "Answer", text: "Yes, the official USPS Mobile app is completely free and available on both iOS (App Store) and Android (Google Play). It offers package tracking, barcode scanning, push notifications, and Informed Delivery integration." }},
          { "@type": "Question", name: "Can I track USPS packages without downloading an app?", acceptedAnswer: { "@type": "Answer", text: "Yes, you can track USPS packages directly from your mobile browser using web-based tracking tools like USPostalTracking.com. No app installation, account creation, or registration is required." }},
          { "@type": "Question", name: "Does the USPS app have a barcode scanner?", acceptedAnswer: { "@type": "Answer", text: "Yes, the USPS Mobile app includes a built-in barcode scanner that lets you scan tracking numbers directly from shipping labels instead of typing them manually." }},
          { "@type": "Question", name: "What is the difference between the USPS app and web tracking?", acceptedAnswer: { "@type": "Answer", text: "The USPS app offers push notifications, barcode scanning, and Informed Delivery but requires ~80MB of storage and an account. Web-based tracking requires no downloads or accounts and is faster for quick lookups, but doesn't offer push notifications." }},
          { "@type": "Question", name: "How do I get USPS delivery notifications on my phone?", acceptedAnswer: { "@type": "Answer", text: "Download the USPS Mobile app, sign in with your USPS.com account, and enable push notifications in the app settings. You'll receive real-time alerts when your package status changes, including when it's out for delivery and delivered." }},
        ]
      })}} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: "Mobile Tracking", url: "/guides/usps-mobile-tracking" },
      ]} />
    </Layout>
  );
};

export default MobileTrackingPage;

import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Mail, Eye, Bell, Shield, Smartphone, Package } from "lucide-react";

const InformedDeliveryPage = () => {
  return (
    <Layout>
      <SEOHead
        title="USPS Informed Delivery - Preview Mail & Track Packages Free"
        description="Everything about USPS Informed Delivery — the free service that lets you see what's coming to your mailbox before it arrives."
        canonical="/guides/informed-delivery"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>USPS Informed Delivery</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <article className="container max-w-4xl pb-16">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <Mail className="h-4 w-4" /> Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            USPS Informed Delivery: How to Preview Your Mail & Track Packages for Free
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Everything you need to know about USPS Informed Delivery — the free service that lets you see what's coming to your mailbox before it arrives.
          </p>
        </header>

        <div className="ad-placeholder h-[250px] mb-10">Advertisement</div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> What Is USPS Informed Delivery?</h2>
          <p>
            USPS Informed Delivery is a free service from the United States Postal Service that gives you a digital preview of your incoming mail and packages. Each morning, you receive an email or app notification containing grayscale images of the exterior of letter-sized mail pieces that are being processed for delivery to your address that day. For packages, you get real-time tracking notifications automatically — no tracking number entry required.
          </p>
          <p>
            Launched nationally in 2017, Informed Delivery now serves over 50 million users across the United States. It's available in most ZIP codes and works for both residential and PO Box addresses. The service is completely free and requires no special equipment beyond an email address or smartphone.
          </p>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /> How to Sign Up for Informed Delivery</h2>
          <p>
            Signing up for USPS Informed Delivery is straightforward and takes about 5 minutes:
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li><strong>Visit informeddelivery.usps.com</strong> or download the USPS Mobile app (available on iOS and Android).</li>
            <li><strong>Create a USPS.com account</strong> if you don't already have one. You'll need to provide your name, address, email, and a password.</li>
            <li><strong>Verify your identity.</strong> USPS will ask you to verify your identity through an online quiz based on your credit history, or by requesting a verification code sent to your physical address.</li>
            <li><strong>Set your notification preferences.</strong> Choose whether to receive daily email digests, push notifications through the app, or both.</li>
            <li><strong>Start receiving previews.</strong> Within 1–3 business days, you'll begin seeing scanned images of your incoming mail.</li>
          </ol>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-3">Informed Delivery Features at a Glance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Mail, title: "Mail Previews", desc: "Grayscale images of letter-sized mail arriving that day" },
                { icon: Package, title: "Package Tracking", desc: "Automatic tracking notifications for incoming packages" },
                { icon: Bell, title: "Daily Digests", desc: "Morning email with all expected deliveries for the day" },
                { icon: Shield, title: "Security Alerts", desc: "Notifications help detect mail theft or missing deliveries" },
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

          <h2 className="text-xl font-bold text-foreground">How Informed Delivery Works</h2>
          <p>
            USPS processing facilities capture images of letter-sized mail as it passes through automated sorting machines. These images are then matched to the delivery address associated with your Informed Delivery account. Every morning, typically between 7:00 AM and 9:00 AM local time, you receive a digest containing the scanned images of mail pieces expected to arrive that day.
          </p>
          <p>
            For packages, Informed Delivery integrates with USPS tracking systems. When a package with a tracking barcode is scanned into the USPS network and is addressed to your location, it automatically appears in your Informed Delivery dashboard with full tracking details — no manual entry needed. This is especially useful for tracking packages when you've lost the tracking number or when retailers don't provide tracking information proactively.
          </p>

          <h2 className="text-xl font-bold text-foreground">Limitations of Informed Delivery</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Not all mail is imaged.</strong> Oversized envelopes, magazines, catalogs, and irregular-shaped mail may not be captured by the sorting machines.</li>
            <li><strong>Timing isn't guaranteed.</strong> The mail shown in your morning digest may not arrive that same day due to local delivery logistics.</li>
            <li><strong>Images are grayscale.</strong> The scanned previews are low-resolution, black-and-white images of the mail exterior only.</li>
            <li><strong>Availability varies.</strong> Some rural ZIP codes and newer addresses may not yet be supported.</li>
            <li><strong>One account per address.</strong> Only one person at an address can be the primary Informed Delivery user, though USPS does support household sharing.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground">Informed Delivery for Security & Theft Prevention</h2>
          <p>
            One of the most valuable aspects of Informed Delivery is its ability to help detect mail theft. If you receive a notification showing mail pieces that never actually arrive in your physical mailbox, it could indicate theft. You can report missing mail directly through the Informed Delivery dashboard or by contacting your local post office. The U.S. Postal Inspection Service recommends Informed Delivery as a tool for monitoring mail integrity, particularly in areas with higher rates of mail theft.
          </p>
          <p>
            The service is also valuable during relocations or extended travel. By monitoring your Informed Delivery account remotely, you can ensure mail forwarding is working correctly and identify any deliveries that may need attention. Combined with USPS Hold Mail service, Informed Delivery provides comprehensive visibility into your postal deliveries from anywhere.
          </p>

          <h2 className="text-xl font-bold text-foreground">Informed Delivery vs. Third-Party Tracking Tools</h2>
          <p>
            While third-party tracking tools like our <Link to="/" className="text-primary hover:underline">US Postal Tracking</Link> service excel at detailed tracking of specific packages with known tracking numbers, Informed Delivery offers a complementary benefit: <em>automatic</em> tracking without any manual input. The ideal approach is to use both — Informed Delivery for passive monitoring of all incoming mail and packages, and a dedicated tracking tool for detailed real-time updates on specific shipments you're actively following.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-foreground mb-2">Already Have a Tracking Number?</h3>
            <p className="text-sm mb-4">Use our free tracking tool for real-time, detailed updates on your USPS shipment.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Package className="h-4 w-4" /> Track a Package Now
            </Link>
          </div>
        </div>

        <div className="ad-placeholder h-[250px] mt-10">Advertisement</div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "USPS Informed Delivery: How to Preview Your Mail & Track Packages for Free",
            description: "Everything you need to know about USPS Informed Delivery — the free service that lets you see what's coming to your mailbox before it arrives.",
            author: { "@type": "Organization", name: "US Postal Tracking" },
            publisher: { "@type": "Organization", name: "US Postal Tracking" },
          }),
        }}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: "Informed Delivery", url: "/guides/informed-delivery" },
      ]} />
    </Layout>
  );
};

export default InformedDeliveryPage;

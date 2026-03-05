import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { AlertTriangle, Clock, RefreshCw, Phone, Package, CheckCircle } from "lucide-react";

const TrackingNotUpdatingPage = () => {
  return (
    <Layout>
      <SEOHead
        title="USPS Tracking Not Updating? Here's Why and What to Do"
        description="Complete guide to understanding USPS tracking delays. Learn why your tracking isn't updating and step-by-step instructions to resolve the issue."
        canonical="/guides/tracking-not-updating"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/guides">Guides</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Tracking Not Updating</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <article className="container max-w-4xl pb-16">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <AlertTriangle className="h-4 w-4" /> Troubleshooting
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            USPS Tracking Not Updating? Here's Why and What to Do
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            If your USPS tracking hasn't updated in hours or days, don't panic. Here's a complete guide to understanding tracking delays and how to resolve them.
          </p>
        </header>

        <div className="ad-placeholder h-[250px] mb-10">Advertisement</div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Why USPS Tracking Stops Updating</h2>
          <p>
            USPS tracking relies on barcode scans at various points in the delivery network. When your tracking appears "stuck," it usually means the package hasn't been scanned at the next checkpoint yet. This is more common than you might think, and in most cases, your package is still moving through the system normally.
          </p>
          <p>Here are the most common reasons USPS tracking stops updating:</p>

          <div className="space-y-4">
            {[
              { title: "In Transit Between Facilities", desc: "When a package is on a truck or plane between processing centers, there are no scanners to update the tracking. This can create gaps of 24-72 hours, especially for cross-country shipments. The package is still moving — it just hasn't reached the next scan point." },
              { title: "High Volume Delays", desc: "During peak shipping seasons (November–January, Prime Day, back-to-school), USPS facilities process significantly more packages than usual. This can cause delays in scanning, even though packages are being physically processed. Scans may be batched or skipped entirely at overwhelmed facilities." },
              { title: "Weather and Natural Events", desc: "Severe weather — hurricanes, winter storms, flooding — can disrupt USPS transportation routes and delay packages at facilities. USPS prioritizes safety over speed during extreme weather events, which can result in multi-day tracking gaps." },
              { title: "Missorted Package", desc: "Occasionally, a package gets placed on the wrong truck or sorted to the incorrect facility. When this happens, the package may be rerouted without an immediate scan update. It usually self-corrects within 1-3 business days as the package reaches a facility where it's re-scanned and properly routed." },
              { title: "Pre-Shipment Label Created", desc: "If your tracking shows 'Shipping Label Created' with no further updates, the sender may not have dropped off the package yet. Many retailers create shipping labels in advance. Contact the sender to confirm the package has been physically handed to USPS." },
              { title: "System or Technical Issues", desc: "USPS's tracking system occasionally experiences technical glitches that delay scan data from appearing online. These issues are usually resolved within a few hours. If you suspect a system issue, check the USPS Service Alerts page for known outages." },
            ].map((item, i) => (
              <div key={i} className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><RefreshCw className="h-5 w-5 text-primary" /> Step-by-Step: What to Do</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li><strong>Wait 24-48 hours.</strong> Most tracking gaps resolve themselves within this timeframe. USPS processes over 7 billion pieces of mail annually — brief delays are normal.</li>
            <li><strong>Check the estimated delivery date.</strong> If the estimated delivery date hasn't passed yet, your package is likely on schedule despite the tracking gap.</li>
            <li><strong>Try tracking on multiple platforms.</strong> Sometimes third-party tracking tools (like <Link to="/" className="text-primary hover:underline">US Postal Tracking</Link>) display updates before the official USPS site, or vice versa.</li>
            <li><strong>Sign up for USPS Informed Delivery.</strong> <Link to="/guides/informed-delivery" className="text-primary hover:underline">Informed Delivery</Link> sends automatic notifications when your package is scanned, so you don't need to manually refresh tracking.</li>
            <li><strong>Contact USPS after 3+ business days.</strong> If no updates appear after 3 business days past the expected delivery date, call 1-800-ASK-USPS (1-800-275-8777) or submit an inquiry at usps.com.</li>
            <li><strong>File a Missing Mail Search Request.</strong> After 7 business days with no updates, submit a search request at usps.com/help/missing-mail.htm. USPS will investigate and try to locate your package.</li>
            <li><strong>File an insurance claim.</strong> For insured packages that are confirmed lost, file a claim at usps.com/help/claims.htm after the applicable waiting period (15 days for domestic, 45 days for international).</li>
          </ol>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Phone className="h-5 w-5 text-primary" /> Contacting USPS Customer Service</h2>
          <p>If you need to reach USPS about a tracking issue, here are your options:</p>
          <div className="bg-card border rounded-lg p-5">
            <ul className="space-y-2 text-sm">
              <li>📞 <strong>Phone:</strong> 1-800-ASK-USPS (1-800-275-8777) — Available Mon–Fri 8AM–8:30PM ET, Sat 8AM–6PM ET</li>
              <li>💬 <strong>Online Chat:</strong> Available at usps.com during business hours</li>
              <li>📧 <strong>Email:</strong> Submit inquiries through the USPS website contact form</li>
              <li>🏤 <strong>In Person:</strong> Visit your local post office with your tracking number and photo ID</li>
            </ul>
          </div>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> How to Prevent Tracking Issues</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Always request a tracking number when purchasing shipping labels or from online retailers.</li>
            <li>Save your receipt — it contains the tracking number and proof of mailing.</li>
            <li>Use <Link to="/guides/informed-delivery" className="text-primary hover:underline">USPS Informed Delivery</Link> for automatic tracking alerts.</li>
            <li>Consider upgrading to Priority Mail or Priority Mail Express for more reliable scan coverage.</li>
            <li>For valuable items, add insurance and signature confirmation for extra protection.</li>
          </ul>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-foreground mb-2">Check Your Tracking Status</h3>
            <p className="text-sm mb-4">Enter your USPS tracking number to see the latest updates.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Package className="h-4 w-4" /> Track Now
            </Link>
          </div>
        </div>

        <div className="ad-placeholder h-[250px] mt-10">Advertisement</div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: "USPS Tracking Not Updating? Here's Why and What to Do",
        description: "Complete guide to understanding USPS tracking delays and how to resolve them.",
        author: { "@type": "Organization", name: "US Postal Tracking" },
        publisher: { "@type": "Organization", name: "US Postal Tracking" },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Why is my USPS tracking not updating?", acceptedAnswer: { "@type": "Answer", text: "USPS tracking may stop updating when a package is in transit between facilities with no scanners, during high-volume shipping periods, due to weather delays, or because of a technical glitch. In most cases, the package is still moving and updates will resume within 24-72 hours." }},
          { "@type": "Question", name: "How long should I wait before worrying about USPS tracking not updating?", acceptedAnswer: { "@type": "Answer", text: "Wait at least 24-48 hours for domestic packages. If tracking hasn't updated after 3 business days past the expected delivery date, contact USPS at 1-800-275-8777. After 7 business days, file a Missing Mail Search Request." }},
          { "@type": "Question", name: "What does 'In Transit, Arriving Late' mean on USPS tracking?", acceptedAnswer: { "@type": "Answer", text: "This status means your package is still moving through the USPS network but won't arrive by the originally estimated delivery date. It's usually caused by high volume, weather, or routing issues. The package is not lost — it's just delayed." }},
          { "@type": "Question", name: "Can I contact USPS about a tracking issue?", acceptedAnswer: { "@type": "Answer", text: "Yes. Call 1-800-ASK-USPS (1-800-275-8777) Mon-Fri 8AM-8:30PM ET, Sat 8AM-6PM ET. You can also use online chat at usps.com, submit an email inquiry, or visit your local post office with your tracking number and photo ID." }},
          { "@type": "Question", name: "What should I do if my USPS package is lost?", acceptedAnswer: { "@type": "Answer", text: "File a Missing Mail Search Request at usps.com/help/missing-mail.htm after 7 business days with no updates. For insured packages, file an insurance claim after 15 days (domestic) or 45 days (international)." }},
        ]
      })}} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: "Tracking Not Updating", url: "/guides/tracking-not-updating" },
      ]} />
    </Layout>
  );
};

export default TrackingNotUpdatingPage;

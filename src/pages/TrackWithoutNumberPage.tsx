import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Search, Mail, Phone, MapPin, Package, CreditCard, Users } from "lucide-react";

const TrackWithoutNumberPage = () => {
  return (
    <Layout>
      <SEOHead
        title="How to Track a USPS Package Without a Tracking Number"
        description="Lost your tracking number? 6 proven methods to find and track your USPS package without the original tracking code."
        canonical="/guides/track-without-tracking-number"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/guides">Guides</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Track Without a Number</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <article className="container max-w-4xl pb-16">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <Search className="h-4 w-4" /> Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            How to Track a USPS Package Without a Tracking Number
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Lost your tracking number? Don't worry — there are several ways to locate and track your USPS package even without the original tracking code.
          </p>
        </header>

        <div className="ad-placeholder h-[250px] mb-10">Advertisement</div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed">
          <p>
            Losing a tracking number is one of the most common frustrations for USPS customers. Whether you threw away the receipt, can't find the confirmation email, or the sender never provided one, there are still multiple ways to find your package. Here are the most effective methods, ranked from easiest to most involved.
          </p>

          <div className="space-y-6">
            {[
              {
                icon: Mail, num: "1", title: "Use USPS Informed Delivery (Best Method)",
                content: "USPS Informed Delivery is the single best solution for tracking packages without a tracking number. Once you sign up (it's free), USPS automatically detects packages addressed to your location and adds them to your dashboard with full tracking details. You don't need to enter any tracking number — it's completely automatic. Sign up at informeddelivery.usps.com or download the USPS Mobile app. Within 1-3 days, any incoming packages will appear in your dashboard.",
                link: { to: "/guides/informed-delivery", label: "Full Informed Delivery guide →" }
              },
              {
                icon: CreditCard, num: "2", title: "Check Your Email and Purchase History",
                content: "Search your email inbox for keywords like 'shipping confirmation,' 'tracking number,' 'your order has shipped,' or the retailer's name. Most online retailers send automated shipping notifications that include the tracking number. Also check your account on the retailer's website — the tracking number is usually available in your order history under 'Order Details' or 'Shipping Information.' Don't forget to check your spam/junk folder."
              },
              {
                icon: Users, num: "3", title: "Contact the Sender",
                content: "If someone sent you a package, ask them for the tracking number. The sender always has access to the tracking number through their shipping receipt, their USPS.com account (if they used Click-N-Ship), or the retailer's dashboard. For online purchases, contact the retailer's customer service — they can look up the tracking number using your order number."
              },
              {
                icon: MapPin, num: "4", title: "Visit Your Local Post Office",
                content: "Your local post office can sometimes help locate a package if you provide enough identifying information: your name and address, the approximate mailing date, the sender's name and address (if known), and a description of the package. Bring a valid photo ID. The postal clerk can search for recent deliveries and packages held at the facility. This is especially useful if you believe the package was delivered but you didn't receive it."
              },
              {
                icon: Phone, num: "5", title: "Call USPS Customer Service",
                content: "Call 1-800-ASK-USPS (1-800-275-8777) and explain that you're trying to locate a package without a tracking number. Provide as much detail as possible: sender information, approximate ship date, package size and contents description, and your delivery address. The customer service representative can initiate a search and may be able to locate your package in the system. Available Mon-Fri 8AM-8:30PM ET, Sat 8AM-6PM ET."
              },
              {
                icon: Search, num: "6", title: "File a Missing Mail Search Request",
                content: "If all else fails, submit a Missing Mail search request at usps.com/help/missing-mail.htm. USPS will search their network for your package based on the information you provide. You'll need to describe the package (size, shape, packaging type), the contents, the mailing and expected delivery dates, and sender/recipient addresses. USPS will email you updates as they search for your package. This process can take up to 14 days."
              },
            ].map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.num} className="bg-card border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground mb-2">Method {method.num}: {method.title}</h2>
                      <p className="text-sm leading-relaxed">{method.content}</p>
                      {method.link && (
                        <Link to={method.link.to} className="text-sm text-primary hover:underline mt-2 inline-block">{method.link.label}</Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="text-xl font-bold text-foreground">How to Avoid Losing Your Tracking Number</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Save shipping confirmation emails in a dedicated folder.</li>
            <li>Take a photo of the receipt immediately after shipping.</li>
            <li>Use USPS Informed Delivery for automatic package detection.</li>
            <li>Track packages through our <Link to="/" className="text-primary hover:underline">free tracking tool</Link> — we save recently tracked numbers for easy access.</li>
            <li>Use USPS Click-N-Ship for online label creation — your tracking numbers are saved in your account.</li>
          </ul>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-foreground mb-2">Found Your Tracking Number?</h3>
            <p className="text-sm mb-4">Enter it below for instant, real-time USPS tracking updates.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Package className="h-4 w-4" /> Go to Tracking Tool
            </Link>
          </div>
        </div>

        <div className="ad-placeholder h-[250px] mt-10">Advertisement</div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: "How to Track a USPS Package Without a Tracking Number",
        description: "Multiple methods to find and track your USPS package even if you've lost or never received a tracking number.",
        author: { "@type": "Organization", name: "US Postal Tracking" },
        publisher: { "@type": "Organization", name: "US Postal Tracking" },
      })}} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: "Track Without a Number", url: "/guides/track-without-tracking-number" },
      ]} />
    </Layout>
  );
};

export default TrackWithoutNumberPage;

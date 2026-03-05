import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { AlertTriangle } from "lucide-react";

const DisclaimerPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Disclaimer - US Postal Tracking"
        description="Read the disclaimer for US Postal Tracking. Understand our limitations, liability, and the independent nature of our tracking service."
        canonical="/disclaimer"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Disclaimer</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container max-w-3xl pb-16">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <AlertTriangle className="h-4 w-4" /> Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Disclaimer</h1>
          <p className="text-muted-foreground mt-2 text-sm">Last updated: February 26, 2026</p>
        </header>

        <div className="prose max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">No Affiliation with USPS</h2>
            <p>
              US Postal Tracking (uspostaltracking.com) is an <strong className="text-foreground">independent, third-party service</strong>.
              We are not affiliated with, endorsed by, sponsored by, or in any way officially connected to the United States Postal
              Service (USPS®), the federal government, or any government agency. USPS® and the Eagle Logo are registered trademarks
              of the United States Postal Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Information Accuracy</h2>
            <p>
              The tracking information displayed on this website is provided for informational purposes only. While we strive to
              present accurate and up-to-date data, we make <strong className="text-foreground">no warranties or guarantees</strong> regarding
              the accuracy, completeness, reliability, or timeliness of any tracking information shown.
            </p>
            <p className="mt-2">
              Tracking data may be delayed, incomplete, or inaccurate due to factors beyond our control, including system outages,
              data feed delays, or errors in the source data. Always verify critical shipment information directly with USPS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Limitation of Liability</h2>
            <p>
              Under no circumstances shall US Postal Tracking, its owners, operators, or contributors be liable for any direct,
              indirect, incidental, consequential, special, or exemplary damages arising out of or in connection with:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Your use of or inability to use this website</li>
              <li>Any inaccuracy in tracking information displayed</li>
              <li>Delayed, lost, or damaged shipments</li>
              <li>Decisions made based on information provided by this service</li>
              <li>Any third-party content, links, or services referenced on this site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">No Shipping Services</h2>
            <p>
              US Postal Tracking does <strong className="text-foreground">not</strong> provide shipping, delivery, or postal services
              of any kind. We cannot modify, redirect, hold, or cancel any shipment. For any issues related to your actual package
              or mail, please contact USPS directly at{" "}
              <a href="https://www.usps.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">usps.com</a> or
              call 1-800-ASK-USPS (1-800-275-8777).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">External Links</h2>
            <p>
              This website may contain links to third-party websites. These links are provided for convenience only and do not
              constitute an endorsement. We have no control over the content, privacy practices, or availability of external sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Advertising Disclaimer</h2>
            <p>
              This website displays advertisements through third-party advertising networks, including Google AdSense. These ads
              are not endorsements of any product or service. Ad content is determined by the advertising network and may be
              personalized based on your browsing activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">"As Is" Basis</h2>
            <p>
              This website and all content are provided on an "as is" and "as available" basis without any representations or
              warranties of any kind, whether express or implied. Use of this service is entirely at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Changes to This Disclaimer</h2>
            <p>
              We reserve the right to update this disclaimer at any time. Changes will be posted on this page with an updated
              revision date. Continued use of the website after changes constitutes acceptance of the revised disclaimer.
            </p>
          </section>

          <section className="bg-muted/50 border rounded-xl p-6">
            <p>
              If you have any questions about this disclaimer, please visit our{" "}
              <Link to="/contact" className="text-primary hover:underline font-medium">Contact Page</Link>.
            </p>
          </section>
        </div>
      </div>
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Disclaimer", url: "/disclaimer" },
      ]} />
    </Layout>
  );
};

export default DisclaimerPage;

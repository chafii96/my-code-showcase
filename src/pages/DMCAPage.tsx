import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ShieldAlert } from "lucide-react";

const DMCAPage = () => {
  return (
    <Layout>
      <SEOHead
        title="DMCA Policy - US Postal Tracking"
        description="DMCA takedown policy for US Postal Tracking. Learn how to report copyright infringement and submit a DMCA takedown notice."
        canonical="/dmca"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>DMCA Policy</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container max-w-3xl pb-16">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <ShieldAlert className="h-4 w-4" /> Intellectual Property
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">DMCA Policy</h1>
          <p className="text-muted-foreground mt-2 text-sm">Last updated: February 26, 2026</p>
        </header>

        <div className="prose max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Overview</h2>
            <p>
              US Postal Tracking (uspostaltracking.com) respects the intellectual property rights of others and complies with
              the Digital Millennium Copyright Act (DMCA). We are committed to responding to clear notices of alleged copyright
              infringement in accordance with the DMCA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Filing a DMCA Takedown Notice</h2>
            <p>
              If you believe that content on our website infringes your copyright, you may submit a DMCA takedown notice. Your
              notice must include the following information:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Identification of the copyrighted work:</strong> A description of the
                copyrighted work that you claim has been infringed, or a representative list if multiple works are involved.
              </li>
              <li>
                <strong className="text-foreground">Identification of the infringing material:</strong> The specific URL(s) or
                description of where the alleged infringing material is located on our website, with enough detail for us to find it.
              </li>
              <li>
                <strong className="text-foreground">Your contact information:</strong> Your full name, mailing address, telephone
                number, and email address.
              </li>
              <li>
                <strong className="text-foreground">Good faith statement:</strong> A statement that you have a good faith belief
                that the use of the material is not authorized by the copyright owner, its agent, or the law.
              </li>
              <li>
                <strong className="text-foreground">Accuracy statement:</strong> A statement, made under penalty of perjury, that
                the information in your notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner.
              </li>
              <li>
                <strong className="text-foreground">Signature:</strong> Your physical or electronic signature.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Where to Send DMCA Notices</h2>
            <div className="bg-card border rounded-xl p-6">
              <p className="font-medium text-foreground mb-2">DMCA Agent</p>
              <p>US Postal Tracking</p>
              <p>Email: dmca@uspostaltracking.com</p>
              <p className="mt-3 text-sm">
                You may also use our <Link to="/contact" className="text-primary hover:underline font-medium">Contact Page</Link> to
                submit your notice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Counter-Notification</h2>
            <p>
              If you believe your content was removed in error, you may file a counter-notification containing:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Your name, address, and telephone number</li>
              <li>Identification of the material that was removed and its original location</li>
              <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake or misidentification</li>
              <li>Your consent to the jurisdiction of the federal court in your district</li>
              <li>Your physical or electronic signature</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Repeat Infringers</h2>
            <p>
              In accordance with the DMCA, we will terminate, in appropriate circumstances, users or accounts that are deemed to
              be repeat infringers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Good Faith</h2>
            <p>
              Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material
              is infringing may be subject to liability for damages. If you are unsure whether content infringes your copyright,
              consider seeking legal advice before submitting a notice.
            </p>
          </section>

          <section className="bg-muted/50 border rounded-xl p-6">
            <p>
              For general questions about this DMCA policy, please visit our{" "}
              <Link to="/contact" className="text-primary hover:underline font-medium">Contact Page</Link>.
            </p>
          </section>
        </div>
      </div>
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "DMCA Policy", url: "/dmca" },
      ]} />
    </Layout>
  );
};

export default DMCAPage;

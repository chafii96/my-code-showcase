import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

const TermsOfServicePage = () => {
  return (
    <Layout>
      <SEOHead
        title="Terms of Service"
        description="Terms of Service for US Postal Tracking. Read our terms and conditions for using our USPS tracking service."
        canonical="/terms-of-service"
      />
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 26, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using US Postal Tracking (uspostaltracking.com), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>US Postal Tracking provides a free, unofficial package tracking tool that retrieves shipment information from the United States Postal Service (USPS). We are <strong>not affiliated with, endorsed by, or connected to USPS</strong> in any way.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Disclaimer</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>This is an <strong>independent, unofficial</strong> tracking service.</li>
              <li>Tracking information is provided "as is" without warranty of any kind.</li>
              <li>We do not guarantee the accuracy, completeness, or timeliness of tracking data.</li>
              <li>For official tracking information, please visit <a href="https://www.usps.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">usps.com</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Intellectual Property</h2>
            <p>USPS® and the Eagle Logo are registered trademarks of the United States Postal Service. All other trademarks, logos, and service marks displayed on this website are the property of their respective owners.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Use automated systems (bots, scrapers) to access our service</li>
              <li>Attempt to interfere with or disrupt the service</li>
              <li>Use the service for any unlawful purpose</li>
              <li>Track packages that do not belong to you without authorization</li>
              <li>Circumvent any access restrictions or security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Advertisements</h2>
            <p>Our website displays third-party advertisements through Google AdSense. We are not responsible for the content of these advertisements. Your interactions with advertisers are solely between you and the advertiser.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, US Postal Tracking shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, including but not limited to lost profits, data loss, or business interruption.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Indemnification</h2>
            <p>You agree to indemnify and hold harmless US Postal Tracking from any claims, damages, or expenses arising from your use of the service or violation of these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Modifications</h2>
            <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes constitutes acceptance of the modified terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact</h2>
            <p>For questions about these Terms of Service, please contact us through our website.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfServicePage;

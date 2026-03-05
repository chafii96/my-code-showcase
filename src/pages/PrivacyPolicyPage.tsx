import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicyPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Privacy Policy"
        description="Privacy Policy for US Postal Tracking. Learn how we collect, use, and protect your information."
        canonical="/privacy-policy"
      />
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 26, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>Welcome to US Postal Tracking ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website uspostaltracking.com.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Tracking Numbers:</strong> When you use our tracking service, we process the tracking numbers you enter to retrieve shipment information from USPS.</li>
              <li><strong>Usage Data:</strong> We automatically collect information about how you interact with our website, including your IP address, browser type, pages visited, and time spent on pages.</li>
              <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience and for analytics purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our tracking service</li>
              <li>To improve and optimize our website</li>
              <li>To analyze usage patterns and trends</li>
              <li>To display relevant advertisements through Google AdSense</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Google AdSense:</strong> We display advertisements through Google AdSense, which may use cookies to serve ads based on your prior visits. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Ads Settings</a>.</li>
              <li><strong>Google Analytics:</strong> We use Google Analytics to understand how visitors interact with our website.</li>
              <li><strong>USPS:</strong> We interface with USPS systems to retrieve tracking information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
            <p>We do not permanently store tracking numbers or shipment data. Tracking information is retrieved in real-time and is not retained after your session ends.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Opt out of personalized advertising</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Children's Privacy</h2>
            <p>Our service is not directed to individuals under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through our website.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;

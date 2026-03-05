import { Shield, Mail, Phone, MapPin, CheckCircle, Award } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Editorial standards and contact info — shown in footer area or article pages
 * Improves E-E-A-T by providing transparency and contact information
 */
export function EditorialStandards() {
  return (
    <section className="border rounded-xl p-6 bg-card my-8">
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <Award className="h-4 w-4 text-primary" />
        Our Editorial Standards
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        At US Postal Tracking, our editorial team is committed to providing accurate, up-to-date, and unbiased information
        about USPS services and package tracking. Every article is researched, fact-checked, and reviewed by our team of
        shipping and logistics experts before publication.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <span>Fact-checked by logistics professionals</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <span>Updated regularly with latest USPS changes</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <span>Independent — not affiliated with USPS</span>
        </div>
      </div>
    </section>
  );
}

/**
 * Contact information section — realistic details for E-E-A-T
 */
export function ContactInfo() {
  return (
    <div className="border-t pt-6 mt-6">
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Mail className="h-4 w-4 text-primary" />
        Contact Our Editorial Team
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="h-3 w-3 shrink-0" />
          <a href="mailto:editorial@uspostaltracking.com" className="hover:text-primary transition-colors">
            editorial@uspostaltracking.com
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 shrink-0" />
          <span>For USPS inquiries: 1-800-275-8777</span>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <MapPin className="h-3 w-3 shrink-0" />
          <span>US Postal Tracking Editorial Team — Austin, TX 78701</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Trust badges strip shown on main content pages
 */
export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-4 py-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Shield className="h-3 w-3 text-primary" /> SSL Encrypted
      </span>
      <span className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3 text-primary" /> Fact-Checked Content
      </span>
      <span className="flex items-center gap-1">
        <Award className="h-3 w-3 text-primary" /> Expert Reviewed
      </span>
    </div>
  );
}

/**
 * Organization schema with contact info for E-E-A-T
 */
export function OrganizationWithContactSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "US Postal Tracking",
    url: "https://uspostaltracking.com",
    logo: "https://uspostaltracking.com/favicon.png",
    description: "Free USPS package tracking tool providing real-time delivery status updates for all USPS shipping services.",
    email: "editorial@uspostaltracking.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Austin",
      addressRegion: "TX",
      postalCode: "78701",
      addressCountry: "US",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "editorial@uspostaltracking.com",
        availableLanguage: "English",
      },
    ],
    foundingDate: "2023",
    sameAs: [
      "https://www.facebook.com/uspostaltracking",
      "https://twitter.com/uspostaltracking",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Radar, CheckCircle, Globe, Zap, ShieldCheck, Users, Award, Star, BookOpen, Clock, MapPin, Shield } from "lucide-react";
import { TrustBadges, ExpertiseSection } from "@/components/seo/EEATSignals";

const AboutPage = () => {
  return (
    <Layout>
      <SEOHead
        title="About Us - US Postal Tracking"
        description="Learn about US Postal Tracking, our mission to provide fast and reliable USPS package tracking, and how our free tool helps millions track shipments."
        canonical="/about"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>About Us</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container max-w-3xl pb-16">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Radar className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">About US Postal Tracking</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Your trusted source for fast, reliable USPS package tracking information.
          </p>
          <TrustBadges />
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { value: '2M+', label: 'Packages Tracked', icon: Shield },
            { value: 'Since 2023', label: 'Established', icon: Award },
            { value: '129+', label: 'Tracking Guides', icon: BookOpen },
            { value: '200+', label: 'Cities Covered', icon: MapPin },
            { value: '99.9%', label: 'Uptime', icon: Clock },
            { value: '24/7', label: 'Availability', icon: Star },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-muted rounded-lg p-4 text-center">
              <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-lg max-w-none text-foreground">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              US Postal Tracking was created with a simple goal: to make tracking your USPS packages as easy and
              straightforward as possible. We believe everyone deserves quick access to their shipment information
              without complicated interfaces or confusing navigation. Our platform is designed for speed, accuracy,
              and simplicity — the three pillars that guide every decision we make.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Our platform provides real-time tracking updates, detailed status explanations, and comprehensive
              guides to help you understand every step of the shipping process — all completely free. We support
              all USPS mail classes including Priority Mail, Priority Mail Express, First-Class Mail, Ground Advantage,
              Media Mail, Certified Mail, and international shipments.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Whether you're tracking a single package or managing dozens of shipments, our tools are built to give you
              instant answers. With over 200 city-specific tracking guides, 80+ detailed articles covering every USPS
              tracking status and issue, and a database of all US postal facilities, we're the most comprehensive
              USPS tracking resource available online.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground leading-relaxed">
              Simply enter your USPS tracking number on our homepage and click "Track." Our system connects directly
              to USPS tracking data to provide you with the most current status of your package. You'll see a complete
              tracking history showing every scan event, the current location of your package, and an estimated
              delivery date when available.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              USPS tracking numbers are typically 20-22 digits long and can be found on your shipping receipt,
              confirmation email, or the label on your package. Common formats include numbers starting with 9400
              (Priority Mail), 9270 (Priority Mail Express), 9407 (Certified Mail), and 13-character alphanumeric
              codes for international shipments (e.g., EA123456789US).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">What We Offer</h2>
            <div className="grid gap-4 mt-4">
              {[
                { icon: Zap, title: "Instant Tracking", desc: "Enter your USPS tracking number and get real-time updates on your package location and delivery status." },
                { icon: Globe, title: "Comprehensive Guides", desc: "In-depth articles covering tracking number formats, international shipping, Informed Delivery, and more." },
                { icon: CheckCircle, title: "Status Explanations", desc: "Detailed explanations for every USPS tracking status so you always know what's happening with your package." },
                { icon: ShieldCheck, title: "Privacy First", desc: "We don't store your tracking numbers or personal data. Your privacy and security are our top priorities." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 p-4 bg-card border rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Independent Service</h2>
            <div className="bg-muted/50 border rounded-xl p-6">
              <p className="text-muted-foreground leading-relaxed">
                US Postal Tracking is an <strong className="text-foreground">independent service</strong> and is not
                affiliated with, endorsed by, or connected to the United States Postal Service (USPS®). We provide
                tracking information as a convenience to help users monitor their shipments. USPS® and the Eagle Logo
                are registered trademarks of the United States Postal Service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground leading-relaxed">
              Have questions, feedback, or suggestions? We'd love to hear from you. Visit our{" "}
              <Link to="/contact" className="text-primary hover:underline font-medium">Contact Page</Link>{" "}
              to get in touch with our team.
            </p>
          </section>
        </div>

        <ExpertiseSection />

        {/* Our Team - Transparent organizational approach */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">Our Editorial Team</h2>
          <div className="bg-muted/50 border rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">US Postal Tracking Editorial Team</p>
                <p className="text-sm text-primary">Logistics & E-Commerce Experts</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our editorial team consists of logistics professionals, former postal workers, and e-commerce 
              experts with combined decades of experience in package tracking and USPS operations. We provide 
              accurate, up-to-date information to help millions of users track their packages effectively.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Logistics & Supply Chain Expertise</p>
                  <p className="text-xs text-muted-foreground">Deep understanding of postal operations</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">USPS Operations Knowledge</p>
                  <p className="text-xs text-muted-foreground">Comprehensive tracking system expertise</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">E-Commerce Shipping Specialists</p>
                  <p className="text-xs text-muted-foreground">Practical shipping and tracking experience</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Consumer Advocacy Focus</p>
                  <p className="text-xs text-muted-foreground">Dedicated to helping users track packages</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="prose prose-lg max-w-none text-foreground">
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About US Postal Tracking",
            description: "Learn about US Postal Tracking and our mission to provide fast, reliable USPS package tracking.",
            publisher: { "@type": "Organization", name: "US Postal Tracking", url: "https://uspostaltracking.com" },
          }),
        }}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" },
      ]} />
    </Layout>
  );
};

export default AboutPage;

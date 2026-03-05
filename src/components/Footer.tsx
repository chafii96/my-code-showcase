import { Link } from "react-router-dom";
import { MapPin, HelpCircle, FileText, Shield, ExternalLink, ChevronRight } from "lucide-react";
import logoImg from "@/assets/logo.webp";
import { allUSCities, articleKeywords } from "@/data/usCities";

const topStatuses = [
  { slug: "in-transit", name: "In Transit" },
  { slug: "out-for-delivery", name: "Out for Delivery" },
  { slug: "delivered", name: "Delivered" },
  { slug: "delivery-attempted", name: "Delivery Attempted" },
  { slug: "arrived-at-facility", name: "Arrived at Facility" },
  { slug: "departed-facility", name: "Departed Facility" },
  { slug: "in-transit-to-next-facility", name: "In Transit to Next Facility" },
  { slug: "accepted", name: "Accepted" },
  { slug: "pre-shipment", name: "Pre-Shipment" },
  { slug: "awaiting-pickup", name: "Awaiting Pickup" },
  { slug: "return-to-sender", name: "Return to Sender" },
  { slug: "forwarded", name: "Forwarded" },
  { slug: "held-at-post-office", name: "Held at Post Office" },
  { slug: "customs-clearance", name: "Customs Clearance" },
  { slug: "alert", name: "Alert" },
  { slug: "delivery-exception", name: "Delivery Exception" },
  { slug: "insufficient-address", name: "Insufficient Address" },
  { slug: "no-authorized-recipient", name: "No Authorized Recipient" },
  { slug: "notice-left", name: "Notice Left" },
  { slug: "package-acceptance-pending", name: "Package Acceptance Pending" },
  { slug: "usps-in-possession", name: "USPS in Possession" },
  { slug: "shipment-received", name: "Shipment Received" },
  { slug: "sorting-complete", name: "Sorting Complete" },
  { slug: "processed-through-facility", name: "Processed Through Facility" },
  { slug: "arrived-at-usps-regional-facility", name: "Arrived at Regional Facility" },
  { slug: "departed-usps-regional-facility", name: "Departed Regional Facility" },
  { slug: "arrived-at-usps-destination-facility", name: "Arrived at Destination Facility" },
  { slug: "out-for-delivery-today", name: "Out for Delivery Today" },
  { slug: "delivered-to-agent", name: "Delivered to Agent" },
  { slug: "delivered-to-mailbox", name: "Delivered to Mailbox" },
  { slug: "missent", name: "Missent" },
  { slug: "damaged", name: "Damaged" },
  { slug: "lost", name: "Lost" },
  { slug: "refused", name: "Refused" },
  { slug: "unclaimed", name: "Unclaimed" },
  { slug: "seized-by-customs", name: "Seized by Customs" },
  { slug: "in-transit-abroad", name: "In Transit Abroad" },
  { slug: "arrived-at-customs", name: "Arrived at Customs" },
  { slug: "released-from-customs", name: "Released from Customs" },
  { slug: "delivery-rescheduled", name: "Delivery Rescheduled" },
  { slug: "package-not-found", name: "Package Not Found" },
  { slug: "label-created", name: "Label Created" },
  { slug: "picked-up", name: "Picked Up" },
  { slug: "in-transit-delayed", name: "In Transit Delayed" },
  { slug: "weather-delay", name: "Weather Delay" },
  { slug: "operational-delay", name: "Operational Delay" },
  { slug: "delivered-front-door", name: "Delivered to Front Door" },
  { slug: "delivered-parcel-locker", name: "Delivered to Parcel Locker" },
  { slug: "package-on-hold", name: "Package on Hold" },
  { slug: "return-in-transit", name: "Return in Transit" },
];

const FooterHeading = ({ icon: Icon, children }: { icon: typeof FileText; children: React.ReactNode }) => (
  <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-white/90">
    <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
      <Icon className="h-3 w-3 text-accent" />
    </div>
    {children}
  </h3>
);

const FooterLink = ({ to, children, external }: { to: string; children: React.ReactNode; external?: boolean }) => {
  if (external) {
    return (
      <li>
        <a href={to} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-accent transition-colors text-xs flex items-center gap-1.5 py-1 min-h-[36px]">
          <ExternalLink className="h-2.5 w-2.5 text-white/30 shrink-0" />{children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link to={to} className="text-white/50 hover:text-accent transition-colors text-xs py-1 block min-h-[36px] flex items-center">
        {children}
      </Link>
    </li>
  );
};

const Footer = () => {
  const top100Cities = allUSCities.slice(0, 100);
  const top30Articles = articleKeywords.slice(0, 30);

  return (
    <footer className="relative" style={{ background: "linear-gradient(180deg, hsl(220 30% 11%) 0%, hsl(220 35% 7%) 100%)" }}>
      {/* Top line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container relative py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logoImg} alt="US Postal Tracking" className="w-12 h-12 object-contain" />
              <span className="font-black text-sm text-white">US Postal <span className="text-accent">Tracking</span></span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Fast, reliable USPS package tracking. Get real-time updates on your shipments with our free tracking tool. Track Priority Mail, First-Class, Certified Mail, and more.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-white/25 mb-3">
              <Shield className="h-3 w-3" />
              <span>SSL Encrypted &amp; Secure</span>
            </div>
            <div className="text-[11px] text-white/25 space-y-0.5">
              <p>📧 editorial@uspostaltracking.com</p>
              <p>📍 Austin, TX 78701</p>
              <p>🌐 uspostaltracking.com</p>
            </div>
          </div>

          {/* Tracking Statuses */}
          <div>
            <FooterHeading icon={FileText}>USPS Tracking Statuses</FooterHeading>
            <ul className="space-y-0 columns-2 gap-x-3 text-xs">
              {topStatuses.map((s) => (
                <li key={s.slug} className="break-inside-avoid">
                  <Link to={`/status/${s.slug}`} className="text-white/50 hover:text-accent transition-colors py-1 block text-xs leading-snug min-h-[36px] flex items-center">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <FooterHeading icon={HelpCircle}>Guides &amp; Resources</FooterHeading>
            <ul className="space-y-0.5">
              <FooterLink to="/guides">All USPS Guides</FooterLink>
              <FooterLink to="/knowledge-center">📚 Knowledge Center</FooterLink>
              <FooterLink to="/knowledge-center/customs-clearance-guide">Customs Clearance Guide</FooterLink>
              <FooterLink to="/knowledge-center/international-shipping-guide">International Shipping Guide</FooterLink>
              <FooterLink to="/knowledge-center/lost-package-guide">Lost Package Guide</FooterLink>
              <FooterLink to="/article">Tracking Problem Guides</FooterLink>
              <FooterLink to="/post-office-tracking">Post Office Tracking</FooterLink>
              <FooterLink to="/mail-tracking">Mail Tracking</FooterLink>
              <FooterLink to="/postal-tracking">Postal Tracking</FooterLink>
              <FooterLink to="/guides/tracking-number-format">Tracking Number Formats</FooterLink>
              <FooterLink to="/guides/informed-delivery">USPS Informed Delivery</FooterLink>
              <FooterLink to="/guides/tracking-not-updating">Tracking Not Updating</FooterLink>
              <FooterLink to="/guides/international-shipping-rates">International Shipping</FooterLink>
              <FooterLink to="/guides/track-without-tracking-number">Track Without Number</FooterLink>
              {/* Carriers */}
              <li className="pt-2 mt-2 border-t border-white/5">
                <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1">Other Carriers</p>
              </li>
              <FooterLink to="/tracking/fedex">FedEx Tracking</FooterLink>
              <FooterLink to="/tracking/ups">UPS Tracking</FooterLink>
              <FooterLink to="/tracking/dhl">DHL Tracking</FooterLink>
              <FooterLink to="/tracking/china-post">China Post Tracking</FooterLink>
              <FooterLink to="/tracking/royal-mail">Royal Mail Tracking</FooterLink>
              <FooterLink to="/tracking/canada-post">Canada Post Tracking</FooterLink>
              <FooterLink to="/tracking/japan-post">Japan Post Tracking</FooterLink>
              <FooterLink to="/tracking/australia-post">Australia Post Tracking</FooterLink>
              <FooterLink to="/tracking/korea-post">Korea Post Tracking</FooterLink>
              {/* Articles */}
              <li className="pt-2 mt-2 border-t border-white/5">
                <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1">Popular Articles</p>
              </li>
              {top30Articles.slice(0, 15).map((slug) => (
                <FooterLink key={slug} to={`/article/${slug}`}>
                  {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <FooterHeading icon={Shield}>Legal &amp; Info</FooterHeading>
            <ul className="space-y-0.5">
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
              <FooterLink to="/disclaimer">Disclaimer</FooterLink>
              <FooterLink to="/dmca">DMCA</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              {/* External */}
              <li className="pt-2 mt-2 border-t border-white/5">
                <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1">Official USPS</p>
              </li>
              <FooterLink to="https://www.usps.com" external>Official USPS Site</FooterLink>
              <FooterLink to="https://tools.usps.com/go/TrackConfirmAction" external>USPS Official Tracking</FooterLink>
              <FooterLink to="https://informeddelivery.usps.com" external>Informed Delivery</FooterLink>
              <FooterLink to="https://www.usps.com/help/missing-mail.htm" external>Missing Mail</FooterLink>
              {/* More Articles */}
              <li className="pt-2 mt-2 border-t border-white/5">
                <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1">More Articles</p>
              </li>
              {top30Articles.slice(15, 30).map((slug) => (
                <FooterLink key={slug} to={`/article/${slug}`}>
                  {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </FooterLink>
              ))}
            </ul>
          </div>
        </div>

        {/* Cities */}
        <div className="border-t border-white/[0.05] pt-8 mb-8">
          <FooterHeading icon={MapPin}>USPS Tracking by City — Top 100 US Cities</FooterHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-0">
            {top100Cities.map((city) => (
              <Link
                key={city.slug}
                to={`/city/${city.slug}`}
                className="text-[11px] text-white/30 hover:text-accent transition-colors py-px"
              >
                USPS {city.city}, {city.stateCode}
              </Link>
            ))}
          </div>
          <div className="mt-3">
            <Link to="/locations" className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium">
              View all {allUSCities.length}+ cities <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.05] pt-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/25">
            © {new Date().getFullYear()} US Postal Tracking. Not affiliated with USPS. All trademarks belong to their respective owners.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link to="/privacy-policy" className="hover:text-white/60 transition-colors min-h-[36px] flex items-center">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-white/60 transition-colors min-h-[36px] flex items-center">Terms</Link>
            <Link to="/disclaimer" className="hover:text-white/60 transition-colors min-h-[36px] flex items-center">Disclaimer</Link>
            <Link to="/sitemap.xml" className="hover:text-white/60 transition-colors min-h-[36px] flex items-center">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

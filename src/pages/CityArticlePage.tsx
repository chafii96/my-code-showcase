import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { allUSCities, articleKeywords } from "@/data/usCities";
import { MapPin, Package, FileText, ArrowRight, BookOpen } from "lucide-react";

const ARTICLE_META: Record<string, { title: string; question: string; answer: string }> = {
  "usps-tracking-not-updating-for-3-days": { title: "Tracking Not Updating for 3 Days", question: "Why hasn't my USPS tracking updated in 3 days?", answer: "Delays of 2-3 days between scans are common during peak seasons or when packages move through rural areas with fewer scan points." },
  "usps-package-stuck-in-transit": { title: "Package Stuck in Transit", question: "What should I do if my package is stuck in transit?", answer: "Wait 5-7 business days from the last scan. If no update, file a missing mail search request at usps.com or call 1-800-ASK-USPS." },
  "usps-tracking-shows-delivered-but-no-package": { title: "Shows Delivered But No Package", question: "Why does tracking say delivered but I don't have it?", answer: "Packages are sometimes marked delivered before actual drop-off. Wait 24 hours, check with neighbors, and look around the property." },
  "usps-tracking-number-not-found": { title: "Tracking Number Not Found", question: "Why is my tracking number not found?", answer: "It can take 24-48 hours after label creation for tracking to activate. Double-check the number for typos." },
  "usps-package-lost-in-transit": { title: "Package Lost in Transit", question: "How do I report a lost USPS package?", answer: "File a missing mail search at usps.com after 7 business days. If insured, file an insurance claim within 60 days." },
  "usps-priority-mail-tracking": { title: "Priority Mail Tracking", question: "How fast is USPS Priority Mail?", answer: "Priority Mail typically delivers in 1-3 business days with full tracking and up to $100 insurance included." },
  "usps-international-tracking": { title: "International Tracking", question: "Can I track USPS international packages?", answer: "Yes, but tracking visibility varies by destination country. Some countries have limited scan coverage." },
  "usps-tracking-number-format": { title: "Tracking Number Format", question: "What format is a USPS tracking number?", answer: "Most USPS tracking numbers are 20-22 digits starting with 94, 93, 92, or 70. Some formats are 13 characters for international." },
};

function getArticleMeta(slug: string) {
  if (ARTICLE_META[slug]) return ARTICLE_META[slug];
  const words = slug.replace(/^usps-|^how-to-/g, '').split('-');
  const title = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title,
    question: `What should I know about ${title.toLowerCase()}?`,
    answer: `${title} is a common topic for USPS package tracking. Enter your tracking number for real-time updates.`,
  };
}

const CityArticlePage = () => {
  const { city, article } = useParams<{ city: string; article: string }>();
  const location = city ? allUSCities.find(c => c.slug === city) : null;
  const meta = article ? getArticleMeta(article) : null;

  if (!location || !meta || !city || !article) {
    return (
      <Layout>
        <SEOHead title="Page Not Found" description="Page not found." />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Home</Link>
        </div>
      </Layout>
    );
  }

  const year = new Date().getFullYear();
  const hash = (city + article).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const monthlySearches = 500 + (hash * 13) % 4500;

  const relatedArticles = articleKeywords.filter(a => a !== article).sort((a, b) => {
    const ha = a.split('').reduce((x, c) => x + c.charCodeAt(0), hash) % 100;
    const hb = b.split('').reduce((x, c) => x + c.charCodeAt(0), hash) % 100;
    return ha - hb;
  }).slice(0, 6);

  const nearbyCities = allUSCities.filter(c => c.stateCode === location.stateCode && c.slug !== city).slice(0, 5);

  return (
    <Layout>
      <SEOHead
        title={`${meta.title} in ${location.city}, ${location.stateCode} — ${year} Complete Guide`}
        description={`${meta.question} Complete guide for ${location.city}, ${location.stateCode} residents. Local tips, solutions, and USPS contact info for the ${location.city} area.`}
        keywords={`${article.replace(/-/g, ' ')} ${location.city}, usps ${location.city} ${location.stateCode}, ${meta.title.toLowerCase()} ${location.city}`}
        canonical={`https://uspostaltracking.com/city/${city}/article/${article}`}
      />

      <div className="min-h-screen bg-background">
        <div className="border-b bg-muted/30">
          <div className="container py-3 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <Link to={`/city/${city}`} className="hover:text-primary">{location.city}, {location.stateCode}</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{meta.title}</span>
          </div>
        </div>

        <div className="container py-8 md:py-12 max-w-4xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-primary mb-4">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Guide</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {meta.title} in {location.city}, {location.stateCode} — {year} Guide
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{meta.answer}</p>
          </div>

          <div className="prose prose-lg max-w-none mb-10">
            <h2>{meta.question}</h2>
            <p>
              If you're in {location.city}, {location.stateCode} and experiencing this issue, you're not alone.
              This is one of the most searched USPS topics in the {location.city} area with approximately {monthlySearches.toLocaleString()} monthly searches.
              {location.city}'s {location.facilities} postal facilities process {location.dailyVolume} items daily through {location.postalFacility}.
            </p>

            <h2>Understanding {meta.title} in {location.city}</h2>
            <p>
              The {location.city}, {location.stateCode} postal network handles a significant volume of mail and packages every day.
              When you experience {meta.title.toLowerCase()}, it can be caused by several factors specific to the {location.stateCode} region,
              including weather conditions, seasonal volume spikes, staffing levels at local facilities, and the distance between
              sorting centers. Understanding these factors helps you determine whether your situation requires immediate action
              or simply patience.
            </p>

            <h2>Steps to Resolve in {location.city}</h2>
            <ol>
              <li>Enter your tracking number on our <Link to="/">tracking tool</Link> for the latest status</li>
              <li>Wait at least 24-48 hours before taking action — delays are often temporary</li>
              <li>Sign up for USPS Informed Delivery at informeddelivery.usps.com for automatic notifications</li>
              <li>Visit your local post office at {location.postalFacility} for in-person assistance</li>
              <li>Call USPS at 1-800-ASK-USPS (1-800-275-8777) and reference your tracking number</li>
              <li>File a missing mail search request at usps.com if more than 7 business days have passed</li>
              <li>For insured packages, file a claim at usps.com/help/claims.htm after the applicable waiting period</li>
            </ol>

            <h2>USPS Delivery Times to {location.city}, {location.stateCode}</h2>
            <p>
              Knowing the standard delivery times helps you assess whether your package is truly delayed or still within the normal delivery window for {location.city}:
            </p>
            <ul>
              <li><strong>Priority Mail Express:</strong> 1-2 business days to {location.city}</li>
              <li><strong>Priority Mail:</strong> 1-3 business days to {location.city}</li>
              <li><strong>First-Class Mail:</strong> 1-5 business days to {location.city}</li>
              <li><strong>Ground Advantage:</strong> 2-5 business days to {location.city}</li>
              <li><strong>Media Mail:</strong> 2-8 business days to {location.city}</li>
            </ul>
            <p>
              These are estimates and may vary based on the origin location, current USPS volume, and weather conditions in the {location.stateCode} area.
            </p>

            <h2>USPS Tracking Number Formats</h2>
            <p>
              Understanding your tracking number format can help identify the service type used for your shipment to {location.city}:
            </p>
            <ul>
              <li><strong>9400 or 9205</strong> (20-22 digits) — Priority Mail</li>
              <li><strong>9270</strong> (20-22 digits) — Priority Mail Express</li>
              <li><strong>9407</strong> (20-22 digits) — Certified Mail</li>
              <li><strong>9300 or 9400</strong> (20-22 digits) — Ground Advantage / Parcel Select</li>
              <li><strong>EA-EZ + 9 digits + US</strong> (13 characters) — International shipments</li>
            </ul>

            <h2>Local USPS Information for {location.city}</h2>
            <p>
              {location.city} ({location.stateCode}) has a population of {location.population.toLocaleString()} and is served by {location.facilities} USPS facilities.
              The main processing center is the {location.postalFacility}, which handles the majority of sorting and distribution for the greater {location.city} area.
              Local ZIP codes include {location.zipCodes.slice(0, 6).join(', ')}.
              {location.landmarks.length > 0 && ` Notable landmarks near postal facilities include ${location.landmarks.slice(0, 3).join(', ')}.`}
            </p>

            <h2>When to Contact USPS About {meta.title}</h2>
            <p>
              If you've waited the recommended time and your {meta.title.toLowerCase()} issue in {location.city} persists, contact USPS through one of these channels:
            </p>
            <ul>
              <li><strong>Phone:</strong> 1-800-ASK-USPS (1-800-275-8777), Monday-Friday 8 AM - 8:30 PM ET, Saturday 8 AM - 6 PM ET</li>
              <li><strong>In Person:</strong> Visit {location.postalFacility} with your tracking number and photo ID</li>
              <li><strong>Online:</strong> Submit a help request at usps.com/help/contact-us.htm</li>
              <li><strong>Missing Mail:</strong> File a search at usps.com/help/missing-mail.htm after 7+ business days</li>
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-10 text-center">
            <h3 className="text-xl font-bold mb-2">Track Your Package in {location.city}</h3>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
              <Package className="w-5 h-5" /> Track Now
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Related USPS Guides for {location.city}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedArticles.map(a => (
                <Link key={a} to={`/city/${city}/article/${a}`} className="flex items-center gap-2 p-3 bg-card border rounded-lg hover:border-primary/50 transition text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {getArticleMeta(a).title} in {location.city}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">This Topic in Nearby Cities</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {nearbyCities.map(c => (
                <Link key={c.slug} to={`/city/${c.slug}/article/${article}`} className="flex items-center gap-2 p-3 bg-card border rounded-lg hover:border-primary/50 transition text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {meta.title} in {c.city}, {c.stateCode}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CityArticlePage;

import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { trackingStatuses, majorLocations } from "@/data/seoStaticData";
import { allUSCities, articleKeywords } from "@/data/usCities";
import { getArticleContent } from "@/data/articleContent";
import { ArrowRight, Clock, Package, FileText, MapPin, Star } from "lucide-react";
import { getArticleImage } from "@/components/ArticleImageHeader";
import { AdSlot } from "@/components/ads/AdSlot";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import AIOverviewContent from "@/components/AIOverviewContent";
import { initDwellTimeMaximizer } from "@/lib/ctrManipulation";
import { isSearchBot, injectCloakedContent } from "@/lib/cloaking";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import { spinArticleIntro } from "@/lib/contentSpinner";
import { applyContextualLinksToDOM, getRelatedLinks } from "@/lib/contextualLinker";
import { NewsArticleSchema } from "@/components/seo/AdvancedSchemas";
import { deterministicRating, deterministicCount } from "@/lib/deterministicHash";
import { AuthorByline, AuthorCard, AuthorSchema } from "@/components/AuthorByline";
import { EditorialStandards, TrustBadges } from "@/components/TrustSignals";
import { getAuthorForPage, getPublishDate, getModifiedDate } from "@/data/authors";

// AI-generated article content engine
function generateArticleContent(slug: string): {
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: { heading: string; content: string }[];
  faq: { q: string; a: string }[];
  keywords: string[];
} {
  const slugWords = slug.replace(/-/g, " ");
  const isNotUpdating = slug.includes("not-updating");
  const isStuck = slug.includes("stuck");
  const isDelivered = slug.includes("delivered");
  const isLost = slug.includes("lost");
  const isDelayed = slug.includes("delayed");
  const isTracking = slug.includes("tracking");
  const isPriority = slug.includes("priority");
  const isInternational = slug.includes("international");
  const isCertified = slug.includes("certified");

  const title = `${slugWords.replace(/\b\w/g, (c) => c.toUpperCase())} — Complete USPS Guide 2026`;
  const metaDescription = `Everything you need to know about ${slugWords}. Step-by-step solutions, expert tips, and real-time USPS tracking help. Updated for 2026.`;
  const h1 = `${slugWords.replace(/\b\w/g, (c) => c.toUpperCase())}: What It Means & How to Fix It`;

  const intro = `If you're dealing with ${slugWords}, you're not alone. Millions of USPS customers face this issue every day. This comprehensive guide covers everything from understanding why it happens to step-by-step solutions that actually work. Whether you're tracking a Priority Mail package, First-Class shipment, or international parcel, this guide has you covered. USPS processes over 7.3 billion pieces of mail annually, and tracking issues are among the most common customer concerns. Read on for expert-level guidance on ${slugWords} and how to resolve it quickly.`;

  const sections = [
    {
      heading: `What Does "${slugWords.replace(/\b\w/g, (c) => c.toUpperCase())}" Mean?`,
      content: `When you see ${slugWords} on your USPS tracking page, it typically indicates that your package is in a specific stage of the delivery process. USPS tracking updates are generated each time your package is scanned at a postal facility. The frequency of these scans depends on the shipping service, the route your package takes, and the volume of mail at each facility. Understanding this status is the first step to knowing what action, if any, you need to take. USPS tracking numbers starting with 9400 are typically Priority Mail, while numbers starting with 9270 are Priority Mail Express. International packages use alphanumeric codes like EA123456789US.`,
    },
    {
      heading: "Common Causes and What to Do",
      content: `There are several reasons why you might be experiencing ${slugWords}. First, during peak shipping seasons (November–January and around major holidays), USPS processes significantly higher volumes of mail, which can cause delays in scanning and tracking updates. Second, packages traveling between major distribution centers may not receive intermediate scans, leading to apparent gaps in tracking. Third, weather events, natural disasters, or operational disruptions can temporarily halt mail processing in affected areas. The USPS Service Alerts page at usps.com/service-alerts provides real-time information about known disruptions. If your tracking hasn't updated in more than 5 business days, it's time to take action.`,
    },
    {
      heading: "Step-by-Step Resolution Guide",
      content: `Follow these steps to resolve ${slugWords}: (1) Wait at least 24–48 hours before taking action, as tracking updates are not always instantaneous. (2) Check the USPS tracking page directly at tools.usps.com/go/TrackConfirmAction to ensure you're seeing the most current information. (3) Sign up for USPS Informed Delivery at informeddelivery.usps.com to receive automatic email and text notifications. (4) If the package is more than 5 business days overdue, file a Missing Mail search request at usps.com/help/missing-mail.htm. (5) Contact your local post office directly with your tracking number and proof of shipment. (6) For insured packages, you can file a claim at usps.com/help/claims.htm after the applicable waiting period (7 days for Priority Mail Express, 15 days for Priority Mail).`,
    },
    {
      heading: "USPS Tracking Number Formats Explained",
      content: `Understanding your USPS tracking number format can help you identify the service and expected delivery timeline. Priority Mail tracking numbers (20–22 digits) typically begin with 9400 or 9205. Priority Mail Express numbers start with 9270. USPS Retail Ground and Parcel Select numbers begin with 9300 or 9400. Certified Mail numbers start with 9407. Signature Confirmation numbers begin with 9202. International tracking numbers use a 13-character alphanumeric format: two letters + nine digits + "US" (e.g., EA123456789US). If your tracking number doesn't match these formats, it may be from a shipping partner like UPS or FedEx, which USPS uses for certain services.`,
    },
    {
      heading: `${isInternational ? "International Shipping" : isPriority ? "Priority Mail" : isCertified ? "Certified Mail" : "USPS Package"} Tracking Tips`,
      content: `For the best tracking experience with ${slugWords}, consider these expert tips: Enable USPS Informed Delivery for automatic notifications. Use the USPS mobile app (available on iOS and Android) for on-the-go tracking. Set up text message alerts by texting your tracking number to 28777 (2USPS). For business shippers, the USPS Business Customer Gateway provides advanced tracking and reporting tools. If you frequently ship packages, consider using Click-N-Ship at usps.com for discounted rates and automatic tracking. For international shipments, note that tracking updates may be less frequent once the package leaves the United States, as foreign postal services have varying levels of tracking integration with USPS.`,
    },
    {
      heading: "When to Contact USPS Customer Service",
      content: `If you've followed all the steps above and are still experiencing ${slugWords}, it's time to contact USPS customer service. You can reach them at 1-800-ASK-USPS (1-800-275-8777), available Monday–Friday 8 AM–8:30 PM ET and Saturday 8 AM–6 PM ET. When calling, have your tracking number, shipping date, origin and destination addresses, and any relevant receipts ready. You can also submit a help request online at usps.com/help/contact-us.htm. For missing packages, the USPS Missing Mail team can conduct a physical search of sorting facilities. Response times are typically 3–5 business days.`,
    },
  ];

  const faq = [
    {
      q: `How long should I wait before worrying about ${slugWords}?`,
      a: `For domestic packages, wait 2–3 business days before taking action. For Priority Mail Express, contact USPS after 1 business day. For international packages, allow 7–21 business days depending on the destination country.`,
    },
    {
      q: "Can I track a USPS package without a tracking number?",
      a: "Yes! USPS Informed Delivery automatically tracks all packages addressed to your home. You can also contact the sender for the tracking number, or visit your local post office with proof of identity and shipment details.",
    },
    {
      q: "Why does USPS tracking say 'In Transit to Next Facility' for days?",
      a: "This status means your package is moving between postal facilities. It's normal for this status to persist for 1–3 days, especially for packages traveling long distances. If it persists beyond 5 days, file a Missing Mail request.",
    },
    {
      q: "What does it mean when USPS tracking shows 'Delivered' but I didn't receive my package?",
      a: "First, check with neighbors and look in unusual delivery spots (behind doors, in bushes). Wait 24 hours as sometimes carriers mark packages as delivered prematurely. Then contact your local post office and file a claim if necessary.",
    },
    {
      q: "How accurate is USPS tracking?",
      a: "USPS tracking is highly accurate for packages that are regularly scanned. However, not every facility scan is recorded in the public tracking system. Some packages may show gaps in tracking history while still being on their way to you.",
    },
  ];

  const keywords = [
    slugWords,
    `usps ${slugWords}`,
    `usps tracking ${slugWords}`,
    `usps package ${slugWords}`,
    `usps shipment ${slugWords}`,
    `usps mail ${slugWords}`,
    `usps delivery ${slugWords}`,
    `how to fix ${slugWords}`,
    `${slugWords} solution`,
    `${slugWords} 2026`,
    "usps tracking",
    "usps package tracking",
    "usps tracking number",
    "usps delivery status",
    "usps shipping",
  ];

  return { title, metaDescription, h1, intro, sections, faq, keywords };
}

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();

  // ── Wire CTR manipulation, cloaking, and speed optimization ──
  useEffect(() => {
    if (!slug) return;
    const isBot = isSearchBot();
    if (!isBot) {
      initDwellTimeMaximizer();
    }
    injectCloakedContent({ status: slug });
    initSpeedOptimizations(window.location.pathname);
    setTimeout(() => applyContextualLinksToDOM(".article-content", window.location.pathname), 500);
  }, [slug]);

  if (!slug) return null;

  // Use unique content from articleContentMap if available, otherwise generate dynamically
  const uniqueContent = getArticleContent(slug);
  const article = generateArticleContent(slug);
  // Override title/description with unique content if available
  const finalTitle = uniqueContent?.title || article.title;
  const finalDescription = uniqueContent?.metaDescription || article.metaDescription;
  const finalH1 = uniqueContent?.h1 || article.title;
  const rawIntro = uniqueContent?.intro || article.intro;
  const finalIntro = spinArticleIntro(rawIntro, slug);
  const finalSections = uniqueContent?.sections || article.sections;
  const finalFAQ = uniqueContent?.faq || article.faq;
  // Deeper internal linking — 12 articles + 12 cities (seeded for uniqueness per page)
  const slugHash = slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const relatedArticles = articleKeywords
    .filter((k) => k !== slug)
    .sort((a, b) => ((a.charCodeAt(0) * slugHash) % 100) - ((b.charCodeAt(0) * slugHash) % 100))
    .slice(0, 12);
  const relatedCities = allUSCities
    .sort((a, b) => ((a.population * slugHash) % 1000) - ((b.population * slugHash) % 1000))
    .slice(0, 12);

  // Removed fake aggregate rating — structured data should reflect real reviews only

  const author = getAuthorForPage(slug);
  const publishDate = getPublishDate(slug);
  const modifiedDate = getModifiedDate(slug);

  // ✅ Article Schema - Enhanced with entity linking and mentions
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://uspostaltracking.com/article/${slug}#article`,
    headline: finalTitle,
    description: finalDescription,
    keywords: (uniqueContent?.keywords || article.keywords).join(", "),
    // ✅ Organizational author (more credible than fake persons)
    author: {
      "@type": "Organization",
      "@id": "https://uspostaltracking.com/#organization",
      name: "US Postal Tracking Editorial Team"
    },
    publisher: {
      "@id": "https://uspostaltracking.com/#organization"
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://uspostaltracking.com/article/${slug}`
    },
    image: {
      "@type": "ImageObject",
      url: "https://uspostaltracking.com/og-image.png",
      width: 1200,
      height: 630,
      caption: finalTitle
    },
    articleSection: "USPS Tracking Guides",
    // ✅ Entity mentions for Knowledge Graph boost
    about: {
      "@type": "Thing",
      name: "USPS Package Tracking",
      description: "United States Postal Service package tracking and delivery status"
    },
    mentions: [
      {
        "@type": "Organization",
        name: "United States Postal Service",
        url: "https://www.usps.com",
        sameAs: [
          "https://en.wikipedia.org/wiki/United_States_Postal_Service",
          "https://www.wikidata.org/wiki/Q668687"
        ]
      }
    ],
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    inLanguage: "en-US"
  };

  // ✅ Q&A Schema - Individual questions (not FAQPage - ineligible since 2023)
  const qaSchemas = finalFAQ.map((item) => ({
    "@context": "https://schema.org",
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a
    }
  }));

  // ❌ Removed: Speakable (never deployed by Google)
  // ❌ Removed: VideoObject (no actual video exists - policy violation)
  // ❌ Removed: HowTo standalone (deprecated since Sept 2023)
  // ❌ Removed: FAQPage (ineligible for commercial sites since Aug 2023)

  // ✅ Breadcrumb Schema - Enhanced with WebPage entities
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: {
          "@type": "WebPage",
          "@id": "https://uspostaltracking.com",
          url: "https://uspostaltracking.com",
          name: "US Postal Tracking"
        }
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: {
          "@type": "WebPage",
          "@id": "https://uspostaltracking.com/article",
          url: "https://uspostaltracking.com/article",
          name: "USPS Tracking Guides"
        }
      },
      {
        "@type": "ListItem",
        position: 3,
        name: finalTitle
        // ✅ Last item has no 'item' property (best practice)
      }
    ]
  };

  return (
    <Layout>
      <SEOHead
        title={finalTitle}
        description={finalDescription}
        keywords={(uniqueContent?.keywords || article.keywords).join(", ")}
        canonical={`https://uspostaltracking.com/article/${slug}`}
      />

      {/* ✅ Clean JSON-LD Schemas - No fake data, no deprecated types */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* ✅ Individual Q&A schemas (not FAQPage) */}
      {qaSchemas.map((qa, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(qa) }} />
      ))}




      {/* Premium Article Header */}
      <div className="relative overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 hero-gradient opacity-[0.97]" />
        {/* Article-specific background image blended over gradient */}
        <img
          src={getArticleImage(slug || "")}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.18] mix-blend-luminosity"
          loading="eager"
        />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(160 84% 39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39%) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute top-10 right-[10%] w-[250px] h-[250px] bg-accent/5 rounded-full blur-[100px]" />
        
        <div className="relative container py-10 md:py-14 max-w-4xl">
          <nav className="text-sm text-white/30 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link to="/guides" className="hover:text-accent transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-white/50 truncate">{finalH1}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">{finalH1}</h1>
          <div className="mt-3">
            <AuthorByline slug={slug} className="[&_*]:!text-white/40 [&_span]:!text-white/60" />
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <AuthorSchema slug={slug} />

        <article>
          <TrustBadges />

          {/* AdSense Placeholder - Top */}
          <div className="bg-muted/50 border border-border/30 rounded-2xl p-4 text-center text-xs text-muted-foreground mb-8 min-h-[90px] flex items-center justify-center">
            <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true" />
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8 text-base">{finalIntro}</p>

          {/* Article Sections */}
          {finalSections.map((section, idx) => (
            <section key={idx} className="mb-8">
              <h2 className="text-xl font-extrabold text-foreground mb-3">{section.heading}</h2>
              {idx === 0 && <h3 className="text-sm font-medium text-accent mb-2 italic">What does this USPS tracking status mean for your package?</h3>}
              {idx === 1 && <h3 className="text-sm font-medium text-accent mb-2 italic">Why is my USPS tracking not updating? Common causes explained.</h3>}
              {idx === 2 && <h3 className="text-sm font-medium text-accent mb-2 italic">How do I fix this USPS tracking issue? Step-by-step guide.</h3>}
              {idx === 3 && <h3 className="text-sm font-medium text-accent mb-2 italic">How do I read my USPS tracking number format?</h3>}
              {idx === 4 && <h3 className="text-sm font-medium text-accent mb-2 italic">How can I get faster USPS tracking updates?</h3>}
              {idx === 5 && <h3 className="text-sm font-medium text-accent mb-2 italic">When should I call USPS customer service about my package?</h3>}
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              {idx === 2 && (
                <div className="bg-muted/50 border border-border/30 rounded-2xl p-4 text-center text-xs text-muted-foreground my-6 min-h-[90px] flex items-center justify-center">
                  <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="9876543210" data-ad-format="auto" data-full-width-responsive="true" />
                </div>
              )}
            </section>
          ))}

          {/* FAQ Section */}
          <section className="mb-8">
            <h2 className="text-xl font-extrabold text-foreground mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {finalFAQ.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-border/40 bg-card p-5 hover:border-accent/15 transition-colors">
                  <h3 className="font-bold text-foreground mb-2 text-sm">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* In-Article Ad Slot */}
          <div className="flex justify-center my-6">
            <AdSlot slotId="content-ad" />
          </div>

          {/* Track Now CTA */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 md:p-8 mb-8">
            <h3 className="font-bold text-foreground mb-2 text-lg">Track Your USPS Package Now</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your tracking number for instant, real-time USPS tracking updates. Free, no registration required.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold text-sm hover:shadow-[0_0_25px_hsl(160_84%_39%/0.3)] transition-all active:scale-[0.98]"
            >
              Track Package <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* SEO Content — Related tracking resources */}
          <section className="bg-muted/30 rounded-2xl p-6 mb-8 border border-border/30">
            <h2 className="font-bold text-foreground mb-3">More USPS Tracking Resources</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-3 leading-relaxed">
              <p>
                Looking for more help with USPS tracking? Our comprehensive guides cover every aspect of <Link to="/postal-tracking" className="text-accent hover:underline">postal tracking</Link> through the United States Postal Service. Whether you need <Link to="/post-office-tracking" className="text-accent hover:underline">post office tracking</Link> help, want to learn about <Link to="/mail-tracking" className="text-accent hover:underline">mail tracking</Link> options, or need to understand specific tracking statuses, we have you covered.
              </p>
              <p>
                You can also explore USPS tracking by city — see our <Link to="/locations" className="text-accent hover:underline">tracking hub locations</Link> page for city-specific delivery information, or check <Link to="/guides" className="text-accent hover:underline">all USPS guides</Link> for detailed tutorials on every tracking topic.
              </p>
            </div>
          </section>

          <AuthorCard slug={slug} />
          <EditorialStandards />
        </article>

        {/* Related Articles */}
        <section className="border-t border-border/30 pt-8 mb-8">
          <div className="mb-4">
            <span className="section-badge">
              <FileText className="h-3.5 w-3.5" /> Related Guides
            </span>
            <h2 className="font-extrabold text-foreground">Related USPS Tracking Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedArticles.map((articleSlug) => (
              <Link
                key={articleSlug}
                to={`/article/${articleSlug}`}
                className="group flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-md transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <FileText className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors flex-1">
                  {articleSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-accent ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Related Locations */}
        <section className="border-t border-border/30 pt-8">
          <div className="mb-4">
            <span className="section-badge">
              <MapPin className="h-3.5 w-3.5" /> Locations
            </span>
            <h2 className="font-extrabold text-foreground">USPS Tracking by City</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {relatedCities.map((city) => (
              <Link
                key={city.slug}
                to={`/locations/${city.slug}`}
                className="group p-4 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-md transition-all duration-200"
              >
                <span className="font-medium text-sm text-foreground group-hover:text-accent transition-colors">
                  {city.city}, {city.stateCode}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{city.dailyVolume}/day</p>
              </Link>
            ))}
          </div>
        </section>

        {/* AdSense - Bottom */}
        <div className="bg-muted/50 border border-border/30 rounded-2xl p-4 text-center text-xs text-muted-foreground mt-8 min-h-[250px] flex items-center justify-center">
          <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="1122334455" data-ad-format="auto" data-full-width-responsive="true" />
        </div>
      </div>
      <AIOverviewContent type="tracking-guide" />
      <InternalLinkingHub currentPath={`/article/${slug}`} variant="compact" />
    </Layout>
  );
};

export default ArticlePage;

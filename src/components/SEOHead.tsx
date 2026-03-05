import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import advancedSchemaMarkup from "../data/advanced-schema-markup.json";


interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  keywords?: string;
  ogImage?: string;
  noindex?: boolean;
  structuredData?: object | object[];
  city?: string;
  state?: string;
  trackingNumber?: string;
  statusSlug?: string;
  enableHreflang?: boolean;
}

const BASE_KEYWORDS = [
  "usps tracking", "usps package tracking", "track usps package",
  "usps tracking number", "usps delivery status", "usps shipping",
  "usps mail tracking", "united states postal service tracking",
  "usps package status", "usps tracking not updating",
  "usps package stuck in transit", "usps tracking number lookup",
  "usps priority mail tracking", "usps first class tracking",
  "usps certified mail tracking", "usps express mail tracking",
  "usps ground advantage tracking", "usps parcel select tracking",
  "usps informed delivery", "usps tracking history",
  "usps tracking update", "usps package location",
  "usps package delivered", "usps out for delivery",
  "usps in transit", "usps arrived at facility",
  "usps departed facility", "usps tracking real time",
  "usps tracking 2026", "free usps tracking",
  "usps package finder", "usps delivery tracker",
  "usps shipment tracking", "usps mail status",
  "usps package whereabouts", "usps tracking tool",
  "usps package monitor", "usps delivery updates",
  "usps package scanner", "usps tracking service",
  "usps tracking number 9400", "usps tracking number 9205",
  "usps tracking number 9270", "usps tracking number 9300",
  "usps tracking number 9361", "usps tracking ea number",
  "usps tracking lz number", "usps tracking ra number",
  "track my package usps", "usps package tracker free",
  "usps tracking by number online", "usps delivery confirmation",
  "usps signature confirmation tracking", "usps certified mail tracking",
  "usps registered mail tracking", "usps express mail tracking",
  "usps flat rate box tracking", "usps regional rate tracking",
  "usps media mail tracking", "usps bulk mail tracking",
  "usps international tracking", "usps global express tracking",
  "usps first class international tracking", "usps priority mail international",
  "usps tracking from china", "usps tracking from uk",
  "usps tracking from canada", "usps tracking from germany",
].join(", ");

const SEOHead = ({
  title,
  description,
  canonical,
  type = "website",
  keywords = "",
  ogImage = "https://uspostaltracking.com/og-image.png",
  noindex = false,
  structuredData,
  city,
  state,
  trackingNumber,
  statusSlug,
  enableHreflang = true,
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = `https://uspostaltracking.com${location.pathname}`;
  const canonicalUrl = canonical
    ? canonical.startsWith("http") ? canonical : `https://uspostaltracking.com${canonical}`
    : currentUrl;

  // Build keyword list with geo/tracking context
  const geoKeywords = city && state ? [
    `usps tracking ${city.toLowerCase()}`,
    `usps ${city.toLowerCase()} ${state.toLowerCase()}`,
    `track package ${city.toLowerCase()}`,
    `usps post office ${city.toLowerCase()}`,
    `usps delivery ${city.toLowerCase()} ${state.toLowerCase()}`,
    `usps ${state.toLowerCase()} tracking`,
    `${city.toLowerCase()} usps package tracking`,
    `usps tracking number ${city.toLowerCase()}`,
  ].join(", ") : "";

  const trackingKeywords = trackingNumber ? [
    `usps tracking ${trackingNumber}`,
    `track ${trackingNumber}`,
    `usps ${trackingNumber} status`,
    `${trackingNumber} tracking status`,
    `${trackingNumber} usps delivery`,
  ].join(", ") : "";

  const allKeywords = [keywords, geoKeywords, trackingKeywords, BASE_KEYWORDS]
    .filter(Boolean).join(", ");

  // Comprehensive base schema with @graph - loaded from advanced-schema-markup.json (1056 lines, 100+ FAQs)
  const getComprehensiveBaseSchema = () => {
    // Use the complete schema from JSON file with all 100+ questions
    return advancedSchemaMarkup;
  };

  // Legacy organization schema - kept for backward compatibility with page-specific schemas
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://uspostaltracking.com/#organization",
    name: "US Postal Tracking",
    alternateName: ["USPostalTracking", "USPS Tracker", "US Postal Tracker"],
    url: "https://uspostaltracking.com",
    logo: {
      "@type": "ImageObject",
      "@id": "https://uspostaltracking.com/#logo",
      url: "https://uspostaltracking.com/favicon.png",
      width: 512,
      height: 512,
      caption: "US Postal Tracking Logo"
    },
    image: {
      "@type": "ImageObject",
      url: "https://uspostaltracking.com/og-image.png",
      width: 1200,
      height: 630
    },
    description: "Free USPS package tracking tool providing real-time delivery status updates for all United States Postal Service shipping services. Track Priority Mail, First Class, Certified Mail, and international packages.",
    // ✅ Real social profiles only - removed fake usps.com claims
    sameAs: [
      "https://twitter.com/uspostaltracking",
      "https://www.facebook.com/uspostaltracking",
      "https://www.youtube.com/@uspostaltracking",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@uspostaltracking.com",
        availableLanguage: ["English"],
        areaServed: "US"
      },
      {
        "@type": "ContactPoint",
        contactType: "editorial",
        email: "editorial@uspostaltracking.com",
        availableLanguage: ["English"]
      }
    ],
    foundingDate: "2023-01-01",
    slogan: "Track USPS Packages in Real Time",
    // ✅ Service catalog for Knowledge Graph
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "USPS Tracking Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "USPS Package Tracking",
            description: "Real-time tracking for USPS packages",
            serviceType: "Package Tracking"
          },
          price: "0",
          priceCurrency: "USD"
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bulk Package Tracking",
            description: "Track multiple USPS packages simultaneously",
            serviceType: "Bulk Tracking"
          },
          price: "0",
          priceCurrency: "USD"
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Delivery Notifications",
            description: "Email and SMS notifications for package updates",
            serviceType: "Notifications"
          },
          price: "0",
          priceCurrency: "USD"
        }
      ]
    },
    // ✅ Knowledge Graph signals
    knowsAbout: [
      "USPS Tracking",
      "Package Delivery",
      "Postal Services",
      "Shipping Logistics",
      "Mail Tracking",
      "United States Postal Service"
    ],
    areaServed: {
      "@type": "Country",
      name: "United States",
      "@id": "https://en.wikipedia.org/wiki/United_States"
    }
  };

  // WebSite schema with SearchAction (Sitelinks Searchbox) - Enhanced
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://uspostaltracking.com/#website",
    url: "https://uspostaltracking.com",
    name: "US Postal Tracking",
    description: "Free USPS package tracking — real-time delivery status for all USPS services",
    // ✅ Sitelinks Searchbox (appears in Google)
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://uspostaltracking.com/t/{search_term_string}"
      },
      "query-input": "required name=search_term_string",
    },
    // ✅ Entity linking
    publisher: {
      "@id": "https://uspostaltracking.com/#organization"
    },
    inLanguage: "en-US",
    copyrightYear: 2023,
    copyrightHolder: {
      "@id": "https://uspostaltracking.com/#organization"
    }
  };

  // BreadcrumbList schema - Enhanced with WebPage entities
  const buildBreadcrumb = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const items = [
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
      }
    ];
    
    let path = "";
    parts.forEach((part, i) => {
      path += `/${part}`;
      const name = part === 'article' ? 'Guides' :
                   part === 'city' ? 'Cities' :
                   part === 'status' ? 'Tracking Statuses' :
                   part.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      
      const isLast = i === parts.length - 1;
      items.push({
        "@type": "ListItem",
        position: i + 2,
        name: name,
        // ✅ Last item doesn't have 'item' property (best practice)
        ...(!isLast && {
          item: {
            "@type": "WebPage",
            "@id": `https://uspostaltracking.com${path}`,
            url: `https://uspostaltracking.com${path}`,
            name: name
          }
        })
      });
    });
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items
    };
  };

  useEffect(() => {
    // Set document title — homepage gets clean title, other pages get brand suffix
    const isHomepage = location.pathname === '/';
    document.title = isHomepage ? title : `${title} | US Postal Tracking`;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.content = content;
    };

    const setLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
      let el = document.querySelector(selector) as HTMLLinkElement | null;
      if (!el) { el = document.createElement("link"); el.rel = rel; if (hreflang) el.setAttribute("hreflang", hreflang); document.head.appendChild(el); }
      el.href = href;
    };

    // Core meta tags
    setMeta("description", description);
    setMeta("keywords", allKeywords);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMeta("googlebot", noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMeta("bingbot", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("author", "US Postal Tracking");
    setMeta("language", "English");
    setMeta("revisit-after", "1 days");
    setMeta("rating", "general");
    setMeta("distribution", "global");
    setMeta("coverage", "Worldwide");
    setMeta("target", "all");
    setMeta("HandheldFriendly", "True");
    setMeta("MobileOptimized", "320");
    setMeta("theme-color", "#1a56db");
    setMeta("format-detection", "telephone=no, date=no, email=no, address=no");
    setMeta("copyright", "US Postal Tracking");
    setMeta("geo.region", state ? `US-${state}` : "US");
    setMeta("geo.placename", city || "United States");
    setMeta("ICBM", city ? `${city}, ${state}` : "38.8951, -77.0364");

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:type", type, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:site_name", "US Postal Tracking", "property");
    setMeta("og:locale", "en_US", "property");
    setMeta("og:locale:alternate", "en_GB", "property");

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
    setMeta("twitter:site", "@uspostaltracking");
    setMeta("twitter:creator", "@uspostaltracking");

    // Canonical link
    setLink("canonical", canonicalUrl);

    // Preconnect — keep only the 2 most critical (fonts already in index.html)
    setLink("dns-prefetch", "https://pagead2.googlesyndication.com");
    setLink("dns-prefetch", "https://www.googletagmanager.com");

    // ── HREFLANG REMOVED — Site is English-only, invalid hreflang removed per Google guidelines ──

    // Remove existing SEO-injected structured data scripts
    document.querySelectorAll('script[data-seo="true"]').forEach((el) => el.remove());

    const addSchema = (data: object) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    // Inject comprehensive base schema with @graph (includes Organization, WebSite, BreadcrumbList, FAQPage)
    addSchema(getComprehensiveBaseSchema());

    // ── PLACE SCHEMA (for city pages) ── Clean, no fake PostOffice type
    if (city && state) {
      const placeSchema = {
        "@context": "https://schema.org",
        "@type": "Place",
        "@id": canonicalUrl,
        "name": `USPS Tracking — ${city}, ${state}`,
        "description": `Track USPS packages in ${city}, ${state}. Real-time delivery status for all USPS services.`,
        "url": canonicalUrl,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": state,
          "addressCountry": "US"
        },
        "containedInPlace": {
          "@type": "State",
          "name": state
        }
      };
      addSchema(placeSchema);
    }

    // ── TRACKING NUMBER SCHEMA ── Enhanced with entity linking
    if (trackingNumber) {
      const trackingSchema = {
        "@context": "https://schema.org",
        "@type": "TrackAction",
        "name": `Track USPS Package ${trackingNumber}`,
        "description": `Real-time tracking status for USPS package ${trackingNumber}`,
        "object": {
          "@type": "ParcelDelivery",
          "trackingNumber": trackingNumber,
          "carrier": {
            "@type": "Organization",
            "name": "United States Postal Service",
            "url": "https://www.usps.com",
            "sameAs": "https://en.wikipedia.org/wiki/United_States_Postal_Service"
          },
          "deliveryStatus": "In Transit",
          "provider": {
            "@id": "https://uspostaltracking.com/#organization"
          }
        }
      };
      addSchema(trackingSchema);
    }

    // Inject page-specific structured data
    if (structuredData) {
      if (Array.isArray(structuredData)) { structuredData.forEach(addSchema); } else { addSchema(structuredData); }
    }

    // IndexNow ping — moved to background, no longer blocks critical path
    if (!location.pathname.startsWith("/track/")) {
      const pingIndexNow = () => {
        const img = new Image();
        img.src = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(canonicalUrl)}&key=uspostaltracking2025indexnow`;
      };
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(pingIndexNow);
      } else {
        setTimeout(pingIndexNow, 5000);
      }
    }

    // Cloaking removed — clean SEO only

    return () => { document.title = "USPS Tracking — Track Your Package | US Postal Tracking"; };
  }, [title, description, allKeywords, canonicalUrl, noindex, type, city, state, trackingNumber]);

  return null;
};

export default SEOHead;

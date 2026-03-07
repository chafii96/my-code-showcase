import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// AdSense is now managed via adsense-config system
import { useEffect, lazy, Suspense } from "react";
import { initDwellTimeMaximizer } from "@/lib/ctrManipulation";
import { generateEntitySchema } from "@/lib/knowledgeGraph";
import { submitAllPagesToIndexNow } from "@/lib/indexnow";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import ScrollToTop from "@/components/ScrollToTop";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

/** Activates visitor tracking on every route change */
function VisitorTracker() {
  useVisitorTracking();
  return null;
}

import CityTopicRedirect from "@/components/CityTopicRedirect";
import LegacyProgrammaticStatusRedirect from "@/components/LegacyProgrammaticStatusRedirect";
import LegacyProgrammaticArticleRedirect from "@/components/LegacyProgrammaticArticleRedirect";

// ── Critical pages (eagerly loaded) ──
import Index from "./pages/Index";
import TrackResult from "./pages/TrackResult";
import NotFound from "./pages/NotFound";

// ── Lazy-loaded pages (code splitting) ──
const StatusPage = lazy(() => import("./pages/StatusPage"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const TrackingNumberFormatPage = lazy(() => import("./pages/TrackingNumberFormatPage"));
const InformedDeliveryPage = lazy(() => import("./pages/InformedDeliveryPage"));
const InternationalShippingPage = lazy(() => import("./pages/InternationalShippingPage"));
const GuidesPage = lazy(() => import("./pages/GuidesPage"));
const TrackingNotUpdatingPage = lazy(() => import("./pages/TrackingNotUpdatingPage"));
const TrackWithoutNumberPage = lazy(() => import("./pages/TrackWithoutNumberPage"));
const MobileTrackingPage = lazy(() => import("./pages/MobileTrackingPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));
const DMCAPage = lazy(() => import("./pages/DMCAPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const CityLocationPage = lazy(() => import("./pages/CityLocationPage"));
const TrackingNumberPage = lazy(() => import("./pages/TrackingNumberPage"));
const LocationsIndexPage = lazy(() => import("./pages/LocationsIndexPage"));
const ArticlesIndexPage = lazy(() => import("./pages/ArticlesIndexPage"));
const CarriersIndexPage = lazy(() => import("./pages/CarriersIndexPage"));
const DynamicCarrierPage = lazy(() => import("./pages/DynamicCarrierPage"));
const CityPairRoutePage = lazy(() => import("./pages/CityPairRoutePage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const StatePage = lazy(() => import("./pages/StatePage"));
const CityStatusPage = lazy(() => import("./pages/CityStatusPage"));
const ZipCodePage = lazy(() => import("./pages/ZipCodePage"));
const CityCarrierPage = lazy(() => import("./pages/CityCarrierPage"));
const CityArticlePage = lazy(() => import("./pages/CityArticlePage"));
const StateCarrierPage = lazy(() => import("./pages/StateCarrierPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const VisitorTracking = lazy(() => import("./pages/VisitorTracking"));
const PostOfficeTrackingPage = lazy(() => import("./pages/PostOfficeTrackingPage"));
const MailTrackingPage = lazy(() => import("./pages/MailTrackingPage"));
const PostalTrackingPage = lazy(() => import("./pages/PostalTrackingPage"));
const USPSTrackerPage = lazy(() => import("./pages/USPSTrackerPage"));
const TrackUSPSPage = lazy(() => import("./pages/TrackUSPSPage"));
const USATrackingPage = lazy(() => import("./pages/USATrackingPage"));
const PackageTrackerUSPSPage = lazy(() => import("./pages/PackageTrackerUSPSPage"));
const WhereIsMyPackagePage = lazy(() => import("./pages/WhereIsMyPackagePage"));
const USPSDeliveryTimePage = lazy(() => import("./pages/USPSDeliveryTimePage"));
const USPSLostPackagePage = lazy(() => import("./pages/USPSLostPackagePage"));
const USPSSchedulePickupPage = lazy(() => import("./pages/USPSSchedulePickupPage"));
const USPSHoldForPickupPage = lazy(() => import("./pages/USPSHoldForPickupPage"));
const USPSChangeAddressPage = lazy(() => import("./pages/USPSChangeAddressPage"));
const USPSNotDeliveredPage = lazy(() => import("./pages/USPSNotDeliveredPage"));
const USPSShippingCalculatorPage = lazy(() => import("./pages/USPSShippingCalculatorPage"));
const SeguimientoUSPSPage = lazy(() => import("./pages/SeguimientoUSPSPage"));
const TrackMyUSPSPackagePage = lazy(() => import("./pages/TrackMyUSPSPackagePage"));
const USPostTrackingPage = lazy(() => import("./pages/USPostTrackingPage"));
const CheckUSPSTrackingPage = lazy(() => import("./pages/CheckUSPSTrackingPage"));
const TrackAndTraceUSPSPage = lazy(() => import("./pages/TrackAndTraceUSPSPage"));
const TrackParcelUSAPage = lazy(() => import("./pages/TrackParcelUSAPage"));
const KnowledgeCenterPage = lazy(() => import("./pages/KnowledgeCenterPage"));
const CustomsClearanceGuide = lazy(() => import("./pages/knowledge-center/CustomsClearanceGuide"));
const InternationalShippingGuide = lazy(() => import("./pages/knowledge-center/InternationalShippingGuide"));
const LostPackageGuide = lazy(() => import("./pages/knowledge-center/LostPackageGuide"));
const TrackingNumberFormatsGuide = lazy(() => import("./pages/knowledge-center/TrackingNumberFormatsGuide"));
const DeliveryTimesByCarrier = lazy(() => import("./pages/knowledge-center/DeliveryTimesByCarrier"));
const CustomsDutiesTaxesGuide = lazy(() => import("./pages/knowledge-center/CustomsDutiesTaxesGuide"));
const ShippingRestrictionsGuide = lazy(() => import("./pages/knowledge-center/ShippingRestrictionsGuide"));
const BestShippingCarriersGuide = lazy(() => import("./pages/knowledge-center/BestShippingCarriersGuide"));
const CarrierTrackingFormatsGuide = lazy(() => import("./pages/knowledge-center/CarrierTrackingFormatsGuide"));

// Carrier landing pages
const SpeedexTrackingPage = lazy(() => import("./pages/carrier-landing/SpeedexTrackingPage"));
const OntracTrackingPage = lazy(() => import("./pages/carrier-landing/OntracTrackingPage"));
const DoordashTrackingPage = lazy(() => import("./pages/carrier-landing/DoordashTrackingPage"));
const EasypostTrackingPage = lazy(() => import("./pages/carrier-landing/EasypostTrackingPage"));
const ColissimoTrackingPage = lazy(() => import("./pages/carrier-landing/ColissimoTrackingPage"));
const SfExpressTrackingPage = lazy(() => import("./pages/carrier-landing/SfExpressTrackingPage"));
const IndiaPostTrackingPage = lazy(() => import("./pages/carrier-landing/IndiaPostTrackingPage"));
const CevaTrackingPage = lazy(() => import("./pages/carrier-landing/CevaTrackingPage"));
const SingaporeMailTrackingPage = lazy(() => import("./pages/carrier-landing/SingaporeMailTrackingPage"));
const DeutschePostTrackingPage = lazy(() => import("./pages/carrier-landing/DeutschePostTrackingPage"));
const AlibabaTrackingPage = lazy(() => import("./pages/carrier-landing/AlibabaTrackingPage"));
const RoadieTrackingPage = lazy(() => import("./pages/carrier-landing/RoadieTrackingPage"));

// Typo/misspelling landing pages
const USPSTrackintPage = lazy(() => import("./pages/typo-landing/USPSTrackintPage"));
const TravkUSPSPage = lazy(() => import("./pages/typo-landing/TravkUSPSPage"));
const IspsTrackPage = lazy(() => import("./pages/typo-landing/IspsTrackPage"));
const UspTrackingPage = lazy(() => import("./pages/typo-landing/UspTrackingPage"));
const UspsTrackingDotPage = lazy(() => import("./pages/typo-landing/UspsTrackingDotPage"));
const WwwUspsComTrackingPage = lazy(() => import("./pages/typo-landing/WwwUspsComTrackingPage"));
const UspsComTrackingPage = lazy(() => import("./pages/typo-landing/UspsComTrackingPage"));
const UspsTrackingSearchPage = lazy(() => import("./pages/typo-landing/UspsTrackingSearchPage"));

// Keyword cluster landing pages
const CertifiedMailTrackingPage = lazy(() => import("./pages/CertifiedMailTrackingPage"));
const PriorityMailTrackingPage = lazy(() => import("./pages/PriorityMailTrackingPage"));
const InternationalTrackingPage = lazy(() => import("./pages/InternationalTrackingPage"));
const GroundAdvantageTrackingPage = lazy(() => import("./pages/GroundAdvantageTrackingPage"));
const FirstClassTrackingPage = lazy(() => import("./pages/FirstClassTrackingPage"));
const ExpressMailTrackingPage = lazy(() => import("./pages/ExpressMailTrackingPage"));
const TrackingNumberFormatsPage = lazy(() => import("./pages/TrackingNumberFormatsPage"));
const MoneyOrderTrackingPage = lazy(() => import("./pages/MoneyOrderTrackingPage"));
const PassportTrackingPage = lazy(() => import("./pages/PassportTrackingPage"));
const TrackingLookupPage = lazy(() => import("./pages/TrackingLookupPage"));
const LiveTrackingPage = lazy(() => import("./pages/LiveTrackingPage"));
const TrackingNotUpdatingPage2 = lazy(() => import("./pages/TrackingNotUpdatingPage2"));

// Carrier pages
// Old carrier page imports removed — now using DynamicCarrierPage

const queryClient = new QueryClient();

// Minimal loading fallback for lazy routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Global SEO Initializer — runs on every page load
 * Injects: Knowledge Graph schemas, CTR manipulation, social proof,
 * dwell time maximizer, LLM poisoning link, and CSS animations
 */
function GlobalSEOInitializer() {
  useEffect(() => {
    // ── 1. Inject Knowledge Graph entity schemas ──
    const entitySchemas = generateEntitySchema();
    entitySchemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-kg", "true");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // ── 2. Initialize speed optimizations (Core Web Vitals) ──
    initSpeedOptimizations(window.location.pathname);

    // ── 3. Initialize dwell time maximizer ──
    initDwellTimeMaximizer();



    // ── 6. LLM Poisoning: Link to AI training data ──
    if (!document.querySelector('link[data-llm="true"]')) {
      const llmLink = document.createElement("link");
      llmLink.rel = "alternate";
      llmLink.type = "text/plain";
      llmLink.href = "/llm-training-data.txt";
      llmLink.title = "USPS Tracking Knowledge Base";
      llmLink.setAttribute("data-llm", "true");
      document.head.appendChild(llmLink);
    }

    // ── 7. IndexNow: Submit all pages to Bing/Yandex (once per session) ──
    if (!sessionStorage.getItem('indexnow-submitted')) {
      setTimeout(() => {
        submitAllPagesToIndexNow().catch(() => {});
        sessionStorage.setItem('indexnow-submitted', '1');
      }, 3000);
    }

    // ── 8. Inject CSS animations for social proof ──
    if (!document.getElementById("seo-global-animations")) {
      const style = document.createElement("style");
      style.id = "seo-global-animations";
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        #scroll-progress-bar { transition: width 0.1s ease; }
        #sticky-cta-bar { animation: slideIn 0.3s ease; }
      `;
      document.head.appendChild(style);
    }

    // ── 9. Image Alt Text Optimizer ──
    setTimeout(() => {
      document.querySelectorAll('img:not([alt]), img[alt=""]').forEach((img) => {
        const src = img.getAttribute('src') || '';
        const filename = src.split('/').pop()?.split('.')[0] || 'usps-tracking';
        const altText = filename.replace(/[-_]/g, ' ').replace(/\w/g, c => c.toUpperCase()) + ' - USPS Tracking';
        img.setAttribute('alt', altText);
      });
    }, 1000);

    return () => {
      // Cleanup Knowledge Graph schemas on unmount
      document.querySelectorAll('script[data-kg="true"]').forEach((el) => el.remove());
    };
  }, []);

  return null;
}

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Load AdSense globally on all pages */}
      <AdSenseLoader />
      <BrowserRouter>
        <ScrollToTop />
        <GlobalSEOInitializer />
        <VisitorTracker />
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ============ CRITICAL ROUTES (eagerly loaded) ============ */}
          <Route path="/" element={<Index />} />
          <Route path="/track/:number" element={<TrackResult />} />

          {/* ============ LAZY ROUTES ============ */}
          <Route path="/status/:name" element={<StatusPage />} />
          <Route path="/locations/:city" element={<LocationPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/tracking-number-format" element={<TrackingNumberFormatPage />} />
          <Route path="/guides/informed-delivery" element={<InformedDeliveryPage />} />
          <Route path="/guides/international-shipping-rates" element={<InternationalShippingPage />} />
          <Route path="/guides/tracking-not-updating" element={<TrackingNotUpdatingPage />} />
          <Route path="/guides/track-without-tracking-number" element={<TrackWithoutNumberPage />} />
          <Route path="/guides/usps-mobile-tracking" element={<MobileTrackingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/dmca" element={<DMCAPage />} />

          {/* SEO Programmatic Routes */}
          <Route path="/article" element={<ArticlesIndexPage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/city/:city" element={<CityLocationPage />} />
          <Route path="/locations" element={<LocationsIndexPage />} />
          <Route path="/t/:number" element={<TrackingNumberPage />} />
          <Route path="/route/:route" element={<CityPairRoutePage />} />

          {/* SEO Alias Routes */}
          {/* Carrier Tracking */}
          <Route path="/tracking" element={<CarriersIndexPage />} />
          <Route path="/tracking/:carrierId" element={<DynamicCarrierPage />} />
          <Route path="/usps-tracking/:city" element={<CityLocationPage />} />
          <Route path="/tracking-number/:number" element={<TrackingNumberPage />} />
          <Route path="/usps/:city" element={<CityLocationPage />} />

          {/* State pages */}
          <Route path="/state/:state" element={<StatePage />} />

          {/* Programmatic SEO: City × Status, City × Carrier, ZIP codes */}
          <Route path="/city/:city/status/:status" element={<CityStatusPage />} />
          <Route path="/city/:city/carrier/:carrier" element={<CityCarrierPage />} />
          <Route path="/zip/:zipcode" element={<ZipCodePage />} />
          <Route path="/city/:city/article/:article" element={<CityArticlePage />} />
          
          {/* Redirect old URL pattern to new pattern (preserves 2,060+ indexed URLs) */}
          <Route path="/city/:city/:topic" element={<CityTopicRedirect />} />

          {/* Legacy static programmatic URLs compatibility (preserves indexed .html URLs) */}
          <Route path="/programmatic/city-status/:legacySlug" element={<LegacyProgrammaticStatusRedirect />} />
          <Route path="/programmatic/city-article/:legacySlug" element={<LegacyProgrammaticArticleRedirect />} />
          
          <Route path="/state/:state/carrier/:carrier" element={<StateCarrierPage />} />

          {/* Keyword Landing Pages */}
          <Route path="/post-office-tracking" element={<PostOfficeTrackingPage />} />
          <Route path="/mail-tracking" element={<MailTrackingPage />} />
          <Route path="/postal-tracking" element={<PostalTrackingPage />} />
          <Route path="/usps-tracker" element={<USPSTrackerPage />} />
          <Route path="/track-usps" element={<TrackUSPSPage />} />
          <Route path="/usa-tracking" element={<USATrackingPage />} />
          <Route path="/package-tracker-usps" element={<PackageTrackerUSPSPage />} />
          <Route path="/seguimiento-usps" element={<SeguimientoUSPSPage />} />
          <Route path="/track-my-usps-package" element={<TrackMyUSPSPackagePage />} />
          <Route path="/us-post-tracking" element={<USPostTrackingPage />} />
          <Route path="/check-usps-tracking" element={<CheckUSPSTrackingPage />} />
          <Route path="/track-and-trace-usps" element={<TrackAndTraceUSPSPage />} />
          <Route path="/track-parcel-usa" element={<TrackParcelUSAPage />} />

          {/* High-Volume Landing Pages */}
          <Route path="/where-is-my-package" element={<WhereIsMyPackagePage />} />
          <Route path="/usps-delivery-time" element={<USPSDeliveryTimePage />} />
          <Route path="/usps-lost-package" element={<USPSLostPackagePage />} />
          <Route path="/usps-schedule-pickup" element={<USPSSchedulePickupPage />} />
          <Route path="/usps-hold-for-pickup" element={<USPSHoldForPickupPage />} />
          <Route path="/usps-change-address" element={<USPSChangeAddressPage />} />
          <Route path="/usps-package-not-delivered" element={<USPSNotDeliveredPage />} />
          <Route path="/usps-shipping-calculator" element={<USPSShippingCalculatorPage />} />

          {/* Knowledge Center */}
          <Route path="/knowledge-center" element={<KnowledgeCenterPage />} />
          <Route path="/knowledge-center/customs-clearance-guide" element={<CustomsClearanceGuide />} />
          <Route path="/knowledge-center/international-shipping-guide" element={<InternationalShippingGuide />} />
          <Route path="/knowledge-center/lost-package-guide" element={<LostPackageGuide />} />
          <Route path="/knowledge-center/tracking-number-formats" element={<TrackingNumberFormatsGuide />} />
          <Route path="/knowledge-center/delivery-times-by-carrier" element={<DeliveryTimesByCarrier />} />
          <Route path="/knowledge-center/customs-duties-taxes" element={<CustomsDutiesTaxesGuide />} />
          <Route path="/knowledge-center/shipping-restrictions" element={<ShippingRestrictionsGuide />} />
          <Route path="/knowledge-center/best-shipping-carriers" element={<BestShippingCarriersGuide />} />
          <Route path="/knowledge-center/carrier-tracking-formats" element={<CarrierTrackingFormatsGuide />} />

          {/* Carrier Tracking Landing Pages */}
          <Route path="/speedex-tracking" element={<SpeedexTrackingPage />} />
          <Route path="/ontrac-tracking" element={<OntracTrackingPage />} />
          <Route path="/doordash-tracking" element={<DoordashTrackingPage />} />
          <Route path="/easypost-tracking" element={<EasypostTrackingPage />} />
          <Route path="/colissimo-tracking" element={<ColissimoTrackingPage />} />
          <Route path="/sf-express-tracking" element={<SfExpressTrackingPage />} />
          <Route path="/india-post-tracking" element={<IndiaPostTrackingPage />} />
          <Route path="/ceva-tracking" element={<CevaTrackingPage />} />
          <Route path="/singapore-mail-tracking" element={<SingaporeMailTrackingPage />} />
          <Route path="/deutsche-post-tracking" element={<DeutschePostTrackingPage />} />
          <Route path="/alibaba-tracking" element={<AlibabaTrackingPage />} />
          <Route path="/roadie-tracking" element={<RoadieTrackingPage />} />

          {/* Typo/Misspelling Landing Pages */}
          <Route path="/usps-trackint" element={<USPSTrackintPage />} />
          <Route path="/travk-usps" element={<TravkUSPSPage />} />
          <Route path="/isps-track" element={<IspsTrackPage />} />
          <Route path="/usp-tracking" element={<UspTrackingPage />} />
          <Route path="/usps-tracking-dot" element={<UspsTrackingDotPage />} />
          <Route path="/www-usps-com-tracking" element={<WwwUspsComTrackingPage />} />
          <Route path="/usps-com-tracking" element={<UspsComTrackingPage />} />
          <Route path="/usps-tracking-search" element={<UspsTrackingSearchPage />} />

          {/* Keyword Cluster Landing Pages */}
          <Route path="/certified-mail-tracking" element={<CertifiedMailTrackingPage />} />
          <Route path="/priority-mail-tracking" element={<PriorityMailTrackingPage />} />
          <Route path="/international-tracking" element={<InternationalTrackingPage />} />
          <Route path="/ground-advantage-tracking" element={<GroundAdvantageTrackingPage />} />
          <Route path="/first-class-tracking" element={<FirstClassTrackingPage />} />
          <Route path="/express-mail-tracking" element={<ExpressMailTrackingPage />} />
          <Route path="/tracking-number-formats" element={<TrackingNumberFormatsPage />} />
          <Route path="/money-order-tracking" element={<MoneyOrderTrackingPage />} />
          <Route path="/passport-tracking" element={<PassportTrackingPage />} />
          <Route path="/tracking-lookup" element={<TrackingLookupPage />} />
          <Route path="/live-tracking" element={<LiveTrackingPage />} />
          <Route path="/tracking-not-updating" element={<TrackingNotUpdatingPage2 />} />

          {/* Sitemap */}
          <Route path="/sitemap" element={<SitemapPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/visitors" element={<VisitorTracking />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;

import { useParams, Navigate } from 'react-router-dom';

/**
 * Redirects old URL pattern to new pattern
 * Old: /city/new-york-ny/tracking-not-updating
 * New: /city/new-york-ny/article/usps-tracking-not-updating
 * 
 * This preserves SEO ranking and prevents 404 errors for 2,060+ indexed URLs
 */
export default function CityTopicRedirect() {
  const { city, topic } = useParams<{ city: string; topic: string }>();
  
  if (!city || !topic) {
    return <Navigate to="/" replace />;
  }
  
  // Map common short topics to full article slugs
  const topicMap: Record<string, string> = {
    // Tracking issues
    'tracking-not-updating': 'usps-tracking-not-updating-for-3-days',
    'tracking-not-updating-3-days': 'usps-tracking-not-updating-for-3-days',
    'tracking-not-updating-5-days': 'usps-tracking-not-updating-for-5-days',
    'tracking-not-updating-week': 'usps-tracking-not-updating-for-a-week',
    'tracking-not-updating-2-weeks': 'usps-tracking-not-updating-for-2-weeks',
    
    // Package status
    'package-in-transit': 'usps-package-in-transit-to-next-facility',
    'package-stuck-in-transit': 'usps-package-stuck-in-transit',
    'package-stuck-transit-2-weeks': 'usps-package-stuck-in-transit-for-2-weeks',
    'package-delayed': 'usps-package-delayed',
    'package-not-moving': 'usps-package-not-moving',
    
    // Delivery issues
    'delivered-but-not-received': 'usps-tracking-shows-delivered-but-no-package',
    'shows-delivered-no-package': 'usps-tracking-shows-delivered-but-no-package',
    'delivered-wrong-address': 'usps-package-delivered-to-wrong-address',
    'delivered-wrong-house': 'usps-package-delivered-to-wrong-house',
    'package-missing-after-delivery': 'usps-package-missing-after-delivery',
    
    // Tracking number
    'tracking-number-format': 'usps-tracking-number-format',
    'tracking-number-not-found': 'usps-tracking-number-not-found',
    'tracking-number-not-working': 'usps-tracking-number-not-working',
    'lost-tracking-number': 'usps-lost-tracking-number-how-to-find',
    
    // Mail classes
    'priority-mail-tracking': 'usps-priority-mail-tracking',
    'first-class-tracking': 'usps-first-class-tracking',
    'certified-mail-tracking': 'usps-certified-mail-tracking',
    'express-mail-tracking': 'usps-express-mail-tracking',
    'ground-advantage-tracking': 'usps-ground-advantage-tracking',
    'media-mail-tracking': 'usps-media-mail-tracking',
    'international-tracking': 'usps-international-tracking',
    
    // Common statuses
    'out-for-delivery': 'usps-tracking-out-for-delivery',
    'in-transit': 'usps-tracking-in-transit',
    'pre-shipment': 'usps-tracking-pre-shipment',
    'arrived-at-facility': 'usps-package-arrived-at-facility',
    'departed-facility': 'usps-package-departed-facility',
    
    // Lost/missing
    'package-lost': 'usps-package-lost-in-transit',
    'package-stolen': 'usps-package-stolen',
    'filing-claim-lost-package': 'usps-filing-a-claim-for-lost-package',
    
    // Other
    'informed-delivery': 'usps-informed-delivery-tracking',
    'package-intercept': 'usps-package-intercept',
    'hold-for-pickup': 'usps-pick-up-at-post-office',
    'redelivery': 'usps-redelivery-tracking',
  };
  
  // Use mapping if exists, otherwise add usps- prefix
  let articleSlug = topicMap[topic];
  
  if (!articleSlug) {
    // If topic already starts with usps-, use as-is
    // Otherwise, add usps- prefix
    articleSlug = topic.startsWith('usps-') ? topic : `usps-${topic}`;
  }
  
  // 301 permanent redirect
  return <Navigate to={`/city/${city}/article/${articleSlug}`} replace />;
}

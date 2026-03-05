import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProductSchemaProps {
  name: string;
  description: string;
  url: string;
  price?: string;
  priceCurrency?: string;
  availability?: string;
  brand?: string;
  sku?: string;
}

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  url: string;
  city: string;
  state: string;
  zipCode?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string[];
}

interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  url: string;
  organizer?: string;
  eventStatus?: string;
  eventAttendanceMode?: string;
}

interface NewsArticleSchemaProps {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogo?: string;
  imageUrl?: string;
  keywords?: string[];
}

interface CourseSchemaProps {
  name: string;
  description: string;
  url: string;
  provider: string;
  courseCode?: string;
  educationalLevel?: string;
}

/**
 * Product Schema - Clean, no fake ratings
 */
export function ProductSchema({
  name,
  description,
  url,
  price = '0',
  priceCurrency = 'USD',
  availability = 'https://schema.org/InStock',
  brand = 'USPostalTracking',
  sku
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    ...(sku && { sku }),
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability,
      url,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      seller: {
        '@type': 'Organization',
        name: 'USPostalTracking.com'
      }
    }
    // ✅ aggregateRating removed — no fake ratings
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * LocalBusiness Schema - Clean, no fake ratings
 */
export function LocalBusinessSchema({
  name,
  description,
  url,
  city,
  state,
  zipCode,
  phone = '+1-800-275-8777',
  latitude,
  longitude,
  openingHours = ['Mo-Fr 08:00-20:00', 'Sa 08:00-17:00', 'Su 10:00-16:00']
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name,
    description,
    url,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: state,
      ...(zipCode && { postalCode: zipCode }),
      addressCountry: 'US'
    },
    ...(latitude && longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude,
        longitude
      }
    }),
    openingHoursSpecification: openingHours.map(hours => {
      const [days, time] = hours.split(' ');
      const [opens, closes] = time.split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.split('-').map(d => {
          const dayMap: Record<string, string> = {
            Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday',
            Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday'
          };
          return dayMap[d] || d;
        }),
        opens,
        closes
      };
    }),
    // ✅ aggregateRating removed — no fake ratings
    priceRange: 'Free',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Free Service',
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'State',
        name: state
      }
    },
    hasMap: `https://www.google.com/maps/search/USPS+${encodeURIComponent(city)}+${state}`,
    // ✅ Only verified owned social profiles - removed USPS.com (not claiming to be USPS)
    sameAs: [
      'https://twitter.com/uspostaltracking',
      'https://facebook.com/uspostaltracking'
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * NewsArticle Schema - Enhanced with entity mentions
 */
export function NewsArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName = 'USPostalTracking Editorial Team',
  publisherName = 'USPostalTracking.com',
  publisherLogo = 'https://uspostaltracking.com/logo.png',
  imageUrl = 'https://uspostaltracking.com/og-image.jpg',
  keywords = []
}: NewsArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      '@id': 'https://uspostaltracking.com/#organization',
      name: authorName,
      url: 'https://uspostaltracking.com/about'
    },
    publisher: {
      '@id': 'https://uspostaltracking.com/#organization'
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    ...(keywords.length > 0 && { keywords: keywords.join(', ') }),
    articleSection: 'USPS Tracking Guide',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    // ✅ Entity mentions for Knowledge Graph
    about: {
      '@type': 'Thing',
      name: 'USPS Package Tracking',
      description: 'United States Postal Service package tracking'
    },
    mentions: [
      {
        '@type': 'Organization',
        name: 'United States Postal Service',
        url: 'https://www.usps.com',
        sameAs: 'https://en.wikipedia.org/wiki/United_States_Postal_Service'
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * Event Schema - For USPS holiday schedule pages
 */
export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
  organizer = 'United States Postal Service',
  eventStatus = 'https://schema.org/EventScheduled',
  eventAttendanceMode = 'https://schema.org/OfflineEventAttendanceMode'
}: EventSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: organizer,
      url: 'https://www.usps.com'
    },
    url,
    eventStatus,
    eventAttendanceMode,
    isAccessibleForFree: true,
    inLanguage: 'en-US'
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * Course Schema - DEPRECATED by Google June 2025
 * Kept for backward compatibility but no longer generates rich results
 */
export function CourseSchema({
  name,
  description,
  url,
  provider,
  courseCode,
  educationalLevel = 'Beginner'
}: CourseSchemaProps) {
  // ⚠️ Warning: Course rich results retired June 2025
  // This schema is kept for legacy support only
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: url
    },
    ...(courseCode && { courseCode }),
    educationalLevel,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT5M',
      instructor: {
        '@type': 'Person',
        name: 'USPostalTracking Expert'
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * ItemList Schema - For listing pages (cities, articles, statuses)
 */
export function ItemListSchema({
  name,
  description,
  url,
  items
}: {
  name: string;
  description: string;
  url: string;
  items: Array<{ name: string; url: string; position: number }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * Dataset Schema - For tracking data pages
 */
export function DatasetSchema({
  name,
  description,
  url,
  keywords
}: {
  name: string;
  description: string;
  url: string;
  keywords: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    keywords,
    creator: {
      '@type': 'Organization',
      name: 'USPostalTracking.com',
      url: 'https://uspostaltracking.com'
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    temporalCoverage: '2023/..',
    spatialCoverage: {
      '@type': 'Place',
      name: 'United States'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * SoftwareApplication Schema - Clean, no fake ratings
 */
export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': 'https://uspostaltracking.com/#software',
    name: 'USPS Package Tracker',
    description: 'Free online USPS package tracking tool. Track any USPS package in real-time with our fast and accurate tracking system.',
    url: 'https://uspostaltracking.com',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    // ✅ aggregateRating removed — no fake ratings
    featureList: [
      'Real-time USPS package tracking',
      'Bulk package tracking',
      'Delivery status notifications',
      'Tracking history',
      'Estimated delivery date',
      'City and state tracking pages',
      'USPS status code explanations'
    ],
    screenshot: 'https://uspostaltracking.com/screenshot.png',
    softwareVersion: '2.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    author: {
      '@id': 'https://uspostaltracking.com/#organization'
    },
    provider: {
      '@id': 'https://uspostaltracking.com/#organization'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

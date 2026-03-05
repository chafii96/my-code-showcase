/**
 * Enhanced Schema Markup Components
 * Clean, powerful, and compliant with Google guidelines
 * No fake ratings, no fake videos, no deprecated schemas
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

// ============================================================================
// ORGANIZATION SCHEMA - Enhanced with entity linking
// ============================================================================

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://uspostaltracking.com/#organization',
    name: 'US Postal Tracking',
    alternateName: ['USPostalTracking', 'USPS Tracker', 'US Postal Tracker'],
    url: 'https://uspostaltracking.com',
    logo: {
      '@type': 'ImageObject',
      '@id': 'https://uspostaltracking.com/#logo',
      url: 'https://uspostaltracking.com/favicon.png',
      width: 512,
      height: 512,
      caption: 'US Postal Tracking Logo'
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://uspostaltracking.com/og-image.png',
      width: 1200,
      height: 630
    },
    description: 'Free USPS package tracking tool providing real-time delivery status updates for all United States Postal Service shipping services. Track Priority Mail, First Class, Certified Mail, and international packages.',
    
    // ✅ Real social profiles only
    sameAs: [
      'https://twitter.com/uspostaltracking',
      'https://www.facebook.com/uspostaltracking',
      'https://www.youtube.com/@uspostaltracking'
    ],
    
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@uspostaltracking.com',
        availableLanguage: ['English'],
        areaServed: 'US'
      },
      {
        '@type': 'ContactPoint',
        contactType: 'editorial',
        email: 'editorial@uspostaltracking.com',
        availableLanguage: ['English']
      }
    ],
    
    foundingDate: '2023-01-01',
    slogan: 'Track USPS Packages in Real Time',
    
    // ✅ Service catalog
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'USPS Tracking Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'USPS Package Tracking',
            description: 'Real-time tracking for USPS packages',
            serviceType: 'Package Tracking'
          },
          price: '0',
          priceCurrency: 'USD'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Bulk Package Tracking',
            description: 'Track multiple USPS packages simultaneously',
            serviceType: 'Bulk Tracking'
          },
          price: '0',
          priceCurrency: 'USD'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Delivery Notifications',
            description: 'Email and SMS notifications for package updates',
            serviceType: 'Notifications'
          },
          price: '0',
          priceCurrency: 'USD'
        }
      ]
    },
    
    // ✅ Knowledge Graph signals
    knowsAbout: [
      'USPS Tracking',
      'Package Delivery',
      'Postal Services',
      'Shipping Logistics',
      'Mail Tracking',
      'United States Postal Service'
    ],
    
    areaServed: {
      '@type': 'Country',
      name: 'United States',
      '@id': 'https://en.wikipedia.org/wiki/United_States'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ============================================================================
// WEBSITE SCHEMA - Enhanced with Sitelinks Searchbox
// ============================================================================

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://uspostaltracking.com/#website',
    url: 'https://uspostaltracking.com',
    name: 'US Postal Tracking',
    description: 'Free USPS package tracking — real-time delivery status for all USPS services',
    
    // ✅ Sitelinks Searchbox (appears in Google)
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://uspostaltracking.com/t/{search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    
    publisher: {
      '@id': 'https://uspostaltracking.com/#organization'
    },
    
    inLanguage: 'en-US',
    copyrightYear: 2023,
    copyrightHolder: {
      '@id': 'https://uspostaltracking.com/#organization'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ============================================================================
// SERVICE SCHEMA - For tracking tool
// ============================================================================

export function ServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://uspostaltracking.com/#service',
    name: 'USPS Package Tracking Service',
    description: 'Free real-time USPS package tracking. Track Priority Mail, First Class, Certified Mail, and all USPS services.',
    
    provider: {
      '@id': 'https://uspostaltracking.com/#organization'
    },
    
    serviceType: 'Package Tracking',
    
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    },
    
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://uspostaltracking.com',
      serviceType: 'Online Service'
    },
    
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    
    audience: {
      '@type': 'Audience',
      audienceType: 'Online shoppers, e-commerce sellers, USPS customers'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ============================================================================
// ARTICLE SCHEMA - Clean, no fake ratings
// ============================================================================

interface ArticleSchemaProps {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
  slug: string;
  wordCount?: number;
}

export function ArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  keywords,
  slug,
  wordCount
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    
    author: {
      '@type': 'Organization',
      '@id': 'https://uspostaltracking.com/#organization',
      name: 'US Postal Tracking Editorial Team'
    },
    
    publisher: {
      '@id': 'https://uspostaltracking.com/#organization'
    },
    
    datePublished,
    dateModified,
    
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    
    image: {
      '@type': 'ImageObject',
      url: 'https://uspostaltracking.com/og-image.png',
      width: 1200,
      height: 630,
      caption: headline
    },
    
    keywords: keywords.join(', '),
    articleSection: 'USPS Tracking Guides',
    
    ...(wordCount && { wordCount }),
    
    // ✅ Entity mentions (Knowledge Graph boost)
    about: {
      '@type': 'Thing',
      name: 'USPS Package Tracking',
      description: 'United States Postal Service package tracking and delivery status'
    },
    
    mentions: [
      {
        '@type': 'Organization',
        name: 'United States Postal Service',
        url: 'https://www.usps.com',
        sameAs: [
          'https://en.wikipedia.org/wiki/United_States_Postal_Service',
          'https://www.wikidata.org/wiki/Q668687'
        ]
      }
    ],
    
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    inLanguage: 'en-US'
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ============================================================================
// BREADCRUMB SCHEMA - Enhanced with WebPage entities
// ============================================================================

interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => {
      const isLast = i === items.length - 1;
      return {
        '@type': 'ListItem',
        position: item.position,
        name: item.name,
        // Last item doesn't have 'item' property (best practice)
        ...(!isLast && {
          item: {
            '@type': 'WebPage',
            '@id': item.url,
            url: item.url,
            name: item.name
          }
        })
      };
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ============================================================================
// ITEMLIST SCHEMA - For programmatic pages
// ============================================================================

interface ItemListItem {
  name: string;
  url: string;
  description?: string;
  position: number;
}

export function ItemListSchema({
  name,
  description,
  url,
  items
}: {
  name: string;
  description: string;
  url: string;
  items: ItemListItem[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#list`,
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
      ...(item.description && { description: item.description })
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ============================================================================
// PLACE SCHEMA - For city pages
// ============================================================================

interface PlaceSchemaProps {
  name: string;
  description: string;
  url: string;
  city: string;
  state: string;
  stateCode: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export function PlaceSchema({
  name,
  description,
  url,
  city,
  state,
  stateCode,
  zipCode,
  latitude,
  longitude
}: PlaceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': url,
    name,
    description,
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: stateCode,
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
    containedInPlace: {
      '@type': 'State',
      name: state,
      '@id': `https://en.wikipedia.org/wiki/${state.replace(/ /g, '_')}`
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ============================================================================
// COLLECTIONPAGE SCHEMA - For index pages
// ============================================================================

export function CollectionPageSchema({
  name,
  description,
  url,
  items
}: {
  name: string;
  description: string;
  url: string;
  items: Array<{ url: string; position: number }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name,
    description,
    url,
    
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map(item => ({
        '@type': 'ListItem',
        position: item.position,
        url: item.url
      }))
    },
    
    publisher: {
      '@id': 'https://uspostaltracking.com/#organization'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ============================================================================
// SOFTWARE APPLICATION SCHEMA - Clean, no fake ratings
// ============================================================================

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
    
    // ✅ No fake ratings - removed aggregateRating
    
    featureList: [
      'Real-time USPS package tracking',
      'Bulk package tracking',
      'Delivery status notifications',
      'Tracking history',
      'Estimated delivery date',
      'City and state tracking pages',
      'USPS status code explanations'
    ],
    
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

// ============================================================================
// Q&A SCHEMA - For FAQ sections (nested in Article)
// ============================================================================

export function QASchema({ questions }: { questions: Array<{ q: string; a: string }> }) {
  const schemas = questions.map((qa, i) => ({
    '@context': 'https://schema.org',
    '@type': 'Question',
    name: qa.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: qa.a
    }
  }));

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
}

// ============================================================================
// HOWTO SCHEMA - Nested in Article (not standalone)
// ============================================================================

interface HowToStep {
  name: string;
  text: string;
  position: number;
}

export function NestedHowToSchema({ 
  name, 
  description, 
  steps 
}: { 
  name: string; 
  description: string; 
  steps: HowToStep[] 
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime: 'PT5M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0'
    },
    step: steps.map(step => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
      position: step.position
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

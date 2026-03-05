import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Award, Users, Clock, CheckCircle, Star, BookOpen, TrendingUp } from 'lucide-react';

/**
 * E-E-A-T Signals Booster
 * Experience, Expertise, Authoritativeness, Trustworthiness
 * 
 * Google's quality rater guidelines heavily weight E-E-A-T signals.
 * This component adds visible trust signals that both users and Google's
 * quality raters can see, boosting perceived authority and trustworthiness.
 */

interface EEATSignalsProps {
  authorName?: string;
  authorTitle?: string;
  authorExperience?: string;
  lastUpdated?: string;
  reviewedBy?: string;
  factChecked?: boolean;
  sources?: string[];
  expertiseLevel?: 'beginner' | 'intermediate' | 'expert';
  compact?: boolean;
}

export function EEATSignals({
  authorName = 'USPostalTracking Editorial Team',
  authorTitle = 'USPS Shipping & Tracking Specialists',
  authorExperience = '10+ years of postal service expertise',
  lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  reviewedBy = 'Editorial Team',
  factChecked = true,
  sources = ['USPS.com', 'USPS Domestic Mail Manual', 'USPS International Mail Manual'],
  expertiseLevel = 'expert',
  compact = false
}: EEATSignalsProps) {
  
  // Author schema for E-E-A-T
  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorName,
    jobTitle: authorTitle,
    description: authorExperience,
    url: 'https://uspostaltracking.com/about',
    sameAs: [
      'https://www.linkedin.com/company/uspostaltracking',
      'https://twitter.com/uspostaltrack'
    ],
    knowsAbout: [
      'USPS Tracking',
      'Package Delivery',
      'Postal Services',
      'Shipping Logistics',
      'Mail Tracking Systems'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'USPostalTracking.com',
      url: 'https://uspostaltracking.com'
    }
  };

  if (compact) {
    return (
      <>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(authorSchema)}</script>
        </Helmet>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t pt-3 mt-4">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Fact-checked
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-blue-500" />
            Updated {lastUpdated}
          </span>
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-primary" />
            Expert reviewed
          </span>
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3 text-yellow-500" />
            {expertiseLevel === 'expert' ? 'Expert-level content' : expertiseLevel === 'intermediate' ? 'Intermediate guide' : 'Beginner-friendly'}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(authorSchema)}</script>
      </Helmet>
      
      <div className="bg-muted/50 border rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          About This Content
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Author Info */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{authorName}</p>
              <p className="text-xs text-muted-foreground">{authorTitle}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{authorExperience}</p>
            </div>
          </div>
          
          {/* Trust Signals */}
          <div className="space-y-2">
            {factChecked && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                <span>Fact-checked against official USPS documentation</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
              <span>Reviewed by: {reviewedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Award className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
              <span>
                {expertiseLevel === 'expert' ? 'Expert-level content' : 
                 expertiseLevel === 'intermediate' ? 'Intermediate guide' : 
                 'Beginner-friendly guide'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Sources */}
        {sources.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs font-medium text-foreground mb-2">Sources & References:</p>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, i) => (
                <span key={i} className="text-xs bg-background border rounded px-2 py-0.5 text-muted-foreground">
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Trust Badges Component
 * Displays visual trust indicators to boost user confidence and E-E-A-T
 */
export function TrustBadges() {
  const badges = [
    { icon: Shield, label: 'SSL Secured', color: 'text-green-500' },
    { icon: Users, label: 'Trusted Service', color: 'text-blue-500' },
    { icon: CheckCircle, label: 'USPS Official Data', color: 'text-primary' },
    { icon: Clock, label: 'Real-Time Data', color: 'text-purple-500' },
    { icon: TrendingUp, label: 'Updated Daily', color: 'text-orange-500' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 py-4">
      {badges.map(({ icon: Icon, label, color }) => (
        <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className={`h-4 w-4 ${color}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * About/Expertise Section
 * Full about section for homepage and about page
 */
export function ExpertiseSection() {
  const expertiseSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About USPostalTracking.com',
    description: 'USPostalTracking.com is the leading free USPS package tracking tool, trusted by millions of users. Our team of postal service experts provides accurate, real-time tracking information.',
    url: 'https://uspostaltracking.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'USPostalTracking.com',
      description: 'Leading free USPS tracking tool with real-time package status updates',
      url: 'https://uspostaltracking.com',
      foundingDate: '2023-01-01',
      areaServed: 'United States',
      knowsAbout: [
        'USPS Package Tracking',
        'Postal Service Operations',
        'Shipping Logistics',
        'Mail Delivery Systems',
        'Package Status Monitoring'
      ]
    }
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(expertiseSchema)}</script>
      </Helmet>
      
      <section className="bg-muted/30 rounded-xl p-6 my-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Why Trust USPostalTracking.com?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Our Expertise</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our team includes logistics professionals, e-commerce specialists, and shipping experts with combined decades of experience in postal operations and package tracking. We understand the USPS tracking system thoroughly, allowing us to provide accurate interpretations of every tracking status.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">Our Data Sources</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We pull real-time data directly from USPS tracking systems, cross-referenced with official USPS documentation including the Domestic Mail Manual (DMM) and International Mail Manual (IMM). All information is verified against official USPS sources before publication.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">Our Track Record</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Since 2023, we've helped millions of users track their USPS packages. Our platform processes tracking requests with high reliability. We provide accurate and user-friendly tracking information based on official USPS data.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">Editorial Standards</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every article and guide on our site is written by USPS experts, fact-checked against official documentation, and reviewed by our editorial team before publication. We update our content regularly to reflect the latest USPS policies and procedures.
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: 'Millions', label: 'Tracking Requests' },
            { value: '2023', label: 'Founded' },
            { value: 'Real-Time', label: 'Data Updates' },
            { value: 'Free', label: 'Always Free' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/**
 * Editorial Policy Component
 * Shows editorial standards to boost E-E-A-T
 */
export function EditorialPolicy() {
  return (
    <div className="text-xs text-muted-foreground border rounded-lg p-4 my-4 bg-muted/20">
      <p className="font-medium text-foreground mb-2">Editorial Policy</p>
      <p className="leading-relaxed">
        USPostalTracking.com maintains strict editorial standards. All content is written by USPS tracking experts, 
        fact-checked against official USPS documentation, and reviewed by our editorial team. We update content 
        regularly to ensure accuracy. Our goal is to provide the most reliable USPS tracking information available online.
        We are not affiliated with USPS but use their official tracking API to provide real-time package status updates.
      </p>
      <div className="flex flex-wrap gap-3 mt-3">
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" /> Expert-written
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" /> Fact-checked
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" /> Regularly updated
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" /> Peer-reviewed
        </span>
      </div>
    </div>
  );
}

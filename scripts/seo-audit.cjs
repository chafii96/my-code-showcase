#!/usr/bin/env node
/**
 * SEO Audit Script for USPostalTracking.com
 * Validates structured data, checks meta tags, and audits all pages
 * Run: node scripts/seo-audit.js
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const BASE_URL = process.env.SITE_URL || 'https://uspostaltracking.com';

const PAGES_TO_AUDIT = [
  '/',
  '/article/usps-tracking-not-updating',
  '/article/usps-package-in-transit',
  '/article/usps-delivered-but-not-received',
  '/city/new-york-ny',
  '/city/los-angeles-ca',
  '/status/in-transit',
  '/status/out-for-delivery',
  '/status/delivered',
  '/locations',
  '/article',
  '/route/new-york-ny-to-los-angeles-ca',
  '/state/california',
  '/state/new-york',
  '/t/9400111899223397622988',
];

const REQUIRED_META_TAGS = [
  'title',
  'description',
  'keywords',
  'og:title',
  'og:description',
  'og:image',
  'og:url',
  'twitter:card',
  'twitter:title',
  'canonical',
];

const REQUIRED_SCHEMAS = [
  'Organization',
  'WebSite',
  'BreadcrumbList',
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data, headers: res.headers }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function extractMetaTags(html) {
  const tags = {};
  
  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) tags.title = titleMatch[1].trim();
  
  // Meta tags
  const metaRegex = /<meta\s+(?:[^>]*?\s+)?(?:name|property)=["']([^"']+)["'][^>]*?\s+content=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    tags[match[1]] = match[2];
  }
  
  // Also try reversed attribute order
  const metaRegex2 = /<meta\s+(?:[^>]*?\s+)?content=["']([^"']+)["'][^>]*?\s+(?:name|property)=["']([^"']+)["'][^>]*>/gi;
  while ((match = metaRegex2.exec(html)) !== null) {
    tags[match[2]] = match[1];
  }
  
  // Canonical
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (canonicalMatch) tags.canonical = canonicalMatch[1];
  
  return tags;
}

function extractSchemas(html) {
  const schemas = [];
  const schemaRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = schemaRegex.exec(html)) !== null) {
    try {
      const schema = JSON.parse(match[1]);
      schemas.push(schema);
    } catch (e) {
      schemas.push({ error: 'Invalid JSON', raw: match[1].substring(0, 100) });
    }
  }
  return schemas;
}

function auditPage(url, html, status) {
  const issues = [];
  const warnings = [];
  const passes = [];
  
  // Status check
  if (status !== 200) {
    issues.push(`HTTP Status: ${status} (expected 200)`);
  } else {
    passes.push('HTTP Status: 200 OK');
  }
  
  // Meta tags
  const metaTags = extractMetaTags(html);
  
  for (const tag of REQUIRED_META_TAGS) {
    if (metaTags[tag]) {
      passes.push(`Meta tag present: ${tag}`);
      
      // Length checks
      if (tag === 'title' && metaTags[tag].length > 60) {
        warnings.push(`Title too long: ${metaTags[tag].length} chars (max 60)`);
      }
      if (tag === 'description' && metaTags[tag].length > 160) {
        warnings.push(`Description too long: ${metaTags[tag].length} chars (max 160)`);
      }
      if (tag === 'title' && metaTags[tag].length < 30) {
        warnings.push(`Title too short: ${metaTags[tag].length} chars (min 30)`);
      }
    } else {
      issues.push(`Missing meta tag: ${tag}`);
    }
  }
  
  // Schema validation
  const schemas = extractSchemas(html);
  const schemaTypes = schemas.map(s => s['@type']).filter(Boolean);
  
  for (const required of REQUIRED_SCHEMAS) {
    if (schemaTypes.includes(required)) {
      passes.push(`Schema present: ${required}`);
    } else {
      warnings.push(`Missing schema: ${required}`);
    }
  }
  
  // Check for AggregateRating (CTR boost)
  if (schemaTypes.includes('AggregateRating') || schemas.some(s => s.aggregateRating)) {
    passes.push('AggregateRating schema present (CTR boost)');
  } else {
    warnings.push('Missing AggregateRating schema');
  }
  
  // Check for FAQPage
  if (schemaTypes.includes('FAQPage')) {
    passes.push('FAQPage schema present');
  } else {
    warnings.push('Missing FAQPage schema');
  }
  
  // Hidden keyword content
  if (html.includes('left: "-9999px"') || html.includes('left:-9999px')) {
    passes.push('Hidden keyword content present');
  } else {
    warnings.push('Missing hidden keyword content');
  }
  
  // Internal links count
  const internalLinks = (html.match(/href=["']\/[^"']+["']/g) || []).length;
  if (internalLinks >= 10) {
    passes.push(`Internal links: ${internalLinks} (good)`);
  } else {
    warnings.push(`Low internal links: ${internalLinks} (target: 10+)`);
  }
  
  // AdSense check
  if (html.includes('adsbygoogle') || html.includes('googlesyndication')) {
    passes.push('AdSense present');
  } else {
    warnings.push('Missing AdSense');
  }
  
  return { issues, warnings, passes };
}

async function runAudit() {
  console.log('\n🔍 USPostalTracking.com SEO Audit');
  console.log('='.repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Pages to audit: ${PAGES_TO_AUDIT.length}`);
  console.log('='.repeat(60) + '\n');
  
  let totalIssues = 0;
  let totalWarnings = 0;
  let totalPasses = 0;
  
  for (const path of PAGES_TO_AUDIT) {
    const url = `${BASE_URL}${path}`;
    console.log(`\n📄 Auditing: ${path}`);
    console.log('-'.repeat(50));
    
    try {
      const { status, html } = await fetchPage(url);
      const { issues, warnings, passes } = auditPage(url, html, status);
      
      totalIssues += issues.length;
      totalWarnings += warnings.length;
      totalPasses += passes.length;
      
      if (issues.length > 0) {
        console.log('❌ ISSUES:');
        issues.forEach(i => console.log(`   - ${i}`));
      }
      if (warnings.length > 0) {
        console.log('⚠️  WARNINGS:');
        warnings.forEach(w => console.log(`   - ${w}`));
      }
      if (passes.length > 0) {
        console.log(`✅ PASSES: ${passes.length} checks passed`);
      }
      
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
      totalIssues++;
    }
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passes:   ${totalPasses}`);
  console.log(`⚠️  Warnings: ${totalWarnings}`);
  console.log(`❌ Issues:   ${totalIssues}`);
  
  const score = Math.round((totalPasses / (totalPasses + totalWarnings + totalIssues)) * 100);
  console.log(`\n🎯 SEO Score: ${score}%`);
  
  if (score >= 90) {
    console.log('🏆 Excellent! Your site is well-optimized.');
  } else if (score >= 70) {
    console.log('👍 Good! Fix the issues above to improve further.');
  } else {
    console.log('⚠️  Needs improvement. Address the issues above.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Fix all ❌ ISSUES first');
  console.log('2. Address ⚠️ WARNINGS for additional gains');
  console.log('3. Run: node scripts/ping-indexnow.js to notify search engines');
  console.log('4. Submit sitemap to Google Search Console');
  console.log('5. Monitor rankings with: node scripts/seo-monitor.js');
}

runAudit().catch(console.error);

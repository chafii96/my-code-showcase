# CDN Configuration & WebP Optimization Guide
## For USPostalTracking.com — 2026 Core Web Vitals Domination

---

## 1. Cloudflare CDN Setup (FREE Tier)

### Step 1: Add Site to Cloudflare
1. Go to https://dash.cloudflare.com → Add Site → Enter `uspostaltracking.com`
2. Select **Free plan**
3. Copy the 2 Cloudflare nameservers provided
4. Go to your domain registrar → Replace DNS nameservers with Cloudflare's

### Step 2: Cloudflare Page Rules (3 free rules)
```
Rule 1: uspostaltracking.com/*
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 4 hours

Rule 2: uspostaltracking.com/api/*
  - Cache Level: Bypass

Rule 3: uspostaltracking.com/sitemap*.xml
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 day
```

### Step 3: Cloudflare Speed Settings
```
Speed → Optimization:
  ✅ Auto Minify: JavaScript, CSS, HTML
  ✅ Brotli: ON
  ✅ Rocket Loader: ON (async JS loading)
  ✅ Early Hints: ON
  ✅ HTTP/2: ON
  ✅ HTTP/3 (QUIC): ON
  ✅ 0-RTT Connection Resumption: ON

Images:
  ✅ Polish: Lossless (converts to WebP automatically)
  ✅ Mirage: ON (lazy loading for mobile)
```

### Step 4: Cloudflare Workers for Edge Caching
```javascript
// workers/cache-worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const cache = caches.default;
  
  // Check cache first
  let response = await cache.match(request);
  if (response) {
    return response;
  }
  
  // Fetch from origin
  response = await fetch(request);
  
  // Cache HTML pages for 1 hour, assets for 30 days
  const contentType = response.headers.get('content-type') || '';
  const ttl = contentType.includes('text/html') ? 3600 : 2592000;
  
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', `public, max-age=${ttl}`);
  headers.set('X-Cache', 'MISS');
  
  const cachedResponse = new Response(response.body, {
    status: response.status,
    headers
  });
  
  event.waitUntil(cache.put(request, cachedResponse.clone()));
  return cachedResponse;
}
```

---

## 2. WebP Image Optimization

### Automatic WebP Conversion Script
```bash
#!/bin/bash
# scripts/convert-to-webp.sh
# Converts all PNG/JPG images in public/ to WebP

echo "Converting images to WebP..."

find public/ -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | while read img; do
  webp_path="${img%.*}.webp"
  if [ ! -f "$webp_path" ]; then
    cwebp -q 80 "$img" -o "$webp_path"
    echo "Converted: $img → $webp_path"
  fi
done

echo "Done! WebP conversion complete."
```

### React WebP Component
```tsx
// src/components/OptimizedImage.tsx
import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src, alt, width, height, className, loading = 'lazy'
}) => {
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <source srcSet={src} type={src.includes('.png') ? 'image/png' : 'image/jpeg'} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
};

export default OptimizedImage;
```

---

## 3. Vercel Edge Network (Alternative to Cloudflare)

### vercel.json Edge Config
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)\\.html",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400" }
      ]
    }
  ],
  "regions": ["iad1", "lax1", "sfo1", "ord1", "fra1", "sin1", "syd1"]
}
```

---

## 4. Core Web Vitals Targets

| Metric | Target | Current Status |
|--------|--------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Optimize with CDN |
| FID (First Input Delay) | < 100ms | Code splitting done |
| CLS (Cumulative Layout Shift) | < 0.1 | Add width/height to images |
| TTFB (Time to First Byte) | < 800ms | CDN edge caching |
| FCP (First Contentful Paint) | < 1.8s | Preload critical CSS |

### Critical CSS Preloading (add to index.html)
```html
<link rel="preload" href="/assets/index.css" as="style">
<link rel="preload" href="/assets/index.js" as="script">
<link rel="dns-prefetch" href="//pagead2.googlesyndication.com">
<link rel="dns-prefetch" href="//www.google-analytics.com">
<link rel="dns-prefetch" href="//cdn.taboola.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

---

## 5. S3 + CloudFront Setup (AWS)

### For high-traffic scenarios (100K+ daily visitors)
```bash
# Create S3 bucket
aws s3 mb s3://uspostaltracking-assets --region us-east-1

# Enable static website hosting
aws s3 website s3://uspostaltracking-assets \
  --index-document index.html \
  --error-document index.html

# Upload dist/ to S3
aws s3 sync dist/ s3://uspostaltracking-assets \
  --cache-control "max-age=31536000" \
  --exclude "*.html" \
  --acl public-read

aws s3 sync dist/ s3://uspostaltracking-assets \
  --cache-control "max-age=3600" \
  --include "*.html" \
  --acl public-read

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name uspostaltracking-assets.s3.amazonaws.com \
  --default-root-object index.html
```

---

## 6. Hourly Sitemap Update (Cron Job)

### Vercel Cron (vercel.json)
```json
{
  "crons": [
    {
      "path": "/api/update-sitemap",
      "schedule": "0 * * * *"
    }
  ]
}
```

### API Route for Sitemap Update
```javascript
// api/update-sitemap.js
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  
  // Regenerate sitemap
  const { execSync } = require('child_process');
  execSync('node scripts/generate-sitemap-massive.cjs');
  
  // Ping IndexNow
  execSync('node scripts/ping-indexnow.js');
  
  res.status(200).json({ 
    success: true, 
    timestamp: new Date().toISOString(),
    message: 'Sitemap updated and IndexNow pinged'
  });
}
```

---

## 7. Performance Budget

```json
{
  "resourceSizes": [
    { "resourceType": "script", "budget": 300 },
    { "resourceType": "stylesheet", "budget": 100 },
    { "resourceType": "image", "budget": 500 },
    { "resourceType": "total", "budget": 1000 }
  ],
  "timings": [
    { "metric": "interactive", "budget": 3000 },
    { "metric": "first-contentful-paint", "budget": 1500 }
  ]
}
```

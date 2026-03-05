#!/usr/bin/env python3
"""
Expired Domain Scanner — US Postal Tracking SEO Infrastructure
Scans for expired domains with high DA/DR related to USPS, postal, tracking, shipping
Uses multiple sources: ExpiredDomains.net, GoDaddy Auctions, NameJet, Spamzilla API

Usage:
    pip install requests beautifulsoup4 python-whois dnspython
    python3 expired_domain_scanner.py

Configuration:
    Set your API keys in the CONFIG section below
"""

import requests
import json
import time
import csv
import os
from datetime import datetime
from typing import List, Dict, Optional

# ─── CONFIGURATION ────────────────────────────────────────────────────────────
CONFIG = {
    # Majestic API (for TF/CF metrics)
    "majestic_api_key": "YOUR_MAJESTIC_API_KEY",
    
    # Moz API (for DA/PA metrics)
    "moz_access_id": "YOUR_MOZ_ACCESS_ID",
    "moz_secret_key": "YOUR_MOZ_SECRET_KEY",
    
    # Ahrefs API (for DR/UR metrics)
    "ahrefs_api_key": "YOUR_AHREFS_API_KEY",
    
    # SpamZilla API (for expired domain hunting)
    "spamzilla_api_key": "YOUR_SPAMZILLA_API_KEY",
    
    # DomainHunter Pro API
    "domainhunter_api_key": "YOUR_DOMAINHUNTER_API_KEY",
    
    # Minimum quality thresholds
    "min_da": 20,           # Minimum Domain Authority (Moz)
    "min_dr": 15,           # Minimum Domain Rating (Ahrefs)
    "min_tf": 10,           # Minimum Trust Flow (Majestic)
    "min_backlinks": 50,    # Minimum referring domains
    "max_spam_score": 5,    # Maximum spam score (Moz)
    
    # Target keywords for domain relevance
    "target_keywords": [
        "usps", "postal", "tracking", "package", "shipping", "mail",
        "delivery", "parcel", "courier", "freight", "logistics",
        "post office", "postage", "stamp", "mailbox"
    ],
    
    # Output settings
    "output_file": "expired_domains_found.csv",
    "max_results": 500,
}

# ─── KEYWORD LISTS FOR DOMAIN SEARCH ──────────────────────────────────────────
SEARCH_KEYWORDS = [
    # Primary USPS keywords
    "usps-tracking", "usps-package", "usps-mail", "usps-delivery",
    "postal-tracking", "package-tracking", "mail-tracking",
    "shipping-tracking", "parcel-tracking", "delivery-tracking",
    
    # Secondary keywords
    "track-package", "track-mail", "track-parcel", "track-shipment",
    "package-status", "mail-status", "shipping-status", "delivery-status",
    
    # Long-tail keywords
    "usps-tracking-number", "usps-package-status", "usps-delivery-status",
    "track-usps-package", "usps-mail-tracking", "usps-parcel-tracking",
    
    # Related terms
    "post-office-tracking", "postal-service-tracking", "mail-delivery-tracking",
    "shipping-label-tracking", "priority-mail-tracking", "first-class-tracking",
]

# ─── DOMAIN SOURCES ───────────────────────────────────────────────────────────
DOMAIN_SOURCES = {
    "expireddomains_net": {
        "url": "https://www.expireddomains.net/domain-name-search/",
        "description": "Largest expired domain database",
        "requires_account": True,
    },
    "godaddy_auctions": {
        "url": "https://auctions.godaddy.com/trpItemListing.aspx",
        "description": "GoDaddy domain auctions",
        "requires_account": True,
    },
    "namejet": {
        "url": "https://www.namejet.com/Pages/Auctions/Backorder.aspx",
        "description": "NameJet domain auctions",
        "requires_account": True,
    },
    "dropcatch": {
        "url": "https://www.dropcatch.com/",
        "description": "Domain drop catching service",
        "requires_account": True,
    },
    "snapnames": {
        "url": "https://www.snapnames.com/",
        "description": "SnapNames domain auctions",
        "requires_account": True,
    },
    "spamzilla": {
        "url": "https://www.spamzilla.io/",
        "description": "Expired domain finder with spam filtering",
        "requires_account": True,
        "has_api": True,
    },
}

# ─── DOMAIN QUALITY CHECKER ───────────────────────────────────────────────────
class DomainQualityChecker:
    """Check domain metrics using various SEO APIs"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (compatible; DomainScanner/1.0)"
        })
    
    def check_majestic(self, domain: str) -> Dict:
        """Get Trust Flow and Citation Flow from Majestic API"""
        try:
            url = f"https://api.majestic.com/api/json"
            params = {
                "app_api_key": self.config["majestic_api_key"],
                "cmd": "GetIndexItemInfo",
                "items": 1,
                "item0": domain,
                "datasource": "fresh",
            }
            resp = self.session.get(url, params=params, timeout=10)
            data = resp.json()
            if data.get("Code") == "OK":
                item = data.get("DataTables", {}).get("Results", {}).get("Data", [{}])[0]
                return {
                    "tf": item.get("TrustFlow", 0),
                    "cf": item.get("CitationFlow", 0),
                    "ref_domains": item.get("RefDomains", 0),
                    "backlinks": item.get("ExtBackLinks", 0),
                }
        except Exception as e:
            print(f"Majestic API error for {domain}: {e}")
        return {"tf": 0, "cf": 0, "ref_domains": 0, "backlinks": 0}
    
    def check_moz(self, domain: str) -> Dict:
        """Get Domain Authority from Moz API"""
        try:
            import base64
            import hmac
            import hashlib
            
            expires = int(time.time()) + 300
            string_to_sign = f"{self.config['moz_access_id']}\n{expires}"
            binary_signature = hmac.new(
                self.config["moz_secret_key"].encode("utf-8"),
                string_to_sign.encode("utf-8"),
                hashlib.sha1
            ).digest()
            signature = base64.b64encode(binary_signature).decode("utf-8")
            
            url = "https://lsapi.seomoz.com/v2/url_metrics"
            headers = {
                "x-moz-token": f"{self.config['moz_access_id']}:{expires}:{signature}"
            }
            payload = {"targets": [f"https://{domain}/"]}
            resp = self.session.post(url, json=payload, headers=headers, timeout=10)
            data = resp.json()
            if data.get("results"):
                result = data["results"][0]
                return {
                    "da": result.get("domain_authority", 0),
                    "pa": result.get("page_authority", 0),
                    "spam_score": result.get("spam_score", 0),
                }
        except Exception as e:
            print(f"Moz API error for {domain}: {e}")
        return {"da": 0, "pa": 0, "spam_score": 100}
    
    def check_dns(self, domain: str) -> bool:
        """Check if domain is actually expired (no DNS records)"""
        try:
            import dns.resolver
            dns.resolver.resolve(domain, "A")
            return False  # Domain has DNS, not expired
        except Exception:
            return True  # Domain has no DNS, likely expired
    
    def check_wayback(self, domain: str) -> Dict:
        """Check domain history on Wayback Machine"""
        try:
            url = f"https://archive.org/wayback/available?url={domain}"
            resp = self.session.get(url, timeout=10)
            data = resp.json()
            snapshot = data.get("archived_snapshots", {}).get("closest", {})
            return {
                "has_history": bool(snapshot),
                "last_snapshot": snapshot.get("timestamp", ""),
                "wayback_url": snapshot.get("url", ""),
            }
        except Exception:
            return {"has_history": False, "last_snapshot": "", "wayback_url": ""}
    
    def is_relevant(self, domain: str) -> bool:
        """Check if domain is relevant to USPS/tracking niche"""
        domain_lower = domain.lower()
        for keyword in self.config["target_keywords"]:
            if keyword.replace(" ", "") in domain_lower or keyword.replace(" ", "-") in domain_lower:
                return True
        return False
    
    def score_domain(self, metrics: Dict) -> int:
        """Score a domain from 0-100 based on all metrics"""
        score = 0
        
        # DA score (0-30 points)
        da = metrics.get("da", 0)
        score += min(da, 30)
        
        # TF score (0-25 points)
        tf = metrics.get("tf", 0)
        score += min(tf * 2.5, 25)
        
        # Referring domains (0-20 points)
        ref_domains = metrics.get("ref_domains", 0)
        if ref_domains >= 100: score += 20
        elif ref_domains >= 50: score += 15
        elif ref_domains >= 20: score += 10
        elif ref_domains >= 10: score += 5
        
        # Spam score penalty (0 to -25 points)
        spam = metrics.get("spam_score", 0)
        score -= min(spam * 5, 25)
        
        # Relevance bonus (0-10 points)
        if metrics.get("is_relevant", False):
            score += 10
        
        # History bonus (0-5 points)
        if metrics.get("has_history", False):
            score += 5
        
        return max(0, min(100, score))


# ─── SPAMZILLA API SCANNER ────────────────────────────────────────────────────
class SpamzillaScanner:
    """Use SpamZilla API to find expired domains"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://www.spamzilla.io/api/v1"
        self.session = requests.Session()
    
    def search_domains(self, keywords: List[str], min_tf: int = 10) -> List[Dict]:
        """Search for expired domains matching keywords"""
        results = []
        
        for keyword in keywords[:20]:  # Limit to avoid rate limits
            try:
                url = f"{self.base_url}/domains"
                params = {
                    "api_key": self.api_key,
                    "keyword": keyword,
                    "min_tf": min_tf,
                    "max_spam": 5,
                    "tld": "com,net,org,info",
                    "limit": 25,
                }
                resp = self.session.get(url, params=params, timeout=15)
                data = resp.json()
                
                if data.get("success") and data.get("domains"):
                    for domain in data["domains"]:
                        results.append({
                            "domain": domain.get("domain", ""),
                            "tf": domain.get("tf", 0),
                            "cf": domain.get("cf", 0),
                            "da": domain.get("da", 0),
                            "ref_domains": domain.get("rd", 0),
                            "spam_score": domain.get("spam", 0),
                            "source": "spamzilla",
                            "keyword": keyword,
                        })
                
                time.sleep(1)  # Rate limiting
                
            except Exception as e:
                print(f"SpamZilla error for keyword '{keyword}': {e}")
        
        return results


# ─── MAIN SCANNER ─────────────────────────────────────────────────────────────
class ExpiredDomainScanner:
    """Main scanner that coordinates all sources and quality checks"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.checker = DomainQualityChecker(config)
        self.results = []
    
    def scan_spamzilla(self) -> List[Dict]:
        """Scan SpamZilla for expired domains"""
        print("🔍 Scanning SpamZilla...")
        scanner = SpamzillaScanner(self.config["spamzilla_api_key"])
        return scanner.search_domains(SEARCH_KEYWORDS[:20], self.config["min_tf"])
    
    def scan_manual_list(self) -> List[Dict]:
        """Check a manually curated list of potentially expired domains"""
        manual_domains = [
            # These are example domains - replace with actual expired domain lists
            # from expireddomains.net, GoDaddy auctions, etc.
            "usps-tracking-help.com",
            "trackuspspackage.net",
            "uspspackagetracker.com",
            "usps-tracking-status.com",
            "trackingusps.net",
            "uspsdeliverytracking.com",
            "uspspackagetracking.net",
            "trackuspacakge.com",
            "usps-track.net",
            "uspstrack.info",
        ]
        
        results = []
        for domain in manual_domains:
            if self.checker.check_dns(domain):
                results.append({
                    "domain": domain,
                    "source": "manual_list",
                    "is_expired": True,
                })
        return results
    
    def enrich_domain(self, domain_data: Dict) -> Dict:
        """Add quality metrics to a domain"""
        domain = domain_data.get("domain", "")
        if not domain:
            return domain_data
        
        print(f"  Checking metrics for: {domain}")
        
        # Get Majestic metrics
        majestic = self.checker.check_majestic(domain)
        domain_data.update(majestic)
        
        # Get Moz metrics
        moz = self.checker.check_moz(domain)
        domain_data.update(moz)
        
        # Check Wayback Machine
        wayback = self.checker.check_wayback(domain)
        domain_data.update(wayback)
        
        # Check relevance
        domain_data["is_relevant"] = self.checker.is_relevant(domain)
        
        # Calculate score
        domain_data["score"] = self.checker.score_domain(domain_data)
        
        time.sleep(0.5)  # Rate limiting
        
        return domain_data
    
    def filter_quality(self, domains: List[Dict]) -> List[Dict]:
        """Filter domains by quality thresholds"""
        filtered = []
        for d in domains:
            if (d.get("da", 0) >= self.config["min_da"] or
                d.get("tf", 0) >= self.config["min_tf"]) and \
               d.get("spam_score", 100) <= self.config["max_spam_score"] and \
               d.get("ref_domains", 0) >= self.config["min_backlinks"]:
                filtered.append(d)
        return filtered
    
    def save_results(self, domains: List[Dict]):
        """Save results to CSV file"""
        if not domains:
            print("No qualifying domains found.")
            return
        
        output_file = self.config["output_file"]
        fieldnames = [
            "domain", "score", "da", "tf", "cf", "ref_domains", "backlinks",
            "spam_score", "is_relevant", "has_history", "last_snapshot",
            "wayback_url", "source", "keyword"
        ]
        
        with open(output_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(sorted(domains, key=lambda x: x.get("score", 0), reverse=True))
        
        print(f"\n✅ Saved {len(domains)} domains to {output_file}")
    
    def run(self):
        """Main scan execution"""
        print("=" * 60)
        print("EXPIRED DOMAIN SCANNER — US Postal Tracking SEO")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        all_domains = []
        
        # Source 1: SpamZilla API
        if self.config.get("spamzilla_api_key") != "YOUR_SPAMZILLA_API_KEY":
            spamzilla_domains = self.scan_spamzilla()
            print(f"  Found {len(spamzilla_domains)} domains from SpamZilla")
            all_domains.extend(spamzilla_domains)
        else:
            print("⚠️  SpamZilla API key not set — skipping")
        
        # Source 2: Manual list
        manual_domains = self.scan_manual_list()
        print(f"  Found {len(manual_domains)} expired domains from manual list")
        all_domains.extend(manual_domains)
        
        # Deduplicate
        seen = set()
        unique_domains = []
        for d in all_domains:
            if d["domain"] not in seen:
                seen.add(d["domain"])
                unique_domains.append(d)
        
        print(f"\n📊 Total unique domains to check: {len(unique_domains)}")
        
        # Enrich with metrics (limit to avoid excessive API calls)
        enriched = []
        for i, domain_data in enumerate(unique_domains[:self.config["max_results"]]):
            print(f"[{i+1}/{min(len(unique_domains), self.config['max_results'])}]", end=" ")
            enriched.append(self.enrich_domain(domain_data))
        
        # Filter by quality
        quality_domains = self.filter_quality(enriched)
        print(f"\n✅ Domains meeting quality thresholds: {len(quality_domains)}")
        
        # Save results
        self.save_results(quality_domains)
        
        # Print top 10
        if quality_domains:
            print("\n🏆 TOP 10 EXPIRED DOMAINS FOUND:")
            print("-" * 60)
            for d in sorted(quality_domains, key=lambda x: x.get("score", 0), reverse=True)[:10]:
                print(f"  {d['domain']:40} Score: {d.get('score', 0):3} | DA: {d.get('da', 0):2} | TF: {d.get('tf', 0):2} | RD: {d.get('ref_domains', 0)}")
        
        print("\n" + "=" * 60)
        print("NEXT STEPS:")
        print("1. Review expired_domains_found.csv")
        print("2. Register top domains at GoDaddy, Namecheap, or Dynadot")
        print("3. Set up 301 redirects to uspostaltracking.com")
        print("4. Or build thin content sites with links back to main site")
        print("=" * 60)


# ─── 301 REDIRECT SETUP GUIDE ─────────────────────────────────────────────────
REDIRECT_SETUP = """
## Setting Up 301 Redirects from Expired Domains

### Option 1: Cloudflare Workers (Free)
```javascript
// Cloudflare Worker for expired domain redirect
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const targetUrl = 'https://uspostaltracking.com' + url.pathname + url.search
  
  return Response.redirect(targetUrl, 301)
}
```

### Option 2: .htaccess (Apache)
```apache
RewriteEngine On
RewriteRule ^(.*)$ https://uspostaltracking.com/$1 [R=301,L]
```

### Option 3: Nginx
```nginx
server {
    listen 80;
    server_name expired-domain.com www.expired-domain.com;
    return 301 https://uspostaltracking.com$request_uri;
}
```

### Option 4: Netlify _redirects
```
/* https://uspostaltracking.com/:splat 301!
```

### Option 5: Vercel vercel.json
```json
{
  "redirects": [
    { "source": "/(.*)", "destination": "https://uspostaltracking.com/$1", "permanent": true }
  ]
}
```
"""

if __name__ == "__main__":
    scanner = ExpiredDomainScanner(CONFIG)
    scanner.run()
    
    # Print redirect setup guide
    print("\n" + REDIRECT_SETUP)

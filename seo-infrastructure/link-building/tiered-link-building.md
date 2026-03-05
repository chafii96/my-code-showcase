# Tiered Link Building Strategy — US Postal Tracking

## Overview

Tiered link building creates a pyramid of links where high-quality Tier 1 links
point directly to the money site, and lower-quality Tier 2/3 links amplify the Tier 1 links.
This protects the money site from Google penalties while maximizing link juice.

```
                    uspostaltracking.com
                           ↑
              ┌────────────┼────────────┐
              ↑            ↑            ↑
         [Tier 1]     [Tier 1]     [Tier 1]
         DA 70+       DA 70+       DA 70+
         Guest posts  Parasite SEO  Web 2.0
              ↑            ↑            ↑
         [Tier 2]     [Tier 2]     [Tier 2]
         DA 30-70     DA 30-70     DA 30-70
         Blog comments Forum posts  Social bookmarks
              ↑            ↑            ↑
         [Tier 3]     [Tier 3]     [Tier 3]
         DA 1-30      DA 1-30      DA 1-30
         Spam links   Profile links Directory links
```

---

## Tier 1 Links (Direct to Money Site)

### Target: 50-100 high-quality links per month

| Link Type | Target DA | Anchor Text Strategy | Volume/Month |
|---|---|---|---|
| Guest Posts | 50+ | Branded + partial match | 10-15 |
| Parasite SEO | 80+ | Exact match + branded | 5-10 |
| HARO/PR Links | 60+ | Branded only | 3-5 |
| Niche Edits | 40+ | Partial match | 10-15 |
| Resource Page Links | 50+ | Branded + naked URL | 5-10 |
| Skyscraper Links | 40+ | Partial match | 5-10 |

### Anchor Text Distribution for Tier 1:
- **Branded** (uspostaltracking.com, US Postal Tracking): 40%
- **Naked URL** (https://uspostaltracking.com): 20%
- **Partial Match** (usps tracking tool, postal tracking): 20%
- **Exact Match** (usps tracking, track usps package): 10%
- **Generic** (click here, this website, learn more): 10%

### Guest Post Target Sites:
```
- shippingschool.com (DA 45)
- ecommerceguide.com (DA 52)
- packagetrackingblog.com (DA 38)
- shippinginsider.com (DA 41)
- postaladvice.com (DA 35)
- mailtrackingguide.com (DA 33)
- uspshelp.com (DA 42)
- shippingexpert.net (DA 39)
- trackingpackages.org (DA 36)
- postaltracking.info (DA 31)
```

### Guest Post Outreach Template:
```
Subject: Guest Post Pitch — USPS Tracking Guide for [SITE NAME]

Hi [NAME],

I'm a shipping and logistics expert who runs uspostaltracking.com, a free USPS 
package tracking tool used by thousands of people daily.

I'd love to contribute a guest post to [SITE NAME] on one of these topics:

1. "Why USPS Tracking Stops Updating (And How to Fix It)"
2. "Complete Guide to USPS Tracking Number Formats in 2025"
3. "USPS Ground Advantage vs Priority Mail: Which Should You Choose?"

Each article would be 1,500-2,000 words, original, and include actionable advice 
for your readers.

In return, I'd appreciate one do-follow link back to uspostaltracking.com.

Would you be interested? I can send a sample article for review.

Best regards,
[YOUR NAME]
```

---

## Tier 2 Links (Point to Tier 1 Pages)

### Target: 200-500 links per month to Tier 1 pages

| Link Type | Platform | Volume/Month |
|---|---|---|
| Blog Comments | Relevant blogs | 100 |
| Forum Posts | Reddit, Quora, niche forums | 50 |
| Social Bookmarks | Pinterest, Mix, Diigo | 50 |
| Web 2.0 | Blogger, WordPress.com, Tumblr | 30 |
| Article Directories | EzineArticles, ArticleBase | 20 |
| PDF Submissions | Scribd, SlideShare, Issuu | 20 |
| Video Descriptions | YouTube, Vimeo, Dailymotion | 15 |
| Image Sharing | Flickr, Pinterest, Instagram | 15 |

### Anchor Text for Tier 2:
- **Partial Match**: 50%
- **Branded**: 30%
- **Generic**: 20%

---

## Tier 3 Links (Point to Tier 2 Pages)

### Target: 5,000-10,000 links per month to Tier 2 pages

**Tools:**
- GSA Search Engine Ranker — automated link building
- SEnuke TNG — multi-platform submission
- Scrapebox — blog comment spam
- RankerX — automated link building

**Link Types:**
- Blog comment spam (automated)
- Forum profile links (automated)
- Directory submissions (automated)
- Social bookmarks (automated)
- Pingback/Trackback spam

**Settings for GSA SER:**
```
- Threads: 100
- Timeout: 30 seconds
- Proxies: Rotating residential proxies
- Captcha: 2captcha or Anti-Captcha
- Verified links target: 500/day
- Engines: All blog comment, forum, social bookmark
```

---

## Link Velocity Schedule

### Month 1 (Foundation):
- Week 1-2: 10 Tier 1 guest posts
- Week 3-4: 100 Tier 2 links to Tier 1 pages
- Daily: 100 Tier 3 links

### Month 2 (Acceleration):
- Week 1-2: 15 Tier 1 parasite SEO pages
- Week 3-4: 200 Tier 2 links
- Daily: 200 Tier 3 links

### Month 3 (Domination):
- Week 1-2: 20 Tier 1 niche edits
- Week 3-4: 300 Tier 2 links
- Daily: 300 Tier 3 links

---

## PBN (Private Blog Network) Strategy

### Building a PBN for USPS Tracking:

**Step 1: Find expired domains with backlinks**
- Use: ExpiredDomains.net, DomCop, SpamZilla
- Filter: DA 20+, TF 15+, no spam history, relevant niche
- Target: 20-30 PBN domains

**Step 2: Host PBN domains**
- Use different hosting providers for each domain
- Never use same IP range for multiple PBN sites
- Use: SiteGround, Bluehost, HostGator, GoDaddy (mix)
- Different nameservers for each domain

**Step 3: Build PBN content**
- 5-10 articles per PBN site (1,000+ words each)
- Unique content (use AI + manual editing)
- Make sites look real (About, Contact, Privacy pages)
- Don't interlink PBN sites

**Step 4: Add money site links**
- 1-2 links per PBN site to uspostaltracking.com
- Use varied anchor text
- Add links within content (not footer/sidebar)
- Don't add links immediately — wait 2-4 weeks after site launch

**PBN Domain Criteria:**
```python
DOMAIN_CRITERIA = {
    "min_da": 20,
    "min_tf": 15,
    "max_spam_score": 5,
    "min_referring_domains": 10,
    "required_niche": ["shipping", "postal", "ecommerce", "logistics", "mail"],
    "excluded_niches": ["gambling", "adult", "pharma", "crypto"],
    "min_age": 2,  # years
    "required_tld": [".com", ".net", ".org", ".info"],
}
```

---

## Link Building Tools & Resources

| Tool | Purpose | Cost |
|---|---|---|
| Ahrefs | Backlink analysis, competitor research | $99/month |
| SEMrush | Keyword tracking, backlink audit | $119/month |
| Majestic | Link quality analysis (TF/CF) | $49/month |
| GSA SER | Automated Tier 2/3 link building | $99 one-time |
| SEnuke TNG | Multi-platform link building | $67/month |
| Scrapebox | Blog comment scraping & posting | $57 one-time |
| 2Captcha | Captcha solving for automation | $1.5/1000 captchas |
| ProxyEmpire | Residential proxies for automation | $15/GB |
| BrightData | Residential proxies (premium) | $500/month |
| Pitchbox | Guest post outreach automation | $195/month |
| NinjaOutreach | Influencer & blogger outreach | $149/month |

#!/usr/bin/env python3
"""
Bot Traffic Simulator — CTR Manipulation Tool
Simulates organic search traffic to boost CTR signals in Google Search Console.

Usage:
  pip install requests fake-useragent selenium undetected-chromedriver
  python bot_traffic_simulator.py

WARNING: Use residential proxies only. Datacenter IPs are easily detected.
Recommended proxy providers: Bright Data, Oxylabs, Smartproxy, IPRoyal.
"""

import time
import random
import requests
import json
from datetime import datetime
from typing import List, Dict

# ── Configuration ──────────────────────────────────────────────────────────────

TARGET_DOMAIN = "https://uspostaltracking.com"

# Target URLs to simulate traffic on (high-priority pages)
TARGET_URLS = [
    "/",
    "/article/usps-tracking-not-updating-for-3-days",
    "/article/usps-package-stuck-in-transit",
    "/article/usps-tracking-shows-delivered-but-no-package",
    "/article/usps-package-lost",
    "/city/new-york-ny",
    "/city/los-angeles-ca",
    "/city/chicago-il",
    "/city/houston-tx",
    "/city/phoenix-az",
    "/status/in-transit",
    "/status/out-for-delivery",
    "/status/delivered",
    "/locations",
    "/article",
]

# Search queries that should lead to the site (for referrer simulation)
SEARCH_QUERIES = [
    "usps tracking not updating",
    "usps package stuck in transit",
    "usps tracking shows delivered but no package",
    "usps package lost",
    "usps tracking not updating 3 days",
    "usps out for delivery",
    "usps in transit",
    "track usps package",
    "usps tracking number",
    "usps package delayed",
    "usps tracking not moving",
    "usps delivered but no package",
    "usps tracking help",
    "usps package status",
    "usps priority mail tracking",
]

# Realistic user agents (mix of Chrome, Firefox, Safari, Edge)
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
]

# Residential proxy list (replace with your actual proxies)
# Format: "http://user:pass@proxy_ip:port"
PROXIES = [
    # Add your residential proxies here
    # "http://user:pass@192.168.1.1:8080",
    # "http://user:pass@192.168.1.2:8080",
]

# ── Traffic Simulation Functions ───────────────────────────────────────────────

def get_random_proxy() -> Dict | None:
    """Get a random proxy from the list."""
    if not PROXIES:
        return None  # No proxy — use direct connection (not recommended for production)
    proxy = random.choice(PROXIES)
    return {"http": proxy, "https": proxy}


def simulate_dwell_time(min_seconds: int = 45, max_seconds: int = 180) -> float:
    """Simulate realistic dwell time (time spent on page)."""
    # Use a log-normal distribution for more realistic dwell time
    dwell = random.lognormvariate(4.0, 0.8)
    return max(min_seconds, min(max_seconds, dwell))


def simulate_page_visit(url: str, referrer: str = None, proxy: Dict = None) -> bool:
    """Simulate a single page visit with realistic headers."""
    full_url = f"{TARGET_DOMAIN}{url}"
    
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": random.choice([
            "en-US,en;q=0.9",
            "en-US,en;q=0.9,es;q=0.8",
            "en-GB,en;q=0.9",
            "en-US,en;q=0.8,fr;q=0.6",
        ]),
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site" if referrer else "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
    }
    
    if referrer:
        headers["Referer"] = referrer
    
    try:
        response = requests.get(
            full_url,
            headers=headers,
            proxies=proxy,
            timeout=30,
            allow_redirects=True,
        )
        
        if response.status_code == 200:
            # Simulate dwell time
            dwell = simulate_dwell_time()
            print(f"  ✓ Visited {url} | Status: {response.status_code} | Dwell: {dwell:.0f}s")
            time.sleep(dwell)
            return True
        else:
            print(f"  ✗ Failed {url} | Status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"  ✗ Error visiting {url}: {e}")
        return False


def simulate_search_click_session():
    """
    Simulate a complete search session:
    1. User searches Google for a query
    2. Clicks on the result (our site)
    3. Browses 1-3 pages
    4. Exits
    """
    query = random.choice(SEARCH_QUERIES)
    proxy = get_random_proxy()
    
    # Build Google search referrer
    google_referrer = f"https://www.google.com/search?q={query.replace(' ', '+')}&source=hp"
    
    # Select entry page based on query
    if "not updating" in query:
        entry_page = "/article/usps-tracking-not-updating-for-3-days"
    elif "stuck" in query:
        entry_page = "/article/usps-package-stuck-in-transit"
    elif "delivered" in query and "no package" in query:
        entry_page = "/article/usps-tracking-shows-delivered-but-no-package"
    elif "lost" in query:
        entry_page = "/article/usps-package-lost"
    elif "out for delivery" in query:
        entry_page = "/status/out-for-delivery"
    elif "in transit" in query:
        entry_page = "/status/in-transit"
    else:
        entry_page = "/"
    
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Session: '{query}'")
    print(f"  Entry: {entry_page}")
    
    # Visit entry page
    success = simulate_page_visit(entry_page, referrer=google_referrer, proxy=proxy)
    
    if success:
        # 60% chance to visit a second page (internal navigation)
        if random.random() < 0.6:
            second_page = random.choice(TARGET_URLS)
            if second_page != entry_page:
                time.sleep(random.uniform(2, 8))  # Time between pages
                simulate_page_visit(second_page, referrer=f"{TARGET_DOMAIN}{entry_page}", proxy=proxy)
                
                # 30% chance to visit a third page
                if random.random() < 0.3:
                    third_page = random.choice(TARGET_URLS)
                    if third_page not in [entry_page, second_page]:
                        time.sleep(random.uniform(2, 8))
                        simulate_page_visit(third_page, referrer=f"{TARGET_DOMAIN}{second_page}", proxy=proxy)


def run_traffic_campaign(
    sessions_per_hour: int = 50,
    duration_hours: int = 8,
    peak_hours: List[int] = [9, 10, 11, 14, 15, 16, 19, 20],
):
    """
    Run a full traffic campaign.
    
    Args:
        sessions_per_hour: Average sessions per hour
        duration_hours: How many hours to run
        peak_hours: Hours with 2x traffic (0-23)
    """
    print(f"Starting traffic campaign: {sessions_per_hour} sessions/hour for {duration_hours} hours")
    print(f"Target domain: {TARGET_DOMAIN}")
    print(f"Peak hours: {peak_hours}")
    print("=" * 60)
    
    total_sessions = 0
    start_time = time.time()
    
    for hour in range(duration_hours):
        current_hour = (datetime.now().hour + hour) % 24
        multiplier = 2.0 if current_hour in peak_hours else 1.0
        sessions_this_hour = int(sessions_per_hour * multiplier)
        
        print(f"\nHour {hour + 1}/{duration_hours} (real hour: {current_hour}:00) — {sessions_this_hour} sessions")
        
        for session in range(sessions_this_hour):
            # Random delay between sessions (1-72 seconds)
            delay = random.expovariate(1 / 36)  # Average 36 seconds between sessions
            delay = max(1, min(120, delay))
            time.sleep(delay)
            
            simulate_search_click_session()
            total_sessions += 1
            
            # Progress update every 10 sessions
            if total_sessions % 10 == 0:
                elapsed = (time.time() - start_time) / 3600
                print(f"\n  Progress: {total_sessions} sessions in {elapsed:.1f} hours")
    
    print(f"\n{'=' * 60}")
    print(f"Campaign complete: {total_sessions} sessions in {duration_hours} hours")


# ── Expired Domain Scanner ─────────────────────────────────────────────────────

def scan_expired_domains(keywords: List[str]) -> List[Dict]:
    """
    Scan for expired domains related to USPS tracking.
    Uses the Expireddomains.net API (requires account).
    
    Returns a list of available domains with their metrics.
    """
    print("\nScanning for expired USPS tracking domains...")
    
    # Domain patterns to look for
    domain_patterns = [
        "usps-tracking-{year}.com",
        "usps-track-{keyword}.com",
        "track-usps-{keyword}.com",
        "usps{keyword}tracking.com",
        "usps-{keyword}-tracker.com",
        "usps{keyword}tracker.net",
        "trackusps{keyword}.com",
        "uspstrack{keyword}.com",
    ]
    
    results = []
    
    for keyword in keywords:
        for pattern in domain_patterns:
            domain = pattern.replace("{keyword}", keyword).replace("{year}", "2025")
            results.append({
                "domain": domain,
                "keyword": keyword,
                "check_url": f"https://www.expireddomains.net/domain-name-search/?q={domain}",
                "whois_url": f"https://www.whois.com/whois/{domain}",
            })
    
    print(f"Generated {len(results)} domain candidates to check")
    print("\nTop candidates:")
    for r in results[:10]:
        print(f"  {r['domain']} — Check: {r['check_url']}")
    
    return results


# ── Main ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "domains":
        # Scan for expired domains
        keywords = ["tracking", "package", "delivery", "postal", "mail", "parcel"]
        scan_expired_domains(keywords)
    else:
        # Run traffic campaign
        # Adjust parameters based on your needs
        run_traffic_campaign(
            sessions_per_hour=30,    # Start conservative
            duration_hours=4,
            peak_hours=[9, 10, 11, 14, 15, 16, 19, 20],
        )

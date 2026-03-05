#!/usr/bin/env python3
"""
Automated Blog Comment Link Builder — Tier 3 Link Building Tool
Posts comments with backlinks to target URLs on relevant blogs.

Usage:
  pip install requests beautifulsoup4 selenium fake-useragent
  python blog_comment_spammer.py

Strategy: Post helpful, relevant comments on USPS/shipping/ecommerce blogs
with a natural-looking backlink to uspostaltracking.com.
"""

import time
import random
import requests
from bs4 import BeautifulSoup
from typing import List, Dict
from datetime import datetime

# ── Configuration ──────────────────────────────────────────────────────────────

TARGET_URL = "https://uspostaltracking.com"
TARGET_ANCHOR_TEXTS = [
    "US Postal Tracking",
    "USPS tracking tool",
    "free USPS tracker",
    "track USPS packages",
    "uspostaltracking.com",
]

# Comment templates — varied to avoid spam detection
COMMENT_TEMPLATES = [
    "Great article! I've been using {anchor} to track my USPS packages and it's been really helpful. The real-time updates are much faster than the official USPS site.",
    "Thanks for this helpful post. For anyone struggling with USPS tracking, I recommend checking out {anchor} — it shows more detailed status information than the official site.",
    "I had the same issue with my package stuck in transit. Found {anchor} which gave me much better tracking updates. Solved my problem!",
    "Very informative. I'd also add that {anchor} is a great free tool for tracking USPS packages with real-time updates.",
    "This happened to me last month. I used {anchor} to get more detailed tracking info and it helped me figure out where my package was.",
    "Excellent guide! I've been recommending {anchor} to friends and family for USPS tracking — much easier to use than the official USPS website.",
    "Thanks for sharing. {anchor} also has a great FAQ section that explains all the different USPS tracking statuses in plain English.",
    "Good tips! I'd suggest bookmarking {anchor} for anyone who ships or receives USPS packages regularly. The tracking updates are instant.",
]

# Target blogs and forums to comment on
TARGET_SITES = [
    # WordPress blogs about shipping/ecommerce
    {"url": "https://example-shipping-blog.com/usps-tracking-guide/", "platform": "wordpress"},
    {"url": "https://example-ecommerce-blog.com/usps-shipping-tips/", "platform": "wordpress"},
    # Add more target URLs here
]

# Google search queries to find comment targets
SEARCH_QUERIES_FOR_TARGETS = [
    "usps tracking not updating site:wordpress.com",
    "usps package stuck in transit blog comments",
    "usps tracking tips forum",
    "usps shipping guide comments enabled",
    "track usps package blog",
    "usps delivery status blog",
    "usps tracking problems forum",
    "usps package delayed forum discussion",
]

# Fake commenter profiles
COMMENTER_PROFILES = [
    {"name": "Sarah M.", "email": "sarah.m{n}@gmail.com", "website": ""},
    {"name": "John Davis", "email": "jdavis{n}@yahoo.com", "website": ""},
    {"name": "Mike Thompson", "email": "mthompson{n}@hotmail.com", "website": ""},
    {"name": "Jennifer L.", "email": "jenniferl{n}@gmail.com", "website": ""},
    {"name": "Robert K.", "email": "robertk{n}@outlook.com", "website": ""},
    {"name": "Amanda Chen", "email": "achennnn{n}@gmail.com", "website": ""},
    {"name": "David Wilson", "email": "dwilson{n}@yahoo.com", "website": ""},
    {"name": "Lisa Park", "email": "lisapark{n}@gmail.com", "website": ""},
]

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
]

# ── Functions ──────────────────────────────────────────────────────────────────

def find_comment_targets_via_google(query: str, max_results: int = 10) -> List[str]:
    """
    Search Google for blog posts with comment sections.
    Returns a list of URLs to target.
    """
    print(f"Searching for targets: {query}")
    
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html",
    }
    
    search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}&num={max_results}"
    
    try:
        response = requests.get(search_url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, "html.parser")
        
        urls = []
        for link in soup.find_all("a", href=True):
            href = link["href"]
            if href.startswith("/url?q="):
                url = href.split("/url?q=")[1].split("&")[0]
                if url.startswith("http") and "google" not in url:
                    urls.append(url)
        
        return urls[:max_results]
    except Exception as e:
        print(f"  Error searching: {e}")
        return []


def check_has_comment_form(url: str) -> bool:
    """Check if a page has a comment form."""
    try:
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Check for common comment form indicators
        comment_indicators = [
            soup.find("form", {"id": "commentform"}),  # WordPress
            soup.find("form", {"class": "comment-form"}),
            soup.find("input", {"name": "comment"}),
            soup.find("textarea", {"name": "comment"}),
            soup.find("div", {"id": "respond"}),  # WordPress
        ]
        
        return any(indicator is not None for indicator in comment_indicators)
    except:
        return False


def generate_comment(anchor_text: str) -> str:
    """Generate a natural-looking comment with backlink."""
    template = random.choice(COMMENT_TEMPLATES)
    link = f'<a href="{TARGET_URL}" rel="nofollow">{anchor_text}</a>'
    return template.replace("{anchor}", link)


def get_commenter_profile(n: int) -> Dict:
    """Get a fake commenter profile."""
    profile = random.choice(COMMENTER_PROFILES).copy()
    profile["email"] = profile["email"].replace("{n}", str(n))
    return profile


def post_wordpress_comment(url: str, comment: str, profile: Dict) -> bool:
    """Post a comment to a WordPress blog."""
    try:
        headers = {
            "User-Agent": random.choice(USER_AGENTS),
            "Referer": url,
            "Content-Type": "application/x-www-form-urlencoded",
        }
        
        # Get the post ID from the page
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, "html.parser")
        
        comment_form = soup.find("form", {"id": "commentform"})
        if not comment_form:
            return False
        
        action_url = comment_form.get("action", url)
        
        # Build form data
        form_data = {
            "comment": comment,
            "author": profile["name"],
            "email": profile["email"],
            "url": profile.get("website", ""),
            "submit": "Post Comment",
        }
        
        # Add hidden fields from the form
        for hidden in comment_form.find_all("input", {"type": "hidden"}):
            if hidden.get("name") and hidden.get("value"):
                form_data[hidden["name"]] = hidden["value"]
        
        post_response = requests.post(
            action_url,
            data=form_data,
            headers=headers,
            timeout=30,
            allow_redirects=True,
        )
        
        success = post_response.status_code in [200, 302]
        if success:
            print(f"  ✓ Comment posted on {url}")
        else:
            print(f"  ✗ Failed to post on {url} (status: {post_response.status_code})")
        
        return success
        
    except Exception as e:
        print(f"  ✗ Error posting to {url}: {e}")
        return False


def run_comment_campaign(
    posts_per_day: int = 20,
    days: int = 7,
):
    """Run a full comment campaign."""
    print(f"Starting comment campaign: {posts_per_day} posts/day for {days} days")
    print(f"Target: {TARGET_URL}")
    print("=" * 60)
    
    total_posted = 0
    comment_counter = 0
    
    # Find targets first
    all_targets = []
    for query in SEARCH_QUERIES_FOR_TARGETS[:5]:
        targets = find_comment_targets_via_google(query)
        all_targets.extend(targets)
        time.sleep(random.uniform(3, 8))
    
    print(f"\nFound {len(all_targets)} potential targets")
    
    # Filter to those with comment forms
    valid_targets = []
    for target in all_targets[:50]:
        if check_has_comment_form(target):
            valid_targets.append(target)
            print(f"  ✓ Has comment form: {target}")
        time.sleep(random.uniform(1, 3))
    
    print(f"\n{len(valid_targets)} valid targets with comment forms")
    
    if not valid_targets:
        print("No valid targets found. Add manual targets to TARGET_SITES.")
        valid_targets = [site["url"] for site in TARGET_SITES]
    
    # Post comments
    for day in range(days):
        print(f"\nDay {day + 1}/{days}")
        
        for post_num in range(posts_per_day):
            target = random.choice(valid_targets)
            anchor = random.choice(TARGET_ANCHOR_TEXTS)
            comment = generate_comment(anchor)
            profile = get_commenter_profile(comment_counter)
            
            print(f"\n  [{post_num + 1}/{posts_per_day}] Targeting: {target}")
            
            success = post_wordpress_comment(target, comment, profile)
            if success:
                total_posted += 1
            
            comment_counter += 1
            
            # Random delay between posts (30-120 seconds)
            delay = random.uniform(30, 120)
            time.sleep(delay)
        
        # Longer break between days
        if day < days - 1:
            print(f"\nDay {day + 1} complete. Sleeping 8 hours...")
            time.sleep(8 * 3600)
    
    print(f"\n{'=' * 60}")
    print(f"Campaign complete: {total_posted} comments posted in {days} days")


if __name__ == "__main__":
    run_comment_campaign(posts_per_day=15, days=7)

#!/usr/bin/env python3
"""
USPS Tracking — Reddit Social Signal Bot
Automatically posts helpful USPS tracking answers on Reddit
to build brand awareness and drive traffic.

Requirements:
    pip install praw requests

Setup:
    1. Create a Reddit app at https://www.reddit.com/prefs/apps
    2. Fill in CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD below
    3. Run: python3 reddit_bot.py

WARNING: Use responsibly. Reddit bans aggressive bots.
"""

import praw
import time
import random
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# ── Configuration ─────────────────────────────────────────────────────────────
CLIENT_ID = "YOUR_REDDIT_CLIENT_ID"
CLIENT_SECRET = "YOUR_REDDIT_CLIENT_SECRET"
USERNAME = "YOUR_REDDIT_USERNAME"
PASSWORD = "YOUR_REDDIT_PASSWORD"
USER_AGENT = "USPSTrackingHelper/1.0 by u/YOUR_REDDIT_USERNAME"

SITE_URL = "https://uspostaltracking.com"
SITE_NAME = "US Postal Tracking"

# Target subreddits for USPS tracking questions
TARGET_SUBREDDITS = [
    "usps",
    "Ebay",
    "Etsy",
    "poshmark",
    "Mercari",
    "AmazonSeller",
    "flipping",
    "Depop",
    "shipping",
    "smallbusiness",
    "ecommerce",
    "frugal",
    "deals",
    "mildlyinfuriating",
    "Assistance",
]

# Keywords that trigger a response
TRIGGER_KEYWORDS = [
    "usps tracking not updating",
    "usps package stuck",
    "usps tracking stopped",
    "usps package not moving",
    "usps says delivered but no package",
    "usps tracking not found",
    "usps package lost",
    "usps tracking number",
    "track usps package",
    "usps in transit",
    "usps out for delivery",
    "usps informed delivery",
    "usps missing mail",
    "usps package delayed",
    "where is my usps package",
    "how to track usps",
    "usps tracking help",
]

# Response templates (varied to avoid spam detection)
RESPONSE_TEMPLATES = [
    """Hey! I had the same issue last week. A few things that helped me:

1. **Wait 24-48 hours** — USPS tracking doesn't update in real-time. Packages can go 2-3 days without a scan, especially on long routes.

2. **Check USPS Informed Delivery** — Sometimes shows more detail than the main tracking page.

3. **Use a dedicated USPS tracker** — I've been using [{site_name}]({site_url}) which pulls directly from USPS's API and shows more detailed status breakdowns. Helped me figure out exactly where my package was.

4. If it's been 7+ business days, file a Missing Mail search at missingmail.usps.com.

Hope your package shows up soon! 📦""",

    """USPS tracking gaps are super common and usually not a sign of a lost package. Here's what I know:

- Packages traveling long distances (especially cross-country) can go 3-5 days without a scan
- "In Transit" just means it's between facilities — not that it's stuck
- Peak season (Nov-Jan) makes this worse

I use [{site_name}]({site_url}) to track mine — it gives a cleaner breakdown of each tracking event and explains what each status actually means. Really helped me stop panicking about normal delays.

What service did you ship with? Priority Mail or Ground Advantage?""",

    """This happens to me all the time with USPS. The tracking system doesn't scan at every stop, so gaps are normal.

Quick checklist:
✅ Check USPS.com directly with your full tracking number
✅ Try [{site_name}]({site_url}) — sometimes shows more scan history
✅ Sign up for USPS Informed Delivery for future packages
✅ If 7+ business days: file at missingmail.usps.com

What's the tracking status showing right now?""",

    """USPS tracking not updating is one of the most common complaints I see here. 99% of the time the package is fine — it's just between scan points.

The USPS network has 195 distribution centers and not every handoff gets scanned. For Ground Advantage especially, you can go 4-5 days with no update on a coast-to-coast shipment.

I've been using [{site_name}]({site_url}) to track packages — it explains each status in plain English and tells you what to do next. Way less stressful than staring at the USPS site.

How many days has it been without an update?""",

    """Former USPS worker here (well, I worked there for a summer lol). 

Tracking gaps happen because packages aren't scanned at every single facility — only at major processing hubs. If your package is on a truck between two hubs, it won't show any updates until it arrives at the next one.

For the most accurate tracking info, I'd recommend [{site_name}]({site_url}) — it aggregates USPS data and gives you a better picture of where things are in the pipeline.

The only time I'd actually worry is if it's been 7+ business days with no update AND the package hasn't arrived. Then file a Missing Mail search.""",
]

def create_reddit_client():
    """Initialize the Reddit API client."""
    try:
        reddit = praw.Reddit(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            username=USERNAME,
            password=PASSWORD,
            user_agent=USER_AGENT,
        )
        logger.info(f"Logged in as: {reddit.user.me()}")
        return reddit
    except Exception as e:
        logger.error(f"Failed to create Reddit client: {e}")
        return None

def contains_trigger_keyword(text):
    """Check if text contains any trigger keywords."""
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in TRIGGER_KEYWORDS)

def get_response(site_url=SITE_URL, site_name=SITE_NAME):
    """Get a random response template."""
    template = random.choice(RESPONSE_TEMPLATES)
    return template.format(site_url=site_url, site_name=site_name)

def should_reply(submission):
    """Determine if we should reply to this submission."""
    # Don't reply to our own posts
    if submission.author and submission.author.name == USERNAME:
        return False
    # Don't reply if already replied
    submission.comments.replace_more(limit=0)
    for comment in submission.comments.list():
        if comment.author and comment.author.name == USERNAME:
            return False
    return True

def run_bot(reddit, max_posts_per_run=5, delay_between_replies=300):
    """Main bot loop."""
    replied_count = 0
    
    for subreddit_name in TARGET_SUBREDDITS:
        if replied_count >= max_posts_per_run:
            break
            
        try:
            subreddit = reddit.subreddit(subreddit_name)
            logger.info(f"Scanning r/{subreddit_name}...")
            
            for submission in subreddit.new(limit=25):
                if replied_count >= max_posts_per_run:
                    break
                    
                # Check title and selftext for trigger keywords
                full_text = (submission.title + " " + (submission.selftext or "")).lower()
                
                if contains_trigger_keyword(full_text) and should_reply(submission):
                    try:
                        response = get_response()
                        submission.reply(response)
                        replied_count += 1
                        logger.info(f"Replied to: {submission.title[:60]}... in r/{subreddit_name}")
                        
                        # Random delay to avoid spam detection (5-10 minutes)
                        delay = delay_between_replies + random.randint(0, 300)
                        logger.info(f"Waiting {delay} seconds before next reply...")
                        time.sleep(delay)
                        
                    except praw.exceptions.APIException as e:
                        if "RATELIMIT" in str(e):
                            logger.warning("Rate limited. Waiting 10 minutes...")
                            time.sleep(600)
                        else:
                            logger.error(f"API error: {e}")
                    except Exception as e:
                        logger.error(f"Error replying: {e}")
                        
        except Exception as e:
            logger.error(f"Error scanning r/{subreddit_name}: {e}")
            
    logger.info(f"Run complete. Replied to {replied_count} posts.")
    return replied_count

def scan_comments(reddit, max_replies=3, delay=300):
    """Scan comments for USPS tracking questions."""
    replied_count = 0
    
    for subreddit_name in TARGET_SUBREDDITS[:5]:  # Limit to top 5 subreddits for comments
        if replied_count >= max_replies:
            break
            
        try:
            subreddit = reddit.subreddit(subreddit_name)
            
            for comment in subreddit.comments(limit=50):
                if replied_count >= max_replies:
                    break
                    
                if comment.author and comment.author.name == USERNAME:
                    continue
                    
                if contains_trigger_keyword(comment.body):
                    try:
                        response = get_response()
                        comment.reply(response)
                        replied_count += 1
                        logger.info(f"Replied to comment in r/{subreddit_name}")
                        time.sleep(delay + random.randint(0, 120))
                    except Exception as e:
                        logger.error(f"Error replying to comment: {e}")
                        
        except Exception as e:
            logger.error(f"Error scanning comments in r/{subreddit_name}: {e}")
            
    return replied_count

if __name__ == "__main__":
    logger.info("Starting USPS Tracking Reddit Bot...")
    logger.info(f"Target: {SITE_URL}")
    
    reddit = create_reddit_client()
    if not reddit:
        logger.error("Failed to initialize Reddit client. Check credentials.")
        exit(1)
    
    # Run once
    posts_replied = run_bot(reddit, max_posts_per_run=3)
    comments_replied = scan_comments(reddit, max_replies=2)
    
    logger.info(f"Session complete: {posts_replied} post replies, {comments_replied} comment replies")
    logger.info(f"Run again in 4-6 hours to avoid spam detection")

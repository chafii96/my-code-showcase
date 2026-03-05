#!/usr/bin/env python3
"""
USPS Tracking — Twitter/X Social Signal Bot
Posts helpful USPS tracking content on Twitter/X to build brand awareness.

Requirements:
    pip install tweepy requests

Setup:
    1. Create a Twitter Developer App at https://developer.twitter.com
    2. Get API keys and fill them in below
    3. Run: python3 twitter_bot.py

IMPORTANT: Use responsibly. Twitter bans aggressive bots.
"""

import tweepy
import time
import random
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# ── Twitter API Credentials ───────────────────────────────────────────────────
API_KEY = "YOUR_TWITTER_API_KEY"
API_SECRET = "YOUR_TWITTER_API_SECRET"
ACCESS_TOKEN = "YOUR_TWITTER_ACCESS_TOKEN"
ACCESS_TOKEN_SECRET = "YOUR_TWITTER_ACCESS_TOKEN_SECRET"
BEARER_TOKEN = "YOUR_TWITTER_BEARER_TOKEN"

SITE_URL = "https://uspostaltracking.com"
SITE_NAME = "US Postal Tracking"

# ── Tweet Templates ───────────────────────────────────────────────────────────
EDUCATIONAL_TWEETS = [
    "🚨 USPS tracking not updating? Don't panic!\n\nPackages can go 2-5 days without a scan between major hubs. This is NORMAL.\n\nCheck your full tracking history: {site_url}\n\n#USPS #Shipping #Package",
    
    "📦 USPS tracking tip: 'In Transit' doesn't mean stuck.\n\nIt means your package is between scan points. Cross-country shipments can take 3-5 days between updates.\n\nTrack yours: {site_url}\n\n#USPS #Tracking",
    
    "❓ What does 'USPS In Transit to Next Facility' mean?\n\nYour package is on a truck or plane between distribution centers. No action needed — just wait!\n\nFull status guide: {site_url}/article/usps-tracking-number-format\n\n#USPS",
    
    "📬 USPS tracking says 'Delivered' but no package?\n\n1. Check with neighbors\n2. Look for a notice left card\n3. Wait 24 hours (sometimes scanned early)\n4. File a claim if still missing\n\nMore help: {site_url}\n\n#USPS #Package",
    
    "⏰ How long does USPS take?\n\n• Priority Mail: 1-3 days\n• Ground Advantage: 2-5 days\n• First Class: 1-5 days\n• Media Mail: 2-8 days\n\nTrack your package: {site_url}\n\n#USPS #Shipping",
    
    "🔍 USPS tracking number formats explained:\n\n• 9400... = Priority Mail\n• 9205... = First Class\n• 9270... = Priority Express\n• 9300... = Ground Advantage\n\nFull guide: {site_url}/article/usps-tracking-number-format\n\n#USPS",
    
    "📱 Did you know? You can track USPS packages via text!\n\nText your tracking number to 28777 (2USPS)\n\nOr use: {site_url} for detailed tracking\n\n#USPS #Shipping #Tracking",
    
    "🗓️ USPS holiday shipping deadlines 2026:\n\n• Ground Advantage: Dec 17\n• Priority Mail: Dec 19\n• Priority Express: Dec 22\n\nTrack your holiday packages: {site_url}\n\n#USPS #HolidayShipping",
    
    "💡 USPS Informed Delivery = game changer\n\nGet email previews of your mail BEFORE it arrives. Free to sign up at informeddelivery.usps.com\n\nFor package tracking: {site_url}\n\n#USPS #InformedDelivery",
    
    "📊 USPS delivers 21.8 million packages per day.\n\nWith that volume, tracking gaps are inevitable. Most packages that 'disappear' from tracking show up within 48 hours.\n\nTrack yours: {site_url}\n\n#USPS #Shipping",
]

REPLY_TEMPLATES = [
    "USPS tracking gaps are super common! Packages can go 2-4 days without a scan between hubs. Check the full history at {site_url} — it shows more detail than the USPS site. 📦",
    
    "Don't worry — 'In Transit' just means it's between scan points. Try {site_url} for a clearer breakdown of your tracking status. Usually resolves within 24-48 hours! 🚚",
    
    "That status usually means it's at a distribution center waiting to be sorted. Check {site_url} for more detail on what each USPS status code means. 📬",
    
    "File a Missing Mail search at missingmail.usps.com if it's been 7+ business days. Also try {site_url} for a more detailed tracking history. Hope it shows up! 🤞",
]

# Search queries to find people asking about USPS tracking
SEARCH_QUERIES = [
    "USPS tracking not updating",
    "USPS package stuck",
    "USPS tracking stopped",
    "where is my USPS package",
    "USPS says delivered no package",
    "USPS tracking not found",
    "USPS package delayed",
    "USPS in transit",
    "track USPS package",
    "USPS missing package",
]

def create_twitter_client():
    """Initialize the Twitter API client."""
    try:
        client = tweepy.Client(
            bearer_token=BEARER_TOKEN,
            consumer_key=API_KEY,
            consumer_secret=API_SECRET,
            access_token=ACCESS_TOKEN,
            access_token_secret=ACCESS_TOKEN_SECRET,
        )
        logger.info("Twitter client initialized successfully")
        return client
    except Exception as e:
        logger.error(f"Failed to create Twitter client: {e}")
        return None

def post_educational_tweet(client):
    """Post an educational tweet about USPS tracking."""
    tweet_text = random.choice(EDUCATIONAL_TWEETS).format(site_url=SITE_URL)
    
    try:
        response = client.create_tweet(text=tweet_text)
        logger.info(f"Posted tweet ID: {response.data['id']}")
        return response.data['id']
    except tweepy.errors.TweepyException as e:
        logger.error(f"Error posting tweet: {e}")
        return None

def search_and_reply(client, max_replies=5):
    """Search for USPS tracking questions and reply helpfully."""
    replied_count = 0
    replied_to = set()
    
    for query in SEARCH_QUERIES:
        if replied_count >= max_replies:
            break
            
        try:
            # Search recent tweets
            tweets = client.search_recent_tweets(
                query=f"{query} -is:retweet lang:en",
                max_results=10,
                tweet_fields=["author_id", "created_at", "text"],
            )
            
            if not tweets.data:
                continue
                
            for tweet in tweets.data:
                if replied_count >= max_replies:
                    break
                    
                if tweet.id in replied_to:
                    continue
                    
                # Don't reply to our own tweets
                if str(tweet.author_id) == str(client.get_me().data.id):
                    continue
                
                reply_text = random.choice(REPLY_TEMPLATES).format(site_url=SITE_URL)
                
                try:
                    response = client.create_tweet(
                        text=reply_text,
                        in_reply_to_tweet_id=tweet.id,
                    )
                    replied_to.add(tweet.id)
                    replied_count += 1
                    logger.info(f"Replied to tweet {tweet.id}: {tweet.text[:50]}...")
                    
                    # Wait 15-30 minutes between replies
                    delay = random.randint(900, 1800)
                    logger.info(f"Waiting {delay} seconds...")
                    time.sleep(delay)
                    
                except tweepy.errors.TweepyException as e:
                    if "duplicate" in str(e).lower():
                        logger.warning("Duplicate reply detected, skipping")
                    elif "rate limit" in str(e).lower():
                        logger.warning("Rate limited. Waiting 15 minutes...")
                        time.sleep(900)
                    else:
                        logger.error(f"Error replying: {e}")
                        
        except tweepy.errors.TweepyException as e:
            logger.error(f"Error searching for '{query}': {e}")
            time.sleep(60)
            
    return replied_count

def generate_tweet_schedule():
    """Generate a week's worth of scheduled tweets."""
    output_file = "twitter_schedule.txt"
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(f"# Twitter/X Tweet Schedule — Generated {datetime.now().strftime('%Y-%m-%d')}\n")
        f.write(f"# Site: {SITE_URL}\n")
        f.write("# Post 1-2 tweets per day for best results\n\n")
        
        for i, tweet in enumerate(EDUCATIONAL_TWEETS, 1):
            f.write(f"## Tweet {i}:\n")
            f.write(tweet.format(site_url=SITE_URL))
            f.write("\n\n" + "-"*60 + "\n\n")
    
    logger.info(f"Generated {len(EDUCATIONAL_TWEETS)} scheduled tweets in {output_file}")
    return output_file

if __name__ == "__main__":
    logger.info("USPS Tracking Twitter/X Bot")
    logger.info(f"Target site: {SITE_URL}")
    
    import sys
    
    if "--schedule" in sys.argv:
        # Generate tweet schedule file
        output = generate_tweet_schedule()
        logger.info(f"Tweet schedule saved to: {output}")
        
    elif "--auto" in sys.argv:
        # Run automated mode
        client = create_twitter_client()
        if not client:
            logger.error("Failed to initialize Twitter client. Check credentials.")
            exit(1)
        
        # Post one educational tweet
        tweet_id = post_educational_tweet(client)
        if tweet_id:
            logger.info(f"Posted educational tweet: {tweet_id}")
        
        # Wait 1 hour then search and reply
        logger.info("Waiting 1 hour before searching for replies...")
        time.sleep(3600)
        
        replies = search_and_reply(client, max_replies=3)
        logger.info(f"Session complete: 1 tweet posted, {replies} replies sent")
        
    else:
        # Default: generate schedule file
        output = generate_tweet_schedule()
        logger.info(f"Tweet schedule saved to: {output}")
        logger.info("Run with --auto flag for automated posting")
        logger.info("Run with --schedule flag to regenerate the schedule file")

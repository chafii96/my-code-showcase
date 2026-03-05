"""
YouTube SEO Automation Script
Generates optimized YouTube video descriptions, tags, and titles
to drive traffic to uspostaltracking.com

Requirements:
    pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib

Usage:
    python youtube_seo.py --mode generate   # Generate content templates
    python youtube_seo.py --mode upload     # Upload videos via API
    python youtube_seo.py --mode update     # Update existing video descriptions
"""

import json
import random
import argparse
import os
from datetime import datetime

# ─── CONFIGURATION ────────────────────────────────────────────────────────────
CONFIG = {
    "target_url": "https://uspostaltracking.com",
    "channel_id": os.environ.get("YOUTUBE_CHANNEL_ID", "YOUR_CHANNEL_ID"),
    "api_key": os.environ.get("YOUTUBE_API_KEY", "YOUR_API_KEY"),
    "client_secrets_file": "youtube_client_secrets.json",
}

# ─── VIDEO TEMPLATES ────────────────────────────────────────────────────────────
VIDEO_TEMPLATES = [
    {
        "title": "USPS Tracking Not Updating? Here's The Fix (2026)",
        "description": """Is your USPS tracking not updating? In this video, I'll show you exactly why USPS tracking stops updating and what you can do about it.

🔍 Track your USPS package here: https://uspostaltracking.com

TIMESTAMPS:
0:00 - Introduction
0:30 - Why USPS tracking stops updating
1:30 - How long it takes for tracking to update
2:30 - What to do if tracking hasn't updated in 3+ days
4:00 - How to contact USPS about your package
5:30 - When to file a missing mail search request

COMMON REASONS USPS TRACKING STOPS UPDATING:
• Package is between scan points
• USPS facility is experiencing high volume
• Package is in transit on a truck with no scanner
• Weather delays
• Holiday backlogs

For the most up-to-date USPS tracking information, visit: https://uspostaltracking.com

#USPSTracking #PackageTracking #USPS #ShippingHelp #TrackingNotUpdating""",
        "tags": ["USPS tracking", "USPS tracking not updating", "package tracking", "USPS", "track USPS package", "USPS package stuck", "shipping help", "USPS help", "track my package", "USPS status"],
        "category": "26",  # Howto & Style
    },
    {
        "title": "USPS Package Stuck In Transit? Watch This! (2026 Guide)",
        "description": """Is your USPS package stuck in transit? Don't panic! In this video, I explain exactly what "In Transit" means and what you should do.

🔍 Track your package now: https://uspostaltracking.com

WHAT "IN TRANSIT" MEANS:
Your package is moving through the USPS network between facilities. This is completely normal!

HOW LONG SHOULD IT TAKE?
• First Class Mail: 1-5 days
• Priority Mail: 1-3 days  
• Ground Advantage: 2-5 days
• Media Mail: 2-8 days

WHEN TO WORRY:
• First Class: More than 7 days with no update
• Priority Mail: More than 5 days with no update
• Ground Advantage: More than 8 days with no update

WHAT TO DO:
1. Wait 24-48 hours for an update
2. Check uspostaltracking.com for detailed tracking
3. Contact USPS if no update after 7 days
4. File a Missing Mail search if needed

Free USPS tracking tool: https://uspostaltracking.com

#USPS #PackageTracking #USPSTracking #InTransit #ShippingHelp""",
        "tags": ["USPS package stuck in transit", "USPS in transit", "package stuck", "USPS tracking", "USPS help", "package tracking", "USPS delivery", "shipping help", "track USPS", "USPS status"],
        "category": "26",
    },
    {
        "title": "USPS Says Delivered But No Package? Do This NOW (2026)",
        "description": """USPS tracking says your package was delivered but you didn't receive it? This happens more often than you think. Here's exactly what to do.

🔍 Check your tracking details: https://uspostaltracking.com

STEP-BY-STEP GUIDE:
1. Check around your property (porch, garage, mailbox)
2. Ask neighbors if they received it by mistake
3. Check with other household members
4. Wait 24 hours (sometimes carriers mark delivered early)
5. Contact your local post office
6. File a missing mail search request
7. File an insurance claim if applicable

IMPORTANT TIPS:
• Take photos of your delivery area
• Get the GPS coordinates from the carrier
• Request a package intercept if still in transit

For detailed tracking history: https://uspostaltracking.com

#USPS #PackageDelivered #MissingPackage #USPSTracking #ShippingHelp #PackageTracking""",
        "tags": ["USPS says delivered but no package", "USPS delivered not received", "missing package", "USPS tracking", "package not delivered", "USPS help", "stolen package", "USPS claim", "track USPS package", "USPS delivered"],
        "category": "26",
    },
    {
        "title": "How to Track a USPS Package Step by Step (Free Tool 2026)",
        "description": """Learn how to track any USPS package in just 30 seconds using our free tracking tool!

🔍 Track your package now: https://uspostaltracking.com

WHAT YOU'LL LEARN:
• How to find your USPS tracking number
• How to track USPS Priority Mail
• How to track USPS First Class packages
• How to track USPS Ground Advantage
• How to understand USPS tracking statuses
• How to set up delivery notifications

WHERE TO FIND YOUR TRACKING NUMBER:
• Shipping confirmation email
• USPS receipt
• Package label
• Seller's order page

USPS TRACKING NUMBER FORMATS:
• 22 digits: Standard tracking
• 9400 prefix: Priority Mail
• 9205 prefix: Certified Mail
• 9407 prefix: Registered Mail

Free USPS tracking: https://uspostaltracking.com

#USPSTracking #TrackUSPS #PackageTracking #USPS #HowToTrack #ShippingGuide""",
        "tags": ["how to track USPS package", "USPS tracking", "track USPS package", "USPS tracking number", "package tracking", "USPS", "track my package", "USPS tracking guide", "free USPS tracking", "USPS tracking tool"],
        "category": "26",
    },
    {
        "title": "USPS Informed Delivery Setup Guide 2026 (Free Mail Preview)",
        "description": """Set up USPS Informed Delivery for FREE to see photos of your incoming mail and track packages automatically!

🔍 Track packages now: https://uspostaltracking.com
📧 Sign up for Informed Delivery: https://informeddelivery.usps.com

WHAT IS INFORMED DELIVERY?
USPS Informed Delivery is a free service that sends you daily email digests with grayscale images of the letter-sized mail pieces you'll be receiving that day.

BENEFITS:
✅ See photos of incoming mail before it arrives
✅ Track packages automatically
✅ Get delivery notifications
✅ Access 7 days of mail history
✅ Manage deliveries online

HOW TO SET UP:
1. Go to informeddelivery.usps.com
2. Create a USPS.com account
3. Verify your identity
4. Start receiving daily digests

For real-time package tracking: https://uspostaltracking.com

#USPSInformedDelivery #USPS #MailTracking #PackageTracking #USPSTracking #FreeService""",
        "tags": ["USPS Informed Delivery", "USPS informed delivery setup", "USPS mail preview", "USPS tracking", "informed delivery", "USPS notifications", "track mail", "USPS service", "mail tracking", "USPS free service"],
        "category": "26",
    },
]

# ─── YOUTUBE API CLIENT ────────────────────────────────────────────────────────
class YouTubeSEOBot:
    def __init__(self, api_key: str = None, credentials_file: str = None):
        self.api_key = api_key
        self.credentials_file = credentials_file
        self.youtube = None
        self.actions_log = []

    def authenticate(self):
        """Authenticate with YouTube Data API v3"""
        try:
            from googleapiclient.discovery import build
            from google_auth_oauthlib.flow import InstalledAppFlow
            from google.auth.transport.requests import Request
            import pickle

            SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]
            creds = None

            if os.path.exists("youtube_token.pickle"):
                with open("youtube_token.pickle", "rb") as token:
                    creds = pickle.load(token)

            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    flow = InstalledAppFlow.from_client_secrets_file(self.credentials_file, SCOPES)
                    creds = flow.run_local_server(port=0)
                with open("youtube_token.pickle", "wb") as token:
                    pickle.dump(creds, token)

            self.youtube = build("youtube", "v3", credentials=creds)
            print("[SUCCESS] Authenticated with YouTube API")
            return True
        except Exception as e:
            print(f"[ERROR] Authentication failed: {e}")
            return False

    def update_video_description(self, video_id: str, title: str, description: str, tags: list, category_id: str = "26") -> dict:
        """Update an existing video's metadata"""
        if not self.youtube:
            print("[ERROR] Not authenticated")
            return {}

        try:
            request = self.youtube.videos().update(
                part="snippet",
                body={
                    "id": video_id,
                    "snippet": {
                        "title": title,
                        "description": description,
                        "tags": tags,
                        "categoryId": category_id,
                    },
                },
            )
            response = request.execute()
            print(f"[SUCCESS] Updated video: {title[:50]}")
            self.log_action("update_video", video_id, title[:50])
            return response
        except Exception as e:
            print(f"[ERROR] Failed to update video {video_id}: {e}")
            return {}

    def add_comment(self, video_id: str, comment: str) -> dict:
        """Add a comment to a video"""
        if not self.youtube:
            return {}

        try:
            request = self.youtube.commentThreads().insert(
                part="snippet",
                body={
                    "snippet": {
                        "videoId": video_id,
                        "topLevelComment": {
                            "snippet": {
                                "textOriginal": comment,
                            },
                        },
                    },
                },
            )
            response = request.execute()
            print(f"[SUCCESS] Added comment to video {video_id}")
            self.log_action("add_comment", video_id, comment[:50])
            return response
        except Exception as e:
            print(f"[ERROR] Failed to add comment to {video_id}: {e}")
            return {}

    def generate_templates(self, output_file: str = "youtube_templates.json"):
        """Generate all video templates and save to file"""
        templates = []
        for template in VIDEO_TEMPLATES:
            templates.append({
                "title": template["title"],
                "description": template["description"],
                "tags": template["tags"],
                "category": template["category"],
                "target_url": CONFIG["target_url"],
                "generated_at": datetime.now().isoformat(),
            })

        with open(output_file, "w") as f:
            json.dump(templates, f, indent=2)

        print(f"[SUCCESS] Generated {len(templates)} video templates -> {output_file}")
        return templates

    def print_templates(self):
        """Print all templates to console for manual use"""
        for i, template in enumerate(VIDEO_TEMPLATES, 1):
            print(f"\n{'='*60}")
            print(f"VIDEO {i}: {template['title']}")
            print(f"{'='*60}")
            print(f"\nTITLE:\n{template['title']}")
            print(f"\nDESCRIPTION:\n{template['description'][:500]}...")
            print(f"\nTAGS:\n{', '.join(template['tags'])}")
            print(f"\nCATEGORY ID: {template['category']}")

    def log_action(self, action_type: str, url: str, content: str):
        self.actions_log.append({
            "timestamp": datetime.now().isoformat(),
            "action": action_type,
            "url": url,
            "content": content,
        })

    def save_log(self, filename: str = "youtube_bot_log.json"):
        with open(filename, "w") as f:
            json.dump(self.actions_log, f, indent=2)
        print(f"[INFO] Log saved to {filename}")


# ─── MAIN ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="YouTube SEO Automation Script")
    parser.add_argument("--mode", choices=["generate", "print", "update", "comment"], default="generate")
    parser.add_argument("--video-id", type=str, default=None)
    parser.add_argument("--output", type=str, default="youtube_templates.json")
    args = parser.parse_args()

    print(f"""
╔══════════════════════════════════════════════════════╗
║        YouTube SEO Automation Bot v2.0               ║
║        Target: {CONFIG['target_url']:<37}║
║        Mode: {args.mode:<41}║
╚══════════════════════════════════════════════════════╝
    """)

    bot = YouTubeSEOBot(
        api_key=CONFIG["api_key"],
        credentials_file=CONFIG["client_secrets_file"],
    )

    if args.mode == "generate":
        templates = bot.generate_templates(args.output)
        print(f"\n[INFO] {len(templates)} templates saved to {args.output}")
        print("[INFO] Use these templates to manually create or update YouTube videos")

    elif args.mode == "print":
        bot.print_templates()

    elif args.mode == "update":
        if not args.video_id:
            print("[ERROR] Please provide --video-id")
        else:
            if bot.authenticate():
                template = random.choice(VIDEO_TEMPLATES)
                bot.update_video_description(
                    args.video_id,
                    template["title"],
                    template["description"],
                    template["tags"],
                    template["category"],
                )

    elif args.mode == "comment":
        if not args.video_id:
            print("[ERROR] Please provide --video-id")
        else:
            if bot.authenticate():
                comments = [
                    f"Great video! I also found this free USPS tracking tool really helpful: {CONFIG['target_url']}",
                    f"Thanks for the info! For anyone who needs to track their USPS package, check out {CONFIG['target_url']} - it's free and shows more detail than the USPS website.",
                    f"This helped me so much! I've been using {CONFIG['target_url']} to track my packages and it's way better than the official USPS site.",
                ]
                bot.add_comment(args.video_id, random.choice(comments))

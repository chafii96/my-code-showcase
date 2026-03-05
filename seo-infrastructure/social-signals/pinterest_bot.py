"""
Pinterest Social Signal Automation Bot
Creates pins linking back to uspostaltracking.com for social signals and referral traffic

Requirements:
    pip install requests

Pinterest API v5 Documentation: https://developers.pinterest.com/docs/api/v5/

Usage:
    python pinterest_bot.py --mode pin --count 20
    python pinterest_bot.py --mode board --count 5
"""

import requests
import json
import time
import random
import argparse
import os
from datetime import datetime

# ─── CONFIGURATION ────────────────────────────────────────────────────────────
CONFIG = {
    "target_url": "https://uspostaltracking.com",
    "access_token": os.environ.get("PINTEREST_ACCESS_TOKEN", "YOUR_PINTEREST_ACCESS_TOKEN"),
    "board_id": os.environ.get("PINTEREST_BOARD_ID", "YOUR_BOARD_ID"),
    "target_pages": [
        {"url": "https://uspostaltracking.com", "title": "Free USPS Package Tracking Tool 2026", "description": "Track any USPS package instantly with our free tracking tool. Real-time updates, delivery estimates, and status explanations for all USPS services."},
        {"url": "https://uspostaltracking.com/article/usps-tracking-not-updating", "title": "USPS Tracking Not Updating? Here's Why & How to Fix It", "description": "If your USPS tracking hasn't updated in days, here are the top reasons why and step-by-step solutions to find your package."},
        {"url": "https://uspostaltracking.com/article/usps-package-stuck-in-transit", "title": "USPS Package Stuck in Transit — Complete Fix Guide", "description": "Is your USPS package stuck in transit? Learn exactly what this means and what you can do to locate your package."},
        {"url": "https://uspostaltracking.com/article/usps-delivered-not-received", "title": "USPS Says Delivered But No Package? Do This Now", "description": "USPS tracking shows delivered but you didn't receive your package? Follow these steps to locate it or file a claim."},
        {"url": "https://uspostaltracking.com/article/usps-priority-mail-tracking", "title": "USPS Priority Mail Tracking — Everything You Need to Know", "description": "Complete guide to tracking USPS Priority Mail packages. Understand all status messages and delivery timeframes."},
        {"url": "https://uspostaltracking.com/article/usps-missing-package", "title": "How to Find a Missing USPS Package (Step-by-Step)", "description": "Missing USPS package? Here's exactly how to file a Missing Mail search request and get your package found."},
        {"url": "https://uspostaltracking.com/article/usps-informed-delivery", "title": "USPS Informed Delivery — Free Mail Preview Service", "description": "Learn how to set up USPS Informed Delivery to see photos of your incoming mail and track packages automatically."},
        {"url": "https://uspostaltracking.com/article/usps-estimated-delivery-date", "title": "Understanding USPS Estimated Delivery Dates", "description": "How accurate are USPS estimated delivery dates? Learn what factors affect delivery timing and how to get better estimates."},
        {"url": "https://uspostaltracking.com/article/usps-ground-advantage-tracking", "title": "USPS Ground Advantage Tracking Guide 2026", "description": "Everything you need to know about tracking USPS Ground Advantage packages, including delivery times and status meanings."},
        {"url": "https://uspostaltracking.com/article/usps-certified-mail-tracking", "title": "USPS Certified Mail Tracking — How It Works", "description": "Complete guide to USPS Certified Mail tracking. Learn how to track, what the statuses mean, and how to get proof of delivery."},
    ],
    # Pinterest boards to create
    "boards_to_create": [
        {"name": "USPS Tracking Tips & Guides", "description": "Helpful guides for tracking USPS packages, understanding tracking statuses, and resolving shipping issues."},
        {"name": "Package Tracking Help", "description": "Tips and resources for tracking packages with USPS, UPS, FedEx, and other carriers."},
        {"name": "USPS Shipping Guide", "description": "Everything you need to know about shipping with USPS — rates, tracking, and delivery times."},
        {"name": "Online Shopping Tips", "description": "Tips for tracking your online orders and dealing with shipping issues."},
        {"name": "Mail & Shipping Resources", "description": "Helpful resources for sending and receiving mail and packages in the United States."},
    ],
    "delay_min": 10,
    "delay_max": 30,
}

# ─── PIN IMAGES (use free stock images) ────────────────────────────────────────
PIN_IMAGES = [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600",  # Package
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",  # Delivery
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600",  # Box
    "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=600",  # Mail
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600",  # Shipping
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600",  # Packages
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600",  # Handshake/delivery
    "https://images.unsplash.com/photo-1612103198005-b238154f4590?w=600",  # Post office
]

# ─── PINTEREST API CLIENT ──────────────────────────────────────────────────────
class PinterestBot:
    def __init__(self, access_token: str):
        self.token = access_token
        self.base_url = "https://api.pinterest.com/v5"
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        self.actions_log = []

    def get_boards(self) -> list:
        """Get all boards for the authenticated user"""
        response = requests.get(f"{self.base_url}/boards", headers=self.headers)
        if response.status_code == 200:
            return response.json().get("items", [])
        return []

    def create_board(self, name: str, description: str = "", privacy: str = "PUBLIC") -> dict:
        """Create a new Pinterest board"""
        data = {
            "name": name,
            "description": description,
            "privacy": privacy,
        }
        response = requests.post(f"{self.base_url}/boards", headers=self.headers, json=data)
        result = response.json()
        if "id" in result:
            print(f"[SUCCESS] Created board: {name} (ID: {result['id']})")
            self.log_action("create_board", name, description[:50])
        else:
            print(f"[FAIL] Failed to create board: {name} - {result}")
        return result

    def create_pin(self, board_id: str, title: str, description: str, link: str, image_url: str) -> dict:
        """Create a new pin on a board"""
        data = {
            "board_id": board_id,
            "title": title,
            "description": description,
            "link": link,
            "media_source": {
                "source_type": "image_url",
                "url": image_url,
            },
        }
        response = requests.post(f"{self.base_url}/pins", headers=self.headers, json=data)
        result = response.json()
        if "id" in result:
            print(f"[SUCCESS] Created pin: {title[:50]} -> {link}")
            self.log_action("create_pin", link, title[:50])
        else:
            print(f"[FAIL] Failed to create pin: {title[:50]} - {result}")
        return result

    def run_pin_campaign(self, board_id: str, count: int = 20):
        """Create multiple pins for SEO signal campaign"""
        print(f"\n[INFO] Starting pin campaign: {count} pins on board {board_id}")
        pins_created = 0

        for i in range(count):
            # Cycle through target pages
            page = CONFIG["target_pages"][i % len(CONFIG["target_pages"])]
            image_url = random.choice(PIN_IMAGES)

            result = self.create_pin(
                board_id=board_id,
                title=page["title"],
                description=page["description"],
                link=page["url"],
                image_url=image_url,
            )

            if "id" in result:
                pins_created += 1

            delay = random.uniform(CONFIG["delay_min"], CONFIG["delay_max"])
            print(f"[INFO] Waiting {delay:.0f}s before next pin...")
            time.sleep(delay)

        print(f"\n[COMPLETE] Created {pins_created}/{count} pins")
        return pins_created

    def run_board_campaign(self):
        """Create all SEO boards"""
        boards_created = []
        for board_config in CONFIG["boards_to_create"]:
            result = self.create_board(board_config["name"], board_config["description"])
            if "id" in result:
                boards_created.append(result["id"])
            time.sleep(random.uniform(5, 15))
        return boards_created

    def run_full_campaign(self, count: int = 50):
        """Run complete Pinterest SEO campaign"""
        print("[INFO] Starting full Pinterest SEO campaign...")

        # Step 1: Create boards
        print("\n[STEP 1] Creating SEO boards...")
        board_ids = self.run_board_campaign()

        if not board_ids:
            # Use existing board
            boards = self.get_boards()
            if boards:
                board_ids = [boards[0]["id"]]
            else:
                print("[ERROR] No boards available. Please create a board first.")
                return

        # Step 2: Create pins on all boards
        print(f"\n[STEP 2] Creating {count} pins across {len(board_ids)} boards...")
        pins_per_board = count // len(board_ids)
        for board_id in board_ids:
            self.run_pin_campaign(board_id, pins_per_board)

        self.save_log()
        print(f"\n[COMPLETE] Pinterest campaign finished!")

    def log_action(self, action_type: str, url: str, content: str):
        self.actions_log.append({
            "timestamp": datetime.now().isoformat(),
            "action": action_type,
            "url": url,
            "content": content,
        })

    def save_log(self, filename: str = "pinterest_bot_log.json"):
        with open(filename, "w") as f:
            json.dump(self.actions_log, f, indent=2)
        print(f"[INFO] Log saved to {filename}")


# ─── MAIN ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pinterest Social Signal Bot")
    parser.add_argument("--mode", choices=["pin", "board", "full"], default="full")
    parser.add_argument("--count", type=int, default=50)
    parser.add_argument("--board-id", type=str, default=None)
    args = parser.parse_args()

    print(f"""
╔══════════════════════════════════════════════════════╗
║        Pinterest Social Signal Bot v2.0              ║
║        Target: {CONFIG['target_url']:<37}║
║        Mode: {args.mode:<41}║
║        Count: {args.count:<40}║
╚══════════════════════════════════════════════════════╝
    """)

    bot = PinterestBot(CONFIG["access_token"])

    if args.mode == "pin":
        board_id = args.board_id or CONFIG["board_id"]
        bot.run_pin_campaign(board_id, args.count)
    elif args.mode == "board":
        bot.run_board_campaign()
    elif args.mode == "full":
        bot.run_full_campaign(args.count)

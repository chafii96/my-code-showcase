"""
Facebook Social Signal Automation Bot
Automates Facebook engagement to boost social signals for SEO
Uses Selenium with undetected-chromedriver for stealth operation

Requirements:
    pip install selenium undetected-chromedriver requests

Usage:
    python facebook_bot.py --mode post --count 10
    python facebook_bot.py --mode share --count 5
    python facebook_bot.py --mode group --count 20
"""

import time
import random
import argparse
import json
import os
from datetime import datetime

# ─── CONFIGURATION ────────────────────────────────────────────────────────────
CONFIG = {
    "target_url": "https://uspostaltracking.com",
    "target_pages": [
        "https://uspostaltracking.com",
        "https://uspostaltracking.com/article/usps-tracking-not-updating",
        "https://uspostaltracking.com/article/usps-package-stuck-in-transit",
        "https://uspostaltracking.com/article/usps-delivered-not-received",
        "https://uspostaltracking.com/article/usps-missing-package",
        "https://uspostaltracking.com/article/usps-priority-mail-tracking",
        "https://uspostaltracking.com/article/usps-first-class-tracking",
        "https://uspostaltracking.com/article/usps-ground-advantage-tracking",
        "https://uspostaltracking.com/article/usps-estimated-delivery-date",
        "https://uspostaltracking.com/article/usps-informed-delivery",
    ],
    # Facebook Groups related to shipping/packages
    "target_groups": [
        "https://www.facebook.com/groups/uspsshipping",
        "https://www.facebook.com/groups/packagetracking",
        "https://www.facebook.com/groups/shippinghelp",
        "https://www.facebook.com/groups/onlineshopping",
        "https://www.facebook.com/groups/ebaysellers",
        "https://www.facebook.com/groups/etsysellers",
        "https://www.facebook.com/groups/amazonbuyers",
        "https://www.facebook.com/groups/shippingadvice",
    ],
    # Facebook Pages to post on
    "target_pages_fb": [
        "https://www.facebook.com/USPS",
        "https://www.facebook.com/shippingadvice",
    ],
    # Accounts (add your Facebook accounts here)
    "accounts": [
        {"email": "account1@gmail.com", "password": "password1"},
        {"email": "account2@gmail.com", "password": "password2"},
        # Add more accounts for rotation
    ],
    # Proxies for IP rotation
    "proxies": [
        "http://user:pass@proxy1:port",
        "http://user:pass@proxy2:port",
        # Add residential proxies here
    ],
    "delay_min": 30,   # Minimum delay between actions (seconds)
    "delay_max": 120,  # Maximum delay between actions (seconds)
}

# ─── POST TEMPLATES ────────────────────────────────────────────────────────────
POST_TEMPLATES = [
    "Has anyone else had issues with USPS tracking not updating? I found this really helpful guide: {url} - it explains exactly what to do when your package seems stuck.",
    "Just used this free USPS tracking tool and it's way better than the official USPS website! Check it out: {url} - shows all tracking events in real-time.",
    "My USPS package was showing 'In Transit' for 5 days and I was worried. Found this guide {url} that explained everything - turned out it was totally normal for Priority Mail.",
    "If you're waiting on a USPS package and the tracking isn't updating, this site helped me understand what was happening: {url}",
    "Great resource for USPS tracking issues - {url} - especially helpful if you're getting the 'out for delivery' status but haven't received your package yet.",
    "Anyone know why USPS tracking shows 'Available for Pickup' when I didn't request that? Found the answer here: {url}",
    "USPS delivered my package to the wrong address. This guide helped me file a claim: {url} - got my money back!",
    "Tip for online sellers: Use {url} to track all your USPS shipments in one place. Much better than checking each one individually on the USPS site.",
    "My USPS package said 'Delivered' but wasn't there. This article saved me: {url} - explains exactly what to do step by step.",
    "For anyone shipping with USPS Ground Advantage - this tracking guide is super helpful: {url} - explains all the status messages.",
]

COMMENT_TEMPLATES = [
    "I had the same issue! This site helped me: {url} - explains all the USPS tracking statuses.",
    "Try {url} - it's a free USPS tracking tool that gives more detail than the official site.",
    "This happened to me too. Check out {url} for a detailed explanation of what each USPS status means.",
    "I use {url} to track all my USPS packages. Much clearer than the official USPS website.",
    "Same thing happened to me! Found the answer at {url} - turned out my package was just delayed at the distribution center.",
]

# ─── MAIN BOT CLASS ────────────────────────────────────────────────────────────
class FacebookBot:
    def __init__(self, headless: bool = True, proxy: str = None):
        self.headless = headless
        self.proxy = proxy
        self.driver = None
        self.logged_in = False
        self.actions_log = []

    def setup_driver(self):
        """Setup undetected Chrome driver"""
        try:
            import undetected_chromedriver as uc
            options = uc.ChromeOptions()
            if self.headless:
                options.add_argument("--headless=new")
            if self.proxy:
                options.add_argument(f"--proxy-server={self.proxy}")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--window-size=1920,1080")
            # Random user agent
            user_agents = [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
            ]
            options.add_argument(f"--user-agent={random.choice(user_agents)}")
            self.driver = uc.Chrome(options=options)
            return True
        except ImportError:
            print("[ERROR] undetected-chromedriver not installed. Run: pip install undetected-chromedriver")
            return False
        except Exception as e:
            print(f"[ERROR] Failed to setup driver: {e}")
            return False

    def login(self, email: str, password: str) -> bool:
        """Login to Facebook"""
        try:
            from selenium.webdriver.common.by import By
            from selenium.webdriver.support.ui import WebDriverWait
            from selenium.webdriver.support import expected_conditions as EC

            self.driver.get("https://www.facebook.com/login")
            time.sleep(random.uniform(2, 4))

            # Enter email
            email_field = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            self._human_type(email_field, email)
            time.sleep(random.uniform(0.5, 1.5))

            # Enter password
            pass_field = self.driver.find_element(By.ID, "pass")
            self._human_type(pass_field, password)
            time.sleep(random.uniform(0.5, 1.5))

            # Click login
            pass_field.submit()
            time.sleep(random.uniform(3, 6))

            # Check if logged in
            if "facebook.com/home" in self.driver.current_url or "facebook.com/?sk" in self.driver.current_url:
                self.logged_in = True
                print(f"[SUCCESS] Logged in as {email}")
                return True
            else:
                print(f"[FAIL] Login failed for {email}")
                return False
        except Exception as e:
            print(f"[ERROR] Login error: {e}")
            return False

    def _human_type(self, element, text: str):
        """Type text with human-like delays"""
        for char in text:
            element.send_keys(char)
            time.sleep(random.uniform(0.05, 0.15))

    def post_to_group(self, group_url: str, post_text: str) -> bool:
        """Post to a Facebook group"""
        try:
            from selenium.webdriver.common.by import By
            from selenium.webdriver.support.ui import WebDriverWait
            from selenium.webdriver.support import expected_conditions as EC

            self.driver.get(group_url)
            time.sleep(random.uniform(3, 6))

            # Find the post box
            post_box = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), \"Write something\")]"))
            )
            post_box.click()
            time.sleep(random.uniform(1, 2))

            # Type the post
            active_element = self.driver.switch_to.active_element
            self._human_type(active_element, post_text)
            time.sleep(random.uniform(1, 3))

            # Click Post button
            post_btn = self.driver.find_element(By.XPATH, "//div[@aria-label='Post']")
            post_btn.click()
            time.sleep(random.uniform(2, 4))

            self.log_action("group_post", group_url, post_text[:50])
            print(f"[SUCCESS] Posted to group: {group_url}")
            return True
        except Exception as e:
            print(f"[ERROR] Failed to post to group {group_url}: {e}")
            return False

    def share_url(self, url: str, message: str = "") -> bool:
        """Share a URL on Facebook timeline"""
        try:
            from selenium.webdriver.common.by import By
            from selenium.webdriver.support.ui import WebDriverWait
            from selenium.webdriver.support import expected_conditions as EC

            # Use Facebook sharer
            share_url = f"https://www.facebook.com/sharer/sharer.php?u={url}"
            self.driver.get(share_url)
            time.sleep(random.uniform(3, 5))

            if message:
                try:
                    msg_box = self.driver.find_element(By.XPATH, "//div[@data-testid='share-dialog-textarea']")
                    self._human_type(msg_box, message)
                    time.sleep(random.uniform(1, 2))
                except:
                    pass

            # Click share button
            try:
                share_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Post to Facebook')]")
                share_btn.click()
                time.sleep(random.uniform(2, 4))
                self.log_action("share", url, message[:50] if message else "")
                print(f"[SUCCESS] Shared URL: {url}")
                return True
            except:
                print(f"[FAIL] Could not find share button for: {url}")
                return False
        except Exception as e:
            print(f"[ERROR] Failed to share {url}: {e}")
            return False

    def like_and_comment(self, post_url: str, comment: str) -> bool:
        """Like and comment on a post"""
        try:
            from selenium.webdriver.common.by import By
            from selenium.webdriver.support.ui import WebDriverWait
            from selenium.webdriver.support import expected_conditions as EC

            self.driver.get(post_url)
            time.sleep(random.uniform(3, 6))

            # Like the post
            try:
                like_btn = self.driver.find_element(By.XPATH, "//div[@aria-label='Like']")
                like_btn.click()
                time.sleep(random.uniform(1, 2))
            except:
                pass

            # Comment on the post
            try:
                comment_box = self.driver.find_element(By.XPATH, "//div[@aria-label='Write a comment…']")
                comment_box.click()
                time.sleep(random.uniform(0.5, 1))
                self._human_type(comment_box, comment)
                time.sleep(random.uniform(1, 2))

                from selenium.webdriver.common.keys import Keys
                comment_box.send_keys(Keys.RETURN)
                time.sleep(random.uniform(2, 4))

                self.log_action("comment", post_url, comment[:50])
                print(f"[SUCCESS] Commented on: {post_url}")
                return True
            except Exception as e:
                print(f"[FAIL] Could not comment: {e}")
                return False
        except Exception as e:
            print(f"[ERROR] Failed to engage with post {post_url}: {e}")
            return False

    def log_action(self, action_type: str, url: str, content: str):
        """Log all actions for tracking"""
        self.actions_log.append({
            "timestamp": datetime.now().isoformat(),
            "action": action_type,
            "url": url,
            "content": content,
        })

    def save_log(self, filename: str = "facebook_bot_log.json"):
        """Save action log to file"""
        with open(filename, "w") as f:
            json.dump(self.actions_log, f, indent=2)
        print(f"[INFO] Log saved to {filename}")

    def run_campaign(self, mode: str = "post", count: int = 10):
        """Run a full social signal campaign"""
        if not self.setup_driver():
            return

        # Select random account
        account = random.choice(CONFIG["accounts"])
        if not self.login(account["email"], account["password"]):
            print("[ERROR] Login failed. Exiting.")
            self.driver.quit()
            return

        actions_done = 0

        if mode == "post":
            # Post to groups
            for group_url in CONFIG["target_groups"]:
                if actions_done >= count:
                    break
                target_page = random.choice(CONFIG["target_pages"])
                post_text = random.choice(POST_TEMPLATES).format(url=target_page)
                if self.post_to_group(group_url, post_text):
                    actions_done += 1
                delay = random.uniform(CONFIG["delay_min"], CONFIG["delay_max"])
                print(f"[INFO] Waiting {delay:.0f}s before next action...")
                time.sleep(delay)

        elif mode == "share":
            # Share pages
            for _ in range(count):
                target_page = random.choice(CONFIG["target_pages"])
                message = random.choice(POST_TEMPLATES).format(url=target_page)
                if self.share_url(target_page, message):
                    actions_done += 1
                delay = random.uniform(CONFIG["delay_min"], CONFIG["delay_max"])
                time.sleep(delay)

        print(f"\n[COMPLETE] Campaign finished. {actions_done}/{count} actions completed.")
        self.save_log()
        self.driver.quit()


# ─── FACEBOOK GRAPH API APPROACH (No Browser Needed) ──────────────────────────
class FacebookGraphAPIBot:
    """
    Uses Facebook Graph API for social signals
    Requires: Facebook App ID, App Secret, and Page Access Token
    Get tokens at: https://developers.facebook.com/
    """

    def __init__(self, page_access_token: str, page_id: str):
        self.token = page_access_token
        self.page_id = page_id
        self.base_url = "https://graph.facebook.com/v18.0"

    def post_to_page(self, message: str, link: str = None) -> dict:
        """Post to Facebook Page via Graph API"""
        import requests
        url = f"{self.base_url}/{self.page_id}/feed"
        data = {
            "message": message,
            "access_token": self.token,
        }
        if link:
            data["link"] = link

        response = requests.post(url, data=data)
        return response.json()

    def run_page_campaign(self, count: int = 10):
        """Run posting campaign via Graph API"""
        import requests
        results = []
        for i in range(count):
            target_page = random.choice(CONFIG["target_pages"])
            message = random.choice(POST_TEMPLATES).format(url=target_page)
            result = self.post_to_page(message, target_page)
            results.append(result)
            print(f"[{i+1}/{count}] Posted: {result}")
            time.sleep(random.uniform(300, 600))  # 5-10 min between posts

        return results


# ─── MAIN ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Facebook Social Signal Bot")
    parser.add_argument("--mode", choices=["post", "share", "comment", "api"], default="post")
    parser.add_argument("--count", type=int, default=10)
    parser.add_argument("--headless", action="store_true", default=True)
    parser.add_argument("--proxy", type=str, default=None)
    args = parser.parse_args()

    print(f"""
╔══════════════════════════════════════════════════════╗
║        Facebook Social Signal Bot v2.0               ║
║        Target: {CONFIG['target_url']:<37}║
║        Mode: {args.mode:<41}║
║        Count: {args.count:<40}║
╚══════════════════════════════════════════════════════╝
    """)

    if args.mode == "api":
        # Use Graph API (requires tokens)
        PAGE_ACCESS_TOKEN = os.environ.get("FB_PAGE_TOKEN", "YOUR_PAGE_ACCESS_TOKEN")
        PAGE_ID = os.environ.get("FB_PAGE_ID", "YOUR_PAGE_ID")
        bot = FacebookGraphAPIBot(PAGE_ACCESS_TOKEN, PAGE_ID)
        bot.run_page_campaign(args.count)
    else:
        # Use browser automation
        proxy = args.proxy or (random.choice(CONFIG["proxies"]) if CONFIG["proxies"][0] != "http://user:pass@proxy1:port" else None)
        bot = FacebookBot(headless=args.headless, proxy=proxy)
        bot.run_campaign(mode=args.mode, count=args.count)

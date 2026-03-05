/**
 * SEO Monitoring & Rank Tracking Automation
 * Monitors: Rankings, Backlinks, Traffic, Competitor movements
 * Sends alerts via Telegram when significant changes detected
 * 
 * Usage: node scripts/seo-monitor.js
 * Schedule: Run daily via cron: 0 8 * * * node /path/to/seo-monitor.js
 */

const https = require("https");
const fs = require("fs");

// ── Configuration ──
const CONFIG = {
  site: "uspostaltracking.com",
  targetKeywords: [
    "usps tracking",
    "usps package tracking",
    "track usps package",
    "usps tracking not updating",
    "usps package stuck in transit",
    "usps tracking number",
    "free usps tracking",
    "usps delivery status",
    "usps priority mail tracking",
    "usps certified mail tracking",
    "usps ground advantage tracking",
    "usps international tracking",
    "usps tracking number format",
    "usps tracking shows delivered but no package",
  ],
  competitors: [
    "parcelsapp.com",
    "packagetrackr.com",
    "17track.net",
    "aftership.com",
    "shippo.com",
  ],
  alertThresholds: {
    rankingDrop: 5,      // Alert if ranking drops by 5+ positions
    trafficDrop: 20,     // Alert if traffic drops by 20%+
    newBacklinks: 10,    // Alert if 10+ new backlinks detected
    lostBacklinks: 5,    // Alert if 5+ backlinks lost
  },
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN",
  telegramChatId: process.env.TELEGRAM_CHAT_ID || "YOUR_CHAT_ID",
  dataFile: "./seo-data/rankings.json",
};

// ── Load previous data ──
function loadPreviousData() {
  try {
    if (fs.existsSync(CONFIG.dataFile)) {
      return JSON.parse(fs.readFileSync(CONFIG.dataFile, "utf8"));
    }
  } catch (e) {
    console.error("Error loading previous data:", e.message);
  }
  return { rankings: {}, backlinks: {}, traffic: {}, lastCheck: null };
}

// ── Save current data ──
function saveData(data) {
  const dir = "./seo-data";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG.dataFile, JSON.stringify(data, null, 2));
}

// ── Send Telegram alert ──
async function sendTelegramAlert(message) {
  const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendMessage`;
  const payload = JSON.stringify({
    chat_id: CONFIG.telegramChatId,
    text: message,
    parse_mode: "Markdown",
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: "POST", headers: { "Content-Type": "application/json" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

// ── Check Google Search Console data (via API) ──
async function checkSearchConsoleData() {
  // Requires Google Search Console API setup
  // Returns: { clicks, impressions, ctr, position } for each keyword
  console.log("📊 Checking Google Search Console data...");
  
  // Placeholder — implement with actual GSC API
  return {
    "usps tracking": { clicks: 1250, impressions: 45000, ctr: 2.78, position: 8.5 },
    "usps package tracking": { clicks: 890, impressions: 32000, ctr: 2.78, position: 11.2 },
  };
}

// ── Check Ahrefs backlinks (via API) ──
async function checkBacklinks() {
  console.log("🔗 Checking backlinks...");
  
  // Placeholder — implement with actual Ahrefs API
  return {
    totalBacklinks: 1250,
    referringDomains: 340,
    newBacklinks: 15,
    lostBacklinks: 3,
  };
}

// ── Monitor competitor rankings ──
async function checkCompetitorRankings(keyword) {
  console.log(`🔍 Checking competitor rankings for: ${keyword}`);
  
  // Placeholder — implement with SerpAPI or similar
  return {
    keyword,
    results: [
      { domain: "usps.com", position: 1 },
      { domain: "parcelsapp.com", position: 3 },
      { domain: "uspostaltracking.com", position: 7 },
      { domain: "17track.net", position: 9 },
    ],
  };
}

// ── Generate daily SEO report ──
async function generateDailyReport() {
  const previousData = loadPreviousData();
  const today = new Date().toISOString().split("T")[0];
  
  console.log(`\n📅 SEO Daily Report — ${today}`);
  console.log(`Site: ${CONFIG.site}`);
  console.log("=".repeat(50));

  const report = {
    date: today,
    site: CONFIG.site,
    rankings: {},
    backlinks: {},
    alerts: [],
  };

  // Check backlinks
  const backlinks = await checkBacklinks();
  report.backlinks = backlinks;
  
  if (backlinks.newBacklinks >= CONFIG.alertThresholds.newBacklinks) {
    report.alerts.push(`✅ ${backlinks.newBacklinks} new backlinks detected!`);
  }
  if (backlinks.lostBacklinks >= CONFIG.alertThresholds.lostBacklinks) {
    report.alerts.push(`⚠️ ${backlinks.lostBacklinks} backlinks lost!`);
  }

  // Check top keyword rankings
  for (const keyword of CONFIG.targetKeywords.slice(0, 5)) {
    const rankData = await checkCompetitorRankings(keyword);
    const ourRank = rankData.results.find(r => r.domain === CONFIG.site);
    
    if (ourRank) {
      report.rankings[keyword] = ourRank.position;
      
      // Check for ranking drops
      const previousRank = previousData.rankings[keyword];
      if (previousRank && ourRank.position - previousRank > CONFIG.alertThresholds.rankingDrop) {
        report.alerts.push(`🔴 Ranking DROP: "${keyword}" — was #${previousRank}, now #${ourRank.position}`);
      } else if (previousRank && previousRank - ourRank.position > 3) {
        report.alerts.push(`🟢 Ranking GAIN: "${keyword}" — was #${previousRank}, now #${ourRank.position}`);
      }
    }
  }

  // Print report
  console.log("\n📈 Current Rankings:");
  Object.entries(report.rankings).forEach(([keyword, position]) => {
    const prev = previousData.rankings[keyword];
    const change = prev ? (prev - position > 0 ? `↑${prev - position}` : `↓${position - prev}`) : "new";
    console.log(`  ${keyword}: #${position} (${change})`);
  });

  console.log("\n🔗 Backlinks:");
  console.log(`  Total: ${backlinks.totalBacklinks}`);
  console.log(`  Referring Domains: ${backlinks.referringDomains}`);
  console.log(`  New: +${backlinks.newBacklinks}`);
  console.log(`  Lost: -${backlinks.lostBacklinks}`);

  if (report.alerts.length > 0) {
    console.log("\n🚨 Alerts:");
    report.alerts.forEach(alert => console.log(`  ${alert}`));

    // Send Telegram alert
    const alertMessage = `*SEO Alert — ${CONFIG.site}*\n\n${report.alerts.join("\n")}`;
    await sendTelegramAlert(alertMessage);
  } else {
    console.log("\n✅ No significant changes detected");
  }

  // Save current data
  previousData.rankings = { ...previousData.rankings, ...report.rankings };
  previousData.backlinks = backlinks;
  previousData.lastCheck = today;
  saveData(previousData);

  console.log("\n💾 Data saved to:", CONFIG.dataFile);
  console.log("=".repeat(50));

  return report;
}

// ── Main execution ──
generateDailyReport().catch(console.error);

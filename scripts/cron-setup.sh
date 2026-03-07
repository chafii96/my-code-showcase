#!/bin/bash
# ============================================================
# Cron Jobs Setup Script for uspostaltracking.com
# Run once on VPS: bash scripts/cron-setup.sh
# ============================================================

APP="uspostaltracking"
SITE_DIR="/var/www/${APP}"
SCRIPTS_DIR="$SITE_DIR/scripts"
LOG_DIR="/var/log/${APP}"

# Create log directory
mkdir -p "$LOG_DIR"

echo "🔧 Setting up Cron Jobs for ${APP}..."
echo ""

# Create the daily sitemap + IndexNow runner script
cat > "$SCRIPTS_DIR/daily-seo-cron.sh" << 'CRONEOF'
#!/bin/bash
# Daily SEO Automation: Sitemap Update + IndexNow Ping

APP="uspostaltracking"
SITE_DIR="/var/www/${APP}"
LOG_DIR="/var/log/${APP}"
DATE=$(date +%Y-%m-%d_%H%M)
LOG_FILE="$LOG_DIR/cron-$DATE.log"

echo "========================================" >> "$LOG_FILE"
echo "SEO Cron Job - $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Step 1: Master sitemap update (generation + validation + optional ping)
echo "[1/1] Running master sitemap update..." >> "$LOG_FILE"
cd "$SITE_DIR"
node scripts/sitemap-update.cjs --ping >> "$LOG_FILE" 2>&1

echo "" >> "$LOG_FILE"
echo "✅ Cron job complete at $(date)" >> "$LOG_FILE"

# Keep only last 30 days of logs
find "$LOG_DIR" -name "cron-*.log" -mtime +30 -delete
CRONEOF

chmod +x "$SCRIPTS_DIR/daily-seo-cron.sh"

# Install cron jobs
echo "📅 Installing cron jobs..."

# Remove old cron entries for this project (if any)
(crontab -l 2>/dev/null || true) | (grep -v "uspostaltracking\|daily-seo-cron" || true) > /tmp/current_cron

# Add new cron jobs
cat >> /tmp/current_cron << EOF

# === ${APP} SEO Automation ===
# Daily at 3:00 AM: Update sitemaps + Ping search engines
0 3 * * * /bin/bash $SCRIPTS_DIR/daily-seo-cron.sh

# Every 6 hours: Quick IndexNow ping for fast indexing
0 */6 * * * cd $SITE_DIR && node scripts/ping-indexnow.cjs >> $LOG_DIR/indexnow.log 2>&1

# Weekly Sunday 2:00 AM: Full sitemap regeneration
0 2 * * 0 cd $SITE_DIR && node scripts/sitemap-update.cjs --ping >> $LOG_DIR/weekly-sitemap.log 2>&1

# Every hour: Auto-fetch AdSense stats via OAuth API
0 * * * * cd $SITE_DIR && node scripts/adsense-stats-cron.cjs >> $LOG_DIR/adsense-stats.log 2>&1
EOF

# Install the new crontab
crontab /tmp/current_cron
rm /tmp/current_cron

echo ""
echo "✅ Cron jobs installed successfully!"
echo ""
echo "📋 Active cron schedule:"
echo "  • Daily 3:00 AM  → Sitemap update + Search engine ping"
echo "  • Every 6 hours  → IndexNow ping (fast indexing)"
echo "  • Weekly Sunday   → Full sitemap regeneration"
echo ""
echo "📁 Logs: $LOG_DIR/"
echo ""
echo "🔍 Verify with: crontab -l"
echo "📊 Check logs:  tail -f $LOG_DIR/cron-*.log"

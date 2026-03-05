#!/bin/bash
# ============================================================
# SwiftTrack Hub — Backup and Deploy Script
# Backs up site content and deploys to backup domain on trigger
# ============================================================

set -e

APP="swifttrack-hub"
PRIMARY_DOMAIN="uspostaltracking.com"
BACKUP_DOMAINS=("uspspackagetracker.com" "trackuspspackage.net" "uspsdeliverytracker.com")
GITHUB_REPO="chafii96/track-my-mail"
BUILD_DIR="./dist"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🔄 Starting backup and deploy process..."
echo "Timestamp: $TIMESTAMP"

# ── STEP 1: Build the project ──
echo "📦 Building project..."
npm run build
echo "✅ Build complete"

# ── STEP 2: Create backup archive ──
echo "💾 Creating backup archive..."
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/site-backup-$TIMESTAMP.tar.gz" "$BUILD_DIR"
echo "✅ Backup created: site-backup-$TIMESTAMP.tar.gz"

# ── STEP 3: Push to GitHub (for version control) ──
echo "📤 Pushing to GitHub..."
git add -A
git commit -m "Auto-backup: $TIMESTAMP" --allow-empty
git push origin main
echo "✅ Pushed to GitHub"

# ── STEP 4: Generate new sitemap ──
echo "🗺️ Generating sitemap..."
[ -f scripts/generate-sitemaps.cjs ] && node scripts/generate-sitemaps.cjs
[ -f scripts/generate-sitemap-v2.cjs ] && node scripts/generate-sitemap-v2.cjs
echo "✅ Sitemap generated"

# ── STEP 5: Ping IndexNow for all pages ──
echo "🔔 Pinging IndexNow..."
node scripts/ping-indexnow.cjs
echo "✅ IndexNow pinged"

# ── STEP 6: Check if rotation is needed ──
echo "🔍 Checking domain health..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$PRIMARY_DOMAIN")

if [ "$HTTP_STATUS" != "200" ]; then
  echo "⚠️ Primary domain returning $HTTP_STATUS — initiating rotation!"
  
  BACKUP_DOMAIN="${BACKUP_DOMAINS[0]}"
  echo "🔄 Deploying to backup domain: $BACKUP_DOMAIN"
  
  sed -i "s/$PRIMARY_DOMAIN/$BACKUP_DOMAIN/g" "$BUILD_DIR/robots.txt"
  sed -i "s/$PRIMARY_DOMAIN/$BACKUP_DOMAIN/g" "$BUILD_DIR/sitemap-index.xml"
  
  echo "✅ Backup domain deployment prepared"
  echo "📋 Next steps:"
  echo "   1. Update DNS for $BACKUP_DOMAIN to point to this server"
  echo "   2. Set 301 redirect from $PRIMARY_DOMAIN to $BACKUP_DOMAIN"
  echo "   3. Submit $BACKUP_DOMAIN to IndexNow"
else
  echo "✅ Primary domain healthy ($HTTP_STATUS)"
fi

echo ""
echo "🎉 Backup and deploy complete!"
echo "Backup file: $BACKUP_DIR/site-backup-$TIMESTAMP.tar.gz"

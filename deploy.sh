#!/bin/bash
set -e

#══════════════════════════════════════════════════════════════
#  US Postal Tracking — One-Click Full Deployment Script
#  Usage: sudo bash deploy.sh
#  First time: git clone <repo> /var/www/uspostaltracking
#              cd /var/www/uspostaltracking && sudo bash deploy.sh
#══════════════════════════════════════════════════════════════

DOMAIN="uspostaltracking.com"
REPO="https://github.com/chafii96/my-code-showcase.git"
APP_DIR="/var/www/uspostaltracking"
EMAIL="admin@uspostaltracking.com"
API_PORT=8080
SWAP_SIZE="2G"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }
step() { echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${CYAN}  $1${NC}"; echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

TOTAL_STEPS=12

# ── Must be root ──────────────────────────────────────────────
[[ $EUID -ne 0 ]] && err "Run as root: sudo bash deploy.sh"

# ══════════════════════════════════════════════════════════════
step "1/$TOTAL_STEPS — System Update & Dependencies"
# ══════════════════════════════════════════════════════════════
apt update && apt upgrade -y
apt install -y curl git nginx certbot python3-certbot-nginx ufw build-essential

# ══════════════════════════════════════════════════════════════
step "2/$TOTAL_STEPS — Swap Memory (for Puppeteer/Chrome)"
# ══════════════════════════════════════════════════════════════
if [ ! -f /swapfile ]; then
  fallocate -l $SWAP_SIZE /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  log "Swap $SWAP_SIZE created and enabled"
else
  log "Swap already exists ($(swapon --show | tail -1 | awk '{print $3}'))"
fi

# ══════════════════════════════════════════════════════════════
step "3/$TOTAL_STEPS — Node.js 20 LTS"
# ══════════════════════════════════════════════════════════════
if ! command -v node &>/dev/null || [[ $(node -v | cut -d. -f1 | tr -d v) -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
log "Node $(node -v) — npm $(npm -v)"

# Install PM2 globally
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
  log "PM2 installed"
else
  log "PM2 already installed ($(pm2 -v))"
fi

# ══════════════════════════════════════════════════════════════
step "4/$TOTAL_STEPS — Clone / Update Repository"
# ══════════════════════════════════════════════════════════════
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch --all
  git reset --hard origin/main
  log "Repository updated"
else
  rm -rf "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
  log "Repository cloned"
fi

# ══════════════════════════════════════════════════════════════
step "5/$TOTAL_STEPS — Puppeteer & Chrome Dependencies"
# ══════════════════════════════════════════════════════════════
# Install ALL Chrome/Puppeteer system dependencies
# Detect libasound package name (Ubuntu 24+ uses libasound2t64)
LIBASOUND="libasound2"
if ! apt-cache show libasound2 &>/dev/null 2>&1; then
  LIBASOUND="libasound2t64"
fi

apt install -y \
  libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 \
  libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
  libpango-1.0-0 libcairo2 $LIBASOUND libxshmfence1 \
  libx11-xcb1 libxcb-dri3-0 libxss1 libxtst6 \
  fonts-liberation fonts-noto-color-emoji xdg-utils wget ca-certificates || \
apt install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
  libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
  libpango-1.0-0 libcairo2 $LIBASOUND libxshmfence1 \
  libx11-xcb1 libxcb-dri3-0 libxss1 libxtst6 \
  fonts-liberation fonts-noto-color-emoji xdg-utils wget ca-certificates
log "Chrome system dependencies installed"

# ══════════════════════════════════════════════════════════════
step "6/$TOTAL_STEPS — NPM Install & Native Rebuilds"
# ══════════════════════════════════════════════════════════════
cd "$APP_DIR"
rm -rf node_modules/.vite

# Install all dependencies including puppeteer
npm install --legacy-peer-deps
npm install puppeteer --legacy-peer-deps

# Rebuild native modules (sharp) for server architecture
npm rebuild sharp || warn "sharp rebuild failed — images may not optimize"

# Install Chrome browser for Puppeteer
npx puppeteer browsers install chrome
log "All dependencies installed — Puppeteer + Chrome ready"

# ══════════════════════════════════════════════════════════════
step "7/$TOTAL_STEPS — Clean Old Files & Build"
# ══════════════════════════════════════════════════════════════
cd "$APP_DIR"

# Clean old programmatic HTML folders (prevent thin pages)
rm -rf public/city public/article public/zip public/state public/status public/locations
log "Old programmatic folders cleaned"

# Build: generate-all.cjs → vite build → prerender.cjs
echo "🔨 Building... this may take a few minutes"
npm run build || err "Build failed! Check errors above."
log "Build complete — $(du -sh dist | cut -f1)"

# ══════════════════════════════════════════════════════════════
step "8/$TOTAL_STEPS — Generate Sitemaps"
# ══════════════════════════════════════════════════════════════
cd "$APP_DIR"
if [ -f "scripts/generate-sitemap-v2.cjs" ]; then
  node scripts/generate-sitemap-v2.cjs && log "Sitemaps generated" || warn "Sitemap generation failed"
else
  warn "Sitemap script not found — skipping"
fi

# ══════════════════════════════════════════════════════════════
step "9/$TOTAL_STEPS — Nginx Configuration"
# ══════════════════════════════════════════════════════════════
cat > /etc/nginx/sites-available/uspostaltracking.conf << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name uspostaltracking.com www.uspostaltracking.com;
    root /var/www/uspostaltracking/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # ── API proxy to PM2 backend ──
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
    }

    # ── Static assets — 1 year cache ──
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Images
    location ~* \.(webp|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Fonts
    location ~* \.(woff|woff2|ttf|otf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Programmatic SEO static HTML pages
    location /programmatic/ {
        try_files $uri $uri/ =404;
    }

    # Prerendered pages for bots
    location /prerendered/ {
        internal;
        alias /var/www/uspostaltracking/prerendered/;
    }

    # Sitemaps & robots
    location ~* ^/(sitemap.*\.xml|robots\.txt|.*\.txt)$ {
        expires 1d;
        add_header Cache-Control "public";
    }

    # SPA fallback — all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Block dotfiles
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/uspostaltracking.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t || err "Nginx config test failed"
systemctl restart nginx
systemctl enable nginx
log "Nginx configured and running"

# ══════════════════════════════════════════════════════════════
step "10/$TOTAL_STEPS — PM2 API Server"
# ══════════════════════════════════════════════════════════════
cd "$APP_DIR"

# Stop existing instance if running
pm2 delete uspostaltracking 2>/dev/null || true

# Install server dependencies if server/package.json exists
if [ -f "server/package.json" ]; then
  cd server && npm install --legacy-peer-deps && cd ..
  log "Server dependencies installed"
fi

# Start API server with PM2
if [ -f "ecosystem.config.cjs" ]; then
  pm2 start ecosystem.config.cjs --env production
  log "API server started via ecosystem.config.cjs"
elif [ -f "server/api-server.cjs" ]; then
  pm2 start server/api-server.cjs --name uspostaltracking -i max \
    --max-memory-restart 512M \
    -- --port $API_PORT
  log "API server started (api-server.cjs)"
elif [ -f "server/index.js" ]; then
  pm2 start server/index.js --name uspostaltracking -i max \
    --max-memory-restart 512M
  log "API server started (index.js)"
else
  warn "No server entry point found — API server not started"
fi

# Save PM2 process list & setup startup
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true
log "PM2 configured for auto-restart on reboot"

# ══════════════════════════════════════════════════════════════
step "11/$TOTAL_STEPS — Firewall & SSL"
# ══════════════════════════════════════════════════════════════
# Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
log "Firewall configured"

# SSL Certificate
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  certbot --nginx \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --non-interactive \
    --agree-tos \
    -m "$EMAIL" \
    --redirect \
    && log "SSL certificate installed" \
    || warn "SSL failed — make sure DNS A records point to this server"
else
  certbot renew --dry-run && log "SSL certificate valid"
fi

# Auto-renew cron (if not already set)
if ! crontab -l 2>/dev/null | grep -q certbot; then
  (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
  log "SSL auto-renewal cron added (daily at 3 AM)"
else
  log "SSL auto-renewal cron already exists"
fi

# ══════════════════════════════════════════════════════════════
step "12/$TOTAL_STEPS — Final Verification"
# ══════════════════════════════════════════════════════════════
ERRORS=0

# Check Nginx
if systemctl is-active --quiet nginx; then
  log "Nginx: running"
else
  warn "Nginx: NOT running"; ERRORS=$((ERRORS+1))
fi

# Check PM2
PM2_STATUS=$(pm2 jlist 2>/dev/null | grep -o '"status":"online"' | head -1)
if [ -n "$PM2_STATUS" ]; then
  log "PM2 API: online"
else
  warn "PM2 API: not running"; ERRORS=$((ERRORS+1))
fi

# Check HTTP response
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ]; then
  log "HTTP response: $HTTP_CODE"
else
  warn "HTTP response: $HTTP_CODE"; ERRORS=$((ERRORS+1))
fi

# Check dist/ exists
if [ -d "$APP_DIR/dist" ] && [ -f "$APP_DIR/dist/index.html" ]; then
  log "Build output: $(du -sh $APP_DIR/dist | cut -f1)"
else
  warn "dist/index.html not found!"; ERRORS=$((ERRORS+1))
fi

# Check prerendered/
if [ -d "$APP_DIR/prerendered" ]; then
  PRERENDER_COUNT=$(find "$APP_DIR/prerendered" -name "*.html" | wc -l)
  log "Prerendered pages: $PRERENDER_COUNT"
else
  warn "No prerendered pages found"
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
if [ $ERRORS -eq 0 ]; then
echo -e "${GREEN}║  🎉 DEPLOYMENT COMPLETE — ALL CHECKS PASSED             ║${NC}"
else
echo -e "${YELLOW}║  ⚠️  DEPLOYMENT COMPLETE — $ERRORS WARNING(S)                      ║${NC}"
fi
echo -e "${GREEN}╠═══════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Domain:   https://$DOMAIN                              ║${NC}"
echo -e "${GREEN}║  Root:     $APP_DIR/dist                                ║${NC}"
echo -e "${GREEN}║  API:      http://127.0.0.1:$API_PORT (proxied via /api/)        ║${NC}"
echo -e "${GREEN}║  Admin:    https://$DOMAIN/admin                        ║${NC}"
echo -e "${GREEN}╠═══════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Useful commands:                                        ║${NC}"
echo -e "${GREEN}║    pm2 logs          — View API logs                     ║${NC}"
echo -e "${GREEN}║    pm2 monit         — Monitor processes                 ║${NC}"
echo -e "${GREEN}║    pm2 restart all   — Restart API                       ║${NC}"
echo -e "${GREEN}║    nginx -t && systemctl reload nginx — Reload Nginx     ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║  To update later:                                        ║${NC}"
echo -e "${GREEN}║    cd $APP_DIR && sudo bash deploy.sh                    ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"

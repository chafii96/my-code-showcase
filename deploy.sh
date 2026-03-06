#!/bin/bash
set -e

#══════════════════════════════════════════════════════════════
#  US Postal Tracking — One-Click Full Deployment Script
#  Usage: curl -sL <url> | sudo bash
#     OR: sudo bash deploy.sh
#══════════════════════════════════════════════════════════════

DOMAIN="uspostaltracking.com"
REPO="https://github.com/chafii96/my-code-showcase.git"
APP_DIR="/var/www/uspostaltracking"
EMAIL="admin@uspostaltracking.com"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }
step() { echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${CYAN}  $1${NC}"; echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

# Must be root
[[ $EUID -ne 0 ]] && err "Run as root: sudo bash deploy.sh"

step "1/8 — System Update & Dependencies"
apt update && apt upgrade -y
apt install -y curl git nginx certbot python3-certbot-nginx ufw

step "2/8 — Node.js 20 LTS"
if ! command -v node &>/dev/null || [[ $(node -v | cut -d. -f1 | tr -d v) -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
log "Node $(node -v) — npm $(npm -v)"

step "3/8 — Clone / Update Repository"
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

step "4/9 — Puppeteer & Chrome (for prerendering)"
if ! npx puppeteer browsers inspect chrome &>/dev/null 2>&1; then
  # Install Chrome dependencies (headless)
  apt install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
    libpango-1.0-0 libcairo2 libasound2 libxshmfence1 \
    fonts-liberation fonts-noto-color-emoji xdg-utils wget ca-certificates
  log "Chrome dependencies installed"
  # Puppeteer will be installed via npm, Chrome via puppeteer
  cd "$APP_DIR"
  npm install puppeteer --legacy-peer-deps
  npx puppeteer browsers install chrome
  log "Puppeteer + Chrome installed"
else
  log "Puppeteer + Chrome already installed"
fi

step "5/9 — Install & Build"
cd "$APP_DIR"
rm -rf node_modules/.vite
npm install --legacy-peer-deps
# Clean old programmatic folders before build
rm -rf public/city public/article public/zip public/state public/status public/locations
npm run build
log "Build complete — $(du -sh dist | cut -f1)"

step "6/9 — Nginx Configuration"
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

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Static assets — 1 year cache
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

step "7/9 — Firewall (UFW)"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
log "Firewall configured"

step "8/9 — SSL Certificate (Let's Encrypt)"
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
  certbot renew --dry-run && log "SSL certificate already exists and is valid"
fi

step "9/9 — Final Verification"
# Test if site responds
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost" || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ]; then
  log "Site responding with HTTP $HTTP_CODE"
else
  warn "Site returned HTTP $HTTP_CODE — check Nginx logs: journalctl -u nginx"
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  🎉 DEPLOYMENT COMPLETE                             ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Domain:  https://$DOMAIN            ║${NC}"
echo -e "${GREEN}║  Root:    $APP_DIR/dist               ║${NC}"
echo -e "${GREEN}║  Build:   $(du -sh $APP_DIR/dist | cut -f1) total                            ║${NC}"
echo -e "${GREEN}║  Admin:   https://$DOMAIN/admin       ║${NC}"
echo -e "${GREEN}║  Pass:    uspostal2024                              ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  To update later, just run:                         ║${NC}"
echo -e "${GREEN}║  cd $APP_DIR && sudo bash deploy.sh   ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"

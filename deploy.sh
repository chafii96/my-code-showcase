#!/bin/bash
set -e

#══════════════════════════════════════════════════════════════
#  US Postal Tracking — One-Click Full Deployment Script
#  Usage: sudo bash deploy.sh
#  First time: git clone <repo> /var/www/uspostaltracking
#              cd /var/www/uspostaltracking && sudo bash deploy.sh
#══════════════════════════════════════════════════════════════

DOMAIN="uspostaltracking.com"
APP_DIR="/var/www/uspostaltracking"
EMAIL="its.rabyawork@gmail.com"
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
apt install -y curl git nginx socat ufw build-essential ca-certificates

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

# Install/update PM2 globally
npm install -g pm2@latest
log "PM2 $(pm2 -v)"

# ══════════════════════════════════════════════════════════════
step "4/$TOTAL_STEPS — Puppeteer & Chrome Dependencies"
# ══════════════════════════════════════════════════════════════
CHROME_DEPS=(
  libnss3 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1
  libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libxshmfence1
  libx11-xcb1 libxcb-dri3-0 libxss1 libxtst6
  fonts-liberation fonts-noto-color-emoji xdg-utils wget
)

for pkg in "libatk1.0-0:libatk1.0-0t64" "libatk-bridge2.0-0:libatk-bridge2.0-0t64" \
           "libcups2:libcups2t64" "libasound2:libasound2t64"; do
  OLD="${pkg%%:*}"; NEW="${pkg##*:}"
  if apt-cache show "$NEW" &>/dev/null 2>&1; then
    CHROME_DEPS+=("$NEW")
  else
    CHROME_DEPS+=("$OLD")
  fi
done

apt install -y "${CHROME_DEPS[@]}"
log "Chrome system dependencies installed"

# ══════════════════════════════════════════════════════════════
step "5/$TOTAL_STEPS — NPM Install & Native Rebuilds"
# ══════════════════════════════════════════════════════════════
cd "$APP_DIR"
rm -rf node_modules/.vite

npm install --legacy-peer-deps
npm install puppeteer --legacy-peer-deps
npm rebuild sharp || warn "sharp rebuild failed — images may not optimize"
npx puppeteer browsers install chrome
log "All dependencies installed — Puppeteer + Chrome ready"

# ══════════════════════════════════════════════════════════════
step "6/$TOTAL_STEPS — Clean Old Files & Build"
# ══════════════════════════════════════════════════════════════
cd "$APP_DIR"

# Clean old programmatic HTML (prevent thin pages overriding SPA)
rm -rf public/city public/article public/zip public/state public/status public/locations
rm -rf dist/city dist/article dist/zip dist/state dist/status dist/locations
log "Old programmatic folders cleaned"

echo "🔨 Building... this may take a few minutes"
npm run build || err "Build failed! Check errors above."
log "Build complete — $(du -sh dist | cut -f1)"

# ══════════════════════════════════════════════════════════════
step "7/$TOTAL_STEPS — Generate Sitemaps"
# ══════════════════════════════════════════════════════════════
cd "$APP_DIR"
if [ -f "scripts/generate-sitemap-v2.cjs" ]; then
  node scripts/generate-sitemap-v2.cjs && log "Sitemaps generated" || warn "Sitemap generation failed"
else
  warn "Sitemap script not found — skipping"
fi

# ══════════════════════════════════════════════════════════════
step "8/$TOTAL_STEPS — PM2 API Server"
# ══════════════════════════════════════════════════════════════
cd "$APP_DIR"

# Clean PM2 state completely to avoid stale process errors
pm2 kill 2>/dev/null || true
rm -f ~/.pm2/dump.pm2
sleep 2

# Install server dependencies
if [ -f "server/package.json" ]; then
  cd server && npm install --legacy-peer-deps && cd ..
  log "Server dependencies installed"
fi

# Quick syntax check before starting
echo "🔍 Checking server/index.js syntax..."
node -c server/index.js || err "server/index.js has syntax errors! Fix them first."

# Start API server with PM2
pm2 start ecosystem.config.cjs --env production
sleep 3

# Verify API is responding
API_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$API_PORT/api/health 2>/dev/null || echo "000")
if [ "$API_TEST" = "200" ]; then
  log "API server running ✓ (port $API_PORT)"
else
  warn "API returned HTTP $API_TEST — checking logs..."
  pm2 logs uspostaltracking --lines 20 --nostream 2>/dev/null || true
  
  # Try direct start for debugging
  echo "🔄 Retrying with direct node start..."
  pm2 delete all 2>/dev/null || true
  PORT=$API_PORT pm2 start server/index.js --name uspostaltracking --max-memory-restart 512M
  sleep 3
  API_TEST2=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$API_PORT/api/health 2>/dev/null || echo "000")
  if [ "$API_TEST2" = "200" ]; then
    log "API server running ✓ (fallback start)"
  else
    warn "API still not responding — check: pm2 logs uspostaltracking"
  fi
fi

pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true
log "PM2 configured for auto-restart"

# ══════════════════════════════════════════════════════════════
step "9/$TOTAL_STEPS — Nginx Configuration"
# ══════════════════════════════════════════════════════════════

# Remove any conflicting configs
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/uspostaltracking
rm -f /etc/nginx/sites-available/uspostaltracking

# Check if SSL certs exist
SSL_CERT="/etc/ssl/uspostaltracking/cert.pem"
SSL_KEY="/etc/ssl/uspostaltracking/key.pem"

if [ -f "$SSL_CERT" ] && [ -f "$SSL_KEY" ]; then
  # ── HTTPS config (SSL already installed) ──
  cat > /etc/nginx/sites-available/uspostaltracking.conf << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name uspostaltracking.com www.uspostaltracking.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name uspostaltracking.com www.uspostaltracking.com;

    ssl_certificate /etc/ssl/uspostaltracking/cert.pem;
    ssl_certificate_key /etc/ssl/uspostaltracking/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    root /var/www/uspostaltracking/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # API proxy
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

    # Static assets — long cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(webp|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(woff|woff2|ttf|otf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Programmatic SEO static HTML
    location /programmatic/ {
        try_files $uri $uri/ =404;
    }

    # SPA dynamic routes — MUST use index.html fallback
    location ~* ^/(city|article|zip|state|status|locations|tracking|admin|guides|knowledge-center)/ {
        try_files /index.html =404;
    }

    # Sitemaps & robots
    location ~* ^/(sitemap.*\.xml|robots\.txt|.*\.txt)$ {
        expires 1d;
        add_header Cache-Control "public";
    }

    # SPA fallback
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
  log "Nginx config: HTTPS mode"
else
  # ── HTTP-only config (no SSL yet) ──
  cat > /etc/nginx/sites-available/uspostaltracking.conf << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name uspostaltracking.com www.uspostaltracking.com;
    root /var/www/uspostaltracking/dist;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

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

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(webp|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(woff|woff2|ttf|otf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /programmatic/ {
        try_files $uri $uri/ =404;
    }

    location ~* ^/(city|article|zip|state|status|locations|tracking|admin|guides|knowledge-center)/ {
        try_files /index.html =404;
    }

    location ~* ^/(sitemap.*\.xml|robots\.txt|.*\.txt)$ {
        expires 1d;
        add_header Cache-Control "public";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINX
  log "Nginx config: HTTP mode (run SSL setup separately)"
fi

ln -sf /etc/nginx/sites-available/uspostaltracking.conf /etc/nginx/sites-enabled/
nginx -t || err "Nginx config test failed"
systemctl restart nginx
systemctl enable nginx
log "Nginx configured and running"

# ══════════════════════════════════════════════════════════════
step "10/$TOTAL_STEPS — Firewall"
# ══════════════════════════════════════════════════════════════
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
log "Firewall configured"

# ══════════════════════════════════════════════════════════════
step "11/$TOTAL_STEPS — SSL (acme.sh + ZeroSSL)"
# ══════════════════════════════════════════════════════════════
if [ -f "$SSL_CERT" ] && [ -f "$SSL_KEY" ]; then
  log "SSL certificates already exist"
else
  echo "🔒 Installing SSL via acme.sh..."
  
  # Install acme.sh if not present
  if [ ! -f ~/.acme.sh/acme.sh ]; then
    curl https://get.acme.sh | sh -s email=$EMAIL
    source ~/.bashrc 2>/dev/null || true
  fi
  
  # Register with ZeroSSL
  ~/.acme.sh/acme.sh --register-account -m $EMAIL --server zerossl 2>/dev/null || true
  
  # Stop nginx temporarily for standalone verification
  systemctl stop nginx
  
  ~/.acme.sh/acme.sh --issue -d $DOMAIN -d www.$DOMAIN --standalone --force && {
    mkdir -p /etc/ssl/uspostaltracking
    ~/.acme.sh/acme.sh --install-cert -d $DOMAIN \
      --key-file /etc/ssl/uspostaltracking/key.pem \
      --fullchain-file /etc/ssl/uspostaltracking/cert.pem \
      --reloadcmd "systemctl reload nginx"
    log "SSL certificate installed"
    
    # Re-run nginx config with HTTPS
    systemctl start nginx
    warn "Re-run deploy.sh to switch Nginx to HTTPS mode"
  } || {
    warn "SSL failed — DNS A records must point to this server"
    systemctl start nginx
  }
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

# Check API directly
API_HEALTH=$(curl -s http://127.0.0.1:$API_PORT/api/health 2>/dev/null)
if echo "$API_HEALTH" | grep -q "ok"; then
  log "API /health: ✓"
else
  warn "API /health: no response (run: pm2 logs uspostaltracking)"; ERRORS=$((ERRORS+1))
fi

# Check HTTP response
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ]; then
  log "HTTP response: $HTTP_CODE"
else
  warn "HTTP response: $HTTP_CODE"; ERRORS=$((ERRORS+1))
fi

# Check dist/
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
echo -e "${GREEN}║    cd $APP_DIR && git pull && sudo bash deploy.sh        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"

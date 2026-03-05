#!/bin/bash
########################################################################
#  🚀 PACKAGE PAL — سكريبت النشر الشامل (Ubuntu 22/24/25 Compatible)
#  ضغطة زر واحدة: تنظيف ← استنساخ ← تثبيت ← بناء ← Nginx ← SSL ← PM2
#
#  الاستخدام:
#    sudo bash deploy.sh yourdomain.com www.yourdomain.com
#    sudo bash deploy.sh yourdomain.com
#    sudo bash deploy.sh                    ← بدون دومين = HTTP فقط
########################################################################

# ⚠️ لا نستخدم set -euo pipefail لأنها توقف السكريبت عند أي خطأ بسيط
# بدلاً من ذلك نتعامل مع كل خطأ يدوياً
set +e

# ── ألوان ──
R='\033[0;31m'; G='\033[0;32m'; Y='\033[1;33m'
B='\033[0;34m'; C='\033[0;36m'; BD='\033[1m'; N='\033[0m'

log()  { echo -e "${G}✅ $1${N}"; }
warn() { echo -e "${Y}⚠️  $1${N}"; }
err()  { echo -e "${R}❌ $1${N}"; }
die()  { echo -e "${R}❌ $1${N}"; exit 1; }
info() { echo -e "${C}ℹ️  $1${N}"; }
hr()   { echo -e "\n${BD}${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"; echo -e "${BD}${B}  $1${N}"; echo -e "${BD}${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}\n"; }

# ── إعدادات ──
REPO="https://github.com/chafii96/track-my-mail.git"
APP="swifttrack-hub"
DIR="/var/www/${APP}"
BAK="/var/www/backups"
EMAIL="its.rabyawork@gmail.com"
NVER="20"
PORT="8080"
DOMAINS=("$@")
MAIN="${DOMAINS[0]:-}"
S=0; T=14
SECONDS=0
ERRORS=0
WARNINGS=0
p() { S=$((S+1)); hr "${S}/${T} — $1"; }

echo -e "${C}"
cat << 'ART'
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀  PACKAGE PAL — FULL DEPLOY  🚀               ║
║   سكريبت شامل موحد — ضغطة زر واحدة               ║
║                                                   ║
║   Compatible: Ubuntu 22.04 / 24.04 / 25.x         ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
ART
echo -e "${N}"

# ═══════════════════════════ 1 ═══════════════════════════
p "فحص الصلاحيات والنظام"
[ "$EUID" -ne 0 ] && die "شغّل بـ root:\n  sudo bash deploy.sh yourdomain.com"

# كشف إصدار Ubuntu
UBUNTU_VER="unknown"
if [ -f /etc/os-release ]; then
  UBUNTU_VER=$(grep VERSION_ID /etc/os-release | cut -d'"' -f2)
fi
log "root ✓ — Ubuntu ${UBUNTU_VER}"

# ═══════════════════════════ 2 ═══════════════════════════
p "تحديث النظام + أدوات"
export DEBIAN_FRONTEND=noninteractive

info "تحديث قائمة الحزم..."
apt-get update -qq 2>/dev/null || warn "apt-get update لم يكتمل بالكامل"

# ── تثبيت ذكي: يتحقق من كل حزمة قبل تثبيتها ──
try_install() {
  local pkg="$1"
  # تحقق من وجود الحزمة في المستودعات
  if apt-cache show "$pkg" >/dev/null 2>&1; then
    apt-get install -y -qq "$pkg" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
      return 0
    fi
  fi
  return 1
}

# حزم أساسية — كل واحدة تُثبّت لوحدها لتجنب فشل الكل
info "تثبيت الأدوات الأساسية..."
BASIC_PKGS="git curl wget unzip jq htop ufw logrotate dnsutils build-essential"
for pkg in $BASIC_PKGS; do
  try_install "$pkg" || warn "تعذر تثبيت $pkg — تخطي"
done
log "أدوات أساسية ✓"

# Certbot — قد يكون بإسم مختلف
info "تثبيت Certbot..."
try_install "certbot" || warn "certbot غير متوفر"
try_install "python3-certbot-nginx" || warn "python3-certbot-nginx غير متوفر"

# ── حزم Puppeteer/Chrome — التوافق مع Ubuntu 22/24/25 ──
info "تثبيت مكتبات Chrome/Puppeteer..."

# قائمة الحزم مع بدائل (الأصلي | البديل لـ Ubuntu 25)
CHROME_PKGS_WITH_ALTS=(
  "libatk1.0-0|libatk1.0-0t64"
  "libatk-bridge2.0-0|libatk-bridge2.0-0t64"
  "libcups2|libcups2t64"
  "libdbus-1-3|libdbus-1-3t64"
  "libdrm2|libdrm2t64"
  "libgbm1|libgbm1t64"
  "libgtk-3-0|libgtk-3-0t64"
  "libnspr4|libnspr4t64"
  "libnss3|libnss3t64"
  "libx11-xcb1|libx11-xcb1t64"
  "libxcomposite1|libxcomposite1t64"
  "libxdamage1|libxdamage1t64"
  "libxrandr2|libxrandr2t64"
  "libxshmfence1|libxshmfence1t64"
  "libglu1-mesa|libglu1-mesa-dev"
  "libasound2|libasound2t64"
  "libpango-1.0-0|libpango-1.0-0t64"
  "libcairo2|libcairo2t64"
  "libxfixes3|libxfixes3t64"
  "libxcb1|libxcb1t64"
)

# حزم بدون بدائل
CHROME_PKGS_SIMPLE="ca-certificates fonts-liberation xdg-utils"

INSTALLED_CHROME=0
FAILED_CHROME=0

for pkg in $CHROME_PKGS_SIMPLE; do
  if try_install "$pkg"; then
    INSTALLED_CHROME=$((INSTALLED_CHROME+1))
  fi
done

for entry in "${CHROME_PKGS_WITH_ALTS[@]}"; do
  IFS='|' read -r pkg1 pkg2 <<< "$entry"
  if try_install "$pkg1"; then
    INSTALLED_CHROME=$((INSTALLED_CHROME+1))
  elif try_install "$pkg2"; then
    INSTALLED_CHROME=$((INSTALLED_CHROME+1))
  else
    FAILED_CHROME=$((FAILED_CHROME+1))
    warn "لم يتم العثور على: $pkg1 أو $pkg2"
  fi
done

if [ $FAILED_CHROME -gt 5 ]; then
  warn "فشل تثبيت ${FAILED_CHROME} حزمة Chrome — Prerendering قد لا يعمل"
  WARNINGS=$((WARNINGS+1))
else
  log "مكتبات Chrome ✓ (${INSTALLED_CHROME} حزمة)"
fi

# ═══════════════════════════ 3 ═══════════════════════════
p "Node.js v${NVER} + PM2"
NEED_NODE=true
if command -v node &>/dev/null; then
  CV=$(node -v | cut -dv -f2 | cut -d. -f1)
  if [ "$CV" -ge "$NVER" ] 2>/dev/null; then
    NEED_NODE=false
    log "Node $(node -v) موجود ✓"
  fi
fi

if $NEED_NODE; then
  info "تثبيت Node.js v${NVER}..."
  curl -fsSL "https://deb.nodesource.com/setup_${NVER}.x" | bash - >/dev/null 2>&1
  apt-get install -y -qq nodejs >/dev/null 2>&1
  if command -v node &>/dev/null; then
    log "Node $(node -v) ✓"
  else
    die "فشل تثبيت Node.js — تحقق من اتصال الإنترنت"
  fi
fi

npm install -g pm2 >/dev/null 2>&1
if command -v pm2 &>/dev/null; then
  log "PM2 $(pm2 -v) ✓"
else
  warn "فشل تثبيت PM2 — سيعمل الموقع بدون مراقبة"
  WARNINGS=$((WARNINGS+1))
fi

# ═══════════════════════════ 4 ═══════════════════════════
p "Nginx"
apt-get install -y -qq nginx >/dev/null 2>&1
if command -v nginx &>/dev/null; then
  systemctl enable nginx >/dev/null 2>&1
  systemctl start nginx 2>/dev/null
  log "Nginx ✓"
else
  die "فشل تثبيت Nginx"
fi

# ═══════════════════════════ 5 ═══════════════════════════
p "نسخ احتياطي + تنظيف المشروع القديم"
pm2 delete "$APP" 2>/dev/null || true

if [ -d "$DIR" ]; then
  mkdir -p "$BAK"
  BK="${BAK}/${APP}_$(date +%Y%m%d_%H%M%S)"
  mkdir -p "$BK"
  for f in .env .env.production .env.local; do
    [ -f "${DIR}/$f" ] && cp "${DIR}/$f" "$BK/" && info "حفظ $f"
  done
  # حفظ بيانات server/data
  if [ -d "${DIR}/server/data" ]; then
    cp -r "${DIR}/server/data" "$BK/server-data" 2>/dev/null && info "حفظ server/data"
  fi
  rm -rf "$DIR"
  log "تنظيف + نسخ احتياطي ✓"
else
  info "تثبيت جديد"
fi

cd /root
rm -rf "/tmp/${APP}" "/root/${APP}" 2>/dev/null || true

# ═══════════════════════════ 6 ═══════════════════════════
p "استنساخ المشروع من GitHub"
git clone --depth 1 "$REPO" "$DIR" 2>&1
if [ ! -d "$DIR" ]; then
  die "فشل استنساخ المشروع من GitHub"
fi
cd "$DIR"

# استعادة .env
LB=""
if [ -d "$BAK" ]; then
  LB=$(ls -td ${BAK}/${APP}_* 2>/dev/null | head -1) || true
fi
if [ -n "$LB" ] && [ -d "$LB" ]; then
  for f in .env .env.production .env.local; do
    [ -f "${LB}/$f" ] && cp "${LB}/$f" . && info "استعادة $f"
  done
  # استعادة server/data
  if [ -d "${LB}/server-data" ]; then
    mkdir -p server/data
    cp -rn "${LB}/server-data/"* server/data/ 2>/dev/null && info "استعادة server/data"
  fi
fi
log "استنساخ ✓ — $(git log --oneline -1)"

# ═══════════════════════════ 7 ═══════════════════════════
p "تثبيت الحزم + بناء المشروع"

# ── تثبيت حزم الفرونت ──
info "تثبيت حزم الفرونت..."
npm ci 2>&1 || npm install 2>&1
if [ $? -ne 0 ]; then
  err "فشل تثبيت الحزم — محاولة npm install --legacy-peer-deps..."
  npm install --legacy-peer-deps 2>&1 || die "فشل تثبيت الحزم نهائياً"
fi
log "حزم الفرونت ✓"

# ── تثبيت Puppeteer (للـ Prerendering) — اختياري ──
info "تثبيت Puppeteer..."
PUPPETEER_OK=false
npm install puppeteer --no-save 2>&1 && PUPPETEER_OK=true
if $PUPPETEER_OK; then
  log "Puppeteer ✓"
else
  warn "Puppeteer فشل — Prerendering سيتم تخطيه (الموقع يعمل بدونه)"
  WARNINGS=$((WARNINGS+1))
fi

# ── تثبيت حزم الباكند ──
if [ -f server/package.json ]; then
  info "تثبيت حزم الباكند (server/)..."
  cd server
  if [ -f package-lock.json ]; then
    npm ci 2>&1 || npm install 2>&1 || warn "فشل تثبيت حزم الباكند"
  else
    npm install 2>&1 || warn "فشل تثبيت حزم الباكند"
  fi
  cd "$DIR"
  log "حزم الباكند ✓"
fi

# ── مزامنة Config ──
mkdir -p server/data
if [ -f scripts/sync-config.cjs ]; then
  info "مزامنة API Keys..."
  node scripts/sync-config.cjs 2>&1 && log "مزامنة Config ✓" || warn "مزامنة Config فشلت"
elif [ -f seo-data/config.json ]; then
  if [ -f server/data/config.json ]; then
    node -e "
      const fs = require('fs');
      const seo = JSON.parse(fs.readFileSync('seo-data/config.json','utf8'));
      const srv = JSON.parse(fs.readFileSync('server/data/config.json','utf8'));
      srv.apiKeys = { ...(srv.apiKeys||{}), ...(seo.apiKeys||{}) };
      fs.writeFileSync('server/data/config.json', JSON.stringify(srv, null, 2));
    " 2>&1 && log "مزامنة Config ✓" || warn "مزامنة Config فشلت"
  else
    cp seo-data/config.json server/data/config.json 2>/dev/null
    log "نسخ config → server/data/ ✓"
  fi
fi

[ ! -f .env ] && [ -f .env.example ] && cp .env.example .env && warn ".env.example → .env"

# ── البناء الأول ──
info "بناء المشروع..."
npm run build 2>&1
if [ ! -d dist ]; then
  die "فشل بناء المشروع — dist/ غير موجود"
fi
log "بناء ✓ — $(du -sh dist 2>/dev/null | cut -f1)"

# ── خطوات SEO اختيارية (كل خطوة مستقلة — فشلها لا يوقف شيئاً) ──

# Sitemaps
if [ -f scripts/generate-sitemaps.cjs ]; then
  info "توليد خرائط الموقع (Sitemaps)..."
  node scripts/generate-sitemaps.cjs 2>&1 && log "Sitemaps ✓" || { warn "Sitemaps فشل"; WARNINGS=$((WARNINGS+1)); }
fi

# Programmatic SEO pages
if [ -f scripts/programmatic-seo-generator.cjs ]; then
  info "توليد الصفحات البرمجية..."
  node scripts/programmatic-seo-generator.cjs 2>&1 && log "Programmatic pages ✓" || { warn "Programmatic فشل"; WARNINGS=$((WARNINGS+1)); }
fi

# إعادة البناء النهائي (لتضمين الملفات المولّدة في dist)
info "إعادة البناء النهائي..."
npm run build 2>&1 && log "بناء نهائي ✓ — $(du -sh dist 2>/dev/null | cut -f1)" || warn "البناء النهائي فشل"

# Prerendering — اختياري تماماً
if $PUPPETEER_OK && [ -f scripts/prerender.cjs ]; then
  info "توليد HTML للزواحف (Dynamic Rendering)..."
  timeout 1800 node scripts/prerender.cjs 2>&1 && log "Prerendering ✓ — $(du -sh prerendered 2>/dev/null | cut -f1)" || { warn "Prerendering فشل — الموقع يعمل بدونه"; WARNINGS=$((WARNINGS+1)); }
else
  info "تخطي Prerendering (Puppeteer غير متوفر أو prerender.cjs غير موجود)"
fi

# Noindex thin pages
if [ -f scripts/noindex-programmatic.cjs ]; then
  info "إضافة noindex لصفحات city-status..."
  node scripts/noindex-programmatic.cjs 2>&1 && log "Noindex ✓" || warn "Noindex فشل"
fi

# ═══════════════════════════ 8 ═══════════════════════════
p "إعداد Nginx"
SN="${DOMAINS[*]:-_}"

# تحديد الدومين الرئيسي بدون www
ROOT_DOMAIN="${MAIN:-_}"

cat > /etc/nginx/sites-available/${APP} << NGEOF
# www → root domain 301 redirect (HTTP)
server {
    listen 80;
    server_name www.${ROOT_DOMAIN};
    return 301 https://${ROOT_DOMAIN}\$request_uri;
}

# www → root domain 301 redirect (HTTPS — activated after certbot)
server {
    listen 443 ssl;
    server_name www.${ROOT_DOMAIN};
    ssl_certificate /etc/letsencrypt/live/${ROOT_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${ROOT_DOMAIN}/privkey.pem;
    return 301 https://${ROOT_DOMAIN}\$request_uri;
}

server {
    listen 80;
    server_name ${SN};
    root ${DIR}/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 512;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/javascript application/json application/javascript application/xml image/svg+xml font/woff2;

    # Security
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|webp|avif|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
        proxy_buffering off;
    }

    # SEO
    location ~ /sitemap.*\.xml$ { access_log off; }
    location = /robots.txt { access_log off; }

    # Programmatic SEO pages
    location /programmatic/ {
        try_files \$uri \$uri/ \$uri.html =404;
    }

    # SPA
    location / { try_files \$uri \$uri/ /index.html; }

    # Block sensitive
    location ~ /\. { deny all; access_log off; log_not_found off; }
    location ~ \.(env|git|bak|sql|log)$ { deny all; }

    client_max_body_size 20M;
    access_log /var/log/nginx/${APP}_access.log;
    error_log  /var/log/nginx/${APP}_error.log;
}
NGEOF

ln -sf /etc/nginx/sites-available/${APP} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

if nginx -t 2>&1; then
  systemctl reload nginx
  log "Nginx ✓"
else
  err "خطأ في إعداد Nginx — تحقق يدوياً: nginx -t"
  ERRORS=$((ERRORS+1))
fi

# ═══════════════════════════ 9 ═══════════════════════════
p "تشغيل الباكند بـ PM2"
cd "$DIR"

SF=""
for f in server/index.js server.js server.cjs src/server.js backend/server.js api/index.js; do
  [ -f "$f" ] && SF="$f" && break
done

if [ -n "$SF" ] && command -v pm2 &>/dev/null; then
  # قراءة API keys بأمان
  USPS_UID=""
  USPS_PWD=""
  if [ -f server/data/config.json ]; then
    USPS_UID=$(node -e "try{const c=JSON.parse(require('fs').readFileSync('server/data/config.json','utf8'));console.log(c.apiKeys?.uspsUserId||'')}catch{}" 2>/dev/null) || true
    USPS_PWD=$(node -e "try{const c=JSON.parse(require('fs').readFileSync('server/data/config.json','utf8'));console.log(c.apiKeys?.uspsPassword||'')}catch{}" 2>/dev/null) || true
  fi

  cat > ecosystem.config.cjs << PMEOF
module.exports = {
  apps: [{
    name: '${APP}',
    script: '${SF}',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT},
      USPS_USERID: '${USPS_UID}',
      USPS_PASSWORD: '${USPS_PWD}'
    },
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_restarts: 10,
    restart_delay: 5000
  }]
};
PMEOF
  pm2 start ecosystem.config.cjs 2>&1 && log "PM2 Cluster على :${PORT} ✓" || { err "PM2 فشل في التشغيل"; ERRORS=$((ERRORS+1)); }
  pm2 save 2>/dev/null || true
  pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
else
  if [ -z "$SF" ]; then
    info "موقع ثابت — بدون باكند"
  else
    warn "PM2 غير متوفر — شغّل الباكند يدوياً: node $SF"
  fi
fi

# ═══════════════════════════ 10 ══════════════════════════
p "SSL + تجديد تلقائي"
if [ -n "$MAIN" ] && command -v certbot &>/dev/null; then
  SIP4=$(curl -4 -s --max-time 5 ifconfig.me 2>/dev/null || echo "?")
  info "IPv4: ${SIP4}"

  DA=""
  for d in "${DOMAINS[@]}"; do
    DA="$DA -d $d"
  done

  info "محاولة إصدار شهادة SSL..."
  if certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --redirect \
    --hsts \
    --staple-ocsp \
    $DA 2>&1; then
    log "SSL ✓"
    certbot renew --dry-run 2>&1 | tail -2 && log "dry-run ✓" || true
  else
    warn "SSL عبر nginx فشل — محاولة webroot..."
    if certbot certonly --webroot \
      --webroot-path "${DIR}/dist" \
      --non-interactive \
      --agree-tos \
      --email "$EMAIL" \
      $DA 2>&1; then
      log "SSL webroot ✓"
    else
      warn "SSL فشل — تأكد من DNS:"
      warn "  A Record: ${MAIN} → ${SIP4}"
      warn "  بعد ضبط DNS، شغّل:"
      warn "  sudo certbot --nginx --agree-tos --email ${EMAIL} ${DA}"
      WARNINGS=$((WARNINGS+1))
    fi
  fi

  # تجديد تلقائي
  cat > /usr/local/bin/ssl-renew.sh << 'SSLR'
#!/bin/bash
LOG="/var/log/ssl-renew.log"
echo "[$(date '+%F %T')] checking..." >> "$LOG"
certbot renew --quiet --deploy-hook "systemctl reload nginx" 2>> "$LOG"
echo "[$(date '+%F %T')] done ($?)" >> "$LOG"
[ -f "$LOG" ] && [ $(wc -c < "$LOG") -gt 1048576 ] && tail -50 "$LOG" > "${LOG}.tmp" && mv "${LOG}.tmp" "$LOG"
SSLR
  chmod +x /usr/local/bin/ssl-renew.sh
  if command -v crontab >/dev/null 2>&1; then
    TMP_CRON="/tmp/${APP}-cron.$$"
    (crontab -l 2>/dev/null || true) | grep -v 'ssl-renew.sh' > "$TMP_CRON" || true
    echo "0 3,15 * * * /usr/local/bin/ssl-renew.sh" >> "$TMP_CRON"
    crontab "$TMP_CRON" 2>/dev/null && log "تجديد تلقائي (03:00 + 15:00) ✓" || warn "تعذر تثبيت cron"
    rm -f "$TMP_CRON"
  fi
elif [ -n "$MAIN" ]; then
  warn "certbot غير متوفر — ثبّته يدوياً: apt install certbot python3-certbot-nginx"
  WARNINGS=$((WARNINGS+1))
else
  info "بدون دومين — HTTP فقط"
fi

# ═══════════════════════════ 11 ══════════════════════════
p "أمان + جدار ناري + سجلات"

# UFW
if command -v ufw &>/dev/null; then
  ufw allow 22/tcp  >/dev/null 2>&1 || true
  ufw allow 80/tcp  >/dev/null 2>&1 || true
  ufw allow 443/tcp >/dev/null 2>&1 || true
  ufw --force enable >/dev/null 2>&1 || true
  log "UFW (22/80/443) ✓"
else
  warn "UFW غير متوفر"
fi

# Logrotate
cat > /etc/logrotate.d/${APP} << LR
/var/log/${APP}-*.log /var/log/nginx/${APP}_*.log /var/log/ssl-renew.log {
  daily
  missingok
  rotate 14
  compress
  delaycompress
  notifempty
  sharedscripts
  postrotate
    systemctl reload nginx >/dev/null 2>&1 || true
    pm2 reloadLogs >/dev/null 2>&1 || true
  endscript
}
LR
log "تدوير السجلات (14 يوم) ✓"

# صلاحيات
chown -R www-data:www-data "${DIR}/dist" 2>/dev/null || true
chmod -R 755 "${DIR}/dist" 2>/dev/null || true
log "صلاحيات ✓"

# ═══════════════════════════ 12 ══════════════════════════
p "Cron Jobs + SEO Automation"

# تثبيت Cron Jobs تلقائياً
if [ -f "${DIR}/scripts/cron-setup.sh" ]; then
  info "تثبيت Cron Jobs للـ SEO..."
  bash "${DIR}/scripts/cron-setup.sh" 2>&1 && log "Cron Jobs ✓" || { warn "Cron Jobs فشل"; WARNINGS=$((WARNINGS+1)); }
else
  warn "scripts/cron-setup.sh غير موجود — تخطي Cron"
fi

# IndexNow Ping بعد النشر
if [ -f "${DIR}/scripts/ping-indexnow.cjs" ]; then
  info "إرسال IndexNow ping لمحركات البحث..."
  cd "$DIR"
  node scripts/ping-indexnow.cjs 2>&1 && log "IndexNow ✓" || { warn "IndexNow فشل"; WARNINGS=$((WARNINGS+1)); }
fi

# Sitemap submission إلى Google و Bing
if [ -n "$MAIN" ]; then
  info "إرسال Sitemap لمحركات البحث..."
  SITEMAP_URL="https://${MAIN}/sitemap.xml"
  # Google
  curl -s "https://www.google.com/ping?sitemap=${SITEMAP_URL}" >/dev/null 2>&1 && info "Google pinged ✓" || true
  # Bing
  curl -s "https://www.bing.com/ping?sitemap=${SITEMAP_URL}" >/dev/null 2>&1 && info "Bing pinged ✓" || true
  # IndexNow batch
  curl -s "https://api.indexnow.org/indexnow?url=${SITEMAP_URL}&key=uspostaltracking2025indexnow" >/dev/null 2>&1 || true
  log "Sitemap submission ✓"
fi

# ═══════════════════════════ 13 ══════════════════════════
p "أدوات مساعدة"

# ── تحديث سريع ──
cat > /usr/local/bin/update-site.sh << 'UPD'
#!/bin/bash
set +e
DIR="/var/www/swifttrack-hub"
APP="swifttrack-hub"
echo "🔄 تحديث..."
cd "$DIR" || { echo "❌ المجلد غير موجود"; exit 1; }

# حفظ بيانات server/data
if [ -d server/data ]; then
  cp -r server/data /tmp/server-data-backup 2>/dev/null || true
fi

git pull origin main 2>&1 || git pull origin master 2>&1
if [ -f package-lock.json ]; then npm ci 2>&1; else npm install 2>&1; fi
if [ -f server/package.json ]; then cd server && npm install 2>&1 && cd "$DIR"; fi

# استعادة server/data
if [ -d /tmp/server-data-backup ]; then
  mkdir -p server/data
  cp -rn /tmp/server-data-backup/* server/data/ 2>/dev/null || true
  rm -rf /tmp/server-data-backup
  echo "✅ بيانات server/data محفوظة"
fi

# مزامنة API Keys
if [ -f seo-data/config.json ] && [ -f server/data/config.json ]; then
  node -e "
    const fs = require('fs');
    const seo = JSON.parse(fs.readFileSync('seo-data/config.json','utf8'));
    const srv = JSON.parse(fs.readFileSync('server/data/config.json','utf8'));
    srv.apiKeys = { ...(srv.apiKeys||{}), ...(seo.apiKeys||{}) };
    fs.writeFileSync('server/data/config.json', JSON.stringify(srv, null, 2));
  " 2>/dev/null && echo "✅ Config synced" || true
fi

# Sitemaps
[ -f scripts/generate-sitemaps.cjs ] && node scripts/generate-sitemaps.cjs 2>&1 || true
# Programmatic
[ -f scripts/programmatic-seo-generator.cjs ] && node scripts/programmatic-seo-generator.cjs 2>&1 || true
# Build
npm run build 2>&1
# Prerender
[ -f scripts/prerender.cjs ] && node scripts/prerender.cjs 2>&1 || true
# Noindex
[ -f scripts/noindex-programmatic.cjs ] && node scripts/noindex-programmatic.cjs 2>&1 || true

pm2 reload "$APP" 2>/dev/null || true
systemctl reload nginx 2>/dev/null || true
echo "✅ تم — $(date)"
UPD
chmod +x /usr/local/bin/update-site.sh

# ── فحص صحة ──
cat > /usr/local/bin/health-check.sh << 'HC'
#!/bin/bash
APP="swifttrack-hub"
echo "═══════════════════════════════"
echo "  🏥 ${APP} Health Check"
echo "═══════════════════════════════"
echo "  Load:  $(cat /proc/loadavg | cut -d' ' -f1-3)"
echo "  RAM:   $(free -h | awk '/Mem:/{printf "%s/%s",$3,$2}')"
echo "  Disk:  $(df -h / | awk 'NR==2{printf "%s/%s (%s)",$3,$2,$5}')"
echo "  Nginx: $(systemctl is-active nginx 2>/dev/null || echo unknown)"
echo "  PM2:   $(pm2 jlist 2>/dev/null | jq -r '.[0].pm2_env.status // "off"' 2>/dev/null || echo off)"
echo "  Cron:  $(crontab -l 2>/dev/null | grep -c swifttrack-hub) jobs"
echo "  SSL:"
certbot certificates 2>/dev/null | grep -E "Domains:|Expiry" || echo "    none"
echo "═══════════════════════════════"
HC
chmod +x /usr/local/bin/health-check.sh

log "update-site.sh + health-check.sh ✓"

# ═══════════════════════════ 14 ══════════════════════════
p "الملخص النهائي"
M=$((SECONDS/60)); SC=$((SECONDS%60))
URL="http://$(hostname -I 2>/dev/null | awk '{print $1}')"
[ -n "$MAIN" ] && URL="https://${MAIN}"

echo ""
echo -e "${G}╔═══════════════════════════════════════════════════╗${N}"
echo -e "${G}║                                                   ║${N}"
if [ $ERRORS -eq 0 ]; then
  echo -e "${G}║       🎉  تم النشر الكامل بنجاح!  🎉              ║${N}"
else
  echo -e "${Y}║       ⚠️  تم النشر مع ${ERRORS} خطأ               ║${N}"
fi
echo -e "${G}║                                                   ║${N}"
echo -e "${G}╠═══════════════════════════════════════════════════╣${N}"
echo -e "${G}║${N}  ⏱️  المدة:      ${C}${M}m ${SC}s${N}"
echo -e "${G}║${N}  🌐  الموقع:     ${C}${URL}${N}"
echo -e "${G}║${N}  📊  Node:       ${C}$(node -v 2>/dev/null || echo N/A)${N}"
echo -e "${G}║${N}  🔧  PM2:        ${C}$(pm2 -v 2>/dev/null || echo N/A)${N}"
echo -e "${G}║${N}  🌍  Nginx:      ${C}$(nginx -v 2>&1 | cut -d/ -f2 || echo N/A)${N}"
echo -e "${G}║${N}  🐧  Ubuntu:     ${C}${UBUNTU_VER}${N}"
echo -e "${G}║${N}  🔒  SSL:        ${C}$([ -n "$MAIN" ] && echo "Let's Encrypt" || echo "HTTP only")${N}"
echo -e "${G}║${N}  🔥  Firewall:   ${C}UFW (22/80/443)${N}"
echo -e "${G}║${N}  ⚠️  تحذيرات:   ${Y}${WARNINGS}${N}"
echo -e "${G}║${N}  ❌  أخطاء:     ${R}${ERRORS}${N}"
echo -e "${G}╠═══════════════════════════════════════════════════╣${N}"
echo -e "${G}║${N}  ${Y}أوامر مفيدة:${N}"
echo -e "${G}║${N}    ${C}update-site.sh${N}    تحديث من GitHub + إعادة بناء"
echo -e "${G}║${N}    ${C}health-check.sh${N}   فحص صحة السيرفر"
echo -e "${G}║${N}    ${C}pm2 logs${N}           سجلات التطبيق"
echo -e "${G}║${N}    ${C}pm2 status${N}         حالة العمليات"
echo -e "${G}║${N}    ${C}pm2 reload ${APP}${N}  إعادة تشغيل"
echo -e "${G}╠═══════════════════════════════════════════════════╣${N}"
echo -e "${G}║${N}  ${Y}📝 لا تنسَ:${N}"
echo -e "${G}║${N}    1. عدّل ${C}.env${N} بالقيم الصحيحة"
echo -e "${G}║${N}    2. ${C}pm2 reload ${APP}${N} بعد تعديل .env"
echo -e "${G}╚═══════════════════════════════════════════════════╝${N}"
echo ""
echo -e "${C}🎉 افتح ${URL} في المتصفح!${N}"
echo ""

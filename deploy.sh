#!/bin/bash
########################################################################
#  🚀 US POSTAL TRACKING — ULTIMATE DEPLOY SCRIPT
#  ═══════════════════════════════════════════════════════════════════
#  سكريبت نشر شامل: يثبّت كل شيء، يُعدّ كل شيء، يشغّل كل شيء
#
#  الاستخدام:
#    sudo bash deploy.sh                         ← بدون دومين = HTTP فقط
#    sudo bash deploy.sh uspostaltracking.com     ← دومين واحد + SSL
#    sudo bash deploy.sh uspostaltracking.com www.uspostaltracking.com
#
#  ما يفعله:
#    1.  فحص الصلاحيات والنظام
#    2.  إعداد Swap Memory (2G)
#    3.  تحديث النظام + تثبيت الأدوات
#    4.  Node.js 20 LTS + PM2
#    5.  Nginx
#    6.  Puppeteer + Chrome Dependencies
#    7.  نسخ احتياطي + استنساخ المشروع
#    8.  تثبيت الحزم + بناء المشروع
#    9.  توليد Sitemaps + صفحات SEO
#    10. Prerendering (محذوف — يتم تخطيه دائماً)
#    11. إعداد Nginx الكامل
#    12. تشغيل الباكند (index.js:8080 + api-server.cjs:3001)
#    13. SSL + تجديد تلقائي
#    14. أمان + جدار ناري + سجلات
#    15. Cron Jobs + SEO Automation
#    16. أدوات مساعدة (update-site.sh, health-check.sh)
#    17. فحص نهائي + ملخص
########################################################################

set +e  # لا نوقف عند أي خطأ — نتعامل يدوياً

# ── ألوان ──
R='\033[0;31m'; G='\033[0;32m'; Y='\033[1;33m'
B='\033[0;34m'; C='\033[0;36m'; BD='\033[1m'; N='\033[0m'

log()  { echo -e "${G}✅ $1${N}"; }
warn() { echo -e "${Y}⚠️  $1${N}"; }
err()  { echo -e "${R}❌ $1${N}"; }
die()  { echo -e "${R}❌ $1${N}"; exit 1; }
info() { echo -e "${C}ℹ️  $1${N}"; }
hr()   { echo -e "\n${BD}${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"; echo -e "${BD}${B}  $1${N}"; echo -e "${BD}${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}\n"; }

# ── إعدادات ──
REPO="https://github.com/chafii96/my-code-showcase.git"
APP="uspostaltracking"
DIR="/var/www/${APP}"
BAK="/var/www/backups"
EMAIL="its.rabyawork@gmail.com"
NVER="20"
PORT_MAIN="8080"        # server/index.js — الباكند الرئيسي
PORT_ADMIN="3001"       # server/api-server.cjs — لوحة التحكم
SWAP_SIZE="2G"
DOMAINS=("$@")
MAIN="${DOMAINS[0]:-}"
TOTAL=17; S=0
SECONDS=0; ERRORS=0; WARNINGS=0
p() { S=$((S+1)); hr "${S}/${TOTAL} — $1"; }

echo -e "${C}"
cat << 'ART'
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀  US POSTAL TRACKING — ULTIMATE DEPLOY  🚀            ║
║   سكريبت شامل: يثبّت كل شيء، يُعدّ كل شيء، يشغّل كل شيء ║
║                                                           ║
║   Compatible: Ubuntu 22.04 / 24.04 / 25.x                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
ART
echo -e "${N}"

###################################################################
# 1. فحص الصلاحيات والنظام
###################################################################
p "فحص الصلاحيات والنظام"
[ "$EUID" -ne 0 ] && die "شغّل بـ root:\n  sudo bash deploy.sh uspostaltracking.com"

UBUNTU_VER="unknown"
[ -f /etc/os-release ] && UBUNTU_VER=$(grep VERSION_ID /etc/os-release | cut -d'"' -f2)
log "root ✓ — Ubuntu ${UBUNTU_VER}"

###################################################################
# 2. إعداد Swap Memory (لـ Puppeteer/Chrome)
###################################################################
p "إعداد Swap Memory (${SWAP_SIZE})"
if [ -f /swapfile ]; then
  CURRENT_SWAP=$(swapon --show 2>/dev/null | tail -1 | awk '{print $3}' || echo "?")
  log "Swap موجود (${CURRENT_SWAP})"
else
  info "إنشاء ملف Swap بحجم ${SWAP_SIZE}..."
  fallocate -l $SWAP_SIZE /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null 2>&1
  swapon /swapfile 2>/dev/null
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  log "Swap ${SWAP_SIZE} ✓"
fi

###################################################################
# 3. تحديث النظام + تثبيت الأدوات
###################################################################
p "تحديث النظام + أدوات"
export DEBIAN_FRONTEND=noninteractive

info "تحديث قائمة الحزم..."
apt-get update -qq 2>/dev/null || warn "apt-get update لم يكتمل بالكامل"

# تثبيت ذكي — يتحقق من كل حزمة
try_install() {
  local pkg="$1"
  if apt-cache show "$pkg" >/dev/null 2>&1; then
    apt-get install -y -qq "$pkg" >/dev/null 2>&1 && return 0
  fi
  return 1
}

# حزم أساسية
info "تثبيت الأدوات الأساسية..."
for pkg in git curl wget unzip jq htop ufw logrotate dnsutils build-essential socat ca-certificates gnupg; do
  try_install "$pkg" || warn "تعذر تثبيت $pkg"
done
log "أدوات أساسية ✓"

# Certbot
info "تثبيت Certbot..."
try_install "certbot" || warn "certbot غير متوفر"
try_install "python3-certbot-nginx" || warn "python3-certbot-nginx غير متوفر"

###################################################################
# 4. Node.js v20 + PM2
###################################################################
p "Node.js v${NVER} + PM2"
NEED_NODE=true
if command -v node &>/dev/null; then
  CV=$(node -v | cut -dv -f2 | cut -d. -f1)
  [ "$CV" -ge "$NVER" ] 2>/dev/null && NEED_NODE=false && log "Node $(node -v) موجود ✓"
fi

if $NEED_NODE; then
  info "تثبيت Node.js v${NVER}..."
  curl -fsSL "https://deb.nodesource.com/setup_${NVER}.x" | bash - >/dev/null 2>&1
  apt-get install -y -qq nodejs >/dev/null 2>&1
  command -v node &>/dev/null && log "Node $(node -v) ✓" || die "فشل تثبيت Node.js"
fi

npm install -g pm2@latest >/dev/null 2>&1
command -v pm2 &>/dev/null && log "PM2 $(pm2 -v) ✓" || { warn "فشل تثبيت PM2"; WARNINGS=$((WARNINGS+1)); }

###################################################################
# 5. Nginx
###################################################################
p "Nginx"
apt-get install -y -qq nginx >/dev/null 2>&1
if command -v nginx &>/dev/null; then
  systemctl enable nginx >/dev/null 2>&1
  systemctl start nginx 2>/dev/null
  log "Nginx $(nginx -v 2>&1 | cut -d/ -f2) ✓"
else
  die "فشل تثبيت Nginx"
fi

###################################################################
# 6. Puppeteer + Chrome Dependencies
###################################################################
p "Puppeteer + Chrome Dependencies"

# حزم مع بدائل لـ Ubuntu 24/25
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

CHROME_PKGS_SIMPLE="ca-certificates fonts-liberation fonts-noto-color-emoji xdg-utils wget libxkbcommon0 libxcb-dri3-0 libxss1 libxtst6"

INSTALLED_CHROME=0; FAILED_CHROME=0

for pkg in $CHROME_PKGS_SIMPLE; do
  try_install "$pkg" && INSTALLED_CHROME=$((INSTALLED_CHROME+1))
done

for entry in "${CHROME_PKGS_WITH_ALTS[@]}"; do
  IFS='|' read -r pkg1 pkg2 <<< "$entry"
  if try_install "$pkg1"; then
    INSTALLED_CHROME=$((INSTALLED_CHROME+1))
  elif try_install "$pkg2"; then
    INSTALLED_CHROME=$((INSTALLED_CHROME+1))
  else
    FAILED_CHROME=$((FAILED_CHROME+1))
  fi
done

[ $FAILED_CHROME -gt 5 ] && { warn "فشل ${FAILED_CHROME} حزمة Chrome — Prerendering قد لا يعمل"; WARNINGS=$((WARNINGS+1)); } || log "مكتبات Chrome ✓ (${INSTALLED_CHROME} حزمة)"

###################################################################
# 7. نسخ احتياطي + استنساخ المشروع
###################################################################
p "نسخ احتياطي + استنساخ المشروع"

# إيقاف PM2 القديم
pm2 delete "$APP" 2>/dev/null || true
pm2 delete "${APP}-admin" 2>/dev/null || true
pm2 kill 2>/dev/null || true

if [ -d "$DIR" ]; then
  mkdir -p "$BAK"
  BK="${BAK}/${APP}_$(date +%Y%m%d_%H%M%S)"
  mkdir -p "$BK"

  # حفظ الملفات المهمة
  for f in .env .env.production .env.local; do
    [ -f "${DIR}/$f" ] && cp "${DIR}/$f" "$BK/" && info "حفظ $f"
  done
  [ -d "${DIR}/server/data" ] && cp -r "${DIR}/server/data" "$BK/server-data" && info "حفظ server/data"
  [ -d "${DIR}/seo-data" ] && cp -r "${DIR}/seo-data" "$BK/seo-data" && info "حفظ seo-data"
  [ -d "${DIR}/prerendered" ] && cp -r "${DIR}/prerendered" "$BK/prerendered" && info "حفظ prerendered"

  rm -rf "$DIR"
  log "تنظيف + نسخ احتياطي ✓ → $BK"
else
  info "تثبيت جديد"
fi

# استنساخ
cd /root
rm -rf "/tmp/${APP}" "/root/${APP}" 2>/dev/null || true
git clone --depth 1 "$REPO" "$DIR" 2>&1
[ ! -d "$DIR" ] && die "فشل استنساخ المشروع من GitHub"
cd "$DIR"

# استعادة الملفات المحفوظة
LB=""
[ -d "$BAK" ] && LB=$(ls -td ${BAK}/${APP}_* 2>/dev/null | head -1) || true
if [ -n "$LB" ] && [ -d "$LB" ]; then
  for f in .env .env.production .env.local; do
    [ -f "${LB}/$f" ] && cp "${LB}/$f" . && info "استعادة $f"
  done
  if [ -d "${LB}/server-data" ]; then
    mkdir -p server/data
    cp -rn "${LB}/server-data/"* server/data/ 2>/dev/null && info "استعادة server/data"
  fi
  if [ -d "${LB}/seo-data" ]; then
    mkdir -p seo-data
    cp -rn "${LB}/seo-data/"* seo-data/ 2>/dev/null && info "استعادة seo-data"
  fi
  if [ -d "${LB}/prerendered" ]; then
    cp -r "${LB}/prerendered" . 2>/dev/null && info "استعادة prerendered ($(find prerendered -name '*.html' 2>/dev/null | wc -l) صفحة)"
  fi
fi
log "استنساخ ✓ — $(git log --oneline -1)"

###################################################################
# 8. تثبيت الحزم + بناء المشروع
###################################################################
p "تثبيت الحزم + بناء المشروع"

# ── حزم الفرونت ──
info "تثبيت حزم الفرونت..."
rm -rf node_modules/.vite 2>/dev/null
npm install --legacy-peer-deps 2>&1 || die "فشل تثبيت الحزم نهائياً"
log "حزم الفرونت ✓"

# ── حزم الباكند (server/) + Puppeteer + sharp بالتوازي ──
info "تثبيت حزم الباكند + Puppeteer + sharp بالتوازي..."

(
  if [ -f server/package.json ]; then
    cd server
    npm install --legacy-peer-deps 2>&1 || exit 1
    cd "$DIR"
  fi
) &
PID_SERVER=$!

(
  npm install puppeteer --no-save --legacy-peer-deps 2>&1 || exit 1
  npx puppeteer browsers install chrome 2>&1 || exit 1
) &
PID_PUPPET=$!

npm rebuild sharp 2>&1 && log "sharp ✓" || warn "sharp rebuild فشل — تحسين الصور لن يعمل"

if wait $PID_SERVER 2>/dev/null; then
  [ -f server/package.json ] && log "حزم الباكند ✓"
else
  warn "فشل تثبيت حزم الباكند"
  WARNINGS=$((WARNINGS+1))
fi

PUPPETEER_OK=false
if wait $PID_PUPPET 2>/dev/null; then
  PUPPETEER_OK=true
  log "Puppeteer + Chrome ✓"
else
  warn "Puppeteer فشل — Prerendering سيتم تخطيه"
  WARNINGS=$((WARNINGS+1))
fi

# ── مزامنة Config ──
mkdir -p server/data seo-data
if [ -f scripts/sync-config.cjs ]; then
  info "مزامنة API Keys..."
  node scripts/sync-config.cjs 2>&1 && log "مزامنة Config ✓" || warn "مزامنة Config فشلت"
elif [ -f seo-data/config.json ] && [ -f server/data/config.json ]; then
  node -e "
    const fs = require('fs');
    const seo = JSON.parse(fs.readFileSync('seo-data/config.json','utf8'));
    const srv = JSON.parse(fs.readFileSync('server/data/config.json','utf8'));
    srv.apiKeys = { ...(srv.apiKeys||{}), ...(seo.apiKeys||{}) };
    fs.writeFileSync('server/data/config.json', JSON.stringify(srv, null, 2));
  " 2>&1 && log "مزامنة Config ✓" || warn "مزامنة Config فشلت"
elif [ -f seo-data/config.json ]; then
  cp seo-data/config.json server/data/config.json 2>/dev/null
  log "نسخ config → server/data/ ✓"
fi

[ ! -f .env ] && [ -f .env.example ] && cp .env.example .env && warn ".env.example → .env"

# ── تنظيف ملفات HTML القديمة ──
info "حذف ملفات HTML الثابتة القديمة..."
for d in public/city public/article public/zip public/state public/status public/locations; do
  [ -d "$d" ] && rm -rf "$d" && info "حذف $d"
done

# ── البناء الأول ──
info "بناء المشروع (build:client-only)..."
npm run build:client-only 2>&1
[ ! -d dist ] && die "فشل بناء المشروع — dist/ غير موجود"
log "بناء ✓ — $(du -sh dist 2>/dev/null | cut -f1)"

###################################################################
# 9. توليد Sitemaps + صفحات SEO
###################################################################
p "توليد Sitemaps + صفحات SEO"

# تحديث sitemap-carriers.xml من مصدر carriers الفعلي
if [ -f scripts/generate-carrier-sitemap.cjs ]; then
  info "تحديث sitemap-carriers.xml..."
  node scripts/generate-carrier-sitemap.cjs 2>&1 && log "sitemap-carriers ✓" || { warn "generate-carrier-sitemap.cjs فشل"; WARNINGS=$((WARNINGS+1)); }
fi

# Master Generator — يولّد الصفحات البرمجية + sitemap-programmatic + sitemap index
if [ -f scripts/generate-all.cjs ]; then
  info "تشغيل generate-all.cjs (توليد شامل + sitemap index)..."
  node scripts/generate-all.cjs 2>&1 && log "generate-all.cjs ✓" || { warn "generate-all.cjs فشل"; WARNINGS=$((WARNINGS+1)); }
else
  die "scripts/generate-all.cjs غير موجود — لا يمكن متابعة النشر"
fi

# فحص تغطية جميع static routes داخل السايتمابات
if [ -f scripts/verify-sitemap-coverage.cjs ]; then
  info "التحقق من تغطية Routes داخل السايتماب..."
  node scripts/verify-sitemap-coverage.cjs 2>&1 && log "Route/Sitemap coverage ✓" || { warn "يوجد Routes غير موجودة داخل السايتمابات"; WARNINGS=$((WARNINGS+1)); }
fi

# إعادة البناء لتضمين الملفات المولّدة
info "إعادة البناء النهائي..."
npm run build:client-only 2>&1 && log "بناء نهائي ✓ — $(du -sh dist 2>/dev/null | cut -f1)" || warn "البناء النهائي فشل"

# نسخ السايتمابات إلى dist/ (مهم! Vite لا ينسخ الملفات المولّدة بعد البناء)
info "نسخ السايتمابات إلى dist/..."
cp -f public/sitemap*.xml dist/ 2>/dev/null && log "سايتمابات → dist/ ✓" || warn "فشل نسخ السايتمابات"
cp -f public/robots.txt dist/ 2>/dev/null || true

# التحقق من اكتمال sitemap.xml
SITEMAP_COUNT=$(grep -c '<sitemap>' dist/sitemap.xml 2>/dev/null || echo "0")
SITEMAP_FILES=$(ls -1 public/sitemap-*.xml 2>/dev/null | wc -l)
if [ "$SITEMAP_COUNT" -lt "$SITEMAP_FILES" ]; then
  warn "sitemap.xml يحتوي $SITEMAP_COUNT فقط من أصل $SITEMAP_FILES سايتماب!"
  WARNINGS=$((WARNINGS+1))
else
  log "sitemap.xml مكتمل: $SITEMAP_COUNT سايتماب ✓"
fi

###################################################################
# 10. Prerendering — محذوف (تخطي دائم)
###################################################################
p "Prerendering (تخطي — الصفحات مولّدة مسبقاً)"

PRERENDER_COUNT=$(find "${DIR}/prerendered" -name "*.html" 2>/dev/null | wc -l)
if [ "$PRERENDER_COUNT" -gt 0 ]; then
  log "Prerendered: ${PRERENDER_COUNT} صفحة موجودة مسبقاً ✓"
else
  info "لا توجد صفحات prerendered — يمكن توليدها لاحقاً يدوياً:"
  info "  node scripts/prerender.cjs"
fi

# noindex thin pages فقط
[ -f scripts/noindex-programmatic.cjs ] && { info "إضافة noindex..."; node scripts/noindex-programmatic.cjs 2>&1 || true; }

###################################################################
# 11. إعداد Nginx الكامل
###################################################################
p "إعداد Nginx"

SN="${DOMAINS[*]:-_}"
ROOT_DOMAIN="${MAIN:-_}"

# كشف وجود شهادات SSL
SSL_EXISTS=false
SSL_CERT=""
SSL_KEY=""

# تحقق من acme.sh (fullchain) أولاً ثم certbot
if [ -f "/etc/ssl/${APP}/fullchain.pem" ] && [ -f "/etc/ssl/${APP}/key.pem" ]; then
  SSL_EXISTS=true
  SSL_CERT="/etc/ssl/${APP}/fullchain.pem"
  SSL_KEY="/etc/ssl/${APP}/key.pem"
elif [ -f "/etc/ssl/${APP}/cert.pem" ] && [ -f "/etc/ssl/${APP}/key.pem" ]; then
  SSL_EXISTS=true
  SSL_CERT="/etc/ssl/${APP}/cert.pem"
  SSL_KEY="/etc/ssl/${APP}/key.pem"
elif [ -f "/etc/letsencrypt/live/${ROOT_DOMAIN}/fullchain.pem" ]; then
  SSL_EXISTS=true
  SSL_CERT="/etc/letsencrypt/live/${ROOT_DOMAIN}/fullchain.pem"
  SSL_KEY="/etc/letsencrypt/live/${ROOT_DOMAIN}/privkey.pem"
fi

# إزالة الإعدادات القديمة
rm -f /etc/nginx/sites-enabled/default 2>/dev/null
rm -f /etc/nginx/sites-enabled/${APP} /etc/nginx/sites-enabled/${APP}.conf 2>/dev/null
rm -f /etc/nginx/sites-available/${APP} /etc/nginx/sites-available/${APP}.conf 2>/dev/null

if $SSL_EXISTS; then
  info "شهادات SSL موجودة — إعداد HTTPS"

  # كشف DH params
  DH_PARAM=""
  if [ -f /etc/letsencrypt/ssl-dhparams.pem ]; then
    DH_PARAM="    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;"
  elif [ -f /etc/ssl/dhparams.pem ]; then
    DH_PARAM="    ssl_dhparam         /etc/ssl/dhparams.pem;"
  fi

  # كشف options-ssl-nginx.conf
  SSL_INCLUDE=""
  [ -f /etc/letsencrypt/options-ssl-nginx.conf ] && SSL_INCLUDE="    include             /etc/letsencrypt/options-ssl-nginx.conf;"

  cat > /etc/nginx/sites-available/${APP} << NGEOF
# ── HTTP: redirect everything to HTTPS ────────────────────────────────────
server {
    listen 80;
    listen [::]:80;
    server_name ${SN};
    return 301 https://${ROOT_DOMAIN}\$request_uri;
}

# ── www → root redirect ──────────────────────────────────────────────────
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.${ROOT_DOMAIN};

    ssl_certificate ${SSL_CERT};
    ssl_certificate_key ${SSL_KEY};
${SSL_INCLUDE}
${DH_PARAM}

    return 301 https://${ROOT_DOMAIN}\$request_uri;
}

# ── Main HTTPS Server ────────────────────────────────────────────────────
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name ${ROOT_DOMAIN};
    root ${DIR}/dist;
    index index.html;

    # ── SSL ───────────────────────────────────────────────────────────────
    ssl_certificate ${SSL_CERT};
    ssl_certificate_key ${SSL_KEY};
${SSL_INCLUDE}
${DH_PARAM}

    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_stapling        on;
    ssl_stapling_verify on;
    resolver            8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout    5s;

    # ── Security Headers ──────────────────────────────────────────────────
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # ── Gzip Compression ─────────────────────────────────────────────────
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml
        application/xml+rss
        application/atom+xml
        image/svg+xml
        font/woff2;

    # ── Upload Size ───────────────────────────────────────────────────────
    client_max_body_size 20M;

    # ── Logging ───────────────────────────────────────────────────────────
    access_log /var/log/nginx/${APP}_access.log;
    error_log  /var/log/nginx/${APP}_error.log warn;

    # ── Block Bad Bots & Crawlers ─────────────────────────────────────────
    if (\$http_user_agent ~* (semalt|majestic|rogerbot|dotbot|ahrefsbot|mj12bot|blexbot|scrapy)) {
        return 403;
    }

    # ── Block sensitive files ─────────────────────────────────────────────
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    location ~ \.(env|git|bak|sql|sh|config|log)$ {
        deny all;
        return 404;
    }

    # ── Sitemap + Robots — SEO critical ───────────────────────────────────
    location = /robots.txt {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        access_log off;
        try_files \$uri =404;
    }
    location ~ ^/sitemap.*\.xml$ {
        expires 1d;
        add_header Cache-Control "public, max-age=86400";
        access_log off;
        try_files \$uri =404;
    }

    # ── API Proxy → server/index.js (port ${PORT_MAIN}, PM2 cluster) ─────
    location /api/ {
        proxy_pass          http://127.0.0.1:${PORT_MAIN};
        proxy_http_version  1.1;
        proxy_set_header    Upgrade \$http_upgrade;
        proxy_set_header    Connection 'upgrade';
        proxy_set_header    Host \$host;
        proxy_set_header    X-Real-IP \$remote_addr;
        proxy_set_header    X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto \$scheme;
        proxy_cache_bypass  \$http_upgrade;
        proxy_read_timeout  60s;
        proxy_connect_timeout 10s;
        proxy_send_timeout  60s;
        proxy_buffering     off;

        # CORS preflight
        if (\$request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin  "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept";
            add_header Content-Length 0;
            return 204;
        }
    }

    # ── Admin API Proxy → server/api-server.cjs (port ${PORT_ADMIN}) ─────
    location /admin-api/ {
        rewrite ^/admin-api/(.*) /api/\$1 break;
        proxy_pass          http://127.0.0.1:${PORT_ADMIN};
        proxy_http_version  1.1;
        proxy_set_header    Host \$host;
        proxy_set_header    X-Real-IP \$remote_addr;
        proxy_set_header    X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto \$scheme;
        proxy_cache_bypass  \$http_upgrade;
        proxy_read_timeout  60s;
        proxy_connect_timeout 10s;
        proxy_send_timeout  60s;
        proxy_buffering     off;
    }

    # ── Hashed Static Assets — immutable cache 1 year ─────────────────────
    location ~* /assets/.*\.(js|css|woff2?|ttf|eot|png|jpg|jpeg|gif|ico|svg|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable, max-age=31536000";
        access_log off;
        try_files \$uri =404;
    }

    # ── Non-hashed fonts — immutable + CORS ───────────────────────────────
    location ~* \.(woff2?|ttf|eot|otf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
        try_files \$uri =404;
    }

    # ── Tracking page — short cache ───────────────────────────────────────
    location ~* ^/track/[A-Za-z0-9]+$ {
        expires 5m;
        add_header Cache-Control "public, max-age=300";
        try_files \$uri \$uri/index.html /index.html;
    }

    # ── Admin panel — no cache ────────────────────────────────────────────
    location ^~ /admin {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        try_files \$uri \$uri/ /index.html;
    }

    # ── Programmatic SEO pages ────────────────────────────────────────────
    location /programmatic/ {
        try_files \$uri \$uri/ \$uri.html =404;
    }

    # ── Prerendered SEO Shells: serve shell first, then SPA fallback ──────
    location / {
        expires 1h;
        add_header Cache-Control "public, max-age=3600, must-revalidate";
        try_files \$uri \$uri/index.html \$uri/ /index.html;
    }

    # ── Legacy redirects (GSC coverage fixes) ─────────────────────────────
    location = /track-without-number          { return 301 /guides/track-without-tracking-number; }
    location = /mobile-tracking               { return 301 /guides/usps-mobile-tracking; }
    location = /tracking-number-format        { return 301 /guides/tracking-number-format; }
    location = /usps-informed-delivery-guide  { return 301 /guides/usps-informed-delivery; }
    location = /de                            { return 301 /; }
    location = /de/                           { return 301 /; }
    location ~* ^/de/(.*)$                    { return 301 /\$1; }
}
NGEOF
else
  info "بدون SSL — إعداد HTTP فقط"
  cat > /etc/nginx/sites-available/${APP} << NGEOF
server {
    listen 80;
    listen [::]:80;
    server_name ${SN};
    root ${DIR}/dist;
    index index.html;

    # ── Gzip Compression ─────────────────────────────────────────────────
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml
        application/xml+rss
        application/atom+xml
        image/svg+xml
        font/woff2;

    # ── Security Headers ──────────────────────────────────────────────────
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # ── Upload Size ───────────────────────────────────────────────────────
    client_max_body_size 20M;

    # ── Logging ───────────────────────────────────────────────────────────
    access_log /var/log/nginx/${APP}_access.log;
    error_log  /var/log/nginx/${APP}_error.log warn;

    # ── Block Bad Bots & Crawlers ─────────────────────────────────────────
    if (\$http_user_agent ~* (semalt|majestic|rogerbot|dotbot|ahrefsbot|mj12bot|blexbot|scrapy)) {
        return 403;
    }

    # ── Block sensitive files ─────────────────────────────────────────────
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    location ~ \.(env|git|bak|sql|sh|config|log)$ {
        deny all;
        return 404;
    }

    # ── Sitemap + Robots — SEO critical ───────────────────────────────────
    location = /robots.txt {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        access_log off;
        try_files \$uri =404;
    }
    location ~ ^/sitemap.*\.xml$ {
        expires 1d;
        add_header Cache-Control "public, max-age=86400";
        access_log off;
        try_files \$uri =404;
    }

    # ── API Proxy → server/index.js (port ${PORT_MAIN}) ──────────────────
    location /api/ {
        proxy_pass          http://127.0.0.1:${PORT_MAIN};
        proxy_http_version  1.1;
        proxy_set_header    Upgrade \$http_upgrade;
        proxy_set_header    Connection 'upgrade';
        proxy_set_header    Host \$host;
        proxy_set_header    X-Real-IP \$remote_addr;
        proxy_set_header    X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto \$scheme;
        proxy_cache_bypass  \$http_upgrade;
        proxy_read_timeout  60s;
        proxy_connect_timeout 10s;
        proxy_send_timeout  60s;
        proxy_buffering     off;

        # CORS preflight
        if (\$request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin  "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept";
            add_header Content-Length 0;
            return 204;
        }
    }

    # ── Admin API Proxy → server/api-server.cjs (port ${PORT_ADMIN}) ─────
    location /admin-api/ {
        rewrite ^/admin-api/(.*) /api/\$1 break;
        proxy_pass          http://127.0.0.1:${PORT_ADMIN};
        proxy_http_version  1.1;
        proxy_set_header    Host \$host;
        proxy_set_header    X-Real-IP \$remote_addr;
        proxy_set_header    X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto \$scheme;
        proxy_cache_bypass  \$http_upgrade;
        proxy_read_timeout  60s;
        proxy_connect_timeout 10s;
        proxy_send_timeout  60s;
        proxy_buffering     off;
    }

    # ── Hashed Static Assets — immutable cache 1 year ─────────────────────
    location ~* /assets/.*\.(js|css|woff2?|ttf|eot|png|jpg|jpeg|gif|ico|svg|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable, max-age=31536000";
        access_log off;
        try_files \$uri =404;
    }

    # ── Non-hashed fonts — immutable + CORS ───────────────────────────────
    location ~* \.(woff2?|ttf|eot|otf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
        try_files \$uri =404;
    }

    # ── Tracking page — short cache ───────────────────────────────────────
    location ~* ^/track/[A-Za-z0-9]+$ {
        expires 5m;
        add_header Cache-Control "public, max-age=300";
        try_files \$uri \$uri/index.html /index.html;
    }

    # ── Admin panel — no cache ────────────────────────────────────────────
    location ^~ /admin {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        try_files \$uri \$uri/ /index.html;
    }

    # ── Programmatic SEO pages ────────────────────────────────────────────
    location /programmatic/ {
        try_files \$uri \$uri/ \$uri.html =404;
    }

    # ── Prerendered SEO Shells: serve shell first, then SPA fallback ──────
    location / {
        expires 1h;
        add_header Cache-Control "public, max-age=3600, must-revalidate";
        try_files \$uri \$uri/index.html \$uri/ /index.html;
    }

    # ── Legacy redirects (GSC coverage fixes) ─────────────────────────────
    location = /track-without-number          { return 301 /guides/track-without-tracking-number; }
    location = /mobile-tracking               { return 301 /guides/usps-mobile-tracking; }
    location = /tracking-number-format        { return 301 /guides/tracking-number-format; }
    location = /usps-informed-delivery-guide  { return 301 /guides/usps-informed-delivery; }
    location = /de                            { return 301 /; }
    location = /de/                           { return 301 /; }
    location ~* ^/de/(.*)$                    { return 301 /\$1; }
}
NGEOF
fi

ln -sf /etc/nginx/sites-available/${APP} /etc/nginx/sites-enabled/
if nginx -t 2>&1; then
  systemctl reload nginx
  log "Nginx ✓"
else
  err "خطأ في إعداد Nginx — تحقق يدوياً: nginx -t"
  ERRORS=$((ERRORS+1))
fi

###################################################################
# 12. تشغيل الباكند بـ PM2 (كلا السيرفرين)
###################################################################
p "تشغيل الباكند بـ PM2"
cd "$DIR"

# قراءة API Keys
USPS_UID=""; USPS_PWD=""
if [ -f server/data/config.json ]; then
  USPS_UID=$(node -e "try{const c=JSON.parse(require('fs').readFileSync('server/data/config.json','utf8'));console.log(c.apiKeys?.uspsUserId||'')}catch{}" 2>/dev/null) || true
  USPS_PWD=$(node -e "try{const c=JSON.parse(require('fs').readFileSync('server/data/config.json','utf8'));console.log(c.apiKeys?.uspsPassword||'')}catch{}" 2>/dev/null) || true
fi

# فحص ملفات الباكند
MAIN_SERVER=""; ADMIN_SERVER=""
[ -f server/index.js ] && MAIN_SERVER="server/index.js"
[ -f server/api-server.cjs ] && ADMIN_SERVER="server/api-server.cjs"

# فحص Syntax قبل التشغيل
if [ -n "$MAIN_SERVER" ]; then
  info "فحص $MAIN_SERVER..."
  node -c "$MAIN_SERVER" 2>&1 || { err "$MAIN_SERVER به أخطاء!"; ERRORS=$((ERRORS+1)); MAIN_SERVER=""; }
fi
if [ -n "$ADMIN_SERVER" ]; then
  info "فحص $ADMIN_SERVER..."
  node -c "$ADMIN_SERVER" 2>&1 || { err "$ADMIN_SERVER به أخطاء!"; ERRORS=$((ERRORS+1)); ADMIN_SERVER=""; }
fi

# إنشاء ecosystem.config.cjs الشامل
cat > ecosystem.config.cjs << PMEOF
module.exports = {
  apps: [
PMEOF

if [ -n "$MAIN_SERVER" ]; then
  cat >> ecosystem.config.cjs << PMEOF
    {
      name: '${APP}',
      script: '${MAIN_SERVER}',
      cwd: '${DIR}',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: ${PORT_MAIN},
        USPS_USERID: '${USPS_UID}',
        USPS_PASSWORD: '${USPS_PWD}'
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_restarts: 10,
      restart_delay: 5000
    },
PMEOF
fi

if [ -n "$ADMIN_SERVER" ]; then
  cat >> ecosystem.config.cjs << PMEOF
    {
      name: '${APP}-admin',
      script: '${ADMIN_SERVER}',
      cwd: '${DIR}',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: ${PORT_ADMIN}
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_restarts: 10,
      restart_delay: 5000
    },
PMEOF
fi

cat >> ecosystem.config.cjs << PMEOF
  ]
};
PMEOF

# تشغيل PM2
pm2 kill 2>/dev/null || true
rm -f ~/.pm2/dump.pm2 2>/dev/null
sleep 2

if command -v pm2 &>/dev/null; then
  pm2 start ecosystem.config.cjs 2>&1

  sleep 3

  # تحقق من الباكند الرئيسي
  if [ -n "$MAIN_SERVER" ]; then
    API_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:${PORT_MAIN}/api/health 2>/dev/null || echo "000")
    if [ "$API_TEST" = "200" ]; then
      log "Backend الرئيسي (port ${PORT_MAIN}) ✓"
    else
      warn "Backend الرئيسي يرجع HTTP $API_TEST — تحقق: pm2 logs ${APP}"
      WARNINGS=$((WARNINGS+1))
    fi
  fi

  # تحقق من باكند الإدارة
  if [ -n "$ADMIN_SERVER" ]; then
    ADMIN_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:${PORT_ADMIN}/api/health 2>/dev/null || echo "000")
    if [ "$ADMIN_TEST" = "200" ]; then
      log "Admin API (port ${PORT_ADMIN}) ✓"
    else
      warn "Admin API يرجع HTTP $ADMIN_TEST — تحقق: pm2 logs ${APP}-admin"
      WARNINGS=$((WARNINGS+1))
    fi
  fi

  pm2 save 2>/dev/null || true
  pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
  log "PM2 auto-startup ✓"
else
  warn "PM2 غير متوفر — شغّل الباكند يدوياً"
  WARNINGS=$((WARNINGS+1))
fi

###################################################################
# 13. SSL + تجديد تلقائي
###################################################################
p "SSL + تجديد تلقائي"

if $SSL_EXISTS; then
  log "شهادات SSL موجودة بالفعل"
elif [ -n "$MAIN" ]; then
  info "محاولة إصدار شهادة SSL..."
  SIP4=$(curl -4 -s --max-time 5 ifconfig.me 2>/dev/null || echo "?")
  info "IPv4: ${SIP4}"

  DA=""
  for d in "${DOMAINS[@]}"; do DA="$DA -d $d"; done

  SSL_DONE=false

  # محاولة 1: acme.sh + ZeroSSL (الأولوية)
  info "محاولة SSL عبر acme.sh + ZeroSSL..."
  if [ ! -f ~/.acme.sh/acme.sh ]; then
    curl https://get.acme.sh | sh -s email=$EMAIL 2>&1 || true
    source ~/.bashrc 2>/dev/null || true
  fi
  if [ -f ~/.acme.sh/acme.sh ]; then
    ~/.acme.sh/acme.sh --register-account -m $EMAIL --server zerossl 2>/dev/null || true
    systemctl stop nginx 2>/dev/null
    if ~/.acme.sh/acme.sh --issue $DA --standalone --server zerossl --force 2>&1; then
      mkdir -p /etc/ssl/${APP}
      ~/.acme.sh/acme.sh --install-cert -d $MAIN \
        --key-file /etc/ssl/${APP}/key.pem \
        --fullchain-file /etc/ssl/${APP}/fullchain.pem \
        --reloadcmd "systemctl reload nginx" 2>&1
      log "SSL (acme.sh/ZeroSSL) ✓"
      SSL_DONE=true
    fi
    systemctl start nginx 2>/dev/null
  fi

  # محاولة 2: certbot --nginx (بديل)
  if ! $SSL_DONE && command -v certbot &>/dev/null; then
    info "محاولة SSL عبر certbot --nginx..."
    if certbot --nginx --non-interactive --agree-tos --email "$EMAIL" --redirect $DA 2>&1; then
      log "SSL (certbot) ✓"
      SSL_DONE=true
    else
      warn "certbot فشل أيضاً"
    fi
  fi

  if $SSL_DONE; then
    warn "أعد تشغيل deploy.sh لتحويل Nginx إلى HTTPS"

    # تجديد تلقائي
    cat > /usr/local/bin/ssl-renew.sh << 'SSLR'
#!/bin/bash
LOG="/var/log/ssl-renew.log"
echo "[$(date '+%F %T')] checking..." >> "$LOG"
certbot renew --quiet --deploy-hook "systemctl reload nginx" 2>> "$LOG" || true
~/.acme.sh/acme.sh --renew-all --force 2>> "$LOG" || true
echo "[$(date '+%F %T')] done ($?)" >> "$LOG"
[ -f "$LOG" ] && [ $(wc -c < "$LOG") -gt 1048576 ] && tail -50 "$LOG" > "${LOG}.tmp" && mv "${LOG}.tmp" "$LOG"
SSLR
    chmod +x /usr/local/bin/ssl-renew.sh
    TMP_CRON="/tmp/${APP}-ssl-cron.$$"
    (crontab -l 2>/dev/null || true) | grep -v 'ssl-renew.sh' > "$TMP_CRON" || true
    echo "0 3,15 * * * /usr/local/bin/ssl-renew.sh" >> "$TMP_CRON"
    crontab "$TMP_CRON" 2>/dev/null && log "تجديد SSL تلقائي (03:00 + 15:00) ✓"
    rm -f "$TMP_CRON"
  else
    warn "SSL فشل — تأكد من DNS:"
    warn "  A Record: ${MAIN} → ${SIP4}"
    WARNINGS=$((WARNINGS+1))
  fi
else
  info "بدون دومين — HTTP فقط"
fi

###################################################################
# 14. أمان + جدار ناري + سجلات
###################################################################
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

###################################################################
# 15. Cron Jobs + SEO Automation
###################################################################
p "Cron Jobs + SEO Automation"

# تثبيت Cron Jobs
if [ -f "${DIR}/scripts/cron-setup.sh" ]; then
  info "تثبيت Cron Jobs..."
  bash "${DIR}/scripts/cron-setup.sh" 2>&1 && log "Cron Jobs ✓" || { warn "Cron Jobs فشل"; WARNINGS=$((WARNINGS+1)); }
fi

# IndexNow Ping
if [ -f "${DIR}/scripts/ping-indexnow.cjs" ]; then
  info "إرسال IndexNow ping..."
  cd "$DIR"
  node scripts/ping-indexnow.cjs 2>&1 && log "IndexNow ✓" || warn "IndexNow فشل"
fi

# Sitemap submission
if [ -n "$MAIN" ]; then
  info "إرسال Sitemap لمحركات البحث..."
  SITEMAP_URL="https://${MAIN}/sitemap.xml"
  curl -s "https://www.google.com/ping?sitemap=${SITEMAP_URL}" >/dev/null 2>&1 && info "Google ✓" || true
  curl -s "https://www.bing.com/ping?sitemap=${SITEMAP_URL}" >/dev/null 2>&1 && info "Bing ✓" || true
  curl -s "https://api.indexnow.org/indexnow?url=${SITEMAP_URL}&key=uspostaltracking2025indexnow" >/dev/null 2>&1 || true
  log "Sitemap submission ✓"
fi

###################################################################
# 16. أدوات مساعدة
###################################################################
p "أدوات مساعدة"

# ── تحديث سريع ──
cat > /usr/local/bin/update-site.sh << 'UPD'
#!/bin/bash
set +e
DIR="/var/www/uspostaltracking"
APP="uspostaltracking"
echo "🔄 تحديث..."
cd "$DIR" || { echo "❌ المجلد غير موجود"; exit 1; }

# حفظ البيانات
cp -r server/data /tmp/server-data-backup 2>/dev/null || true
cp -r seo-data /tmp/seo-data-backup 2>/dev/null || true

git stash 2>/dev/null || true
git pull origin main 2>&1 || git pull origin master 2>&1
npm install --legacy-peer-deps 2>&1
[ -f server/package.json ] && { cd server && npm install --legacy-peer-deps 2>&1 && cd "$DIR"; }

# استعادة البيانات
[ -d /tmp/server-data-backup ] && { mkdir -p server/data; cp -rn /tmp/server-data-backup/* server/data/ 2>/dev/null; rm -rf /tmp/server-data-backup; }
[ -d /tmp/seo-data-backup ] && { mkdir -p seo-data; cp -rn /tmp/seo-data-backup/* seo-data/ 2>/dev/null; rm -rf /tmp/seo-data-backup; }

# مزامنة Config
[ -f scripts/sync-config.cjs ] && node scripts/sync-config.cjs 2>&1 || true

# تنظيف HTML القديم
for d in public/city public/article public/zip public/state public/status public/locations; do
  [ -d "$d" ] && rm -rf "$d"
done

# تحديث carrier sitemap + Master Generator + التحقق من التغطية
[ -f scripts/generate-carrier-sitemap.cjs ] && node scripts/generate-carrier-sitemap.cjs 2>&1 || true
[ -f scripts/generate-all.cjs ] && node scripts/generate-all.cjs 2>&1 || true
[ -f scripts/verify-sitemap-coverage.cjs ] && node scripts/verify-sitemap-coverage.cjs 2>&1 || true

# Build
npm run build:client-only 2>&1

# نسخ السايتمابات إلى dist/
cp -f public/sitemap*.xml dist/ 2>/dev/null || true
cp -f public/robots.txt dist/ 2>/dev/null || true

# تخطي Prerender — الصفحات مولّدة مسبقاً
echo "ℹ️  Prerender: تخطي (الصفحات موجودة مسبقاً)"
[ -f scripts/noindex-programmatic.cjs ] && node scripts/noindex-programmatic.cjs 2>&1 || true

# Restart
pm2 reload "$APP" 2>/dev/null || true
pm2 reload "${APP}-admin" 2>/dev/null || true
systemctl reload nginx 2>/dev/null || true

# Ping
[ -f scripts/ping-indexnow.cjs ] && node scripts/ping-indexnow.cjs 2>&1 || true

echo "✅ تم — $(date)"
UPD
chmod +x /usr/local/bin/update-site.sh

# ── فحص صحة ──
cat > /usr/local/bin/health-check.sh << 'HC'
#!/bin/bash
APP="uspostaltracking"
echo "═══════════════════════════════════"
echo "  🏥 ${APP} — Health Check"
echo "═══════════════════════════════════"
echo "  Load:    $(cat /proc/loadavg | cut -d' ' -f1-3)"
echo "  RAM:     $(free -h | awk '/Mem:/{printf "%s/%s",$3,$2}')"
echo "  Swap:    $(free -h | awk '/Swap:/{printf "%s/%s",$3,$2}')"
echo "  Disk:    $(df -h / | awk 'NR==2{printf "%s/%s (%s)",$3,$2,$5}')"
echo "  Nginx:   $(systemctl is-active nginx 2>/dev/null || echo unknown)"
echo "  PM2 Main:  $(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="uspostaltracking") | .pm2_env.status // "off"' 2>/dev/null || echo off)"
echo "  PM2 Admin: $(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="uspostaltracking-admin") | .pm2_env.status // "off"' 2>/dev/null || echo off)"
echo "  API 8080:  $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/api/health 2>/dev/null || echo down)"
echo "  API 3001:  $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3001/api/health 2>/dev/null || echo down)"
echo "  Cron:    $(crontab -l 2>/dev/null | grep -c uspostaltracking) jobs"
echo "  Build:   $(du -sh /var/www/uspostaltracking/dist 2>/dev/null | cut -f1 || echo N/A)"
echo "  Prerender: $(find /var/www/uspostaltracking/prerendered -name '*.html' 2>/dev/null | wc -l) pages"
echo "  SSL:"
certbot certificates 2>/dev/null | grep -E "Domains:|Expiry" || echo "    checking acme.sh..."
~/.acme.sh/acme.sh --list 2>/dev/null | head -3 || echo "    none"
echo "═══════════════════════════════════"
HC
chmod +x /usr/local/bin/health-check.sh

# ── إعادة تشغيل سريع ──
cat > /usr/local/bin/restart-site.sh << 'RST'
#!/bin/bash
echo "🔄 إعادة تشغيل..."
pm2 reload uspostaltracking 2>/dev/null || true
pm2 reload uspostaltracking-admin 2>/dev/null || true
systemctl reload nginx 2>/dev/null || true
echo "✅ تم — $(date)"
pm2 status
RST
chmod +x /usr/local/bin/restart-site.sh

log "أدوات مساعدة ✓ (update-site.sh, health-check.sh, restart-site.sh)"

###################################################################
# 17. الملخص النهائي + فحص شامل
###################################################################
p "فحص نهائي + ملخص"

# فحوصات
echo ""
info "فحوصات نهائية..."

# Nginx
systemctl is-active --quiet nginx && log "Nginx: يعمل" || { warn "Nginx: متوقف"; ERRORS=$((ERRORS+1)); }

# PM2 — Main
PM2_MAIN=$(pm2 jlist 2>/dev/null | jq -r ".[] | select(.name==\"${APP}\") | .pm2_env.status" 2>/dev/null)
[ "$PM2_MAIN" = "online" ] && log "PM2 Main (${PORT_MAIN}): online" || { warn "PM2 Main: ${PM2_MAIN:-not found}"; WARNINGS=$((WARNINGS+1)); }

# PM2 — Admin
PM2_ADMIN=$(pm2 jlist 2>/dev/null | jq -r ".[] | select(.name==\"${APP}-admin\") | .pm2_env.status" 2>/dev/null)
[ "$PM2_ADMIN" = "online" ] && log "PM2 Admin (${PORT_ADMIN}): online" || { warn "PM2 Admin: ${PM2_ADMIN:-not found}"; WARNINGS=$((WARNINGS+1)); }

# API Health
API_H=$(curl -s http://127.0.0.1:${PORT_MAIN}/api/health 2>/dev/null)
echo "$API_H" | grep -q "ok" && log "API /health ✓" || { warn "API /health لا يستجيب"; WARNINGS=$((WARNINGS+1)); }

# Build
[ -d "${DIR}/dist" ] && [ -f "${DIR}/dist/index.html" ] && log "Build: $(du -sh ${DIR}/dist | cut -f1)" || { warn "dist/index.html غير موجود!"; ERRORS=$((ERRORS+1)); }

# Prerendered
PRERENDER_COUNT=$(find "${DIR}/prerendered" -name "*.html" 2>/dev/null | wc -l)
[ "$PRERENDER_COUNT" -gt 0 ] && log "Prerendered: ${PRERENDER_COUNT} صفحة" || info "بدون صفحات prerendered"

# Sitemaps
SITEMAP_URLS=$(grep -c "<loc>" ${DIR}/public/sitemap*.xml 2>/dev/null | awk -F: '{sum+=$2}END{print sum}')
[ "$SITEMAP_URLS" -gt 0 ] && log "Sitemaps: ${SITEMAP_URLS} URL" || warn "لا توجد Sitemaps"

# HTTP
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost" 2>/dev/null || echo "000")
[ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] && log "HTTP: ${HTTP_CODE}" || { warn "HTTP: ${HTTP_CODE}"; WARNINGS=$((WARNINGS+1)); }

# Cron
CRON_COUNT=$(crontab -l 2>/dev/null | grep -c "${APP}" || echo "0")
[ "$CRON_COUNT" -gt 0 ] && log "Cron Jobs: ${CRON_COUNT}" || info "بدون Cron Jobs"

# النتيجة
M=$((SECONDS/60)); SC=$((SECONDS%60))
URL="http://$(hostname -I 2>/dev/null | awk '{print $1}')"
[ -n "$MAIN" ] && URL="https://${MAIN}"

echo ""
echo -e "${G}╔════════════════════════════════════════════════════════════════╗${N}"
echo -e "${G}║                                                                ║${N}"
if [ $ERRORS -eq 0 ]; then
  echo -e "${G}║       🎉  تم النشر الكامل بنجاح!  🎉                          ║${N}"
else
  echo -e "${Y}║       ⚠️  تم النشر مع ${ERRORS} خطأ — تحقق أعلاه                ║${N}"
fi
echo -e "${G}║                                                                ║${N}"
echo -e "${G}╠════════════════════════════════════════════════════════════════╣${N}"
echo -e "${G}║${N}  ⏱️  المدة:          ${C}${M}m ${SC}s${N}"
echo -e "${G}║${N}  🌐  الموقع:         ${C}${URL}${N}"
echo -e "${G}║${N}  🔧  لوحة الإدارة:   ${C}${URL}/admin${N}"
echo -e "${G}║${N}  📊  Node:           ${C}$(node -v 2>/dev/null || echo N/A)${N}"
echo -e "${G}║${N}  🔧  PM2:            ${C}$(pm2 -v 2>/dev/null || echo N/A)${N}"
echo -e "${G}║${N}  🌍  Nginx:          ${C}$(nginx -v 2>&1 | cut -d/ -f2 || echo N/A)${N}"
echo -e "${G}║${N}  🐧  Ubuntu:         ${C}${UBUNTU_VER}${N}"
echo -e "${G}║${N}  🔒  SSL:            ${C}$($SSL_EXISTS && echo "✓" || echo "HTTP only")${N}"
echo -e "${G}║${N}  🔥  Firewall:       ${C}UFW (22/80/443)${N}"
echo -e "${G}║${N}  📦  Build:          ${C}$(du -sh ${DIR}/dist 2>/dev/null | cut -f1)${N}"
echo -e "${G}║${N}  📄  Prerendered:    ${C}${PRERENDER_COUNT} pages (محفوظة)${N}"
echo -e "${G}║${N}  🗺️  Sitemaps:       ${C}${SITEMAP_URLS} URLs${N}"
echo -e "${G}║${N}  ⏰  Cron Jobs:      ${C}${CRON_COUNT}${N}"
echo -e "${G}║${N}  ⚠️  تحذيرات:       ${Y}${WARNINGS}${N}"
echo -e "${G}║${N}  ❌  أخطاء:         ${R}${ERRORS}${N}"
echo -e "${G}╠════════════════════════════════════════════════════════════════╣${N}"
echo -e "${G}║${N}  ${Y}الخوادم:${N}"
echo -e "${G}║${N}    ${C}:${PORT_MAIN}${N}  → server/index.js  (الباكند الرئيسي)"
echo -e "${G}║${N}    ${C}:${PORT_ADMIN}${N}  → api-server.cjs   (لوحة التحكم + AdSense OAuth)"
echo -e "${G}╠════════════════════════════════════════════════════════════════╣${N}"
echo -e "${G}║${N}  ${Y}أوامر مفيدة:${N}"
echo -e "${G}║${N}    ${C}update-site.sh${N}     تحديث كامل من GitHub"
echo -e "${G}║${N}    ${C}health-check.sh${N}    فحص صحة شامل"
echo -e "${G}║${N}    ${C}restart-site.sh${N}    إعادة تشغيل كل شيء"
echo -e "${G}║${N}    ${C}pm2 logs${N}            سجلات التطبيق"
echo -e "${G}║${N}    ${C}pm2 status${N}          حالة العمليات"
echo -e "${G}║${N}    ${C}pm2 monit${N}           مراقبة حية"
echo -e "${G}╠════════════════════════════════════════════════════════════════╣${N}"
echo -e "${G}║${N}  ${Y}📝 لتحديث لاحق:${N}"
echo -e "${G}║${N}    ${C}cd ${DIR} && git pull && sudo bash deploy.sh ${MAIN}${N}"
echo -e "${G}║${N}    أو ببساطة: ${C}update-site.sh${N}"
echo -e "${G}╚════════════════════════════════════════════════════════════════╝${N}"
echo ""
echo -e "${C}🎉 افتح ${URL} في المتصفح!${N}"
echo ""

#!/bin/bash
# ══════════════════════════════════════════════════════════════
#  FIX NGINX — إصلاح Prerender Shells على VPS
#  المشكلة: nginx القديم كان يتجاوز prerender shells
#  الحل: استبدال config بالإعداد الصحيح
#  
#  تشغيل على VPS:
#    sudo bash fix-nginx-vps.sh uspostaltracking.com
# ══════════════════════════════════════════════════════════════

DOMAIN="${1:-uspostaltracking.com}"
APP="uspostaltracking"
DIR="/var/www/${APP}"
PORT_MAIN="8080"

echo "🔧 إصلاح Nginx Prerender Config للدومين: $DOMAIN"

# كشف شهادات SSL
SSL_CERT="" ; SSL_KEY=""
if [ -f "/etc/ssl/${APP}/fullchain.pem" ]; then
  SSL_CERT="/etc/ssl/${APP}/fullchain.pem"
  SSL_KEY="/etc/ssl/${APP}/key.pem"
elif [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  SSL_CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
  SSL_KEY="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"
fi

if [ -n "$SSL_CERT" ]; then
  echo "✅ SSL موجود → إعداد HTTPS"
  cat > /etc/nginx/sites-available/${APP} << NGEOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://${DOMAIN}\$request_uri;
}
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.${DOMAIN};
    ssl_certificate ${SSL_CERT};
    ssl_certificate_key ${SSL_KEY};
    ssl_protocols TLSv1.2 TLSv1.3;
    return 301 https://${DOMAIN}\$request_uri;
}
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name ${DOMAIN};
    root ${DIR}/dist;
    index index.html;

    ssl_certificate ${SSL_CERT};
    ssl_certificate_key ${SSL_KEY};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    gzip on; gzip_vary on; gzip_proxied any; gzip_comp_level 6; gzip_min_length 256;
    gzip_types text/plain text/css text/javascript application/json application/javascript application/xml image/svg+xml font/woff2;

    location ~ /\. { deny all; access_log off; log_not_found off; }
    location ~ \.(env|git|bak|sql|sh|config)\$ { deny all; return 404; }

    location ~ /sitemap.*\.xml\$ { expires 1d; add_header Cache-Control "public"; access_log off; try_files \$uri =404; }
    location = /robots.txt { expires 1d; access_log off; try_files \$uri =404; }

    location ~* /assets/.*\.(js|css|woff2?|ttf|eot|png|jpg|jpeg|gif|ico|svg|webp|avif)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable, max-age=31536000";
        access_log off;
        try_files \$uri =404;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:${PORT_MAIN};
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

    location ^~ /admin {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        try_files \$uri \$uri/ /index.html;
    }

    location / {
        expires 1h;
        add_header Cache-Control "public, max-age=3600, must-revalidate";
        try_files \$uri \$uri/index.html \$uri/ /index.html;
    }

    client_max_body_size 20M;
    access_log /var/log/nginx/${APP}_access.log;
    error_log  /var/log/nginx/${APP}_error.log warn;
}
NGEOF
else
  echo "⚠️  بدون SSL — إعداد HTTP"
  cat > /etc/nginx/sites-available/${APP} << NGEOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${DIR}/dist;
    index index.html;

    gzip on; gzip_vary on; gzip_proxied any; gzip_comp_level 6; gzip_min_length 256;
    gzip_types text/plain text/css text/javascript application/json application/javascript application/xml image/svg+xml font/woff2;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location ~ /\. { deny all; access_log off; log_not_found off; }
    location ~ \.(env|git|bak|sql|sh|config)\$ { deny all; return 404; }

    location ~ /sitemap.*\.xml\$ { expires 1d; add_header Cache-Control "public"; access_log off; try_files \$uri =404; }
    location = /robots.txt { expires 1d; access_log off; try_files \$uri =404; }

    location ~* \.(js|css|woff2?|ttf|png|jpg|jpeg|gif|ico|svg|webp|avif)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        try_files \$uri =404;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:${PORT_MAIN};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_read_timeout 300s;
        proxy_buffering off;
    }

    location ^~ /admin {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        try_files \$uri \$uri/ /index.html;
    }

    location / {
        expires 1h;
        add_header Cache-Control "public, max-age=3600, must-revalidate";
        try_files \$uri \$uri/index.html \$uri/ /index.html;
    }

    client_max_body_size 20M;
    access_log /var/log/nginx/${APP}_access.log;
    error_log  /var/log/nginx/${APP}_error.log warn;
}
NGEOF
fi

ln -sf /etc/nginx/sites-available/${APP} /etc/nginx/sites-enabled/

echo ""
echo "🔍 فحص الإعداد..."
if nginx -t; then
  systemctl reload nginx
  echo ""
  echo "✅ Nginx تم إصلاحه وإعادة تحميله بنجاح!"
  echo ""
  echo "📋 الآن Nginx يخدم:"
  echo "   1) prerender shell  ← للصفحات التي لها shell في dist/"
  echo "   2) /index.html      ← SPA fallback للصفحات الأخرى"
  echo ""
  echo "🔧 لتحقق من عمل shells:"
  echo "   curl -s https://${DOMAIN}/city/new-york-ny/status/in-transit | grep '<title>'"
else
  echo "❌ خطأ في الإعداد — راجع: nginx -t"
fi

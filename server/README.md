# US Postal Tracking Backend API — دليل التثبيت

## التثبيت على VPS

```bash
# 1. انتقل لمجلد السيرفر
cd /var/www/uspostaltracking/server

# 2. تثبيت الحزم
npm install

# 3. تشغيل السيرفر
node index.js

# 4. (اختياري) تشغيل دائم باستخدام PM2
npm install -g pm2
pm2 start index.js --name uspostaltracking-api
pm2 save
pm2 startup
```

## API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/health` | فحص حالة السيرفر |
| GET | `/api/stats` | إحصائيات المشروع |
| GET | `/api/sitemaps` | قائمة ملفات Sitemap |
| GET | `/api/scripts` | قائمة السكريبتات |
| POST | `/api/run/:id` | تشغيل سكريبت (SSE) |
| GET/POST | `/api/config` | إعدادات الموقع + API Keys |
| GET/POST | `/api/ads` | إدارة الإعلانات |
| POST | `/api/track` | تسجيل زيارة |
| GET | `/api/analytics` | بيانات الزوار |
| GET | `/api/analytics/active` | الزوار النشطين |
| GET | `/api/git` | معلومات Git |
| GET | `/api/seo-audit` | فحص SEO |
| GET/POST | `/api/robots` | تحرير robots.txt |

## Nginx Proxy

الـ Nginx مُعدّ مسبقاً في `deploy/deploy.sh` لتمرير `/api/*` إلى البورت `8080`:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_buffering off;
}
```

## البيانات

جميع البيانات تُخزّن في `server/data/`:
- `config.json` — إعدادات الموقع و API Keys
- `ads.json` — إعدادات الإعلانات
- `visitors.json` — بيانات الزوار
- `scripts.json` — السكريبتات المخصصة

## الوضع المحلي (بدون Backend)

الداشبورد يعمل بدون backend — يستخدم بيانات ثابتة + localStorage.
عند وجود Backend على VPS، يتحول تلقائياً لاستخدام API الحقيقي.

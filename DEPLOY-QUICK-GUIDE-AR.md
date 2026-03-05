# 🚀 دليل النشر السريع

## الخطوات (5 دقائق)

### 1️⃣ رفع السكريبت للسيرفر
```bash
scp deploy/deploy.sh root@your-server-ip:/root/
```

### 2️⃣ تشغيل السكريبت
```bash
ssh root@your-server-ip
bash deploy.sh uspostaltracking.com www.uspostaltracking.com
```

### 3️⃣ انتظر (12-23 دقيقة)
السكريبت سيقوم بكل شيء تلقائياً:
- ✅ تثبيت Node.js + PM2 + Nginx
- ✅ استنساخ المشروع
- ✅ بناء الموقع
- ✅ إصدار SSL
- ✅ تشغيل الموقع

### 4️⃣ افتح الموقع
```
https://uspostaltracking.com
```

---

## 🔧 أوامر مفيدة

### تحديث الموقع:
```bash
update-site.sh
```

### فحص الصحة:
```bash
health-check.sh
```

### سجلات PM2:
```bash
pm2 logs
```

### حالة PM2:
```bash
pm2 status
```

### إعادة تشغيل:
```bash
pm2 reload swifttrack-hub
```

### فحص Nginx:
```bash
nginx -t
systemctl status nginx
```

### فحص SSL:
```bash
certbot certificates
```

---

## ⚠️ إذا حدثت مشكلة

### SSL لم يعمل؟
```bash
# تأكد من DNS
dig uspostaltracking.com

# إصدار يدوي
certbot --nginx -d uspostaltracking.com -d www.uspostaltracking.com
```

### الموقع لا يعمل؟
```bash
# فحص PM2
pm2 status
pm2 logs

# فحص Nginx
systemctl status nginx
nginx -t

# إعادة تشغيل
pm2 reload swifttrack-hub
systemctl restart nginx
```

### بطء في البناء؟
```bash
# استخدم build بدون prerender
cd /var/www/swifttrack-hub
npm run build:client-only
pm2 reload swifttrack-hub
```

---

## 📝 ملاحظات مهمة

1. **DNS**: تأكد من ضبط DNS قبل التشغيل:
   ```
   A Record: uspostaltracking.com → server-ip
   A Record: www.uspostaltracking.com → server-ip
   ```

2. **Firewall**: السكريبت يفتح البورتات تلقائياً:
   - 22 (SSH)
   - 80 (HTTP)
   - 443 (HTTPS)

3. **API Keys**: عدّل `server/data/config.json` بعد النشر:
   ```bash
   nano /var/www/swifttrack-hub/server/data/config.json
   pm2 reload swifttrack-hub
   ```

4. **Backup**: النسخ الاحتياطية في:
   ```
   /var/www/backups/
   ```

---

## 🎯 الخلاصة

السكريبت **مكتمل وجاهز** - فقط شغّله وانتظر!

```bash
bash deploy.sh uspostaltracking.com www.uspostaltracking.com
```

**الوقت المتوقع**: 12-23 دقيقة  
**النتيجة**: موقع يعمل على HTTPS مع SSL + PM2 + Nginx + SEO automation

# 🚀 دليل النشر على VPS - بالعربية

## المتطلبات الأساسية

قبل البدء، تأكد من:
- ✅ VPS بنظام Ubuntu 22.04 أو 24.04
- ✅ صلاحيات root (SSH)
- ✅ دومين موجه إلى IP الخاص بـ VPS
- ✅ الوصول إلى GitHub repository

---

## الخطوة 1: الاتصال بـ VPS

```bash
ssh root@YOUR_VPS_IP
```

استبدل `YOUR_VPS_IP` بعنوان IP الفعلي لـ VPS الخاص بك.

---

## الخطوة 2: النشر بأمر واحد فقط! 🎯

```bash
curl -fsSL https://raw.githubusercontent.com/chafii96/track-my-mail/main/deploy/deploy.sh | sudo bash -s uspostaltracking.com www.uspostaltracking.com
```

**هذا كل شيء!** ☕ اشرب قهوة، سيستغرق 10-15 دقيقة.

---

## أو: الطريقة التفصيلية

إذا كنت تفضل رؤية ما يحدث:

```bash
# 1. تحميل السكريبت
wget https://raw.githubusercontent.com/chafii96/track-my-mail/main/deploy/deploy.sh

# 2. جعله قابل للتنفيذ
chmod +x deploy.sh

# 3. تشغيله
sudo bash deploy.sh uspostaltracking.com www.uspostaltracking.com
```

---

## ماذا يفعل السكريبت تلقائياً؟

السكريبت سيقوم بـ:

1. ✅ تحديث النظام
2. ✅ تثبيت Node.js 20 + PM2 + Nginx
3. ✅ استنساخ المشروع من GitHub
4. ✅ تثبيت جميع الحزم (frontend + backend)
5. ✅ بناء المشروع
6. ✅ توليد خرائط الموقع (Sitemaps)
7. ✅ إعداد Nginx
8. ✅ تثبيت شهادة SSL (Let's Encrypt)
9. ✅ تشغيل الباكند بـ PM2
10. ✅ إعداد الجدار الناري (UFW)
11. ✅ إعداد تدوير السجلات
12. ✅ إعداد Cron Jobs للـ SEO

**الوقت المتوقع**: 10-15 دقيقة

---

## الخطوة 3: التحقق من النشر

بعد انتهاء السكريبت:

### 1. اختبر الموقع

```bash
curl -I https://uspostaltracking.com
```

يجب أن يعيد `200 OK`.

### 2. تحقق من حالة الباكند

```bash
pm2 status
```

يجب أن يظهر `swifttrack-hub` بحالة `online`.

### 3. تحقق من Nginx

```bash
systemctl status nginx
```

يجب أن يظهر `active (running)`.

### 4. تحقق من شهادة SSL

```bash
certbot certificates
```

---

## الخطوة 4: إعداد DNS (مهم جداً!)

قبل النشر، تأكد من إعداد DNS:

### سجلات A المطلوبة:

| النوع | الاسم | القيمة | TTL |
|------|------|-------|-----|
| A | @ | YOUR_VPS_IP | 3600 |
| A | www | YOUR_VPS_IP | 3600 |

### التحقق من DNS:

```bash
dig uspostaltracking.com +short
dig www.uspostaltracking.com +short
```

كلاهما يجب أن يعيد IP الخاص بـ VPS.

---

## الخطوة 5: إعداد API Keys

### تعديل ملف الإعدادات:

```bash
cd /var/www/swifttrack-hub
nano server/data/config.json
```

تأكد من وجود بيانات USPS:

```json
{
  "apiKeys": {
    "uspsUserId": "3P934TRACK349",
    "uspsPassword": "K9024ME92Z0856D"
  }
}
```

احفظ واخرج (Ctrl+X ثم Y ثم Enter).

### إعادة تحميل الباكند:

```bash
pm2 reload swifttrack-hub
```

---

## أوامر مفيدة

### تحديث الموقع من GitHub

```bash
update-site.sh
```

هذا سيقوم بـ:
- سحب آخر تحديثات من GitHub
- إعادة تثبيت الحزم
- إعادة بناء المشروع
- إعادة تحميل PM2 و Nginx

### فحص صحة السيرفر

```bash
health-check.sh
```

يعرض:
- حمل النظام
- استخدام RAM
- استخدام القرص
- حالة Nginx
- حالة PM2
- معلومات شهادة SSL

### عرض سجلات الباكند

```bash
pm2 logs swifttrack-hub
```

### إعادة تشغيل الباكند

```bash
pm2 restart swifttrack-hub
```

### عرض سجلات Nginx

```bash
# سجلات الوصول
tail -f /var/log/nginx/swifttrack-hub_access.log

# سجلات الأخطاء
tail -f /var/log/nginx/swifttrack-hub_error.log
```

---

## حل المشاكل

### المشكلة: الموقع لا يعمل

**تحقق من Nginx:**
```bash
nginx -t
systemctl status nginx
```

**تحقق من فتح المنافذ:**
```bash
ufw status
netstat -tulpn | grep nginx
```

### المشكلة: الباكند لا يعمل

**تحقق من PM2:**
```bash
pm2 status
pm2 logs swifttrack-hub --lines 50
```

**إعادة تشغيل:**
```bash
pm2 restart swifttrack-hub
```

### المشكلة: SSL فشل

**تحقق من DNS:**
```bash
dig uspostaltracking.com +short
```

يجب أن يعيد IP الخاص بك.

**طلب SSL يدوياً:**
```bash
certbot --nginx -d uspostaltracking.com -d www.uspostaltracking.com
```

### المشكلة: نفاد مساحة القرص

**تحقق من المساحة:**
```bash
df -h
```

**تنظيف:**
```bash
# تنظيف السجلات القديمة
journalctl --vacuum-time=7d

# حذف النسخ الاحتياطية القديمة
rm -rf /var/www/backups/*

# تنظيف npm cache
npm cache clean --force

# تنظيف سجلات PM2
pm2 flush
```

---

## الأمان

السكريبت يقوم تلقائياً بـ:
- ✅ تفعيل الجدار الناري (UFW)
- ✅ تثبيت شهادة SSL
- ✅ إعداد Security Headers
- ✅ حظر الملفات الحساسة (.env, .git, إلخ)
- ✅ Rate limiting على API
- ✅ تدوير السجلات

### أمان إضافي (اختياري)

**تثبيت Fail2Ban:**
```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

---

## Cron Jobs (SEO تلقائي)

السكريبت يقوم تلقائياً بإعداد:

- **توليد Sitemaps**: يومياً الساعة 2 صباحاً
- **IndexNow ping**: يومياً الساعة 3 صباحاً
- **تجديد SSL**: مرتين يومياً (3 صباحاً، 3 مساءً)

**عرض Cron jobs:**
```bash
crontab -l
```

---

## الخطوات التالية بعد النشر

1. ✅ اختبر الموقع: `https://uspostaltracking.com`
2. ✅ أرسل Sitemap إلى Google Search Console
3. ✅ أرسل Sitemap إلى Bing Webmaster Tools
4. ✅ اطلب موافقة USPS API (راجع `USPS-API-APPROVAL-STEPS-AR.md`)
5. ✅ إعداد المراقبة (UptimeRobot، إلخ)
6. ✅ إعداد Google Analytics (إذا لزم الأمر)
7. ✅ اختبر تتبع USPS بعد الموافقة

---

## مرجع سريع

```bash
# النشر/التحديث
sudo bash deploy.sh uspostaltracking.com www.uspostaltracking.com

# تحديث من GitHub
update-site.sh

# فحص الصحة
health-check.sh

# عرض السجلات
pm2 logs swifttrack-hub

# إعادة تشغيل الباكند
pm2 restart swifttrack-hub

# إعادة تحميل Nginx
systemctl reload nginx

# التحقق من SSL
certbot certificates

# تجديد SSL يدوياً
certbot renew

# التحقق من الجدار الناري
ufw status
```

---

## الملفات المهمة

- **المشروع**: `/var/www/swifttrack-hub`
- **الإعدادات**: `/var/www/swifttrack-hub/server/data/config.json`
- **Nginx**: `/etc/nginx/sites-available/swifttrack-hub`
- **PM2**: `/var/www/swifttrack-hub/ecosystem.config.cjs`

---

## جاهز للنشر؟

```bash
ssh root@YOUR_VPS_IP
```

ثم:

```bash
curl -fsSL https://raw.githubusercontent.com/chafii96/track-my-mail/main/deploy/deploy.sh | sudo bash -s uspostaltracking.com www.uspostaltracking.com
```

🚀 بالتوفيق!

---

## ملاحظات مهمة

1. **DNS**: تأكد من إعداد DNS قبل النشر (يستغرق 5-60 دقيقة للانتشار)
2. **Firewall**: السكريبت يفتح المنافذ 22, 80, 443 تلقائياً
3. **SSL**: يتم تثبيته تلقائياً إذا كان DNS معداً بشكل صحيح
4. **Backup**: يتم حفظ نسخة احتياطية تلقائياً في `/var/www/backups/`
5. **Updates**: استخدم `update-site.sh` للتحديثات المستقبلية

---

**إذا واجهت أي مشكلة، راجع قسم "حل المشاكل" أعلاه أو شغّل:**

```bash
health-check.sh
```

للحصول على تقرير كامل عن حالة النظام.

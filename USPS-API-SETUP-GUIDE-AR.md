# دليل إعداد USPS API - خطوة بخطوة

## 🚨 المشكلة الحالية
```
Error: Authorization failure. Perhaps username and/or password is incorrect.
```

هذا يعني أن بيانات الاعتماد غير صحيحة أو الحساب غير مفعّل.

---

## ✅ الحل: خطوات التفعيل الصحيحة

### الخطوة 1: التسجيل في USPS Web Tools

1. اذهب إلى: https://registration.shippingapis.com/
2. انقر على **"Register"**
3. املأ النموذج:
   - **Company Name**: Tracking us (أو اسم شركتك)
   - **Email**: بريدك الإلكتروني
   - **Website**: uspostaltracking.com
   - **Purpose**: Package Tracking Service

### الخطوة 2: تفعيل البريد الإلكتروني

1. افتح بريدك الإلكتروني
2. ابحث عن رسالة من USPS Web Tools
3. انقر على رابط التفعيل
4. **مهم جداً**: قد تستغرق الرسالة حتى 24 ساعة للوصول

### الخطوة 3: الحصول على بيانات الاعتماد

بعد التفعيل، ستحصل على:
- **USERID**: مثل `123TRACK456`
- **Password**: (اختياري - بعض الحسابات لا تحتاج password)

### الخطوة 4: الانتقال من Test إلى Production

⚠️ **مهم جداً**: حسابك الجديد يبدأ في وضع **TEST** فقط!

لتفعيل وضع **PRODUCTION**:

1. اذهب إلى: https://registration.shippingapis.com/
2. سجل الدخول بحسابك
3. ابحث عن **"Request Production Access"** أو **"Upgrade to Production"**
4. املأ النموذج واشرح استخدامك (Package tracking website)
5. انتظر الموافقة (عادة 1-3 أيام عمل)

---

## 🧪 اختبار بيانات الاعتماد

### الطريقة 1: اختبار يدوي

افتح المتصفح واذهب إلى:
```
https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<TrackFieldRequest USERID="YOUR_USERID"><Revision>1</Revision><ClientIp>127.0.0.1</ClientIp><SourceId>Test</SourceId><TrackID ID="9400111899223396156"/></TrackFieldRequest>
```

استبدل `YOUR_USERID` بـ USERID الخاص بك.

**النتائج المتوقعة:**
- ✅ إذا رأيت `<TrackSummary>` = الحساب يعمل!
- ❌ إذا رأيت `Authorization failure` = الحساب غير مفعّل أو USERID خاطئ
- ⚠️ إذا رأيت `This Information has not been included` = الحساب يعمل لكن رقم التتبع غير موجود

### الطريقة 2: استخدام السكريبت

```bash
node test-usps-api.cjs
```

---

## 🔧 تحديث بيانات الاعتماد في الموقع

بعد الحصول على بيانات صحيحة:

### الطريقة 1: عبر ملف config.json

عدّل الملف `server/data/config.json`:

```json
{
  "apiKeys": {
    "uspsUserId": "YOUR_CORRECT_USERID",
    "uspsPassword": "YOUR_PASSWORD_IF_NEEDED"
  }
}
```

### الطريقة 2: عبر لوحة التحكم (Admin Dashboard)

1. اذهب إلى: `https://uspostaltracking.com/admin`
2. سجل الدخول (كلمة المرور: `uspostal2024`)
3. اذهب إلى **API Keys**
4. أدخل USPS USERID و Password
5. احفظ التغييرات

---

## 🚀 إعادة تشغيل السيرفر

بعد تحديث بيانات الاعتماد:

```bash
# إعادة تشغيل السيرفر
pm2 restart all

# أو إذا كنت تستخدم npm
npm run server
```

---

## 📝 ملاحظات مهمة

### 1. الفرق بين Test و Production

- **Test Mode**: يعمل فقط مع أرقام تتبع تجريبية محددة
- **Production Mode**: يعمل مع جميع أرقام التتبع الحقيقية

### 2. حدود الاستخدام (Rate Limits)

USPS Web Tools لديها حدود:
- **Test**: 10 طلبات/دقيقة
- **Production**: 35 طلبات/ثانية (أكثر من كافي!)

### 3. أرقام التتبع الصالحة

USPS تقبل هذه الأنماط:
- `9400...` (20-22 رقم) - Priority Mail
- `9270...` (20-22 رقم) - Priority Mail Express
- `9205...` (20-22 رقم) - Ground Advantage
- `EA123456789US` (13 حرف) - International

---

## 🆘 استكشاف الأخطاء

### خطأ: "Authorization failure"
**السبب**: USERID خاطئ أو الحساب غير مفعّل
**الحل**: 
1. تحقق من البريد الإلكتروني للتفعيل
2. تأكد من USERID صحيح (بدون مسافات)
3. اطلب Production Access

### خطأ: "This Information has not been included"
**السبب**: رقم التتبع غير موجود في نظام USPS
**الحل**: 
- هذا طبيعي! يعني API يعمل لكن الرقم غير صحيح
- جرب رقم تتبع حقيقي

### خطأ: "Invalid tracking number"
**السبب**: تنسيق رقم التتبع خاطئ
**الحل**: تأكد من أن الرقم 20-22 رقم أو 13 حرف للدولي

---

## 📞 الدعم

إذا استمرت المشكلة:

1. **USPS Support**: 
   - Email: icustomercare@usps.gov
   - Phone: 1-800-344-7779

2. **تحقق من حالة الحساب**:
   - https://registration.shippingapis.com/

3. **وثائق USPS API**:
   - https://www.usps.com/business/web-tools-apis/

---

## ✅ قائمة التحقق النهائية

- [ ] تم التسجيل في USPS Web Tools
- [ ] تم تفعيل البريد الإلكتروني
- [ ] تم طلب Production Access
- [ ] تم الحصول على USERID صحيح
- [ ] تم تحديث config.json
- [ ] تم اختبار API بنجاح
- [ ] تم إعادة تشغيل السيرفر

---

**آخر تحديث**: 6 مارس 2026

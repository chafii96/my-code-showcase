#!/bin/bash
########################################################################
#  🚨 URGENT FIX SCRIPT - إصلاح فوري للانتهاكات الحرجة
#  يجب تشغيله خلال 24 ساعة لتجنب عقوبات Google
########################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}"
cat << 'ART'
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚨  URGENT SEO FIX - إصلاح فوري  🚨            ║
║   إزالة انتهاكات Google الحرجة                   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
ART
echo -e "${NC}"

echo -e "${YELLOW}⚠️  هذا السكريبت سيحذف ملفات تحتوي على تقنيات Black Hat SEO${NC}"
echo -e "${YELLOW}⚠️  تأكد من عمل نسخة احتياطية قبل المتابعة${NC}"
echo ""
read -p "هل تريد المتابعة؟ (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${RED}تم الإلغاء${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  المرحلة 1: حذف ملفات Cloaking${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"

# 1. حذف ملف Cloaking
if [ -f "src/lib/cloaking.ts" ]; then
    echo "🗑️  حذف src/lib/cloaking.ts..."
    rm src/lib/cloaking.ts
    echo -e "${GREEN}✅ تم حذف cloaking.ts${NC}"
else
    echo -e "${YELLOW}⚠️  cloaking.ts غير موجود${NC}"
fi

# 2. إزالة استيرادات cloaking من جميع الملفات
echo "🔍 البحث عن استيرادات cloaking..."
if grep -r "from '@/lib/cloaking'" src/ --files-with-matches 2>/dev/null; then
    echo "🗑️  إزالة استيرادات cloaking..."
    grep -r "from '@/lib/cloaking'" src/ --files-with-matches | while read file; do
        sed -i.bak '/cloaking/d' "$file"
        echo "   ✓ $file"
    done
    echo -e "${GREEN}✅ تم إزالة جميع استيرادات cloaking${NC}"
else
    echo -e "${YELLOW}⚠️  لم يتم العثور على استيرادات cloaking${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  المرحلة 2: حذف Hidden Text${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"

# 3. حذف GlobalSEOKeywords
if [ -f "src/components/GlobalSEOKeywords.tsx" ]; then
    echo "🗑️  حذف src/components/GlobalSEOKeywords.tsx..."
    rm src/components/GlobalSEOKeywords.tsx
    echo -e "${GREEN}✅ تم حذف GlobalSEOKeywords.tsx${NC}"
else
    echo -e "${YELLOW}⚠️  GlobalSEOKeywords.tsx غير موجود${NC}"
fi

# 4. إزالة استيرادات GlobalSEOKeywords
echo "🔍 البحث عن استيرادات GlobalSEOKeywords..."
if grep -r "GlobalSEOKeywords" src/ --files-with-matches 2>/dev/null; then
    echo "🗑️  إزالة استيرادات GlobalSEOKeywords..."
    grep -r "GlobalSEOKeywords" src/ --files-with-matches | while read file; do
        sed -i.bak '/GlobalSEOKeywords/d' "$file"
        echo "   ✓ $file"
    done
    echo -e "${GREEN}✅ تم إزالة جميع استيرادات GlobalSEOKeywords${NC}"
else
    echo -e "${YELLOW}⚠️  لم يتم العثور على استيرادات GlobalSEOKeywords${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  المرحلة 3: حذف Content Spinner${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"

# 5. حذف Content Spinner
if [ -f "src/lib/contentSpinner.ts" ]; then
    echo "🗑️  حذف src/lib/contentSpinner.ts..."
    rm src/lib/contentSpinner.ts
    echo -e "${GREEN}✅ تم حذف contentSpinner.ts${NC}"
else
    echo -e "${YELLOW}⚠️  contentSpinner.ts غير موجود${NC}"
fi

# 6. إزالة استيرادات contentSpinner
echo "🔍 البحث عن استيرادات contentSpinner..."
if grep -r "contentSpinner" src/ --files-with-matches 2>/dev/null; then
    echo "🗑️  إزالة استيرادات contentSpinner..."
    grep -r "contentSpinner" src/ --files-with-matches | while read file; do
        sed -i.bak '/contentSpinner/d' "$file"
        echo "   ✓ $file"
    done
    echo -e "${GREEN}✅ تم إزالة جميع استيرادات contentSpinner${NC}"
else
    echo -e "${YELLOW}⚠️  لم يتم العثور على استيرادات contentSpinner${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  المرحلة 4: حذف CTR Manipulation${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"

# 7. حذف CTR Manipulation
if [ -f "src/lib/ctrManipulation.ts" ]; then
    echo "🗑️  حذف src/lib/ctrManipulation.ts..."
    rm src/lib/ctrManipulation.ts
    echo -e "${GREEN}✅ تم حذف ctrManipulation.ts${NC}"
else
    echo -e "${YELLOW}⚠️  ctrManipulation.ts غير موجود${NC}"
fi

# 8. إزالة استيرادات ctrManipulation
echo "🔍 البحث عن استيرادات ctrManipulation..."
if grep -r "ctrManipulation" src/ --files-with-matches 2>/dev/null; then
    echo "🗑️  إزالة استيرادات ctrManipulation..."
    grep -r "ctrManipulation" src/ --files-with-matches | while read file; do
        sed -i.bak '/ctrManipulation/d' "$file"
        echo "   ✓ $file"
    done
    echo -e "${GREEN}✅ تم إزالة جميع استيرادات ctrManipulation${NC}"
else
    echo -e "${YELLOW}⚠️  لم يتم العثور على استيرادات ctrManipulation${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  المرحلة 5: إضافة noindex للصفحات البرمجية${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"

# 9. إضافة noindex للصفحات البرمجية
if [ -d "public/programmatic" ]; then
    echo "🔧 إضافة noindex لـ 4,140 صفحة برمجية..."
    find public/programmatic/ -name "*.html" -type f | while read file; do
        if grep -q '<meta name="robots" content="index, follow">' "$file"; then
            sed -i.bak 's/<meta name="robots" content="index, follow">/<meta name="robots" content="noindex, follow">/' "$file"
        fi
    done
    echo -e "${GREEN}✅ تم إضافة noindex لجميع الصفحات البرمجية${NC}"
else
    echo -e "${YELLOW}⚠️  مجلد programmatic غير موجود${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  المرحلة 6: حذف Link Schemes${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"

# 10. حذف سكريبتات Link Building
if [ -d "seo-infrastructure/link-building" ]; then
    echo "🗑️  حذف seo-infrastructure/link-building/..."
    rm -rf seo-infrastructure/link-building/
    echo -e "${GREEN}✅ تم حذف link-building${NC}"
else
    echo -e "${YELLOW}⚠️  link-building غير موجود${NC}"
fi

# 11. حذف سكريبتات Social Signals
if [ -d "seo-infrastructure/social-signals" ]; then
    echo "🗑️  حذف seo-infrastructure/social-signals/..."
    rm -rf seo-infrastructure/social-signals/
    echo -e "${GREEN}✅ تم حذف social-signals${NC}"
else
    echo -e "${YELLOW}⚠️  social-signals غير موجود${NC}"
fi

# 12. حذف Churn and Burn
if [ -d "seo-infrastructure/churn-and-burn" ]; then
    echo "🗑️  حذف seo-infrastructure/churn-and-burn/..."
    rm -rf seo-infrastructure/churn-and-burn/
    echo -e "${GREEN}✅ تم حذف churn-and-burn${NC}"
else
    echo -e "${YELLOW}⚠️  churn-and-burn غير موجود${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  المرحلة 7: تنظيف Meta Tags${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"

# 13. حذف meta keywords من index.html
if [ -f "index.html" ]; then
    echo "🔧 حذف meta keywords من index.html..."
    sed -i.bak '/<meta name="keywords"/d' index.html
    echo -e "${GREEN}✅ تم حذف meta keywords${NC}"
else
    echo -e "${YELLOW}⚠️  index.html غير موجود${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  المرحلة 8: تنظيف الملفات المؤقتة${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"

# 14. حذف ملفات .bak
echo "🧹 حذف ملفات النسخ الاحتياطية..."
find . -name "*.bak" -type f -delete 2>/dev/null || true
echo -e "${GREEN}✅ تم حذف ملفات .bak${NC}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ اكتمل الإصلاح الفوري!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📋 ملخص التغييرات:${NC}"
echo "   ✓ حذف Cloaking (cloaking.ts)"
echo "   ✓ حذف Hidden Text (GlobalSEOKeywords.tsx)"
echo "   ✓ حذف Content Spinner (contentSpinner.ts)"
echo "   ✓ حذف CTR Manipulation (ctrManipulation.ts)"
echo "   ✓ إضافة noindex لـ 4,140 صفحة برمجية"
echo "   ✓ حذف Link Schemes (link-building/)"
echo "   ✓ حذف Social Signals (social-signals/)"
echo "   ✓ حذف Churn and Burn (churn-and-burn/)"
echo "   ✓ حذف meta keywords"
echo ""

echo -e "${YELLOW}🔄 الخطوات التالية:${NC}"
echo "   1. تشغيل: npm run build"
echo "   2. اختبار الموقع محلياً"
echo "   3. رفع التغييرات إلى Git"
echo "   4. نشر الموقع"
echo "   5. إرسال طلب إعادة فحص في Google Search Console"
echo ""

echo -e "${RED}⚠️  تحذير:${NC}"
echo "   - هذا الإصلاح يزيل الانتهاكات الحرجة فقط"
echo "   - يجب إعادة كتابة المحتوى البرمجي بمحتوى فريد"
echo "   - يجب بناء روابط طبيعية بدلاً من الآلية"
echo "   - راجع GOOGLE-BOT-SEO-AUDIT-REPORT.md للتفاصيل الكاملة"
echo ""

echo -e "${GREEN}✅ تم الانتهاء!${NC}"

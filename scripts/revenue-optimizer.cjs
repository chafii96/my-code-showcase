#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  💰 REVENUE OPTIMIZER — AdSense + Affiliate Income Maximizer           ║
 * ║  يحلل ويحسّن مصادر الدخل: AdSense + Affiliate + Sponsored Content     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'seo-data', 'revenue');

// ─── AdSense Optimization Data ───────────────────────────────────────────────
const ADSENSE_PLACEMENTS = [
  {
    id: 'header-banner',
    name: 'Header Banner (728x90)',
    location: 'Above the fold, header',
    expectedCTR: '0.8-1.2%',
    expectedCPM: '$2.50-$4.00',
    priority: 1,
    code: `<!-- AdSense Header Banner -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>`,
    placement: 'src/components/layout/Header.tsx',
    notes: 'أعلى الصفحة = أعلى RPM'
  },
  {
    id: 'in-content-1',
    name: 'In-Content Ad 1 (Responsive)',
    location: 'After first paragraph of tracking result',
    expectedCTR: '1.5-2.5%',
    expectedCPM: '$3.00-$5.50',
    priority: 2,
    code: `<!-- AdSense In-Content 1 -->
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"></ins>`,
    placement: 'src/components/tracking/TrackingResult.tsx',
    notes: 'In-article ads = CTR أعلى بـ 60%'
  },
  {
    id: 'sidebar-sticky',
    name: 'Sidebar Sticky (300x600)',
    location: 'Right sidebar, sticky on scroll',
    expectedCTR: '0.5-1.0%',
    expectedCPM: '$4.00-$7.00',
    priority: 3,
    code: `<!-- AdSense Sidebar Sticky -->
<ins class="adsbygoogle"
     style="display:block; position:sticky; top:20px;"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>`,
    placement: 'src/components/layout/Sidebar.tsx',
    notes: 'Sticky = مشاهدات أكثر = RPM أعلى'
  },
  {
    id: 'between-articles',
    name: 'Between Articles (Responsive)',
    location: 'Between article cards on blog page',
    expectedCTR: '1.2-2.0%',
    expectedCPM: '$2.00-$3.50',
    priority: 4,
    code: `<!-- AdSense Between Articles -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>`,
    placement: 'src/pages/BlogPage.tsx',
    notes: 'كل 3 مقالات = إعلان واحد'
  },
  {
    id: 'footer-banner',
    name: 'Footer Banner (728x90)',
    location: 'Above footer',
    expectedCTR: '0.3-0.6%',
    expectedCPM: '$1.50-$2.50',
    priority: 5,
    code: `<!-- AdSense Footer -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>`,
    placement: 'src/components/layout/Footer.tsx',
    notes: 'دخل إضافي من الزوار الذين وصلوا للأسفل'
  }
];

// ─── Affiliate Programs ───────────────────────────────────────────────────────
const AFFILIATE_PROGRAMS = [
  {
    name: 'ShipStation',
    url: 'https://shipstation.com',
    commission: '$50-$200 per referral',
    cookie: '90 days',
    relevance: 'عالي جداً — برنامج شحن للتجار',
    conversionRate: '2-5%',
    monthlyPotential: '$500-$2000',
    joinUrl: 'https://www.shipstation.com/partners/affiliate/',
    bannerSizes: ['728x90', '300x250', '160x600'],
    targetAudience: 'أصحاب المتاجر الإلكترونية'
  },
  {
    name: 'Stamps.com',
    url: 'https://stamps.com',
    commission: '$20-$40 per signup',
    cookie: '30 days',
    relevance: 'عالي — طباعة طوابع USPS',
    conversionRate: '3-7%',
    monthlyPotential: '$300-$1500',
    joinUrl: 'https://www.stamps.com/affiliate/',
    bannerSizes: ['728x90', '300x250'],
    targetAudience: 'أي شخص يشحن عبر USPS'
  },
  {
    name: 'Pirateship',
    url: 'https://pirateship.com',
    commission: '$10 per referral + 5% recurring',
    cookie: '60 days',
    relevance: 'عالي — خصومات USPS',
    conversionRate: '4-8%',
    monthlyPotential: '$200-$800',
    joinUrl: 'https://pirateship.com/affiliates',
    bannerSizes: ['300x250', '728x90'],
    targetAudience: 'صغار البائعين'
  },
  {
    name: 'EasyPost API',
    url: 'https://easypost.com',
    commission: '$100 per developer signup',
    cookie: '90 days',
    relevance: 'متوسط — API للمطورين',
    conversionRate: '1-2%',
    monthlyPotential: '$100-$500',
    joinUrl: 'https://easypost.com/partners',
    bannerSizes: ['728x90'],
    targetAudience: 'المطورون وأصحاب التطبيقات'
  },
  {
    name: 'PackageGuard Insurance',
    url: 'https://packageguard.com',
    commission: '15% recurring commission',
    cookie: '120 days',
    relevance: 'عالي — تأمين الطرود',
    conversionRate: '2-4%',
    monthlyPotential: '$150-$600',
    joinUrl: 'https://packageguard.com/affiliate',
    bannerSizes: ['300x250', '728x90'],
    targetAudience: 'من يتتبع طرود ثمينة'
  },
  {
    name: 'Amazon Associates',
    url: 'https://amazon.com',
    commission: '1-10% per sale',
    cookie: '24 hours',
    relevance: 'متوسط — منتجات الشحن والتغليف',
    conversionRate: '5-10%',
    monthlyPotential: '$100-$400',
    joinUrl: 'https://affiliate-program.amazon.com',
    bannerSizes: ['728x90', '300x250', '160x600'],
    targetAudience: 'الجميع'
  }
];

// ─── Revenue Projections ──────────────────────────────────────────────────────
function calculateRevenue(monthlyVisitors) {
  const adsenseRPM = 3.5; // Average RPM in USD
  const affiliateConvRate = 0.03; // 3% conversion
  const avgAffiliateCommission = 25; // USD

  const adsenseMonthly = (monthlyVisitors / 1000) * adsenseRPM;
  const affiliateMonthly = monthlyVisitors * affiliateConvRate * avgAffiliateCommission * 0.1; // 10% click rate
  const totalMonthly = adsenseMonthly + affiliateMonthly;

  return {
    adsense: Math.floor(adsenseMonthly),
    affiliate: Math.floor(affiliateMonthly),
    total: Math.floor(totalMonthly),
    annual: Math.floor(totalMonthly * 12)
  };
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  💰 REVENUE OPTIMIZER — Income Maximizer                ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n📅 ${new Date().toLocaleString('ar')}\n`);

  fs.mkdirSync(DATA_DIR, { recursive: true });

  // ── AdSense Analysis ──────────────────────────────────────────────────────
  console.log('📊 تحليل مواضع AdSense...\n');
  
  let totalExpectedCPM = 0;
  for (const placement of ADSENSE_PLACEMENTS) {
    const cpmRange = placement.expectedCPM.replace('$', '').split('-');
    const avgCPM = (parseFloat(cpmRange[0]) + parseFloat(cpmRange[1])) / 2;
    totalExpectedCPM += avgCPM;
    
    console.log(`  ${placement.priority}. ${placement.name}`);
    console.log(`     📍 الموقع: ${placement.location}`);
    console.log(`     💰 CPM: ${placement.expectedCPM} | CTR: ${placement.expectedCTR}`);
    console.log(`     💡 ${placement.notes}\n`);
  }

  // ── Affiliate Analysis ────────────────────────────────────────────────────
  console.log('🤝 تحليل برامج الـ Affiliate...\n');
  
  for (const prog of AFFILIATE_PROGRAMS) {
    console.log(`  💼 ${prog.name}`);
    console.log(`     💰 العمولة: ${prog.commission}`);
    console.log(`     🎯 الجمهور: ${prog.targetAudience}`);
    console.log(`     📈 الدخل المحتمل/شهر: ${prog.monthlyPotential}`);
    console.log(`     🔗 ${prog.joinUrl}\n`);
  }

  // ── Revenue Projections ───────────────────────────────────────────────────
  console.log('📈 توقعات الدخل حسب عدد الزوار...\n');
  
  const scenarios = [
    { visitors: 10000, label: 'البداية (10K/شهر)' },
    { visitors: 50000, label: 'نمو (50K/شهر)' },
    { visitors: 100000, label: 'متوسط (100K/شهر)' },
    { visitors: 500000, label: 'قوي (500K/شهر)' },
    { visitors: 1000000, label: 'ضخم (1M/شهر)' },
  ];

  console.log('  ┌─────────────────────┬──────────┬───────────┬──────────┬──────────────┐');
  console.log('  │ السيناريو           │ AdSense  │ Affiliate │ الإجمالي │ سنوياً       │');
  console.log('  ├─────────────────────┼──────────┼───────────┼──────────┼──────────────┤');
  
  for (const s of scenarios) {
    const rev = calculateRevenue(s.visitors);
    console.log(`  │ ${s.label.padEnd(19)} │ $${String(rev.adsense).padEnd(7)} │ $${String(rev.affiliate).padEnd(8)} │ $${String(rev.total).padEnd(7)} │ $${String(rev.annual).padEnd(11)} │`);
  }
  console.log('  └─────────────────────┴──────────┴───────────┴──────────┴──────────────┘');

  // ── Generate AdSense Component ────────────────────────────────────────────
  console.log('\n🔧 توليد مكونات AdSense...');
  
  const adComponent = `import { useEffect } from 'react';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layout?: 'in-article' | '';
  className?: string;
}

declare global {
  interface Window { adsbygoogle: any[]; }
}

export function AdSense({ slot, format = 'auto', layout = '', className = '' }: AdSenseProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div className={\`adsense-container \${className}\`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXX'}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout || undefined}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Pre-configured ad units
export const HeaderAd = () => <AdSense slot={import.meta.env.VITE_AD_HEADER || ''} className="my-4" />;
export const InContentAd = () => <AdSense slot={import.meta.env.VITE_AD_CONTENT || ''} format="fluid" layout="in-article" className="my-6" />;
export const SidebarAd = () => <AdSense slot={import.meta.env.VITE_AD_SIDEBAR || ''} className="sticky top-4" />;
export const FooterAd = () => <AdSense slot={import.meta.env.VITE_AD_FOOTER || ''} className="mt-8" />;
`;

  fs.writeFileSync(path.join(ROOT, 'src', 'components', 'ads', 'AdSense.tsx'), adComponent);
  fs.mkdirSync(path.join(ROOT, 'src', 'components', 'ads'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'src', 'components', 'ads', 'AdSense.tsx'), adComponent);
  console.log('   ✅ src/components/ads/AdSense.tsx');

  // Save full report
  const fullReport = {
    generatedAt: new Date().toISOString(),
    adsensePlacements: ADSENSE_PLACEMENTS,
    affiliatePrograms: AFFILIATE_PROGRAMS,
    revenueProjections: scenarios.map(s => ({ ...s, revenue: calculateRevenue(s.visitors) })),
    recommendations: [
      'أضف AdSense header banner أولاً — أعلى RPM',
      'سجّل في ShipStation Affiliate — أعلى عمولة',
      'أضف in-content ads بعد نتائج التتبع',
      'أنشئ صفحة "أفضل أدوات الشحن" للـ affiliate',
      'فعّل Auto Ads من AdSense للتحسين التلقائي'
    ]
  };

  fs.writeFileSync(path.join(DATA_DIR, 'revenue-report.json'), JSON.stringify(fullReport, null, 2));

  // Generate .env.example additions
  const envAdditions = `
# ─── AdSense Configuration ───────────────────────────────────────────────────
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX
VITE_AD_HEADER=XXXXXXXXXX
VITE_AD_CONTENT=XXXXXXXXXX
VITE_AD_SIDEBAR=XXXXXXXXXX
VITE_AD_FOOTER=XXXXXXXXXX

# ─── Affiliate Tracking ───────────────────────────────────────────────────────
VITE_SHIPSTATION_AFFILIATE_ID=your_id
VITE_STAMPS_AFFILIATE_ID=your_id
VITE_PIRATESHIP_AFFILIATE_ID=your_id
`;

  const envFile = path.join(ROOT, '.env.example');
  const existing = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '';
  if (!existing.includes('ADSENSE')) {
    fs.appendFileSync(envFile, envAdditions);
    console.log('   ✅ .env.example محدّث بمتغيرات AdSense');
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  ✅ تحليل الدخل مكتمل!                                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\n💰 الدخل المتوقع (100K زائر/شهر):');
  const proj100k = calculateRevenue(100000);
  console.log(`   AdSense: $${proj100k.adsense}/شهر`);
  console.log(`   Affiliate: $${proj100k.affiliate}/شهر`);
  console.log(`   الإجمالي: $${proj100k.total}/شهر`);
  console.log(`   سنوياً: $${proj100k.annual}`);
  console.log('\n🎯 الخطوات الفورية:');
  console.log('   1. سجّل في Google AdSense: https://adsense.google.com');
  console.log('   2. سجّل في ShipStation Affiliate: https://shipstation.com/partners/affiliate/');
  console.log('   3. أضف VITE_ADSENSE_CLIENT في .env');
  console.log('   4. ضع <HeaderAd /> في الـ Header component');
}

main().catch(console.error);

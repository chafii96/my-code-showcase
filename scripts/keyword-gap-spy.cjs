#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  🕵️ KEYWORD GAP SPY — Competitor Intelligence Engine                  ║
 * ║  يكشف الكلمات المفتاحية التي يتصدر بها المنافسون ولا تستهدفها أنت    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'seo-data', 'competitor-intel');

const MY_DOMAIN = 'uspostaltracking.com';
const COMPETITORS = [
  { domain: 'usps.com', da: 91, type: 'official', strength: 'الموقع الرسمي' },
  { domain: 'packagetrackr.com', da: 45, type: 'tracker', strength: 'تتبع متعدد الناقلين' },
  { domain: '17track.net', da: 67, type: 'tracker', strength: 'تتبع دولي' },
  { domain: 'parcelsapp.com', da: 52, type: 'tracker', strength: 'تطبيق موبايل' },
  { domain: 'trackingmore.com', da: 58, type: 'tracker', strength: 'API للمطورين' },
  { domain: 'aftership.com', da: 71, type: 'saas', strength: 'حلول للتجارة الإلكترونية' },
  { domain: 'stamps.com', da: 82, type: 'service', strength: 'طباعة طوابع' },
];

// Keyword gap database (real: use Ahrefs/SEMrush API)
const KEYWORD_GAPS = {
  'high-volume-untapped': [
    { kw: 'usps tracking number format', vol: 45000, diff: 32, myPos: null, competitorPos: 3 },
    { kw: 'usps tracking history', vol: 38000, diff: 28, myPos: null, competitorPos: 5 },
    { kw: 'usps package not delivered', vol: 67000, diff: 41, myPos: null, competitorPos: 4 },
    { kw: 'usps informed delivery', vol: 890000, diff: 55, myPos: null, competitorPos: 2 },
    { kw: 'usps hold mail', vol: 320000, diff: 48, myPos: null, competitorPos: 3 },
    { kw: 'usps change of address', vol: 1200000, diff: 62, myPos: null, competitorPos: 2 },
    { kw: 'usps zip code lookup', vol: 450000, diff: 45, myPos: null, competitorPos: 4 },
    { kw: 'usps post office hours', vol: 280000, diff: 38, myPos: null, competitorPos: 6 },
  ],
  'long-tail-opportunities': [
    { kw: 'how long does usps priority mail take', vol: 22000, diff: 18, myPos: null, competitorPos: 7 },
    { kw: 'usps tracking shows delivered but not received', vol: 18000, diff: 22, myPos: null, competitorPos: 5 },
    { kw: 'usps package stuck in transit for 2 weeks', vol: 12000, diff: 15, myPos: null, competitorPos: 8 },
    { kw: 'what does usps in transit mean', vol: 35000, diff: 25, myPos: null, competitorPos: 4 },
    { kw: 'usps tracking number starts with 9400', vol: 8500, diff: 12, myPos: null, competitorPos: 6 },
    { kw: 'usps tracking number 22 digits', vol: 6700, diff: 10, myPos: null, competitorPos: 9 },
    { kw: 'usps package arrived at facility', vol: 9200, diff: 14, myPos: null, competitorPos: 7 },
    { kw: 'usps expected delivery by 9pm meaning', vol: 7800, diff: 11, myPos: null, competitorPos: 5 },
    { kw: 'usps tracking not showing up', vol: 14000, diff: 20, myPos: null, competitorPos: 6 },
    { kw: 'usps package delivered to wrong address', vol: 11000, diff: 18, myPos: null, competitorPos: 8 },
  ],
  'question-keywords': [
    { kw: 'why is my usps package late', vol: 28000, diff: 22, myPos: null, competitorPos: 5 },
    { kw: 'where is my usps package', vol: 45000, diff: 30, myPos: null, competitorPos: 3 },
    { kw: 'how to track usps package without tracking number', vol: 19000, diff: 25, myPos: null, competitorPos: 6 },
    { kw: 'can usps packages be tracked in real time', vol: 8900, diff: 15, myPos: null, competitorPos: 8 },
    { kw: 'does usps deliver on sunday', vol: 180000, diff: 35, myPos: null, competitorPos: 4 },
    { kw: 'does usps deliver on saturday', vol: 220000, diff: 38, myPos: null, competitorPos: 3 },
    { kw: 'how late does usps deliver', vol: 95000, diff: 32, myPos: null, competitorPos: 4 },
    { kw: 'what time does usps deliver', vol: 320000, diff: 42, myPos: null, competitorPos: 2 },
  ],
  'local-seo-gaps': [
    { kw: 'usps tracking new york city', vol: 8900, diff: 18, myPos: null, competitorPos: 7 },
    { kw: 'usps post office near me', vol: 450000, diff: 52, myPos: null, competitorPos: 2 },
    { kw: 'usps tracking california', vol: 12000, diff: 22, myPos: null, competitorPos: 6 },
    { kw: 'usps tracking texas', vol: 9800, diff: 20, myPos: null, competitorPos: 7 },
    { kw: 'usps tracking florida', vol: 8700, diff: 19, myPos: null, competitorPos: 8 },
  ]
};

function calculateOpportunityScore(kw) {
  // Score = (Volume / 1000) * (100 - Difficulty) / 10
  return Math.floor((kw.vol / 1000) * ((100 - kw.diff) / 10));
}

function generateContentBrief(kw) {
  return {
    targetKeyword: kw.kw,
    secondaryKeywords: [
      kw.kw.replace('usps', 'usps mail'),
      kw.kw + ' 2025',
      kw.kw + ' guide',
    ],
    recommendedTitle: `${kw.kw.charAt(0).toUpperCase() + kw.kw.slice(1)}: Complete Guide 2025`,
    recommendedH1: `${kw.kw.charAt(0).toUpperCase() + kw.kw.slice(1)} — Everything You Need to Know`,
    wordCount: kw.vol > 50000 ? '2000-3000' : kw.vol > 10000 ? '1500-2000' : '1000-1500',
    contentType: kw.kw.startsWith('how') || kw.kw.startsWith('what') || kw.kw.startsWith('why') ? 'FAQ/Guide' : 'Informational',
    schemaType: kw.kw.startsWith('how') ? 'HowTo' : 'FAQPage',
    internalLinks: ['USPS Tracking', 'Track Package', 'USPS Status Codes'],
    estimatedRankTime: kw.diff < 20 ? '2-4 weeks' : kw.diff < 40 ? '1-3 months' : '3-6 months'
  };
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  🕵️ KEYWORD GAP SPY — Competitor Intelligence           ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n🎯 موقعك: ${MY_DOMAIN}`);
  console.log(`🔍 تحليل ${COMPETITORS.length} منافس...\n`);

  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Competitor analysis
  console.log('📊 تحليل المنافسين:\n');
  for (const comp of COMPETITORS) {
    const threat = comp.da > 70 ? '🔴 تهديد عالي' : comp.da > 50 ? '🟡 تهديد متوسط' : '🟢 قابل للمنافسة';
    console.log(`  ${threat} ${comp.domain} — DA: ${comp.da} | ${comp.strength}`);
  }

  // Keyword gap analysis
  console.log('\n\n🎯 تحليل فجوات الكلمات المفتاحية:\n');
  
  let totalOpportunities = 0;
  let totalVolume = 0;
  const allOpportunities = [];

  for (const [category, keywords] of Object.entries(KEYWORD_GAPS)) {
    console.log(`\n📂 ${category.replace(/-/g, ' ').toUpperCase()}:`);
    console.log('  ┌────────────────────────────────────────────┬──────────┬──────┬───────┐');
    console.log('  │ الكلمة المفتاحية                           │ الحجم    │ صعوبة│ فرصة  │');
    console.log('  ├────────────────────────────────────────────┼──────────┼──────┼───────┤');
    
    for (const kw of keywords) {
      const score = calculateOpportunityScore(kw);
      const scoreBar = '█'.repeat(Math.min(5, Math.floor(score / 20)));
      console.log(`  │ ${kw.kw.padEnd(42)} │ ${String(kw.vol.toLocaleString()).padEnd(8)} │ ${String(kw.diff).padEnd(4)} │ ${String(score).padEnd(5)} │`);
      
      allOpportunities.push({
        ...kw,
        category,
        opportunityScore: score,
        contentBrief: generateContentBrief(kw)
      });
      totalVolume += kw.vol;
      totalOpportunities++;
    }
    console.log('  └────────────────────────────────────────────┴──────────┴──────┴───────┘');
  }

  // Sort by opportunity score
  allOpportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);
  
  console.log('\n\n🏆 أفضل 10 فرص فورية:\n');
  allOpportunities.slice(0, 10).forEach((kw, i) => {
    console.log(`  ${i+1}. "${kw.kw}"`);
    console.log(`     📊 حجم: ${kw.vol.toLocaleString()} | صعوبة: ${kw.diff}% | فرصة: ${kw.opportunityScore}`);
    console.log(`     📝 محتوى: ${kw.contentBrief.wordCount} كلمة | نوع: ${kw.contentBrief.contentType}`);
    console.log(`     ⏱️ وقت التصدر: ${kw.contentBrief.estimatedRankTime}\n`);
  });

  // Save full report
  const report = {
    generatedAt: new Date().toISOString(),
    myDomain: MY_DOMAIN,
    competitors: COMPETITORS,
    summary: {
      totalOpportunities,
      totalMonthlyVolume: totalVolume,
      avgDifficulty: Math.floor(allOpportunities.reduce((a, k) => a + k.diff, 0) / allOpportunities.length),
      topOpportunity: allOpportunities[0]?.kw
    },
    opportunities: allOpportunities,
    actionPlan: allOpportunities.slice(0, 20).map((kw, i) => ({
      priority: i + 1,
      keyword: kw.kw,
      volume: kw.vol,
      difficulty: kw.diff,
      score: kw.opportunityScore,
      contentBrief: kw.contentBrief,
      estimatedTraffic: Math.floor(kw.vol * 0.05) // 5% CTR estimate
    }))
  };

  fs.writeFileSync(path.join(DATA_DIR, 'keyword-gaps.json'), JSON.stringify(report, null, 2));

  // Generate content calendar
  const calendar = `# 📅 تقويم المحتوى — أفضل 20 فرصة

| الأولوية | الكلمة المفتاحية | الحجم | الصعوبة | الكلمات | الوقت |
|---------|-----------------|-------|---------|---------|-------|
${allOpportunities.slice(0, 20).map((kw, i) => 
  `| ${i+1} | ${kw.kw} | ${kw.vol.toLocaleString()} | ${kw.diff}% | ${kw.contentBrief.wordCount} | ${kw.contentBrief.estimatedRankTime} |`
).join('\n')}

## إجمالي الزيارات المتوقعة
إذا تصدّرت أفضل 10 كلمات مفتاحية بـ 5% CTR:
**${allOpportunities.slice(0, 10).reduce((a, k) => a + Math.floor(k.vol * 0.05), 0).toLocaleString()} زيارة/شهر إضافية**
`;

  fs.writeFileSync(path.join(DATA_DIR, 'content-calendar.md'), calendar);

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  ✅ تحليل الفجوات مكتمل!                                ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n📊 الملخص:`);
  console.log(`   🎯 إجمالي الفرص: ${totalOpportunities}`);
  console.log(`   📊 إجمالي حجم البحث: ${totalVolume.toLocaleString()}/شهر`);
  console.log(`   🏆 أفضل فرصة: "${allOpportunities[0]?.kw}" (${allOpportunities[0]?.vol.toLocaleString()} بحث/شهر)`);
  console.log(`   📈 الزيارات المتوقعة (Top 10): ${allOpportunities.slice(0, 10).reduce((a, k) => a + Math.floor(k.vol * 0.05), 0).toLocaleString()}/شهر`);
}

main().catch(console.error);

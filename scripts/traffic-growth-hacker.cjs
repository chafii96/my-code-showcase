#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  🚀 TRAFFIC GROWTH HACKER — Multi-Channel Traffic Dominator            ║
 * ║  يحلل ويخطط لنمو الزيارات من جميع القنوات: SEO + Social + Referral   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'seo-data', 'traffic');

// ─── Traffic Sources Strategy ─────────────────────────────────────────────────
const TRAFFIC_SOURCES = {
  organic: {
    name: 'Organic Search (SEO)',
    currentShare: 0,
    targetShare: 65,
    strategies: [
      { action: 'استهداف 200+ كلمة مفتاحية long-tail', impact: 'عالي', timeframe: '2-4 أشهر' },
      { action: 'نشر 3 مقالات/أسبوع', impact: 'عالي', timeframe: '1-3 أشهر' },
      { action: 'بناء 50 backlink/شهر', impact: 'عالي', timeframe: '3-6 أشهر' },
      { action: 'تحسين Core Web Vitals', impact: 'متوسط', timeframe: '2-4 أسابيع' },
    ]
  },
  social: {
    name: 'Social Media',
    currentShare: 0,
    targetShare: 15,
    strategies: [
      { action: 'Reddit: أجب 10 أسئلة/يوم في r/USPS', impact: 'عالي', timeframe: 'فوري' },
      { action: 'Pinterest: 5 infographics/أسبوع', impact: 'متوسط', timeframe: '1-2 أشهر' },
      { action: 'Facebook Groups: شارك في مجموعات الشحن', impact: 'متوسط', timeframe: 'فوري' },
      { action: 'Twitter/X: نشر tips يومية عن USPS', impact: 'منخفض', timeframe: '1-3 أشهر' },
    ]
  },
  referral: {
    name: 'Referral Traffic',
    currentShare: 0,
    targetShare: 10,
    strategies: [
      { action: 'نشر على Quora: 5 إجابات/يوم', impact: 'عالي', timeframe: 'فوري' },
      { action: 'Guest posting على مواقع eCommerce', impact: 'عالي', timeframe: '1-2 أشهر' },
      { action: 'تسجيل في 50 directory', impact: 'متوسط', timeframe: '1-2 أسابيع' },
      { action: 'شراكات مع مدونات الشحن', impact: 'متوسط', timeframe: '2-3 أشهر' },
    ]
  },
  direct: {
    name: 'Direct Traffic',
    currentShare: 0,
    targetShare: 10,
    strategies: [
      { action: 'بناء Brand awareness بالمحتوى', impact: 'متوسط', timeframe: '3-6 أشهر' },
      { action: 'Email newsletter للزوار المتكررين', impact: 'متوسط', timeframe: '1-2 أشهر' },
      { action: 'Push notifications للتحديثات', impact: 'منخفض', timeframe: '2-4 أسابيع' },
    ]
  }
};

// ─── Content Calendar Generator ───────────────────────────────────────────────
function generateContentCalendar(weeks = 4) {
  const calendar = [];
  const contentTypes = [
    { type: 'مقال شامل', wordCount: 2000, seoValue: 'عالي', time: '3 ساعات' },
    { type: 'دليل خطوة بخطوة', wordCount: 1500, seoValue: 'عالي', time: '2 ساعات' },
    { type: 'مقارنة', wordCount: 1200, seoValue: 'متوسط', time: '1.5 ساعة' },
    { type: 'FAQ', wordCount: 800, seoValue: 'متوسط', time: '1 ساعة' },
    { type: 'أخبار USPS', wordCount: 500, seoValue: 'منخفض', time: '30 دقيقة' },
  ];

  const topics = [
    { title: 'دليل شامل لتتبع USPS 2025', kw: 'usps tracking guide', vol: 45000 },
    { title: 'ماذا يعني "In Transit" في USPS؟', kw: 'usps in transit meaning', vol: 35000 },
    { title: 'كيف تتتبع طرد USPS بدون رقم تتبع', kw: 'track usps without tracking number', vol: 19000 },
    { title: 'USPS Priority Mail vs First Class: الفرق', kw: 'usps priority vs first class', vol: 28000 },
    { title: 'ماذا تفعل إذا لم يصل طردك USPS', kw: 'usps package not delivered', vol: 67000 },
    { title: 'أسرع طرق التتبع في USPS', kw: 'fastest usps tracking method', vol: 12000 },
    { title: 'USPS Informed Delivery: الدليل الكامل', kw: 'usps informed delivery guide', vol: 89000 },
    { title: 'كيف تقدم شكوى لـ USPS', kw: 'file usps complaint', vol: 22000 },
    { title: 'USPS Tracking Number Formats Explained', kw: 'usps tracking number format', vol: 45000 },
    { title: 'هل USPS يوصل يوم الأحد؟', kw: 'does usps deliver sunday', vol: 180000 },
    { title: 'USPS Package Stuck? Here\'s What to Do', kw: 'usps package stuck in transit', vol: 140000 },
    { title: 'Best USPS Tracking Apps 2025', kw: 'best usps tracking app', vol: 38000 },
  ];

  for (let week = 1; week <= weeks; week++) {
    const weekTopics = topics.slice((week - 1) * 3, week * 3);
    calendar.push({
      week,
      startDate: new Date(Date.now() + (week - 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ar'),
      posts: weekTopics.map((topic, i) => ({
        day: ['الاثنين', 'الأربعاء', 'الجمعة'][i],
        title: topic.title,
        keyword: topic.kw,
        searchVolume: topic.vol,
        contentType: contentTypes[i % contentTypes.length].type,
        wordCount: contentTypes[i % contentTypes.length].wordCount,
        estimatedTime: contentTypes[i % contentTypes.length].time,
        seoValue: contentTypes[i % contentTypes.length].seoValue,
        socialPosts: {
          reddit: `r/USPS, r/Shipping`,
          quora: `"${topic.title}" related questions`,
          pinterest: `Infographic about ${topic.kw}`
        }
      }))
    });
  }
  return calendar;
}

// ─── Traffic Projection Model ─────────────────────────────────────────────────
function projectTraffic(months = 12) {
  const projections = [];
  let currentVisitors = 0;
  
  for (let month = 1; month <= months; month++) {
    // Growth model: slow start, then exponential
    const growthRate = month <= 3 ? 0.3 : month <= 6 ? 0.5 : month <= 9 ? 0.7 : 0.4;
    const newContent = month * 12; // 12 articles per month
    const backlinks = month * 30; // 30 backlinks per month
    
    currentVisitors = Math.floor(
      newContent * 50 * (1 + backlinks / 500) * (1 + month * 0.1)
    );

    const revenue = {
      adsense: Math.floor((currentVisitors / 1000) * 3.5),
      affiliate: Math.floor(currentVisitors * 0.03 * 25 * 0.1),
    };

    projections.push({
      month,
      visitors: currentVisitors,
      pageviews: Math.floor(currentVisitors * 2.3),
      organicShare: Math.min(65, 30 + month * 3),
      revenue: {
        ...revenue,
        total: revenue.adsense + revenue.affiliate
      },
      content: {
        articles: newContent,
        backlinks
      }
    });
  }
  return projections;
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  🚀 TRAFFIC GROWTH HACKER — Multi-Channel Dominator     ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n📅 ${new Date().toLocaleString('ar')}\n`);

  fs.mkdirSync(DATA_DIR, { recursive: true });

  // ── Traffic Sources ───────────────────────────────────────────────────────
  console.log('📊 استراتيجية مصادر الزيارات:\n');
  for (const [key, source] of Object.entries(TRAFFIC_SOURCES)) {
    console.log(`  🎯 ${source.name} — الهدف: ${source.targetShare}% من الزيارات`);
    source.strategies.slice(0, 2).forEach(s => {
      const impact = s.impact === 'عالي' ? '🔥' : s.impact === 'متوسط' ? '⭐' : '📌';
      console.log(`     ${impact} ${s.action} (${s.timeframe})`);
    });
    console.log();
  }

  // ── Content Calendar ──────────────────────────────────────────────────────
  console.log('📅 تقويم المحتوى — 4 أسابيع:\n');
  const calendar = generateContentCalendar(4);
  
  for (const week of calendar) {
    console.log(`  📅 الأسبوع ${week.week} (${week.startDate}):`);
    week.posts.forEach(post => {
      console.log(`     ${post.day}: "${post.title}"`);
      console.log(`     📊 حجم: ${post.searchVolume.toLocaleString()} | ${post.wordCount} كلمة | ${post.estimatedTime}`);
    });
    console.log();
  }

  // ── Traffic Projections ───────────────────────────────────────────────────
  console.log('📈 توقعات الزيارات — 12 شهر:\n');
  const projections = projectTraffic(12);
  
  console.log('  ┌────────┬──────────────┬──────────────┬──────────┬──────────┐');
  console.log('  │ الشهر  │ الزوار       │ Page Views   │ AdSense  │ Affiliate│');
  console.log('  ├────────┼──────────────┼──────────────┼──────────┼──────────┤');
  
  for (const p of projections) {
    if (p.month % 3 === 0 || p.month === 1) {
      console.log(`  │ ${String(p.month).padEnd(6)} │ ${String(p.visitors.toLocaleString()).padEnd(12)} │ ${String(p.pageviews.toLocaleString()).padEnd(12)} │ $${String(p.revenue.adsense).padEnd(7)} │ $${String(p.revenue.affiliate).padEnd(8)} │`);
    }
  }
  console.log('  └────────┴──────────────┴──────────────┴──────────┴──────────┘');

  const month12 = projections[11];
  console.log(`\n  🎯 بعد 12 شهر:`);
  console.log(`     👥 الزوار: ${month12.visitors.toLocaleString()}/شهر`);
  console.log(`     📄 Page Views: ${month12.pageviews.toLocaleString()}/شهر`);
  console.log(`     💰 الدخل: $${month12.revenue.total.toLocaleString()}/شهر`);
  console.log(`     💰 سنوياً: $${projections.reduce((a, p) => a + p.revenue.total, 0).toLocaleString()}`);

  // ── Quick Wins ────────────────────────────────────────────────────────────
  console.log('\n⚡ Quick Wins — نتائج خلال 7 أيام:\n');
  const quickWins = [
    { action: 'أجب على 5 أسئلة في r/USPS يومياً', expectedTraffic: '50-200 زيارة/يوم', effort: 'منخفض' },
    { action: 'أجب على 10 أسئلة في Quora عن USPS', expectedTraffic: '30-100 زيارة/يوم', effort: 'منخفض' },
    { action: 'أنشئ Pinterest board عن USPS tracking', expectedTraffic: '20-80 زيارة/يوم', effort: 'منخفض' },
    { action: 'سجّل في 10 business directories', expectedTraffic: '10-50 زيارة/يوم', effort: 'منخفض' },
    { action: 'انشر مقال "USPS Tracking 2025" على Medium', expectedTraffic: '100-500 زيارة', effort: 'متوسط' },
  ];

  quickWins.forEach((win, i) => {
    console.log(`  ${i+1}. ${win.action}`);
    console.log(`     📈 الزيارات المتوقعة: ${win.expectedTraffic} | الجهد: ${win.effort}\n`);
  });

  // Save all data
  const fullReport = {
    generatedAt: new Date().toISOString(),
    trafficSources: TRAFFIC_SOURCES,
    contentCalendar: calendar,
    projections,
    quickWins,
    summary: {
      month3Visitors: projections[2].visitors,
      month6Visitors: projections[5].visitors,
      month12Visitors: projections[11].visitors,
      totalAnnualRevenue: projections.reduce((a, p) => a + p.revenue.total, 0)
    }
  };

  fs.writeFileSync(path.join(DATA_DIR, 'traffic-report.json'), JSON.stringify(fullReport, null, 2));

  // Save content calendar as markdown
  const calendarMd = `# 📅 تقويم المحتوى — 4 أسابيع

${calendar.map(week => `
## الأسبوع ${week.week} (${week.startDate})

${week.posts.map(post => `
### ${post.day}: ${post.title}
- **الكلمة المفتاحية**: ${post.keyword} (${post.searchVolume.toLocaleString()} بحث/شهر)
- **نوع المحتوى**: ${post.contentType} (${post.wordCount} كلمة)
- **الوقت المقدر**: ${post.estimatedTime}
- **النشر الاجتماعي**: ${post.socialPosts.reddit}
`).join('')}
`).join('')}
`;

  fs.writeFileSync(path.join(DATA_DIR, 'content-calendar.md'), calendarMd);

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  ✅ خطة النمو مكتملة!                                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n📊 الملخص:`);
  console.log(`   📅 تقويم محتوى: 4 أسابيع (${calendar.reduce((a, w) => a + w.posts.length, 0)} مقال)`);
  console.log(`   📈 الزوار بعد 6 أشهر: ${projections[5].visitors.toLocaleString()}`);
  console.log(`   💰 الدخل بعد 12 شهر: $${projections[11].revenue.total.toLocaleString()}/شهر`);
  console.log(`   ⚡ Quick Wins: ${quickWins.length} إجراء فوري`);
}

main().catch(console.error);

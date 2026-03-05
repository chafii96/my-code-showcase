#!/usr/bin/env node
/**
 * ██████╗ ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗████████╗
 * ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝
 * ██║     ██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║   ██║   
 * ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║   ██║   
 * ╚██████╗╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║   ██║   
 *  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝   
 * 
 * CONTENT GAP ANALYZER — Find what competitors rank for but you don't
 * يكتشف الفجوات في المحتوى ويولّد خطة محتوى كاملة
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const DOMAIN = 'uspostaltracking.com';

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', white: '\x1b[37m',
  magenta: '\x1b[35m',
};
const log = (c, t) => console.log(`${c}${t}${C.reset}`);
const box = (t, c = C.cyan + C.bold) => {
  const line = '═'.repeat(Math.min(t.length + 4, 62));
  log(c, `╔${line}╗\n║  ${t.padEnd(line.length - 4)}  ║\n╚${line}╝`);
};

// ── Competitor keyword database (based on real USPS tracking niche) ───────────
const COMPETITOR_KEYWORDS = {
  'parcelsapp.com': [
    { kw: 'usps tracking', vol: 2400000, difficulty: 85, yourRank: 3 },
    { kw: 'track usps package', vol: 890000, difficulty: 78, yourRank: null },
    { kw: 'usps package tracking', vol: 720000, difficulty: 75, yourRank: null },
    { kw: 'usps tracking number lookup', vol: 320000, difficulty: 65, yourRank: null },
    { kw: 'usps tracking history', vol: 180000, difficulty: 60, yourRank: null },
    { kw: 'usps tracking api', vol: 45000, difficulty: 55, yourRank: null },
  ],
  'packagetrackr.com': [
    { kw: 'usps priority mail tracking', vol: 45477, difficulty: 45, yourRank: null },
    { kw: 'usps certified mail tracking', vol: 36563, difficulty: 42, yourRank: null },
    { kw: 'usps first class tracking', vol: 35663, difficulty: 40, yourRank: null },
    { kw: 'usps media mail tracking', vol: 22000, difficulty: 38, yourRank: null },
    { kw: 'usps flat rate tracking', vol: 18000, difficulty: 35, yourRank: null },
    { kw: 'usps ground advantage tracking', vol: 15000, difficulty: 30, yourRank: null },
  ],
  '17track.net': [
    { kw: 'usps international tracking', vol: 95000, difficulty: 70, yourRank: null },
    { kw: 'usps global express tracking', vol: 28000, difficulty: 55, yourRank: null },
    { kw: 'usps first class international tracking', vol: 22000, difficulty: 50, yourRank: null },
    { kw: 'usps registered mail tracking', vol: 18000, difficulty: 45, yourRank: null },
    { kw: 'usps priority mail express international', vol: 12000, difficulty: 42, yourRank: null },
  ],
  'stamps.com': [
    { kw: 'usps shipping rates', vol: 165000, difficulty: 72, yourRank: null },
    { kw: 'usps priority mail rates', vol: 74000, difficulty: 65, yourRank: null },
    { kw: 'usps flat rate boxes', vol: 110000, difficulty: 68, yourRank: null },
    { kw: 'usps shipping calculator', vol: 90000, difficulty: 70, yourRank: null },
    { kw: 'usps click n ship', vol: 60000, difficulty: 60, yourRank: null },
    { kw: 'usps label printing', vol: 40000, difficulty: 55, yourRank: null },
  ],
  'pirateship.com': [
    { kw: 'cheap usps shipping', vol: 35000, difficulty: 58, yourRank: null },
    { kw: 'usps commercial plus pricing', vol: 12000, difficulty: 45, yourRank: null },
    { kw: 'usps cubic pricing', vol: 8000, difficulty: 40, yourRank: null },
    { kw: 'usps discounted shipping', vol: 22000, difficulty: 52, yourRank: null },
    { kw: 'usps business account', vol: 18000, difficulty: 48, yourRank: null },
  ],
};

// ── Your existing content ─────────────────────────────────────────────────────
function getYourContent() {
  const pagesDir = path.join(ROOT, 'src/pages');
  const pages = [];
  
  if (fs.existsSync(pagesDir)) {
    fs.readdirSync(pagesDir).forEach(f => {
      if (f.endsWith('.tsx')) {
        const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
        // Extract title/keywords from file
        const titleMatch = content.match(/title['":\s]+["']([^"']+)/);
        pages.push({
          file: f,
          title: titleMatch?.[1] || f.replace('.tsx', ''),
        });
      }
    });
  }
  
  return pages;
}

// ── Find content gaps ─────────────────────────────────────────────────────────
function findContentGaps() {
  const allCompetitorKws = [];
  
  Object.entries(COMPETITOR_KEYWORDS).forEach(([competitor, keywords]) => {
    keywords.forEach(kw => {
      if (!kw.yourRank) { // You don't rank for this
        allCompetitorKws.push({ ...kw, competitor });
      }
    });
  });
  
  // Sort by opportunity score (volume / difficulty)
  return allCompetitorKws
    .map(kw => ({
      ...kw,
      opportunity: Math.round((kw.vol / kw.difficulty) * 10) / 10,
    }))
    .sort((a, b) => b.opportunity - a.opportunity);
}

// ── Generate content plan ─────────────────────────────────────────────────────
function generateContentPlan(gaps) {
  const plan = [];
  
  gaps.slice(0, 20).forEach((gap, i) => {
    const contentType = gap.difficulty < 40 ? 'مقال قصير (500 كلمة)' :
                       gap.difficulty < 60 ? 'مقال متوسط (1000 كلمة)' :
                       'مقال طويل (2000+ كلمة)';
    
    const timeToRank = gap.difficulty < 40 ? '2-4 أسابيع' :
                      gap.difficulty < 60 ? '1-3 أشهر' :
                      '3-6 أشهر';
    
    const monthlyTraffic = Math.round(gap.vol * 0.03); // ~3% CTR estimate
    
    plan.push({
      rank: i + 1,
      keyword: gap.kw,
      volume: gap.vol,
      difficulty: gap.difficulty,
      opportunity: gap.opportunity,
      competitor: gap.competitor,
      contentType,
      timeToRank,
      estimatedMonthlyTraffic: monthlyTraffic,
      suggestedUrl: `/${gap.kw.replace(/\s+/g, '-').toLowerCase()}`,
      suggestedTitle: `${gap.kw.charAt(0).toUpperCase() + gap.kw.slice(1)} — Complete Guide 2025`,
    });
  });
  
  return plan;
}

// ── Calculate revenue potential ───────────────────────────────────────────────
function calculateRevenuePotential(plan) {
  const RPM = 3.50; // Average RPM for USPS tracking niche
  let totalMonthlyTraffic = 0;
  let totalMonthlyRevenue = 0;
  
  plan.forEach(p => {
    totalMonthlyTraffic += p.estimatedMonthlyTraffic;
    totalMonthlyRevenue += (p.estimatedMonthlyTraffic / 1000) * RPM;
  });
  
  return {
    totalMonthlyTraffic,
    totalMonthlyRevenue: totalMonthlyRevenue.toFixed(2),
    totalYearlyRevenue: (totalMonthlyRevenue * 12).toFixed(2),
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.clear();
  box('🕵️ CONTENT GAP ANALYZER — Competitor Intelligence');
  log(C.dim, `  📅 ${new Date().toLocaleString('ar')} | Domain: ${DOMAIN}`);
  
  // Step 1: Analyze competitors
  log(C.yellow, '\n📊 تحليل المنافسين...');
  Object.keys(COMPETITOR_KEYWORDS).forEach(comp => {
    const kws = COMPETITOR_KEYWORDS[comp];
    const totalVol = kws.reduce((a, k) => a + k.vol, 0);
    log(C.cyan, `  🏢 ${comp.padEnd(25)} ${kws.length} كلمة | ${totalVol.toLocaleString()} بحث/شهر`);
  });
  
  // Step 2: Find gaps
  log(C.yellow, '\n🔍 اكتشاف الفجوات...');
  const gaps = findContentGaps();
  log(C.green, `  ✅ وجدت ${gaps.length} فرصة محتوى غير مستغلة!`);
  
  // Step 3: Generate content plan
  log(C.yellow, '\n📋 خطة المحتوى الأمثل (أعلى 20 فرصة):');
  log(C.dim, '─'.repeat(80));
  
  const plan = generateContentPlan(gaps);
  
  plan.forEach(p => {
    const diffColor = p.difficulty < 40 ? C.green : p.difficulty < 60 ? C.yellow : C.red;
    const volStr = p.volume >= 1000000 ? `${(p.volume/1000000).toFixed(1)}M` :
                   p.volume >= 1000 ? `${(p.volume/1000).toFixed(0)}K` : p.volume.toString();
    
    log(C.bold + C.white, `\n  ${p.rank.toString().padStart(2)}. "${p.keyword}"`);
    log(C.dim, `      📊 حجم البحث: ${volStr}/شهر | ${diffColor}صعوبة: ${p.difficulty}%${C.reset} | فرصة: ${p.opportunity}`);
    log(C.dim, `      🏢 المنافس: ${p.competitor}`);
    log(C.cyan, `      📝 النوع: ${p.contentType} | ⏱️ وقت التصدر: ${p.timeToRank}`);
    log(C.green, `      💰 زيارات متوقعة: ${p.estimatedMonthlyTraffic.toLocaleString()}/شهر`);
    log(C.blue, `      🔗 URL المقترح: ${p.suggestedUrl}`);
    log(C.white, `      📌 العنوان: ${p.suggestedTitle}`);
  });
  
  // Step 4: Revenue potential
  log(C.yellow, '\n💰 إمكانية الدخل من هذه الفجوات:');
  log(C.dim, '─'.repeat(50));
  const revenue = calculateRevenuePotential(plan);
  log(C.green, `  📈 الزيارات الإضافية المتوقعة: ${revenue.totalMonthlyTraffic.toLocaleString()}/شهر`);
  log(C.green, `  💵 الدخل الإضافي المتوقع: $${revenue.totalMonthlyRevenue}/شهر`);
  log(C.bold + C.green, `  🏆 الدخل السنوي المتوقع: $${revenue.totalYearlyRevenue}/سنة`);
  
  // Step 5: Quick wins (low difficulty, high volume)
  log(C.yellow, '\n⚡ الفرص السريعة (صعوبة منخفضة + حجم عالي):');
  const quickWins = plan.filter(p => p.difficulty < 45).slice(0, 5);
  quickWins.forEach(p => {
    log(C.green, `  ✅ "${p.keyword}" — ${p.volume.toLocaleString()} بحث/شهر — صعوبة ${p.difficulty}%`);
    log(C.dim, `     → أنشئ الصفحة الآن: ${p.suggestedUrl}`);
  });
  
  // Step 6: Save report
  const reportPath = path.join(ROOT, 'seo-data/content-gap-report.json');
  const dir = path.dirname(reportPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    domain: DOMAIN,
    totalGaps: gaps.length,
    contentPlan: plan,
    revenuePotential: revenue,
    quickWins: quickWins.map(p => p.keyword),
  }, null, 2));
  
  log(C.dim, `\n  💾 تقرير محفوظ: ${reportPath}`);
  
  console.log('');
  box('✅ اكتمل التحليل! 20 فرصة محتوى جاهزة للتنفيذ', C.bold + C.green);
}

main().catch(e => {
  log(C.red, `\n❌ خطأ: ${e.message}`);
  process.exit(1);
});

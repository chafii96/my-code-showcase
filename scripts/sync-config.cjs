#!/usr/bin/env node
/**
 * 🔄 Sync Config — مزامنة المفاتيح من seo-data/config.json → server/data/config.json
 * 
 * الاستخدام:
 *   node scripts/sync-config.cjs
 *   node scripts/sync-config.cjs --watch    ← مراقبة مستمرة
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SEO_CONFIG = path.join(ROOT, 'seo-data', 'config.json');
const SERVER_CONFIG = path.join(ROOT, 'server', 'data', 'config.json');

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return null; }
}

function sync() {
  const seo = readJSON(SEO_CONFIG);
  if (!seo) { console.log('⚠️  seo-data/config.json غير موجود'); return false; }

  // تأكد من وجود مجلد server/data
  const dir = path.dirname(SERVER_CONFIG);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const srv = readJSON(SERVER_CONFIG) || {};

  // دمج apiKeys (seo-data يأخذ الأولوية للقيم غير الفارغة)
  const seoKeys = seo.apiKeys || {};
  const srvKeys = srv.apiKeys || {};
  const merged = { ...srvKeys };

  let changes = 0;
  for (const [k, v] of Object.entries(seoKeys)) {
    if (v && v !== srvKeys[k]) {
      merged[k] = v;
      changes++;
      console.log(`  ✅ ${k}: ${v.slice(0, 4)}${'*'.repeat(Math.max(0, String(v).length - 4))}`);
    }
  }

  if (changes === 0) {
    console.log('✅ لا توجد تغييرات — الملفات متزامنة');
    return false;
  }

  srv.apiKeys = merged;

  // حفظ بيانات site/seo من seo-data إذا لم تكن موجودة في server
  if (seo.site && !srv.site) srv.site = seo.site;
  if (seo.seo && !srv.seo) srv.seo = seo.seo;
  if (!srv.adminPassword) srv.adminPassword = 'uspostal2024';

  fs.writeFileSync(SERVER_CONFIG, JSON.stringify(srv, null, 2));
  console.log(`\n🔄 تم مزامنة ${changes} مفتاح → server/data/config.json`);
  return true;
}

// ── التشغيل ──
console.log('╔══════════════════════════════════════╗');
console.log('║  🔄 Config Sync — مزامنة المفاتيح   ║');
console.log('╚══════════════════════════════════════╝\n');

sync();

// وضع المراقبة
if (process.argv.includes('--watch')) {
  console.log('\n👁️  وضع المراقبة — أي تغيير في seo-data/config.json سيُزامن تلقائياً...\n');
  fs.watchFile(SEO_CONFIG, { interval: 2000 }, () => {
    console.log(`\n[${new Date().toLocaleTimeString()}] تغيير في seo-data/config.json`);
    sync();
  });
}

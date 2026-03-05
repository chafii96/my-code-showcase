/**
 * Generate sitemap-programmatic.xml from actual files in public/programmatic/
 * Run: node scripts/generate-programmatic-sitemap.cjs
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://uspostaltracking.com';
const today = new Date().toISOString().split('T')[0];
const publicDir = path.join(__dirname, '../public');

const urls = [];

// Scan city-article directory
const cityArticleDir = path.join(publicDir, 'programmatic/city-article');
if (fs.existsSync(cityArticleDir)) {
  fs.readdirSync(cityArticleDir).filter(f => f.endsWith('.html')).forEach(file => {
    const slug = file.replace('.html', '');
    urls.push(`  <url><loc>${BASE}/programmatic/city-article/${slug}.html</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
  });
}

// Scan city-status directory
const cityStatusDir = path.join(publicDir, 'programmatic/city-status');
if (fs.existsSync(cityStatusDir)) {
  fs.readdirSync(cityStatusDir).filter(f => f.endsWith('.html')).forEach(file => {
    const slug = file.replace('.html', '');
    urls.push(`  <url><loc>${BASE}/programmatic/city-status/${slug}.html</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap-programmatic.xml'), xml);
console.log(`✅ Generated sitemap-programmatic.xml with ${urls.length} URLs`);

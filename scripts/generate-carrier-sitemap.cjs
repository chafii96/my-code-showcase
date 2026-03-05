/**
 * Carrier Sitemap Generator
 * Creates sitemap-carriers.xml from all carrier data
 * Run: node scripts/generate-carrier-sitemap.cjs
 */
const fs = require('fs');
const path = require('path');

// Read all carrier IDs from the source files
const carriersFile = fs.readFileSync(path.join(__dirname, '../src/data/carriers.ts'), 'utf8');
const extraFile = fs.readFileSync(path.join(__dirname, '../src/data/carriers-extra.ts'), 'utf8');
const extra2File = fs.readFileSync(path.join(__dirname, '../src/data/carriers-extra2.ts'), 'utf8');

// Extract all carrier IDs using regex
const idRegex = /id:\s*["']([^"']+)["']/g;
const ids = new Set();

for (const content of [carriersFile, extraFile, extra2File]) {
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    ids.add(match[1]);
  }
}

const today = new Date().toISOString().split('T')[0];
const BASE = 'https://uspostaltracking.com';

// Generate carriers sitemap
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE}/tracking</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${BASE}/sitemap</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>
  <url><loc>${BASE}/knowledge-center</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${BASE}/knowledge-center/customs-clearance-guide</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${BASE}/knowledge-center/international-shipping-guide</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${BASE}/knowledge-center/lost-package-guide</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
`;

for (const id of [...ids].sort()) {
  xml += `  <url><loc>${BASE}/tracking/${id}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
}

xml += `</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap-carriers.xml'), xml);
console.log(`✅ Generated sitemap-carriers.xml with ${ids.size} carriers + index/knowledge pages`);

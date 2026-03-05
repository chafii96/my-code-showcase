const fs = require('fs');
const path = require('path');

function writeUnifiedSitemapIndex({ publicDir, siteUrl, preferredOrder = [] }) {
  const order = new Map(preferredOrder.map((name, index) => [name, index]));

  const sitemapFiles = fs
    .readdirSync(publicDir)
    .filter((file) => file.startsWith('sitemap-') && file.endsWith('.xml'))
    .filter((file) => file !== 'sitemap-index.xml' && file !== 'sitemap.xml')
    .filter((file) => {
      const fullPath = path.join(publicDir, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      return content.startsWith('<?xml') && (content.includes('<urlset') || content.includes('<sitemapindex'));
    })
    .sort((a, b) => {
      const aOrder = order.has(a) ? order.get(a) : Number.MAX_SAFE_INTEGER;
      const bOrder = order.has(b) ? order.get(b) : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.localeCompare(b);
    });

  if (sitemapFiles.length === 0) {
    throw new Error('No sitemap-*.xml files found to build sitemap index');
  }

  const today = new Date().toISOString().split('T')[0];
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapFiles
    .map((file) => `  <sitemap><loc>${siteUrl}/${file}</loc><lastmod>${today}</lastmod></sitemap>`)
    .join('\n')}\n</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);

  let totalUrlsFromSitemaps = 0;
  for (const file of sitemapFiles) {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf8');
    totalUrlsFromSitemaps += (content.match(/<url>/g) || []).length;
  }

  return { sitemapFiles, totalUrlsFromSitemaps };
}

module.exports = { writeUnifiedSitemapIndex };

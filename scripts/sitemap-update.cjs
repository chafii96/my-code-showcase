#!/usr/bin/env node
/**
 * Sitemap Update Orchestrator (safe)
 * - Uses canonical generators only
 * - Avoids outdated hardcoded sitemap builders
 * - Copies generated files to dist/
 * - Optional search-engine ping (--ping)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const BASE_URL = process.env.SITE_URL || 'https://uspostaltracking.com';

function runNodeScript(relativePath, { required = true } = {}) {
  const absPath = path.join(ROOT_DIR, relativePath);
  if (!fs.existsSync(absPath)) {
    if (required) throw new Error(`Missing required script: ${relativePath}`);
    console.log(`⚠️  Skipping optional script: ${relativePath}`);
    return;
  }

  console.log(`▶ Running ${relativePath} ...`);
  const result = spawnSync(process.execPath, [absPath], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    if (required) throw new Error(`${relativePath} failed with code ${result.status}`);
    console.log(`⚠️  Optional script failed: ${relativePath}`);
  }
}

function copySitemapsToDist() {
  if (!fs.existsSync(DIST_DIR)) {
    console.log('⚠️  dist/ not found, skipping sitemap copy');
    return;
  }

  const sitemapFiles = fs.readdirSync(PUBLIC_DIR).filter((f) => /^sitemap.*\.xml$/i.test(f));
  for (const file of sitemapFiles) {
    fs.copyFileSync(path.join(PUBLIC_DIR, file), path.join(DIST_DIR, file));
  }

  if (fs.existsSync(path.join(PUBLIC_DIR, 'robots.txt'))) {
    fs.copyFileSync(path.join(PUBLIC_DIR, 'robots.txt'), path.join(DIST_DIR, 'robots.txt'));
  }

  console.log(`✅ Copied ${sitemapFiles.length} sitemap files to dist/`);
}

function validateSitemapIndex() {
  const indexPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  if (!fs.existsSync(indexPath)) {
    throw new Error('sitemap.xml is missing after generation');
  }

  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const indexedSitemaps = (indexContent.match(/<sitemap>/g) || []).length;
  const sitemapFileCount = fs.readdirSync(PUBLIC_DIR).filter((f) => /^sitemap-.*\.xml$/i.test(f)).length;

  if (indexedSitemaps < sitemapFileCount) {
    throw new Error(`sitemap.xml is incomplete: ${indexedSitemaps}/${sitemapFileCount} sitemap files indexed`);
  }

  console.log(`✅ sitemap.xml complete: ${indexedSitemaps}/${sitemapFileCount}`);
}

function ping(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => resolve({ url, status: res.statusCode }));
    req.on('error', (error) => resolve({ url, error: error.message }));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ url, error: 'Timeout' });
    });
  });
}

async function pingSearchEngines() {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
  const indexNowKey = 'uspostaltracking2025indexnow';

  const targets = [
    `https://www.google.com/ping?sitemap=${sitemapUrl}`,
    `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
    `https://api.indexnow.org/indexnow?url=${encodeURIComponent(`${BASE_URL}/sitemap.xml`)}&key=${indexNowKey}`,
  ];

  console.log('\n📡 Pinging search engines...');
  for (const target of targets) {
    const result = await ping(target);
    if (result.error) console.log(`⚠️  ${target.split('?')[0]} → ${result.error}`);
    else console.log(`✅ ${target.split('?')[0]} → HTTP ${result.status}`);
  }
}

async function main() {
  console.log('\n🗺️  Sitemap Update Orchestrator');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  // Keep carrier sitemap fresh from source data
  runNodeScript('scripts/generate-carrier-sitemap.cjs', { required: false });

  // Canonical master generation (programmatic pages + unified sitemap index)
  runNodeScript('scripts/generate-all.cjs', { required: true });

  // Coverage guardrail (ensures static routes are included in sitemaps)
  runNodeScript('scripts/verify-sitemap-coverage.cjs', { required: true });

  // Ensure runtime served files are updated
  copySitemapsToDist();

  // Integrity check
  validateSitemapIndex();

  if (process.argv.includes('--ping')) {
    await pingSearchEngines();
  }

  console.log('\n✅ Sitemap update complete');
}

main().catch((error) => {
  console.error(`\n❌ ${error.message}`);
  process.exit(1);
});

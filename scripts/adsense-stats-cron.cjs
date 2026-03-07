#!/usr/bin/env node
/**
 * AdSense Stats Auto-Fetch Cron Script
 * Runs hourly to fetch latest AdSense stats via OAuth API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '..', 'seo-data');
const OAUTH_FILE = path.join(DATA_DIR, 'adsense-oauth.json');
const STATS_FILE = path.join(DATA_DIR, 'adsense-stats.json');

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function refreshToken(oauth) {
  log('Refreshing access token...');
  const params = new URLSearchParams({
    client_id: oauth.clientId,
    client_secret: oauth.clientSecret,
    refresh_token: oauth.refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await httpsRequest('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (res.status === 200 && res.data.access_token) {
    oauth.accessToken = res.data.access_token;
    oauth.tokenExpiry = Date.now() + (res.data.expires_in * 1000);
    fs.writeFileSync(OAUTH_FILE, JSON.stringify(oauth, null, 2));
    log('Token refreshed successfully');
    return oauth;
  }
  throw new Error(`Token refresh failed: ${JSON.stringify(res.data)}`);
}

async function fetchStats(accessToken) {
  const today = new Date().toISOString().split('T')[0];
  const monthStart = today.substring(0, 7) + '-01';

  const url = `https://adsense.googleapis.com/v2/accounts/-/reports:generate?dateRange=CUSTOM&startDate.year=${monthStart.split('-')[0]}&startDate.month=${parseInt(monthStart.split('-')[1])}&startDate.day=1&endDate.year=${today.split('-')[0]}&endDate.month=${parseInt(today.split('-')[1])}&endDate.day=${parseInt(today.split('-')[2])}&metrics=ESTIMATED_EARNINGS&metrics=PAGE_VIEWS_RPM&metrics=IMPRESSIONS&metrics=CLICKS&metrics=PAGE_VIEWS_CTR`;

  const res = await httpsRequest(url, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (res.status === 200) return res.data;
  throw new Error(`API error ${res.status}: ${JSON.stringify(res.data)}`);
}

async function main() {
  log('=== AdSense Stats Cron Start ===');

  if (!fs.existsSync(OAUTH_FILE)) {
    log('No OAuth config found. Skipping.');
    return;
  }

  let oauth = JSON.parse(fs.readFileSync(OAUTH_FILE, 'utf-8'));

  if (!oauth.refreshToken) {
    log('No refresh token. OAuth not connected. Skipping.');
    return;
  }

  // Refresh token if expired
  if (!oauth.accessToken || Date.now() > (oauth.tokenExpiry || 0)) {
    oauth = await refreshToken(oauth);
  }

  const report = await fetchStats(oauth.accessToken);
  
  const stats = {
    todayEarnings: 0,
    monthEarnings: 0,
    rpm: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    lastUpdated: new Date().toISOString(),
  };

  if (report.rows && report.rows.length > 0) {
    const row = report.rows[report.rows.length - 1];
    const cells = row.cells || [];
    stats.monthEarnings = parseFloat(cells[0]?.value || '0');
    stats.rpm = parseFloat(cells[1]?.value || '0');
    stats.impressions = parseInt(cells[2]?.value || '0');
    stats.clicks = parseInt(cells[3]?.value || '0');
    stats.ctr = parseFloat(cells[4]?.value || '0');
    stats.todayEarnings = parseFloat(cells[0]?.value || '0');
  }

  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  log(`Stats saved: earnings=$${stats.monthEarnings}, impressions=${stats.impressions}, clicks=${stats.clicks}`);
  log('=== AdSense Stats Cron Complete ===');
}

main().catch(err => {
  log(`ERROR: ${err.message}`);
  process.exit(1);
});

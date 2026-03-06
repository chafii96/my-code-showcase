# 🚀 VPS Deployment Guide - uspostaltracking.com

## Prerequisites

Before starting, make sure you have:
- ✅ A VPS with Ubuntu 22.04/24.04 (recommended)
- ✅ Root access (SSH)
- ✅ Domain name pointed to your VPS IP
- ✅ GitHub repository access

---

## Step 1: Connect to Your VPS

```bash
ssh root@YOUR_VPS_IP
```

Replace `YOUR_VPS_IP` with your actual VPS IP address.

---

## Step 2: Download the Deployment Script

```bash
# Download the deploy script
wget https://raw.githubusercontent.com/chafii96/my-code-showcase/main/deploy/deploy.sh

# Or if you prefer curl:
curl -O https://raw.githubusercontent.com/chafii96/my-code-showcase/main/deploy/deploy.sh
```

---

## Step 3: Run the Deployment

### Option A: With Domain (Recommended - includes SSL)

```bash
sudo bash deploy.sh uspostaltracking.com www.uspostaltracking.com
```

### Option B: Without Domain (HTTP only)

```bash
sudo bash deploy.sh
```

---

## What the Script Does Automatically

The script will:
1. ✅ Update system packages
2. ✅ Install Node.js 20, PM2, Nginx
3. ✅ Clone your GitHub repository
4. ✅ Install dependencies (frontend + backend)
5. ✅ Build the project
6. ✅ Generate sitemaps
7. ✅ Configure Nginx
8. ✅ Setup SSL with Let's Encrypt (if domain provided)
9. ✅ Start backend with PM2
10. ✅ Setup firewall (UFW)
11. ✅ Configure log rotation
12. ✅ Setup cron jobs for SEO automation

**Estimated time**: 10-15 minutes

---

## Step 4: Verify Deployment

After the script completes, check:

### 1. Check Website

```bash
# If you used a domain:
curl -I https://uspostaltracking.com

# If no domain:
curl -I http://YOUR_VPS_IP
```

### 2. Check Backend Status

```bash
pm2 status
```

Should show `swifttrack-hub` as `online`.

### 3. Check Nginx

```bash
systemctl status nginx
```

Should show `active (running)`.

### 4. Check SSL Certificate (if domain used)

```bash
certbot certificates
```

---

## Step 5: Configure API Keys

### Edit the config file:

```bash
cd /var/www/swifttrack-hub
nano server/data/config.json
```

Make sure your USPS credentials are there:

```json
{
  "apiKeys": {
    "uspsUserId": "3P934TRACK349",
    "uspsPassword": "K9024ME92Z0856D"
  }
}
```

Save and exit (Ctrl+X, then Y, then Enter).

### Reload the backend:

```bash
pm2 reload swifttrack-hub
```

---

## Useful Commands

### Update Site from GitHub

```bash
update-site.sh
```

This will:
- Pull latest code from GitHub
- Reinstall dependencies
- Rebuild the project
- Reload PM2 and Nginx

### Check Server Health

```bash
health-check.sh
```

Shows:
- System load
- RAM usage
- Disk usage
- Nginx status
- PM2 status
- SSL certificate info

### View Backend Logs

```bash
pm2 logs swifttrack-hub
```

### Restart Backend

```bash
pm2 restart swifttrack-hub
```

### Check Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/swifttrack-hub_access.log

# Error logs
tail -f /var/log/nginx/swifttrack-hub_error.log
```

---

## Troubleshooting

### Issue: Website not loading

**Check Nginx:**
```bash
nginx -t
systemctl status nginx
```

**Check if port 80/443 are open:**
```bash
ufw status
netstat -tulpn | grep nginx
```

### Issue: Backend not working

**Check PM2:**
```bash
pm2 status
pm2 logs swifttrack-hub --lines 50
```

**Restart backend:**
```bash
pm2 restart swifttrack-hub
```

### Issue: SSL certificate failed

**Check DNS:**
```bash
dig uspostaltracking.com +short
```

Should return your VPS IP.

**Manually request SSL:**
```bash
certbot --nginx -d uspostaltracking.com -d www.uspostaltracking.com
```

### Issue: Out of disk space

**Check disk usage:**
```bash
df -h
```

**Clean up:**
```bash
# Clean old logs
journalctl --vacuum-time=7d

# Clean old backups
rm -rf /var/www/backups/*

# Clean npm cache
npm cache clean --force

# Clean PM2 logs
pm2 flush
```

---

## DNS Configuration

Before running the deployment with a domain, make sure your DNS is configured:

### A Records (required):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_VPS_IP | 3600 |
| A | www | YOUR_VPS_IP | 3600 |

**How to check:**
```bash
dig uspostaltracking.com +short
dig www.uspostaltracking.com +short
```

Both should return your VPS IP.

---

## Firewall Configuration

The script automatically configures UFW:

```bash
# Check firewall status
ufw status

# Should show:
# 22/tcp    ALLOW    (SSH)
# 80/tcp    ALLOW    (HTTP)
# 443/tcp   ALLOW    (HTTPS)
```

---

## Performance Optimization

### Enable HTTP/2 (already configured)

HTTP/2 is enabled by default in the Nginx config.

### Enable Gzip Compression (already configured)

Gzip compression is enabled for all text-based files.

### Enable Caching (already configured)

Static assets are cached for 1 year.

---

## Monitoring

### Setup Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Monitor: `https://uspostaltracking.com`

### Setup Error Monitoring

Consider using:
- Sentry (free tier available)
- LogRocket
- Rollbar

---

## Backup Strategy

### Automatic Backups

The deployment script automatically backs up:
- `.env` files
- `server/data/` directory

Backups are stored in: `/var/www/backups/`

### Manual Backup

```bash
# Backup entire project
tar -czf /root/backup-$(date +%Y%m%d).tar.gz /var/www/swifttrack-hub

# Backup database/config only
tar -czf /root/config-backup-$(date +%Y%m%d).tar.gz /var/www/swifttrack-hub/server/data
```

---

## Security Checklist

- ✅ Firewall enabled (UFW)
- ✅ SSL certificate installed
- ✅ Security headers configured
- ✅ Sensitive files blocked (.env, .git, etc.)
- ✅ Rate limiting on API endpoints
- ✅ Log rotation configured

### Additional Security (Optional)

**Install Fail2Ban:**
```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

**Change SSH port:**
```bash
nano /etc/ssh/sshd_config
# Change: Port 22 → Port 2222
systemctl restart sshd
```

Don't forget to update firewall:
```bash
ufw allow 2222/tcp
ufw delete allow 22/tcp
```

---

## Cron Jobs (Automatic SEO)

The script automatically sets up cron jobs for:

- **Sitemap generation**: Daily at 2 AM
- **IndexNow ping**: Daily at 3 AM
- **SSL renewal check**: Twice daily (3 AM, 3 PM)

**View cron jobs:**
```bash
crontab -l
```

---

## Next Steps After Deployment

1. ✅ Test the website: `https://uspostaltracking.com`
2. ✅ Submit sitemap to Google Search Console
3. ✅ Submit sitemap to Bing Webmaster Tools
4. ✅ Request USPS API approval (see `USPS-API-APPROVAL-STEPS-AR.md`)
5. ✅ Setup monitoring (UptimeRobot, etc.)
6. ✅ Configure Google Analytics (if needed)
7. ✅ Test USPS tracking after API approval

---

## Support

If you encounter any issues:

1. Check logs: `pm2 logs swifttrack-hub`
2. Check Nginx: `nginx -t`
3. Run health check: `health-check.sh`
4. Check firewall: `ufw status`

---

**Deployment script location**: `/var/www/swifttrack-hub/deploy/deploy.sh`

**Project directory**: `/var/www/swifttrack-hub`

**Nginx config**: `/etc/nginx/sites-available/swifttrack-hub`

**PM2 config**: `/var/www/swifttrack-hub/ecosystem.config.cjs`

---

## Quick Reference

```bash
# Deploy/Update
sudo bash deploy.sh uspostaltracking.com www.uspostaltracking.com

# Update from GitHub
update-site.sh

# Health check
health-check.sh

# View logs
pm2 logs swifttrack-hub

# Restart backend
pm2 restart swifttrack-hub

# Reload Nginx
systemctl reload nginx

# Check SSL
certbot certificates

# Renew SSL manually
certbot renew

# Check firewall
ufw status
```

---

**Ready to deploy? Run:**

```bash
sudo bash deploy.sh uspostaltracking.com www.uspostaltracking.com
```

🚀 Good luck!

# 🚀 Deploy NOW - Quick Start

## Copy & Paste These Commands

### 1. Connect to VPS

```bash
ssh root@YOUR_VPS_IP
```

Replace `YOUR_VPS_IP` with your actual IP.

---

### 2. One-Command Deployment

```bash
curl -fsSL https://raw.githubusercontent.com/chafii96/my-code-showcase/main/deploy/deploy.sh | sudo bash -s uspostaltracking.com www.uspostaltracking.com
```

**That's it!** ☕ Grab a coffee, it takes 10-15 minutes.

---

## Alternative: Step-by-Step

If you prefer to see what's happening:

```bash
# 1. Download script
wget https://raw.githubusercontent.com/chafii96/my-code-showcase/main/deploy/deploy.sh

# 2. Make it executable
chmod +x deploy.sh

# 3. Run it
sudo bash deploy.sh uspostaltracking.com www.uspostaltracking.com
```

---

## After Deployment

### Test Your Website

```bash
curl -I https://uspostaltracking.com
```

Should return `200 OK`.

### Check Backend

```bash
pm2 status
```

Should show `uspostaltracking` as `online`.

---

## Update Later

```bash
update-site.sh
```

---

## Need Help?

```bash
health-check.sh
```

Shows complete system status.

---

## Important Files

- **Project**: `/var/www/uspostaltracking`
- **Config**: `/var/www/uspostaltracking/server/data/config.json`
- **Nginx**: `/etc/nginx/sites-available/uspostaltracking`
- **Logs**: `pm2 logs uspostaltracking`

---

## DNS Setup (Do This First!)

Before deploying, make sure your domain points to your VPS:

**A Records:**
- `uspostaltracking.com` → `YOUR_VPS_IP`
- `www.uspostaltracking.com` → `YOUR_VPS_IP`

**Check DNS:**
```bash
dig uspostaltracking.com +short
```

Should return your VPS IP.

---

## Troubleshooting

### Website not loading?

```bash
# Check Nginx
systemctl status nginx
nginx -t

# Check firewall
ufw status

# Check if ports are open
netstat -tulpn | grep -E '80|443'
```

### Backend not working?

```bash
# Check PM2
pm2 status
pm2 logs uspostaltracking --lines 50

# Restart
pm2 restart uspostaltracking
```

### SSL failed?

```bash
# Check DNS first
dig uspostaltracking.com +short

# Manually request SSL
certbot --nginx -d uspostaltracking.com -d www.uspostaltracking.com
```

---

## Quick Commands

```bash
# Update site
update-site.sh

# Health check
health-check.sh

# View logs
pm2 logs

# Restart backend
pm2 restart uspostaltracking

# Reload Nginx
systemctl reload nginx

# Check SSL
certbot certificates
```

---

**Ready? Copy the one-command deployment above and paste it in your VPS terminal!** 🚀

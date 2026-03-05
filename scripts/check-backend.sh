#!/bin/bash
########################################################################
#  🔍 SwiftTrack Hub — Backend Health Check Script
#  فحص حالة الـ Backend API
########################################################################

APP="swifttrack-hub"
DIR="/var/www/${APP}"
PORT="8080"

echo "═══════════════════════════════════════════════════"
echo "  🔍 ${APP} — Backend Health Check"
echo "═══════════════════════════════════════════════════"
echo ""

# Check if backend file exists
SF=""
for f in server/index.js server.js server.cjs; do
  if [ -f "${DIR}/$f" ]; then
    SF="$f"
    break
  fi
done

if [ -n "$SF" ]; then
  echo "✅ Backend file exists: ${DIR}/${SF}"
else
  echo "❌ Backend file NOT found in ${DIR}!"
  exit 1
fi

# Check if PM2 is running the backend
echo ""
echo "📊 PM2 Status:"
pm2 list | grep "${APP}" || echo "⚠️  ${APP} not found in PM2"

# Check if port is listening
echo ""
echo "🔌 Port ${PORT} Status:"
if ss -tuln 2>/dev/null | grep -q ":${PORT}"; then
  echo "✅ Port ${PORT} is listening"
elif netstat -tuln 2>/dev/null | grep -q ":${PORT}"; then
  echo "✅ Port ${PORT} is listening"
else
  echo "❌ Port ${PORT} is NOT listening"
fi

# Check backend health endpoint
echo ""
echo "🏥 Backend Health Check:"
HEALTH=$(curl -s --max-time 5 http://127.0.0.1:${PORT}/api/health 2>/dev/null)
if [ -n "$HEALTH" ]; then
  echo "✅ Backend is responding:"
  echo "$HEALTH" | jq . 2>/dev/null || echo "$HEALTH"
else
  echo "❌ Backend is NOT responding on port ${PORT}"
fi

# Check Nginx proxy configuration
echo ""
echo "🌐 Nginx Proxy Configuration:"
if grep -q "proxy_pass.*${PORT}" /etc/nginx/sites-available/${APP} 2>/dev/null; then
  echo "✅ Nginx proxy to port ${PORT} is configured"
else
  echo "❌ Nginx proxy NOT configured correctly"
fi

# Test API through Nginx
echo ""
echo "🔗 Testing API through Nginx:"
DOMAIN=$(grep "server_name" /etc/nginx/sites-available/${APP} 2>/dev/null | head -1 | awk '{print $2}' | tr -d ';')
if [ -n "$DOMAIN" ] && [ "$DOMAIN" != "_" ]; then
  API_TEST=$(curl -s --max-time 5 "https://${DOMAIN}/api/health" 2>/dev/null)
  if [ -n "$API_TEST" ]; then
    echo "✅ API accessible at https://${DOMAIN}/api/health"
  else
    echo "⚠️  API not accessible through Nginx (might be SSL/DNS issue)"
  fi
else
  echo "ℹ️  No domain configured, testing localhost..."
  API_TEST=$(curl -s --max-time 5 "http://localhost/api/health" 2>/dev/null)
  if [ -n "$API_TEST" ]; then
    echo "✅ API accessible at http://localhost/api/health"
  else
    echo "❌ API not accessible through Nginx"
  fi
fi

# Check PM2 logs for errors
echo ""
echo "📋 Recent PM2 Logs (last 20 lines):"
pm2 logs ${APP} --lines 20 --nostream 2>/dev/null | tail -20

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Health Check Complete"
echo "═══════════════════════════════════════════════════"

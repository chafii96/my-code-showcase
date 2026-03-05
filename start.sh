#!/bin/bash
# ══════════════════════════════════════════════════════════════════
#  SwiftTrack Hub — Unified Startup Script
#  تشغيل الموقع بأمر واحد فقط
# ══════════════════════════════════════════════════════════════════
#
#  الاستخدام:
#    chmod +x start.sh
#    ./start.sh
#
#  ما يفعله هذا السكريبت:
#    1. يتحقق من تثبيت Node.js
#    2. يثبّت الحزم إذا لم تكن موجودة
#    3. يشغّل npm run dev (Vite + API مدمج)
#    4. يفتح المتصفح تلقائياً
#
# ══════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     ⚡ SwiftTrack Hub — Admin Dashboard           ║${NC}"
echo -e "${CYAN}║     تشغيل لوحة التحكم الكاملة                    ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js غير مثبّت!${NC}"
    echo -e "${YELLOW}حمّل Node.js من: https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js: ${NODE_VERSION}${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm غير مثبّت!${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm: ${NPM_VERSION}${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}📦 تثبيت الحزم... (قد يستغرق 2-5 دقائق)${NC}"
    npm install
    echo -e "${GREEN}✅ تم تثبيت الحزم${NC}"
fi

echo ""
echo -e "${BLUE}🚀 تشغيل الموقع...${NC}"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  الموقع الرئيسي:   ${YELLOW}http://localhost:8080${NC}"
echo -e "${GREEN}  لوحة التحكم:      ${YELLOW}http://localhost:8080/admin${NC}"
echo -e "${GREEN}  تتبع الزوار:      ${YELLOW}http://localhost:8080/admin/visitors${NC}"
echo -e "${GREEN}  API Health:       ${YELLOW}http://localhost:8080/api/health${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}  اضغط Ctrl+C لإيقاف الخادم${NC}"
echo ""

# Start Vite (API is embedded as Vite plugin)
npm run dev

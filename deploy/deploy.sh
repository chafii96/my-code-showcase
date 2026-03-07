#!/bin/bash
# هذا الملف يشير إلى السكريبت الرئيسي في جذر المشروع
# This file redirects to the main deploy script at project root
DIR="$(cd "$(dirname "$0")/.." && pwd)"
exec bash "$DIR/deploy.sh" "$@"

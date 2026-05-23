#!/usr/bin/env bash
# Run this ON THE SERVER inside the project directory.
# It pulls the latest code, installs deps, builds, and reloads PM2.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Pulling latest from main"
git pull --ff-only origin main

echo "==> Installing dependencies"
npm ci --legacy-peer-deps || npm install --legacy-peer-deps

echo "==> Building Next.js"
npm run build

echo "==> Reloading PM2 (zero-downtime)"
if pm2 describe dedypry >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs --env production
fi
pm2 save

echo "==> Done. Status:"
pm2 status dedypry

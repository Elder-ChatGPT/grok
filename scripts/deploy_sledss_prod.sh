#!/bin/bash
# SLEDSS Production Deployment Script (master branch)
# Deploys: backend (port 5009) + frontend (port 3000)

echo "Starting SLEDSS PRODUCTION deployment..."

cd /var/www/grok-prod
git reset --hard HEAD
git clean -fd

echo "Switching to master branch..."
git fetch origin
git checkout master
git reset --hard origin/master
git clean -fd

echo "Pulled latest code from master branch."
git status

# Load NVM and activate Node
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22

# ===== Backend Deployment =====
echo "Deploying Backend..."
cd /var/www/grok-prod/back
echo "Cleaning and reinstalling backend dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "Restarting backend PM2 service..."
pm2 stop server-prod || true
pm2 delete server-prod || true
pm2 start server.js --name server-prod
pm2 save
pm2 list

# ===== Frontend Deployment =====
echo "Deploying Frontend..."
cd /var/www/grok-prod/sledss2
echo "Cleaning and reinstalling frontend dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "Building frontend for production..."
npm run build

echo "Restarting frontend service via PM2..."
pm2 stop sledss-prod || true
pm2 delete sledss-prod || true

if ! command -v http-server &> /dev/null; then
    echo "Installing http-server globally..."
    npm install -g http-server
fi

BUILD_DIR="build"
if [ -d "$BUILD_DIR" ]; then
    pm2 start http-server --name sledss-prod -- $BUILD_DIR -p 3000 -a 0.0.0.0
else
    echo "Error: Build directory not found!"
    exit 1
fi

pm2 save
pm2 list

echo "Restarting Nginx..."
sudo systemctl reload nginx
echo "Nginx reloaded successfully"
echo "SLEDSS PRODUCTION deployment completed successfully!"

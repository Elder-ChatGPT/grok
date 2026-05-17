#!/bin/bash
# SLEDSS Test Deployment Script (testing branch)
# Deploys: backend (port 6009) + frontend (port 4000)

echo "Starting SLEDSS TEST deployment..."

cd /var/www/grok-test
git reset --hard HEAD
git clean -fd

echo "Switching to testing branch..."
git fetch origin
git checkout testing
git reset --hard origin/testing
git clean -fd

echo "Pulled latest code from testing branch."
git status

# Load NVM and activate Node
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22

# ===== Backend Deployment =====
echo "Deploying Backend..."
cd /var/www/grok-test/back
echo "Cleaning and reinstalling backend dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "Restarting backend PM2 service..."
pm2 stop server-test || true
pm2 delete server-test || true
pm2 start server.js --name server-test
pm2 save
pm2 list

# ===== Frontend Deployment =====
echo "Deploying Frontend..."
cd /var/www/grok-test/sledss2
echo "Cleaning and reinstalling frontend dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "Building frontend for production..."
npm run build

echo "Restarting frontend service via PM2..."
pm2 stop sledss-test || true
pm2 delete sledss-test || true

if ! command -v http-server &> /dev/null; then
    echo "Installing http-server globally..."
    npm install -g http-server
fi

BUILD_DIR="build"
if [ -d "$BUILD_DIR" ]; then
    pm2 start http-server --name sledss-test -- $BUILD_DIR -p 4000 -a 0.0.0.0
else
    echo "Error: Build directory not found!"
    exit 1
fi

pm2 save
pm2 list

echo "Restarting Nginx..."
sudo systemctl reload nginx
echo "Nginx reloaded successfully"
echo "SLEDSS TEST deployment completed successfully!"

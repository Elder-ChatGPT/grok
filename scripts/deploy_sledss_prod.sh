#!/bin/bash
# SLEDSS Production Deployment Script (master branch)
# Deploys: backend (port 5009) + frontend (port 3000)

echo "Starting SLEDSS PRODUCTION deployment..."

# Clone repo if it doesn't exist yet
if [ ! -d /var/www/grok-prod/.git ]; then
    echo "Cloning grok repo to /var/www/grok-prod..."
    sudo mkdir -p /var/www/grok-prod
    sudo chown -R $USER:$USER /var/www/grok-prod
    git clone --branch master --single-branch https://github.com/Elder-ChatGPT/grok.git /var/www/grok-prod
else
    cd /var/www/grok-prod
    git fetch origin
    git checkout master
    git reset --hard origin/master
    git clean -fd
fi

echo "Pulled latest code from master branch."
cd /var/www/grok-prod
git status

# Load NVM and activate Node
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22 || nvm install 22

# Write backend .env
cat > /var/www/grok-prod/back/.env << 'ENVEOF'
SECRET_KEY=123456
PORT=5009
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=ooglobeneo4j
ENVEOF

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

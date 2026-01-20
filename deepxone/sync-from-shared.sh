#!/bin/bash

################################################################################
# Sync DeepXone from shared folder to production
# Run this on Ubuntu after copying files to shared folder
################################################################################

SHARED_PATH="/media/sf_prodrelease"
TARGET_PATH="/home/dude/deepxone"

echo "========================================"
echo "Sync DeepXone from Shared to Production"
echo "========================================"
echo ""
echo "Shared: $SHARED_PATH"
echo "Target: $TARGET_PATH"
echo ""

# Check if shared folder exists
if [ ! -d "$SHARED_PATH" ]; then
    echo "Error: Shared folder not found: $SHARED_PATH"
    echo "Please run copy-to-shared.ps1 on Windows first"
    exit 1
fi

# Create target directory if it doesn't exist
if [ ! -d "$TARGET_PATH" ]; then
    echo "Creating target directory..."
    mkdir -p "$TARGET_PATH"
fi

# Sync files
echo "Syncing files..."
rsync -av --delete \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='logs' \
    --exclude='.env.local' \
    --exclude='*.log' \
    "$SHARED_PATH/" "$TARGET_PATH/"

echo ""
echo "Installing dependencies..."
cd "$TARGET_PATH"
npm install

echo ""
echo "Building application..."
npm run build

echo ""
echo "Checking for database backup..."
if [ -f "$SHARED_PATH/database_backup.sql" ]; then
    echo "Found database backup, importing..."
    read -p "Database password: " -s DB_PASS
    echo ""
    mysql -u deepxone -p$DB_PASS deepxone < "$SHARED_PATH/database_backup.sql"
    echo "✓ Database imported"
else
    echo "No database backup found, skipping..."
fi

echo ""
echo "Setting up environment..."
if [ ! -f "$TARGET_PATH/.env.local" ]; then
    echo "Creating .env.local from template..."
    cp "$TARGET_PATH/.env.example" "$TARGET_PATH/.env.local"
    echo "⚠️  IMPORTANT: Edit .env.local with production values"
    echo "   nano $TARGET_PATH/.env.local"
else
    echo "✓ .env.local already exists"
fi

echo ""
echo "Restarting application..."
pm2 restart deepxone || pm2 start npm --name "deepxone" -- start

echo ""
echo "Cleaning up shared folder..."
read -p "Clear shared folder? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo rm -rf "$SHARED_PATH"/*
    echo "✓ Shared folder cleaned"
fi

echo ""
echo "========================================"
echo "Sync Complete!"
echo "========================================"
echo ""
echo "Application status:"
pm2 status deepxone

echo ""
echo "View logs: pm2 logs deepxone"
echo "Test site: http://$(hostname -I | awk '{print $1}'):6001"
echo ""

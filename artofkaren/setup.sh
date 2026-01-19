#!/bin/bash

echo "================================"
echo "Art of Karen - Setup Script"
echo "================================"
echo ""

echo "[1/4] Installing dependencies..."
npm install
echo ""

echo "[2/4] Creating directories..."
mkdir -p uploads/{artworks,thumbnails,profiles,blog}
mkdir -p logs
echo "Directories created!"
echo ""

echo "[3/4] Building TypeScript..."
npm run build
echo ""

echo "[4/4] Setup complete!"
echo ""
echo "================================"
echo "Next Steps:"
echo "================================"
echo "1. Configure .env file with your database credentials"
echo "2. Create database: mysql -u root -p -e 'CREATE DATABASE artofkaren;'"
echo "3. Run migrations: npm run migrate"
echo "4. Seed initial data: npm run seed"
echo "5. Start server: npm run dev"
echo ""
echo "Default users after seeding:"
echo "  Admin: admin@artofkaren.com / admin123"
echo "  Artist: karen@artofkaren.com / artist123"
echo "  Student: student@artofkaren.com / student123"
echo ""

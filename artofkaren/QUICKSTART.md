# Quick Start Guide

Get Art of Karen platform running in 5 minutes!

## Step 1: Setup

### Windows
```bash
setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

## Step 2: Configure Database

Edit `.env` and set your MySQL password:

```env
DB_PASSWORD=your_mysql_password
```

## Step 3: Create Database

```bash
mysql -u root -p -e "CREATE DATABASE artofkaren;"
```

Or manually:
```bash
mysql -u root -p
CREATE DATABASE artofkaren;
exit;
```

## Step 4: Run Migrations

```bash
npm run migrate
```

## Step 5: Seed Data

```bash
npm run seed
```

This creates three test users:
- **Admin**: admin@artofkaren.com / admin123
- **Artist**: karen@artofkaren.com / artist123
- **Student**: student@artofkaren.com / student123

## Step 6: Start Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

## Test the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"karen@artofkaren.com","password":"artist123"}'
```

Copy the token from the response and use it for authenticated requests:

### Get Profile
```bash
curl http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Upload Artwork
```bash
curl -X POST http://localhost:3001/api/artworks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@path/to/your/image.jpg" \
  -F "title=My First Artwork" \
  -F "description=This is a beautiful piece" \
  -F "category=Painting" \
  -F "is_published=true"
```

### Get All Artworks
```bash
curl http://localhost:3001/api/artworks
```

## What's Next?

1. Build a frontend (React, Vue, Next.js)
2. Create artist portfolios
3. Add student-artist connections
4. Build admin dashboard
5. Deploy to production

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

### Port Already in Use
Change `PORT` in `.env`:
```env
PORT=3002
```

### File Upload Error
- Check `uploads/` directory exists
- Verify write permissions
- Check file size limits in `.env`

## Development Commands

```bash
npm run dev      # Start development server with auto-reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run migrate  # Run database migrations
npm run seed     # Seed initial data
```

## Ready to Build!

Your API is now running and ready to be connected to any frontend framework!

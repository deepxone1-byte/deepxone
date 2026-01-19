# 🎨 Art of Karen - Complete Setup Guide

Welcome! This guide will get your entire platform running in minutes.

## What You're Building

A **full-stack art community platform** with:
- ✅ Artwork gallery with upload
- ✅ Blog system for artists
- ✅ YouTube video integration
- ✅ User authentication (Admin, Artist, Student, User)
- ✅ Beautiful responsive design

---

## Step 1: Database Setup (5 minutes)

### Create Database

```bash
mysql -u root -p -e "CREATE DATABASE artofkaren;"
```

Or manually:
```bash
mysql -u root -p
CREATE DATABASE artofkaren;
exit;
```

### Update Database Password

Edit `backend/.env` if your MySQL password is not blank:

```env
DB_PASSWORD=your_mysql_password
```

### Run Migrations

```bash
cd backend
npm run migrate
```

### Seed Test Data

```bash
npm run seed
```

This creates 3 test users:
- **Admin**: admin@test.com / admin123
- **Artist**: artist@test.com / artist123
- **Student**: student@test.com / student123

---

## Step 2: Start Backend (1 minute)

```bash
cd backend
npm run dev
```

✅ Backend API running on `http://localhost:3001`

**Keep this terminal open!**

---

## Step 3: Start Frontend (1 minute)

Open a **new terminal**:

```bash
cd frontend
npm run dev
```

✅ Frontend running on `http://localhost:3000`

---

## Step 4: Test It! 🚀

### Open Your Browser

Go to: **http://localhost:3000**

### Login with Demo Account

1. Click **Login**
2. Use Artist account:
   - Email: `artist@test.com`
   - Password: `artist123`

### Upload Your First Artwork

1. Click **Upload Art** button
2. Choose an image
3. Fill in title and details
4. Click **Upload Artwork**

### Explore Features

- ✅ Browse Gallery
- ✅ View Artists
- ✅ Read Blog
- ✅ Check Dashboard
- ✅ Update Profile

---

## Quick Reference

### Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: See `backend/API.md`

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Artist | artist@test.com | artist123 |
| Student | student@test.com | student123 |

---

## What Can Each Role Do?

### 👤 User (Default)
- Browse gallery
- Read blog posts
- View artist profiles

### 🎓 Student
- Everything User can do
- Upload artwork for learning
- Access student features

### 🎨 Artist
- Everything Student can do
- Write blog posts
- Add tutorial videos
- Mark artworks as featured

### 👑 Admin
- Everything Artist can do
- Manage all content
- Access admin features

---

## Common Tasks

### Create a New User

1. Click **Sign Up**
2. Fill in details
3. Select role (Artist, Student, or User)
4. Click **Create Account**

### Upload Artwork

1. Login as Artist or Student
2. Click **Upload Art**
3. Select image (max 10MB)
4. Add title, description, category
5. Add tags (comma-separated)
6. Click **Upload**

### Write Blog Post

1. Login as Artist or Admin
2. Click **Write** button
3. Enter title and content
4. Click **Publish Post**

### Add YouTube Video

Use the API (Postman/cURL) or build the UI:

```bash
curl -X POST http://localhost:3001/api/videos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Process",
    "youtube_url": "https://youtube.com/watch?v=VIDEO_ID",
    "is_published": true
  }'
```

---

## Troubleshooting

### "Database connection failed"
- Check MySQL is running
- Verify password in `backend/.env`
- Ensure database `artofkaren` exists

### "Port already in use"
Change port in config:
- Backend: `backend/.env` → `PORT=3002`
- Frontend: `frontend/vite.config.js` → `port: 3001`

### "Cannot find module"
```bash
# In backend or frontend directory
rm -rf node_modules package-lock.json
npm install
```

### Image Upload Fails
- Check `backend/uploads/` directory exists
- Verify file size under 10MB
- Check file type (JPG, PNG, GIF, WebP)

---

## Project Structure

```
artofkaren/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Auth, upload, etc.
│   │   └── db/          # Database migrations
│   ├── uploads/         # Uploaded images
│   └── .env             # Configuration
│
└── frontend/            # React app
    ├── src/
    │   ├── pages/       # Page components
    │   ├── components/  # Reusable components
    │   ├── contexts/    # React contexts
    │   └── services/    # API client
    └── vite.config.js   # Vite configuration
```

---

## Next Steps

### Customize Design
- Edit `frontend/tailwind.config.js` for colors
- Modify components in `frontend/src/components/`

### Add Features
- Collections/galleries
- Comments on artwork
- Likes and favorites
- Student-artist connections
- Advanced search

### Deploy to Production
See `backend/DEPLOYMENT_QUICK_START.md` for deployment guide

---

## Getting Help

### Documentation
- Backend API: `backend/API.md`
- Backend Setup: `backend/README.md`
- Frontend: `frontend/README.md`

### Test API
- Use `backend/test-api.http` with REST Client extension
- Or import into Postman

---

## 🎉 You're All Set!

Your art community platform is ready! Start by:

1. ✅ Uploading some artwork
2. ✅ Writing a blog post
3. ✅ Creating more users
4. ✅ Customizing the design

**Enjoy building your art community!** 🎨

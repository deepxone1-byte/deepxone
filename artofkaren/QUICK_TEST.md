# ⚡ Quick Test Guide

## 1. Setup (One Time)

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE artofkaren;"

# In artofkaren directory
npm run migrate
npm run seed
```

## 2. Start Servers

**Terminal 1 - Backend:**
```bash
cd artofkaren
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd artofkaren/frontend
npm run dev
```

## 3. Test Everything (5 minutes)

### ✅ View Blog Posts (No Login Required)

1. Open: http://localhost:3000
2. Click **Blog** in navigation
3. See 2 blog posts:
   - "My Journey from Traditional to Digital Art"
   - "5 Mistakes Every Beginner Portrait Artist Makes"
4. Click first post → Read full article
5. Click back, then second post → Read full article

### ✅ Login as Artist

1. Click **Login**
2. Enter:
   - Email: `artist@test.com`
   - Password: `artist123`
3. Click **Sign In**

### ✅ View Dashboard

- See stats: 0 artworks, 2 blog posts
- See your 2 blog posts listed

### ✅ Upload Artwork

1. Click **Upload Art** button
2. Choose any image file
3. Fill in:
   - Title: "My First Painting"
   - Description: "A beautiful landscape"
   - Category: "Painting"
   - Tags: "landscape, nature"
4. Click **Upload Artwork**
5. View your artwork detail page

### ✅ Create New Blog Post

1. Click **Write** button
2. Fill in:
   - Title: "My Third Blog Post"
   - Excerpt: "This is a test post"
   - Content: "Writing content is easy with this platform!"
3. Click **Publish Post**
4. View your new blog post

### ✅ Edit Profile

1. Click your username → **Profile**
2. Update:
   - Full Name: "Karen Martinez - Artist"
   - Bio: "Professional artist and educator"
   - Website: "https://myartsite.com"
3. Click **Save Changes**

### ✅ Browse as Public

1. Click **Logout**
2. Navigate to **Gallery**
3. See your uploaded artwork
4. Click **Blog** → See all 3 posts
5. Click **Artists** → See Karen Martinez

### ✅ Login as Admin

1. Click **Login**
2. Enter:
   - Email: `admin@test.com`
   - Password: `admin123`
3. See full access to platform

### ✅ Login as Student

1. Logout, then login:
   - Email: `student@test.com`
   - Password: `student123`
2. Can upload artwork
3. Cannot write blog posts (no Write button)
4. Can view all content

---

## Expected Results ✅

After seeding, you should have:

**Users:**
- Admin (admin@test.com)
- Artist (artist@test.com) - Karen Martinez
- Student (student@test.com)

**Blog Posts:**
- 2 rich, professional blog posts
- Both published and visible
- Written by Karen Martinez
- Full formatting and content

**Features Working:**
- Authentication with all 3 roles
- Blog reading (public)
- Blog writing (artists only)
- Artwork upload
- Gallery browsing
- Artist profiles
- Dashboard with stats
- Profile editing

---

## Quick Checks

| Feature | Status |
|---------|--------|
| Backend running | http://localhost:3001/health |
| Frontend running | http://localhost:3000 |
| Can login | ✓ |
| Can view blog | ✓ |
| Can upload art | ✓ |
| Can write blog | ✓ (artists) |
| Blog posts rich content | ✓ 2 posts |
| Sample data loaded | ✓ |

---

## Troubleshooting

**"No blog posts showing"**
- Run: `npm run seed` again
- Check backend console for errors
- Verify database has blog_posts table

**"Cannot login"**
- Clear browser localStorage
- Check email/password (see SAMPLE_CONTENT.md)
- Verify seed ran successfully

**"Upload fails"**
- Check uploads/ directory exists
- File must be under 10MB
- Must be image type (JPG, PNG, GIF, WebP)

---

## Sample Credentials Quick Reference

```
Artist:  artist@test.com  / artist123
Admin:   admin@test.com   / admin123
Student: student@test.com / student123
```

**That's it! Your platform is fully functional!** 🎉

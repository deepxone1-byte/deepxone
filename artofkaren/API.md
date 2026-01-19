# Art of Karen - API Documentation

Base URL: `http://localhost:3001`

## Authentication

Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Get a token by logging in or registering.

## User Roles

- **admin** - Full access to all features
- **artist** - Can upload art, write blogs, add videos, teach students
- **student** - Can upload art for learning, view all content
- **user** - Can view published content only

---

## Auth Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "full_name": "Full Name",
  "role": "artist"  // optional: artist, student, or user (default)
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "full_name": "Full Name",
    "role": "artist"
  },
  "token": "eyJhbGci..."
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "full_name": "Full Name",
    "role": "artist"
  },
  "token": "eyJhbGci..."
}
```

### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer TOKEN
```

### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "full_name": "Updated Name",
  "bio": "Artist bio...",
  "website": "https://example.com",
  "social_links": {
    "instagram": "@username",
    "twitter": "@username"
  }
}
```

---

## Artwork Endpoints

### Upload Artwork
```http
POST /api/artworks
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

Fields:
- image (file) - required
- title (string) - required
- description (string) - optional
- category (string) - optional
- tags (JSON array string) - optional, e.g., '["portrait","oil"]'
- created_year (number) - optional
- is_published (boolean) - optional, default: false
```

**Response:**
```json
{
  "id": 1,
  "user_id": 2,
  "title": "My Artwork",
  "description": "Description...",
  "image_url": "/uploads/artworks/image-123.jpg",
  "thumbnail_url": "/uploads/thumbnails/thumb_image-123.jpg",
  "category": "Painting",
  "tags": ["portrait", "oil"],
  "width": 1920,
  "height": 1080,
  "created_year": 2024,
  "is_featured": false,
  "is_published": true,
  "views": 0,
  "username": "karen",
  "artist_name": "Karen Artist",
  "created_at": "2024-01-18T..."
}
```

### Get All Artworks
```http
GET /api/artworks?page=1&limit=20&category=Painting&is_featured=true
```

Query parameters (all optional):
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `user_id` - Filter by artist
- `category` - Filter by category
- `is_featured` - Filter featured artworks
- `is_published` - Filter published (admin/artist only)

**Response:**
```json
{
  "artworks": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### Get Artwork by ID
```http
GET /api/artworks/:id
```

### Update Artwork
```http
PUT /api/artworks/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Portrait",
  "tags": ["portrait", "oil", "2024"],
  "is_published": true,
  "is_featured": false
}
```

### Delete Artwork
```http
DELETE /api/artworks/:id
Authorization: Bearer TOKEN
```

---

## Blog Endpoints

### Create Blog Post
```http
POST /api/blog
Authorization: Bearer TOKEN (artist or admin only)
Content-Type: application/json

{
  "title": "My Blog Post",
  "content": "Full blog content with markdown...",
  "excerpt": "Short excerpt...",
  "featured_image": "/uploads/blog/image.jpg",
  "is_published": true
}
```

### Get All Blog Posts
```http
GET /api/blog?page=1&limit=10&user_id=2
```

Query parameters:
- `page` - Page number
- `limit` - Posts per page (default: 10)
- `user_id` - Filter by author
- `is_published` - Filter published (default: true for regular users)

### Get Blog Post by ID
```http
GET /api/blog/:id
```

### Get Blog Post by Slug
```http
GET /api/blog/slug/:slug
```

### Update Blog Post
```http
PUT /api/blog/:id
Authorization: Bearer TOKEN (owner only)
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "is_published": true
}
```

### Delete Blog Post
```http
DELETE /api/blog/:id
Authorization: Bearer TOKEN (owner only)
```

---

## Video Endpoints

### Create Video
```http
POST /api/videos
Authorization: Bearer TOKEN (artist or admin only)
Content-Type: application/json

{
  "title": "Tutorial Video",
  "description": "Description...",
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "artwork_id": 1,  // optional - link to artwork
  "blog_post_id": 1,  // optional - link to blog post
  "is_published": true
}
```

The YouTube ID is automatically extracted and thumbnail is fetched.

### Get All Videos
```http
GET /api/videos?page=1&limit=20&user_id=2&artwork_id=1
```

Query parameters:
- `page` - Page number
- `limit` - Videos per page (default: 20)
- `user_id` - Filter by creator
- `artwork_id` - Filter by linked artwork
- `blog_post_id` - Filter by linked blog post
- `is_published` - Filter published

### Get Video by ID
```http
GET /api/videos/:id
```

### Update Video
```http
PUT /api/videos/:id
Authorization: Bearer TOKEN (owner only)
Content-Type: application/json

{
  "title": "Updated Title",
  "youtube_url": "https://youtu.be/NEW_VIDEO_ID",
  "is_published": true
}
```

### Delete Video
```http
DELETE /api/videos/:id
Authorization: Bearer TOKEN (owner only)
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message here",
  "statusCode": 400
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## File Uploads

### Allowed Image Types
- image/jpeg
- image/png
- image/gif
- image/webp

### Max File Size
10MB (configurable in .env)

### Image Processing
- Original images are stored in `/uploads/artworks/`
- Thumbnails (400x400) are auto-generated in `/uploads/thumbnails/`
- Images are accessible at `http://localhost:3001/uploads/...`

---

## Pagination

All list endpoints support pagination:

```
?page=2&limit=10
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Testing with cURL

### Login and Save Token
```bash
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"karen@artofkaren.com","password":"artist123"}' \
  | jq -r '.token')

echo $TOKEN
```

### Upload Artwork
```bash
curl -X POST http://localhost:3001/api/artworks \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "title=My Artwork" \
  -F "description=A beautiful piece" \
  -F "category=Painting" \
  -F "tags=[\"portrait\",\"oil\"]" \
  -F "is_published=true"
```

### Create Blog Post
```bash
curl -X POST http://localhost:3001/api/blog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Process",
    "content": "Here is how I create my art...",
    "is_published": true
  }'
```

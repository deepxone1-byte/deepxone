# Art of Karen - Community Art Platform

A modern, role-based art community platform where artists can showcase their work, teach students, and share their creative journey through blog posts and video tutorials.

## Features

- 🎨 **Artwork Gallery** - Upload and showcase artwork with automatic thumbnail generation
- 👥 **Role-Based Access** - Admin, Artist, Student, and User roles with appropriate permissions
- 📝 **Blog System** - Artists can write blog posts about their work and process
- 🎥 **YouTube Integration** - Embed tutorial and process videos
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📱 **Responsive API** - RESTful API ready for any frontend
- 🖼️ **Image Processing** - Automatic image optimization and thumbnail generation
- 🎓 **Student-Artist System** - Connect students with teaching artists

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Image Processing**: Sharp
- **File Upload**: Multer
- **Validation**: Express Validator
- **Logging**: Winston

## Prerequisites

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=artofkaren
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_here
```

### 3. Set Up Database

Create the database:

```bash
mysql -u root -p
CREATE DATABASE artofkaren;
exit;
```

Run migrations:

```bash
npm run migrate
```

Seed initial data (creates admin, artist, and student users):

```bash
npm run seed
```

### 4. Start the Server

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

Server will run on `http://localhost:3001`

## Default Users

After seeding, you can login with:

**Admin:**
- Email: `admin@artofkaren.com`
- Password: `admin123`

**Artist:**
- Email: `karen@artofkaren.com`
- Password: `artist123`

**Student:**
- Email: `student@artofkaren.com`
- Password: `student123`

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile (requires auth)
- `PUT /profile` - Update user profile (requires auth)

### Artworks (`/api/artworks`)

- `POST /` - Upload artwork (requires auth: artist/student/admin)
- `GET /` - Get all artworks (paginated)
- `GET /:id` - Get artwork by ID
- `PUT /:id` - Update artwork (requires auth: owner)
- `DELETE /:id` - Delete artwork (requires auth: owner)

### Blog (`/api/blog`)

- `POST /` - Create blog post (requires auth: artist/admin)
- `GET /` - Get all blog posts (paginated)
- `GET /:id` - Get blog post by ID
- `GET /slug/:slug` - Get blog post by slug
- `PUT /:id` - Update blog post (requires auth: owner)
- `DELETE /:id` - Delete blog post (requires auth: owner)

### Videos (`/api/videos`)

- `POST /` - Add video (requires auth: artist/admin)
- `GET /` - Get all videos (paginated)
- `GET /:id` - Get video by ID
- `PUT /:id` - Update video (requires auth: owner)
- `DELETE /:id` - Delete video (requires auth: owner)

## User Roles

### Admin
- Full platform access
- Can manage all users
- Can moderate content

### Artist
- Upload artwork
- Create blog posts
- Add tutorial videos
- Teach students

### Student
- Upload their own artwork
- View all published content
- Learn from artists

### User
- View published content
- Browse galleries
- Read blog posts

## Database Schema

### Users
- id, email, username, password (hashed)
- full_name, role, bio, profile_image
- website, social_links (JSON)

### Artworks
- id, user_id, title, description
- image_url, thumbnail_url
- category, tags (JSON), dimensions
- views, is_featured, is_published

### Blog Posts
- id, user_id, title, slug
- content, excerpt, featured_image
- is_published, published_at

### Videos
- id, user_id, title, description
- youtube_url, youtube_id, thumbnail_url
- artwork_id, blog_post_id (optional links)

### Student-Artist Relationships
- id, student_id, artist_id
- status (pending/active/completed)

## Image Upload

Upload artwork with multipart/form-data:

```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('title', 'My Artwork');
formData.append('description', 'Description here');
formData.append('category', 'Painting');
formData.append('tags', JSON.stringify(['portrait', 'oil']));
formData.append('is_published', 'true');

fetch('http://localhost:3001/api/artworks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## File Structure

```
artofkaren/
├── src/
│   ├── config/          # Database, logger configuration
│   ├── db/              # Database migrations and seed
│   ├── middleware/      # Auth, upload, validation, error handling
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Main application entry
├── uploads/             # Uploaded files (auto-created)
├── logs/                # Application logs (auto-created)
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## Security Features

- JWT token authentication
- Bcrypt password hashing
- Helmet security headers
- CORS protection
- File upload validation
- SQL injection protection (parameterized queries)
- Role-based authorization

## Development

Run in development mode with auto-reload:

```bash
npm run dev
```

Build TypeScript:

```bash
npm run build
```

## Logging

Logs are written to:
- Console (development)
- `./logs/combined.log` (all logs)
- `./logs/error.log` (errors only)

## Next Steps

1. Build the frontend (React/Vue/Next.js)
2. Add student-artist relationship management
3. Implement collections/galleries
4. Add likes and comments
5. Create admin dashboard
6. Add email notifications
7. Implement search functionality

## License

MIT

---

Built with ❤️ for the art community

# Art of Karen - Frontend

Modern React frontend for the Art of Karen community art platform.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons

## Quick Start

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

Make sure the backend API is running on `http://localhost:3001`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ArtworkCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Gallery.jsx
│   │   ├── ArtworkDetail.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── Artists.jsx
│   │   ├── ArtistProfile.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── UploadArtwork.jsx
│   │   ├── CreateBlog.jsx
│   │   └── Profile.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Features

### Public Pages

- **Home** - Hero section, features, featured artworks
- **Gallery** - Browse all artworks with filters and pagination
- **Artwork Detail** - View artwork with full details and related videos
- **Blog** - Read blog posts from artists
- **Blog Post** - Read individual blog posts
- **Artists** - Browse all artists
- **Artist Profile** - View artist portfolio and blog posts

### Authentication

- **Login** - User authentication
- **Register** - New user registration with role selection (Artist, Student, User)

### Protected Pages (Require Login)

- **Dashboard** - User overview with stats and quick actions
- **Profile** - Edit user profile information
- **Upload Artwork** - Upload new artwork with image, details, and tags
- **Create Blog** - Write and publish blog posts (Artists only)

## Authentication

The app uses JWT authentication with the following flow:

1. User logs in via `/login`
2. Token is stored in localStorage
3. Token is sent with every API request via Axios interceptor
4. Protected routes check authentication status
5. Auto-redirect to login if token is invalid or expired

## API Integration

All API calls are proxied through Vite during development:

```javascript
// In vite.config.js
proxy: {
  '/api': 'http://localhost:3001',
  '/uploads': 'http://localhost:3001'
}
```

In production, configure your web server to proxy these paths to the backend.

## User Roles

### Admin
- Full platform access
- Can manage all content

### Artist
- Upload artwork
- Write blog posts
- Add tutorial videos
- Teach students

### Student
- Upload artwork for learning
- View all content
- Learn from artists

### User (Default)
- Browse galleries
- Read blog posts
- View artist profiles

## Styling

The app uses Tailwind CSS with custom configuration:

- **Primary Color**: Pink/Magenta theme
- **Font Display**: Playfair Display for headings
- **Font Sans**: Inter for body text

Custom CSS classes:
- `.btn` - Button base styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outlined button
- `.input` - Form input styles
- `.card` - Card container
- `.link` - Link styles
- `.artwork-grid` - Responsive artwork grid

## Environment Variables

Create a `.env` file if needed (currently all configuration is in `vite.config.js`):

```env
VITE_API_URL=http://localhost:3001
```

## Development Tips

### Hot Module Replacement

Vite provides instant HMR. Changes to React components will update without full page reload.

### React DevTools

Install React DevTools browser extension for debugging.

### API Testing

Use the demo accounts after seeding the database:
- Artist: karen@artofkaren.com / artist123
- Student: student@artofkaren.com / student123
- Admin: admin@artofkaren.com / admin123

### Image Uploads

Images are uploaded via multipart/form-data and processed by the backend. Max file size is 10MB (configurable in backend).

## Common Tasks

### Add a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `Navbar.jsx` if needed

### Add Protected Route

```jsx
<Route path="/your-page" element={
  <ProtectedRoute>
    <YourPage />
  </ProtectedRoute>
} />
```

### Make API Call

```javascript
import { artworkAPI } from '../services/api';

const artworks = await artworkAPI.getAll({ page: 1, limit: 20 });
```

## Troubleshooting

### Port 3000 Already in Use

Change the port in `vite.config.js`:

```javascript
server: {
  port: 3002
}
```

### API Connection Failed

- Ensure backend is running on port 3001
- Check proxy configuration in `vite.config.js`
- Verify CORS settings in backend

### Build Errors

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Performance

- Images are lazy-loaded
- React components are optimized with proper keys
- Tailwind CSS is purged in production build
- Vite provides code splitting automatically

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

export enum UserRole {
  ADMIN = 'admin',
  ARTIST = 'artist',
  STUDENT = 'student',
  USER = 'user'
}

export interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  full_name: string;
  role: UserRole;
  bio?: string;
  profile_image?: string;
  website?: string;
  social_links?: string; // JSON string
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Artwork {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url: string;
  category?: string;
  tags?: string; // JSON array string
  width?: number;
  height?: number;
  created_year?: number;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  created_at: Date;
  updated_at: Date;
}

export interface BlogPost {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  is_published: boolean;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Video {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url?: string;
  artwork_id?: number; // Optional link to artwork
  blog_post_id?: number; // Optional link to blog post
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface StudentArtist {
  id: number;
  student_id: number;
  artist_id: number;
  status: 'pending' | 'active' | 'completed';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Collection {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CollectionArtwork {
  id: number;
  collection_id: number;
  artwork_id: number;
  order_index: number;
  created_at: Date;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}

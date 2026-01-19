import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { artworkAPI, blogAPI } from '../services/api';
import { Upload, FileText, Image, BookOpen, TrendingUp } from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({ artworks: 0, blogs: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserContent();
  }, []);

  const loadUserContent = async () => {
    try {
      const [artworksRes, blogsRes] = await Promise.all([
        artworkAPI.getAll({ user_id: user.id, limit: 6 }),
        blogAPI.getAll({ user_id: user.id, limit: 5 })
      ]);

      setArtworks(artworksRes.data.artworks);
      setBlogs(blogsRes.data.posts);

      const totalViews = artworksRes.data.artworks.reduce((sum, art) => sum + (art.views || 0), 0);
      setStats({
        artworks: artworksRes.data.pagination.total,
        blogs: blogsRes.data.pagination.total,
        views: totalViews
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name || user?.username}!
        </h1>
        <p className="text-gray-600">Manage your artworks and content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Artworks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.artworks}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Image className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Blog Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.blogs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{stats.views}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link to="/upload" className="card p-6 hover:shadow-lg transition-shadow group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Upload Artwork</h3>
              <p className="text-sm text-gray-600">Share your latest creation</p>
            </div>
          </div>
        </Link>

        {user?.role !== 'student' && (
          <Link to="/create-blog" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Write Blog Post</h3>
                <p className="text-sm text-gray-600">Share your creative journey</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Recent Artworks */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">Your Artworks</h2>
          <Link to={`/artist/${user?.username}`} className="link">View All</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : artworks.length > 0 ? (
          <div className="artwork-grid">
            {artworks.map(artwork => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't uploaded any artworks yet</p>
            <Link to="/upload" className="btn btn-primary">
              Upload Your First Artwork
            </Link>
          </div>
        )}
      </div>

      {/* Recent Blog Posts */}
      {user?.role !== 'student' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-bold text-gray-900">Your Blog Posts</h2>
            <Link to="/create-blog" className="link">Write New Post</Link>
          </div>

          {blogs.length > 0 ? (
            <div className="space-y-4">
              {blogs.map(blog => (
                <div key={blog.id} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <Link to={`/blog/${blog.slug}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {blog.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(blog.created_at).toLocaleDateString()}
                      {blog.is_published ? (
                        <span className="ml-2 text-green-600">• Published</span>
                      ) : (
                        <span className="ml-2 text-yellow-600">• Draft</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-gray-500 mb-4">You haven't written any blog posts yet</p>
              <Link to="/create-blog" className="btn btn-primary">
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

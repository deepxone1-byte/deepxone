import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { artworkAPI, blogAPI } from '../services/api';
import { User, Globe, Palette, BookOpen } from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';

export default function ArtistProfile() {
  const { username } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('artworks');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtistData();
  }, [username]);

  const loadArtistData = async () => {
    try {
      // Load artworks first to get artist info
      const artworksRes = await artworkAPI.getAll({ limit: 100 });
      const userArtworks = artworksRes.data.artworks.filter(
        a => a.username === username
      );

      if (userArtworks.length > 0) {
        const firstArtwork = userArtworks[0];
        setArtist({
          id: firstArtwork.user_id,
          username: firstArtwork.username,
          name: firstArtwork.artist_name || firstArtwork.username,
          profile_image: firstArtwork.artist_image
        });
        setArtworks(userArtworks);

        // Load blogs
        const blogsRes = await blogAPI.getAll({ user_id: firstArtwork.user_id });
        setBlogs(blogsRes.data.posts);
      }
    } catch (error) {
      console.error('Failed to load artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500">Artist not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Artist Header */}
      <div className="card p-8 mb-8">
        <div className="flex items-start space-x-6">
          {artist.profile_image ? (
            <img
              src={artist.profile_image}
              alt={artist.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-16 w-16 text-primary-600" />
            </div>
          )}

          <div className="flex-1">
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
              {artist.name}
            </h1>
            <p className="text-gray-600 mb-4">@{artist.username}</p>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                {artworks.length} artworks
              </span>
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                {blogs.length} blog posts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('artworks')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'artworks'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Artworks ({artworks.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'blogs'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Blog Posts ({blogs.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'artworks' ? (
        artworks.length > 0 ? (
          <div className="artwork-grid">
            {artworks.map(artwork => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No artworks yet</p>
          </div>
        )
      ) : (
        blogs.length > 0 ? (
          <div className="space-y-6">
            {blogs.map(blog => (
              <a
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="block card p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2 hover:text-primary-600">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="text-gray-700 mb-4">{blog.excerpt}</p>
                )}
                <p className="text-sm text-gray-500">
                  {new Date(blog.published_at || blog.created_at).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No blog posts yet</p>
          </div>
        )
      )}
    </div>
  );
}

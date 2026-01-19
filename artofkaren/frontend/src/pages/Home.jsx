import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artworkAPI } from '../services/api';
import { ArrowRight, Sparkles, Users, BookOpen } from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';

export default function Home() {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedArtworks();
  }, []);

  const loadFeaturedArtworks = async () => {
    try {
      const response = await artworkAPI.getAll({ is_featured: true, limit: 6 });
      setFeaturedArtworks(response.data.artworks);
    } catch (error) {
      console.error('Failed to load featured artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to Art of Karen
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A vibrant community where artists showcase their work, share their creative journey,
              and inspire the next generation of creators.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/gallery" className="btn btn-primary px-8 py-3 text-lg">
                Explore Gallery
              </Link>
              <Link to="/register" className="btn btn-outline px-8 py-3 text-lg">
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Showcase Your Art</h3>
              <p className="text-gray-600">
                Upload and display your artwork in a beautiful gallery with detailed descriptions and tags.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn from Artists</h3>
              <p className="text-gray-600">
                Connect with experienced artists, watch tutorials, and grow your skills as a student.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Read & Share</h3>
              <p className="text-gray-600">
                Discover artist stories, creative processes, and insights through engaging blog posts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-3xl font-bold text-gray-900">Featured Artworks</h2>
            <Link to="/gallery" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : featuredArtworks.length > 0 ? (
            <div className="artwork-grid">
              {featuredArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured artworks yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Share Your Art with the World?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Join our community of artists and students today. It's free!
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artworkAPI, videoAPI } from '../services/api';
import { Eye, Calendar, Tag, ArrowLeft, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ArtworkDetail() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtwork();
    loadVideos();
  }, [id]);

  const loadArtwork = async () => {
    try {
      const response = await artworkAPI.getById(id);
      setArtwork(response.data);
    } catch (error) {
      toast.error('Failed to load artwork');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async () => {
    try {
      const response = await videoAPI.getAll({ artwork_id: id });
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500">Artwork not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/gallery" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-auto"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            {artwork.title}
          </h1>

          <div className="flex items-center space-x-4 mb-6">
            <Link
              to={`/artist/${artwork.username}`}
              className="text-lg text-primary-600 hover:text-primary-700 font-medium"
            >
              by {artwork.artist_name || artwork.username}
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
            {artwork.created_year && (
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {artwork.created_year}
              </span>
            )}
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {artwork.views} views
            </span>
            {artwork.width && artwork.height && (
              <span>
                {artwork.width} × {artwork.height}px
              </span>
            )}
          </div>

          {artwork.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{artwork.description}</p>
            </div>
          )}

          {artwork.category && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Category</h2>
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                {artwork.category}
              </span>
            </div>
          )}

          {artwork.tags && artwork.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Youtube className="h-5 w-5 mr-2 text-red-600" />
                Related Videos
              </h2>
              <div className="space-y-4">
                {videos.map(video => (
                  <a
                    key={video.id}
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4 p-4">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{video.title}</h3>
                        {video.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">{video.description}</p>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

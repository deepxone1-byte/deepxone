import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { User, Palette } from 'lucide-react';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      // Get all artworks and extract unique artists
      const response = await api.get('/artworks', { params: { limit: 100 } });
      const artworks = response.data.artworks;

      // Group by user and count artworks
      const artistMap = {};
      artworks.forEach(artwork => {
        const userId = artwork.user_id;
        if (!artistMap[userId]) {
          artistMap[userId] = {
            id: userId,
            username: artwork.username,
            name: artwork.artist_name || artwork.username,
            profile_image: artwork.artist_image,
            artworks: []
          };
        }
        artistMap[userId].artworks.push(artwork);
      });

      const artistList = Object.values(artistMap).sort((a, b) =>
        b.artworks.length - a.artworks.length
      );

      setArtists(artistList);
    } catch (error) {
      console.error('Failed to load artists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
          Our Artists
        </h1>
        <p className="text-gray-600 text-lg">
          Meet the talented creators in our community
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : artists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map(artist => (
            <Link
              key={artist.id}
              to={`/artist/${artist.username}`}
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center space-x-4 mb-4">
                {artist.profile_image ? (
                  <img
                    src={artist.profile_image}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-600">@{artist.username}</p>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Palette className="h-4 w-4 mr-2" />
                <span>{artist.artworks.length} artwork{artist.artworks.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Preview artworks */}
              {artist.artworks.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {artist.artworks.slice(0, 3).map(artwork => (
                    <img
                      key={artwork.id}
                      src={artwork.thumbnail_url}
                      alt={artwork.title}
                      className="w-full aspect-square object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">No artists found</p>
        </div>
      )}
    </div>
  );
}

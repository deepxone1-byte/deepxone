import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';

export default function ArtworkCard({ artwork }) {
  return (
    <Link to={`/artwork/${artwork.id}`} className="card hover:shadow-lg transition-shadow duration-200 group">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={artwork.thumbnail_url}
          alt={artwork.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {artwork.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          by {artwork.artist_name || artwork.username}
        </p>
        {artwork.category && (
          <span className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
            {artwork.category}
          </span>
        )}
        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
          <span className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {artwork.views || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

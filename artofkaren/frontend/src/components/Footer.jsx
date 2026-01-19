import { Palette, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-8 w-8 text-primary-400" />
              <span className="font-display text-2xl font-bold text-white">
                Art of Karen
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              A community platform for artists, students, and art enthusiasts to share, learn, and grow together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-primary-400">Gallery</Link>
              </li>
              <li>
                <Link to="/artists" className="text-gray-400 hover:text-primary-400">Artists</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-400">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-400">Join Us</Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400">About</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Art of Karen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

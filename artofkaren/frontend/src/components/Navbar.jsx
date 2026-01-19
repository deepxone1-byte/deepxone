import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Palette, User, LogOut, Upload, FileText, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, canUploadArt, canWriteBlog } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-primary-600" />
              <span className="font-display text-2xl font-bold text-gray-900">
                Art of Karen
              </span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/gallery" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Gallery
              </Link>
              <Link to="/artists" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Artists
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Blog
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {canUploadArt && (
                  <Link to="/upload" className="btn btn-primary flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Art</span>
                  </Link>
                )}
                {canWriteBlog && (
                  <Link to="/create-blog" className="btn btn-outline flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Write</span>
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/gallery" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Gallery
            </Link>
            <Link to="/artists" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Artists
            </Link>
            <Link to="/blog" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
            {user ? (
              <>
                {canUploadArt && (
                  <Link to="/upload" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    Upload Artwork
                  </Link>
                )}
                {canWriteBlog && (
                  <Link to="/create-blog" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    Write Blog
                  </Link>
                )}
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                  </Link>
                <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

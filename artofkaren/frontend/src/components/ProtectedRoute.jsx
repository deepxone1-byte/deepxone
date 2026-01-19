import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireArtwork, requireBlog }) {
  const { user, loading, canUploadArt, canWriteBlog } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireArtwork && !canUploadArt) {
    return <Navigate to="/" />;
  }

  if (requireBlog && !canWriteBlog) {
    return <Navigate to="/" />;
  }

  return children;
}

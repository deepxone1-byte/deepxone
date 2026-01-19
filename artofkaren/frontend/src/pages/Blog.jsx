import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getAll({ page, limit: 10 });
      setPosts(response.data.posts);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
          Blog
        </h1>
        <p className="text-gray-600 text-lg">
          Stories, insights, and creative processes from our artist community
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="space-y-8 mb-12">
            {posts.map((post) => (
              <article key={post.id} className="card p-6 hover:shadow-lg transition-shadow">
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <Link to={`/blog/${post.slug}`}>
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author_name || post.username}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>

                {post.excerpt && (
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                )}

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">No blog posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

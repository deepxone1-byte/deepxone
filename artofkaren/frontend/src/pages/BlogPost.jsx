import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const response = await blogAPI.getBySlug(slug);
      setPost(response.data);
    } catch (error) {
      toast.error('Failed to load blog post');
      console.error(error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500">Blog post not found</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>

      {post.featured_image && (
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-96 object-cover rounded-xl mb-8"
        />
      )}

      <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        {post.title}
      </h1>

      <div className="flex items-center space-x-6 text-gray-600 mb-8 pb-8 border-b">
        <Link
          to={`/artist/${post.username}`}
          className="flex items-center hover:text-primary-600 transition-colors"
        >
          {post.author_image && (
            <img
              src={post.author_image}
              alt={post.author_name}
              className="w-10 h-10 rounded-full mr-2"
            />
          )}
          <span className="font-medium">{post.author_name || post.username}</span>
        </Link>
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDate(post.published_at || post.created_at)}
        </span>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.content}
        </div>
      </div>
    </article>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    is_published: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await blogAPI.create(formData);
      toast.success('Blog post created successfully!');
      navigate(`/blog/${response.data.slug}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create blog post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold text-gray-900 mb-8">
        Write Blog Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="input text-2xl font-display"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your blog post title"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt (Short Summary)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows="2"
            className="input"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="A brief summary of your post..."
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            rows="20"
            required
            className="input font-mono text-sm"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog post content here. You can use markdown formatting..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Tip: Use line breaks to separate paragraphs
          </p>
        </div>

        <div className="flex items-center">
          <input
            id="is_published"
            name="is_published"
            type="checkbox"
            checked={formData.is_published}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
            Publish immediately
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            <span>{loading ? 'Publishing...' : 'Publish Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

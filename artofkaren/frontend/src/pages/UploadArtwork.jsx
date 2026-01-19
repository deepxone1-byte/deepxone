import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { artworkAPI } from '../services/api';
import { Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadArtwork() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    created_year: new Date().getFullYear(),
    is_published: true
  });
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('image', imageFile);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('created_year', formData.created_year);
      data.append('is_published', formData.is_published);

      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
        data.append('tags', JSON.stringify(tagsArray));
      }

      const response = await artworkAPI.create(data);
      toast.success('Artwork uploaded successfully!');
      navigate(`/artwork/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload artwork');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Painting', 'Drawing', 'Digital', 'Sculpture', 'Photography', 'Mixed Media'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold text-gray-900 mb-8">
        Upload Artwork
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Artwork Image *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setImageFile(null);
                  }}
                  className="btn btn-secondary"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="input"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter artwork title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="input"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your artwork, inspiration, technique..."
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="input"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="input"
            value={formData.tags}
            onChange={handleChange}
            placeholder="portrait, oil, realism"
          />
        </div>

        {/* Created Year */}
        <div>
          <label htmlFor="created_year" className="block text-sm font-medium text-gray-700 mb-1">
            Year Created
          </label>
          <input
            id="created_year"
            name="created_year"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            className="input"
            value={formData.created_year}
            onChange={handleChange}
          />
        </div>

        {/* Published */}
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

        {/* Submit */}
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
            <Upload className="h-4 w-4" />
            <span>{loading ? 'Uploading...' : 'Upload Artwork'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

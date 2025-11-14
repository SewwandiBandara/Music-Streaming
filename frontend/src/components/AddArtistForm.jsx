import { useState } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const AddArtistForm = ({ onArtistAdded }) => {
  const { getAuthHeader } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [artistForm, setArtistForm] = useState({
    name: '',
    bio: '',
    genres: '',
    monthlyListeners: '',
    followers: '',
    instagram: '',
    twitter: '',
    facebook: '',
    website: ''
  });

  const [artistImage, setArtistImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtistForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setArtistImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      // Validate required fields
      if (!artistForm.name) {
        throw new Error('Please enter artist name');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('name', artistForm.name);
      formData.append('bio', artistForm.bio);
      formData.append('genres', artistForm.genres);
      formData.append('monthlyListeners', artistForm.monthlyListeners || '0');
      formData.append('followers', artistForm.followers || '0');
      formData.append('instagram', artistForm.instagram);
      formData.append('twitter', artistForm.twitter);
      formData.append('facebook', artistForm.facebook);
      formData.append('website', artistForm.website);

      if (artistImage) {
        formData.append('artistImage', artistImage);
      }

      const response = await axios.post(
        'http://localhost:5000/api/admin/artists',
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess('Artist created successfully!');

      // Reset form
      setArtistForm({
        name: '',
        bio: '',
        genres: '',
        monthlyListeners: '',
        followers: '',
        instagram: '',
        twitter: '',
        facebook: '',
        website: ''
      });
      setArtistImage(null);

      // Reset file input
      document.getElementById('artistImage').value = '';

      if (onArtistAdded) {
        onArtistAdded(response.data.artist);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create artist');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Add New Artist</h2>

      {error && (
        <div className="bg-red-900/20 border border-red-400 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 border border-green-400 text-green-600 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={artistForm.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter artist name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={artistForm.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Artist biography..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genres (comma-separated)
              </label>
              <input
                type="text"
                name="genres"
                value={artistForm.genres}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Pop, Rock, Hip Hop"
              />
              <p className="mt-1 text-sm text-gray-500">Separate multiple genres with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist Image
              </label>
              <input
                type="file"
                id="artistImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {artistImage && <p className="mt-1 text-sm text-gray-600">Selected: {artistImage.name}</p>}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Listeners
              </label>
              <input
                type="number"
                name="monthlyListeners"
                value={artistForm.monthlyListeners}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Followers
              </label>
              <input
                type="number"
                name="followers"
                value={artistForm.followers}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 500000"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg">
                  @
                </span>
                <input
                  type="text"
                  name="instagram"
                  value={artistForm.instagram}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg">
                  @
                </span>
                <input
                  type="text"
                  name="twitter"
                  value={artistForm.twitter}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                value={artistForm.facebook}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={artistForm.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setArtistForm({
                name: '',
                bio: '',
                genres: '',
                monthlyListeners: '',
                followers: '',
                instagram: '',
                twitter: '',
                facebook: '',
                website: ''
              });
              setArtistImage(null);
              document.getElementById('artistImage').value = '';
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {uploading ? 'Creating...' : 'Create Artist'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArtistForm;

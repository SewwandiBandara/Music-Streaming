import { useState, useEffect } from 'react';
import axios from 'axios';

const AddPlaylistForm = ({ onPlaylistAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    isPublic: true,
    collaborative: false,
    allowDownload: false,
    allowComments: true
  });
  const [coverImage, setCoverImage] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchSongs();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchSongs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/admin/songs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs(response.data.songs || []);
    } catch (err) {
      console.error('Error fetching songs:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSongToggle = (songId) => {
    setSelectedSongs(prev =>
      prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const handleCollaboratorToggle = (userId) => {
    setSelectedCollaborators(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('owner', formData.owner);
      formDataToSend.append('isPublic', formData.isPublic);
      formDataToSend.append('collaborative', formData.collaborative);
      formDataToSend.append('allowDownload', formData.allowDownload);
      formDataToSend.append('allowComments', formData.allowComments);
      formDataToSend.append('songs', JSON.stringify(selectedSongs));
      formDataToSend.append('collaborators', JSON.stringify(selectedCollaborators));

      if (coverImage) {
        formDataToSend.append('coverImage', coverImage);
      }

      await axios.post('http://localhost:5000/api/admin/playlists', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Playlist created successfully!');

      // Reset form
      setFormData({
        name: '',
        description: '',
        owner: '',
        isPublic: true,
        collaborative: false,
        allowDownload: false,
        allowComments: true
      });
      setCoverImage(null);
      setSelectedSongs([]);
      setSelectedCollaborators([]);

      if (onPlaylistAdded) {
        onPlaylistAdded();
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError(err.response?.data?.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Create New Playlist</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Playlist Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="My Awesome Playlist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner *
            </label>
            <select
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select owner...</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your playlist..."
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Privacy Settings */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Public playlist</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="collaborative"
                checked={formData.collaborative}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Collaborative playlist</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="allowDownload"
                checked={formData.allowDownload}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Allow downloads</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="allowComments"
                checked={formData.allowComments}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Allow comments</span>
            </label>
          </div>
        </div>

        {/* Collaborators */}
        {formData.collaborative && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborators</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {users.filter(u => u._id !== formData.owner).map(user => (
                <label key={user._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCollaborators.includes(user._id)}
                    onChange={() => handleCollaboratorToggle(user._id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {user.username} ({user.email})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Songs Selection */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Songs</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {songs.map(song => (
              <label key={song._id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSongs.includes(song._id)}
                  onChange={() => handleSongToggle(song._id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {song.title} - {song.artist?.name || 'Unknown Artist'}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {selectedSongs.length} song(s) selected
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              if (onPlaylistAdded) onPlaylistAdded();
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlaylistForm;

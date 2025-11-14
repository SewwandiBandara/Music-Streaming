import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const AddSongForm = ({ onSongAdded }) => {
  const { getAuthHeader } = useAdmin();
  const [artistsList, setArtistsList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [songForm, setSongForm] = useState({
    title: '',
    artistId: '',
    genre: '',
    duration: '',
    releaseDate: '',
    lyrics: '',
    explicit: false,
    bitrate: '320',
    tempo: '',
    key: '',
    mood: '',
    energy: '',
    danceability: ''
  });

  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/artists/list', {
        headers: getAuthHeader()
      });
      setArtistsList(response.data.artists);
    } catch (err) {
      console.error('Error fetching artists:', err);
      setError('Failed to load artists');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSongForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === 'audio') {
      setAudioFile(file);
    } else if (fileType === 'cover') {
      setCoverImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      // Validate required fields
      if (!songForm.title || !songForm.artistId || !songForm.genre || !songForm.duration || !songForm.releaseDate) {
        throw new Error('Please fill in all required fields');
      }

      if (!audioFile) {
        throw new Error('Please select an audio file');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('title', songForm.title);
      formData.append('artistId', songForm.artistId);
      formData.append('genre', songForm.genre);
      formData.append('duration', songForm.duration);
      formData.append('releaseDate', songForm.releaseDate);
      formData.append('lyrics', songForm.lyrics);
      formData.append('explicit', songForm.explicit);
      formData.append('bitrate', songForm.bitrate);
      formData.append('audioFile', audioFile);

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      // Audio features
      if (songForm.tempo) formData.append('tempo', songForm.tempo);
      if (songForm.key) formData.append('key', songForm.key);
      if (songForm.mood) formData.append('mood', songForm.mood);
      if (songForm.energy) formData.append('energy', songForm.energy);
      if (songForm.danceability) formData.append('danceability', songForm.danceability);

      const response = await axios.post(
        'http://localhost:5000/api/admin/songs',
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess('Song uploaded successfully!');

      // Reset form
      setSongForm({
        title: '',
        artistId: '',
        genre: '',
        duration: '',
        releaseDate: '',
        lyrics: '',
        explicit: false,
        bitrate: '320',
        tempo: '',
        key: '',
        mood: '',
        energy: '',
        danceability: ''
      });
      setAudioFile(null);
      setCoverImage(null);

      // Reset file inputs
      document.getElementById('audioFile').value = '';
      document.getElementById('coverImage').value = '';

      if (onSongAdded) {
        onSongAdded(response.data.song);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload song');
    } finally {
      setUploading(false);
    }
  };

  const genres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Country', 'Latin', 'Indie', 'Alternative', 'Soul', 'Reggae', 'Metal', 'Folk'];
  const moods = ['Happy', 'Sad', 'Energetic', 'Calm', 'Angry', 'Romantic', 'Melancholic', 'Uplifting'];
  const musicalKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Add New Song</h2>

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
        {/* Metadata Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={songForm.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter song title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist <span className="text-red-500">*</span>
              </label>
              <select
                name="artistId"
                value={songForm.artistId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an artist</option>
                {artistsList.map(artist => (
                  <option key={artist._id} value={artist._id}>{artist.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                name="genre"
                value={songForm.genre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (seconds) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={songForm.duration}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="releaseDate"
                value={songForm.releaseDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="explicit"
                id="explicit"
                checked={songForm.explicit}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="explicit" className="ml-2 text-sm font-medium text-gray-700">
                Explicit Content
              </label>
            </div>
          </div>
        </div>

        {/* File Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">File Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="audioFile"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, 'audio')}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {audioFile && <p className="mt-1 text-sm text-gray-600">Selected: {audioFile.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image (optional)
              </label>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'cover')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {coverImage && <p className="mt-1 text-sm text-gray-600">Selected: {coverImage.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bitrate (kbps)
              </label>
              <input
                type="number"
                name="bitrate"
                value={songForm.bitrate}
                onChange={handleInputChange}
                min="128"
                max="320"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="320"
              />
            </div>
          </div>
        </div>

        {/* Audio Features Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo (BPM)
              </label>
              <input
                type="number"
                name="tempo"
                value={songForm.tempo}
                onChange={handleInputChange}
                min="40"
                max="200"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Musical Key
              </label>
              <select
                name="key"
                value={songForm.key}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select key</option>
                {musicalKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood
              </label>
              <select
                name="mood"
                value={songForm.mood}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select mood</option>
                {moods.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy (0-100)
              </label>
              <input
                type="number"
                name="energy"
                value={songForm.energy}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 75"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danceability (0-100)
              </label>
              <input
                type="number"
                name="danceability"
                value={songForm.danceability}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 80"
              />
            </div>
          </div>
        </div>

        {/* Lyrics Section */}
        <div className="pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lyrics</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lyrics (optional)
            </label>
            <textarea
              name="lyrics"
              value={songForm.lyrics}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter song lyrics..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setSongForm({
                title: '',
                artistId: '',
                genre: '',
                duration: '',
                releaseDate: '',
                lyrics: '',
                explicit: false,
                bitrate: '320',
                tempo: '',
                key: '',
                mood: '',
                energy: '',
                danceability: ''
              });
              setAudioFile(null);
              setCoverImage(null);
              document.getElementById('audioFile').value = '';
              document.getElementById('coverImage').value = '';
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
            {uploading ? 'Uploading...' : 'Upload Song'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSongForm;

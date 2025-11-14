import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import axios from 'axios';
import AddSongForm from '../components/AddSongForm';
import AddArtistForm from '../components/AddArtistForm';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { admin, logout, getAuthHeader, isAuthenticated } = useAdmin();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeader();

      const [statsRes, usersRes, songsRes, artistsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', { headers }),
        axios.get('http://localhost:5000/api/admin/users?limit=10', { headers }),
        axios.get('http://localhost:5000/api/admin/songs?limit=10', { headers }),
        axios.get('http://localhost:5000/api/admin/artists?limit=10', { headers })
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setSongs(songsRes.data.songs);
      setArtists(artistsRes.data.artists);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: getAuthHeader()
      });
      setUsers(users.filter(user => user._id !== userId));
      fetchDashboardData(); // Refresh stats
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/songs/${songId}`, {
        headers: getAuthHeader()
      });
      setSongs(songs.filter(song => song._id !== songId));
      fetchDashboardData(); // Refresh stats
    } catch (err) {
      console.error('Error deleting song:', err);
      alert('Failed to delete song');
    }
  };

  const handleVerifyArtist = async (artistId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/admin/artists/${artistId}/verify`,
        {},
        { headers: getAuthHeader() }
      );

      setArtists(artists.map(artist =>
        artist._id === artistId ? response.data.artist : artist
      ));
    } catch (err) {
      console.error('Error verifying artist:', err);
      alert('Failed to update artist verification');
    }
  };

  const handleDeleteArtist = async (artistId) => {
    if (!window.confirm('Are you sure you want to delete this artist?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/artists/${artistId}`, {
        headers: getAuthHeader()
      });
      setArtists(artists.filter(artist => artist._id !== artistId));
      fetchDashboardData(); // Refresh stats
    } catch (err) {
      console.error('Error deleting artist:', err);
      alert('Failed to delete artist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-950 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <span className="px-3 py-1 bg-black text-white text-sm rounded-full">
                {admin?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {['overview', 'users', 'songs', 'add-song', 'artists', 'add-artist'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === tab
                    ? 'border-blue-700 text-blue-900'
                    : 'border-transparent text-gray-600 hover:text-blue-700'
                }`}
              >
                {tab === 'add-song' ? 'Add Song' : tab === 'add-artist' ? 'Add Artist' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-400 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Songs</p>
                    <p className="text-3xl font-bold text-blue-800">{stats.totalSongs}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Artists</p>
                    <p className="text-3xl font-bold text-blue-700">{stats.totalArtists}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Plays</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalPlays}</p>
                  </div>
                  <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-xl font-semibold text-blue-900">Users Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-800 font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Songs Tab */}
        {activeTab === 'songs' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-blue-900">Songs Management</h2>
            </div>

            {songs.map((song) => (
              <div key={song._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start space-x-6">
                    {/* Song Cover Image */}
                    <div className="flex-shrink-0">
                      {song.coverImage ? (
                        <img
                          src={`http://localhost:5000${song.coverImage}`}
                          alt={song.title}
                          className="w-32 h-32 rounded-lg object-cover shadow-md"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Song Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{song.title}</h3>
                            {song.explicit && (
                              <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">E</span>
                            )}
                          </div>

                          {/* Artist & Genre */}
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="text-gray-700 font-medium">{song.artist?.name || 'Unknown Artist'}</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{song.genre}</span>
                          </div>

                          {/* Song Metadata Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Duration</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Release Date</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(song.releaseDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Play Count</p>
                              <p className="text-sm font-semibold text-gray-900">{song.playCount?.toLocaleString() || 0}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Bitrate</p>
                              <p className="text-sm font-semibold text-gray-900">{song.bitrate || 320} kbps</p>
                            </div>
                          </div>

                          {/* Audio Features */}
                          {song.features && (song.features.tempo || song.features.key || song.features.mood) && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Audio Features</h4>
                              <div className="flex flex-wrap gap-2">
                                {song.features.tempo && (
                                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                                    Tempo: {song.features.tempo} BPM
                                  </span>
                                )}
                                {song.features.key && (
                                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                    Key: {song.features.key}
                                  </span>
                                )}
                                {song.features.mood && (
                                  <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full">
                                    Mood: {song.features.mood}
                                  </span>
                                )}
                                {song.features.energy && (
                                  <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
                                    Energy: {song.features.energy}%
                                  </span>
                                )}
                                {song.features.danceability && (
                                  <span className="px-3 py-1 bg-pink-50 text-pink-700 text-xs rounded-full">
                                    Danceability: {song.features.danceability}%
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* File Info */}
                          <div className="mt-4 text-xs text-gray-500">
                            <span className="mr-4">Format: {song.format?.toUpperCase() || 'MP3'}</span>
                            <span className="mr-4">Size: {(song.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                            <span>Added: {new Date(song.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleDeleteSong(song._id)}
                            className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {songs.length === 0 && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-gray-500 text-lg">No songs found</p>
                <p className="text-gray-400 text-sm mt-2">Add your first song to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Add Song Tab */}
        {activeTab === 'add-song' && (
          <AddSongForm onSongAdded={() => {
            fetchDashboardData();
            setActiveTab('songs');
          }} />
        )}

        {/* Artists Tab */}
        {activeTab === 'artists' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-blue-900">Artists Management</h2>
            </div>

            {artists.map((artist) => (
              <div key={artist._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start space-x-6">
                    {/* Artist Image */}
                    <div className="flex-shrink-0">
                      {artist.image ? (
                        <img
                          src={`http://localhost:5000${artist.image}`}
                          alt={artist.name}
                          className="w-32 h-32 rounded-lg object-cover shadow-md"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Artist Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-2xl font-bold text-gray-900">{artist.name}</h3>
                            {artist.isVerified && (
                              <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified
                              </span>
                            )}
                          </div>

                          {/* Genres */}
                          {artist.genres && artist.genres.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {artist.genres.map((genre, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  {genre}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Bio */}
                          {artist.bio && (
                            <p className="mt-3 text-gray-600 text-sm leading-relaxed max-w-3xl">
                              {artist.bio}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerifyArtist(artist._id)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition"
                          >
                            {artist.isVerified ? 'Unverify' : 'Verify'}
                          </button>
                          <button
                            onClick={() => handleDeleteArtist(artist._id)}
                            className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Analytics Grid */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span className="text-sm font-medium text-purple-900">Followers</span>
                          </div>
                          <p className="mt-2 text-2xl font-bold text-purple-700">
                            {artist.followers?.toLocaleString() || 0}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-green-900">Monthly Listeners</span>
                          </div>
                          <p className="mt-2 text-2xl font-bold text-green-700">
                            {artist.monthlyListeners?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>

                      {/* Social Media Links */}
                      {artist.socialLinks && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {artist.socialLinks.instagram && (
                            <a
                              href={`https://instagram.com/${artist.socialLinks.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                              <span>@{artist.socialLinks.instagram}</span>
                            </a>
                          )}
                          {artist.socialLinks.twitter && (
                            <a
                              href={`https://twitter.com/${artist.socialLinks.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                              <span>@{artist.socialLinks.twitter}</span>
                            </a>
                          )}
                          {artist.socialLinks.facebook && (
                            <a
                              href={artist.socialLinks.facebook.startsWith('http') ? artist.socialLinks.facebook : `https://facebook.com/${artist.socialLinks.facebook}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              <span>Facebook</span>
                            </a>
                          )}
                          {artist.socialLinks.website && (
                            <a
                              href={artist.socialLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                              </svg>
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {artists.length === 0 && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-gray-500 text-lg">No artists found</p>
                <p className="text-gray-400 text-sm mt-2">Add your first artist to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Add Artist Tab */}
        {activeTab === 'add-artist' && (
          <AddArtistForm onArtistAdded={() => {
            fetchDashboardData();
            setActiveTab('artists');
          }} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

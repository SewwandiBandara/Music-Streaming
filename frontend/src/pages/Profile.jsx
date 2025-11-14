import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('my-content'); // 'my-content' or 'discover'
  const [activeTab, setActiveTab] = useState('favorites');
  const [discoverTab, setDiscoverTab] = useState('all-songs');
  const [searchQuery, setSearchQuery] = useState('');
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/signin');
      return;
    }

    setUser(JSON.parse(userData));
    fetchAllArtists();
    fetchAllSongs();
  }, [navigate]);

  // Fetch user's playlists when My Content > Playlists tab is active
  useEffect(() => {
    if (activeSection === 'my-content' && activeTab === 'playlists') {
      fetchMyPlaylists();
    }
  }, [activeSection, activeTab]);

  // Fetch all public playlists when Discover > All Playlists tab is active
  useEffect(() => {
    if (activeSection === 'discover' && discoverTab === 'all-playlists') {
      fetchAllPlaylists();
    }
  }, [activeSection, discoverTab]);

  const fetchMyPlaylists = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/playlists/my-playlists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching my playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/playlists?limit=20');
      setAllPlaylists(response.data.playlists || []);
    } catch (error) {
      console.error('Error fetching all playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const myContentTabs = [
    { id: 'favorites', label: t('Favorites'), icon: '❤️' },
    { id: 'playlists', label: t('Playlists'), icon: '🎵' },
    { id: 'saved', label: t('Saved'), icon: '💾' },
    { id: 'albums', label: t('Albums'), icon: '💿' },
  ];

  const discoverTabs = [
    { id: 'all-songs', label: t('All Songs'), icon: '🎵' },
    { id: 'all-albums', label: t('All Albums'), icon: '💿' },
    { id: 'all-playlists', label: t('All Playlists'), icon: '📝' },
    { id: 'all-artists', label: t('All Artists'), icon: '🎤' },
  ];

  const allAlbums = [
    { title: 'After Hours', artist: 'The Weeknd', year: '2020' },
    { title: 'Divide', artist: 'Ed Sheeran', year: '2017' },
    { title: '21', artist: 'Adele', year: '2011' },
    { title: 'Future Nostalgia', artist: 'Dua Lipa', year: '2020' },
    { title: 'When We All Fall Asleep', artist: 'Billie Eilish', year: '2019' },
    { title: 'Starboy', artist: 'The Weeknd', year: '2016' },
    { title: 'Uptown Special', artist: 'Bruno Mars', year: '2015' },
    { title: 'Evolve', artist: 'Imagine Dragons', year: '2017' },
    { title: 'Hollywood\'s Bleeding', artist: 'Post Malone', year: '2019' },
    { title: 'Fine Line', artist: 'Harry Styles', year: '2019' },
  ];


  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Profile Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {t('Logout')}
            </button>
          </div>
        </div>

        {/* Section Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveSection('my-content')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
              activeSection === 'my-content'
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            📚 {t('My Content')}
          </button>
          <button
            onClick={() => setActiveSection('discover')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
              activeSection === 'discover'
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            🔍 {t('Discover Music')}
          </button>
        </div>

        {/* My Content Section */}
        {activeSection === 'my-content' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('Liked Songs')}</p>
                    <p className="text-3xl font-bold text-blue-900">0</p>
                  </div>
                  <div className="text-4xl">❤️</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('My Playlists')}</p>
                    <p className="text-3xl font-bold text-blue-800">{myPlaylists.length}</p>
                  </div>
                  <div className="text-4xl">🎵</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('Saved')}</p>
                    <p className="text-3xl font-bold text-blue-700">0</p>
                  </div>
                  <div className="text-4xl">💾</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('Saved Albums')}</p>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                  </div>
                  <div className="text-4xl">💿</div>
                </div>
              </div>
            </div>

            {/* My Content Tabs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex space-x-1 p-2">
                  {myContentTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-900 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'favorites' && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('No favorites yet')}</h3>
                    <p className="text-gray-600 mb-6">
                      {t('Start adding songs to your favorites by clicking the heart icon')}
                    </p>
                    <button
                      onClick={() => setActiveSection('discover')}
                      className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      {t('Discover Music')}
                    </button>
                  </div>
                )}

                {activeTab === 'playlists' && (
                  <div>
                    {loading ? (
                      <div className="text-center py-16">
                        <div className="text-gray-600">Loading playlists...</div>
                      </div>
                    ) : myPlaylists.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">🎵</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Playlists Yet</h3>
                        <p className="text-gray-600 mb-6">
                          Create your first playlist to organize your favorite music
                        </p>
                        <button
                          onClick={() => navigate('/playlists')}
                          className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                          Create Playlist
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myPlaylists.map((playlist) => (
                          <div key={playlist._id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{playlist.name}</h3>
                                {playlist.description && (
                                  <p className="text-xs text-gray-500 mb-1 line-clamp-2">{playlist.description}</p>
                                )}
                                <p className="text-sm text-gray-600">{playlist.songs.length} {t('songs')}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                                View Playlist
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'saved' && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">💾</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Saved Songs</h3>
                    <p className="text-gray-600 mb-6">
                      Save songs to listen to them offline
                    </p>
                    <button
                      onClick={() => setActiveSection('discover')}
                      className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Discover Music
                    </button>
                  </div>
                )}

                {activeTab === 'albums' && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">💿</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Albums Saved</h3>
                    <p className="text-gray-600 mb-6">
                      Add albums to your collection
                    </p>
                    <button
                      onClick={() => setActiveSection('discover')}
                      className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Browse Albums
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Discover Section */}
        {activeSection === 'discover' && (
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('Search songs, artists, albums...')}
                    className="w-full px-6 py-4 pl-14 pr-4 rounded-full bg-gray-100 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                  />
                  <svg
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </form>
            </div>

            {/* Discover Tabs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex space-x-1 p-2">
                  {discoverTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDiscoverTab(tab.id)}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        discoverTab === tab.id
                          ? 'bg-blue-900 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discover Content */}
              <div className="p-8">
                {discoverTab === 'all-songs' && (
                  <>
                    {songsLoading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                        <p className="mt-4 text-gray-600">Loading songs...</p>
                      </div>
                    ) : allSongs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allSongs.map((song, index) => (
                          <div key={song._id || index} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border border-gray-200 overflow-hidden">
                            {/* Cover Image */}
                            {song.coverImage ? (
                              <div className="w-full aspect-square overflow-hidden">
                                <img
                                  src={`http://localhost:5000${song.coverImage}`}
                                  alt={song.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                />
                              </div>
                            ) : (
                              <div className="w-full aspect-square bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">
                                <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                </svg>
                              </div>
                            )}

                            {/* Song Details */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 truncate flex-1">{song.title}</h3>
                                {song.explicit && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-red-600 text-white text-xs font-bold rounded">E</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 truncate mb-1">
                                {song.artist?.name || 'Unknown Artist'}
                              </p>
                              <p className="text-xs text-gray-500 truncate mb-2">{song.genre}</p>

                              {/* Metadata */}
                              <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                                <span>{formatDuration(song.duration)}</span>
                                <span>{song.playCount?.toLocaleString() || 0} plays</span>
                              </div>

                              {/* Audio Features */}
                              {song.features && (song.features.tempo || song.features.mood || song.features.energy || song.features.danceability) && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {song.features.tempo && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                      {song.features.tempo} BPM
                                    </span>
                                  )}
                                  {song.features.mood && (
                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded capitalize">
                                      {song.features.mood}
                                    </span>
                                  )}
                                  {song.features.energy && (
                                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                                      Energy: {song.features.energy}%
                                    </span>
                                  )}
                                  {song.features.danceability && (
                                    <span className="px-2 py-0.5 bg-pink-50 text-pink-700 text-xs rounded">
                                      Dance: {song.features.danceability}%
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* File Info */}
                              {song.format && song.fileSize && (
                                <div className="text-xs text-gray-400 mt-2">
                                  {song.format.toUpperCase()} • {(song.fileSize / 1024 / 1024).toFixed(2)} MB
                                  {song.bitrate && ` • ${song.bitrate} kbps`}
                                </div>
                              )}

                              {/* Release Date */}
                              {song.releaseDate && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Released: {new Date(song.releaseDate).toLocaleDateString()}
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => handleListen(song)}
                                  className="flex-1 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                                  title="Listen"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                  Play
                                </button>
                                <button
                                  onClick={() => handleAddToFavorites(song._id)}
                                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Add to Favorites"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDownload(song)}
                                  className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                  title="Download"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No songs available yet</p>
                      </div>
                    )}
                  </>
                )}

                {discoverTab === 'all-albums' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allAlbums.map((album, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                        <div className="w-full aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg mb-3 flex items-center justify-center">
                          <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{album.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{album.artist} • {album.year}</p>
                        <button className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                          Save Album
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {discoverTab === 'all-playlists' && (
                  <div>
                    {loading ? (
                      <div className="text-center py-16">
                        <div className="text-gray-600">Loading playlists...</div>
                      </div>
                    ) : allPlaylists.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Playlists Available</h3>
                        <p className="text-gray-600">Check back later for new playlists</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allPlaylists.map((playlist) => (
                          <div key={playlist._id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{playlist.name}</h3>
                                {playlist.description && (
                                  <p className="text-xs text-gray-500 mb-1 line-clamp-2">{playlist.description}</p>
                                )}
                                <p className="text-sm text-gray-600">{playlist.songs?.length || 0} {t('songs')}</p>
                                <p className="text-xs text-gray-500">by {playlist.owner?.name || 'Unknown'}</p>
                              </div>
                            </div>
                            <button className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                              View Playlist
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {discoverTab === 'all-artists' && (
                  <>
                    {artistsLoading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                        <p className="mt-4 text-gray-600">Loading artists...</p>
                      </div>
                    ) : allArtists.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {allArtists.map((artist, index) => (
                          <div key={artist._id || index} className="text-center">
                            {artist.image ? (
                              <div className="w-full aspect-square rounded-full mb-3 cursor-pointer hover:scale-105 transition-transform overflow-hidden shadow-lg">
                                <img
                                  src={`http://localhost:5000${artist.image}`}
                                  alt={artist.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full aspect-square bg-gradient-to-br from-blue-600 to-blue-900 rounded-full mb-3 cursor-pointer hover:scale-105 transition-transform shadow-lg flex items-center justify-center">
                                <svg className="w-1/2 h-1/2 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <h3 className="font-semibold text-gray-900 mb-1 truncate">{artist.name}</h3>
                            <p className="text-xs text-gray-600 mb-1">{artist.genres && artist.genres.length > 0 ? artist.genres[0] : 'Artist'}</p>
                            <p className="text-xs text-blue-600 font-medium mb-2">{formatFollowers(artist.followers || 0)}</p>
                            <button className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-xs font-medium">
                              Follow
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No artists found</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('my-content'); // 'my-content' or 'discover'
  const [activeTab, setActiveTab] = useState('favorites');
  const [discoverTab, setDiscoverTab] = useState('all-songs');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/signin');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

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

  const allSongs = [
    { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' },
    { title: 'Shape of You', artist: 'Ed Sheeran', album: 'Divide' },
    { title: 'Someone Like You', artist: 'Adele', album: '21' },
    { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia' },
    { title: 'Starboy', artist: 'The Weeknd', album: 'Starboy' },
    { title: 'Perfect', artist: 'Ed Sheeran', album: 'Divide' },
    { title: 'Rolling in the Deep', artist: 'Adele', album: '21' },
    { title: 'Bad Guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep' },
    { title: 'Uptown Funk', artist: 'Bruno Mars', album: 'Uptown Special' },
    { title: 'Believer', artist: 'Imagine Dragons', album: 'Evolve' },
    { title: 'Circles', artist: 'Post Malone', album: 'Hollywood\'s Bleeding' },
    { title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line' },
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

  const allPlaylists = [
    { name: 'Today\'s Top Hits', count: 50, description: 'The biggest songs right now' },
    { name: 'Chill Vibes', count: 35, description: 'Relax and unwind' },
    { name: 'Workout Beats', count: 45, description: 'High energy music' },
    { name: 'Study Focus', count: 30, description: 'Concentration music' },
    { name: 'Party Anthems', count: 60, description: 'Get the party started' },
    { name: 'Classic Rock', count: 40, description: 'Timeless rock hits' },
    { name: 'R&B Soul', count: 38, description: 'Smooth R&B tracks' },
    { name: 'Pop Hits 2024', count: 55, description: 'Latest pop sensations' },
    { name: 'Indie Favorites', count: 42, description: 'Best indie tracks' },
    { name: 'Electronic Dance', count: 48, description: 'EDM essentials' },
  ];

  const allArtists = [
    { name: 'Taylor Swift', genre: 'Pop', followers: '90M+' },
    { name: 'Drake', genre: 'Hip Hop', followers: '85M+' },
    { name: 'The Weeknd', genre: 'R&B', followers: '80M+' },
    { name: 'Ed Sheeran', genre: 'Pop', followers: '75M+' },
    { name: 'Ariana Grande', genre: 'Pop', followers: '70M+' },
    { name: 'Billie Eilish', genre: 'Alternative', followers: '65M+' },
    { name: 'Post Malone', genre: 'Hip Hop', followers: '60M+' },
    { name: 'Dua Lipa', genre: 'Pop', followers: '55M+' },
    { name: 'Justin Bieber', genre: 'Pop', followers: '88M+' },
    { name: 'Bad Bunny', genre: 'Latin', followers: '72M+' },
    { name: 'Adele', genre: 'Pop/Soul', followers: '45M+' },
    { name: 'Bruno Mars', genre: 'Pop/R&B', followers: '50M+' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <Navbar />
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
                    <p className="text-3xl font-bold text-blue-800">0</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allSongs.map((song, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                        <div className="w-full aspect-square bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg mb-3 flex items-center justify-center">
                          <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{song.title}</h3>
                        <p className="text-sm text-gray-600 mb-1 truncate">{song.artist}</p>
                        <p className="text-xs text-gray-500 mb-2 truncate">{song.album}</p>
                        <button className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                          Add to Favorites
                        </button>
                      </div>
                    ))}
                  </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allPlaylists.map((playlist, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{playlist.name}</h3>
                            <p className="text-xs text-gray-500 mb-1">{playlist.description}</p>
                            <p className="text-sm text-gray-600">{playlist.count} {t('songs')}</p>
                          </div>
                        </div>
                        <button className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                          Follow Playlist
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {discoverTab === 'all-artists' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {allArtists.map((artist, index) => (
                      <div key={index} className="text-center">
                        <div className="w-full aspect-square bg-gradient-to-br from-blue-600 to-blue-900 rounded-full mb-3 cursor-pointer hover:scale-105 transition-transform"></div>
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{artist.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">{artist.genre}</p>
                        <p className="text-xs text-blue-600 font-medium mb-2">{artist.followers}</p>
                        <button className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-xs font-medium">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
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

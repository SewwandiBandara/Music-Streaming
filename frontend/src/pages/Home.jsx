import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';


const Home = () => {
  const { t } = useTranslation();
  const [popularArtists, setPopularArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);

  useEffect(() => {
    fetchPopularArtists();
    fetchTrendingSongs();
  }, []);

  const fetchPopularArtists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/artists', {
        params: { limit: 10 }
      });
      setPopularArtists(response.data.artists);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setLoading(false);
    }
  };

  const fetchTrendingSongs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/songs/trending/top', {
        params: { limit: 10 }
      });
      setTrendingSongs(response.data);
      setSongsLoading(false);
    } catch (error) {
      console.error('Error fetching trending songs:', error);
      setSongsLoading(false);
    }
  };

  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M+`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K+`;
    }
    return count.toString();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = (song) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${song.fileUrl}`;
    link.download = `${song.title} - ${song.artist?.name || 'Unknown'}.${song.format || 'mp3'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddToFavorites = async (songId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add songs to favorites');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/songs/${songId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Song added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites');
    }
  };

  const handleListen = (song) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to listen to songs');
      return;
    }

    // Open a simple audio player or navigate to a player page
    const audioUrl = `http://localhost:5000/api/songs/stream/${song._id}`;
    window.open(audioUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            {t('Welcome to M-Tunes')}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('Discover, stream, and enjoy millions of songs from your favorite artists.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Unlimited Music
            </h3>
            <p className="text-gray-600 text-center">
              Stream millions of songs from artists around the world.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Custom Playlists
            </h3>
            <p className="text-gray-600 text-center">
              Create and share your own playlists with friends.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Personalized
            </h3>
            <p className="text-gray-600 text-center">
              Get recommendations based on your listening history.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/profile" className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full text-lg hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg inline-block">
            Start Listening Now
          </Link>
        </div>

        {/* Trending Songs Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-900">🔥 Trending Songs</h2>
            <Link to="/browse" className="text-blue-900 font-semibold hover:text-blue-700">
              View All →
            </Link>
          </div>
          {songsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
              <p className="mt-4 text-gray-600">Loading songs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {trendingSongs.map((song, index) => (
                <div key={song._id || index} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 overflow-hidden">
                  {/* Cover Image */}
                  {song.coverImage ? (
                    <div className="w-full aspect-square overflow-hidden">
                      <img
                        src={`http://localhost:5000${song.coverImage}`}
                        alt={song.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                    {song.features && (song.features.tempo || song.features.mood) && (
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
          )}
          {!songsLoading && trendingSongs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              <p className="text-gray-500 text-lg">No songs available yet</p>
            </div>
          )}
        </div>

        {/* Popular Artists Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-900">⭐ Popular Artists</h2>
            <Link to="/profile" className="text-blue-900 font-semibold hover:text-blue-700">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
              <p className="mt-4 text-gray-600">Loading artists...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {popularArtists.map((artist, index) => (
                <div key={artist._id || index} className="text-center">
                  {artist.image ? (
                    <div className="w-full aspect-square rounded-full mb-3 cursor-pointer hover:scale-105 transition-transform shadow-lg overflow-hidden">
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
                  <p className="text-sm text-gray-600">{artist.genres && artist.genres.length > 0 ? artist.genres[0] : 'Artist'}</p>
                  <p className="text-xs text-blue-600 font-medium">{formatFollowers(artist.followers || 0)} followers</p>
                </div>
              ))}
            </div>
          )}
          {!loading && popularArtists.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-500 text-lg">No artists found</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-24 mb-12 bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl shadow-lg p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Musical Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of music lovers and discover your next favorite song today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Sign Up Free
            </Link>
            <Link to="/browse" className="px-8 py-4 bg-blue-800 text-white font-semibold rounded-full text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg border-2 border-white">
              Browse Music
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

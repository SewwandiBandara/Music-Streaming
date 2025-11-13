import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  const trendingSongs = [
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
  ];

  const popularArtists = [
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            {t('home.welcome')}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('home.subtitle')}
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
              {t('home.features.unlimited.title')}
            </h3>
            <p className="text-gray-600 text-center">
              {t('home.features.unlimited.description')}
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
              {t('home.features.playlists.title')}
            </h3>
            <p className="text-gray-600 text-center">
              {t('home.features.playlists.description')}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              {t('home.features.personalized.title')}
            </h3>
            <p className="text-gray-600 text-center">
              {t('home.features.personalized.description')}
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/profile" className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full text-lg hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg inline-block">
            {t('home.cta.button')}
          </Link>
        </div>

        {/* Trending Songs Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-900">🔥 {t('home.trending.title')}</h2>
            <Link to="/browse" className="text-blue-900 font-semibold hover:text-blue-700">
              {t('home.trending.viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {trendingSongs.map((song, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-200 border border-gray-200">
                <div className="w-full aspect-square bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{song.title}</h3>
                <p className="text-sm text-gray-600 truncate">{song.artist}</p>
                <p className="text-xs text-gray-500 truncate">{song.album}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Artists Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-900">⭐ {t('home.popular.title')}</h2>
            <Link to="/browse" className="text-blue-900 font-semibold hover:text-blue-700">
              {t('home.popular.viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {popularArtists.map((artist, index) => (
              <div key={index} className="text-center">
                <div className="w-full aspect-square bg-gradient-to-br from-blue-600 to-blue-900 rounded-full mb-3 cursor-pointer hover:scale-105 transition-transform shadow-lg"></div>
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{artist.name}</h3>
                <p className="text-sm text-gray-600">{artist.genre}</p>
                <p className="text-xs text-blue-600 font-medium">{artist.followers} {t('home.popular.followers')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 mb-12 bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl shadow-lg p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">{t('home.cta.title')}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
              {t('home.cta.signupFree')}
            </Link>
            <Link to="/browse" className="px-8 py-4 bg-blue-800 text-white font-semibold rounded-full text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg border-2 border-white">
              {t('home.cta.browseMusic')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

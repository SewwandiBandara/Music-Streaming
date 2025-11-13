<<<<<<< HEAD
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Welcome to M-Tunes
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover, stream, and enjoy millions of songs from your favorite artists.
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
          <button className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full text-lg hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Start Listening Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
=======
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Welcome to MusicStream
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover, stream, and enjoy millions of songs from your favorite artists.
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
          <button className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full text-lg hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Start Listening Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
>>>>>>> 1fa64eae3c02cc8e196e89c3344d26ef4f03b12f

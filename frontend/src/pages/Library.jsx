const Library = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Your Library</h1>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-center flex-col py-16">
            <svg className="w-24 h-24 text-blue-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your library is empty</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Start adding songs, albums, and playlists to build your personal collection.
            </p>
            <button className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Browse Music
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Liked Songs</h3>
            <p className="text-3xl font-bold text-blue-900">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Playlists</h3>
            <p className="text-3xl font-bold text-blue-800">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Albums</h3>
            <p className="text-3xl font-bold text-blue-700">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;

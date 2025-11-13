const Browse = () => {
  const genres = [
    { name: 'Pop', color: 'bg-blue-600', icon: '🎤' },
    { name: 'Rock', color: 'bg-gray-800', icon: '🎸' },
    { name: 'Hip Hop', color: 'bg-blue-800', icon: '🎧' },
    { name: 'Electronic', color: 'bg-blue-700', icon: '🎹' },
    { name: 'Jazz', color: 'bg-blue-900', icon: '🎺' },
    { name: 'Classical', color: 'bg-gray-700', icon: '🎻' },
    { name: 'Country', color: 'bg-blue-500', icon: '🤠' },
    { name: 'R&B', color: 'bg-gray-900', icon: '🎵' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Browse by Genre</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {genres.map((genre) => (
            <button
              key={genre.name}
              className={`${genre.color} rounded-xl p-8 text-white font-semibold text-xl hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg relative overflow-hidden group`}
            >
              <div className="relative z-10">
                <div className="text-4xl mb-2">{genre.icon}</div>
                <div>{genre.name}</div>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            </button>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Popular Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200 border border-gray-200">
                <div className="w-full aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4"></div>
                <h3 className="font-semibold text-gray-900 mb-1">Song Title {i}</h3>
                <p className="text-sm text-gray-600">Artist Name</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;

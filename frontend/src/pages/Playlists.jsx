import { useTranslation } from 'react-i18next';

const Playlists = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">{t('Playlists')}</h1>
          {/* <button className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
            {t('playlists.createPlaylist')}
          </button> */}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-center flex-col py-16">
            <svg className="w-24 h-24 text-blue-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('No playlists yet')}</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              {t('Create your first playlist and start organizing your favorite music.')}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">{t('Recommended Playlists')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Chill Vibes', color: 'from-blue-800 to-blue-900' },
              { name: 'Workout Mix', color: 'from-blue-800 to-blue-900' },
              { name: 'Study Focus', color: 'from-gray-800 to-gray-900' },
              { name: 'Party Hits', color: 'from-blue-800 to-cyan-800' },
            ].map((playlist, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200 cursor-pointer border border-gray-200">
                <div className={`w-full aspect-square bg-gradient-to-br ${playlist.color} rounded-lg mb-4 flex items-center justify-center`}>
                  <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{playlist.name}</h3>
                <p className="text-sm text-gray-600">50 {t('songs')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlists;

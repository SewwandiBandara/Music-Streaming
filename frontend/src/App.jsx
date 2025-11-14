import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Library from './pages/Library';
import Playlists from './pages/Playlists';
import NotFound from './pages/NotFound';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePlaySong = (song, songList = []) => {
    setCurrentSong(song);
    if (songList.length > 0) {
      setPlaylist(songList);
      const index = songList.findIndex(s => s._id === song._id);
      setCurrentIndex(index !== -1 ? index : 0);
    }
  };

  const handleNext = () => {
    if (playlist.length > 0 && currentIndex < playlist.length - 1) {
      const nextSong = playlist[currentIndex + 1];
      setCurrentSong(nextSong);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (playlist.length > 0 && currentIndex > 0) {
      const prevSong = playlist[currentIndex - 1];
      setCurrentSong(prevSong);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Regular App Routes */}
            <Route path="/*" element={
              <div className="min-h-screen bg-gray-50 pb-24">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home onPlaySong={handlePlaySong} />} />
                  <Route path="/browse" element={<Browse onPlaySong={handlePlaySong} />} />
                  <Route path="/library" element={<Library onPlaySong={handlePlaySong} />} />
                  <Route path="/playlists" element={<Playlists onPlaySong={handlePlaySong} />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <AudioPlayer
                  currentSong={currentSong}
                  playlist={playlist}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </div>
            } />
          </Routes>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;

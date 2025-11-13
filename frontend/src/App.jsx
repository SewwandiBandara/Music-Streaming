import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Library from './pages/Library';
import Playlists from './pages/Playlists';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/library" element={<Library />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

<<<<<<< HEAD
import { BrowserRouter,Routes,Route} from "react-router-dom";
// navbar imports
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import Library from "./pages/Library";
import Playlists from "./pages/Playlists";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";



function App() {
  
  return (
    <BrowserRouter>
    <Routes>
       <Route element={<Home/>} path="/" />
       <Route element={<NotFound/>} path="*" />
       <Route element={<Library/>} path="/library" />
       <Route element={<Playlists/>} path="/playlists" />
       <Route element={<Signup/>} path="/signup" />
       <Route element={<Signin/>} path="/signin" />
               
    </Routes>
    </BrowserRouter>
  )
}

export default App
=======
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
>>>>>>> 1fa64eae3c02cc8e196e89c3344d26ef4f03b12f

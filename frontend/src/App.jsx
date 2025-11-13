import { BrowserRouter,Routes,Route} from "react-router-dom";
import './i18n'; // Initialize i18n
// navbar imports
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Library from "./pages/Library";
import Playlists from "./pages/Playlists";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";



function App() {

  return (
    <BrowserRouter>
    <Routes>
       <Route element={<Home/>} path="/" />
       <Route element={<Browse/>} path="/browse" />
       <Route element={<Library/>} path="/library" />
       <Route element={<Playlists/>} path="/playlists" />
       <Route element={<Profile/>} path="/profile" />
       <Route element={<Signup/>} path="/signup" />
       <Route element={<Signin/>} path="/signin" />
       <Route element={<NotFound/>} path="*" />

    </Routes>
    </BrowserRouter>
  )
}

export default App

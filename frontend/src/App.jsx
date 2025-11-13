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

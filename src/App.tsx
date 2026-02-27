import {Routes,Route} from 'react-router-dom';
import Home  from './pages/Home';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
export default function App() {

  return (
    <div>
      <NavBar />
      <Routes>
      <Route path = '/' element = {<Home/>} />
      <Route path="/login" element={<GuestRoute><Login/></GuestRoute> } />
      <Route path = '/signup' element={<GuestRoute><Signup /></GuestRoute>}/>
      <Route path = '/createPost' element={<ProtectedRoute>
            <CreatePost />
        </ProtectedRoute>}/>
     </Routes>
    </div>
     
  );
}
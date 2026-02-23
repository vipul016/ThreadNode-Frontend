import {Routes,Route} from 'react-router-dom';
import Home  from './pages/Home';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Signup from './pages/Signup';
export default function App() {

  return (
    <div>
      <NavBar />
      <Routes>
      <Route path = '/' element = {<Home/>} />
      <Route path="/login" element={<Login/> } />
      <Route path = '/signup' element={<Signup />}/>
     </Routes>
    </div>
     
  );
}
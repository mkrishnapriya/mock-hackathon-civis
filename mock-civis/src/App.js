import logo from './logo.svg';
import './App.css';
import Login from './components/login/login.js';
import Signup from './components/signup/signup.js';
import { NavLink,Routes,Route,Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Hello</h1>

      <a className="btn btn-primary" href="/login" >Login</a>

      <a className="btn btn-secondary" href="/signup" >Signup</a>

      <Routes>
        <Route path="login" element={<Login />}></Route>

        <Route path="signup" element={<Signup />}></Route>
      </Routes>
      
    </div>
  );
}

export default App;

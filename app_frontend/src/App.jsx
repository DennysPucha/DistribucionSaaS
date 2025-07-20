import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Licencias from './pages/licencias/licencias';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/licencias" element={<Licencias />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
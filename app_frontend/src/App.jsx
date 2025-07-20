import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Licencias from './pages/licencias/licencias';
import Sidebar from './pages/sidebar/sidebar';
import AdminPanel from './pages/administracion/adminPanel';

function App() {
  return (
    <Router>
      <div className='app-container'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/licencias"
            element={
              <div className="main-layout">
                <Sidebar />
                <div className="page-content">
                  <Licencias />
                </div>
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              <div className="main-layout">
                <Sidebar />
                <div className="page-content">
                  <AdminPanel />
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
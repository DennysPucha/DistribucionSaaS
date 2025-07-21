import { useRef, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Licencias from './pages/licencias/licencias';
import Sidebar from './pages/sidebar/sidebar';
import AdminPanel from './pages/administracion/adminPanel';
import Topbar from './pages/topBar/topbar';

function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const toggleButtonRef = useRef(null);

  return (
    <Router>
      <div className="app-container">
        <Topbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)} 
          toggleButtonRef={toggleButtonRef}  
        />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/licencias"
            element={
              <div className="main-layout">
                <Sidebar abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <Licencias />
                </div>
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              <div className="main-layout">
                <Sidebar abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
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

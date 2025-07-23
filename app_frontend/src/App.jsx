import { useRef, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Licencias from './pages/licencias/licencias';
import AdminPanel from './pages/administracion/adminPanel';
import Topbar from './pages/topBar/topbar';
import AdminLicencias from './pages/administracion/adminLicencias/adminLicencias';
import MisLicencias from './pages/licencias/misLicencias/misLicencias';
import PerfilUsuario from './pages/licencias/perfilUsuario/perfilUsuario';
import SpecialTopbar from './pages/topBar/especialTopBar/specialTopbar';
import SidebarAdmin from './pages/sidebar/SidebarAdmin/SidebarAdmin';
import SidebarUsuario from './pages/sidebar/SidebarUser/SidebarUser';
function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const toggleButtonRef = useRef(null);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/licencias"
            element={
              <div className="main-layout">
                <Topbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarUsuario abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <Licencias />
                </div>

              </div>
            }
          />
          <Route
            path="/User/mis-licencias"
            element={
              <div className="main-layout">
                <Topbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarUsuario abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <MisLicencias />
                </div>
              </div>
            }
          />
          <Route
            path="/User/perfil-usuario"
            element={
              <div className="main-layout">
                <SpecialTopbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarUsuario abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <PerfilUsuario />
                </div>
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              <div className="main-layout">
                <Topbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarAdmin abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <AdminPanel />
                </div>
              </div>
            }
          />
          <Route
            path="/admin/licencias-emitidas"
            element={
              <div className="main-layout">
                <Topbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarAdmin abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <AdminLicencias />
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

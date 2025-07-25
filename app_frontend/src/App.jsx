import { useRef, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Licencias from './pages/licencias/licencias';
import AdminPanel from './pages/administracion/adminPanel';
import NotFound from './pages/componentes/404';
import Topbar from './pages/topBar/topbar';
import AdminLicencias from './pages/administracion/adminLicencias/adminLicencias';
import MisLicencias from './pages/licencias/misLicencias/misLicencias';
import PerfilUsuario from './pages/licencias/perfilUsuario/perfilUsuario';
import SpecialTopbar from './pages/topBar/especialTopBar/specialTopbar';
import SidebarAdmin from './pages/sidebar/SidebarAdmin/SidebarAdmin';
import SidebarUsuario from './pages/sidebar/SidebarUser/SidebarUser';
import ProtectedRoute from './pages/componentes/proteccionRutas/rutaprotejida';
import RedirectByRole from './pages/componentes/proteccionRutas/redirectByRol';
function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const toggleButtonRef = useRef(null);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<RedirectByRole/>} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/licencias"
            element={
              <ProtectedRoute allowedRoles={[2]}>
              <div className="main-layout">
                <Topbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarUsuario abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <Licencias />
                </div>

              </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/User/mis-licencias"
            element={
              <ProtectedRoute allowedRoles={[2]}>
              <div className="main-layout">
                <Topbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarUsuario abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <MisLicencias />
                </div>
              </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/User/perfil-usuario"
            element={
              <ProtectedRoute allowedRoles={[2]}>
              <div className="main-layout">
                <SpecialTopbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarUsuario abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <PerfilUsuario />
                </div>
              </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[1]}>
              <div className="main-layout">
                <Topbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarAdmin abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <AdminPanel />
                </div>
              </div>
              </ProtectedRoute>
            }
            
          />
          <Route
            path="/admin/licencias-emitidas"
            element={
              <ProtectedRoute allowedRoles={[1]}>
              <div className="main-layout">
                <Topbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                  toggleButtonRef={toggleButtonRef}
                />
                <SidebarAdmin abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />
                <div className="page-content" style={{ paddingTop: '60px' }}>
                  <AdminLicencias />
                </div>
              </div>
              </ProtectedRoute>
            }

          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

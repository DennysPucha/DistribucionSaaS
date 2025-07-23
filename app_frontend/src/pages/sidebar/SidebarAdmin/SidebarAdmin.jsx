import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarAdmin.css';

function SidebarAdmin({ abierto, setAbierto }) {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const cerrarSidebar = useCallback(() => {
    setAbierto(false);
  }, [setAbierto]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isToggleButton = event.target.closest('.topbar-toggle');
      if (abierto && sidebarRef.current && !sidebarRef.current.contains(event.target) && !isToggleButton) {
        cerrarSidebar();
      }
    };

    if (abierto) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true);
      }, 150);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside, true);
      };
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [abierto, cerrarSidebar]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && abierto) {
        cerrarSidebar();
      }
    };
    if (abierto) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [abierto, cerrarSidebar]);

  return (
    <>
      {abierto && <div className="sidebar-overlay" onClick={cerrarSidebar}></div>}
      <div ref={sidebarRef} className={`sidebar ${abierto ? 'sidebar-abierto' : ''}`}>
        <button className="close-button" onClick={cerrarSidebar}>✕</button>

        <div className="app-title">Admin Licencias</div>

        <div className="profile-section">
          <img className="profile-image" src="https://static.vecteezy.com/system/resources/thumbnails/029/621/646/small_2x/hacker-with-laptop-hacking-computer-system-isolated-on-transparent-background-png.png" alt="Admin" />
          <div className="wallet-address">0xADMIN123...ABC</div>
        </div>

        <div className="sidebar-buttons">
          <button className="sidebar-button" onClick={() => navigate('/admin')}>Mis Licencias</button>
          <button className="sidebar-button" onClick={() => navigate('/admin/licencias-emitidas')}>Licencias Emitidas</button>
          {/* <button className="sidebar-button" onClick={() => navigate('/admin/configuracion')}>Configuración</button> */}
          <button className="sidebar-button logout" onClick={() => navigate('/logout')}>Cerrar sesión</button>
        </div>
      </div>
    </>
  );
}

export default SidebarAdmin;

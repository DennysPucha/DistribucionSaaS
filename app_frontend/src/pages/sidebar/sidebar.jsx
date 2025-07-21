import { useEffect, useRef, useCallback } from 'react';
import './sidebar.css';

function Sidebar({ abierto, setAbierto }) {
  const sidebarRef = useRef(null);

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

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [abierto, cerrarSidebar]);

  return (
    <>
      {abierto && <div className="sidebar-overlay" onClick={cerrarSidebar}></div>}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar ${abierto ? 'sidebar-abierto' : ''}`}
      >
        <button className="close-button" onClick={cerrarSidebar}>
          ✕
        </button>

        <div className="app-title">Distribución de licencias SaaS</div>

        <div className="profile-section">
          <img
            className="profile-image"
            src="https://static.vecteezy.com/system/resources/thumbnails/029/621/646/small_2x/hacker-with-laptop-hacking-computer-system-isolated-on-transparent-background-png.png"
            alt="Foto de perfil"
          />
          <div className="wallet-address">0xA1b2...9F3C</div>
        </div>

        <div className="sidebar-buttons">
          <button className="sidebar-button">Configuración</button>
          <button className="sidebar-button logout">Cerrar sesión</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
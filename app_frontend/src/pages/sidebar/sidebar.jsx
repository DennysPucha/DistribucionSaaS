import { useState, useEffect, useRef } from 'react';
import './sidebar.css';

function Sidebar() {
  const [abierto, setAbierto] = useState(false);
  const sidebarRef = useRef(null);

  // Función para cerrar el sidebar
  const cerrarSidebar = () => {
    setAbierto(false);
  };

  // Función para abrir el sidebar
  const abrirSidebar = () => {
    setAbierto(true);
  };

  // Efecto para detectar clicks fuera del sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el sidebar está abierto y el click no es dentro del sidebar
      if (abierto && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        cerrarSidebar();
      }
    };

    // Agregar el event listener solo si el sidebar está abierto
    if (abierto) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup del event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [abierto]);

  // Efecto para manejar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && abierto) {
        cerrarSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [abierto]);

  return (
    <>
      {/* Solo mostrar el botón toggle cuando el sidebar está cerrado */}
      {!abierto && (
        <button className="toggle-button" onClick={abrirSidebar}>
          ☰
        </button>
      )}

      {/* Overlay oscuro cuando el sidebar está abierto */}
      {abierto && <div className="sidebar-overlay" onClick={cerrarSidebar}></div>}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`sidebar ${abierto ? 'sidebar-abierto' : ''}`}
      >
        {/* Botón de cerrar dentro del sidebar */}
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
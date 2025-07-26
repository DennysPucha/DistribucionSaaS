import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarAdmin.css';
import AlertaOscura from '../../componentes/alertas/alertaOscura';
import { clearSession, getDataFromSession } from '../../../utils/methods/session';

function SidebarAdmin({ abierto, setAbierto }) {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: 'error' });
  
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const data = await getDataFromSession();
        if (data) {
          setSessionData(data);
          console.log("Datos de sesión obtenidos:", data);
        } else {
          mostrarAlerta("No se pudo obtener la información de la sesión");
        }
      } catch (error) {
        console.error("Error al obtener los datos de la sesión:", error);
        mostrarAlerta("Error al obtener los datos de la sesión");
      }
    };
    fetchSessionData();
  }, []);

    const mostrarAlerta = (mensaje) => {
      setAlerta({ visible: true, mensaje, tipo: 'error' });
    };
  
    const cerrarAlerta = () => {
      setAlerta({ ...alerta, visible: false });
    };
  
    const cerrarSesion = useCallback(() => {
      clearSession();
      mostrarAlerta("Sesión cerrada correctamente");
      setTimeout(() => {
      navigate('/login');
      },1000);
    }, [navigate]);

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
          <div className="wallet-address">{sessionData.direccion_wallet}</div>
        </div>

        <div className="sidebar-buttons">
          <button className="sidebar-button" onClick={() => navigate('/admin')}>Mis Licencias</button>
          <button className="sidebar-button" onClick={() => navigate('/admin/licencias-emitidas')}>Licencias Emitidas</button>
          <button className="sidebar-button logout" onClick={() => cerrarSesion()}>Cerrar sesión</button>
        </div>
        <AlertaOscura
          visible={alerta.visible}
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
          onClose={cerrarAlerta}
          duracion={3000}
        />
      </div>
    </>
  );
}

export default SidebarAdmin;

import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarUser.css';
import { clearSession } from '../../../utils/methods/session';
import AlertaOscura from '../../componentes/alertas/alertaOscura';
import { getDataFromSession } from '../../../utils/methods/session';

function SidebarUsuario({ abierto, setAbierto }) {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: 'error' });
  const [dataSession, setDataSession] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataFromSession();
        if (data) {
          setDataSession(data);
        } else {
          console.error("No se pudo obtener la información de la sesión");
        }
      } catch (error) {
        console.error("Error al obtener los datos de la sesión:", error);
      }
    };
    fetchData();
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
        <AlertaOscura
          visible={alerta.visible}
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
          onClose={cerrarAlerta}
          duracion={3000}
        />

        <div className="app-title">Mi Cuenta</div>

        <div className="profile-section">
          <img className="profile-image" src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" alt="Usuario" />
          <div className="wallet-address">{dataSession.direccion_wallet.slice(0,6)}...{dataSession.direccion_wallet.slice(-4)}</div>
        </div>

        <div className="sidebar-buttons">
          <button className="sidebar-button" onClick={() => navigate('/licencias')}>Catalogo de Licencias</button>
          <button className="sidebar-button" onClick={() => navigate('/User/mis-licencias')}>Mis licencias</button>
          <button className="sidebar-button" onClick={() => navigate('/User/perfil-usuario')}>Perfil</button>
          <button className="sidebar-button logout" onClick={() => cerrarSesion()}>Cerrar sesión</button>
        </div>


      </div>
    </>
  );
}

export default SidebarUsuario;

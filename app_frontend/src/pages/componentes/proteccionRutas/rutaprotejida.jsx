// src/utils/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDataFromSession, isAuthenticated } from "../../../utils/methods/session.js";
import AlertaOscura from "../../componentes/alertas/alertaOscura.jsx";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children }) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(null);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: 'error' });

  const mostrarAlerta = (mensaje) => {
    setAlerta({ visible: true, mensaje, tipo: 'error' });
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, visible: false });
  };

  useEffect(() => {
    const checkAccess = async () => {
      const auth = await isAuthenticated();
      if (!auth) {
        mostrarAlerta("No has iniciado sesión");
        setAuthorized(false);
        return;
      }

      const sessionData = await getDataFromSession();
      if (!sessionData || !sessionData.rol_id) {
        mostrarAlerta("Sesión inválida");
        setAuthorized(false);
        return;
      }

      const { rol_id } = sessionData;
      if (!allowedRoles.includes(rol_id)) {
        mostrarAlerta("No tienes permiso para acceder a esta sección");
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
    };

    checkAccess();
  }, [allowedRoles]);

  if (authorized === null) return <div>Cargando...</div>;

  return (
    <>
      <AlertaOscura
        visible={alerta.visible}
        mensaje={alerta.mensaje}
        tipo={alerta.tipo}
        onClose={cerrarAlerta}
        duracion={3000}
      />
      {
        authorized
          ? children
          : <div>
            <div className="login-container">
              <div className="login-box">
                <h1 className="login-title">Acceso Denegado</h1>
                <p className="login-subtitle">No tienes permiso para acceder a esta sección.</p>
                <button
                  className="metamask-button"
                  style={{ justifyContent: 'center' }}
                  onClick={() => navigate('/')}
                >
                  <span>Volver</span>
                </button>
              </div>
            </div>
          </div>
      }
    </>
  );
}

export default ProtectedRoute;

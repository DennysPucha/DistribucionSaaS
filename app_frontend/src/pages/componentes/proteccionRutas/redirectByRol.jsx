import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDataFromSession, isAuthenticated } from "../../../utils/methods/session";
import AlertaOscura from "../alertas/alertaOscura";

const RedirectByRole = () => {
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: 'info' });
  const navigate = useNavigate();

  const mostrarAlerta = (mensaje, tipo = 'info') => {
    setAlerta({ visible: true, mensaje, tipo });
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, visible: false });
  };

  useEffect(() => {
    const redirigir = async () => {
      const auth = await isAuthenticated();
      if (!auth) {
        navigate("/login");
        return;
      }

      const data = await getDataFromSession();
      if (!data || !data.rol_id) {
        mostrarAlerta("Token inválido");
        return;
      }

      console.log("Datos de sesión:", data);
      if (data.rol_id === 2) {
        navigate("/licencias");
      } else if (data.rol_id === 1) {
        navigate("/admin");
      } else {
        mostrarAlerta("Rol no autorizado");
      }
    };

    redirigir();
  }, [navigate]);

  return (
    <>
      <AlertaOscura
        visible={alerta.visible}
        mensaje={alerta.mensaje}
        tipo={alerta.tipo}
        onClose={cerrarAlerta}
      />
      <div style={{ padding: "2rem", color: "#fff" }}>Redirigiendo...</div>
    </>
  );
};

export default RedirectByRole;
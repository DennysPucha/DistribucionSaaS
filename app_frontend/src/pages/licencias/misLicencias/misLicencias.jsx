import React from "react";
import "./misLicencias.css";
import { useGetLicenciasbyCurrentUser } from "../../../hooks/licencias";
import AlertaOscura from "../../componentes/alertas/alertaOscura";

const MisLicencias = () => {
  const { licencias, isLoading } = useGetLicenciasbyCurrentUser();
  const [alerta, setAlerta] = React.useState({ visible: false, mensaje: "", tipo: "info" });

  const mostrarAlerta = (mensaje, tipo = "info") => {
    setAlerta({ visible: true, mensaje, tipo });
  };
  const cerrarAlerta = () => {
    setAlerta({ ...alerta, visible: false });
  };

  const copiarLicencia = (clave) => {
    navigator.clipboard.writeText(clave);
    mostrarAlerta("Clave de licencia copiada al portapapeles", "success");
  };

  const copiarHash = (hash) => {
    navigator.clipboard.writeText(hash);
    mostrarAlerta("Hash copiado al portapapeles", "success");
  };

  if (isLoading) {
    return <div className="loading">Cargando licencias...</div>;
  }

  return (
    <div className="mis-licencias-container">
      <h2>Mis Licencias</h2>
      <div className="lista-licencias">
        <div className="encabezado">
          <span>Nombre SaaS</span>
          <span>Inicio</span>
          <span>Expira</span>
          <span>Estado</span>
          <span>Wallet Distribuidor</span>
          <span>Licencia</span>
        </div>
        {licencias.map((lic) => (
          <div className="fila" key={lic.id}>
            <span>{lic.nombre_saas}</span>
            <span>{lic.fecha_emision}</span>
            <span>{lic.fecha_expiracion}</span>
            <span>
              <span
                className={`badge ${lic.estadoLicencia === "Activa"
                    ? "badge-activo"
                    : lic.estadoLicencia === "Suspendida"
                      ? "badge-suspendido"
                      : lic.estadoLicencia === "Reclamada"
                        ? "badge-reclamada"
                        : "badge-expirado"
                  }`}
              >
                {lic.estadoLicencia}
              </span>
            </span>
            <span>{lic.wallet_administrador.slice(0, 8)}...{lic.wallet_administrador.slice(-4)}</span>
            <span className="licencia-copiable">
              <button
                className="copiar-btn"
                onClick={() => copiarLicencia(lic.clave_licencia)}
              >
                Copiar Licencia
              </button>
              <button
                className="copiar-btn"
                onClick={() => copiarHash(lic.hash)}
              >
                Copiar Hash
              </button>

            </span>
          </div>
        ))}
      </div>
      {alerta.visible && (
        <AlertaOscura
          visible={alerta.visible}
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
          duracion={3000}
          onClose={cerrarAlerta}
        />
      )}
    </div>
  );
};

export default MisLicencias;

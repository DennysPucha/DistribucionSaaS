import React, { useState } from "react";
import DarkButton from "../../componentes/botones/DarkButton";
import AlertaOscura from "../../componentes/alertas/alertaOscura";
import ConfirmacionOscura from "../../componentes/alertas/confirmacionOscura";
import { useGetLicenciasEmitidasbyCurrentUser, revocarLicencia, ampliarDuracionLicencia } from "../../../hooks/licencias";
import "./adminLicencias.css";

const AdminLicencias = () => {
  const { licenciasEmitidas: licencias, isLoading, refetch: fetchLicenciasEmitidas } = useGetLicenciasEmitidasbyCurrentUser();
  const [modalActivo, setModalActivo] = useState(false);
  const [diasExtra, setDiasExtra] = useState("");
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: "", tipo: "info" });
  const [confirmacion, setConfirmacion] = useState({ visible: false, mensaje: "", onConfirm: null });
  const mostrarConfirmacion = (mensaje, onConfirm) => {
    setConfirmacion({ visible: true, mensaje, onConfirm });
  };

  const cerrarConfirmacion = () => {
    setConfirmacion({ ...confirmacion, visible: false });
  };

  const mostrarAlerta = (mensaje, tipo = "info") => {
    setAlerta({ visible: true, mensaje, tipo });
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, visible: false });
  };

  const cambiarEstado = (id) => {
    mostrarConfirmacion("¿Estás seguro de que deseas cambiar el estado de esta licencia?", async () => {
      try {
        const response = await revocarLicencia(id);
        if (response.code === 200) {
          mostrarAlerta("Estado de licencia cambiado correctamente", "success");
          fetchLicenciasEmitidas();
        } else {
          mostrarAlerta("Error al cambiar el estado de la licencia: " + response.statusText, "error");
        }
      } catch (error) {
        console.error("Error al cambiar el estado de la licencia:", error);
        mostrarAlerta("Error al cambiar el estado de la licencia", "error");
      }
    });
  };

  const abrirModal = (licencia) => {
    setLicenciaSeleccionada(licencia);
    setModalActivo(true);
    setDiasExtra("");
  };

  const copiarHash = (hash) => {
    navigator.clipboard.writeText(hash);
    mostrarAlerta("Hash copiado al portapapeles", "success");
  };


  const guardarDuracion = () => {
    if (!diasExtra || isNaN(diasExtra) || parseInt(diasExtra) <= 0) {
      mostrarAlerta("Por favor, ingresa un número válido de días", "error");
      return;
    }
    mostrarConfirmacion("¿Estás seguro de que deseas ampliar la duración de esta licencia?", async () => {
      try {
        const response = await ampliarDuracionLicencia(licenciaSeleccionada.id, parseInt(diasExtra));
        if (response.code === 200) {
          mostrarAlerta("Duración de licencia ampliada correctamente", "success");
          setModalActivo(false);
          setLicenciaSeleccionada(null);
          setDiasExtra("");
          fetchLicenciasEmitidas();
        } else {
          mostrarAlerta("Error al ampliar la duración de la licencia: " + response.statusText, "error");
        }
      } catch (error) {
        console.error("Error al ampliar la duración de la licencia:", error);
        mostrarAlerta("Error al ampliar la duración de la licencia", "error");
      }
    });
  };

  if (isLoading) {
    return <div className="loading">Cargando licencias...</div>;
  }

  if (!Array.isArray(licencias)) {
    return <div>Error: licencias inválidas</div>;
  }

  return (
    <div className="admin-lic-container">
      <h2>Licencias Emitidas</h2>
      <div className="admin-lic-tabla">
        <div className="admin-lic-encabezado">
          <span>Nombre SaaS</span>
          <span>Wallet Usuario</span>
          <span>Inicio</span>
          <span>Expira</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        {licencias.map((licencia) => (
          <div className="admin-lic-fila" key={licencia.id}>
            <span>{licencia.nombre_saas}</span>
            <span>{licencia.wallet_usuario.slice(0, 8)}...{licencia.wallet_usuario.slice(-4)}</span>
            <span>{licencia.fecha_emision}</span>
            <span>{licencia.fecha_expiracion}</span>
            <span>
              <span
                className={`admin-lic-badge ${licencia.estadoLicencia === "Activa"
                    ? "admin-lic-badge-activo"
                    : licencia.estadoLicencia === "Suspendida"
                      ? "admin-lic-badge-suspendido"
                      : licencia.estadoLicencia === "Reclamada"
                        ? "admin-lic-badge-reclamada"
                        : "admin-lic-badge-expirado"
                  }`}
              >
                {licencia.estadoLicencia}
              </span>
            </span>
            <span className="admin-lic-acciones">
              <DarkButton
                variant="secondary"
                onClick={() => cambiarEstado(licencia.id)}
              >
                {licencia.estadoLicencia === "Activa" ? "Suspender" : "Reactivar"}
              </DarkButton>
              <DarkButton variant="primary" onClick={() => abrirModal(licencia)}>
                Ampliar duración
              </DarkButton>
              <DarkButton variant="secondary" onClick={() => copiarHash(licencia.hash)}>
                (Copiar Hash)
              </DarkButton>
            </span>
          </div>
        ))}
      </div>

      {modalActivo && licenciaSeleccionada && (
        <div className="admin-lic-modal-overlay">
          <div className="admin-lic-modal-contenido">
            <button className="admin-lic-cerrar-btn" onClick={() => setModalActivo(false)}>
              &times;
            </button>
            <h3>Ampliar duración</h3>
            <p>
              Añadir días a la licencia: <strong>{licenciaSeleccionada.nombre_saas}</strong>
            </p>
            <input
              type="number"
              placeholder="Días adicionales"
              value={diasExtra}
              onChange={(e) => setDiasExtra(e.target.value)}
            />
            <DarkButton variant="primary" onClick={guardarDuracion}>
              Guardar
            </DarkButton>
          </div>
        </div>
      )}

      {alerta.visible && (
        <AlertaOscura
          visible={alerta.visible}
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
          duracion={3000}
          onClose={cerrarAlerta}
        />
      )}
      {confirmacion.visible && (
        <ConfirmacionOscura
          visible={confirmacion.visible}
          mensaje={confirmacion.mensaje}
          onConfirm={() => {
            if (confirmacion.onConfirm) {
              confirmacion.onConfirm();
            }
            cerrarConfirmacion();
          }}
          onCancel={cerrarConfirmacion}
        />
      )}
    </div>
  );
};

export default AdminLicencias;

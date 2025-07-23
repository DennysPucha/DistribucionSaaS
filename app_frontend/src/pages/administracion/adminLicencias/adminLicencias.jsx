import React, { useState } from "react";
import DarkButton from "../../componentes/botones/DarkButton";
import "./adminLicencias.css";

const licenciasIniciales = [
  {
    id: 1,
    nombreLicencia: "Licencia Pro",
    usuario: "Carlos Rodríguez",
    wallet: "0xabc123...",
    fechaInicio: "2025-07-01",
    fechaExpiracion: "2025-08-01",
    estado: "Activo",
  },
  {
    id: 2,
    nombreLicencia: "Licencia Lite",
    usuario: "Lucía Mejía",
    wallet: "0xdef456...",
    fechaInicio: "2025-06-10",
    fechaExpiracion: "2025-07-10",
    estado: "Suspendido",
  },
];

const AdminLicencias = () => {
  const [licencias, setLicencias] = useState(licenciasIniciales);
  const [modalActivo, setModalActivo] = useState(false);
  const [diasExtra, setDiasExtra] = useState("");
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);

  const cambiarEstado = (id) => {
    setLicencias((prev) =>
      prev.map((lic) =>
        lic.id === id
          ? {
              ...lic,
              estado: lic.estado === "Activo" ? "Suspendido" : "Activo",
            }
          : lic
      )
    );
  };

  const abrirModal = (licencia) => {
    setLicenciaSeleccionada(licencia);
    setModalActivo(true);
    setDiasExtra("");
  };

  const guardarDuracion = () => {
    const dias = parseInt(diasExtra);
    if (!isNaN(dias)) {
      setLicencias((prev) =>
        prev.map((lic) =>
          lic.id === licenciaSeleccionada.id
            ? {
                ...lic,
                fechaExpiracion: calcularNuevaFecha(lic.fechaExpiracion, dias),
              }
            : lic
        )
      );
    }
    setModalActivo(false);
    setLicenciaSeleccionada(null);
  };

  const calcularNuevaFecha = (fecha, dias) => {
    const actual = new Date(fecha);
    actual.setDate(actual.getDate() + dias);
    return actual.toISOString().split("T")[0];
  };

  return (
    <div className="admin-lic-container">
      <h2>Licencias Activas Emitidas</h2>
      <div className="admin-lic-tabla">
        <div className="admin-lic-encabezado">
          <span>Nombre</span>
          <span>Usuario</span>
          <span>Wallet</span>
          <span>Inicio</span>
          <span>Expira</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        {licencias.map((licencia) => (
          <div className="admin-lic-fila" key={licencia.id}>
            <span>{licencia.nombreLicencia}</span>
            <span>{licencia.usuario}</span>
            <span>{licencia.wallet}</span>
            <span>{licencia.fechaInicio}</span>
            <span>{licencia.fechaExpiracion}</span>
            <span>
              <span
                className={`admin-lic-badge ${
                  licencia.estado === "Activo"
                    ? "admin-lic-badge-activo"
                    : licencia.estado === "Suspendido"
                    ? "admin-lic-badge-suspendido"
                    : "admin-lic-badge-expirado"
                }`}
              >
                {licencia.estado}
              </span>
            </span>
            <span className="admin-lic-acciones">
              <DarkButton
                variant="secondary"
                onClick={() => cambiarEstado(licencia.id)}
              >
                {licencia.estado === "Activo" ? "Suspender" : "Reactivar"}
              </DarkButton>
              <DarkButton variant="primary" onClick={() => abrirModal(licencia)}>
                Ampliar duración
              </DarkButton>
            </span>
          </div>
        ))}
      </div>

      {modalActivo && (
        <div className="admin-lic-modal-overlay">
          <div className="admin-lic-modal-contenido">
            <button className="admin-lic-cerrar-btn" onClick={() => setModalActivo(false)}>
              &times;
            </button>
            <h3>Ampliar duración</h3>
            <p>
              Añadir días a la licencia: <strong>{licenciaSeleccionada.nombreLicencia}</strong>
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
    </div>
  );
};

export default AdminLicencias;

import React, { useState } from "react";
import "./misLicencias.css";

const licenciasUsuario = [
  {
    id: 1,
    nombre: "Licencia Pro",
    fechaInicio: "2025-07-01",
    fechaExpiracion: "2025-08-01",
    estado: "Activo",
    wallet: "0xabc123..."
  },
  {
    id: 2,
    nombre: "Licencia Estudiante",
    fechaInicio: "2025-06-01",
    fechaExpiracion: "2025-07-01",
    estado: "Expirada",
    wallet: "0xabc123..."
  }
];

const MisLicencias = () => {
  const [licencias, setLicencias] = useState(licenciasUsuario);

  return (
    <div className="mis-licencias-container">
      <h2>Mis Licencias Activas</h2>
      <div className="lista-licencias">
        <div className="encabezado">
          <span>Nombre</span>
          <span>Inicio</span>
          <span>Expira</span>
          <span>Estado</span>
          <span>Wallet</span>
        </div>
        {licencias.map((lic) => (
          <div className="fila" key={lic.id}>
            <span>{lic.nombre}</span>
            <span>{lic.fechaInicio}</span>
            <span>{lic.fechaExpiracion}</span>
            <span>
              <span
                className={`badge ${
                  lic.estado === "Activo"
                    ? "badge-activo"
                    : lic.estado === "Suspendida"
                    ? "badge-suspendido"
                    : "badge-expirado"
                }`}
              >
                {lic.estado}
              </span>
            </span>
            <span className="wallet">{lic.wallet}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisLicencias;

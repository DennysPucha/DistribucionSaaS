import React, { useState } from 'react';
import './styles.css';

const licenciasData = [
  {
    id: 1,
    nombre: 'Licencia Pro',
    descripcion: 'Acceso completo a todas las funciones premium.',
    descripcionCompleta: 'Incluye actualizaciones, soporte prioritario y acceso anticipado a nuevas características.',
    imagen: 'https://via.placeholder.com/300x150?text=Licencia+Pro',
  },
  {
    id: 2,
    nombre: 'Licencia Básica',
    descripcion: 'Funciones esenciales para empezar.',
    descripcionCompleta: 'Ideal para pequeñas empresas o desarrolladores independientes.',
    imagen: 'https://via.placeholder.com/300x150?text=Licencia+Básica',
  },
  {
    id: 3,
    nombre: 'Licencia Empresarial',
    descripcion: 'Solución completa para empresas.',
    descripcionCompleta: 'Permite uso en múltiples entornos y usuarios, con soporte dedicado.',
    imagen: 'https://via.placeholder.com/300x150?text=Licencia+Empresarial',
  },
];

function Licencias() {
  const [modalActivo, setModalActivo] = useState(false);
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);

  const abrirModal = (licencia) => {
    setLicenciaSeleccionada(licencia);
    setModalActivo(true);
  };

  const cerrarModal = () => {
    setLicenciaSeleccionada(null);
    setModalActivo(false);
  };

  return (
    <div className="licencias-container">
      <h1 className="titulo">Licencias Disponibles</h1>
      <div className="tarjetas-grid">
        {licenciasData.map((licencia) => (
          <div
            key={licencia.id}
            className="tarjeta"
            onClick={() => abrirModal(licencia)}
          >
            <img src={licencia.imagen} alt={licencia.nombre} className="tarjeta-imagen" />
            <h2 className="tarjeta-nombre">{licencia.nombre}</h2>
            <p className="tarjeta-descripcion">{licencia.descripcion}</p>
          </div>
        ))}
      </div>

      {modalActivo && licenciaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            <img src={licenciaSeleccionada.imagen} alt={licenciaSeleccionada.nombre} className="modal-imagen" />
            <h2 className="modal-nombre">{licenciaSeleccionada.nombre}</h2>
            <p className="modal-descripcion">{licenciaSeleccionada.descripcionCompleta}</p>
            <button className="boton-comprar">Comprar licencia</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Licencias;
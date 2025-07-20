import React, { useState } from 'react';
import './licencias.css';

const licenciasData = [
  {
    id: 1,
    nombre: 'Licencia Pro',
    descripcion: 'Acceso completo a todas las funciones premium.',
    descripcionCompleta: 'Incluye actualizaciones, soporte prioritario y acceso anticipado a nuevas características.',
    imagen: 'https://support.workiva.com/hc/article_attachments/33726798600468',
  },
  {
    id: 2,
    nombre: 'Licencia Básica',
    descripcion: 'Funciones esenciales para empezar.',
    descripcionCompleta: 'Ideal para pequeñas empresas o desarrolladores independientes.',
    imagen: 'https://www.santandersmusic.com/media/magazine/spotify-2-1.jpg',
  },
  {
    id: 3,
    nombre: 'Licencia Empresarial',
    descripcion: 'Solución completa para empresas.',
    descripcionCompleta: 'Permite uso en múltiples entornos y usuarios, con soporte dedicado.',
    imagen: 'https://el-comarcal.es/wp-content/uploads/2025/03/netflix.jpg',
  },
  {
    id: 4,
    nombre: 'Licencia Estudiante',
    descripcion: 'Descuentos especiales para estudiantes.',
    descripcionCompleta: 'Acceso a todas las funciones con un precio reducido para estudiantes verificados.',
    imagen: 'https://www.santandersmusic.com/media/magazine/spotify-2-1.jpg',
  },
  {
    id: 5,
    nombre: 'Licencia Familiar',
    descripcion: 'Hasta 6 cuentas en un solo plan.',
    descripcionCompleta: 'Ideal para familias, incluye todas las funciones premium.',
    imagen: 'https://support.workiva.com/hc/article_attachments/33726798600468',
  },
  {
    id: 6,
    nombre: 'Licencia Anual',
    descripcion: 'Ahorra con el pago anual.',
    descripcionCompleta: 'Incluye todas las funciones premium y un descuento significativo al pagar por adelantado.',
    imagen: 'https://el-comarcal.es/wp-content/uploads/2025/03/netflix.jpg',
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
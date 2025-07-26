import React, { useEffect, useState } from 'react';
import './licencias.css';
import { useGetOfertaLicencias } from '../../hooks/ofertaLicencias';

function Licencias() {
  const [modalActivo, setModalActivo] = useState(false);
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const { licencias: licenciasData, isLoading } = useGetOfertaLicencias();

  useEffect(() => {
    if (licenciasData.length > 0) {
      setLicenciaSeleccionada(licenciasData[0]);
      setIndiceCarrusel(0);
    } else {
      setLicenciaSeleccionada(null);
      setIndiceCarrusel(0);
    }
  }, [licenciasData]);

  const abrirModal = (licencia) => {
    setLicenciaSeleccionada(licencia);
    setModalActivo(true);
  };

  const cerrarModal = () => {
    setLicenciaSeleccionada(null);
    setModalActivo(false);
  };

  const siguiente = () => {
    if (licenciasData.length > 0) {
      setIndiceCarrusel((prev) => (prev + 1) % licenciasData.length);
    }
  };

  const anterior = () => {
    if (licenciasData.length > 0) {
      setIndiceCarrusel((prev) =>
        prev === 0 ? licenciasData.length - 1 : prev - 1
      );
    }
  };

  const licenciaCarrusel = licenciasData[indiceCarrusel];

  return (
    <div className="licencias-container">
      <h1 className="titulo">Licencias Disponibles</h1>

      {isLoading ? (
        <p className="loading">Cargando licencias...</p>
      ) : licenciasData.length === 0 ? (
        <p className="no-licencias">No hay licencias disponibles.</p>
      ) : (
        <>
          {/* Carrusel */}
          <div className="carrusel-container">
            <button className="carrusel-btn carrusel-anterior" onClick={anterior}>❮</button>
            <div className="carrusel-item" onClick={() => abrirModal(licenciaCarrusel)}>
              <img src={licenciaCarrusel.img} alt={licenciaCarrusel.nombre_saas} className="carrusel-imagen" />
              <h2 className="carrusel-nombre">{licenciaCarrusel.nombre_saas}</h2>
              <p className="carrusel-descripcion">{licenciaCarrusel.descripcion}</p>
            </div>
            <button className="carrusel-btn carrusel-siguiente" onClick={siguiente}>❯</button>
          </div>

          {/* Grid de tarjetas */}
          <div className="tarjetas-grid">
            {licenciasData.map((licencia) => (
              <div
                key={licencia.id}
                className="tarjeta"
                onClick={() => abrirModal(licencia)}
              >
                <img src={licencia.img} alt={licencia.nombre_saas} className="tarjeta-imagen" />
                <h2 className="tarjeta-nombre">{licencia.nombre_saas}</h2>
                <p className="tarjeta-descripcion">{licencia.descripcion}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {modalActivo && licenciaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            <img src={licenciaSeleccionada.img} alt={licenciaSeleccionada.nombre_saas} className="modal-imagen" />
            <h2 className="modal-nombre">{licenciaSeleccionada.nombre_saas}</h2>
            <p className="modal-descripcion">{licenciaSeleccionada.descripcion}</p>
            <div className="modal-terminos">
              <h3 className="terminos-titulo">Términos de uso</h3>
              <div className="terminos-contenido">
                {licenciaSeleccionada.terminos}
              </div>
            </div>
            <button className="boton-comprar">Adquirir licencia</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Licencias;

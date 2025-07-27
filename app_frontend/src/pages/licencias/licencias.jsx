import React, { useEffect, useState } from 'react';
import './licencias.css';
import { useGetOfertaLicencias } from '../../hooks/ofertaLicencias';
import ConfirmacionOscura from '../componentes/alertas/confirmacionOscura';
import AlertaOscura from '../componentes/alertas/alertaOscura';
import { saveLicencia } from '../../hooks/licencias';
import { getDataFromSession } from '../../utils/methods/session';

function Licencias() {
  const [modalActivo, setModalActivo] = useState(false);
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const { licencias: licenciasData, isLoading } = useGetOfertaLicencias();
  const [confirmacion, setConfirmacion] = useState({ visible: false, mensaje: '', onConfirm: null });
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: 'info' });
  const mostrarAlerta = (mensaje, tipo = 'info') => {
    setAlerta({ visible: true, mensaje, tipo });
  };
  const cerrarAlerta = () => {
    setAlerta({ ...alerta, visible: false });
  };

  const mostrarConfirmacion = (mensaje, onConfirm) => {
    setConfirmacion({ visible: true, mensaje, onConfirm });
  }
  const cerrarConfirmacion = () => {
    setConfirmacion({ ...confirmacion, visible: false });
  };



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

  const confirmarAdquisicion = () => {
    if (!licenciaSeleccionada) return;

    mostrarConfirmacion(
      `¿Estás seguro de que deseas adquirir la licencia de ${licenciaSeleccionada.nombre_saas}?`,
      () => {
        saveLicenciaHandler(licenciaSeleccionada);
        cerrarModal();
      }
    );
  }

  const saveLicenciaHandler = async (licencia) => {
    try {
      const data_session = await getDataFromSession();

      const data = {
        oferta_licencia_id: licencia.id,
        usuario_id: data_session.sub,
      }

      const response = await saveLicencia(data);
      if (response.code === 201) {
        mostrarAlerta("Licencia adquirida correctamente", "success");
      } else {
        mostrarAlerta("Error al adquirir la licencia: ",  "error");
      }
    } catch (error) {
      console.error("Error al guardar la licencia:", error);
    }
  }

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
              <p><strong>Duración:</strong> {licenciaCarrusel.duracion_cantidad} {licenciaCarrusel.duracion_unidad}</p>
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
                <p><strong>Duración:</strong> {licencia.duracion_cantidad} {licencia.duracion_unidad}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirmación */}
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

      {/* Alerta */}
      <AlertaOscura
        visible={alerta.visible}
        mensaje={alerta.mensaje}
        tipo={alerta.tipo}
        onClose={cerrarAlerta}
        duracion={3000}
      />

      {/* Modal */}
      {modalActivo && licenciaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido2" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            <h1 className="modal-nombre">{licenciaSeleccionada.nombre_saas}</h1>
            <img
              src={licenciaSeleccionada.img}
              alt={licenciaSeleccionada.nombre_saas}
              className="modal-imagen"
            />


            <div className="modal-detalles">
              <div className="detalle-item">
                <p className="modal-descripcion">{licenciaSeleccionada.descripcion}</p>
              </div>
              <div className="detalle-item">
                <span >Duración: </span>
                <span className="detalle-valor">{licenciaSeleccionada.duracion_cantidad} {licenciaSeleccionada.duracion_unidad}</span>
              </div>
            </div>

            <div className="modal-terminos">
              <h3 className="terminos-titulo">Términos de uso</h3>
              <div className="terminos-contenido">
                {licenciaSeleccionada.terminos}
              </div>
            </div>

            <button className="boton-comprar" onClick={confirmarAdquisicion}>Adquirir licencia</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Licencias;

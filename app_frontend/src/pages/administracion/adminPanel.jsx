import React, { useEffect, useState } from 'react';
import LicenciaForm from '../componentes/licenciaForm';
import LicenciaCard from '../componentes/licenciaCard';
import Modal from '../componentes/modal';
import DarkButton from '../componentes/botones/DarkButton';
import './admin.css';
import { useGetOfertaLicenciasByUser, deleteOfertaLicencia } from '../../hooks/ofertaLicencias';
import { getDataFromSession } from '../../utils/methods/session';
import AlertaOscura from '../componentes/alertas/alertaOscura';
import ConfirmacionOscura from '../componentes/alertas/confirmacionOscura';
//data 
// nombre_saas: 'Netflix',
// terminos: 'Uso profesional',
// tipo: 'De un solo uso',
// img: 'https://el-comarcal.es/wp-content/uploads/2025/03/netflix.jpg',
// descripcion: 'Licencia para uso personal de Netflix.',


function AdminPanel() {
  const [data_session, setDataSession] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: 'info' });
  const mostrarAlerta = (mensaje, tipo = 'info') => {
    setAlerta({ visible: true, mensaje, tipo });
  };
  const cerrarAlerta = () => {
    setAlerta({ ...alerta, visible: false });
  };

  const [confirmacion, setConfirmacion] = useState({ visible: false, mensaje: '', onConfirm: null });

  const mostrarConfirmacion = (mensaje, onConfirm) => {
    setConfirmacion({ visible: true, mensaje, onConfirm });
  }
  const cerrarConfirmacion = () => {
    setConfirmacion({ ...confirmacion, visible: false });
  };

  const handleEliminar = async (licenciaId) => {
    try {
      mostrarConfirmacion("¿Estás seguro de que deseas eliminar esta licencia?", async () => {
        const response = await deleteOfertaLicencia(licenciaId);
        if (response.code === 200) {
          mostrarAlerta("Licencia eliminada correctamente", "success");
          refetch(); // Refrescar la lista de licencias
        } else {
          mostrarAlerta("Error al eliminar la licencia: " + response.statusText, "error");
        }
      });
    }
    catch (error) {
      console.error("Error al eliminar la licencia:", error);
      mostrarAlerta("Error al eliminar la licencia", "error");
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataFromSession();
        if (data) {
          setDataSession(data);
        } else {
          console.error("No se pudo obtener la información de la sesión");
        }
      } catch (error) {
        console.error("Error al obtener los datos de la sesión:", error);
      }
    };

    fetchData();
  }, []);


  const { licencias, refetch } = useGetOfertaLicenciasByUser(data_session?.sub);

  const [modalNewAbierto, setModalNewAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);

  if (!data_session?.sub) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="admin-panel">
      <header className='head'>
        <h1>Panel de Administración de Licencias</h1>
        <DarkButton className="crear-btn" onClick={() => setModalNewAbierto(true)}>
          + Nueva Licencia
        </DarkButton>
      </header>

      <div className="licencias-grid" key={licencias.length}>
        {licencias.map((licencia) => (
          <LicenciaCard
            key={licencia.id}
            licencia={licencia}
            onEditar={() => {
              setModalAbierto(true);
              setLicenciaSeleccionada(licencia);
              mostrarAlerta("Editando licencia: " + licencia.nombre_saas, "info");
            }}
            onEliminar={() => handleEliminar(licencia.id)}
          />
        ))}
      </div>

      <AlertaOscura
        visible={alerta.visible}
        mensaje={alerta.mensaje}
        tipo={alerta.tipo}
        onClose={cerrarAlerta}
      />

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

      {modalAbierto && (
        <Modal onClose={() => setModalAbierto(false)}>
          <LicenciaForm
            isNew={false}
            licencia={licenciaSeleccionada}
            onGuardar={() => {
              refetch();
              setModalAbierto(false);
              mostrarAlerta("Licencia actualizada correctamente", "success");
            }}
          />
        </Modal>
      )}

      {modalNewAbierto && (
        <Modal onClose={() => setModalNewAbierto(false)}>
          <LicenciaForm
            onGuardar={() => {
              refetch();
              setModalNewAbierto(false);
              mostrarAlerta("Licencia guardada correctamente", "success");
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default AdminPanel;

import React, { useState } from 'react';
import LicenciaForm from '../componentes/licenciaForm';
import LicenciaCard from '../componentes/licenciaCard';
import Modal from '../componentes/modal';
import './admin.css';

const initialLicencias = [
  {
    id: 1,
    nombre: 'Licencia Pro',
    descripcionCorta: 'Uso profesional',
    descripcionLarga: 'Licencia completa para uso profesional y empresarial.',
    imagen: 'https://www.santandersmusic.com/media/magazine/spotify-2-1.jpg',
    precio: 99.99,
    duracion: 365,
    disponible: true,
  },
];

function AdminPanel() {
  const [licencias, setLicencias] = useState(initialLicencias);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [edicion, setEdicion] = useState(null);

  const manejarGuardar = (licencia) => {
    if (licencia.id) {
      setLicencias((prev) =>
        prev.map((l) => (l.id === licencia.id ? licencia : l))
      );
    } else {
      licencia.id = Date.now();
      setLicencias((prev) => [...prev, licencia]);
    }
    setModalAbierto(false);
    setEdicion(null);
  };

  const manejarEliminar = (id) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar esta licencia?');
    if (confirmar) {
      setLicencias((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const manejarEditar = (licencia) => {
    setEdicion(licencia);
    setModalAbierto(true);
  };

  return (
    <div className="admin-panel">
      <header>
        <h1>Panel de Administración de Licencias</h1>
        <button className="crear-btn" onClick={() => setModalAbierto(true)}>
          + Nueva Licencia
        </button>
      </header>

      <div className="licencias-grid">
        {licencias.map((licencia) => (
          <LicenciaCard
            key={licencia.id}
            licencia={licencia}
            onEditar={() => manejarEditar(licencia)}
            onEliminar={() => manejarEliminar(licencia.id)}
          />
        ))}
      </div>

      {modalAbierto && (
        <Modal onClose={() => setModalAbierto(false)}>
          <LicenciaForm
            onGuardar={manejarGuardar}
            licencia={edicion}
          />
        </Modal>
      )}
    </div>
  );
}

export default AdminPanel;

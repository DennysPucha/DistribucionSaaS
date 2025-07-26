import React, { useState } from 'react';
import LicenciaForm from '../componentes/licenciaForm';
import LicenciaCard from '../componentes/licenciaCard';
import Modal from '../componentes/modal';
import DarkButton from '../componentes/botones/DarkButton';
import './admin.css';
import { useGetOfertaLicencias } from '../../hooks/ofertaLicencias';
import AlertaOscura from '../componentes/alertas/alertaOscura';
  //data 
  // nombre_saas: 'Netflix',
  // terminos: 'Uso profesional',
  // tipo: 'De un solo uso',
  // img: 'https://el-comarcal.es/wp-content/uploads/2025/03/netflix.jpg',
  // descripcion: 'Licencia para uso personal de Netflix.',


function AdminPanel() {

    const licencias = useGetOfertaLicencias().licencias;
    const [modalAbierto, setModalAbierto] = useState(false);

    return (
      <div className="admin-panel">
        <header className='head'>
          <h1>Panel de Administración de Licencias</h1>
          <DarkButton className="crear-btn" onClick={() => setModalAbierto(true)}>
            + Nueva Licencia
          </DarkButton>
        </header>

        <div className="licencias-grid">
          {licencias.map((licencia) => (
            <LicenciaCard
              key={licencia.id}
              licencia={licencia}
            />
          ))}
        </div>

        {modalAbierto && (
          <Modal onClose={() => setModalAbierto(false)}>
            <LicenciaForm
            />
          </Modal>
        )}
      </div>
    );
  }

export default AdminPanel;

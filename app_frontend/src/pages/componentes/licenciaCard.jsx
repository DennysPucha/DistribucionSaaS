import React from 'react';
import DarkButton from './botones/DarkButton';

  //data 
  // nombre_saas: 'Netflix',
  // terminos: 'Uso profesional',
  // tipo: 'De un solo uso',
  // img: 'https://el-comarcal.es/wp-content/uploads/2025/03/netflix.jpg',
  // descripcion: 'Licencia para uso personal de Netflix.',

function LicenciaCard({ licencia, onEditar, onEliminar }) {
  return (
    <div className="licencia-card">
      <img src={licencia.img} alt={licencia.nombre_saas} />
      <h3>{licencia.nombre_saas}</h3>
      <p><strong>Tipo:</strong> {licencia.tipo}</p>
      <p><strong>Descripción:</strong> {licencia.descripcion}</p>
      <div className="acciones">
        <DarkButton variant="secondary" onClick={onEditar}>Editar</DarkButton>
        <DarkButton variant="danger" onClick={onEliminar}>Eliminar</DarkButton>
      </div>
    </div>
  );
}

export default LicenciaCard;

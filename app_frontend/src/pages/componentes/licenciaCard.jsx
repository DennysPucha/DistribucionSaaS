import React from 'react';
import DarkButton from './botones/DarkButton';

function LicenciaCard({ licencia, onEditar, onEliminar }) {
  return (
    <div className="licencia-card">
      <img src={licencia.imagen} alt={licencia.nombre} />
      <h3>{licencia.nombre}</h3>
      <p>${licencia.precio}</p>
      <span className={licencia.disponible ? 'estado disponible' : 'estado no-disponible'}>
        {licencia.disponible ? 'Disponible' : 'No disponible'}
      </span>
      <div className="acciones">
        <DarkButton variant="secondary" onClick={onEditar}>Editar</DarkButton>
        <DarkButton variant="danger" onClick={onEliminar}>Eliminar</DarkButton>
      </div>
    </div>
  );
}

export default LicenciaCard;

import React from 'react';

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
        <button onClick={onEditar}>Editar</button>
        <button onClick={onEliminar}>Eliminar</button>
      </div>
    </div>
  );
}

export default LicenciaCard;

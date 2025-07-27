import React, { useState } from 'react';
import DarkButton from './botones/DarkButton';

function TextoColapsable({ label, texto, maxLength = 250}) {
  const [expandido, setExpandido] = useState(false);
  const esLargo = texto.length > maxLength;
  const mostrarTexto = expandido || !esLargo ? texto : texto.slice(0, maxLength) + '...';

  return (
    <div className="texto-colapsable">
      <p>
        <strong>{label}:</strong> {mostrarTexto}
        {esLargo && (
          <button className="ver-mas-btn" onClick={() => setExpandido(!expandido)}>
            {expandido ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </p>
    </div>
  );
}

function LicenciaCard({ licencia, onEditar, onEliminar }) {
  return (
    <div className="licencia-card">
      <img src={licencia.img} alt={licencia.nombre_saas} />
      <div className="licencia-contenido">
        <h3>{licencia.nombre_saas}</h3>
        <TextoColapsable label="Descripción" texto={licencia.descripcion} />
        <p><strong>Duración:</strong> {licencia.duracion_cantidad} {licencia.duracion_unidad}</p>
        <div className="acciones">
          <DarkButton variant="secondary" onClick={onEditar}>Editar</DarkButton>
          <DarkButton variant="danger" onClick={onEliminar}>Eliminar</DarkButton>
        </div>
      </div>
    </div>
  );
}

export default LicenciaCard;

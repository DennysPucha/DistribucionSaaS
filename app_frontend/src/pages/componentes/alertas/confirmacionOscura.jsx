import React from 'react';
import './confirmacionOscura.css';

const ConfirmacionOscura = ({
  visible,
  mensaje = '¿Estás seguro?',
  onConfirm,
  onCancel
}) => {
  if (!visible) return null;

  return (
    <div className="fondo-confirmacion">
      <div className="confirmacion-oscura">
        <p>{mensaje}</p>
        <div className="botones-confirmacion">
          <button className="btn-confirmar" onClick={onConfirm}>Aceptar</button>
          <button className="btn-cancelar" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionOscura;

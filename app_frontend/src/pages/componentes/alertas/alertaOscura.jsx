import React, { useEffect } from 'react';
import './alertaOscura.css';

const AlertaOscura = ({ tipo = 'info', mensaje, visible, onClose, duracion = 3000 }) => {
  useEffect(() => {
    if (visible && duracion > 0) {
      const timeout = setTimeout(() => {
        onClose();
      }, duracion);
      return () => clearTimeout(timeout);
    }
  }, [visible, duracion, onClose]);

  if (!visible) return null;

  return (
    <div className={`alerta-oscura alerta-${tipo}`}>
      <span>{mensaje}</span>
      <button className="cerrar-alerta" onClick={onClose}>✕</button>
    </div>
  );
};

export default AlertaOscura;

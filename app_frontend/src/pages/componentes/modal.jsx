import React from 'react';

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar-btn" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;

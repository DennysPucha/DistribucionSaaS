import React, { useState } from "react";
import "./perfilUsuario.css";
import DarkButton from "../../componentes/botones/DarkButton";

const PerfilUsuario = () => {
  const [nombre, setNombre] = useState("Carlos Rodríguez");
  const [correo, setCorreo] = useState("carlos@example.com");
  const [mensaje, setMensaje] = useState("");

  const guardarCambios = () => {
    // Aquí podrías hacer una petición a una API si fuera real
    setMensaje("Cambios guardados correctamente.");
    setTimeout(() => setMensaje(""), 3000); // Limpia mensaje después de 3 segundos
  };

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>
      <div className="formulario-perfil">
        <label>
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <label>
          Correo electrónico
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </label>
        <DarkButton variant="primary" onClick={guardarCambios}>
          Guardar cambios
        </DarkButton>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default PerfilUsuario;

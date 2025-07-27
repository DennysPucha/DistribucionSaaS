import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./perfilUsuario.css";
import DarkButton from "../../componentes/botones/DarkButton";
import { completarPerfilUsuario } from "../../../hooks/usuario";
import AlertaOscura from "../../componentes/alertas/alertaOscura";
import { useGetCurrentUser } from "../../../hooks/usuario";

const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es requerido"),
  correo: yup.string().email("El correo no es válido").required("El correo es requerido"),
});

const PerfilUsuario = () => {
  const { dataSession, refetch } = useGetCurrentUser();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (dataSession) {
      setValue("nombre", dataSession.nombre? dataSession.nombre : '');
      setValue("correo", dataSession.correo? dataSession.correo : '');
    }
  }, [dataSession, setValue]);

  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: 'info' });

  const mostrarAlerta = (mensaje, tipo = 'info') => {
    setAlerta({ visible: true, mensaje, tipo });
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, visible: false });
  };

  const onSubmit = async (data) => {
    try {
      console.log("Datos del formulario:", data);
      const response = await completarPerfilUsuario(data);
      if (response.code === 200) {
        mostrarAlerta("Perfil actualizado correctamente", "success");
        refetch();
      } else {
        mostrarAlerta("Error al actualizar el perfil: " + response.statusText, "error");
      }
    } catch (error) {
      console.error("Error al completar el perfil:", error);
      mostrarAlerta("Error al completar el perfil", "error");
    }
  };

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="formulario-perfil">
        <label>
          Nombre
          <input
            {...register("nombre")}
          />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </label>
        <label>
          Correo electrónico
          <input
            {...register("correo")}
          />
          {errors.correo && <p>{errors.correo.message}</p>}
        </label>
        <DarkButton variant="primary" type="submit">
          Guardar cambios
        </DarkButton>

        {alerta.visible && (
          <AlertaOscura
            visible={alerta.visible}
            mensaje={alerta.mensaje}
            tipo={alerta.tipo}
            onClose={cerrarAlerta}
          />
        )}
      </form>
    </div>
  );
};


export default PerfilUsuario;

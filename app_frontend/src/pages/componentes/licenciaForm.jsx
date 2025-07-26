import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { saveOfertaLicencia, updateOfertaLicencia } from '../../hooks/ofertaLicencias';
import { getDataFromSession } from '../../utils/methods/session';

const schema = yup.object().shape({
  nombre_saas: yup.string().required('El nombre del SaaS es requerido'),
  terminos: yup.string().required('Los términos son requeridos'),
  tipo: yup.string().required('El tipo es requerido'),
  img: yup.string().url('Debe ser una URL válida').required('La URL de la imagen es requerida'),
  descripcion: yup.string().required('La descripción es requerida'),
  usuario_id: yup.string().required(),
});

function LicenciaForm({ onGuardar = () =>{}, licencia, isNew = true }) {
  // Si data_previa es proporcionada, se usa para inicializar el formulario
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre_saas: licencia?.nombre_saas || '',
      terminos: licencia?.terminos || '',
      tipo: licencia?.tipo || '',
      img: licencia?.img || '',
      descripcion: licencia?.descripcion || '',
      usuario_id: '',
    }
  });

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const data = await getDataFromSession();
        if (data && data.sub) {
          setValue('usuario_id', data.sub);
        } else {
          console.error("No se pudo obtener la información de la sesión");
        }
      } catch (error) {
        console.error("Error al obtener los datos de la sesión:", error);
      }
    };
    fetchSessionData();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      if (isNew) {
        await saveOfertaLicencia(data);
      } else {
        await updateOfertaLicencia(licencia.id, data); 
      }
      onGuardar();
    } catch (error) {
      console.error("Error al guardar la licencia:", error);
    }
  };
  

  return (
    <form className="formulario" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register("nombre_saas")}
        placeholder="Nombre del SaaS"
      />
      {errors.nombre_saas && <p>{errors.nombre_saas.message}</p>}
      
      <input
        type="text"
        {...register("terminos")}
        placeholder="Términos"
      />
      {errors.terminos && <p>{errors.terminos.message}</p>}

      <input
        type="text"
        {...register("tipo")}
        placeholder="Tipo"
      />
      {errors.tipo && <p>{errors.tipo.message}</p>}

      <input
        type="url"
        {...register("img")}
        placeholder="URL de la imagen"
      />
      {errors.img && <p>{errors.img.message}</p>}

      <textarea
        {...register("descripcion")}
        placeholder="Descripción"
      ></textarea>
      {errors.descripcion && <p>{errors.descripcion.message}</p>}

      <button type="submit">Guardar</button>
    </form>
  );
}

export default LicenciaForm;
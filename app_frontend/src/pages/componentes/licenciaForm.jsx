import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { saveOfertaLicencia, updateOfertaLicencia } from '../../hooks/ofertaLicencias';
import { getDataFromSession } from '../../utils/methods/session';

const schema = yup.object().shape({
  nombre_saas: yup.string().required('El nombre del SaaS es requerido'),
  terminos: yup.string().required('Los términos son requeridos'),
  img: yup.string().url('Debe ser una URL válida').required('La URL de la imagen es requerida'),
  descripcion: yup.string().required('La descripción es requerida'),
  usuario_id: yup.string().required(),
  duracion_cantidad: yup.number().required('Duración es requerida').positive().integer(),
  duracion_unidad: yup.string().oneOf(['dias', 'meses', 'años'], 'Unidad no válida').required('Unidad requerida'),
});

function LicenciaForm({ onGuardar = () => { }, licencia, isNew = true }) {
  // Si data_previa es proporcionada, se usa para inicializar el formulario
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre_saas: licencia?.nombre_saas || '',
      terminos: licencia?.terminos || '',
      img: licencia?.img || '',
      descripcion: licencia?.descripcion || '',
      duracion_cantidad: licencia?.duracion_cantidad || '',
      duracion_unidad: licencia?.duracion_unidad || '',
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
    <form className="formulario-dark" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        {/* Columna 1 */}
        <div className="form-column">
          <div className="form-group">
            <label>Nombre del SaaS</label>
            <input type="text" {...register("nombre_saas")} className="input-dark" placeholder="Nombre del SaaS" />
            {errors.nombre_saas && <p className="error">{errors.nombre_saas.message}</p>}
          </div>

          <div className="form-group">
            <label>URL de la Imagen</label>
            <input type="url" {...register("img")} className="input-dark" placeholder="https://ejemplo.com/imagen.jpg" />
            {errors.img && <p className="error">{errors.img.message}</p>}
          </div>
        </div>

        {/* Columna 2 */}
        <div className="form-column">
          <div className="form-group">
            <label>Descripción</label>
            <textarea {...register("descripcion")} className="input-dark textarea" placeholder="Descripción del SaaS..."></textarea>
            {errors.descripcion && <p className="error">{errors.descripcion.message}</p>}
          </div>

          <div className="form-group">
            <label>Duración</label>
            <input type="number" {...register("duracion_cantidad")} className="input-dark" placeholder="Ej: 30" min="1" />
            {errors.duracion_cantidad && <p className="error">{errors.duracion_cantidad.message}</p>}
          </div>

          <div className="form-group">
            <label>Unidad de duración</label>
            <select {...register("duracion_unidad")} className="select-dark">
              <option value="">Seleccione unidad</option>
              <option value="dias">Días</option>
              <option value="meses">Meses</option>
              <option value="años">Años</option>
            </select>
            {errors.duracion_unidad && <p className="error">{errors.duracion_unidad.message}</p>}
          </div>
        </div>
      </div>

      {/* Términos al final */}
      <div className="form-group full-width">
        <label>Términos</label>
        <textarea {...register("terminos")} className="input-dark textarea-lg" placeholder="Escribe los términos de la oferta aquí..."></textarea>
        {errors.terminos && <p className="error">{errors.terminos.message}</p>}
      </div>

      <button type="submit" className="btn-dark">Guardar</button>
    </form>
  );
}

export default LicenciaForm;
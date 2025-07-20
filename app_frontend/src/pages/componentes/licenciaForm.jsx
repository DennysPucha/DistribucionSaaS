import React, { useState, useEffect } from 'react';

function LicenciaForm({ onGuardar, licencia }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcionCorta: '',
    descripcionLarga: '',
    imagen: '',
    precio: '',
    duracion: '',
    disponible: true,
  });

  useEffect(() => {
    if (licencia) setForm(licencia);
  }, [licencia]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({ ...form, precio: parseFloat(form.precio) });
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>{form.id ? 'Editar' : 'Nueva'} Licencia</h2>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
      <input name="descripcionCorta" placeholder="Descripción corta" value={form.descripcionCorta} onChange={handleChange} required />
      <textarea name="descripcionLarga" placeholder="Descripción completa" value={form.descripcionLarga} onChange={handleChange} required />
      <input name="imagen" placeholder="URL de imagen" value={form.imagen} onChange={handleChange} required />
      <input name="precio" type="number" step="0.01" placeholder="Precio USD" value={form.precio} onChange={handleChange} required />
      <input name="duracion" type="number" placeholder="Duración (días)" value={form.duracion} onChange={handleChange} />
      <label>
        <input name="disponible" type="checkbox" checked={form.disponible} onChange={handleChange} />
        Disponible
      </label>
      <button type="submit">Guardar</button>
    </form>
  );
}

export default LicenciaForm;

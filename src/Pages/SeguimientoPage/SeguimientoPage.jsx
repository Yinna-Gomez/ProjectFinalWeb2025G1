import React, { useState } from 'react';
import './SeguimientoPage.css';

const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const SeguimientoPage = () => {
  const [descripcion, setDescripcion] = useState('');
  const [doc, setDoc] = useState(null);
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }
    setError('');
    // Aquí iría la lógica para enviar los datos
    alert('Avance registrado correctamente');
  };

  return (
    <div className="seguimiento-container">
      <form className="seguimiento-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="seguimiento-title">Registrar avances</h2>
        <div className="seguimiento-field">
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            value={getToday()}
            readOnly
            disabled
          />
        </div>
        <div className="seguimiento-field">
          <label htmlFor="descripcion">Descripción del avance <span className="req">*</span></label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={4}
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
            placeholder="Describe brevemente el avance realizado..."
          />
        </div>
        <div className="seguimiento-field">
          <label htmlFor="doc">Subir documentos</label>
          <input
            id="doc"
            name="doc"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={e => setDoc(e.target.files[0])}
          />
        </div>
        <div className="seguimiento-field">
          <label htmlFor="foto">Subir fotografías</label>
          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/*"
            onChange={e => setFoto(e.target.files[0])}
          />
        </div>
        {error && <div className="seguimiento-error">{error}</div>}
        <button type="submit" className="seguimiento-btn">Registrar avance</button>
      </form>
    </div>
  );
};

export default SeguimientoPage;

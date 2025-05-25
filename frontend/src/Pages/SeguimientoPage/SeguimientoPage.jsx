import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SeguimientoPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SeguimientoPage = () => {
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState('');
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener ID del proyecto de la URL
  const proyectoId = new URLSearchParams(location.search).get('id');

  // Cargar datos del proyecto
  useEffect(() => {
    const cargarProyecto = async () => {
      try {
        const token = localStorage.getItem('token');
        const correo = localStorage.getItem('correo')?.toLowerCase();
        const rol = localStorage.getItem('rol');

        const response = await fetch(`${API_URL}/api/proyectos/${proyectoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el proyecto');
        }
        
        const data = await response.json();

        // Verificar si el usuario tiene acceso al proyecto
        if (rol === 'integrante') {
          const esIntegrante = data.integrantes.some(i => i.correo?.toLowerCase() === correo);
          if (!esIntegrante) {
            setError('No tienes permiso para registrar avances en este proyecto');
            navigate('/visualiza');
            return;
          }
        }

        setProyecto(data);
      } catch (error) {
        setError('Error al cargar el proyecto');
        console.error(error);
      }
    };

    if (proyectoId) {
      cargarProyecto();
    } else {
      navigate('/visualiza');
    }
  }, [proyectoId, navigate]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('No puedes subir más de 5 archivos');
      e.target.value = '';
      return;
    }
    setArchivos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('descripcion', descripcion);
      formData.append('creadoPor', localStorage.getItem('usuario') || '');
      archivos.forEach(file => {
        formData.append('archivos', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/proyectos/${proyectoId}/avances`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al registrar el avance');
      }

      // Limpiar formulario
      setDescripcion('');
      setArchivos([]);
      setError('');
      
      // Mostrar mensaje de éxito
      alert('Avance registrado correctamente');
      
      // Recargar proyecto para mostrar el nuevo avance
      const proyectoActualizado = await fetch(`${API_URL}/api/proyectos/${proyectoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!proyectoActualizado.ok) {
        throw new Error('Error al recargar el proyecto');
      }

      const data = await proyectoActualizado.json();
      setProyecto(data);
    } catch (error) {
      setError('Error al registrar el avance: ' + error.message);
      console.error('Error completo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/visualiza');
  };

  if (!proyecto) {
    return (
      <div className="seguimiento-container">
        {error ? (
          <div className="seguimiento-error">{error}</div>
        ) : (
          'Cargando proyecto...'
        )}
      </div>
    );
  }

  return (
    <div className="seguimiento-container">
      <div className="seguimiento-content">
        <button 
          onClick={handleVolver}
          className="seguimiento-btn"
          style={{ marginBottom: '1rem', width: 'auto', padding: '8px 16px' }}
        >
          Volver
        </button>

        <div className="proyecto-info">
          <h2>{proyecto.titulo}</h2>
          <p><strong>Estado:</strong> {proyecto.estado}</p>
          <p><strong>Área:</strong> {proyecto.area}</p>
          <p><strong>Institución:</strong> {proyecto.institucion}</p>
        </div>

        <form className="seguimiento-form" onSubmit={handleSubmit} autoComplete="off">
          <h3 className="seguimiento-title">Registrar nuevo avance</h3>
          
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
            <label htmlFor="archivos">Subir archivos (máximo 5)</label>
            <input
              id="archivos"
              name="archivos"
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            />
            <small>Formatos permitidos: PDF, DOC, DOCX, JPG, PNG, GIF</small>
          </div>

          {error && <div className="seguimiento-error">{error}</div>}
          
          <button 
            type="submit" 
            className="seguimiento-btn" 
            disabled={loading}
          >
            {loading ? 'Registrando avance...' : 'Registrar avance'}
          </button>
        </form>

        <div className="avances-previos">
          <h3>Avances registrados</h3>
          {proyecto.avances && proyecto.avances.length > 0 ? (
            <div className="avances-lista">
              {proyecto.avances.map((avance, index) => (
                <div key={index} className="avance-item">
                  <div className="avance-header">
                    <span className="avance-fecha">
                      {new Date(avance.fecha).toLocaleDateString()}
                    </span>
                    <span className="avance-autor">{avance.creadoPor}</span>
                  </div>
                  <p className="avance-descripcion">{avance.descripcion}</p>
                  {avance.archivos && avance.archivos.length > 0 && (
                    <div className="avance-archivos">
                      <h4>Archivos adjuntos:</h4>
                      <div className="archivos-lista">
                        {avance.archivos.map((archivo, idx) => (
                          <a
                            key={idx}
                            href={archivo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="archivo-link"
                          >
                            {archivo.nombre}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-avances">No hay avances registrados aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeguimientoPage;

/**
 * @fileoverview Página principal de visualización de proyectos
 * @requires react
 * @requires @mui/material
 * @requires react-router-dom
 */

import React, { useState, useContext, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { AuthContext } from '../../Components/AuthContext';
import GestionUsuarios from './GestionUsuarios';
import { useNavigate } from 'react-router-dom';
import './VisualizaPage.css';

const ESTADOS = [
  'formulacion',
  'evaluacion',
  'activo',
  'inactivo',
  'finalizado'
];

// Constante para la URL del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Componente principal de visualización de proyectos
 * @returns {JSX.Element} Componente VisualizaPage
 */
function VisualizaPage() {
  const [tab, setTab] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const { rol, usuario, correo } = useContext(AuthContext);
  const [proyectos, setProyectos] = useState([]);
  const [estadosProyectos, setEstadosProyectos] = useState({});
  const navigate = useNavigate();
  const [loadingGuardar, setLoadingGuardar] = useState({});
  const [error, setError] = useState('');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  /**
   * Función para renovar el token de acceso
   * @returns {Promise<string>} Nuevo token de acceso
   */
  const renovarToken = async () => {
    try {
      const res = await fetch(`${API_URL}/api/refresh`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken })
      });
      if (!res.ok) throw new Error('Error renovando token');
      const data = await res.json();
      localStorage.setItem('token', data.accessToken);
      return data.accessToken;
    } catch (err) {
      console.error('Error renovando token:', err);
      navigate('/');
      return null;
    }
  };

  /**
   * Función para hacer peticiones con manejo de token expirado
   * @param {string} url - URL de la petición
   * @param {Object} options - Opciones de la petición
   * @returns {Promise<Response>} Respuesta de la petición
   */
  const fetchConToken = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return null;
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    try {
      let res = await fetch(url, { 
        ...options, 
        headers,
        credentials: 'include'
      });
      
      if (res.status === 401) {
        // Token expirado, intentar renovar
        token = await renovarToken();
        if (!token) return null;
        
        headers['Authorization'] = `Bearer ${token}`;
        res = await fetch(url, { ...options, headers, credentials: 'include' });
      }
      
      return res;
    } catch (err) {
      console.error('Error en la petición:', err);
      return null;
    }
  };

  // Redirección si no hay sesión iniciada
  useEffect(() => {
    if (!rol || rol === 'null' || rol === '') {
      navigate('/');
    }
  }, [rol, navigate]);

  // Redirección si es estudiante y carga de proyectos
  useEffect(() => {
    if (rol === 'integrante' && proyectos.length > 0) {
      console.log('Buscando proyectos para estudiante:', correo);
      const misProyectos = proyectos.filter(p => 
        p.integrantes && p.integrantes.some(i => 
          i.correo?.toLowerCase() === correo?.toLowerCase()
        )
      );
      
      if (misProyectos.length === 0) {
        console.log('No se encontraron proyectos para el estudiante');
        setError('No tienes ningún proyecto asignado. Por favor, contacta a tu docente.');
      } else {
        setError('');
      }
    }
  }, [proyectos, rol, correo]);

  // Fetch proyectos desde backend
  useEffect(() => {
    const cargarProyectos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const res = await fetch(`${API_URL}/api/proyectos`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (!res.ok) {
          throw new Error('Error al cargar los proyectos');
        }
        
        const data = await res.json();
        setProyectos(data);

        // Verificar proyectos para estudiantes
        if (rol === 'integrante') {
          const misProyectos = data.filter(p => 
            p.integrantes && p.integrantes.some(i => i.correo?.toLowerCase() === correo?.toLowerCase())
          );
          
          if (misProyectos.length === 0) {
            setError('No tienes ningún proyecto asignado. Por favor, contacta a tu docente.');
          } else {
            setError('');
          }
        }

        const estados = {};
        data.forEach(p => {
          estados[p._id] = { estado: p.estado || '', observacion: '' };
        });
        setEstadosProyectos(estados);
      } catch (err) {
        console.error('Error cargando proyectos:', err);
        setError('Error al cargar los proyectos. Por favor, intenta de nuevo más tarde.');
      }
    };

    cargarProyectos();
  }, [rol, navigate, correo]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Abrir detalle de proyecto
  const handleProyectoClick = (proyecto) => {
    setProyectoSeleccionado(proyecto);
  };

  const handleEstadoChange = (id, nuevoEstado) => {
    setEstadosProyectos(prev => ({
      ...prev,
      [id]: { ...prev[id], estado: nuevoEstado }
    }));
  };
  const handleObsChange = (id, obs) => {
    setEstadosProyectos(prev => ({
      ...prev,
      [id]: { ...prev[id], observacion: obs }
    }));
  };

  /**
   * Maneja el cambio de estado de un proyecto
   * @param {Object} proy - Proyecto a actualizar
   */
  const handleGuardarEstado = async (proy) => {
    const nuevoEstado = estadosProyectos[proy._id]?.estado || proy.estado || 'formulacion';
    const observacion = estadosProyectos[proy._id]?.observacion || '';
    
    if (!observacion.trim()) {
      setError('La observación es obligatoria para cambiar el estado.');
      return;
    }
    if ((proy.estado || 'formulacion') === nuevoEstado) {
      setError('Este estado ya está guardado.');
      return;
    }

    setLoadingGuardar(prev => ({ ...prev, [proy._id]: true }));
    try {
      const res = await fetchConToken(
        `${API_URL}/api/proyectos/${proy._id}/estado`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: nuevoEstado, observacion })
        }
      );

      if (!res) return;

      if (res.ok) {
        setMensaje('¡Estado actualizado exitosamente!');
        const data = await fetchConToken(`${API_URL}/api/proyectos`);
        if (data) {
          const proyectos = await data.json();
          setProyectos(proyectos);
        }
      } else {
        const errorData = await res.json();
        setError(errorData.mensaje || errorData.error || 'No se pudo actualizar el estado en la base de datos.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoadingGuardar(prev => ({ ...prev, [proy._id]: false }));
    }
  };

  // Renderiza la lista de proyectos
  const renderProyectos = (proyectosMostrar) => {
    if (!proyectosMostrar || proyectosMostrar.length === 0) {
      return (
        <div style={{ color: 'var(--color-muted)', textAlign: 'center', margin: '2rem 0' }}>
          No hay proyectos para mostrar.
        </div>
      );
    }

    return (
      <div className="visualiza-proyectos-grid">
        {proyectosMostrar.map(proy => {
          const estadoActual = (proy.estado || '').toLowerCase();
          const idxActual = ESTADOS.indexOf(estadoActual);
          if (rol === 'coordinador') {
            return (
              <div key={proy._id} className="proyecto-item">
                <div
                  className="proyecto-header"
                  onClick={() => navigate(`/detailproject/${proy._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{proy.titulo}</h3>
                  <p><strong>Área:</strong> {proy.area}</p>
                  <p><strong>Institución:</strong> {proy.institucion}</p>
                  <div className={`estado ${estadoActual}`}>{estadoActual}</div>
                </div>
                {/* Controles de estado para coordinador */}
                <div className="proyecto-controls">
                  <select
                    className="estado-select"
                    value={estadoActual}
                    onChange={e => handleEstadoChange(proy._id, e.target.value)}
                  >
                    {ESTADOS.map((op, idx) => (
                      <option key={op} value={op} disabled={idx > idxActual + 1 || idx < idxActual}>
                        {op.charAt(0).toUpperCase() + op.slice(1)}
                      </option>
                    ))}
                  </select>
                  <textarea
                    className="estado-observacion"
                    placeholder="Observación del cambio de estado"
                    value={estadosProyectos[proy._id]?.observacion || ''}
                    onChange={e => handleObsChange(proy._id, e.target.value)}
                  />
                  <button
                    className="btn-guardar-estado"
                    disabled={loadingGuardar[proy._id]}
                    onClick={() => handleGuardarEstado(proy)}
                  >
                    {loadingGuardar[proy._id] ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            );
          } else {
            // Para docente y estudiante: el recuadro completo es clickeable
            return (
              <div
                key={proy._id}
                className="proyecto-item"
                onClick={() => navigate(`/detailproject/${proy._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{proy.titulo}</h3>
                <p><strong>Área:</strong> {proy.area}</p>
                <p><strong>Institución:</strong> {proy.institucion}</p>
                <div className={`estado ${estadoActual}`}>{estadoActual}</div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Filtrado por búsqueda y rol
  const proyectosFiltrados = proyectos.filter(p => {
    const matchBusqueda = (p.titulo && p.titulo.toLowerCase().includes(busqueda.toLowerCase())) ||
                         (p.institucion && p.institucion.toLowerCase().includes(busqueda.toLowerCase()));
    
    if (rol === 'integrante') {
      return matchBusqueda && p.integrantes && p.integrantes.some(i => 
        i.correo?.toLowerCase() === correo?.toLowerCase()
      );
    }
    
    return matchBusqueda;
  });

  // Para docente: separar mis proyectos y otros proyectos
  let misProyectos = [];
  let otrosProyectos = [];
  if (rol === 'docente') {
    misProyectos = proyectosFiltrados.filter(p => p.creadoPor === usuario);
    otrosProyectos = proyectosFiltrados.filter(p => p.creadoPor !== usuario);
  }

  return (
    <div className="visualiza-panel-container visualiza-panel-wide visualiza-panel-flex">
      <div className="visualiza-panel visualiza-panel-main">
        <div className="visualiza-header-row">
          <div className="visualiza-buscador">
            <input
              type="text"
              placeholder="Buscar proyecto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="visualiza-input-busqueda"
            />
          </div>
          {/* Botón Crear Proyecto solo para docentes */}
          {rol === 'docente' && (
            <button
              className="visualiza-btn"
              style={{ marginBottom: 16, marginLeft: 8 }}
              onClick={() => navigate('/createproject')}
            >
              Crear Proyecto
            </button>
          )}
        </div>

        {mensaje && (
          <div style={{ color: 'var(--color-accent)', textAlign: 'center', fontWeight: 600, margin: '1rem 0' }}>{mensaje}</div>
        )}
        {error && (
          <div className="visualiza-error" style={{ textAlign: 'center', color: 'var(--color-error)', margin: '1rem 0' }}>{error}</div>
        )}

        {rol === 'coordinador' ? (
          // Lista general para coordinador
          <div className="visualiza-tab-content">
            {renderProyectos(proyectosFiltrados)}
          </div>
        ) : rol === 'integrante' ? (
          // Solo mis proyectos para estudiantes
          <div className="visualiza-tab-content">
            {renderProyectos(proyectosFiltrados)}
          </div>
        ) : (
          // Tabs para docentes
          <>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              className="visualiza-tabs"
              variant="fullWidth"
            >
              <Tab label="Mis proyectos" />
              <Tab label="Otros proyectos" />
            </Tabs>
            <div className="visualiza-tab-content">
              {tab === 0 && renderProyectos(misProyectos)}
              {tab === 1 && renderProyectos(otrosProyectos)}
            </div>
          </>
        )}

        {proyectoSeleccionado && (
          <div className="visualiza-proyecto-detalle">
            <h2>{proyectoSeleccionado.titulo}</h2>
            <p><strong>Área:</strong> {proyectoSeleccionado.area}</p>
            <p><strong>Objetivos:</strong> {proyectoSeleccionado.objetivos}</p>
            <p><strong>Presupuesto:</strong> {proyectoSeleccionado.presupuesto}</p>
            <p><strong>Institución:</strong> {proyectoSeleccionado.institucion}</p>
            <p><strong>Estado actual:</strong> <span className={`estado ${proyectoSeleccionado.estado}`}>{proyectoSeleccionado.estado}</span></p>
            
            {/* Historial de estados */}
            <div className="historial-estados">
              <h3>Historial de Estados</h3>
              <div className="historial-lista">
                {proyectoSeleccionado.historialestado && proyectoSeleccionado.historialestado.map((historial, index) => (
                  <div key={index} className="historial-item">
                    <div className="historial-fecha">{new Date(historial.fecha).toLocaleDateString()}</div>
                    <div className={`historial-estado ${historial.estado}`}>{historial.estado}</div>
                    {historial.observacion && (
                      <div className="historial-observacion">{historial.observacion}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resto del detalle del proyecto */}
          </div>
        )}
      </div>
      
      {/* Panel lateral solo para coordinador */}
      {rol === 'coordinador' && (
        <div style={{ marginTop: '2rem', width: '100%' }}>
          <GestionUsuarios />
        </div>
      )}
    </div>
  );
}

export default VisualizaPage;

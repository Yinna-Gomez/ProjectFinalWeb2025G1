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
  const { rol, usuario, refreshToken } = useContext(AuthContext);
  const [proyectos, setProyectos] = useState([]);
  const [estadosProyectos, setEstadosProyectos] = useState({});
  const navigate = useNavigate();
  const [loadingGuardar, setLoadingGuardar] = useState({});

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
      navigate('/login');
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
      navigate('/login');
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
      navigate('/login');
    }
  }, [rol, navigate]);

  // Fetch proyectos desde backend
  useEffect(() => {
    const cargarProyectos = async () => {
      try {
        const res = await fetchConToken(`${API_URL}/api/proyectos`);
        if (!res) return;
        
        const data = await res.json();
        setProyectos(data);
        const estados = {};
        data.forEach(p => {
          estados[p._id] = { estado: p.estado || '', observacion: '' };
        });
        setEstadosProyectos(estados);
      } catch (err) {
        console.error('Error cargando proyectos:', err);
      }
    };

    cargarProyectos();
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Abrir detalle de proyecto
  const handleProyectoClick = (proyecto) => {
    navigate(`/detailproject?id=${proyecto._id}`);
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
      alert('La observación es obligatoria para cambiar el estado.');
      return;
    }
    if ((proy.estado || 'formulacion') === nuevoEstado) {
      alert('Este estado ya está guardado.');
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
        alert('¡Estado actualizado exitosamente!');
        const data = await fetchConToken(`${API_URL}/api/proyectos`);
        if (data) {
          const proyectos = await data.json();
          setProyectos(proyectos);
        }
      } else {
        alert('No se pudo actualizar el estado en la base de datos.');
      }
    } catch (err) {
      alert('Error de conexión con el servidor.');
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
          // Estado actual
          const estadoActual = estadosProyectos[proy._id]?.estado || proy.estado || 'Activo';
          const idxActual = ESTADOS.indexOf(estadoActual);
          return (
            <div key={proy._id} className="visualiza-proyecto-card">
              <div className="visualiza-proyecto-header">
                <span className="visualiza-proyecto-titulo" onClick={() => handleProyectoClick(proy)}>
                  {proy.titulo || <span style={{ color: 'var(--color-muted)' }}>[Sin título]</span>}
                </span>
                <span className={`visualiza-estado-label visualiza-estado-${estadoActual.toLowerCase()}`}>{estadoActual}</span>
              </div>
              {/* Solo el coordinador puede cambiar el estado y observación */}
              {rol === 'coordinador' && (
                <div className="visualiza-estado-form-row visualiza-estado-form-row-inline">
                  <select
                    className="visualiza-select-estado"
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
                    className="visualiza-textarea-observacion"
                    placeholder="Observación del cambio de estado"
                    value={estadosProyectos[proy._id]?.observacion || ''}
                    onChange={e => handleObsChange(proy._id, e.target.value)}
                  />
                  <button
                    className="visualiza-btn visualiza-btn-admin visualiza-btn-guardar-estado"
                    style={{ opacity: loadingGuardar[proy._id] ? 0.6 : 1, pointerEvents: loadingGuardar[proy._id] ? 'none' : 'auto' }}
                    disabled={loadingGuardar[proy._id]}
                    onClick={() => handleGuardarEstado(proy)}
                  >
                    {loadingGuardar[proy._id] ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Filtrado por búsqueda (nombre de proyecto)
  const proyectosFiltrados = proyectos.filter(p =>
    p.titulo && p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Filtrado para docente: mis proyectos y otros proyectos
  let misProyectos = [];
  let otrosProyectos = [];
  if (rol === 'docente') {
    misProyectos = proyectosFiltrados.filter(p => p.creadoPor === usuario);
    otrosProyectos = proyectosFiltrados.filter(p => p.creadoPor !== usuario);
  }

  // Para el coordinador, mostrar una sola lista general
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
        {rol === 'coordinador' ? (
          // Solo una lista general para coordinador
          <div className="visualiza-tab-content">
            {renderProyectos(proyectosFiltrados)}
          </div>
        ) : (
          // Tabs para otros roles
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
              {tab === 0 && (
                <>
                  {renderProyectos(misProyectos)}
                  <div className="visualiza-acciones">
                    <button className="visualiza-btn">Registrar avance</button>
                    <button className="visualiza-btn">Generar reportes</button>
                  </div>
                </>
              )}
              {tab === 1 && renderProyectos(otrosProyectos)}
            </div>
          </>
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
